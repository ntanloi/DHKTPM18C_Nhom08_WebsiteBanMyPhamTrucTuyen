import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import {
  getDashboardSummary,
  getOrderStats,
  getProductStats,
} from '../../../api/analytics';

// Type definitions
interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

interface OrderStatusData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface TopProductData {
  name: string;
  sales: number;
  revenue: number;
}

const AdminAnalytics = ({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) => {
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([]);
  const [topProductsData, setTopProductsData] = useState<TopProductData[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calculate date range based on timeRange
        const endDate = new Date();
        const startDate = new Date();
        
        switch (timeRange) {
          case '7days':
            startDate.setDate(endDate.getDate() - 7);
            break;
          case '30days':
            startDate.setDate(endDate.getDate() - 30);
            break;
          case '90days':
            startDate.setDate(endDate.getDate() - 90);
            break;
          case 'year':
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
        }

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        // Fetch all data in parallel
        const [dashboardData, orderStatsData, productStatsData] = await Promise.all([
          getDashboardSummary(),
          getOrderStats(startDateStr, endDateStr),
          getProductStats(startDateStr, endDateStr, 5),
        ]);

        // Process dashboard summary
        setStats({
          totalRevenue: dashboardData.totalRevenue || 0,
          totalOrders: dashboardData.totalOrders || 0,
          avgOrderValue: dashboardData.totalOrders > 0 
            ? dashboardData.totalRevenue / dashboardData.totalOrders 
            : 0,
          totalCustomers: dashboardData.totalCustomers || 0,
        });

        // Process order status data for pie chart
        const ordersByStatus = dashboardData.ordersByStatus || {};
        const statusMap: Record<string, { name: string; color: string }> = {
          DELIVERED: { name: 'Đã giao', color: '#10B981' },
          SHIPPED: { name: 'Đang giao', color: '#6366F1' },
          PROCESSING: { name: 'Đang xử lý', color: '#3B82F6' },
          CONFIRMED: { name: 'Đã xác nhận', color: '#8B5CF6' },
          PENDING: { name: 'Chờ xử lý', color: '#F59E0B' },
          CANCELLED: { name: 'Đã hủy', color: '#EF4444' },
        };

        const statusData: OrderStatusData[] = Object.entries(ordersByStatus).map(
          ([status, count]) => ({
            name: statusMap[status]?.name || status,
            value: count as number,
            color: statusMap[status]?.color || '#6B7280',
          })
        );
        setOrderStatusData(statusData);

        // Process revenue data for area chart (using recent orders)
        const recentOrders = orderStatsData.recentOrders || [];
        const revenueByDate: Record<string, { revenue: number; orders: number }> = {};
        
        // Generate last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateKey = date.toLocaleDateString('vi-VN', {
            month: 'short',
            day: 'numeric',
          });
          revenueByDate[dateKey] = { revenue: 0, orders: 0 };
        }

        // Aggregate orders by date
        recentOrders.forEach((order) => {
          const orderDate = new Date(order.createdAt);
          const dateKey = orderDate.toLocaleDateString('vi-VN', {
            month: 'short',
            day: 'numeric',
          });
          if (revenueByDate[dateKey]) {
            revenueByDate[dateKey].revenue += order.totalAmount / 1000000; // Convert to millions
            revenueByDate[dateKey].orders += 1;
          }
        });

        const revenueChartData: RevenueData[] = Object.entries(revenueByDate).map(
          ([date, data]) => ({
            date,
            revenue: data.revenue,
            orders: data.orders,
          })
        );
        setRevenueData(revenueChartData);

        // Process top products data
        const topProducts = productStatsData.topSellingProducts || [];
        const topProductsChartData: TopProductData[] = topProducts.map((product) => ({
          name: product.name,
          sales: product.sold,
          revenue: product.revenue,
        }));
        setTopProductsData(topProductsChartData);

      } catch (err: any) {
        console.error('Failed to fetch analytics data:', err);
        setError(err.message || 'Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  return (
    <AdminLayout onNavigate={onNavigate}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Báo Cáo & Thống Kê
          </h1>
          <p className="mt-2 text-gray-600">
            Phân tích dữ liệu kinh doanh và hiệu suất bán hàng
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
            <p className="font-medium">Lỗi tải dữ liệu:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Đang tải dữ liệu thống kê...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex gap-2">{['7days', '30days', '90days', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${
                timeRange === range
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {range === '7days' && '7 ngày'}
              {range === '30days' && '30 ngày'}
              {range === '90days' && '90 ngày'}
              {range === 'year' && 'Năm nay'}
            </button>
          ))}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 p-3">
                <svg
                  className="h-6 w-6 text-white"
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
              <span className="text-sm font-semibold text-green-600">
                +12.5%
              </span>
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">
              Tổng Doanh Thu
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              ₫{stats.totalRevenue.toLocaleString('vi-VN')}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-3">
                <svg
                  className="h-6 w-6 text-white"
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
              <span className="text-sm font-semibold text-green-600">
                +8.2%
              </span>
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">
              Tổng Đơn Hàng
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalOrders}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-green-600">
                +5.4%
              </span>
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">
              Giá Trị Đơn TB
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              ₫{Math.round(stats.avgOrderValue).toLocaleString('vi-VN')}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-green-600">
                +15.3%
              </span>
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">
              Số Khách Hàng
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalCustomers}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue Trend Chart */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Xu Hướng Doanh Thu
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: number) => [
                    `₫${value.toFixed(2)}M`,
                    'Doanh thu',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#EC4899"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Distribution */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Phân Bổ Trạng Thái Đơn Hàng
            </h3>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) =>
                      `${props.name}: ${(props.percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-gray-400">
                Chưa có dữ liệu đơn hàng
              </div>
            )}
          </div>

          {/* Top Products Revenue Chart */}
          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Top Sản Phẩm Bán Chạy - Doanh Thu
            </h3>
            {topProductsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProductsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#9CA3AF"
                    style={{ fontSize: '11px' }}
                    width={150}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'sales') return [value, 'Đã bán'];
                      return [`₫${value.toLocaleString('vi-VN')}`, 'Doanh thu'];
                    }}
                  />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-gray-400">
                Chưa có dữ liệu sản phẩm
              </div>
            )}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-bold text-gray-900">
              Chi Tiết Top Sản Phẩm
            </h3>
          </div>
          {topProductsData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Đã bán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Doanh thu
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {topProductsData.map((product, index) => (
                    <tr
                      key={index}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-pink-500 to-rose-500 font-bold text-white">
                            {index + 1}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {product.sales}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          ₫{product.revenue.toLocaleString('vi-VN')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-gray-400">
              Chưa có dữ liệu sản phẩm
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
