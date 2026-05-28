import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OMDB_KEY = import.meta.env.VITE_OMDB_KEY;
const TRENDING_TITLES = ["Inception", "Interstellar", "The Dark Knight", "Avengers Endgame", "RRR", "KGF Chapter 2", "Pushpa: The Rise", "Pathaan"];

const LandingPage = () => {
  const navigate = useNavigate();
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const promises = TRENDING_TITLES.map(t => fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(t)}&apikey=${OMDB_KEY}`).then(r => r.json()));
        const results = await Promise.all(promises);
        const validMovies = results.filter(m => m.Response === "True" && m.Poster !== "N/A");
        setTrendingMovies(validMovies);
      } catch (err) {
        console.error("Failed to fetch trending movies", err);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="page-container" style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: '#0A0A0A',
        overflow: 'hidden'
      }}>
        
        {/* Dynamic Scrolling Collage Background */}
        {trendingMovies.length > 0 && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', gap: '10px',
            filter: 'blur(8px) brightness(0.3)',
            zIndex: 0,
            opacity: 0.6,
            animation: 'scrollBg 60s linear infinite'
          }}>
            {[...trendingMovies, ...trendingMovies, ...trendingMovies].map((m, i) => (
              <img key={i} src={m.Poster} alt="" style={{ height: '100%', objectFit: 'cover', width: '300px' }} />
            ))}
          </div>
        )}

        <style>
          {`@keyframes scrollBg { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}
          {`.hide-scrollbar::-webkit-scrollbar { display: none; }`}
          {`.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}
        </style>

        {/* Existing Film Grain Filter */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.1 0" />
          </filter>
        </svg>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          filter: 'url(#noise)',
          opacity: 0.5,
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        <div style={{ zIndex: 2, padding: '0 2rem' }}>
          <h1 className="bebas" style={{ fontSize: '90px', letterSpacing: '4px', margin: 0, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
            STREAM WITHOUT LIMITS
          </h1>
          <p style={{ fontSize: '20px', color: '#A3A3A3', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Subscribe. Watch. Repeat.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/plans')} style={{ fontSize: '16px', padding: '16px 32px' }}>
              EXPLORE PLANS
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/watchlist')} style={{ fontSize: '16px', padding: '16px 32px' }}>
              VIEW WATCHLIST
            </button>
          </div>
        </div>
      </section>

      {/* TRENDING NOW Section */}
      {trendingMovies.length > 0 && (
        <section style={{ padding: '4rem 2rem', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h2 className="bebas" style={{ fontSize: '42px', marginBottom: '2rem' }}>TRENDING NOW</h2>
            
            <div className="hide-scrollbar" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '2rem' }}>
              {trendingMovies.map((m, i) => (
                <div key={i} style={{ minWidth: '200px', width: '200px', flexShrink: 0, cursor: 'pointer', transition: 'transform 0.3s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  
                  <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                    <img src={m.Poster} alt={m.Title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3 className="bebas" style={{ fontSize: '20px', margin: '0 0 5px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.Title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#A3A3A3' }}>
                    <span>{m.Year}</span>
                    <span style={{ color: '#F5C518', fontWeight: 'bold' }}>★ {m.imdbRating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Feature Strip */}
      <section style={{ padding: '4rem 2rem', background: '#0A0A0A' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem', maxWidth: '1200px', margin: '0 auto'
        }}>
          {[
            { 
              icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>, 
              title: '4K Streaming', sub: 'Crystal clear ultra HD.' 
            },
            { 
              icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>, 
              title: '6 Devices', sub: 'Watch on any screen.' 
            },
            { 
              icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>, 
              title: '100 Movie Watchlist', sub: 'Save your favorites.' 
            },
            { 
              icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, 
              title: 'Cancel Anytime', sub: 'No hidden commitments.' 
            }
          ].map((feat, i) => (
            <div key={i} style={{
              padding: '2rem', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'default',
              background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(229,9,20,0.2)';
              e.currentTarget.style.borderColor = 'rgba(229,9,20,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}>
              <div style={{ marginBottom: '1rem' }}>{feat.icon}</div>
              <h3 className="bebas" style={{ fontSize: '24px', margin: 0 }}>{feat.title}</h3>
              <p style={{ color: '#A3A3A3', fontSize: '14px' }}>{feat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY PIXELSTREAM Stats */}
      <section style={{ padding: '6rem 2rem', background: '#141414', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="bebas" style={{ fontSize: '52px', margin: 0 }}>WHY PIXELSTREAM?</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div>
            <div className="bebas" style={{ fontSize: '64px', color: '#E50914', lineHeight: 1 }}>10M+</div>
            <div style={{ color: '#A3A3A3', fontSize: '16px', letterSpacing: '2px', textTransform: 'uppercase' }}>Subscribers</div>
          </div>
          <div>
            <div className="bebas" style={{ fontSize: '64px', color: '#E50914', lineHeight: 1 }}>4K</div>
            <div style={{ color: '#A3A3A3', fontSize: '16px', letterSpacing: '2px', textTransform: 'uppercase' }}>Ultra HD</div>
          </div>
          <div>
            <div className="bebas" style={{ fontSize: '64px', color: '#E50914', lineHeight: 1 }}>30</div>
            <div style={{ color: '#A3A3A3', fontSize: '16px', letterSpacing: '2px', textTransform: 'uppercase' }}>Day Plans</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0A0A0A', padding: '2rem', textAlign: 'center', borderTop: '2px solid #E50914' }}>
        <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
          PixelStream © 2026 | Powered by OMDb
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
