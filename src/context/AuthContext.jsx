import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase/supabaseClient';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const MOCK_USERS_DB_KEY = 'hotel_booking_registered_users';
const MOCK_STORAGE_KEY = 'hotel_booking_mock_user';
const MOCK_SESSION_KEY = 'hotel_booking_mock_session';

// Seed default demo user for fallback mode if no users exist
const DEFAULT_DEMO_USER = {
  id: 'usr_demo_1',
  email: 'demo@hotelbooking.com',
  password: 'Password123!',
  user_metadata: {
    full_name: 'Demo Traveler',
    phone: '+91 98765 43210',
    avatar_url: 'https://ui-avatars.com/api/?name=Demo+Traveler&background=2563EB&color=fff',
  },
  created_at: new Date().toISOString(),
};

const getStoredMockUsers = () => {
  try {
    const raw = localStorage.getItem(MOCK_USERS_DB_KEY);
    if (!raw) {
      const initialList = [DEFAULT_DEMO_USER];
      localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(initialList));
      return initialList;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initialList = [DEFAULT_DEMO_USER];
      localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(initialList));
      return initialList;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading mock users database:', err);
    return [DEFAULT_DEMO_USER];
  }
};

const saveMockUserToDb = (newUser) => {
  try {
    const users = getStoredMockUsers();
    users.push(newUser);
    localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving mock user to storage:', err);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        if (isSupabaseConfigured()) {
          const { data: { session: currentSession }, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          if (currentSession) {
            setSession(currentSession);
            setUser(currentSession.user);
          }
        } else {
          // Demo / Fallback local storage check
          const storedUser = localStorage.getItem(MOCK_STORAGE_KEY);
          const storedSession = localStorage.getItem(MOCK_SESSION_KEY);
          if (storedUser && storedSession) {
            setUser(JSON.parse(storedUser));
            setSession(JSON.parse(storedSession));
          }
        }
      } catch (err) {
        console.warn('Auth initialization check failed:', err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Listen for Supabase auth state changes if configured
    let subscription = null;
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      });
      subscription = data?.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // REGISTER / SIGNUP
  const signUp = async ({ name, email, phone, password }) => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: name,
              phone: phone,
              avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
            },
          },
        });

        if (error) {
          throw new Error(error.message || 'Failed to create account in Supabase.');
        }

        // Insert into custom 'users' table
        if (data?.user) {
          try {
            await supabase.from('users').upsert({
              id: data.user.id,
              name,
              email: cleanEmail,
              phone,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
              created_at: new Date().toISOString(),
            });
          } catch (tableErr) {
            console.warn('Custom users table insert info:', tableErr.message);
          }
        }

        if (data.session) {
          setUser(data.user);
          setSession(data.session);
          toast.success('Account created successfully! Welcome to HotelBookingSite.');
          return { success: true, user: data.user };
        } else {
          toast.success('Account created! Please check your email to confirm your registration.');
          return { success: true, user: data.user, requiresVerification: true };
        }
      } else {
        // Fallback demo signup with strict email uniqueness check & password storage
        const usersList = getStoredMockUsers();
        const existingUser = usersList.find((u) => u.email.toLowerCase() === cleanEmail);

        if (existingUser) {
          throw new Error('An account with this email address already exists. Please sign in instead.');
        }

        const newUserRecord = {
          id: 'usr_' + Date.now(),
          email: cleanEmail,
          password: password, // Store password in mock storage for verification
          user_metadata: {
            full_name: name,
            phone,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff`,
          },
          created_at: new Date().toISOString(),
        };

        saveMockUserToDb(newUserRecord);

        const mockUser = {
          id: newUserRecord.id,
          email: newUserRecord.email,
          user_metadata: newUserRecord.user_metadata,
          created_at: newUserRecord.created_at,
        };

        const mockSession = {
          access_token: 'mock_token_' + Date.now(),
          user: mockUser,
        };

        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
        localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(mockSession));
        setUser(mockUser);
        setSession(mockSession);
        toast.success('Account created successfully! Welcome to HotelBookingSite.');
        return { success: true, user: mockUser };
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create account.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // LOGIN / SIGN IN
  const signIn = async ({ email, password, rememberMe = true }) => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          console.error('Supabase auth error:', error);
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please check your credentials and try again.');
          }
          throw new Error(error.message || 'Invalid email or password.');
        }

        if (!data.user) {
          throw new Error('Authentication failed. No user found.');
        }

        setUser(data.user);
        setSession(data.session);
        toast.success(`Welcome back, ${data.user?.user_metadata?.full_name || 'Traveler'}!`);
        return { success: true, user: data.user };
      } else {
        // Fallback demo signin with strict credential verification
        const usersList = getStoredMockUsers();
        const foundUser = usersList.find((u) => u.email.toLowerCase() === cleanEmail);

        if (!foundUser) {
          throw new Error('No user account found with this email. Please check your email or create a new account.');
        }

        if (foundUser.password !== password) {
          throw new Error('Invalid password. Please check your password and try again.');
        }

        const mockUser = {
          id: foundUser.id,
          email: foundUser.email,
          user_metadata: foundUser.user_metadata,
          created_at: foundUser.created_at,
        };

        const mockSession = { access_token: 'mock_token_' + Date.now(), user: mockUser };
        if (rememberMe) {
          localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
          localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(mockSession));
        }
        setUser(mockUser);
        setSession(mockSession);
        toast.success(`Welcome back, ${mockUser.user_metadata?.full_name || 'Traveler'}!`);
        return { success: true, user: mockUser };
      }
    } catch (error) {
      toast.error(error.message || 'Invalid email or password.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD
  const forgotPassword = async (email) => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
      }
      toast.success('Password reset link has been sent to your email address!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Failed to send password reset email.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
  const resetPassword = async (newPassword) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      } else if (user?.email) {
        // Update password in mock database
        const users = getStoredMockUsers();
        const idx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
        if (idx !== -1) {
          users[idx].password = newPassword;
          localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(users));
        }
      }
      toast.success('Your password has been updated successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Failed to update password.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE PROFILE (Name, Phone, Address, Bio, etc.)
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.updateUser({
          data: {
            ...user?.user_metadata,
            ...profileData,
          },
        });

        if (error) throw error;

        // Try updating custom 'users' table if present
        try {
          await supabase.from('users').upsert({
            id: user.id,
            name: profileData.full_name || user.user_metadata?.full_name,
            phone: profileData.phone || user.user_metadata?.phone,
            address: profileData.address || user.user_metadata?.address,
            updated_at: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn('Custom users table update skipped:', dbErr.message);
        }

        setUser(data.user);
        toast.success('Profile details updated successfully!');
        return { success: true, user: data.user };
      } else {
        // Fallback demo update
        const updatedUser = {
          ...user,
          user_metadata: {
            ...user.user_metadata,
            ...profileData,
          },
        };
        const updatedSession = {
          ...session,
          user: updatedUser,
        };

        // Update in mock user DB as well
        const users = getStoredMockUsers();
        const idx = users.findIndex((u) => u.id === user.id || u.email === user.email);
        if (idx !== -1) {
          users[idx].user_metadata = updatedUser.user_metadata;
          localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(users));
        }

        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(updatedUser));
        localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(updatedSession));
        setUser(updatedUser);
        setSession(updatedSession);
        toast.success('Profile details updated successfully!');
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // UPLOAD & UPDATE AVATAR
  const updateAvatar = async (fileOrUrl) => {
    setLoading(true);
    try {
      let avatarUrl = typeof fileOrUrl === 'string' ? fileOrUrl : null;

      // Handle file upload if a File object is provided
      if (fileOrUrl && typeof fileOrUrl === 'object') {
        if (isSupabaseConfigured()) {
          try {
            const fileExt = fileOrUrl.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(filePath, fileOrUrl, { upsert: true });

            if (!uploadError) {
              const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

              avatarUrl = publicUrlData.publicUrl;
            } else {
              console.warn('Supabase storage upload error, converting to base64 fallback:', uploadError.message);
            }
          } catch (storageErr) {
            console.warn('Storage bucket not configured, falling back to base64 reader:', storageErr.message);
          }
        }

        // Base64 fallback if storage failed or not configured
        if (!avatarUrl) {
          avatarUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(fileOrUrl);
          });
        }
      }

      if (!avatarUrl) throw new Error('No valid image provided');

      return await updateProfile({ avatar_url: avatarUrl });
    } catch (error) {
      toast.error(error.message || 'Failed to update avatar image.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // CHANGE PASSWORD
  const changePassword = async (newPassword) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      } else if (user?.email) {
        // Update password in mock users DB
        const users = getStoredMockUsers();
        const idx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
        if (idx !== -1) {
          users[idx].password = newPassword;
          localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(users));
        }
      }
      toast.success('Your password has been changed successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Failed to change password.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // DELETE ACCOUNT
  const deleteAccount = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.warn('Supabase auth signout error during delete:', e);
        }
      }
      localStorage.removeItem(MOCK_STORAGE_KEY);
      localStorage.removeItem(MOCK_SESSION_KEY);
      setUser(null);
      setSession(null);
      toast.success('Your account has been deleted permanently.');
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete account.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const signOut = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem(MOCK_STORAGE_KEY);
      localStorage.removeItem(MOCK_SESSION_KEY);
      setUser(null);
      setSession(null);
      toast.success('You have logged out successfully.');
    } catch (error) {
      toast.error('Error logging out.');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    isSupabaseMode: isSupabaseConfigured(),
    signUp,
    signIn,
    forgotPassword,
    resetPassword,
    updateProfile,
    updateAvatar,
    changePassword,
    deleteAccount,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

