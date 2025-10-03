import React, { useState } from 'react';
import { X, Lock, User, Shield, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [authStep, setAuthStep] = useState<'login' | 'signup'>('login');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
    error: '',
    isLoading: false
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthForm(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: authForm.email,
        password: authForm.password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await completeLogin(data.user);
      }

    } catch (error: any) {
      setAuthForm(prev => ({
        ...prev,
        error: error.message || 'Invalid credentials. Please try again.',
        isLoading: false
      }));
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthForm(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      const { data, error } = await supabase.auth.signUp({
        email: authForm.email,
        password: authForm.password,
        options: {
          data: {
            name: authForm.name
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: authForm.email,
            name: authForm.name,
            role: 'user',
            created_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        await completeLogin(data.user);
      }

    } catch (error: any) {
      setAuthForm(prev => ({
        ...prev,
        error: error.message || 'Failed to create account. Please try again.',
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
        .maybeSingle();

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
      email: '',
      password: '',
      name: '',
      error: '',
      isLoading: false
    });
    setAuthStep('login');
    onClose();
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
              {authStep === 'login' ? 'Login' : 'Sign Up'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 touch-manipulation"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Login Form */}
        {authStep === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-4 sm:p-6">
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-6 text-center">
                Welcome back! Login to your account
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value, error: '' }))}
                    className="w-full pl-10 pr-4 py-4 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 text-base"
                    placeholder="Enter your email"
                    required
                    disabled={authForm.isLoading}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value, error: '' }))}
                    className="w-full pl-10 pr-4 py-4 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 text-base"
                    placeholder="Enter your password"
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
                  Logging in...
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Login
                </>
              )}
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setAuthStep('signup')}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Don't have an account? <span className="font-medium">Sign Up</span>
              </button>
            </div>
          </form>
        )}

        {/* Signup Form */}
        {authStep === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="p-4 sm:p-6">
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-6 text-center">
                Create your account to get started
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value, error: '' }))}
                    className="w-full pl-10 pr-4 py-4 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 text-base"
                    placeholder="Enter your email"
                    required
                    disabled={authForm.isLoading}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value, error: '' }))}
                    className="w-full pl-10 pr-4 py-4 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 text-base"
                    placeholder="Create a password (min 6 characters)"
                    required
                    minLength={6}
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
                  Creating Account...
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Sign Up
                </>
              )}
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setAuthStep('login')}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Already have an account? <span className="font-medium">Login</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};