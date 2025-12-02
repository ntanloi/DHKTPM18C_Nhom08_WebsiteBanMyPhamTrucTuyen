import { useState, useEffect } from 'react';
import { authApi, tokenStorage } from '../../../api/auth';
import type { AuthResponse } from '../../../api/auth';


interface AuthModalProps {
  open: boolean;
  mode?: 'login' | 'register';
  onClose: () => void;
  onSwitchMode?: (m: 'login' | 'register') => void;
  onAuthSuccess?: (user: { userId: number; email: string; role: string }) => void;
}

type LoginMethod = 'otp' | 'password';
type AuthStep = 'input' | 'otp-sent' | 'loading';

export default function AuthModal({ 
  open, 
  mode = 'login', 
  onClose, 
  onSwitchMode,
  onAuthSuccess 
}: AuthModalProps) {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // UI state
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('otp');
  const [authStep, setAuthStep] = useState<AuthStep>('input');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      setEmail('');
      setPassword('');
      setFullName('');
      setOtpCode('');
      setError('');
      setAuthStep('input');
      setLoginMethod('otp');
      setCountdown(0);
    }
  }, [open, mode]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleAuthSuccess = (response: AuthResponse) => {
    // Save tokens and user info
    tokenStorage.saveTokens(response.accessToken, response.refreshToken);
    tokenStorage.saveUser({
      userId: response.userId,
      email: response.email,
      role: response.role,
    });

    // Notify parent component
    if (onAuthSuccess) {
      onAuthSuccess({
        userId: response.userId,
        email: response.email,
        role: response.role,
      });
    }

    onClose();
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authApi.sendOtp({ email });
      setAuthStep('otp-sent');
      setCountdown(60); // 60 seconds countdown
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      setError('Vui lòng nhập mã OTP 6 số');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.verifyOtp({ email, code: otpCode });
      handleAuthSuccess(response);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn');
    } finally {
      setIsLoading(false);
    }
  };

  // Login with password
  const handlePasswordLogin = async () => {
    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.login({ email, password });
      handleAuthSuccess(response);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.register({ email, password, fullName });
      handleAuthSuccess(response);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'register') {
      handleRegister();
    } else {
      if (loginMethod === 'password') {
        handlePasswordLogin();
      } else if (authStep === 'input') {
        handleSendOtp();
      } else {
        handleVerifyOtp();
      }
    }
  };

  const title = mode === 'login' ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" 
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-10 text-gray-900 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
        <button
          aria-label="Đóng"
          className="absolute right-5 top-5 text-2xl text-gray-400 transition hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="mb-3 text-center text-3xl font-extrabold tracking-wide">{title}</h2>
        
        {mode === 'login' && (
          <p className="mb-6 text-center text-sm text-gray-600">
            Đăng nhập nhanh với Beauty Box bằng email. Chọn phương thức đăng nhập phù hợp.
          </p>
        )}

        {mode === 'register' && (
          <p className="mb-6 text-center text-sm text-gray-600">
            Tạo tài khoản để mua sắm dễ dàng hơn và nhận nhiều ưu đãi đặc biệt.
          </p>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Login method tabs (only for login mode) */}
          {mode === 'login' && authStep === 'input' && (
            <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('otp');
                  setError('');
                }}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                  loginMethod === 'otp'
                    ? 'bg-white text-pink-600 shadow'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Đăng nhập bằng OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('password');
                  setError('');
                }}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                  loginMethod === 'password'
                    ? 'bg-white text-pink-600 shadow'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Đăng nhập bằng mật khẩu
              </button>
            </div>
          )}

          {/* Register form */}
          {mode === 'register' && (
            <>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 placeholder:text-gray-400"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 placeholder:text-gray-400"
                />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 placeholder:text-gray-400"
                />
              </div>
            </>
          )}

          {/* Login with OTP - Step 1: Enter email */}
          {mode === 'login' && loginMethod === 'otp' && authStep === 'input' && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 placeholder:text-gray-400"
              />
              <p className="mt-2 text-xs text-gray-500">
                Chúng tôi sẽ gửi mã OTP đến email của bạn
              </p>
            </div>
          )}

          {/* Login with OTP - Step 2: Enter OTP code */}
          {mode === 'login' && loginMethod === 'otp' && authStep === 'otp-sent' && (
            <div className="mb-6">
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-700">
                Mã OTP đã được gửi đến <strong>{email}</strong>
              </div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Nhập mã OTP</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Nhập mã 6 số"
                maxLength={6}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-2xl tracking-[0.5em] text-gray-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 placeholder:text-sm placeholder:tracking-normal"
              />
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep('input');
                    setOtpCode('');
                    setError('');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Đổi email
                </button>
                {countdown > 0 ? (
                  <span className="text-sm text-gray-500">
                    Gửi lại sau {countdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-sm text-pink-600 hover:text-pink-700"
                    disabled={isLoading}
                  >
                    Gửi lại mã
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Login with Password */}
          {mode === 'login' && loginMethod === 'password' && (
            <>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 placeholder:text-gray-400"
                />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 placeholder:text-gray-400"
                />
              </div>
            </>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mb-4 w-full rounded-full bg-linear-to-r from-pink-500 via-rose-500 to-pink-600 py-3 font-semibold text-white shadow-lg transition-all hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang xử lý...
              </span>
            ) : mode === 'register' ? (
              'ĐĂNG KÝ'
            ) : loginMethod === 'otp' && authStep === 'input' ? (
              'GỬI MÃ OTP'
            ) : loginMethod === 'otp' && authStep === 'otp-sent' ? (
              'XÁC NHẬN'
            ) : (
              'ĐĂNG NHẬP'
            )}
          </button>
        </form>

        <p className="mb-3 text-center text-xs text-gray-500">
          *Đăng nhập để mua sắm và nhận nhiều ưu đãi đặc biệt*
        </p>

        <p className="text-center text-xs text-emerald-600">
          Đăng nhập ngay để mua sắm dễ dàng hơn, sử dụng những tiện ích mới nhất và tận hưởng thêm nhiều ưu đãi đặc quyền dành riêng cho thành viên Beauty Box.
        </p>

        {/* Switch mode link */}
        {onSwitchMode && (
          <div className="mt-6 text-center text-sm">
            {mode === 'login' ? (
              <button 
                className="text-pink-600 underline hover:text-pink-700" 
                onClick={() => onSwitchMode('register')}
              >
                Chưa có tài khoản? Đăng ký ngay
              </button>
            ) : (
              <button 
                className="text-pink-600 underline hover:text-pink-700" 
                onClick={() => onSwitchMode('login')}
              >
                Đã có tài khoản? Đăng nhập
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

