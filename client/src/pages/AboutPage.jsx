import React from 'react';
import { Award, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';

export default function AboutPage({ navigate }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">ATELIER HERITAGE</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
          The Single-Vendor Distinction
        </h1>
        <p className="text-slate-500 text-sm font-light leading-relaxed">
          In an era crowded with anonymous marketplaces and unvetted third-party resellers, XERVALI stands apart as an uncompromising single-vendor maison.
        </p>
      </div>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/9] bg-slate-900 border border-slate-200">
        <img 
          src="https://images.unsplash.com/photo-1513094735237-8f2714d57c13?q=80&w=1500&auto=format&fit=crop" 
          alt="Artisanal Workshop" 
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
        <div className="absolute bottom-8 left-8 right-8 text-white max-w-xl">
          <p className="font-serif text-2xl font-bold">"Direct from the master craftsman's bench to your collection."</p>
          <p className="text-xs text-amber-400 uppercase tracking-wider mt-2">Established 2026 • Paris • Florence • Zurich</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Proprietary Creation</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-light">
            We do not host outside vendors. Every mechanical caliber, leather grain, and acoustic driver is conceived in our private atelier.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Traceable Provenance</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-light">
            From surgical-grade 316L titanium to Tuscan vegetable tanned skins, all materials are certified ethical and serial-registered.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Direct Concierge</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-light">
            When you inquire with XERVALI, you communicate directly with the horologists and craftsmen who assembled your piece.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-bold">Ready to Experience the Collection?</h3>
          <p className="text-xs text-slate-400 font-light">Discover our seasonal releases or speak with a private curator.</p>
        </div>
        <button 
          onClick={() => navigate('/shop')}
          className="px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-full transition shadow-lg flex-shrink-0"
        >
          View Archive Portfolio
        </button>
      </div>
    </div>
  );
}
