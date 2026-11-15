import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { LoyaltyProvider } from './context/LoyaltyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Existing Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { PrivacyPage, TermsPage } from './pages/LegalPages';

// New Luxury Pages
import SerialVerifyPage from './pages/SerialVerifyPage';
import WishlistPage from './pages/WishlistPage';
import LoyaltyPage from './pages/LoyaltyPage';
import LiveChatPage from './pages/LiveChatPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname || '/';
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlobalSearch = (term) => {
    setSearchQuery(term);
  };

  // Match routes
  const renderCurrentPage = () => {
    const path = currentPath;

    if (path === '/' || path === '') {
      return <HomePage navigate={navigate} />;
    }

    if (path === '/shop') {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category') || 'All';
      return (
        <ShopPage 
          navigate={navigate} 
          initialCategory={categoryParam} 
          initialSearch={searchQuery} 
        />
      );
    }

    if (path.startsWith('/product/')) {
      const parts = path.split('/');
      const productId = parts[2];
      return <ProductDetailPage productId={productId} navigate={navigate} />;
    }

    if (path === '/cart') {
      return <CartPage navigate={navigate} />;
    }

    if (path === '/checkout') {
      return <CheckoutPage navigate={navigate} />;
    }

    if (path.startsWith('/order-success/')) {
      const parts = path.split('/');
      const orderId = parts[2];
      return <OrderSuccessPage orderId={orderId} navigate={navigate} />;
    }

    if (path === '/orders') {
      return <OrderHistoryPage navigate={navigate} />;
    }

    if (path === '/login') {
      return <LoginPage navigate={navigate} />;
    }

    if (path === '/admin/login' || path === '/staff' || path === '/portal') {
      return <AdminLoginPage navigate={navigate} />;
    }

    if (path === '/register') {
      return <RegisterPage navigate={navigate} />;
    }

    if (path.startsWith('/admin')) {
      return <AdminDashboard navigate={navigate} />;
    }

    if (path === '/verify') {
      return <SerialVerifyPage navigate={navigate} />;
    }

    if (path === '/wishlist') {
      return <WishlistPage navigate={navigate} />;
    }

    if (path === '/loyalty') {
      return <LoyaltyPage navigate={navigate} />;
    }

    if (path === '/chat') {
      return <LiveChatPage navigate={navigate} />;
    }

    if (path === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    if (path === '/contact') {
      return <ContactPage navigate={navigate} />;
    }

    if (path === '/privacy') {
      return <PrivacyPage navigate={navigate} />;
    }

    if (path === '/terms') {
      return <TermsPage navigate={navigate} />;
    }

    // Default 404 fallback
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-slate-900">404 - Reference Not Located</h2>
        <p className="text-xs text-slate-500">The requested boutique document could not be found.</p>
        <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold uppercase">
          Return to Atelier Home
        </button>
      </div>
    );
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <WishlistProvider>
            <LoyaltyProvider>
              {isAdminRoute ? (
                // DEDICATED EXECUTIVE WORKSPACE (No Customer Navbar/Footer)
                <div className="min-h-screen bg-[#080b11] text-slate-100 selection:bg-amber-600 selection:text-white font-sans">
                  {renderCurrentPage()}
                </div>
              ) : (
                // CUSTOMER STOREFRONT LAYOUT
                <div className="min-h-screen flex flex-col bg-[#fafaf9] text-slate-900 selection:bg-slate-900 selection:text-white">
                  <Navbar 
                    currentPath={currentPath} 
                    navigate={navigate} 
                    onSearch={handleGlobalSearch} 
                  />

                  <main className="flex-grow">
                    {renderCurrentPage()}
                  </main>

                  <Footer navigate={navigate} />
                </div>
              )}
            </LoyaltyProvider>
          </WishlistProvider>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}
