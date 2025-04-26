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
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const LessonContext = createContext();

export function useLesson() {
  return useContext(LessonContext);
}

export function LessonProvider({ children }) {
  const { currentUser } = useAuth();
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeLessons, setActiveLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Schedule a new lesson
  async function scheduleLesson(lessonData) {
    try {
      setError('');
      const newLesson = {
        ...lessonData,
        studentId: currentUser.uid,
        studentName: currentUser.displayName,
        status: 'scheduled',
        createdAt: serverTimestamp(),
        scheduledDate: new Date(lessonData.date + 'T' + lessonData.time),
        isRealTime: true
      };
      
      const docRef = await addDoc(collection(db, 'lessons'), newLesson);
      return { id: docRef.id, ...newLesson };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Start a lesson (transition from scheduled to active)
  async function startLesson(lessonId) {
    try {
      setError('');
      const lessonRef = doc(db, 'lessons', lessonId);
      
      await updateDoc(lessonRef, {
        status: 'active',
        startedAt: serverTimestamp()
      });
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Complete a lesson
  async function completeLesson(lessonId, feedbackData) {
    try {
      setError('');
      const lessonRef = doc(db, 'lessons', lessonId);
      const lessonSnap = await getDoc(lessonRef);
      
      if (!lessonSnap.exists()) {
        throw new Error('Lesson not found');
      }
      
      const lessonData = lessonSnap.data();
      
      // Update the lesson status and add feedback
      await updateDoc(lessonRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        feedback: feedbackData.feedback,
        rating: feedbackData.rating,
        studentRated: false
      });
      
      // Award time credit to the teacher
      if (lessonData.teacherId) {
        const teacherRef = doc(db, 'users', lessonData.teacherId);
        await updateDoc(teacherRef, {
          timeCredits: increment(1)
        });
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Cancel a lesson
  async function cancelLesson(lessonId, reason) {
    try {
      setError('');
      const lessonRef = doc(db, 'lessons', lessonId);
      
      await updateDoc(lessonRef, {
        status: 'cancelled',
        cancelledAt: serverTimestamp(),
        cancellationReason: reason || 'No reason provided'
      });
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Get all lessons for a user (both as teacher and student)
  async function getAllUserLessons(userId) {
    try {
      setError('');
      
      // Get skill requests where user is a student
      const studentQuery = query(
        collection(db, 'skillRequests'),
        where('requesterId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      // Get skill requests where user is a teacher
      const teacherQuery = query(
        collection(db, 'skillRequests'),
        where('tutorId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      // Get all skill requests created by the user (including those without a tutor yet)
      const requestsQuery = query(
        collection(db, 'skillRequests'),
        where('requesterId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const studentSnapshot = await getDocs(studentQuery);
      const teacherSnapshot = await getDocs(teacherQuery);
      const requestsSnapshot = await getDocs(requestsQuery);
      
      const studentLessons = [];
      const teacherLessons = [];
      const userRequests = [];
      
      studentSnapshot.forEach(doc => {
        const data = doc.data();
        studentLessons.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
          acceptedAt: data.acceptedAt ? data.acceptedAt.toDate() : null,
          scheduledDate: data.scheduledDate ? data.scheduledDate.toDate() : null,
          role: 'student',
          isSkillRequest: true,
          displayStatus: data.status === 'accepted' ? 'Accepted' : 'Waiting for tutor'
        });
      });
      
      teacherSnapshot.forEach(doc => {
        const data = doc.data();
        teacherLessons.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
          acceptedAt: data.acceptedAt ? data.acceptedAt.toDate() : null,
          scheduledDate: data.scheduledDate ? data.scheduledDate.toDate() : null,
          role: 'teacher',
          isSkillRequest: true,
          displayStatus: data.status === 'accepted' ? 'Accepted' : 'Waiting for tutor'
        });
      });
      
      requestsSnapshot.forEach(doc => {
        const data = doc.data();
        userRequests.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
          acceptedAt: data.acceptedAt ? data.acceptedAt.toDate() : null,
          scheduledDate: data.scheduledDate ? data.scheduledDate.toDate() : null,
          role: 'student',
          isSkillRequest: true,
          displayStatus: data.status === 'accepted' ? 'Accepted' : 'Waiting for tutor'
        });
      });
      
      // Combine and sort by createdAt (newest first)
      // Include all requests in the history, not just accepted ones
      const allLessons = [...studentLessons, ...teacherLessons, ...userRequests].sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return b.createdAt - a.createdAt;
      });
      
      // Remove duplicates (a request might appear in both studentLessons and userRequests)
      const uniqueLessons = [];
      const seenIds = new Set();
      
      allLessons.forEach(lesson => {
        if (!seenIds.has(lesson.id)) {
          seenIds.add(lesson.id);
          uniqueLessons.push(lesson);
        }
      });
      
      return uniqueLessons;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Listen for lessons in real-time
  useEffect(() => {
    if (!currentUser) {
      setUpcomingLessons([]);
      setActiveLessons([]);
      setCompletedLessons([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Query for all skill requests (both open and accepted)
    const skillRequestsQuery = query(
      collection(db, 'skillRequests'),
      where('status', 'in', ['open', 'accepted'])
    );

    const unsubscribeSkillRequests = onSnapshot(skillRequestsQuery, (snapshot) => {
      const requests = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Only include requests where the current user is involved
        if (data.requesterId === currentUser.uid || data.tutorId === currentUser.uid) {
          requests.push({ 
            id: doc.id, 
            ...data,
            isSkillRequest: true,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
            acceptedAt: data.acceptedAt ? data.acceptedAt.toDate() : null,
            role: data.requesterId === currentUser.uid ? 'student' : 'teacher',
            // Add display status for UI
            displayStatus: data.status === 'accepted' ? 'Accepted' : 'Waiting for tutor'
          });
        }
      });
      
      // Update upcoming lessons with skill requests
      setUpcomingLessons(prevLessons => {
        // Filter out any existing skill requests to avoid duplicates
        const filteredLessons = prevLessons.filter(lesson => !lesson.isSkillRequest);
        return [...filteredLessons, ...requests];
      });
      
      setLoading(false);
    }, (err) => {
      console.error('Error fetching skill requests:', err);
      setError(err.message);
      setLoading(false);
    });

    // Query for upcoming lessons (where user is student or teacher)
    const upcomingQuery = query(
      collection(db, 'lessons'),
      where('status', 'in', ['scheduled', 'confirmed']),
      orderBy('scheduledDate', 'asc')
    );

    const unsubscribeUpcoming = onSnapshot(upcomingQuery, (snapshot) => {
      const lessons = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Only include lessons where the current user is involved
        if (data.studentId === currentUser.uid || data.teacherId === currentUser.uid) {
          lessons.push({ 
            id: doc.id, 
            ...data,
            scheduledDate: data.scheduledDate ? data.scheduledDate.toDate() : null,
            role: data.studentId === currentUser.uid ? 'student' : 'teacher'
          });
        }
      });
      
      // Combine with any skill requests that are already in the state
      setUpcomingLessons(prevLessons => {
        // Keep only the skill requests
        const skillRequests = prevLessons.filter(lesson => lesson.isSkillRequest);
        return [...skillRequests, ...lessons];
      });
      
      setLoading(false);
    }, (err) => {
      console.error('Error fetching upcoming lessons:', err);
      setError(err.message);
      setLoading(false);
    });

    // Query for active lessons
    const activeQuery = query(
      collection(db, 'lessons'),
      where('status', '==', 'active')
    );

    const unsubscribeActive = onSnapshot(activeQuery, (snapshot) => {
      const lessons = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Only include lessons where the current user is involved
        if (data.studentId === currentUser.uid || data.teacherId === currentUser.uid) {
          lessons.push({ 
            id: doc.id, 
            ...data,
            scheduledDate: data.scheduledDate ? data.scheduledDate.toDate() : null,
            startedAt: data.startedAt ? data.startedAt.toDate() : null,
            role: data.studentId === currentUser.uid ? 'student' : 'teacher'
          });
        }
      });
      setActiveLessons(lessons);
    });

    // Query for completed lessons
    const completedQuery = query(
      collection(db, 'lessons'),
      where('status', 'in', ['completed', 'cancelled']),
      orderBy('completedAt', 'desc')
    );

    const unsubscribeCompleted = onSnapshot(completedQuery, (snapshot) => {
      const lessons = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Only include lessons where the current user is involved
        if (data.studentId === currentUser.uid || data.teacherId === currentUser.uid) {
          lessons.push({ 
            id: doc.id, 
            ...data,
            scheduledDate: data.scheduledDate ? data.scheduledDate.toDate() : null,
            completedAt: data.completedAt ? data.completedAt.toDate() : null,
            cancelledAt: data.cancelledAt ? data.cancelledAt.toDate() : null,
            role: data.studentId === currentUser.uid ? 'student' : 'teacher'
          });
        }
      });
      setCompletedLessons(lessons);
    });

    return () => {
      unsubscribeSkillRequests();
      unsubscribeUpcoming();
      unsubscribeActive();
      unsubscribeCompleted();
    };
  }, [currentUser]);

  const value = {
    upcomingLessons,
    completedLessons,
    activeLessons,
    scheduleLesson,
    startLesson,
    completeLesson,
    cancelLesson,
    getAllUserLessons,
    loading,
    error
  };

  return (
    <LessonContext.Provider value={{
      upcomingLessons,
      completedLessons,
      activeLessons,
      scheduleLesson,
      startLesson,
      completeLesson,
      cancelLesson,
      getAllUserLessons,
      loading,
      error
    }}>
      {children}
    </LessonContext.Provider>
  );
}
