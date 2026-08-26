import { createClient } from '@supabase/supabase-js';

// Official Supabase Credentials for THCS Đồng Tân Portal (Active Project: miufsostxxqeoeljwzmi)
const SUPABASE_URL = 'https://miufsostxxqeoeljwzmi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdWZzb3N0eHhxZW9lbGp3em1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjIzNTkzNSwiZXhwIjoyMTAxODExOTM1fQ.yMfSewDbAWHvzufsmdBiq10zkQ_XtS72G73jwrdMgeE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const isSupabaseConfigured = () => true;

// Upload File directly to Supabase Storage via REST API for 100% cross-device compatibility
export const uploadFileToSupabase = async (file, bucket = 'uploads') => {
  if (!file) return null;
  try {
    const fileExt = file.name ? file.name.split('.').pop() : 'png';
    const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${fileName}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': file.type || 'image/png',
        'x-upsert': 'true'
      },
      body: file
    });

    if (response.ok || response.status === 200) {
      return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
    }
    return null;
  } catch (err) {
    console.error('Lỗi upload file Supabase Storage:', err);
    return null;
  }
};

// Convert Base64 image to Blob and upload directly to Supabase Storage via REST API
export const uploadBase64ToSupabase = async (base64Str, bucket = 'uploads') => {
  if (!base64Str || typeof base64Str !== 'string' || !base64Str.startsWith('data:image/')) {
    return base64Str;
  }
  try {
    const mimeMatch = base64Str.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const fileExt = mimeType.split('/')[1] || 'png';
    const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, '');

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const fileName = `img_b64_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${fileName}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': mimeType,
        'x-upsert': 'true'
      },
      body: blob
    });

    if (response.ok || response.status === 200) {
      return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
    }
    return null;
  } catch (err) {
    console.error('Lỗi upload Base64 Supabase Storage:', err);
    return null;
  }
};

// Save site_config row 1 directly to Supabase PostgREST Cloud API using active Service Role Key
export const saveSiteConfigToSupabase = async (newConfig, bghPayload) => {
  try {
    const cleanSlogan = (newConfig.slogan || '').split('|||BGH_JSON:')[0];
    const packedSlogan = cleanSlogan + '|||BGH_JSON:' + JSON.stringify(bghPayload);

    const cleanLogoUrl = (newConfig.logoUrl || '/images/school-logo.jpg').split('|||BGH_JSON:')[0];
    const packedLogoUrl = cleanLogoUrl + '|||BGH_JSON:' + JSON.stringify(bghPayload);

    const response = await fetch(`${SUPABASE_URL}/rest/v1/site_config`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: 1,
        school_name: newConfig.schoolName,
        governing_body: newConfig.governingBody || 'ỦY BAN NHÂN DÂN XÃ HỮU LŨNG - TỈNH LẠNG SƠN',
        slogan: packedSlogan,
        address: newConfig.address,
        phone: newConfig.phone,
        email: newConfig.email,
        logo_url: packedLogoUrl,
        banner_bg: newConfig.bannerBg || newConfig.bannerUrl || '/images/school-banner.png',
        updated_at: new Date().toISOString()
      })
    });

    return response.ok || response.status === 200 || response.status === 201 || response.status === 204;
  } catch (err) {
    console.error('Lỗi saveSiteConfigToSupabase:', err);
    return false;
  }
};
