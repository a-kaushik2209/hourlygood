import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import LandingPage from './components/LandingPage';
import SkillRequestPage from './components/SkillRequestPage';
import SkillMarketplace from './components/SkillMarketplace';
import SkillLessons from './components/SkillLessons';
import ProfilePage from './components/ProfilePage';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import UserProfilePage from './components/UserProfilePage'; // Import UserProfilePage
import LessonCompletionNotification from './components/LessonCompletionNotification'; // Import the new component
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SkillProvider } from './contexts/SkillContext';
import { ChatProvider } from './contexts/ChatContext';
import { LessonProvider } from './contexts/LessonContext';

// Icons for sidebar
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const RequestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="12" y1="18" x2="12" y2="12"></line>
    <line x1="9" y1="15" x2="15" y2="15"></line>
  </svg>
);

const MarketplaceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const LessonsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);



const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const LoginIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
    <polyline points="10 17 15 12 10 7"></polyline>
    <line x1="15" y1="12" x2="3" y2="12"></line>
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

function AppContent() {
  const { currentUser, logout, getUserProfile, isNewSignup, clearNewSignupFlag } = useAuth();
  const [page, setPage] = useState('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMenuTooltip, setShowMenuTooltip] = useState(true); // Show tooltip for new users
  const [showLogoutMessage, setShowLogoutMessage] = useState(false); // For logout message
  const [pageParams, setPageParams] = useState(null);
  const [viewUserId, setViewUserId] = useState(null);
  const [timeCredits, setTimeCredits] = useState(0); // Default value
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  
  // State for signup bonus animation
  const [showBonusAnimation, setShowBonusAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  
  // Set profile based on authenticated user and handle initial page loading
  useEffect(() => {
    setIsLoading(true);
    
    // Set initial page based on authentication status
    if (currentUser) {
      // If user is logged in, set page to home
      setPage('home');
      
      // Get user profile data to display time credits
      const fetchUserProfile = async () => {
        try {
          // Get reference to the user document
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            // Set time credits from user profile
            setTimeCredits(userData.timeCredits || 2); // Default to 2 for new users
          } else {
            // For brand new users, default to 2 time credits
            setTimeCredits(2);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Default to 2 credits if there's an error
          setTimeCredits(2);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserProfile();
    } else {
      // If user is not logged in, set page to landing
      setPage('landing');
      setIsLoading(false);
    }
  }, [currentUser]);

  // Effect for handling new signup animation
  useEffect(() => {
    if (isNewSignup && currentUser) {
      setShowBonusAnimation(true);
      
      // Animation sequence
      setAnimationStep(1);
      const timer1 = setTimeout(() => {
        setAnimationStep(2);
        
        const timer2 = setTimeout(() => {
          setAnimationStep(3);
          
          const timer3 = setTimeout(() => {
            setShowBonusAnimation(false);
            clearNewSignupFlag(); // Clear the flag after animation
          }, 1500);
          
          return () => clearTimeout(timer3);
        }, 1500);
        
        return () => clearTimeout(timer2);
      }, 1500);
      
      return () => clearTimeout(timer1);
    }
  }, [isNewSignup, currentUser, clearNewSignupFlag]);
  
  // Handle navigation between pages
  const handleNavigation = (targetPage, params = null) => {
    setPage(targetPage);
    setPageParams(params);
    setSidebarOpen(false);
    setShowMenuTooltip(false); // Hide tooltip after navigation
    
    // Handle user profile viewing
    if (targetPage === 'viewProfile' && params && params.userId) {
      setViewUserId(params.userId);
    } else {
      setViewUserId(null);
    }
  };

  const handleRequestLesson = (user, skillName = null) => {
    // Navigate to the request page with the selected user and skill
    handleNavigation('request', { 
      tutorId: user.id,
      tutorName: user.name,
      skillName: skillName
    });
  };

  const handleLogout = () => {
    setShowLogoutMessage(true);
    setSidebarOpen(false);
    
    // After showing message, wait 2 seconds then logout
    setTimeout(() => {
      logout();
      setShowLogoutMessage(false);
    }, 2000);
  };

  return (
    <div className="app-container">
      {/* Sidebar Toggle Button with Tooltip */}
      <div style={{ position: 'relative' }}>
        <button 
          className={`sidebar-toggle ${!sidebarOpen && 'pulse'}`}
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
            setShowMenuTooltip(false);
          }}
          aria-label="Toggle navigation"
          style={{
            background: sidebarOpen ? '#333' : 'var(--primary)',
            boxShadow: '0 0 15px rgba(255, 143, 0, 0.5)',
            animation: !sidebarOpen ? 'pulse 2s infinite' : 'none'
          }}
        >
          {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo">
          <div className="logo-text">HourlyGood</div>
        </div>
        <nav>
          <div className={`nav-link ${page === 'landing' || page === 'home' ? 'active' : ''}`} onClick={() => handleNavigation(currentUser ? 'home' : 'landing')}>
            <HomeIcon /> <span>Home</span>
          </div>
          <div className={`nav-link ${page === 'request' ? 'active' : ''}`} onClick={() => handleNavigation('request')}>
            <RequestIcon /> <span>Request Lesson</span>
          </div>
          <div className={`nav-link ${page === 'marketplace' ? 'active' : ''}`} onClick={() => handleNavigation('marketplace')}>
            <MarketplaceIcon /> <span>Skill Marketplace</span>
          </div>
          <div className={`nav-link ${page === 'lessons' ? 'active' : ''}`} onClick={() => handleNavigation('lessons')}>
            <LessonsIcon /> <span>My Lessons</span>
          </div>

          {currentUser && (
            <>
              <div className={`nav-link ${page === 'chat' ? 'active' : ''}`} onClick={() => handleNavigation('chat')}>
                <ChatIcon /> <span>Messages</span>
              </div>
              <div className={`nav-link ${page === 'profile' ? 'active' : ''}`} onClick={() => handleNavigation('profile')}>
                <ProfileIcon /> <span>My Profile</span>
              </div>
              <div className="nav-link" onClick={handleLogout} style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px' }}>
                <LogoutIcon /> <span>Logout</span>
              </div>
            </>
          )}
          {!currentUser && (
            <div className={`nav-link ${page === 'login' ? 'active' : ''}`} onClick={() => handleNavigation('login')}>
              <LoginIcon /> <span>Login/Signup</span>
            </div>
          )}
        </nav>
        
        {currentUser && (
          <div style={{ padding: '20px', marginTop: '20px', borderTop: '1px solid #333' }}>
            <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>Time Credits</div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              background: '#252525',
              padding: '10px',
              borderRadius: '8px'
            }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'black',
                fontWeight: 'bold'
              }}>
                {timeCredits}
              </div>
              <div style={{ color: '#fff', fontWeight: '500' }}>
                {timeCredits === 1 ? '1 Hour' : `${timeCredits} Hours`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {showLogoutMessage && (
          <div className="logout-message">
            <div className="logout-message-content">
              <div style={{ fontSize: '50px', marginBottom: '10px' }}>👋</div>
              <div>Logging you out...</div>
            </div>
          </div>
        )}
        
        {/* Signup Bonus Animation */}
        {showBonusAnimation && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}>
            <div style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.7)',
              maxWidth: '90%',
              width: '400px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Step 1: Welcome */}
              {animationStep >= 1 && (
                <div style={{
                  opacity: animationStep === 1 ? 1 : 0.3,
                  transition: 'opacity 0.5s ease',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    fontSize: '5rem',
                    marginBottom: '1rem'
                  }}>
                    🎉
                  </div>
                  <h1 style={{
                    color: 'white',
                    fontSize: '2rem',
                    margin: '0.5rem 0'
                  }}>
                    Welcome to HourlyGood!
                  </h1>
                </div>
              )}
              
              {/* Step 2: Bonus Credits */}
              {animationStep >= 2 && (
                <div style={{
                  opacity: animationStep === 2 ? 1 : 0.3,
                  transition: 'opacity 0.5s ease',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    backgroundColor: 'var(--primary)',
                    padding: '1rem 2rem',
                    borderRadius: '50px',
                    margin: '1.5rem auto',
                    display: 'inline-block',
                    boxShadow: '0 0 20px var(--primary)',
                    animation: 'pulse 1s infinite'
                  }}>
                    <span style={{
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      color: 'black'
                    }}>
                      +2 Time Credits
                    </span>
                  </div>
                </div>
              )}
              
              {/* Step 3: Get Started */}
              {animationStep >= 3 && (
                <div style={{
                  opacity: animationStep === 3 ? 1 : 0.3,
                  transition: 'opacity 0.5s ease'
                }}>
                  <p style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    margin: '1rem 0'
                  }}>
                    Your signup bonus has been added!
                  </p>
                  <p style={{
                    color: '#aaa',
                    fontSize: '1rem'
                  }}>
                    Start exploring now...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Lesson Completion Notification for Rating */}
        {currentUser && <LessonCompletionNotification />}
        
        {isLoading ? (
          <div className="loading-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              border: '4px solid rgba(255, 143, 0, 0.1)', 
              borderTopColor: 'var(--primary)',
              animation: 'spin 1s infinite linear'
            }}></div>
            <div style={{ marginTop: '20px', color: '#aaa', fontSize: '16px' }}>Loading...</div>
          </div>
        ) : (
          <>
            {page === 'landing' && !currentUser && <LandingPage setPage={handleNavigation} />}
            {page === 'home' && currentUser && <LandingPage setPage={handleNavigation} />}
            {page === 'request' && <SkillRequestPage setPage={handleNavigation} pageParams={pageParams} />}
            {page === 'marketplace' && <SkillMarketplace setPage={handleNavigation} />}
            {page === 'lessons' && <SkillLessons setPage={handleNavigation} />}
            {page === 'profile' && <ProfilePage setPage={handleNavigation} />}
            {page === 'login' && !currentUser && <LoginPage setPage={handleNavigation} />}
            {page === 'chat' && <ChatPage setPage={handleNavigation} pageParams={pageParams} />}
            {page === 'viewProfile' && <UserProfilePage userId={viewUserId} setPage={handleNavigation} onRequestLesson={handleRequestLesson} />}
          </>
        )}
      </div>
      
      {/* Logout Message */}
      {showLogoutMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#252525',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 1000,
          animation: 'fadeIn 0.3s',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: '1px solid var(--primary)'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Successfully logged out. Redirecting...</span>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SkillProvider>
        <ChatProvider>
          <LessonProvider>
            <AppContent />
          </LessonProvider>
        </ChatProvider>
      </SkillProvider>
    </AuthProvider>
  );
}

export default App;