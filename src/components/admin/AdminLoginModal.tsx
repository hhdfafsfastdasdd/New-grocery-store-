import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Mail, KeyRound, AlertCircle, Info } from 'lucide-react';
import { loginAdmin } from '../../services/auth';
import { showToast } from '../common/Toast';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('bgmia3412@gmail.com');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = loginAdmin(email, passcode, true);
    setLoading(false);

    if (res.success) {
      showToast('Welcome, Store Owner! Admin panel unlocked.', 'success');
      onLoginSuccess();
    } else {
      setError(res.error || 'Authentication failed. Please verify owner credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-gray-900 to-[#166534] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Lock className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Store Owner Portal</h2>
              <p className="text-[11px] text-emerald-200">Authorized Access Only</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Authorized Owner Sign-In</p>
              <p className="text-gray-600">
                Pre-configured for owner account <span className="font-mono font-bold text-gray-900">bgmia3412@gmail.com</span>.
                Default passcode is <span className="font-mono font-bold text-gray-900">smart@2026</span>.
              </p>
            </div>
          </div>

          {/* Email input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Owner Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bgmia3412@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
              />
            </div>
          </div>

          {/* Passcode input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Master Security Passcode</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter owner passcode"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Unlock Admin Dashboard</span>
          </button>

          <p className="text-[11px] text-gray-400 text-center font-medium">
            Strictly owner access. Public user registration is disabled for store security.
          </p>
        </form>
      </div>
    </div>
  );
};
