import React from 'react';
import { Heart, ShoppingBag, ArrowLeft, Trash2, Star, ShieldCheck } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export default function WishlistPage({ navigate }) {
  const { user } = useAuth();
  const { wishlistItems, removeFromWishlist, wishlistLoading } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} /> Return to Boutique Archive
        </button>
        <button
          onClick={() => navigate('/loyalty')}
          className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full hover:bg-amber-100 transition"
        >
          VIP Patron Rewards Available →
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center">
          <Heart size={26} className="text-rose-600 fill-rose-600" />
        </div>
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950">Private Collector Wishlist</h1>
          <p className="text-xs text-slate-500 mt-1">
            {wishlistItems.length} curated {wishlistItems.length === 1 ? 'piece' : 'pieces'} reserved in your private dossier
          </p>
        </div>
      </div>

      {!user && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <p className="text-xs text-amber-900">
            Sign in to synchronize your private archive across devices and receive price drop alerts.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-amber-600 transition"
          >
            Sign In
          </button>
        </div>
      )}

      {wishlistLoading ? (
        <div className="text-center py-24 space-y-4">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 uppercase tracking-widest">Opening Collector Vault...</p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-24 space-y-4 bg-white rounded-3xl border border-slate-200/80 p-8">
          <Heart size={44} className="mx-auto text-slate-300" />
          <h3 className="font-serif text-2xl font-bold text-slate-900">Your Archive is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Discover limited atelier chronographs, Tuscan leathercraft, and acoustic masterworks to save for future commission.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition shadow-lg"
          >
            <ShoppingBag size={15} /> Explore Boutique Archive
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div
                className="relative aspect-square overflow-hidden cursor-pointer bg-slate-100"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product._id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-rose-50 transition"
                  title="Remove from Archive"
                >
                  <Trash2 size={15} className="text-rose-500" />
                </button>
                <span className="absolute bottom-3 left-3 bg-slate-950/80 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {product.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-500 text-xs">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} fill={s <= Math.round(product.rating || 5) ? 'currentColor' : 'none'} />
                    ))}
                    <span className="text-[10px] text-slate-400">({product.numReviews || 0})</span>
                  </div>
                  <h3
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="font-serif text-base font-bold text-slate-900 cursor-pointer hover:text-amber-600 transition line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-950">{formatPrice(product.price)}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      product.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Sold Out'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      navigate('/cart');
                    }}
                    disabled={product.stock <= 0}
                    className="w-full py-3 bg-slate-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm disabled:bg-slate-300"
                  >
                    <ShoppingBag size={14} /> Move to Shopping Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
