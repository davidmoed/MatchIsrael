import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faNetworkWired,
  faForwardStep,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/components/what-is-match-israel.css";

const WhatIsMatchIsrael = () => {
  return (
    <section className="what-is-match-israel">
      <h2 className="section-title highlight-text">What's Match Israel?</h2>

      <div className="features-grid">
        <div className="feature-item">
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="feature-icon"
            />
          </div>
          <h3>Finding Your Cause</h3>
          <p>
            Have you ever wanted to donate money to a cause in Israel but didn't
            know where to give? Did you ever want to connect to a cause you're
            passionate about but didn't know how? Haven't you wondered if your
            donation is used efficiently to make an impact?
          </p>
        </div>

        <div className="feature-item">
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faNetworkWired} className="feature-icon" />
          </div>
          <h3>Our Solution</h3>
          <p>
            At Match Israel, we aim to solve those problems by helping you
            connect to small and impactful Israeli non-profits doing
            groundbreaking work. Each of our featured non-profits have undergone
            a rigorous vetting process and have a designated representative
            waiting to talk with each and every one of you!
          </p>
        </div>

        <div className="feature-item">
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faForwardStep} className="feature-icon" />
          </div>
          <h3>How It Works</h3>
          <p>
            Take our quiz to get recommendations on which non-profits you'll
            find most interesting based on your preferences, or just browse
            through the list on your own! Before you donate, you're welcome to
            schedule a short Zoom call with the organization, and if you like
            what you hear, go ahead and donate!
          </p>
        </div>

        <div className="feature-item">
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faComments} className="feature-icon" />
          </div>
          <h3>Building Connections</h3>
          <p>
            We encourage you to maintain a connection with the cause you donated
            to—that's what the representatives are here for! Whether it's just
            checking in every few months to see what they're up to, or visiting
            your new friends in Israel when you come visit, we believe that a
            connection will help you feel more satisfied with your donation, and
            feel like you made more of an impact!
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatIsMatchIsrael;
