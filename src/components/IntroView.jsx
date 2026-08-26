import React from 'react';
import { Award, Users, BookOpen, MapPin, CheckCircle, UserCheck } from 'lucide-react';

export default function IntroView({ siteConfig, introData }) {
  const intro = introData || {
    history: siteConfig?.history || 'Trường THCS Đồng Tân được thành lập và phát triển trên địa bàn Xã Hữu Lũng, Tỉnh Lạng Sơn. Qua nhiều năm xây dựng và trưởng thành, nhà trường luôn phấn đấu đạt danh hiệu Trường học thân thiện, Học sinh tích cực, nâng cao chất lượng giáo dục toàn diện.',
    mission: siteConfig?.mission || 'Xây dựng môi trường giáo dục kỷ cương, tình thương, trách nhiệm; giúp học sinh phát triển toàn diện cả về trí tuệ, thể chất và đạo đức.',
    vision: siteConfig?.vision || 'Phấn đấu trở thành trường Trung học cơ sở đạt chuẩn quốc gia cấp độ cao, đi đầu trong chuyển đổi số giáo dục tại Tỉnh Lạng Sơn.',
    totalTeachers: siteConfig?.totalTeachers || 35,
    totalStudents: siteConfig?.totalStudents || 520,
    classes: siteConfig?.classes || 14
  };
  const principal = siteConfig?.principal || 'Thầy Hiệu Trưởng - THCS Đồng Tân';
  const principalAvatar = siteConfig?.principalAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80';
  const vicePrincipal = siteConfig?.vicePrincipal || 'Cô Phó Hiệu Trưởng - THCS Đồng Tân';
  const vicePrincipalAvatar = siteConfig?.vicePrincipalAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80';

  const teamLeaders = [
    { 
      name: siteConfig?.teamLeader1Name || siteConfig?.teamLeader1 || 'Thầy Nguyễn Văn Nam', 
      title: siteConfig?.teamLeader1Title || 'Tổ trưởng Tổ Toán - KHTN', 
      avatar: siteConfig?.teamLeader1Avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' 
    },
    { 
      name: siteConfig?.teamLeader2Name || siteConfig?.teamLeader2 || 'Cô Trần Thị Thu Hà', 
      title: siteConfig?.teamLeader2Title || 'Tổ trưởng Tổ Văn - KHXH', 
      avatar: siteConfig?.teamLeader2Avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' 
    },
    { 
      name: siteConfig?.teamLeader3Name || siteConfig?.teamLeader3 || 'Thầy Lê Hoàng Long', 
      title: siteConfig?.teamLeader3Title || 'Tổ trưởng Tổ Ngoại Ngữ - Nghệ Thuật', 
      avatar: siteConfig?.teamLeader3Avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' 
    },
    { 
      name: siteConfig?.teamLeader4Name || siteConfig?.teamLeader4 || 'Cô Phạm Phương Thảo', 
      title: siteConfig?.teamLeader4Title || 'Tổ trưởng Tổ Hành Chính - Văn Thể', 
      avatar: siteConfig?.teamLeader4Avatar || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80' 
    }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="widget-box" style={{ marginBottom: '20px' }}>
        <div className="widget-header">
          <span>🏛️ GIỚI THIỆU TỔNG QUAN TRƯỜNG THCS ĐỒNG TÂN - LẠNG SƠN</span>
        </div>
        <div className="widget-body" style={{ padding: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '25px', marginBottom: '25px' }}>
            <div>
              <h2 style={{ fontSize: '20px', color: '#003a73', marginBottom: '12px', borderBottom: '2px solid #0284c7', paddingBottom: '6px' }}>
                Lịch sử Hình thành & Phát triển
              </h2>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155', textAlign: 'justify', marginBottom: '15px' }}>
                {intro.history}
              </p>

              <div style={{ background: '#f0f9ff', borderLeft: '4px solid #0284c7', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', color: '#0369a1', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={18} /> Sứ mệnh & Tầm nhìn
                </h3>
                <p style={{ fontSize: '13.5px', color: '#1e293b', lineHeight: '1.6' }}>
                  <strong>Sứ mệnh:</strong> {intro.mission}<br />
                  <strong>Tầm nhìn:</strong> {intro.vision}
                </p>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '16px', color: '#003a73', marginBottom: '12px', borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', textAlign: 'center' }}>
                📊 QUY MÔ NHÀ TRƯỜNG
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #e2e8f0' }}>
                  <span>👨‍🏫 Cán bộ & Giáo viên:</span>
                  <strong style={{ color: '#0056a6' }}>{intro.totalTeachers} Thầy/Cô</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #e2e8f0' }}>
                  <span>🎓 Tổng số Học sinh:</span>
                  <strong style={{ color: '#16a34a' }}>{intro.totalStudents} Học sinh</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #e2e8f0' }}>
                  <span>🏫 Quy mô Lớp học:</span>
                  <strong style={{ color: '#d97706' }}>{intro.classes} Lớp</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span>📍 Địa bàn:</span>
                  <strong>Xã Hữu Lũng, Lạng Sơn</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Ban Giám Hiệu */}
          <h2 style={{ fontSize: '18px', color: '#003a73', marginBottom: '15px', borderBottom: '2px solid #0284c7', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} /> BAN GIÁM HIỆU NHÀ TRƯỜNG
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '15px', textAlign: 'center', background: '#ffffff', boxShadow: '0 2px 5px rgba(0,0,0,0.03)' }}>
              <img 
                src={principalAvatar} 
                alt="BGH" 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80'; }}
                style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto', border: '3px solid #0056a6' }} 
              />
              <h4 style={{ fontSize: '15px', color: '#003a73', margin: '0 0 4px 0', fontWeight: '700' }}>{principal}</h4>
              <span style={{ fontSize: '12.5px', color: '#0284c7', fontWeight: '700', background: '#e0f2fe', padding: '3px 10px', borderRadius: '12px', display: 'inline-block' }}>Hiệu Trưởng Nhà Trường</span>
            </div>
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '15px', textAlign: 'center', background: '#ffffff', boxShadow: '0 2px 5px rgba(0,0,0,0.03)' }}>
              <img 
                src={vicePrincipalAvatar} 
                alt="BGH" 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80'; }}
                style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto', border: '3px solid #16a34a' }} 
              />
              <h4 style={{ fontSize: '15px', color: '#003a73', margin: '0 0 4px 0', fontWeight: '700' }}>{vicePrincipal}</h4>
              <span style={{ fontSize: '12.5px', color: '#16a34a', fontWeight: '700', background: '#dcfce7', padding: '3px 10px', borderRadius: '12px', display: 'inline-block' }}>Phó Hiệu Trưởng Chuyên Môn</span>
            </div>
          </div>

          {/* Các Tổ Trưởng Chuyên Môn (4 Tổ Trưởng) */}
          <h2 style={{ fontSize: '18px', color: '#003a73', marginBottom: '15px', borderBottom: '2px solid #0284c7', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} /> CÁC TỔ TRƯỞNG CHUYÊN MÔN (4 TỔ TRƯỞNG)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
            {teamLeaders.map((leader, index) => (
              <div key={index} style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '15px', textAlign: 'center', background: '#f8fafc', transition: 'transform 0.2s ease' }}>
                <img 
                  src={leader.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'} 
                  alt={leader.name} 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'; }}
                  style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto', border: '2px solid #d97706' }} 
                />
                <h4 style={{ fontSize: '14px', color: '#003a73', margin: '0 0 4px 0', fontWeight: '700' }}>{leader.name}</h4>
                <span style={{ fontSize: '12px', color: '#b45309', fontWeight: '600', background: '#fef3c7', padding: '2px 8px', borderRadius: '10px', display: 'inline-block' }}>
                  {leader.title}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

