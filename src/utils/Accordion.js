import React, { useState } from "react";
import "../styles/utils/Accordion.css";

const Accordion = ({ title, content, listIdx }) => {
  const [isOpen, setIsOpen] = useState(listIdx === 0);

  return (
    <div className="accordion-item">
      <button
        className={`accordion-header ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span className="accordion-icon">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="accordion-content">
          {Array.isArray(content) ? (
            content.map((item, index) => (
              <p key={index} className="accordion-text">
                {item}
              </p>
            ))
          ) : (
            <p className="accordion-text">{content}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Accordion;
