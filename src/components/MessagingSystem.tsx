import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  MessageCircle, 
  Circle, 
  Search,
  Plus,
  X,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { selectUser, selectIsAuthenticated } from '../store/slices/authSlice';
import api from '../utils/api';

interface ChatUser {
  user_id: string;
  user_type: 'Realtor' | 'Client' | 'Admin';
  name: string;
  email?: string;
  avatar?: string;
  isOnline?: boolean;
}

interface ChatMessage {
  _id: string;
  chat_id: string;
  sender_id: string;
  sender_type: 'Realtor' | 'Client' | 'Admin';
  sender_name: string;
  content: string;
  timestamp: string;
  read_by: Array<{
    user_id: string;
    read_at: string;
  }>;
}

interface ChatRoom {
  _id: string;
  participants: ChatUser[];
  last_message?: {
    content: string;
    sender_name: string;
    timestamp: string;
  };
  unread_count: number;
  workspace_id: string;
}

const MessagingSystem: React.FC = () => {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [availableUsers, setAvailableUsers] = useState<ChatUser[]>([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messaging system
  useEffect(() => {
    if (isAuthenticated && user) {
      initializeMessaging();
    }
  }, [isAuthenticated, user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeMessaging = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchChatRooms(),
        fetchAvailableUsers()
      ]);
      
    } catch (error) {
      console.error('Failed to initialize messaging:', error);
      setError('Failed to load messaging data');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatRooms = async () => {
    try {
      const response = await api.get('/api/chat/list');
      if (response.data.success) {
        setChatRooms(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      // Fetch users from the same workspace
      const response = await api.get('/api/chat/search-users');
      if (response.data.success) {
        setAvailableUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch available users:', error);
      // Fallback to empty array if endpoint fails
      setAvailableUsers([]);
    }
  };

  const fetchChatMessages = async (chatId: string) => {
    try {
      const response = await api.get(`/api/chat/${chatId}/messages`);
      if (response.data.success) {
        setMessages(response.data.data.messages || []);
        
        // Mark messages as read
        await markMessagesAsRead(chatId);
      }
    } catch (error) {
      console.error('Failed to fetch chat messages:', error);
    }
  };

  const markMessagesAsRead = async (chatId: string) => {
    try {
      await api.patch(`/api/chat/${chatId}/read`);
      // Update unread count in chat rooms
      setChatRooms(prev => prev.map(room => 
        room._id === chatId ? { ...room, unread_count: 0 } : room
      ));
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const messageData = {
        content: newMessage.trim(),
        type: 'text'
      };

      const response = await api.post(`/api/chat/${selectedChat._id}/send`, messageData);
      
      if (response.data.success) {
        const newMsg = response.data.data;
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        
        // Update chat room with new last message
        setChatRooms(prev => prev.map(room => 
          room._id === selectedChat._id 
            ? { 
                ...room, 
                last_message: {
                  content: newMsg.content,
                  sender_name: newMsg.sender_name,
                  timestamp: newMsg.timestamp
                }
              }
            : room
        ));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message');
    }
  };

  const createOrGetChat = async (otherUser: ChatUser) => {
    try {
      const response = await api.post('/api/chat/create', {
        otherUserId: otherUser.user_id,
        otherUserType: otherUser.user_type
      });

      if (response.data.success) {
        const newChat = response.data.data;
        
        // Add to chat rooms if not already exists
        setChatRooms(prev => {
          const exists = prev.find(room => room._id === newChat.chat_id);
          if (!exists) {
            const chatRoom: ChatRoom = {
              _id: newChat.chat_id,
              participants: newChat.participants,
              workspace_id: newChat.workspace_id || '',
              unread_count: 0
            };
            return [chatRoom, ...prev];
          }
          return prev;
        });

        // Find and select the chat
        const chatRoom = chatRooms.find(room => room._id === newChat.chat_id) || {
          _id: newChat.chat_id,
          participants: newChat.participants,
          workspace_id: newChat.workspace_id || '',
          unread_count: 0
        };
        
        setSelectedChat(chatRoom);
        setShowUserSearch(false);
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
      setError('Failed to create chat');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChatSelect = async (chat: ChatRoom) => {
    setSelectedChat(chat);
    await fetchChatMessages(chat._id);
  };

  const getOtherParticipant = (chat: ChatRoom): ChatUser | null => {
    return chat.participants.find(p => p.user_id !== user?.id) || null;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredUsers = availableUsers.filter(u => 
    u.user_id !== user?.id && 
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-500">Please log in to access messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white rounded-lg shadow">
      {/* Chat List Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <button
              onClick={() => setShowUserSearch(true)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : chatRooms.length === 0 ? (
            <div className="text-center p-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No conversations yet</p>
              <button
                onClick={() => setShowUserSearch(true)}
                className="mt-2 text-blue-500 hover:text-blue-600 font-medium"
              >
                Start a conversation
              </button>
            </div>
          ) : (
            chatRooms.map((chat) => {
              const otherUser = getOtherParticipant(chat);
              return (
                <div
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedChat?._id === chat._id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {otherUser?.name.charAt(0).toUpperCase() || '?'}
                      </div>
                      {otherUser?.isOnline && (
                        <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {otherUser?.name || 'Unknown User'}
                        </h3>
                        {chat.unread_count > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {chat.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        {otherUser?.user_type}
                      </p>
                      {chat.last_message && (
                        <p className="text-sm text-gray-600 truncate">
                          {chat.last_message.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {getOtherParticipant(selectedChat)?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {getOtherParticipant(selectedChat)?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getOtherParticipant(selectedChat)?.user_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.sender_id === user?.id;
                return (
                  <div
                    key={message._id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to {user?.user_type === 'Realtor' ? 'Realtor' : 'Client'} Messaging
              </h3>
              <p className="text-gray-500 mb-4">
                Select a conversation to start messaging
              </p>
              <button
                onClick={() => setShowUserSearch(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Search Modal */}
      {showUserSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Start New Conversation</h3>
              <button
                onClick={() => setShowUserSearch(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {searchQuery ? 'No users found' : 'Loading users...'}
                </p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.user_id}
                    onClick={() => createOrGetChat(user)}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                      <p className="text-xs text-gray-500">{user.user_type}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-white hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessagingSystem;
