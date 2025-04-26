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
  increment,
  arrayUnion
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
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
  const [ratings, setRatings] = useState({});

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
      
      // Get the request data first
      const requestSnap = await getDoc(requestRef);
      if (!requestSnap.exists()) {
        throw new Error('Request not found');
      }
      
      const requestData = requestSnap.data();
      const requesterId = requestData.requesterId;
      
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
        participants: [currentUser.uid, requesterId],
        participantNames: {
          [currentUser.uid]: currentUser.displayName || currentUser.email || currentUser.uid,
          [requesterId]: requestData.requesterName || 'Student'
        },
        lastMessage: 'Chat started',
        lastMessageTime: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      
      // Add a welcome message to the chat
      await addDoc(collection(db, 'messages'), {
        chatId: chatRef.id,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        text: `Hello! I've accepted your request for ${requestData.skillName} lessons. When would you like to schedule our first session?`,
        createdAt: serverTimestamp(),
        read: false
      });
      
      return chatRef.id;
    } catch (err) {
      console.error('Error taking lesson:', err);
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

  // Rate a completed lesson
  async function rateLesson(requestId, rating, feedback) {
    try {
      setError('');
      
      if (!currentUser) {
        throw new Error('You must be logged in to rate a lesson');
      }
      
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
      
      const requestRef = doc(db, 'skillRequests', requestId);
      const requestSnap = await getDoc(requestRef);
      
      if (!requestSnap.exists()) {
        throw new Error('Lesson not found');
      }
      
      const requestData = requestSnap.data();
      
      // Verify that the current user is the requester
      if (requestData.requesterId !== currentUser.uid) {
        throw new Error('Only the person who requested the lesson can rate it');
      }
      
      // Verify that the lesson is completed
      if (requestData.status !== 'completed') {
        throw new Error('Only completed lessons can be rated');
      }
      
      // Check if the lesson has already been rated
      if (requestData.rating) {
        throw new Error('This lesson has already been rated');
      }
      
      // Update the request with the rating
      await updateDoc(requestRef, {
        rating: rating,
        feedback: feedback || '',
        ratedAt: serverTimestamp()
      });
      
      // Update the tutor's average rating
      const tutorRef = doc(db, 'users', requestData.tutorId);
      const tutorSnap = await getDoc(tutorRef);
      
      if (tutorSnap.exists()) {
        const tutorData = tutorSnap.data();
        const totalRatings = tutorData.totalRatings || 0;
        const ratingSum = tutorData.ratingSum || 0;
        
        // Calculate new average
        const newTotalRatings = totalRatings + 1;
        const newRatingSum = ratingSum + rating;
        const newAverageRating = newRatingSum / newTotalRatings;
        
        // Update tutor profile
        await updateDoc(tutorRef, {
          totalRatings: newTotalRatings,
          ratingSum: newRatingSum,
          averageRating: newAverageRating,
          ratings: arrayUnion({
            requestId: requestId,
            rating: rating,
            feedback: feedback || '',
            ratedAt: new Date().toISOString(),
            skillName: requestData.skillName
          })
        });
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Upload skill proof (PDF or JPG)
  async function uploadSkillProof(file, skillName) {
    try {
      setError('');
      
      if (!currentUser) {
        throw new Error('You must be logged in to upload skill proof');
      }
      
      if (!file) {
        throw new Error('No file selected');
      }
      
      // Check file type
      const fileType = file.type;
      if (fileType !== 'application/pdf' && !fileType.startsWith('image/jpeg') && !fileType.startsWith('image/jpg')) {
        throw new Error('Only PDF and JPG files are allowed');
      }
      
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }
      
      // Create a reference to the file in Firebase Storage
      const fileExtension = fileType === 'application/pdf' ? 'pdf' : 'jpg';
      const fileName = `skill_proofs/${currentUser.uid}/${skillName.replace(/\s+/g, '_')}_${Date.now()}.${fileExtension}`;
      const fileRef = ref(storage, fileName);
      
      // Upload the file
      await uploadBytes(fileRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(fileRef);
      
      // Add the proof to the user's profile
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userSnap.data();
      const skillProofs = userData.skillProofs || [];
      
      // Add the new proof
      await updateDoc(userRef, {
        skillProofs: [...skillProofs, {
          id: Date.now().toString(),
          skillName: skillName,
          fileURL: downloadURL,
          fileType: fileType,
          uploadedAt: new Date().toISOString()
        }]
      });
      
      return downloadURL;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Add a skill to user profile
  async function addSkill(skillData, proofFile = null) {
    try {
      setError('');
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userSnap.data();
      const skills = userData.skills || [];
      
      // Upload proof file if provided
      let proofURL = null;
      if (proofFile) {
        proofURL = await uploadSkillProof(proofFile, skillData.name);
      }
      
      const newSkill = {
        ...skillData,
        id: Date.now().toString(),
        proofURL: proofURL
      };
      
      // Add the new skill
      await updateDoc(userRef, {
        skills: [...skills, newSkill]
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

  // Get user ratings
  async function getUserRatings(userId) {
    try {
      setError('');
      
      // Check if we already have the ratings cached
      if (ratings[userId]) {
        return ratings[userId];
      }
      
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      // If user doesn't exist yet, return default empty ratings
      // This is common for new signups
      if (!userSnap.exists()) {
        const defaultRatings = {
          averageRating: 0,
          totalRatings: 0,
          ratings: []
        };
        
        // Cache the default ratings
        setRatings(prev => ({
          ...prev,
          [userId]: defaultRatings
        }));
        
        return defaultRatings;
      }
      
      const userData = userSnap.data();
      const userRatings = {
        averageRating: userData.averageRating || 0,
        totalRatings: userData.totalRatings || 0,
        ratings: userData.ratings || []
      };
      
      // Cache the ratings
      setRatings(prev => ({
        ...prev,
        [userId]: userRatings
      }));
      
      return userRatings;
    } catch (err) {
      console.error('Error getting user ratings:', err);
      setError(err.message);
      
      // Return default ratings even on error
      const defaultRatings = {
        averageRating: 0,
        totalRatings: 0,
        ratings: []
      };
      return defaultRatings;
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
    rateLesson,
    addSkill,
    updateBio,
    uploadSkillProof,
    getUserRatings,
    ratings,
    loading,
    error
  };

  return (
    <SkillContext.Provider value={value}>
      {children}
    </SkillContext.Provider>
  );
}
