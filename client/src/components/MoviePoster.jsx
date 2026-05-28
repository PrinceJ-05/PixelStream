import React from 'react';

const MoviePoster = ({ movie }) => {
  const { title, poster, genre, rating, year } = movie;

  const hasPoster = poster && poster !== "N/A";

  return (
    <div style={{
      position: 'relative',
      width: '180px',
      height: '270px',
      borderRadius: '4px',
      overflow: 'hidden',
      background: hasPoster ? `url(${poster}) center/cover no-repeat` : 'linear-gradient(to top, #0A0A0A 0%, #4A00E0 100%)',
      borderTop: `3px solid #E50914`,
      borderLeft: '1px solid rgba(255,255,255,0.05)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      padding: '1rem',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.querySelector('.play-overlay').style.opacity = '1';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.querySelector('.play-overlay').style.opacity = '0';
    }}>
      
      {/* Dark gradient overlay for text readability */}
      {hasPoster && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          zIndex: 1
        }} />
      )}

      {/* Remove button mockup */}
      <button style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }}>✕</button>

      {/* Play Overlay */}
      <div className="play-overlay" style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center',
        opacity: 0, transition: 'opacity 0.3s ease', zIndex: 5
      }}>
        <div style={{ width: '50px', height: '50px', background: '#E50914', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 15px rgba(229,9,20,0.6)' }}>
          <span style={{ fontSize: '20px', marginLeft: '4px', color: 'white' }}>▶</span>
        </div>
      </div>

      <div style={{ zIndex: 2, position: 'relative' }}>
        
        {/* Fallback Icon */}
        {!hasPoster && (
           <div style={{ position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)', opacity: 0.2 }}>
             <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
           </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4px' }}>
          <div>
            <span style={{ background: '#E50914', color: 'white', padding: '2px 6px', borderRadius: '2px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', marginRight: '6px' }}>
              {genre ? genre.split(',')[0] : 'Unknown'}
            </span>
            <span style={{ color: '#A3A3A3', fontSize: '10px' }}>{year}</span>
          </div>
          <span style={{ color: '#F5C518', fontWeight: 'bold', fontSize: '11px' }}>★ {rating}</span>
        </div>
        <h3 className="bebas" style={{ fontSize: '16px', margin: 0, lineHeight: 1.1, textShadow: '0 2px 4px rgba(0,0,0,0.8)', color: 'white' }}>
          {title}
        </h3>
      </div>
    </div>
  );
};

export default MoviePoster;
