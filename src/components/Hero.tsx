import React from 'react';
import {
  ShoppingBag,
  Clock,
  ShieldCheck,
  Truck,
  MessageCircle,
  ArrowRight,
  Leaf,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { AreaName } from '../types';

interface HeroProps {
  selectedArea: AreaName;
  onShopNow: () => void;
  onExploreCategories: () => void;
  onOpenCustomOrder: () => void;
  onSelectArea: (area: AreaName) => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedArea,
  onShopNow,
  onExploreCategories,
  onOpenCustomOrder,
  onSelectArea,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F0FDF4] via-[#F8FAF8] to-white border-b border-gray-100">
      {/* Background organic blur accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline and Call-to-actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Location & Freshness Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-emerald-200 shadow-xs text-xs font-semibold text-[#15803D]">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Delivering Fresh in Khordha & Jatani, Odisha</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.12]">
              Fresh Groceries <br className="hidden sm:inline" />
              <span className="text-[#15803D]">Delivered to Your Door</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Shop fresh vegetables, fruits, rice, groceries, dairy products, snacks and daily essentials.
              Sourced fresh daily and delivered straight to your home in Khordha and Jatani.
            </p>

            {/* Quick Delivery Town Switcher */}
            <div className="inline-flex items-center gap-3 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-xs text-xs">
              <span className="text-gray-500 font-medium pl-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
                Your Town:
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onSelectArea('Khordha')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    selectedArea === 'Khordha'
                      ? 'bg-[#15803D] text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Khordha
                </button>
                <button
                  onClick={() => onSelectArea('Jatani')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    selectedArea === 'Jatani'
                      ? 'bg-[#15803D] text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Jatani
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={onShopNow}
                className="px-6 py-3.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreCategories}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm border border-gray-300 shadow-xs transition-colors cursor-pointer"
              >
                Explore Categories
              </button>

              <button
                onClick={onOpenCustomOrder}
                className="px-5 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 text-[#15803D] font-bold text-sm border border-emerald-200 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#15803D]" />
                <span>Custom Order</span>
              </button>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200/80 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#15803D] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-tight">45-60 Mins</p>
                  <p className="text-[11px] text-gray-500">Fast Local Delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#15803D] flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-tight">100% Fresh</p>
                  <p className="text-[11px] text-gray-500">Handpicked Quality</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#15803D] flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-tight">Free Delivery</p>
                  <p className="text-[11px] text-gray-500">On Orders &gt; ₹499</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#15803D] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-tight">WhatsApp Orders</p>
                  <p className="text-[11px] text-gray-500">Direct Chat Checkout</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <div className="aspect-4/3 w-full overflow-hidden bg-emerald-950/5 relative">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                    alt="Fresh vegetables, fruits, and groceries"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

                  {/* Floating Daily Deal Pill */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black text-gray-900">Today's Morning Harvest</span>
                  </div>

                  {/* Bottom overlay text */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                      Smart Grocery Local Hub
                    </p>
                    <p className="text-base font-bold">Direct from Farmers & Certified Wholesale Brands</p>
                    <p className="text-xs text-gray-200 mt-0.5">Khordha & Jatani, Odisha</p>
                  </div>
                </div>

                {/* Sub-strip with 3 mini highlights */}
                <div className="p-4 grid grid-cols-3 gap-2 bg-[#F8FAF8] border-t border-gray-100 text-center">
                  <div className="p-2 bg-white rounded-xl border border-gray-200/70">
                    <p className="text-[10px] text-gray-500 font-semibold">Min Order</p>
                    <p className="text-sm font-black text-[#15803D]">₹150</p>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-gray-200/70">
                    <p className="text-[10px] text-gray-500 font-semibold">Delivery Fee</p>
                    <p className="text-sm font-black text-gray-900">From ₹30</p>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-gray-200/70">
                    <p className="text-[10px] text-gray-500 font-semibold">Catalog</p>
                    <p className="text-sm font-black text-gray-900">100+ Items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
