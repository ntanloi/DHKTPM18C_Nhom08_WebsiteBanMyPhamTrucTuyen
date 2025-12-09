import { api } from '../lib/api';

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  birthDay: string;
  isActive: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  roleName?: string;
  hasPassword?: boolean;
}

export interface AdminUserPage {
  content: AdminUser[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface AdminUserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  userCount: number;
  managerCount: number;
  adminCount: number;
}

const BASE_URL = '/admin/users';

export const adminUserApi = {
  getUsers: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    role?: string;
  }): Promise<AdminUserPage> => {
    const response = await api.get<AdminUserPage>(BASE_URL, {
      params,
    });
    return response.data;
  },

  updateRole: async (userId: number, roleName: string): Promise<AdminUser> => {
    const response = await api.put<AdminUser>(`${BASE_URL}/${userId}/role`, {
      roleName,
    });
    return response.data;
  },

  toggleStatus: async (userId: number): Promise<AdminUser> => {
    const response = await api.put<{ user: AdminUser }>(
      `${BASE_URL}/${userId}/status`,
    );
    return response.data.user || (response.data as unknown as AdminUser);
  },

  getStats: async (): Promise<AdminUserStats> => {
    const response = await api.get<AdminUserStats>(`${BASE_URL}/stats`);
    return response.data;
  },
};
