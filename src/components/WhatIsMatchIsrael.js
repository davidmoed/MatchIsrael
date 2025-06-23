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
            know where to give? Did you ever want to connect to a non-profit but
            didn't know how? Haven't you wondered if your donation is used
            efficiently and impactfully?
          </p>
        </div>

        <div className="feature-item">
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faNetworkWired} className="feature-icon" />
          </div>
          <h3>Our Solution</h3>
          <p>
            At Match Israel, we aim to solve those problems by helping you find
            and connect to small and impactful Israeli non-profits doing
            groundbreaking work. We've found great non-profits that are vetted,
            and we've done all the research for you, compiling it into a
            convenient database that you can access through Ezra, our handy AI
            assistant! Plus, each of our featured non-profits have a designated
            representative waiting to connect if you want!
          </p>
        </div>

        <div className="feature-item">
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faForwardStep} className="feature-icon" />
          </div>
          <h3>How It Works</h3>
          <p>
            Talk to Ezra, our AI assistant, to get recommendations on which
            non-profits you'll find most interesting based on your passions and
            preferences, or just browse through the list on your own! If you see
            something you like, go ahead and donate! And as an added bonus,
            you're welcome to schedule a short call with the organization! You
            can ask Ezra for the contact information, or find it on the
            non-profits section.
          </p>
        </div>

        <div className="feature-item">
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faComments} className="feature-icon" />
          </div>
          <h3>Building Connections</h3>
          <p>
            If you're curious and dedicated, we encourage you to build a
            connection with a non-profit—that's what the representatives are
            here for! Whether it's just checking in every few months to see what
            they're up to or visiting your new friends in Israel when you come
            visit, a connection will help you feel more satisfied with your
            donation, and feel like you made more of an impact!
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatIsMatchIsrael;
