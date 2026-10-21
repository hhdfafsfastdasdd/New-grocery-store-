/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaName,
  CartItem,
  Category,
  Order,
  Product,
  StoreSettings,
} from './types';
import {
  getProducts,
  getCategories,
  getOrders,
  getStoreSettings,
  subscribeToProducts,
  subscribeToCategories,
  subscribeToOrders,
  subscribeToSettings,
} from './services/storage';
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
  getCartItemCount,
  subscribeToCart,
  getSelectedArea,
  setSelectedArea as saveSelectedArea,
} from './services/cart';
import { getAdminSession, subscribeToAuth } from './services/auth';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomOrderModal } from './components/CustomOrderModal';
import { InfoModals } from './components/InfoModals';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer, showToast } from './components/common/Toast';
import { CheckCircle2, MessageCircle, X } from 'lucide-react';

export default function App() {
  // Store data
  const [products, setProducts] = useState<Product[]>(getProducts);
  const [categories, setCategories] = useState<Category[]>(getCategories);
  const [orders, setOrders] = useState<Order[]>(getOrders);
  const [settings, setSettings] = useState<StoreSettings>(getStoreSettings);

  // Cart & Customer state
  const [cart, setCart] = useState<CartItem[]>(getCart);
  const [selectedArea, setSelectedArea] = useState<AreaName>(getSelectedArea);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals & Panels
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [customOrderModalOpen, setCustomOrderModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [infoModalType, setInfoModalType] = useState<'about' | 'contact' | 'terms' | null>(null);

  // Admin routing & auth
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.hash === '#admin' || window.location.pathname === '/admin';
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => !!getAdminSession());
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);

  // Successful Order placement dialog
  const [lastPlacedOrder, setLastPlacedOrder] = useState<string | null>(null);

  // 1. Storage subscriptions for live data changes
  useEffect(() => {
    const unsubProducts = subscribeToProducts(() => setProducts(getProducts()));
    const unsubCategories = subscribeToCategories(() => setCategories(getCategories()));
    const unsubOrders = subscribeToOrders(() => setOrders(getOrders()));
    const unsubSettings = subscribeToSettings(() => setSettings(getStoreSettings()));
    const unsubCart = subscribeToCart((updated) => setCart([...updated]));
    const unsubAuth = subscribeToAuth((session) => setIsAdminLoggedIn(!!session));

    return () => {
      unsubProducts();
      unsubCategories();
      unsubOrders();
      unsubSettings();
      unsubCart();
      unsubAuth();
    };
  }, []);

  // Sync hash routing for /admin
  useEffect(() => {
    const handleHash = () => {
      const isHashAdmin = window.location.hash === '#admin';
      setIsAdminView(isHashAdmin);
      if (isHashAdmin && !isAdminLoggedIn) {
        setAdminLoginModalOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAdminLoggedIn]);

  const handleSelectArea = (area: AreaName) => {
    setSelectedArea(area);
    saveSelectedArea(area);
    showToast(`Delivery area set to ${area}, Odisha`, 'info');
  };

  const cartQuantities = useMemo(() => {
    const map: { [id: string]: number } = {};
    cart.forEach((i) => {
      map[i.product.id] = i.quantity;
    });
    return map;
  }, [cart]);

  const cartItemCount = getCartItemCount(cart);
  const cartTotal = getCartTotal(cart);

  const handleAddToCart = (product: Product, qty = 1) => {
    const res = addToCart(product, qty);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    updateCartQuantity(productId, qty);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    showToast('Item removed from basket.', 'info');
  };

  const handleClearCart = () => {
    clearCart();
    showToast('Shopping basket cleared.', 'info');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setIsAdminView(true);
      window.location.hash = 'admin';
    } else {
      setAdminLoginModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setAdminLoginModalOpen(false);
    setIsAdminLoggedIn(true);
    setIsAdminView(true);
    window.location.hash = 'admin';
  };

  const handleExitAdmin = () => {
    setIsAdminView(false);
    window.location.hash = '';
  };

  // Related products for detail modal
  const relatedProducts = useMemo(() => {
    if (!selectedProductForModal) return [];
    return products.filter(
      (p) =>
        p.category === selectedProductForModal.category &&
        p.id !== selectedProductForModal.id &&
        p.status === 'active'
    );
  }, [selectedProductForModal, products]);

  // If in Admin view and authenticated, render full Admin Control Center
  if (isAdminView && isAdminLoggedIn) {
    return (
      <>
        <ToastContainer />
        <AdminDashboard
          products={products}
          categories={categories}
          orders={orders}
          settings={settings}
          onExit={handleExitAdmin}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-gray-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950 pb-16 md:pb-0">
      <ToastContainer />

      {/* Main Top Navigation */}
      <Navbar
        settings={settings}
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        selectedArea={selectedArea}
        onSelectArea={handleSelectArea}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenCustomOrder={() => setCustomOrderModalOpen(true)}
        onOpenContact={() => setInfoModalType('contact')}
        onOpenAbout={() => setInfoModalType('about')}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onResetFilters={handleResetFilters}
      />

      {/* Main Store Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          selectedArea={selectedArea}
          onSelectArea={handleSelectArea}
          onShopNow={() => {
            const el = document.getElementById('catalog-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreCategories={() => {
            const el = document.getElementById('categories-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenCustomOrder={() => setCustomOrderModalOpen(true)}
        />

        {/* 16 Categories Grid */}
        <CategoriesSection
          categories={categories}
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* Products Catalog with Live Filters, Search, and Cart Steppers */}
        <ProductCatalog
          products={products}
          categories={categories}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          cartQuantities={cartQuantities}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onSearchChange={setSearchQuery}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onQuickView={(p) => setSelectedProductForModal(p)}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Store Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={handleOpenAdmin}
        onOpenAbout={() => setInfoModalType('about')}
        onOpenContact={() => setInfoModalType('contact')}
        onOpenTerms={() => setInfoModalType('terms')}
        onOpenCustomOrder={() => setCustomOrderModalOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Sticky Bottom Navigation for Mobile Devices */}
      <MobileBottomNav
        cartItemCount={cartItemCount}
        onGoHome={() => {
          handleResetFilters();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoCategories={() => {
          const el = document.getElementById('categories-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenCustomOrder={() => setCustomOrderModalOpen(true)}
        ownerWhatsApp={settings.ownerWhatsApp}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        cart={cart}
        settings={settings}
        selectedArea={selectedArea}
        onClose={() => setCartDrawerOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setCartDrawerOpen(false);
          setCheckoutModalOpen(true);
        }}
        onSelectArea={handleSelectArea}
        onOpenCustomOrder={() => setCustomOrderModalOpen(true)}
      />

      {/* Checkout and WhatsApp Order Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        cart={cart}
        settings={settings}
        selectedArea={selectedArea}
        onClose={() => setCheckoutModalOpen(false)}
        onOrderSuccess={(orderNumber) => {
          clearCart();
          setCheckoutModalOpen(false);
          setLastPlacedOrder(orderNumber);
        }}
      />

      {/* Custom Grocery Order Modal */}
      <CustomOrderModal
        isOpen={customOrderModalOpen}
        settings={settings}
        selectedArea={selectedArea}
        onClose={() => setCustomOrderModalOpen(false)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        quantityInCart={selectedProductForModal ? cartQuantities[selectedProductForModal.id] || 0 : 0}
        relatedProducts={relatedProducts}
        ownerWhatsApp={settings.ownerWhatsApp}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onSelectRelated={(p) => setSelectedProductForModal(p)}
      />

      {/* Informational Modals (About, Contact, Terms) */}
      <InfoModals
        type={infoModalType}
        settings={settings}
        onClose={() => setInfoModalType(null)}
        onOpenWhatsApp={() => {
          window.open(
            `https://wa.me/${settings.ownerWhatsApp}?text=${encodeURIComponent('Hello Smart Grocery!')}`,
            '_blank',
            'noopener,noreferrer'
          );
        }}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => {
          setAdminLoginModalOpen(false);
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Order Success Confirmation Banner Modal */}
      {lastPlacedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#15803D] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-gray-900">Order Placed Successfully!</h3>
              <p className="text-sm font-mono font-bold text-[#15803D] mt-1">
                Reference: {lastPlacedOrder}
              </p>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Your order is saved in the store system and WhatsApp was opened with your order details.
                If WhatsApp didn't open automatically, you can tap below to message the store manager directly.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  window.open(
                    `https://wa.me/${settings.ownerWhatsApp}?text=${encodeURIComponent(
                      `Hello Smart Grocery! Checking status of my order ${lastPlacedOrder}.`
                    )}`,
                    '_blank',
                    'noopener,noreferrer'
                  );
                }}
                className="w-full py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp Chat</span>
              </button>

              <button
                onClick={() => setLastPlacedOrder(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
