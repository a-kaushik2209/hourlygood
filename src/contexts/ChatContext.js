import React, { createContext, useContext, useState, useEffect } from 'react';
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
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

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

  // Send a message
  async function sendMessage(chatId, text) {
    try {
      setError('');
      
      // Add message to the messages collection
      await addDoc(collection(db, 'messages'), {
        chatId,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        text,
        createdAt: serverTimestamp()
      });
      
      // Update the last message in the chat document
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: text,
        lastMessageTime: serverTimestamp()
      });
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

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
      
      // Process each chat document
      for (const chatDoc of snapshot.docs) {
        const chatData = chatDoc.data();
        
        // Get the associated request
        try {
          const requestRef = doc(db, 'skillRequests', chatData.requestId);
          const requestSnap = await getDoc(requestRef);
          
          if (requestSnap.exists()) {
            const requestData = requestSnap.data();
            
            // Get other participant's info
            const otherParticipantId = chatData.participants.find(id => id !== currentUser.uid);
            let otherParticipant = { name: 'Unknown User' };
            
            if (otherParticipantId) {
              const userRef = doc(db, 'users', otherParticipantId);
              const userSnap = await getDoc(userRef);
              
              if (userSnap.exists()) {
                otherParticipant = userSnap.data();
              }
            }
            
            chatsList.push({
              id: chatDoc.id,
              ...chatData,
              request: {
                id: chatData.requestId,
                ...requestData
              },
              otherParticipant
            });
          }
        } catch (err) {
          console.error('Error fetching request for chat:', err);
        }
      }
      
      setChats(chatsList);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching chats:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => {
      unsubscribeChats();
    };
  }, [currentUser]);

  // Listen for messages in the active chat
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

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
  }, [activeChat]);

  const value = {
    chats,
    activeChat,
    setActiveChat,
    messages,
    sendMessage,
    getChatDetails,
    loading,
    error
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}
