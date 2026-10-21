import React from 'react';
import { X, MapPin, Phone, Clock, Mail, ShieldCheck, HeartHandshake, Truck, MessageCircle } from 'lucide-react';
import { StoreSettings } from '../types';

interface InfoModalProps {
  type: 'about' | 'contact' | 'terms' | null;
  settings: StoreSettings;
  onClose: () => void;
  onOpenWhatsApp: () => void;
}

export const InfoModals: React.FC<InfoModalProps> = ({
  type,
  settings,
  onClose,
  onOpenWhatsApp,
}) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-gray-100 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#F8FAF8] border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-900 leading-tight">
            {type === 'about' && 'About Smart Grocery'}
            {type === 'contact' && 'Contact Us & Store Timings'}
            {type === 'terms' && 'Terms, Delivery & Return Policy'}
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-200/60 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-gray-600 leading-relaxed">
          {/* ABOUT US CONTENT */}
          {type === 'about' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-emerald-100 text-emerald-900 space-y-2">
                <p className="font-bold text-sm text-[#15803D]">
                  Smart Grocery — Your Daily Needs, Delivered Fresh
                </p>
                <p className="text-xs text-emerald-800">
                  Proudly serving homes, families, and businesses across Khordha and Jatani, Odisha.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Our Mission</h3>
                <p>
                  At Smart Grocery, we believe accessing farm-fresh vegetables, clean staples, pure dairy,
                  and authentic packaged groceries shouldn't involve traveling to crowded mandis or waiting days
                  for big corporate deliveries. We bring modern grocery ordering together with friendly local
                  WhatsApp service so you receive your daily kitchen needs in under 60-90 minutes.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80">
                  <HeartHandshake className="w-5 h-5 text-[#15803D] mb-1.5" />
                  <p className="font-bold text-gray-900 text-xs">Direct Farmer Harvest</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Vegetables procured daily at dawn from local Odisha growers.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80">
                  <Truck className="w-5 h-5 text-[#15803D] mb-1.5" />
                  <p className="font-bold text-gray-900 text-xs">Khordha & Jatani Hubs</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Dedicated fulfillment for prompt doorstep delivery.</p>
                </div>
              </div>
            </div>
          )}

          {/* CONTACT US CONTENT */}
          {type === 'contact' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200/80">
                  <MapPin className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">Store Address</p>
                    <p className="text-gray-600 mt-0.5">{settings.storeAddress}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Delivery Areas: Khordha & Jatani, Odisha, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200/80">
                  <Clock className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">Operating Hours</p>
                    <p className="text-gray-600 mt-0.5">{settings.openingHours}</p>
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">Morning harvest dispatches start at 7:30 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200/80">
                  <Phone className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">Direct Customer Helpline</p>
                    <a href={`tel:${settings.contactPhone}`} className="text-[#15803D] font-bold hover:underline">
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200/80">
                  <Mail className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">Email Address</p>
                    <p className="text-gray-600">{settings.email}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenWhatsApp}
                className="w-full py-3 rounded-xl bg-[#15803D] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-[#166534] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Store Manager on WhatsApp</span>
              </button>
            </div>
          )}

          {/* TERMS & CONDITIONS CONTENT */}
          {type === 'terms' && (
            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">1. Delivery Zones & Timelines</h3>
                <p className="mt-0.5 text-xs text-gray-600">
                  Smart Grocery currently provides direct doorstep delivery exclusively within defined boundaries of
                  Khordha Town and Jatani Town, Odisha. Orders are dispatched during operating hours (7 AM - 9:30 PM).
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-sm">2. Delivery Charges</h3>
                <p className="mt-0.5 text-xs text-gray-600">
                  Khordha: ₹30 flat fee. Jatani: ₹35 flat fee. Orders exceeding ₹499 qualify for automatic FREE delivery.
                  Minimum checkout order value is ₹150.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-sm">3. Quality Inspection & Replacements</h3>
                <p className="mt-0.5 text-xs text-gray-600">
                  Customers are encouraged to inspect fresh produce (vegetables, fruits, and dairy) upon delivery.
                  If any item is damaged or substandard, inform the delivery agent or WhatsApp support immediately for an instant refund or free replacement.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-sm">4. WhatsApp Click-to-Chat Notice</h3>
                <p className="mt-0.5 text-xs text-gray-600">
                  Submitting an order opens a pre-composed message in WhatsApp. The customer presses Send to finalize confirmation with the store.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
