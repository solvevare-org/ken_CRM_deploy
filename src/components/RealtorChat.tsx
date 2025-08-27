import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Circle, User } from 'lucide-react';
import { BASE_URL } from '../config';
import socketService, { ChatMessage, ChatRoom } from '../services/socket.service';
import { useSelector } from 'react-redux';
import { selectUserToken } from '../store/slices/authSlice';

interface User {
  user_id: string;
  user_type: 'Realtor' | 'Client' | 'Admin';
  name: string;
  email?: string;
  avatar?: string;
  isOnline?: boolean;
}

const RealtorChat: React.FC = () => {
  // Redux selectors
  const token = useSelector(selectUserToken);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [availableClients, setAvailableClients] = useState<User[]>([]);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        fetchAvailableClients()
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
  };

  const fetchCurrentUser = async () => {
    try {
      if (!token) return;
      
      const response = await fetch(`${BASE_URL}/api/auth/current-user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        setCurrentUser({
          user_id: result.data.user_ref || result.data.id,
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
      if (!token) return;
      
      const response = await fetch(`${BASE_URL}/api/chat/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        setChatRooms(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
    }
  };

  const fetchAvailableClients = async () => {
    try {
      if (!token) return;
      
      const response = await fetch(`${BASE_URL}/api/chat/search-users?user_type=Client&q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        setAvailableClients(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch available clients:', error);
    }
  };

  const selectChat = async (room: ChatRoom) => {
    try {
      setSelectedChat(room);
      setLoading(true);

      // Join the chat room
      await socketService.joinChat(room._id);

      // Fetch messages for this chat
      const response = await fetch(`${BASE_URL}/api/chat/chats/${room._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        setMessages(result.data || []);
        
        // Mark messages as read
        socketService.markAsRead(room._id);
      }
    } catch (error) {
      console.error('Failed to select chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const startChatWithClient = async (client: User) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${BASE_URL}/api/chat/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          participant_id: client.user_id,
          participant_type: 'Client'
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        const newChat = result.data;
        
        // Add to chat rooms if not already exists
        setChatRooms(prev => {
          const exists = prev.find(room => room._id === newChat._id);
          return exists ? prev : [...prev, newChat];
        });
        
        // Select the new chat
        await selectChat(newChat);
        setShowClientSearch(false);
      }
    } catch (error) {
      console.error('Failed to start chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await fetch(`${BASE_URL}/api/chat/chats/${selectedChat._id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newMessage,
          type: 'text'
        })
      });
      
      if (response.ok) {
        setNewMessage('');
        // Message will be added via socket listener
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherParticipant = (room: ChatRoom) => {
    return room.participants.find(p => p.user_id !== currentUser?.user_id);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat List Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Client Messages</h2>
            <div className="flex items-center gap-2">
              <Circle className={`w-3 h-3 ${
                connectionStatus === 'connected' ? 'text-green-500 fill-green-500' : 
                connectionStatus === 'connecting' ? 'text-yellow-500 fill-yellow-500' : 
                'text-red-500 fill-red-500'
              }`} />
              <button
                onClick={() => setShowClientSearch(!showClientSearch)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                title="Start new chat with client"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* New Chat Search */}
        {showClientSearch && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchAvailableClients();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <div className="mt-2 max-h-32 overflow-y-auto">
              {availableClients.map((client) => (
                <div
                  key={client.user_id}
                  onClick={() => startChatWithClient(client)}
                  className="p-2 hover:bg-white rounded cursor-pointer"
                >
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-gray-500">{client.email}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {chatRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm">Start a chat with a client</p>
            </div>
          ) : (
            chatRooms.map((room) => {
              const otherParticipant = getOtherParticipant(room);
              return (
                <div
                  key={room._id}
                  onClick={() => selectChat(room)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedChat?._id === room._id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {otherParticipant?.name || 'Unknown Client'}
                      </div>
                      {room.last_message && (
                        <div className="text-sm text-gray-500 truncate">
                          {room.last_message.content}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {room.last_message && formatTime(room.last_message.timestamp)}
                      {room.unread_count > 0 && (
                        <div className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mt-1 ml-auto">
                          {room.unread_count}
                        </div>
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
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                  {getOtherParticipant(selectedChat)?.name?.charAt(0) || 'C'}
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">
                    {getOtherParticipant(selectedChat)?.name || 'Client'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getOtherParticipant(selectedChat)?.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="text-center text-gray-500">Loading messages...</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender_id === currentUser?.user_id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === currentUser?.user_id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div
                        className={`text-xs mt-1 ${
                          message.sender_id === currentUser?.user_id
                            ? 'text-blue-200'
                            : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
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
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
              <p className="text-sm">or start a new chat with a client</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealtorChat;
