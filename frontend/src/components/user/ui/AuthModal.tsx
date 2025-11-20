import { useEffect } from 'react';

interface AuthModalProps {
  open: boolean;
  mode?: 'login' | 'register';
  onClose: () => void;
  onSwitchMode?: (m: 'login' | 'register') => void;
}

export default function AuthModal({ open, mode = 'login', onClose, onSwitchMode }: AuthModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const title = mode === 'login' ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ';
  const cta = mode === 'login' ? 'ĐĂNG NHẬP' : 'TIẾP TỤC';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" onClick={onClose} />

      {/* modal */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-10 text-gray-900 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
        <button
          aria-label="Đóng"
          className="absolute right-5 top-5 text-2xl text-gray-400 transition hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="mb-3 text-center text-3xl font-extrabold tracking-wide">{title}</h2>
        <p className="mb-8 text-center text-sm text-gray-600">
          Bạn chưa có tài khoản? Không cần đăng ký. Đăng nhập nhanh với Beauty Box bằng số điện thoại.
        </p>

        <div className="mb-6">
          <label className="mb-2 block text-sm text-gray-700">Số điện thoại</label>
          <div className="flex h-12 items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 transition focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-pink-300/40">
            <span className="text-gray-600">+84</span>
            <input
              type="tel"
              placeholder="Nhập số của bạn"
              className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <button className="mb-4 w-full rounded-full bg-linear-to-r from-yellow-400 via-orange-400 to-purple-600 py-3 font-semibold text-white shadow-[inset_0_-2px_0_rgba(255,255,255,0.25)]">
          {cta}
        </button>

        <p className="mb-3 text-center text-xs text-gray-500">*Vui lòng không huỷ đơn hàng khi đã thanh toán*</p>

        <p className="text-center text-xs text-lime-600">
          Đăng nhập ngay để mua sắm dễ dàng hơn, sử dụng những tiện ích mới nhất và tận hưởng thêm nhiều ưu đãi đặc quyền dành riêng cho thành viên Beauty Box.
        </p>

        {onSwitchMode && (
          <div className="mt-6 text-center text-sm">
            {mode === 'login' ? (
              <button className="underline" onClick={() => onSwitchMode('register')}>Chưa có tài khoản? Đăng ký</button>
            ) : (
              <button className="underline" onClick={() => onSwitchMode('login')}>Đã có tài khoản? Đăng nhập</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

