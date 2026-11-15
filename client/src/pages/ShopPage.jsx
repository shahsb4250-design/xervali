import React, { useState, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  ShoppingBag, 
  X, 
  ChevronDown, 
  ArrowUpDown,
  Filter,
  Heart
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useWishlist } from '../context/WishlistContext';

export default function ShopPage({ navigate, initialCategory = 'All', initialSearch = '' }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortOption, setSortOption] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(2500);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(null);

  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    async function loadCategories() {
      try {
        const catData = await api.getCategories();
        setCategories(catData);
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = {
          sort: sortOption
        };
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (searchTerm) {
          params.search = searchTerm;
        }
        if (maxPrice < 2500) {
          params.maxPrice = maxPrice;
        }
        const data = await api.getProducts(params);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory, searchTerm, sortOption, maxPrice]);

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Toast */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</div>
          <span className="text-xs font-medium">Added <strong className="text-amber-400">{addedToast}</strong> to bag</span>
          <button onClick={() => navigate('/cart')} className="ml-2 underline text-xs text-amber-400">View Bag</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="mb-10 pb-8 border-b border-slate-200">
        <span className="text-xs font-bold text-amber-600 tracking-widest uppercase">CATALOGUE ARCHIVE</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 mt-1">The Boutique Collection</h1>
        <p className="text-slate-500 text-sm mt-2 max-w-2xl font-light">
          Explore our singular portfolio of high-horology watches, tailored Italian leather goods, and reference acoustic headphones.
        </p>
      </div>

      {/* Mobile Filter Button */}
      <div className="flex lg:hidden justify-between items-center mb-6">
        <button 
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 shadow-sm"
        >
          <Filter size={16} /> Filters & Refinements
        </button>

        <select 
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-2.5 font-medium text-slate-800"
        >
          <option value="newest">Featured & Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block space-y-8 pr-4">
          {/* Search Box */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Search Collection</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, brand, metal..."
                className="w-full text-xs pl-10 pr-8 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900 bg-white"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">Categories</label>
              {selectedCategory !== 'All' && (
                <button 
                  onClick={() => setSelectedCategory('All')} 
                  className="text-[11px] text-amber-600 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition flex justify-between items-center ${
                  selectedCategory === 'All' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>All Disciplines</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition flex justify-between items-center ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase() 
                      ? 'bg-slate-900 text-white font-semibold' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'text-amber-400' : 'text-slate-400'}`}>
                    {cat.productCount}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">Max Price</label>
              <span className="text-xs font-bold text-slate-900">${maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="2500" 
              step="50"
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>$100</span>
              <span>$2,500+</span>
            </div>
          </div>

          {/* Single-Vendor Quality Guarantee */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-2">
            <p className="font-bold uppercase tracking-wider text-[10px] text-amber-800">Studio Direct Guarantee</p>
            <p className="text-[11px] leading-relaxed text-amber-900/80">
              Each piece ships with individual certificate of warranty signed by the artisan.
            </p>
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-3">
          {/* Top Sort & Count Bar */}
          <div className="hidden lg:flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{products.length}</strong> distinctive creations
            </span>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Sort by:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-slate-900"
              >
                <option value="newest">Featured & Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Product Items */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
              <p className="font-serif text-xl font-bold text-slate-800 mb-2">No matching pieces located</p>
              <p className="text-xs text-slate-500 mb-6">Try broadening your search criteria or resetting filters.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchTerm(''); setMaxPrice(2500); }}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div 
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group cursor-pointer bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
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

                    <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="w-full bg-slate-900 hover:bg-amber-600 text-white py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={14} /> Add to Bag
                      </button>
                    </div>
                  </div>

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
                      <h3 className="font-serif text-sm font-bold text-slate-900 group-hover:text-amber-600 transition line-clamp-1">
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
                        {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="w-80 bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <h3 className="font-serif text-lg font-bold">Filter Options</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase mb-2">Categories</label>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory('All'); setMobileFilterOpen(false); }}
                  className="w-full text-left py-1.5 text-xs font-medium text-slate-700"
                >
                  All Disciplines
                </button>
                {categories.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => { setSelectedCategory(c.name); setMobileFilterOpen(false); }}
                    className="w-full text-left py-1.5 text-xs font-medium text-slate-700"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
