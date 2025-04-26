import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

function LoginPage({ setPage }) {
  const { signup, login, error: authError } = useAuth();
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Registration states
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      setPage('home');
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    }
    
    setLoading(false);
  };
  
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    setLoading(true);
    
    try {
      // The signup function in AuthContext now sets the isNewSignup flag
      await signup(email, password, name);
      // Navigate to home page - the animation will be shown there
      setPage('home');
    } catch (err) {
      setError('Failed to create account: ' + err.message);
      setLoading(false);
    }
  };
  
  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <div className="card fade-in" style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center' }}>{isRegistering ? 'Create Account' : 'Login'}</h2>
      
      {isRegistering ? (
        <form onSubmit={handleSignup} autoComplete="off">
          <div style={{ marginBottom: '1.3rem' }}>
            <label style={{ fontWeight: 500 }}>Full Name:</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#252525', border: '1px solid #333', color: '#fff' }}
            />
          </div>
          <div style={{ marginBottom: '1.3rem' }}>
            <label style={{ fontWeight: 500 }}>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#252525', border: '1px solid #333', color: '#fff' }}
            />
          </div>
          <div style={{ marginBottom: '1.3rem' }}>
            <label style={{ fontWeight: 500 }}>Password:</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"}
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '8px', 
                  background: '#252525', 
                  border: '1px solid #333', 
                  color: '#fff',
                  paddingRight: '40px' // Make room for the toggle button
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#aaa',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: '1.3rem' }}>
            <label style={{ fontWeight: 500 }}>Confirm Password:</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '8px', 
                  background: '#252525', 
                  border: '1px solid #333', 
                  color: '#fff',
                  paddingRight: '40px' // Make room for the toggle button
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#aaa',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {(error || authError) && <div style={{ color: '#e53935', marginBottom: 10 }}>{error || authError}</div>}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              fontWeight: 700, 
              fontSize: 18, 
              background: loading ? '#555' : 'var(--primary)',
              cursor: loading ? 'not-allowed' : 'pointer',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              color: 'black'
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleLogin} autoComplete="off">
          <div style={{ marginBottom: '1.3rem' }}>
            <label style={{ fontWeight: 500 }}>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#252525', border: '1px solid #333', color: '#fff' }}
            />
          </div>
          <div style={{ marginBottom: '1.3rem' }}>
            <label style={{ fontWeight: 500 }}>Password:</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"}
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '8px', 
                  background: '#252525', 
                  border: '1px solid #333', 
                  color: '#fff',
                  paddingRight: '40px' // Make room for the toggle button
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#aaa',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {(error || authError) && <div style={{ color: '#e53935', marginBottom: 10 }}>{error || authError}</div>}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              fontWeight: 700, 
              fontSize: 18, 
              background: loading ? '#555' : 'var(--primary)',
              cursor: loading ? 'not-allowed' : 'pointer',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              color: 'black'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={toggleForm} 
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--primary)', 
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </button>
      </div>
      
      <button 
        onClick={() => setPage('landing')} 
        style={{ 
          width: '100%', 
          marginTop: 20, 
          background: '#333',
          border: 'none',
          color: '#ddd',
          padding: '10px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default LoginPage;
