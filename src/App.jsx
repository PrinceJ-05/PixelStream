import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';

// Pages
import LandingPage from './pages/LandingPage';
import PlansPage from './pages/PlansPage';
import WatchlistPage from './pages/WatchlistPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

import MovieModal from './components/MovieModal';

const Navbar = () => {
  const { watchlist, currentUser, logout } = useAppContext();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't show navbar on login page
  if (location.pathname === '/login') return null;

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/plans', label: 'PLANS' },
    { path: '/watchlist', label: 'WATCHLIST', badge: watchlist.length },
    { path: '/dashboard', label: 'DASHBOARD' }
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav style={{
      position: 'fixed',
      top: 0, width: '100%',
      backgroundColor: '#0A0A0A',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      zIndex: 1000
    }}>
      <div style={{ fontSize: '28px', fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '2px', zIndex: 1001 }}>
        <span style={{ color: 'white' }}>Pixel</span>
        <span style={{ color: '#E50914' }}>Stream</span>
      </div>
      
      {/* Desktop Links */}
      <div className="desktop-only mobile-flex" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {navLinks.map(link => (
          <NavLink 
            key={link.path}
            to={link.path} 
            style={({ isActive }) => ({
              color: isActive ? 'white' : '#A3A3A3',
              textDecoration: 'none',
              fontSize: '14px',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              letterSpacing: '1px',
              transition: 'color 0.2s',
              position: 'relative'
            })}
          >
            {link.label}
            {link.badge > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-12px',
                background: '#E50914', color: 'white', fontSize: '10px',
                padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold'
              }}>
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
        {currentUser && (
          <button 
            onClick={logout}
            style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', padding: '6px 16px', borderRadius: '4px',
              cursor: 'pointer', fontSize: '12px', fontFamily: '"Inter", sans-serif',
              fontWeight: 600, transition: 'border 0.2s'
            }}
          >
            SIGN OUT
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="mobile-only" style={{ zIndex: 1001 }}>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-only mobile-nav-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
          background: 'rgba(10, 10, 10, 0.98)', zIndex: 1000,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2rem'
        }}>
          {navLinks.map(link => (
            <NavLink 
              key={link.path}
              to={link.path} 
              onClick={closeMenu}
              style={({ isActive }) => ({
                color: isActive ? 'white' : '#A3A3A3',
                textDecoration: 'none',
                fontSize: '24px',
                fontFamily: '"Bebas Neue", sans-serif',
                letterSpacing: '2px'
              })}
            >
              {link.label}
            </NavLink>
          ))}
          {currentUser && (
            <button 
              onClick={() => { logout(); closeMenu(); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#A3A3A3',
                fontSize: '24px',
                fontFamily: '"Bebas Neue", sans-serif',
                letterSpacing: '2px',
                marginTop: '2rem'
              }}
            >
              SIGN OUT
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAppContext();
  
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  
  return children;
};

const GlobalModalRenderer = () => {
  const { selectedMovieForModal, closeMovieModal } = useAppContext();
  if (!selectedMovieForModal) return null;
  return <MovieModal title={selectedMovieForModal} onClose={closeMovieModal} />;
};

function App() {
  return (
    <Router>
      <AppProvider>
        <Navbar />
        <GlobalModalRenderer />
        <div style={{ paddingTop: '80px' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
            <Route path="/plans" element={<ProtectedRoute><PlansPage /></ProtectedRoute>} />
            <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          </Routes>
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;
