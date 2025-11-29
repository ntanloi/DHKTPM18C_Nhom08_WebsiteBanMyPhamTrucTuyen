import React from 'react';
import type { OrderStatusHistory } from '../../../types/OrderStatusHistory';
import OrderStatusBadge from './OrderStatusBadge';
import {
  getRelativeTime,
  formatDateTime,
} from '../../../utils/orderStatusUtils';

interface OrderStatusTimelineProps {
  history: OrderStatusHistory[];
  currentStatus: string;
}

const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  history,
}) => {
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const getStatusIcon = (status: string, _isLatest: boolean) => {
    const icons: Record<string, React.ReactNode> = {
      PENDING: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      CONFIRMED: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      PROCESSING: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      SHIPPED: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
        </svg>
      ),
      DELIVERED: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      CANCELLED: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };

    return icons[status] || icons.PENDING;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'text-yellow-600 bg-yellow-100',
      CONFIRMED: 'text-blue-600 bg-blue-100',
      PROCESSING: 'text-purple-600 bg-purple-100',
      SHIPPED: 'text-indigo-600 bg-indigo-100',
      DELIVERED: 'text-green-600 bg-green-100',
      CANCELLED: 'text-red-600 bg-red-100',
    };
    return colors[status] || colors.PENDING;
  };

  const getLineColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-200',
      CONFIRMED: 'bg-blue-200',
      PROCESSING: 'bg-purple-200',
      SHIPPED: 'bg-indigo-200',
      DELIVERED: 'bg-green-200',
      CANCELLED: 'bg-red-200',
    };
    return colors[status] || colors.PENDING;
  };

  if (sortedHistory.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow">
        <p className="text-gray-500">Chưa có lịch sử thay đổi trạng thái</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-6 text-lg font-bold text-gray-800">
        Lịch Sử Trạng Thái
      </h3>

      <div className="relative">
        {sortedHistory.map((item, index) => {
          const isLatest = index === 0;
          const isLast = index === sortedHistory.length - 1;

          return (
            <div key={item.id} className="relative pb-8 last:pb-0">
              {!isLast && (
                <div
                  className={`absolute top-10 left-[19px] h-full w-0.5 ${getLineColor(
                    item.status,
                  )}`}
                />
              )}

              <div className="relative flex gap-4">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getStatusColor(
                    item.status,
                  )} ${isLatest ? 'ring-4 ring-pink-100' : ''}`}
                >
                  {getStatusIcon(item.status, isLatest)}
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={item.status} type="order" />
                      {isLatest && (
                        <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-800">
                          Hiện tại
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getRelativeTime(item.createdAt)}
                    </div>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">
                    {formatDateTime(item.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
