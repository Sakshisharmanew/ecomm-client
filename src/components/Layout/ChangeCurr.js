import React from 'react';
import { useCurrency } from '../../context/CurrencyChange';
import './../../styles/Topheader.css'

function CurrencySelector() {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();

  const handleCurrencyChange = (newCurrency) => {
    setSelectedCurrency(newCurrency);
  };

  return (
    <div>
      <select
    value={selectedCurrency}
    onChange={(e) => handleCurrencyChange(e.target.value)}
    className=" bg-blue currency_class " style={{color:'black',  fontFamily:"monospace"}} 
  >
    <option value='₹'> Indian Rupee</option>
    <option value='$'> US Dollar</option>
    <option value='€'> Euro</option>
    <option value='£'> British Pound</option>
    <option value='AED'> United Arab</option>
  </select>
    </div>
  );
}

export default CurrencySelector;

