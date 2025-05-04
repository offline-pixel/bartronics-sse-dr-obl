import React from 'react';
import useHeaderScroll from '../hooks/useHeaderScroll';

const Header = ({ toggleViewType, onToggleFilter }) => {
  const isHeaderHidden = useHeaderScroll();

  return (
    <header className={`header ${isHeaderHidden ? 'hidden' : ''}`}>
      <div className="header-left">
        <h2 style={{ marginBottom: "0px" }}>Open Book Library</h2>
        <small><a href="https://offline-pixel.github.io/">Open Source</a></small>
      </div>
      <div className="header-right">
        <a href="#" role="button" onClick={toggleViewType}>🪄</a>
        <a onClick={onToggleFilter} className="filter-toggle-btn">🎛️</a>
      </div>
    </header>
  );
};

export default Header;
