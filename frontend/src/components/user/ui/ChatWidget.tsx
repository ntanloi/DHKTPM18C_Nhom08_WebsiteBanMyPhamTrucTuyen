import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, Star, ChevronDown, User, Headphones } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import * as chatApi from '../../../api/chat';

interface Message {
  id: string;
  content: string;
  senderType: 'CUSTOMER' | 'BOT' | 'SYSTEM' | 'SUPPORT' | 'MANAGER';
  senderName?: string;
  createdAt: string;
}

interface GuestChatResponse {
  sessionId: string;
  message: string;
  senderType: string;
  quickReplies?: string[];
  canTransferToHuman?: boolean;
  requiresLogin?: boolean;
}

const API_BASE = '/api/chat/guest';

export default function ChatWidget() {
  const { isLoggedIn } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [showAllReplies, setShowAllReplies] = useState(false);
  
  // Guest mode state
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);
  
  // Authenticated mode state  
  const [chatRoom, setChatRoom] = useState<chatApi.ChatRoom | null>(null);
  const [isWaitingForSupport, setIsWaitingForSupport] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initialize chat when opened
  useEffect(() => {
    if (!isOpen) return;
    
    const init = async () => {
      if (isLoggedIn) {
        await initAuthenticatedChat();
      } else if (!guestSessionId) {
        await initGuestChat();
      }
    };
    
    init();
    
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Poll for new messages when waiting for support
  useEffect(() => {
    if (chatRoom && (chatRoom.status === 'PENDING' || chatRoom.status === 'ASSIGNED')) {
      const poll = async () => await fetchMessages();
      
      pollIntervalRef.current = setInterval(poll, 3000);
      
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoom?.status]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current && !isLoading) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isLoading]);

  // ==================== Guest Mode ====================
  
  const initGuestChat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: null }),
      });
      
      const data: GuestChatResponse = await response.json();
      
      setGuestSessionId(data.sessionId);
      setQuickReplies(data.quickReplies || []);
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([{
          id: `bot-${Date.now()}`,
          content: data.message,
          senderType: 'BOT',
          createdAt: new Date().toISOString(),
        }]);
      }, 1000);
      
    } catch (error) {
      // Error logged internally
      setMessages([{
        id: `error-${Date.now()}`,
        content: 'Xin lỗi, không thể kết nối với hệ thống chat. Vui lòng thử lại sau.',
        senderType: 'SYSTEM',
        createdAt: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendGuestMessage = async (messageContent: string) => {
    if (!guestSessionId) return;
    
    try {
      const response = await fetch(`${API_BASE}/${guestSessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent }),
      });
      
      const data: GuestChatResponse = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      setIsTyping(false);
      
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        content: data.message,
        senderType: 'BOT',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      
      if (data.quickReplies) {
        setQuickReplies(data.quickReplies);
      }
      
      if (data.requiresLogin) {
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: `system-${Date.now()}`,
            content: '💡 Vui lòng đăng nhập để được kết nối với nhân viên tư vấn!',
            senderType: 'SYSTEM',
            createdAt: new Date().toISOString(),
          }]);
        }, 1500);
      }
      
    } catch (error) {
      // Error logged internally
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: `error-${Date.now()}`,
        content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
        senderType: 'SYSTEM',
        createdAt: new Date().toISOString(),
      }]);
    }
  };

  // ==================== Authenticated Mode ====================
  
  const initAuthenticatedChat = async () => {
    setIsLoading(true);
    try {
      const room = await chatApi.initChatRoom();
      setChatRoom(room);
      
      const history = await chatApi.getMessages(room.id);
      
      const mappedMessages: Message[] = history.map(msg => ({
        id: msg.id,
        content: msg.content,
        senderType: msg.senderType as Message['senderType'],
        senderName: msg.senderName,
        createdAt: msg.createdAt,
      }));
      
      setMessages(mappedMessages);
      setIsWaitingForSupport(room.status === 'PENDING');
      
      if (room.roomType === 'BOT') {
        setQuickReplies([
          "Tư vấn da dầu 🌊",
          "Tư vấn da khô 🏜️", 
          "Sản phẩm trị mụn 💊",
          "Giao hàng 📦",
          "Đổi trả 🔄",
          "Gặp nhân viên 🙋"
        ]);
      } else {
        setQuickReplies([]);
      }
      
    } catch (error) {
      // Error logged internally
      setMessages([{
        id: `error-${Date.now()}`,
        content: 'Xin lỗi, không thể kết nối với hệ thống chat. Vui lòng thử lại sau.',
        senderType: 'SYSTEM',
        createdAt: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!chatRoom) return;
    
    try {
      const updatedRoom = await chatApi.getChatRoom(chatRoom.id);
      setChatRoom(updatedRoom);
      setIsWaitingForSupport(updatedRoom.status === 'PENDING');
      
      const history = await chatApi.getMessages(chatRoom.id);
      
      const mappedMessages: Message[] = history.map(msg => ({
        id: msg.id,
        content: msg.content,
        senderType: msg.senderType as Message['senderType'],
        senderName: msg.senderName,
        createdAt: msg.createdAt,
      }));
      
      setMessages(mappedMessages);
      
      if (updatedRoom.status === 'ASSIGNED') {
        setQuickReplies([]);
      }
      
    } catch (error) {
      // Error logged internally
    }
  }, [chatRoom]);

  const sendAuthenticatedMessage = async (messageContent: string) => {
    if (!chatRoom) return;
    
    try {
      await chatApi.sendMessage(chatRoom.id, { content: messageContent });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchMessages();
      
      setIsTyping(false);
      
    } catch (error) {
      // Error logged internally
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: `error-${Date.now()}`,
        content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
        senderType: 'SYSTEM',
        createdAt: new Date().toISOString(),
      }]);
    }
  };

  // ==================== Common Handlers ====================

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    const messageContent = inputValue.trim();
    setInputValue('');
    setIsSending(true);

    const customerMsg: Message = {
      id: `customer-${Date.now()}`,
      content: messageContent,
      senderType: 'CUSTOMER',
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, customerMsg]);

    if (!chatRoom || chatRoom.roomType === 'BOT') {
      setIsTyping(true);
    }

    if (isLoggedIn && chatRoom) {
      await sendAuthenticatedMessage(messageContent);
    } else if (guestSessionId) {
      await sendGuestMessage(messageContent);
    }
    
    setIsSending(false);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    setShowAllReplies(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEndChat = async () => {
    if (isLoggedIn && chatRoom) {
      setShowRating(true);
    } else {
      setGuestSessionId(null);
      setMessages([]);
      setIsOpen(false);
    }
  };

  const handleSubmitRating = async () => {
    if (chatRoom) {
      try {
        await chatApi.closeRoom(chatRoom.id, { rating, feedback });
      } catch (error) {
        // Error logged internally
      }
    }
    
    setChatRoom(null);
    setMessages([]);
    setShowRating(false);
    setRating(0);
    setFeedback('');
    setIsOpen(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getSenderColor = (senderType: string) => {
    switch (senderType) {
      case 'CUSTOMER':
        return 'bg-gradient-to-r from-pink-500 to-purple-600 text-white';
      case 'BOT':
        return 'bg-white text-gray-800 shadow-sm border border-gray-100';
      case 'SUPPORT':
      case 'MANAGER':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'SYSTEM':
        return 'bg-yellow-50 text-yellow-800 text-center text-sm italic border border-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getSenderIcon = (senderType: string) => {
    switch (senderType) {
      case 'BOT':
        return <Bot className="h-4 w-4" />;
      case 'SUPPORT':
      case 'MANAGER':
        return <Headphones className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getHeaderInfo = () => {
    if (chatRoom?.status === 'ASSIGNED') {
      return {
        title: chatRoom.supportName || chatRoom.managerName || 'Nhân viên tư vấn',
        subtitle: 'Đang hỗ trợ bạn',
        icon: <Headphones className="h-5 w-5" />
      };
    }
    if (isWaitingForSupport) {
      return {
        title: 'Đang kết nối...',
        subtitle: 'Vui lòng chờ nhân viên',
        icon: <Loader2 className="h-5 w-5 animate-spin" />
      };
    }
    return {
      title: 'BeautyBot',
      subtitle: 'Trợ lý tư vấn 24/7',
      icon: <Bot className="h-5 w-5" />
    };
  };

  const headerInfo = getHeaderInfo();

  const TypingIndicator = () => (
    <div className="flex justify-start">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white">
          <Bot className="h-4 w-4" />
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm border border-gray-100">
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-bounce"
          style={{ animationDuration: '2s' }}
          title="Chat với BeautyBot"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute inset-0 rounded-full bg-pink-500 opacity-30 animate-ping"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 text-white ${
            chatRoom?.status === 'ASSIGNED' 
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
              : 'bg-gradient-to-r from-pink-500 to-purple-600'
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                {headerInfo.icon}
              </div>
              <div>
                <h3 className="font-semibold">{headerInfo.title}</h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                  {headerInfo.subtitle}
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

          {/* Waiting for support banner */}
          {isWaitingForSupport && (
            <div className="bg-yellow-50 border-b border-yellow-100 px-4 py-2 text-center">
              <p className="text-sm text-yellow-800">
                ⏳ Đang chờ nhân viên tư vấn... Vui lòng đợi trong giây lát!
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4">
            {isLoading ? (
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 to-purple-100">
                  <Bot className="h-8 w-8 text-pink-500 animate-pulse" />
                </div>
                <p className="text-sm text-gray-500">Đang kết nối...</p>
              </div>
            ) : showRating ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 to-purple-100">
                  <Star className="h-8 w-8 text-pink-500" />
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900">Đánh giá cuộc trò chuyện</h4>
                  <p className="mt-1 text-sm text-gray-500">Phản hồi của bạn giúp chúng tôi cải thiện</p>
                </div>
                
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="transition hover:scale-110">
                      <Star className={`h-8 w-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Nhận xét của bạn (không bắt buộc)"
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  rows={3}
                />

                <div className="flex gap-3 w-full">
                  <button onClick={() => setShowRating(false)} className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                    Quay lại
                  </button>
                  <button onClick={handleSubmitRating} className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
                    Hoàn tất
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.length === 0 && !isTyping && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 to-purple-100 mb-3">
                      <Bot className="h-8 w-8 text-pink-500" />
                    </div>
                    <p className="text-gray-500 text-sm">Đang khởi tạo...</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.senderType === 'CUSTOMER' ? 'justify-end' : 'justify-start'}`}>
                    {message.senderType === 'SYSTEM' ? (
                      <div className={`w-full rounded-xl px-4 py-2 ${getSenderColor(message.senderType)}`}>
                        {message.content}
                      </div>
                    ) : (
                      <div className={`flex max-w-[85%] gap-2 ${message.senderType === 'CUSTOMER' ? 'flex-row-reverse' : ''}`}>
                        {message.senderType !== 'CUSTOMER' && (
                          <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white ${
                            message.senderType === 'SUPPORT' || message.senderType === 'MANAGER'
                              ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                              : 'bg-gradient-to-r from-pink-400 to-purple-500'
                          }`}>
                            {getSenderIcon(message.senderType)}
                          </div>
                        )}
                        
                        <div className="flex flex-col">
                          {(message.senderType === 'SUPPORT' || message.senderType === 'MANAGER') && message.senderName && (
                            <p className="text-xs text-gray-500 mb-1">{message.senderName}</p>
                          )}
                          <div className={`rounded-2xl px-4 py-2.5 ${getSenderColor(message.senderType)}`}>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                          </div>
                          <p className={`mt-1 text-xs text-gray-400 ${message.senderType === 'CUSTOMER' ? 'text-right' : ''}`}>
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Quick Replies */}
          {!showRating && messages.length > 0 && quickReplies.length > 0 && (
            <div className="border-t border-gray-100 bg-white px-4 py-2">
              <div className="flex flex-wrap gap-2">
                {(showAllReplies ? quickReplies : quickReplies.slice(0, 3)).map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-medium text-pink-600 transition hover:bg-pink-100 hover:border-pink-300"
                  >
                    {reply}
                  </button>
                ))}
                {quickReplies.length > 3 && !showAllReplies && (
                  <button 
                    onClick={() => setShowAllReplies(true)}
                    className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
                  >
                    +{quickReplies.length - 3} <ChevronDown className="h-3 w-3" />
                  </button>
                )}
              </div>
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
                  placeholder={isWaitingForSupport ? "Nhân viên sẽ trả lời sớm..." : "Nhập tin nhắn..."}
                  className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition"
                  disabled={isSending || isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isSending || isLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white transition hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-gray-400">
                {isLoggedIn 
                  ? 'Gõ "nhân viên" để kết nối với tư vấn viên'
                  : 'Đăng nhập để được hỗ trợ từ nhân viên tư vấn'}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
