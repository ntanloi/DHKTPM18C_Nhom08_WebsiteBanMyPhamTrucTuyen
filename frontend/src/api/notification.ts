import api from '../lib/api';
import type { Notification } from '../types/notification';

const API_BASE = '/notifications';

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get(API_BASE);
  return response.data;
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  await api.put(`${API_BASE}/${notificationId}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await api.put(`${API_BASE}/read-all`);
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  await api.delete(`${API_BASE}/${notificationId}`);
};

export const clearAllNotifications = async (): Promise<void> => {
  await api.delete(`${API_BASE}/clear-all`);
};
