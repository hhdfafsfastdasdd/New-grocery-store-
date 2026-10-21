import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Utensils } from 'lucide-react';

interface GroceryImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: string;
}

export const GroceryImage: React.FC<GroceryImageProps> = ({ src, alt, className = '', category }) => {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Fallback palette based on category
  const getCategoryTheme = (cat?: string) => {
    if (!cat) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' };
    const lower = cat.toLowerCase();
    if (lower.includes('vegetable')) return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
    if (lower.includes('fruit')) return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    if (lower.includes('dairy') || lower.includes('milk')) return { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' };
    if (lower.includes('spice') || lower.includes('oil')) return { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' };
    if (lower.includes('rice') || lower.includes('dal') || lower.includes('atta')) return { bg: 'bg-stone-50', text: 'text-stone-800', border: 'border-stone-200' };
    if (lower.includes('snack') || lower.includes('tea') || lower.includes('drink')) return { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' };
    return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
  };

  const theme = getCategoryTheme(category);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-3 text-center transition-all ${theme.bg} ${theme.border} ${className}`}
        aria-label={alt}
      >
        <div className={`w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center mb-1.5 ${theme.text}`}>
          <ShoppingBag className="w-5 h-5" />
        </div>
        <span className={`text-[11px] font-semibold tracking-tight line-clamp-1 ${theme.text}`}>
          {alt || 'Smart Grocery'}
        </span>
        <span className="text-[10px] text-gray-500 font-medium">Fresh Stock</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gray-50 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <Utensils className="w-5 h-5 text-gray-300" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
