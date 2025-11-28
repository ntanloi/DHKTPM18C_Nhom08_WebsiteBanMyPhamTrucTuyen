import React, { useState, useEffect } from 'react';
import type { Return } from '../../../types/Return';
import { mockReturnService } from '../../../mocks/mockReturnService';
import { getOrderById } from '../../../mocks/orderMockData';
import {
  formatDateTime,
  formatOrderId,
  getRelativeTime,
} from '../../../utils/orderStatusUtils';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

interface ReturnListPageProps {
  onNavigate: (path: string) => void;
}

const ReturnListPage: React.FC<ReturnListPageProps> = ({ onNavigate }) => {
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const data = await mockReturnService.getAllReturns();
      setReturns(data);
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReturn = (orderId: number) => {
    onNavigate(`/admin/orders/${orderId}/return`);
  };

  const handleViewOrder = (orderId: number) => {
    onNavigate(`/admin/orders/${orderId}`);
  };

  if (loading) {
    return (
      <AdminLayout onNavigate={onNavigate}>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
          <div className="text-center">
            <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
            <p className="mt-4 text-lg font-medium text-gray-600">
              Đang tải danh sách hoàn trả...
            </p>
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
                Yêu Cầu Hoàn Trả
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Quản lý tất cả yêu cầu hoàn trả từ khách hàng
              </p>
            </div>
            <button
              onClick={() => onNavigate('/admin/orders')}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-pink-600 hover:to-rose-600 hover:shadow-xl"
            >
              <svg
                className="h-5 w-5 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay lại đơn hàng
            </button>
          </div>
        </header>

        <main className="p-8">
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group hover:shadow-3xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 p-8 text-white shadow-2xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 text-sm font-medium text-blue-100">
                    Tổng số
                  </p>
                  <p className="text-5xl font-bold">{returns.length}</p>
                  <p className="mt-2 text-sm text-blue-100">yêu cầu</p>
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

            <div className="group hover:shadow-3xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-600 p-8 text-white shadow-2xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 text-sm font-medium text-yellow-100">
                    Chờ xử lý
                  </p>
                  <p className="text-5xl font-bold">{returns.length}</p>
                  <p className="mt-2 text-sm text-yellow-100">đang chờ</p>
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

            <div className="group hover:shadow-3xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white shadow-2xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 text-sm font-medium text-green-100">
                    Đã chấp nhận
                  </p>
                  <p className="text-5xl font-bold">0</p>
                  <p className="mt-2 text-sm text-green-100">yêu cầu</p>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group hover:shadow-3xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 p-8 text-white shadow-2xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 text-sm font-medium text-purple-100">
                    Đã hoàn tiền
                  </p>
                  <p className="text-5xl font-bold">0</p>
                  <p className="mt-2 text-sm text-purple-100">giao dịch</p>
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {returns.length === 0 ? (
            <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="mt-6 text-lg font-medium text-gray-600">
                  Chưa có yêu cầu hoàn trả nào
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Các yêu cầu hoàn trả sẽ xuất hiện ở đây
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {returns.map((returnInfo) => {
                const order = getOrderById(returnInfo.orderId);
                const isRefunded = order?.payment?.status === 'REFUNDED';

                return (
                  <div
                    key={returnInfo.id}
                    className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all hover:shadow-2xl"
                  >
                    <div className="flex flex-col lg:flex-row">
                      <div
                        className={`flex w-full items-center justify-center p-6 lg:w-32 ${
                          isRefunded
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                            : 'bg-gradient-to-br from-yellow-500 to-orange-600'
                        }`}
                      >
                        <div className="text-center text-white">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            {isRefunded ? (
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
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
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            )}
                          </div>
                          <p className="mt-3 text-xs font-bold">
                            {isRefunded ? 'ĐÃ HOÀN TIỀN' : 'CHỜ XỬ LÝ'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-8">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-bold text-gray-900">
                            Yêu cầu #{returnInfo.id}
                          </h3>
                          {isRefunded && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800">
                              <svg
                                className="h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Đã hoàn tiền
                            </span>
                          )}
                          <span className="inline-flex items-center gap-2 text-sm text-gray-500">
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
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {getRelativeTime(returnInfo.createdAt)}
                          </span>
                        </div>

                        {order && (
                          <div className="mb-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 p-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-200">
                                  <svg
                                    className="h-5 w-5 text-pink-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">
                                    Đơn hàng
                                  </p>
                                  <button
                                    onClick={() => handleViewOrder(order.id)}
                                    className="font-mono text-sm font-bold text-pink-600 hover:underline"
                                  >
                                    {formatOrderId(order.id)}
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-200">
                                  <svg
                                    className="h-5 w-5 text-blue-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">
                                    Khách hàng
                                  </p>
                                  <p className="text-sm font-bold text-gray-900">
                                    {order.user?.fullName || 'N/A'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200">
                                  <svg
                                    className="h-5 w-5 text-green-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">
                                    Tổng tiền
                                  </p>
                                  <p className="text-sm font-bold text-green-600">
                                    {new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND',
                                    }).format(order.totalAmount)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mb-4 rounded-2xl border-2 border-gray-100 bg-gray-50 p-6">
                          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                            <svg
                              className="h-5 w-5 text-orange-500"
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
                            Lý do hoàn trả:
                          </p>
                          <p className="text-sm leading-relaxed text-gray-600">
                            {returnInfo.reason.substring(0, 200)}
                            {returnInfo.reason.length > 200 && '...'}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
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
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              Yêu cầu: {formatDateTime(returnInfo.createdAt)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
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
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                              Cập nhật: {formatDateTime(returnInfo.updatedAt)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleViewReturn(returnInfo.orderId)}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-pink-600 hover:to-rose-600 hover:shadow-xl"
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Xử lý yêu cầu
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </AdminLayout>
  );
};

export default ReturnListPage;
