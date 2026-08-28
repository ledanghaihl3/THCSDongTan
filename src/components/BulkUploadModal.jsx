import React, { useState } from 'react';
import { X, UploadCloud, Layers, CheckCircle, FileText, BookOpen, Image, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { compressImageDataUrl } from '../utils/imageCompressor';

export default function BulkUploadModal({ onClose, onBulkUploadSuccess }) {
  const [bulkType, setBulkType] = useState('resources'); // 'resources', 'docs', 'albums'
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form default batch metadata
  const [defaultSubject, setDefaultSubject] = useState('Toán 9');
  const [defaultResourceType, setDefaultResourceType] = useState('Đề thi & Đáp án');
  const [defaultDocCategory, setDefaultDocCategory] = useState('Thông tư BGD&ĐT');
  const [defaultSigner, setDefaultSigner] = useState('Hiệu trưởng THCS Đồng Tân');
  const [defaultAuthor, setDefaultAuthor] = useState('Tổ Chuyên Môn');

  const handleSelectFiles = (files) => {
    if (!files || files.length === 0) return;
    setMessage('');
    setError('');

    const newItems = Array.from(files).map((file, idx) => ({
      id: Date.now() + idx,
      file,
      name: file.name,
      sizeMb: (file.size / 1024 / 1024).toFixed(2),
      title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      status: 'pending', // 'pending', 'uploading', 'done', 'error'
      dataUrl: ''
    }));

    setFileList(prev => [...prev, ...newItems]);
  };

  const handleRemoveFile = (id) => {
    setFileList(prev => prev.filter(item => item.id !== id));
  };

  const handleTitleChange = (id, newTitle) => {
    setFileList(prev => prev.map(item => item.id === id ? { ...item, title: newTitle } : item));
  };

  const handleStartBulkUpload = async () => {
    if (fileList.length === 0) {
      setError('Vui lòng chọn ít nhất 1 tệp tin để bắt đầu tải lên hàng loạt!');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('🚀 Đang đọc và tải lên hàng loạt các tệp tin...');
    setProgress(5);

    const total = fileList.length;
    let completedCount = 0;
    const batchItemsToInsert = [];

    for (let i = 0; i < fileList.length; i++) {
      const item = fileList[i];
      
      // Update item status
      setFileList(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading' } : f));

      try {
        let dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(item.file);
        });

        if (item.file.type.startsWith('image/')) {
          dataUrl = await compressImageDataUrl(dataUrl, 900, 0.7);
        }

        if (bulkType === 'resources') {
          batchItemsToInsert.push({
            title: item.title || item.name,
            type: defaultResourceType,
            subject: defaultSubject,
            author: defaultAuthor,
            date: new Date().toLocaleDateString('vi-VN'),
            downloads: 0,
            file_url: dataUrl,
            file_name: item.name,
            external_link: ''
          });
        } else if (bulkType === 'docs') {
          batchItemsToInsert.push({
            code: `VB-${(Date.now() + i).toString().slice(-4)}`,
            title: item.title || item.name,
            category: defaultDocCategory,
            issue_date: new Date().toLocaleDateString('vi-VN'),
            signer: defaultSigner,
            file_url: dataUrl,
            file_name: item.name,
            external_link: ''
          });
        } else if (bulkType === 'albums') {
          batchItemsToInsert.push({
            title: item.title || item.name,
            date: new Date().toLocaleDateString('vi-VN'),
            photos_count: 1,
            cover: dataUrl,
            description: item.title,
            file_url: dataUrl,
            external_link: ''
          });
        }

        completedCount++;
        const currentProgress = Math.round((completedCount / total) * 90);
        setProgress(currentProgress);

        setFileList(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'done' } : f));
      } catch (err) {
        setFileList(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'error' } : f));
      }
    }

    // 1. Insert batch items into Local Backend SQLite Server
    if (batchItemsToInsert.length > 0) {
      try {
        if (bulkType === 'albums') {
          await Promise.all(batchItemsToInsert.map(item =>
            fetch('/api/media/albums', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
            }).catch(() =>
              fetch('http://127.0.0.1:3001/api/media/albums', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
              })
            )
          ));
        }
      } catch (err) {
        console.warn('Lỗi batch insert Local SQLite:', err);
      }
    }

    // 2. Insert batch items into Supabase Cloud Postgres (nếu khả dụng)
    if (supabase && batchItemsToInsert.length > 0) {
      try {
        const tableName = bulkType === 'docs' ? 'documents' : (bulkType === 'resources' ? 'resources' : 'albums');
        await supabase.from(tableName).insert(batchItemsToInsert);
      } catch (err) {
        console.error('Lỗi batch insert Supabase:', err);
      }
    }

    setProgress(100);
    setUploading(false);
    setMessage(`🎉 ĐÃ TẢI LÊN HÀNG LOẠT THÀNH CÔNG ${completedCount}/${total} TỆP TIN LÊN CLOUD CÔNG KHAI!`);

    if (onBulkUploadSuccess) {
      onBulkUploadSuccess();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        <div className="modal-header" style={{ background: '#0056a6' }}>
          <span style={{ fontSize: '14.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} /> 📦 TẢI LÊN HÀNG LOẠT TỆP TIN & TÀI LIỆU (BULK UPLOAD)
          </span>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {message && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontWeight: '700', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={18} /> {message}
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Bulk Category Type Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button
              onClick={() => setBulkType('resources')}
              style={{ flex: 1, padding: '10px', border: 'none', background: bulkType === 'resources' ? '#0056a6' : '#f1f5f9', color: bulkType === 'resources' ? 'white' : '#334155', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
            >
              <BookOpen size={16} /> 📚 Đề thi & Giáo án (Hàng loạt)
            </button>
            <button
              onClick={() => setBulkType('docs')}
              style={{ flex: 1, padding: '10px', border: 'none', background: bulkType === 'docs' ? '#0056a6' : '#f1f5f9', color: bulkType === 'docs' ? 'white' : '#334155', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
            >
              <FileText size={16} /> 📄 Văn bản chỉ đạo (Hàng loạt)
            </button>
            <button
              onClick={() => setBulkType('albums')}
              style={{ flex: 1, padding: '10px', border: 'none', background: bulkType === 'albums' ? '#0056a6' : '#f1f5f9', color: bulkType === 'albums' ? 'white' : '#334155', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
            >
              <Image size={16} /> 📷 Album ảnh (Nhiều ảnh)
            </button>
          </div>

          {/* Batch Default Metadata Settings */}
          <div style={{ background: '#f8fafc', padding: '12px 15px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12.5px' }}>
            {bulkType === 'resources' && (
              <>
                <div>
                  <label style={{ fontWeight: '700', display: 'block', marginBottom: '4px' }}>Bộ môn áp dụng chung:</label>
                  <input type="text" value={defaultSubject} onChange={(e) => setDefaultSubject(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Toán 9, Ngữ Văn 8..." />
                </div>
                <div>
                  <label style={{ fontWeight: '700', display: 'block', marginBottom: '4px' }}>Loại tài nguyên:</label>
                  <select value={defaultResourceType} onChange={(e) => setDefaultResourceType(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                    <option value="Đề thi & Đáp án">Đề thi & Đáp án</option>
                    <option value="Giáo án điện tử">Giáo án điện tử</option>
                    <option value="Tài liệu Giảng dạy">Tài liệu Giảng dạy</option>
                  </select>
                </div>
              </>
            )}

            {bulkType === 'docs' && (
              <>
                <div>
                  <label style={{ fontWeight: '700', display: 'block', marginBottom: '4px' }}>Thể loại văn bản:</label>
                  <select value={defaultDocCategory} onChange={(e) => setDefaultDocCategory(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                    <option value="Thông tư BGD&ĐT">Thông tư BGD&ĐT</option>
                    <option value="Quy chế Nhà trường">Quy chế Nhà trường</option>
                    <option value="Kế hoạch Chuyên môn">Kế hoạch Chuyên môn</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: '700', display: 'block', marginBottom: '4px' }}>Người ký văn bản:</label>
                  <input type="text" value={defaultSigner} onChange={(e) => setDefaultSigner(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </div>
              </>
            )}

            {bulkType === 'albums' && (
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontWeight: '600', color: '#0369a1' }}>ℹ️ Chọn nhiều tệp ảnh từ máy tính để đăng tải nhanh vào Thư viện Album trường.</span>
              </div>
            )}
          </div>

          {/* Multi-file Drag & Drop Selection Box */}
          <div style={{ border: '2px dashed #0056a6', background: '#f0f9ff', padding: '25px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', marginBottom: '15px' }} onClick={() => document.getElementById('bulk-file-input').click()}>
            <UploadCloud size={40} color="#0056a6" style={{ margin: '0 auto 8px' }} />
            <h4 style={{ fontSize: '15px', color: '#003a73', fontWeight: '800', margin: '0 0 4px 0' }}>
              NHẤP VÀO ĐÂY ĐỂ CHỌN NHIỀU TỆP TIN CÙNG LÚC (.PDF / .DOCX / .PNG / .JPG / .MP4)
            </h4>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Hỗ trợ chọn hoặc kéo thả đồng thời 5, 10, 20 tệp tin lên hệ thống mây Cloud</p>
            <input 
              id="bulk-file-input" 
              type="file" 
              multiple 
              onChange={(e) => handleSelectFiles(e.target.files)} 
              style={{ display: 'none' }} 
            />
          </div>

          {/* Selected File Queue List */}
          {fileList.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: '700', color: '#003a73', margin: 0 }}>
                  📋 DANH SÁCH {fileList.length} TỆP TIN ĐÃ CHỌN ĐẮNG CHỜ TẢI LÊN:
                </h4>
                <button onClick={() => setFileList([])} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
                  Xóa tất cả danh sách
                </button>
              </div>

              <div style={{ maxHeight: '220px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white' }}>
                {fileList.map((item, idx) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontSize: '12.5px' }}>
                    <span style={{ fontWeight: '700', color: '#64748b', width: '25px' }}>#{idx + 1}</span>
                    <input 
                      type="text" 
                      value={item.title} 
                      onChange={(e) => handleTitleChange(item.id, e.target.value)} 
                      style={{ flex: 1, padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px', fontWeight: '600' }} 
                      placeholder="Tiêu đề hiển thị..." 
                    />
                    <span style={{ color: '#64748b', fontSize: '11.5px', whiteSpace: 'nowrap' }}>{item.sizeMb} MB</span>

                    {/* Status Badge */}
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', whiteSpace: 'nowrap', background: item.status === 'done' ? '#dcfce7' : (item.status === 'uploading' ? '#e0f2fe' : '#f1f5f9'), color: item.status === 'done' ? '#15803d' : (item.status === 'uploading' ? '#0369a1' : '#475569') }}>
                      {item.status === 'done' ? '✓ Đã xong' : (item.status === 'uploading' ? '⌛ Đang tải...' : 'Chờ nạp')}
                    </span>

                    <button onClick={() => handleRemoveFile(item.id)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {uploading && (
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '4px', color: '#0056a6' }}>
                <span>Tiến trình tải lên Cloud:</span>
                <span>{progress}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#16a34a', transition: 'width 0.3s ease' }}></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
            <button onClick={onClose} style={{ background: '#94a3b8', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}>
              Đóng
            </button>
            <button 
              onClick={handleStartBulkUpload} 
              disabled={uploading || fileList.length === 0}
              style={{ background: fileList.length > 0 ? '#16a34a' : '#cbd5e1', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '4px', fontWeight: '700', fontSize: '14px', cursor: fileList.length > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {uploading ? <RefreshCw size={18} className="spin" /> : <UploadCloud size={18} />}
              {uploading ? `Đang tải lên (${progress}%)...` : `🚀 BẮT ĐẦU TẢI LÊN HÀNG LOẠT (${fileList.length} TỆP)`}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
