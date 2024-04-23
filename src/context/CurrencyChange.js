import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('₹');

  // Load the selected currency from localStorage on component mount
  useEffect(() => {
    const storedCurrency = localStorage.getItem('selectedCurrency');
    if (storedCurrency) {
      setSelectedCurrency(storedCurrency);
    }
  }, []);

  // Update localStorage when selectedCurrency changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  return useContext(CurrencyContext);
};
