import React from 'react';
import { Layers, Zap, ExternalLink } from 'lucide-react';

export default function LeftSidebar({ categories = [], latestNews = [], selectedCategory, onSelectCategory, onSelectArticle, quickLinks = [] }) {
  const sidebarLinks = quickLinks.length > 0
    ? quickLinks.filter(l => l.position === 'sidebar')
    : [
        { id: 1, title: 'Bộ Giáo Dục & Đào Tạo', url: 'http://moet.gov.vn', target: '_blank' },
        { id: 2, title: 'Sở GD&ĐT Tỉnh Lạng Sơn', url: 'https://langson.edu.vn', target: '_blank' },
        { id: 3, title: 'UBND Xã Hữu Lũng', url: 'https://huulung.langson.gov.vn', target: '_blank' }
      ];

  return (
    <aside className="left-sidebar-col">
      {/* Widget 1: Chủ đề */}
      <div className="widget-box">
        <div className="widget-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={15} /> Chủ đề
          </span>
        </div>
        <div className="widget-body" style={{ padding: 0 }}>
          <ul className="category-list">
            <li className="category-item">
              <a 
                className={`category-link ${selectedCategory === null ? 'active' : ''}`}
                onClick={() => onSelectCategory(null)}
              >
                <span>Tất cả tin bài</span>
              </a>
            </li>
            {categories.map((cat) => (
              <li key={cat.id} className="category-item">
                <a 
                  className={`category-link ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => onSelectCategory(cat.id)}
                >
                  <span>{cat.name}</span>
                  <span className="badge-count">{cat.articleCount || 0}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Widget 2: Tin mới nhất */}
      <div className="widget-box">
        <div className="widget-header orange">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={15} /> Tin mới nhất
          </span>
        </div>
        <div className="widget-body">
          <div className="latest-news-list">
            {latestNews.slice(0, 5).map((news) => (
              <div key={news.id} className="latest-news-item" onClick={() => onSelectArticle(news.id)}>
                <img 
                  src={news.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80'} 
                  alt={news.title} 
                  className="latest-news-thumb" 
                />
                <div className="latest-news-title">{news.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Widget 3: Khối Liên kết Cổng GD */}
      <div className="widget-box">
        <div className="widget-header green">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ExternalLink size={15} /> Cổng GD Ngành
          </span>
        </div>
        <div className="widget-body">
          <ul style={{ listStyle: 'none', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sidebarLinks.map((linkItem, idx) => (
              <li key={linkItem.id || idx}>
                <a 
                  href={linkItem.url} 
                  target={linkItem.target || '_blank'} 
                  rel="noreferrer" 
                  style={{ color: '#0284c7', textDecoration: 'none' }}
                >
                  🌐 {linkItem.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
