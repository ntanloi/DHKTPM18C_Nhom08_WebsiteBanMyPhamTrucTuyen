import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Send,
  User,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Star,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  type ChatRoom,
  type ChatMessage,
  type SenderType,
  getPendingRooms,
  getManagerRooms,
  acceptRoom,
  getMessages,
  sendManagerMessage,
  closeRoom,
} from '../../../api/chat';
import { useWebSocket } from '../../../hooks/useWebSocket';

export default function ChatManagementPage() {
  const [pendingRooms, setPendingRooms] = useState<ChatRoom[]>([]);
  const [myRooms, setMyRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'my'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // WebSocket connection
  const token = localStorage.getItem('accessToken');
  const { connected, subscribe, send } = useWebSocket({
    autoConnect: true,
    token: token || undefined,
  });

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load rooms on mount
  useEffect(() => {
    loadRooms();
  }, []);

  // WebSocket subscriptions for real-time updates
  useEffect(() => {
    if (!connected) return;

    // Subscribe to pending rooms updates
    const unsubPending = subscribe('/topic/chat/pending', (message: unknown) => {
      const room = message as ChatRoom;
      setPendingRooms((prev) => {
        // Add new room or update existing
        const exists = prev.find((r) => r.id === room.id);
        if (exists) {
          return prev.map((r) => (r.id === room.id ? room : r));
        }
        return [room, ...prev];
      });
    });

    // Subscribe to room status updates
    const unsubUpdates = subscribe('/topic/chat/updates', (message: unknown) => {
      const room = message as ChatRoom;
      
      // Update pending/my rooms based on status
      if (room.status === 'PENDING') {
        setPendingRooms((prev) => {
          const exists = prev.find((r) => r.id === room.id);
          if (!exists) return [room, ...prev];
          return prev.map((r) => (r.id === room.id ? room : r));
        });
        setMyRooms((prev) => prev.filter((r) => r.id !== room.id));
      } else if (room.status === 'ASSIGNED') {
        setMyRooms((prev) => {
          const exists = prev.find((r) => r.id === room.id);
          if (!exists) return [room, ...prev];
          return prev.map((r) => (r.id === room.id ? room : r));
        });
        setPendingRooms((prev) => prev.filter((r) => r.id !== room.id));
      } else if (room.status === 'CLOSED') {
        setMyRooms((prev) => prev.filter((r) => r.id !== room.id));
        setPendingRooms((prev) => prev.filter((r) => r.id !== room.id));
        if (selectedRoom?.id === room.id) {
          setSelectedRoom(null);
          setMessages([]);
        }
      }
    });

    // Subscribe to personal queue for direct updates
    const unsubQueue = subscribe('/user/queue/chat', (message: unknown) => {
      const data = message as { type: string; room: ChatRoom };
      if (data.type === 'ROOM_ASSIGNED') {
        setMyRooms((prev) => {
          const exists = prev.find((r) => r.id === data.room.id);
          if (!exists) return [data.room, ...prev];
          return prev.map((r) => (r.id === data.room.id ? data.room : r));
        });
      }
    });

    return () => {
      unsubPending();
      unsubUpdates();
      unsubQueue();
    };
  }, [connected, subscribe, selectedRoom]);

  // Subscribe to selected room messages
  useEffect(() => {
    if (!connected || !selectedRoom) return;

    const unsubMessages = subscribe(`/topic/chat/${selectedRoom.id}`, (message: unknown) => {
      const msg = message as ChatMessage;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    return () => unsubMessages();
  }, [connected, selectedRoom, subscribe]);

  // Load messages when room selected
  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

  const loadRooms = async () => {
    try {
      const [pending, my] = await Promise.all([
        getPendingRooms(),
        getManagerRooms(),
      ]);
      setPendingRooms(pending);
      setMyRooms(my);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const loadMessages = async (roomId: string) => {
    setIsLoading(true);
    try {
      const msgs = await getMessages(roomId);
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRoom = async (room: ChatRoom) => {
    try {
      const updatedRoom = await acceptRoom(room.id);
      setSelectedRoom(updatedRoom);
      setActiveTab('my');
      await loadRooms();
    } catch (error) {
      console.error('Error accepting room:', error);
      alert('Có lỗi khi nhận phòng chat');
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedRoom || isSending) return;

    const messageContent = inputValue.trim();
    setInputValue('');
    setIsSending(true);

    try {
      // Try WebSocket first, fallback to REST API
      if (connected) {
        send(`/app/chat/${selectedRoom.id}/send`, { content: messageContent });
      } else {
        await sendManagerMessage(selectedRoom.id, { content: messageContent });
        await loadMessages(selectedRoom.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore input if failed
      setInputValue(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseRoom = async () => {
    if (!selectedRoom) return;

    if (!confirm('Bạn có chắc muốn kết thúc cuộc trò chuyện này?')) return;

    try {
      await closeRoom(selectedRoom.id);
      setSelectedRoom(null);
      setMessages([]);
      await loadRooms();
    } catch (error) {
      console.error('Error closing room:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getSenderColor = (senderType: SenderType) => {
    switch (senderType) {
      case 'CUSTOMER':
        return 'bg-gray-100 text-gray-800';
      case 'MANAGER':
        return 'bg-blue-500 text-white';
      case 'BOT':
        return 'bg-purple-100 text-purple-800';
      case 'SYSTEM':
        return 'bg-yellow-50 text-yellow-800 text-center text-sm italic';
      default:
        return 'bg-gray-100';
    }
  };

  const filteredPendingRooms = pendingRooms.filter(
    (room) =>
      room.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMyRooms = myRooms.filter(
    (room) =>
      room.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* Sidebar - Room List */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Quản lý Chat</h1>
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {connected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs text-yellow-600">Offline</span>
                </>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                activeTab === 'pending'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chờ xử lý
              {pendingRooms.length > 0 && (
                <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {pendingRooms.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                activeTab === 'my'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Đang xử lý
              {myRooms.length > 0 && (
                <span className="ml-1 rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
                  {myRooms.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Room List */}
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 180px)' }}>
          {activeTab === 'pending' ? (
            filteredPendingRooms.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>Không có yêu cầu mới</p>
              </div>
            ) : (
              filteredPendingRooms.map((room) => (
                <div
                  key={room.id}
                  className="cursor-pointer border-b border-gray-100 p-4 transition hover:bg-gray-50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {room.customerName || 'Khách hàng'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(room.createdAt)} {formatTime(room.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(room.status)}`}>
                      Chờ
                    </span>
                  </div>
                  {room.lastMessage && (
                    <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                      {room.lastMessage.content}
                    </p>
                  )}
                  <button
                    onClick={() => handleAcceptRoom(room)}
                    className="w-full rounded-lg bg-blue-500 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                  >
                    Nhận hỗ trợ
                  </button>
                </div>
              ))
            )
          ) : filteredMyRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>Chưa có cuộc trò chuyện</p>
            </div>
          ) : (
            filteredMyRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`cursor-pointer border-b border-gray-100 p-4 transition hover:bg-gray-50 ${
                  selectedRoom?.id === room.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {room.customerName || 'Khách hàng'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(room.updatedAt)} {formatTime(room.updatedAt)}
                      </p>
                    </div>
                  </div>
                  {room.unreadCount > 0 && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
                {room.lastMessage && (
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {room.lastMessage.senderType === 'MANAGER' && (
                      <span className="text-blue-600">Bạn: </span>
                    )}
                    {room.lastMessage.content}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Refresh Button */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={loadRooms}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedRoom.customerName || 'Khách hàng'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Room ID: {selectedRoom.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(selectedRoom.status)}`}>
                  {selectedRoom.status === 'ASSIGNED' ? 'Đang hỗ trợ' : selectedRoom.status}
                </span>
                <button
                  onClick={handleCloseRoom}
                  className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4" />
                  Kết thúc
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderType === 'MANAGER' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.senderType === 'SYSTEM' ? (
                        <div className="w-full rounded-lg bg-yellow-50 px-4 py-2 text-center text-sm italic text-yellow-800">
                          {message.content}
                        </div>
                      ) : (
                        <div
                          className={`group flex max-w-[70%] gap-2 ${
                            message.senderType === 'MANAGER' ? 'flex-row-reverse' : ''
                          }`}
                        >
                          {/* Avatar */}
                          {message.senderType !== 'MANAGER' && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                          )}

                          {/* Message Bubble */}
                          <div>
                            {message.senderType !== 'MANAGER' && (
                              <p className="mb-1 text-xs text-gray-500">
                                {message.senderType === 'BOT' ? 'BeautyBot' : message.senderName || 'Khách hàng'}
                              </p>
                            )}
                            <div
                              className={`rounded-2xl px-4 py-2 ${getSenderColor(message.senderType)}`}
                            >
                              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                            </div>
                            <p className="mt-1 text-xs text-gray-400">
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 rounded-full border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                  disabled={isSending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isSending}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white transition hover:bg-blue-600 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Room Selected */
          <div className="flex h-full flex-col items-center justify-center bg-gray-50 text-gray-500">
            <MessageCircle className="mb-4 h-16 w-16 opacity-30" />
            <h3 className="mb-2 text-lg font-medium">Chọn một cuộc trò chuyện</h3>
            <p className="text-sm">
              Chọn một phòng chat từ danh sách bên trái để bắt đầu hỗ trợ
            </p>
          </div>
        )}
      </div>

      {/* Right Sidebar - Customer Info (optional) */}
      {selectedRoom && (
        <div className="w-72 shrink-0 border-l border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Thông tin khách hàng</h3>

          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <p className="font-medium text-gray-900">
              {selectedRoom.customerName || 'Khách hàng'}
            </p>
            <p className="text-sm text-gray-500">ID: {selectedRoom.customerId}</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="mb-1 text-xs text-gray-500">Trạng thái</p>
              <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(selectedRoom.status)}`}>
                {selectedRoom.status === 'ASSIGNED' ? 'Đang hỗ trợ' : selectedRoom.status}
              </span>
            </div>

            <div className="rounded-lg bg-gray-50 p-3">
              <p className="mb-1 text-xs text-gray-500">Loại phòng</p>
              <p className="text-sm font-medium text-gray-900">
                {selectedRoom.roomType === 'HUMAN' ? 'Nhân viên hỗ trợ' : 'Bot'}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-3">
              <p className="mb-1 text-xs text-gray-500">Bắt đầu lúc</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(selectedRoom.createdAt)} {formatTime(selectedRoom.createdAt)}
              </p>
            </div>

            {selectedRoom.rating && (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="mb-1 text-xs text-gray-500">Đánh giá</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= selectedRoom.rating!
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 space-y-2">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              <CheckCircle className="h-4 w-4" />
              Xem đơn hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
