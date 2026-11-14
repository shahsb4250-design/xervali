import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const TIER_CONFIG = {
  'Silver Patron': { color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-300', icon: '🥈' },
  'Gold Collector': { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300', icon: '🥇' },
  'Black Tier': { color: 'text-slate-950', bg: 'bg-slate-900', border: 'border-slate-800', icon: '♠️' },
};

const LoyaltyContext = createContext(null);

export function LoyaltyProvider({ children }) {
  const { user } = useAuth();
  const [loyalty, setLoyalty] = useState(null);
  const [loyaltyLoading, setLoyaltyLoading] = useState(false);

  const loadLoyalty = useCallback(async () => {
    if (!user) { setLoyalty(null); return; }
    setLoyaltyLoading(true);
    try {
      const data = await api.getLoyalty();
      setLoyalty(data);
    } catch {
      setLoyalty(null);
    } finally {
      setLoyaltyLoading(false);
    }
  }, [user]);

  useEffect(() => { loadLoyalty(); }, [loadLoyalty]);

  const tierConfig = loyalty ? (TIER_CONFIG[loyalty.tier] || TIER_CONFIG['Silver Patron']) : TIER_CONFIG['Silver Patron'];

  return (
    <LoyaltyContext.Provider value={{ loyalty, loyaltyLoading, tierConfig, loadLoyalty, TIER_CONFIG }}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const ctx = useContext(LoyaltyContext);
  if (!ctx) throw new Error('useLoyalty must be used within LoyaltyProvider');
  return ctx;
}
