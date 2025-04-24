import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendar } from "@fortawesome/free-solid-svg-icons";
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
          <button className="connect-button">Subscribe</button>
        </div>

        <div className="connect-option">
          <div className="connect-icon">
            <FontAwesomeIcon icon={faCalendar} size="2x" className="fa-icon" />
          </div>
          <h2>Book a Call</h2>
          <p>
            Speak directly with our team to learn more about Match Israel before
            you begin.
          </p>
          <button className="connect-button">Book</button>
        </div>
      </div>
    </div>
  );
};

export default Connect;
