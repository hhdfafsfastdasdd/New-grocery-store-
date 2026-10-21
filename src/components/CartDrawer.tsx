import React from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  Sparkles,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { AreaName, CartItem, StoreSettings } from '../types';
import { GroceryImage } from './common/GroceryImage';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  settings: StoreSettings;
  selectedArea: AreaName;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onSelectArea: (area: AreaName) => void;
  onOpenCustomOrder: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  settings,
  selectedArea,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onSelectArea,
  onOpenCustomOrder,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const areaConfig = settings.serviceAreas.find((a) => a.name === selectedArea) || settings.serviceAreas[0];
  const isFreeDelivery = subtotal >= areaConfig.freeDeliveryAbove;
  const deliveryCharge = isFreeDelivery ? 0 : areaConfig.deliveryCharge;
  const finalTotal = subtotal + deliveryCharge;
  const amountNeededForFree = Math.max(0, areaConfig.freeDeliveryAbove - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / areaConfig.freeDeliveryAbove) * 100));

  const isMinOrderMet = subtotal >= settings.minimumOrderAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#F8FAF8]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#15803D] text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-gray-900 leading-tight">My Shopping Cart</h2>
                <p className="text-xs text-gray-500 font-medium">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} in basket
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-200/60 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Area Selector Bar */}
          <div className="bg-[#F0FDF4] px-4 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-700">
              <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
              <span className="font-semibold">Delivery To:</span>
            </div>
            <div className="flex items-center gap-1">
              {settings.serviceAreas.map((a) => (
                <button
                  key={a.name}
                  onClick={() => onSelectArea(a.name)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    selectedArea === a.name
                      ? 'bg-[#15803D] text-white'
                      : 'bg-white text-gray-700 border border-emerald-200 hover:bg-gray-50'
                  }`}
                >
                  {a.name} (₹{a.deliveryCharge})
                </button>
              ))}
            </div>
          </div>

          {/* Free Delivery Meter */}
          {cart.length > 0 && (
            <div className="bg-amber-50/70 border-b border-amber-100 p-3 text-xs">
              <div className="flex items-center justify-between font-semibold text-gray-800 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  {isFreeDelivery ? (
                    <span className="text-emerald-700 font-bold">You unlocked FREE Local Delivery!</span>
                  ) : (
                    <span>Add ₹{amountNeededForFree} more for FREE Delivery</span>
                  )}
                </span>
                <span className="font-mono text-[11px] text-gray-500">{freeDeliveryPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#15803D] transition-all duration-300"
                  style={{ width: `${freeDeliveryPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#15803D] flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Your basket is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mt-1">
                  Add fresh vegetables, fruits, rice, spices, and daily essentials from our catalog.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-5 py-2.5 bg-[#15803D] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#166534] transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-2xs transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                    <GroceryImage
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      category={item.product.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {item.product.weight} · ₹{item.product.price} each
                    </p>
                    <p className="text-xs font-black text-gray-900 font-mono mt-0.5">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>

                  {/* Stepper */}
                  <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-200/80">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-700 hover:text-[#15803D] cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-bold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-6 h-6 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-700 hover:text-[#15803D] cursor-pointer disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#F8FAF8] border-t border-gray-200/80 space-y-3">
              {/* Cost Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-mono font-bold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery ({selectedArea})</span>
                  <span className="font-mono font-bold">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-700">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-extrabold text-gray-900">
                  <span>Total Amount</span>
                  <span className="font-mono text-base text-[#15803D]">₹{finalTotal}</span>
                </div>
              </div>

              {/* Minimum order check alert */}
              {!isMinOrderMet && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium text-center">
                  Minimum order value is ₹{settings.minimumOrderAmount}. Add ₹{settings.minimumOrderAmount - subtotal} more to checkout.
                </div>
              )}

              {/* Action buttons */}
              <button
                onClick={onProceedToCheckout}
                disabled={!isMinOrderMet}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  isMinOrderMet
                    ? 'bg-[#15803D] hover:bg-[#166534] hover:shadow-lg cursor-pointer'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <span>Proceed to Order (WhatsApp & Delivery)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenCustomOrder();
                  }}
                  className="text-[#15803D] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MessageCircle className="w-3 h-3" />
                  Request unlisted items
                </button>

                <button
                  onClick={onClearCart}
                  className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  Clear basket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
