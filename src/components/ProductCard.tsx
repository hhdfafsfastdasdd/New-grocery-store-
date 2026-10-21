import React from 'react';
import { Plus, Minus, Check, Eye } from 'lucide-react';
import { Product } from '../types';
import { GroceryImage } from './common/GroceryImage';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onQuickView,
}) => {
  const isOutOfStock = !product.inStock || product.stock <= 0;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-200/80 hover:border-emerald-300 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden relative">
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {product.discountPercent > 0 && (
          <span className="bg-amber-500 text-gray-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
            {product.discountPercent}% OFF
          </span>
        )}
        {product.featured && (
          <span className="bg-[#15803D] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
            Featured
          </span>
        )}
      </div>

      {/* Quick View Button on Hover */}
      <button
        onClick={() => onQuickView(product)}
        className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        title="Quick View Details"
        aria-label="Quick View"
      >
        <Eye className="w-4 h-4 text-gray-600 hover:text-[#15803D]" />
      </button>

      {/* Product Image Area */}
      <div
        onClick={() => onQuickView(product)}
        className="relative w-full aspect-4/3 bg-gray-50 overflow-hidden cursor-pointer"
      >
        <GroceryImage
          src={product.imageUrl}
          alt={product.name}
          category={product.category}
          className="w-full h-full object-cover"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-100 text-red-700 font-bold text-xs px-2.5 py-1 rounded-full border border-red-200">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Weight row */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-gray-500 font-medium mb-1">
            <span className="truncate max-w-[120px] font-semibold text-gray-600">{product.brand}</span>
            <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
              {product.weight}
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#15803D] transition-colors line-clamp-2 leading-snug cursor-pointer min-h-[2.5rem]"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Category Tag */}
          <p className="text-[11px] text-gray-400 truncate mt-0.5">{product.category}</p>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-3 pt-2.5 border-t border-gray-100">
          <div className="flex items-baseline gap-1.5 mb-2.5">
            <span className="text-base sm:text-lg font-black text-gray-900 font-mono">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through font-mono">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Action Button: Add to Cart or Stepper */}
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-2 rounded-xl bg-gray-100 text-gray-400 text-xs font-semibold cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : quantityInCart > 0 ? (
            <div className="flex items-center justify-between bg-[#F0FDF4] border border-[#15803D] rounded-xl p-1 text-[#15803D]">
              <button
                onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center hover:bg-emerald-100 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 text-[#15803D]" />
              </button>
              <span className="text-xs font-black font-mono px-2">{quantityInCart}</span>
              <button
                onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                disabled={quantityInCart >= product.stock}
                className={`w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center transition-colors cursor-pointer ${
                  quantityInCart >= product.stock ? 'opacity-40 cursor-not-allowed' : 'hover:bg-emerald-100'
                }`}
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 text-[#15803D]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-[#15803D] text-[#15803D] hover:text-white border border-emerald-200 hover:border-[#15803D] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
