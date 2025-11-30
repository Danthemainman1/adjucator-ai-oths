import React from 'react'
import { useAppStore } from '../../store'
import { LogOut, Bell, Search, HelpCircle, User } from 'lucide-react'
import { cn } from '../../utils/helpers'
import { signOut } from 'firebase/auth'
import { auth } from '../../utils/firebase'

const Header = ({ onNavigate }) => {
  const { 
    user, 
    openModal,
    setUser 
  } = useAppStore()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header 
      className={cn(
        'h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50',
        'flex items-center justify-between px-6 shrink-0 z-20'
      )}
    >
      {/* Left: Status */}
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <span className="text-xs text-slate-500 font-medium">Online</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search (placeholder for future) */}
        <button 
          className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Help */}
        <button 
          className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors"
          title="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications (placeholder) */}
        <button 
          className="relative p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full" />
        </button>

        <div className="h-8 w-px bg-slate-800 mx-1" />

        {/* User Menu */}
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">
                {user.displayName || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-slate-500">Pro Account</p>
            </div>
            <button 
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow"
            >
              {(user.displayName || user.email)?.[0]?.toUpperCase() || 'U'}
            </button>
            <button
              onClick={handleSignOut}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => openModal('login')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-105"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
