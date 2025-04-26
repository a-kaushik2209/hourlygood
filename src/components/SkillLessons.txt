import React, { useState, useEffect } from 'react';
import { useLesson } from '../contexts/LessonContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

function SkillLessons({ setPage }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { 
    upcomingLessons, 
    completedLessons, 
    activeLessons,
    startLesson,
    completeLesson,
    cancelLesson,
    loading 
  } = useLesson();
  const { currentUser } = useAuth();
  const [feedbackData, setFeedbackData] = useState({ lessonId: null, rating: 5, feedback: '' });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [cancelData, setCancelData] = useState({ lessonId: null, reason: '' });
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Handle opening chat with partner
  const handleMessage = (partnerId) => {
    console.log(`Opening chat with partner ID: ${partnerId}`);
    setPage('chat');
  };
  
  // Handle starting a lesson
  const handleStart = async (lessonId) => {
    try {
      await startLesson(lessonId);
      console.log(`Lesson ${lessonId} started successfully`);
    } catch (error) {
      console.error('Error starting lesson:', error);
    }
  };
  
  // Open feedback modal for completing a lesson
  const openFeedbackModal = (lessonId) => {
    setFeedbackData({ lessonId, rating: 5, feedback: '' });
    setShowFeedbackModal(true);
  };
  
  // Handle submitting lesson feedback and completing the lesson
  const handleSubmitFeedback = async () => {
    try {
      await completeLesson(feedbackData.lessonId, {
        rating: feedbackData.rating,
        feedback: feedbackData.feedback
      });
      setShowFeedbackModal(false);
      console.log(`Lesson ${feedbackData.lessonId} completed successfully`);
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };
  
  // Open cancel modal for cancelling a lesson
  const openCancelModal = (lessonId) => {
    setCancelData({ lessonId, reason: '' });
    setShowCancelModal(true);
  };
  
  // Handle cancelling a lesson
  const handleSubmitCancel = async () => {
    try {
      await cancelLesson(cancelData.lessonId, cancelData.reason);
      setShowCancelModal(false);
      console.log(`Lesson ${cancelData.lessonId} cancelled successfully`);
    } catch (error) {
      console.error('Error cancelling lesson:', error);
    }
  };
  
  // Format date from Firestore timestamp
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(date, 'yyyy-MM-dd');
  };
  
  // Format time from Firestore timestamp
  const formatTime = (date) => {
    if (!date) return 'N/A';
    return format(date, 'HH:mm');
  };
  
  // Get partner name based on role
  const getPartnerName = (lesson) => {
    return lesson.role === 'student' ? lesson.teacherName : lesson.studentName;
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1000, margin: '1rem auto' }}>
      <div className="card" style={{ padding: '30px', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>My Lessons</h2>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <button 
            onClick={() => setActiveTab('upcoming')} 
            style={{ 
              background: activeTab === 'upcoming' ? 'var(--primary)' : '#252525',
              color: activeTab === 'upcoming' ? 'black' : '#ddd',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              flex: 1,
              maxWidth: '200px'
            }}
          >
            Upcoming Lessons
          </button>
          <button 
            onClick={() => setActiveTab('active')} 
            style={{ 
              background: activeTab === 'active' ? 'var(--primary)' : '#252525',
              color: activeTab === 'active' ? 'black' : '#ddd',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              flex: 1,
              maxWidth: '200px'
            }}
          >
            Active Lessons
          </button>
          <button 
            onClick={() => setActiveTab('completed')} 
            style={{ 
              background: activeTab === 'completed' ? 'var(--primary)' : '#252525',
              color: activeTab === 'completed' ? 'black' : '#ddd',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              flex: 1,
              maxWidth: '200px'
            }}
          >
            Completed Lessons
          </button>
        </div>
        
        {/* Loading indicator */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loader"></div>
            <div style={{ marginTop: '20px', color: '#aaa' }}>Loading your lessons...</div>
          </div>
        )}
        
        {/* Upcoming Lessons Tab */}
        {!loading && activeTab === 'upcoming' && (
          <div>
            <div style={{ marginBottom: '20px', color: '#aaa', fontSize: '14px' }}>
              {upcomingLessons.length} upcoming {upcomingLessons.length === 1 ? 'lesson' : 'lessons'}
            </div>
            
            {upcomingLessons.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {upcomingLessons.map(lesson => (
                  <div 
                    key={lesson.id} 
                    style={{ 
                      background: '#252525', 
                      padding: '20px', 
                      borderRadius: '8px',
                      borderLeft: lesson.role === 'teacher' ? '4px solid var(--primary)' : '4px solid #9c27b0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <div>
                        <h3 style={{ color: lesson.role === 'teacher' ? 'var(--primary)' : '#9c27b0', margin: '0 0 5px 0', fontSize: '1.2rem' }}>
                          {lesson.skillName || 'Unnamed Skill'}
                        </h3>
                        <div style={{ color: '#ddd', fontSize: '15px' }}>
                          {lesson.role === 'teacher' ? 'Teaching' : 'Learning from'}: {getPartnerName(lesson)}
                        </div>
                      </div>
                      <div style={{ 
                        background: lesson.status === 'confirmed' ? '#4caf50' : '#ff9800',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {lesson.status}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        color: '#aaa',
                        fontSize: '14px'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>{lesson.scheduledDate ? formatDate(lesson.scheduledDate) : 'N/A'}</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        color: '#aaa',
                        fontSize: '14px'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{lesson.scheduledDate ? formatTime(lesson.scheduledDate) : 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button 
                        onClick={() => handleMessage(lesson.partnerId || lesson.id)}
                        style={{ 
                          background: '#252525', 
                          color: '#ddd',
                          border: '1px solid #444',
                          padding: '8px 15px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '14px'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Message
                      </button>
                      <button 
                        onClick={() => handleStart(lesson.id)}
                        style={{ 
                          background: '#2196f3', 
                          color: 'white',
                          border: 'none',
                          padding: '8px 15px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '14px'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Start Lesson
                      </button>
                      <button 
                        onClick={() => openCancelModal(lesson.id)}
                        style={{ 
                          background: '#f44336', 
                          color: 'white',
                          border: 'none',
                          padding: '8px 15px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '14px'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#aaa' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📅</div>
                <div style={{ marginBottom: '10px' }}>No upcoming lessons</div>
                <div style={{ fontSize: '14px' }}>Request a new lesson or browse the skill marketplace</div>
              </div>
            )}
          </div>
        )}
        
        {/* Active Lessons Tab */}
        {!loading && activeTab === 'active' && (
          <div>
            <div style={{ marginBottom: '20px', color: '#aaa', fontSize: '14px' }}>
              {activeLessons.length} active {activeLessons.length === 1 ? 'lesson' : 'lessons'}
            </div>
            
            {activeLessons.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {activeLessons.map(lesson => (
                  <div 
                    key={lesson.id} 
                    style={{ 
                      background: '#252525', 
                      padding: '20px', 
                      borderRadius: '8px',
                      borderLeft: lesson.role === 'teacher' ? '4px solid var(--primary)' : '4px solid #9c27b0',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Live indicator */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(244, 67, 54, 0.1)',
                      borderRadius: '20px',
                      padding: '5px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#f44336',
                        animation: 'pulse 1.5s infinite'
                      }}></div>
                      <span style={{ color: '#f44336', fontSize: '12px', fontWeight: '500' }}>LIVE</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <div>
                        <h3 style={{ color: lesson.role === 'teacher' ? 'var(--primary)' : '#9c27b0', margin: '0 0 5px 0', fontSize: '1.2rem' }}>
                          {lesson.skillName || 'Unnamed Skill'}
                        </h3>
                        <div style={{ color: '#ddd', fontSize: '15px' }}>
                          {lesson.role === 'teacher' ? 'Teaching' : 'Learning from'}: {getPartnerName(lesson)}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        color: '#aaa',
                        fontSize: '14px'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>Started at: {lesson.startedAt ? formatTime(lesson.startedAt) : 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button 
                        onClick={() => handleMessage(lesson.partnerId || lesson.id)}
                        style={{ 
                          background: '#252525', 
                          color: '#ddd',
                          border: '1px solid #444',
                          padding: '8px 15px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '14px'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Message
                      </button>
                      <button 
                        onClick={() => openFeedbackModal(lesson.id)}
                        style={{ 
                          background: '#4caf50', 
                          color: 'white',
                          border: 'none',
                          padding: '8px 15px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '14px'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#aaa' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎓</div>
                <div style={{ marginBottom: '10px' }}>No active lessons</div>
                <div style={{ fontSize: '14px' }}>Start one of your upcoming lessons</div>
              </div>
            )}
          </div>
        )}
        
        {/* Completed Lessons Tab */}
        {!loading && activeTab === 'completed' && (
          <div>
            <div style={{ marginBottom: '20px', color: '#aaa', fontSize: '14px' }}>
              {completedLessons.length} completed {completedLessons.length === 1 ? 'lesson' : 'lessons'}
            </div>
            
            {completedLessons.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {completedLessons.map(lesson => (
                  <div 
                    key={lesson.id} 
                    style={{ 
                      background: '#252525', 
                      padding: '20px', 
                      borderRadius: '8px',
                      borderLeft: lesson.role === 'teacher' ? '4px solid var(--primary)' : '4px solid #9c27b0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <div>
                        <h3 style={{ color: lesson.role === 'teacher' ? 'var(--primary)' : '#9c27b0', margin: '0 0 5px 0', fontSize: '1.2rem' }}>
                          {lesson.skillName || 'Unnamed Skill'}
                        </h3>
                        <div style={{ color: '#ddd', fontSize: '15px' }}>
                          {lesson.role === 'teacher' ? 'Taught' : 'Learned from'}: {getPartnerName(lesson)}
                        </div>
                      </div>
                      <div style={{ 
                        background: lesson.status === 'completed' ? '#4caf50' : '#f44336',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {lesson.status}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        color: '#aaa',
                        fontSize: '14px'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>{lesson.completedAt ? formatDate(lesson.completedAt) : (lesson.cancelledAt ? formatDate(lesson.cancelledAt) : 'N/A')}</span>
                      </div>
                    </div>
                    
                    {lesson.status === 'completed' && (
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '5px',
                          marginBottom: '5px'
                        }}>
                          <div style={{ color: '#aaa', fontSize: '14px' }}>Rating:</div>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                              <svg 
                                key={star}
                                xmlns="http://www.w3.org/2000/svg" 
                                width="14" 
                                height="14" 
                                viewBox="0 0 24 24" 
                                fill={star <= (lesson.rating || 0) ? 'var(--primary)' : 'none'} 
                                stroke={star <= (lesson.rating || 0) ? 'var(--primary)' : '#aaa'} 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                              </svg>
                            ))}
                          </div>
                        </div>
                        
                        {lesson.feedback && (
                          <div style={{ 
                            background: '#1e1e1e', 
                            padding: '10px 15px', 
                            borderRadius: '8px', 
                            fontSize: '14px',
                            color: '#ddd',
                            fontStyle: 'italic'
                          }}>
                            "{lesson.feedback}"
                          </div>
                        )}
                      </div>
                    )}
                    
                    {lesson.status === 'cancelled' && lesson.cancellationReason && (
                      <div style={{ 
                        background: '#1e1e1e', 
                        padding: '10px 15px', 
                        borderRadius: '8px', 
                        fontSize: '14px',
                        color: '#f44336',
                        marginBottom: '15px'
                      }}>
                        <div style={{ fontWeight: '500', marginBottom: '5px' }}>Cancellation reason:</div>
                        <div style={{ fontStyle: 'italic', color: '#ddd' }}>{lesson.cancellationReason}</div>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => setPage('marketplace')}
                        style={{ 
                          background: 'var(--primary)', 
                          color: 'black',
                          border: 'none',
                          padding: '8px 15px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '14px'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                        Book Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#aaa' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📚</div>
                <div style={{ marginBottom: '10px' }}>No completed lessons</div>
                <div style={{ fontSize: '14px' }}>Your completed lessons will appear here</div>
              </div>
            )}
          </div>
        )}
        {/* How Lessons Work Section */}
        <div className="card" style={{ padding: '30px' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '20px' }}>How Lessons Work</h3>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 200px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ 
                minWidth: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: 'var(--primary)', 
                color: 'black', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>1</div>
              <div>
                <div style={{ fontWeight: '500', color: '#ddd', marginBottom: '5px' }}>Schedule</div>
                <div style={{ color: '#aaa', fontSize: '14px' }}>Coordinate with your teacher or student to set a date and time for your 1-hour lesson.</div>
              </div>
            </div>
            
            <div style={{ flex: '1 1 200px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ 
                minWidth: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: 'var(--primary)', 
                color: 'black', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>2</div>
              <div>
                <div style={{ fontWeight: '500', color: '#ddd', marginBottom: '5px' }}>Attend</div>
                <div style={{ color: '#aaa', fontSize: '14px' }}>Meet in person or virtually for your lesson at the scheduled time.</div>
              </div>
            </div>
            
            <div style={{ flex: '1 1 200px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ 
                minWidth: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: 'var(--primary)', 
                color: 'black', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>3</div>
              <div>
                <div style={{ fontWeight: '500', color: '#ddd', marginBottom: '5px' }}>Complete</div>
                <div style={{ color: '#aaa', fontSize: '14px' }}>After the lesson, mark it as completed and leave feedback for your partner.</div>
              </div>
            </div>
            
            <div style={{ flex: '1 1 200px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ 
                minWidth: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: 'var(--primary)', 
                color: 'black', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>4</div>
              <div>
                <div style={{ fontWeight: '500', color: '#ddd', marginBottom: '5px' }}>Exchange</div>
                <div style={{ color: '#aaa', fontSize: '14px' }}>Time credits are automatically transferred from student to teacher upon completion.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1e1e1e',
            borderRadius: '8px',
            padding: '25px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '20px' }}>Complete Lesson</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '10px', color: '#ddd' }}>How would you rate this lesson?</div>
              <div style={{ display: 'flex', gap: '5px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <svg 
                    key={star}
                    xmlns="http://www.w3.org/2000/svg" 
                    width="30" 
                    height="30" 
                    viewBox="0 0 24 24" 
                    fill={star <= feedbackData.rating ? 'var(--primary)' : 'none'} 
                    stroke={star <= feedbackData.rating ? 'var(--primary)' : '#aaa'} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '10px', color: '#ddd' }}>Feedback (optional)</div>
              <textarea 
                value={feedbackData.feedback}
                onChange={(e) => setFeedbackData({ ...feedbackData, feedback: e.target.value })}
                style={{
                  width: '100%',
                  background: '#252525',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  padding: '10px',
                  color: '#ddd',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                placeholder="Share your experience with this lesson..."
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setShowFeedbackModal(false)}
                style={{ 
                  background: '#333', 
                  color: '#ddd',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitFeedback}
                style={{ 
                  background: '#4caf50', 
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Complete Lesson
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Cancel Modal */}
      {showCancelModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1e1e1e',
            borderRadius: '8px',
            padding: '25px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ color: '#f44336', marginBottom: '20px' }}>Cancel Lesson</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '10px', color: '#ddd' }}>Reason for cancellation</div>
              <textarea 
                value={cancelData.reason}
                onChange={(e) => setCancelData({ ...cancelData, reason: e.target.value })}
                style={{
                  width: '100%',
                  background: '#252525',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  padding: '10px',
                  color: '#ddd',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                placeholder="Please provide a reason for cancelling this lesson..."
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setShowCancelModal(false)}
                style={{ 
                  background: '#333', 
                  color: '#ddd',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Go Back
              </button>
              <button 
                onClick={handleSubmitCancel}
                style={{ 
                  background: '#f44336', 
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Cancel Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillLessons;
