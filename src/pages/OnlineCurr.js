import axios from "axios";
import { useCurrency } from "../context/CurrencyChange";
import React, { useState, useEffect } from "react";

const API_KEY = "1781d9151ca834e50f359253";
const BASE_URL = "https://open.er-api.com/v6/latest/";

const CurrencyConverter = ({ amount, currency }) => {
  const { currentCurrency } = useCurrency();
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/1781d9151ca834e50f359253/latest/${currentCurrency}`
        );
        //https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/USD
        const exchangeRate = response.data.rates[currency];

        setConvertedAmount(amount * exchangeRate);
      } catch (error) {
        console.error("Error fetching exchange rates:", error.message);
      }
    };

    fetchExchangeRate();
  }, [currentCurrency, amount, currency]);

  return (
    <span>
      {convertedAmount && `${convertedAmount.toFixed(2)} ${currentCurrency}`}
    </span>
  );
};

export default CurrencyConverter;
