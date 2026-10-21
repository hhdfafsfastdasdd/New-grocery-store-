import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  MapPin,
  Phone,
  User,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Clock,
} from 'lucide-react';
import { AreaName, CartItem, CustomerDetails, StoreSettings } from '../types';
import { createValidatedOrder } from '../services/storage';
import { openWhatsAppOrder } from '../services/whatsapp';
import { showToast } from './common/Toast';

interface CheckoutModalProps {
  isOpen: boolean;
  cart: CartItem[];
  settings: StoreSettings;
  selectedArea: AreaName;
  onClose: () => void;
  onOrderSuccess: (orderNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cart,
  settings,
  selectedArea,
  onClose,
  onOrderSuccess,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [address, setAddress] = useState('');
  const [area, setArea] = useState<AreaName>(selectedArea);
  const [landmark, setLandmark] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Live trusted price calculation
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const areaConfig = settings.serviceAreas.find((a) => a.name === area) || settings.serviceAreas[0];
  const isFreeDelivery = subtotal >= areaConfig.freeDeliveryAbove;
  const deliveryCharge = isFreeDelivery ? 0 : areaConfig.deliveryCharge;
  const finalTotal = subtotal + deliveryCharge;

  const handlePhoneChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(clean);
    if (sameAsPhone) {
      setWhatsapp(clean);
    }
  };

  const handleSubmit = (source: 'whatsapp' | 'web') => {
    setErrorMessage('');

    // Validations
    if (!name.trim()) {
      setErrorMessage('Please enter your full customer name.');
      return;
    }

    if (phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    const effectiveWhatsApp = sameAsPhone ? phone : whatsapp;
    if (effectiveWhatsApp.length < 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    if (!address.trim() || address.length < 10) {
      setErrorMessage('Please provide a complete street and house delivery address.');
      return;
    }

    setIsSubmitting(true);

    const customer: CustomerDetails = {
      name: name.trim(),
      phone: phone.trim(),
      whatsapp: effectiveWhatsApp.trim(),
      address: address.trim(),
      area,
      landmark: landmark.trim() || undefined,
      instructions: instructions.trim() || undefined,
    };

    const cartPayload = cart.map((i) => ({
      productId: i.product.id,
      quantity: i.quantity,
    }));

    // Recalculate & validate against store database
    const result = createValidatedOrder(customer, cartPayload, source, instructions);

    if (!result.success || !result.order) {
      setIsSubmitting(false);
      setErrorMessage(result.error || 'Failed to submit order. Please check item stock.');
      return;
    }

    const order = result.order;

    // Launch WhatsApp directly with formatted message
    try {
      openWhatsAppOrder(settings.ownerWhatsApp, {
        customerName: customer.name,
        phone: customer.phone,
        address: customer.address,
        area: customer.area,
        landmark: customer.landmark,
        instructions: customer.instructions,
        items: order.items,
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        finalTotal: order.finalTotal,
        orderNumber: order.orderNumber,
      });
    } catch (e) {
      console.warn('Popup blocked, order is saved in store database:', e);
    }

    showToast(`Order ${order.orderNumber} placed successfully!`, 'success');
    setIsSubmitting(false);
    onOrderSuccess(order.orderNumber);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-gray-100 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#F8FAF8] border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15803D] text-white flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight">Delivery & Order Details</h2>
              <p className="text-xs text-gray-500 font-medium">Direct order to Smart Grocery via WhatsApp</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-200/60 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Order Summary Strip */}
          <div className="bg-[#F0FDF4] p-3.5 rounded-2xl border border-emerald-100 text-xs space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>Selected Products ({cart.length} types)</span>
              <span className="font-mono font-bold text-gray-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge ({area})</span>
              <span className="font-mono font-bold">
                {deliveryCharge === 0 ? <span className="text-emerald-700">FREE</span> : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-gray-900 pt-1 border-t border-emerald-200">
              <span>Final Total to Pay</span>
              <span className="text-[#15803D] font-mono text-base">₹{finalTotal}</span>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Customer Information</h3>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Ramesh Chandra Das"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
                />
              </div>
            </div>

            {/* Mobile & WhatsApp Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Calling Number *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">+91</span>
                  <input
                    type="tel"
                    placeholder="9861012345"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full pl-11 pr-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">WhatsApp Number *</label>
                  <label className="flex items-center gap-1 text-[11px] text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsPhone}
                      onChange={(e) => {
                        setSameAsPhone(e.target.checked);
                        if (e.target.checked) setWhatsapp(phone);
                      }}
                      className="accent-[#15803D]"
                    />
                    <span>Same as call</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">+91</span>
                  <input
                    type="tel"
                    placeholder="9861012345"
                    maxLength={10}
                    disabled={sameAsPhone}
                    value={sameAsPhone ? phone : whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    className={`w-full pl-11 pr-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D] ${
                      sameAsPhone ? 'bg-gray-50 opacity-80' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Area Choice */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Area / Town *</label>
              <div className="grid grid-cols-2 gap-3">
                {settings.serviceAreas.map((a) => (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => setArea(a.name)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      area === a.name
                        ? 'border-[#15803D] bg-[#F0FDF4] text-[#15803D] ring-2 ring-[#15803D]/20'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span>{a.name}</span>
                      <span className="text-[11px] font-mono">
                        {subtotal >= a.freeDeliveryAbove ? 'FREE' : `₹${a.deliveryCharge}`}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{a.displayName}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Full Street Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Delivery Address *</label>
              <textarea
                rows={2}
                placeholder="House / Flat No., Colony or Lane, Street Name, Near Landmark..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
              />
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Landmark (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Near Jagannath Temple / Near Railway Station / Opp. SBI"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Special Delivery Instructions (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Please ring bell twice / Leave at security / Call on arrival"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#F8FAF8] border-t border-gray-100 space-y-2">
          {/* WhatsApp Direct Order Button */}
          <button
            onClick={() => handleSubmit('whatsapp')}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Place Order on WhatsApp (₹{finalTotal})</span>
          </button>

          <p className="text-[11px] text-gray-500 text-center font-normal">
            WhatsApp click-to-chat opens your prepared order directly with store owner.
            You simply press <span className="font-semibold text-gray-800">Send</span> in WhatsApp!
          </p>
        </div>
      </div>
    </div>
  );
};
