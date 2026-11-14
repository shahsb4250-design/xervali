import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Home, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  CreditCard,
  Clock,
  Award,
  Printer,
  Gift,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

export default function OrderSuccessPage({ orderId, navigate }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await api.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Generating Certificate & Dispatch File...</p>
      </div>
    );
  }

  const steps = [
    { label: 'Commission Confirmed', desc: 'Payment verified & sealed', done: true },
    { label: 'Atelier Preparation', desc: order?.giftPackaging ? 'Velvet packaging & wax seal' : 'Hand inspection & packing', done: order?.status !== 'Cancelled' },
    { label: 'Insured Courier', desc: order?.trackingNumber || 'FedEx International Priority', done: order?.status === 'Shipped' || order?.status === 'Delivered' },
    { label: 'Collector Delivery', desc: order?.deliveredAt ? 'Signed & Received' : 'Estimated 2-3 business days', done: order?.status === 'Delivered' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Success Top Banner */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 size={36} />
        </div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">TRANSACTION SEALED & RECORDED</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Thank you for patronizing XERVALI
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto font-light leading-relaxed">
          Your commission has been entered into the Maison archive. Transactional confirmation has been logged, and your Certificate of Provenance is registered.
        </p>
        <div className="inline-flex items-center gap-2 bg-slate-950 text-amber-400 px-5 py-2.5 rounded-full font-mono text-xs font-bold tracking-widest shadow-md">
          COMMISSION REF: {order?.orderNumber || orderId}
        </div>
      </div>

      {/* Tracking Stepper Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
            <Truck size={18} className="text-amber-600" /> Real-Time Atelier Courier Dispatch
          </h2>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition self-start sm:self-auto"
          >
            <Printer size={14} /> Print Invoice & Certificate
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-2">
          {steps.map((st, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition ${
                st.done ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}>
                {st.done ? '✓' : idx + 1}
              </div>
              <h4 className="text-xs font-bold text-slate-900">{st.label}</h4>
              <p className="text-[10px] text-slate-500 font-light">{st.desc}</p>
            </div>
          ))}
        </div>

        {order?.trackingNumber && (
          <div className="mt-4 p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-center text-xs text-slate-700 flex items-center justify-center gap-2">
            <span className="text-[10px] uppercase font-bold text-amber-800">Tracking Code:</span>
            <strong className="font-mono text-slate-900 font-bold">{order.trackingNumber}</strong>
          </div>
        )}
      </div>

      {/* Gift Packaging Display if chosen */}
      {order?.giftPackaging && (
        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
            <Gift size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-base font-bold text-amber-950">Atelier Gift Presentation Included</h3>
            <p className="text-xs text-slate-700">Enclosed in rigid black gift packaging with crimson beeswax crest seal.</p>
            {order.giftNote && (
              <div className="mt-2 p-3 bg-white rounded-xl border border-amber-200 italic font-serif text-xs text-slate-800">
                "{order.giftNote}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Itemized Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        
        {/* Left: Items list & Serial Numbers */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4">
          <h3 className="font-serif text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Acquired Masterpieces & Registered Serials
          </h3>
          <div className="space-y-4">
            {order?.orderItems?.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-slate-500">Qty: {item.qty} × {formatPrice(item.price)}</p>
                    <span className="font-bold text-slate-900 block mt-0.5">{formatPrice(item.price * item.qty)}</span>
                  </div>
                </div>

                {/* Serial Number & Verification Link */}
                {item.serialNumber && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="font-mono text-[10px] text-amber-800 font-bold">
                      SERIAL: {item.serialNumber}
                    </span>
                    <button
                      onClick={() => navigate('/verify')}
                      className="text-[10px] font-bold text-slate-900 underline hover:text-amber-600"
                    >
                      Verify Authenticity →
                    </button>
                  </div>
                )}

                {item.engravingText && (
                  <div className="text-[10px] italic text-slate-600">
                    Engraving: "{item.engravingText}"
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(order?.itemsPrice)}</span>
            </div>
            {order?.discountAmount > 0 && (
              <div className="flex justify-between text-amber-700 font-bold">
                <span>Discount:</span>
                <span>-{formatPrice(order?.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Sales Tax:</span>
              <span>{formatPrice(order?.taxPrice)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Paid:</span>
              <span>{formatPrice(order?.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Right: Address & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-3 text-xs">
            <h3 className="font-serif text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <MapPin size={16} className="text-amber-600" /> Destination Coordinates
            </h3>
            <p className="font-bold text-slate-900">{order?.shippingAddress?.fullName}</p>
            <p className="text-slate-600">{order?.shippingAddress?.address}</p>
            <p className="text-slate-600">{order?.shippingAddress?.city}, {order?.shippingAddress?.postalCode}</p>
            <p className="text-slate-600">{order?.shippingAddress?.country}</p>
            <p className="text-slate-500 pt-1">Tel: {order?.shippingAddress?.phone}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate('/verify')}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-bold uppercase tracking-wider text-center transition shadow-md flex items-center justify-center gap-2"
            >
              <Award size={15} /> Check Public Authenticity Certificate
            </button>
            <button 
              onClick={() => navigate('/loyalty')}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider text-center transition"
            >
              View VIP Patron Points Dossier
            </button>
            <button 
              onClick={() => navigate('/orders')}
              className="w-full py-3.5 bg-white border border-slate-300 text-slate-900 rounded-2xl text-xs font-bold uppercase tracking-wider text-center hover:bg-slate-50 transition"
            >
              View All Order Archives
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
