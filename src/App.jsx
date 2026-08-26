import React, { useState, useEffect } from 'react';
import HeaderBanner from './components/HeaderBanner';
import Navbar from './components/Navbar';
import SubBar from './components/SubBar';
import LeftSidebar from './components/LeftSidebar';
import MainNewsCenter from './components/MainNewsCenter';
import RightSidebar from './components/RightSidebar';
import NewsDetailModal from './components/NewsDetailModal';
import DocumentDetailModal from './components/DocumentDetailModal';
import QuickUploadModal from './components/QuickUploadModal';
import BulkUploadModal from './components/BulkUploadModal';
import RegisterModal from './components/RegisterModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import LoginModal from './components/LoginModal';
import AdminPortal from './components/AdminPortal';


import IntroView from './components/IntroView';
import AlbumsView from './components/AlbumsView';
import VideosView from './components/VideosView';
import ResourcesView from './components/ResourcesView';
import ScheduleView from './components/ScheduleView';
import ContactView from './components/ContactView';
import TrolyTinhocView from './components/TrolyTinhocView';
import Footer from './components/Footer';
import AIChatbotStudio from './components/AIChatbotStudio';
import { supabase } from './lib/supabaseClient';

// Initial Fallback Site Config
const INITIAL_SITE_CONFIG = {
  schoolName: 'TRƯỜNG THCS ĐỒNG TÂN',
  governingBody: 'ỦY BAN NHÂN DÂN XÃ HỮU LŨNG - TỈNH LẠNG SƠN',
  slogan: 'HỘI TỤ - KẾT TINH - TỎA SÁNG',
  address: 'Xã Hữu Lũng - Tỉnh Lạng Sơn',
  phone: '(0205) 3885.6789',
  email: 'thcsdongtan.huulung@langson.edu.vn',
  logoUrl: '/images/school-logo.jpg',
  bannerBg: '/images/school-banner.png',
  history: 'Trường THCS Đồng Tân được thành lập và phát triển trên địa bàn Xã Hữu Lũng, Tỉnh Lạng Sơn. Qua nhiều năm xây dựng và trưởng thành, nhà trường luôn phấn đấu đạt danh hiệu Trường học thân thiện, Học sinh tích cực, nâng cao chất lượng giáo dục toàn diện.',
  mission: 'Xây dựng môi trường giáo dục kỷ cương, tình thương, trách nhiệm; giúp học sinh phát triển toàn diện cả về trí tuệ, thể chất và đạo đức.',
  vision: 'Phấn đấu trở thành trường Trung học cơ sở đạt chuẩn quốc gia cấp độ cao, đi đầu trong chuyển đổi số giáo dục tại Tỉnh Lạng Sơn.',
  principal: 'Thầy Hiệu Trưởng - THCS Đồng Tân',
  principalAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
  vicePrincipal: 'Cô Phó Hiệu Trưởng - THCS Đồng Tân',
  vicePrincipalAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
  teamLeader1: 'Thầy Tổ Trưởng Tổ Tự Nhiên',
  teamLeader1Avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
  teamLeader2: 'Cô Tổ Trưởng Tổ Xã Hội',
  teamLeader2Avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
  teamLeader3: 'Thầy Chủ Tịch Công Đoàn',
  teamLeader3Avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
  teamLeader4: 'Cô Bí Thư Đoàn Đội',
  teamLeader4Avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80'
};

// Initial Fallback Data
const INITIAL_CATEGORIES = [
  { id: 1, name: 'Tin tức - Sự kiện', slug: 'tin-tuc-su-kien', articleCount: 3 },
  { id: 2, name: 'Hoạt động chuyên môn', slug: 'hoat-dong-chuyen-mon', articleCount: 2 },
  { id: 3, name: 'Hoạt động đoàn thể', slug: 'hoat-dong-doan-the', articleCount: 1 },
  { id: 4, name: 'Hoạt động ngoại khóa', slug: 'hoat-dong-ngoai-khoa', articleCount: 1 },
  { id: 5, name: 'Câu lạc bộ', slug: 'cau-lac-bo', articleCount: 1 }
];

