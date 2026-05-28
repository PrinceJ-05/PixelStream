import React from 'react';

const PlanCard = ({ plan, isSelected, isExpired, onSelect, onRenew }) => {
  const { name, cost, quality, devices, validity, watchlistLimit } = plan;

  return (
    <div className={`plan-card glass ${isSelected ? 'active' : ''} ${isExpired ? 'expired' : ''}`}>
      {isSelected && !isExpired && <span className="status-badge status-active">Active</span>}
      {isExpired && <span className="status-badge status-expired">Expired</span>}
      
      <h3 className="plan-name">{name}</h3>
      <div className="plan-price">${cost}<span>/mo</span></div>
      
      <ul className="plan-features">
        <li>Quality: {quality}</li>
        <li>Max Devices: {devices}</li>
        <li>Watchlist Limit: {watchlistLimit} movies</li>
        <li>Validity: {validity} days</li>
      </ul>
      
      {isExpired ? (
        <button className="btn btn-renew" onClick={() => onRenew()}>
          Renew Subscription
        </button>
      ) : (
        <button 
          className={`btn ${isSelected ? 'btn-secondary' : 'btn-primary'}`} 
          onClick={() => onSelect(name)}
          disabled={isSelected}
        >
          {isSelected ? 'Current Plan' : 'Select Plan'}
        </button>
      )}
    </div>
  );
};

export default PlanCard;
