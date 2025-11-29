import React, { useState } from 'react';
import OrderStatusBadge from './OrderStatusBadge';
import {
  getValidNextStatuses,
  getOrderStatusLabel,
  isValidStatusTransition,
} from '../../../utils/orderStatusUtils';

interface OrderStatusUpdateFormProps {
  orderId: number;
  currentStatus: string;
  onSubmit: (newStatus: string, notes?: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const OrderStatusUpdateForm: React.FC<OrderStatusUpdateFormProps> = ({
  currentStatus,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const validNextStatuses = getValidNextStatuses(currentStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newStatus) {
      setError('Vui lòng chọn trạng thái mới');
      return;
    }

    if (!isValidStatusTransition(currentStatus, newStatus)) {
      setError('Không thể chuyển sang trạng thái này');
      return;
    }

    if (!confirmed) {
      setError('Vui lòng xác nhận thay đổi trạng thái');
      return;
    }

    onSubmit(newStatus, notes);
  };

  const getStatusTransitionInfo = () => {
    if (!newStatus) return null;

    const info: Record<
      string,
      { icon: string; color: string; message: string }
    > = {
      CONFIRMED: {
        icon: '',
        color: 'blue',
        message: 'Đơn hàng sẽ được xác nhận và chuyển sang xử lý',
      },
      PROCESSING: {
        icon: '',
        color: 'purple',
        message: 'Đơn hàng đang được chuẩn bị và đóng gói',
      },
      SHIPPED: {
        icon: '',
        color: 'indigo',
        message: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
      },
      DELIVERED: {
        icon: '',
        color: 'green',
        message: 'Đơn hàng đã được giao thành công đến khách hàng',
      },
      CANCELLED: {
        icon: '',
        color: 'red',
        message: 'Đơn hàng sẽ bị hủy và không thể khôi phục',
      },
    };

    return info[newStatus];
  };

  const transitionInfo = getStatusTransitionInfo();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg bg-gray-50 p-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Trạng thái hiện tại
        </label>
        <OrderStatusBadge status={currentStatus} type="order" size="lg" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Trạng thái mới <span className="text-red-500">*</span>
        </label>
        {validNextStatuses.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">
              Không có trạng thái khả dụng để chuyển đổi
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {validNextStatuses.map((status) => (
              <label
                key={status}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                  newStatus === status
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={newStatus === status}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                />
                <div className="flex-1">
                  <OrderStatusBadge status={status} type="order" />
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Transition Info */}
      {transitionInfo && (
        <div
          className={`rounded-lg border-2 border-${transitionInfo.color}-200 bg-${transitionInfo.color}-50 p-4`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{transitionInfo.icon}</span>
            <div>
              <p className={`font-medium text-${transitionInfo.color}-900`}>
                Thay đổi trạng thái
              </p>
              <p className={`mt-1 text-sm text-${transitionInfo.color}-700`}>
                {transitionInfo.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Ghi chú (không bắt buộc)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Nhập ghi chú về việc thay đổi trạng thái..."
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          Ghi chú này sẽ được lưu vào lịch sử thay đổi trạng thái
        </p>
      </div>

      <div className="rounded-lg bg-yellow-50 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded text-pink-600 focus:ring-pink-500"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              Xác nhận thay đổi trạng thái
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Tôi xác nhận rằng tôi muốn thay đổi trạng thái đơn hàng từ{' '}
              <strong>{getOrderStatusLabel(currentStatus)}</strong> sang{' '}
              <strong>
                {newStatus ? getOrderStatusLabel(newStatus) : '...'}
              </strong>
            </p>
          </div>
        </label>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || !newStatus || !confirmed}
          className="flex-1 rounded-lg bg-pink-600 px-6 py-3 font-medium text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xử lý...
            </span>
          ) : (
            'Cập nhật trạng thái'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default OrderStatusUpdateForm;
