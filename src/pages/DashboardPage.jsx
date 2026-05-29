import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import MoviePoster from '../components/MoviePoster';

const DashboardPage = () => {
  const { currentUser, subscription, watchlist, handleRenew, isExpired } = useAppContext();
  const navigate = useNavigate();

  // Calculations
  let daysRemaining = 0;
  let totalDays = 30; 
  let usedPercentage = 0;

  if (subscription) {
    totalDays = subscription.validityDays || 30;
    const expiryDate = new Date(subscription.expiryDate);
    const now = new Date();
    
    if (expiryDate > now) {
      const diffTime = Math.abs(expiryDate - now);
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    const usedDays = totalDays - daysRemaining;
    usedPercentage = Math.min((usedDays / totalDays) * 100, 100);
  }

  const recentMovies = watchlist.slice(-4).reverse();
  const firstMoviePoster = watchlist.length > 0 && watchlist[0].poster && watchlist[0].poster !== "N/A" ? watchlist[0].poster : null;

  const userName = currentUser?.name ? currentUser.name.split(' ')[0].toUpperCase() : 'USER';
  const initial = userName.charAt(0);

  // SVG Progress Ring
  const circleRadius = 26;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleOffset = circleCircumference - (usedPercentage / 100) * circleCircumference;

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* Cinematic Banner */}
      <div className="dashboard-welcome" style={{
        position: 'relative', height: '180px', background: '#141414', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        {/* Banner Background Layers */}
        {firstMoviePoster && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${firstMoviePoster})`, backgroundSize: 'cover', backgroundPosition: 'center',
            filter: 'blur(20px)', opacity: 0.1, zIndex: 0
          }} />
        )}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%',
          background: 'linear-gradient(to right, rgba(229,9,20,0.3) 0%, transparent 100%)',
          zIndex: 1
        }} />

        {/* Banner Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="bebas dashboard-title" style={{ fontSize: '58px', color: 'white', margin: 0, lineHeight: 1.1, letterSpacing: '2px' }}>
            WELCOME BACK, {userName}
          </h1>
          <div style={{ color: '#A3A3A3', fontSize: '14px', marginTop: '8px' }}>
            Member since today · {subscription ? `${subscription.planName} Plan` : 'Free Account'}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #E50914, #B20710)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '36px',
            boxShadow: '0 0 20px rgba(229,9,20,0.6)', border: '2px solid rgba(255,255,255,0.1)'
          }} className="bebas">
            {initial}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
        
        {/* NO ACTIVE PLAN STATE */}
        {!subscription ? (
          <div style={{
            background: '#141414', borderRadius: '12px', padding: '5rem 2rem', textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h2 className="bebas" style={{ fontSize: '36px', color: '#A3A3A3', margin: '0 0 10px 0' }}>NO ACTIVE PLAN</h2>
            <p style={{ color: '#737373', fontSize: '16px', marginBottom: '2rem' }}>Subscribe to unlock your dashboard</p>
            <button className="btn" style={{
              background: 'linear-gradient(135deg, #E50914, #B20710)', color: 'white', padding: '16px 40px',
              fontSize: '18px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '1px'
            }} onClick={() => navigate('/plans')}>
              EXPLORE PLANS
            </button>
          </div>
        ) : (
          <>
            {/* STATS ROW */}
            <div className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              
              {/* Card 1: Active Plan */}
              <div className="stat-card" style={{ '--accent': '#F5C518' }}>
                <div className="stat-label">ACTIVE PLAN</div>
                <div className="bebas" style={{ fontSize: '32px', color: '#F5C518', lineHeight: 1 }}>{subscription.planName}</div>
                <div className="stat-sub">Active Subscription</div>
              </div>

              {/* Card 2: Days Remaining */}
              <div className="stat-card" style={{ '--accent': '#E50914', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="stat-label">DAYS REMAINING</div>
                  <div className="bebas" style={{ fontSize: '52px', color: '#E50914', lineHeight: 1 }}>{isExpired ? '0' : daysRemaining}</div>
                  <div className="stat-sub">days until expiry</div>
                </div>
                <div style={{ width: '60px', height: '60px', position: 'relative' }}>
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <circle cx="30" cy="30" r="28" fill="none" stroke="#E50914" strokeWidth="4" 
                            strokeDasharray={2 * Math.PI * 28} strokeDashoffset={(2 * Math.PI * 28) - (usedPercentage / 100) * (2 * Math.PI * 28)}
                            strokeLinecap="round" transform="rotate(-90 30 30)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
                  </svg>
                </div>
              </div>

              {/* Card 3: Watchlist */}
              <div className="stat-card" style={{ '--accent': '#FFFFFF' }}>
                <div className="stat-label">WATCHLIST</div>
                <div className="bebas" style={{ fontSize: '52px', color: 'white', lineHeight: 1 }}>{watchlist.length}</div>
                <div className="stat-sub">of {subscription.watchlistLimit} movies added</div>
              </div>

              {/* Card 4: Devices */}
              <div className="stat-card" style={{ '--accent': '#00A8E1' }}>
                <div className="stat-label">DEVICES</div>
                <div className="bebas" style={{ fontSize: '52px', color: '#00A8E1', lineHeight: 1 }}>{subscription.maxDevices}</div>
                <div className="stat-sub">devices on plan</div>
              </div>
            </div>

            {/* CSS for Stat Cards */}
            <style>{`
              .stat-card {
                background: #141414;
                border-radius: 12px;
                padding: 28px;
                position: relative;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border: 1px solid rgba(255,255,255,0.05);
                border-top: 3px solid var(--accent);
              }
              .stat-card:hover {
                transform: translateY(-6px);
                box-shadow: 0 10px 30px calc(var(--accent) - 80%);
              }
              .stat-label { color: #A3A3A3; font-size: 12px; text-transform: uppercase; font-weight: 600; margin-bottom: 8px; letter-spacing: 1px; }
              .stat-sub { color: #737373; font-size: 12px; margin-top: 8px; }
            `}</style>

            {/* CURRENT SUBSCRIPTION CARD */}
            <div style={{ background: '#141414', borderRadius: '12px', padding: '32px', marginBottom: '4rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ borderBottom: '1px solid rgba(245,197,24,0.3)', paddingBottom: '10px', marginBottom: '2rem' }}>
                <h2 className="bebas" style={{ fontSize: '24px', color: '#F5C518', margin: 0, letterSpacing: '1px' }}>CURRENT SUBSCRIPTION</h2>
              </div>
              
              <div className="subscription-card" style={{ display: 'flex', justifyContent: 'space-between', gap: '4rem' }}>
                
                {/* Left Column - Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                    <span style={{ color: '#A3A3A3', fontSize: '12px', textTransform: 'uppercase' }}>Plan Name</span>
                    <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>{subscription.planName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                    <span style={{ color: '#A3A3A3', fontSize: '12px', textTransform: 'uppercase' }}>Streaming Quality</span>
                    <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>{subscription.streamingQuality}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                    <span style={{ color: '#A3A3A3', fontSize: '12px', textTransform: 'uppercase' }}>Monthly Cost</span>
                    <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>₹{subscription.planName === 'Mini' ? 99 : subscription.planName === 'Family' ? 199 : 299}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                    <span style={{ color: '#A3A3A3', fontSize: '12px', textTransform: 'uppercase' }}>Watchlist Limit</span>
                    <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>{subscription.watchlistLimit} Movies</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                    <span style={{ color: '#A3A3A3', fontSize: '12px', textTransform: 'uppercase' }}>Expiry Date</span>
                    <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>{new Date(subscription.expiryDate).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px' }}>
                    <span style={{ color: '#A3A3A3', fontSize: '12px', textTransform: 'uppercase' }}>Status</span>
                    {isExpired ? (
                      <span style={{ background: 'rgba(229,9,20,0.1)', color: '#E50914', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>EXPIRED</span>
                    ) : (
                      <span style={{ background: 'rgba(52,199,89,0.1)', color: '#34C759', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>ACTIVE</span>
                    )}
                  </div>
                </div>

                {/* Right Column - Usage & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '3rem' }}>
                    <div className="stat-label" style={{ marginBottom: '12px' }}>USAGE CYCLE</div>
                    <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div style={{ height: '100%', width: `${usedPercentage}%`, background: '#E50914', transition: 'width 1s ease' }} />
                    </div>
                    <div style={{ color: '#A3A3A3', fontSize: '13px' }}>{totalDays - daysRemaining} of {totalDays} days used</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                    <button onClick={() => navigate('/plans')} style={{
                      background: 'transparent', border: '1px solid #E50914', color: '#E50914', padding: '14px',
                      borderRadius: '4px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px', transition: 'background 0.2s'
                    }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(229,9,20,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      UPGRADE PLAN
                    </button>

                    <button onClick={handleRenew} style={{
                      background: 'linear-gradient(135deg, #E50914, #B20710)', border: 'none', color: 'white', padding: '14px',
                      borderRadius: '4px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px'
                    }}>
                      RENEW SUBSCRIPTION
                    </button>

                    <button onClick={() => navigate('/watchlist')} style={{
                      background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '14px',
                      borderRadius: '4px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px', transition: 'border 0.2s'
                    }} onMouseEnter={e => e.currentTarget.style.border = '1px solid white'} onMouseLeave={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.2)'}>
                      ADD MOVIE
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* RECENTLY ADDED SECTION */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                <h2 className="bebas" style={{ fontSize: '28px', color: 'white', margin: 0, letterSpacing: '1px' }}>RECENTLY ADDED</h2>
                <span style={{ background: '#E50914', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{watchlist.length}</span>
              </div>
              
              {watchlist.length === 0 ? (
                <div style={{
                  background: '#141414', padding: '4rem 2rem', textAlign: 'center', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ width: '60px', height: '60px', border: '3px dashed #E50914', borderRadius: '50%', margin: '0 auto 1rem auto', display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'spin 10s linear infinite' }}>
                    <div style={{ width: '20px', height: '20px', background: '#E50914', borderRadius: '50%' }} />
                  </div>
                  <p style={{ color: '#A3A3A3', fontSize: '16px' }}>No movies added yet.</p>
                  <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '2rem', scrollSnapType: 'x mandatory' }} className="hide-scrollbar trending-row">
                  {recentMovies.map((movie, idx) => (
                    <div key={idx} onClick={() => navigate('/watchlist')} style={{ flexShrink: 0 }}>
                      <MoviePoster movie={movie} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
