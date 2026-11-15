import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Heart, 
  Check, 
  MessageSquare,
  Compass,
  Award,
  Sparkles,
  Printer,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';

export default function ProductDetailPage({ productId, navigate }) {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Bespoke Monogramming State
  const [monogramEnabled, setMonogramEnabled] = useState(false);
  const [engravingText, setEngravingText] = useState('');
  const [engravingFont, setEngravingFont] = useState('font-serif'); // font-serif, font-mono, font-sans

  // 360 Degree Viewer State
  const [is360Active, setIs360Active] = useState(false);
  const [angle360, setAngle360] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);

  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await api.getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    if (productId) loadProduct();
  }, [productId]);

  // 360 auto spin loop
  useEffect(() => {
    let interval = null;
    if (isAutoSpinning && is360Active) {
      interval = setInterval(() => {
        setAngle360((prev) => (prev + 3) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAutoSpinning, is360Active]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, qty, {
      engravingText: monogramEnabled ? engravingText : ''
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to share your client appraisal.');
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const updated = await api.addReview(productId, {
        rating: reviewRating,
        comment: reviewComment
      });
      setProduct(updated);
      setReviewComment('');
    } catch (err) {
      alert(err.message || 'Failed to submit appraisal');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Consulting Maison Archive...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold">Piece not found in archive</h2>
        <p className="text-xs text-slate-500 mt-2">This reference might have been retired or made exclusively to private commission.</p>
        <button onClick={() => navigate('/shop')} className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold uppercase">
          Return to Boutique
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} /> Return to Boutique Archive
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCertModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <Award size={14} className="text-amber-600" /> View Authenticity Certificate
          </button>
          <button
            onClick={handleWishlistToggle}
            className={`p-2.5 rounded-full border transition flex items-center gap-1.5 text-xs font-semibold ${
              isFavorited
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <Heart size={16} className={isFavorited ? 'fill-rose-600' : ''} />
            <span className="hidden sm:inline">{isFavorited ? 'Saved in Archive' : 'Save to Wishlist'}</span>
          </button>
        </div>
      </div>

      {/* Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Left: Gallery & Interactive 360 Viewer */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-lg group">
            {is360Active ? (
              /* 360 Interactive Viewer Canvas Simulation */
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-white p-6 relative">
                <div 
                  className="w-full h-full flex items-center justify-center transition-transform duration-100"
                  style={{
                    transform: `perspective(600px) rotateY(${angle360}deg) scale(${1 - Math.abs(Math.sin((angle360 * Math.PI) / 180) * 0.15)})`
                  }}
                >
                  <img 
                    src={product.images[selectedImage] || product.images[0]} 
                    alt="360 view"
                    className="max-h-72 object-contain drop-shadow-2xl select-none pointer-events-none" 
                  />
                </div>

                {/* 360 Controls Overlay */}
                <div className="absolute bottom-4 inset-x-4 bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Compass size={14} className="animate-spin" /> Angle: {angle360}°
                    </span>
                    <button
                      onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                      className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 font-bold text-[10px] uppercase"
                    >
                      {isAutoSpinning ? 'Pause Rotation' : 'Auto Rotate 360°'}
                    </button>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle360}
                    onChange={(e) => setAngle360(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              /* Standard High-Res Image */
              <img 
                src={product.images[selectedImage] || product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500" 
              />
            )}

            <span className="absolute top-4 left-4 bg-slate-950/80 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm">
              {product.brand}
            </span>

            {/* 360 Toggle Button */}
            <button
              onClick={() => setIs360Active(!is360Active)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm flex items-center gap-1.5 transition"
            >
              <Compass size={15} className="text-amber-600" />
              <span>{is360Active ? 'Exit 360°' : '360° Precision View'}</span>
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && !is360Active && (
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition ${
                    selectedImage === idx ? 'border-amber-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Bespoke Actions */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="uppercase tracking-widest text-amber-700 font-bold">{product.category}</span>
              <span className="font-mono text-slate-400">REF: {product._id.toUpperCase()}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    size={16} 
                    fill={s <= Math.round(product.rating) ? "currentColor" : "none"} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">{product.rating} / 5.0</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">{product.numReviews} Client Appraisals</span>
            </div>
          </div>

          {/* Price Bar with Multi-Currency */}
          <div className="p-6 rounded-2xl bg-slate-100/70 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">Studio Direct Pricing</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-bold text-slate-950">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                product.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                {product.stock > 0 ? `In Stock (${product.stock} pieces)` : 'Sold Out'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-slate-600 leading-relaxed font-light space-y-3">
            <p>{product.description}</p>
          </div>

          {/* FEATURE: Bespoke Monogramming / Engraving Studio */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-950">
                  Bespoke Monogramming & Engraving
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={monogramEnabled} 
                  onChange={(e) => setMonogramEnabled(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {monogramEnabled && (
              <div className="space-y-3 pt-2 border-t border-amber-200/60 animate-in fade-in">
                <p className="text-[11px] text-slate-600">
                  Inscribe your initials, commission date, or family crest motto onto the casing or leather panel.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={18}
                    value={engravingText}
                    onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                    placeholder="e.g. S.I. 2026 or VERITAS"
                    className="flex-1 bg-white border border-amber-300 rounded-xl px-4 py-2 text-xs font-mono tracking-widest text-slate-900 focus:outline-none focus:border-amber-600 uppercase"
                  />
                  <select
                    value={engravingFont}
                    onChange={(e) => setEngravingFont(e.target.value)}
                    className="bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none"
                  >
                    <option value="font-serif">Maison Serif</option>
                    <option value="font-mono">Roman Classic</option>
                    <option value="font-sans">Modern Minimal</option>
                  </select>
                </div>

                {/* Live Brass Monogram Plaque Preview */}
                {engravingText && (
                  <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-amber-100 rounded-xl p-3 border border-amber-500/40 text-center shadow-inner">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-amber-300/80 block">Atelier Laser Engraving Inscription</span>
                    <span className={`text-base font-bold tracking-[0.2em] ${engravingFont}`}>
                      {engravingText}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add to Cart Controller */}
          <div className="pt-2 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-4">
              {/* Quantity Picker */}
              <div className="flex items-center bg-white border border-slate-300 rounded-2xl p-1 shadow-sm">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-xl transition disabled:opacity-30 font-bold"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold">{qty}</span>
                <button 
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={qty >= product.stock}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-xl transition disabled:opacity-30 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-xl ${
                  addedSuccess 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-950 hover:bg-amber-600 text-white'
                } disabled:bg-slate-300 disabled:cursor-not-allowed`}
              >
                {addedSuccess ? (
                  <>
                    <Check size={18} /> Added to Shopping Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add {qty > 1 ? `(${qty}) ` : ''}to Bag
                  </>
                )}
              </button>
            </div>

            {/* Direct Checkout Link */}
            {addedSuccess && (
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate('/cart')}
                  className="w-full py-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold uppercase tracking-wider text-center hover:bg-amber-100 transition"
                >
                  Proceed Directly to Bag & Checkout →
                </button>
              </div>
            )}
          </div>

          {/* Guarantees List */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-center">
            <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
              <Truck size={18} className="mx-auto text-amber-600" />
              <p className="text-[10px] font-bold uppercase text-slate-900">Insured Shipping</p>
              <p className="text-[9px] text-slate-500">Tracked global express</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
              <ShieldCheck size={18} className="mx-auto text-amber-600" />
              <p className="text-[10px] font-bold uppercase text-slate-900">5-Yr Guarantee</p>
              <p className="text-[9px] text-slate-500">Movement & casing</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
              <RotateCcw size={18} className="mx-auto text-amber-600" />
              <p className="text-[10px] font-bold uppercase text-slate-900">30-Day Returns</p>
              <p className="text-[9px] text-slate-500">Complimentary courier</p>
            </div>
          </div>

        </div>
      </div>

      {/* Reviews & Client Impressions Section */}
      <section className="pt-16 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">CLIENT DIALOGUE</span>
              <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">Verified Client Appraisals</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-serif font-bold text-slate-900">{product.rating}</div>
              <div className="text-xs text-slate-500">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill={s <= Math.round(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span>Based on {product.numReviews} appraisals</span>
              </div>
            </div>
          </div>

          {/* Submit Review Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900">Share Your Experience</h3>
            <p className="text-xs text-slate-500">Help fellow connoisseurs understand the touch, weight, and precision of this piece.</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Rating (1 to 5 Stars)</label>
                <div className="flex gap-2 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-125 transition"
                    >
                      <Star size={22} fill={star <= reviewRating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Your Appraisal & Assessment</label>
                <textarea 
                  rows="3" 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details on finish, precision, ergonomics, or unboxing experience..."
                  required
                  className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={reviewSubmitting}
                className="px-6 py-2.5 bg-slate-900 hover:bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition"
              >
                {reviewSubmitting ? 'Publishing...' : 'Submit Appraisal'}
              </button>
            </form>
          </div>

          {/* Existing Reviews List */}
          <div className="space-y-4">
            {(!product.reviews || product.reviews.length === 0) ? (
              <p className="text-xs text-slate-400 italic text-center py-6">Be the premier collector to evaluate this reference piece.</p>
            ) : (
              product.reviews.map((rev, idx) => (
                <div key={rev._id || idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-xs">
                        {rev.user ? rev.user.charAt(0) : 'C'}
                      </div>
                      <span className="text-xs font-bold text-slate-900">{rev.user || 'Collector'}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{rev.date || 'Recent'}</span>
                  </div>

                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} fill={s <= rev.rating ? "currentColor" : "none"} />
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-light">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      {/* Authenticity Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fcfaf5] text-slate-900 rounded-3xl p-8 max-w-lg w-full border-2 border-amber-600 shadow-2xl relative space-y-6">
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-1">
              <Award size={28} className="text-amber-700 mx-auto" />
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-500 block">Single-Vendor Heritage Guarantee</span>
              <h3 className="font-serif text-2xl font-bold tracking-widest text-slate-950">XERVALI</h3>
              <p className="text-[9px] uppercase tracking-widest text-amber-700 font-semibold">Atelier Montaigne · Paris</p>
            </div>

            <div className="border-y border-amber-900/10 py-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Reference Model:</span>
                <span className="font-bold">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Archive Code:</span>
                <span className="font-mono font-bold text-amber-800">XRV-{product._id.toUpperCase()}-2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Curator:</span>
                <span className="font-medium">Syed Ismail, Master Curator</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Warranty Coverage:</span>
                <span className="font-bold text-emerald-700">5-Year Global Maison Warranty</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Verification Gateway:</span>
                <span className="text-slate-800">xervali.com/verify</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
              >
                <Printer size={15} /> Print Certificate
              </button>
              <button
                onClick={() => setShowCertModal(false)}
                className="px-6 py-3 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 uppercase transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
