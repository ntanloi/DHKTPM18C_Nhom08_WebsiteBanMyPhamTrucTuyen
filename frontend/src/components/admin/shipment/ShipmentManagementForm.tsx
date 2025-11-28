import React, { useState, useEffect } from 'react';
import type { Shipment } from '../../../types/Shipment';
import OrderStatusBadge from '../order/OrderStatusBadge';
import {
  SHIPPING_PROVIDERS,
  SHIPMENT_STATUS,
} from '../../../contants/orderConstants';
import { getShipmentStatusLabel } from '../../../utils/orderStatusUtils';

interface ShipmentManagementFormProps {
  orderId: number;
  shipment: Shipment | null;
  onSubmit: (data: ShipmentFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface ShipmentFormData {
  shippingProviderName: string;
  trackingCode: string;
  status: string;
  shippedAt?: string;
  deliveredAt?: string;
}

const ShipmentManagementForm: React.FC<ShipmentManagementFormProps> = ({
  shipment,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ShipmentFormData>({
    shippingProviderName: shipment?.shippingProviderName || '',
    trackingCode: shipment?.trackingCode || '',
    status: shipment?.status || 'PENDING',
    shippedAt: shipment?.shippedAt || '',
    deliveredAt: shipment?.deliveredAt || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.status === 'SHIPPED' && !formData.shippedAt) {
      setFormData((prev) => ({
        ...prev,
        shippedAt: new Date().toISOString().slice(0, 16),
      }));
    }
    if (formData.status === 'DELIVERED' && !formData.deliveredAt) {
      setFormData((prev) => ({
        ...prev,
        deliveredAt: new Date().toISOString().slice(0, 16),
      }));
    }
  }, [formData.status]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.shippingProviderName.trim()) {
      newErrors.shippingProviderName = 'Vui lòng chọn đơn vị vận chuyển';
    }

    if (
      ['SHIPPED', 'IN_TRANSIT', 'DELIVERED'].includes(formData.status) &&
      !formData.trackingCode.trim()
    ) {
      newErrors.trackingCode = 'Vui lòng nhập mã vận đơn';
    }

    if (formData.status === 'SHIPPED' && !formData.shippedAt) {
      newErrors.shippedAt = 'Vui lòng chọn ngày giao hàng';
    }

    if (formData.status === 'DELIVERED' && !formData.deliveredAt) {
      newErrors.deliveredAt = 'Vui lòng chọn ngày giao thành công';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const isNewShipment = !shipment;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {shipment && (
        <div className="rounded-lg bg-gray-50 p-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Trạng thái hiện tại
          </label>
          <OrderStatusBadge
            status={shipment.status}
            type="shipment"
            size="lg"
          />
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Đơn vị vận chuyển <span className="text-red-500">*</span>
        </label>
        <select
          name="shippingProviderName"
          value={formData.shippingProviderName}
          onChange={handleChange}
          className={`block w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
            errors.shippingProviderName
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-pink-500 focus:ring-pink-200'
          }`}
        >
          <option value="">-- Chọn đơn vị vận chuyển --</option>
          {SHIPPING_PROVIDERS.map((provider) => (
            <option key={provider.value} value={provider.value}>
              {provider.label}
            </option>
          ))}
        </select>
        {errors.shippingProviderName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.shippingProviderName}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Mã vận đơn
          {['SHIPPED', 'IN_TRANSIT', 'DELIVERED'].includes(formData.status) && (
            <span className="text-red-500"> *</span>
          )}
        </label>
        <input
          type="text"
          name="trackingCode"
          value={formData.trackingCode}
          onChange={handleChange}
          placeholder="Nhập mã vận đơn (VD: GHN123456789)"
          className={`block w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
            errors.trackingCode
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-pink-500 focus:ring-pink-200'
          }`}
        />
        {errors.trackingCode && (
          <p className="mt-1 text-sm text-red-600">{errors.trackingCode}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Mã vận đơn được cung cấp bởi đơn vị vận chuyển
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Trạng thái vận chuyển <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(SHIPMENT_STATUS).map(([_key, value]) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-all ${
                formData.status === value
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="status"
                value={value}
                checked={formData.status === value}
                onChange={handleChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {getShipmentStatusLabel(value)}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {['SHIPPED', 'IN_TRANSIT', 'DELIVERED'].includes(formData.status) && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Ngày giao cho đơn vị vận chuyển{' '}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="shippedAt"
            value={formData.shippedAt ? formData.shippedAt.slice(0, 16) : ''}
            onChange={handleChange}
            className={`block w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
              errors.shippedAt
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-pink-500 focus:ring-pink-200'
            }`}
          />
          {errors.shippedAt && (
            <p className="mt-1 text-sm text-red-600">{errors.shippedAt}</p>
          )}
        </div>
      )}

      {formData.status === 'DELIVERED' && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Ngày giao hàng thành công <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="deliveredAt"
            value={
              formData.deliveredAt ? formData.deliveredAt.slice(0, 16) : ''
            }
            onChange={handleChange}
            className={`block w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
              errors.deliveredAt
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-pink-500 focus:ring-pink-200'
            }`}
          />
          {errors.deliveredAt && (
            <p className="mt-1 text-sm text-red-600">{errors.deliveredAt}</p>
          )}
        </div>
      )}

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">
              {isNewShipment
                ? 'Tạo thông tin vận chuyển'
                : 'Cập nhật thông tin vận chuyển'}
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-blue-700">
              <li>
                Mã vận đơn bắt buộc khi trạng thái là Đã giao hoặc Đang vận
                chuyển
              </li>
              <li>Khách hàng có thể nhận thông báo về cập nhật vận chuyển</li>
              <li>
                Khi đánh dấu Đã giao, trạng thái đơn hàng cũng sẽ được cập nhật
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
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
          ) : isNewShipment ? (
            'Tạo thông tin vận chuyển'
          ) : (
            'Cập nhật vận chuyển'
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

export default ShipmentManagementForm;
