import React, { useState } from "react";
import "../styles/components/npCard.css";
import NPModal from "./npModal";

const NpCard = ({ nonprofit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logo: imageUrl, nonprofit_name: name, description, tags } = nonprofit;

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;

    const nextSpace = text.indexOf(" ", maxLength);
    const lastSpace = text.lastIndexOf(" ", maxLength);

    const truncateIndex =
      nextSpace === -1
        ? lastSpace
        : nextSpace - maxLength < maxLength - lastSpace
        ? nextSpace
        : lastSpace;

    return truncateIndex === -1
      ? text.slice(0, maxLength)
      : text.slice(0, truncateIndex) + "... ";
  };

  const shouldTruncate = description.length > 180;
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
            <p className="np-card-description">
              {truncatedDescription}
              {shouldTruncate && (
                <span
                  className="read-more-link"
                  onClick={() => setIsModalOpen(true)}
                >
                  Read more
                </span>
              )}
            </p>
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
