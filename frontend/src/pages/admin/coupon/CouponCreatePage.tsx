import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

import type {
  CreateCouponRequest,
  UpdateCouponRequest,
} from '../../../api/coupon';
import { createCoupon } from '../../../api/coupon';
import CouponForm from '../../../components/admin/coupon/CouponForm';
import ErrorDisplay from '../../../components/admin/ErrorDisplay';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { parseApiError, type ErrorInfo } from '../../../utils/errorHandler';
import { Toast } from '../../../components/user/ui/Toast';
import { useToast } from '../../../hooks/useToast';

interface CouponCreatePageProps {
  onNavigate: (path: string) => void;
}

const CouponCreatePage: React.FC<CouponCreatePageProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (
    data: CreateCouponRequest | UpdateCouponRequest,
  ) => {
    const createData = data as CreateCouponRequest;
    try {
      setLoading(true);
      setError(null);

      const response = await createCoupon(createData);

      showToast(
        `Tạo mã giảm giá thành công! Mã: ${response.code}`,
        'success',
      );

      setTimeout(() => {
        onNavigate(`/admin/coupons/${response.id}`);
      }, 1500);
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

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    onNavigate('/admin/coupons');
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
          <div className="mb-6">
            <ErrorDisplay
              error={error}
              onRetry={error.canRetry ? () => setError(null) : undefined}
              onDismiss={() => setError(null)}
            />
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
            loading={loading}
          />
        </div>

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}

        {/* Cancel Confirmation Dialog */}
        <ConfirmDialog
          open={showCancelDialog}
          title="Hủy tạo mã giảm giá?"
          message="Bạn có chắc muốn hủy? Tất cả thông tin bạn đã nhập sẽ không được lưu và bạn sẽ quay lại danh sách mã giảm giá."
          onConfirm={confirmCancel}
          onCancel={() => setShowCancelDialog(false)}
          confirmText="Hủy và quay lại"
          cancelText="Tiếp tục tạo"
          variant="warning"
        />
      </div>
    </AdminLayout>
  );
};

export default CouponCreatePage;