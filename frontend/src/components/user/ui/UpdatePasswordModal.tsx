import { useState } from 'react';
import { api } from '../../../lib/api';
import { tokenStorage } from '../../../api/auth';

interface UpdatePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UpdatePasswordModal({ 
  open, 
  onClose,
  onSuccess 
}: UpdatePasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = tokenStorage.getUser();
      if (!user) {
        setError('Không tìm thấy thông tin người dùng');
        return;
      }
      
      await api.put(`/api/users/${user.userId}/set-password`, { password });
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Không thể cập nhật mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Mark as skipped in localStorage so we don't show again this session
    const user = tokenStorage.getUser();
    if (user) {
      localStorage.setItem(`password_setup_skipped_${user.userId}`, 'true');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-gray-900 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
        <h2 className="mb-2 text-center text-2xl font-bold">Thiết lập mật khẩu</h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Bạn đã đăng nhập bằng OTP. Hãy thiết lập mật khẩu để có thể đăng nhập nhanh hơn trong lần sau.
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 placeholder:text-gray-400"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mb-3 w-full rounded-full bg-linear-to-r from-pink-500 via-rose-500 to-pink-600 py-3 font-semibold text-white shadow-lg transition-all hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang xử lý...
              </span>
            ) : (
              'CẬP NHẬT MẬT KHẨU'
            )}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Bỏ qua, để sau
          </button>
        </form>
      </div>
    </div>
  );
}
