import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
}

export default function OTPModal({ isOpen, onClose, onVerify }: OTPModalProps) {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(122);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerify();
    }
  };

  const handleResend = () => {
    setCountdown(122);
    setOtp('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 transition hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
          NHẬP MÃ OTP
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Vui lòng kiểm tra số điện thoại của bạn để
          <br />
          có mã xác thực đơn hàng
        </p>

        <input
          type="text"
          maxLength={6}
          placeholder="Nhập mã OTP 6 chữ số"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg font-semibold tracking-widest focus:border-pink-500 focus:outline-none"
        />

        <div className="mb-6 text-center">
          <span className="font-bold text-red-500">
            {Math.floor(countdown / 60)
              .toString()
              .padStart(2, '0')}
            :{(countdown % 60).toString().padStart(2, '0')}
          </span>
          <button
            onClick={handleResend}
            disabled={countdown > 0}
            className="ml-2 text-sm text-gray-600 hover:text-pink-600 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            Gửi lại mã OTP
          </button>
        </div>

        <button
          onClick={handleVerify}
          disabled={otp.length !== 6}
          className="w-full rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 py-3.5 text-sm font-bold tracking-wide text-white uppercase shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hoàn tất đơn hàng
        </button>
      </div>
    </div>
  );
}
