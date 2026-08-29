import React, { useState } from 'react';
import { UserPlus, X, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function RegisterModal({ onClose, onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('HOC_SINH');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const cleanUsername = username.trim().toLowerCase();
    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanUsername || !password || !cleanFullName) {
      setError('⚠️ Vui lòng điền đầy đủ Tên tài khoản, Mật khẩu và Họ tên thành viên!');
      setLoading(false);
      return;
    }

    if (cleanUsername.length < 3) {
      setError('⚠️ Tên tài khoản mong muốn phải có ít nhất 3 ký tự!');
      setLoading(false);
      return;
    }

    // 1. Kiểm tra xem Tên tài khoản đã tồn tại trên Supabase Cloud chưa
    if (supabase) {
      try {
        const { data: existingUsers } = await supabase.from('users').select('id, username').eq('username', cleanUsername);
        if (existingUsers && existingUsers.length > 0) {
          setError(`⚠️ Tên tài khoản "${cleanUsername}" đã được đăng ký trước đó. Vui lòng chọn tên tài khoản khác!`);
          setLoading(false);
          return;
        }
      } catch (err) {}
    }

    const newPendingUser = {
      id: Date.now(),
      username: cleanUsername,
      password,
      fullName: cleanFullName,
      email: cleanEmail,
      role,
      status: 'PENDING',
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    // 2. Lưu đơn đăng ký lên Supabase Cloud Postgres
    if (supabase) {
      try {
        const userPayload = {
          username: newPendingUser.username,
          password: newPendingUser.password,
          full_name: newPendingUser.fullName,
          role: newPendingUser.role,
          status: 'PENDING'
        };
        const { error: insErr } = await supabase.from('users').insert([userPayload]);

        if (insErr) {
          if (insErr.code === '23505' || insErr.message.includes('unique')) {
            setError(`⚠️ Tên tài khoản "${cleanUsername}" đã được đăng ký trước đó. Vui lòng chọn tên khác!`);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Lỗi đăng ký Supabase Cloud:', err);
      }
    }

    // 3. Thử gửi đăng ký tới Backend API SQLite (Nếu Backend online)
    try {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password, fullName: cleanFullName, email: cleanEmail, role })
      });
    } catch (err) {}

    // 4. Lưu đơn đăng ký vào LocalStorage để Admin duyệt ngay tức thì
    try {
      const existingPending = JSON.parse(localStorage.getItem('portal_pending_users') || '[]');
      const updatedPending = [newPendingUser, ...existingPending.filter(u => u.username !== cleanUsername)];
      localStorage.setItem('portal_pending_users', JSON.stringify(updatedPending));
    } catch (err) {}

    setMessage(`🎉 Đã gửi đơn đăng ký thành công cho tài khoản "${cleanUsername}"! Vui lòng chờ Ban Giám Hiệu phê duyệt.`);

    if (onRegisterSuccess) {
      onRegisterSuccess(newPendingUser);
    }

    setUsername('');
    setPassword('');
    setFullName('');
    setEmail('');
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header" style={{ background: '#0056a6' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <UserPlus size={18} /> ĐĂNG KÝ THÀNH VIÊN THCS ĐỒNG TÂN
          </span>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <p style={{ fontSize: '12.5px', color: '#64748b' }}>
              Điền thông tin để đăng ký tài khoản Học sinh / Phụ huynh / Giáo viên. Tài khoản sẽ được chuyển tới Ban Giám Hiệu trên Supabase Cloud kích hoạt.
            </p>
          </div>

          {message && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '10px 12px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
              <CheckCircle size={16} /> {message}
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Họ và tên thành viên:</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="VD: Nguyễn Văn An" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Tên tài khoản mong muốn:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Tên đăng nhập..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Mật khẩu:</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '8px 36px 8px 8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
                    placeholder="Mật khẩu..." 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Email liên hệ:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Email..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>Vai trò thành viên:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  <option value="HOC_SINH">🎓 Học Sinh</option>
                  <option value="PHU_HUYNH">👨‍👩‍👧 Phụ Huynh</option>
                  <option value="GIAO_VIEN">👨‍🏫 Giáo Viên</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ background: '#0056a6', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', marginTop: '10px' }}>
              {loading ? 'Đang gửi...' : '🚀 GỬI ĐĂNG KÝ CHO BGH DUYỆT (LƯU TRÊN CLOUD)'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
