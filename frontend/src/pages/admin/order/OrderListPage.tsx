import React, { useState, useEffect } from 'react';
import type { Order } from '../../../types/Order';
import { mockOrders } from '../../../mocks/orderMockData';
import OrderTable from '../../../components/admin/order/OrderTable';
import SearchBar from '../../../components/admin/SearchBar';
import Pagination from '../../../components/admin/Pagination';
import { matchesSearchQuery } from '../../../utils/orderStatusUtils';
import { DEFAULT_PAGE_SIZE } from '../../../contants/orderConstants';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

interface OrderListPageProps {
  onNavigate: (path: string) => void;
}

const OrderListPage: React.FC<OrderListPageProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');

  const [activeTab, setActiveTab] = useState<
    'all' | 'processing' | 'completed' | 'cancelled'
  >('processing');

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [stats, setStats] = useState({
    total: 0,
    processing: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const processingCount = orders.filter((o) =>
      ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(o.status),
    ).length;

    const newStats = {
      total: orders.length,
      processing: processingCount,
      delivered: orders.filter((o) => o.status === 'DELIVERED').length,
      cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
      totalRevenue: orders
        .filter((o) => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + o.totalAmount, 0),
    };
    setStats(newStats);
  }, [orders]);

  const getOrdersByTab = () => {
    switch (activeTab) {
      case 'processing':
        return orders.filter((o) =>
          ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(o.status),
        );
      case 'completed':
        return orders.filter((o) => o.status === 'DELIVERED');
      case 'cancelled':
        return orders.filter((o) => o.status === 'CANCELLED');
      default:
        return orders;
    }
  };

  useEffect(() => {
    let result = getOrdersByTab();

    if (searchQuery) {
      result = result.filter((order) => matchesSearchQuery(order, searchQuery));
    }

    if (dateFrom) {
      result = result.filter((order) => order.createdAt >= dateFrom);
    }
    if (dateTo) {
      result = result.filter(
        (order) => order.createdAt <= dateTo + 'T23:59:59',
      );
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [searchQuery, dateFrom, dateTo, orders, activeTab]);

  const getPaginatedOrders = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredOrders.slice(startIndex, endIndex);
  };

  const handleViewDetail = (orderId: number) => {
    onNavigate(`/admin/orders/${orderId}`);
  };

  const handleUpdateStatus = (orderId: number) => {
    onNavigate(`/admin/orders/${orderId}/status`);
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: 'CANCELLED',
                updatedAt: new Date().toISOString(),
              }
            : order,
        ),
      );
      alert('Hủy đơn hàng thành công!');
    } catch (error) {
      alert('Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return;

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      alert('Xóa đơn hàng thành công!');
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(getPaginatedOrders().map((o) => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) {
      alert('Vui lòng chọn hành động và ít nhất một đơn hàng');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn ${bulkAction} ${selectedOrders.length} đơn hàng đã chọn?`)) {
      return;
    }

    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOrders((prev) =>
        prev.map((order) =>
          selectedOrders.includes(order.id)
            ? { ...order, status: bulkAction, updatedAt: new Date().toISOString() }
            : order,
        ),
      );

      alert(`Đã cập nhật ${selectedOrders.length} đơn hàng thành công!`);
      setSelectedOrders([]);
      setBulkAction('');
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  const tabs = [
    { id: 'all' as const, label: 'Tất cả', count: stats.total },
    { id: 'processing' as const, label: 'Đang xử lý', count: stats.processing },
    { id: 'completed' as const, label: 'Đã giao', count: stats.delivered },
    { id: 'cancelled' as const, label: 'Đã hủy', count: stats.cancelled },
  ];

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Quản Lý Đơn Hàng
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Quản lý và theo dõi tất cả đơn hàng
            </p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tất cả đơn
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <svg
                    className="h-6 w-6 text-blue-600"
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
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Đang xử lý
                  </p>
                  <p className="mt-1 text-2xl font-bold text-orange-600">
                    {stats.processing}
                  </p>
                </div>
                <div className="rounded-full bg-orange-100 p-3">
                  <svg
                    className="h-6 w-6 text-orange-600"
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

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đã giao</p>
                  <p className="mt-1 text-2xl font-bold text-green-600">
                    {stats.delivered}
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <svg
                    className="h-6 w-6 text-green-600"
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

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đã hủy</p>
                  <p className="mt-1 text-2xl font-bold text-red-600">
                    {stats.cancelled}
                  </p>
                </div>
                <div className="rounded-full bg-red-100 p-3">
                  <svg
                    className="h-6 w-6 text-red-600"
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

          <div className="mb-4">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Tìm theo mã đơn, tên khách hàng, SĐT, email..."
              initialValue={searchQuery}
            />
          </div>

          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-pink-500 text-pink-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      activeTab === tab.id
                        ? 'bg-pink-100 text-pink-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {(dateFrom || dateTo) && (
            <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleClearFilters}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedOrders.length > 0 && (
            <div className="mb-4 flex items-center gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <span className="text-sm font-medium text-blue-900">
                Đã chọn {selectedOrders.length} đơn hàng
              </span>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="rounded-lg border-gray-300 px-4 py-2 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              >
                <option value="">-- Chọn hành động --</option>
                <option value="CONFIRMED">Xác nhận đơn</option>
                <option value="PROCESSING">Chuyển sang xử lý</option>
                <option value="SHIPPED">Đã gửi hàng</option>
                <option value="DELIVERED">Đã giao hàng</option>
                <option value="CANCELLED">Hủy đơn</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="rounded-lg bg-pink-600 px-6 py-2 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Áp dụng
              </button>
              <button
                onClick={() => setSelectedOrders([])}
                className="ml-auto text-sm text-gray-600 hover:text-gray-900"
              >
                Hủy chọn
              </button>
            </div>
          )}

          <OrderTable
            orders={getPaginatedOrders()}
            onViewDetail={handleViewDetail}
            onUpdateStatus={handleUpdateStatus}
            onCancelOrder={handleCancelOrder}
            onDeleteOrder={handleDeleteOrder}
            loading={loading}
            activeTab={activeTab}
            selectedOrders={selectedOrders}
            onSelectAll={handleSelectAll}
            onSelectOrder={handleSelectOrder}
          />

          {filteredOrders.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredOrders.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[10, 20, 50, 100]}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderListPage;
