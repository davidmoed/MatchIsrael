import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../styles/Header.css";

import logoUrl from "../matchIsrael_logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
      <button className="hamburger-menu" onClick={toggleMenu}>
        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
      </button>
      <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
        <Link to="/" className="nav-link" onClick={toggleMenu}>
          Home
        </Link>
        <Link to="/about" className="nav-link" onClick={toggleMenu}>
          About
        </Link>
        <Link to="/nonprofits" className="nav-link" onClick={toggleMenu}>
          Nonprofits
        </Link>
      </div>
    </header>
  );
};

export default Header;
