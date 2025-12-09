import React, { useEffect, useState } from 'react';
import {
  type CouponResponse,
  getCouponById,
  deactivateCoupon,
  deleteCoupon,
} from '../../../api/coupon';
import CouponStatusBadge from '../../../components/admin/coupon/CouponStatusBadge';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import ErrorDisplay from '../../../components/admin/ErrorDisplay';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { parseApiError, type ErrorInfo } from '../../../utils/errorHandler';
import { useToast } from '../../../hooks/useToast';

interface CouponDetailPageProps {
  couponId: number;
  onNavigate: (path: string) => void;
}

interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant: 'danger' | 'warning' | 'info' | 'success';
  confirmText?: string;
}

const CouponDetailPage: React.FC<CouponDetailPageProps> = ({
  couponId,
  onNavigate,
}) => {
  const [coupon, setCoupon] = useState<CouponResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger',
  });

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

  const handleEdit = () => {
    onNavigate(`/admin/coupons/${couponId}/edit`);
  };

  const handleDeactivate = () => {
    if (!coupon) return;

    setConfirmDialog({
      open: true,
      title: 'Vô hiệu hóa mã giảm giá',
      message: `Bạn có chắc chắn muốn vô hiệu hóa mã giảm giá "${coupon.code}"? Khách hàng sẽ không thể sử dụng mã này nữa.`,
      variant: 'warning',
      confirmText: 'Vô hiệu hóa',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await deactivateCoupon(couponId);
          showToast('Đã vô hiệu hóa mã giảm giá thành công!', 'success');
          setConfirmDialog({ ...confirmDialog, open: false });
          await fetchCoupon();
        } catch (err: any) {
          const errorInfo = parseApiError(err);
          showToast(
            errorInfo.message +
              (errorInfo.supportContact
                ? '\n\n' + errorInfo.supportContact
                : ''),
            'error',
          );

          if (errorInfo.shouldRedirect) {
            onNavigate(errorInfo.shouldRedirect);
          }
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleDelete = () => {
    if (!coupon) return;

    setConfirmDialog({
      open: true,
      title: 'Xóa mã giảm giá',
      message: `Bạn có chắc chắn muốn XÓA mã giảm giá "${coupon.code}"? Hành động này không thể hoàn tác và tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.`,
      variant: 'danger',
      confirmText: 'Xóa vĩnh viễn',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await deleteCoupon(couponId);
          showToast('Đã xóa mã giảm giá thành công!', 'success');
          setConfirmDialog({ ...confirmDialog, open: false });
          setTimeout(() => {
            onNavigate('/admin/coupons');
          }, 1500);
        } catch (err: any) {
          const errorInfo = parseApiError(err);
          showToast(
            errorInfo.message +
              (errorInfo.supportContact
                ? '\n\n' + errorInfo.supportContact
                : ''),
            'error',
          );

          if (errorInfo.shouldRedirect) {
            onNavigate(errorInfo.shouldRedirect);
          }
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleCopyCode = () => {
    if (coupon) {
      navigator.clipboard.writeText(coupon.code);
      showToast(`Đã sao chép mã: ${coupon.code}`, 'success');
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDiscountDisplay = (): string => {
    if (!coupon) return '';
    if (coupon.discountType === 'PERCENTAGE') {
      return `${coupon.discountValue}%`;
    }
    return formatCurrency(coupon.discountValue);
  };

  const getCouponStatus = (): {
    label: string;
    description: string;
    canEdit: boolean;
    canDeactivate: boolean;
  } => {
    if (!coupon) {
      return {
        label: '',
        description: '',
        canEdit: false,
        canDeactivate: false,
      };
    }

    const now = new Date();
    const startDate = coupon.validFrom ? new Date(coupon.validFrom) : null;
    const endDate = coupon.validTo ? new Date(coupon.validTo) : null;

    if (!coupon.isActive) {
      return {
        label: 'Đã vô hiệu hóa',
        description:
          'Mã giảm giá này đã bị vô hiệu hóa và không thể sử dụng. Bạn có thể kích hoạt lại bằng cách chỉnh sửa.',
        canEdit: true,
        canDeactivate: false,
      };
    }

    if (endDate && endDate < now) {
      return {
        label: 'Hết hạn',
        description:
          'Mã giảm giá đã hết hạn sử dụng. Bạn có thể gia hạn bằng cách chỉnh sửa ngày kết thúc.',
        canEdit: true,
        canDeactivate: false,
      };
    }

    if (startDate && startDate > now) {
      return {
        label: 'Sắp có hiệu lực',
        description: `Mã giảm giá sẽ có hiệu lực từ ${formatDate(coupon.validFrom || '')}.`,
        canEdit: true,
        canDeactivate: true,
      };
    }

    return {
      label: 'Đang hoạt động',
      description: 'Mã giảm giá đang hoạt động và khách hàng có thể sử dụng.',
      canEdit: true,
      canDeactivate: true,
    };
  };

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
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 text-center">
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

  const status = getCouponStatus();

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

          <div className="flex items-center justify-between">
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
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Chi Tiết Mã Giảm Giá
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Xem thông tin chi tiết về mã giảm giá
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {status.canEdit && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Chỉnh sửa
                </button>
              )}
              {status.canDeactivate && (
                <button
                  onClick={handleDeactivate}
                  className="flex items-center gap-2 rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
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
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  Vô hiệu hóa
                </button>
              )}
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Xóa
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 p-6 text-white shadow-lg">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-3xl font-bold">{coupon.code}</span>
                    <button
                      onClick={handleCopyCode}
                      className="rounded bg-white/20 px-2 py-1 text-xs hover:bg-white/30"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-pink-100">{coupon.description}</p>
                </div>
                <CouponStatusBadge
                  isActive={coupon.isActive}
                  validFrom={coupon.validFrom || ''}
                  validTo={coupon.validTo || ''}
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                <div>
                  <p className="text-xs text-pink-100">Giảm giá</p>
                  <p className="text-2xl font-bold">{getDiscountDisplay()}</p>
                </div>
                <div>
                  <p className="text-xs text-pink-100">Loại</p>
                  <p className="text-sm font-medium">
                    {coupon.discountType === 'PERCENTAGE'
                      ? 'Phần trăm'
                      : 'Cố định'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-pink-100">Đơn tối thiểu</p>
                  <p className="text-sm font-medium">
                    {formatCurrency(coupon.minOrderValue || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-pink-100">Giảm tối đa</p>
                  <p className="text-sm font-medium">
                    {formatCurrency(coupon.maxUsageValue || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Trạng thái
              </h2>
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-blue-600"
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
                    <p className="font-medium text-blue-900">{status.label}</p>
                    <p className="mt-1 text-sm text-blue-700">
                      {status.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Thời gian hiệu lực
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-600 p-2">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Ngày bắt đầu
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(coupon.validFrom || '')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-red-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-red-600 p-2">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Ngày kết thúc
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(coupon.validTo || '')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Thông tin chi tiết
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium text-gray-900">{coupon.id}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Người tạo:</span>
                  <span className="font-medium text-gray-900">
                    User #{coupon.createdByUserId}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(coupon.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cập nhật:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(coupon.updatedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Thống kê sử dụng
              </h2>
              <div className="space-y-4">
                <div className="rounded-lg bg-purple-50 p-4">
                  <p className="text-sm text-gray-600">Lượt sử dụng</p>
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Chưa có lượt sử dụng nào
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-gray-600">Tổng giảm giá</p>
                  <p className="text-2xl font-bold text-blue-600">0đ</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Tổng tiền đã giảm cho khách
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-gray-600">Doanh thu tạo ra</p>
                  <p className="text-2xl font-bold text-green-600">0đ</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Từ các đơn hàng áp dụng mã
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Dialog */}
        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
          confirmText={confirmDialog.confirmText}
          variant={confirmDialog.variant}
          loading={actionLoading}
        />
      </div>
    </AdminLayout>
  );
};

export default CouponDetailPage;
