import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  ShieldCheck, 
  Lock,
  Plus,
  Minus,
  Clock,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function CartPage({ navigate }) {
  const { 
    cartItems, 
    updateQty, 
    removeFromCart, 
    clearCart,
    subtotal, 
    discountAmount, 
    tax, 
    shipping, 
    total,
    appliedCoupon,
    couponError,
    applyCouponCode,
    removeCoupon
  } = useCart();

  const { formatPrice } = useCurrency();
  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    await applyCouponCode(couponInput.trim());
    setApplyingCoupon(false);
    setCouponInput('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag size={36} />
        </div>
        <h2 className="font-serif text-3xl font-bold text-slate-900">Your Shopping Bag is Empty</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto font-light">
          Your bespoke shopping selection is currently empty. Explore our archive of fine timepieces, leathercraft, and studio audio.
        </p>
        <button 
          onClick={() => navigate('/shop')}
          className="px-8 py-4 bg-slate-900 hover:bg-amber-600 text-white rounded-full text-xs font-bold uppercase tracking-wider transition shadow-lg inline-flex items-center gap-2"
        >
          Explore Collection <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* FEATURE: Abandoned Cart Recovery Reminder */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-amber-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-amber-500/30 shadow-md">
        <div className="flex items-center gap-3">
          <Clock size={20} className="text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-amber-300 uppercase tracking-wide">Reserved Atelier Allocation</p>
            <p className="text-xs text-slate-300">Your bespoke pieces are held for 24 hours. Complete your commission to ensure guaranteed dispatch.</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition flex-shrink-0"
        >
          Lock Allocation →
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">ORDER REVIEW</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">Your Bespoke Selection</h1>
        </div>
        <button 
          onClick={clearCart}
          className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition"
        >
          Clear entire bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Left: Items Table */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item._id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6"
            >
              <img 
                src={item.image} 
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl bg-slate-100 flex-shrink-0" 
              />

              <div className="flex-1 text-center sm:text-left space-y-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">{item.category}</span>
                <h3 
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="font-serif text-base font-bold text-slate-900 hover:text-amber-600 cursor-pointer transition line-clamp-1"
                >
                  {item.name}
                </h3>
                <p className="text-xs font-bold text-slate-900">{formatPrice(item.price)}</p>

                {item.engravingText && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[10px] font-mono font-bold mt-1">
                    <Sparkles size={11} className="text-amber-700" />
                    <span>Engraving: "{item.engravingText}"</span>
                  </div>
                )}
              </div>

              {/* Quantity Picker */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                  <button 
                    onClick={() => updateQty(item._id, item.qty - 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-xs font-bold">{item.qty}</span>
                  <button 
                    onClick={() => updateQty(item._id, item.qty + 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition"
                  title="Remove piece"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right sm:w-28">
                <span className="text-sm font-bold text-slate-950">
                  {formatPrice(item.price * item.qty)}
                </span>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button 
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
            >
              <ArrowLeft size={16} /> Continue Exploring Boutique
            </button>
          </div>
        </div>

        {/* Right: Order Summary Dossier */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-slate-900">Summary Dossier</h2>

          {/* Coupon Code Input */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Privilege / Coupon Code
            </label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="e.g. WELCOME10"
                className="flex-1 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 uppercase font-mono bg-slate-50"
              />
              <button 
                type="submit"
                disabled={applyingCoupon}
                className="px-4 py-3 bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold uppercase rounded-xl transition"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-1.5 font-bold">
                  <Tag size={14} /> {appliedCoupon.code} ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% Off` : `$${appliedCoupon.discountValue} Off`})
                </div>
                <button type="button" onClick={removeCoupon} className="text-emerald-900 hover:underline text-[11px]">
                  Remove
                </button>
              </div>
            )}
          </form>

          {/* Cost Breakdown */}
          <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Pieces Subtotal</span>
              <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-amber-700">
                <span>Maison Discount</span>
                <span className="font-bold">-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Import Duties & Luxury Tax</span>
              <span className="font-bold text-slate-900">{formatPrice(tax)}</span>
            </div>

            <div className="flex justify-between">
              <span>Insured Courier Shipping</span>
              <span className="font-bold text-emerald-700">
                {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between text-base font-bold text-slate-950">
              <span>Total Investment</span>
              <span className="text-xl font-serif text-slate-950">{formatPrice(total)}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-slate-950 hover:bg-amber-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-xl"
          >
            <Lock size={16} /> Proceed to Atelier Commission
          </button>
        </div>

      </div>
    </div>
  );
}
