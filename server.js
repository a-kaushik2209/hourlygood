const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const admin = require('firebase-admin');
const path = require('path');
const cors = require('cors');

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
} catch (error) {
  console.log('Firebase admin initialization error (development mode):', error.message);
  // In development, we'll continue without Firebase Admin authentication
}

const app = express();
app.use(cors());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Store active users
const activeUsers = new Set();

// Middleware to authenticate users (disabled in development for easier testing)
const authenticateSocket = async (socket, next) => {
  try {
    // Skip authentication in development
    if (process.env.NODE_ENV !== 'production') {
      socket.userId = socket.handshake.auth.userId || 'dev-user';
      return next();
    }
    
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    socket.userId = decodedToken.uid;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication error: Invalid token'));
  }
};

// Apply middleware in production
if (process.env.NODE_ENV === 'production') {
  io.use(authenticateSocket);
}

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Handle authentication event (for development mode)
  socket.on('authenticate', async (data) => {
    try {
      if (process.env.NODE_ENV !== 'production') {
        // In development, just use the user ID from the client
        socket.userId = data.userId || 'dev-user';
        console.log('User authenticated (dev mode):', socket.userId);
      } else {
        // In production, verify the token
        const decodedToken = await admin.auth().verifyIdToken(data.token);
        socket.userId = decodedToken.uid;
        console.log('User authenticated:', socket.userId);
      }
      
      // Add user to active users
      activeUsers.add(socket.userId);
      
      // Broadcast updated active users list
      io.emit('active_users', Array.from(activeUsers));
      
      // Notify others that this user is online
      socket.broadcast.emit('user_status_change', {
        userId: socket.userId,
        status: 'online'
      });
    } catch (error) {
      console.error('Authentication error:', error);
    }
  });
  
  // Handle joining a chat room
  socket.on('join_room', ({ chatId }) => {
    if (!chatId) return;
    
    console.log(`User ${socket.userId} joined room: ${chatId}`);
    socket.join(chatId);
  });
  
  // Handle leaving a chat room
  socket.on('leave_room', ({ chatId }) => {
    if (!chatId) return;
    
    console.log(`User ${socket.userId} left room: ${chatId}`);
    socket.leave(chatId);
  });
  
  // Handle sending a message
  socket.on('send_message', ({ chatId, text }) => {
    if (!chatId || !text) return;
    
    const message = {
      id: Date.now().toString(),
      chatId,
      senderId: socket.userId,
      text,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    // Send to everyone in the room except the sender
    socket.to(chatId).emit('new_message', message);
    
    // Send notification to everyone in the room except the sender
    socket.to(chatId).emit('message_notification', {
      chatId,
      messageId: message.id,
      senderId: socket.userId
    });
  });
  
  // Handle marking messages as read
  socket.on('mark_read', ({ chatId, messageIds }) => {
    if (!chatId || !messageIds || !messageIds.length) return;
    
    // Notify others in the room that messages have been read
    socket.to(chatId).emit('messages_read', {
      chatId,
      messageIds,
      readBy: socket.userId
    });
  });
  
  // Handle typing indicator
  socket.on('typing', ({ chatId }) => {
    if (!chatId) return;
    
    socket.to(chatId).emit('user_typing', {
      chatId,
      userId: socket.userId
    });
  });
  
  // Handle stop typing indicator
  socket.on('stop_typing', ({ chatId }) => {
    if (!chatId) return;
    
    socket.to(chatId).emit('user_stop_typing', {
      chatId,
      userId: socket.userId
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    if (socket.userId) {
      // Remove user from active users
      activeUsers.delete(socket.userId);
      
      // Broadcast updated active users list
      io.emit('active_users', Array.from(activeUsers));
      
      // Notify others that this user is offline
      socket.broadcast.emit('user_status_change', {
        userId: socket.userId,
        status: 'offline'
      });
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
