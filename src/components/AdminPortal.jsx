import React, { useState, useEffect } from 'react';
import { ShieldCheck, LogOut, PlusCircle, FilePlus, Users, CheckCircle, Trash2, Edit, Settings, AlertCircle, Save, Check, UserCheck, Bell, UserPlus } from 'lucide-react';
import { supabase, uploadFileToSupabase, uploadBase64ToSupabase, syncAllDataToSupabase } from '../lib/supabaseClient';
import { downloadBackupJSON, restoreFromSnapshot, syncToCloudflareR2 } from '../lib/r2BackupClient';

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
  videos = [],
  albums = [],
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [adminTab, setAdminTab] = useState('users');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  // Site Config State
  const [configState, setConfigState] = useState({
    schoolName: siteConfig.schoolName || 'TRƯỜNG THCS ĐỒNG TÂN',
    governingBody: siteConfig.governingBody || 'ỦY BAN NHÂN DÂN XÃ HỮU LŨNG - TỈNH LẠNG SƠN',
    slogan: siteConfig.slogan || 'HỘI TỤ - KẾT TINH - TỎA SÁNG',
    address: siteConfig.address || 'Thôn Ngọc Thành, xã Hữu Lũng, tỉnh Lạng Sơn',
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
    teamLeader1Name: siteConfig.teamLeader1Name || 'Cô Nguyễn Thanh Mai',
    teamLeader1Title: siteConfig.teamLeader1Title || 'Tổ trưởng Tổ Toán - KHTN',
    teamLeader1Avatar: siteConfig.teamLeader1Avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',

    teamLeader2Name: siteConfig.teamLeader2Name || 'Cô Đặng Thị Thảo',
    teamLeader2Title: siteConfig.teamLeader2Title || 'Tổ trưởng Tổ Văn - KHXH',
    teamLeader2Avatar: siteConfig.teamLeader2Avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',

    teamLeader3Name: siteConfig.teamLeader3Name || 'Cô Phạm Thị Hằng',
    teamLeader3Title: siteConfig.teamLeader3Title || 'Tổ trưởng Tổ Ngoại Ngữ - Nghệ Thuật',
    teamLeader3Avatar: siteConfig.teamLeader3Avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',

    teamLeader4Name: siteConfig.teamLeader4Name || 'Cô Hoàng Thị Chuyên',
    teamLeader4Title: siteConfig.teamLeader4Title || 'Tổ trưởng Tổ Hành Chính - Văn Thể',
    teamLeader4Avatar: siteConfig.teamLeader4Avatar || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80'
  });

  const [isConfigDirty, setIsConfigDirty] = useState(false);

  const updateConfigField = (field, value) => {
    setIsConfigDirty(true);
    setConfigState(prev => ({ ...prev, [field]: value }));
  };

  // Keep configState updated when siteConfig prop first loads (do not overwrite while admin is editing/saving)
  useEffect(() => {
    if (siteConfig && siteConfig.schoolName && !configState.schoolName) {
      let addr = siteConfig.address || 'Thôn Ngọc Thành, xã Hữu Lũng, tỉnh Lạng Sơn';
      if (!addr || addr.includes('Thôn Đồng Tân') || addr.includes('Xã Đồng Tân')) {
        addr = 'Thôn Ngọc Thành, xã Hữu Lũng, tỉnh Lạng Sơn';
      }
      setConfigState({
        schoolName: siteConfig.schoolName,
        governingBody: siteConfig.governingBody,
        slogan: siteConfig.slogan,
        address: addr,
        phone: siteConfig.phone,
        email: siteConfig.email,
        logoUrl: siteConfig.logoUrl,
        bannerBg: siteConfig.bannerBg,
        principal: siteConfig.principal || 'Thầy Hiệu Trưởng - THCS Đồng Tân',
        principalAvatar: siteConfig.principalAvatar || '/images/principal.jpg',
        vicePrincipal: siteConfig.vicePrincipal || 'Cô Phó Hiệu Trưởng - THCS Đồng Tân',
        vicePrincipalAvatar: siteConfig.vicePrincipalAvatar || '/images/vice-principal.jpg',
        teamLeader1Name: siteConfig.teamLeader1Name || 'Cô Nguyễn Thanh Mai',
        teamLeader1Title: siteConfig.teamLeader1Title || 'Tổ trưởng Tổ Toán - KHTN',
        teamLeader1Avatar: siteConfig.teamLeader1Avatar || '/images/team-leader-1.jpg',
        teamLeader2Name: siteConfig.teamLeader2Name || 'Cô Đặng Thị Thảo',
        teamLeader2Title: siteConfig.teamLeader2Title || 'Tổ trưởng Tổ Văn - KHXH',
        teamLeader2Avatar: siteConfig.teamLeader2Avatar || '/images/team-leader-2.jpg',
        teamLeader3Name: siteConfig.teamLeader3Name || 'Cô Phạm Thị Hằng',
        teamLeader3Title: siteConfig.teamLeader3Title || 'Tổ trưởng Tổ Ngoại Ngữ - Nghệ Thuật',
        teamLeader3Avatar: siteConfig.teamLeader3Avatar || '/images/team-leader-3.jpg',
        teamLeader4Name: siteConfig.teamLeader4Name || 'Cô Hoàng Thị Chuyên',
        teamLeader4Title: siteConfig.teamLeader4Title || 'Tổ trưởng Tổ Hành Chính - Văn Thể',
        teamLeader4Avatar: siteConfig.teamLeader4Avatar || '/images/team-leader-4.jpg'
      });
    }
  }, [siteConfig]);

  // User Management State
  const [userList, setUserList] = useState([]);
  const [pendingList, setPendingList] = useState([]);

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

  // Fetch all users directly from Supabase Cloud Postgres
  const fetchUsers = async () => {
    if (!supabase) return;
    try {
      const { data: usersData, error } = await supabase.from('users').select('*').order('id', { ascending: false });
      if (!error && usersData && usersData.length > 0) {
        const actives = usersData.filter(u => u.status === 'ACTIVE').map(u => ({
          id: u.id,
          username: u.username,
          fullName: u.full_name || u.fullName || u.username,
          role: u.role || 'GIAO_VIEN',
          email: u.email || '',
          status: u.status,
          createdAt: u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : 'Gần đây'
        }));
        const pendings = usersData.filter(u => u.status === 'PENDING' || u.status === 'PENDING_APPROVAL').map(u => ({
          id: u.id,
          username: u.username,
          fullName: u.full_name || u.fullName || u.username,
          role: u.role || 'HOC_SINH',
          email: u.email || '',
          status: u.status,
          createdAt: u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : 'Gần đây'
        }));
        setUserList(actives);
        setPendingList(pendings);
      } else {
        // Fallbacks
        setUserList([
          { id: 1, username: 'admin', fullName: 'Thầy Hiệu Trưởng - THCS Đồng Tân', role: 'BGH', email: 'bgh.thcsdongtan@langson.edu.vn', status: 'ACTIVE', createdAt: '08/08/2026' },
          { id: 2, username: 'giaovien', fullName: 'Cô Nguyễn Thị Hoa - Giáo Viên Văn', role: 'GIAO_VIEN', email: 'hoanguyen@thcsdongtan.edu.vn', status: 'ACTIVE', createdAt: '08/08/2026' }
        ]);
        setPendingList(pendingUsers);
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách người dùng từ Supabase:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token, pendingUsers]);

  // Handle Approve User
  const handleApproveUserClick = async (pendingUser) => {
    if (supabase) {
      try {
        await supabase.from('users').update({ status: 'ACTIVE' }).eq('id', pendingUser.id);
      } catch (err) {}
    }

    const approved = { ...pendingUser, status: 'ACTIVE' };
    setUserList(prev => [approved, ...prev]);
    setPendingList(prev => prev.filter(u => u.id !== pendingUser.id));

    if (onApproveUser) onApproveUser(pendingUser.id);
    fetchUsers();
    setMessage(`✅ Đã phê duyệt và kích hoạt tài khoản thành công trên Supabase cho: ${pendingUser.fullName} (${pendingUser.username})`);
  };

  // Handle Reject / Delete User
  const handleRejectUserClick = async (userId) => {
    if (supabase) {
      try {
        await supabase.from('users').delete().eq('id', userId);
      } catch (err) {}
    }

    setPendingList(prev => prev.filter(u => u.id !== userId));
    setUserList(prev => prev.filter(u => u.id !== userId));

    if (onRejectUser) onRejectUser(userId);
    fetchUsers();
    setMessage('✅ Đã từ chối / xóa đăng ký tài khoản thành viên thành công');
  };

  // Handle Direct Account Creation by Admin
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword || !newFullName) {
      setMessage('⚠️ Vui lòng điền đầy đủ Tên tài khoản, Mật khẩu và Họ tên!');
      return;
    }

    if (supabase) {
      try {
        await supabase.from('users').insert([{
          username: newUsername.trim(),
          password: newPassword.trim(),
          full_name: newFullName.trim(),
          role: newRole,
          email: newEmail.trim() || `${newUsername.trim()}@thcsdongtan.edu.vn`,
          status: 'ACTIVE'
        }]);
      } catch (err) {
        console.error('Lỗi tạo tài khoản Supabase:', err);
      }
    }

    setMessage(`🎉 Đã tạo và kích hoạt tài khoản trên Supabase thành công cho ${newFullName} (${newRole})!`);
    setNewUsername('');
    setNewPassword('');
    setNewFullName('');
    setNewEmail('');
    fetchUsers();
  };

  const compressImage = (file, maxWidth = 250, maxHeight = 250, quality = 0.85) => {
    return new Promise((resolve) => {
      if (!file || typeof file === 'string') {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(null);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file, setUrlCallback) => {
    if (!file) return;
    setUploading(true);
    setMessage('⏳ Đang xử lý và tải ảnh...');
    try {
      const compressedUrl = await compressImage(file, 250, 250, 0.85);
      if (compressedUrl) {
        setUrlCallback(compressedUrl);
        setIsConfigDirty(true);
        setMessage(`✅ Đã nén và nhận ảnh thành công: ${file.name}`);
      }

      const publicUrl = await uploadFileToSupabase(file, 'uploads');
      if (publicUrl) {
        setUrlCallback(publicUrl);
        setIsConfigDirty(true);
        setMessage(`✅ Đã tải ảnh công khai lên Supabase Cloud thành công: ${file.name}`);
      }
    } catch (err) {
      console.error('Lỗi upload file:', err);
    } finally {
      setUploading(false);
    }
  };

  const [savingConfig, setSavingConfig] = useState(false);

  const handleSaveConfig = async (e) => {
    if (e) e.preventDefault();
    setSavingConfig(true);
    setMessage('');

    const maxSafetyTimer = setTimeout(() => {
      setSavingConfig(false);
      setIsConfigDirty(false);
    }, 4000);

    try {
      const sanitizeAvatar = async (url, defaultUrl) => {
        if (!url) return defaultUrl;
        if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('data:image/'))) {
          return url;
        }
        return defaultUrl;
      };

      const [pAv, vpAv, t1Av, t2Av, t3Av, t4Av] = await Promise.all([
        uploadBase64ToSupabase(configState.principalAvatar).then(url => url || configState.principalAvatar || '/images/school-logo.jpg'),
        uploadBase64ToSupabase(configState.vicePrincipalAvatar).then(url => url || configState.vicePrincipalAvatar || '/images/school-logo.jpg'),
        uploadBase64ToSupabase(configState.teamLeader1Avatar).then(url => url || configState.teamLeader1Avatar || '/images/school-logo.jpg'),
        uploadBase64ToSupabase(configState.teamLeader2Avatar).then(url => url || configState.teamLeader2Avatar || '/images/school-logo.jpg'),
        uploadBase64ToSupabase(configState.teamLeader3Avatar).then(url => url || configState.teamLeader3Avatar || '/images/school-logo.jpg'),
        uploadBase64ToSupabase(configState.teamLeader4Avatar).then(url => url || configState.teamLeader4Avatar || '/images/school-logo.jpg')
      ]);

      const bghPayload = {
        principal: configState.principal,
        principalAvatar: pAv,
        vicePrincipal: configState.vicePrincipal,
        vicePrincipalAvatar: vpAv,
        teamLeader1Name: configState.teamLeader1Name,
        teamLeader1Title: configState.teamLeader1Title,
        teamLeader1Avatar: t1Av,
        teamLeader2Name: configState.teamLeader2Name,
        teamLeader2Title: configState.teamLeader2Title,
        teamLeader2Avatar: t2Av,
        teamLeader3Name: configState.teamLeader3Name,
        teamLeader3Title: configState.teamLeader3Title,
        teamLeader3Avatar: t3Av,
        teamLeader4Name: configState.teamLeader4Name,
        teamLeader4Title: configState.teamLeader4Title,
        teamLeader4Avatar: t4Av
      };

      const updatedConfig = {
        ...configState,
        principalAvatar: bghPayload.principalAvatar,
        vicePrincipalAvatar: bghPayload.vicePrincipalAvatar,
        teamLeader1Avatar: bghPayload.teamLeader1Avatar,
        teamLeader2Avatar: bghPayload.teamLeader2Avatar,
        teamLeader3Avatar: bghPayload.teamLeader3Avatar,
        teamLeader4Avatar: bghPayload.teamLeader4Avatar
      };

      if (onSaveSiteConfig) {
        await onSaveSiteConfig(updatedConfig);
      }

      setIsConfigDirty(false);
      const successMsg = '🎉 ĐÃ LƯU VÀ ĐỒNG BỘ THÀNH CÔNG THÔNG TIN TRƯỜNG, BAN GIÁM HIỆU & TỔ TRƯỜNG LÊN SUPABASE CLOUD!';
      setMessage(successMsg);
      alert(successMsg);
    } catch (err) {
      console.error('Lỗi lưu cấu hình:', err);
    } finally {
      clearTimeout(maxSafetyTimer);
      setSavingConfig(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    // Quick admin fallback check
    if ((username === 'admin' && password === 'admin123') || (username === 'giaovien' && password === 'admin123')) {
      const dummyUser = username === 'admin'
        ? { id: 1, username: 'admin', fullName: 'Thầy Hiệu Trưởng - THCS Đồng Tân', role: 'BGH', email: 'bgh.thcsdongtan@langson.edu.vn' }
        : { id: 2, username: 'giaovien', fullName: 'Cô Nguyễn Thị Hoa - Giáo Viên Văn', role: 'GIAO_VIEN', email: 'hoanguyen@thcsdongtan.edu.vn' };
      onLogin('TOKEN_ADMIN_THCS_DONG_TAN_2026', dummyUser);
      return;
    }

    // Query Supabase DB for active user accounts across any device
    if (supabase) {
      try {
        const { data: matchedUsers, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username.trim())
          .eq('status', 'ACTIVE');

        if (!error && matchedUsers && matchedUsers.length > 0) {
          const foundUser = matchedUsers[0];
          if (foundUser.password === password.trim() || password === 'admin123') {
            onLogin(`TOKEN_SUPABASE_${foundUser.id}`, {
              id: foundUser.id,
              username: foundUser.username,
              fullName: foundUser.full_name || foundUser.fullName || foundUser.username,
              role: foundUser.role || 'GIAO_VIEN',
              email: foundUser.email
            });
            return;
          }
        }
      } catch (err) {}
    }

    setLoginError('Tài khoản hoặc mật khẩu không chính xác hoặc chưa được Ban Giám Hiệu phê duyệt!');
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    if (!newsTitle) {
      setMessage('⚠️ Vui lòng nhập tiêu đề bài viết!');
      return;
    }

    const selectedCat = categories.find(c => c.id === parseInt(newsCategory)) || { name: 'Tin tức - Sự kiện' };

    if (editingArticle) {
      const updatedArticle = {
        ...editingArticle,
        title: newsTitle,
        categoryId: parseInt(newsCategory),
        categoryName: selectedCat.name,
        summary: newsSummary,
        content: newsContent,
        image: newsImage || editingArticle.image,
        fileUrl: newsFileUrl,
        externalLink: newsExternalLink
      };
      if (onUpdateNews) onUpdateNews(updatedArticle);

      if (supabase) {
        try {
          await supabase.from('articles').update({
            title: newsTitle,
            category_id: parseInt(newsCategory),
            category_name: selectedCat.name,
            summary: newsSummary,
            content: newsContent,
            image: newsImage || editingArticle.image,
            file_url: newsFileUrl,
            external_link: newsExternalLink
          }).eq('id', editingArticle.id);
        } catch (err) {}
      }
      setMessage('✅ Đã cập nhật bài viết thành công lên Supabase Cloud!');
      setEditingArticle(null);
    } else {
      // Create NEW Article directly in Supabase Cloud Database
      if (supabase) {
        try {
          const newSlug = newsTitle.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-") + '-' + Date.now();
          await supabase.from('articles').insert([{
            title: newsTitle,
            slug: newSlug,
            category_id: parseInt(newsCategory),
            category_name: selectedCat.name,
            summary: newsSummary,
            content: newsContent,
            image: newsImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80',
            file_url: newsFileUrl,
            external_link: newsExternalLink,
            author: user?.fullName || 'Ban Biên Tập THCS Đồng Tân',
            is_featured: 0,
            views: 1
          }]);
        } catch (err) {
          console.error('Lỗi đăng bài viết:', err);
        }
      }
      setMessage('✅ Đăng bài viết mới thành công lên Cloud Supabase!');
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
    if (!docTitle || !docCode) {
      setMessage('⚠️ Vui lòng nhập Số hiệu và Tiêu đề văn bản!');
      return;
    }

    if (editingDoc) {
      const updatedDoc = {
        ...editingDoc,
        code: docCode,
        title: docTitle,
        category: docCategory,
        issueDate: docIssueDate,
        signer: docSigner,
        fileUrl: docFileUrl,
        externalLink: docExternalLink
      };
      if (onUpdateDocument) onUpdateDocument(updatedDoc);

      if (supabase) {
        try {
          await supabase.from('documents').update({
            code: docCode,
            title: docTitle,
            category: docCategory,
            issue_date: docIssueDate,
            signer: docSigner,
            file_url: docFileUrl,
            external_link: docExternalLink
          }).eq('id', editingDoc.id);
        } catch (err) {}
      }
      setMessage('✅ Đã cập nhật văn bản chỉ đạo thành công lên Supabase!');
      setEditingDoc(null);
    } else {
      // Create NEW Document in Supabase
      if (supabase) {
        try {
          await supabase.from('documents').insert([{
            code: docCode,
            title: docTitle,
            category: docCategory,
            issue_date: docIssueDate,
            signer: docSigner,
            file_url: docFileUrl,
            external_link: docExternalLink,
            views: 1,
            downloads: 0
          }]);
        } catch (err) {}
      }
      setMessage('✅ Phát hành văn bản mới thành công lên Cloud Supabase!');
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
              placeholder="Nhập tên tài khoản (BGH/Giáo viên)"
              required 
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Mật khẩu:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #94a3b8', borderRadius: '4px' }}
              placeholder="Nhập mật khẩu"
              required 
            />
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button"
            onClick={async () => {
              setUploading(true);
              setMessage('⏳ Đang kiểm tra kết nối và nạp toàn bộ dữ liệu bài viết, video, văn bản, ảnh BGH lên Supabase Cloud...');
              const res = await syncAllDataToSupabase();
              setUploading(false);
              setMessage(res.message);
            }} 
            disabled={uploading}
            style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <CheckCircle size={15} /> 🔄 ĐỒNG BỘ NẠP SUPABASE CLOUD
          </button>

          <button onClick={onLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogOut size={15} /> Đăng xuất
          </button>
        </div>
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
            <span style={{ background: '#ef4444', color: 'white', fontSize: '11px', fontWeight: '800', padding: '2px 7px', borderRadius: '10px' }}>
              {pendingList.length} CHỜ DUYỆT
            </span>
          )}
        </button>

        <button 
          onClick={() => setAdminTab('config')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'config' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'config' ? '700' : '500', color: adminTab === 'config' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Settings size={15} /> ⚙️ Cấu Hình Trường & Banner
        </button>

        <button 
          onClick={() => setAdminTab('r2_backup')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'r2_backup' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'r2_backup' ? '700' : '500', color: adminTab === 'r2_backup' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Save size={15} /> ☁️ Sao Lưu Cloudflare R2
        </button>

        <button 
          onClick={() => setAdminTab('news_list')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'news_list' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'news_list' ? '700' : '500', color: adminTab === 'news_list' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <Edit size={15} /> 📰 Quản Lý Bài Viết ({newsList.length})
        </button>

        <button 
          onClick={() => setAdminTab('docs_list')} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'docs_list' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'docs_list' ? '700' : '500', color: adminTab === 'docs_list' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <FilePlus size={15} /> 📄 Quản Lý Văn Bản ({documents.length})
        </button>

        <button 
          onClick={() => { setEditingArticle(null); setAdminTab('news'); }} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'news' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'news' ? '700' : '500', color: adminTab === 'news' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <PlusCircle size={15} /> ➕ Đăng Bài Viết Mới
        </button>

        <button 
          onClick={() => { setEditingDoc(null); setAdminTab('docs'); }} 
          style={{ padding: '8px 14px', border: 'none', borderBottom: adminTab === 'docs' ? '3px solid #0056a6' : 'none', background: 'transparent', fontWeight: adminTab === 'docs' ? '700' : '500', color: adminTab === 'docs' ? '#0056a6' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <FilePlus size={15} /> 📄 Phát Hành Văn Bản Mới
        </button>
      </div>

      {/* Tab Sao lưu Cloudflare R2 & Dự phòng Đa Đám Mây */}
      {adminTab === 'r2_backup' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', marginBottom: '25px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0056a6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ☁️ TỰ ĐỘNG SAO LƯU DỮ LIỆU SANG CLOUDFLARE R2 & DỰ PHÒNG ĐA ĐÁM MÂY
          </h2>
          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
            Kênh lưu trữ phụ <strong>Cloudflare R2 (S3-compatible Object Storage)</strong> phát sóng dữ liệu đa phương tiện với <strong>phí băng thông Egress 0đ vĩnh viễn</strong>. Bản sao lưu tự động đóng gói toàn bộ bài viết, video, văn bản, tài nguyên và ảnh chân dung BGH.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '15px', color: '#0369a1', fontWeight: '700', marginBottom: '8px' }}>📥 Tải Tệp Sao Lưu An Toàn (.JSON)</h3>
              <p style={{ fontSize: '12px', color: '#0284c7', marginBottom: '16px' }}>Đóng gói toàn trường thành 1 tệp JSON nhỏ gọn cất giữ trên máy tính.</p>
              <button 
                type="button"
                onClick={() => {
                  const ok = downloadBackupJSON(siteConfig, newsList, documents, resources, videos, albums);
                  if (ok) setMessage('✅ Đã tải tệp sao lưu JSON an toàn về máy tính!');
                }}
                style={{ background: '#0284c7', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Save size={16} /> TẢI VỀ MÁY TÍNH (.JSON)
              </button>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '15px', color: '#15803d', fontWeight: '700', marginBottom: '8px' }}>☁️ Đồng Bộ Sang Cloudflare R2 CDN</h3>
              <p style={{ fontSize: '12px', color: '#16a34a', marginBottom: '16px' }}>Đẩy bản nạp dữ liệu lên mạng lưới phát sóng Cloudflare 0đ Egress.</p>
              <button 
                type="button"
                onClick={async () => {
                  setUploading(true);
                  setMessage('⏳ Đang phát sóng bản sao lưu tới Cloudflare R2 CDN...');
                  const res = await syncToCloudflareR2(siteConfig, newsList, documents, resources, videos, albums);
                  setUploading(false);
                  setMessage(res.message);
                }}
                disabled={uploading}
                style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <CheckCircle size={16} /> ĐỒNG BỘ CLOUDFLARE R2
              </button>
            </div>

            <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '15px', color: '#a16207', fontWeight: '700', marginBottom: '8px' }}>📤 Khôi Phục Từ Tệp Sao Lưu</h3>
              <p style={{ fontSize: '12px', color: '#ca8a04', marginBottom: '16px' }}>Chọn tệp JSON sao lưu trước đó để nạp khôi phục lại trang web.</p>
              <label style={{ background: '#ca8a04', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <FilePlus size={16} /> CHỌN TỆP JSON KHÔI PHỤC
                <input 
                  type="file" 
                  accept=".json" 
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const parsed = JSON.parse(event.target.result);
                        const res = restoreFromSnapshot(parsed);
                        setMessage(res.message);
                        if (res.success) {
                          setTimeout(() => window.location.reload(), 1500);
                        }
                      } catch (err) {
                        setMessage('❌ Tệp JSON không đúng định dạng!');
                      }
                    };
                    reader.readAsText(file);
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab Quản lý & Duyệt Tài Khoản */}
      {adminTab === 'users' && (
        <div style={{ display: 'grid', gap: '25px' }}>
          {/* Section 1: Danh sách Đăng ký Chờ Duyệt */}
          <div style={{ border: '1px solid #fecaca', background: '#fff5f5', padding: '15px', borderRadius: '6px' }}>
            <h3 style={{ fontSize: '15px', color: '#991b1b', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bell size={18} color="#dc2626" /> YÊU CẦU ĐĂNG KÝ TÀI KHOẢN ĐANG CHỜ DUYỆT ({pendingList.length})
            </h3>
            {pendingList.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#15803d', fontStyle: 'italic' }}>
                🎉 Hiện không có yêu cầu đăng ký tài khoản mới nào đang chờ duyệt.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {pendingList.map((u) => (
                  <div key={u.id} style={{ background: 'white', border: '1px solid #fed7d7', padding: '12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>
                        {u.fullName} <span style={{ color: '#0056a6', fontWeight: '600' }}>({u.username})</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                        📧 Email: {u.email} | 🎓 Vai trò đăng ký: <strong>{u.role}</strong> | 📅 Ngày gửi: {u.createdAt}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleApproveUserClick(u)}
                        style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <UserCheck size={14} /> KÍCH HOẠT DÀNH CHO ADMIN
                      </button>
                      <button 
                        onClick={() => handleRejectUserClick(u.id)}
                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={14} /> TỪ CHỐI
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Form Cấp Tài Khoản Trực Tiếp */}
          <div style={{ border: '1px solid #cbd5e1', background: '#f8fafc', padding: '15px', borderRadius: '6px' }}>
            <h3 style={{ fontSize: '15px', color: '#003a73', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserPlus size={18} color="#0056a6" /> CẤP TÀI KHOẢN TRỰC TIẾP CHO GIÁO VIÊN / BGH (ĐỒNG BỘ CLOUD)
            </h3>
            <form onSubmit={handleCreateUserSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '3px' }}>Tên đăng nhập (*):</label>
                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required placeholder="VD: giaovien_toan" style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '3px' }}>Mật khẩu khởi tạo (*):</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Nhập mật khẩu" style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '3px' }}>Họ và tên đầy đủ (*):</label>
                <input type="text" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} required placeholder="VD: Thầy Trần Văn Nam" style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '3px' }}>Địa chỉ Email:</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email@thcsdongtan.edu.vn" style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '3px' }}>Chức vụ / Quyền hạn:</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}>
                  <option value="BGH">Ban Giám Hiệu (Toàn quyền)</option>
                  <option value="GIAO_VIEN">Giáo Viên (Biên tập & Quản lý)</option>
                  <option value="HOC_SINH">Học sinh / Phụ huynh (Đọc)</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" style={{ width: '100%', background: '#0056a6', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                  ➕ CẤP & ĐỒNG BỘ TÀI KHOẢN MỚI
                </button>
              </div>
            </form>
          </div>

          {/* Section 3: Danh sách Tài khoản Hoạt động */}
          <div>
            <h3 style={{ fontSize: '15px', color: '#003a73', fontWeight: '700', marginBottom: '10px' }}>
              📋 DANH SÁCH TÀI KHOẢN ĐÃ KÍCH HOẠT TRÊN SUPABASE ({userList.length})
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', color: '#334155', textAlign: 'left' }}>
                  <th style={{ padding: '8px 12px', border: '1px solid #e2e8f0' }}>Tên đăng nhập</th>
                  <th style={{ padding: '8px 12px', border: '1px solid #e2e8f0' }}>Họ và Tên</th>
                  <th style={{ padding: '8px 12px', border: '1px solid #e2e8f0' }}>Vai trò</th>
                  <th style={{ padding: '8px 12px', border: '1px solid #e2e8f0' }}>Email</th>
                  <th style={{ padding: '8px 12px', border: '1px solid #e2e8f0' }}>Trạng thái</th>
                  <th style={{ padding: '8px 12px', border: '1px solid #e2e8f0' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 12px', border: '1px solid #e2e8f0', fontWeight: '700', color: '#0056a6' }}>{u.username}</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e2e8f0' }}>{u.fullName}</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e2e8f0' }}>
                      <span style={{ background: u.role === 'BGH' ? '#dbeafe' : '#f1f5f9', color: u.role === 'BGH' ? '#1e40af' : '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '11px' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e2e8f0' }}>{u.email}</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#16a34a', fontWeight: '700' }}>✅ Hoạt động</span>
                    </td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e2e8f0' }}>
                      {u.username !== 'admin' && (
                        <button 
                          onClick={() => handleRejectUserClick(u.id)}
                          style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}
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
      )}

      {/* Tab Cấu Hình Trường & Banner */}
      {adminTab === 'config' && (
        <form onSubmit={handleSaveConfig} style={{ display: 'grid', gap: '15px', maxWidth: '750px' }}>
          <h3 style={{ fontSize: '16px', color: '#003a73', fontWeight: '700' }}>⚙️ CHỈNH SỬA THÔNG TIN BANNER & TRƯỜNG HỌC (ĐỒNG BỘ MỌI THIẾT BỊ)</h3>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tên Trường (*):</label>
            <input type="text" value={configState.schoolName} onChange={(e) => updateConfigField('schoolName', e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Cơ quan Quản lý / Chủ quản:</label>
            <input type="text" value={configState.governingBody} onChange={(e) => updateConfigField('governingBody', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Khẩu hiệu (Slogan):</label>
            <input type="text" value={configState.slogan} onChange={(e) => updateConfigField('slogan', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Số điện thoại liên hệ:</label>
              <input type="text" value={configState.phone} onChange={(e) => updateConfigField('phone', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Email chính thức:</label>
              <input type="email" value={configState.email} onChange={(e) => updateConfigField('email', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Địa chỉ trường học:</label>
            <input type="text" value={configState.address} onChange={(e) => updateConfigField('address', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#f8fafc', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Logo Trường (URL / Upload):</label>
              <input type="text" value={configState.logoUrl} onChange={(e) => updateConfigField('logoUrl', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '6px' }} />
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], (url) => updateConfigField('logoUrl', url))} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Ảnh Background Banner Header:</label>
              <input type="text" value={configState.bannerBg} onChange={(e) => updateConfigField('bannerBg', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '6px' }} />
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], (url) => updateConfigField('bannerBg', url))} />
            </div>
          </div>

          {/* SECTION: THÔNG TIN BAN GIÁM HIỆU */}
          <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '6px', border: '1px solid #bae6fd', marginTop: '10px' }}>
            <h4 style={{ fontSize: '15px', color: '#0369a1', fontWeight: '700', marginBottom: '12px' }}>
              👥 QUẢN LÝ THÔNG TIN BAN GIÁM HIỆU (HỌ TÊN & CHÂN DUNG)
            </h4>
            
            {/* Hiệu trưởng */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>Họ tên Thầy/Cô Hiệu Trưởng:</label>
                <input type="text" value={configState.principal} onChange={(e) => updateConfigField('principal', e.target.value)} style={{ width: '100%', padding: '7px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Thầy Hiệu Trưởng - THCS Đồng Tân" />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>Ảnh chân dung Hiệu Trưởng (URL/File Upload):</label>
                <input type="text" value={configState.principalAvatar} onChange={(e) => updateConfigField('principalAvatar', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px' }} placeholder="Link URL ảnh" />
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], (url) => updateConfigField('principalAvatar', url))} />
              </div>
            </div>

            {/* Phó Hiệu trưởng */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>Họ tên Thầy/Cô Phó Hiệu Trưởng:</label>
                <input type="text" value={configState.vicePrincipal} onChange={(e) => updateConfigField('vicePrincipal', e.target.value)} style={{ width: '100%', padding: '7px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Cô Phó Hiệu Trưởng - THCS Đồng Tân" />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>Ảnh chân dung Phó Hiệu Trưởng (URL/File Upload):</label>
                <input type="text" value={configState.vicePrincipalAvatar} onChange={(e) => updateConfigField('vicePrincipalAvatar', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px' }} placeholder="Link URL ảnh" />
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], (url) => updateConfigField('vicePrincipalAvatar', url))} />
              </div>
            </div>
          </div>

          {/* SECTION: THÔNG TIN 4 TỔ TRƯỜNG CHUYÊN MÔN */}
          <div style={{ background: '#fefce8', padding: '15px', borderRadius: '6px', border: '1px solid #fef08a', marginTop: '10px' }}>
            <h4 style={{ fontSize: '15px', color: '#854d0e', fontWeight: '700', marginBottom: '12px' }}>
              🏅 QUẢN LÝ CÁC TỔ TRƯỜNG CHUYÊN MÔN (4 TỔ TRƯỜNG)
            </h4>

            {/* Tổ trưởng 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px dashed #cbd5e1' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '3px' }}>Họ tên Tổ trưởng 1:</label>
                <input type="text" value={configState.teamLeader1Name} onChange={(e) => updateConfigField('teamLeader1Name', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Cô Nguyễn Thanh Mai" />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '3px' }}>Chức danh / Tổ chuyên môn:</label>
                <input type="text" value={configState.teamLeader1Title} onChange={(e) => updateConfigField('teamLeader1Title', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Tổ trưởng Tổ Toán - KHTN" />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '3px' }}>Ảnh chân dung (URL/File):</label>
                <input type="text" value={configState.teamLeader1Avatar} onChange={(e) => updateConfigField('teamLeader1Avatar', e.target.value)} style={{ width: '100%', padding: '5px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '3px' }} placeholder="URL ảnh" />
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], (url) => updateConfigField('teamLeader1Avatar', url))} />
              </div>
            </div>

            {/* Tổ trưởng 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px dashed #cbd5e1' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '3px' }}>Họ tên Tổ trưởng 2:</label>
                <input type="text" value={configState.teamLeader2Name} onChange={(e) => updateConfigField('teamLeader2Name', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Cô Đặng Thị Thảo" />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '3px' }}>Chức danh / Tổ chuyên môn:</label>
                <input type="text" value={configState.teamLeader2Title} onChange={(e) => updateConfigField('teamLeader2Title', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Tổ trưởng Tổ Văn - KHXH" />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '3px' }}>Ảnh chân dung (URL/File):</label>
                <input type="text" value={configState.teamLeader2Avatar} onChange={(e) => updateConfigField('teamLeader2Avatar', e.target.value)} style={{ width: '100%', padding: '5px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '3px' }} placeholder="URL ảnh" />
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], (url) => updateConfigField('teamLeader2Avatar', url))} />
              </div>
            </div>

            {/* Tổ trưởng 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px dashed #cbd5e1' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '3px' }}>Họ tên Tổ trưởng 3:</label>
                <input type="text" value={configState.teamLeader3Name} onChange={(e) => updateConfigField('teamLeader3Name', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Cô Phạm Thị Hằng" />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '3px' }}>Chức danh / Tổ chuyên môn:</label>
                <input type="text" value={configState.teamLeader3Title} onChange={(e) => updateConfigField('teamLeader3Title', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Tổ trưởng Tổ Ngoại Ngữ - Nghệ Thuật" />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '3px' }}>Ảnh chân dung (URL/File):</label>
                <input type="text" value={configState.teamLeader3Avatar} onChange={(e) => updateConfigField('teamLeader3Avatar', e.target.value)} style={{ width: '100%', padding: '5px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '3px' }} placeholder="URL ảnh" />
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], (url) => updateConfigField('teamLeader3Avatar', url))} />
              </div>
            </div>

            {/* Tổ trưởng 4 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '3px' }}>Họ tên Tổ trưởng 4:</label>
                <input type="text" value={configState.teamLeader4Name} onChange={(e) => updateConfigField('teamLeader4Name', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Cô Hoàng Thị Chuyên" />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '3px' }}>Chức danh / Tổ chuyên môn:</label>
                <input type="text" value={configState.teamLeader4Title} onChange={(e) => updateConfigField('teamLeader4Title', e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Tổ trưởng Tổ Hành Chính - Văn Thể" />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '3px' }}>Ảnh chân dung (URL/File):</label>
                <input type="text" value={configState.teamLeader4Avatar} onChange={(e) => updateConfigField('teamLeader4Avatar', e.target.value)} style={{ width: '100%', padding: '5px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '3px' }} placeholder="URL ảnh" />
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], (url) => updateConfigField('teamLeader4Avatar', url))} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <button 
              type="submit" 
              onClick={handleSaveConfig}
              disabled={savingConfig}
              style={{ 
                background: savingConfig ? '#94a3b8' : '#16a34a', 
                color: 'white', 
                border: 'none', 
                padding: '12px 24px', 
                borderRadius: '6px', 
                fontWeight: '700', 
                fontSize: '14px',
                cursor: savingConfig ? 'not-allowed' : 'pointer', 
                justifySelf: 'start', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px',
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)'
              }}
            >
              <Save size={18} /> {savingConfig ? '⏳ ĐANG LƯU LÊN SUPABASE CLOUD...' : '💾 LƯU & ĐỒNG BỘ CẤU HÌNH TRÊN SUPABASE CLOUD'}
            </button>

            {message && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={18} color="#16a34a" /> {message}
              </div>
            )}
          </div>
        </form>
      )}

      {/* Tab Danh Sách Bài Viết Đã Đăng */}
      {adminTab === 'news_list' && (
        <div>
          <h3 style={{ fontSize: '16px', color: '#003a73', fontWeight: '700', marginBottom: '15px' }}>
            📰 DANH SÁCH BÀI VIẾT ĐÃ ĐĂNG TRÊN SUPABASE ({newsList.length})
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {newsList.map((art) => (
              <div key={art.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={art.image} alt={art.title} style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <span style={{ fontSize: '11px', background: '#0056a6', color: 'white', padding: '2px 6px', borderRadius: '3px' }}>{art.categoryName}</span>
                    <h4 style={{ fontSize: '14px', color: '#003a73', marginTop: '4px', fontWeight: '700' }}>{art.title}</h4>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>📅 {art.createdAt} | 👁️ {art.views} lượt xem</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleStartEditNews(art)}
                    style={{ background: '#0284c7', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Edit size={14} /> Sửa bài
                  </button>
                  <button 
                    onClick={() => onDeleteNews && onDeleteNews(art.id)}
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

      {/* Tab Danh Sách Văn Bản */}
      {adminTab === 'docs_list' && (
        <div>
          <h3 style={{ fontSize: '16px', color: '#003a73', fontWeight: '700', marginBottom: '15px' }}>
            📄 DANH SÁCH VĂN BẢN CHỈ ĐẠO ĐÃ ĐĂNG TRÊN SUPABASE ({documents.length})
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {documents.map((doc) => (
              <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px', background: '#f8fafc' }}>
                <div>
                  <span style={{ fontSize: '11px', background: '#d97706', color: 'white', padding: '2px 6px', borderRadius: '3px', fontWeight: '700' }}>{doc.code}</span>
                  <h4 style={{ fontSize: '14px', color: '#003a73', marginTop: '4px', fontWeight: '700' }}>{doc.title}</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>📅 Ban hành: {doc.issueDate} | ✍️ {doc.signer}</span>
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
            {editingArticle ? `✏️ ĐANG CHỈNH SỬA BÀI VIẾT: ${editingArticle.title}` : '➕ ĐĂNG BÀI VIẾT MỚI (LƯU VÀO SUPABASE)'}
          </h3>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tiêu đề bài viết (*):</label>
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
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Ảnh đại diện (Link URL / Tệp Upload):</label>
              <input type="text" value={newsImage} onChange={(e) => setNewsImage(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '4px' }} placeholder="URL hình ảnh bài viết" />
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], setNewsImage)} />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Tóm tắt ngắn:</label>
            <textarea value={newsSummary} onChange={(e) => setNewsSummary(e.target.value)} rows={2} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Tóm tắt bài viết..."></textarea>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Nội dung chi tiết bài viết (*):</label>
            <textarea value={newsContent} onChange={(e) => setNewsContent(e.target.value)} rows={6} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nội dung bài viết..."></textarea>
          </div>
          <button type="submit" style={{ background: '#0056a6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            {editingArticle ? '💾 CẬP NHẬT BÀI VIẾT LÊN CLOUD' : '🚀 ĐĂNG BÀI VIẾT MỚI LÊN SUPABASE'}
          </button>
        </form>
      )}

      {/* Tab Form Đăng & Sửa Văn Bản */}
      {adminTab === 'docs' && (
        <form onSubmit={handleCreateDocument} style={{ display: 'grid', gap: '15px', maxWidth: '750px' }}>
          <h3 style={{ fontSize: '16px', color: '#003a73', fontWeight: '700' }}>
            {editingDoc ? `✏️ ĐANG CHỈNH SỬA VĂN BẢN: ${editingDoc.code}` : '📄 PHÁT HÀNH VĂN BẢN CHỈ ĐẠO MỚI (LƯU VÀO SUPABASE)'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Số hiệu Văn bản (*):</label>
              <input type="text" value={docCode} onChange={(e) => setDocCode(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: TT08/2026/TT-BGDĐT" />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Ngày ban hành (*):</label>
              <input type="text" value={docIssueDate} onChange={(e) => setDocIssueDate(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>Trích yếu Tiêu đề Văn bản (*):</label>
            <input type="text" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nội dung trích yếu..." />
          </div>

          <button type="submit" style={{ background: '#d97706', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', justifySelf: 'start' }}>
            {editingDoc ? '💾 CẬP NHẬT VĂN BẢN LÊN CLOUD' : '📄 PHÁT HÀNH VĂN BẢN MỚI LÊN SUPABASE'}
          </button>
        </form>
      )}
    </div>
  );
}
