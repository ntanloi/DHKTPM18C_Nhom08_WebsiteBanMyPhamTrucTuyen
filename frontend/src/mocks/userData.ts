import type { UserResponse } from '../api/user';
import type { AddressResponse } from '../api/address';

export const mockUsers: UserResponse[] = [
  {
    id: 1,
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@example.com',
    phoneNumber: '0901234567',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    birthDay: '1990-05-15',
    isActive: true,
    emailVerifiedAt: '2024-01-15T10:30:00',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-15T10:30:00',
  },
  {
    id: 2,
    fullName: 'Trần Thị Bình',
    email: 'tranthibinh@example.com',
    phoneNumber: '0912345678',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    birthDay: '1992-08-20',
    isActive: true,
    emailVerifiedAt: '2024-01-20T14:20:00',
    createdAt: '2024-01-05T09:00:00',
    updatedAt: '2024-01-20T14:20:00',
  },
  {
    id: 3,
    fullName: 'Lê Minh Cường',
    email: 'leminhcuong@example.com',
    phoneNumber: '0923456789',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    birthDay: '1988-03-10',
    isActive: false,
    emailVerifiedAt: null,
    createdAt: '2024-01-10T11:00:00',
    updatedAt: '2024-01-25T16:45:00',
  },
  {
    id: 4,
    fullName: 'Phạm Thu Duyên',
    email: 'phamthuduyen@example.com',
    phoneNumber: '0934567890',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    birthDay: '1995-12-25',
    isActive: true,
    emailVerifiedAt: '2024-02-01T09:15:00',
    createdAt: '2024-02-01T08:30:00',
    updatedAt: '2024-02-01T09:15:00',
  },
  {
    id: 5,
    fullName: 'Hoàng Văn Em',
    email: 'hoangvanem@example.com',
    phoneNumber: '0945678901',
    avatarUrl: '',
    birthDay: '1993-07-18',
    isActive: true,
    emailVerifiedAt: '2024-01-28T13:00:00',
    createdAt: '2024-01-28T12:00:00',
    updatedAt: '2024-01-28T13:00:00',
  },
  {
    id: 6,
    fullName: 'Đặng Thị Phương',
    email: 'dangthiphuong@example.com',
    phoneNumber: '0956789012',
    avatarUrl: 'https://i.pravatar.cc/150?img=20',
    birthDay: '1991-11-05',
    isActive: false,
    emailVerifiedAt: null,
    createdAt: '2024-01-12T14:00:00',
    updatedAt: '2024-02-05T10:20:00',
  },
  {
    id: 7,
    fullName: 'Vũ Đình Giang',
    email: 'vudinhgiang@example.com',
    phoneNumber: '0967890123',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    birthDay: '1989-04-22',
    isActive: true,
    emailVerifiedAt: '2024-01-18T11:45:00',
    createdAt: '2024-01-18T10:30:00',
    updatedAt: '2024-01-18T11:45:00',
  },
  {
    id: 8,
    fullName: 'Bùi Thị Hoa',
    email: 'buithihoa@example.com',
    phoneNumber: '0978901234',
    avatarUrl: 'https://i.pravatar.cc/150?img=25',
    birthDay: '1994-09-30',
    isActive: true,
    emailVerifiedAt: '2024-02-03T15:30:00',
    createdAt: '2024-02-03T14:00:00',
    updatedAt: '2024-02-03T15:30:00',
  },
];

export const mockAddresses: Record<number, AddressResponse[]> = {
  1: [
    {
      id: 1,
      userId: 1,
      recipientName: 'Nguyễn Văn An',
      recipientPhone: '0901234567',
      streetAddress: '123 Đường Lê Lợi',
      ward: 'Phường Bến Nghé',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh',
      isDefault: true,
      createdAt: '2024-01-01T08:00:00',
      updatedAt: '2024-01-01T08:00:00',
    },
    {
      id: 2,
      userId: 1,
      recipientName: 'Nguyễn Văn An',
      recipientPhone: '0901234567',
      streetAddress: '456 Đường Nguyễn Huệ',
      ward: 'Phường Bến Thành',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh',
      isDefault: false,
      createdAt: '2024-01-05T10:00:00',
      updatedAt: '2024-01-05T10:00:00',
    },
  ],
  2: [
    {
      id: 3,
      userId: 2,
      recipientName: 'Trần Thị Bình',
      recipientPhone: '0912345678',
      streetAddress: '789 Đường Võ Văn Tần',
      ward: 'Phường 6',
      district: 'Quận 3',
      city: 'TP. Hồ Chí Minh',
      isDefault: true,
      createdAt: '2024-01-05T09:00:00',
      updatedAt: '2024-01-05T09:00:00',
    },
  ],
  3: [
    {
      id: 4,
      userId: 3,
      recipientName: 'Lê Minh Cường',
      recipientPhone: '0923456789',
      streetAddress: '321 Đường Trần Hưng Đạo',
      ward: 'Phường Cầu Kho',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh',
      isDefault: true,
      createdAt: '2024-01-10T11:00:00',
      updatedAt: '2024-01-10T11:00:00',
    },
  ],
};

let userIdCounter = mockUsers.length + 1;

export const mockUserService = {
  getAllUsers: async (): Promise<UserResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...mockUsers];
  },

  getUserById: async (userId: number): Promise<UserResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    return { ...user };
  },

  getUserByEmail: async (email: string): Promise<UserResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const user = mockUsers.find((u) => u.email === email);
    if (!user) throw new Error('User not found');
    return { ...user };
  },

  createUser: async (data: any): Promise<UserResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newUser: UserResponse = {
      id: userIdCounter++,
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber || '',
      avatarUrl: data.avatarUrl || '',
      birthDay: data.birthDay || '',
      isActive: true,
      emailVerifiedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return { ...newUser };
  },

  updateUser: async (userId: number, data: any): Promise<UserResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockUsers.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');

    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return { ...mockUsers[index] };
  },

  changePassword: async (userId: number, data: any): Promise<UserResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    return { ...user };
  },

  activateUser: async (userId: number): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    user.isActive = true;
    user.updatedAt = new Date().toISOString();
    return { message: 'User activated successfully' };
  },

  deactivateUser: async (userId: number): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    user.isActive = false;
    user.updatedAt = new Date().toISOString();
    return { message: 'User deactivated successfully' };
  },

  deleteUser: async (userId: number): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockUsers.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');
    mockUsers.splice(index, 1);
    return { message: 'User deleted successfully' };
  },
};

export const mockAddressService = {
  getAddressesByUserId: async (userId: number): Promise<AddressResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockAddresses[userId] || [];
  },
};
