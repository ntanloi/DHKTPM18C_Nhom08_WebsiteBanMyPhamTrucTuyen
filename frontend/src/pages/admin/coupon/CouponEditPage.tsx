import React, { useEffect, useState } from 'react';
import type {
  CouponResponse,
  CreateCouponRequest,
  UpdateCouponRequest,
} from '../../../api/coupon';
import { getCouponById, updateCoupon } from '../../../api/coupon';
import CouponForm from '../../../components/admin/coupon/CouponForm';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import ErrorDisplay from '../../../components/admin/ErrorDisplay';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { parseApiError, type ErrorInfo } from '../../../utils/errorHandler';
import { useToast } from '../../../hooks/useToast';

interface CouponEditPageProps {
  couponId: number;
  onNavigate: (path: string) => void;
}

const CouponEditPage: React.FC<CouponEditPageProps> = ({
  couponId,
  onNavigate,
}) => {
  const [coupon, setCoupon] = useState<CouponResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchCoupon();
  }, [couponId]);

  const fetchCoupon = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCouponById(couponId);
      setCoupon(data);
    } catch (err: any) {
      const errorInfo = parseApiError(err);
      setError(errorInfo);
      
      if (errorInfo.shouldRedirect) {
        setTimeout(() => {
          onNavigate(errorInfo.shouldRedirect!);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    data: CreateCouponRequest | UpdateCouponRequest,
  ) => {
    const updateData = data as UpdateCouponRequest;

    try {
      setSubmitting(true);
      setError(null);
      const response = await updateCoupon(couponId, updateData);
      showToast(
        `Cập nhật mã giảm giá thành công! Mã: ${response.code}`,
        'success',
      );
      setTimeout(() => {
        onNavigate(`/admin/coupons/${couponId}`);
      }, 2000);
    } catch (err: any) {
      const errorInfo = parseApiError(err);
      setError(errorInfo);
      
      if (errorInfo.shouldRedirect) {
        setTimeout(() => {
          onNavigate(errorInfo.shouldRedirect!);
        }, 2000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    onNavigate('/admin/coupons');
  };

  const isExpired = coupon && coupon.validTo ? new Date(coupon.validTo) < new Date() : false;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !coupon) {
    return (
      <AdminLayout onNavigate={onNavigate}>
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <svg
                className="mx-auto h-16 w-16 text-red-600"
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
            </div>
            {error ? (
              <ErrorDisplay
                error={error}
                onRetry={error.canRetry ? fetchCoupon : undefined}
              />
            ) : (
              <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-center">
                <p className="text-lg font-medium text-red-800">
                  Không tìm thấy mã giảm giá
                </p>
              </div>
            )}
            <div className="mt-6 text-center">
              <button
                onClick={() => onNavigate('/admin/coupons')}
                className="rounded bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Chỉnh Sửa Mã Giảm Giá
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Cập nhật thông tin mã giảm giá: <strong>{coupon.code}</strong>
              </p>
            </div>
          </div>
        </div>

        {isExpired && (
          <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm font-medium text-yellow-800">
                Mã giảm giá này đã hết hạn. Bạn có thể gia hạn bằng cách cập
                nhật ngày kết thúc.
              </p>
            </div>
          </div>
        )}

        {!coupon.isActive && (
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
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              <p className="text-sm font-medium text-red-800">
                Mã giảm giá này đã bị vô hiệu hóa. Bạn có thể kích hoạt lại bằng
                cách bật "Kích hoạt mã giảm giá ngay".
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6">
            <ErrorDisplay
              error={error as ErrorInfo}
              onRetry={(error as ErrorInfo).canRetry ? () => setError(null) : undefined}
              onDismiss={() => setError(null)}
            />
          </div>
        )}

        {submitting && (
          <div className="mb-6 rounded-lg border border-blue-300 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-sm font-medium text-blue-800">
                Đang cập nhật mã giảm giá...
              </p>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow">
          <CouponForm
            mode="edit"
            initialData={coupon}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>

        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-3 text-sm font-medium text-gray-700">
            Thông tin mã giảm giá:
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 md:grid-cols-4">
            <div>
              <p className="font-medium text-gray-700">ID:</p>
              <p>{coupon.id}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Người tạo:</p>
              <p>User #{coupon.createdByUserId}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Ngày tạo:</p>
              <p>{new Date(coupon.createdAt).toLocaleString('vi-VN')}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Cập nhật lần cuối:</p>
              <p>{new Date(coupon.updatedAt).toLocaleString('vi-VN')}</p>
            </div>
          </div>
        </div>

        {/* Cancel Confirmation Dialog */}
        <ConfirmDialog
          open={showCancelDialog}
          title="Hủy chỉnh sửa?"
          message="Bạn có chắc muốn hủy? Các thay đổi sẽ không được lưu và bạn sẽ quay lại danh sách mã giảm giá."
          onConfirm={confirmCancel}
          onCancel={() => setShowCancelDialog(false)}
          confirmText="Hủy chỉnh sửa"
          cancelText="Tiếp tục chỉnh sửa"
          variant="warning"
        />
      </div>
    </AdminLayout>
  );
};

export default CouponEditPage;