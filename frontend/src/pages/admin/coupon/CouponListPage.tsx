import React, { useEffect, useState, useMemo } from 'react';
import type { CouponResponse } from '../../../api/coupon';
import { getAllCoupons, deactivateCoupon, deleteCoupon } from '../../../api/coupon';
import CouponTable from '../../../components/admin/coupon/CouponTable';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import ErrorDisplay from '../../../components/admin/ErrorDisplay';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { parseApiError, type ErrorInfo } from '../../../utils/errorHandler';

interface CouponListPageProps {
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

const CouponListPage: React.FC<CouponListPageProps> = ({ onNavigate }) => {
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCoupons();
      setCoupons(data);
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

  const handleView = (couponId: number) => {
    onNavigate(`/admin/coupons/${couponId}`);
  };

  const handleEdit = (couponId: number) => {
    onNavigate(`/admin/coupons/${couponId}/edit`);
  };

  const handleDeactivate = (couponId: number) => {
    const coupon = coupons.find(c => c.id === couponId);
    setConfirmDialog({
      open: true,
      title: 'Vô hiệu hóa mã giảm giá',
      message: `Bạn có chắc chắn muốn vô hiệu hóa mã giảm giá "${coupon?.code}"? Mã này sẽ không thể sử dụng được nữa.`,
      variant: 'warning',
      confirmText: 'Vô hiệu hóa',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await deactivateCoupon(couponId);
          await fetchCoupons();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (err: any) {
          const errorInfo = parseApiError(err);
          alert(errorInfo.message + (errorInfo.supportContact ? '\n\n' + errorInfo.supportContact : ''));
          
          if (errorInfo.shouldRedirect) {
            onNavigate(errorInfo.shouldRedirect);
          }
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleDelete = (couponId: number) => {
    const coupon = coupons.find(c => c.id === couponId);
    setConfirmDialog({
      open: true,
      title: 'Xóa mã giảm giá',
      message: `Bạn có chắc chắn muốn xóa mã giảm giá "${coupon?.code}"? Hành động này không thể hoàn tác.`,
      variant: 'danger',
      confirmText: 'Xóa',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await deleteCoupon(couponId);
          await fetchCoupons();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (err: any) {
          const errorInfo = parseApiError(err);
          alert(errorInfo.message + (errorInfo.supportContact ? '\n\n' + errorInfo.supportContact : ''));
          
          if (errorInfo.shouldRedirect) {
            onNavigate(errorInfo.shouldRedirect);
          }
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const getCouponStatus = (coupon: CouponResponse): string => {
    const now = new Date();
    const endDate = new Date(coupon.validTo);
    const startDate = new Date(coupon.validFrom);

    if (!coupon.isActive) return 'inactive';
    if (endDate < now) return 'expired';
    if (startDate > now) return 'upcoming';
    return 'active';
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch =
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase());

      const couponStatus = getCouponStatus(coupon);
      const matchesStatus =
        filterStatus === 'all' || couponStatus === filterStatus;

      const matchesType =
        filterType === 'all' || coupon.discountType === filterType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [coupons, searchTerm, filterStatus, filterType]);

  const stats = useMemo(() => {
    return {
      total: coupons.length,
      active: coupons.filter((c) => getCouponStatus(c) === 'active').length,
      inactive: coupons.filter((c) => getCouponStatus(c) === 'inactive').length,
      expired: coupons.filter((c) => getCouponStatus(c) === 'expired').length,
    };
  }, [coupons]);

  if (loading) {
    return (
      <AdminLayout onNavigate={onNavigate}>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
          <div className="text-center">
            <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
            <p className="mt-4 text-lg font-medium text-gray-600">
              Đang tải danh sách mã giảm giá...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout onNavigate={onNavigate}>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
          <div className="max-w-2xl rounded-3xl bg-white p-12 shadow-2xl">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-12 w-12 text-red-600"
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
            <div className="mt-6">
              <ErrorDisplay
                error={error}
                onRetry={error.canRetry ? fetchCoupons : undefined}
              />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        <header className="border-b border-white/50 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Quản Lý Mã Giảm Giá
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Quản lý các mã giảm giá và chương trình khuyến mãi
              </p>
            </div>
            <button
              onClick={() => onNavigate('/admin/coupons/create')}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-pink-600 hover:to-rose-600 hover:shadow-xl"
            >
              <svg
                className="h-5 w-5 transition-transform group-hover:rotate-90"
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
              Tạo Mã Giảm Giá Mới
            </button>
          </div>
        </header>

        <main className="p-8">
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="group hover:shadow-3xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 p-8 text-white shadow-2xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 text-sm font-medium text-blue-100">
                    Tổng số mã
                  </p>
                  <p className="text-5xl font-bold">{stats.total}</p>
                  <p className="mt-2 text-sm text-blue-100">mã giảm giá</p>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
                  <svg
                    className="h-10 w-10"
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
              </div>
            </div>

            <div className="group hover:shadow-3xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white shadow-2xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 text-sm font-medium text-green-100">
                    Đang hoạt động
                  </p>
                  <p className="text-5xl font-bold">{stats.active}</p>
                  <p className="mt-2 text-sm text-green-100">có hiệu lực</p>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
                  <svg
                    className="h-10 w-10"
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
              </div>
            </div>

            <div className="group hover:shadow-3xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 p-8 text-white shadow-2xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 text-sm font-medium text-red-100">
                    Đã vô hiệu hóa
                  </p>
                  <p className="text-5xl font-bold">{stats.inactive}</p>
                  <p className="mt-2 text-sm text-red-100">không hoạt động</p>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
                  <svg
                    className="h-10 w-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group hover:shadow-3xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-gray-500 to-gray-700 p-8 text-white shadow-2xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-100">
                    Đã hết hạn
                  </p>
                  <p className="text-5xl font-bold">{stats.expired}</p>
                  <p className="mt-2 text-sm text-gray-100">hết hiệu lực</p>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
                  <svg
                    className="h-10 w-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 overflow-hidden rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-4 flex items-center gap-2 text-gray-700">
              <svg
                className="h-6 w-6 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <h3 className="text-lg font-bold">Bộ lọc tìm kiếm</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3 pr-4 pl-12 transition-all focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-200 focus:outline-none"
                />
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-gray-50 py-3 pr-10 pl-12 transition-all focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-200 focus:outline-none"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Đã vô hiệu hóa</option>
                  <option value="expired">Đã hết hạn</option>
                  <option value="upcoming">Sắp có hiệu lực</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-gray-50 py-3 pr-10 pl-12 transition-all focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-200 focus:outline-none"
                >
                  <option value="all">Tất cả loại giảm giá</option>
                  <option value="percentage">Giảm theo %</option>
                  <option value="fixed_amount">Giảm cố định</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {(searchTerm || filterStatus !== 'all' || filterType !== 'all') && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Đang lọc:
                </span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-700">
                    Tìm kiếm: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 hover:text-pink-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filterStatus !== 'all' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    Trạng thái: {filterStatus}
                    <button
                      onClick={() => setFilterStatus('all')}
                      className="ml-1 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filterType !== 'all' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
                    Loại:{' '}
                    {filterType === 'percentage' ? 'Giảm %' : 'Giảm cố định'}
                    <button
                      onClick={() => setFilterType('all')}
                      className="ml-1 hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                    setFilterType('all');
                  }}
                  className="text-sm text-gray-600 underline hover:text-gray-900"
                >
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
            {filteredCoupons.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    className="h-12 w-12 text-gray-400"
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
                <p className="mt-6 text-lg font-medium text-gray-600">
                  Không tìm thấy mã giảm giá nào
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Thử điều chỉnh bộ lọc hoặc tạo mã giảm giá mới
                </p>
              </div>
            ) : (
              <CouponTable
                coupons={filteredCoupons}
                onView={handleView}
                onEdit={handleEdit}
                onDeactivate={handleDeactivate}
                onDelete={handleDelete}
              />
            )}
          </div>
        </main>

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

export default CouponListPage;