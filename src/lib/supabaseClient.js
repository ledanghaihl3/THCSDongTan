import { createClient } from '@supabase/supabase-js';

// Official Supabase Credentials for THCS Đồng Tân Portal
// Official Supabase Credentials for THCS Đồng Tân Portal (Active Storage Bucket: uploads)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://miufsostxxqeoeljwzmi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdWZzb3N0eHhxZW9lbGp3em1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjIzNTkzNSwiZXhwIjoyMTAxODExOTM1fQ.yMfSewDbAWHvzufsmdBiq10zkQ_XtS72G73jwrdMgeE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);

export const uploadFileToSupabase = async (file, bucket = 'uploads') => {
  if (!supabase || !file) return null;
  try {
    const fileExt = file.name ? file.name.split('.').pop() : 'png';
    const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      upsert: true,
      cacheControl: '3600'
    });
    if (error) {
      console.error('Supabase Upload Error:', error);
      return null;
    }
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error('Lỗi upload file Supabase Storage:', err);
    return null;
  }
};


