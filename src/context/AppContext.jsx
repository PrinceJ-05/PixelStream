import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use relative /api in production (Vercel) and localhost in development
  const API_URL = import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:8080/api';
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchWatchlist();
    }
  }, [currentUser]);

  const checkAuth = () => {
    const storedUser = localStorage.getItem('pixelstream_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  };

  const loginUser = async (email) => {
    try {
      const res = await fetch(`${API_URL}/users/email/${email}`);
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'User not found', 'error');
      } else {
        localStorage.setItem('pixelstream_user', JSON.stringify({ _id: data._id, name: data.name }));
        setCurrentUser({ _id: data._id, name: data.name });
        showToast(`Welcome back, ${data.name}!`, 'success');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const registerUser = async (name, email) => {
    try {
      const res = await fetch(`${API_URL}/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      
      if (!res.ok && !data.user) {
        showToast(data.error || 'Failed to register', 'error');
      } else {
        const userData = data.user || data;
        localStorage.setItem('pixelstream_user', JSON.stringify({ _id: userData._id, name: userData.name }));
        setCurrentUser({ _id: userData._id, name: userData.name });
        showToast(`Account created for ${userData.name}!`, 'success');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('pixelstream_user');
    setCurrentUser(null);
    setSubscription(null);
    setWatchlist([]);
    navigate('/login');
  };

  const fetchWatchlist = async () => {
    try {
      const res = await fetch(`${API_URL}/watchlist/${currentUser._id}`);
      const data = await res.json();
      setWatchlist(data.movies || []);
      if (data.subscription) {
        setSubscription(data.subscription);
      } else {
        setSubscription(null);
      }
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    }
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleSubscribe = async (planName) => {
    if (!currentUser) return showToast('Please wait for user to load', 'error');
    
    try {
      const res = await fetch(`${API_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id, planName })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to subscribe', 'error');
      } else {
        setSubscription(data);
        setWatchlist([]);
        showToast(`Successfully subscribed to ${planName}!`, 'success');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const handleRenew = async () => {
    if (!subscription) return;
    try {
      const res = await fetch(`${API_URL}/subscription/renew/${subscription._id}`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to renew', 'error');
      } else {
        setSubscription(data);
        showToast('Subscription renewed successfully!', 'success');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const handleAddMovie = async (movieObj) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_URL}/watchlist/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id, movie: movieObj })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to add movie', 'error');
      } else {
        setWatchlist(data.movies);
        showToast(`Added "${movieObj.title}" to watchlist.`, 'success');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  const handleRemoveMovie = async (movieTitle) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_URL}/watchlist/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id, movieTitle })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to remove movie. Try again.', 'error');
      } else {
        setWatchlist(data.movies);
        showToast(`✓ ${movieTitle} removed from watchlist`, 'success');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  // Helper dynamic variable
  const isExpired = subscription ? new Date(subscription.expiryDate) < new Date() : false;

  const value = {
    currentUser,
    subscription,
    watchlist,
    toasts,
    loading,
    isExpired,
    loginUser,
    registerUser,
    logout,
    handleSubscribe,
    handleRenew,
    handleAddMovie,
    handleRemoveMovie
  };

  if (loading) return null; // Don't flash UI before checking auth

  return (
    <AppContext.Provider value={value}>
      {children}
      {/* Global Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};
