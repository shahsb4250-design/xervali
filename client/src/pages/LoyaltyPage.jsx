import React from 'react';
import { Award, Crown, ShieldCheck, Gift, ArrowLeft, Sparkles, Check } from 'lucide-react';
import { useLoyalty } from '../context/LoyaltyContext';
import { useAuth } from '../context/AuthContext';

const TIER_BENEFITS = {
  'Silver Patron': [
    '✦ Private early access to limited edition drops',
    '✦ Complimentary wax-sealed gift packaging on all orders',
    '✦ Dedicated Concierge dispatch priority',
    '✦ Archival Certificate of Authenticity registration'
  ],
  'Gold Collector': [
    '✦ All Silver Patron privileges included',
    '✦ 5% perpetual connoisseur patronage discount',
    '✦ Complimentary bespoke monogramming & engraving service',
    '✦ Private invitation to annual Geneva & Paris salon previews',
    '✦ Direct line to Syed Ismail, Master Horologist'
  ],
  'Black Tier': [
    '✦ All Gold Collector privileges included',
    '✦ 10% perpetual connoisseur patronage discount',
    '✦ First right of acquisition on numbered bespoke pieces (01/10)',
    '✦ Complimentary insured courier dispatch anywhere globally',
    '✦ Lifetime Maison restorative maintenance guarantee',
    '✦ Custom engraved Black Tier Titanium Patronage Token'
  ]
};

const TIERS = [
  { name: 'Silver Patron', minPts: 0, maxPts: 999, icon: '🥈', badge: 'Patron', desc: 'Entry to the prestigious XERVALI collector society.' },
  { name: 'Gold Collector', minPts: 1000, maxPts: 2999, icon: '🥇', badge: 'Collector', desc: 'Elevated privileges with complimentary bespoke engraving.' },
  { name: 'Black Tier', minPts: 3000, maxPts: null, icon: '♠️', badge: 'Pinnacle', desc: 'The most rarefied circle of patronage in haute horlogerie.' }
];

export default function LoyaltyPage({ navigate }) {
  const { user } = useAuth();
  const { loyalty, loyaltyLoading } = useLoyalty();

  const currentTier = loyalty?.tier || 'Silver Patron';
  const currentPoints = loyalty?.points || (user ? 450 : 0);
  const nextTier = loyalty?.nextTier || 'Gold Collector';
  const nextAt = loyalty?.nextAt || 1000;
  const progress = loyalty?.progress !== undefined ? loyalty.progress : Math.round((currentPoints / nextAt) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} /> Return to Maison
        </button>
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          XERVALI Haute Société
        </span>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-8 sm:p-12 border border-amber-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative space-y-6 max-w-2xl">
          <div className="flex items-center gap-2 text-amber-400">
            <Crown size={20} />
            <span className="text-xs uppercase font-bold tracking-widest">VIP Tiered Collector Club</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            The XERVALI Patronage Dossier
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-light">
            Recognizing valued patrons who commission our timepieces, full-grain Italian leathercraft, and acoustic masterpieces. Earn 1 point per dollar spent.
          </p>

          {user ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-semibold">Active Patron Standing</span>
                  <div className="flex items-center gap-2 text-2xl font-serif font-bold text-amber-400">
                    <span>{currentTier === 'Black Tier' ? '♠️' : currentTier === 'Gold Collector' ? '🥇' : '🥈'}</span>
                    <span>{currentTier}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-semibold">Accumulated Patronage</span>
                  <span className="text-3xl font-bold font-mono text-white">{currentPoints.toLocaleString()} <span className="text-xs font-normal text-slate-300">PTS</span></span>
                </div>
              </div>

              {nextTier && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Progress to {nextTier}</span>
                    <span className="font-mono text-amber-400">{currentPoints} / {nextAt} pts</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {Math.max(0, nextAt - currentPoints)} more points to unlock permanent {nextTier} status.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-2">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-xs uppercase tracking-wider transition shadow-lg"
              >
                Sign In to View Your Dossier
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tier Breakdown Cards */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700">Hierarchy of Prestige</span>
          <h2 className="font-serif text-3xl font-bold text-slate-950">Three Tiers of Distinction</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => {
            const isCurrent = currentTier === tier.name;
            return (
              <div
                key={tier.name}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-all duration-300 relative ${
                  isCurrent
                    ? 'bg-amber-50/70 border-amber-400 shadow-xl ring-2 ring-amber-300'
                    : 'bg-white border-slate-200/80 shadow-sm hover:shadow-md'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow">
                    Your Current Tier
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{tier.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {tier.maxPts ? `${tier.minPts}–${tier.maxPts} pts` : `${tier.minPts}+ pts`}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-slate-950">{tier.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{tier.desc}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Privileges</span>
                    {TIER_BENEFITS[tier.name].map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit.replace('✦ ', '')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => navigate('/shop')}
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                      isCurrent
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    Acquire Archive Pieces
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 space-y-8">
        <h3 className="font-serif text-2xl font-bold text-slate-950 text-center">Earning & Redeeming</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 font-bold rounded-2xl flex items-center justify-center mx-auto text-lg">1</div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Commission</h4>
            <p className="text-[11px] text-slate-500">Earn 1 Atelier Point for every $1 spent on any handcrafted piece.</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 font-bold rounded-2xl flex items-center justify-center mx-auto text-lg">2</div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Appraise</h4>
            <p className="text-[11px] text-slate-500">Receive 50 points each time you submit a verified client impression.</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 font-bold rounded-2xl flex items-center justify-center mx-auto text-lg">3</div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Ascend</h4>
            <p className="text-[11px] text-slate-500">Automatic tier promotion as soon as point milestones are met.</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 font-bold rounded-2xl flex items-center justify-center mx-auto text-lg">4</div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Perpetuity</h4>
            <p className="text-[11px] text-slate-500">Your standing in the XERVALI archive never expires.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
