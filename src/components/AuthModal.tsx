import React from 'react';
import { X, User, Shield, Chrome } from 'lucide-react';
import { signInWithGoogle } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setError(result.error?.message || 'Failed to sign in with Google');
      }
      // Don't close modal here - it will close when auth state changes
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl shadow-2xl w-full max-w-md border border-gray-600">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-black border border-gray-600 p-2 rounded-lg">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Sign In</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 touch-manipulation"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Welcome to Projxty</h3>
            <p className="text-gray-300 text-sm">
              Sign in with your Google account to access your profile and explore projects
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
              <p className="text-red-200 text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 touch-manipulation shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Chrome className="w-5 h-5" />
                Continue with Google
              </>
            )}
          </button>

          <div className="mt-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-blue-200 font-medium text-sm mb-1">Access Levels</h4>
                <ul className="text-blue-200/80 text-xs space-y-1">
                  <li>• <strong>Users:</strong> Profile access, project viewing</li>
                  <li>• <strong>Admins:</strong> Full project management access</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-xs text-center mt-4">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};