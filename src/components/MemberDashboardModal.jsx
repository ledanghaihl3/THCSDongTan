import React, { useState } from 'react';
import { X, GraduationCap, Users, BookOpen, Calendar, Award, FileText, Send, CheckCircle, Shield, MessageSquare, Download, Bell, UserCheck, AlertCircle } from 'lucide-react';

export default function MemberDashboardModal({ user, onClose, onOpenChangePassword, onOpenAdmin }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [studentQuestion, setStudentQuestion] = useState('');
  const [parentFeedback, setParentFeedback] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');

  if (!user) return null;

  const role = user.role || 'HOC_SINH';

  const getRoleTitle = (r) => {
    switch (r) {
      case 'BGH': return { title: 'Ban Giám Hiệu', icon: <Shield size={20} color="#dc2626" />, bg: '#fef2f2', border: '#fecaca' };
      case 'GIAO_VIEN': return { title: 'Giáo Viên Bàn Làm Việc', icon: <BookOpen size={20} color="#7c3aed" />, bg: '#f3e8ff', border: '#e9d5ff' };
      case 'PHU_HUYNH': return { title: 'Sổ Liên Lạc Phụ Huynh', icon: <Users size={20} color="#d97706" />, bg: '#fffbeb', border: '#fde68a' };
      default: return { title: 'Góc Học Sinh THCS Đồng Tân', icon: <GraduationCap size={20} color="#0284c7" />, bg: '#e0f2fe', border: '#bae6fd' };
    }
  };

  const roleInfo = getRoleTitle(role);

  // Mẫu dữ liệu điểm số học sinh
  const studentGrades = [
    { subject: 'Toán Học 9', score: '9.2', eval: 'Xuất sắc', teacher: 'Cô Lê Thị Thu' },
    { subject: 'Ngữ Văn 9', score: '8.8', eval: 'Giỏi', teacher: 'Cô Nguyễn Thị Hoa' },
    { subject: 'Tiếng Anh 9', score: '9.0', eval: 'Xuất sắc', teacher: 'Thầy Phạm Minh Tuấn' },
    { subject: 'Vật Lý 9', score: '8.5', eval: 'Giỏi', teacher: 'Thầy Trần Đức Nam' },
    { subject: 'Hóa Học 9', score: '8.7', eval: 'Giỏi', teacher: 'Cô Vũ Thị Hà' },
    { subject: 'Lịch Sử & Địa Lý', score: '9.5', eval: 'Xuất sắc', teacher: 'Cô Đỗ Thị Mai' },
  ];

  // Mẫu thông báo cho phụ huynh
  const parentAnnouncements = [
    { id: 1, date: '15/08/2026', title: 'Thông báo Họp Phụ Huynh Đầu Năm Học 2026 - 2027', sender: 'Ban Giám Hiệu', content: 'Kính mời quý phụ huynh tham dự họp lúc 08h00 ngày Chủ Nhật 20/08/2026 tại phòng học 9A1.' },
    { id: 2, date: '12/08/2026', title: 'Kết Quả Khảo Sát Chất Lượng Đầu Năm Môn Toán & Văn', sender: 'GVCN Lớp 9A1', content: 'Em Nguyễn Văn An đạt 9.0 điểm môn Toán và 8.5 điểm môn Văn. Xếp loại Giỏi.' },
    { id: 3, date: '08/08/2026', title: 'Thông Báo Đăng Ký Chuyên Đề Ôn Thi Vào Lớp 10 THPT', sender: 'Tổ Chuyên Môn', content: 'Phụ huynh xem thông tin và đăng ký nguyện vọng lớp ôn thi chất lượng cao trước 25/08.' },
  ];

  const handleSendQuestion = (e) => {
    e.preventDefault();
    if (!studentQuestion.trim() && !parentFeedback.trim()) return;
    setSubmittedMessage('✅ Ý kiến / câu hỏi của bạn đã được gửi thành công tới Ban Giám Hiệu & Giáo viên!');
    setStudentQuestion('');
    setParentFeedback('');
    setTimeout(() => setSubmittedMessage(''), 5000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px', width: '95%' }}>
        
        {/* HEADER MODAL */}
        <div className="modal-header" style={{ background: '#0056a6', padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {roleInfo.icon}
            <span style={{ fontSize: '15px', fontWeight: '800', color: 'white', letterSpacing: '0.3px' }}>
              {roleInfo.title.toUpperCase()}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body" style={{ padding: '20px' }}>
          
          {/* BADGE THÔNG TIN THÀNH VIÊN */}
          <div style={{ background: roleInfo.bg, border: `1px solid ${roleInfo.border}`, borderRadius: '10px', padding: '14px 18px', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', background: '#0056a6', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' }}>
                {(user.fullName || user.username).charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', color: '#003a73', fontWeight: '800' }}>
                  {user.fullName || user.username}
                </h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#475569' }}>
                  Tài khoản: <strong>{user.username}</strong> | Chức vụ: <strong style={{ color: '#0284c7' }}>{roleInfo.title}</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={onOpenChangePassword}
                style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                🔑 Đổi Mật Khẩu
              </button>
              {(role === 'BGH' || role === 'GIAO_VIEN') && (
                <button 
                  onClick={onOpenAdmin}
                  style={{ background: '#0056a6', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  🛡️ Cổng Quản Trị
                </button>
              )}
            </div>
          </div>

          {/* TAB ĐIỀU HƯỚNG BÊN TRONG */}
          <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '18px', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'overview' ? '3px solid #0056a6' : '3px solid transparent',
                color: activeTab === 'overview' ? '#0056a6' : '#64748b',
                fontWeight: activeTab === 'overview' ? '800' : '600',
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              📌 Tổng Quan & Điểm Số
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'schedule' ? '3px solid #0056a6' : '3px solid transparent',
                color: activeTab === 'schedule' ? '#0056a6' : '#64748b',
                fontWeight: activeTab === 'schedule' ? '800' : '600',
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              📅 Thời Khóa Biểu & Ôn Thi
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'feedback' ? '3px solid #0056a6' : '3px solid transparent',
                color: activeTab === 'feedback' ? '#0056a6' : '#64748b',
                fontWeight: activeTab === 'feedback' ? '800' : '600',
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              💬 Ý Kiến & Hỏi Đáp
            </button>
          </div>

          {/* THÔNG BÁO GỬI THÀNH CÔNG */}
          {submittedMessage && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '10px 14px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
              <CheckCircle size={18} /> {submittedMessage}
            </div>
          )}

          {/* NỘI DUNG TAB 1: TỔNG QUAN & ĐIỂM SỐ */}
          {activeTab === 'overview' && (
            <div>
              {role === 'HOC_SINH' && (
                <div>
                  <h4 style={{ fontSize: '14.5px', color: '#003a73', margin: '0 0 10px 0', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={18} color="#0284c7" /> BẢNG ĐIỂM KHẢO SÁT & HỌC KỲ I (LỚP 9A1)
                  </h4>
                  <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textWrap: 'nowrap' }}>
                      <thead>
                        <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', color: '#1e293b' }}>
                          <th style={{ padding: '9px 12px', textAlign: 'left' }}>Môn Học</th>
                          <th style={{ padding: '9px 12px', textAlign: 'center' }}>Điểm Số</th>
                          <th style={{ padding: '9px 12px', textAlign: 'center' }}>Xếp Loại</th>
                          <th style={{ padding: '9px 12px', textAlign: 'left' }}>Giáo Viên Bộ Môn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentGrades.map((g, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                            <td style={{ padding: '9px 12px', fontWeight: '700', color: '#0f172a' }}>{g.subject}</td>
                            <td style={{ padding: '9px 12px', textAlign: 'center', fontWeight: '800', color: '#0284c7', fontSize: '14px' }}>{g.score}</td>
                            <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                              <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>{g.eval}</span>
                            </td>
                            <td style={{ padding: '9px 12px', color: '#475569' }}>{g.teacher}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {role === 'PHU_HUYNH' && (
                <div>
                  <h4 style={{ fontSize: '14.5px', color: '#003a73', margin: '0 0 10px 0', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bell size={18} color="#d97706" /> SỔ LIÊN LẠC ĐIỆN TỬ & THÔNG BÁO NHÀ TRƯỜNG
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {parentAnnouncements.map((item) => (
                      <div key={item.id} style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <strong style={{ fontSize: '13.5px', color: '#92400e' }}>{item.title}</strong>
                          <span style={{ fontSize: '11.5px', color: '#b45309', background: '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>📅 {item.date}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '12.5px', color: '#78350f' }}>{item.content}</p>
                        <span style={{ fontSize: '11px', color: '#92400e', display: 'block', marginTop: '6px', fontWeight: '600' }}>
                          📌 Người gửi: {item.sender}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(role === 'GIAO_VIEN' || role === 'BGH') && (
                <div>
                  <h4 style={{ fontSize: '14.5px', color: '#003a73', margin: '0 0 10px 0', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCheck size={18} color="#7c3aed" /> THÔNG TIN NHIỆM VỤ GIẢNG DẠY & ĐÀO TẠO
                  </h4>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px', fontSize: '13px', color: '#334155' }}>
                    <p style={{ margin: '0 0 8px 0' }}>• <strong>Tổ chuyên môn:</strong> Tổ Toán - Khoa Học Tự Nhiên & Tổ Ngữ Văn</p>
                    <p style={{ margin: '0 0 8px 0' }}>• <strong>Lớp giảng dạy chính:</strong> Lớp 9A1, 9A2, 8A1</p>
                    <p style={{ margin: '0 0 8px 0' }}>• <strong>Nhiệm vụ tuần này:</strong> Cập nhật lịch thi HKI, upload tài liệu học tập mới lên hệ thống.</p>
                    <button 
                      onClick={onOpenAdmin} 
                      style={{ background: '#0056a6', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      🛡️ Mở Cổng Quản Trị Đăng Bài & Tài Liệu
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* NỘI DUNG TAB 2: THỜI KHÓA BIỂU */}
          {activeTab === 'schedule' && (
            <div>
              <h4 style={{ fontSize: '14.5px', color: '#003a73', margin: '0 0 10px 0', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={18} color="#0056a6" /> THỜI KHÓA BIỂU HỌC TẬP & LỊCH ÔN THI (LỚP 9A1)
              </h4>
              <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ background: '#0056a6', color: 'white' }}>
                      <th style={{ padding: '8px', textAlign: 'center' }}>Thứ Hai</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>Thứ Ba</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>Thứ Tư</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>Thứ Năm</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>Thứ Sáu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}><strong>Sáng:</strong> Toán 9 (T1-T2)<br/>Văn 9 (T3-T4)</td>
                      <td style={{ padding: '8px' }}><strong>Sáng:</strong> Tiếng Anh (T1-T2)<br/>Vật Lý (T3-T4)</td>
                      <td style={{ padding: '8px' }}><strong>Sáng:</strong> Hóa Học (T1-T2)<br/>Sinh Học (T3-T4)</td>
                      <td style={{ padding: '8px' }}><strong>Sáng:</strong> Lịch Sử (T1-T2)<br/>Địa Lý (T3-T4)</td>
                      <td style={{ padding: '8px' }}><strong>Sáng:</strong> Ôn tập Toán (T1-T2)<br/>GDCD (T3-T4)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* NỘI DUNG TAB 3: Ý KIẾN & HOẢI ĐÁP */}
          {activeTab === 'feedback' && (
            <div>
              <h4 style={{ fontSize: '14.5px', color: '#003a73', margin: '0 0 10px 0', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={18} color="#0284c7" /> GỬI Ý KIẾN & HỎI ĐÁP TỚI BAN GIÁM HIỆU & GIÁO VIÊN
              </h4>
              <form onSubmit={handleSendQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea
                  rows={4}
                  value={role === 'PHU_HUYNH' ? parentFeedback : studentQuestion}
                  onChange={(e) => role === 'PHU_HUYNH' ? setParentFeedback(e.target.value) : setStudentQuestion(e.target.value)}
                  placeholder={role === 'PHU_HUYNH' ? "Nhập ý kiến đóng góp hoặc thắc mắc của phụ huynh..." : "Nhập câu hỏi hoặc thắc mắc bài tập gửi giáo viên..."}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
                />
                <button
                  type="submit"
                  style={{
                    alignSelf: 'flex-start',
                    background: '#0056a6',
                    color: 'white',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={15} /> Gửi Ý Kiến Ngay
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
