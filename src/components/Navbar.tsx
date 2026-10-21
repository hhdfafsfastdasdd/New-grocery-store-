import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  MapPin,
  Lock,
  Menu,
  X,
  Phone,
  Sparkles,
  MessageCircle,
  HelpCircle,
  Percent,
} from 'lucide-react';
import { AreaName, StoreSettings } from '../types';

interface NavbarProps {
  settings: StoreSettings;
  cartItemCount: number;
  cartTotal: number;
  selectedArea: AreaName;
  onSelectArea: (area: AreaName) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenCustomOrder: () => void;
  onOpenContact: () => void;
  onOpenAbout: () => void;
  onSelectCategory: (categoryName: string) => void;
  onResetFilters: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cartItemCount,
  cartTotal,
  selectedArea,
  onSelectArea,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenAdmin,
  onOpenCustomOrder,
  onOpenContact,
  onOpenAbout,
  onSelectCategory,
  onResetFilters,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* 1. Top Announcement Bar */}
      {settings.announcementActive && settings.announcement && (
        <div className="bg-[#15803D] text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <span>{settings.announcement}</span>
          <span className="hidden sm:inline-block opacity-75">·</span>
          <span className="hidden sm:inline-block font-normal opacity-90">
            Open: {settings.openingHours}
          </span>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                onResetFilters();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#15803D] to-[#166534] text-white flex items-center justify-center shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#15803D]">
                  Smart<span className="text-gray-900">Grocery</span>
                </span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest -mt-1 hidden xs:block">
                  Khordha & Jatani
                </span>
              </div>
            </button>
          </div>

          {/* Area Selector */}
          <div className="relative hidden md:block shrink-0">
            <button
              onClick={() => setAreaDropdownOpen(!areaDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#15803D] bg-gray-50/70 text-xs font-semibold text-gray-700 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-gray-400 leading-none">Delivering To</p>
                <p className="text-gray-900 font-semibold">{selectedArea}, Odisha</p>
              </div>
              <span className="text-[10px] bg-[#F0FDF4] text-[#15803D] px-1.5 py-0.5 rounded font-bold">
                Change
              </span>
            </button>

            {areaDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50">
                <p className="text-[11px] font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">
                  Select Delivery Town
                </p>
                {settings.serviceAreas.map((area) => (
                  <button
                    key={area.name}
                    onClick={() => {
                      onSelectArea(area.name);
                      setAreaDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                      selectedArea === area.name
                        ? 'bg-[#F0FDF4] text-[#15803D] font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{area.name}</p>
                      <p className="text-[10px] text-gray-500">{area.displayName}</p>
                    </div>
                    <span className="text-[10px] text-gray-500">
                      ₹{area.deliveryCharge} delivery
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 100+ fresh vegetables, rice, dal, milk, oil, snacks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2 sm:py-2.5 rounded-full border border-gray-200 bg-gray-50/70 focus:bg-white text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Custom WhatsApp Order Button */}
            <button
              onClick={onOpenCustomOrder}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#15803D] bg-[#F0FDF4] hover:bg-emerald-100/80 rounded-lg transition-colors border border-emerald-200"
              title="Request grocery items not listed"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Custom Order</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all hover:shadow-md relative"
              aria-label={`View Cart, ${cartItemCount} items`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">My Cart</span>
              {cartTotal > 0 && (
                <span className="hidden md:inline font-mono font-bold text-xs bg-emerald-900/40 px-1.5 py-0.5 rounded">
                  ₹{cartTotal}
                </span>
              )}
            </button>

            {/* Admin Lock Button */}
            <button
              onClick={onOpenAdmin}
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-gray-600 hover:text-[#15803D] hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1.5"
              title="Owner Admin Dashboard"
            >
              <Lock className="w-4 h-4 text-gray-500" />
              <span className="hidden xl:inline">Admin</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 3. Secondary Nav Links Row (Desktop) */}
        <nav className="hidden lg:flex items-center justify-between py-2 border-t border-gray-100 text-xs font-medium text-gray-600">
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                onResetFilters();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#15803D] transition-colors font-semibold text-gray-900"
            >
              Home
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('categories-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#15803D] transition-colors"
            >
              All Categories
            </button>
            <button
              onClick={() => {
                onSelectCategory('Fresh Vegetables');
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#15803D] transition-colors"
            >
              Fresh Vegetables
            </button>
            <button
              onClick={() => {
                onSelectCategory('Dairy & Bakery');
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#15803D] transition-colors"
            >
              Dairy & Milk
            </button>
            <button
              onClick={() => {
                onSelectCategory('Rice & Grains');
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#15803D] transition-colors"
            >
              Rice & Staples
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
            >
              <Percent className="w-3.5 h-3.5" />
              Special Offers
            </button>
          </div>

          <div className="flex items-center gap-4 text-gray-500">
            <button onClick={onOpenAbout} className="hover:text-[#15803D] transition-colors">
              About Us
            </button>
            <span>·</span>
            <button onClick={onOpenContact} className="hover:text-[#15803D] transition-colors">
              Contact & Store Timings
            </button>
            <span>·</span>
            <a
              href={`tel:${settings.contactPhone}`}
              className="flex items-center gap-1 text-[#15803D] font-semibold hover:underline"
            >
              <Phone className="w-3 h-3" />
              <span>{settings.contactPhone}</span>
            </a>
          </div>
        </nav>
      </div>

      {/* 4. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3 shadow-xl">
          {/* Mobile Area Switcher */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
              Select Delivery Town:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {settings.serviceAreas.map((area) => (
                <button
                  key={area.name}
                  onClick={() => {
                    onSelectArea(area.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-lg text-xs font-semibold text-center transition-colors border ${
                    selectedArea === area.name
                      ? 'bg-[#15803D] text-white border-[#15803D]'
                      : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  {area.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            <button
              onClick={() => {
                onResetFilters();
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              Home
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById('categories-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              All Categories
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCustomOrder();
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 text-[#15803D] font-semibold flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Request Custom Order (WhatsApp)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              Contact Us & Store Timings
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAbout();
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              About Smart Grocery
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-900 font-semibold border-t border-gray-100 pt-3 mt-1"
            >
              <Lock className="w-4 h-4 text-[#15803D]" />
              Store Owner Admin Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
