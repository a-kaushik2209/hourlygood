import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function LandingPage({ setPage, profile, showLogin }) {
  const { currentUser } = useAuth();
  // Helper function for section animations
  const sectionStyle = (delay) => ({
    opacity: 0,
    animation: 'fadeIn 1s forwards',
    animationDelay: `${delay}s`,
    animationFillMode: 'forwards'
  });

  // Helper function for element animations
  const animateElement = (delay, duration = 0.5) => ({
    opacity: 0,
    transform: 'translateY(20px)',
    animation: `slideUpFade ${duration}s ease forwards`,
    animationDelay: `${delay}s`,
    animationFillMode: 'forwards'
  });

  return (
    <div style={{ padding: '0', overflow: 'hidden' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative',
        padding: '80px 20px', 
        background: 'linear-gradient(135deg, var(--dark) 0%, #000 100%)',
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Background animations */}
        <div className="pulse" style={{ position: 'absolute', top: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255, 143, 0, 0.03)', zIndex: 0 }}></div>
        <div className="pulse" style={{ position: 'absolute', bottom: '5%', left: '10%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255, 143, 0, 0.05)', zIndex: 0, animationDelay: '0.5s' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: 'clamp(3rem, 8vw, 5rem)', 
            fontWeight: 900, 
            marginBottom: 10,
            background: 'linear-gradient(45deg, var(--primary), var(--primary-light))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            letterSpacing: '-2px',
            marginBottom: '10px',
            animation: 'slideUpFade 1s ease-out'
          }}>HourlyGood</h1>
          
          <div style={{ fontWeight: 600, fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', marginBottom: 30, opacity: 0.9, animation: 'slideUpFade 1s ease-out 0.2s forwards', opacity: 0 }}>
            Share Skills. Earn Time. Learn Anything.
          </div>
          
          <p style={{ fontSize: '1.2rem', margin: '0 auto 40px', lineHeight: 1.7, maxWidth: 700, opacity: 0, animation: 'slideUpFade 1s ease-out 0.4s forwards' }}>
            Teach what you know for 1 hour and earn time credits to learn what you want from others.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', opacity: 0, animation: 'slideUpFade 1s ease-out 0.6s forwards' }}>
            {!currentUser ? (
              <>
                <button 
                  onClick={() => setPage('login')} 
                  style={{ 
                    fontSize: 17,
                    fontWeight: 700,
                    padding: '12px 25px',
                    minWidth: '200px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                  <span style={{ position: 'relative', zIndex: 2 }}>
                  Create an Account
                  </span>
                </button>
                
                <button 
                  onClick={() => setPage('marketplace')}
                  style={{ 
                    fontSize: 17,
                    fontWeight: 700,
                    background: 'rgba(255,255,255,0.15)',
                    padding: '12px 25px',
                    minWidth: '200px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                  <span style={{ position: 'relative', zIndex: 2 }}>
                  Browse Skills
                  </span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setPage('request')} 
                  style={{ 
                    fontSize: 17,
                    fontWeight: 700,
                    padding: '12px 25px',
                    minWidth: '200px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                  <span style={{ position: 'relative', zIndex: 2 }}>
                  Request a Lesson
                  </span>
                </button>
                
                <button 
                  onClick={() => setPage('marketplace')}
                  style={{ 
                    fontSize: 17,
                    fontWeight: 700,
                    background: 'rgba(255,255,255,0.15)',
                    padding: '12px 25px',
                    minWidth: '200px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                  <span style={{ position: 'relative', zIndex: 2 }}>
                  Browse Skills
                  </span>
                </button>
                
                <button 
                  onClick={() => setPage('lessons')}
                  style={{ 
                    fontSize: 17,
                    fontWeight: 700,
                    background: 'rgba(255,255,255,0.15)',
                    padding: '12px 25px',
                    minWidth: '200px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                  <span style={{ position: 'relative', zIndex: 2 }}>
                  My Lessons
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Down arrow animation */}
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite',
          cursor: 'pointer'
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 20px', background: '#181818', ...sectionStyle(0.7) }} className="testimonial-section">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 60, fontSize: '2.5rem', fontWeight: 800 }}>
            <span style={{ color: 'var(--primary)' }}>Key</span> Features
          </h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
            {/* Feature 1 */}
            <div style={{ flex: '1 1 300px', maxWidth: '350px', padding: '20px', borderRadius: '12px', background: '#252525', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', transition: 'all 0.4s ease', cursor: 'pointer', ...animateElement(0.4) }} className="feature-card">
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '30px', transition: 'transform 0.3s, box-shadow 0.3s', boxShadow: '0 5px 15px rgba(255, 143, 0, 0.3)' }} className="icon-container">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Time-Based Exchange</h3>
              <p style={{ color: '#ccc', lineHeight: 1.6 }}>Teach for one hour, earn one time credit. Use your credits to learn any skill from other users in the community.</p>
            </div>
            
            {/* Feature 2 */}
            <div style={{ flex: '1 1 300px', maxWidth: '350px', padding: '20px', borderRadius: '12px', background: '#252525', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', transition: 'all 0.4s ease', cursor: 'pointer', ...animateElement(0.4) }} className="feature-card">
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '30px', transition: 'transform 0.3s, box-shadow 0.3s', boxShadow: '0 5px 15px rgba(255, 143, 0, 0.3)' }} className="icon-container">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Skill Marketplace</h3>
              <p style={{ color: '#ccc', lineHeight: 1.6 }}>Browse through diverse skills offered by community members, from cooking to coding, music to mathematics.</p>
            </div>
            
            {/* Feature 3 */}
            <div style={{ flex: '1 1 300px', maxWidth: '350px', padding: '20px', borderRadius: '12px', background: '#252525', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', transition: 'all 0.4s ease', cursor: 'pointer', ...animateElement(0.4) }} className="feature-card">
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '30px', transition: 'transform 0.3s, box-shadow 0.3s', boxShadow: '0 5px 15px rgba(255, 143, 0, 0.3)' }} className="icon-container">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Integrated Messaging</h3>
              <p style={{ color: '#ccc', lineHeight: 1.6 }}>Coordinate your lessons with built-in messaging to schedule sessions, discuss details, and connect with your teacher or student.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '80px 20px', background: '#222222', ...sectionStyle(0.5) }} className="parallax-section">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 60, fontSize: '2.5rem', fontWeight: 800 }}>
            How <span style={{ color: 'var(--primary)' }}>HourlyGood</span> Works
          </h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
            {/* Left side - Image */}
            <div style={{ flex: '1 1 400px', maxWidth: '500px' }}>
              <div style={{ 
                width: '100%', 
                height: '350px', 
                background: '#252525', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {/* Illustration for skill exchange */}
                <svg 
                  viewBox="0 0 800 600" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                >
                  {/* Background */}
                  <rect x="0" y="0" width="800" height="600" fill="#252525" />
                  
                  {/* Skill Exchange Flow */}
                  <circle cx="200" cy="200" r="80" fill="#333" stroke="var(--primary)" strokeWidth="3" />
                  <text x="200" y="200" textAnchor="middle" fill="#ddd" fontSize="18" fontWeight="bold">Teacher</text>
                  
                  <circle cx="600" cy="200" r="80" fill="#333" stroke="var(--primary)" strokeWidth="3" />
                  <text x="600" y="200" textAnchor="middle" fill="#ddd" fontSize="18" fontWeight="bold">Student</text>
                  
                  <circle cx="400" cy="400" r="100" fill="#333" stroke="var(--primary)" strokeWidth="3" />
                  <text x="400" y="390" textAnchor="middle" fill="#ddd" fontSize="18" fontWeight="bold">Time</text>
                  <text x="400" y="420" textAnchor="middle" fill="#ddd" fontSize="18" fontWeight="bold">Credits</text>
                  
                  {/* Arrows */}
                  <path d="M280 200 L320 200 L320 350 L380 350" fill="none" stroke="var(--primary)" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  <path d="M520 200 L480 200 L480 350 L420 350" fill="none" stroke="var(--primary)" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  <path d="M400 300 L400 250" fill="none" stroke="var(--primary)" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  
                  {/* Define arrowhead marker */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="var(--primary)" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>
            
            {/* Right side - Steps */}
            <div style={{ flex: '1 1 400px', maxWidth: '500px' }}>
              <div style={{ marginBottom: '25px', display: 'flex', gap: '15px' }}>
                <div style={{ 
                  minWidth: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>1</div>
                <div>
                  <h3 style={{ marginBottom: '8px', fontSize: '1.3rem' }}>Create Your Profile</h3>
                  <p style={{ color: '#ccc', lineHeight: 1.6 }}>Sign up and list the skills you can teach and those you want to learn. Your skills become visible to the community.</p>
                </div>
              </div>
              
              <div style={{ marginBottom: '25px', display: 'flex', gap: '15px' }}>
                <div style={{ 
                  minWidth: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>2</div>
                <div>
                  <h3 style={{ marginBottom: '8px', fontSize: '1.3rem' }}>Teach & Earn Credits</h3>
                  <p style={{ color: '#ccc', lineHeight: 1.6 }}>Teach a one-hour lesson in your area of expertise and earn one time credit. Each lesson is limited to one hour.</p>
                </div>
              </div>
              
              <div style={{ marginBottom: '25px', display: 'flex', gap: '15px' }}>
                <div style={{ 
                  minWidth: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>3</div>
                <div>
                  <h3 style={{ marginBottom: '8px', fontSize: '1.3rem' }}>Spend Credits & Learn</h3>
                  <p style={{ color: '#ccc', lineHeight: 1.6 }}>Use your earned time credits to learn any skill from others in the community. One credit equals one hour of learning.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={{ 
        padding: '80px 20px', 
        background: 'var(--dark)', 
        color: 'white',
        ...sectionStyle(0.7)
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: 60, fontSize: '2.5rem', fontWeight: 800 }}>
            Our <span style={{ color: 'var(--primary)' }}>Community</span> in Numbers
          </h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px' }}>
            <div style={{ flex: '1 1 200px', maxWidth: '250px' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)' }}>500+</div>
              <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>Active Users</div>
            </div>
            
            <div style={{ flex: '1 1 200px', maxWidth: '250px' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)' }}>1000+</div>
              <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>Skills Available</div>
            </div>
            
            <div style={{ flex: '1 1 200px', maxWidth: '250px' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)' }}>2500+</div>
              <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>Lessons Completed</div>
            </div>
            
            <div style={{ flex: '1 1 200px', maxWidth: '250px' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)' }}>4.8</div>
              <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ padding: '80px 20px', background: '#181818', ...sectionStyle(0.9) }} className="cta-section">
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: 20, fontSize: '2.5rem', fontWeight: 800 }}>Ready to Share Your Skills?</h2>
          <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: 40, lineHeight: 1.6 }}>
            {currentUser ? 'Start sharing your knowledge and learning new skills today!' : 'Join our community of learners and teachers to exchange knowledge and skills.'}
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {!currentUser ? (
              <>
                <button 
                  onClick={() => setPage('login')} 
                  style={{ 
                    fontSize: 18,
                    fontWeight: 700,
                    padding: '15px 30px',
                  }}>
                  Create Account
                </button>
                
                <button 
                  onClick={() => setPage('marketplace')} 
                  style={{ 
                    fontSize: 18,
                    fontWeight: 700,
                    background: 'var(--dark)',
                    padding: '15px 30px',
                  }}>
                  Browse Skills
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setPage('request')} 
                  style={{ 
                    fontSize: 18,
                    fontWeight: 700,
                    padding: '15px 30px',
                  }}>
                  Request a Lesson
                </button>
                
                <button 
                  onClick={() => setPage('marketplace')} 
                  style={{ 
                    fontSize: 18,
                    fontWeight: 700,
                    background: 'var(--dark)',
                    padding: '15px 30px',
                  }}>
                  Browse Skills
                </button>
              </>
            )}
          </div>
          
          {currentUser && (
            <div style={{ marginTop: 20 }}>
              <button 
                onClick={() => setPage('profile')} 
                style={{ 
                  background: 'var(--primary-dark)',
                  fontSize: 16,
                  fontWeight: 600,
                  padding: '10px 20px',
                }}>
                View My Profile
              </button>
            </div>
          )}
          
          {showLogin && !currentUser && (
            <div style={{ marginTop: 20 }}>
              <button 
                onClick={() => setPage('login')} 
                style={{ 
                  background: 'transparent',
                  color: 'var(--primary)',
                  border: '2px solid var(--primary)',
                  fontSize: 16,
                  fontWeight: 600,
                  padding: '10px 20px',
                }}>
                Login
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '16px 10px', background: 'var(--dark)', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ 
            fontSize: '1.8rem', 
            fontWeight: 800, 
            marginBottom: 20,
            background: 'linear-gradient(45deg, var(--primary), var(--primary-light))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            display: 'inline-block'
          }}>HourlyGood</div>
          
          <p style={{ opacity: 0.7, marginBottom: 20 }}>Share Skills. Earn Time. Learn Anything.</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: 10, flexWrap: 'wrap' }}>
            <a href="#" style={{ color: 'white', opacity: 0.7, textDecoration: 'none' }}>About</a>
            <a href="#" style={{ color: 'white', opacity: 0.7, textDecoration: 'none' }}>Contact</a>
            <a href="#" style={{ color: 'white', opacity: 0.7, textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'white', opacity: 0.7, textDecoration: 'none' }}>Terms of Service</a>
          </div>
          
          <div style={{ opacity: 0.5, fontSize: '0.9rem' }}> 2025 HourlyGood. All rights reserved.</div>
        </div>
      </footer>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-20px) translateX(-50%); }
          60% { transform: translateY(-10px) translateX(-50%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
        }
        .feature-card:hover .icon-container {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 8px 20px rgba(255, 143, 0, 0.4);
        }
        .pulse {
          animation: pulse 3s infinite ease-in-out;
        }
        .parallax-section {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        .testimonial-section {
          position: relative;
          overflow: hidden;
        }
        .testimonial-section::before {
          content: '';
          position: absolute;
          top: -50px;
          left: -50px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: rgba(255, 143, 0, 0.03);
          z-index: 0;
          animation: float 6s infinite ease-in-out;
        }
        .testimonial-section::after {
          content: '';
          position: absolute;
          bottom: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: rgba(255, 143, 0, 0.03);
          z-index: 0;
          animation: float 8s infinite ease-in-out reverse;
        }
        .cta-section {
          position: relative;
          overflow: hidden;
        }
        .cta-section button {
          transition: all 0.3s ease;
        }
        .cta-section button:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
