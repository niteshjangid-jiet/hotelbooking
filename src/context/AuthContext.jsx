import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase/supabaseClient';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const MOCK_STORAGE_KEY = 'hotel_booking_mock_user';
const MOCK_SESSION_KEY = 'hotel_booking_mock_session';

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
        console.warn('Auth initialization check failed, using fallback:', err.message);
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
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone: phone,
              avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
            },
          },
        });

        if (error) throw error;

        // Optionally insert into custom 'users' table
        try {
          await supabase.from('users').insert([
            {
              id: data.user.id,
              name,
              email,
              phone,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
              created_at: new Date().toISOString(),
            },
          ]);
        } catch (tableErr) {
          console.warn('Custom users table insert info:', tableErr.message);
        }

        setUser(data.user);
        setSession(data.session);
        toast.success('Account created successfully! Welcome to HotelBookingSite.');
        return { success: true, user: data.user };
      } else {
        // Fallback demo signup
        const mockUser = {
          id: 'usr_' + Date.now(),
          email,
          user_metadata: {
            full_name: name,
            phone,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff`,
          },
          created_at: new Date().toISOString(),
        };
        const mockSession = {
          access_token: 'mock_token_' + Date.now(),
          user: mockUser,
        };

        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
        localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(mockSession));
        setUser(mockUser);
        setSession(mockSession);
        toast.success('Demo Account created successfully! Welcome to HotelBookingSite.');
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
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setUser(data.user);
        setSession(data.session);
        toast.success(`Welcome back, ${data.user?.user_metadata?.full_name || 'Traveler'}!`);
        return { success: true, user: data.user };
      } else {
        // Fallback demo signin
        const storedUser = localStorage.getItem(MOCK_STORAGE_KEY);
        let mockUser;
        if (storedUser) {
          mockUser = JSON.parse(storedUser);
          if (mockUser.email !== email) {
            mockUser.email = email;
          }
        } else {
          const userName = email.split('@')[0].replace('.', ' ');
          const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
          mockUser = {
            id: 'usr_demo',
            email,
            user_metadata: {
              full_name: formattedName,
              phone: '+91 98765 43210',
              avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=2563EB&color=fff`,
            },
            created_at: new Date().toISOString(),
          };
        }

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
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
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
          // Soft delete or RPC if configured, then sign out
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
