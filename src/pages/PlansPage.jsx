import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const PLANS_DATA = [
  { name: 'Mini', cost: 99, quality: '720p', devices: 1, validity: 30, watchlistLimit: 5 },
  { name: 'Family', cost: 199, quality: '1080p', devices: 4, validity: 30, watchlistLimit: 50, popular: true },
  { name: 'Ultra', cost: 299, quality: '4K HDR', devices: 6, validity: 30, watchlistLimit: 100 }
];

const FAQ_DATA = [
  { q: 'Can I cancel my subscription anytime?', a: 'Yes. There are no long-term contracts or cancellation fees. You can cancel your PixelStream subscription online anytime.' },
  { q: 'How does the watchlist limit work?', a: 'Each plan has a specific capacity for your watchlist. If you hit the limit, simply remove a movie to add a new one.' },
  { q: 'What devices are supported?', a: 'You can watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.' }
];

const PlansPage = () => {
  const { subscription, isExpired, handleSubscribe, handleRenew } = useAppContext();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* Promotional Banner */}
      <div className="promo-banner" style={{
        width: '100%', height: '48px', background: 'linear-gradient(135deg, #E50914, #B20710)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)',
          animation: 'shimmer 3s infinite'
        }} />
        <span className="bebas" style={{ color: 'white', fontSize: '14px', letterSpacing: '1px', position: 'relative', zIndex: 1 }}>
          🎬 Special Offer: Upgrade to Ultra for just ₹299/mo — Limited Time!
        </span>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          50% { left: 200%; }
          100% { left: 200%; }
        }
      `}</style>

      <div className="page-container" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="bebas" style={{ fontSize: '60px', margin: 0, display: 'inline-block', borderBottom: '2px solid #E50914', paddingBottom: '10px' }}>
            CHOOSE YOUR PLAN
          </h1>
          <p style={{ marginTop: '1rem', color: '#A3A3A3', fontSize: '16px' }}>
            All plans include 30-day access. Cancel anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          {PLANS_DATA.map(plan => {
            const isSelected = subscription?.planName === plan.name;
            const isThisExpired = isSelected && isExpired;

            return (
              <div className="plan-card" key={plan.name} style={{
                position: 'relative',
                padding: '3rem 2rem',
                background: '#141414',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                border: isThisExpired ? '1px solid #E50914' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: isThisExpired ? '0 0 20px rgba(229,9,20,0.2)' : 'none',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={e => {
                if (!isThisExpired) {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(229,9,20,0.25)';
                }
              }}
              onMouseLeave={e => {
                if (!isThisExpired) {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}>
                
                {plan.popular && (
                  <div className="bebas" style={{
                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #E50914, #B20710)', color: 'white',
                    padding: '4px 16px', borderRadius: '20px', fontSize: '11px', letterSpacing: '1px',
                    boxShadow: '0 4px 10px rgba(229,9,20,0.4)'
                  }}>
                    MOST POPULAR
                  </div>
                )}

                {isSelected && !isExpired && (
                  <div style={{
                    position: 'absolute', top: '15px', right: '15px',
                    background: 'rgba(52,199,89,0.2)', color: '#34C759', padding: '4px 10px',
                    borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid rgba(52,199,89,0.5)'
                  }}>
                    ✓ ACTIVE
                  </div>
                )}

                {isThisExpired && (
                  <div style={{
                    position: 'absolute', top: '15px', right: '15px',
                    background: 'rgba(229,9,20,0.2)', color: '#E50914', padding: '4px 10px',
                    borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid rgba(229,9,20,0.5)'
                  }}>
                    EXPIRED
                  </div>
                )}

                <h2 className="bebas" style={{ fontSize: '32px', color: '#F5C518', marginBottom: '1rem' }}>
                  {plan.name}
                </h2>
                
                <div style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '2rem', lineHeight: 1 }}>
                  ₹{plan.cost} <span style={{ fontSize: '18px', color: '#A3A3A3', fontWeight: 'normal' }}>/mo</span>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '2rem' }} />

                <ul style={{ listStyle: 'none', flexGrow: 1, padding: 0, marginBottom: '2rem' }}>
                  {[
                    `Video Quality: ${plan.quality}`,
                    `Max Devices: ${plan.devices}`,
                    `Watchlist Limit: ${plan.watchlistLimit} movies`,
                    `Duration: ${plan.validity} days`
                  ].map((feat, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#A3A3A3' }}>
                      <span style={{ color: '#E50914', fontWeight: 'bold' }}>✓</span> {feat}
                    </li>
                  ))}
                </ul>

                {isThisExpired ? (
                  <button className="btn btn-outline-red" style={{ width: '100%', fontFamily: '"Bebas Neue", sans-serif', fontSize: '20px', letterSpacing: '1px' }} onClick={handleRenew}>
                    RENEW NOW
                  </button>
                ) : isSelected ? (
                  <button className="btn" disabled style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: '#fff', fontFamily: '"Bebas Neue", sans-serif', fontSize: '20px', letterSpacing: '1px' }}>
                    CURRENT PLAN
                  </button>
                ) : (
                  <button className="btn btn-primary" style={{ width: '100%', fontFamily: '"Bebas Neue", sans-serif', fontSize: '20px', letterSpacing: '1px' }} onClick={() => handleSubscribe(plan.name)}>
                    SELECT PLAN
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="table-container" style={{ marginBottom: '5rem', overflowX: 'auto' }}>
          <h2 className="bebas" style={{ fontSize: '42px', textAlign: 'center', marginBottom: '2rem' }}>COMPARE PLANS</h2>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #E50914, #B20710)' }}>
                <th className="bebas" style={{ padding: '16px', color: 'white', fontSize: '20px', textAlign: 'left', letterSpacing: '1px' }}>Feature</th>
                <th className="bebas" style={{ padding: '16px', color: 'white', fontSize: '20px', letterSpacing: '1px' }}>Mini</th>
                <th className="bebas" style={{ padding: '16px', color: 'white', fontSize: '20px', letterSpacing: '1px' }}>Family</th>
                <th className="bebas" style={{ padding: '16px', color: 'white', fontSize: '20px', letterSpacing: '1px' }}>Ultra</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Streaming Quality', m: '720p', f: '1080p', u: '4K HDR' },
                { label: 'Max Devices', m: '1', f: '4', u: '6' },
                { label: 'Watchlist Limit', m: '10 Movies', f: '50 Movies', u: '100 Movies' },
                { label: 'Monthly Price', m: '₹99', f: '₹199', u: '₹299' },
                { label: 'Validity', m: '30 Days', f: '30 Days', u: '30 Days' },
              ].map((row, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? '#141414' : '#1A1A1A' }}>
                  <td style={{ padding: '16px', textAlign: 'left', color: '#A3A3A3', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.label}</td>
                  <td style={{ padding: '16px', color: 'white', fontWeight: '500', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span style={{ color: '#E50914', marginRight: '5px' }}>✓</span>{row.m}</td>
                  <td style={{ padding: '16px', color: 'white', fontWeight: '500', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span style={{ color: '#E50914', marginRight: '5px' }}>✓</span>{row.f}</td>
                  <td style={{ padding: '16px', color: 'white', fontWeight: '500', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span style={{ color: '#E50914', marginRight: '5px' }}>✓</span>{row.u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ Section */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="bebas" style={{ fontSize: '42px', textAlign: 'center', marginBottom: '2rem' }}>FREQUENTLY ASKED QUESTIONS</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FAQ_DATA.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    style={{ width: '100%', background: 'transparent', color: 'white', textAlign: 'left', padding: '1.5rem', fontSize: '18px', fontWeight: 'normal', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 'none', cursor: 'pointer' }}
                  >
                    {faq.q}
                    <span style={{ fontSize: '24px', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                  </button>
                  <div style={{
                    maxHeight: isOpen ? '200px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease',
                    padding: isOpen ? '0 1.5rem 1.5rem 1.5rem' : '0 1.5rem',
                    color: '#A3A3A3'
                  }}>
                    {faq.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansPage;
