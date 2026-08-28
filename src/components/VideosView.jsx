import React, { useState, useEffect } from 'react';
import { Video, Play, Eye, ExternalLink, Upload, AlertTriangle, Trash2, Plus, Edit } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Robust YouTube ID Extractor (Hỗ trợ tất cả dạng link: watch?v=, youtu.be/, shorts/, embed/)
function extractYouTubeId(urlOrId) {
  if (!urlOrId) return '';
  const str = urlOrId.trim();
  if (str.length === 11 && !str.includes('/') && !str.includes('.')) {
    return str;
  }
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = str.match(regExp);
  return (match && match[1]) ? match[1] : '';
}

export default function VideosView({ videos = [], user, onOpenUpload, onAddNewItem, onUpdateVideo, onDeleteVideo }) {
  const [editingVideo, setEditingVideo] = useState(null);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoLink, setNewVideoLink] = useState('');
  const [newVideoFileUrl, setNewVideoFileUrl] = useState('');
  const [newVideoFileName, setNewVideoFileName] = useState('');

  const isAdmin = user && (user.role === 'BGH' || user.role === 'ADMIN');
  const videoList = videos.length > 0 ? videos : [
    {
      id: 1,
      title: 'Phim tư liệu: 40 năm truyền thống Dạy tốt - Học tốt THCS Đồng Tân',
      youtubeId: 'k8F4q_N-g_w',
      thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80',
      views: 1540
    },
    {
      id: 2,
      title: 'Hoạt động trải nghiệm sáng tạo STEM môn Sinh - Hóa lớp 9',
      youtubeId: 'dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
      views: 920
    }
  ];

  const [activeVideo, setActiveVideo] = useState(videoList[0]);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (videoList.length > 0 && (!activeVideo || !videoList.find(v => v.id === activeVideo.id))) {
      setActiveVideo(videoList[0]);
    }
  }, [videos]);

  const handleSelectVideo = (vid) => {
    setActiveVideo(vid);
    setIframeError(false);
  };

  const handleCreateVideoSubmit = async (e) => {
    e.preventDefault();
    const newItemId = Date.now();
    const inputStr = newVideoLink || newVideoFileUrl || '';
    const extractedYtId = extractYouTubeId(inputStr);
    const isLocalVideoFile = newVideoFileUrl.startsWith('data:video') || newVideoFileUrl.endsWith('.mp4') || newVideoFileUrl.endsWith('.webm') || newVideoFileUrl.startsWith('blob:');

    const finalVideoUrl = isLocalVideoFile ? newVideoFileUrl : (newVideoLink || newVideoFileUrl || (extractedYtId ? `https://www.youtube.com/watch?v=${extractedYtId}` : ''));
    const finalThumb = extractedYtId 
      ? `https://img.youtube.com/vi/${extractedYtId}/hqdefault.jpg` 
      : 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80';

    const newVidObj = {
      id: newItemId,
      title: newVideoTitle || 'Video hoạt động THCS Đồng Tân',
      youtubeId: extractedYtId,
      videoUrl: finalVideoUrl,
      thumbnailUrl: finalThumb,
      views: 1,
      externalLink: newVideoLink || finalVideoUrl
    };

    // 1. Chuyển ngay khung phát video chính trên đầu màn hình sang Video mới đăng!
    setActiveVideo(newVidObj);

    // 2. Đồng bộ lưu dữ liệu lên Supabase Cloud Postgres
    if (supabase) {
      try {
        await supabase.from('videos').insert([{
          title: newVidObj.title,
          youtube_id: newVidObj.youtubeId,
          video_url: newVidObj.videoUrl,
          thumbnail_url: newVidObj.thumbnailUrl,
          external_link: newVidObj.externalLink
        }]);
      } catch (err) {
        console.error('Lỗi lưu video Supabase:', err);
      }
    }

    if (onAddNewItem) {
      onAddNewItem('videos', newVidObj);
    } else if (onOpenUpload) {
      onOpenUpload('videos');
    }

    setNewVideoTitle('');
    setNewVideoLink('');
    setNewVideoFileUrl('');
    setNewVideoFileName('');
    setShowAddVideoModal(false);
  };

  // Tự động phân loại nguồn Video: YouTube link hoặc tệp MP4 trực tiếp
  const activeYtId = extractYouTubeId(activeVideo?.youtubeId || activeVideo?.videoUrl || activeVideo?.externalLink || activeVideo?.fileUrl || '');
  
  const rawVideoFileSrc = activeVideo?.videoUrl || activeVideo?.fileUrl || '';
  const isVideoFileSrc = rawVideoFileSrc && (
    rawVideoFileSrc.startsWith('data:video') || 
    rawVideoFileSrc.endsWith('.mp4') || 
    rawVideoFileSrc.endsWith('.webm') || 
    rawVideoFileSrc.startsWith('/uploads') || 
    rawVideoFileSrc.startsWith('blob:')
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="widget-box">
        <div className="widget-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Video size={18} /> THƯ VIỆN VIDEO HOẠT ĐỘNG THCS ĐỒNG TÂN ({videoList.length} VIDEO)
          </span>

          {user ? (
            <button 
              style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => setShowAddVideoModal(true)}
            >
              <Plus size={16} /> 📤 ĐĂNG & LƯU VIDEO MỚI
            </button>
          ) : (
            <button 
              style={{ background: '#0056a6', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => onOpenUpload && onOpenUpload('videos')}
            >
              🔒 ĐĂNG NHẬP ĐỂ ĐĂNG VIDEO
            </button>
          )}
        </div>

        <div className="widget-body" style={{ padding: '20px' }}>
          
          {/* Main Active Video Player */}
          {activeVideo && (
            <div style={{ marginBottom: '25px', background: '#000', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
              {activeYtId ? (
                <iframe
                  width="100%"
                  height="450"
                  src={`https://www.youtube.com/embed/${activeYtId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onError={() => setIframeError(true)}
                ></iframe>
              ) : isVideoFileSrc ? (
                <video 
                  controls 
                  src={rawVideoFileSrc} 
                  style={{ width: '100%', height: '450px', objectFit: 'contain', background: '#000' }}
                  poster={activeVideo.thumbnailUrl}
                  autoPlay
                />
              ) : (
                <div style={{ padding: '60px 20px', color: 'white', textAlign: 'center', background: '#1e293b' }}>
                  <AlertTriangle size={40} color="#f59e0b" style={{ marginBottom: '10px' }} />
                  <h3 style={{ fontSize: '16px', color: '#f59e0b' }}>Video hoạt động THCS Đồng Tân</h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '15px' }}>Nhấp nút bên dưới để xem trực tiếp Video này trên kênh chính thức:</p>
                  {(activeVideo.externalLink || rawVideoFileSrc) && (
                    <a 
                      href={activeVideo.externalLink || rawVideoFileSrc} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ background: '#ef4444', color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ExternalLink size={16} /> ▶️ PHÁT VIDEO NÀY NGAY
                    </a>
                  )}
                </div>
              )}
              
              <div style={{ padding: '15px', background: '#0f172a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '17px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '700' }}>
                    🎬 {activeVideo.title}
                  </h2>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    👁️ {activeVideo.views || 100} lượt xem | Kênh Video THCS Đồng Tân
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {isAdmin && (
                    <button 
                      onClick={() => setEditingVideo(activeVideo)}
                      style={{ background: '#0284c7', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '4px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <Edit size={14} /> Sửa Video
                    </button>
                  )}
                  {onDeleteVideo && (
                    <button 
                      onClick={() => onDeleteVideo(activeVideo.id)}
                      style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '4px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <Trash2 size={14} /> Xóa Video
                    </button>
                  )}
                  <a 
                    href={activeVideo.externalLink || (activeVideo.youtubeId ? `https://www.youtube.com/watch?v=${activeVideo.youtubeId}` : '#')}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: '#ef4444', color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ExternalLink size={15} /> Mở YouTube
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* List of Available Videos */}
          <h3 style={{ fontSize: '15px', color: '#003a73', marginBottom: '12px', fontWeight: '700' }}>
            DANH SÁCH VIDEO CỤM HOẠT ĐỘNG ({videoList.length})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '15px' }}>
            {videoList.map(vid => (
              <div 
                key={vid.id}
                onClick={() => handleSelectVideo(vid)}
                style={{ 
                  border: activeVideo?.id === vid.id ? '2px solid #0056a6' : '1px solid #cbd5e1', 
                  borderRadius: '6px', 
                  overflow: 'hidden', 
                  cursor: 'pointer',
                  background: 'white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'relative', height: '135px' }}>
                  <img 
                    src={vid.thumbnailUrl || (vid.youtubeId ? `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80')} 
                    alt={vid.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={20} />
                  </div>
                </div>
                <div style={{ padding: '10px' }}>
                  <h4 style={{ fontSize: '13px', color: '#003a73', margin: '0 0 6px 0', lineHeight: '1.3', fontWeight: '700', height: '34px', overflow: 'hidden' }}>
                    {vid.title}
                  </h4>
                  <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><Eye size={12} /> {vid.views || 100} lượt xem</span>
                    {onDeleteVideo && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteVideo(vid.id); }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px 4px' }}
                        title="Xóa video này"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* MODAL CHỈNH SỬA VIDEO */}
      {editingVideo && (
        <div className="modal-overlay" onClick={() => setEditingVideo(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header" style={{ background: '#0056a6' }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>🎬 CHỈNH SỬA VIDEO CLIP</span>
              <button className="close-btn" onClick={() => setEditingVideo(null)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                onUpdateVideo && onUpdateVideo(editingVideo);
                setEditingVideo(null);
              }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Tiêu đề Video:</label>
                  <input type="text" value={editingVideo.title} onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Đường link hoặc ID YouTube:</label>
                  <input 
                    type="text" 
                    value={editingVideo.youtubeId || ''} 
                    onChange={(e) => {
                      const val = e.target.value;
                      const parsedId = extractYouTubeId(val);
                      setEditingVideo({ 
                        ...editingVideo, 
                        youtubeId: parsedId || val,
                        thumbnailUrl: parsedId ? `https://img.youtube.com/vi/${parsedId}/hqdefault.jpg` : editingVideo.thumbnailUrl
                      });
                    }} 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
                  />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>💡 Thầy/Cô có thể dán nguyên đường link YouTube vào đây, hệ thống sẽ tự bóc tách mã ID.</span>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Đường dẫn Video MP4 (Hoặc link trực tiếp):</label>
                  <input type="text" value={editingVideo.videoUrl || ''} onChange={(e) => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })} placeholder="https://.../video.mp4" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px' }} />
                  
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0056a6', marginBottom: '4px', cursor: 'pointer' }}>
                    📹 Hoặc chọn tệp Video (.MP4) trực tiếp từ máy tính của Thầy/Cô:
                  </label>
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setEditingVideo({ ...editingVideo, videoUrl: ev.target.result, externalLink: file.name });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Đường dẫn Ảnh đại diện (Thumbnail):</label>
                  <input type="text" value={editingVideo.thumbnailUrl || ''} onChange={(e) => setEditingVideo({ ...editingVideo, thumbnailUrl: e.target.value })} placeholder="https://..." style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="button" onClick={() => setEditingVideo(null)} style={{ padding: '8px 14px', background: '#e2e8f0', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' }}>Hủy</button>
                  <button type="submit" style={{ padding: '8px 14px', background: '#0056a6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}>💾 LƯU THAY ĐỔI</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TẠO MỚI VIDEO VIA LINK HOẶC FILE */}
      {showAddVideoModal && (
        <div className="modal-overlay" onClick={() => setShowAddVideoModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header" style={{ background: '#16a34a' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={18} /> 🎬 ĐĂNG BÀI VIDEO HOẠT ĐỘNG MỚI
              </span>
              <button className="close-btn" onClick={() => setShowAddVideoModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateVideoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '5px' }}>
                    1. Tiêu đề Video hoạt động:
                  </label>
                  <input 
                    type="text" 
                    value={newVideoTitle} 
                    onChange={(e) => setNewVideoTitle(e.target.value)} 
                    placeholder="VD: Video Khai giảng năm học 2026 - THCS Đồng Tân" 
                    required 
                    style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '5px', color: '#0056a6' }}>
                    2. Dán đường link Video (YouTube / Google Drive / TikTok / MP4):
                  </label>
                  <input 
                    type="text" 
                    value={newVideoLink} 
                    onChange={(e) => setNewVideoLink(e.target.value)} 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    style={{ width: '100%', padding: '9px', border: '2px solid #0284c7', borderRadius: '4px', fontSize: '13px' }} 
                  />
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                    💡 Thầy/Cô dán trực tiếp đường link YouTube hoặc link chia sẻ bất kỳ vào ô này.
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '5px', color: '#16a34a' }}>
                    3. Hoặc chọn tệp Video (.MP4) trực tiếp từ máy tính:
                  </label>
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        setNewVideoFileName(file.name);
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setNewVideoFileUrl(ev.target.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ width: '100%', fontSize: '12px', padding: '4px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                  {newVideoFileName && (
                    <div style={{ fontSize: '11.5px', color: '#16a34a', marginTop: '5px', fontWeight: '700' }}>
                      ✓ Đã chọn tệp video: {newVideoFileName}
                    </div>
                  )}
                </div>

                {/* Live Real-time Video Preview */}
                {(extractYouTubeId(newVideoLink) || newVideoFileUrl) && (
                  <div style={{ background: '#0f172a', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ color: '#38bdf8', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                      📺 Xem trước Trình phát Video:
                    </div>
                    {extractYouTubeId(newVideoLink) ? (
                      <iframe
                        width="100%"
                        height="180"
                        src={`https://www.youtube.com/embed/${extractYouTubeId(newVideoLink)}`}
                        title="Live Preview"
                        frameBorder="0"
                      />
                    ) : (
                      <video controls src={newVideoFileUrl} style={{ width: '100%', maxHeight: '180px' }} />
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowAddVideoModal(false)} 
                    style={{ padding: '9px 16px', background: '#e2e8f0', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    style={{ padding: '9px 16px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', fontSize: '13.5px' }}
                  >
                    🚀 XÁC NHẬN ĐĂNG VIDEO CÔNG KHAI
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

