import React, { useState, useEffect } from "react";
import NpCard from "../components/npCard";
import NPModal from "../components/npModal";
import { fetchNonprofitData } from "../utils/nonprofitData";
import "../styles/nonprofits.css";

const FeaturedNPs = () => {
  const [loading, setLoading] = useState(true);
  const [nonprofits, setNonprofits] = useState([]);
  const [selectedNonprofit, setSelectedNonprofit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNonprofitData()
      .then(setNonprofits)
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
      return <h3 className="loading-state">Loading nonprofits...</h3>;
    }

    return (
      <div className="np-card-list">
        {nonprofits.map((nonprofit, index) => (
          <div
            key={nonprofit.id}
            style={{ animationDelay: `${0.1 + index * 0.05}s` }}
          >
            <NpCard
              nonprofit={{
                ...nonprofit,
                name: nonprofit.nonprofit_name,
                imageUrl: nonprofit.logo,
                tags: [], // You might want to add tags based on some criteria
              }}
              onOpenModal={handleOpenModal}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="nonprofits-page">
      <h1>Our Nonprofits</h1>
      {renderAllNonprofitCards()}
      {selectedNonprofit && (
        <NPModal
          nonprofit={selectedNonprofit}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default FeaturedNPs;
