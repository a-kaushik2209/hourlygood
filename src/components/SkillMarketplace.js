import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSkill } from '../contexts/SkillContext';
import CreateLessonModal from './CreateLessonModal';

function SkillMarketplace({ setPage }) {
  const { currentUser } = useAuth();
  const { skillRequests, takeLesson, loading } = useSkill();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [processingRequest, setProcessingRequest] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'technology', name: 'Technology' },
    { id: 'music', name: 'Music & Dance' },
    { id: 'cooking', name: 'Cooking' },
    { id: 'art', name: 'Art & Design' },
    { id: 'fitness', name: 'Yoga & Fitness' },
    { id: 'professional', name: 'Professional Skills' },
    { id: 'language', name: 'Languages' },
    { id: 'academic', name: 'Academic Subjects' }
  ];
  
  // Filter skill requests based on search term and category
  const filteredRequests = skillRequests.filter(request => {
    // Don't show user's own requests in the marketplace
    if (currentUser && request.requesterId === currentUser.uid) {
      return false;
    }
    
    // Only show open requests
    if (request.status !== 'open') {
      return false;
    }
    
    const matchesSearch = 
      request.skillName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      request.requesterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle taking a skill lesson request
  const handleTakeLesson = async (requestId) => {
    if (!currentUser) {
      alert('Please log in to take a lesson');
      setPage('login');
      return;
    }
    
    setProcessingRequest(requestId);
    
    try {
      const chatId = await takeLesson(requestId);
      alert('You have successfully taken this lesson request! You can now chat with the student.');
      setPage('chat');
    } catch (error) {
      console.error('Error taking lesson:', error);
      alert('Failed to take lesson: ' + error.message);
    } finally {
      setProcessingRequest(null);
    }
  };
  
  // Handle scheduling a real-time lesson with a teacher
  const handleScheduleLesson = (teacher) => {
    if (!currentUser) {
      alert('Please log in to schedule a lesson');
      setPage('login');
      return;
    }
    
    setSelectedTeacher(teacher);
    setShowLessonModal(true);
  };
  
  // Close the lesson modal
  const handleCloseLessonModal = () => {
    setShowLessonModal(false);
    setSelectedTeacher(null);
  };
  
  // Handle view requester profile
  const handleViewRequester = (requesterId) => {
    // In a real app, this would navigate to the requester's profile
    console.log(`Viewing requester profile: ${requesterId}`);
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1200, margin: '1rem auto' }}>
      <div className="card" style={{ padding: '30px', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>Skill Request Marketplace</h2>
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⌛</div>
            <p>Loading skill requests...</p>
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Search and filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            <div style={{ flex: '1 1 300px' }}>
              <input 
                type="text" 
                placeholder="Search skills or teachers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 15px', 
                  borderRadius: '8px', 
                  background: '#252525', 
                  border: '1px solid #333', 
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div style={{ flex: '1 1 300px' }}>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 15px', 
                  borderRadius: '8px', 
                  background: '#252525', 
                  border: '1px solid #333', 
                  color: '#fff',
                  fontSize: '16px',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 15px top 50%',
                  backgroundSize: '12px auto'
                }}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={() => setPage('request')}
              style={{ 
                background: 'var(--primary)', 
                color: 'black', 
                border: 'none', 
                padding: '12px 20px', 
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Create New Request
            </button>
          </div>
          
          {/* Results count */}
          <div style={{ color: '#aaa', fontSize: '14px' }}>
            Showing {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'}
          </div>
        </div>
      </div>
      
      {/* Skill request listings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredRequests.length > 0 ? (
          filteredRequests.map(request => (
            <div key={request.id} className="card" style={{ padding: '25px', transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ color: 'var(--primary)', margin: '0', fontSize: '1.3rem' }}>{request.skillName}</h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  background: '#252525', 
                  padding: '5px 10px', 
                  borderRadius: '20px',
                  gap: '5px'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span style={{ color: '#fff', fontWeight: '500' }}>{new Date(request.preferredDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '15px',
                color: '#ddd',
                fontSize: '14px'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span 
                  onClick={() => handleViewRequester(request.requesterId)}
                  style={{ 
                    cursor: 'pointer', 
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(255,255,255,0.3)',
                    textUnderlineOffset: '2px'
                  }}
                >
                  {request.requesterName}
                </span>
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {request.preferredTime}
                </span>
              </div>
              
              <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '15px', lineHeight: '1.5' }}>
                {request.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  background: '#252525',
                  padding: '8px 12px',
                  borderRadius: '8px'
                }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    1
                  </div>
                  <div style={{ color: '#fff', fontSize: '14px' }}>
                    Time Credit
                  </div>
                </div>
                
                <button 
                  onClick={() => handleTakeLesson(request.id)}
                  disabled={processingRequest === request.id}
                  style={{ 
                    background: processingRequest === request.id ? '#555' : 'var(--primary)', 
                    color: 'black', 
                    border: 'none', 
                    padding: '8px 15px', 
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: processingRequest === request.id ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {processingRequest === request.id ? (
                    'Processing...'
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Take Lesson
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ padding: '40px 20px', gridColumn: '1 / -1', textAlign: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>No Requests Found</h3>
            <p style={{ color: '#aaa', marginBottom: '20px' }}>
              We couldn't find any skill requests matching your search criteria.
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              style={{ 
                background: 'var(--primary)', 
                color: 'black', 
                border: 'none', 
                padding: '10px 20px', 
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Clear Filters
            </button>
          </div>
        )}
      </div>
      
      {/* How it works section */}
      <div className="card" style={{ padding: '25px', marginTop: '20px' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '15px', fontSize: '1.2rem' }}>How the Skill Marketplace Works</h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 250px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
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
              <div style={{ fontWeight: '500', color: '#ddd', marginBottom: '5px' }}>Browse Skills</div>
              <div style={{ color: '#aaa', fontSize: '14px' }}>Explore skills offered by community members or search for specific skills.</div>
            </div>
          </div>
          
          <div style={{ flex: '1 1 250px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
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
              <div style={{ fontWeight: '500', color: '#ddd', marginBottom: '5px' }}>Request a Lesson</div>
              <div style={{ color: '#aaa', fontSize: '14px' }}>Request a 1-hour lesson from a teacher who has the skill you want to learn.</div>
            </div>
          </div>
          
          <div style={{ flex: '1 1 250px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
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
              <div style={{ fontWeight: '500', color: '#ddd', marginBottom: '5px' }}>Learn & Exchange</div>
              <div style={{ color: '#aaa', fontSize: '14px' }}>After the lesson, 1 time credit is transferred from you to the teacher.</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Real-time Lessons with Teachers Section */}
      <div className="card" style={{ padding: '30px', marginTop: '30px' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>Real-time Lessons with Teachers</h2>
        <p style={{ color: '#aaa', marginBottom: '20px' }}>
          Schedule a real-time lesson with one of our expert teachers. These lessons are conducted live at a scheduled time.
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {/* JavaScript Teacher */}
          <div style={{ 
            flex: '1 1 300px', 
            background: '#252525', 
            borderRadius: '8px', 
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              background: 'var(--primary)', 
              color: 'black',
              padding: '5px 10px',
              borderRadius: '0 0 0 8px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              POPULAR
            </div>
            
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: '#333', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '15px'
            }}>
              👩‍💻
            </div>
            
            <h3 style={{ color: 'var(--primary)', marginBottom: '5px' }}>JavaScript Programming</h3>
            <div style={{ color: '#ddd', marginBottom: '5px' }}>Teacher: Emily Chen</div>
            <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '15px' }}>
              Learn modern JavaScript from basics to advanced concepts. Perfect for beginners and intermediate developers.
            </div>
            
            <button 
              onClick={() => handleScheduleLesson({
                id: 'user2',
                name: 'Emily Chen',
                skillId: 'skill1',
                skillName: 'JavaScript Programming'
              })}
              style={{ 
                width: '100%',
                background: 'var(--primary)', 
                color: 'black',
                border: 'none',
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Schedule Lesson
            </button>
          </div>
          
          {/* Spanish Teacher */}
          <div style={{ 
            flex: '1 1 300px', 
            background: '#252525', 
            borderRadius: '8px', 
            padding: '20px'
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: '#333', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '15px'
            }}>
              🌎
            </div>
            
            <h3 style={{ color: 'var(--primary)', marginBottom: '5px' }}>Spanish Language</h3>
            <div style={{ color: '#ddd', marginBottom: '5px' }}>Teacher: Carlos Rodriguez</div>
            <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '15px' }}>
              Conversational Spanish for beginners and intermediate learners. Focus on practical vocabulary and grammar.
            </div>
            
            <button 
              onClick={() => handleScheduleLesson({
                id: 'user1',
                name: 'Carlos Rodriguez',
                skillId: 'skill2',
                skillName: 'Spanish Language'
              })}
              style={{ 
                width: '100%',
                background: 'var(--primary)', 
                color: 'black',
                border: 'none',
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Schedule Lesson
            </button>
          </div>
          
          {/* Yoga Teacher */}
          <div style={{ 
            flex: '1 1 300px', 
            background: '#252525', 
            borderRadius: '8px', 
            padding: '20px'
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: '#333', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '15px'
            }}>
              🧘‍♀️
            </div>
            
            <h3 style={{ color: 'var(--primary)', marginBottom: '5px' }}>Yoga Basics</h3>
            <div style={{ color: '#ddd', marginBottom: '5px' }}>Teacher: Anika Patel</div>
            <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '15px' }}>
              Introduction to yoga poses and breathing techniques for beginners. Learn at your own pace with personalized guidance.
            </div>
            
            <button 
              onClick={() => handleScheduleLesson({
                id: 'user3',
                name: 'Anika Patel',
                skillId: 'skill3',
                skillName: 'Yoga Basics'
              })}
              style={{ 
                width: '100%',
                background: 'var(--primary)', 
                color: 'black',
                border: 'none',
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Schedule Lesson
            </button>
          </div>
        </div>
      </div>
      
      {/* Create Lesson Modal */}
      {showLessonModal && selectedTeacher && (
        <CreateLessonModal 
          onClose={handleCloseLessonModal}
          skillId={selectedTeacher.skillId}
          skillName={selectedTeacher.skillName}
          teacherId={selectedTeacher.id}
          teacherName={selectedTeacher.name}
        />
      )}
    </div>
  );
}

export default SkillMarketplace;
