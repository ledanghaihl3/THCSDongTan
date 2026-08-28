const supabaseUrl = 'https://miufsostxxqeoeljwzmi.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdWZzb3N0eHhxZW9lbGp3em1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjIzNTkzNSwiZXhwIjoyMTAxODExOTM1fQ.yMfSewDbAWHvzufsmdBiq10zkQ_XtS72G73jwrdMgeE';

const headers = {
  'apikey': serviceKey,
  'Authorization': `Bearer ${serviceKey}`,
  'Content-Type': 'application/json'
};

async function testTables() {
  const tables = ['articles', 'news', 'documents', 'resources', 'videos', 'albums', 'schedules', 'site_config', 'users'];
  for (const t of tables) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/${t}?select=*&limit=1`, { headers });
      console.log(`Bảng '${t}': HTTP ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log(` -> Dữ liệu mẫu '${t}':`, data);
      }
    } catch (e) {
      console.error(`Lỗi kiểm tra '${t}':`, e.message);
    }
  }
}

testTables();
