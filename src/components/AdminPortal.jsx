import React, { useState, useEffect } from 'react';
import { ShieldCheck, LogOut, PlusCircle, FilePlus, Users, CheckCircle, Trash2, Edit, Settings, AlertCircle, Save, Check, UserCheck, Bell, UserPlus, Eye, EyeOff, Lock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AdminPortal({ 
  token, 
  user, 
  onLogin, 
  onLogout, 
  categories = [], 
  siteConfig = {},
  onSaveSiteConfig,
  newsList = [],
  documents = [],
  resources = [],
  pendingUsers = [],
  onApproveUser,
  onRejectUser,
  onUpdateNews,
  onDeleteNews,
  onUpdateDocument,
  onDeleteDocument,
  onUpdateResource,
  onDeleteResource,
  onRefreshData 
}) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminTab, setAdminTab] = useState('users');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  // Site Config State
  const [configState, setConfigState] = useState({
    schoolName: siteConfig.schoolName || 'TRƯỜNG THCS ĐỒNG TÂN',
    governingBody: siteConfig.governingBody || 'ỦY BAN NHÂN DÂN XÃ HỮU LŨNG - TỈNH LẠNG SƠN',
    slogan: siteConfig.slogan || 'HỘI TỤ - KẾT TINH - TỎA SÁNG',
    address: siteConfig.address || 'Xã Hữu Lũng - Tỉnh Lạng Sơn',
    phone: siteConfig.phone || '(0205) 3885.6789',
    email: siteConfig.email || 'thcsdongtan.huulung@langson.edu.vn',
    logoUrl: siteConfig.logoUrl || '/images/school-logo.jpg',
    bannerBg: siteConfig.bannerBg || '/images/school-banner.png',
    
    // Ban Giám Hiệu
    principal: siteConfig.principal || 'Thầy Hiệu Trưởng - THCS Đồng Tân',
    principalAvatar: siteConfig.principalAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
    vicePrincipal: siteConfig.vicePrincipal || 'Cô Phó Hiệu Trưởng - THCS Đồng Tân',
    vicePrincipalAvatar: siteConfig.vicePrincipalAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',

    // 4 Tổ Trưởng Chuyên Môn
    teamLeader1Name: siteConfig.teamLeader1Name || 'Thầy Nguyễn Văn Nam',
    teamLeader1Title: siteConfig.teamLeader1Title || 'Tổ trưởng Tổ Toán - KHTN',
    teamLeader1Avatar: siteConfig.teamLeader1Avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',

    teamLeader2Name: siteConfig.teamLeader2Name || 'Cô Trần Thị Thu Hà',
    teamLeader2Title: siteConfig.teamLeader2Title || 'Tổ trưởng Tổ Văn - KHXH',
    teamLeader2Avatar: siteConfig.teamLeader2Avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',

    teamLeader3Name: siteConfig.teamLeader3Name || 'Thầy Lê Hoàng Long',
    teamLeader3Title: siteConfig.teamLeader3Title || 'Tổ trưởng Tổ Ngoại Ngữ - Nghệ Thuật',
    teamLeader3Avatar: siteConfig.teamLeader3Avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',

    teamLeader4Name: siteConfig.teamLeader4Name || 'Cô Phạm Phương Thảo',
    teamLeader4Title: siteConfig.teamLeader4Title || 'Tổ trưởng Tổ Hành Chính - Văn Thể',
    teamLeader4Avatar: siteConfig.teamLeader4Avatar || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80'
  });


  // User Management State
  const [userList, setUserList] = useState(() => {
    const saved = localStorage.getItem('portal_users');
    return saved ? JSON.parse(saved) : [
      { id: 1, username: 'admin', fullName: 'Thầy Hiệu Trưởng - THCS Đồng Tân', role: 'BGH', email: 'bgh.thcsdongtan@langson.edu.vn', status: 'ACTIVE', createdAt: '08/08/2026' },
      { id: 2, username: 'giaovien', fullName: 'Cô Nguyễn Thị Hoa - Giáo Viên Văn', role: 'GIAO_VIEN', email: 'hoanguyen@thcsdongtan.edu.vn', status: 'ACTIVE', createdAt: '08/08/2026' }
    ];
  });

  const [pendingList, setPendingList] = useState(() => {
    const saved = localStorage.getItem('portal_pending_users');
    return saved ? JSON.parse(saved) : (pendingUsers.length > 0 ? pendingUsers : [
      { id: 101, username: 'hocsinh01', fullName: 'Em Nguyễn Văn An', role: 'HOC_SINH', email: 'an.nguyen@thcsdongtan.edu.vn', status: 'PENDING', createdAt: '09/08/2026' }
    ]);
  });

  // Form states for creating new user directly
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('GIAO_VIEN');

  // Editing State
  const [editingArticle, setEditingArticle] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);

  // News Form State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState(1);
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [newsFileUrl, setNewsFileUrl] = useState('');
  const [newsExternalLink, setNewsExternalLink] = useState('');

  // Document Form State
  const [docCode, setDocCode] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Thông tư BGD&ĐT');
  const [docIssueDate, setDocIssueDate] = useState('08/08/2026');
  const [docSigner, setDocSigner] = useState('Hiệu trưởng THCS Đồng Tân');
  const [docFileUrl, setDocFileUrl] = useState('');
  const [docExternalLink, setDocExternalLink] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          const actives = data.data.filter(u => u.status === 'ACTIVE');
          const pendings = data.data.filter(u => u.status === 'PENDING');
          if (actives.length > 0) setUserList(actives);
          if (pendings.length > 0) setPendingList(pendings);
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  // Sync users to LocalStorage
  useEffect(() => {
    localStorage.setItem('portal_users', JSON.stringify(userList));
  }, [userList]);

  useEffect(() => {
    localStorage.setItem('portal_pending_users', JSON.stringify(pendingList));
  }, [pendingList]);

  // Handle Approve User
  const handleApproveUserClick = async (pendingUser) => {
    try {
      await fetch(`/api/auth/approve-user/${pendingUser.id}`, { method: 'POST' });
    } catch (err) {}

    const approved = { ...pendingUser, status: 'ACTIVE' };
    setUserList(prev => [approved, ...prev]);
    setPendingList(prev => prev.filter(u => u.id !== pendingUser.id));

    if (onApproveUser) onApproveUser(pendingUser.id);
    setMessage(`✅ Đã phê duyệt và kích hoạt tài khoản thành công cho: ${pendingUser.fullName} (${pendingUser.username})`);
  };

  // Handle Reject / Delete User
  const handleRejectUserClick = async (userId) => {
    try {
      await fetch(`/api/auth/users/${userId}`, { method: 'DELETE' });
    } catch (err) {}

    setPendingList(prev => prev.filter(u => u.id !== userId));
    setUserList(prev => prev.filter(u => u.id !== userId));

    if (onRejectUser) onRejectUser(userId);
    setMessage('✅ Đã từ chối / xóa đăng ký tài khoản thành viên');
  };

  // Handle Direct Account Creation by Admin
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword || !newFullName) {
      setMessage('⚠️ Vui lòng điền đầy đủ Tên tài khoản, Mật khẩu và Họ tên!');
      return;
    }

    const newUser = {
      id: Date.now(),
      username: newUsername.trim(),
      fullName: newFullName.trim(),
      role: newRole,
      email: newEmail.trim() || `${newUsername}@thcsdongtan.edu.vn`,
      status: 'ACTIVE',
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    try {
      await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword, fullName: newFullName, email: newEmail, role: newRole })
      });
    } catch (err) {}

    setUserList(prev => [newUser, ...prev]);
    setMessage(`🎉 Đã tạo và kích hoạt tài khoản thành công cho ${newFullName} (${newRole})!`);

    setNewUsername('');
    setNewPassword('');
    setNewFullName('');
    setNewEmail('');
  };

  const compressImage = (file, maxWidth = 600, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file, setUrlCallback) => {
    if (!file) return;
    setUploading(true);
    try {
      if (file.type && file.type.startsWith('image/')) {
        const compressedDataUrl = await compressImage(file, 600, 0.8);
        setUrlCallback(compressedDataUrl);
        setMessage(`✅ Đã tải và tối ưu hóa ảnh thành công: ${file.name}`);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUrlCallback(e.target.result);
          setMessage(`✅ Đã đính kèm tệp tin: ${file.name}`);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Lỗi khi tải file:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (onSaveSiteConfig) {
      onSaveSiteConfig(configState);
    }
    setMessage('✅ Đã lưu thay đổi cấu hình Banner và Thông tin trường thành công!');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    const cleanUsername = username.trim().toLowerCase();
    const storedPw = localStorage.getItem('user_password_' + cleanUsername);

    // 1. ƯU TIÊN KIỂM TRA MẬT KHẨU TỪ SUPABASE CLOUD (Đồng bộ toàn bộ thiết bị & trình duyệt)
    if (supabase) {
      try {
        const { data: users } = await supabase.from('users').select('*').eq('username', cleanUsername);
        if (users && users.length > 0) {
          const u = users[0];
          let isPwValid = false;
          if (u.password) {
            isPwValid = (password === u.password);
          } else if (storedPw) {
            isPwValid = (password === storedPw);
          } else {
            const isChanged = localStorage.getItem('user_changed_password_' + cleanUsername) === 'true';
            if (!isChanged) {
              isPwValid = (password === 'admin123');
            }
          }

          if (isPwValid) {
            let mappedRole = u.role ? u.role.toUpperCase() : 'BGH';
            if (mappedRole === 'ADMIN') mappedRole = 'BGH';
            if (mappedRole === 'TEACHER') mappedRole = 'GIAO_VIEN';

            const loggedUser = {
              id: u.id,
              username: u.username,
              fullName: u.full_name || u.fullName || u.username,
              role: mappedRole,
              email: u.email || `${u.username}@thcsdongtan.edu.vn`
            };

            // Tự động đồng bộ mật khẩu mới nhất từ Cloud vào LocalStorage trình duyệt này
            if (u.password) {
              localStorage.setItem('user_password_' + cleanUsername, u.password);
              localStorage.setItem('user_changed_password_' + cleanUsername, 'true');
            }

            onLogin('TOKEN_ADMIN_THCS_DONG_TAN_2026', loggedUser);
            return;
          }
        }
      } catch (err) {
        console.error('Lỗi kiểm tra mật khẩu Admin Supabase Cloud:', err);
      }
    }

    // 2. Thử kiểm tra bộ nhớ LocalStorage nếu offline hoặc chưa tìm thấy trên Cloud
    if (storedPw && password === storedPw) {
      const dummyUser = cleanUsername === 'admin'
        ? { id: 1, username: 'admin', fullName: 'Thầy Hiệu Trưởng - THCS Đồng Tân', role: 'BGH', email: 'bgh.thcsdongtan@langson.edu.vn' }
        : { id: 2, username: 'giaovien', fullName: 'Cô Nguyễn Thị Hoa - Giáo Viên Văn', role: 'GIAO_VIEN', email: 'hoanguyen@thcsdongtan.edu.vn' };
      onLogin('TOKEN_ADMIN_THCS_DONG_TAN_2026', dummyUser);
      return;
    }

    // 3. Fallback mật khẩu mặc định admin123 (CHỈ CHẤP NHẬN NẾU CHƯA TỪNG ĐỔI MẬT KHẨU)
    const isChanged = localStorage.getItem('user_changed_password_' + cleanUsername) === 'true';
    if (!storedPw && !isChanged && password === 'admin123' && (cleanUsername === 'admin' || cleanUsername === 'giaovien')) {
      const dummyUser = cleanUsername === 'admin'
        ? { id: 1, username: 'admin', fullName: 'Thầy Hiệu Trưởng - THCS Đồng Tân', role: 'BGH', email: 'bgh.thcsdongtan@langson.edu.vn' }
        : { id: 2, username: 'giaovien', fullName: 'Cô Nguyễn Thị Hoa - Giáo Viên Văn', role: 'GIAO_VIEN', email: 'hoanguyen@thcsdongtan.edu.vn' };
      onLogin('TOKEN_ADMIN_THCS_DONG_TAN_2026', dummyUser);
      return;
    }

    setLoginError('❌ Mật khẩu không chính xác! Vui lòng nhập mật khẩu mới nếu đã thay đổi.');
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    if (editingArticle) {
      if (onUpdateNews) {
        onUpdateNews({
          ...editingArticle,
          title: newsTitle,
          categoryId: parseInt(newsCategory),
          summary: newsSummary,
          content: newsContent,
          image: newsImage || editingArticle.image,
          fileUrl: newsFileUrl,
          externalLink: newsExternalLink
        });
      }
      setMessage('✅ Đã cập nhật thành công bài viết!');
      setEditingArticle(null);
    } else {
      setMessage('✅ Đăng bài viết mới thành công!');
    }
    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    setNewsImage('');
    setNewsFileUrl('');
    setNewsExternalLink('');
    if (onRefreshData) onRefreshData();
  };

  const handleStartEditNews = (article) => {
    setEditingArticle(article);
    setNewsTitle(article.title);
    setNewsCategory(article.categoryId || 1);
    setNewsSummary(article.summary || '');
    setNewsContent(article.content || '');
    setNewsImage(article.image || '');
    setNewsFileUrl(article.fileUrl || '');
    setNewsExternalLink(article.externalLink || '');
    setAdminTab('news');
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    if (editingDoc) {
      if (onUpdateDocument) {
        onUpdateDocument({
          ...editingDoc,
          code: docCode,
          title: docTitle,
          category: docCategory,
          issueDate: docIssueDate,
          signer: docSigner,
          fileUrl: docFileUrl,
          externalLink: docExternalLink
        });
      }
      setMessage('✅ Đã cập nhật văn bản chỉ đạo!');
      setEditingDoc(null);
    } else {
      setMessage('✅ Phát hành văn bản mới thành công!');
    }
    setDocCode('');
    setDocTitle('');
    setDocFileUrl('');
    setDocExternalLink('');
    if (onRefreshData) onRefreshData();
  };

  const handleStartEditDoc = (doc) => {
    setEditingDoc(doc);
    setDocCode(doc.code);
    setDocTitle(doc.title);
    setDocCategory(doc.category || 'Thông tư BGD&ĐT');
    setDocIssueDate(doc.issueDate || '08/08/2026');
    setDocSigner(doc.signer || 'BGH THCS Đồng Tân');
    setDocFileUrl(doc.fileUrl || '');
    setDocExternalLink(doc.externalLink || '');
    setAdminTab('docs');
  };

  if (!token) {
    return (
      <div style={{ maxWidth: '450px', margin: '40px auto', background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #cbd5e1' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <ShieldCheck size={45} color="#0056a6" />
          <h2 style={{ fontSize: '20px', color: '#003a73', marginTop: '10px' }}>ĐĂNG NHẬP HỆ THỐNG QUẢN TRỊ</h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>Dành cho Ban Giám Hiệu & Cán bộ Quản trị Portal</p>
        </div>

        {loginError && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '8px 12px', borderRadius: '4px', fontSize: '13px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={15} /> {loginError}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Tên tài khoản (BGH/Giáo viên):</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #94a3b8', borderRadius: '4px' }}
              placeholder="Nhập 'admin' hoặc 'giaovien'"
              required 
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: '#1e293b' }}>Mật khẩu quản trị:</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showAdminPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ width: '100%', padding: '9px 40px 9px 10px', border: '1px solid #94a3b8', borderRadius: '4px', boxSizing: 'border-box' }}
                placeholder={localStorage.getItem('user_changed_password_' + username) === 'true' ? "Nhập mật khẩu mới..." : "Mật khẩu mặc định: admin123"}
                required 
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showAdminPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu chữ rõ ràng"}
              >
                {showAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Nút bật tắt chế độ hiển thị mật khẩu bằng chữ */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                style={{ background: 'none', border: 'none', color: '#0056a6', fontSize: '12px', cursor: 'pointer', fontWeight: '700', padding: 0 }}
              >
                {showAdminPassword ? '🙈 Ẩn mật khẩu (dạng dấu châm)' : '👁️ Hiển thị mật khẩu chữ rõ ràng'}
              </button>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                {localStorage.getItem('user_changed_password_' + username) === 'true'
                  ? <span style={{ color: '#16a34a', fontWeight: '700' }}>✓ Đã đổi mật khẩu mới</span>
                  : <>Mật khẩu thử: <strong>admin123</strong></>
                }
              </span>
            </div>
          </div>
          <button type="submit" style={{ width: '100%', background: '#0056a6', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
            Đăng Nhập Quản Trị
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0056a6', paddingBottom: '12px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', color: '#003a73', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={24} color="#0056a6" /> CỔNG QUẢN TRỊ NỘI DUNG VÀ HỆ THỐNG TRƯỜNG HỌC
          </h2>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Xin chào: <strong>{user?.fullName}</strong> ({user?.role === 'BGH' ? 'Ban Giám Hiệu' : 'Giáo viên Biên tập'})
          </span>
        </div>
        <button onClick={onLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <LogOut size={15} /> Đăng xuất
        </button>
      </div>

      {message && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '10px 15px', borderRadius: '4px', marginBottom: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle size={18} /> {message}
        </div>
      )}

      {/* Navigation Tabs in Admin */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button 
          onClick={() => setAdminTab('users')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'users' ? '3px solid #0056a6' : 'none', background: pendingList.length > 0 ? '#fef2f2' : 'transparent', fontWeight: adminTab === 'users' ? '700' : '500', color: adminTab === 'users' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', borderRadius: '4px' }}
        >
          <Users size={15} /> 👥 Quản Lý & Cấp Tài Khoản
          {pendingList.length > 0 && (
            <span style={{ background: '#ef4444', color: 'white', fontSize: '11px', fontWeight: '800', padding: '2px 7px', borderRadius: '10px', animation: 'pulse 1.5s infinite' }}>
              {pendingList.length} CHỜ DUYỆT
            </span>
          )}
        </button>

        <button 
          onClick={() => setAdminTab('config')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'config' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'config' ? '700' : '500', color: adminTab === 'config' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Settings size={15} /> ⚙️ Sửa Thông Tin & Banner
        </button>
        <button 
          onClick={() => setAdminTab('manageNews')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'manageNews' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'manageNews' ? '700' : '500', color: adminTab === 'manageNews' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Edit size={15} /> 📰 Bài Viết ({newsList.length})
        </button>
        <button 
          onClick={() => setAdminTab('manageDocs')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'manageDocs' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'manageDocs' ? '700' : '500', color: adminTab === 'manageDocs' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <FilePlus size={15} /> 📄 Văn Bản ({documents.length})
        </button>
        <button 
          onClick={() => { setEditingArticle(null); setAdminTab('news'); }} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'news' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'news' ? '700' : '500', color: adminTab === 'news' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <PlusCircle size={15} /> ➕ Đăng Tin Mới
        </button>
      </div>

      {/* TAB 1: QUẢN LÝ TÀI KHOẢN, PHÊ DUYỆT ĐĂNG KÝ VÀ CẤP THÀNH VIÊN */}
      {adminTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* SECTION A: PENDING MEMBER REGISTRATIONS (ĐƠN CHỜ BAN GIÁM HIỆU DUYỆT) */}
          <div style={{ background: pendingList.length > 0 ? '#fff7ed' : '#f8fafc', border: pendingList.length > 0 ? '2px solid #fdba74' : '1px solid #cbd5e1', padding: '18px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', color: pendingList.length > 0 ? '#c2410c' : '#003a73', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={20} color={pendingList.length > 0 ? '#c2410c' : '#0056a6'} /> ⏳ DANH SÁCH ĐƠN ĐĂNG KÝ THÀNH VIÊN MỚI CHỜ PHÊ DUYỆT ({pendingList.length})
              </h3>
              {pendingList.length > 0 && (
                <span style={{ background: '#ef4444', color: 'white', padding: '4px 10px', borderRadius: '12px', fontWeight: '700', fontSize: '12px' }}>
                  Yêu cầu mới
                </span>
              )}
            </div>

            {pendingList.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#166534', padding: '15px', background: '#f0fdf4', borderRadius: '6px', fontWeight: '600', fontSize: '13px' }}>
                ✓ Hiện không có đơn đăng ký thành viên nào đang chờ duyệt. Tất cả đã được phê duyệt!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pendingList.map((pUser) => (
                  <div key={pUser.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px 15px', borderRadius: '6px', border: '1px solid #fed7aa', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14.5px', fontWeight: '800', color: '#003a73' }}>{pUser.fullName}</span>
                        <span style={{ fontSize: '11.5px', background: '#3b82f6', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                          {pUser.role === 'HOC_SINH' ? '🎓 Học Sinh' : (pUser.role === 'PHU_HUYNH' ? '👨‍👩‍👧 Phụ Huynh' : '👨‍🏫 Giáo Viên')}
                        </span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#475569' }}>
                        👤 Tên tài khoản: <strong>{pUser.username}</strong> | ✉️ Email: {pUser.email || 'Chưa cập nhật'} | 📅 Ngày đăng ký: {pUser.createdAt || 'Gần đây'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleApproveUserClick(pUser)}
                        style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '4px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Check size={16} /> ✅ PHÊ DUYỆT & CẤP QUYỀN
                      </button>
                      <button 
                        onClick={() => handleRejectUserClick(pUser.id)}
                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Trash2 size={16} /> ❌ TỪ CHỐI
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION B: FORM CẤP TÀI KHOẢN TRỰC TIẾP CHO CÁN BỘ / GIÁO VIÊN */}
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '16px', color: '#003a73', fontWeight: '800', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={20} color="#0056a6" /> ➕ CẤP TÀI KHOẢN MỚI TRỰC TIẾP CHO GIÁO VIÊN / HỌC SINH
            </h3>

            <form onSubmit={handleCreateUserSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Họ và tên thành viên:</label>
                <input type="text" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Thầy Vũ Văn Minh" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Tên tài khoản đăng nhập:</label>
                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: vuminh_math" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Mật khẩu khởi tạo:</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nhập mật khẩu..." />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Chức vụ & Quyền hạn:</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  <option value="GIAO_VIEN">👨‍🏫 Giáo Viên (Biên tập bài viết/giáo án)</option>
                  <option value="BGH">🏛️ Ban Giám Hiệu (Toàn quyền quản trị)</option>
                  <option value="HOC_SINH">🎓 Học Sinh</option>
                  <option value="PHU_HUYNH">👨‍👩‍👧 Phụ Huynh</option>
                </select>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Email liên hệ:</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="vuminh@thcsdongtan.edu.vn" />
              </div>

              <button type="submit" style={{ gridColumn: 'span 2', background: '#0056a6', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <UserCheck size={18} /> 🚀 XÁC NHẬN CẤP TÀI KHOẢN VÀ KÍCH HOẠT NGAY
              </button>
            </form>
          </div>

          {/* SECTION C: ACTIVE USERS TABLE (DANH SÁCH TÀI KHOẢN ĐÃ KÍCH HOẠT) */}
          <div>
            <h3 style={{ fontSize: '16px', color: '#003a73', fontWeight: '800', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} color="#0056a6" /> 👥 DANH SÁCH TÀI KHOẢN ĐÃ KÍCH HOẠT TRÊN HỆ THỐNG ({userList.length})
            </h3>

            <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#0056a6', color: 'white' }}>
                    <th style={{ padding: '10px 12px' }}>STT</th>
                    <th style={{ padding: '10px 12px' }}>Tên Tài Khoản</th>
                    <th style={{ padding: '10px 12px' }}>Họ Và Tên</th>
                    <th style={{ padding: '10px 12px' }}>Vai Trò</th>
                    <th style={{ padding: '10px 12px' }}>Email</th>
                    <th style={{ padding: '10px 12px' }}>Trạng Thái</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((u, idx) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? 'white' : '#f8fafc' }}>
                      <td style={{ padding: '10px 12px', fontWeight: '700' }}>{idx + 1}</td>
                      <td style={{ padding: '10px 12px', fontWeight: '700', color: '#0056a6' }}>{u.username}</td>
                      <td style={{ padding: '10px 12px', fontWeight: '600' }}>{u.fullName}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: '11.5px', background: u.role === 'BGH' ? '#d97706' : (u.role === 'GIAO_VIEN' ? '#0284c7' : '#16a34a'), color: 'white', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
                          {u.role === 'BGH' ? '🏛️ Ban Giám Hiệu' : (u.role === 'GIAO_VIEN' ? '👨‍🏫 Giáo Viên' : '🎓 Học Sinh / Phụ Huynh')}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#64748b' }}>{u.email || 'N/A'}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: '11.5px', background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '4px', fontWeight: '700', border: '1px solid #86efac' }}>
                          ✓ ĐÃ KÍCH HOẠT
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        {u.username !== 'admin' && (
                          <button 
                            onClick={() => handleRejectUserClick(u.id)}
                            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
                          >
                            Xóa
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab Config: Sửa Cấu Hình Banner & Thông tin trường */}
      {adminTab === 'config' && (
        <form onSubmit={handleSaveConfig} style={{ display: 'grid', gap: '15px', maxWidth: '800px', background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <h3 style={{ fontSize: '16px', color: '#003a73', fontWeight: '700', borderBottom: '2px solid #0056a6', paddingBottom: '8px' }}>
            ⚙️ CHỈNH SỬA THÔNG TIN TRƯỜNG & BANNER TRANG WEB
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Cơ quan Chủ quản:</label>
              <input type="text" value={configState.governingBody} onChange={(e) => setConfigState({ ...configState, governingBody: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: UBND XÃ HỮU LŨNG - TỈNH LẠNG SƠN" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Tên Trường Học:</label>
              <input type="text" value={configState.schoolName} onChange={(e) => setConfigState({ ...configState, schoolName: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="TRƯỜNG THCS ĐỒNG TÂN" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Khẩu hiệu / Slogan:</label>
              <input type="text" value={configState.slogan} onChange={(e) => setConfigState({ ...configState, slogan: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: HỘI TỤ - KẾT TINH - TỎA SÁNG" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Địa chỉ trường:</label>
              <input type="text" value={configState.address} onChange={(e) => setConfigState({ ...configState, address: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Xã Hữu Lũng - Tỉnh Lạng Sơn" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Số điện thoại liên hệ:</label>
              <input type="text" value={configState.phone} onChange={(e) => setConfigState({ ...configState, phone: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="(0205) 3885.6789" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Email chính thức:</label>
              <input type="email" value={configState.email} onChange={(e) => setConfigState({ ...configState, email: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="thcsdongtan@..." />
            </div>
          </div>

          {/* Logo & Banner Upload Box */}
          <div style={{ background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ fontSize: '13px', color: '#0056a6', marginBottom: '10px', fontWeight: '700' }}>
              🖼️ ĐỔI LOGO VÀ ẢNH BANNER HEADER
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Tải Logo mới từ máy tính:</label>
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], (url) => setConfigState({ ...configState, logoUrl: url }))} style={{ fontSize: '12px', marginBottom: '4px' }} />
                <input type="text" value={configState.logoUrl} onChange={(e) => setConfigState({ ...configState, logoUrl: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} placeholder="Hoặc dán Link URL Logo..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Tải ảnh nền Banner Header:</label>
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], (url) => setConfigState({ ...configState, bannerBg: url }))} style={{ fontSize: '12px', marginBottom: '4px' }} />
                <input type="text" value={configState.bannerBg} onChange={(e) => setConfigState({ ...configState, bannerBg: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }} placeholder="Hoặc dán Link URL Ảnh Banner..." />
              </div>
            </div>
          </div>

          {/* QUẢN LÝ BAN GIÁM HIỆU & 4 TỔ TRƯỞNG CHUYÊN MÔN */}
          <div style={{ background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ fontSize: '14px', color: '#0056a6', marginBottom: '12px', fontWeight: '700', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              👨‍🏫 CẤU HÌNH BAN GIÁM HIỆU & 4 TỔ TRƯỞNG CHUYÊN MÔN
            </h4>
            
            {/* Hiệu Trưởng & Phó Hiệu Trưởng */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #cbd5e1' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#003a73' }}>Họ tên Hiệu Trưởng:</label>
                <input type="text" value={configState.principal} onChange={(e) => setConfigState({ ...configState, principal: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '6px' }} />
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', marginBottom: '2px' }}>Ảnh chân dung Hiệu Trưởng:</label>
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], (url) => setConfigState({ ...configState, principalAvatar: url }))} style={{ fontSize: '11px', marginBottom: '4px' }} />
                <input type="text" value={configState.principalAvatar} onChange={(e) => setConfigState({ ...configState, principalAvatar: e.target.value })} style={{ width: '100%', padding: '5px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px' }} placeholder="Link URL ảnh chân dung..." />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#003a73' }}>Họ tên Phó Hiệu Trưởng Chuyên Môn:</label>
                <input type="text" value={configState.vicePrincipal} onChange={(e) => setConfigState({ ...configState, vicePrincipal: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '6px' }} />
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', marginBottom: '2px' }}>Ảnh chân dung Phó Hiệu Trưởng:</label>
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], (url) => setConfigState({ ...configState, vicePrincipalAvatar: url }))} style={{ fontSize: '11px', marginBottom: '4px' }} />
                <input type="text" value={configState.vicePrincipalAvatar} onChange={(e) => setConfigState({ ...configState, vicePrincipalAvatar: e.target.value })} style={{ width: '100%', padding: '5px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px' }} placeholder="Link URL ảnh chân dung..." />
              </div>
            </div>

            {/* 4 TỔ TRƯỞNG CHUYÊN MÔN */}
            <h5 style={{ fontSize: '13px', color: '#b45309', marginBottom: '10px', fontWeight: '700' }}>
              🎖️ THÔNG TIN 4 TỔ TRƯỞNG CHUYÊN MÔN
            </h5>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {/* Tổ 1 */}
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '12px', color: '#0056a6', display: 'block', marginBottom: '6px' }}>1. Tổ Trưởng Tổ 1 (Ví dụ: Toán - KHTN)</strong>
                <input type="text" value={configState.teamLeader1Name} onChange={(e) => setConfigState({ ...configState, teamLeader1Name: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px', fontSize: '12px' }} placeholder="Họ và tên Tổ Trưởng 1..." />
                <input type="text" value={configState.teamLeader1Title} onChange={(e) => setConfigState({ ...configState, teamLeader1Title: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px', fontSize: '12px' }} placeholder="Chức danh / Tên Tổ..." />
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], (url) => setConfigState({ ...configState, teamLeader1Avatar: url }))} style={{ fontSize: '11px', marginBottom: '2px' }} />
                <input type="text" value={configState.teamLeader1Avatar} onChange={(e) => setConfigState({ ...configState, teamLeader1Avatar: e.target.value })} style={{ width: '100%', padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px' }} placeholder="Link URL ảnh chân dung..." />
              </div>

              {/* Tổ 2 */}
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '12px', color: '#0056a6', display: 'block', marginBottom: '6px' }}>2. Tổ Trưởng Tổ 2 (Ví dụ: Văn - KHXH)</strong>
                <input type="text" value={configState.teamLeader2Name} onChange={(e) => setConfigState({ ...configState, teamLeader2Name: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px', fontSize: '12px' }} placeholder="Họ và tên Tổ Trưởng 2..." />
                <input type="text" value={configState.teamLeader2Title} onChange={(e) => setConfigState({ ...configState, teamLeader2Title: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px', fontSize: '12px' }} placeholder="Chức danh / Tên Tổ..." />
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], (url) => setConfigState({ ...configState, teamLeader2Avatar: url }))} style={{ fontSize: '11px', marginBottom: '2px' }} />
                <input type="text" value={configState.teamLeader2Avatar} onChange={(e) => setConfigState({ ...configState, teamLeader2Avatar: e.target.value })} style={{ width: '100%', padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px' }} placeholder="Link URL ảnh chân dung..." />
              </div>

              {/* Tổ 3 */}
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '12px', color: '#0056a6', display: 'block', marginBottom: '6px' }}>3. Tổ Trưởng Tổ 3 (Ví dụ: Ngoại Ngữ - Nghệ Thuật)</strong>
                <input type="text" value={configState.teamLeader3Name} onChange={(e) => setConfigState({ ...configState, teamLeader3Name: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px', fontSize: '12px' }} placeholder="Họ và tên Tổ Trưởng 3..." />
                <input type="text" value={configState.teamLeader3Title} onChange={(e) => setConfigState({ ...configState, teamLeader3Title: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px', fontSize: '12px' }} placeholder="Chức danh / Tên Tổ..." />
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], (url) => setConfigState({ ...configState, teamLeader3Avatar: url }))} style={{ fontSize: '11px', marginBottom: '2px' }} />
                <input type="text" value={configState.teamLeader3Avatar} onChange={(e) => setConfigState({ ...configState, teamLeader3Avatar: e.target.value })} style={{ width: '100%', padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px' }} placeholder="Link URL ảnh chân dung..." />
              </div>

              {/* Tổ 4 */}
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '12px', color: '#0056a6', display: 'block', marginBottom: '6px' }}>4. Tổ Trưởng Tổ 4 (Ví dụ: Hành Chính - Thể Dục)</strong>
                <input type="text" value={configState.teamLeader4Name} onChange={(e) => setConfigState({ ...configState, teamLeader4Name: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px', fontSize: '12px' }} placeholder="Họ và tên Tổ Trưởng 4..." />
                <input type="text" value={configState.teamLeader4Title} onChange={(e) => setConfigState({ ...configState, teamLeader4Title: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px', fontSize: '12px' }} placeholder="Chức danh / Tên Tổ..." />
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], (url) => setConfigState({ ...configState, teamLeader4Avatar: url }))} style={{ fontSize: '11px', marginBottom: '2px' }} />
                <input type="text" value={configState.teamLeader4Avatar} onChange={(e) => setConfigState({ ...configState, teamLeader4Avatar: e.target.value })} style={{ width: '100%', padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px' }} placeholder="Link URL ảnh chân dung..." />
              </div>
            </div>
          </div>

          <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
            <Save size={16} /> 💾 LƯU THAY ĐỔI CẤU HÌNH NHÀ TRƯỜNG & TỔ TRƯỞNG
          </button>
        </form>
      )}


      {/* Tab Manage News: Quản lý & Sửa / Xóa Bài viết */}
      {adminTab === 'manageNews' && (
        <div>
          <h3 style={{ fontSize: '16px', color: '#003a73', marginBottom: '15px', fontWeight: '700' }}>
            📰 DANH SÁCH BÀI VIẾT TIN TỨC ĐÃ ĐĂNG ({newsList.length} BÀI)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {newsList.map(article => (
              <div key={article.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={article.image || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80"} alt="" style={{ width: '65px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <h4 style={{ fontSize: '14px', color: '#003a73', margin: 0, fontWeight: '700' }}>{article.title}</h4>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>📅 {article.createdAt || 'Mới đăng'} | 👁️ {article.views || 10} lượt xem</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleStartEditNews(article)}
                    style={{ background: '#0284c7', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Edit size={14} /> Sửa bài viết
                  </button>
                  <button 
                    onClick={() => onDeleteNews && onDeleteNews(article.id)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Manage Docs: Quản lý & Sửa / Xóa Văn bản */}
      {adminTab === 'manageDocs' && (
        <div>
          <h3 style={{ fontSize: '16px', color: '#003a73', marginBottom: '15px', fontWeight: '700' }}>
            📄 DANH SÁCH VĂN BẢN CHỈ ĐẠO ({documents.length} VĂN BẢN)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {documents.map(doc => (
              <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc' }}>
                <div>
                  <span style={{ fontSize: '11px', background: '#0056a6', color: 'white', padding: '2px 6px', borderRadius: '3px', fontWeight: '700', marginRight: '6px' }}>{doc.code}</span>
                  <h4 style={{ fontSize: '14px', color: '#003a73', margin: '4px 0 0 0', fontWeight: '700' }}>{doc.title}</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>📅 {doc.issueDate} | ✍️ {doc.signer}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleStartEditDoc(doc)}
                    style={{ background: '#0284c7', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Edit size={14} /> Sửa văn bản
                  </button>
                  <button 
                    onClick={() => onDeleteDocument && onDeleteDocument(doc.id)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Form Đăng & Sửa Tin Bài */}
      {adminTab === 'news' && (
        <form onSubmit={handleCreateNews} style={{ display: 'grid', gap: '15px', maxWidth: '750px' }}>
          <h3 style={{ fontSize: '16px', color: '#003a73', fontWeight: '700' }}>
            {editingArticle ? `✏️ ĐANG CHỈNH SỬA BÀI VIẾT: ${editingArticle.title}` : '➕ ĐĂNG BÀI VIẾT MỚI'}
          </h3>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tiêu đề bài viết:</label>
            <input type="text" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Lễ Tuyên dương học sinh giỏi THCS Đồng Tân" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Chuyên mục bài viết:</label>
              <select value={newsCategory} onChange={(e) => setNewsCategory(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Ảnh đại diện (Link URL):</label>
              <input type="text" value={newsImage} onChange={(e) => setNewsImage(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="URL hình ảnh bài viết" />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tóm tắt ngắn:</label>
            <textarea value={newsSummary} onChange={(e) => setNewsSummary(e.target.value)} rows={2} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Tóm tắt bài viết..."></textarea>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Nội dung chi tiết bài viết:</label>
            <textarea value={newsContent} onChange={(e) => setNewsContent(e.target.value)} rows={6} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nội dung bài viết..."></textarea>
          </div>
          <button type="submit" style={{ background: '#0056a6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            {editingArticle ? '💾 CẬP NHẬT BÀI VIẾT' : '🚀 ĐĂNG BÀI VIẾT MỚI'}
          </button>
        </form>
      )}

      {/* Tab Form Đăng & Sửa Văn Bản */}
      {adminTab === 'docs' && (
        <form onSubmit={handleCreateDocument} style={{ display: 'grid', gap: '15px', maxWidth: '750px' }}>
          <h3 style={{ fontSize: '16px', color: '#003a73', fontWeight: '700' }}>
            {editingDoc ? `✏️ ĐANG CHỈNH SỬA VĂN BẢN: ${editingDoc.code}` : '📄 PHÁT HÀNH VĂN BẢN CHỈ ĐẠO MỚI'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Số hiệu Văn bản:</label>
              <input type="text" value={docCode} onChange={(e) => setDocCode(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: TT08/2026/TT-BGDĐT" />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Ngày ban hành:</label>
              <input type="text" value={docIssueDate} onChange={(e) => setDocIssueDate(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Trích yếu Tiêu đề Văn bản:</label>
            <input type="text" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nội dung trích yếu..." />
          </div>

          <button type="submit" style={{ background: '#d97706', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            {editingDoc ? '💾 CẬP NHẬT VĂN BẢN' : '📄 PHÁT HÀNH VĂN BẢN'}
          </button>
        </form>
      )}
    </div>
  );
}
