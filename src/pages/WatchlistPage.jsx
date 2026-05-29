import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import MoviePoster from '../components/MoviePoster';

// Make sure to set VITE_OMDB_KEY in client/.env
const OMDB_KEY = import.meta.env.VITE_OMDB_KEY;

const WatchlistPage = () => {
  const { watchlist, subscription, handleAddMovie, handleRemoveMovie } = useAppContext();
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const limit = subscription?.watchlistLimit || 0;
  const count = watchlist.length;
  const percentage = limit > 0 ? Math.min((count / limit) * 100, 100) : 0;

  // Debounce search
  useEffect(() => {
    if (!inputValue.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (!OMDB_KEY || OMDB_KEY === 'undefined') {
      alert("Error: VITE_OMDB_KEY is missing! Please restart your React server.");
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(inputValue)}&apikey=${OMDB_KEY}`);
        const data = await res.json();
        if (data.Search) {
          // Take top 6
          setSearchResults(data.Search.slice(0, 6));
          setShowDropdown(true);
        } else {
          setSearchResults([]);
          // Optional: handle data.Error if needed
        }
      } catch (err) {
        console.error("OMDb Search Error:", err);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const selectMovie = async (title) => {
    setInputValue('');
    setShowDropdown(false);

    try {
      const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_KEY}`);
      const data = await res.json();
      
      if (data.Response === "True") {
        const movieObj = {
          title: data.Title,
          poster: data.Poster,
          genre: data.Genre,
          rating: data.imdbRating,
          year: data.Year
        };
        handleAddMovie(movieObj);
      } else {
        alert("Could not fetch full details for this movie.");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching movie details.");
    }
  };

  const submitMovie = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      selectMovie(searchResults[0].Title);
    }
  };

  return (
    <div className="page-container section-padding" style={{ maxWidth: '1400px', margin: '0 auto', minHeight: '100vh' }}>
      
      {/* Header Row */}
      <div className="watchlist-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="bebas" style={{ fontSize: '42px', margin: 0 }}>MY WATCHLIST</h1>
        
        {subscription && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '14px', color: '#A3A3A3' }}>{count} / {limit} movies</span>
            <div style={{ width: '150px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${percentage}%`, background: '#E50914', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        )}
      </div>

      {/* Add Movie Bar */}
      {subscription && (
        <form className="watchlist-search" onSubmit={submitMovie} style={{ display: 'flex', gap: '10px', marginBottom: '4rem', position: 'relative' }} ref={dropdownRef}>
          <div style={{ flexGrow: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>🔍</span>
            <input 
              type="text" 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onFocus={() => { if(searchResults.length > 0) setShowDropdown(true); }}
              placeholder="Search titles to add to your watchlist..."
              style={{
                width: '100%', padding: '16px 20px 16px 50px',
                background: '#141414', border: '1px solid rgba(255,255,255,0.08)',
                color: 'white', fontSize: '16px', borderRadius: '4px',
                fontFamily: '"Inter", sans-serif'
              }}
            />

            {/* Dropdown Results */}
            {showDropdown && searchResults.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
                background: '#1E1E1E', borderRadius: '8px', overflow: 'hidden', zIndex: 100,
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {searchResults.map((result, idx) => (
                  <div key={idx} onClick={() => selectMovie(result.Title)} style={{
                    padding: '12px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                    borderBottom: idx !== searchResults.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ fontWeight: 600 }}>{result.Title}</span>
                    <span style={{ color: '#A3A3A3' }}>{result.Year}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 40px', fontSize: '16px', letterSpacing: '1px' }}>
            ADD
          </button>
        </form>
      )}

      {!subscription ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#A3A3A3' }}>
          <p>You need an active subscription to use the watchlist.</p>
        </div>
      ) : count === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          {/* Simple CSS Art Film Reel */}
          <div style={{ width: '80px', height: '80px', border: '4px dashed #E50914', borderRadius: '50%', margin: '0 auto 2rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'spin 10s linear infinite' }}>
             <div style={{ width: '30px', height: '30px', background: '#E50914', borderRadius: '50%' }} />
          </div>
          <p style={{ color: '#A3A3A3', fontSize: '18px' }}>Your watchlist is empty. Start adding movies!</p>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div className="watchlist-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {watchlist.map((movie, idx) => (
            <MoviePoster key={idx} movie={movie} onRemove={() => handleRemoveMovie(movie.title)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
