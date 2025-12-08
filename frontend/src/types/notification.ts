export type NotificationType = 
  | 'ORDER_STATUS'
  | 'NEW_MESSAGE'
  | 'LOW_STOCK'
  | 'SYSTEM'
  | 'PROMOTION'
  | 'PAYMENT';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
  userId: string;
}

export interface NotificationDTO {
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}
