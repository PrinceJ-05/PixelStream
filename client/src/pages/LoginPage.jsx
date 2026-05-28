import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser, registerUser } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      if (isLogin) {
        await loginUser(email);
        navigate('/');
      } else {
        if (!name) {
          setError('Name is required');
          return;
        }
        await registerUser(name, email);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  const inputStyle = {
    width: '100%',
    height: '48px',
    background: '#1E1E1E',
    border: '1px solid transparent',
    borderRadius: '12px',
    padding: '0 16px',
    color: 'white',
    fontSize: '16px',
    fontFamily: '"Inter", sans-serif',
    outline: 'none',
    transition: 'border 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    color: '#A3A3A3',
    fontSize: '12px',
    textTransform: 'uppercase',
    marginBottom: '8px',
    fontFamily: '"Inter", sans-serif',
    fontWeight: 600,
    letterSpacing: '1px'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#0A0A0A',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Subtle Red Radial Glow Bottom-Left */}
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(229,9,20,0.15) 0%, transparent 60%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        background: '#141414',
        borderRadius: '8px',
        borderTop: '3px solid #E50914',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
      }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="bebas" style={{ fontSize: '36px', margin: 0, letterSpacing: '2px' }}>
            <span style={{ color: 'white' }}>PIXEL</span>
            <span style={{ color: '#E50914' }}>STREAM</span>
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: isLogin ? 'white' : '#A3A3A3',
              fontSize: '14px',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              paddingBottom: '12px',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            SIGN IN
            {isLogin && <div style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '2px', background: '#E50914' }} />}
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: !isLogin ? 'white' : '#A3A3A3',
              fontSize: '14px',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              paddingBottom: '12px',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            CREATE ACCOUNT
            {!isLogin && <div style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '2px', background: '#E50914' }} />}
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(229,9,20,0.1)', color: '#E50914', padding: '12px', borderRadius: '4px', fontSize: '14px', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(229,9,20,0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#E50914'}
                onBlur={e => e.target.style.borderColor = 'transparent'}
              />
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <label style={labelStyle}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#E50914'}
              onBlur={e => e.target.style.borderColor = 'transparent'}
            />
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              height: '48px',
              background: 'linear-gradient(135deg, #E50914, #B20710)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '18px',
              fontFamily: '"Bebas Neue", sans-serif',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'filter 0.2s',
              marginBottom: '1rem'
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.8)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
          >
            ENTER PIXELSTREAM
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ color: '#A3A3A3', fontSize: '13px', cursor: 'pointer', fontFamily: '"Inter", sans-serif' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = '#A3A3A3'}
          >
            {isLogin ? 'New here? Create Account' : 'Already have an account? Sign In'}
          </span>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
