import React, { useState } from 'react';
import { ShieldCheck, Search, AlertCircle, CheckCircle, Award, Printer, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

export default function SerialVerifyPage({ navigate }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await api.verifySerial(query.trim());
      setResult(data);
    } catch (err) {
      setError('Verification register temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Navigation & Brand */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')} 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={16} /> Return to Maison
          </button>
          <span className="font-serif text-lg tracking-widest text-amber-500 font-bold">XERVALI ATELIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
            <ShieldCheck size={32} />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">Authenticity & Provenance Register</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Every XERVALI commission is inscribed with an individual serial benchmark and entered into our single-vendor heritage archive. Enter your code below.
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-md">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-amber-400">
            Serial Number, Order Number, or Reference Code
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. XRV-CHRO-4821 or XRV-84920"
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition text-sm uppercase tracking-wider"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {loading ? 'Verifying...' : 'Verify Reference'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-slate-400">
            <span>Sample references:</span>
            <button type="button" onClick={() => setQuery('XRV-84920')} className="text-amber-400 underline hover:text-amber-300">XRV-84920</button>
            <span>•</span>
            <button type="button" onClick={() => setQuery('PROD_1')} className="text-amber-400 underline hover:text-amber-300">PROD_1</button>
            <span>•</span>
            <button type="button" onClick={() => setQuery('XRV-ROYAL-2026')} className="text-amber-400 underline hover:text-amber-300">XRV-ROYAL-2026</button>
          </div>
        </form>

        {error && (
          <div className="flex items-center gap-3 bg-rose-950/60 border border-rose-500/40 rounded-2xl p-4">
            <AlertCircle size={20} className="text-rose-400 flex-shrink-0" />
            <p className="text-rose-300 text-xs">{error}</p>
          </div>
        )}

        {/* Verification Result */}
        {result && (
          <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 ${
            result.verified ? 'bg-white/5 border-amber-500/40' : 'bg-rose-950/40 border-rose-500/30'
          }`}>
            {result.verified ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={32} className="text-emerald-400 flex-shrink-0" />
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-white">Authenticity Certified</h2>
                      <p className="text-[11px] text-emerald-400 uppercase tracking-widest mt-0.5">Official Single-Vendor Provenance</p>
                    </div>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition self-start sm:self-auto"
                  >
                    <Printer size={15} /> Print Certificate
                  </button>
                </div>

                {/* Parchment Certificate Card */}
                <div className="bg-[#fcfaf5] text-slate-900 rounded-2xl p-6 sm:p-8 border-2 border-amber-600/40 shadow-2xl relative overflow-hidden print:m-0 print:border-none">
                  {/* Decorative Border */}
                  <div className="absolute inset-1.5 border border-amber-800/20 rounded-xl pointer-events-none" />
                  
                  <div className="text-center space-y-2 mb-8 relative">
                    <div className="flex items-center justify-center gap-2 text-amber-700">
                      <Award size={20} />
                      <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Certificate of Provenance & Warranty</span>
                    </div>
                    <h3 className="font-serif text-3xl font-extrabold tracking-widest text-slate-950">XERVALI</h3>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-slate-500 font-semibold">Atelier Montaigne · Paris · Geneve</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left border-y border-amber-900/10 py-6">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">Registered Model</span>
                      <span className="text-sm font-bold text-slate-900">{result.modelName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">Archive Serial Reference</span>
                      <span className="text-sm font-mono font-bold text-amber-800">{result.serialNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">Curator / Master Horologist</span>
                      <span className="text-xs font-semibold text-slate-800">{result.artisan}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">Date of Atelier Issue</span>
                      <span className="text-xs font-semibold text-slate-800">{result.dateOfManufacture}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">Inspection Standard</span>
                      <span className="text-xs text-slate-700">{result.inspectionRating}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">Maison Warranty Status</span>
                      <span className="text-xs font-bold text-emerald-700">{result.warrantyStatus}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">Registered Collector Monogram / Provenance</span>
                      <span className="text-xs italic text-slate-700">{result.engravingNote || 'Original Atelier Archive'} — In custody of {result.ownerName}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-4">
                    <span>SEALED BY SYED ISMAIL, FOUNDER</span>
                    <span className="font-mono text-[9px] text-slate-400">HASH: SHA256-XRV-ARCHIVE-OK</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <AlertCircle size={32} className="text-rose-400 flex-shrink-0" />
                <div>
                  <h2 className="font-serif text-xl font-bold text-rose-300">Reference Unregistered</h2>
                  <p className="text-xs text-rose-300 mt-1">{result.message}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1 text-center">
            <p className="text-xs font-bold text-amber-400">Single-Vendor Integrity</p>
            <p className="text-[11px] text-slate-400">Directly created & curated under Syed Ismail's supervision.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1 text-center">
            <p className="text-xs font-bold text-amber-400">5-Year Global Guarantee</p>
            <p className="text-[11px] text-slate-400">Full movement, hardware, and structural warranty included.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1 text-center">
            <p className="text-xs font-bold text-amber-400">Archival Registry</p>
            <p className="text-[11px] text-slate-400">Preserved in perpetuity for future private appraisal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
