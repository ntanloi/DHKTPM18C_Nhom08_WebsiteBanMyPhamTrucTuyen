import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import { getDashboardSummary, getOrderStats } from '../../api/analytics';
import type { DashboardSummary } from '../../api/analytics';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactElement;
  gradient: string;
}

interface Order {
  id: string;
  customer: string;
  amount: string;
  status: 'delivered' | 'processing' | 'shipped' | 'pending';
  date: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard summary
        const summary: DashboardSummary = await getDashboardSummary();

        // Fetch recent orders (last 30 days)
        const endDate = new Date().toISOString();
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const orderStats = await getOrderStats(startDate, endDate);

        // Map to stat cards
        const calculatedStats: StatCard[] = [
          {
            title: 'Tổng doanh thu',
            value: `₫${summary.totalRevenue.toLocaleString('vi-VN')}`,
            change: `${summary.revenueGrowth >= 0 ? '+' : ''}${summary.revenueGrowth.toFixed(1)}%`,
            trend: summary.revenueGrowth >= 0 ? 'up' : 'down',
            icon: (
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
            gradient: 'from-pink-500 to-rose-500',
          },
          {
            title: 'Đơn hàng',
            value: summary.totalOrders.toString(),
            change: `${summary.ordersGrowth >= 0 ? '+' : ''}${summary.ordersGrowth.toFixed(1)}%`,
            trend: summary.ordersGrowth >= 0 ? 'up' : 'down',
            icon: (
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            ),
            gradient: 'from-blue-500 to-cyan-500',
          },
          {
            title: 'Sản phẩm',
            value: summary.totalProducts.toString(),
            change: `${summary.productsGrowth >= 0 ? '+' : ''}${summary.productsGrowth.toFixed(1)}%`,
            trend: summary.productsGrowth >= 0 ? 'up' : 'down',
            icon: (
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            ),
            gradient: 'from-purple-500 to-pink-500',
          },
          {
            title: 'Khách hàng',
            value: summary.totalCustomers.toString(),
            change: `${summary.customersGrowth >= 0 ? '+' : ''}${summary.customersGrowth.toFixed(1)}%`,
            trend: summary.customersGrowth >= 0 ? 'up' : 'down',
            icon: (
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ),
            gradient: 'from-green-500 to-teal-500',
          },
        ];

        setStats(calculatedStats);

        // Map recent orders
        const mappedOrders: Order[] = orderStats.recentOrders.slice(0, 5).map((order) => ({
          id: order.id.toString(),
          customer: order.customerName,
          amount: `₫${order.totalAmount.toLocaleString('vi-VN')}`,
          status: order.status.toLowerCase() as Order['status'],
          date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
        }));

        setRecentOrders(mappedOrders);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        ),
        gradient: 'from-purple-500 to-indigo-500',
      },
      {
        title: 'Sản phẩm',
        value: totalProducts.toString(),
        change: '+5.1%',
        trend: 'up',
        icon: (
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        ),
        gradient: 'from-blue-500 to-cyan-500',
      },
      {
        title: 'Khách hàng',
        value: totalCustomers.toString(),
        change: '+15.3%',
        trend: 'up',
        icon: (
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ),
        gradient: 'from-green-500 to-emerald-500',
      },
    ];

    setStats(calculatedStats);

    const formatStatus = (
      status: string,
    ): 'delivered' | 'processing' | 'shipped' | 'pending' => {
      const statusMap: Record<
        string,
        'delivered' | 'processing' | 'shipped' | 'pending'
      > = {
        DELIVERED: 'delivered',
        PROCESSING: 'processing',
        SHIPPED: 'shipped',
        PENDING: 'pending',
        CONFIRMED: 'pending',
        CANCELLED: 'pending',
      };
      return statusMap[status] || 'pending';
    };

    const formattedOrders: Order[] = mockOrders
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5)
      .map((order) => ({
        id: `ORD-${order.id.toString().padStart(4, '0')}`,
        customer: order.user?.fullName || 'Khách hàng',
        amount: `₫${order.totalAmount.toLocaleString('vi-VN')}`,
        status: formatStatus(order.status),
        date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
      }));

    setRecentOrders(formattedOrders);
  }, []);

  const getStatusBadge = (status: Order['status']) => {
    const badges = {
      delivered: { label: 'Đã giao', class: 'bg-green-100 text-green-800' },
      processing: { label: 'Đang xử lý', class: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Đang giao', class: 'bg-indigo-100 text-indigo-800' },
      pending: { label: 'Chờ xử lý', class: 'bg-yellow-100 text-yellow-800' },
    };
    return badges[status];
  };

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-8 py-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <p className="mt-1 text-sm text-gray-500">Chào mừng trở lại!</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600">
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                <button className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600">
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <main className="p-8">
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div
                    className={`h-2 bg-gradient-to-r ${stat.gradient}`}
                  ></div>
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div
                        className={`bg-gradient-to-r p-3 ${stat.gradient} rounded-xl text-white`}
                      >
                        {stat.icon}
                      </div>
                      <span
                        className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="mb-1 text-sm font-medium text-gray-600">
                      {stat.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Đơn hàng gần đây
                </h3>
                <button
                  onClick={() => onNavigate('/admin/orders')}
                  className="text-sm font-medium text-pink-600 hover:text-pink-700"
                >
                  Xem tất cả →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Mã đơn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Số tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Ngày đặt
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {recentOrders.map((order) => {
                      const badge = getStatusBadge(order.status);
                      return (
                        <tr
                          key={order.id}
                          className="transition-colors hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm font-medium text-gray-900">
                              {order.id}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {order.customer}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900">
                              {order.amount}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs leading-5 font-semibold ${badge.class}`}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500">
                              {order.date}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <button
                onClick={() => onNavigate('/admin/products/create')}
                className="group transform rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 p-6 text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 transition-transform group-hover:scale-110">
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Thêm sản phẩm</h4>
                    <p className="text-sm text-pink-100">Tạo sản phẩm mới</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onNavigate('/admin/coupons/create')}
                className="group transform rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 p-6 text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 transition-transform group-hover:scale-110">
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
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Tạo mã giảm giá</h4>
                    <p className="text-sm text-purple-100">Khuyến mãi mới</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onNavigate('/admin/orders')}
                className="group transform rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 transition-transform group-hover:scale-110">
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Xem đơn hàng</h4>
                    <p className="text-sm text-blue-100">Quản lý đơn hàng</p>
                  </div>
                </div>
              </button>
            </div>
          </main>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
