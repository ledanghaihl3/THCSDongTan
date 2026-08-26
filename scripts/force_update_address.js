const supabaseUrl = 'https://miufsostxxqeoeljwzmi.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdWZzb3N0eHhxZW9lbGp3em1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjIzNTkzNSwiZXhwIjoyMTAxODExOTM1fQ.yMfSewDbAWHvzufsmdBiq10zkQ_XtS72G73jwrdMgeE';

const headers = {
  'apikey': serviceKey,
  'Authorization': `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

async function forceUpdateAddress() {
  console.log("📡 Đang cập nhật địa chỉ chính thức Thôn Ngọc Thành, xã Hữu Lũng, tỉnh Lạng Sơn lên Supabase Cloud...");
  const targetAddress = 'Thôn Ngọc Thành, xã Hữu Lũng, tỉnh Lạng Sơn';

  try {
    // 1. Cập nhật row id=1
    const res1 = await fetch(`${supabaseUrl}/rest/v1/site_config?id=eq.1`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        address: targetAddress,
        updated_at: new Date().toISOString()
      })
    });
    console.log("Cập nhật row 1 HTTP status:", res1.status);

    // 2. Upsert row id=1
    const res2 = await fetch(`${supabaseUrl}/rest/v1/site_config`, {
      method: 'POST',
      headers: {
        ...headers,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: 1,
        school_name: 'TRƯỜNG THCS ĐỒNG TÂN',
        governing_body: 'ỦY BAN NHÂN DÂN XÃ HỮU LŨNG - TỈNH LẠNG SƠN',
        slogan: 'HỘI TỤ - KẾT TINH - TỎA SÁNG',
        address: targetAddress,
        phone: '(0205) 3885.6789',
        email: 'thcsdongtan.huulung@langson.edu.vn',
        logo_url: '/images/school-logo.jpg',
        banner_bg: '/images/school-banner.png',
        updated_at: new Date().toISOString()
      })
    });
    console.log("Upsert HTTP status:", res2.status);
    const data = await res2.json();
    console.log("✅ Dữ liệu site_config sau khi cập nhật:", data);
  } catch (err) {
    console.error("Lỗi:", err);
  }
}

forceUpdateAddress();
