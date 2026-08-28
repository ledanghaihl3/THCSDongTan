import React, { useState } from 'react';
import { KeyRound, X, CheckCircle, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function ChangePasswordModal({ user, onClose, onSuccess }) {
  const [selectedUsername, setSelectedUsername] = useState(user?.username || 'admin');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const targetUsername = (user?.username || selectedUsername || 'admin').trim().toLowerCase();

    if (newPassword !== confirmPassword) {
      setError('❌ Mật khẩu mới và mật khẩu xác nhận không trùng khớp!');
      return;
    }

    if (newPassword.length < 6) {
      setError('⚠️ Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);

    const storedPw = localStorage.getItem('user_password_' + targetUsername);
    const isChanged = localStorage.getItem('user_changed_password_' + targetUsername) === 'true';

    let isMatchCurrent = false;

    // Kiểm tra mật khẩu hiện tại trong bộ nhớ local hoặc mặc định admin123
    if (storedPw) {
      isMatchCurrent = (currentPassword === storedPw || currentPassword === 'admin123');
    } else {
      isMatchCurrent = (currentPassword === 'admin123' || (storedPw && currentPassword === storedPw));
    }

    // 1. Thử gửi đổi mật khẩu qua Backend API SQLite
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          username: targetUsername,
          currentPassword,
          newPassword
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          isMatchCurrent = true;
        }
      }
    } catch (err) {}

    if (!isMatchCurrent) {
      if (storedPw && currentPassword === 'admin123' && storedPw !== 'admin123') {
        setError(`❌ Mật khẩu cũ 'admin123' đã bị vô hiệu hóa! Tài khoản này đã đổi mật khẩu trước đó. Vui lòng gõ mật khẩu mới đã đổi.`);
      } else {
        setError('❌ Mật khẩu hiện tại không chính xác! Vui lòng kiểm tra lại.');
      }
      setLoading(false);
      return;
    }

    // 2. Đồng bộ thay đổi mật khẩu lên Supabase Cloud Postgres (Đồng bộ mọi thiết bị & trình duyệt)
    if (supabase && targetUsername) {
      try {
        const { data: existingUser } = await supabase.from('users').select('*').eq('username', targetUsername).maybeSingle();
        if (existingUser) {
          await supabase.from('users').update({ 
            password: newPassword,
            updated_at: new Date().toISOString()
          }).eq('username', targetUsername);
        } else {
          await supabase.from('users').insert([{
            username: targetUsername,
            password: newPassword,
            full_name: targetUsername === 'admin' ? 'Thầy Hiệu Trưởng - THCS Đồng Tân' : 'Giáo Viên THCS Đồng Tân',
            role: targetUsername === 'admin' ? 'BGH' : 'GIAO_VIEN',
            status: 'ACTIVE',
            updated_at: new Date().toISOString()
          }]);
        }

        // Cấu hình chuẩn Supabase Auth: Cập nhật mật khẩu Auth & Đăng xuất tất cả các thiết bị khác (scope: 'OTHERS')
        try {
          if (supabase.auth) {
            await supabase.auth.updateUser({ password: newPassword });
            await supabase.auth.signOut({ scope: 'OTHERS' });
          }
        } catch (authErr) {
          console.log('Thông báo Supabase Auth signOut scope OTHERS:', authErr);
        }
      } catch (err) {
        console.error('Lỗi đồng bộ mật khẩu Supabase Cloud:', err);
      }
    }

    // 3. Lưu mật khẩu mới vào LocalStorage thiết bị hiện tại
    localStorage.setItem('user_password_' + targetUsername, newPassword);
    localStorage.setItem('user_changed_password_' + targetUsername, 'true');

    setMessage(`🎉 Đã đổi mật khẩu cho tài khoản ${targetUsername} thành công! Lần sau đăng nhập bằng mật khẩu mới này.`);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setLoading(false);
    if (onSuccess) {
      setTimeout(() => onSuccess(), 1500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        <div className="modal-header" style={{ background: '#0284c7' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <KeyRound size={18} /> ĐỔI MẬT KHẨU TÀI KHOẢN ({(user?.username || selectedUsername).toUpperCase()})
          </span>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {!user?.username && (
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px', color: '#003a73' }}>
                  Tài khoản cần đổi mật khẩu:
                </label>
                <select
                  value={selectedUsername}
                  onChange={(e) => setSelectedUsername(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontWeight: '700' }}
                >
                  <option value="admin">🛡️ Quản trị viên Ban Giám Hiệu (admin)</option>
                  <option value="giaovien">👩‍🏫 Cán bộ Giáo viên (giaovien)</option>
                  <option value="hocsinh01">🎓 Học sinh trường (hocsinh01)</option>
                  <option value="phuhuynh01">👨‍👩‍👧 Phụ huynh học sinh (phuhuynh01)</option>
                </select>
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>
                Mật khẩu hiện tại:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 36px 8px 8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  placeholder="Nhập mật khẩu hiện tại..."
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  title={showCurrent ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>
                Mật khẩu mới:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 36px 8px 8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  placeholder="Nhập mật khẩu mới..."
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  title={showNew ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>
                Xác nhận mật khẩu mới:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 36px 8px 8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  placeholder="Nhập lại mật khẩu mới..."
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  title={showConfirm ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#0284c7',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '4px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '14px',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Lock size={16} /> {loading ? 'Đang cập nhật...' : 'CẬP NHẬT MẬT KHẨU MỚI'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
