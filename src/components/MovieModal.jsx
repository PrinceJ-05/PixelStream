import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const MovieModal = ({ title, onClose }) => {
  const { watchlist, handleAddMovie, handleRemoveMovie, currentUser } = useAppContext();
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if movie is in watchlist
  const isInWatchlist = watchlist.some(m => m.title === title);

  useEffect(() => {
    // Close on ESC
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Fetch movie details
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const OMDB_KEY = import.meta.env.VITE_OMDB_KEY;
        const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_KEY}&plot=full`);
        const data = await res.json();
        if (data.Response === "True") {
          setMovieData(data);
        } else {
          setMovieData(null);
        }
      } catch (err) {
        console.error("Failed to fetch movie details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [title, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const onAdd = () => {
    if (!movieData) return;
    handleAddMovie({
      title: movieData.Title,
      year: movieData.Year,
      poster: movieData.Poster
    });
  };

  const onRemove = () => {
    handleRemoveMovie(title);
  };

  return (
    <div className="movie-modal-backdrop" onClick={handleBackdropClick}>
      <div className="movie-modal-container">
        {/* Close Button */}
        <button className="movie-modal-close" onClick={onClose}>✕</button>

        {loading ? (
          <div className="movie-modal-content">
            <div className="modal-left skeleton-pulse"></div>
            <div className="modal-right" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="skeleton-pulse" style={{ width: '60%', height: '40px', borderRadius: '4px' }}></div>
              <div className="skeleton-pulse" style={{ width: '80%', height: '20px', borderRadius: '4px' }}></div>
              <div className="skeleton-pulse" style={{ width: '40%', height: '60px', borderRadius: '4px' }}></div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '10px 0' }}></div>
              <div className="skeleton-pulse" style={{ width: '100%', height: '100px', borderRadius: '4px' }}></div>
              <div className="skeleton-pulse" style={{ width: '70%', height: '20px', borderRadius: '4px' }}></div>
            </div>
          </div>
        ) : movieData ? (
          <div className="movie-modal-content">
            {/* Left Column: Poster */}
            <div className="modal-left">
              {movieData.Poster && movieData.Poster !== "N/A" ? (
                <img src={movieData.Poster} alt={movieData.Title} className="modal-poster-img" />
              ) : (
                <div className="modal-poster-fallback">
                  <span style={{ fontSize: '64px' }}>🎬</span>
                  <div style={{ marginTop: '10px', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', padding: '0 10px' }}>{movieData.Title}</div>
                </div>
              )}
            </div>

            {/* Right Column: Details */}
            <div className="modal-right">
              <h2 className="bebas modal-title">{movieData.Title}</h2>
              
              {/* Pills Row */}
              <div className="modal-pills">
                {movieData.Genre.split(', ').map((g, i) => (
                  <span key={i} className="bebas pill pill-red">{g}</span>
                ))}
                <span className="bebas pill pill-grey">{movieData.Year}</span>
                <span className="bebas pill pill-grey">{movieData.Runtime}</span>
                <span className="bebas pill pill-grey">{movieData.Rated}</span>
              </div>

              {/* IMDb Rating */}
              <div className="modal-imdb">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#F5C518', fontSize: '28px' }}>★</span>
                  <span className="bebas" style={{ color: '#F5C518', fontSize: '32px', lineHeight: 1 }}>{movieData.imdbRating}</span>
                  <span style={{ color: '#737373', fontSize: '16px', fontWeight: 'bold' }}>/10</span>
                </div>
                <div style={{ color: '#737373', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>IMDb Rating</div>
              </div>

              <div className="modal-divider"></div>

              {/* Plot */}
              <div className="modal-plot-container">
                <div className="modal-label">PLOT</div>
                <div className="modal-plot-text">{movieData.Plot}</div>
              </div>

              {/* Director & Cast */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <span className="modal-label">DIRECTOR</span>
                  <span className="modal-value">{movieData.Director}</span>
                </div>
                <div>
                  <span className="modal-label">CAST</span>
                  <span className="modal-value">{movieData.Actors}</span>
                </div>
                {movieData.Awards && movieData.Awards !== "N/A" && (
                  <div>
                    <span className="modal-label">AWARDS</span>
                    <span className="modal-value" style={{ color: '#F5C518' }}>🏆 {movieData.Awards}</span>
                  </div>
                )}
              </div>

              {/* Language & Country */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <div className="modal-label">LANGUAGE</div>
                  <div className="modal-value">{movieData.Language}</div>
                </div>
                <div>
                  <div className="modal-label">COUNTRY</div>
                  <div className="modal-value">{movieData.Country}</div>
                </div>
              </div>

              <div className="modal-divider"></div>

              {/* Action Button */}
              {currentUser ? (
                isInWatchlist ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="modal-action-btn btn-in-watchlist" disabled>
                      ✓ IN YOUR WATCHLIST
                    </button>
                    <button className="modal-action-btn btn-remove" onClick={onRemove}>
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <button className="modal-action-btn btn-add" onClick={onAdd}>
                    + ADD TO WATCHLIST
                  </button>
                )
              ) : (
                <div style={{ color: '#737373', fontSize: '14px', textAlign: 'center', padding: '10px' }}>
                  Sign in to add movies to your watchlist
                </div>
              )}

            </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#A3A3A3' }}>
            Movie details not found.
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
