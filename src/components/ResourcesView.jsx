import React, { useState } from 'react';
import { BookOpen, Download, ExternalLink, Upload, Layers, Edit, Trash2 } from 'lucide-react';

export default function ResourcesView({ resources = [], user, onOpenUpload, onOpenBulkUpload, onUpdateResource, onDeleteResource }) {
  const [filterType, setFilterType] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [editingResource, setEditingResource] = useState(null);

  const resourceList = resources.length > 0 ? resources : [
    {
      id: 1,
      title: 'Đề thi Học kỳ 1 môn Ngữ Văn lớp 9 năm học 2026 - 2027 (Có đáp án)',
      type: 'Đề thi & Đáp án',
      subject: 'Ngữ Văn 9',
      author: 'Tổ Xã Hội',
      date: '02/01/2027',
      downloads: 450,
      fileUrl: '#',
      externalLink: 'https://drive.google.com'
    },
    {
      id: 2,
      title: 'Giáo án điện tử môn Toán 8: Bài 5 - Phương trình bậc nhất một ẩn',
      type: 'Giáo án điện tử',
      subject: 'Toán 8',
      author: 'Tổ Tự Nhiên',
      date: '10/11/2026',
      downloads: 680,
      fileUrl: '#',
      externalLink: ''
    }
  ];

  const isAdmin = user && (user.role === 'BGH' || user.role === 'ADMIN');

  const filtered = resourceList.filter(item => {
    const matchesType = filterType === 'Tất cả' || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.subject.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDownload = (item) => {
    if (item.fileUrl && item.fileUrl !== '#') {
      const link = document.createElement('a');
      link.href = item.fileUrl;
      link.download = item.fileName || `${item.title || 'de-thi'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Đã bắt đầu tải về tệp tài liệu: ${item.title}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="widget-box">
        <div className="widget-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={18} /> KHO TÀI NGUYÊN HỌC TẬP & GIẢNG DẠY
          </span>

          {user ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                style={{ background: '#16a34a', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                onClick={() => onOpenUpload && onOpenUpload('resources')}
              >
                <Upload size={14} /> 📤 ĐĂNG TÀI LIỆU
              </button>

              <button 
                style={{ background: '#0284c7', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                onClick={() => onOpenBulkUpload && onOpenBulkUpload('resources')}
              >
                <Layers size={14} /> 📦 TẢI LÊN HÀNG LOẠT
              </button>
            </div>
          ) : (
            <button 
              style={{ background: '#0056a6', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
              onClick={() => onOpenUpload && onOpenUpload('resources')}
            >
              🔒 ĐĂNG NHẬP ĐỂ ĐĂNG TÀI LIỆU
            </button>
          )}
        </div>

        <div className="widget-body" style={{ padding: '20px' }}>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Tất cả', 'Đề thi & Đáp án', 'Giáo án điện tử', 'Tài liệu ôn thi', 'Sáng kiến kinh nghiệm'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    background: filterType === t ? '#0056a6' : '#ffffff',
                    color: filterType === t ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '13px'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="text"
                placeholder="Tìm đề thi, giáo án..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', width: '200px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(item => (
              <div 
                key={item.id} 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#f8fafc' }}
              >
                <div>
                  <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '3px', fontWeight: '700', marginRight: '8px' }}>
                    {item.type}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>📚 Môn: {item.subject}</span>
                  <h3 style={{ fontSize: '14.5px', color: '#003a73', margin: '4px 0', fontWeight: '700' }}>
                    {item.title}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    ✍️ Biên soạn: {item.author} | 📅 Ngày tạo: {item.date} | 📥 {item.downloads || 10} lượt tải
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {isAdmin && (
                    <>
                      <button 
                        onClick={() => setEditingResource(item)}
                        style={{ background: '#0284c7', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit size={14} /> Sửa
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Thầy/Cô có chắc muốn xóa tài liệu: "${item.title}"?`)) {
                            onDeleteResource && onDeleteResource(item.id);
                          }
                        }}
                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    </>
                  )}

                  <button 
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#15803d', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap' }}
                    onClick={() => handleDownload(item)}
                  >
                    <Download size={15} /> Tải tệp xuống
                  </button>

                  {item.externalLink && (
                    <a 
                      href={item.externalLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#d97706', color: 'white', textDecoration: 'none', padding: '8px 14px', borderRadius: '4px', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap' }}
                    >
                      <ExternalLink size={14} /> Link Drive
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* MODAL CHỈNH SỬA TÀI NGUYÊN HỌC LIỆU */}
      {editingResource && (
        <div className="modal-overlay" onClick={() => setEditingResource(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header" style={{ background: '#0056a6' }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>📚 CHỈNH SỬA TÀI NGUYÊN HỌC LIỆU</span>
              <button className="close-btn" onClick={() => setEditingResource(null)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                onUpdateResource && onUpdateResource(editingResource);
                setEditingResource(null);
              }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Tên tài liệu / Đề thi:</label>
                  <input type="text" value={editingResource.title} onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Loại tài nguyên:</label>
                  <select value={editingResource.type} onChange={(e) => setEditingResource({ ...editingResource, type: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                    <option value="Đề thi & Đáp án">Đề thi & Đáp án</option>
                    <option value="Giáo án điện tử">Giáo án điện tử</option>
                    <option value="Tài liệu ôn thi">Tài liệu ôn thi</option>
                    <option value="Sáng kiến kinh nghiệm">Sáng kiến kinh nghiệm</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Môn học / Lớp:</label>
                  <input type="text" value={editingResource.subject} onChange={(e) => setEditingResource({ ...editingResource, subject: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Tác giả / Tổ chuyên môn:</label>
                  <input type="text" value={editingResource.author} onChange={(e) => setEditingResource({ ...editingResource, author: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Liên kết ngoài / Google Drive:</label>
                  <input type="text" value={editingResource.externalLink || ''} onChange={(e) => setEditingResource({ ...editingResource, externalLink: e.target.value })} placeholder="https://drive.google.com/..." style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="button" onClick={() => setEditingResource(null)} style={{ padding: '8px 14px', background: '#e2e8f0', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' }}>Hủy</button>
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
