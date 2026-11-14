import React, { useState } from 'react';
import { 
  Lock, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  Gift,
  Sparkles,
  Award
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';

export default function CheckoutPage({ navigate, onOrderCreated }) {
  const { cartItems, subtotal, discountAmount, tax, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice, selectedCurrency } = useCurrency();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user ? user.name : 'Sophia Vance',
    email: user ? user.email : 'customer@example.com',
    address: '742 Evergreen Terrace',
    city: 'Beverly Hills',
    postalCode: '90210',
    country: 'United States',
    phone: '+1 (555) 234-5678'
  });

  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  
  // Luxury Gift Packaging State
  const [giftPackaging, setGiftPackaging] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('Please sign in to complete your bespoke commission order.');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty,
          engravingText: item.engravingText || ''
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        discountAmount,
        totalPrice: total,
        giftPackaging,
        giftNote: giftPackaging ? giftNote : ''
      };

      const createdOrder = await api.createOrder(orderPayload);
      
      // Award loyalty points to user (1 point per dollar spent)
      try {
        await api.awardLoyaltyPoints(Math.round(total), user._id);
      } catch {}

      clearCart();
      if (onOrderCreated) onOrderCreated(createdOrder);
      navigate(`/order-success/${createdOrder._id || createdOrder.orderNumber}`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to process commission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Klarna installment calculation
  const installmentAmount = (total / 4).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <button 
        onClick={() => navigate('/cart')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft size={16} /> Return to Shopping Bag
      </button>

      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">FINAL STEP</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">Direct Atelier Commission</h1>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Checkout Form & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Shipping & Payment (7 cols) */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Collector Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <Truck size={20} className="text-amber-600" /> Insured Delivery Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Collector Name
                </label>
                <input 
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email for Tracking & Certificate
                </label>
                <input 
                  type="email"
                  name="email"
                  value={shippingAddress.email}
                  onChange={handleInputChange}
                  required
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Courier Contact Phone
                </label>
                <input 
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Street Address & Residence
                </label>
                <input 
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  required
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input 
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Postal Code
                </label>
                <input 
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  required
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Country / Sovereign Territory
                </label>
                <input 
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  required
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* FEATURE: Gift Packaging & Wax-Sealed Note */}
          <div className="bg-amber-50/70 p-6 sm:p-8 rounded-3xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Gift size={20} className="text-amber-700" />
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-950">Atelier Gift Presentation</h3>
                  <p className="text-[11px] text-slate-600">Complimentary velvet casing, rigid gift box, and red wax seal</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={giftPackaging} 
                  onChange={(e) => setGiftPackaging(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {giftPackaging && (
              <div className="space-y-3 pt-3 border-t border-amber-200/80 animate-in fade-in">
                <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  Personal Wax-Sealed Calligraphy Note (Optional)
                </label>
                <textarea
                  rows="3"
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Inscribe a personal dedication to accompany the certificate of provenance..."
                  className="w-full text-xs p-3.5 rounded-xl border border-amber-300 bg-white focus:outline-none focus:border-amber-600 italic font-serif text-slate-800"
                ></textarea>
                <div className="flex items-center gap-2 text-[10px] text-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span>Sealed by hand at Atelier Montaigne using crimson beeswax and the official XERVALI crest.</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Luxury Payment & BNPL */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <Lock size={20} className="text-amber-600" /> Secure Payment & Wallets
            </h2>

            {/* Quick Wallet Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('Apple Pay')}
                className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'Apple Pay' ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 hover:border-slate-400 bg-white text-slate-900'
                }`}
              >
                <span> Pay</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('Google Pay')}
                className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'Google Pay' ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 hover:border-slate-400 bg-white text-slate-900'
                }`}
              >
                <span>G Pay</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('Klarna')}
                className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'Klarna' ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-slate-200 hover:border-slate-400 bg-white text-slate-900'
                }`}
              >
                <span>Klarna.</span>
              </button>
            </div>

            {paymentMethod === 'Klarna' && (
              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 text-xs text-pink-900 space-y-1">
                <p className="font-bold">Pay in 4 interest-free installments of {selectedCurrency.symbol}{installmentAmount} / month.</p>
                <p className="text-[11px] text-pink-700">No interest, no added fees when paid on time. Automatic monthly deduction.</p>
              </div>
            )}

            {/* Standard Payment Selection */}
            <div className="space-y-3">
              {[
                { id: 'Stripe', label: 'Credit / Debit Card (Visa, Mastercard, Amex, Diners)', desc: 'Encrypted 256-bit AES connection' },
                { id: 'PayPal', label: 'PayPal & Private Wire Transfer', desc: 'Protected by PayPal Buyer Guarantee' }
              ].map((m) => (
                <label 
                  key={m.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === m.id ? 'border-slate-950 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-slate-950" 
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{m.label}</p>
                      <p className="text-[10px] text-slate-500">{m.desc}</p>
                    </div>
                  </div>
                  <CreditCard size={18} className="text-slate-400" />
                </label>
              ))}
            </div>

            {/* Card Inputs if Stripe selected */}
            {paymentMethod === 'Stripe' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Card Number</label>
                  <input 
                    type="text" 
                    value={cardNumber} 
                    onChange={(e) => setCardNumber(e.target.value)} 
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Expiry</label>
                    <input 
                      type="text" 
                      value={cardExpiry} 
                      onChange={(e) => setCardExpiry(e.target.value)} 
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">CVC Code</label>
                    <input 
                      type="password" 
                      value={cardCvc} 
                      onChange={(e) => setCardCvc(e.target.value)} 
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Place Order CTA */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 px-8 bg-slate-950 hover:bg-amber-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-2xl disabled:bg-slate-300"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck size={18} /> Confirm Commission & Pay {formatPrice(total)}
              </>
            )}
          </button>
        </form>

        {/* Right: Order Summary Dossier (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-serif text-xl font-bold text-slate-900">Commission Dossier</h2>
            <span className="text-xs text-slate-500">{cartItems.length} Archive Pieces</span>
          </div>

          {/* Items List */}
          <div className="space-y-4 max-h-80 overflow-y-auto divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item._id} className="pt-3 first:pt-0 flex gap-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-slate-100" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                  <p className="text-[11px] text-slate-500">Qty: {item.qty} × {formatPrice(item.price)}</p>
                  {item.engravingText && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-mono font-bold rounded-md">
                      Engraved: "{item.engravingText}"
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-900">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="pt-4 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
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
              <span>Import Duty & Luxury Tax</span>
              <span className="font-bold text-slate-900">{formatPrice(tax)}</span>
            </div>

            <div className="flex justify-between">
              <span>Worldwide Insured Express</span>
              <span className="font-bold text-emerald-700">
                {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
              </span>
            </div>

            {giftPackaging && (
              <div className="flex justify-between text-amber-800">
                <span>Atelier Gift Packaging</span>
                <span className="font-bold">Complimentary</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-bold text-slate-950">
              <span>Total Commission</span>
              <span className="text-xl font-serif text-slate-950">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Loyalty Points Earning Badge */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-amber-900 text-xs">
            <Award size={16} className="text-amber-700 flex-shrink-0" />
            <span>This commission will award you <strong>+{Math.round(total)} Atelier Points</strong> toward VIP standing.</span>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-amber-600" />
              <span>Full Certificate of Provenance issued with auto-generated serial number.</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-amber-600" />
              <span>FedEx International Priority with signature verification upon delivery.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
