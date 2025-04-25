import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import SkillRequestPage from './components/SkillRequestPage';
import SkillMarketplace from './components/SkillMarketplace';
import SkillLessons from './components/SkillLessons';
import ProfilePage from './components/ProfilePage';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SkillProvider } from './contexts/SkillContext';
import { ChatProvider } from './contexts/ChatContext';

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
  const { currentUser, logout } = useAuth();
  const [page, setPage] = useState('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMenuTooltip, setShowMenuTooltip] = useState(true); // Show tooltip for new users
  const [showLogoutMessage, setShowLogoutMessage] = useState(false); // For logout message
  
  // Set profile based on authenticated user
  useEffect(() => {
    if (currentUser) {
      setPage('profile');
    } else {
      setPage('landing');
    }
  }, [currentUser]);

  // Handle navigation between pages
  const handleNavigation = (targetPage) => {
    setPage(targetPage);
    setSidebarOpen(false);
    setShowMenuTooltip(false); // Hide tooltip after navigation
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
          <div className={`nav-link ${page === 'landing' ? 'active' : ''}`} onClick={() => handleNavigation('landing')}>
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
        
        {page === 'landing' && <LandingPage setPage={setPage} />}
        {page === 'request' && <SkillRequestPage setPage={setPage} />}
        {page === 'marketplace' && <SkillMarketplace setPage={setPage} />}
        {page === 'lessons' && <SkillLessons setPage={setPage} />}
        {page === 'profile' && <ProfilePage setPage={setPage} />}
        {page === 'login' && <LoginPage setPage={setPage} />}
        {page === 'chat' && <ChatPage setPage={setPage} />}
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
          <AppContent />
        </ChatProvider>
      </SkillProvider>
    </AuthProvider>
  );
}

export default App;
