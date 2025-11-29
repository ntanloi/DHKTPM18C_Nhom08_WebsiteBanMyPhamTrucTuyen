import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

import type {
  CreateCouponRequest,
  UpdateCouponRequest,
} from '../../../api/coupon';
import { mockCouponService } from '../../../mocks/couponMockData';
import CouponForm from '../../../components/admin/coupon/CouponForm';

interface CouponCreatePageProps {
  onNavigate: (path: string) => void;
}

const CouponCreatePage: React.FC<CouponCreatePageProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    data: CreateCouponRequest | UpdateCouponRequest,
  ) => {
    const createData = data as CreateCouponRequest;
    try {
      setLoading(true);
      setError(null);

      try {
        await mockCouponService.getCouponByCode(createData.code);
        setError(
          `Mã coupon "${createData.code}" đã tồn tại. Vui lòng chọn mã khác.`,
        );
        setLoading(false);
        return;
      } catch {
        // Code doesn't exist, continue with creation
      }

      const response = await mockCouponService.createCoupon(createData);

      alert(
        ` Tạo mã giảm giá thành công!\n\nMã: ${response.code}\nID: ${response.id}`,
      );

      onNavigate('/admin/coupons');
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Bạn có chắc muốn hủy? Dữ liệu sẽ không được lưu.')) {
      onNavigate('/admin/coupons');
    }
  };

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => onNavigate('/admin/coupons')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại danh sách
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 p-3">
              <svg
                className="h-8 w-8 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tạo Mã Giảm Giá Mới
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Điền thông tin để tạo mã giảm giá mới cho khách hàng
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4">
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

        {loading && (
          <div className="mb-6 rounded-lg border border-blue-300 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-sm font-medium text-blue-800">
                Đang tạo mã giảm giá...
              </p>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow">
          <CouponForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default CouponCreatePage;
