import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
  setDoc,
  arrayUnion,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import socketService from '../services/socketService';

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    const initSocket = async () => {
      try {
        await socketService.initializeSocket();
        await socketService.authenticateSocket();
      } catch (err) {
        console.error('Socket initialization error:', err);
      }
    };

    initSocket();

    return () => {
      socketService.disconnectSocket();
    };
  }, [currentUser]);

  // Listen for socket events
  useEffect(() => {
    if (!currentUser) return;

    // Set up socket event listeners
    const newMessageUnsub = socketService.onNewMessage((message) => {
      if (message.chatId === activeChat) {
        // If we're in the active chat, add the message to the messages list
        setMessages(prev => [...prev, {
          ...message,
          createdAt: new Date(message.createdAt)
        }]);
        
        // Mark the message as read immediately
        socketService.markMessagesRead(message.chatId, [message.id]);
      }
    });

    const messageNotificationUnsub = socketService.onMessageNotification((notification) => {
      // Update unread counts for the chat
      setUnreadCounts(prev => ({
        ...prev,
        [notification.chatId]: (prev[notification.chatId] || 0) + 1
      }));
    });

    const messagesReadUnsub = socketService.onMessagesRead(({ chatId, readBy }) => {
      // Update read status of messages
      if (chatId === activeChat && currentUser.uid !== readBy) {
        setMessages(prev => prev.map(msg => 
          msg.senderId === currentUser.uid ? { ...msg, read: true } : msg
        ));
      }
    });

    const userTypingUnsub = socketService.onUserTyping(({ chatId, userId }) => {
      if (chatId === activeChat && userId !== currentUser.uid) {
        setTypingUsers(prev => ({
          ...prev,
          [userId]: true
        }));
      }
    });

    const userStopTypingUnsub = socketService.onUserStopTyping(({ chatId, userId }) => {
      if (chatId === activeChat && userId !== currentUser.uid) {
        setTypingUsers(prev => {
          const newState = { ...prev };
          delete newState[userId];
          return newState;
        });
      }
    });

    const userStatusUnsub = socketService.onUserStatusChange(({ userId, status }) => {
      if (status === 'online') {
        setOnlineUsers(prev => [...prev, userId]);
      } else {
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      }
    });

    const activeUsersUnsub = socketService.onActiveUsers((users) => {
      setOnlineUsers(users);
    });

    return () => {
      newMessageUnsub();
      messageNotificationUnsub();
      messagesReadUnsub();
      userTypingUnsub();
      userStopTypingUnsub();
      userStatusUnsub();
      activeUsersUnsub();
    };
  }, [currentUser, activeChat]);

  // Join chat room when active chat changes
  useEffect(() => {
    if (!activeChat || !currentUser) return;

    // Join the chat room
    socketService.joinChatRoom(activeChat);

    return () => {
      // Leave the chat room when component unmounts or active chat changes
      socketService.leaveChatRoom(activeChat);
    };
  }, [activeChat, currentUser]);

  // Create a new chat with a user
  async function createChat(recipientId) {
    try {
      setError('');
      
      if (!currentUser || !recipientId) {
        throw new Error('User not authenticated or recipient not specified');
      }
      
      // Check if chat already exists
      const existingChat = chats.find(chat => 
        chat.participants.includes(recipientId) && chat.participants.includes(currentUser.uid)
      );
      
      if (existingChat) {
        setActiveChat(existingChat.id);
        return existingChat.id;
      }
      
      // Get recipient details
      const recipientRef = doc(db, 'users', recipientId);
      const recipientSnap = await getDoc(recipientRef);
      
      let recipientName = recipientId;
      let recipientData = {};
      if (recipientSnap.exists()) {
        recipientData = recipientSnap.data();
        recipientName = recipientData.name || recipientData.displayName || recipientData.email || recipientId;
      }
      
      // Get current user details
      const currentUserRef = doc(db, 'users', currentUser.uid);
      const currentUserSnap = await getDoc(currentUserRef);
      let currentUserName = currentUser.displayName || currentUser.email || currentUser.uid;
      if (currentUserSnap.exists()) {
        const userData = currentUserSnap.data();
        currentUserName = userData.name || userData.displayName || userData.email || currentUser.uid;
      }
      
      // Create new chat
      const newChat = {
        participants: [currentUser.uid, recipientId],
        participantNames: {
          [currentUser.uid]: currentUserName,
          [recipientId]: recipientName
        },
        createdAt: serverTimestamp(),
        lastMessage: 'Chat started',
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: currentUser.uid,
        unreadBy: [recipientId] // Mark as unread for the recipient
      };
      
      const chatRef = await addDoc(collection(db, 'chats'), newChat);
      
      // Add initial system message
      await addDoc(collection(db, 'messages'), {
        chatId: chatRef.id,
        senderId: 'system',
        senderName: 'System',
        text: `Chat started between ${currentUserName} and ${recipientName}`,
        createdAt: serverTimestamp(),
        read: false
      });
      
      setActiveChat(chatRef.id);
      
      return chatRef.id;
    } catch (err) {
      console.error('Error creating chat:', err);
      setError(err.message);
      throw err;
    }
  }

  // Send a message
  const sendMessage = useCallback(async (chatId, text) => {
    try {
      setError('');
      
      if (!currentUser || !chatId || !text.trim()) {
        throw new Error('Missing required information to send message');
      }
      
      // Get chat details to update unreadBy
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (!chatSnap.exists()) {
        throw new Error('Chat not found');
      }
      
      const chatData = chatSnap.data();
      
      // Find the other participant(s) to mark as unread for
      const unreadBy = chatData.participants.filter(id => id !== currentUser.uid);
      
      // Add message to the messages collection
      const messageRef = await addDoc(collection(db, 'messages'), {
        chatId,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        text,
        createdAt: serverTimestamp(),
        read: false
      });
      
      // Update the last message in the chat document
      await updateDoc(chatRef, {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: currentUser.uid
      });

      // Send the message via socket for real-time updates
      socketService.sendSocketMessage(chatId, text);
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [currentUser]);

  // Mark messages as read
  const markChatAsRead = useCallback(async (chatId) => {
    try {
      if (!currentUser || !chatId) return;
      
      // Update the chat to remove current user from unreadBy
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (!chatSnap.exists()) return;
      
      const chatData = chatSnap.data();
      
      if (chatData.unreadBy && chatData.unreadBy.includes(currentUser.uid)) {
        // Remove current user from unreadBy array
        const updatedUnreadBy = chatData.unreadBy.filter(id => id !== currentUser.uid);
        
        await updateDoc(chatRef, {
          unreadBy: updatedUnreadBy
        });
      }
      
      // Mark all messages as read
      const messagesQuery = query(
        collection(db, 'messages'),
        where('chatId', '==', chatId),
        where('senderId', '!=', currentUser.uid),
        where('read', '==', false)
      );
      
      const unreadMessages = await getDocs(messagesQuery);
      
      const updatePromises = unreadMessages.docs.map(doc => 
        updateDoc(doc.ref, { read: true })
      );
      
      await Promise.all(updatePromises);

      // Notify via socket that messages have been read
      const messageIds = unreadMessages.docs.map(doc => doc.id);
      if (messageIds.length > 0) {
        socketService.markMessagesRead(chatId, messageIds);
      }
      
      // Update local unread counts
      setUnreadCounts(prev => ({
        ...prev,
        [chatId]: 0
      }));
      
      return true;
    } catch (err) {
      console.error('Error marking chat as read:', err);
      return false;
    }
  }, [currentUser]);

  // Send typing indicator
  const sendTypingIndicator = useCallback((chatId) => {
    socketService.sendTypingIndicator(chatId);
  }, []);

  // Send stop typing indicator
  const sendStopTypingIndicator = useCallback((chatId) => {
    socketService.sendStopTypingIndicator(chatId);
  }, []);

  // Get chat details including the related skill request
  async function getChatDetails(chatId) {
    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (!chatSnap.exists()) {
        throw new Error('Chat not found');
      }
      
      const chatData = chatSnap.data();
      
      // Get the associated skill request
      const requestRef = doc(db, 'skillRequests', chatData.requestId);
      const requestSnap = await getDoc(requestRef);
      
      if (!requestSnap.exists()) {
        throw new Error('Associated request not found');
      }
      
      return {
        ...chatData,
        id: chatId,
        request: {
          id: chatData.requestId,
          ...requestSnap.data()
        }
      };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Get chat details with other participant info
  const getChatWithParticipantDetails = useCallback(async (chat) => {
    if (!currentUser) return null;
    
    try {
      const otherParticipantId = chat.participants.find(id => id !== currentUser.uid);
      
      if (!otherParticipantId) {
        return {
          ...chat,
          otherParticipant: { id: null, name: 'Unknown User' },
          isUnread: false
        };
      }
      
      // Get other participant details
      const userRef = doc(db, 'users', otherParticipantId);
      const userSnap = await getDoc(userRef);
      
      let otherParticipant = { id: otherParticipantId, name: otherParticipantId };
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        otherParticipant = {
          id: otherParticipantId,
          name: userData.name || userData.displayName || userData.email || otherParticipantId,
          photoURL: userData.photoURL || null
        };
      }
      
      // Check if chat is unread
      const isUnread = chat.lastMessageSenderId !== currentUser.uid && 
                      (!chat.readBy || !chat.readBy.includes(currentUser.uid));
      
      // Check if other user is online
      const isOnline = onlineUsers.includes(otherParticipantId);
      
      return {
        ...chat,
        otherParticipant,
        isUnread,
        isOnline
      };
    } catch (err) {
      console.error('Error getting chat details:', err);
      return {
        ...chat,
        otherParticipant: { id: otherParticipantId, name: otherParticipantId },
        isUnread: false,
        isOnline: false
      };
    }
  }, [currentUser, onlineUsers]);

  // Listen for user's chats in real-time
  useEffect(() => {
    if (!currentUser) {
      setChats([]);
      setMessages([]);
      setActiveChat(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Query chats where the current user is a participant
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribeChats = onSnapshot(chatsQuery, async (snapshot) => {
      const chatsList = [];
      const unreadCountsObj = {};
      
      // Process each chat document
      for (const chatDoc of snapshot.docs) {
        const chatData = {
          id: chatDoc.id,
          ...chatDoc.data(),
          createdAt: chatDoc.data().createdAt?.toDate(),
          lastMessageTime: chatDoc.data().lastMessageTime?.toDate()
        };
        
        // Get chat details with other participant info
        const chatWithParticipant = await getChatWithParticipantDetails(chatData);
        
        // Get unread message count
        const unreadQuery = query(
          collection(db, 'messages'),
          where('chatId', '==', chatDoc.id),
          where('senderId', '!=', currentUser.uid),
          where('read', '==', false)
        );
        
        const unreadSnap = await getDocs(unreadQuery);
        unreadCountsObj[chatDoc.id] = unreadSnap.size;
        
        chatsList.push(chatWithParticipant);
      }
      
      setChats(chatsList);
      setUnreadCounts(unreadCountsObj);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching chats:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => {
      unsubscribeChats();
    };
  }, [currentUser, onlineUsers, getChatWithParticipantDetails]);

  // Listen for messages in the active chat
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

    // Mark chat as read when it becomes active
    markChatAsRead(activeChat);

    // Query messages for the active chat
    const messagesQuery = query(
      collection(db, 'messages'),
      where('chatId', '==', activeChat),
      orderBy('createdAt', 'asc')
    );

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const messagesList = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messagesList.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
        });
      });
      setMessages(messagesList);
    }, (err) => {
      console.error('Error fetching messages:', err);
      setError(err.message);
    });

    return () => {
      unsubscribeMessages();
    };
  }, [activeChat, markChatAsRead]);

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      setActiveChat,
      messages,
      sendMessage,
      createChat,
      markChatAsRead,
      unreadCounts,
      typingUsers,
      onlineUsers,
      sendTypingIndicator,
      sendStopTypingIndicator,
      loading,
      error
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export default ChatContext;
