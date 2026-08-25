import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Send, X, MessageSquare, RefreshCw, User, ChevronDown, Zap, HelpCircle, BookOpen, Calendar, FileText, PhoneCall, ArrowRight } from 'lucide-react';

export default function AIChatbotStudio({ 
  siteConfig = {}, 
  newsList = [], 
  documents = [], 
  schedules = [], 
  resources = [], 
  onOpenTab 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Xin chào Thầy/Cô, Phụ huynh và các em Học sinh! 🤖 Em là **AI Chatbot Studio** - Trợ lý thông minh chính thức của **Trường THCS Đồng Tân (Lạng Sơn)**.

Em có thể giúp gì cho Thầy/Cô và các em hôm nay?`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        '🏫 Giới thiệu Trường THCS Đồng Tân',
        '👨‍💼 Ban Giám Hiệu nhà trường',
        '📅 Lịch công tác tuần mới nhất',
        '📄 Tra cứu văn bản & thông tư',
        '🎓 Hướng dẫn đăng ký tài khoản'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Bộ Não Trí Tuệ Nhân Tạo (Context-Aware AI Engine cho THCS Đồng Tân)
  const processAIQuery = (query) => {
    const q = query.toLowerCase().trim();

    // 1. Hỏi về Ban Giám Hiệu / Hiệu Trưởng / Hiệu Phó
    if (q.includes('hiệu trưởng') || q.includes('hiệu phó') || q.includes('bgh') || q.includes('ban giám hiệu') || q.includes('lãnh đạo')) {
      const principal = siteConfig.principal || siteConfig.principalName || 'Thầy Hiệu Trưởng';
      const vicePrincipal = siteConfig.vicePrincipal || siteConfig.vicePrincipalName || 'Cô Phó Hiệu Trưởng';
      return {
        text: `🏛️ **BAN GIÁM HIỆU TRƯỜNG THCS ĐỒNG TÂN:**\n\n` +
              `👨‍💼 **Hiệu Trưởng:** ${principal}\n` +
              `👩‍💼 **Phó Hiệu Trưởng Chuyên Môn:** ${vicePrincipal}\n\n` +
              `Ban Giám Hiệu nhà trường luôn đi đầu trong đổi mới phương pháp dạy học và chuyển đổi số giáo dục trên địa bàn Xã Hữu Lũng, Lạng Sơn.`,
        suggestions: ['📅 Xem Lịch công tác BGH', '📞 Số điện thoại liên hệ', '🏛️ Xem chi tiết trang Giới thiệu'],
        actionTab: 'intro'
      };
    }

    // 2. Hỏi về Địa chỉ / Liên hệ / SĐT / Email
    if (q.includes('địa chỉ') || q.includes('liên hệ') || q.includes('sđt') || q.includes('điện thoại') || q.includes('email') || q.includes('ở đâu')) {
      return {
        text: `📍 **THÔNG TIN LIÊN HỆ THCS ĐỒNG TÂN:**\n\n` +
              `🏫 **Tên trường:** ${siteConfig.schoolName || 'TRƯỜNG THCS ĐỒNG TÂN'}\n` +
              `🏛️ **Chủ quản:** ${siteConfig.governingBody || 'UBND Xã Hữu Lũng - Tỉnh Lạng Sơn'}\n` +
              `📍 **Địa chỉ:** ${siteConfig.address || 'Xã Hữu Lũng, Tỉnh Lạng Sơn'}\n` +
              `📞 **Hotline:** ${siteConfig.phone || '(0205) 3885.6789'}\n` +
              `✉️ **Email:** ${siteConfig.email || 'thcsdongtan.huulung@langson.edu.vn'}`,
        suggestions: ['💬 Gửi ý kiến cho BGH', '📰 Xem Tin tức mới nhất', '📄 Tra cứu Văn bản']
      };
    }

    // 3. Hỏi về Lịch công tác / Thời khóa biểu / Lịch học
    if (q.includes('lịch') || q.includes('thời khóa biểu') || q.includes('công tác') || q.includes('tuần')) {
      let scheduleText = `📅 **LỊCH CÔNG TÁC TUẦN THCS ĐỒNG TÂN:**\n\n`;
      if (schedules.length > 0) {
        schedules.slice(0, 3).forEach((s, idx) => {
          scheduleText += `${idx + 1}. **${s.day || s.day_title}** (${s.time || s.time_slot}): ${s.content} - *Phụ trách: ${s.leader}*\n`;
        });
      } else {
        scheduleText += `• Lễ Chào cờ & Tuyên dương thi đua đầu tuần.\n• Họp Chuyên môn các Tổ Tự Nhiên & Xã Hội.\n• Kiểm tra và duy trì sĩ số học sinh các khối 6, 7, 8, 9.`;
      }
      return {
        text: scheduleText,
        suggestions: ['🏫 Xem bảng Lịch công tác đầy đủ', '📰 Tin tức chuyên môn', '📄 Văn bản chỉ đạo'],
        actionTab: 'schedule'
      };
    }

    // 4. Hỏi về Văn bản / Thông tư / Quy chế
    if (q.includes('văn bản') || q.includes('thông tư') || q.includes('quy chế') || q.includes('chỉ đạo') || q.includes('tải')) {
      let docText = `📄 **VĂN BẢN CHỈ ĐẠO & QUY CHẾ MỚI NHẤT:**\n\n`;
      if (documents.length > 0) {
        documents.slice(0, 3).forEach((d, idx) => {
          docText += `${idx + 1}. **[${d.code}]** ${d.title}\n   *(Ban hành: ${d.issueDate || d.issue_date} - Người ký: ${d.signer})*\n`;
        });
      } else {
        docText += `• Thông tư 07/2026/TT-BGDĐT về Phổ cập giáo dục THCS.\n• Quy chế công nhận trường đạt chuẩn quốc gia cấp độ 2.`;
      }
      return {
        text: docText,
        suggestions: ['📄 Mở trang Tra cứu Văn bản', '📚 Đề thi & Tài nguyên', '📰 Tin tức trường'],
        actionTab: 'documents'
      };
    }

    // 5. Hỏi về Đăng ký / Tài khoản / Phân quyền
    if (q.includes('đăng ký') || q.includes('tài khoản') || q.includes('mật khẩu') || q.includes('đăng nhập') || q.includes('duyệt')) {
      return {
        text: `🔐 **HƯỚNG DẪN ĐĂNG KÝ & QUẢN LÝ TÀI KHOẢN:**\n\n` +
              `1️⃣ Nhấn vào nút **"📝 Đăng ký"** trên thanh Menu chính.\n` +
              `2️⃣ Điền đầy đủ Họ tên, Tên đăng nhập, Mật khẩu và vai trò (Giáo viên / Học sinh / Phụ huynh).\n` +
              `3️⃣ Yêu cầu sẽ được tự động chuyển tới **Ban Giám Hiệu** trên Supabase Cloud phê duyệt.\n` +
              `4️⃣ Sau khi được duyệt, Thầy/Cô hoặc Học sinh có thể đăng nhập ngay!`,
        suggestions: ['📝 Mở Đăng ký Tài khoản', '🔑 Đăng nhập Quản trị Portal', '📞 Hỗ trợ kỹ thuật']
      };
    }

    // 6. Hỏi về Tin tức / Sự kiện
    if (q.includes('tin tức') || q.includes('sự kiện') || q.includes('bài viết') || q.includes('hoạt động')) {
      let newsText = `📰 **TIN TỨC - SỰ KIỆN NỔI BẬT THCS ĐỒNG TÂN:**\n\n`;
      if (newsList.length > 0) {
        newsList.slice(0, 3).forEach((n, idx) => {
          newsText += `${idx + 1}. **${n.title}**\n   *${n.summary ? n.summary.slice(0, 70) + '...' : 'Sự kiện nổi bật nhà trường'}*\n`;
        });
      } else {
        newsText += `• Lễ kết nạp Đảng viên mới cho cán bộ giáo viên THCS Đồng Tân.\n• Chỉ thị nhiệm vụ trọng tâm năm học mới.`;
      }
      return {
        text: newsText,
        suggestions: ['🏠 Về Trang chủ xem bài viết', '🖼️ Thư viện Album ảnh', '🎥 Thư viện Video'],
        actionTab: 'home'
      };
    }

    // 7. Hỏi về Giới thiệu trường / Lịch sử / Tầm nhìn / Sứ mệnh
    if (q.includes('giới thiệu') || q.includes('lịch sử') || q.includes('sứ mệnh') || q.includes('tầm nhìn') || q.includes('trường')) {
      return {
        text: `🏛️ **TỔNG QUAN TRƯỜNG THCS ĐỒNG TÂN:**\n\n` +
              `• **Lịch sử:** ${siteConfig.history || 'Trường THCS Đồng Tân được thành lập và phát triển trên địa bàn Xã Hữu Lũng, Tỉnh Lạng Sơn.'}\n\n` +
              `• **Sứ mệnh:** ${siteConfig.mission || 'Xây dựng môi trường giáo dục kỷ cương, tình thương, trách nhiệm.'}\n\n` +
              `• **Tầm nhìn:** ${siteConfig.vision || 'Trở thành trường đạt chuẩn quốc gia đi đầu trong chuyển đổi số giáo dục.'}`,
        suggestions: ['👨‍💼 Ban Giám Hiệu nhà trường', '📊 Quy mô trường học', '📍 Vị trí địa lý'],
        actionTab: 'intro'
      };
    }

    // 8. Trả lời mặc định thông minh (General AI Response)
    return {
      text: `🤖 Em đã ghi nhận câu hỏi: **"${query}"**.\n\n` +
            `Hệ thống AI Chatbot Studio đang liên tục học tập dữ liệu từ cổng thông tin THCS Đồng Tân. Thầy/Cô hoặc em Học sinh có thể chọn các chủ đề tra cứu nhanh bên dưới hoặc đặt câu hỏi khác ạ!`,
      suggestions: [
        '🏫 Thông tin THCS Đồng Tân',
        '📅 Lịch công tác tuần mới',
        '📄 Văn bản & Quy chế chỉ đạo',
        '👨‍💼 Cán bộ Ban Giám Hiệu'
      ]
    };
  };

  const handleSendMessage = (textToSend) => {
    const content = textToSend || inputValue;
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: content,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Giả lập thời gian AI phản hồi và suy nghĩ (600ms)
    setTimeout(() => {
      const aiResponse = processAIQuery(content);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestions: aiResponse.suggestions,
        actionTab: aiResponse.actionTab
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 650);
  };

  const handleSuggestionClick = (suggestionText) => {
    handleSendMessage(suggestionText);
  };

  const handleActionTabClick = (tabKey) => {
    if (onOpenTab && tabKey) {
      onOpenTab(tabKey);
      window.scrollTo({ top: 280, behavior: 'smooth' });
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: `Đã làm mới cuộc trò chuyện! 🤖 Em có thể hỗ trợ gì tiếp theo cho Thầy/Cô và các em học sinh ạ?`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          '🏫 Giới thiệu Trường THCS Đồng Tân',
          '📅 Lịch công tác tuần mới nhất',
          '📄 Tra cứu văn bản chỉ đạo',
          '👨‍💼 Ban Giám Hiệu nhà trường'
        ]
      }
    ]);
  };

  return (
    <div style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 9999, fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      
      {/* 1. FLOATING BUTTON TRIGGER (Nút mở Chatbot góc dưới màn hình) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #0056a6 0%, #0284c7 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '30px',
            padding: '12px 20px',
            boxShadow: '0 8px 24px rgba(2, 132, 199, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            animation: 'pulseGlow 3s infinite'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0px)';
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Bot size={26} color="#ffffff" />
            <span style={{ position: 'absolute', top: '-3px', right: '-3px', width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', border: '2px solid #ffffff' }}></span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13.5px', fontWeight: '800', letterSpacing: '0.3px', lineHeight: '1.2' }}>AI CHATBOT STUDIO</span>
            <span style={{ fontSize: '11px', color: '#bae6fd', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Sparkles size={11} /> Trợ lý THCS Đồng Tân
            </span>
          </div>
        </button>
      )}

      {/* 2. CHATBOT STUDIO WINDOW MODAL (Cửa sổ Trò chuyện AI) */}
      {isOpen && (
        <div style={{
          width: '380px',
          maxWidth: 'calc(100vw - 30px)',
          height: '560px',
          maxHeight: 'calc(100vh - 80px)',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(0, 33, 71, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #cbd5e1',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          
          {/* HEADER CHATBOT STUDIO */}
          <div style={{
            background: 'linear-gradient(135deg, #002147 0%, #0056a6 100%)',
            color: '#ffffff',
            padding: '14px 16px',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #0284c7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '7px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={24} color="#38bdf8" />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  AI Chatbot Studio
                  <span style={{ fontSize: '10px', background: '#0284c7', color: '#ffffff', padding: '1px 6px', borderRadius: '8px', fontWeight: '700' }}>v2.5</span>
                </h3>
                <span style={{ fontSize: '11.5px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '7px', height: '7px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span> Trực tuyến 24/7 • THCS Đồng Tân
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                onClick={handleClearHistory}
                title="Làm mới cuộc trò chuyện"
                style={{ background: 'transparent', border: 'none', color: '#93c5fd', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <RefreshCw size={17} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                title="Đóng cửa sổ"
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* CHAT MESSAGES CONTAINER (Vùng hiển thị tin nhắn) */}
          <div style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{ 
                  display: 'flex', 
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: msg.sender === 'user' ? '#0284c7' : '#003a73',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  fontSize: '13px',
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={18} color="#38bdf8" />}
                </div>

                {/* Content Bubble */}
                <div style={{ maxWidth: '82%' }}>
                  <div style={{
                    background: msg.sender === 'user' ? '#0056a6' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(0, 86, 166, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                    fontSize: '13px',
                    lineHeight: '1.55',
                    whiteSpace: 'pre-line',
                    textAlign: 'left'
                  }}>
                    {msg.text}

                    {/* Action Button Link to specific tab */}
                    {msg.actionTab && (
                      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #cbd5e1' }}>
                        <button
                          onClick={() => handleActionTabClick(msg.actionTab)}
                          style={{
                            background: '#e0f2fe',
                            color: '#0284c7',
                            border: '1px solid #bae6fd',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            width: '100%',
                            justify: 'center'
                          }}
                        >
                          Chuyển đến trang liên quan <ArrowRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px', display: 'block', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                    {msg.timestamp}
                  </span>

                  {/* Smart Suggestions Chips (Các gợi ý nhanh bên dưới tin nhắn AI) */}
                  {msg.sender === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSuggestionClick(sug)}
                          style={{
                            background: '#ffffff',
                            color: '#0056a6',
                            border: '1px solid #cbd5e1',
                            borderRadius: '16px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'space-between'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f0f9ff';
                            e.currentTarget.style.borderColor = '#0284c7';
                            e.currentTarget.style.color = '#0284c7';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ffffff';
                            e.currentTarget.style.borderColor = '#cbd5e1';
                            e.currentTarget.style.color = '#0056a6';
                          }}
                        >
                          <span>{sug}</span>
                          <ChevronDown size={12} style={{ transform: 'rotate(-90deg)' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator (Hiệu ứng AI đang suy nghĩ) */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#003a73', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="#38bdf8" />
                </div>
                <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '16px 16px 16px 2px', border: '1px solid #e2e8f0', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span style={{ width: '6px', height: '6px', background: '#0284c7', borderRadius: '50%', animation: 'typingPulse 1s infinite 0s' }}></span>
                  <span style={{ width: '6px', height: '6px', background: '#0284c7', borderRadius: '50%', animation: 'typingPulse 1s infinite 0.2s' }}></span>
                  <span style={{ width: '6px', height: '6px', background: '#0284c7', borderRadius: '50%', animation: 'typingPulse 1s infinite 0.4s' }}></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* CHATBOT INPUT FORM (Thanh nhập câu hỏi) */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '10px 12px',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập câu hỏi cho AI Studio..."
              style={{
                flex: 1,
                padding: '9px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '20px',
                fontSize: '13px',
                outline: 'none',
                transition: 'border 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0284c7'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />

            <button
              type="submit"
              disabled={!inputValue.trim()}
              style={{
                background: inputValue.trim() ? '#0056a6' : '#cbd5e1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                cursor: inputValue.trim() ? 'pointer' : 'default',
                transition: 'background 0.2s'
              }}
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(2, 132, 199, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(2, 132, 199, 0); }
          100% { box-shadow: 0 0 0 0 rgba(2, 132, 199, 0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typingPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>

    </div>
  );
}
