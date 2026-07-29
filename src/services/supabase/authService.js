import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Register a new user with Supabase Auth and save custom user details to 'users' table
 */
export const signUpUser = async ({ name, email, phone, password }) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase URL and Anon Key are not configured in environment variables.');
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;

  // 1. Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        phone: phone,
        avatar_url: avatarUrl,
      },
    },
  });

  if (error) throw error;

  // 2. Insert into 'users' table
  if (data?.user) {
    try {
      await supabase.from('users').upsert({
        id: data.user.id,
        name,
        email,
        phone,
        created_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn('Syncing user to users table failed:', dbErr.message);
    }
  }

  return data;
};

/**
 * Sign in existing user with email & password
 */
export const signInUser = async ({ email, password }) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase URL and Anon Key are not configured in environment variables.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * Sign out current authenticated user
 */
export const signOutUser = async () => {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Retrieve current session
 */
export const getSession = async () => {
  if (!isSupabaseConfigured()) return null;
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

/**
 * Retrieve current logged in user details
 */
export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

/**
 * Update user metadata & users table
 */
export const updateUserProfile = async (userId, profileData) => {
  if (!isSupabaseConfigured()) return null;

  // Update Auth metadata
  const { data, error } = await supabase.auth.updateUser({
    data: profileData,
  });

  if (error) throw error;

  // Update custom 'users' table
  if (userId) {
    try {
      await supabase.from('users').upsert({
        id: userId,
        name: profileData.full_name || profileData.name,
        phone: profileData.phone,
        email: data.user?.email,
      });
    } catch (dbErr) {
      console.warn('Syncing to users table failed:', dbErr.message);
    }
  }

  return data.user;
};
