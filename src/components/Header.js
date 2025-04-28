import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

import logoUrl from "../matchIsrael_logo.png";

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="nav-logo-cont">
        <img className="nav-logo" src={logoUrl} alt="Match Israel" />
      </Link>
      <nav className="nav">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
        <Link to="/nonprofits" className="nav-link">
          Nonprofits
        </Link>
      </nav>
    </header>
  );
};

export default Header;
