import React, { useState } from 'react';
import { X, Phone, Lock, User, Shield, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [authStep, setAuthStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [authForm, setAuthForm] = useState({
    phone: '',
    otp: '',
    name: '',
    error: '',
    isLoading: false,
    otpSent: false,
    isSignUp: false
  });

  if (!isOpen) return null;

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Add +91 prefix if not present and it's a 10-digit Indian number
    if (digits.length === 10 && !digits.startsWith('91')) {
      return `+91${digits}`;
    }
    
    // If it starts with 91 and has 12 digits total, add +
    if (digits.length === 12 && digits.startsWith('91')) {
      return `+${digits}`;
    }
    
    // If it already has country code format
    if (phone.startsWith('+')) {
      return phone;
    }
    
    return `+91${digits}`;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthForm(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const formattedPhone = formatPhoneNumber(authForm.phone);
      
      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      // Check if user exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .single();

      // Send OTP via Supabase Auth
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          channel: 'sms'
        }
      });

      if (error) {
        throw error;
      }

      setAuthForm(prev => ({
        ...prev,
        phone: formattedPhone,
        isLoading: false,
        otpSent: true,
        isSignUp: !existingUser
      }));
      setAuthStep('otp');

    } catch (error: any) {
      setAuthForm(prev => ({
        ...prev,
        error: error.message || 'Failed to send OTP. Please try again.',
        isLoading: false
      }));
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthForm(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      // Verify OTP
      const { data, error } = await supabase.auth.verifyOtp({
        phone: authForm.phone,
        token: authForm.otp,
        type: 'sms'
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Check if this is a new user (sign up)
        if (authForm.isSignUp) {
          setAuthStep('profile');
          setAuthForm(prev => ({ ...prev, isLoading: false }));
        } else {
          // Existing user - complete login
          await completeLogin(data.user);
        }
      }

    } catch (error: any) {
      setAuthForm(prev => ({
        ...prev,
        error: error.message || 'Invalid OTP. Please try again.',
        isLoading: false
      }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthForm(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not found');
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          phone: authForm.phone,
          name: authForm.name,
          role: 'user',
          created_at: new Date().toISOString()
        });

      if (profileError) {
        throw profileError;
      }

      await completeLogin(user);

    } catch (error: any) {
      setAuthForm(prev => ({
        ...prev,
        error: error.message || 'Failed to create profile. Please try again.',
        isLoading: false
      }));
    }
  };

  const completeLogin = async (user: any) => {
    try {
      // Get user profile
      const { data: profile } = await supabase
        ?.from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const userData = {
        ...user,
        profile: profile || null
      };

      onAuthSuccess(userData);
      handleClose();
    } catch (error) {
      console.error('Error completing login:', error);
      onAuthSuccess(user);
      handleClose();
    }
  };

  const handleClose = () => {
    setAuthForm({
      phone: '',
      otp: '',
      name: '',
      error: '',
      isLoading: false,
      otpSent: false,
      isSignUp: false
    });
    setAuthStep('phone');
    onClose();
  };

  const handleResendOTP = async () => {
    setAuthForm(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: authForm.phone,
        options: {
          channel: 'sms'
        }
      });

      if (error) {
        throw error;
      }

      setAuthForm(prev => ({
        ...prev,
        isLoading: false,
        error: '',
        otpSent: true
      }));

    } catch (error: any) {
      setAuthForm(prev => ({
        ...prev,
        error: error.message || 'Failed to resend OTP. Please try again.',
        isLoading: false
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl shadow-2xl w-full max-w-sm border border-gray-600">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-black border border-gray-600 p-2 rounded-lg">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {authStep === 'phone' ? 'Login / Sign Up' : 
               authStep === 'otp' ? 'Verify OTP' : 'Complete Profile'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 touch-manipulation"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Phone Number Step */}
        {authStep === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="p-4 sm:p-6">
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-6 text-center">
                Enter your mobile number to get started
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={authForm.phone}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, phone: e.target.value, error: '' }))}
                    className="w-full pl-10 pr-4 py-4 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 text-base"
                    placeholder="Enter mobile number"
                    required
                    disabled={authForm.isLoading}
                  />
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  We'll send you an OTP to verify your number
                </p>
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
                  <MessageCircle className="w-5 h-5" />
                  Send OTP
                </>
              )}
            </button>
          </form>
        )}

        {/* OTP Verification Step */}
        {authStep === 'otp' && (
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
                    onChange={(e) => setAuthForm(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 6), error: '' }))}
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
                disabled={authForm.isLoading || authForm.otp.length !== 6}
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
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setAuthStep('phone')}
                  className="text-gray-400 hover:text-white py-2 transition-colors touch-manipulation text-sm"
                >
                  ← Change Number
                </button>
                
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={authForm.isLoading}
                  className="text-gray-400 hover:text-white py-2 transition-colors touch-manipulation text-sm disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Profile Setup Step (for new users) */}
        {authStep === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="p-4 sm:p-6">
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-6 text-center">
                Complete your profile to get started
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value, error: '' }))}
                    className="w-full pl-10 pr-4 py-4 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 text-base"
                    placeholder="Enter your full name"
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
                  Creating Profile...
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Complete Setup
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};