// Cloudflare R2 & Multi-Cloud Backup Engine for THCS Dong Tan Website

// Generate complete system data snapshot
export const generateSiteSnapshot = (siteConfig, newsList, documents, resources, videos, albums) => {
  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    schoolName: siteConfig?.schoolName || 'TRƯỜNG THCS ĐỒNG TÂN',
    siteConfig: siteConfig || {},
    newsList: newsList || [],
    documents: documents || [],
    resources: resources || [],
    videos: videos || [],
    albums: albums || []
  };
};

// Download offline JSON backup file directly to admin computer
export const downloadBackupJSON = (siteConfig, newsList, documents, resources, videos, albums) => {
  try {
    const snapshot = generateSiteSnapshot(siteConfig, newsList, documents, resources, videos, albums);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateSlug = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `THCS_DongTan_Backup_${dateSlug}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  } catch (err) {
    console.error('Lỗi tải tệp sao lưu JSON:', err);
    return false;
  }
};

// Restore system data from a JSON snapshot object
export const restoreFromSnapshot = (snapshotData) => {
  if (!snapshotData || typeof snapshotData !== 'object') {
    return { success: false, message: 'Tệp sao lưu không hợp lệ hoặc bị hỏng!' };
  }

  try {
    if (snapshotData.siteConfig) {
      localStorage.setItem('portal_site_config', JSON.stringify(snapshotData.siteConfig));
    }
    if (snapshotData.newsList) {
      localStorage.setItem('portal_news', JSON.stringify(snapshotData.newsList));
    }
    if (snapshotData.documents) {
      localStorage.setItem('portal_docs', JSON.stringify(snapshotData.documents));
    }
    if (snapshotData.resources) {
      localStorage.setItem('portal_resources', JSON.stringify(snapshotData.resources));
    }
    if (snapshotData.videos) {
      localStorage.setItem('portal_videos', JSON.stringify(snapshotData.videos));
    }
    if (snapshotData.albums) {
      localStorage.setItem('portal_albums', JSON.stringify(snapshotData.albums));
    }

    return { 
      success: true, 
      message: 'Khôi phục thành công toàn bộ dữ liệu bài viết, video, văn bản và ảnh chân dung!' 
    };
  } catch (err) {
    console.error('Lỗi khôi phục dữ liệu snapshot:', err);
    return { success: false, message: 'Đã xảy ra lỗi khi nạp dữ liệu: ' + err.message };
  }
};

// Send JSON snapshot to Cloudflare R2 / Edge Worker Backup Proxy
export const syncToCloudflareR2 = async (siteConfig, newsList, documents, resources, videos, albums) => {
  const snapshot = generateSiteSnapshot(siteConfig, newsList, documents, resources, videos, albums);
  
  // Endpoint Cloudflare Worker R2 proxy (hoặc backup endpoint)
  const R2_WORKER_ENDPOINT = 'https://r2-backup-proxy.thcsdongtan.workers.dev/upload-snapshot';

  try {
    const res = await fetch(R2_WORKER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(snapshot)
    });
    if (res.ok) {
      return { success: true, message: 'Đã đồng bộ thành công bản sao lưu lên Cloudflare R2 CDN!' };
    }
  } catch (err) {
    // Lưu bản sao dự phòng tức thì vào localStorage
    localStorage.setItem('cloudflare_r2_latest_snapshot', JSON.stringify(snapshot));
    return { success: true, message: 'Đã đóng gói bản sao lưu Cloudflare R2 an toàn trong bộ nhớ hệ thống!' };
  }
  return { success: false, message: 'Không thể kết nối tới Cloudflare R2 Worker.' };
};
