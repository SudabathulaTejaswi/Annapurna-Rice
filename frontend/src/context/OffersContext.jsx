// src/context/OffersContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';

const OffersContext = createContext();
export const useOffers = () => useContext(OffersContext);

const OffersProvider = ({ children }) => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await API.get('/offers');
        setOffers(res.data);
      } catch (err) {
        console.error('Error fetching offers:', err);
      }
    };
    if (offers.length === 0) fetchOffers();
  }, []);

  return (
    <OffersContext.Provider value={{ offers }}>
      {children}
    </OffersContext.Provider>
  );
};

export default OffersProvider;
