import { io } from 'socket.io-client';
import { getAuth } from 'firebase/auth';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.callbacks = {
      newMessage: [],
      messageNotification: [],
      messagesRead: [],
      userTyping: [],
      userStopTyping: [],
      userStatusChange: [],
      activeUsers: []
    };
  }

  async initializeSocket() {
    if (this.socket) return;

    try {
      // Connect to local socket server in development, or deployed server in production
      const socketUrl = process.env.NODE_ENV === 'production' 
        ? window.location.origin
        : 'http://localhost:3001';
      
      this.socket = io(socketUrl, {
        autoConnect: false,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
        this.isConnected = false;
      });

      this.socket.on('new_message', (message) => {
        this.callbacks.newMessage.forEach(cb => cb(message));
      });

      this.socket.on('message_notification', (notification) => {
        this.callbacks.messageNotification.forEach(cb => cb(notification));
      });

      this.socket.on('messages_read', (data) => {
        this.callbacks.messagesRead.forEach(cb => cb(data));
      });

      this.socket.on('user_typing', (data) => {
        this.callbacks.userTyping.forEach(cb => cb(data));
      });

      this.socket.on('user_stop_typing', (data) => {
        this.callbacks.userStopTyping.forEach(cb => cb(data));
      });

      this.socket.on('user_status_change', (data) => {
        this.callbacks.userStatusChange.forEach(cb => cb(data));
      });

      this.socket.on('active_users', (users) => {
        this.callbacks.activeUsers.forEach(cb => cb(users));
      });

      this.socket.connect();
      return true;
    } catch (error) {
      console.error('Socket initialization error:', error);
      return false;
    }
  }

  async authenticateSocket() {
    if (!this.socket || !this.isConnected) return false;

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return false;

      const token = await user.getIdToken();
      this.socket.emit('authenticate', { token });
      return true;
    } catch (error) {
      console.error('Socket authentication error:', error);
      return false;
    }
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinChatRoom(chatId) {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit('join_room', { chatId });
  }

  leaveChatRoom(chatId) {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit('leave_room', { chatId });
  }

  sendSocketMessage(chatId, text) {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit('send_message', { chatId, text });
  }

  markMessagesRead(chatId, messageIds) {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit('mark_read', { chatId, messageIds });
  }

  sendTypingIndicator(chatId) {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit('typing', { chatId });
  }

  sendStopTypingIndicator(chatId) {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit('stop_typing', { chatId });
  }

  // Event listeners
  onNewMessage(callback) {
    this.callbacks.newMessage.push(callback);
    return () => {
      this.callbacks.newMessage = this.callbacks.newMessage.filter(cb => cb !== callback);
    };
  }

  onMessageNotification(callback) {
    this.callbacks.messageNotification.push(callback);
    return () => {
      this.callbacks.messageNotification = this.callbacks.messageNotification.filter(cb => cb !== callback);
    };
  }

  onMessagesRead(callback) {
    this.callbacks.messagesRead.push(callback);
    return () => {
      this.callbacks.messagesRead = this.callbacks.messagesRead.filter(cb => cb !== callback);
    };
  }

  onUserTyping(callback) {
    this.callbacks.userTyping.push(callback);
    return () => {
      this.callbacks.userTyping = this.callbacks.userTyping.filter(cb => cb !== callback);
    };
  }

  onUserStopTyping(callback) {
    this.callbacks.userStopTyping.push(callback);
    return () => {
      this.callbacks.userStopTyping = this.callbacks.userStopTyping.filter(cb => cb !== callback);
    };
  }

  onUserStatusChange(callback) {
    this.callbacks.userStatusChange.push(callback);
    return () => {
      this.callbacks.userStatusChange = this.callbacks.userStatusChange.filter(cb => cb !== callback);
    };
  }

  onActiveUsers(callback) {
    this.callbacks.activeUsers.push(callback);
    return () => {
      this.callbacks.activeUsers = this.callbacks.activeUsers.filter(cb => cb !== callback);
    };
  }
}

const socketService = new SocketService();
export default socketService;
