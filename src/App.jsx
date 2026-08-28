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
import AdminPortal from './components/AdminPortal';
import IntroView from './components/IntroView';
import AlbumsView from './components/AlbumsView';
import VideosView from './components/VideosView';
import ResourcesView from './components/ResourcesView';
import ScheduleView from './components/ScheduleView';
import ContactView from './components/ContactView';
import Footer from './components/Footer';
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
  bannerBg: '/images/school-banner.png'
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

  // Global Dynamic Site State
  const [siteConfig, setSiteConfig] = useState(INITIAL_SITE_CONFIG);
  const [newsList, setNewsList] = useState(INITIAL_NEWS_LIST);
  const [featuredNews, setFeaturedNews] = useState(INITIAL_FEATURED_NEWS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [albums, setAlbums] = useState(() => {
    try {
      const saved = localStorage.getItem('thcs_albums');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_ALBUMS;
  });
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [schedules, setSchedules] = useState(INITIAL_SCHEDULES);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);

  // Tự động lưu Albums vào LocalStorage & Đồng bộ tức thì giữa các Tab/Trình duyệt
  useEffect(() => {
    if (albums && albums.length > 0) {
      try {
        localStorage.setItem('thcs_albums', JSON.stringify(albums));
      } catch (e) {}
    }
  }, [albums]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'thcs_albums' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAlbums(parsed);
          }
        } catch (err) {}
      }
    };

    let channel = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        channel = new BroadcastChannel('thcs_portal_sync');
        channel.onmessage = (event) => {
          if (event.data?.type === 'SYNC_ALBUMS' && Array.isArray(event.data.payload)) {
            setAlbums(event.data.payload);
          }
        };
      } catch (e) {}
    }

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (channel) channel.close();
    };
  }, []);

  // Modal States
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [activeDocument, setActiveDocument] = useState(null);

  // Quick Upload, Bulk Upload & Register Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [uploadDefaultTab, setUploadDefaultTab] = useState('docs');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Admin Auth State
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('adminUser') || 'null'));

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

      let loadedAlbums = null;
      if (albData && Array.isArray(albData) && albData.length > 0) {
        loadedAlbums = albData.map(a => ({
          id: a.id,
          title: a.title,
          date: a.date,
          photosCount: a.photos_count || a.photosCount || 10,
          cover: a.cover,
          description: a.description,
          fileUrl: a.file_url || a.fileUrl,
          externalLink: a.external_link || a.externalLink
        }));
      }

      // Hybrid Fallback: Nếu Supabase không có dữ liệu hoặc bị lỗi/khóa quota -> Tải từ Local SQLite API
      if (!loadedAlbums || loadedAlbums.length === 0) {
        try {
          let res = await fetch('/api/media/albums').catch(() => null);
          if (!res || !res.ok) {
            res = await fetch('http://127.0.0.1:3001/api/media/albums').catch(() => null);
          }
          if (res && res.ok) {
            const result = await res.json();
            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
              loadedAlbums = result.data.map(a => ({
                id: a.id,
                title: a.title,
                date: a.date,
                photosCount: a.photosCount || a.photos_count || 10,
                cover: a.cover,
                description: a.description,
                fileUrl: a.fileUrl || a.file_url,
                externalLink: a.externalLink || a.external_link
              }));
            }
          }
        } catch (localErr) {
          console.warn('Cổng Local API chưa sẵn sàng:', localErr);
        }
      }

      // Đọc tiếp từ LocalStorage nếu vẫn chưa có dữ liệu
      if (!loadedAlbums || loadedAlbums.length === 0) {
        try {
          const saved = localStorage.getItem('thcs_albums');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              loadedAlbums = parsed;
            }
          }
        } catch (e) {}
      }

      if (loadedAlbums && loadedAlbums.length > 0) {
        setAlbums(loadedAlbums);
        try {
          localStorage.setItem('thcs_albums', JSON.stringify(loadedAlbums));
        } catch (e) {}
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
        setSiteConfig({
          schoolName: cfgData.school_name || INITIAL_SITE_CONFIG.schoolName,
          governingBody: cfgData.governing_body || INITIAL_SITE_CONFIG.governingBody,
          slogan: cfgData.slogan || INITIAL_SITE_CONFIG.slogan,
          address: cfgData.address || INITIAL_SITE_CONFIG.address,
          phone: cfgData.phone || INITIAL_SITE_CONFIG.phone,
          email: cfgData.email || INITIAL_SITE_CONFIG.email,
          logoUrl: cfgData.logo_url || INITIAL_SITE_CONFIG.logoUrl,
          bannerBg: cfgData.banner_bg || INITIAL_SITE_CONFIG.bannerBg
        });
      }

      if (usrData && usrData.length > 0) {
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
      console.error('Lỗi kết nối Supabase Cloud, đang tự động fallback về CSDL Local SQLite...', err);
      try {
        const res = await fetch('/api/media/albums');
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data) && result.data.length > 0) {
            setAlbums(result.data.map(a => ({
              id: a.id,
              title: a.title,
              date: a.date,
              photosCount: a.photosCount || a.photos_count || 10,
              cover: a.cover,
              description: a.description,
              fileUrl: a.fileUrl || a.file_url,
              externalLink: a.externalLink || a.external_link
            })));
          }
        }
      } catch (localErr) {
        console.warn('Lỗi kết nối CSDL Local SQLite:', localErr);
      }
    }
  };

  useEffect(() => {
    fetchCloudData();
    const interval = setInterval(fetchCloudData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveSiteConfig = async (newConfig) => {
    setSiteConfig(newConfig);
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
          updated_at: new Date().toISOString()
        });
      } catch (err) {}
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

  const handleDeleteAlbum = async (albumId) => {
    setAlbums(prev => prev.filter(a => a.id !== albumId));
    try {
      await fetch(`/api/media/albums/${albumId}`, { method: 'DELETE' });
    } catch (err) {}
    if (supabase) {
      try {
        await supabase.from('albums').delete().eq('id', albumId);
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
      setAlbums(prev => {
        const updated = [newItem, ...prev];
        try {
          localStorage.setItem('thcs_albums', JSON.stringify(updated));
          if (typeof BroadcastChannel !== 'undefined') {
            const bc = new BroadcastChannel('thcs_portal_sync');
            bc.postMessage({ type: 'SYNC_ALBUMS', payload: updated });
            bc.close();
          }
        } catch (e) {}
        return updated;
      });
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
    setUploadDefaultTab(tab);
    setShowUploadModal(true);
  };

  const handleOpenBulkUpload = () => {
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
        onOpenAdmin={() => setActiveTab('admin')} 
        onOpenUpload={() => handleOpenUpload('docs')}
        onOpenBulkUpload={handleOpenBulkUpload}
        onOpenRegister={() => setShowRegisterModal(true)}
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
      ) : activeTab === 'albums' ? (
        <AlbumsView albums={albums} onDeleteAlbum={handleDeleteAlbum} />
      ) : activeTab === 'videos' ? (
        <VideosView videos={videos} onOpenUpload={handleOpenUpload} />
      ) : activeTab === 'resources' ? (
        <ResourcesView resources={resources} onOpenUpload={handleOpenUpload} onOpenBulkUpload={handleOpenBulkUpload} />
      ) : activeTab === 'schedule' ? (
        <ScheduleView schedule={schedules} />
      ) : activeTab === 'contact' ? (
        <ContactView siteConfig={siteConfig} />
      ) : activeTab === 'documents' ? (
        <div style={{ padding: '20px' }}>
          <div className="widget-box">
            <div className="widget-header orange" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📄 TRA CỨU VĂN BẢN CHỈ ĐẠO & QUY CHẾ THCS ĐỒNG TÂN</span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  style={{ background: '#16a34a', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}
                  onClick={() => handleOpenUpload('docs')}
                >
                  📤 TẢI VĂN BẢN MỚI LÊN
                </button>
                <button 
                  style={{ background: '#0284c7', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}
                  onClick={handleOpenBulkUpload}
                >
                  📦 TẢI LÊN HÀNG LOẠT
                </button>
              </div>
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
                    <button 
                      style={{ background: '#0284c7', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}
                      onClick={() => handleSelectDocument(doc.id)}
                    >
                      Xem & Tải về
                    </button>
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
          onClose={() => setShowBulkUploadModal(false)}
          onBulkUploadSuccess={() => {
            fetchCloudData();
            setShowBulkUploadModal(false);
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

      <Footer siteConfig={siteConfig} />
    </div>
  );
}
