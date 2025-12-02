import { useState } from 'react';

interface Order {
  id: string;
  date: string;
  status: string;
  items: number;
  total: number;
  address: string;
}

interface OrdersTabProps {
  orders: Order[];
}

export default function OrdersTab({ orders }: OrdersTabProps) {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statusTabs = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Chờ xác nhận', value: 'chờ xác nhận' },
    { label: 'Đang chuẩn bị đơn hàng', value: 'đang chuẩn bị đơn hàng' },
    { label: 'Đang giao', value: 'đang giao' },
    { label: 'Đã giao', value: 'đã giao' },
    { label: 'Đã huỷ', value: 'đã huỷ' }, // Thêm tab Đã huỷ
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'đã giao':
        return 'text-green-600 bg-green-50 border border-green-100';
      case 'đang giao':
        return 'text-blue-600 bg-blue-50 border border-blue-100';
      case 'đang chuẩn bị đơn hàng':
        return 'text-yellow-600 bg-yellow-50 border border-yellow-100';
      case 'chờ xác nhận':
        return 'text-orange-600 bg-orange-50 border border-orange-100';
      case 'đã huỷ':
        return 'text-red-600 bg-red-50 border border-red-100';
      default:
        return 'text-gray-600 bg-gray-50 border border-gray-100';
    }
  };

  // Filter orders based on selected status
  const filteredOrders =
    selectedStatus === 'all'
      ? orders
      : orders.filter(
          (order) =>
            order.status.toLowerCase() === selectedStatus.toLowerCase(),
        );

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
                      {order.date}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1.5 text-sm font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="mb-2 text-gray-600">
                    <span className="font-medium">Mã đơn hàng:</span>{' '}
                    <span className="font-mono">{order.id}</span>
                  </div>
                  <div className="mb-2 text-gray-600">
                    <span className="font-medium">Số lượng:</span> {order.items}{' '}
                    sản phẩm
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Địa chỉ giao hàng:</span>{' '}
                    {order.address}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-4 lg:items-end">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Tổng tiền</div>
                    <div className="text-xl font-bold text-[rgb(235,97,164)]">
                      {order.total.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50">
                      Mua lại
                    </button>
                    <button className="rounded-lg bg-[rgb(235,97,164)] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[rgb(235,97,164)]/90">
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
