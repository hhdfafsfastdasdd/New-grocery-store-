import React from 'react';
import { ShoppingBag, Phone, MapPin, MessageCircle, Shield, Clock, Heart } from 'lucide-react';
import { AreaName, StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onOpenAdmin: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenTerms: () => void;
  onOpenCustomOrder: () => void;
  onSelectCategory: (name: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onOpenAbout,
  onOpenContact,
  onOpenTerms,
  onOpenCustomOrder,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-14 pb-8 border-t border-gray-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-gray-800/80">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#15803D] text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Smart<span className="text-emerald-400">Grocery</span>
              </span>
            </div>

            <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
              {settings.tagline}. Delivering farm-fresh vegetables, whole grains, dairy, cooking oils,
              and daily household essentials to your doorstep across Khordha and Jatani.
            </p>

            <div className="space-y-1.5 pt-2 text-gray-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Khordha & Jatani, Odisha 752050, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Operating Daily: {settings.openingHours}</span>
              </p>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Top Categories</h4>
            <ul className="space-y-1.5 text-gray-400 font-medium">
              {['Fresh Vegetables', 'Fresh Fruits', 'Rice & Grains', 'Dal & Pulses', 'Cooking Oil & Ghee', 'Dairy & Bakery'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      const el = document.getElementById('catalog-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Services */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Customer Care</h4>
            <ul className="space-y-1.5 text-gray-400 font-medium">
              <li>
                <button onClick={onOpenAbout} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  About Smart Grocery
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Contact & Store Address
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Delivery Zones & Fees
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Returns & Replacements
                </button>
              </li>
              <li>
                <button onClick={onOpenCustomOrder} className="hover:text-emerald-400 text-emerald-400 font-bold transition-colors cursor-pointer">
                  Request Custom Grocery Order
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Order Help */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Direct WhatsApp Help</h4>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Need assistance with an ongoing order or have special requirements? Chat directly with our store owner.
            </p>

            <a
              href={`https://wa.me/${settings.ownerWhatsApp}?text=${encodeURIComponent('Hello Smart Grocery! I need help with an order.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Store</span>
            </a>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 text-gray-500 hover:text-emerald-400 transition-colors text-[11px] font-semibold cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Store Owner Admin Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-[11px] gap-3">
          <p>© {new Date().getFullYear()} Smart Grocery. All rights reserved. Servicing Khordha & Jatani, Odisha.</p>
          <p className="flex items-center gap-1">
            <span>Fresh Quality Grocery Guaranteed</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
