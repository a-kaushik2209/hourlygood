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
        rating: feedbackData.rating
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

  // Listen for lessons in real-time
  useEffect(() => {
    if (!currentUser) {
      setUpcomingLessons([]);
      setCompletedLessons([]);
      setActiveLessons([]);
      setLoading(false);
      return;
    }

    setLoading(true);

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
      setUpcomingLessons(lessons);
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
    loading,
    error
  };

  return (
    <LessonContext.Provider value={value}>
      {children}
    </LessonContext.Provider>
  );
}
