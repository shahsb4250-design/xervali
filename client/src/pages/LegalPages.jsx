import React from 'react';

export function PrivacyPage({ navigate }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">LEGAL STIPULATIONS</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">Privacy Policy & Client Data Protection</h1>
        <p className="text-xs text-slate-400 mt-1">Last Updated: October 2026 • Single-Vendor Global Protocol</p>
      </div>

      <div className="prose prose-slate text-xs leading-relaxed space-y-6 text-slate-600 font-light">
        <section className="space-y-2">
          <h3 className="font-serif text-base font-bold text-slate-900">1. Single-Vendor Confidentiality Commitment</h3>
          <p>
            XERVALI operates exclusively as an autonomous single-vendor atelier. We strictly do NOT sell, lease, monetize, or distribute your private client identity, coordinates, or purchase history to third-party ad networks or marketplace syndicates.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base font-bold text-slate-900">2. Collected Data & Purpose</h3>
          <p>
            Information collected through our boutique portal (including your legal name, delivery coordinates, telephone, and acquisition archive) is utilized solely for precision order fulfillment, certificate of authenticity issuance, and private concierge communication.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base font-bold text-slate-900">3. Payment Security & Encryption</h3>
          <p>
            Payment transactions are processed through tokenized, PCI-DSS Level 1 compliant financial gateways (Stripe and PayPal). Our servers never store raw credit card numbers or security CVV codes.
          </p>
        </section>
      </div>
    </div>
  );
}

export function TermsPage({ navigate }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">TERMS OF SALE</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">Terms & Conditions of Acquisition</h1>
        <p className="text-xs text-slate-400 mt-1">Maison Single-Vendor Governance • 2026 Edition</p>
      </div>

      <div className="prose prose-slate text-xs leading-relaxed space-y-6 text-slate-600 font-light">
        <section className="space-y-2">
          <h3 className="font-serif text-base font-bold text-slate-900">1. Authentic Provenance</h3>
          <p>
            Every product acquired through this official site is an authentic creation of XERVALI. Each mechanical timepiece and leather piece bears a permanent serial register referenced in our international database.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base font-bold text-slate-900">2. Insured Shipping & Delivery</h3>
          <p>
            All shipments are fully insured against loss or damage during transit via premier couriers (FedEx Express / UPS Air). Title passes upon documented client delivery signature.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base font-bold text-slate-900">3. 30-Day Bespoke Returns Policy</h3>
          <p>
            You may request a return or exchange within thirty (30) days of receipt, provided the piece remains unworn, in pristine condition, and with all security tags and protective seals intact.
          </p>
        </section>
      </div>
    </div>
  );
}
