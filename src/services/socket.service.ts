import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../config';

export interface ChatMessage {
  _id: string;
  chat_id: string;
  sender_id: string;
  sender_type: 'Realtor' | 'Client' | 'Admin';
  sender_name: string;
  content: string;
  type: 'text';
  timestamp: string;
  read_by: Array<{
    user_id: string;
    user_type: string;
    read_at: string;
  }>;
}

export interface ChatRoom {
  _id: string;
  participants: Array<{
    user_id: string;
    user_type: 'Realtor' | 'Client' | 'Admin';
    name: string;
    avatar?: string;
    email?: string;
  }>;
  last_message?: {
    content: string;
    sender_name: string;
    timestamp: string;
  };
  unread_count: number;
  workspace_id: string;
}

export interface SocketResponse {
  success: boolean;
  message: string;
  data?: any;
}

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isAuthenticated = false;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      console.log('🔌 Initializing socket connection to:', BASE_URL);
      
      this.socket = io(BASE_URL, {
        transports: ['polling', 'websocket'], // Try polling first, then websocket
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        forceNew: false,
        upgrade: true // Allow upgrading to websocket after polling works
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected successfully:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      console.error('Error details:', {
        message: error.message,
        description: (error as any).description || 'No description',
        context: (error as any).context || 'No context',
        stack: error.stack
      });
      this.handleReconnect();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isAuthenticated = false;
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, reconnect manually
        this.socket?.connect();
      } else if (reason === 'io client disconnect') {
        // Client initiated disconnect, don't reconnect
        return;
      }
      
      // Auto reconnect for other reasons
      this.handleReconnect();
    });

    this.socket.on('error', (error) => {
      console.error('🚨 Socket error:', error);
    });

    // Add global debugging listeners
    this.socket.onAny((eventName, ...args) => {
      console.log(`🔔 Received event "${eventName}":`, args);
    });

    // Removed global auth listeners to prevent conflicts with promise-based auth
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      
      console.log(`🔄 Reconnecting attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms...`);
      
      setTimeout(() => {
        this.socket?.connect();
      }, delay);
    } else {
      console.error('❌ Max reconnect attempts reached');
    }
  }

  // Authentication
  authenticate(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      // If already authenticated, resolve immediately
      if (this.isAuthenticated) {
        console.log('✅ Already authenticated, resolving immediately');
        resolve({ message: 'Already authenticated' });
        return;
      }

      if (!this.socket.connected) {
        this.socket.connect();
      }

      // Clean up any existing listeners first
      this.socket.off('authenticated');
      this.socket.off('auth_error');

      // Set up timeout for authentication
      const timeout = setTimeout(() => {
        this.socket?.off('authenticated', successHandler);
        this.socket?.off('auth_error', errorHandler);
        console.error('❌ Authentication timeout - no response from server');
        reject(new Error('Authentication timeout'));
      }, 15000); // Increased timeout

      const successHandler = (data: any) => {
        console.log('🔥 Received authenticated event:', data);
        clearTimeout(timeout);
        this.socket?.off('auth_error', errorHandler);
        this.isAuthenticated = true;
        console.log('✅ Authentication successful:', data);
        resolve(data);
      };

      const errorHandler = (error: any) => {
        console.log('🔥 Received auth_error event:', error);
        clearTimeout(timeout);
        this.socket?.off('authenticated', successHandler);
        this.isAuthenticated = false;
        console.error('❌ Authentication failed:', error);
        reject(error);
      };

      // Set up event listeners
      this.socket.once('authenticated', successHandler);
      this.socket.once('auth_error', errorHandler);

      console.log('🔐 Sending authentication request with token:', token ? 'present' : 'missing');
      console.log('🔌 Socket ID before auth:', this.socket.id);
      console.log('🔌 Socket connected:', this.socket.connected);
      this.socket.emit('authenticate', { token });
    });
  }

  // Chat room management
  joinChat(chatId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isAuthenticated) {
        reject(new Error('Socket not connected or not authenticated'));
        return;
      }

      // Set up timeout for the operation
      const timeout = setTimeout(() => {
        this.socket?.off('joined_chat', successHandler);
        this.socket?.off('error', errorHandler);
        reject(new Error('Join chat timeout'));
      }, 10000);

      const successHandler = (data: any) => {
        clearTimeout(timeout);
        this.socket?.off('error', errorHandler);
        console.log('✅ Successfully joined chat:', chatId);
        resolve(data);
      };

      const errorHandler = (error: any) => {
        clearTimeout(timeout);
        this.socket?.off('joined_chat', successHandler);
        console.error('❌ Error joining chat:', error);
        reject(error);
      };

      this.socket.once('joined_chat', successHandler);
      this.socket.once('error', errorHandler);
      
      console.log('🔄 Attempting to join chat:', chatId);
      this.socket.emit('join_chat', { chat_id: chatId });
    });
  }

  leaveChat(chatId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isAuthenticated) {
        reject(new Error('Socket not connected or not authenticated'));
        return;
      }

      this.socket.once('left_chat', resolve);
      this.socket.once('error', reject);
      
      this.socket.emit('leave_chat', { chat_id: chatId });
    });
  }

  // Messaging
  sendMessage(chatId: string, content: string, receiverId: string, receiverType: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isAuthenticated) {
        reject(new Error('Socket not connected or not authenticated'));
        return;
      }

      this.socket.once('message_sent', resolve);
      this.socket.once('error', reject);
      
      this.socket.emit('send_message', {
        chat_id: chatId,
        content,
        receiver_id: receiverId,
        receiver_type: receiverType
      });
    });
  }

  markAsRead(chatId: string): void {
    if (!this.socket || !this.isAuthenticated) return;
    
    this.socket.emit('mark_read', { chat_id: chatId });
  }

  // Event listeners
  onNewMessage(callback: (message: ChatMessage) => void) {
    if (!this.socket) return;
    this.socket.on('new_message', callback);
  }

  onMessageRead(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('messages_read', callback);
  }

  onUserTyping(callback: (data: { user_id: string; user_type: string; chat_id: string }) => void) {
    if (!this.socket) return;
    this.socket.on('user_typing', callback);
  }

  onUserStoppedTyping(callback: (data: { user_id: string; user_type: string; chat_id: string }) => void) {
    if (!this.socket) return;
    this.socket.on('user_stopped_typing', callback);
  }

  onUserOnline(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('user_online', callback);
  }

  onUserOffline(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('user_offline', callback);
  }

  // Typing indicators
  startTyping(chatId: string): void {
    if (!this.socket || !this.isAuthenticated) return;
    this.socket.emit('typing', { chat_id: chatId });
  }

  stopTyping(chatId: string): void {
    if (!this.socket || !this.isAuthenticated) return;
    this.socket.emit('stop_typing', { chat_id: chatId });
  }

  // Connection management
  connect(): void {
    if (this.socket) {
      this.socket.connect();
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.isAuthenticated = false;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Cleanup
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
