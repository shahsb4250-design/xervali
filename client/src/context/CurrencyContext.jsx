import React, { createContext, useContext, useState } from 'react';

const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1, label: 'US Dollar' },
  { code: 'EUR', symbol: '€', rate: 0.92, label: 'Euro' },
  { code: 'GBP', symbol: '£', rate: 0.79, label: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', rate: 3.67, label: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', rate: 3.75, label: 'Saudi Riyal' },
];

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);

  const convertPrice = (usdPrice) => {
    if (!usdPrice) return 0;
    return parseFloat((usdPrice * selectedCurrency.rate).toFixed(2));
  };

  const formatPrice = (usdPrice) => {
    const converted = convertPrice(usdPrice);
    return `${selectedCurrency.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const changeCurrency = (code) => {
    const found = CURRENCIES.find(c => c.code === code);
    if (found) setSelectedCurrency(found);
  };

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, currencies: CURRENCIES, changeCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
