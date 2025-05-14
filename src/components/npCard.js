import React, { useState } from "react";
import "../styles/components/npCard.css";
import NPModal from "./npModal";

const NpCard = ({ nonprofit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logo: imageUrl, nonprofit_name: name, description, tags } = nonprofit;

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
    <>
      <div className="np-card">
        <div className="np-card-image">
          <img src={imageUrl} alt={name} />
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
            onClick={() => setIsModalOpen(true)}
          >
            Learn More
          </button>
        </div>
      </div>

      <NPModal
        nonprofit={nonprofit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default NpCard;
