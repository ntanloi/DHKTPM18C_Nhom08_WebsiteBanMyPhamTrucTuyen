import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2, Star, ChevronDown } from 'lucide-react';
import {
  type ChatRoom,
  type ChatMessage,
  type SenderType,
  initChatRoom,
  getMessages,
  sendMessage,
  closeRoom,
} from '../../../api/chat';

interface ChatWidgetProps {
  isLoggedIn?: boolean;
  onLoginRequired?: () => void;
}

export default function ChatWidget({ isLoggedIn = false, onLoginRequired }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick replies for bot chat
  const quickReplies = [
    'Tư vấn da dầu',
    'Tư vấn da khô',
    'Sản phẩm trị mụn',
    'Thông tin giao hàng',
    'Chính sách đổi trả',
    'Chat với nhân viên',
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat room when opened
  useEffect(() => {
    if (isOpen && isLoggedIn && !room) {
      initializeChat();
    }
  }, [isOpen, isLoggedIn]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const initializeChat = async () => {
    setIsLoading(true);
    try {
      const chatRoom = await initChatRoom();
      setRoom(chatRoom);
      
      // Load message history
      const history = await getMessages(chatRoom.id);
      setMessages(history);
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    if (!isLoggedIn) {
      onLoginRequired?.();
      return;
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !room || isSending) return;

    const messageContent = inputValue.trim();
    setInputValue('');
    setIsSending(true);

    // Optimistically add customer message
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      roomId: room.id,
      senderType: 'CUSTOMER',
      content: messageContent,
      messageType: 'TEXT',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      // Send message
      await sendMessage(room.id, { content: messageContent });

      // Reload messages to get bot response
      const updatedMessages = await getMessages(room.id);
      setMessages(updatedMessages);

      // Reload room to check status
      // (room might change to PENDING if user requests human support)
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEndChat = () => {
    setShowRating(true);
  };

  const handleSubmitRating = async () => {
    if (!room) return;
    
    try {
      await closeRoom(room.id, { rating, feedback });
      setRoom(null);
      setMessages([]);
      setShowRating(false);
      setRating(0);
      setFeedback('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error closing room:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getSenderIcon = (senderType: SenderType) => {
    switch (senderType) {
      case 'BOT':
        return <Bot className="h-4 w-4" />;
      case 'MANAGER':
        return <User className="h-4 w-4" />;
      case 'SYSTEM':
        return null;
      default:
        return null;
    }
  };

  const getSenderColor = (senderType: SenderType) => {
    switch (senderType) {
      case 'CUSTOMER':
        return 'bg-gradient-to-r from-pink-500 to-purple-600 text-white';
      case 'BOT':
        return 'bg-gray-100 text-gray-800';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800';
      case 'SYSTEM':
        return 'bg-yellow-50 text-yellow-800 text-center text-sm italic';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        >
          <MessageCircle className="h-6 w-6" />
          {/* Notification badge */}
          {room && room.unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
              {room.unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                {room?.roomType === 'BOT' ? (
                  <Bot className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">
                  {room?.roomType === 'BOT' ? 'BeautyBot' : room?.managerName || 'Nhân viên hỗ trợ'}
                </h3>
                <p className="text-xs text-white/80">
                  {room?.status === 'PENDING' 
                    ? 'Đang chờ nhân viên...' 
                    : room?.roomType === 'BOT' 
                      ? 'Trợ lý tư vấn' 
                      : 'Đang hỗ trợ bạn'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEndChat}
                className="rounded-lg bg-white/20 px-3 py-1 text-xs font-medium transition hover:bg-white/30"
              >
                Kết thúc
              </button>
              <button
                onClick={handleClose}
                className="rounded-full p-1 transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
              </div>
            ) : showRating ? (
              /* Rating Screen */
              <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Đánh giá cuộc trò chuyện
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Phản hồi của bạn giúp chúng tôi cải thiện dịch vụ
                  </p>
                </div>
                
                {/* Star Rating */}
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Feedback */}
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Nhận xét của bạn (không bắt buộc)"
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-pink-500 focus:outline-none"
                  rows={3}
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRating(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleSubmitRating}
                    className="rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </div>
            ) : (
              /* Messages List */
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderType === 'CUSTOMER' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.senderType === 'SYSTEM' ? (
                      <div className="w-full rounded-lg bg-yellow-50 px-4 py-2 text-center text-sm italic text-yellow-800">
                        {message.content}
                      </div>
                    ) : (
                      <div
                        className={`group flex max-w-[80%] gap-2 ${
                          message.senderType === 'CUSTOMER' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        {/* Avatar */}
                        {message.senderType !== 'CUSTOMER' && (
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white">
                            {getSenderIcon(message.senderType)}
                          </div>
                        )}
                        
                        {/* Message Bubble */}
                        <div>
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

          {/* Quick Replies (only show for bot chat) */}
          {room?.roomType === 'BOT' && !showRating && messages.length > 0 && (
            <div className="border-t border-gray-100 bg-white px-4 py-2">
              <div className="flex flex-wrap gap-2">
                {quickReplies.slice(0, 3).map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600 transition hover:bg-pink-100"
                  >
                    {reply}
                  </button>
                ))}
                <button className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-100">
                  Xem thêm <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* Pending Status */}
          {room?.status === 'PENDING' && !showRating && (
            <div className="border-t border-gray-100 bg-yellow-50 px-4 py-2 text-center text-sm text-yellow-800">
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
              Đang kết nối với nhân viên hỗ trợ...
            </div>
          )}

          {/* Input */}
          {!showRating && (
            <div className="border-t border-gray-100 bg-white p-4">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-pink-500 focus:outline-none"
                  disabled={isSending}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isSending}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
