import React, { useState } from 'react';
import { Image, Eye, Calendar, Sparkles, Trash2 } from 'lucide-react';

export default function AlbumsView({ albums = [], onDeleteAlbum }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const isAdminLoggedIn = Boolean(localStorage.getItem('adminToken'));

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

  const handleDelete = (e, albumId) => {
    e.stopPropagation();
    if (window.confirm('Thầy/Cô có chắc chắn muốn xóa album này không?')) {
      if (onDeleteAlbum) {
        onDeleteAlbum(albumId);
      }
    }
  };

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
                style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', background: '#ffffff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer', position: 'relative' }}
                onClick={() => setSelectedImage(album)}
              >
                <div style={{ position: 'relative' }}>
                  <img src={album.cover} alt={album.title} style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>
                    📷 {album.photosCount || album.photos_count || 1} Ảnh
                  </span>
                  {isAdminLoggedIn && onDeleteAlbum && (
                    <button
                      onClick={(e) => handleDelete(e, album.id)}
                      title="Xóa Album này"
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(220, 38, 38, 0.85)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
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
            ))}
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <span>📷 {selectedImage.title}</span>
              <button className="close-btn" onClick={() => setSelectedImage(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <img src={selectedImage.cover} alt={selectedImage.title} style={{ width: '100%', maxHeight: '450px', objectFit: 'contain', borderRadius: '6px', marginBottom: '15px' }} />
              <p style={{ fontSize: '13.5px', color: '#1e293b' }}>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
