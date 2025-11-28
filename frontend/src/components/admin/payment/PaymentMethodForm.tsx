import React, { useState } from 'react';
import type { PaymentMethod } from '../../../types/PaymentMethod';

interface PaymentMethodFormProps {
  method?: PaymentMethod;
  onSubmit: (data: PaymentMethodFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface PaymentMethodFormData {
  name: string;
  code: string;
  isActive: boolean;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  method,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<PaymentMethodFormData>({
    name: method?.name || '',
    code: method?.code || '',
    isActive: method?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên phương thức thanh toán';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Tên phải có ít nhất 3 ký tự';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Vui lòng nhập mã phương thức';
    } else if (!/^[A-Z0-9_]+$/.test(formData.code.toUpperCase())) {
      newErrors.code = 'Mã chỉ được chứa chữ cái in hoa, số và dấu gạch dưới';
    } else if (formData.code.trim().length < 2) {
      newErrors.code = 'Mã phải có ít nhất 2 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        code: formData.code.toUpperCase(),
      });
    }
  };

  const isEditMode = !!method;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Tên phương thức thanh toán <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="VD: Ví Momo, Chuyển khoản ngân hàng"
          className={`block w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
            errors.name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-pink-500 focus:ring-pink-200'
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Tên hiển thị cho khách hàng khi chọn phương thức thanh toán
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Mã phương thức <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="VD: MOMO, BANK_TRANSFER"
          disabled={isEditMode}
          className={`block w-full rounded-lg border px-4 py-2 font-mono text-sm uppercase focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 ${
            errors.code
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-pink-500 focus:ring-pink-200'
          }`}
        />
        {errors.code && (
          <p className="mt-1 text-sm text-red-600">{errors.code}</p>
        )}
        {isEditMode ? (
          <p className="mt-1 text-xs text-gray-500">
            Mã không thể thay đổi sau khi tạo
          </p>
        ) : (
          <p className="mt-1 text-xs text-gray-500">
            Mã định danh duy nhất (chỉ chữ in hoa, số và dấu gạch dưới)
          </p>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded text-pink-600 focus:ring-pink-500"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              Kích hoạt phương thức thanh toán
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Khi được kích hoạt, phương thức này sẽ hiển thị cho khách hàng khi
              thanh toán
            </p>
          </div>
        </label>
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
          ) : isEditMode ? (
            'Cập nhật phương thức'
          ) : (
            'Tạo phương thức thanh toán'
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

export default PaymentMethodForm;
