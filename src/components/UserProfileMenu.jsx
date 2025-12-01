import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAvatarById } from '../data/avatars';

const UserProfileMenu = ({ onSettingsClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);
  
  const { user, userProfile, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setIsLoggingOut(false);
  };

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User';
  const photoURL = userProfile?.photoURL || user?.photoURL;
  const email = user?.email;
  
  // Get custom avatar if set
  const customAvatar = userProfile?.avatarId ? getAvatarById(userProfile.avatarId) : null;

  // Avatar rendering helper
  const renderAvatar = (size = 'small') => {
    const sizeClasses = size === 'small' ? 'w-8 h-8 text-base' : 'w-10 h-10 text-lg';
    
    if (customAvatar) {
      return (
        <div className={`${sizeClasses} rounded-full bg-gradient-to-br ${customAvatar.color} flex items-center justify-center`}>
          {customAvatar.emoji}
        </div>
      );
    }
    
    if (photoURL) {
      return (
        <img 
          src={photoURL} 
          alt={displayName} 
          className={`${sizeClasses} rounded-full object-cover border-2 border-primary/30`}
        />
      );
    }
    
    return (
      <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center`}>
        <span className="text-white font-medium">
          {displayName.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/50 transition-all group"
      >
        {renderAvatar('small')}
        <span className="hidden lg:block text-sm font-medium text-text-secondary group-hover:text-white transition-colors">
          {displayName}
        </span>
        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 glass-card p-0 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
          {/* User Info Header */}
          <div className="p-4 bg-slate-900/50 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              {renderAvatar('large')}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {displayName}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {email}
                </p>
                {customAvatar && (
                  <p className="text-xs text-slate-500 truncate">
                    {customAvatar.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onSettingsClick?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-slate-800/50 hover:text-white transition-all"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to profile tab or modal
                onSettingsClick?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-slate-800/50 hover:text-white transition-all"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">Edit Profile</span>
            </button>

            <div className="my-2 border-t border-slate-700/50" />

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
