import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ShoppingBag, 
  Star, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  SlidersHorizontal,
  Award,
  Headphones,
  Key,
  Heart
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useWishlist } from '../context/WishlistContext';

export default function HomePage({ navigate }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [addedToast, setAddedToast] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodData, catData] = await Promise.all([
          api.getProducts({ featured: true }),
          api.getCategories()
        ]);
        setFeaturedProducts(prodData.slice(0, 4));
        setCategories(catData);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <div className="space-y-24">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</div>
          <span className="text-xs font-medium">Added <strong className="text-amber-400">{addedToast}</strong> to bag!</span>
          <button onClick={() => navigate('/cart')} className="ml-2 underline text-xs text-amber-400 hover:text-amber-300">View Bag</button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[82vh] flex items-center">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-35 filter brightness-75 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=2000&auto=format&fit=crop')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-widest uppercase">
              <Sparkles size={14} /> AUTUMN / WINTER 2026 MAISON RELEASE
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              Crafted with <br />
              <span className="italic font-normal text-amber-400">Uncompromising</span> Distinction.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light max-w-xl">
              An exclusive single-vendor archive of precision Swiss movements, vegetable-tanned Florentine leathercraft, and reference studio acoustics.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => navigate('/shop')}
                className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-sm rounded-full tracking-wider uppercase transition shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 group"
              >
                Explore Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => navigate('/about')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-full tracking-wider uppercase transition backdrop-blur-sm border border-white/20"
              >
                The Atelier Story
              </button>
            </div>

            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-6 text-slate-400 text-xs">
              <div>
                <p className="font-serif text-2xl font-bold text-white">100%</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">Original Designs</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-white">5-Year</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">Maison Warranty</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-white">48h</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">Insured Dispatch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Spotlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">CURATED CATEGORIES</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">Discover by Discipline</h2>
          </div>
          <button 
            onClick={() => navigate('/shop')}
            className="text-xs font-bold text-slate-900 hover:text-amber-600 flex items-center gap-1 transition"
          >
            All Categories <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <div 
              key={cat._id || idx}
              onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
              className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-slate-900 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between h-44"
            >
              <div>
                <span className="text-[10px] text-amber-600 font-bold tracking-widest uppercase">
                  {cat.productCount || 0} PRODUCTS
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mt-1 group-hover:text-amber-600 transition">
                  {cat.name}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                {cat.description}
              </p>
              <div className="flex items-center text-xs font-semibold text-slate-800 pt-2 group-hover:translate-x-1 transition-transform">
                Browse <ChevronRight size={14} className="ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">LIMITED EDITIONS</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Signature Masterpieces</h2>
          <p className="text-slate-500 text-sm mt-3 font-light">
            Individually verified and numbered by the store owner before dispatched in bespoke signature packaging.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div 
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group cursor-pointer bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {product.brand}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isInWishlist(product._id)) {
                        removeFromWishlist(product._id);
                      } else {
                        addToWishlist(product._id);
                      }
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition z-10"
                    title="Save to Wishlist"
                  >
                    <Heart size={14} className={isInWishlist(product._id) ? "text-rose-600 fill-rose-600" : "text-slate-600"} />
                  </button>
                  {/* Quick Add Overlay */}
                  <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full bg-slate-900 hover:bg-amber-600 text-white py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={14} /> Quick Add to Bag
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>{product.category}</span>
                      <div className="flex items-center text-amber-500 font-semibold text-[11px]">
                        <Star size={12} fill="currentColor" className="mr-0.5" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400 ml-1">({product.numReviews})</span>
                      </div>
                    </div>
                    <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-amber-600 transition line-clamp-1">
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-slate-950">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${product.stock > 5 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Sold Out'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/shop')}
            className="px-8 py-3.5 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-full text-xs font-bold tracking-widest uppercase transition"
          >
            Browse All {featuredProducts.length}+ Archive Pieces
          </button>
        </div>
      </section>

      {/* Maison Values / Brand Story Banner */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">THE SINGLE-VENDOR PHILOSOPHY</span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                Not a Marketplace. <br />
                <span className="text-amber-400 italic">One Singular Standard.</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed font-light">
                Unlike mass multi-vendor platforms filled with anonymous dropshippers, every single item at XERVALI is designed, sourced, quality-controlled, and shipped exclusively by our proprietary studio.
              </p>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">✓</span>
                  Direct studio-to-client pricing without middleman commission markups
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">✓</span>
                  Every batch tested against military-grade durability & precision tolerances
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">✓</span>
                  Direct owner concierge service for custom orders, repairs, and engraving
                </li>
              </ul>
              <button 
                onClick={() => navigate('/about')}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-full transition"
              >
                Read Our Full Manifesto
              </button>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop" 
                alt="Our Paris Workshop" 
                className="rounded-3xl shadow-2xl object-cover w-full h-[400px] border border-slate-800"
              />
              <div className="absolute -bottom-6 -left-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl max-w-xs hidden sm:block">
                <p className="font-serif text-sm font-semibold text-white">"Perfection is attained not when there is nothing more to add, but when there is nothing left to take away."</p>
                <p className="text-[10px] text-amber-400 uppercase tracking-widest mt-2">— Founder & Master Watchmaker</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
