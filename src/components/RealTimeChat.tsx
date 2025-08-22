import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Users, MessageCircle, Circle, Phone, Video } from 'lucide-react';
import { BASE_URL } from '../config';
import socketService, { ChatMessage, ChatRoom } from '../services/socket.service';

interface User {
  user_id: string;
  user_type: 'Realtor' | 'Client' | 'Admin';
  name: string;
  email?: string;
  avatar?: string;
  isOnline?: boolean;
}

const RealTimeChat: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState<{[key: string]: boolean}>({});
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize chat system
  useEffect(() => {
    initializeChat();
    return () => {
      socketService.disconnect();
      socketService.removeAllListeners();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      setConnectionStatus('connecting');
      const token = localStorage.getItem('token'); // Changed from 'access_token' to 'token'
      
      if (!token) {
        console.error('No auth token found');
        setConnectionStatus('disconnected');
        setError('Please login to access messaging');
        return;
      }

      // Authenticate with socket
      await socketService.authenticate(token);
      setConnectionStatus('connected');

      // Set up real-time event listeners
      setupSocketListeners();

      // Fetch initial data
      await Promise.all([
        fetchCurrentUser(),
        fetchChatRooms(),
        fetchAvailableUsers()
      ]);

    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setConnectionStatus('disconnected');
      setError('Failed to connect to chat service');
    }
  };

  const setupSocketListeners = () => {
    // New message received
    socketService.onNewMessage((message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
      
      // Update last message in chat rooms
      setChatRooms(prev => prev.map(room => 
        room._id === message.chat_id 
          ? { 
              ...room, 
              last_message: {
                content: message.content,
                sender_name: message.sender_name,
                timestamp: message.timestamp
              }
            }
          : room
      ));
    });

    // Message read status
    socketService.onMessageRead((data) => {
      console.log('Messages read:', data);
    });

    // Typing indicators
    socketService.onUserTyping((data) => {
      if (data.chat_id === selectedChat?._id) {
        setIsTyping(prev => ({ ...prev, [data.user_id]: true }));
      }
    });

    socketService.onUserStoppedTyping((data) => {
      if (data.chat_id === selectedChat?._id) {
        setIsTyping(prev => ({ ...prev, [data.user_id]: false }));
      }
    });

    // User presence
    socketService.onUserOnline((data) => {
      console.log('User online:', data);
    });

    socketService.onUserOffline((data) => {
      console.log('User offline:', data);
    });
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/auth/current-user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        setCurrentUser({
          user_id: result.data.user_ref || result.data.id, // Fix: fallback to id if user_ref is undefined
          user_type: result.data.userType,
          name: `${result.data.first_name} ${result.data.last_name}`,
          email: result.data.email
        });
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  const fetchChatRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/chat/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        const chatData = result.data || [];
        // Ensure we always set an array
        setChatRooms(Array.isArray(chatData) ? chatData : []);
      } else {
        // If request fails, ensure we still have an empty array
        setChatRooms([]);
      }
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
      // Ensure we always have an array even on error
      setChatRooms([]);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // If there's a search query, use search endpoint
      if (searchQuery && searchQuery.trim().length >= 2) {
        const response = await fetch(`${BASE_URL}/api/chat/search-users?q=${encodeURIComponent(searchQuery.trim())}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const result = await response.json();
          setAvailableUsers(result.data?.users || []);
        }
      } else {
        // Otherwise, fetch clients that can be messaged
        const response = await fetch(`${BASE_URL}/api/clients`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const result = await response.json();
          const clients = result.data || [];
          
          // Transform client data to user format
          const users = clients.map((client: any) => ({
            user_id: client.user_id || client._id,
            user_type: 'Client',
            name: client.name || `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown Client',
            email: client.email
          }));
          
          setAvailableUsers(users);
        }
      }
    } catch (error) {
      console.error('Failed to fetch available users:', error);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/chat/${chatId}/messages?page=1&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        setMessages(result.data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectChat = async (chat: ChatRoom) => {
    try {
      // Leave previous chat
      if (selectedChat) {
        await socketService.leaveChat(selectedChat._id);
      }

      // Join new chat
      await socketService.joinChat(chat._id);
      setSelectedChat(chat);
      
      // Fetch messages for this chat
      await fetchMessages(chat._id);
      
      // Mark messages as read
      socketService.markAsRead(chat._id);
      
    } catch (error) {
      console.error('Failed to select chat:', error);
    }
  };

  const createNewChat = async (userId: string, userType: string) => {
    console.log('createNewChat called with:', { userId, userType });
    try {
      const token = localStorage.getItem("token");
      console.log('Token found:', !!token);
      
      const response = await fetch(`${BASE_URL}/api/chat/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          otherUserId: userId,
          otherUserType: userType
        })
      });
      
      console.log('API response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Chat creation result:', result);
        const newChatData = result.data;
        
        // Transform to ChatRoom format
        const newChat: ChatRoom = {
          _id: newChatData.chat_id || newChatData._id,
          participants: newChatData.participants,
          last_message: newChatData.last_message ? {
            content: newChatData.last_message,
            sender_name: '',
            timestamp: newChatData.last_message_at || new Date().toISOString()
          } : undefined,
          unread_count: 0,
          workspace_id: newChatData.workspace_id || ''
        };
        
        console.log('New chat object:', newChat);
        
        // Add to chat rooms list
        setChatRooms(prev => {
          const exists = prev.find(room => room._id === newChat._id);
          return exists ? prev : [newChat, ...prev];
        });
        
        // Close modal and clear search
        setShowUserSearch(false);
        setSearchQuery('');
        setAvailableUsers([]);
        
        // Select the new chat immediately
        console.log('Setting selected chat:', newChat);
        setSelectedChat(newChat);
        
        // Join the chat room via socket
        console.log('Joining chat room:', newChat._id);
        socketService.joinChat(newChat._id);
        
        // Fetch messages for this chat
        console.log('Fetching messages for chat:', newChat._id);
        await fetchMessages(newChat._id);
      } else {
        const error = await response.json();
        console.error('Failed to create chat - API error:', error);
        alert(`Failed to create chat: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to create chat - Network/JS error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create chat';
      alert(`Network error: ${errorMessage}`);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !currentUser) return;

    const content = newMessage.trim();
    const otherParticipant = selectedChat.participants.find(p => p.user_id !== currentUser.user_id);
    
    if (!otherParticipant) return;

    try {
      await socketService.sendMessage(
        selectedChat._id,
        content,
        otherParticipant.user_id,
        otherParticipant.user_type
      );
      
      setNewMessage('');
      
      // Stop typing indicator
      socketService.stopTyping(selectedChat._id);
      
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = useCallback((value: string) => {
    setNewMessage(value);
    
    if (!selectedChat) return;
    
    if (value.trim()) {
      socketService.startTyping(selectedChat._id);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socketService.stopTyping(selectedChat._id);
      }, 3000);
    } else {
      socketService.stopTyping(selectedChat._id);
    }
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOtherParticipant = (chat: ChatRoom) => {
    return chat.participants.find(p => p.user_id !== currentUser?.user_id);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <div className="h-full flex bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar - Chat List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}></div>
              <span className="text-xs text-gray-500 capitalize">{connectionStatus}</span>
            </div>
          </div>
          
          {/* New Chat Button */}
          <button
            onClick={() => {
              setShowUserSearch(true);
              setSearchQuery('');
              setAvailableUsers([]); // Clear any previous users
              fetchAvailableUsers(); // Fetch clients initially
            }}
            disabled={!!error || connectionStatus !== 'connected'}
            className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {error ? (
            <div className="p-4 text-center text-red-500">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-red-300" />
              <p className="font-medium">Authentication Required</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => window.location.href = '/login'}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Login
              </button>
            </div>
          ) : !chatRooms || !Array.isArray(chatRooms) || chatRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No conversations yet</p>
              <p className="text-sm">Start a new chat to begin messaging</p>
            </div>
          ) : (
            (Array.isArray(chatRooms) ? chatRooms : []).map((chat) => {
              const otherParticipant = getOtherParticipant(chat);
              return (
                <div
                  key={chat._id}
                  onClick={() => selectChat(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat?._id === chat._id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {otherParticipant?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {otherParticipant?.name || 'Unknown User'}
                        </h3>
                        {chat.last_message && (
                          <span className="text-xs text-gray-500">
                            {formatTime(chat.last_message.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 capitalize mb-1">
                        {otherParticipant?.user_type || 'Unknown'}
                      </p>
                      {chat.last_message && (
                        <p className="text-sm text-gray-600 truncate">
                          {chat.last_message.content}
                        </p>
                      )}
                      {chat.unread_count > 0 && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {getOtherParticipant(selectedChat)?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getOtherParticipant(selectedChat)?.name || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {getOtherParticipant(selectedChat)?.user_type || 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Video className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No messages yet</p>
                  <p className="text-sm">Send a message to start the conversation</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.sender_id === currentUser?.user_id;
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {!isOwnMessage && (
                          <p className="text-xs font-medium mb-1 opacity-70">
                            {message.sender_name}
                          </p>
                        )}
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
                })
              )}
              
              {/* Typing Indicator */}
              {Object.keys(isTyping).some(userId => isTyping[userId] && userId !== currentUser?.user_id) && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={connectionStatus !== 'connected'}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || connectionStatus !== 'connected'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* User Search Modal */}
      {showUserSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96">
            <h3 className="text-lg font-semibold mb-4">Start New Chat</h3>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchAvailableUsers();
              }}
              placeholder="Search users..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            
            <div className="max-h-48 overflow-y-auto">
              {availableUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No users found</p>
              ) : (
                availableUsers.map((user) => (
                  <div
                    key={user.user_id}
                    onClick={() => {
                      console.log('Creating new chat with user:', user);
                      createNewChat(user.user_id, user.user_type);
                    }}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.user_type}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowUserSearch(false);
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeChat;
