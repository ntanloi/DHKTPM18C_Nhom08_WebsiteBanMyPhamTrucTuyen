import axios from 'axios';
import { mockUserService } from '../mocks/userData';

const API_BASE_URL = '/api/users';
const USE_MOCK = true; //them de test

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  avatarUrl?: string;
  birthDay?: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  birthDay?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UserResponse {
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
}

export const createUser = async (
  request: CreateUserRequest,
): Promise<UserResponse> => {
  if (USE_MOCK) return mockUserService.createUser(request); //test
  const response = await axios.post<UserResponse>(API_BASE_URL, request);
  return response.data;
};

export const getUserById = async (userId: number): Promise<UserResponse> => {
  if (USE_MOCK) return mockUserService.getUserById(userId); //test
  const response = await axios.get<UserResponse>(`${API_BASE_URL}/${userId}`);
  return response.data;
};

export const getUserByEmail = async (email: string): Promise<UserResponse> => {
  if (USE_MOCK) return mockUserService.getUserByEmail(email); //test
  const response = await axios.get<UserResponse>(
    `${API_BASE_URL}/email/${email}`,
  );
  return response.data;
};

export const getAllUsers = async (): Promise<UserResponse[]> => {
  if (USE_MOCK) return mockUserService.getAllUsers(); //test
  const response = await axios.get<UserResponse[]>(API_BASE_URL);
  return response.data;
};

export const updateUser = async (
  userId: number,
  request: UpdateUserRequest,
): Promise<UserResponse> => {
  if (USE_MOCK) return mockUserService.updateUser(userId, request); //test
  const response = await axios.put<UserResponse>(
    `${API_BASE_URL}/${userId}`,
    request,
  );
  return response.data;
};

export const changePassword = async (
  userId: number,
  request: ChangePasswordRequest,
): Promise<UserResponse> => {
  if (USE_MOCK) return mockUserService.changePassword(userId, request); //test
  const response = await axios.put<UserResponse>(
    `${API_BASE_URL}/${userId}/change-password`,
    request,
  );
  return response.data;
};

export const deactivateUser = async (
  userId: number,
): Promise<{ message: string }> => {
  if (USE_MOCK) return mockUserService.deactivateUser(userId); //test
  const response = await axios.put<{ message: string }>(
    `${API_BASE_URL}/${userId}/deactivate`,
  );
  return response.data;
};

export const activateUser = async (
  userId: number,
): Promise<{ message: string }> => {
  if (USE_MOCK) return mockUserService.activateUser(userId); //test
  const response = await axios.put<{ message: string }>(
    `${API_BASE_URL}/${userId}/activate`,
  );
  return response.data;
};

export const deleteUser = async (
  userId: number,
): Promise<{ message: string }> => {
  if (USE_MOCK) return mockUserService.deleteUser(userId); //test
  const response = await axios.delete<{ message: string }>(
    `${API_BASE_URL}/${userId}`,
  );
  return response.data;
};
