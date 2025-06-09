import React from "react";
import "../styles/components/npCard.css";

const NpCard = ({ nonprofit, onOpenModal }) => {
  const { nonprofit_name: name, description, tags, logo } = nonprofit;

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;

    let truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 0) {
      truncated = truncated.slice(0, lastSpace) + "...";
    }
    return truncated;
  };

  const truncatedDescription = truncateText(description, 180);

  return (
    <div className="np-card">
      <div className="np-card-image">
        <img src={logo} alt={name} />
      </div>
      <div className="np-card-content">
        <h3 className="np-card-title">{name}</h3>
        <div className="np-card-description-container">
          <p className="np-card-description">{truncatedDescription}</p>
        </div>
        <div className="np-card-tags">
          {tags?.map((tag, index) => (
            <span key={index} className="np-card-tag">
              {tag}
            </span>
          ))}
        </div>
        <button
          className="np-card-button"
          onClick={() => onOpenModal(nonprofit)}
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default NpCard;
