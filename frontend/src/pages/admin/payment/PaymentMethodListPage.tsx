import React, { useState, useEffect } from 'react';
import type { PaymentMethod } from '../../../types/PaymentMethod';
import * as paymentMethodApi from '../../../api/paymentMethod';
import PaymentMethodTable from '../../../components/admin/payment/PaymentMethodTable';
import PaymentMethodForm, {
  type PaymentMethodFormData,
} from '../../../components/admin/payment/PaymentMethodForm';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

interface PaymentMethodListPageProps {
  onNavigate: (path: string) => void;
}

const PaymentMethodListPage: React.FC<PaymentMethodListPageProps> = ({
  onNavigate,
}) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null,
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [filterStatus, setFilterStatus] = useState<
    'ALL' | 'ACTIVE' | 'INACTIVE'
  >('ALL');

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  useEffect(() => {
    fetchMethods();
  }, []);

  useEffect(() => {
    updateStats();
  }, [methods]);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const data = await paymentMethodApi.getAllPaymentMethods();
      setMethods(data);
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    setStats({
      total: methods.length,
      active: methods.filter((m) => m.isActive).length,
      inactive: methods.filter((m) => !m.isActive).length,
    });
  };

  const handleCreate = async (_data: PaymentMethodFormData) => {
    try {
      setSubmitting(true);
      // TODO: Backend API doesn't support CREATE yet
      // await paymentMethodApi.createPaymentMethod(_data);
      alert('Chức năng này chưa được hỗ trợ. Vui lòng liên hệ developer.');
      setShowCreateModal(false);
      // fetchMethods();
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi tạo phương thức');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (_data: PaymentMethodFormData) => {
    if (!editingMethod) return;

    try {
      setSubmitting(true);
      // TODO: Backend API doesn't support UPDATE yet
      // await paymentMethodApi.updatePaymentMethod(editingMethod.id, _data);
      alert('Chức năng này chưa được hỗ trợ. Vui lòng liên hệ developer.');
      setShowEditModal(false);
      setEditingMethod(null);
      // fetchMethods();
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi cập nhật phương thức');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (_id: number, currentStatus: boolean) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn ${currentStatus ? 'tắt' : 'kích hoạt'} phương thức này?`,
      )
    ) {
      return;
    }

    try {
      // TODO: Backend API doesn't support TOGGLE yet
      // await paymentMethodApi.togglePaymentMethod(_id);
      alert('Chức năng này chưa được hỗ trợ. Vui lòng liên hệ developer.');
      // fetchMethods();
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi thay đổi trạng thái');
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    try {
      // TODO: Backend API doesn't support DELETE yet
      // await paymentMethodApi.deletePaymentMethod(deletingId);
      alert('Chức năng này chưa được hỗ trợ. Vui lòng liên hệ developer.');
      setShowDeleteDialog(false);
      setDeletingId(null);
      // fetchMethods();
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi xóa phương thức');
      setShowDeleteDialog(false);
      setDeletingId(null);
    }
  };

  const handleEditClick = (id: number) => {
    const method = methods.find((m) => m.id === id);
    if (method) {
      setEditingMethod(method);
      setShowEditModal(true);
    }
  };

  const filteredMethods = methods.filter((method) => {
    if (filterStatus === 'ACTIVE') return method.isActive;
    if (filterStatus === 'INACTIVE') return !method.isActive;
    return true;
  });

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        <header className="border-b border-white/50 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Phương Thức Thanh Toán
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Quản lý các phương thức thanh toán của hệ thống
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
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
              Thêm phương thức
            </button>
          </div>
        </header>

        <main className="p-8">
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="group hover:shadow-3xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 p-8 text-white shadow-2xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 text-sm font-medium text-blue-100">
                    Tổng số
                  </p>
                  <p className="text-5xl font-bold">{stats.total}</p>
                  <p className="mt-2 text-sm text-blue-100">phương thức</p>
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
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group hover:shadow-3xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white shadow-2xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 text-sm font-medium text-green-100">
                    Hoạt động
                  </p>
                  <p className="text-5xl font-bold">{stats.active}</p>
                  <p className="mt-2 text-sm text-green-100">đang kích hoạt</p>
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
                  <p className="mb-2 text-sm font-medium text-red-100">Tắt</p>
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <svg
                  className="h-5 w-5 text-pink-500"
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
                Lọc theo trạng thái:
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilterStatus('ALL')}
                  className={`rounded-xl px-6 py-3 text-sm font-medium shadow-md transition-all ${
                    filterStatus === 'ALL'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tất cả ({stats.total})
                </button>
                <button
                  onClick={() => setFilterStatus('ACTIVE')}
                  className={`rounded-xl px-6 py-3 text-sm font-medium shadow-md transition-all ${
                    filterStatus === 'ACTIVE'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Hoạt động ({stats.active})
                </button>
                <button
                  onClick={() => setFilterStatus('INACTIVE')}
                  className={`rounded-xl px-6 py-3 text-sm font-medium shadow-md transition-all ${
                    filterStatus === 'INACTIVE'
                      ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tắt ({stats.inactive})
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
            <PaymentMethodTable
              methods={filteredMethods}
              onEdit={handleEditClick}
              onToggleActive={handleToggleActive}
              onDelete={handleDeleteClick}
              loading={loading}
            />
          </div>
        </main>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => !submitting && setShowCreateModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
              <div className="border-b border-gray-200 bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-6">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
                    <svg
                      className="h-8 w-8"
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
                    Tạo Phương Thức Thanh Toán
                  </h2>
                  <button
                    onClick={() => !submitting && setShowCreateModal(false)}
                    className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
                  >
                    <svg
                      className="h-6 w-6"
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
                  </button>
                </div>
              </div>
              <div className="p-8">
                <PaymentMethodForm
                  onSubmit={handleCreate}
                  onCancel={() => setShowCreateModal(false)}
                  loading={submitting}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingMethod && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => !submitting && setShowEditModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
              <div className="border-b border-gray-200 bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-6">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
                    <svg
                      className="h-8 w-8"
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
                    Cập Nhật Phương Thức Thanh Toán
                  </h2>
                  <button
                    onClick={() => !submitting && setShowEditModal(false)}
                    className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
                  >
                    <svg
                      className="h-6 w-6"
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
                  </button>
                </div>
              </div>
              <div className="p-8">
                <PaymentMethodForm
                  method={editingMethod}
                  onSubmit={handleEdit}
                  onCancel={() => {
                    setShowEditModal(false);
                    setEditingMethod(null);
                  }}
                  loading={submitting}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa phương thức thanh toán này? Hành động này không thể hoàn tác."
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setDeletingId(null);
        }}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default PaymentMethodListPage;
