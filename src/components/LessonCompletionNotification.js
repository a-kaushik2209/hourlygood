import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLesson } from '../contexts/LessonContext';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const LessonCompletionNotification = () => {
  const { currentUser } = useAuth();
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check for newly completed lessons that need rating
  useEffect(() => {
    if (!currentUser) return;

    // Function to fetch lessons that need rating
    const fetchLessonsNeedingRating = async () => {
      try {
        // Query for lessons that are completed but not yet rated by the student
        const lessonsRef = collection(db, 'lessons');
        const q = query(
          lessonsRef,
          where('studentId', '==', currentUser.uid),
          where('status', '==', 'completed'),
          where('studentRated', '==', false)
        );

        const querySnapshot = await getDocs(q);
        const lessons = [];
        
        querySnapshot.forEach((doc) => {
          lessons.push({
            id: doc.id,
            ...doc.data()
          });
        });

        if (lessons.length > 0) {
          setCompletedLessons(lessons);
          setCurrentLesson(lessons[0]);
          setShowRatingModal(true);
        }
      } catch (error) {
        console.error('Error fetching lessons needing rating:', error);
      }
    };

    fetchLessonsNeedingRating();
  }, [currentUser]);

  // Handle submitting the rating
  const handleSubmitRating = async () => {
    if (!currentLesson) return;
    
    setSubmitting(true);
    
    try {
      // Update the lesson with the student's rating
      const lessonRef = doc(db, 'lessons', currentLesson.id);
      
      await updateDoc(lessonRef, {
        studentRating: rating,
        studentFeedback: feedback,
        studentRated: true
      });
      
      // If there are more lessons to rate, show the next one
      const remainingLessons = completedLessons.filter(lesson => lesson.id !== currentLesson.id);
      
      if (remainingLessons.length > 0) {
        setCurrentLesson(remainingLessons[0]);
        setCompletedLessons(remainingLessons);
        setRating(5);
        setFeedback('');
      } else {
        setShowRatingModal(false);
        setCurrentLesson(null);
        setCompletedLessons([]);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Skip rating this lesson
  const handleSkip = () => {
    const remainingLessons = completedLessons.filter(lesson => lesson.id !== currentLesson.id);
    
    if (remainingLessons.length > 0) {
      setCurrentLesson(remainingLessons[0]);
      setCompletedLessons(remainingLessons);
      setRating(5);
      setFeedback('');
    } else {
      setShowRatingModal(false);
      setCurrentLesson(null);
      setCompletedLessons([]);
    }
  };

  if (!showRatingModal || !currentLesson) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s'
    }}>
      <div style={{
        backgroundColor: '#1e1e1e',
        borderRadius: '12px',
        boxShadow: '0 5px 30px rgba(0, 0, 0, 0.5)',
        width: '90%',
        maxWidth: '500px',
        animation: 'scaleIn 0.3s',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5rem' }}>
            Rate Your Lesson
          </h2>
          <button 
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#aaa'
            }}
          >
            &times;
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            background: '#252525',
            borderRadius: '8px',
            padding: '15px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '15px',
              flexShrink: 0
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>
                Lesson Completed
              </div>
              <div style={{ color: '#aaa', fontSize: '14px' }}>
                {currentLesson.skillName} with {currentLesson.teacherName}
              </div>
            </div>
          </div>

          <p style={{ color: '#ddd', marginBottom: '20px' }}>
            How would you rate your experience with this tutor?
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '20px 0',
            gap: '10px'
          }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                onClick={() => setRating(star)}
                style={{
                  fontSize: '32px',
                  color: star <= rating ? 'var(--primary)' : '#555',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
              >
                ★
              </span>
            ))}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>
              Share your feedback (optional):
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What did you like about this lesson? What could be improved?"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: '#252525',
                border: '1px solid #444',
                color: '#fff',
                resize: 'vertical',
                minHeight: '100px'
              }}
            />
          </div>
        </div>

        <div style={{
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #333'
        }}>
          <button 
            onClick={handleSkip}
            style={{
              background: '#333',
              color: '#ddd',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            disabled={submitting}
          >
            Skip
          </button>
          <button 
            onClick={handleSubmitRating}
            style={{
              background: 'var(--primary)',
              color: 'black',
              border: 'none',
              padding: '10px 25px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 10px rgba(255, 143, 0, 0.3)'
            }}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonCompletionNotification;
