import React, { useState } from 'react';
import { Shield, Phone, Lock, User, X, Code2 } from 'lucide-react';
import { signInWithOTP, verifyOTP } from '../lib/supabase';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
  const [authForm, setAuthForm] = useState({
    phone: '',
    otp: '',
    error: '',
    isLoading: false,
    otpSent: false
  });

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthForm(prev => ({ ...prev, isLoading: true, error: '' }));

    const result = await signInWithOTP(authForm.phone);

    if (result.success) {
      setAuthForm(prev => ({
        ...prev,
        isLoading: false,
        otpSent: true
      }));
      setAuthStep('otp');
    } else {
      setAuthForm(prev => ({
        ...prev,
        error: 'This phone number is not authorized for admin access.',
        isLoading: false
      }));
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthForm(prev => ({ ...prev, isLoading: true, error: '' }));

    const result = await verifyOTP(authForm.phone, authForm.otp);

    if (result.success) {
      localStorage.setItem('devcode_auth', 'authenticated');
      onLoginSuccess();
    } else {
      setAuthForm(prev => ({
        ...prev,
        error: 'Invalid OTP. Please check and try again.',
        isLoading: false
      }));
    }
  };

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-20 left-4 w-20 h-20 bg-white/5 rounded-full blur-xl sm:w-32 sm:h-32 sm:left-10"></div>
        <div className="floating-element absolute top-40 right-4 w-32 h-32 bg-gray-500/10 rounded-full blur-xl sm:w-48 sm:h-48 sm:right-20" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass rounded-2xl shadow-2xl border border-gray-600 slide-in">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-black border border-gray-600 p-2 rounded-lg">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Admin Login</h2>
            </div>
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 touch-manipulation"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {authStep === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="p-4 sm:p-6">
              <div className="mb-6">
                <p className="text-gray-300 text-sm mb-6 text-center">
                  Enter your registered phone number to receive OTP
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={authForm.phone}
                      onChange={(e) => setAuthForm(prev => ({ ...prev, phone: e.target.value, error: '' }))}
                      className="w-full pl-10 pr-4 py-4 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 text-base"
                      placeholder="Enter phone number"
                      required
                      disabled={authForm.isLoading}
                    />
                  </div>
                </div>

                {authForm.error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                    <p className="text-red-200 text-sm flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {authForm.error}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={authForm.isLoading}
                className="w-full bg-black border border-gray-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 touch-manipulation"
              >
                {authForm.isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5" />
                    Send OTP
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="p-4 sm:p-6">
              <div className="mb-6">
                <p className="text-gray-300 text-sm mb-6 text-center">
                  Enter the 6-digit OTP sent to {authForm.phone}
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">OTP Code</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={authForm.otp}
                      onChange={(e) => setAuthForm(prev => ({ ...prev, otp: e.target.value, error: '' }))}
                      className="w-full pl-10 pr-4 py-4 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest text-white placeholder-gray-400"
                      placeholder="000000"
                      maxLength={6}
                      required
                      disabled={authForm.isLoading}
                    />
                  </div>
                </div>

                {authForm.error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                    <p className="text-red-200 text-sm flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {authForm.error}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={authForm.isLoading}
                  className="w-full bg-black border border-gray-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 touch-manipulation"
                >
                  {authForm.isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <User className="w-5 h-5" />
                      Verify OTP
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAuthStep('phone')}
                  className="w-full text-gray-400 hover:text-white py-3 transition-colors touch-manipulation"
                >
                  ← Back to phone number
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
