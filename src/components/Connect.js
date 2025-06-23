import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "../styles/components/connect.css";

const Connect = () => {
  return (
    <div className="connect-section">
      <h1>Connect With Us</h1>
      <p className="connect-description">
        Join our community and stay engaged with Israeli non-profits making a
        difference.
      </p>

      <div className="connect-options">
        <div className="connect-option">
          <div className="connect-icon">
            <FontAwesomeIcon icon={faClock} size="2x" className="fa-icon" />
          </div>
          <h2>Stay Updated</h2>
          <p>
            Get our newsletter with featured non-profits and impact stories.
          </p>
          <a
            href="https://matchisrael.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="connect-button"
          >
            Subscribe
          </a>
        </div>

        <div className="connect-option">
          <div className="connect-icon">
            <FontAwesomeIcon icon={faEnvelope} size="2x" className="fa-icon" />
          </div>
          <h2>Contact Match Israel</h2>
          <p>
            Speak directly with our team to learn more about Match Israel before
            you begin.
          </p>
          <a href="mailto:matchisrael360@gmail.com" className="connect-button">
            Connect
          </a>
        </div>
      </div>
    </div>
  );
};

export default Connect;
