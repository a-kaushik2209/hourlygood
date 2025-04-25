import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where,
  onSnapshot,
  serverTimestamp,
  getDoc,
  increment
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const SkillContext = createContext();

export function useSkill() {
  return useContext(SkillContext);
}

export function SkillProvider({ children }) {
  const { currentUser } = useAuth();
  const [skillRequests, setSkillRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [myLessons, setMyLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create a new skill request
  async function createSkillRequest(requestData) {
    try {
      setError('');
      const newRequest = {
        ...requestData,
        requesterId: currentUser.uid,
        requesterName: currentUser.displayName,
        status: 'open',
        createdAt: serverTimestamp(),
        tutorId: null,
        tutorName: null
      };
      
      const docRef = await addDoc(collection(db, 'skillRequests'), newRequest);
      return { id: docRef.id, ...newRequest };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Take a skill lesson request (become the tutor)
  async function takeLesson(requestId) {
    try {
      setError('');
      const requestRef = doc(db, 'skillRequests', requestId);
      
      // Update the request with tutor info
      await updateDoc(requestRef, {
        tutorId: currentUser.uid,
        tutorName: currentUser.displayName,
        status: 'accepted',
        acceptedAt: serverTimestamp()
      });
      
      // Create a chat room for this lesson
      const chatRef = await addDoc(collection(db, 'chats'), {
        requestId: requestId,
        participants: [currentUser.uid],
        lastMessage: 'Chat started',
        lastMessageTime: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      
      return chatRef.id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Mark a lesson as complete
  async function completeLesson(requestId) {
    try {
      setError('');
      const requestRef = doc(db, 'skillRequests', requestId);
      const requestSnap = await getDoc(requestRef);
      
      if (!requestSnap.exists()) {
        throw new Error('Request not found');
      }
      
      const requestData = requestSnap.data();
      
      // Update the request status
      await updateDoc(requestRef, {
        status: 'completed',
        completedAt: serverTimestamp()
      });
      
      // Award time credit to the tutor
      const tutorRef = doc(db, 'users', requestData.tutorId);
      await updateDoc(tutorRef, {
        timeCredits: increment(1)
      });
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Add a skill to user profile
  async function addSkill(skillData) {
    try {
      setError('');
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userSnap.data();
      const skills = userData.skills || [];
      
      // Add the new skill
      await updateDoc(userRef, {
        skills: [...skills, { ...skillData, id: Date.now().toString() }]
      });
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Update user bio
  async function updateBio(bio) {
    try {
      setError('');
      const userRef = doc(db, 'users', currentUser.uid);
      
      await updateDoc(userRef, { bio });
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Listen for skill requests in real-time
  useEffect(() => {
    if (!currentUser) {
      setSkillRequests([]);
      setMyRequests([]);
      setMyLessons([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Listen for all open skill requests
    const requestsQuery = query(
      collection(db, 'skillRequests'),
      where('status', '==', 'open')
    );

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requests = [];
      snapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      setSkillRequests(requests);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching skill requests:', err);
      setError(err.message);
      setLoading(false);
    });

    // Listen for my requests
    const myRequestsQuery = query(
      collection(db, 'skillRequests'),
      where('requesterId', '==', currentUser.uid)
    );

    const unsubscribeMyRequests = onSnapshot(myRequestsQuery, (snapshot) => {
      const requests = [];
      snapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      setMyRequests(requests);
    });

    // Listen for lessons I'm teaching
    const myLessonsQuery = query(
      collection(db, 'skillRequests'),
      where('tutorId', '==', currentUser.uid)
    );

    const unsubscribeMyLessons = onSnapshot(myLessonsQuery, (snapshot) => {
      const lessons = [];
      snapshot.forEach((doc) => {
        lessons.push({ id: doc.id, ...doc.data() });
      });
      setMyLessons(lessons);
    });

    return () => {
      unsubscribeRequests();
      unsubscribeMyRequests();
      unsubscribeMyLessons();
    };
  }, [currentUser]);

  const value = {
    skillRequests,
    myRequests,
    myLessons,
    createSkillRequest,
    takeLesson,
    completeLesson,
    addSkill,
    updateBio,
    loading,
    error
  };

  return (
    <SkillContext.Provider value={value}>
      {children}
    </SkillContext.Provider>
  );
}
