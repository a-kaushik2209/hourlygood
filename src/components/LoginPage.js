import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      setPage('profile');
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
      await signup(email, password, name);
      setPage('profile');
    } catch (err) {
      setError('Failed to create account: ' + err.message);
    }
    
    setLoading(false);
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
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#252525', border: '1px solid #333', color: '#fff' }}
            />
          </div>
          <div style={{ marginBottom: '1.3rem' }}>
            <label style={{ fontWeight: 500 }}>Confirm Password:</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#252525', border: '1px solid #333', color: '#fff' }}
            />
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
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#252525', border: '1px solid #333', color: '#fff' }}
            />
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
