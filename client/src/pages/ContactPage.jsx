import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Bespoke Order Inquiry', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'Bespoke Order Inquiry', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">PRIVATE CONCIERGE</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
          Client Inquiries & Bespoke Commissions
        </h1>
        <p className="text-slate-500 text-sm font-light leading-relaxed">
          Our senior curators are at your disposal for private viewings, custom leather personalization, and timepiece allocations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
            <MapPin size={20} />
          </div>
          <h4 className="font-serif font-bold text-sm text-slate-900">Maison Headquarters</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-light">450 Avenue Montaigne<br />75008 Paris, France</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
            <Phone size={20} />
          </div>
          <h4 className="font-serif font-bold text-sm text-slate-900">Direct Telephone</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-light">+1 (800) 589-3920<br />Mon – Sat, 9:00 - 18:00 CET</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
            <Mail size={20} />
          </div>
          <h4 className="font-serif font-bold text-sm text-slate-900">Electronic Dispatch</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-light">concierge@xervali.com<br />24/7 client response desk</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md">
        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 size={44} className="mx-auto text-emerald-600" />
            <h3 className="font-serif text-2xl font-bold text-slate-900">Dispatch Received</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-light">
              Your inquiry has been relayed to our head horologist. A concierge will respond within 4 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">
              Transmit a Message
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Coordinates</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Inquiry Nature</label>
              <select 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Bespoke Order Inquiry">Bespoke Order / Custom Sizing</option>
                <option value="Order Tracking & Logistics">Order Tracking & Logistics</option>
                <option value="Certificate Verification">Certificate of Authenticity Verification</option>
                <option value="Press & Private Viewing">Press & Private Viewing</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Message</label>
              <textarea 
                rows="4" 
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How may our maison assist your collection..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
            >
              <Send size={14} /> Send Dispatch
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
