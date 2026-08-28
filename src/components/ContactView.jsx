import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactView({ siteConfig = {} }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState(false);

  const schoolName = siteConfig.schoolName || 'TRƯỜNG THCS ĐỒNG TÂN';
  const governingBody = siteConfig.governingBody || 'ỦY BAN NHÂN DÂN XÃ HỮU LŨNG - TỈNH LẠNG SƠN';
  let address = siteConfig.address || 'Thôn Ngọc Thành, xã Hữu Lũng, tỉnh Lạng Sơn';
  if (!address || address.includes('Thôn Đồng Tân') || address.includes('Xã Đồng Tân')) {
    address = 'Thôn Ngọc Thành, xã Hữu Lũng, tỉnh Lạng Sơn';
  }
  const phoneNumber = siteConfig.phone || '(0205) 3885.6789';
  const emailAddr = siteConfig.email || 'thcsdongtan.huulung@langson.edu.vn';

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setName('');
    setEmail('');
    setPhone('');
    setContent('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="widget-box">
        <div className="widget-header green">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={18} /> THÔNG TIN LIÊN HỆ & GỬI Ý KIẾN ĐÓNG GÓP - {schoolName}
          </span>
        </div>
        <div className="widget-body" style={{ padding: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
            <div>
              <h2 style={{ fontSize: '18px', color: '#003a73', marginBottom: '12px', borderBottom: '2px solid #16a34a', paddingBottom: '6px' }}>
                Thông tin Địa chỉ Liên hệ
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px', color: '#334155' }}>
                <div>
                  <strong>🏫 Tên đơn vị:</strong> {schoolName}
                </div>
                <div>
                  <strong>📍 Địa chỉ:</strong> {address}
                </div>
                <div>
                  <strong>🏛️ Cơ quan chủ quản:</strong> {governingBody}
                </div>
                <div>
                  <strong>📞 Điện thoại BGH:</strong> {phoneNumber}
                </div>
                <div>
                  <strong>✉️ Email thư điện tử:</strong> {emailAddr}
                </div>
                <div>
                  <strong>🌐 Trưởng Ban Biên Tập:</strong> Hiệu trưởng {schoolName}
                </div>
              </div>

              {/* Sơ đồ vị trí Google Maps iframe placeholder */}
              <div style={{ marginTop: '20px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', height: '200px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '15px' }}>
                <div>
                  <MapPin size={32} color="#0056a6" style={{ margin: '0 auto 6px auto' }} />
                  <strong style={{ display: 'block', color: '#003a73' }}>Vị trí địa lý: {address}</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Bản đồ chỉ đường tới {schoolName}</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <h2 style={{ fontSize: '18px', color: '#003a73', marginBottom: '12px', borderBottom: '2px solid #0056a6', paddingBottom: '6px' }}>
                Gửi Thư Đóng Góp & Thắc Mắc
              </h2>

              {success && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '10px 12px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={16} /> Cảm ơn quý khách! Ý kiến đã được gửi tới Ban Giám Hiệu.
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px' }}>Họ và tên của quý khách:</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nhập họ và tên..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px' }}>Số điện thoại:</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Số điện thoại..." />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px' }}>Địa chỉ Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Email..." />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px' }}>Nội dung đóng góp ý kiến:</label>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Soạn nội dung ý kiến hoặc câu hỏi..."></textarea>
                </div>
                <button type="submit" style={{ background: '#0056a6', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Send size={15} /> Gửi Ý Kiến Tới BGH
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
