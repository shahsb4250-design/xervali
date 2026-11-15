import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!user) { setWishlistItems([]); return; }
    setWishlistLoading(true);
    try {
      const items = await api.getWishlist();
      setWishlistItems(items || []);
    } catch {
      setWishlistItems([]);
    } finally {
      setWishlistLoading(false);
    }
  }, [user]);

  useEffect(() => { loadWishlist(); }, [loadWishlist]);

  const addToWishlist = async (productId) => {
    if (!user) return false;
    try {
      const items = await api.addToWishlist(productId);
      setWishlistItems(items || []);
      return true;
    } catch { return false; }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const items = await api.removeFromWishlist(productId);
      setWishlistItems(items || []);
    } catch {}
  };

  const isInWishlist = (productId) => wishlistItems.some(p => p._id === productId);

  return (
    <WishlistContext.Provider value={{ wishlistItems, wishlistLoading, addToWishlist, removeFromWishlist, isInWishlist, loadWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
