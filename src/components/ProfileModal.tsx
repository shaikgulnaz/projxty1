import React from 'react';
import { X, User, Mail, Calendar, Shield, Star, Eye } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  userRole: 'admin' | 'user' | 'guest';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  userRole
}) => {
  if (!isOpen || !user) return null;

  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl shadow-2xl w-full max-w-md border border-gray-600">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-black border border-gray-600 p-2 rounded-lg">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 touch-manipulation"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {/* Profile Header */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <img
                src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email)}&background=1f2937&color=ffffff&size=128`}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-gray-600 shadow-lg"
              />
              {userRole === 'admin' && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 p-1.5 rounded-full border-2 border-gray-800">
                  <Shield className="w-3 h-3 text-gray-900" />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-white mt-3">
              {user.user_metadata?.full_name || 'User'}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                userRole === 'admin' 
                  ? 'bg-yellow-600 text-yellow-100' 
                  : 'bg-blue-600 text-blue-100'
              }`}>
                {userRole === 'admin' ? 'Administrator' : 'User'}
              </span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="glass rounded-lg p-4 border border-gray-600">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Email</span>
              </div>
              <p className="text-white text-sm pl-7">{user.email}</p>
            </div>

            <div className="glass rounded-lg p-4 border border-gray-600">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Member Since</span>
              </div>
              <p className="text-white text-sm pl-7">{joinDate}</p>
            </div>

            {userRole === 'admin' && (
              <div className="glass rounded-lg p-4 border border-gray-600 bg-yellow-600/10">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-300">Admin Privileges</span>
                </div>
                <ul className="text-yellow-200/80 text-xs space-y-1 pl-7">
                  <li>• Full project management access</li>
                  <li>• Blog post creation and editing</li>
                  <li>• User management capabilities</li>
                  <li>• Analytics and reporting</li>
                </ul>
              </div>
            )}

            {userRole === 'user' && (
              <div className="glass rounded-lg p-4 border border-gray-600">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">User Access</span>
                </div>
                <ul className="text-blue-200/80 text-xs space-y-1 pl-7">
                  <li>• View all projects and blog posts</li>
                  <li>• Contact project developers</li>
                  <li>• Share projects with others</li>
                  <li>• Access to profile settings</li>
                </ul>
              </div>
            )}
          </div>

          {/* Profile Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center glass rounded-lg p-3 border border-gray-600">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-lg font-bold text-white">0</span>
              </div>
              <p className="text-gray-400 text-xs">Favorites</p>
            </div>
            <div className="text-center glass rounded-lg p-3 border border-gray-600">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-lg font-bold text-white">0</span>
              </div>
              <p className="text-gray-400 text-xs">Views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};