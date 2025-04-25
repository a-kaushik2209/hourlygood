import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSkill } from '../contexts/SkillContext';
import { initializeDatabase, checkUserLessons } from '../utils/databaseInit';

function ProfilePage({ setPage }) {
  const { currentUser, getUserProfile } = useAuth();
  const { addSkill, updateBio, myRequests, myLessons } = useSkill();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bioText, setBioText] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' });
  const [addingSkill, setAddingSkill] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [hasLessons, setHasLessons] = useState(true);
  const [initializingDb, setInitializingDb] = useState(false);
  
  // Fetch user profile data and check if user has lessons
  useEffect(() => {
    async function loadProfile() {
      if (currentUser) {
        setLoading(true);
        try {
          const userProfile = await getUserProfile(currentUser.uid);
          setProfile(userProfile);
          setBioText(userProfile.bio || '');
          
          // Check if user has any lessons
          const hasUserLessons = await checkUserLessons(currentUser);
          setHasLessons(hasUserLessons);
        } catch (error) {
          console.error('Error loading profile:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    
    loadProfile();
  }, [currentUser, getUserProfile]);
  
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
  
  // Handle adding a new skill
  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return;
    
    try {
      await addSkill(newSkill);
      setProfile(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill]
      }));
      setNewSkill({ name: '', level: 'Beginner' });
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
      {/* Database initialization banner (only shown if user has no lessons) */}
      {!hasLessons && (
        <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
          <div style={{ 
            background: 'rgba(255, 143, 0, 0.1)', 
            borderRadius: '8px', 
            padding: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: '500', marginBottom: '5px' }}>
                Initialize Demo Data
              </div>
              <div style={{ color: '#aaa', fontSize: '14px' }}>
                Create sample lessons and users to test the real-time lesson functionality.
              </div>
            </div>
            <button 
              onClick={handleInitializeDatabase}
              disabled={initializingDb}
              style={{ 
                background: 'var(--primary)', 
                color: 'black',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: initializingDb ? 'not-allowed' : 'pointer',
                opacity: initializingDb ? 0.7 : 1
              }}
            >
              {initializingDb ? 'Initializing...' : 'Initialize Data'}
            </button>
          </div>
        </div>
      )}
      
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
            {profile.name.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <h2 style={{ margin: '0', color: 'var(--primary)' }}>{profile.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
              <span style={{ 
                background: '#252525', 
                padding: '4px 10px', 
                borderRadius: '20px', 
                fontSize: '14px',
                color: '#ddd'
              }}>
                {profile.timeCredits || 0} Time Credits
              </span>
              <span style={{ color: '#aaa', fontSize: '14px' }}>ID: {profile.id}</span>
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
                <div style={{ fontSize: '16px', marginTop: '5px' }}>{profile.name}</div>
              </div>
              <div>
                <div style={{ color: '#aaa', fontSize: '14px' }}>Email</div>
                <div style={{ fontSize: '16px', marginTop: '5px' }}>{profile.email || 'Not provided'}</div>
              </div>
              <div>
                <div style={{ color: '#aaa', fontSize: '14px' }}>User ID</div>
                <div style={{ fontSize: '16px', marginTop: '5px' }}>{profile.id}</div>
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
                        setBioText(profile.bio || '');
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
                  {profile.bio || 'Add a bio to tell others about yourself and the skills you can teach.'}
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
                  {profile.skills ? profile.skills.length : 0}
                </div>
                <div style={{ color: '#aaa', fontSize: '14px', marginTop: '5px' }}>Skills you can teach</div>
              </div>
              <div style={{ flex: 1, background: '#252525', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: 'var(--primary)' }}>Time Credits</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                  {profile.timeCredits || 0}
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
            
            {profile.skills && profile.skills.length > 0 ? (
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
                    <div style={{ marginBottom: '20px' }}>
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
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setAddingSkill(false)}
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
            
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#ddd', marginTop: '20px', marginBottom: '15px' }}>Lessons I've Taught</h4>
              
              {profile.taughtLessons && profile.taughtLessons.length > 0 ? (
                <div>
                  {profile.taughtLessons.map((lesson, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        background: '#252525', 
                        padding: '15px 20px', 
                        borderRadius: '8px', 
                        marginBottom: '15px',
                        borderLeft: '4px solid var(--primary)',
                        animation: 'fadeIn 0.5s',
                        animationDelay: `${i * 0.1}s`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{lesson.skill}</span>
                        <span style={{ color: '#aaa', fontSize: '13px' }}>{lesson.date}</span>
                      </div>
                      <div style={{ marginTop: '8px', color: '#ddd' }}>Student: {lesson.student}</div>
                      <div style={{ 
                        marginTop: '10px', 
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        background: lesson.completed ? '#4caf50' : '#ff9800',
                        color: '#fff'
                      }}>
                        {lesson.completed ? 'Completed' : 'Pending'}
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
                  You haven't taught any lessons yet.
                </div>
              )}
            </div>
            
            <div>
              <h4 style={{ color: '#ddd', marginTop: '30px', marginBottom: '15px' }}>Lessons I've Learned</h4>
              
              {profile.learnedLessons && profile.learnedLessons.length > 0 ? (
                <div>
                  {profile.learnedLessons.map((lesson, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        background: '#252525', 
                        padding: '15px 20px', 
                        borderRadius: '8px', 
                        marginBottom: '15px',
                        borderLeft: '4px solid #9c27b0',
                        animation: 'fadeIn 0.5s',
                        animationDelay: `${i * 0.1}s`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#9c27b0', fontWeight: 600 }}>{lesson.skill}</span>
                        <span style={{ color: '#aaa', fontSize: '13px' }}>{lesson.date}</span>
                      </div>
                      <div style={{ marginTop: '8px', color: '#ddd' }}>Teacher: {lesson.teacher}</div>
                      <div style={{ 
                        marginTop: '10px', 
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        background: lesson.completed ? '#4caf50' : '#ff9800',
                        color: '#fff'
                      }}>
                        {lesson.completed ? 'Completed' : 'Pending'}
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
                  You haven't taken any lessons yet.
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
