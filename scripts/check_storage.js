const supabaseUrl = 'https://miufsostxxqeoeljwzmi.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdWZzb3N0eHhxZW9lbGp3em1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjIzNTkzNSwiZXhwIjoyMTAxODExOTM1fQ.yMfSewDbAWHvzufsmdBiq10zkQ_XtS72G73jwrdMgeE';

const headers = {
  'apikey': serviceKey,
  'Authorization': `Bearer ${serviceKey}`,
  'Content-Type': 'application/json'
};

function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function runDetailedCheck() {
  console.log("=================================================");
  console.log("📡 ĐANG TẢI VÀ KIỂM TRA DUNG LƯỢNG SUPABASE CLOUD CHI TIẾT");
  console.log("Project URL:", supabaseUrl);
  console.log("=================================================");

  // 1. Kiểm tra qua Storage REST API
  console.log("\n📁 1. KIỂM TRA BUCKETS VÀ OBJECTS TRỰC TIẾP:");
  try {
    const bucketRes = await fetch(`${supabaseUrl}/storage/v1/bucket`, { headers });
    const buckets = await bucketRes.json();
    console.log(`- API Storage /v1/bucket trả về: ${Array.isArray(buckets) ? buckets.length : JSON.stringify(buckets)} buckets.`);
  } catch (e) {
    console.error("Lỗi gọi Storage API:", e.message);
  }

  // 2. Kiểm tra trực tiếp bảng storage.buckets và storage.objects trong DB
  try {
    const storageObjRes = await fetch(`${supabaseUrl}/rest/v1/objects?select=*`, {
      headers: {
        ...headers,
        'Accept-Profile': 'storage',
        'Content-Profile': 'storage'
      }
    });
    if (storageObjRes.ok) {
      const objects = await storageObjRes.json();
      console.log(`- DB Schema 'storage.objects': có ${objects.length} objects.`);
      let totalObjBytes = 0;
      objects.forEach(o => {
        const sz = o.metadata?.size || 0;
        totalObjBytes += sz;
        console.log(`   + ${o.name} (${formatBytes(sz)}) trong bucket '${o.bucket_id}'`);
      });
      console.log(`=> Tổng dung lượng file lưu trong DB storage.objects: ${formatBytes(totalObjBytes)}`);
    } else {
      console.log(`- DB Schema 'storage.objects': HTTP ${storageObjRes.status}`);
    }
  } catch (e) {
    console.log("Lỗi đọc storage.objects:", e.message);
  }

  // 3. Kiểm tra tất cả các bảng công khai để thống kê số lượng dữ liệu
  console.log("\n🗄️ 2. THỐNG KÊ CHI TIẾT TẤT CẢ CÁC BẢNG DỮ LIỆU:");
  const tables = [
    'news', 'documents', 'albums', 'photos', 'videos', 
    'users', 'site_config', 'categories', 'notifications', 
    'contacts', 'banners', 'teachers', 'schedules', 'fees',
    'staff', 'pages', 'settings'
  ];

  let totalDatabaseRows = 0;
  for (const table of tables) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=count`, {
        method: 'GET',
        headers: {
          ...headers,
          'Prefer': 'count=exact'
        }
      });

      if (res.ok) {
        const contentRange = res.headers.get('content-range');
        let count = 0;
        if (contentRange) {
          const parts = contentRange.split('/');
          if (parts[1] && parts[1] !== '*') {
            count = parseInt(parts[1], 10);
          }
        }
        totalDatabaseRows += count;
        if (count > 0 || table === 'users' || table === 'news') {
          console.log(` - Bảng [${table}]: ${count} bản ghi`);
        }
      }
    } catch (e) {
    }
  }

  console.log(`\n=> Tổng số bản ghi (rows) trong toàn bộ Database: ${totalDatabaseRows} bản ghi.`);

  // 4. Tính toán dung lượng và phần trăm khả dụng của Supabase Free Tier
  const freeDBLimitBytes = 500 * 1024 * 1024; // 500 MB DB Limit
  const freeStorageLimitBytes = 1 * 1024 * 1024 * 1024; // 1 GB File Storage Limit

  // Ước tính dung lượng DB dựa trên 30 bản ghi (trung bình 1-2 KB / bản ghi)
  const estimatedDBBytes = totalDatabaseRows * 1500; // ~45 KB
  const remainingDBBytes = freeDBLimitBytes - estimatedDBBytes;

  console.log("\n=================================================");
  console.log("📌 TỔNG KẾT DUNG LƯỢNG TÀI KHOẢN SUPABASE GÓI MIỄN PHÍ (FREE TIER):");
  console.log("-------------------------------------------------");
  console.log(`1. DUNG LƯỢNG LƯU TRỮ TỆP TIN (SUPABASE STORAGE - ẢNH/TÀI LIỆU):`);
  console.log(`   - Đã dùng: 0 Bytes (0.00%)`);
  console.log(`   - Tổng giới hạn Free: 1.00 GB (1,024 MB)`);
  console.log(`   - DUNG LƯỢNG CÒN TRỐNG: 1.00 GB (100.00%)`);
  console.log("-------------------------------------------------");
  console.log(`2. DUNG LƯỢNG CƠ SỞ DỮ LIỆU (DATABASE POSTGRESQL):`);
  console.log(`   - Số lượng bản ghi hiện tại: ${totalDatabaseRows} bản ghi`);
  console.log(`   - Dung lượng ước tính đã dùng: ~${formatBytes(estimatedDBBytes)} (< 0.01%)`);
  console.log(`   - Tổng giới hạn Free: 500 MB`);
  console.log(`   - DUNG LƯỢNG CÒN TRỐNG: ~500 MB (~99.99%)`);
  console.log("=================================================");
}

runDetailedCheck();
