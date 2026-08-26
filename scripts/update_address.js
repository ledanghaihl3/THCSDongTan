const supabaseUrl = 'https://miufsostxxqeoeljwzmi.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdWZzb3N0eHhxZW9lbGp3em1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjIzNTkzNSwiZXhwIjoyMTAxODExOTM1fQ.yMfSewDbAWHvzufsmdBiq10zkQ_XtS72G73jwrdMgeE';

const headers = {
  'apikey': serviceKey,
  'Authorization': `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

async function updateAddressInSupabase() {
  console.log("📡 Đang cập nhật địa chỉ chính thức trên Supabase Cloud Database...");
  const newAddress = 'Thôn Ngọc Thành, xã Hữu Lũng, tỉnh Lạng Sơn';

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/site_config?id=eq.1`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        address: newAddress,
        updated_at: new Date().toISOString()
      })
    });

    if (res.ok) {
      const data = await res.json();
      console.log("✅ ĐÃ CẬP NHẬT ĐỊA CHỈ TRÊN SUPABASE THÀNH CÔNG:");
      console.log(data);
    } else {
      console.error("Lỗi HTTP:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Lỗi kết nối:", err);
  }
}

updateAddressInSupabase();
