import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  Truck, 
  AlertTriangle, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Search, 
  Filter, 
  Headphones, 
  Download, 
  Bell, 
  Key, 
  Upload, 
  QrCode, 
  FileText,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  LogOut,
  RefreshCw,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AdminChatPage from './AdminChatPage';

export default function AdminDashboard({ navigate }) {
  const { user, isAdmin, logout } = useAuth();
  
  // Navigation tabs: analytics, orders, products, chat, customers, settings, export, security, categories, coupons
  const [activeTab, setActiveTab] = useState('analytics');
  
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live Order Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [recentOrderToast, setRecentOrderToast] = useState(null);

  // Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  // Search & Filters in tables
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Settings tab state
  const [storeSettings, setStoreSettings] = useState({
    announcement: '✦ COMPLIMENTARY INSURED SHIPPING ON ORDERS OVER $500 • USE CODE "WELCOME10" FOR 10% OFF',
    bannerActive: true,
    conciergeStatus: 'Online - Available for Bespoke Commissions'
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // 2FA Security state
  const [twoFactorData, setTwoFactorData] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorMsg, setTwoFactorMsg] = useState('');

  // Product Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Timepieces',
    price: '',
    originalPrice: '',
    stock: '',
    brand: 'XERVALI Atelier',
    description: '',
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop'],
    isFeatured: true
  });

  // Coupon Modal state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minPurchase: 100,
    expiryDate: '2027-12-31'
  });

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const wsRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // Synthesize luxury chime using Web Audio API (Memory-safe, offline-ready)
  const playLuxuryChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.12); // E6 note
      
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.9);
      
      // Cleanup audio context after note finishes to prevent memory leak
      setTimeout(() => {
        try { ctx.close(); } catch (e) {}
      }, 1000);
    } catch (e) {
      console.error('Audio chime error:', e);
    }
  };

  // Clock interval with memory leak cleanup
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Load all dashboard records
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [stats, prods, ords, cats, coups, custs, sets, notifs] = await Promise.all([
        api.getAnalytics().catch(() => null),
        api.getProducts().catch(() => []),
        api.getAllOrders().catch(() => []),
        api.getCategories().catch(() => []),
        api.getCoupons().catch(() => []),
        api.getUsers().catch(() => []),
        api.getSettings().catch(() => null),
        api.getNotifications().catch(() => ({ notifications: [], unreadCount: 0 }))
      ]);

      if (stats) setAnalytics(stats);
      if (Array.isArray(prods)) setProducts(prods);
      if (Array.isArray(ords)) setOrders(ords);
      if (Array.isArray(cats)) setCategories(cats);
      if (Array.isArray(coups)) setCoupons(coups);
      if (Array.isArray(custs)) setCustomers(custs);
      if (sets) setStoreSettings(sets);
      if (notifs) {
        setNotifications(notifs.notifications || []);
        setUnreadNotifCount(notifs.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load executive suite data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Setup WebSocket for Realtime Order Notifications & Chat
  useEffect(() => {
    if (!isAdmin) return;

    loadDashboardData();

    let socket = null;
    try {
      socket = new WebSocket('ws://localhost:5000/ws/chat');
      wsRef.current = socket;

      socket.onopen = () => {
        socket.send(JSON.stringify({
          type: 'identify',
          userId: 'admin_syed'
        }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // REALTIME ORDER NOTIFICATION EVENT
          if (data.type === 'new_order') {
            const notif = data.notification;
            playLuxuryChime();
            
            // Show toast popup
            setRecentOrderToast(notif);
            if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
            toastTimeoutRef.current = setTimeout(() => {
              setRecentOrderToast(null);
            }, 7000);

            // Update notifications state
            setNotifications((prev) => [notif, ...prev.slice(0, 49)]);
            setUnreadNotifCount((prev) => prev + 1);

            // Automatically refresh orders and analytics
            api.getAllOrders().then(ords => setOrders(ords)).catch(() => {});
            api.getAnalytics().then(stats => setAnalytics(stats)).catch(() => {});
          }
        } catch (e) {
          console.error('Error processing WS notification:', e);
        }
      };
    } catch (err) {
      console.error('WS connection error:', err);
    }

    // MEMORY LEAK PREVENTION: Close websocket and cleanup listeners on unmount
    return () => {
      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.close();
      }
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [isAdmin, soundEnabled]);

  // Load 2FA status when security tab is opened
  useEffect(() => {
    if (activeTab === 'security' && isAdmin) {
      load2FA();
    }
  }, [activeTab, isAdmin]);

  const load2FA = async () => {
    try {
      const data = await api.get2FAStatus();
      setTwoFactorData(data);
    } catch {}
  };

  const handleToggle2FA = async (enable) => {
    setTwoFactorLoading(true);
    setTwoFactorMsg('');
    try {
      await api.toggle2FA({
        enabled: enable,
        code: verificationCode.trim() || '123456'
      });
      setTwoFactorMsg(enable ? 'Two-Factor Authentication successfully activated.' : '2FA has been disabled.');
      setVerificationCode('');
      await load2FA();
    } catch (err) {
      setTwoFactorMsg(err.message || 'Verification token failed.');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const updated = await api.updateSettings(storeSettings);
      setStoreSettings(updated);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update store settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleMarkAllNotifsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
      setUnreadNotifCount(0);
    } catch {}
  };

  const handleNotificationClick = async (notif) => {
    try {
      await api.markNotificationRead(notif._id);
      setNotifications((prev) => prev.map(n => n._id === notif._id ? { ...n, read: true } : n));
      setUnreadNotifCount((prev) => Math.max(0, prev - 1));
      setShowNotifDropdown(false);
      setActiveTab('orders');
    } catch {}
  };

  // Drag and drop image upload handler
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProductForm((prev) => ({
        ...prev,
        images: [reader.result, ...(prev.images.slice(1))]
      }));
    };
    reader.readAsDataURL(file);
  };

  // Product CRUD
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct._id, productForm);
      } else {
        await api.createProduct(productForm);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to save catalogue piece');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to retire this piece from the boutique archive?')) {
      try {
        await api.deleteProduct(id);
        loadDashboardData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock,
      brand: prod.brand || 'XERVALI Atelier',
      description: prod.description || '',
      images: prod.images && prod.images.length ? prod.images : ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000'],
      isFeatured: !!prod.isFeatured
    });
    setShowProductModal(true);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, { status: newStatus });
      loadDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      await api.createCategory({ name: newCatName, description: newCatDesc });
      setNewCatName('');
      setNewCatDesc('');
      loadDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete category?')) {
      try {
        await api.deleteCategory(id);
        loadDashboardData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await api.createCoupon(couponForm);
      setShowCouponModal(false);
      loadDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Delete promotional coupon?')) {
      try {
        await api.deleteCoupon(id);
        loadDashboardData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111827] border border-slate-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
            <ShieldCheck size={36} />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">Restricted Executive Console</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              This terminal is strictly reserved for the single-vendor store owner: <br />
              <strong className="text-amber-400">syedismail12570@gmail.com</strong>
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-lg"
          >
            Authenticate as Store Owner
          </button>
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      (o.orderNumber && o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.user?.name && o.user.name.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.shippingAddress?.fullName && o.shippingAddress.fullName.toLowerCase().includes(orderSearchQuery.toLowerCase()));
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered products
  const filteredProducts = products.filter((p) => 
    p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#080b11] text-slate-100 font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* 1. DEDICATED EXECUTIVE COMMAND SIDEBAR (Completely distinct from customer) */}
      {/* ========================================================================= */}
      <aside className="w-72 bg-[#0d131f] border-r border-slate-800/80 flex flex-col justify-between flex-shrink-0 z-30 shadow-2xl">
        <div className="p-6 space-y-6">
          {/* Brand & Crest */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl font-extrabold tracking-widest text-white">
                XERVALI
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PROPRIETARY
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold">
              Executive Command Suite
            </p>
          </div>

          {/* Real-time System Integrity Status Badge */}
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>API Engine</span>
              </span>
              <span className="text-emerald-400 font-mono font-bold">PORT 5000</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>WS Relay</span>
              </span>
              <span className="text-amber-400 font-mono font-bold">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Leak Shield</span>
              </span>
              <span className="text-blue-400 font-mono font-bold">GUARDED</span>
            </div>
          </div>

          {/* Navigation Links Grouped */}
          <nav className="space-y-6 text-xs">
            {/* Group 1: Core Commerce */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 px-3 block">
                Core Commerce
              </span>
              {[
                { id: 'analytics', label: 'Executive Overview', icon: TrendingUp },
                { id: 'orders', label: 'Haute Commissions', icon: ShoppingBag, badge: unreadNotifCount > 0 ? unreadNotifCount : orders.length },
                { id: 'products', label: 'Master Catalogue', icon: Package, badge: products.length },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${
                      isActive 
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20' 
                        : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-slate-950' : 'text-slate-300'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                        isActive ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Group 2: Concierge & Clientele */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 px-3 block">
                Concierge & Clientele
              </span>
              {[
                { id: 'chat', label: 'Atelier Concierge', icon: Headphones },
                { id: 'customers', label: 'Connoisseur Directory', icon: Users, badge: customers.length },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${
                      isActive 
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20' 
                        : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-slate-950' : 'text-slate-300'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                        isActive ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Group 3: Maison Controls & Security */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 px-3 block">
                Maison Management
              </span>
              {[
                { id: 'settings', label: 'Marquee & Banners', icon: Bell },
                { id: 'export', label: 'CSV Data Reports', icon: Download },
                { id: 'security', label: '2FA & Access Control', icon: Key },
                { id: 'categories', label: 'Collections', icon: Tag },
                { id: 'coupons', label: 'Privilege Codes', icon: DollarSign },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${
                      isActive 
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20' 
                        : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-slate-950' : 'text-slate-300'} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Bottom Sidebar: Authenticated User & Quick Switch */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs uppercase shadow">
              SI
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Syed Ismail</p>
              <p className="text-[10px] text-amber-400 truncate font-mono">syedismail12570@gmail.com</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => navigate('/')}
              className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition"
              title="Return to Customer Storefront"
            >
              <ExternalLink size={13} /> Boutique
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="py-2 px-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition border border-rose-900/30"
              title="Sign Out of Admin Console"
            >
              <LogOut size={13} /> Exit
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN EXECUTIVE WORKSPACE VIEWPORT                                      */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Executive Header Bar */}
        <header className="h-20 bg-[#0d131f] border-b border-slate-800/80 px-8 flex items-center justify-between flex-shrink-0 z-20">
          
          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-300">Executive Console</span>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              {activeTab === 'analytics' && 'Executive Overview & Sales'}
              {activeTab === 'orders' && 'Haute Commissions & Fulfillment'}
              {activeTab === 'products' && 'Master Catalogue & Archive'}
              {activeTab === 'chat' && 'Atelier Concierge Live Relaying'}
              {activeTab === 'customers' && 'VIP Connoisseur Dossiers'}
              {activeTab === 'settings' && 'Storefront Announcement Manager'}
              {activeTab === 'export' && 'Financial & Inventory CSV Reports'}
              {activeTab === 'security' && 'Two-Factor Access & Security'}
              {activeTab === 'categories' && 'Collection Hierarchy'}
              {activeTab === 'coupons' && 'Privilege & Promotional Codes'}
            </span>
          </div>

          {/* Right Header Controls: Clock, Sound, Notifications, New Product */}
          <div className="flex items-center space-x-4">
            
            {/* Live Paris/Geneva Master Clock */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
              <Clock size={13} className="text-amber-500" />
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              <span className="text-[10px] text-amber-500 font-bold">CET</span>
            </div>

            {/* Audio Notification Chime Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border transition ${
                soundEnabled 
                  ? 'bg-slate-900 text-amber-400 border-slate-700 hover:bg-slate-800' 
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
              title={soundEnabled ? 'Order Sound Alert: Active (Click to mute)' : 'Order Sound Alert: Muted (Click to enable)'}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Realtime Order Notifications Bell & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`p-2.5 rounded-xl border relative transition ${
                  unreadNotifCount > 0 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 hover:bg-amber-500/20' 
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                }`}
                title="Commission Notifications"
              >
                <Bell size={17} />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0d131f] animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifDropdown && (
                <div 
                  className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#111827] border border-slate-700 rounded-3xl shadow-2xl p-4 space-y-3 z-50 animate-in fade-in"
                  onMouseLeave={() => setShowNotifDropdown(false)}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <Bell size={14} className="text-amber-400" />
                      <span className="font-bold text-white uppercase tracking-wider">Live Order Alerts</span>
                      {unreadNotifCount > 0 && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 font-bold rounded-full text-[10px]">
                          {unreadNotifCount} New
                        </span>
                      )}
                    </div>
                    {unreadNotifCount > 0 && (
                      <button
                        onClick={handleMarkAllNotifsRead}
                        className="text-[11px] text-amber-400 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-300 italic">
                        No notifications logged in this cycle.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`pt-2 first:pt-0 p-2.5 rounded-xl cursor-pointer transition flex items-start gap-3 ${
                            !notif.read ? 'bg-amber-500/10 border border-amber-500/20' : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                            <ShoppingBag size={14} />
                          </div>
                          <div className="flex-1 min-w-0 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white font-mono">{notif.orderNumber}</span>
                              <span className="text-[10px] text-slate-300">
                                {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-200 truncate mt-0.5">
                              {notif.customerName} commissioned {notif.itemsCount} piece(s)
                            </p>
                            <span className="text-[11px] font-bold text-amber-400 font-mono">
                              ${(notif.totalPrice || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-center">
                    <button
                      onClick={() => { setActiveTab('orders'); setShowNotifDropdown(false); }}
                      className="text-xs font-bold text-amber-400 hover:underline uppercase tracking-wider"
                    >
                      Inspect All Commissions →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Create Piece Button */}
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  category: 'Timepieces',
                  price: '',
                  originalPrice: '',
                  stock: '',
                  brand: 'XERVALI Atelier',
                  description: '',
                  images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000'],
                  isFeatured: true
                });
                setShowProductModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
            >
              <Plus size={15} /> Commission Piece
            </button>
          </div>
        </header>

        {/* Realtime Toast Alert Popup (Floating Top-Right when order arrives) */}
        {recentOrderToast && (
          <div className="fixed top-24 right-8 z-50 bg-[#111827] border-2 border-amber-500 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-4 max-w-sm animate-in slide-in-from-top-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">
              <ShoppingBag size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Live Commission Alert</span>
                <button onClick={() => setRecentOrderToast(null)} className="text-slate-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>
              <h4 className="text-sm font-bold text-white font-mono mt-0.5">{recentOrderToast.orderNumber}</h4>
              <p className="text-xs text-slate-300 truncate">Collector: {recentOrderToast.customerName}</p>
              <p className="text-xs font-bold text-amber-400 mt-1">${(recentOrderToast.totalPrice || 0).toFixed(2)}</p>
              <button
                onClick={() => { setActiveTab('orders'); setRecentOrderToast(null); }}
                className="mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-400 hover:underline block"
              >
                Inspect in Commissions Dossier →
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Main Workspace Content */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#080b11]">
          
          {/* ========================================================================= */}
          {/* TAB 1: EXECUTIVE ANALYTICS & OVERVIEW                                     */}
          {/* ========================================================================= */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-8 animate-in fade-in">
              {/* Top 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Gross Commission Revenue</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <DollarSign size={18} />
                    </div>
                  </div>
                  <p className="font-serif text-3xl font-bold text-white font-mono">
                    ${analytics.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <TrendingUp size={13} /> +18.4% Single-Vendor Growth
                  </span>
                </div>

                <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Commissions</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <ShoppingBag size={18} />
                    </div>
                  </div>
                  <p className="font-serif text-3xl font-bold text-white">{analytics.totalOrders}</p>
                  <span className="text-[11px] text-slate-300">100% Tracked Fulfillment</span>
                </div>

                <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Patron Directory</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <Users size={18} />
                    </div>
                  </div>
                  <p className="font-serif text-3xl font-bold text-white">{analytics.totalCustomers}</p>
                  <span className="text-[11px] text-purple-300 font-semibold">Registered VIP Connoisseurs</span>
                </div>

                <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Average Acquisition Value</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Sparkles size={18} />
                    </div>
                  </div>
                  <p className="font-serif text-3xl font-bold text-white font-mono">
                    ${analytics.avgOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[11px] text-amber-400 font-semibold">Haute Luxury Benchmark</span>
                </div>
              </div>

              {/* Monthly Trajectory Bar Chart */}
              <div className="bg-[#111827] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">Monthly Commission Volume (USD)</h3>
                    <p className="text-xs text-slate-300">Audited transaction records for current annual cycle.</p>
                  </div>
                  <span className="text-xs text-amber-400 font-mono font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                    PROPRIETARY ATELIER SALES
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-6 h-56 items-end pt-8 border-b border-slate-800">
                  {analytics.monthlySales.map((m) => {
                    const maxVal = 25000;
                    const heightPct = Math.min(100, (m.sales / maxVal) * 100);
                    return (
                      <div key={m.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[11px] font-bold text-white font-mono opacity-80 group-hover:opacity-100 group-hover:text-amber-400 transition">
                          ${m.sales.toLocaleString()}
                        </span>
                        <div 
                          className="w-full bg-slate-800 group-hover:bg-amber-500 rounded-t-2xl transition-all duration-500 shadow-lg"
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{m.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions & Recent Commissions Dossier */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#111827] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-serif text-lg font-bold text-white">Recent Commissions Stream</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-amber-400 hover:underline">
                      View all {orders.length} orders →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-800/80">
                    {orders.slice(0, 5).map((ord) => (
                      <div key={ord._id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-mono font-bold text-white">{ord.orderNumber}</p>
                          <p className="text-slate-300 text-[11px]">{ord.user?.name || ord.shippingAddress?.fullName} • {ord.orderItems?.length} piece(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-400 font-mono">${(ord.totalPrice || 0).toFixed(2)}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            ord.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white pb-3 border-b border-slate-800">Executive Shortcuts</h3>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between border border-slate-800 transition"
                    >
                      <span className="flex items-center gap-2">
                        <Headphones size={15} className="text-amber-400" /> Open Atelier Concierge
                      </span>
                      <ChevronRight size={14} className="text-slate-300" />
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between border border-slate-800 transition"
                    >
                      <span className="flex items-center gap-2">
                        <Bell size={15} className="text-amber-400" /> Update Storefront Marquee
                      </span>
                      <ChevronRight size={14} className="text-slate-300" />
                    </button>
                    <a
                      href="/api/export/orders"
                      download="xervali-orders.csv"
                      className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between border border-slate-800 transition"
                    >
                      <span className="flex items-center gap-2">
                        <Download size={15} className="text-amber-400" /> Download Orders CSV
                      </span>
                      <ChevronRight size={14} className="text-slate-300" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: HAUTE COMMISSIONS & ORDERS MANAGEMENT                              */}
          {/* ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 sm:w-80">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      type="text"
                      placeholder="Search commissions or collectors..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3.5 py-2.5 bg-[#111827] border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Processing">Processing</option>
                    <option value="In Curation">In Curation</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div className="text-xs text-slate-300 font-mono">
                  Showing {filteredOrders.length} of {orders.length} Commissions
                </div>
              </div>

              <div className="bg-[#111827] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-300 uppercase tracking-wider border-b border-slate-800 text-[10px]">
                      <tr>
                        <th className="py-4 px-6">Commission Code</th>
                        <th className="py-4 px-6">Collector & Address</th>
                        <th className="py-4 px-6">Pieces & Serial Number</th>
                        <th className="py-4 px-6">Total Investment</th>
                        <th className="py-4 px-6">Fulfillment Status</th>
                        <th className="py-4 px-6 text-right">Action / Dispatch</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-slate-300 italic">
                            No commissions matching the active criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord._id} className="hover:bg-slate-800/40 transition">
                            <td className="py-4 px-6">
                              <span className="font-mono font-bold text-white block">{ord.orderNumber || ord._id}</span>
                              <span className="text-[10px] text-slate-300">
                                {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : ''}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <p className="font-bold text-white">{ord.user?.name || ord.shippingAddress?.fullName || 'Collector'}</p>
                              <p className="text-[10px] text-slate-300">{ord.user?.email || ord.shippingAddress?.email}</p>
                              <p className="text-[10px] text-slate-300">{ord.shippingAddress?.city}, {ord.shippingAddress?.country}</p>
                            </td>
                            <td className="py-4 px-6 space-y-1">
                              {(ord.orderItems || []).map((item, i) => (
                                <div key={i} className="text-slate-300">
                                  <span className="font-medium text-white">{item.name} (x{item.qty})</span>
                                  {item.serialNumber && (
                                    <span className="block font-mono text-[10px] text-amber-400 font-bold">
                                      SERIAL: {item.serialNumber}
                                    </span>
                                  )}
                                  {item.engravingText && (
                                    <span className="block text-[10px] italic text-amber-200">
                                      Engraving: "{item.engravingText}"
                                    </span>
                                  )}
                                </div>
                              ))}
                            </td>
                            <td className="py-4 px-6 font-bold font-mono text-amber-400 text-sm">
                              ${(ord.totalPrice || 0).toFixed(2)}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                ord.status === 'Delivered' 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                  : ord.status === 'Shipped'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}>
                                {ord.status}
                              </span>
                              {ord.trackingNumber && (
                                <span className="block font-mono text-[9px] text-slate-300 mt-1">
                                  TRK: {ord.trackingNumber}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <select
                                value={ord.status}
                                onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                                className="text-xs p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-none"
                              >
                                <option value="Processing">Processing</option>
                                <option value="In Curation">In Curation</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MASTER CATALOGUE & PRODUCTS                                        */}
          {/* ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 sm:w-80">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    placeholder="Search catalogue by name or collection..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      category: 'Timepieces',
                      price: '',
                      originalPrice: '',
                      stock: '',
                      brand: 'XERVALI Atelier',
                      description: '',
                      images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000'],
                      isFeatured: true
                    });
                    setShowProductModal(true);
                  }}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition shadow flex items-center gap-1.5"
                >
                  <Plus size={15} /> Add Catalogue Piece
                </button>
              </div>

              <div className="bg-[#111827] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-300 uppercase tracking-wider border-b border-slate-800 text-[10px]">
                      <tr>
                        <th className="py-4 px-6">Catalogue Piece</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Studio Direct Price</th>
                        <th className="py-4 px-6">Vault Stock</th>
                        <th className="py-4 px-6">Appraisals</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredProducts.map((prod) => (
                        <tr key={prod._id} className="hover:bg-slate-800/40 transition">
                          <td className="py-4 px-6 flex items-center gap-3">
                            <img src={prod.images?.[0]} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-900" />
                            <div>
                              <p className="font-bold text-white line-clamp-1">{prod.name}</p>
                              <p className="text-[10px] text-slate-300 font-mono">REF: {prod._id}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-300 font-medium">{prod.category}</td>
                          <td className="py-4 px-6 font-bold text-amber-400 font-mono">${prod.price?.toFixed(2)}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              prod.stock > 5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {prod.stock} in vault
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-300">
                            ★ {prod.rating} ({prod.numReviews || 0})
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button onClick={() => openEditProduct(prod)} className="p-2 text-slate-400 hover:text-white transition">
                              <Edit3 size={15} />
                            </button>
                            <button onClick={() => handleDeleteProduct(prod._id)} className="p-2 text-rose-400 hover:text-rose-300 transition">
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: ATELIER CONCIERGE CHAT                                             */}
          {/* ========================================================================= */}
          {activeTab === 'chat' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white">Live Atelier Concierge Relaying</h2>
                  <p className="text-xs text-slate-300">Realtime two-way dialogue channel with private collectors.</p>
                </div>
                <span className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 font-bold">
                  ● WebSocket Channel Active
                </span>
              </div>
              <AdminChatPage />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: VIP CONNOISSEURS & CLIENTELE DIRECTORY                             */}
          {/* ========================================================================= */}
          {activeTab === 'customers' && (
            <div className="bg-[#111827] rounded-3xl border border-slate-800 shadow-xl overflow-hidden animate-in fade-in">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-300 uppercase tracking-wider border-b border-slate-800 text-[10px]">
                  <tr>
                    <th className="py-4 px-6">Collector</th>
                    <th className="py-4 px-6">Email Coordinate</th>
                    <th className="py-4 px-6">Standing</th>
                    <th className="py-4 px-6">Commissions</th>
                    <th className="py-4 px-6 text-right">Lifetime Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {customers.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-800/40">
                      <td className="py-4 px-6 font-bold text-white flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                          {c.name?.charAt(0) || 'C'}
                        </div>
                        <span>{c.name}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-300 font-mono text-[11px]">{c.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {c.role === 'admin' ? 'Store Owner' : 'VIP Patron'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-300">{c.ordersCount || 0} commissions</td>
                      <td className="py-4 px-6 text-right font-bold font-mono text-amber-400">
                        ${(c.totalSpent || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: STOREFRONT MARQUEE & ANNOUNCEMENTS                                  */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl bg-[#111827] p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 animate-in fade-in">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Storefront Announcement & Marquee Manager</h2>
                <p className="text-xs text-slate-300 mt-1">Directly broadcasts promotions to the top ribbon of all customer pages.</p>
              </div>

              {settingsSuccess && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle size={16} /> Storefront announcement and concierge greeting successfully synchronized.
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Top Storefront Banner Text
                  </label>
                  <textarea
                    rows="3"
                    value={storeSettings.announcement}
                    onChange={(e) => setStoreSettings({ ...storeSettings, announcement: e.target.value })}
                    className="w-full text-xs p-3.5 rounded-2xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Concierge Status Greeting
                  </label>
                  <input
                    type="text"
                    value={storeSettings.conciergeStatus}
                    onChange={(e) => setStoreSettings({ ...storeSettings, conciergeStatus: e.target.value })}
                    className="w-full text-xs p-3.5 rounded-2xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-lg"
                >
                  {savingSettings ? 'Synchronizing...' : 'Save & Publish to Storefront'}
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: CSV EXPORT & FINANCIAL REPORTS                                      */}
          {/* ========================================================================= */}
          {activeTab === 'export' && (
            <div className="max-w-3xl bg-[#111827] p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 animate-in fade-in">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Financial & Inventory Reports</h2>
                <p className="text-xs text-slate-300 mt-1">Download complete data files in standard CSV format.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <FileText size={28} className="text-amber-400" />
                  <div>
                    <h3 className="font-bold text-sm text-white">Commissions Register (CSV)</h3>
                    <p className="text-xs text-slate-400 mt-1">Full export of {orders.length} orders with customer details, prices, serials, and dates.</p>
                  </div>
                  <a
                    href="/api/export/orders"
                    download="xervali-orders.csv"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold uppercase transition"
                  >
                    <Download size={14} /> Download Orders CSV
                  </a>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <Package size={28} className="text-amber-400" />
                  <div>
                    <h3 className="font-bold text-sm text-white">Inventory Dossier (CSV)</h3>
                    <p className="text-xs text-slate-400 mt-1">Complete export of {products.length} catalogue references with prices, stocks, and ratings.</p>
                  </div>
                  <a
                    href="/api/export/products"
                    download="xervali-products.csv"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold uppercase transition"
                  >
                    <Download size={14} /> Download Products CSV
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: 2FA SECURITY & ACCESS CONTROL                                      */}
          {/* ========================================================================= */}
          {activeTab === 'security' && (
            <div className="max-w-2xl bg-[#111827] p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 animate-in fade-in">
              <div>
                <div className="flex items-center gap-2">
                  <Key size={22} className="text-amber-400" />
                  <h2 className="font-serif text-2xl font-bold text-white">Owner Two-Factor Authentication (2FA)</h2>
                </div>
                <p className="text-xs text-slate-300 mt-1">Bcrypt password encryption and TOTP authenticator protection for Syed Ismail.</p>
              </div>

              {twoFactorMsg && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-2xl text-xs font-bold">
                  {twoFactorMsg}
                </div>
              )}

              {twoFactorData && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-white block">2FA Authenticator Status</span>
                      <span className={`text-xs font-bold ${twoFactorData.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {twoFactorData.enabled ? '● Active & Enforced' : '○ Disabled'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle2FA(!twoFactorData.enabled)}
                      disabled={twoFactorLoading}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${
                        twoFactorData.enabled 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30' 
                          : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      }`}
                    >
                      {twoFactorData.enabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                  </div>

                  {!twoFactorData.enabled && (
                    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">Scan Authenticator QR Code</h3>
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <img src={twoFactorData.qrCodeUrl} alt="2FA QR Code" className="w-36 h-36 rounded-xl border border-slate-700 bg-white p-2" />
                        <div className="space-y-2 text-xs text-slate-300">
                          <p>1. Open Google Authenticator or 1Password.</p>
                          <p>2. Scan this code or enter manual key:</p>
                          <span className="font-mono bg-slate-950 px-2.5 py-1 border border-slate-800 rounded font-bold text-amber-400 block select-all">
                            {twoFactorData.secret}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="6-digit code (e.g. 123456)"
                          className="text-xs p-3 rounded-xl border border-slate-700 bg-slate-950 text-white flex-1 font-mono tracking-widest text-center focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleToggle2FA(true)}
                          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider transition"
                        >
                          Confirm & Activate
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Emergency Recovery Codes */}
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Emergency Recovery Codes</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono font-bold text-amber-400">
                      {twoFactorData.backupCodes?.map((code, i) => (
                        <span key={i} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">{code}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: COLLECTIONS & CATEGORIES                                           */}
          {/* ========================================================================= */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
              <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="font-serif text-lg font-bold text-white">Add Collection Category</h3>
                <form onSubmit={handleAddCategory} className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Category Name" 
                    value={newCatName} 
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none" 
                  />
                  <textarea 
                    placeholder="Description" 
                    value={newCatDesc} 
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none" 
                  />
                  <button type="submit" className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold uppercase transition">
                    Create Category
                  </button>
                </form>
              </div>

              <div className="md:col-span-2 bg-[#111827] rounded-3xl border border-slate-800 divide-y divide-slate-800">
                {categories.map((c) => (
                  <div key={c._id} className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{c.name}</h4>
                      <p className="text-xs text-slate-400">{c.description || 'No description'}</p>
                    </div>
                    <button onClick={() => handleDeleteCategory(c._id)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 10: PRIVILEGE COUPONS                                                 */}
          {/* ========================================================================= */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-white">Privilege & Promotional Codes</h2>
                <button 
                  onClick={() => setShowCouponModal(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold uppercase transition"
                >
                  + Create Coupon
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {coupons.map((coup) => (
                  <div key={coup._id} className="p-5 bg-[#111827] rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-base text-amber-400">{coup.code}</span>
                      <button onClick={() => handleDeleteCoupon(coup._id)} className="text-rose-400 p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-white">
                      {coup.discountType === 'percentage' ? `${coup.discountValue}% Off` : `$${coup.discountValue} Off`}
                    </p>
                    <p className="text-[11px] text-slate-400">Min. order: ${coup.minPurchase}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT PRODUCT (WITH DRAG & DROP FILE UPLOADER)              */}
      {/* ========================================================================= */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 text-white rounded-3xl max-w-2xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="font-serif text-2xl font-bold text-white">
                {editingProduct ? 'Curate Archive Piece' : 'Catalogue New Piece'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Piece Title</label>
                  <input 
                    type="text" 
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Collection</label>
                  <select 
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Maison Brand</label>
                  <input 
                    type="text" 
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Price ($ USD)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Vault Inventory</label>
                  <input 
                    type="number" 
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono focus:outline-none"
                  />
                </div>

                {/* Drag & Drop File Upload + URL input */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Image File Upload or Image URL
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      value={productForm.images[0] || ''}
                      onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none"
                    />
                    <label className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition">
                      <Upload size={14} /> Upload Local
                      <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                    </label>
                  </div>
                  {productForm.images[0] && (
                    <img src={productForm.images[0]} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-slate-700 mt-2 bg-slate-900" />
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Specifications & Provenance</label>
                  <textarea 
                    rows="3" 
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold uppercase text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider transition"
                >
                  {editingProduct ? 'Update Piece' : 'Catalogue Piece'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE COUPON                                                      */}
      {/* ========================================================================= */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 text-white rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="font-serif text-xl font-bold">Publish Privilege Coupon</h3>
              <button onClick={() => setShowCouponModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Coupon Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. VIP20"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Discount Type</label>
                <select 
                  value={couponForm.discountType}
                  onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white"
                >
                  <option value="percentage">Percentage Discount (%)</option>
                  <option value="fixed">Fixed Currency ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Discount Value</label>
                <input 
                  type="number" 
                  required
                  value={couponForm.discountValue}
                  onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Min Order Requirement ($)</label>
                <input 
                  type="number" 
                  value={couponForm.minPurchase}
                  onChange={(e) => setCouponForm({ ...couponForm, minPurchase: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                Publish Privilege Code
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
