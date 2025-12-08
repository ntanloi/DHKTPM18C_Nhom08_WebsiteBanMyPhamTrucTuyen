import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Notification } from '../types/notification';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../hooks/useAuth';
// import * as notificationApi from '../api/notification'; // TODO: Backend chưa có NotificationController
import toast from 'react-hot-toast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  loading: boolean;
  connected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // WebSocket connection
  const token = localStorage.getItem('beautybox_access_token');
  const { connected, subscribe } = useWebSocket({
    autoConnect: isLoggedIn,
    token: token || undefined,
  });

  // Load initial notifications
  useEffect(() => {
    if (isLoggedIn) {
      loadNotifications();
    } else {
      setNotifications([]);
      setLoading(false);
    }
  }, [isLoggedIn]);

  // WebSocket subscription for real-time notifications
  useEffect(() => {
    if (!connected || !isLoggedIn) return;

    const unsubscribe = subscribe('/user/queue/notifications', (message: unknown) => {
      const notification = message as Notification;
      setNotifications((prev) => [notification, ...prev]);
      
      // Show toast notification
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
          >
            <div className="w-0 flex-1 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
              >
                Đóng
              </button>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    });

    return () => unsubscribe();
  }, [connected, isLoggedIn, subscribe]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // TODO: Backend chưa có NotificationController REST API
      // Hiện tại chỉ dùng WebSocket để nhận notification real-time
      console.warn('NotificationController REST API not implemented yet - using WebSocket only');
      // const data = await notificationApi.getNotifications();
      // setNotifications(data);
      setNotifications([]); // Tạm thời dùng empty array
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // TODO: Backend chưa có NotificationController REST API
      console.warn('markAsRead API not implemented - only updating local state');
      // await notificationApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: Backend chưa có NotificationController REST API
      console.warn('markAllAsRead API not implemented - only updating local state');
      // await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearNotifications = async () => {
    try {
      // TODO: Backend chưa có NotificationController REST API
      console.warn('clearNotifications API not implemented - only updating local state');
      // await notificationApi.clearAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // TODO: Backend chưa có NotificationController REST API
      console.warn('deleteNotification API not implemented - only updating local state');
      // await notificationApi.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        deleteNotification,
        loading,
        connected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
