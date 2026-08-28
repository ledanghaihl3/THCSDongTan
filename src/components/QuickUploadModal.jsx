import React, { useState } from 'react';
import { X, Upload, FilePlus, BookOpen, Newspaper, Image, Video, CheckCircle } from 'lucide-react';
import { supabase, uploadFileToSupabase } from '../lib/supabaseClient';
import { compressImageDataUrl } from '../utils/imageCompressor';

// Safe DB URL Formatter
function getSafeDbFileUrl(url) {
  if (!url) return '';
  return url;
}

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

export default function QuickUploadModal({ defaultTab = 'docs', categories = [], onClose, onAddNewItem }) {
  const [activeType, setActiveType] = useState(defaultTab);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  // Common Form Fields
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState(1);
  const [subject, setSubject] = useState('Toán 9');
  const [typeStr, setTypeStr] = useState('Đề thi & Đáp án');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [issueDate, setIssueDate] = useState('08/08/2026');
  const [signer, setSigner] = useState('Hiệu trưởng THCS Đồng Tân');
  const [author, setAuthor] = useState('Tổ Chuyên Môn');

  // File Upload Handler (Base64 Embedded File Storage for Global Cross-Device Access)
  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setFileName(file.name);
    setMessage('Đang xử lý & tối ưu tệp...');

    if (file.size > 25 * 1024 * 1024) {
      setMessage('⚠️ Tệp tin vượt quá 25MB. Vui lòng chọn tệp nhỏ hơn hoặc dán link Google Drive!');
      setUploading(false);
      return;
    }

    try {
      // 1. Thử tải trực tiếp lên Supabase Storage
      const uploadedUrl = await uploadFileToSupabase(file, activeType || 'uploads');
      if (uploadedUrl && !uploadedUrl.startsWith('data:')) {
        setFileUrl(uploadedUrl);
        setMessage(`✅ Đã tải tệp lên đám mây Supabase: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        setUploading(false);
        return;
      }
    } catch (err) {
      console.warn('Supabase storage upload fallback to local reader:', err);
    }

    // 2. Fallback sang FileReader mã hóa Base64 và nén ảnh
    const reader = new FileReader();
    reader.onload = async (e) => {
      let dataUrl = e.target.result;
      if (file.type && file.type.startsWith('image/')) {
        dataUrl = await compressImageDataUrl(dataUrl, 800, 0.7);
      }
      setFileUrl(dataUrl);
      setMessage(`✅ Đã đính kèm & nén tối ưu tệp: ${file.name}`);
      setUploading(false);
    };
    reader.onerror = () => {
      setMessage('❌ Không thể đọc tệp tin này');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setUploading(true);

    const newItemId = Date.now();
    let newItem = null;

    // Helper giữ nguyên 100% đường link ảnh gốc do người dùng tải lên (Data URL / HTTP URL)
    const getSafeDbImageUrl = (url, fallback = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80') => {
      if (!url || url === '#' || url === 'file_attached') {
        return (externalLink && externalLink.startsWith('http')) ? externalLink : fallback;
      }
      if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:image')) {
        return url;
      }
      return (externalLink && externalLink.startsWith('http')) ? externalLink : fallback;
    };

    const getSafeDbFileUrl = (url) => {
      if (!url || url === '#') return externalLink || fileName || 'file_attached';
      if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:')) {
        return url;
      }
      return externalLink || fileName || 'file_attached';
    };

    if (activeType === 'docs') {
      newItem = {
        id: newItemId,
        code: code || `VB-${newItemId.toString().slice(-4)}`,
        title: title || 'Văn bản chỉ đạo mới ban hành',
        category: 'Thông tư BGD&ĐT',
        issueDate: issueDate || '08/08/2026',
        signer: signer || 'BGH THCS Đồng Tân',
        views: 1,
        downloads: 0,
        fileUrl: fileUrl || '#',
        fileName: fileName || (code ? `${code}.pdf` : 'van-ban.pdf'),
        externalLink: externalLink || ''
      };

      if (supabase) {
        try {
          await supabase.from('documents').insert([{
            code: newItem.code,
            title: newItem.title,
            category: newItem.category,
            issue_date: newItem.issueDate,
            signer: newItem.signer,
            file_url: getSafeDbFileUrl(newItem.fileUrl),
            file_name: newItem.fileName,
            external_link: newItem.externalLink
          }]);
        } catch (err) {
          console.error('Lỗi lưu văn bản Supabase:', err);
        }
      }

    } else if (activeType === 'resources') {
      newItem = {
        id: newItemId,
        title: title || 'Tài liệu & Đề thi vừa tải lên',
        type: typeStr || 'Đề thi & Đáp án',
        subject: subject || 'Toán 9',
        author: author || 'Tổ Chuyên Môn',
        date: '08/08/2026',
        downloads: 0,
        fileUrl: fileUrl || '#',
        fileName: fileName || `${title || 'de-thi'}.pdf`,
        externalLink: externalLink || ''
      };

      if (supabase) {
        try {
          await supabase.from('resources').insert([{
            title: newItem.title,
            type: newItem.type,
            subject: newItem.subject,
            author: newItem.author,
            date: newItem.date,
            file_url: getSafeDbFileUrl(newItem.fileUrl),
            file_name: newItem.fileName,
            external_link: newItem.externalLink
          }]);
        } catch (err) {
          console.error('Lỗi lưu tài nguyên Supabase:', err);
        }
      }

    } else if (activeType === 'news') {
      const catObj = categories.find(c => c.id === parseInt(category)) || { name: 'Tin tức - Sự kiện' };
      const defaultNewsImg = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80';
      const actualImg = fileUrl || externalLink || defaultNewsImg;

      newItem = {
        id: newItemId,
        title: title || 'Tin tức mới cập nhật',
        slug: 'tin-moi-' + newItemId,
        categoryId: parseInt(category),
        categoryName: catObj.name,
        summary: summary || title,
        content: content || summary || title,
        image: actualImg,
        author: 'Ban Biên Tập THCS Đồng Tân',
        isFeatured: 0,
        views: 1,
        createdAt: '2026-08-08 08:00:00',
        fileUrl: actualImg,
        fileName: fileName || '',
        externalLink: externalLink || ''
      };

      if (supabase) {
        try {
          await supabase.from('articles').insert([{
            title: newItem.title,
            slug: newItem.slug,
            category_id: newItem.categoryId,
            category_name: newItem.categoryName,
            summary: newItem.summary,
            content: newItem.content,
            image: getSafeDbImageUrl(newItem.image, defaultNewsImg),
            file_url: getSafeDbFileUrl(newItem.fileUrl),
            external_link: newItem.externalLink,
            author: newItem.author
          }]);
        } catch (err) {
          console.error('Lỗi lưu bài viết Supabase:', err);
        }
      }

    } else if (activeType === 'albums') {
      const defaultAlbumCover = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80';
      const actualCover = fileUrl || externalLink || defaultAlbumCover;

      newItem = {
        id: newItemId,
        title: title || 'Album ảnh hoạt động mới',
        date: '08/08/2026',
        photosCount: 1,
        cover: actualCover,
        description: summary || title,
        fileUrl: actualCover,
        externalLink: externalLink || ''
      };

      if (supabase) {
        try {
          await supabase.from('albums').insert([{
            title: newItem.title,
            date: newItem.date,
            photos_count: newItem.photosCount,
            cover: getSafeDbImageUrl(newItem.cover, defaultAlbumCover),
            description: newItem.description,
            file_url: getSafeDbFileUrl(newItem.fileUrl),
            external_link: newItem.externalLink
          }]);
        } catch (err) {
          console.error('Lỗi lưu album Supabase:', err);
        }
      }

    } else if (activeType === 'videos') {
      const inputLink = youtubeId || externalLink || fileUrl || '';
      const extractedYtId = extractYouTubeId(inputLink);
      const isLocalVideoFile = fileUrl.startsWith('data:video') || fileUrl.endsWith('.mp4') || fileUrl.endsWith('.webm') || fileUrl.startsWith('/uploads') || fileUrl.startsWith('blob:');
      
      const finalVideoUrl = isLocalVideoFile ? fileUrl : (externalLink || fileUrl || (extractedYtId ? `https://www.youtube.com/watch?v=${extractedYtId}` : ''));
      const finalThumb = extractedYtId 
        ? `https://img.youtube.com/vi/${extractedYtId}/hqdefault.jpg` 
        : 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80';

      newItem = {
        id: newItemId,
        title: title || 'Video hoạt động trường học mới',
        youtubeId: extractedYtId,
        videoUrl: finalVideoUrl,
        thumbnailUrl: finalThumb,
        views: 1,
        externalLink: externalLink || inputLink
      };

      if (supabase) {
        try {
          await supabase.from('videos').insert([{
            title: newItem.title,
            youtube_id: newItem.youtubeId,
            video_url: getSafeDbFileUrl(newItem.videoUrl),
            thumbnail_url: newItem.thumbnailUrl,
            external_link: newItem.externalLink
          }]);
        } catch (err) {
          console.error('Lỗi lưu video Supabase:', err);
        }
      }
    }

    if (onAddNewItem && newItem) {
      onAddNewItem(activeType, newItem);
    }

    setUploading(false);
    setMessage('✅ ĐÃ LƯU VÀ TẢI LÊN THÀNH CÔNG VÀ HIỂN THỊ CÔNG KHAI!');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <div className="modal-header" style={{ background: '#16a34a' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={18} /> 📤 ĐĂNG TẢI NỘI DUNG LÊN SUPABASE CLOUD (TẤT CẢ THIẾT BỊ ĐỀU XEM ĐƯỢC)
          </span>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {message && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontWeight: '700', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} /> {message}
            </div>
          )}

          {/* Section Type Buttons */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px', borderBottom: '1px solid #cbd5e1' }}>
            <button 
              type="button"
              onClick={() => setActiveType('docs')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'docs' ? '#0056a6' : '#f1f5f9', color: activeType === 'docs' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <FilePlus size={14} /> 📄 Tải lên Văn bản
            </button>
            <button 
              type="button"
              onClick={() => setActiveType('resources')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'resources' ? '#0056a6' : '#f1f5f9', color: activeType === 'resources' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <BookOpen size={14} /> 📚 Đề thi & Tài nguyên
            </button>
            <button 
              type="button"
              onClick={() => setActiveType('news')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'news' ? '#0056a6' : '#f1f5f9', color: activeType === 'news' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <Newspaper size={14} /> 📰 Đăng Tin tức
            </button>
            <button 
              type="button"
              onClick={() => setActiveType('videos')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'videos' ? '#0056a6' : '#f1f5f9', color: activeType === 'videos' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <Video size={14} /> 🎬 Video YouTube / MP4
            </button>
            <button 
              type="button"
              onClick={() => setActiveType('albums')} 
              style={{ padding: '8px 12px', border: 'none', background: activeType === 'albums' ? '#0056a6' : '#f1f5f9', color: activeType === 'albums' ? 'white' : '#334155', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
            >
              <Image size={14} /> 📷 Album ảnh
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Form for Documents */}
            {activeType === 'docs' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Số hiệu Văn bản:</label>
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: TT08/2026/TT-BGDĐT" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Ngày ban hành:</label>
                    <input type="text" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Trích yếu Tiêu đề Văn bản:</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Trích yếu nội dung văn bản..." />
                </div>
              </>
            )}

            {/* Form for Resources */}
            {activeType === 'resources' && (
              <>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Tiêu đề Đề thi / Giáo án điện tử:</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Đề thi Học kỳ 1 môn Ngữ Văn 9 năm học 2026" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Bộ môn:</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Toán 9, Ngữ Văn 8..." />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Loại tài nguyên:</label>
                    <select value={typeStr} onChange={(e) => setTypeStr(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                      <option value="Đề thi & Đáp án">Đề thi & Đáp án</option>
                      <option value="Giáo án điện tử">Giáo án điện tử</option>
                      <option value="Tài liệu Giảng dạy">Tài liệu Giảng dạy</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Form for News */}
            {activeType === 'news' && (
              <>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Tiêu đề bài viết:</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nhập tiêu đề bài viết..." />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Nội dung chi tiết bài viết:</label>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nội dung bài viết..."></textarea>
                </div>
              </>
            )}

            {/* Form for Videos */}
            {activeType === 'videos' && (
              <>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Tiêu đề Video hoạt động:</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Video Khai giảng năm học 2026 THCS Đồng Tân" />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>Đường link Video YouTube (Hoặc mã ID):</label>
                  <input type="text" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="https://www.youtube.com/watch?v=..." />
                </div>
              </>
            )}

            {/* Universal File Upload Box */}
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <h4 style={{ fontSize: '13.5px', color: '#0056a6', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
                <Upload size={16} /> TẢI ĐÌNH KÈM TỆP TIN TỪ MÁY TÍNH (.PDF / .DOCX / .ZIP / .MP4)
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    1. Chọn tệp từ máy tính để đính kèm:
                  </label>
                  <input 
                    type="file" 
                    onChange={(e) => handleFileUpload(e.target.files[0])} 
                    style={{ fontSize: '12px', border: '1px solid #cbd5e1', padding: '4px', borderRadius: '4px', width: '100%', background: 'white' }} 
                  />
                  {fileName && <div style={{ fontSize: '11.5px', color: '#16a34a', marginTop: '4px', fontWeight: '600' }}>✓ Tệp đã chọn: {fileName}</div>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px', color: '#334155' }}>
                    2. Hoặc dán link truy cập ngoài (Google Drive):
                  </label>
                  <input 
                    type="text" 
                    value={externalLink} 
                    onChange={(e) => setExternalLink(e.target.value)} 
                    style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} 
                    placeholder="https://drive.google.com/..." 
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={uploading}
              style={{ background: '#16a34a', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Upload size={18} /> {uploading ? 'Đang lưu dữ liệu...' : '🚀 XÁC NHẬN ĐĂNG TẢI LÊN CLOUD CÔNG KHAI'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
