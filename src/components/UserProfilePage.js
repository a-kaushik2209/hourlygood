import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSkill } from '../contexts/SkillContext';
import { useChat } from '../contexts/ChatContext';
import UserRatings from './UserRatings';
import SkillProofs from './SkillProofs';

function UserProfilePage({ userId, setPage, onRequestLesson }) {
  const { getUserProfile, currentUser } = useAuth();
  const { getUserRatings } = useSkill();
  const { createChat } = useChat();
  const [profile, setProfile] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch user profile when userId changes
  useEffect(() => {
    async function fetchUserProfile() {
      if (!userId) return;
      
      setLoading(true);
      try {
        const userProfile = await getUserProfile(userId);
        setProfile(userProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [userId, getUserProfile]);

  // Fetch user ratings when profile is loaded and tab is 'ratings'
  useEffect(() => {
    async function fetchUserRatings() {
      if (!userId || activeTab !== 'ratings') return;
      
      setLoadingRatings(true);
      try {
        const userRatings = await getUserRatings(userId);
        setRatings(userRatings);
      } catch (error) {
        console.error('Error fetching user ratings:', error);
      } finally {
        setLoadingRatings(false);
      }
    }
    
    fetchUserRatings();
  }, [userId, activeTab, getUserRatings]);

  // Handle request lesson button click
  const handleRequestLesson = (skillName = null) => {
    if (onRequestLesson && profile) {
      onRequestLesson({
        id: userId,
        name: profile.name || profile.displayName || userId
      }, skillName);
    }
  };
  
  // Handle starting a chat with this user
  const handleStartChat = async () => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      setPage('login');
      return;
    }
    
    if (userId === currentUser.uid) {
      // Can't chat with yourself
      alert('You cannot start a chat with yourself.');
      return;
    }
    
    setChatLoading(true);
    try {
      // Create or get existing chat
      const chatId = await createChat(userId);
      
      // Navigate to chat page with this chat active
      setPage('chat', { chatId });
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="error-container">
        <h2>User Not Found</h2>
        <p>The requested user profile could not be found.</p>
        <button className="primary-button" onClick={() => setPage('marketplace')}>
          Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      {/* Back button */}
      <button className="back-button" onClick={() => setPage('marketplace')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Marketplace
      </button>

      {/* Profile header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {(profile.name || profile.displayName) ? (profile.name || profile.displayName).charAt(0).toUpperCase() : '?'}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{profile.name || profile.displayName || userId}</h1>
          
          {profile.averageRating > 0 && (
            <div className="profile-rating">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    className={`star ${star <= Math.round(profile.averageRating) ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-text">
                {profile.averageRating.toFixed(1)} ({profile.totalRatings} {profile.totalRatings === 1 ? 'rating' : 'ratings'})
              </span>
            </div>
          )}
          
          <div className="profile-meta">
            <div className="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          <button 
            className="request-lesson-button" 
            onClick={() => handleRequestLesson()}
          >
            Request Lesson
          </button>
          <button 
            className="chat-button" 
            onClick={handleStartChat}
            disabled={chatLoading || !currentUser}
            style={{
              background: chatLoading ? '#2d3748' : '#4a5568',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '8px',
              cursor: chatLoading || !currentUser ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginLeft: '10px',
              opacity: chatLoading || !currentUser ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {chatLoading ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M16 12a4 4 0 1 1-8 0"></path>
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Chat
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile bio */}
      {profile.bio && (
        <div className="profile-bio">
          <p>{profile.bio}</p>
        </div>
      )}

      {/* Profile tabs */}
      <div className="profile-tabs">
        <div 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Skills
        </div>
        <div 
          className={`tab ${activeTab === 'proofs' ? 'active' : ''}`}
          onClick={() => setActiveTab('proofs')}
        >
          Skill Proofs
        </div>
        <div 
          className={`tab ${activeTab === 'ratings' ? 'active' : ''}`}
          onClick={() => setActiveTab('ratings')}
        >
          Ratings
        </div>
      </div>

      {/* Tab content */}
      <div className="tab-content">
        {/* Skills overview tab */}
        {activeTab === 'overview' && (
          <div className="skills-container">
            {(!profile.skills || profile.skills.length === 0) ? (
              <div className="empty-state">
                <p>This user hasn't added any skills yet.</p>
              </div>
            ) : (
              <div className="skills-grid">
                {profile.skills.map((skill) => (
                  <div key={skill.id} className="skill-card">
                    <div className="skill-header">
                      <h3 className="skill-name">{skill.name}</h3>
                      <div className="skill-level">{skill.level}</div>
                    </div>
                    <p className="skill-description">{skill.description}</p>
                    <div className="skill-actions">
                      <button 
                        className="request-button" 
                        onClick={() => handleRequestLesson(skill.name)}
                      >
                        Request Lesson
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skill proofs tab */}
        {activeTab === 'proofs' && (
          <div className="proofs-container">
            {(!profile.skillProofs || profile.skillProofs.length === 0) ? (
              <div className="empty-state">
                <p>This user hasn't uploaded any skill proofs yet.</p>
              </div>
            ) : (
              <SkillProofs proofs={profile.skillProofs} />
            )}
          </div>
        )}

        {/* Ratings tab */}
        {activeTab === 'ratings' && (
          <div className="ratings-container">
            <UserRatings ratings={ratings} isLoading={loadingRatings} />
          </div>
        )}
      </div>

      <style jsx="true">{`
        .user-profile-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          text-align: center;
        }

        .loading-spinner {
          border: 4px solid #333;
          border-radius: 50%;
          border-top: 4px solid var(--primary);
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--primary);
          font-size: 16px;
          cursor: pointer;
          padding: 0;
          margin-bottom: 20px;
        }

        .back-button:hover {
          text-decoration: underline;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--primary);
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          margin: 0 0 5px 0;
          font-size: 28px;
          color: #fff;
        }

        .profile-rating {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .rating-stars {
          display: flex;
        }

        .star {
          font-size: 18px;
          color: #555;
          margin-right: 2px;
        }

        .star.filled {
          color: var(--primary);
        }

        .rating-text {
          color: #ccc;
          font-size: 14px;
        }

        .profile-meta {
          display: flex;
          gap: 15px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #999;
          font-size: 14px;
        }

        .profile-actions {
          display: flex;
          gap: 10px;
        }

        .request-lesson-button {
          background: var(--primary);
          color: #000;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }

        .request-lesson-button:hover {
          background: #ffb74d;
        }

        .request-lesson-button:active {
          transform: translateY(1px);
        }

        .profile-bio {
          background: #252525;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .profile-bio p {
          margin: 0;
          line-height: 1.6;
          color: #eee;
        }

        .profile-tabs {
          display: flex;
          border-bottom: 1px solid #333;
          margin-bottom: 20px;
        }

        .tab {
          padding: 12px 20px;
          cursor: pointer;
          color: #ccc;
          transition: color 0.2s;
          position: relative;
        }

        .tab:hover {
          color: #fff;
        }

        .tab.active {
          color: var(--primary);
          font-weight: 500;
        }

        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary);
        }

        .empty-state {
          display: flex;
          justify-content: center;
          padding: 40px 0;
          color: #999;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .skill-card {
          background: #252525;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .skill-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .skill-name {
          margin: 0;
          font-size: 18px;
          color: #fff;
        }

        .skill-level {
          background: #333;
          color: var(--primary);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .skill-description {
          color: #ccc;
          flex: 1;
          margin: 0 0 15px 0;
          line-height: 1.5;
        }

        .skill-actions {
          display: flex;
          justify-content: flex-end;
        }

        .request-button {
          background: #333;
          color: #fff;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .request-button:hover {
          background: var(--primary);
          color: #000;
        }
      `}</style>
    </div>
  );
}

export default UserProfilePage;
