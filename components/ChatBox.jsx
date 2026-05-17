import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import io from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ChatBox({ orderId, otherUser }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io(API_URL, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      // Join the order chat room
      newSocket.emit('join_chat', {
        order_id: orderId,
        user_id: user.id,
      });
    });

    newSocket.on('joined_chat', (data) => {
      console.log('Joined chat:', data);
      loadMessages();
    });

    newSocket.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
      // Mark as read if not from current user
      if (message.sender.id !== user.id) {
        newSocket.emit('mark_read', {
          order_id: orderId,
          user_id: user.id,
        });
      }
    });

    newSocket.on('user_typing', (data) => {
      if (data.user !== user.username) {
        setOtherUserTyping(data.is_typing);
      }
    });

    newSocket.on('message_blocked', (data) => {
      alert(`Message blocked: ${data.reason}`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [orderId, user.id]);

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/chat/messages/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMessages(data.messages || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket?.emit('typing', {
        order_id: orderId,
        user_id: user.id,
        is_typing: true,
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit('typing', {
        order_id: orderId,
        user_id: user.id,
        is_typing: false,
      });
    }, 1000);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket) return;

    socket.emit('send_message', {
      order_id: orderId,
      user_id: user.id,
      message: newMessage.trim(),
    });

    setNewMessage('');
    setIsTyping(false);
    socket.emit('typing', {
      order_id: orderId,
      user_id: user.id,
      is_typing: false,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-gray-900 rounded-lg border border-gray-800">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {otherUser?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="font-semibold text-white">{otherUser?.username || 'User'}</h3>
            {otherUserTyping && (
              <p className="text-xs text-gray-400">typing...</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender.id === user.id;
            const isSystem = msg.message_type === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center">
                  <p className="text-xs text-gray-500 bg-gray-800 inline-block px-3 py-1 rounded-full">
                    {msg.content}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isOwn
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  {!isOwn && (
                    <p className="text-xs font-semibold mb-1 text-gray-400">
                      {msg.sender.username}
                    </p>
                  )}
                  <p className="text-sm break-words">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-purple-200' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
