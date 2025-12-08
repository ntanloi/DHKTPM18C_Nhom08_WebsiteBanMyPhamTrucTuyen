import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cancelOrder } from '../../../api/order';
import type { OrderResponse } from '../../../api/order';

interface OrdersTabProps {
  orders: OrderResponse[];
  onUpdate?: () => void;
}

export default function OrdersTab({ orders, onUpdate }: OrdersTabProps) {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cancelingOrderId, setCancelingOrderId] = useState<number | null>(null);

  const statusTabs = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Chờ xác nhận', value: 'PENDING' },
    { label: 'Đã xác nhận', value: 'CONFIRMED' },
    { label: 'Đang giao', value: 'SHIPPING' },
    { label: 'Đã giao', value: 'DELIVERED' },
    { label: 'Đã hủy', value: 'CANCELLED' },
  ];

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      SHIPPING: 'Đang giao',
      DELIVERED: 'Đã giao',
      CANCELLED: 'Đã hủy',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-green-600 bg-green-50 border border-green-100';
      case 'SHIPPING':
        return 'text-blue-600 bg-blue-50 border border-blue-100';
      case 'CONFIRMED':
        return 'text-yellow-600 bg-yellow-50 border border-yellow-100';
      case 'PENDING':
        return 'text-orange-600 bg-orange-50 border border-orange-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50 border border-red-100';
      default:
        return 'text-gray-600 bg-gray-50 border border-gray-100';
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;

    try {
      setCancelingOrderId(orderId);
      await cancelOrder(orderId);
      alert('Đã hủy đơn hàng thành công!');
      if (onUpdate) onUpdate();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setCancelingOrderId(null);
    }
  };

  const handleViewDetail = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  // Filter orders based on selected status and search term
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch =
      searchTerm === '' || order.id.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Đơn hàng</h2>

      <div className="mb-6 flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
              selectedStatus === tab.value
                ? 'bg-[rgb(235,97,164)] text-white shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[rgb(235,97,164)] focus:ring-2 focus:ring-[rgb(235,97,164)]/20"
        />
      </div>

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-gray-200 p-6 transition-shadow duration-200 hover:shadow-sm"
            >
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-4">
                    <div className="text-lg font-semibold text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1.5 text-sm font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div className="mb-2 text-gray-600">
                    <span className="font-medium">Mã đơn hàng:</span>{' '}
                    <span className="font-mono">#{order.id}</span>
                  </div>
                  <div className="mb-2 text-gray-600">
                    <span className="font-medium">Tổng phụ:</span>{' '}
                    {order.subtotal.toLocaleString('vi-VN')}đ
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="mb-2 text-gray-600">
                      <span className="font-medium">Giảm giá:</span> -
                      {order.discountAmount.toLocaleString('vi-VN')}đ
                    </div>
                  )}
                  {order.notes && (
                    <div className="text-gray-600">
                      <span className="font-medium">Ghi chú:</span>{' '}
                      {order.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-start gap-4 lg:items-end">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Tổng tiền</div>
                    <div className="text-xl font-bold text-[rgb(235,97,164)]">
                      {order.totalAmount.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancelingOrderId === order.id}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50 disabled:opacity-50"
                      >
                        {cancelingOrderId === order.id
                          ? 'Đang hủy...'
                          : 'Hủy đơn'}
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetail(order.id)}
                      className="rounded-lg bg-[rgb(235,97,164)] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[rgb(235,97,164)]/90"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-xl font-medium text-gray-700">
            {selectedStatus === 'all'
              ? 'Chưa có đơn hàng'
              : `Không có đơn hàng "${statusTabs.find((t) => t.value === selectedStatus)?.label}"`}
          </h3>
          <p className="mb-6 text-gray-500">
            {selectedStatus === 'all'
              ? 'Bạn chưa có đơn hàng nào trong danh sách này'
              : 'Không tìm thấy đơn hàng nào với trạng thái này'}
          </p>
          <button className="rounded-lg bg-[rgb(235,97,164)] px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-[rgb(235,97,164)]/90">
            Mua sắm ngay
          </button>
        </div>
      )}
    </div>
  );
}
