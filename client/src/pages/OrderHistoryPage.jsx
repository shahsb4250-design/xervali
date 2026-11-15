import React, { useState, useEffect } from 'react';
import { Package, Truck, ArrowRight, Clock, AlertCircle, ShieldCheck, Award } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export default function OrderHistoryPage({ navigate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Package size={40} className="mx-auto text-slate-400" />
        <h2 className="font-serif text-2xl font-bold">Client Identification Required</h2>
        <p className="text-xs text-slate-500">Sign in to your account to review historical acquisitions and live tracking status.</p>
        <button onClick={() => navigate('/login')} className="px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-bold uppercase">
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">CLIENT ACCOUNT</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">Acquisition History & Provenance</h1>
        <p className="text-xs text-slate-500 mt-1">Track current shipments, serial numbers, and view archived certificates.</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Consulting orders database...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <Package size={36} className="mx-auto text-slate-300" />
          <h3 className="font-serif text-lg font-bold">No orders recorded yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">You have not completed any purchases. Your future acquisitions will appear here.</p>
          <button onClick={() => navigate('/shop')} className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold uppercase">
            Browse Boutique
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-900">{order.orderNumber}</span>
                  <span className="text-[11px] text-slate-400 ml-3">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status}
                  </span>
                  <span className="font-serif font-bold text-sm text-slate-900">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-3">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 truncate">{item.name}</p>
                        <p className="text-slate-400">Qty: {item.qty} × {formatPrice(item.price)}</p>
                        {item.serialNumber && (
                          <span className="font-mono text-[10px] text-amber-800 font-bold block">
                            Serial: {item.serialNumber}
                          </span>
                        )}
                        {item.engravingText && (
                          <span className="text-[10px] italic text-slate-500 block">
                            Engraving: "{item.engravingText}"
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sm:text-right space-y-2">
                  {order.trackingNumber && (
                    <p className="text-xs text-slate-500">
                      Tracking: <strong className="font-mono text-slate-900">{order.trackingNumber}</strong>
                    </p>
                  )}
                  <div className="flex sm:justify-end gap-2 pt-1">
                    <button
                      onClick={() => navigate('/verify')}
                      className="px-3.5 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold rounded-xl hover:bg-amber-100 transition inline-flex items-center gap-1.5"
                    >
                      <Award size={13} /> Authenticity
                    </button>
                    <button
                      onClick={() => navigate(`/order-success/${order._id}`)}
                      className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-amber-600 transition"
                    >
                      Full Details →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
