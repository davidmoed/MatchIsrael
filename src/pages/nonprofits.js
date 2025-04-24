import React, { useState, useEffect } from "react";
import NpCard from "../components/npCard";
import { fetchNonprofitData } from "../utils/nonprofitData";
import "../styles/nonprofits.css";

const FeaturedNPs = () => {
  const [loading, setLoading] = useState(true);
  const [nonprofits, setNonprofits] = useState([]);

  useEffect(() => {
    fetchNonprofitData()
      .then(setNonprofits)
      .finally(() => setLoading(false));
  }, []);

  const renderAllNonprofitCards = () => {
    if (loading) {
      return <h3 className="loading-state">Loading nonprofits...</h3>;
    }

    return (
      <div className="np-card-list">
        {nonprofits.map((nonprofit) => (
          <NpCard
            key={nonprofit.id}
            nonprofit={{
              ...nonprofit,
              name: nonprofit.nonprofit_name,
              imageUrl: nonprofit.logo,
              tags: [], // You might want to add tags based on some criteria
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="nonprofits-page">
      <h1>Our Nonprofits</h1>
      {renderAllNonprofitCards()}
    </div>
  );
};

export default FeaturedNPs;
