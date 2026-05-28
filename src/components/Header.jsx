import React from 'react';

const Header = ({ watchlistCount }) => {
  return (
    <header className="header glass">
      <div className="logo">
        <span className="logo-accent">Prime</span>Vault
      </div>
      <div className="watchlist-stats">
        <span>Watchlist: {watchlistCount} Movies</span>
      </div>
    </header>
  );
};

export default Header;
