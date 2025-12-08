import axios from 'axios';
import type { Notification } from '../types/notification';

const API_BASE = '/api/notifications';

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await axios.get(API_BASE);
  return response.data;
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  await axios.put(`${API_BASE}/${notificationId}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await axios.put(`${API_BASE}/read-all`);
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  await axios.delete(`${API_BASE}/${notificationId}`);
};

export const clearAllNotifications = async (): Promise<void> => {
  await axios.delete(`${API_BASE}/clear-all`);
};
