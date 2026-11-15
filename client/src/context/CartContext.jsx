import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('luxe_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const stored = localStorage.getItem('luxe_coupon');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('luxe_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('luxe_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product, qty = 1, options = {}) => {
    setCartItems((prev) => {
      const engravingText = options.engravingText || '';
      const existing = prev.find((item) => item._id === product._id && (item.engravingText || '') === engravingText);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id && (item.engravingText || '') === engravingText
            ? { ...item, qty: Math.min(product.stock || 99, item.qty + qty) }
            : item
        );
      } else {
        return [
          ...prev,
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: (product.images && product.images[0]) || '',
            stock: product.stock,
            category: product.category,
            brand: product.brand,
            engravingText,
            qty
          }
        ];
      }
    });
  };

  const updateQty = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, qty: Math.min(item.stock || 99, newQty) } : item))
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('luxe_cart');
    localStorage.removeItem('luxe_coupon');
  };

  const applyCouponCode = async (code) => {
    setCouponError('');
    try {
      const result = await api.validateCoupon(code, subtotal);
      if (result.valid) {
        setAppliedCoupon(result);
        return { success: true };
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon');
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.08; // 8% sales tax
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25; // Free shipping over $500
  const total = Math.max(0, taxableAmount + tax + shipping);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        appliedCoupon,
        couponError,
        applyCouponCode,
        removeCoupon,
        subtotal,
        discountAmount,
        tax,
        shipping,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
