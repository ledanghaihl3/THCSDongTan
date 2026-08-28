import React, { useState } from 'react';
import { Home, Info, Newspaper, FileText, Image, Video, BookOpen, Calendar, Mail, ShieldAlert, Upload, UserPlus, Layers, KeyRound, LogOut, ChevronDown, UserCheck, LogIn, LayoutDashboard, Laptop } from 'lucide-react';

export default function Navbar({ user, activeTab, setActiveTab, onOpenAdmin, onOpenUpload, onOpenBulkUpload, onOpenRegister, onOpenLogin, onOpenChangePassword, onOpenMemberZone, onLogout }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navs = [
    { id: 'home', label: 'Trang chủ', icon: <Home size={15} /> },
    { id: 'intro', label: 'Giới thiệu', icon: <Info size={15} /> },
    { id: 'news', label: 'Tin Tức', icon: <Newspaper size={15} /> },
    { id: 'documents', label: 'Văn bản', icon: <FileText size={15} /> },
    { id: 'trolytinhoc', label: 'Trợ Lý Tin Học', icon: <Laptop size={15} /> },
    { id: 'albums', label: 'Albums', icon: <Image size={15} /> },
    { id: 'videos', label: 'Videos', icon: <Video size={15} /> },
    { id: 'resources', label: 'Tài nguyên', icon: <BookOpen size={15} /> },
    { id: 'schedule', label: 'Lịch làm việc', icon: <Calendar size={15} /> },
    { id: 'contact', label: 'Liên hệ', icon: <Mail size={15} /> },
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case 'BGH': return 'Ban Giám Hiệu';
      case 'GIAO_VIEN': return 'Giáo Viên';
      case 'HOC_SINH': return 'Học Sinh';
      case 'PHU_HUYNH': return 'Phụ Huynh';
      default: return 'Thành Viên';
    }
  };

  return (
    <nav className="main-navbar" style={{ position: 'relative' }}>
      {navs.map((nav) => (
        <a
          key={nav.id}
          className={`nav-item ${nav.id === 'home' ? 'home-icon' : ''} ${activeTab === nav.id ? 'active' : ''}`}
          onClick={() => setActiveTab(nav.id)}
        >
          {nav.icon}
          <span>{nav.label}</span>
        </a>
      ))}

      {/* Member Login Button */}
      {!user && (
        <a className="nav-item" style={{ background: '#0284c7', fontWeight: '700', marginLeft: 'auto' }} onClick={onOpenLogin}>
          <LogIn size={15} />
          <span>🔑 Đăng Nhập</span>
        </a>
      )}

      {/* Register Member Button */}
      <a className="nav-item" style={{ background: '#d97706', fontWeight: '700', marginLeft: !user ? '0' : 'auto' }} onClick={onOpenRegister}>
        <UserPlus size={15} />
        <span>👤 Đăng Ký</span>
      </a>

      {/* Change Password Button */}
      <a className="nav-item" style={{ background: '#7c3aed', fontWeight: '700' }} onClick={onOpenChangePassword}>
        <span>🔑 Đổi MK</span>
      </a>

      {/* Quick Upload Button */}
      <a 
        className="nav-item" 
        style={{ background: user ? '#16a34a' : '#0369a1', fontWeight: '700' }} 
        onClick={onOpenUpload}
        title={user ? "Đăng tệp tin mới" : "Chỉ tài khoản thành viên mới được đăng tệp"}
      >
        <Upload size={15} />
        <span>{user ? '📤 Tải Đơn' : '🔒 Đăng Bài'}</span>
      </a>

      {/* Bulk Upload Button */}
      <a 
        className="nav-item" 
        style={{ background: user ? '#0284c7' : '#0f766e', fontWeight: '700' }} 
        onClick={onOpenBulkUpload}
        title={user ? "Tải lên hàng loạt" : "Chỉ tài khoản thành viên mới được tải hàng loạt"}
      >
        <Layers size={15} />
        <span>{user ? '📦 Tải Hàng Loạt' : '🔒 Tải Hàng Loạt'}</span>
      </a>

      {/* Logged in User Menu OR Admin Portal Button */}
      {user ? (
        <div style={{ position: 'relative', display: 'inline-block', marginLeft: 'auto' }}>
          <button 
            type="button"
            className="nav-item admin-btn" 
            style={{ 
              background: 'linear-gradient(135deg, #0284c7 0%, #003a73 100%)', 
              color: '#ffffff',
              border: '2px solid #38bdf8',
              borderRadius: '6px',
              padding: '6px 14px',
              margin: '2px 4px',
              fontWeight: '800', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
            }}
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            title="Bấm để mở Menu chức năng tài khoản (Đổi MK, Góc Thành Viên, Đăng Xuất)"
          >
            <UserCheck size={18} color="#fbbf24" />
            <span style={{ fontSize: '13.5px' }}>👤 {user.fullName || user.username}</span>
            <span style={{ background: '#f59e0b', color: '#000', fontSize: '10.5px', padding: '1px 6px', borderRadius: '4px', fontWeight: '900' }}>
              {getRoleBadge(user.role)}
            </span>
            <ChevronDown size={16} color="#ffffff" style={{ transform: showUserDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
          </button>

          {showUserDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 6px)',
              background: '#ffffff',
              boxShadow: '0 12px 35px rgba(0,0,0,0.35)',
              borderRadius: '12px',
              padding: '8px 0',
              zIndex: 99999,
              minWidth: '260px',
              border: '2px solid #0284c7',
              animation: 'fadeIn 0.15s ease'
            }}>
              {/* Dropdown User Info Header */}
              <div style={{ padding: '10px 16px', borderBottom: '1.5px solid #e2e8f0', background: 'linear-gradient(to right, #f0f9ff, #e0f2fe)' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', fontWeight: '700', display: 'block' }}>Tài Khoản Đang Đăng Nhập:</span>
                <strong style={{ color: '#003a73', display: 'block', fontSize: '14px', marginTop: '2px', fontWeight: '800' }}>
                  👤 {user.fullName || user.username}
                </strong>
                <span style={{ display: 'inline-block', background: '#0284c7', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', marginTop: '4px' }}>
                  {getRoleBadge(user.role)}
                </span>
              </div>
              
              {/* Action 1: Member Zone */}
              <button
                type="button"
                onClick={() => { setShowUserDropdown(false); if (onOpenMemberZone) onOpenMemberZone(); }}
                style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '13.5px', fontWeight: '800', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <LayoutDashboard size={18} color="#0284c7" />
                <span>📊 Góc Thành Viên ({getRoleBadge(user.role)})</span>
              </button>

              {/* Action 2: Change Password */}
              <button
                type="button"
                onClick={() => { setShowUserDropdown(false); if (onOpenChangePassword) onOpenChangePassword(); }}
                style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '13.5px', fontWeight: '700', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <KeyRound size={18} color="#7c3aed" />
                <span>🔑 Đổi Mật Khẩu Tài Khoản</span>
              </button>

              {/* Action 3: Admin Portal */}
              <button
                type="button"
                onClick={() => { setShowUserDropdown(false); if (onOpenAdmin) onOpenAdmin(); }}
                style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '13.5px', fontWeight: '700', color: '#0056a6', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <ShieldAlert size={18} color="#0056a6" />
                <span>🛡️ Cổng Quản Trị Hệ Thống</span>
              </button>

              <div style={{ borderTop: '1px solid #e2e8f0', margin: '4px 0' }}></div>

              {/* Action 4: Logout */}
              <button
                type="button"
                onClick={() => { setShowUserDropdown(false); if (onLogout) onLogout(); }}
                style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: '#fef2f2', border: 'none', cursor: 'pointer', fontSize: '13.5px', fontWeight: '800', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <LogOut size={18} color="#dc2626" />
                <span>🚪 Đăng Xuất (Thoát Hệ Thống)</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <a className="nav-item admin-btn" onClick={onOpenAdmin}>
          <ShieldAlert size={15} />
          <span>Quản Trị</span>
        </a>
      )}
    </nav>
  );
}
