import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Upload an image file to a specified Supabase Storage bucket
 * 
 * @param {string} bucketName - 'hotel-images' | 'room-images' | 'avatars'
 * @param {string} filePath - Path within the bucket, e.g. 'hotels/hotel-1.jpg'
 * @param {File|Blob} file - The file object to upload
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export const uploadImageToStorage = async (bucketName, filePath, file) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }

  // 1. Upload file
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error(`Error uploading image to bucket ${bucketName}:`, error);
    throw error;
  }

  // 2. Retrieve Public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};

/**
 * Get the public URL for an asset in a bucket
 */
export const getPublicStorageUrl = (bucketName, filePath) => {
  if (!isSupabaseConfigured() || !filePath) return null;
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data?.publicUrl || null;
};
