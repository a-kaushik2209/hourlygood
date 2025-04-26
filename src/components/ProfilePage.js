import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSkill } from '../contexts/SkillContext';
import { useLesson } from '../contexts/LessonContext';
import { useChat } from '../contexts/ChatContext';
import { initializeDatabase, checkUserLessons } from '../utils/databaseInit';
import UserRatings from './UserRatings';
import SkillProofs from './SkillProofs';
import SkillProofUpload from './SkillProofUpload';
import RatingModal from './RatingModal';
import { format } from 'date-fns';

function ProfilePage({ setPage }) {
  const { currentUser, getUserProfile } = useAuth();
  const { addSkill, updateBio, myRequests, myLessons, uploadSkillProof, getUserRatings } = useSkill();
  const { upcomingLessons, completedLessons, activeLessons } = useLesson();
  const { createChat } = useChat();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bioText, setBioText] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' });
  const [addingSkill, setAddingSkill] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [hasLessons, setHasLessons] = useState(true);
  const [initializingDb, setInitializingDb] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [skillProofFile, setSkillProofFile] = useState(null);
  const [userRatings, setUserRatings] = useState(null);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [chatLoading, setChatLoading] = useState({});
  
  // Fetch user profile data and check if user has lessons
  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        try {
          // Get user profile
          const userProfile = await getUserProfile(currentUser.uid);
          setProfile(userProfile);
          // Add null check before accessing bio property
          setBioText(userProfile && userProfile.bio ? userProfile.bio : '');
          
          // Check if user has any lessons
          const hasUserLessons = await checkUserLessons(currentUser.uid);
          setHasLessons(hasUserLessons);
          
          // Fetch user ratings with error handling
          setLoadingRatings(true);
          try {
            const ratings = await getUserRatings(currentUser.uid);
            setUserRatings(ratings);
          } catch (error) {
            console.log('No ratings found for new user, this is normal for new signups');
            // Set default empty ratings
            setUserRatings({
              averageRating: 0,
              totalRatings: 0,
              ratings: []
            });
          } finally {
            setLoadingRatings(false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [currentUser, getUserProfile, getUserRatings, checkUserLessons]);
  
  // Handle initializing the database with sample data
  const handleInitializeDatabase = async () => {
    if (!currentUser) return;
    
    setInitializingDb(true);
    try {
      await initializeDatabase(currentUser);
      setHasLessons(true);
    } catch (error) {
      console.error('Error initializing database:', error);
    } finally {
      setInitializingDb(false);
    }
  };
  
  // Handle saving bio
  const handleSaveBio = async () => {
    try {
      await updateBio(bioText);
      setProfile(prev => ({ ...prev, bio: bioText }));
      setEditingBio(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };
  
  // Handle starting a chat with a user
  const handleStartChat = async (lessonId, recipientId) => {
    if (!currentUser || !recipientId) return;
    
    // Update loading state for this specific lesson
    setChatLoading(prev => ({ ...prev, [lessonId]: true }));
    
    try {
      // Create or get existing chat
      const chatId = await createChat(recipientId);
      
      // Navigate to chat page with this chat active
      setPage('chat', { chatId });
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      // Clear loading state
      setChatLoading(prev => ({ ...prev, [lessonId]: false }));
    }
  };
  
  // Handle adding a new skill
  const handleAddSkill = async () => {
    if (!newSkill.name) return;
    
    try {
      // Upload skill proof if provided
      let proofUrl = null;
      if (skillProofFile) {
        proofUrl = await uploadSkillProof(skillProofFile, newSkill.name);
      }
      
      // Add the skill with proof URL if available
      await addSkill({
        ...newSkill,
        proofUrl
      });
      
      // Refresh profile data
      const updatedProfile = await getUserProfile(currentUser.uid);
      setProfile(updatedProfile);
      
      // Reset form
      setNewSkill({ name: '', level: 'Beginner' });
      setSkillProofFile(null);
      setAddingSkill(false);
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="card fade-in" style={{ maxWidth: 480, margin: '2rem auto', textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '30px', marginBottom: '20px' }}>⌛</div>
        <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>Loading Profile...</h2>
      </div>
    );
  }
  
  if (!currentUser || !profile) {
    return (
      <div className="card fade-in" style={{ maxWidth: 480, margin: '2rem auto', textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>👤</div>
        <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>No Profile Found</h2>
        <p style={{ color: '#aaa', marginBottom: '30px' }}>You need to create a profile to access your personal dashboard and start sharing and learning skills.</p>
        <button 
          onClick={() => setPage('login')} 
          style={{ 
            width: '100%',
            background: 'var(--primary)',
            color: 'black',
            padding: '12px',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
          Create Your Profile
        </button>
      </div>
    );
  }
  
  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: '1rem auto' }}>
      {/* Profile Header */}
      
      <div className="card" style={{ padding: '30px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          width: '150px', 
          height: '150px', 
          background: 'var(--primary)', 
          opacity: 0.1, 
          borderRadius: '0 0 0 100%' 
        }}></div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: '#252525', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '30px',
            border: '2px solid var(--primary)'
          }}>
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <h2 style={{ margin: '0', color: 'var(--primary)' }}>{profile?.name || 'User'}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
              <span style={{ 
                background: '#252525', 
                padding: '4px 10px', 
                borderRadius: '20px', 
                fontSize: '14px',
                color: '#ddd'
              }}>
                {profile?.timeCredits || 0} Time Credits
              </span>

            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('overview')} 
          style={{ 
            background: activeTab === 'overview' ? 'var(--primary)' : '#252525',
            color: activeTab === 'overview' ? 'black' : '#ddd',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            flex: 1
          }}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('skills')} 
          style={{ 
            background: activeTab === 'skills' ? 'var(--primary)' : '#252525',
            color: activeTab === 'skills' ? 'black' : '#ddd',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            flex: 1
          }}
        >
          My Skills
        </button>
        <button 
          onClick={() => setActiveTab('lessons')} 
          style={{ 
            background: activeTab === 'lessons' ? 'var(--primary)' : '#252525',
            color: activeTab === 'lessons' ? 'black' : '#ddd',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            flex: 1
          }}
        >
          Lessons
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="card" style={{ padding: '30px' }}>
        {activeTab === 'overview' && (
          <div className="fade-in">
            <h3 style={{ color: 'var(--primary)', marginTop: 0 }}>Account Overview</h3>
            
            <div style={{ 
              background: '#252525', 
              padding: '20px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <div style={{ color: '#aaa', fontSize: '14px' }}>Name</div>
                <div style={{ fontSize: '16px', marginTop: '5px' }}>{profile?.name || 'Not provided'}</div>
              </div>
              <div>
                <div style={{ color: '#aaa', fontSize: '14px' }}>Email</div>
                <div style={{ fontSize: '16px', marginTop: '5px' }}>{profile?.email || 'Not provided'}</div>
              </div>

              <div>
                <div style={{ color: '#aaa', fontSize: '14px' }}>Password</div>
                <div style={{ fontSize: '16px', marginTop: '5px', letterSpacing: '2px' }}>••••••••</div>
              </div>
            </div>
            
            <div style={{ 
              background: '#252525', 
              padding: '20px', 
              borderRadius: '8px', 
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ color: '#aaa', fontSize: '14px' }}>Bio & Skills</div>
                {!editingBio ? (
                  <button 
                    onClick={() => setEditingBio(true)}
                    style={{ 
                      background: 'transparent', 
                      border: '1px solid #444', 
                      color: '#ddd', 
                      padding: '5px 10px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => {
                        setEditingBio(false);
                        setBioText(profile?.bio || '');
                      }}
                      style={{ 
                        background: '#333', 
                        border: 'none', 
                        color: '#ddd', 
                        padding: '5px 10px', 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveBio}
                      style={{ 
                        background: 'var(--primary)', 
                        border: 'none', 
                        color: 'black', 
                        padding: '5px 10px', 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
              {!editingBio ? (
                <div style={{ fontSize: '16px', color: '#ddd', lineHeight: '1.5' }}>
                  {profile?.bio || 'Add a bio to tell others about yourself and the skills you can teach.'}
                </div>
              ) : (
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  placeholder="Tell others about yourself and the skills you can teach..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '10px',
                    background: '#333',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    resize: 'vertical'
                  }}
                />
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1, background: '#252525', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: 'var(--primary)' }}>Skills Offered</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                  {profile?.skills ? profile.skills.length : 0}
                </div>
                <div style={{ color: '#aaa', fontSize: '14px', marginTop: '5px' }}>Skills you can teach</div>
              </div>
              <div style={{ flex: 1, background: '#252525', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: 'var(--primary)' }}>Time Credits</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                  {profile?.timeCredits || 0}
                </div>
                <div style={{ color: '#aaa', fontSize: '14px', marginTop: '5px' }}>Hours available to learn</div>
              </div>
            </div>
            
            <div style={{ 
              background: '#252525', 
              padding: '15px 20px', 
              borderRadius: '8px', 
              fontSize: '14px',
              color: '#aaa',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>
                <b style={{ color: 'var(--primary)' }}>Note:</b> Each time credit represents one hour of learning. Teach others to earn more credits!
              </span>
            </div>
          </div>
        )}
        
        {activeTab === 'skills' && (
          <div className="fade-in">
            <h3 style={{ color: 'var(--primary)', marginTop: 0 }}>My Skills</h3>
            
            {profile?.skills && profile.skills.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {profile.skills.map((skill, index) => (
                  <div 
                    key={index}
                    style={{ 
                      background: '#252525', 
                      padding: '20px', 
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '18px', color: '#fff', marginBottom: '5px' }}>{skill.name}</div>
                      <div style={{ fontSize: '14px', color: '#aaa' }}>Level: {skill.level}</div>
                    </div>
                    
                    <div>
                      <button 
                        style={{ 
                          background: 'transparent', 
                          border: '1px solid #444', 
                          color: '#ddd', 
                          padding: '8px 12px', 
                          borderRadius: '4px', 
                          marginRight: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        style={{ 
                          background: '#333', 
                          border: 'none', 
                          color: '#aaa', 
                          padding: '8px 12px', 
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                
                {!addingSkill ? (
                  <button 
                    onClick={() => setAddingSkill(true)}
                    style={{ 
                      background: 'transparent', 
                      border: '1px dashed #444', 
                      color: 'var(--primary)', 
                      padding: '15px', 
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    Add New Skill
                  </button>
                ) : (
                  <div style={{ 
                    background: '#252525', 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px dashed #444'
                  }}>
                    <h4 style={{ color: 'var(--primary)', marginTop: 0, marginBottom: '15px' }}>Add New Skill</h4>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', color: '#ddd' }}>Skill Name:</label>
                      <input
                        type="text"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        placeholder="e.g., JavaScript, Tabla, Yoga, etc."
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#333',
                          border: '1px solid #444',
                          borderRadius: '4px',
                          color: '#fff'
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', color: '#ddd' }}>Skill Level:</label>
                      <select
                        value={newSkill.level}
                        onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#333',
                          border: '1px solid #444',
                          borderRadius: '4px',
                          color: '#fff'
                        }}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', color: '#ddd' }}>Upload Proof (PDF or JPG):</label>
                      <div style={{ 
                        border: '1px dashed #444',
                        borderRadius: '4px',
                        padding: '15px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        position: 'relative'
                      }}>
                        <input 
                          type="file" 
                          id="skill-proof" 
                          accept=".pdf,.jpg,.jpeg" 
                          onChange={(e) => setSkillProofFile(e.target.files[0])}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            opacity: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer'
                          }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          <span style={{ color: '#aaa' }}>
                            {skillProofFile ? skillProofFile.name : 'Click to upload PDF or JPG (max 5MB)'}
                          </span>
                        </div>
                      </div>
                      {skillProofFile && (
                        <div style={{ 
                          marginTop: '10px', 
                          background: '#333', 
                          padding: '10px', 
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {skillProofFile.name}
                          </span>
                          <button 
                            onClick={() => setSkillProofFile(null)}
                            style={{ 
                              background: 'transparent', 
                              border: 'none', 
                              color: '#aaa',
                              cursor: 'pointer'
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setAddingSkill(false);
                          setSkillProofFile(null);
                        }}
                        style={{
                          background: '#333',
                          border: 'none',
                          color: '#ddd',
                          padding: '8px 15px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddSkill}
                        style={{
                          background: 'var(--primary)',
                          border: 'none',
                          color: 'black',
                          padding: '8px 15px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        Add Skill
                      </button>
                    </div>
                  </div>
                )}
                
                <div style={{ 
                  background: '#252525', 
                  padding: '15px 20px', 
                  borderRadius: '8px', 
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <span style={{ color: '#aaa', fontSize: '14px' }}>
                    <b style={{ color: 'var(--primary)' }}>Tip:</b> The skills you add here will be visible to others looking for tutors. Be specific about what you can teach.
                  </span>
                </div>
              </div>
            ) : (
              <div 
                style={{ 
                  background: '#252525', 
                  padding: '30px', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '50px', marginBottom: '20px' }}>💪</div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>No Skills Added Yet</h3>
                <p style={{ color: '#aaa', marginBottom: '20px' }}>Add skills that you can teach to others and earn time credits.</p>
                <button 
                  style={{ 
                    background: 'var(--primary)', 
                    border: 'none', 
                    color: 'black', 
                    padding: '10px 20px', 
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    gap: '8px'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  Add Your First Skill
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'lessons' && (
          <div className="fade-in">
            <h3 style={{ color: 'var(--primary)', marginTop: 0 }}>My Lessons</h3>
            
            {/* Scheduled Lessons Section */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#ddd', marginTop: '20px', marginBottom: '15px' }}>Scheduled Lessons</h4>
              
              {upcomingLessons && upcomingLessons.length > 0 ? (
                <div>
                  {upcomingLessons.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      style={{ 
                        background: '#252525', 
                        padding: '15px 20px', 
                        borderRadius: '8px', 
                        marginBottom: '15px',
                        borderLeft: lesson.role === 'teacher' ? '4px solid var(--primary)' : '4px solid #9c27b0',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: lesson.role === 'teacher' ? 'var(--primary)' : '#9c27b0', fontWeight: 600 }}>
                          {lesson.skillName || 'Unnamed Skill'}
                        </span>
                        <span style={{ color: '#aaa', fontSize: '13px' }}>
                          {lesson.scheduledDate ? format(lesson.scheduledDate, 'MMM dd, yyyy - HH:mm') : 'Date not set'}
                        </span>
                      </div>
                      <div style={{ marginTop: '8px', color: '#ddd' }}>
                        {lesson.role === 'teacher' ? 'Teaching: ' : 'Learning from: '}
                        {lesson.role === 'teacher' ? lesson.studentName : lesson.teacherName}
                      </div>
                      <div style={{ 
                        marginTop: '10px', 
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        background: '#ff9800',
                        color: '#fff'
                      }}>
                        {lesson.status === 'confirmed' ? 'Confirmed' : 'Scheduled'}
                      </div>
                      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => handleStartChat(lesson.id, lesson.role === 'teacher' ? lesson.studentId : lesson.teacherId)}
                          disabled={chatLoading[lesson.id]}
                          style={{ 
                            background: 'transparent', 
                            border: '1px solid #444', 
                            color: '#ddd', 
                            padding: '5px 10px', 
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: chatLoading[lesson.id] ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            opacity: chatLoading[lesson.id] ? 0.7 : 1
                          }}
                        >
                          {chatLoading[lesson.id] ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M16 12a4 4 0 1 1-8 0"></path>
                              </svg>
                              Connecting...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                              Message
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  padding: '15px 20px', 
                  background: '#252525', 
                  borderRadius: '8px',
                  color: '#aaa',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  You don't have any scheduled lessons.
                </div>
              )}
            </div>
            
            {/* Active Lessons Section */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#ddd', marginTop: '20px', marginBottom: '15px' }}>Active Lessons</h4>
              
              {activeLessons && activeLessons.length > 0 ? (
                <div>
                  {activeLessons.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      style={{ 
                        background: '#252525', 
                        padding: '15px 20px', 
                        borderRadius: '8px', 
                        marginBottom: '15px',
                        borderLeft: lesson.role === 'teacher' ? '4px solid var(--primary)' : '4px solid #9c27b0',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: lesson.role === 'teacher' ? 'var(--primary)' : '#9c27b0', fontWeight: 600 }}>
                          {lesson.skillName || 'Unnamed Skill'}
                        </span>
                        <span style={{ color: '#aaa', fontSize: '13px' }}>
                          Started: {lesson.startedAt ? format(lesson.startedAt, 'MMM dd, yyyy - HH:mm') : 'Just now'}
                        </span>
                      </div>
                      <div style={{ marginTop: '8px', color: '#ddd' }}>
                        {lesson.role === 'teacher' ? 'Teaching: ' : 'Learning from: '}
                        {lesson.role === 'teacher' ? lesson.studentName : lesson.teacherName}
                      </div>
                      <div style={{ 
                        marginTop: '10px', 
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        background: '#4caf50',
                        color: '#fff'
                      }}>
                        In Progress
                      </div>
                      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => handleStartChat(lesson.id, lesson.role === 'teacher' ? lesson.studentId : lesson.teacherId)}
                          disabled={chatLoading[lesson.id]}
                          style={{ 
                            background: 'transparent', 
                            border: '1px solid #444', 
                            color: '#ddd', 
                            padding: '5px 10px', 
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: chatLoading[lesson.id] ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            opacity: chatLoading[lesson.id] ? 0.7 : 1
                          }}
                        >
                          {chatLoading[lesson.id] ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M16 12a4 4 0 1 1-8 0"></path>
                              </svg>
                              Connecting...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                              Message
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  padding: '15px 20px', 
                  background: '#252525', 
                  borderRadius: '8px',
                  color: '#aaa',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  You don't have any active lessons.
                </div>
              )}
            </div>
            
            {/* Completed Lessons Section */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#ddd', marginTop: '20px', marginBottom: '15px' }}>Completed Lessons</h4>
              
              {completedLessons && completedLessons.length > 0 ? (
                <div>
                  {completedLessons.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      style={{ 
                        background: '#252525', 
                        padding: '15px 20px', 
                        borderRadius: '8px', 
                        marginBottom: '15px',
                        borderLeft: lesson.role === 'teacher' ? '4px solid var(--primary)' : '4px solid #9c27b0',
                        opacity: lesson.status === 'cancelled' ? 0.7 : 1
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: lesson.role === 'teacher' ? 'var(--primary)' : '#9c27b0', fontWeight: 600 }}>
                          {lesson.skillName || 'Unnamed Skill'}
                        </span>
                        <span style={{ color: '#aaa', fontSize: '13px' }}>
                          {lesson.completedAt ? format(lesson.completedAt, 'MMM dd, yyyy') : 'Date not available'}
                        </span>
                      </div>
                      <div style={{ marginTop: '8px', color: '#ddd' }}>
                        {lesson.role === 'teacher' ? 'Taught: ' : 'Learned from: '}
                        {lesson.role === 'teacher' ? lesson.studentName : lesson.teacherName}
                      </div>
                      <div style={{ 
                        marginTop: '10px', 
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        background: lesson.status === 'cancelled' ? '#f44336' : '#4caf50',
                        color: '#fff'
                      }}>
                        {lesson.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                      </div>
                      {lesson.rating && (
                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px', color: '#ffc107' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                          <span>{lesson.rating}/5</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  padding: '15px 20px', 
                  background: '#252525', 
                  borderRadius: '8px',
                  color: '#aaa',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  You haven't completed any lessons yet.
                </div>
              )}
              
              <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <button 
                  onClick={() => setPage('marketplace')} 
                  style={{ 
                    background: '#9c27b0',
                    color: 'white',
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
                  Browse Skills to Learn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
