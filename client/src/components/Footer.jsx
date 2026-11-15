import React from 'react';
import { ShieldCheck, Truck, RotateCcw, CreditCard, Mail, Phone, MapPin, Award } from 'lucide-react';

export default function Footer({ navigate }) {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 mt-20">
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-amber-500 mb-2">
              <Truck size={24} />
            </div>
            <h4 className="text-white font-semibold text-sm tracking-wide">Insured Express Courier</h4>
            <p className="text-xs text-slate-500">Complimentary delivery on all global orders exceeding $500.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-amber-500 mb-2">
              <Award size={24} />
            </div>
            <h4 className="text-white font-semibold text-sm tracking-wide">Certificate of Authenticity</h4>
            <p className="text-xs text-slate-500">Every single-vendor item is serial-numbered and hand-inspected.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-amber-500 mb-2">
              <RotateCcw size={24} />
            </div>
            <h4 className="text-white font-semibold text-sm tracking-wide">30-Day Bespoke Returns</h4>
            <p className="text-xs text-slate-500">Hassle-free return policy with pre-paid white-glove courier pickup.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-amber-500 mb-2">
              <ShieldCheck size={24} />
            </div>
            <h4 className="text-white font-semibold text-sm tracking-wide">Encrypted Checkout</h4>
            <p className="text-xs text-slate-500">Bank-level 256-bit SSL encryption with Stripe and PayPal security.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-widest text-white">
              XERVALI
            </span>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An independent luxury single-vendor maison dedicated to precision timekeeping, artisanal leathercraft, and timeless acoustic design.
            </p>
            <div className="pt-2 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-amber-500" />
                <span>450 Avenue Montaigne, 75008 Paris, France</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-amber-500" />
                <span>+1 (800) 589-3920 (Concierge line)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-amber-500" />
                <span>concierge@xervali.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Maison Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => navigate('/')} className="hover:text-white transition">Home</button></li>
              <li><button onClick={() => navigate('/shop')} className="hover:text-white transition">Boutique Collection</button></li>
              <li><button onClick={() => navigate('/verify')} className="hover:text-white text-amber-400 font-semibold transition">Authenticity Register</button></li>
              <li><button onClick={() => navigate('/loyalty')} className="hover:text-white transition">VIP Patron Club</button></li>
              <li><button onClick={() => navigate('/about')} className="hover:text-white transition">Heritage & Atelier</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => navigate('/chat')} className="hover:text-white text-amber-400 font-semibold transition">Atelier Concierge Live</button></li>
              <li><button onClick={() => navigate('/wishlist')} className="hover:text-white transition">Collector Wishlist</button></li>
              <li><button onClick={() => navigate('/orders')} className="hover:text-white transition">Track Your Order</button></li>
              <li><button onClick={() => navigate('/privacy')} className="hover:text-white transition">Privacy Policy</button></li>
              <li><button onClick={() => navigate('/terms')} className="hover:text-white transition">Terms & Conditions</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Private Newsletter</h4>
            <p className="text-xs text-slate-400 mb-3">
              Receive private invitations to limited-edition drops and atelier releases.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to XERVALI private dispatch.'); }} className="space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                required
                className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button 
                type="submit" 
                className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold py-2.5 rounded-lg transition"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600">
        <p>© 2026 XERVALI Single-Vendor eCommerce Platform. All rights reserved.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <button onClick={() => navigate('/privacy')} className="hover:text-slate-400">Privacy</button>
          <span>•</span>
          <button onClick={() => navigate('/terms')} className="hover:text-slate-400">Terms of Service</button>
          <span>•</span>
          <button onClick={() => navigate('/admin')} className="text-amber-500 hover:underline">Admin Login</button>
        </div>
      </div>
    </footer>
  );
}
