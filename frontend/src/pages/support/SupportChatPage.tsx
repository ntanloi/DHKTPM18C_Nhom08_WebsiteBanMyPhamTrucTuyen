import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Send,
  User,
  Clock,
  CheckCircle,
  RefreshCw,
  Search,
  Headphones,
  ArrowLeft,
} from 'lucide-react';
import {
  type ChatRoom,
  type ChatMessage,
  getPendingRooms,
  getManagerRooms,
  acceptRoom,
  getMessages,
  sendManagerMessage,
  closeRoom,
} from '../../api/chat';
import { useAuth } from '../../hooks/useAuth';

export default function SupportChatPage() {
  const { user } = useAuth();
  const [pendingRooms, setPendingRooms] = useState<ChatRoom[]>([]);
  const [myRooms, setMyRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, _setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'my'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    loadRooms();
    const interval = setInterval(loadRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
      const msgInterval = setInterval(() => loadMessages(selectedRoom.id), 3000);
      return () => clearInterval(msgInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom?.id]);

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
    try {
      const msgs = await getMessages(roomId);
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
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
      await sendManagerMessage(selectedRoom.id, { content: messageContent });
      await loadMessages(selectedRoom.id);
    } catch (error) {
      console.error('Error sending message:', error);
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

  const getSenderColor = (senderType: string) => {
    switch (senderType) {
      case 'CUSTOMER':
        return 'bg-gray-100 text-gray-800';
      case 'SUPPORT':
      case 'MANAGER':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'BOT':
        return 'bg-gradient-to-r from-pink-400 to-purple-500 text-white';
      case 'SYSTEM':
        return 'bg-yellow-50 text-yellow-800 text-center italic';
      default:
        return 'bg-gray-100';
    }
  };

  const filteredPendingRooms = pendingRooms.filter(room =>
    room.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMyRooms = myRooms.filter(room =>
    room.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Hỗ trợ khách hàng</h1>
                <p className="text-sm text-white/80">Xin chào, {user?.fullName || user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-sm">Đang trực tuyến</span>
              </div>
              <button
                onClick={loadRooms}
                className="rounded-full bg-white/20 p-2 transition hover:bg-white/30"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4">
        <div className="flex gap-4 h-[calc(100vh-120px)]">
          {/* Sidebar - Room List */}
          <div className="w-80 flex-shrink-0 rounded-xl bg-white shadow-sm border border-gray-100 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                  activeTab === 'pending'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Đang chờ ({pendingRooms.length})
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                  activeTab === 'my'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Đang xử lý ({myRooms.length})
              </button>
            </div>

            {/* Room List */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'pending' ? (
                filteredPendingRooms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <MessageCircle className="h-12 w-12 mb-2" />
                    <p className="text-sm">Không có khách hàng đang chờ</p>
                  </div>
                ) : (
                  filteredPendingRooms.map((room) => (
                    <div
                      key={room.id}
                      className="border-b border-gray-50 p-4 hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 truncate">
                              {room.customerName || 'Khách hàng'}
                            </p>
                            <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                              Đang chờ
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate mt-1">
                            {room.lastMessage?.content || 'Không có tin nhắn'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {formatTime(room.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptRoom(room);
                        }}
                        className="mt-3 w-full rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 py-2 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        Nhận hỗ trợ
                      </button>
                    </div>
                  ))
                )
              ) : (
                filteredMyRooms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <CheckCircle className="h-12 w-12 mb-2" />
                    <p className="text-sm">Bạn chưa có cuộc trò chuyện nào</p>
                  </div>
                ) : (
                  filteredMyRooms.map((room) => (
                    <div
                      key={room.id}
                      className={`border-b border-gray-50 p-4 cursor-pointer transition ${
                        selectedRoom?.id === room.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 truncate">
                              {room.customerName || 'Khách hàng'}
                            </p>
                            {room.unreadCount > 0 && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                {room.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate mt-1">
                            {room.lastMessage?.content || 'Không có tin nhắn'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 rounded-xl bg-white shadow-sm border border-gray-100 flex flex-col">
            {selectedRoom ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedRoom(null)}
                      className="lg:hidden rounded-full p-2 hover:bg-gray-100"
                    >
                      <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedRoom.customerName || 'Khách hàng'}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-400"></span>
                        Đang trực tuyến
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedRoom.status === 'ASSIGNED' && (
                      <button
                        onClick={handleCloseRoom}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Kết thúc
                      </button>
                    )}
                    {selectedRoom.status === 'PENDING' && (
                      <button
                        onClick={() => handleAcceptRoom(selectedRoom)}
                        className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        Nhận hỗ trợ
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.senderType === 'SUPPORT' || msg.senderType === 'MANAGER'
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          {msg.senderType === 'SYSTEM' ? (
                            <div className="w-full text-center">
                              <span className="inline-block rounded-full bg-yellow-50 px-4 py-1 text-sm text-yellow-700">
                                {msg.content}
                              </span>
                            </div>
                          ) : (
                            <div
                              className={`flex max-w-[70%] gap-2 ${
                                msg.senderType === 'SUPPORT' || msg.senderType === 'MANAGER'
                                  ? 'flex-row-reverse'
                                  : ''
                              }`}
                            >
                              <div className="flex flex-col">
                                <div className={`rounded-2xl px-4 py-2.5 ${getSenderColor(msg.senderType)}`}>
                                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                                </div>
                                <span className={`mt-1 text-xs text-gray-400 ${
                                  msg.senderType === 'SUPPORT' || msg.senderType === 'MANAGER' ? 'text-right' : ''
                                }`}>
                                  {formatTime(msg.createdAt)}
                                </span>
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
                {selectedRoom.status === 'ASSIGNED' && (
                  <div className="border-t border-gray-100 p-4">
                    <div className="flex items-center gap-3">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        disabled={isSending}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isSending}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white transition hover:opacity-90 disabled:opacity-50"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-gray-400">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-4">
                  <MessageCircle className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-medium text-gray-600">Chọn một cuộc trò chuyện</h3>
                <p className="mt-1 text-sm">Chọn từ danh sách bên trái để bắt đầu hỗ trợ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
