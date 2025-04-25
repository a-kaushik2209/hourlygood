import React, { useState } from 'react';

function SkillLessons({ setPage }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Mock data for lessons
  const upcomingLessons = [
    { 
      id: 1, 
      skill: 'Spanish Language', 
      role: 'student', 
      partner: 'Carlos Rodriguez', 
      date: '2025-04-28', 
      time: '18:00',
      status: 'confirmed'
    },
    { 
      id: 2, 
      skill: 'JavaScript Programming', 
      role: 'teacher', 
      partner: 'Emily Chen', 
      date: '2025-04-29', 
      time: '14:30',
      status: 'pending'
    },
    { 
      id: 3, 
      skill: 'Yoga Basics', 
      role: 'student', 
      partner: 'Anika Patel', 
      date: '2025-05-02', 
      time: '09:00',
      status: 'confirmed'
    }
  ];
  
  const completedLessons = [
    { 
      id: 4, 
      skill: 'Guitar Basics', 
      role: 'student', 
      partner: 'James Wilson', 
      date: '2025-04-15', 
      rating: 5,
      feedback: 'James was an excellent teacher! Very patient and knowledgeable.'
    },
    { 
      id: 5, 
      skill: 'JavaScript Programming', 
      role: 'teacher', 
      partner: 'Alex Kim', 
      date: '2025-04-10', 
      rating: 4,
      feedback: 'Great student, eager to learn and asked good questions.'
    },
    { 
      id: 6, 
      skill: 'Cooking Italian Food', 
      role: 'teacher', 
      partner: 'Maria Rossi', 
      date: '2025-04-05', 
      rating: 5,
      feedback: 'Maria was very attentive and picked up techniques quickly.'
    }
  ];
  
  const handleMessage = (partnerId) => {
    console.log(`Opening chat with partner ID: ${partnerId}`);
    setPage('chat');
  };
  
  const handleComplete = (lessonId) => {
    console.log(`Marking lesson ${lessonId} as complete`);
    // In a real app, this would update the lesson status
  };
  
  const handleCancel = (lessonId) => {
    console.log(`Cancelling lesson ${lessonId}`);
    // In a real app, this would cancel the lesson
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
        
        {/* Upcoming Lessons Tab */}
        {activeTab === 'upcoming' && (
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
                          {lesson.skill}
                        </h3>
                        <div style={{ color: '#ddd', fontSize: '15px' }}>
                          {lesson.role === 'teacher' ? 'Teaching' : 'Learning from'}: {lesson.partner}
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
                        <span>{lesson.date}</span>
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
                        <span>{lesson.time}</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        color: '#aaa',
                        fontSize: '14px'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" y1="19" x2="12" y2="22"></line>
                        </svg>
                        <span>1 hour</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleCancel(lesson.id)}
                        style={{ 
                          background: '#333', 
                          color: '#ddd', 
                          border: 'none', 
                          padding: '8px 15px', 
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleMessage(lesson.partner)}
                        style={{ 
                          background: '#555', 
                          color: 'white', 
                          border: 'none', 
                          padding: '8px 15px', 
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Message
                      </button>
                      {lesson.status === 'confirmed' && (
                        <button 
                          onClick={() => handleComplete(lesson.id)}
                          style={{ 
                            background: lesson.role === 'teacher' ? 'var(--primary)' : '#9c27b0', 
                            color: lesson.role === 'teacher' ? 'black' : 'white', 
                            border: 'none', 
                            padding: '8px 15px', 
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px', 
                background: '#252525', 
                borderRadius: '8px',
                color: '#aaa'
              }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>📅</div>
                <h3 style={{ color: 'var(--primary)', margin: '0 0 10px 0' }}>No Upcoming Lessons</h3>
                <p style={{ maxWidth: '400px', margin: '0 auto 20px auto', fontSize: '14px' }}>
                  You don't have any upcoming lessons scheduled. Browse the marketplace to find skills to learn or teach.
                </p>
                <button 
                  onClick={() => setPage('marketplace')} 
                  style={{ 
                    background: 'var(--primary)',
                    color: 'black',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Browse Marketplace
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Completed Lessons Tab */}
        {activeTab === 'completed' && (
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
                          {lesson.skill}
                        </h3>
                        <div style={{ color: '#ddd', fontSize: '15px' }}>
                          {lesson.role === 'teacher' ? 'Taught' : 'Learned from'}: {lesson.partner}
                        </div>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        background: '#333', 
                        padding: '4px 10px', 
                        borderRadius: '20px',
                        gap: '5px'
                      }}>
                        {Array(5).fill(0).map((_, i) => (
                          <svg 
                            key={i}
                            xmlns="http://www.w3.org/2000/svg" 
                            width="12" 
                            height="12" 
                            viewBox="0 0 24 24" 
                            fill={i < lesson.rating ? 'var(--primary)' : 'none'} 
                            stroke={i < lesson.rating ? 'var(--primary)' : '#666'} 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      color: '#aaa',
                      fontSize: '14px',
                      marginBottom: '15px'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>{lesson.date}</span>
                    </div>
                    
                    <div style={{ 
                      background: '#1e1e1e', 
                      padding: '15px', 
                      borderRadius: '8px',
                      marginBottom: '15px',
                      color: '#ccc',
                      fontSize: '14px',
                      fontStyle: 'italic'
                    }}>
                      "{lesson.feedback}"
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleMessage(lesson.partner)}
                        style={{ 
                          background: '#555', 
                          color: 'white', 
                          border: 'none', 
                          padding: '8px 15px', 
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Message
                      </button>
                      <button 
                        onClick={() => setPage('request')}
                        style={{ 
                          background: lesson.role === 'teacher' ? 'var(--primary)' : '#9c27b0', 
                          color: lesson.role === 'teacher' ? 'black' : 'white', 
                          border: 'none', 
                          padding: '8px 15px', 
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Book Another Lesson
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px', 
                background: '#252525', 
                borderRadius: '8px',
                color: '#aaa'
              }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎓</div>
                <h3 style={{ color: 'var(--primary)', margin: '0 0 10px 0' }}>No Completed Lessons</h3>
                <p style={{ maxWidth: '400px', margin: '0 auto 20px auto', fontSize: '14px' }}>
                  You haven't completed any lessons yet. Once you complete a lesson, it will appear here.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* How it works section */}
      <div className="card" style={{ padding: '25px' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '15px', fontSize: '1.2rem' }}>How Lessons Work</h3>
        
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
  );
}

export default SkillLessons;
