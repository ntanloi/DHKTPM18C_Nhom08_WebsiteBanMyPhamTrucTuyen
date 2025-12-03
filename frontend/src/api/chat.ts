import api from '../lib/api';

// ==================== Types ====================

export type RoomType = 'BOT' | 'HUMAN';
export type RoomStatus = 'OPEN' | 'PENDING' | 'ASSIGNED' | 'CLOSED';
export type SenderType = 'CUSTOMER' | 'MANAGER' | 'BOT' | 'SYSTEM';
export type MessageType = 'TEXT' | 'IMAGE' | 'PRODUCT' | 'ORDER' | 'SYSTEM';

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId?: number;
  senderName?: string;
  senderAvatar?: string;
  senderType: SenderType;
  content: string;
  messageType: MessageType;
  isRead: boolean;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  customerId: number;
  customerName?: string;
  managerId?: number;
  managerName?: string;
  roomType: RoomType;
  status: RoomStatus;
  lastMessage?: ChatMessage;
  unreadCount: number;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  roomId?: string;
  content: string;
  messageType?: MessageType;
}

export interface CloseRoomRequest {
  rating?: number;
  feedback?: string;
}

// ==================== Customer APIs ====================

/**
 * Initialize or get customer's chat room
 */
export const initChatRoom = async (): Promise<ChatRoom> => {
  const response = await api.post<ChatRoom>('/chat/rooms/init');
  return response.data;
};

/**
 * Get room information
 */
export const getChatRoom = async (roomId: string): Promise<ChatRoom> => {
  const response = await api.get<ChatRoom>(`/chat/rooms/${roomId}`);
  return response.data;
};

/**
 * Get current customer's rooms
 */
export const getMyRooms = async (): Promise<ChatRoom[]> => {
  const response = await api.get<ChatRoom[]>('/chat/rooms/my');
  return response.data;
};

/**
 * Send message (REST fallback when WebSocket unavailable)
 */
export const sendMessage = async (
  roomId: string,
  request: SendMessageRequest
): Promise<ChatMessage> => {
  const response = await api.post<ChatMessage>(
    `/chat/rooms/${roomId}/messages`,
    request
  );
  return response.data;
};

/**
 * Get message history
 */
export const getMessages = async (
  roomId: string,
  page: number = 0,
  size: number = 50
): Promise<ChatMessage[]> => {
  const response = await api.get<ChatMessage[]>(
    `/chat/rooms/${roomId}/messages`,
    { params: { page, size } }
  );
  return response.data;
};

/**
 * Close room and submit rating
 */
export const closeRoom = async (
  roomId: string,
  request?: CloseRoomRequest
): Promise<ChatRoom> => {
  const response = await api.post<ChatRoom>(
    `/chat/rooms/${roomId}/close`,
    request || {}
  );
  return response.data;
};

// ==================== Manager APIs ====================

/**
 * Get pending rooms list
 */
export const getPendingRooms = async (): Promise<ChatRoom[]> => {
  const response = await api.get<ChatRoom[]>('/chat/manager/rooms/pending');
  return response.data;
};

/**
 * Get manager's assigned rooms
 */
export const getManagerRooms = async (): Promise<ChatRoom[]> => {
  const response = await api.get<ChatRoom[]>('/chat/manager/rooms/my');
  return response.data;
};

/**
 * Accept room for support
 */
export const acceptRoom = async (roomId: string): Promise<ChatRoom> => {
  const response = await api.post<ChatRoom>(
    `/chat/manager/rooms/${roomId}/accept`
  );
  return response.data;
};

/**
 * Get pending room count
 */
export const getPendingRoomCount = async (): Promise<number> => {
  const response = await api.get<{ count: number }>(
    '/chat/manager/rooms/pending/count'
  );
  return response.data.count;
};

/**
 * Manager sends message
 */
export const sendManagerMessage = async (
  roomId: string,
  request: SendMessageRequest
): Promise<ChatMessage> => {
  const response = await api.post<ChatMessage>(
    `/chat/manager/rooms/${roomId}/messages`,
    request
  );
  return response.data;
};
