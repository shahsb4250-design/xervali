import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  User, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut, 
  Package, 
  LayoutDashboard,
  Heart,
  Headphones,
  Globe,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';

export default function Navbar({ currentPath, navigate, onSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('✦ COMPLIMENTARY INSURED SHIPPING ON ORDERS OVER $500 • USE CODE "WELCOME10" FOR 10% OFF');

  const { user, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { selectedCurrency, currencies, changeCurrency } = useCurrency();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await api.getSettings();
        if (settings && settings.announcement) {
          setAnnouncement(settings.announcement);
        }
      } catch {}
    }
    fetchSettings();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
      navigate('/shop');
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top Banner */}
      <div className="bg-slate-950 text-slate-300 text-[11px] py-2 px-4 text-center font-medium tracking-wide flex justify-center items-center gap-3">
        <span className="truncate">{announcement}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-widest text-slate-950">
                XERVALI
              </span>
            </div>
            <span className="block text-[9px] uppercase tracking-[0.35em] text-amber-600 font-semibold -mt-0.5">
              Single-Vendor Atelier
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold uppercase tracking-wider">
            <button 
              onClick={() => navigate('/')} 
              className={`transition hover:text-amber-600 ${currentPath === '/' ? 'text-amber-600 font-bold' : 'text-slate-700'}`}
            >
              Maison
            </button>
            <button 
              onClick={() => navigate('/shop')} 
              className={`transition hover:text-amber-600 ${currentPath === '/shop' ? 'text-amber-600 font-bold' : 'text-slate-700'}`}
            >
              Boutique Archive
            </button>
            <button 
              onClick={() => navigate('/verify')} 
              className={`flex items-center gap-1 transition hover:text-amber-600 ${currentPath === '/verify' ? 'text-amber-600 font-bold' : 'text-slate-700'}`}
            >
              <ShieldCheck size={14} className="text-amber-600" /> Authenticity
            </button>
            <button 
              onClick={() => navigate('/loyalty')} 
              className={`flex items-center gap-1 transition hover:text-amber-600 ${currentPath === '/loyalty' ? 'text-amber-600 font-bold' : 'text-slate-700'}`}
            >
              <Award size={14} className="text-amber-600" /> VIP Club
            </button>
            <button 
              onClick={() => navigate('/chat')} 
              className={`flex items-center gap-1 transition hover:text-amber-600 ${currentPath === '/chat' ? 'text-amber-600 font-bold' : 'text-slate-700'}`}
            >
              <Headphones size={14} className="text-amber-600" /> Concierge
            </button>
            {isAdmin && (
              <button 
                onClick={() => navigate('/admin')} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition ${
                  currentPath.startsWith('/admin')
                    ? 'bg-amber-600 text-white' 
                    : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                }`}
              >
                <LayoutDashboard size={13} /> ADMIN SUITE
              </button>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-400 transition text-slate-800"
                title="Select Currency"
              >
                <Globe size={13} className="text-slate-500" />
                <span>{selectedCurrency.code} ({selectedCurrency.symbol})</span>
              </button>

              {currencyDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in"
                  onMouseLeave={() => setCurrencyDropdownOpen(false)}
                >
                  <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Regional Currency
                  </div>
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        changeCurrency(curr.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                        selectedCurrency.code === curr.code ? 'font-bold text-amber-700 bg-amber-50/60' : 'text-slate-700'
                      }`}
                    >
                      <span>{curr.label}</span>
                      <span className="font-mono text-slate-500 font-bold">{curr.symbol} {curr.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Trigger */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search archive..."
                    autoFocus
                    className="w-40 sm:w-56 text-xs py-2 pl-3 pr-8 rounded-full border border-slate-300 focus:outline-none focus:border-slate-900 transition"
                  />
                  <button 
                    type="button" 
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={15} />
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-slate-700 hover:text-slate-950 transition hover:bg-slate-100 rounded-full"
                  title="Search products"
                >
                  <Search size={19} />
                </button>
              )}
            </div>

            {/* Wishlist Button */}
            <button 
              onClick={() => navigate('/wishlist')}
              className="relative p-2 text-slate-700 hover:text-rose-600 hover:bg-slate-100 rounded-full transition"
              title="Private Wishlist"
            >
              <Heart size={20} className={wishlistItems.length > 0 ? 'text-rose-600 fill-rose-600' : ''} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* User Account / Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition text-slate-800"
                    title="User account"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                            Admin Store Owner
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <button 
                          onClick={() => { navigate('/admin'); setUserDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                        >
                          <LayoutDashboard size={14} className="text-amber-600" /> Admin Suite
                        </button>
                      )}

                      <button 
                        onClick={() => { navigate('/loyalty'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Award size={14} className="text-amber-600" /> VIP Patron Dossier
                      </button>

                      <button 
                        onClick={() => { navigate('/orders'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Package size={14} className="text-slate-400" /> My Orders & Provenance
                      </button>

                      <button 
                        onClick={() => { navigate('/wishlist'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Heart size={14} className="text-rose-500" /> Collector Wishlist
                      </button>

                      <button 
                        onClick={() => { navigate('/chat'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Headphones size={14} className="text-amber-600" /> Live Concierge
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button 
                        onClick={() => { logout(); setUserDropdownOpen(false); navigate('/'); }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-slate-300 hover:border-slate-900 transition text-slate-800"
                >
                  <User size={15} />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Shopping Bag Button */}
            <button 
              onClick={() => navigate('/cart')}
              className="relative p-2.5 bg-slate-950 text-white rounded-full hover:bg-amber-600 transition shadow-sm"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={18} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-6 space-y-4 animate-in slide-in-from-top">
          <button 
            onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-slate-800 border-b border-slate-100"
          >
            Maison Home
          </button>
          <button 
            onClick={() => { navigate('/shop'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-slate-800 border-b border-slate-100"
          >
            Boutique Archive
          </button>
          <button 
            onClick={() => { navigate('/verify'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-slate-800 border-b border-slate-100"
          >
            Authenticity Register
          </button>
          <button 
            onClick={() => { navigate('/loyalty'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-slate-800 border-b border-slate-100"
          >
            VIP Collector Club
          </button>
          <button 
            onClick={() => { navigate('/chat'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-slate-800 border-b border-slate-100"
          >
            Atelier Concierge Live
          </button>
          <button 
            onClick={() => { navigate('/wishlist'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-slate-800 border-b border-slate-100"
          >
            Collector Wishlist ({wishlistItems.length})
          </button>
          {isAdmin && (
            <button 
              onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 font-bold text-amber-700 bg-amber-50 px-3 rounded-lg"
            >
              Admin Dashboard Suite
            </button>
          )}
          {user ? (
            <div className="pt-2">
              <button 
                onClick={() => { navigate('/orders'); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 text-sm text-slate-600"
              >
                My Orders & Certificates
              </button>
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 text-sm text-rose-600 font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <button 
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                className="w-full bg-slate-950 text-white py-3 rounded-xl font-medium text-sm text-center"
              >
                Sign In / Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
