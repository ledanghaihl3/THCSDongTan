import React from 'react';

export default function HeaderBanner({ siteConfig }) {
  const config = siteConfig || {};
  const schoolName = config.schoolName || 'TRƯỜNG THCS ĐỒNG TÂN';
  const governingBody = config.governingBody || 'ỦY BAN NHÂN DÂN XÃ HỮU LŨNG - TỈNH LẠNG SƠN';
  const rawSlogan = config.slogan || 'HỘI TỤ - KẾT TINH - TỎA SÁNG';
  const slogan = rawSlogan.split('|||BGH_JSON:')[0];
  let address = config.address || 'Thôn Ngọc Thành, xã Hữu Lũng, tỉnh Lạng Sơn';
  if (!address || address.includes('Thôn Đồng Tân') || address.includes('Xã Đồng Tân')) {
    address = 'Thôn Ngọc Thành, xã Hữu Lũng, tỉnh Lạng Sơn';
  }
  const phone = config.phone || '(0205) 3885.6789';
  
  // Official school logo and background
  const rawLogoUrl = config.logoUrl || '/images/school-logo.jpg';
  const logoUrl = rawLogoUrl.split('|||BGH_JSON:')[0];
  const bannerImage = config.bannerBg || '/images/school-banner.png';
  
  const bannerStyle = {
    backgroundImage: `linear-gradient(rgba(0, 40, 85, 0.75), rgba(0, 78, 124, 0.82)), url('${bannerImage}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center'
  };

  return (
    <header className="header-banner" style={bannerStyle}>
      <div className="header-content">
        <img 
          src={logoUrl} 
          alt="Logo TRƯỜNG THCS ĐỒNG TÂN - 1954" 
          className="school-logo" 
        />
        <div className="header-text">
          {governingBody && (
            <div style={{ fontSize: '12px', color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px', fontWeight: '700', textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
              {governingBody}
            </div>
          )}
          <h1 className="school-title" style={{ fontSize: '28px', textShadow: '2px 2px 6px rgba(0,0,0,0.8)' }}>
            {schoolName}
          </h1>
          <div className="school-slogan" style={{ color: '#fbbf24', textShadow: '1px 1px 4px rgba(0,0,0,0.8)', fontWeight: '800' }}>
            {slogan}
          </div>
          <div className="school-address" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)', color: '#f8fafc', fontWeight: '500' }}>
            📍 Địa chỉ: {address} | 📞 Điện thoại: {phone}
          </div>
        </div>
      </div>
    </header>
  );
}
