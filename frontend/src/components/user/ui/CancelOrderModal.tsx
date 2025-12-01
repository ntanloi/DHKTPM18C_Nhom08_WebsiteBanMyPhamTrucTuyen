import { useState } from 'react';
import { X } from 'lucide-react';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderCode: string;
}

export default function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  orderCode,
}: CancelOrderModalProps) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    if (reason) {
      onConfirm();
      // Reset form after confirm
      setReason('');
      setNote('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 transition hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="mb-6 text-xl font-bold text-gray-900">
          Bạn có chắc muốn hủy đơn này?
        </h2>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Mã đơn
          </label>
          <input
            type="text"
            value={orderCode}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Lí do <span className="text-red-500">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none"
          >
            <option value="">Hủy tạo lại</option>
            <option value="wrong-info">Nhập sai thông tin</option>
            <option value="change-mind">Đổi ý không mua nữa</option>
            <option value="other">Lý do khác</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Ghi chú
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú"
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border-2 border-gray-300 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason}
            className="flex-1 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
