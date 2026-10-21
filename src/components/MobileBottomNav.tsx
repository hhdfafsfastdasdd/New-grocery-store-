import React from 'react';
import { Home, Layers, ShoppingBag, MessageCircle, Phone } from 'lucide-react';

interface MobileBottomNavProps {
  cartItemCount: number;
  onGoHome: () => void;
  onGoCategories: () => void;
  onOpenCart: () => void;
  onOpenCustomOrder: () => void;
  ownerWhatsApp: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartItemCount,
  onGoHome,
  onGoCategories,
  onOpenCart,
  onOpenCustomOrder,
  ownerWhatsApp,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 shadow-lg flex items-center justify-around">
      <button
        onClick={onGoHome}
        className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-[#15803D] transition-colors"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">Home</span>
      </button>

      <button
        onClick={onGoCategories}
        className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-[#15803D] transition-colors"
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">Categories</span>
      </button>

      {/* Floating Center Cart button */}
      <button
        onClick={onOpenCart}
        className="flex flex-col items-center justify-center -mt-5"
      >
        <div className="w-12 h-12 rounded-full bg-[#15803D] text-white flex items-center justify-center shadow-md relative ring-4 ring-white">
          <ShoppingBag className="w-5 h-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-400 text-gray-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold text-gray-800 mt-0.5">Cart</span>
      </button>

      <button
        onClick={onOpenCustomOrder}
        className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-[#15803D] transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">Custom</span>
      </button>

      <a
        href={`https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent('Hello Smart Grocery!')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-emerald-600 transition-colors"
      >
        <Phone className="w-5 h-5 text-emerald-600" />
        <span className="text-[10px] font-semibold mt-0.5">WhatsApp</span>
      </a>
    </div>
  );
};
