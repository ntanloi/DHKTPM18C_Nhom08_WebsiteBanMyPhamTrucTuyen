import React, { useState } from 'react';
import type {
  CouponResponse,
  CreateCouponRequest,
  UpdateCouponRequest,
} from '../../../api/coupon';

/**
 * CouponForm Component
 * 
 * Reusable form component for creating and editing coupons.
 * Handles client-side validation, form state management, and provides
 * a live preview of the coupon being created/edited.
 * 
 * Features:
 * - Client-side validation with real-time error feedback
 * - Auto-generate coupon codes
 * - Live preview of coupon appearance
 * - Supports both create and edit modes
 * - Form data persistence on validation errors
 */
interface CouponFormProps {
  mode: 'create' | 'edit';
  initialData?: CouponResponse;
  onSubmit: (data: CreateCouponRequest | UpdateCouponRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CouponForm: React.FC<CouponFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    description: initialData?.description || '',
    isActive: initialData?.isActive ?? true,
    discountType: initialData?.discountType || 'percentage',
    discountValue: initialData?.discountValue || 0,
    minOrderValue: initialData?.minOrderValue || 0,
    maxUsageValue: initialData?.maxUsageValue || 0,
    validFrom: initialData?.validFrom
      ? new Date(initialData.validFrom).toISOString().slice(0, 16)
      : '',
    validTo: initialData?.validTo
      ? new Date(initialData.validTo).toISOString().slice(0, 16)
      : '',
    createdByUserId: initialData?.createdByUserId || 1, // Default admin user
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateCode = () => {
    const prefix = 'CODE';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData({ ...formData, code: `${prefix}${random}` });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  /**
   * Client-side validation for coupon form
   * Validates all required fields and business rules before submission
   * @returns true if validation passes, false otherwise
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate coupon code format
    if (!formData.code.trim()) {
      newErrors.code = 'Mã coupon không được để trống';
    } else if (!/^[A-Z0-9]+$/.test(formData.code)) {
      newErrors.code =
        'Mã coupon chỉ được chứa chữ in hoa và số, không có khoảng trắng';
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    }

    // Validate discount value
    if (formData.discountValue <= 0) {
      newErrors.discountValue = 'Giá trị giảm phải lớn hơn 0';
    }

    // Validate percentage doesn't exceed 100%
    if (
      formData.discountType === 'percentage' &&
      formData.discountValue > 100
    ) {
      newErrors.discountValue = 'Phần trăm giảm không được vượt quá 100%';
    }

    // Validate minimum order value
    if (formData.minOrderValue < 0) {
      newErrors.minOrderValue = 'Giá trị đơn hàng tối thiểu không được âm';
    }

    // Validate maximum usage value
    if (formData.maxUsageValue <= 0) {
      newErrors.maxUsageValue = 'Giá trị giảm tối đa phải lớn hơn 0';
    }

    // Validate validity dates
    if (!formData.validFrom) {
      newErrors.validFrom = 'Ngày bắt đầu không được để trống';
    }

    if (!formData.validTo) {
      newErrors.validTo = 'Ngày kết thúc không được để trống';
    }

    // Validate date range logic
    if (formData.validFrom && formData.validTo) {
      const startDate = new Date(formData.validFrom);
      const endDate = new Date(formData.validTo);

      if (endDate <= startDate) {
        newErrors.validTo = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const submitData = {
      ...formData,
      code: formData.code.toUpperCase(),
      validFrom: new Date(formData.validFrom).toISOString(),
      validTo: new Date(formData.validTo).toISOString(),
    };

    onSubmit(submitData);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
          <span>
            Mã Coupon <span className="text-red-500">*</span>
          </span>
          {mode === 'create' && (
            <button
              type="button"
              onClick={generateCode}
              className="text-xs text-pink-600 hover:text-pink-800"
            >
              Tự động tạo mã
            </button>
          )}
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          disabled={mode === 'edit'}
          className={`w-full rounded border px-4 py-2 uppercase focus:ring-2 focus:ring-pink-500 focus:outline-none ${
            errors.code ? 'border-red-500' : 'border-gray-300'
          } ${mode === 'edit' ? 'bg-gray-100' : ''}`}
          placeholder="VD: SUMMER2025"
        />
        {errors.code && (
          <p className="mt-1 text-xs text-red-500">{errors.code}</p>
        )}
        {mode === 'edit' && (
          <p className="mt-1 text-xs text-gray-500">
            Mã coupon không thể thay đổi sau khi tạo
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Mô Tả <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`w-full rounded border px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Mô tả chi tiết về mã giảm giá..."
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Loại Giảm Giá <span className="text-red-500">*</span>
          </label>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          >
            <option value="percentage">Giảm theo phần trăm (%)</option>
            <option value="fixed_amount">Giảm cố định (VNĐ)</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Giá Trị Giảm <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              min="0"
              max={formData.discountType === 'percentage' ? '100' : undefined}
              className={`w-full rounded border px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none ${
                errors.discountValue ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            <span className="absolute top-2 right-3 text-gray-500">
              {formData.discountType === 'percentage' ? '%' : 'VNĐ'}
            </span>
          </div>
          {errors.discountValue && (
            <p className="mt-1 text-xs text-red-500">{errors.discountValue}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Giá Trị Đơn Hàng Tối Thiểu <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="minOrderValue"
            value={formData.minOrderValue}
            onChange={handleChange}
            min="0"
            className={`w-full rounded border px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none ${
              errors.minOrderValue ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.minOrderValue && (
            <p className="mt-1 text-xs text-red-500">{errors.minOrderValue}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Giá trị: {formatCurrency(formData.minOrderValue)} VNĐ
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Giá Trị Giảm Tối Đa <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="maxUsageValue"
            value={formData.maxUsageValue}
            onChange={handleChange}
            min="0"
            className={`w-full rounded border px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none ${
              errors.maxUsageValue ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.maxUsageValue && (
            <p className="mt-1 text-xs text-red-500">{errors.maxUsageValue}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Giá trị: {formatCurrency(formData.maxUsageValue)} VNĐ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Ngày Bắt Đầu <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="validFrom"
            value={formData.validFrom}
            onChange={handleChange}
            className={`w-full rounded border px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none ${
              errors.validFrom ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.validFrom && (
            <p className="mt-1 text-xs text-red-500">{errors.validFrom}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Ngày Kết Thúc <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="validTo"
            value={formData.validTo}
            onChange={handleChange}
            className={`w-full rounded border px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none ${
              errors.validTo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.validTo && (
            <p className="mt-1 text-xs text-red-500">{errors.validTo}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-2 focus:ring-pink-500"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Kích hoạt mã giảm giá ngay
        </label>
      </div>

      <div className="rounded-lg border-2 border-dashed border-pink-300 bg-pink-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-gray-700">
          Xem trước mã giảm giá:
        </h3>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="mb-2 text-center">
            <span className="text-2xl font-bold text-pink-600">
              {formData.code || 'MÃ GIẢM GIÁ'}
            </span>
          </div>
          <p className="mb-3 text-center text-sm text-gray-600">
            {formData.description || 'Mô tả mã giảm giá'}
          </p>
          <div className="border-t border-gray-200 pt-3 text-xs text-gray-600">
            <p>
              Giảm:{' '}
              <span className="font-bold text-pink-600">
                {formData.discountType === 'percentage'
                  ? `${formData.discountValue}%`
                  : `${formatCurrency(formData.discountValue)} VNĐ`}
              </span>
            </p>
            <p>Đơn tối thiểu: {formatCurrency(formData.minOrderValue)} VNĐ</p>
            <p> Giảm tối đa: {formatCurrency(formData.maxUsageValue)} VNĐ</p>
            {formData.validFrom && formData.validTo && (
              <p>
                HSD: {new Date(formData.validFrom).toLocaleDateString('vi-VN')}{' '}
                - {new Date(formData.validTo).toLocaleDateString('vi-VN')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded bg-pink-600 px-6 py-3 font-medium text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mode === 'create' ? ' Tạo Mã Giảm Giá' : 'Cập Nhật'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default CouponForm;
