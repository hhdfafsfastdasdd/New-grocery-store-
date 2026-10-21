import React from 'react';
import { X, Plus, Minus, ShoppingBag, ShieldCheck, Truck, MessageCircle, Check } from 'lucide-react';
import { Product } from '../types';
import { GroceryImage } from './common/GroceryImage';

interface ProductDetailModalProps {
  product: Product | null;
  quantityInCart: number;
  relatedProducts: Product[];
  ownerWhatsApp: string;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onSelectRelated: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  quantityInCart,
  relatedProducts,
  ownerWhatsApp,
  onClose,
  onAddToCart,
  onUpdateQuantity,
  onSelectRelated,
}) => {
  if (!product) return null;

  const isOutOfStock = !product.inStock || product.stock <= 0;

  const handleInquireWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Smart Grocery! I have a question about "${product.name}" (${product.weight}, ₹${product.price}). Is this currently available for delivery in Khordha/Jatani?`
    );
    window.open(`https://wa.me/${ownerWhatsApp}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-gray-900 shadow-md flex items-center justify-center transition-all cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image Showcase */}
          <div className="relative bg-[#F8FAF8] p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
            <div className="w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden shadow-xs bg-white">
              <GroceryImage
                src={product.imageUrl}
                alt={product.name}
                category={product.category}
                className="w-full h-full object-cover"
              />
            </div>
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-amber-500 text-gray-950 text-xs font-black px-2.5 py-1 rounded-lg shadow-xs">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Product Details & Actions */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Brand */}
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <span>{product.brand}</span>
                <span>·</span>
                <span className="text-[#15803D]">{product.category}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 leading-snug">
                {product.name}
              </h2>

              {/* Weight / Size Pill */}
              <div className="inline-block bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-lg mt-2">
                Pack Size: {product.weight}
              </div>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-2.5 mt-3">
                <span className="text-2xl sm:text-3xl font-black text-gray-900 font-mono">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through font-mono">
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 mt-2">
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    Currently Out of Stock
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    In Stock ({product.stock} units available)
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              {isOutOfStock ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed"
                >
                  Unavailable
                </button>
              ) : quantityInCart > 0 ? (
                <div className="flex items-center justify-between bg-[#F0FDF4] border border-[#15803D] rounded-xl p-2 text-[#15803D]">
                  <span className="text-xs font-bold px-2">In Your Cart:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                      className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center hover:bg-emerald-100 cursor-pointer"
                    >
                      <Minus className="w-4 h-4 text-[#15803D]" />
                    </button>
                    <span className="text-sm font-black font-mono">{quantityInCart}</span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                      disabled={quantityInCart >= product.stock}
                      className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center hover:bg-emerald-100 cursor-pointer disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4 text-[#15803D]" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onAddToCart(product, 1)}
                  className="w-full py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Cart</span>
                </button>
              )}

              {/* WhatsApp Quick Inquiry Button */}
              <button
                onClick={handleInquireWhatsApp}
                className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 text-[#15803D] text-xs font-semibold border border-emerald-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Ask Store on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Products from Category */}
        {relatedProducts.length > 0 && (
          <div className="p-4 sm:p-6 bg-[#F8FAF8] border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Similar items in {product.category}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {relatedProducts.slice(0, 4).map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="p-2 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-all text-left group cursor-pointer"
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-50 mb-1.5">
                    <GroceryImage
                      src={rel.imageUrl}
                      alt={rel.name}
                      category={rel.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-[11px] font-bold text-gray-800 line-clamp-1">{rel.name}</p>
                  <p className="text-[10px] font-bold text-[#15803D] font-mono mt-0.5">₹{rel.price}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
