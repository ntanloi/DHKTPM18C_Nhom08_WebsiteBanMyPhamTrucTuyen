import api from '../lib/api';

const API_BASE = '/admin/analytics';

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  productsGrowth: number;
  customersGrowth: number;
}

export interface RevenueData {
  totalRevenue: number;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
  }>;
}

export interface OrderStats {
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  recentOrders: Array<{
    id: number;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

export interface ProductStats {
  totalProducts: number;
  lowStockProducts: number;
  topSellingProducts: Array<{
    id: number;
    name: string;
    sold: number;
    revenue: number;
  }>;
}

export interface UserStats {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  usersByRole: Record<string, number>;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get(`${API_BASE}/dashboard`);
  return response.data;
};

export const getRevenueData = async (
  startDate: string,
  endDate: string
): Promise<RevenueData> => {
  const response = await api.get(`${API_BASE}/revenue`, {
    params: { startDate, endDate },
  });
  return response.data;
};

export const getOrderStats = async (
  startDate: string,
  endDate: string
): Promise<OrderStats> => {
  const response = await api.get(`${API_BASE}/orders`, {
    params: { startDate, endDate },
  });
  return response.data;
};

export const getProductStats = async (
  startDate: string,
  endDate: string,
  topCount: number = 10
): Promise<ProductStats> => {
  const response = await api.get(`${API_BASE}/products`, {
    params: { startDate, endDate, topCount },
  });
  return response.data;
};

export const getUserStats = async (
  startDate: string,
  endDate: string
): Promise<UserStats> => {
  const response = await api.get(`${API_BASE}/users`, {
    params: { startDate, endDate },
  });
  return response.data;
};