const INITIAL_FEATURED_NEWS = {
  id: 1,
  title: 'Lễ kết nạp Đảng viên mới cho cán bộ giáo viên THCS Đồng Tân',
  slug: 'le-ket-nap-dang-vien-moi',
  categoryId: 1,
  categoryName: 'Tin tức - Sự kiện',
  summary: 'Vào lúc 14 giờ 00, Chi bộ trường THCS Đồng Tân đã long trọng tổ chức Lễ kết nạp Đảng viên cho giáo viên ưu tú có nhiều thành tích xuất sắc.',
  content: 'Chiều ngày 04/08/2026, Chi bộ Trường THCS Đồng Tân đã tiến hành Lễ kết nạp Đảng viên cho quần chúng ưu tú.',
  image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80',
  author: 'Ban Biên Tập THCS Đồng Tân',
  isFeatured: 1,
  views: 1250,
  createdAt: '2026-08-04 08:00:00'
};

const INITIAL_NEWS_LIST = [
  INITIAL_FEATURED_NEWS,
  {
    id: 2,
    title: 'Bộ GD&ĐT ban hành Chỉ thị về nhiệm vụ trọng tâm năm học 2026 - 2027',
    slug: 'bo-gddt-ban-hanh-chi-thi-nhiem-vu-trong-tam',
    categoryId: 2,
    categoryName: 'Hoạt động chuyên môn',
    summary: 'Tập trung nâng cao chất lượng giáo dục toàn diện, đẩy mạnh chuyển đổi số trong công tác quản lý và giảng dạy tại các trường phổ thông.',
    content: 'Bộ Giáo dục và Đào tạo vừa chính thức ban hành Chỉ thị định hướng nhiệm vụ năm học mới.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
    author: 'Phòng Giáo Dục & Đào Tạo',
    views: 940,
    createdAt: '2026-08-03 10:30:00'
  }
];

const INITIAL_DOCUMENTS = [
  {
    id: 1,
    code: 'TT07/2026/TT-BGDĐT',
    title: 'Thông tư 07/2026/TT-BGDĐT về Phổ cập giáo dục THCS và Xóa mù chữ năm 2026',
    category: 'Thông tư BGD&ĐT',
    issueDate: '04/08/2026',
    signer: 'Bộ trưởng BGD&ĐT',
    views: 4830,
    downloads: 1722,
    fileUrl: '#'
  }
];

const INITIAL_VIDEOS = [
  {
    id: 1,
    title: 'Phim tư liệu: 40 năm truyền thống Dạy tốt - Học tốt THCS Đồng Tân',
    youtubeId: 'k8F4q_N-g_w',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80',
    views: 1540
  }
];

const INITIAL_ALBUMS = [
  {
    id: 1,
    title: 'Album: Lễ Khai giảng năm học 2026 - 2027 THCS Đồng Tân',
    date: '05/09/2026',
    photosCount: 18,
    cover: '/images/school-banner.png',
    description: 'Hình ảnh rực rỡ cờ hoa trong ngày hội Khai trường.'
  }
];

const INITIAL_RESOURCES = [
  {
    id: 1,
    title: 'Đề thi Học kỳ 1 môn Ngữ Văn lớp 9 năm học 2026 - 2027 (Có đáp án)',
    type: 'Đề thi & Đáp án',
    subject: 'Ngữ Văn 9',
    author: 'Tổ Xã Hội',
    date: '02/01/2027',
    downloads: 450,
    fileUrl: '#'
  }
];

const INITIAL_SCHEDULES = [
  { day: 'Thứ Hai (08/02)', time: '07:30 - 08:15', content: 'Lễ Chào cờ đầu tuần & Tuyên dương thi đua tuần qua', leader: 'Toàn trường' }
];

