import React, { useState, useEffect } from 'react';
import type { Order } from '../../../types/Order';
import { getAllOrders, cancelOrder, deleteOrder, updateOrderStatus, type OrderResponse } from '../../../api/order';
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
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

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await getAllOrders();
      
      // Transform OrderResponse to Order type
      const transformedOrders: Order[] = ordersData.map((order: OrderResponse) => ({
        id: order.id,
        userId: order.userId || 0,
        status: order.status || 'PENDING',
        subtotal: order.subtotal || 0,
        totalAmount: order.totalAmount || 0,
        notes: order.notes || '',
        discountAmount: order.discountAmount || 0,
        shippingFee: order.shippingFee || 0,
        estimateDeliveryFrom: order.estimateDeliveryFrom || '',
        estimateDeliveryTo: order.estimateDeliveryTo || '',
        createdAt: order.createdAt || new Date().toISOString(),
        updatedAt: order.updatedAt || new Date().toISOString(),
        orderItems: undefined, // OrderResponse.orderItems is just a count, not the actual items
        payment: order.paymentInfo as any, // PaymentInfoResponse doesn't fully match Payment type
        recipientInformation: order.recipientInfo as any, // RecipientInfoResponse doesn't fully match RecipientInformation type
      }));
      
      setOrders(transformedOrders);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError(err.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Refetch when window gains focus (user comes back from another tab/page)
  useEffect(() => {
    const handleFocus = () => {
      console.log('[OrderListPage] Window focused, refetching orders...');
      fetchOrders();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

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
    // Clear selected orders when tab/filter changes to avoid confusion
    setSelectedOrders([]);
  }, [searchQuery, dateFrom, dateTo, orders, activeTab]);

  const getPaginatedOrders = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredOrders.slice(startIndex, endIndex);
  };

  const handleViewDetail = (orderId: number) => {
    onNavigate(`/admin/orders/${orderId}`);
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;

    try {
      setLoading(true);
      // Call real API to cancel order
      await cancelOrder(orderId);
      
      // Refetch orders to get updated data from backend
      await fetchOrders();
      
      alert('Hủy đơn hàng thành công!');
    } catch (error: any) {
      console.error('Cancel order error:', error);
      alert(error.response?.data?.error || error.message || 'Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác!')) return;

    try {
      setLoading(true);
      // Call real API to delete order
      await deleteOrder(orderId);
      
      // Refetch orders to get updated data from backend
      await fetchOrders();
      
      alert('Xóa đơn hàng thành công!');
    } catch (error: any) {
      console.error('Delete order error:', error);
      alert(error.response?.data?.error || error.message || 'Có lỗi xảy ra khi xóa đơn hàng');
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
      // Only select orders on current page
      const currentPageOrderIds = getPaginatedOrders().map((o) => o.id);
      setSelectedOrders((prev) => {
        // Merge with previously selected orders from other pages
        const newSelected = new Set([...prev, ...currentPageOrderIds]);
        return Array.from(newSelected);
      });
    } else {
      // Only deselect orders on current page
      const currentPageOrderIds = getPaginatedOrders().map((o) => o.id);
      setSelectedOrders((prev) => prev.filter((id) => !currentPageOrderIds.includes(id)));
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

    const statusLabel = {
      CONFIRMED: 'xác nhận',
      PROCESSING: 'chuyển sang xử lý',
      SHIPPED: 'đánh dấu đã gửi hàng',
      DELIVERED: 'đánh dấu đã giao hàng',
      CANCELLED: 'hủy',
    }[bulkAction] || bulkAction;

    if (!window.confirm(`Bạn có chắc chắn muốn ${statusLabel} ${selectedOrders.length} đơn hàng đã chọn?`)) {
      return;
    }

    try {
      setLoading(true);
      let successCount = 0;
      let failCount = 0;

      // Call real API for each selected order
      for (const orderId of selectedOrders) {
        try {
          await updateOrderStatus(orderId, { status: bulkAction });
          successCount++;
        } catch (err) {
          console.error(`Failed to update order ${orderId}:`, err);
          failCount++;
        }
      }

      // Refetch orders to get updated data from backend
      await fetchOrders();

      if (failCount === 0) {
        alert(`Đã cập nhật ${successCount} đơn hàng thành công!`);
      } else {
        alert(`Cập nhật hoàn tất: ${successCount} thành công, ${failCount} thất bại`);
      }
      
      setSelectedOrders([]);
      setBulkAction('');
    } catch (error) {
      console.error('Bulk action error:', error);
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
