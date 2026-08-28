import React, { useState } from 'react';
import { Image, Eye, Calendar, Sparkles, Edit, Trash2 } from 'lucide-react';

const DEFAULT_ALBUM_COVER = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80';

const getValidImageSrc = (src) => {
  if (!src || src === '#' || src === 'file_attached') {
    return DEFAULT_ALBUM_COVER;
  }
  if (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }
  return DEFAULT_ALBUM_COVER;
};

export default function AlbumsView({ albums = [], user, onUpdateAlbum, onDeleteAlbum }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);

  const isAdminLoggedIn = Boolean(localStorage.getItem('adminToken'));
  const isAdmin = isAdminLoggedIn || (user && (user.role === 'BGH' || user.role === 'ADMIN'));

  const albumList = albums.length > 0 ? albums : [
    {
      id: 1,
      title: 'Album: Lễ Khai giảng năm học 2026 - 2027 THCS Đồng Tân',
      date: '05/09/2026',
      photosCount: 18,
      cover: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
      description: 'Hình ảnh rực rỡ cờ hoa trong ngày hội Khai trường chào đón các em học sinh khối 6 mới trúng tuyển.'
    },
    {
      id: 2,
      title: 'Album: Ngày hội Sáng tạo STEM & Triển lãm Khoa học Kỹ thuật',
      date: '20/10/2026',
      photosCount: 24,
      cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
      description: 'Học sinh hào hứng trải nghiệm mô hình tên lửa nước, rô bốt và các sản phẩm khoa học tự làm.'
    },
    {
      id: 3,
      title: 'Album: Hội thi Thể dục Thể thao & Giai điệu Tuổi hồng',
      date: '20/11/2026',
      photosCount: 15,
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
      description: 'Các tiết mục múa hát tri ân thầy cô giáo và các trận thi đấu bóng chuyền, điền kinh sôi nổi.'
    },
    {
      id: 4,
      title: 'Album: Hoạt động Ngoại khóa Tuyên truyền Luật Giao thông Đường bộ',
      date: '15/12/2026',
      photosCount: 12,
      cover: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80',
      description: 'Buổi sinh hoạt chuyên đề giúp học sinh nắm vững quy định an toàn giao thông khi đến trường.'
    }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="widget-box">
        <div className="widget-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Image size={18} /> THƯ VIỆN ALBUMS ẢNH HOẠT ĐỘNG THCS ĐỒNG TÂN
          </span>
        </div>
        <div className="widget-body" style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {albumList.map((album) => (
              <div 
                key={album.id} 
                style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', background: '#ffffff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                onClick={() => setSelectedImage(album)}
              >
                <div>
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={getValidImageSrc(album.cover)} 
                      alt={album.title} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_ALBUM_COVER;
                      }}
                      style={{ width: '100%', height: '170px', objectFit: 'cover' }} 
                    />
                    <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>
                      📷 {album.photosCount || album.photos_count || 1} Ảnh
                    </span>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#003a73', marginBottom: '6px', lineHeight: '1.3' }}>
                      {album.title}
                    </h3>
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '6px' }}>
                      <Calendar size={12} inline /> {album.date}
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {album.description}
                    </p>
                  </div>
                </div>

                {/* THANH THAO TÁC QUẢN TRỊ VIÊN BGH */}
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '6px', padding: '8px 12px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0' }} onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setEditingAlbum(album)}
                      style={{ flex: 1, background: '#0284c7', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Edit size={12} /> Sửa
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm(`Thầy/Cô có chắc muốn xóa album: "${album.title}"?`)) {
                          onDeleteAlbum && onDeleteAlbum(album.id);
                        }
                      }}
                      style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Trash2 size={12} /> Xóa
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* POPUP PHÓNG TO ẢNH */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <span>📷 {selectedImage.title}</span>
              <button className="close-btn" onClick={() => setSelectedImage(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <img 
                src={getValidImageSrc(selectedImage.cover)} 
                alt={selectedImage.title} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_ALBUM_COVER;
                }}
                style={{ width: '100%', maxHeight: '450px', objectFit: 'contain', borderRadius: '6px', marginBottom: '15px' }} 
              />
              <p style={{ fontSize: '13.5px', color: '#1e293b' }}>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SỬA ALBUM */}
      {editingAlbum && (
        <div className="modal-overlay" onClick={() => setEditingAlbum(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header" style={{ background: '#0056a6' }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>📷 CHỈNH SỬA ALBUM ẢNH</span>
              <button className="close-btn" onClick={() => setEditingAlbum(null)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                onUpdateAlbum && onUpdateAlbum(editingAlbum);
                setEditingAlbum(null);
              }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Tiêu đề Album:</label>
                  <input type="text" value={editingAlbum.title} onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Ngày tạo:</label>
                  <input type="text" value={editingAlbum.date} onChange={(e) => setEditingAlbum({ ...editingAlbum, date: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Đường dẫn ảnh bìa (Cover URL):</label>
                  <input type="text" value={editingAlbum.cover} onChange={(e) => setEditingAlbum({ ...editingAlbum, cover: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '6px' }} />
                  
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0056a6', marginBottom: '4px', cursor: 'pointer' }}>
                    📸 Hoặc chọn ảnh trực tiếp từ máy tính của Thầy/Cô:
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setEditingAlbum({ ...editingAlbum, cover: ev.target.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Mô tả Album:</label>
                  <textarea value={editingAlbum.description} onChange={(e) => setEditingAlbum({ ...editingAlbum, description: e.target.value })} rows={3} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="button" onClick={() => setEditingAlbum(null)} style={{ padding: '8px 14px', background: '#e2e8f0', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' }}>Hủy</button>
                  <button type="submit" style={{ padding: '8px 14px', background: '#0056a6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}>💾 LƯU THAY ĐỔI</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
