import React, { useState } from 'react';
import { X, MessageCircle, AlertCircle, Sparkles, Send } from 'lucide-react';
import { AreaName, StoreSettings } from '../types';
import { openCustomOrderWhatsApp } from '../services/whatsapp';
import { saveCustomOrder } from '../services/storage';
import { showToast } from './common/Toast';

interface CustomOrderModalProps {
  isOpen: boolean;
  settings: StoreSettings;
  selectedArea: AreaName;
  onClose: () => void;
}

export const CustomOrderModal: React.FC<CustomOrderModalProps> = ({
  isOpen,
  settings,
  selectedArea,
  onClose,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState<AreaName>(selectedArea);
  const [requestedItems, setRequestedItems] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (phone.replace(/[^0-9]/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!address.trim() || address.length < 8) {
      setError('Please enter your delivery address in Khordha/Jatani.');
      return;
    }
    if (!requestedItems.trim() || requestedItems.length < 5) {
      setError('Please list the items and quantities you want to order.');
      return;
    }

    // Persist to store database
    saveCustomOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      whatsapp: phone.trim(),
      address: address.trim(),
      area,
      requestedItems: requestedItems.trim(),
      additionalRequirements: additionalRequirements.trim() || undefined,
    });

    // Open WhatsApp
    openCustomOrderWhatsApp(settings.ownerWhatsApp, {
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      area,
      requestedItems: requestedItems.trim(),
      additionalRequirements: additionalRequirements.trim() || undefined,
    });

    showToast('Custom order opened in WhatsApp and saved to store!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#F8FAF8] border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight">Request Custom Grocery Order</h2>
              <p className="text-xs text-gray-500 font-medium">Order items not listed on the website</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-200/60 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900 leading-relaxed">
            🌿 Looking for a specific local brand, special fresh cutting, village dairy, or unlisted items?
            List them below and we'll check stock and confirm price on WhatsApp!
          </div>

          {/* Requested Items */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              List Items & Quantities *
            </label>
            <textarea
              rows={4}
              placeholder={`e.g.:
- 2 kg Local Country Desi Eggs
- 500g Fresh Chenna / Paneer from local diary
- 1 packet Everest Sambhar Masala
- 2 bunches Fresh Mint / Pudina`}
              value={requestedItems}
              onChange={(e) => setRequestedItems(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
            <input
              type="text"
              placeholder="e.g. Subrat Jena"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile / WhatsApp Number *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">+91</span>
              <input
                type="tel"
                placeholder="9861012345"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full pl-11 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
              />
            </div>
          </div>

          {/* Delivery Town */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Area *</label>
            <div className="grid grid-cols-2 gap-3">
              {settings.serviceAreas.map((a) => (
                <button
                  key={a.name}
                  type="button"
                  onClick={() => setArea(a.name)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                    area === a.name
                      ? 'bg-[#15803D] text-white border-[#15803D]'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {a.name} ({a.displayName})
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Address *</label>
            <textarea
              rows={2}
              placeholder="Full street address in Khordha or Jatani..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
            />
          </div>

          {/* Additional Requirements */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Any Special Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Need morning delivery before 10 AM / Call before coming"
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Send Custom Request on WhatsApp</span>
          </button>
        </form>
      </div>
    </div>
  );
};
