import React, { useState, useEffect } from "react";
import NpCard from "./npCard";
import NPModal from "./npModal";
import { fetchNonprofitData } from "../utils/nonprofitData";
import "../styles/components/npCard.css";

const NpCardList = () => {
  const [displayedNonprofits, setDisplayedNonprofits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNonprofit, setSelectedNonprofit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    fetchNonprofitData()
      .then((nonprofitsData) => {
        setDisplayedNonprofits(getRandomItems(nonprofitsData, 8));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenModal = (nonprofit) => {
    setSelectedNonprofit(nonprofit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNonprofit(null);
  };

  const renderAllNonprofitCards = () => {
    if (loading) {
      return <div>Loading nonprofits...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className="np-card-list">
        {displayedNonprofits.map((nonprofit) => (
          <NpCard
            key={nonprofit.id}
            nonprofit={{
              ...nonprofit,
              name: nonprofit.nonprofit_name,
              imageUrl: nonprofit.logo,
              tags: [], // You might want to add tags based on some criteria
            }}
            onOpenModal={handleOpenModal}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="np-card-list-cont">
      <h1>Featured Nonprofits</h1>
      {renderAllNonprofitCards()}
      {selectedNonprofit && (
        <NPModal
          nonprofit={selectedNonprofit}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
      <div className="np-faq-section">
        <div className="np-faq">
          <h3>How are non-profits vetted?</h3>
          <p>
            Each of our featured non-profits undergoes a rigorous vetting
            process to ensure they are making a meaningful impact and using
            donations efficiently. We rely on Midot, a third-party consulting
            firm, to scrutinize their financials, leadership, effectiveness, and
            ability to achieve their goals. Non-profits that successfully pass
            Midot's test receive a “Seal of Effectiveness,” which is a
            requirement to be partnered with Match Israel.
          </p>
        </div>
        <div className="np-faq">
          <h3>Can I contact organizations directly?</h3>
          <p>
            Yes! Each organization has a designated representative waiting to
            talk with you. You can schedule a short Zoom call to learn more
            about their work before deciding to donate. On the non-profit page,
            you can send a pre-loaded email or WhatsApp to the organization!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NpCardList;
