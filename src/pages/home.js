import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

import CauseQuiz from "../components/CauseQuiz";
import WhatIsMatchIsrael from "../components/WhatIsMatchIsrael";
import NpCardList from "../components/npCardListSection";
import Connect from "../components/Connect";

const Home = () => {
  return (
    <>
      <div className="hero">
        <div className="hero-content">
          <h1>
            <span className="highlight-text">MATCH ISRAEL:</span> Connecting you
            to the most impactful
            <span className="highlight-text-secondary"> causes in Israel</span>
          </h1>
          <div className="button-group">
            <Link to="/nonprofits" className="btn hero-btn-primary">
              Get Connected
            </Link>
            <Link to="/about" className="btn hero-btn-secondary">
              What is Match Israel?
            </Link>
          </div>
        </div>
      </div>
      <CauseQuiz />
      <WhatIsMatchIsrael />
      <NpCardList />
      <Connect />
    </>
  );
};

export default Home;
