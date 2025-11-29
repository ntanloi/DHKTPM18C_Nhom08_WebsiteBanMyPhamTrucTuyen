import React from 'react';
import OrderStatusBadge from '../order/OrderStatusBadge';
import {
  formatDateTime,
  getTrackingUrl,
} from '../../../utils/orderStatusUtils';

interface Shipment {
  id: number;
  orderId: number;
  status: string;
  trackingCode: string;
  shippingProviderName: string;
  shippedAt: string;
  deliveredAt: string;
  createdAt: string;
  updatedAt: string;
}

interface ShipmentTrackingCardProps {
  shipment: Shipment;
  estimateDeliveryFrom?: string;
  estimateDeliveryTo?: string;
  onUpdateTracking?: (trackingCode: string) => void;
}

const ShipmentTrackingCard: React.FC<ShipmentTrackingCardProps> = ({
  shipment,
  estimateDeliveryFrom,
  estimateDeliveryTo,
  onUpdateTracking,
}) => {
  const trackingUrl = getTrackingUrl(
    shipment.shippingProviderName,
    shipment.trackingCode,
  );

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">
          Thông Tin Vận Chuyển
        </h3>
        <OrderStatusBadge status={shipment.status} type="shipment" />
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div>
            <p className="text-xs text-gray-500">Đơn vị vận chuyển</p>
            <p className="text-sm font-medium text-gray-900">
              {shipment.shippingProviderName === 'GHN' && 'Giao Hàng Nhanh'}
              {shipment.shippingProviderName === 'GHTK' &&
                'Giao Hàng Tiết Kiệm'}
              {shipment.shippingProviderName === 'VNPOST' && 'VNPost'}
              {shipment.shippingProviderName === 'JT' && 'J&T Express'}
              {shipment.shippingProviderName === 'VIETTEL' && 'Viettel Post'}
              {shipment.shippingProviderName === 'NINJA' && 'Ninja Van'}
              {!['GHN', 'GHTK', 'VNPOST', 'JT', 'VIETTEL', 'NINJA'].includes(
                shipment.shippingProviderName,
              ) && shipment.shippingProviderName}
            </p>
          </div>
        </div>

        {shipment.trackingCode && (
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
              <svg
                className="h-5 w-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Mã vận đơn</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-medium text-gray-900">
                  {shipment.trackingCode}
                </p>
                {trackingUrl !== '#' && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800"
                    title="Tra cứu đơn hàng"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {estimateDeliveryFrom && estimateDeliveryTo && (
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
              <svg
                className="h-5 w-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Dự kiến giao hàng</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(estimateDeliveryFrom).toLocaleDateString('vi-VN')} -{' '}
                {new Date(estimateDeliveryTo).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        )}

        {shipment.shippedAt && (
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
              <svg
                className="h-5 w-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Thời gian giao vận</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDateTime(shipment.shippedAt)}
              </p>
            </div>
          </div>
        )}

        {shipment.deliveredAt && (
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Đã giao hàng lúc</p>
              <p className="text-sm font-medium text-green-600">
                {formatDateTime(shipment.deliveredAt)}
              </p>
            </div>
          </div>
        )}

        {onUpdateTracking && (
          <div className="pt-3">
            <button
              onClick={() => onUpdateTracking(shipment.trackingCode)}
              className="w-full rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
            >
              Cập nhật thông tin vận chuyển
            </button>
          </div>
        )}

        <div className="border-t pt-3">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>
              <span className="font-medium">Tạo lúc:</span>
              <br />
              {formatDateTime(shipment.createdAt)}
            </div>
            <div>
              <span className="font-medium">Cập nhật:</span>
              <br />
              {formatDateTime(shipment.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTrackingCard;
