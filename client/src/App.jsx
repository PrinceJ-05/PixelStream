import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';

// Pages
import LandingPage from './pages/LandingPage';
import PlansPage from './pages/PlansPage';
import WatchlistPage from './pages/WatchlistPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

const Navbar = () => {
  const { watchlist, currentUser, logout } = useAppContext();
  const location = useLocation();

  // Don't show navbar on login page
  if (location.pathname === '/login') return null;

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
      <div style={{ fontSize: '28px', fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '2px' }}>
        <span style={{ color: 'white' }}>Pixel</span>
        <span style={{ color: '#E50914' }}>Stream</span>
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {[
          { path: '/', label: 'HOME' },
          { path: '/plans', label: 'PLANS' },
          { path: '/watchlist', label: 'WATCHLIST', badge: watchlist.length },
          { path: '/dashboard', label: 'DASHBOARD' }
        ].map(link => (
          <NavLink 
            key={link.path}
            to={link.path}
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: isActive ? 'white' : '#A3A3A3',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '2px',
              fontWeight: 600,
              textTransform: 'uppercase',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            })}
          >
            {({ isActive }) => (
              <>
                {link.label}
                {link.badge !== undefined && link.badge > 0 && (
                  <span style={{
                    background: '#E50914',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px', height: '20px',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontSize: '11px', fontWeight: 'bold'
                  }}>
                    {link.badge}
                  </span>
                )}
                {/* Red Underline Animation trick done inline */}
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: 0,
                  width: isActive ? '100%' : '0%',
                  height: '2px',
                  background: '#E50914',
                  transition: 'width 0.3s ease'
                }} />
              </>
            )}
          </NavLink>
        ))}

        {/* SIGN OUT BUTTON */}
        {currentUser && (
          <button 
            onClick={logout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#A3A3A3',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '2px',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '2rem'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = '#A3A3A3'}
          >
            SIGN OUT
          </button>
        )}
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAppContext();
  
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  return (
    <Router>
      <AppProvider>
        <Navbar />
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
