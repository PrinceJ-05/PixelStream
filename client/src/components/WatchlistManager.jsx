import React, { useState } from 'react';

const WatchlistManager = ({ movies, onAddMovie }) => {
  const [movieName, setMovieName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (movieName.trim()) {
      onAddMovie(movieName.trim());
      setMovieName('');
    }
  };

  return (
    <div className="watchlist-section glass">
      <h2 className="section-title">Your Watchlist</h2>

      <form onSubmit={handleSubmit} className="watchlist-controls">
        <input 
          type="text" 
          className="input-field" 
          placeholder="Add a new movie (e.g. Inception, The Matrix)..."
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '1rem 2rem' }}>
          Add Movie
        </button>
      </form>

      {movies.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          Your watchlist is empty. Start adding some movies!
        </div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie, index) => (
            <div key={index} className="movie-card">
              {movie}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistManager;