const INITIAL_ANNOUNCEMENTS = [
  { id: 1, content: 'Chào mừng quý phụ huynh và học sinh đến với trang Web chính thức của trường THCS Đồng Tân, Xã Hữu Lũng, Lạng Sơn!' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Global Dynamic Site State with LocalStorage Persistence for Offline Reliability
  const [siteConfig, setSiteConfig] = useState(() => {
    const saved = localStorage.getItem('portal_site_config');
    return saved ? JSON.parse(saved) : INITIAL_SITE_CONFIG;
  });

  const [newsList, setNewsList] = useState(() => {
    const saved = localStorage.getItem('portal_news');
    return saved ? JSON.parse(saved) : INITIAL_NEWS_LIST;
  });

  const [featuredNews, setFeaturedNews] = useState(INITIAL_FEATURED_NEWS);

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('portal_docs');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('portal_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [albums, setAlbums] = useState(() => {
    const saved = localStorage.getItem('portal_albums');
    return saved ? JSON.parse(saved) : INITIAL_ALBUMS;
  });

  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem('portal_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  const [schedules, setSchedules] = useState(INITIAL_SCHEDULES);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);

  // Modal States
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [activeDocument, setActiveDocument] = useState(null);

  // Quick Upload, Bulk Upload, Register & Login Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [uploadDefaultTab, setUploadDefaultTab] = useState('docs');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);



  // Admin Auth State - BGH và Admin bắt buộc phải gõ tài khoản & mật khẩu để đăng nhập
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);

  // Sync states to LocalStorage
  useEffect(() => {
    localStorage.setItem('portal_site_config', JSON.stringify(siteConfig));
  }, [siteConfig]);

  useEffect(() => {
    localStorage.setItem('portal_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('portal_news', JSON.stringify(newsList));
  }, [newsList]);

  useEffect(() => {
    localStorage.setItem('portal_docs', JSON.stringify(documents));
  }, [documents]);


  // Main Live Data Fetcher from Supabase Cloud Postgres
  const fetchCloudData = async () => {
    if (!supabase) return;

    try {
      const [
        { data: artData },
        { data: docData },
        { data: resData },
        { data: vidData },
        { data: albData },
        { data: schData },
        { data: cfgData },
        { data: usrData }
      ] = await Promise.all([
        supabase.from('articles').select('*').order('id', { ascending: false }),
        supabase.from('documents').select('*').order('id', { ascending: false }),
        supabase.from('resources').select('*').order('id', { ascending: false }),
        supabase.from('videos').select('*').order('id', { ascending: false }),
        supabase.from('albums').select('*').order('id', { ascending: false }),
        supabase.from('schedules').select('*').order('id', { ascending: false }),
        supabase.from('site_config').select('*').eq('id', 1).maybeSingle(),
        supabase.from('users').select('*').order('id', { ascending: false })
      ]);

      if (artData && artData.length > 0) {
        const mappedArticles = artData.map(a => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          categoryId: a.category_id || 1,
          categoryName: a.category_name || 'Tin tức - Sự kiện',
          summary: a.summary,
          content: a.content,
          image: a.image,
          fileUrl: a.file_url,
          externalLink: a.external_link,
          author: a.author,
          isFeatured: a.is_featured,
          views: a.views,
          createdAt: a.created_at ? new Date(a.created_at).toLocaleDateString('vi-VN') : 'Gần đây'
        }));
        setNewsList(mappedArticles);
        setFeaturedNews(mappedArticles.find(a => a.isFeatured === 1) || mappedArticles[0]);
      }

      if (docData && docData.length > 0) {
        setDocuments(docData.map(d => ({
          id: d.id,
          code: d.code,
          title: d.title,
          category: d.category,
          issueDate: d.issue_date,
          signer: d.signer,
          fileUrl: d.file_url,
          fileName: d.file_name,
          externalLink: d.external_link,
          views: d.views,
          downloads: d.downloads
        })));
      }

      if (resData && resData.length > 0) {
        setResources(resData.map(r => ({
          id: r.id,
          title: r.title,
          type: r.type,
          subject: r.subject,
          author: r.author,
          date: r.date,
          downloads: r.downloads,
          fileUrl: r.file_url,
          fileName: r.file_name,
          externalLink: r.external_link
        })));
      }

      if (vidData && vidData.length > 0) {
        setVideos(vidData.map(v => ({
          id: v.id,
          title: v.title,
          youtubeId: v.youtube_id,
          videoUrl: v.video_url,
          thumbnailUrl: v.thumbnail_url,
          externalLink: v.external_link,
          views: v.views
        })));
      }

      if (albData && albData.length > 0) {
        setAlbums(albData.map(a => ({
          id: a.id,
          title: a.title,
          date: a.date,
          photosCount: a.photos_count,
          cover: a.cover,
          description: a.description,
          fileUrl: a.file_url,
          externalLink: a.external_link
        })));
      }

      if (schData && schData.length > 0) {
        setSchedules(schData.map(s => ({
          id: s.id,
          day: s.day_title,
          time: s.time_slot,
          content: s.content,
          leader: s.leader
        })));
      }

      if (cfgData) {
        setSiteConfig(prev => {
          const merged = {
            ...prev,
            schoolName: cfgData.school_name || prev.schoolName || INITIAL_SITE_CONFIG.schoolName,
            governingBody: cfgData.governing_body || prev.governingBody || INITIAL_SITE_CONFIG.governingBody,
            slogan: cfgData.slogan || prev.slogan || INITIAL_SITE_CONFIG.slogan,
            address: cfgData.address || prev.address || INITIAL_SITE_CONFIG.address,
            phone: cfgData.phone || prev.phone || INITIAL_SITE_CONFIG.phone,
            email: cfgData.email || prev.email || INITIAL_SITE_CONFIG.email,
            logoUrl: cfgData.logo_url || prev.logoUrl || INITIAL_SITE_CONFIG.logoUrl,
            bannerBg: cfgData.banner_bg || prev.bannerBg || INITIAL_SITE_CONFIG.bannerBg,
            history: cfgData.history || prev.history || INITIAL_SITE_CONFIG.history,
            mission: cfgData.mission || prev.mission || INITIAL_SITE_CONFIG.mission,
            vision: cfgData.vision || prev.vision || INITIAL_SITE_CONFIG.vision,
            principal: cfgData.principal || cfgData.principal_name || prev.principal || INITIAL_SITE_CONFIG.principal,
            principalAvatar: cfgData.principal_avatar || cfgData.principalAvatar || prev.principalAvatar || INITIAL_SITE_CONFIG.principalAvatar,
            vicePrincipal: cfgData.vice_principal || cfgData.vicePrincipal || prev.vicePrincipal || INITIAL_SITE_CONFIG.vicePrincipal,
            vicePrincipalAvatar: cfgData.vice_principal_avatar || cfgData.vicePrincipalAvatar || prev.vicePrincipalAvatar || INITIAL_SITE_CONFIG.vicePrincipalAvatar,
            teamLeader1: cfgData.team_leader_1 || prev.teamLeader1 || INITIAL_SITE_CONFIG.teamLeader1,
            teamLeader1Avatar: cfgData.team_leader_1_avatar || prev.teamLeader1Avatar || INITIAL_SITE_CONFIG.teamLeader1Avatar,
            teamLeader2: cfgData.team_leader_2 || prev.teamLeader2 || INITIAL_SITE_CONFIG.teamLeader2,
            teamLeader2Avatar: cfgData.team_leader_2_avatar || prev.teamLeader2Avatar || INITIAL_SITE_CONFIG.teamLeader2Avatar,
            teamLeader3: cfgData.team_leader_3 || prev.teamLeader3 || INITIAL_SITE_CONFIG.teamLeader3,
            teamLeader3Avatar: cfgData.team_leader_3_avatar || prev.teamLeader3Avatar || INITIAL_SITE_CONFIG.teamLeader3Avatar,
            teamLeader4: cfgData.team_leader_4 || prev.teamLeader4 || INITIAL_SITE_CONFIG.teamLeader4,
            teamLeader4Avatar: cfgData.team_leader_4_avatar || prev.teamLeader4Avatar || INITIAL_SITE_CONFIG.teamLeader4Avatar
          };
          localStorage.setItem('portal_site_config', JSON.stringify(merged));
          return merged;
        });
      }

      if (usrData && usrData.length > 0) {
        // 1. Kiểm tra cưỡng chế đăng xuất nếu tài khoản hiện tại bị đổi mật khẩu ở thiết bị khác
        const currentSavedUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
        if (currentSavedUser && currentSavedUser.username) {
          const cleanUname = currentSavedUser.username.trim().toLowerCase();
          const cloudMatch = usrData.find(u => u.username && u.username.trim().toLowerCase() === cleanUname);
          if (cloudMatch && cloudMatch.password) {
            const cachedPassword = localStorage.getItem('user_password_' + cleanUname);
            if (cachedPassword && cloudMatch.password !== cachedPassword) {
              console.log(`⚠️ Mật khẩu tài khoản ${cleanUname} đã bị thay đổi từ thiết bị khác. Cưỡng chế đăng xuất thiết bị này ngay lập tức!`);
              handleLogout();
              alert(`⚠️ CẢNH BÁO BẢO MẬT: Mật khẩu tài khoản "${cleanUname}" vừa được thay đổi từ một thiết bị khác. Hệ thống đã tự động đăng xuất thiết bị này để bảo mật. Vui lòng đăng nhập lại bằng mật khẩu mới!`);
              return;
            }
          }
        }

        // 2. Tự động đồng bộ mật khẩu mới nhất từ Supabase Cloud vào LocalStorage thiết bị
        usrData.forEach(u => {
          if (u.username && u.password) {
            const uname = u.username.trim().toLowerCase();
            localStorage.setItem('user_password_' + uname, u.password);
            localStorage.setItem('user_changed_password_' + uname, 'true');
          }
        });
        const pendings = usrData.filter(u => u.status === 'PENDING').map(u => ({
          id: u.id,
          username: u.username,
          fullName: u.full_name,
          role: u.role,
          email: u.email,
          status: u.status,
          createdAt: u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : 'Gần đây'
        }));
        setPendingUsers(pendings);
      }
    } catch (err) {
      console.error('Lỗi kết nối Supabase Cloud:', err);
    }
  };

  useEffect(() => {
    fetchCloudData();
    const interval = setInterval(fetchCloudData, 4000);

    let channel;
    if (supabase) {
      try {
        channel = supabase
          .channel('public_db_changes')
          .on('postgres_changes', { event: '*', schema: 'public' }, () => {
            fetchCloudData();
          })
          .subscribe();
      } catch (err) {}
    }

    return () => {
      clearInterval(interval);
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const handleSaveSiteConfig = async (newConfig) => {
    setSiteConfig(newConfig);
    localStorage.setItem('portal_site_config', JSON.stringify(newConfig));
    if (supabase) {
      try {
        await supabase.from('site_config').upsert({
          id: 1,
          school_name: newConfig.schoolName,
          governing_body: newConfig.governingBody,
          slogan: newConfig.slogan,
          address: newConfig.address,
          phone: newConfig.phone,
          email: newConfig.email,
          logo_url: newConfig.logoUrl,
          banner_bg: newConfig.bannerBg,
          history: newConfig.history,
          mission: newConfig.mission,
          vision: newConfig.vision,
          principal: newConfig.principal,
          principal_avatar: newConfig.principalAvatar,
          vice_principal: newConfig.vicePrincipal,
          vice_principal_avatar: newConfig.vicePrincipalAvatar,
          team_leader_1: newConfig.teamLeader1,
          team_leader_1_avatar: newConfig.teamLeader1Avatar,
          team_leader_2: newConfig.teamLeader2,
          team_leader_2_avatar: newConfig.teamLeader2Avatar,
          team_leader_3: newConfig.teamLeader3,
          team_leader_3_avatar: newConfig.teamLeader3Avatar,
          team_leader_4: newConfig.teamLeader4,
          team_leader_4_avatar: newConfig.teamLeader4Avatar,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.error('Lỗi lưu site_config Supabase:', err);
      }
    }
  };

  const handleUpdateNews = async (updatedArticle) => {
    setNewsList(prev => prev.map(a => a.id === updatedArticle.id ? updatedArticle : a));
    if (featuredNews?.id === updatedArticle.id) {
      setFeaturedNews(updatedArticle);
    }
    if (supabase) {
      try {
        await supabase.from('articles').update({
          title: updatedArticle.title,
          summary: updatedArticle.summary,
          content: updatedArticle.content,
          image: updatedArticle.image,
          file_url: updatedArticle.fileUrl,
          external_link: updatedArticle.externalLink
        }).eq('id', updatedArticle.id);
      } catch (err) {}
    }
  };

  const handleDeleteNews = async (articleId) => {
    setNewsList(prev => prev.filter(a => a.id !== articleId));
    if (supabase) {
      try {
        await supabase.from('articles').delete().eq('id', articleId);
      } catch (err) {}
    }
  };

  const handleUpdateDocument = async (updatedDoc) => {
    setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
    if (supabase) {
      try {
        await supabase.from('documents').update({
          code: updatedDoc.code,
          title: updatedDoc.title,
          category: updatedDoc.category,
          issue_date: updatedDoc.issueDate,
          signer: updatedDoc.signer,
          file_url: updatedDoc.fileUrl,
          external_link: updatedDoc.externalLink
        }).eq('id', updatedDoc.id);
      } catch (err) {}
    }
  };

  const handleDeleteDocument = async (docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    if (supabase) {
      try {
        await supabase.from('documents').delete().eq('id', docId);
      } catch (err) {}
    }
  };

  const handleRegisterSuccess = (newPendingUser) => {
    setPendingUsers(prev => [newPendingUser, ...prev]);
    fetchCloudData();
  };

  const handleApproveUser = async (userId) => {
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    if (supabase) {
      try {
        await supabase.from('users').update({ status: 'ACTIVE' }).eq('id', userId);
      } catch (err) {}
    }
    fetchCloudData();
  };

  const handleRejectUser = async (userId) => {
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    if (supabase) {
      try {
        await supabase.from('users').delete().eq('id', userId);
      } catch (err) {}
    }
    fetchCloudData();
  };

  const handleAddNewItem = (type, newItem) => {
    if (type === 'docs') {
      setDocuments(prev => [newItem, ...prev]);
      setActiveTab('documents');
    } else if (type === 'resources') {
      setResources(prev => [newItem, ...prev]);
      setActiveTab('resources');
    } else if (type === 'news') {
      setNewsList(prev => [newItem, ...prev]);
      setFeaturedNews(newItem);
      setActiveTab('home');
    } else if (type === 'albums') {
      setAlbums(prev => [newItem, ...prev]);
      setActiveTab('albums');
    } else if (type === 'videos') {
      setVideos(prev => [newItem, ...prev]);
      setActiveTab('videos');
    } else if (type === 'schedule') {
      setSchedules(prev => [newItem, ...prev]);
      setActiveTab('schedule');
    }
    fetchCloudData();
  };

  const handleOpenUpload = (tab = 'docs') => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setUploadDefaultTab(tab);
    setShowUploadModal(true);
  };

  const [bulkDefaultTab, setBulkDefaultTab] = useState('albums');

  const handleOpenBulkUpload = (type = 'albums') => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setBulkDefaultTab(type || 'albums');
    setShowBulkUploadModal(true);
  };

  const handleSelectArticle = async (id) => {
    const found = newsList.find(n => n.id === id);
    if (found) {
      setActiveArticle(found);
      setSelectedArticleId(id);
    }
  };

  const handleSelectDocument = async (id) => {
    const found = documents.find(d => d.id === id);
    if (found) {
      setActiveDocument(found);
      setSelectedDocumentId(id);
    }
  };

  const handleDownloadDocument = async (id) => {
    if (supabase) {
      try {
        const target = documents.find(d => d.id === id);
        if (target) {
          await supabase.from('documents').update({ downloads: (target.downloads || 0) + 1 }).eq('id', id);
        }
      } catch (err) {}
    }
  };

  const handleLoginSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminUser', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  const handleDeleteVideo = async (videoId) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
    try {
      const stored = JSON.parse(localStorage.getItem('portal_videos') || '[]');
      localStorage.setItem('portal_videos', JSON.stringify(stored.filter(v => v.id !== videoId)));
    } catch (e) {}
    if (supabase) {
      try {
        await supabase.from('videos').delete().eq('id', videoId);
      } catch (err) {}
    }
  };

  const handleUpdateVideo = async (updatedVid) => {
    setVideos(prev => prev.map(v => v.id === updatedVid.id ? updatedVid : v));
    try {
      const stored = JSON.parse(localStorage.getItem('portal_videos') || '[]');
      localStorage.setItem('portal_videos', JSON.stringify(stored.map(v => v.id === updatedVid.id ? updatedVid : v)));
    } catch (e) {}
    if (supabase) {
      try {
        await supabase.from('videos').update({
          title: updatedVid.title,
          youtube_id: updatedVid.youtubeId,
          video_url: updatedVid.videoUrl,
          thumbnail_url: updatedVid.thumbnailUrl
        }).eq('id', updatedVid.id);
      } catch (err) {}
    }
  };

  const handleUpdateAlbum = async (updatedAlbum) => {
    setAlbums(prev => prev.map(a => a.id === updatedAlbum.id ? updatedAlbum : a));
    try {
      const stored = JSON.parse(localStorage.getItem('portal_albums') || '[]');
      localStorage.setItem('portal_albums', JSON.stringify(stored.map(a => a.id === updatedAlbum.id ? updatedAlbum : a)));
    } catch (e) {}
    if (supabase) {
      try {
        await supabase.from('albums').update({
          title: updatedAlbum.title,
          date: updatedAlbum.date,
          cover: updatedAlbum.cover,
          description: updatedAlbum.description
        }).eq('id', updatedAlbum.id);
      } catch (err) {}
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    setAlbums(prev => prev.filter(a => a.id !== albumId));
    try {
      const stored = JSON.parse(localStorage.getItem('portal_albums') || '[]');
      localStorage.setItem('portal_albums', JSON.stringify(stored.filter(a => a.id !== albumId)));
    } catch (e) {}
    if (supabase) {
      try {
        await supabase.from('albums').delete().eq('id', albumId);
      } catch (err) {}
    }
  };

  const handleUpdateResource = async (updatedRes) => {
    setResources(prev => prev.map(r => r.id === updatedRes.id ? updatedRes : r));
    try {
      const stored = JSON.parse(localStorage.getItem('portal_resources') || '[]');
      localStorage.setItem('portal_resources', JSON.stringify(stored.map(r => r.id === updatedRes.id ? updatedRes : r)));
    } catch (e) {}
    if (supabase) {
      try {
        await supabase.from('resources').update({
          title: updatedRes.title,
          type: updatedRes.type,
          subject: updatedRes.subject,
          author: updatedRes.author,
          date: updatedRes.date
        }).eq('id', updatedRes.id);
      } catch (err) {}
    }
  };

  const handleDeleteResource = async (resId) => {
    setResources(prev => prev.filter(r => r.id !== resId));
    try {
      const stored = JSON.parse(localStorage.getItem('portal_resources') || '[]');
      localStorage.setItem('portal_resources', JSON.stringify(stored.filter(r => r.id !== resId)));
    } catch (e) {}
    if (supabase) {
      try {
        await supabase.from('resources').delete().eq('id', resId);
      } catch (err) {}
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      fetchCloudData();
      return;
    }
    const filtered = newsList.filter(n => n.title.toLowerCase().includes(query.toLowerCase()));
    setNewsList(filtered);
  };

  return (
    <div className="site-container">
      <HeaderBanner siteConfig={siteConfig} />

      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedCategory(null);
        }} 
        user={user}
        onOpenAdmin={() => setActiveTab('admin')} 
        onOpenUpload={() => handleOpenUpload('docs')}
        onOpenBulkUpload={handleOpenBulkUpload}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenRegister={() => setShowRegisterModal(true)}
        onOpenChangePassword={() => setShowChangePasswordModal(true)}
        onLogout={handleLogout}
      />



      <SubBar announcements={announcements} onSearch={handleSearch} />

      {/* View Switcher per Navbar item */}
      {activeTab === 'admin' ? (
        <div style={{ padding: '20px' }}>
          <AdminPortal 
            token={token} 
            user={user} 
            onLogin={handleLoginSuccess} 
            onLogout={handleLogout} 
            categories={categories}
            siteConfig={siteConfig}
            onSaveSiteConfig={handleSaveSiteConfig}
            newsList={newsList}
            documents={documents}
            resources={resources}
            pendingUsers={pendingUsers}
            onApproveUser={handleApproveUser}
            onRejectUser={handleRejectUser}
            onUpdateNews={handleUpdateNews}
            onDeleteNews={handleDeleteNews}
            onUpdateDocument={handleUpdateDocument}
            onDeleteDocument={handleDeleteDocument}
            onRefreshData={fetchCloudData}
          />
        </div>
      ) : activeTab === 'intro' ? (
        <IntroView siteConfig={siteConfig} />
      ) : activeTab === 'trolytinhoc' ? (
        <TrolyTinhocView onOpenChatbot={() => {
          const btn = document.querySelector('button[style*="pulseGlow"]');
          if (btn) btn.click();
        }} />
      ) : activeTab === 'albums' ? (
        <AlbumsView albums={albums} user={user} onUpdateAlbum={handleUpdateAlbum} onDeleteAlbum={handleDeleteAlbum} />
      ) : activeTab === 'videos' ? (
        <VideosView videos={videos} user={user} onOpenUpload={handleOpenUpload} onAddNewItem={handleAddNewItem} onUpdateVideo={handleUpdateVideo} onDeleteVideo={handleDeleteVideo} />
      ) : activeTab === 'resources' ? (
        <ResourcesView resources={resources} user={user} onOpenUpload={handleOpenUpload} onOpenBulkUpload={handleOpenBulkUpload} onUpdateResource={handleUpdateResource} onDeleteResource={handleDeleteResource} />
      ) : activeTab === 'schedule' ? (
        <ScheduleView schedule={schedules} />
      ) : activeTab === 'contact' ? (
        <ContactView siteConfig={siteConfig} />
      ) : activeTab === 'documents' ? (
        <div style={{ padding: '20px' }}>
          <div className="widget-box">
            <div className="widget-header orange" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📄 TRA CỨU VĂN BẢN CHỈ ĐẠO & QUY CHẾ THCS ĐỒNG TÂN</span>

              {user ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    style={{ background: '#16a34a', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}
                    onClick={() => handleOpenUpload('docs')}
                  >
                    📤 TẢI VĂN BẢN MỚI LÊN
                  </button>
                  <button 
                    style={{ background: '#0284c7', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}
                    onClick={() => handleOpenBulkUpload('docs')}
                  >
                    📦 TẢI LÊN HÀNG LOẠT
                  </button>
                </div>
              ) : (
                <button 
                  style={{ background: '#0056a6', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}
                  onClick={() => setShowLoginModal(true)}
                >
                  🔒 ĐĂNG NHẬP ĐỂ ĐĂNG VĂN BẢN
                </button>
              )}
            </div>
            <div className="widget-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {documents.map((doc) => (
                  <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '12px', background: '#0056a6', color: 'white', padding: '2px 8px', borderRadius: '3px', fontWeight: '700' }}>
                        {doc.code}
                      </span>
                      <h3 style={{ fontSize: '15px', color: '#003a73', marginTop: '6px', cursor: 'pointer' }} onClick={() => handleSelectDocument(doc.id)}>
                        {doc.title}
                      </h3>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        📅 Ban hành: {doc.issueDate} | ✍️ Người ký: {doc.signer} | 📂 {doc.category}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {user && (user.role === 'BGH' || user.role === 'ADMIN') && (
                        <button 
                          onClick={() => {
                            if (window.confirm(`Thầy/Cô có chắc muốn xóa văn bản: "${doc.title}"?`)) {
                              handleDeleteDocument(doc.id);
                            }
                          }}
                          style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}
                        >
                          🗑️ Xóa
                        </button>
                      )}
                      <button 
                        style={{ background: '#0284c7', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}
                        onClick={() => handleSelectDocument(doc.id)}
                      >
                        Xem & Tải về
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Home / News Standard 3 Column Portal Layout */
        <div className="main-layout">
          <LeftSidebar 
            categories={categories} 
            latestNews={newsList} 
            selectedCategory={selectedCategory} 
            onSelectCategory={(catId) => setSelectedCategory(catId)}
            onSelectArticle={handleSelectArticle}
          />

          <MainNewsCenter 
            featuredArticle={featuredNews || newsList[0]} 
            secondaryArticles={newsList.slice(1, 4)} 
            allArticles={newsList}
            onSelectArticle={handleSelectArticle}
          />

          <RightSidebar 
            videos={videos} 
            documents={documents} 
            onSelectDocument={handleSelectDocument}
          />
        </div>
      )}

      {/* Modal View Detail News */}
      {selectedArticleId && activeArticle && (
        <NewsDetailModal 
          article={activeArticle} 
          onClose={() => {
            setSelectedArticleId(null);
            setActiveArticle(null);
          }} 
        />
      )}

      {/* Modal View Detail Document */}
      {selectedDocumentId && activeDocument && (
        <DocumentDetailModal 
          document={activeDocument} 
          onClose={() => {
            setSelectedDocumentId(null);
            setActiveDocument(null);
          }}
          onDownload={handleDownloadDocument}
        />
      )}

      {/* Quick Upload Popup Modal */}
      {showUploadModal && (
        <QuickUploadModal 
          defaultTab={uploadDefaultTab} 
          categories={categories} 
          onClose={() => setShowUploadModal(false)}
          onAddNewItem={handleAddNewItem}
        />
      )}

      {/* NEW Bulk Upload Popup Modal */}
      {showBulkUploadModal && (
        <BulkUploadModal 
          initialBulkType={bulkDefaultTab}
          onClose={() => setShowBulkUploadModal(false)}
          onBulkUploadSuccess={(bType, newItems) => {
            if (newItems && newItems.length > 0) {
              if (bType === 'albums') {
                setAlbums(prev => [...newItems, ...prev]);
                setActiveTab('albums');
              } else if (bType === 'docs') {
                setDocuments(prev => [...newItems, ...prev]);
                setActiveTab('documents');
              } else if (bType === 'resources') {
                setResources(prev => [...newItems, ...prev]);
                setActiveTab('resources');
              }
            }
          }}
        />
      )}

      {/* Member Registration Modal */}
      {showRegisterModal && (
        <RegisterModal 
          onClose={() => setShowRegisterModal(false)} 
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {/* Member Login Modal */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(newToken, newUser) => {
            handleLoginSuccess(newToken, newUser);
            setShowLoginModal(false);
          }}
          onOpenRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <ChangePasswordModal 
          user={user} 
          onClose={() => setShowChangePasswordModal(false)} 
          onSuccess={() => setShowChangePasswordModal(false)}
        />
      )}


      {/* AI Chatbot Studio Assistant Widget */}
      <AIChatbotStudio 
        siteConfig={siteConfig} 
        newsList={newsList} 
        documents={documents} 
        schedules={schedules} 
        resources={resources} 
        onOpenTab={(tabKey) => {
          setActiveTab(tabKey);
          setSelectedCategory(null);
        }}
      />

      <Footer siteConfig={siteConfig} />
    </div>
  );
}
