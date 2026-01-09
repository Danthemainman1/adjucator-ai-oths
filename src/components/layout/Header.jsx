import React from 'react'
import { useAppStore } from '../../store'
import { LogOut, Bell, Search, HelpCircle } from 'lucide-react'
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
        'h-16 bg-white/90 backdrop-blur-md border-b border-[#E5E5E5]',
        'flex items-center justify-between px-8 shrink-0 z-20 sticky top-0'
      )}
    >
      {/* Left: Status */}
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-xs text-ink-secondary font-medium tracking-wide uppercase">System Online</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <button 
          className="p-2 text-ink-light hover:text-ink-black hover:bg-gray-100 rounded-md transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Help */}
        <button 
          className="p-2 text-ink-light hover:text-ink-black hover:bg-gray-100 rounded-md transition-colors"
          title="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button 
          className="relative p-2 text-ink-light hover:text-ink-black hover:bg-gray-100 rounded-md transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-white" />
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* User Menu */}
        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-serif font-bold text-ink-black">
                {user.displayName || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-ink-light uppercase tracking-wider">Adjudicator</p>
            </div>
            <button 
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-sm bg-primary text-white flex items-center justify-center font-serif text-lg hover:bg-primary-800 transition-colors shadow-sm"
            >
              {(user.displayName || user.email)?.[0]?.toUpperCase() || 'U'}
            </button>
            <button
              onClick={handleSignOut}
              className="p-2 text-ink-light hover:text-accent-DEFAULT hover:bg-red-50 rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => openModal('login')}
            className="px-5 py-2 bg-primary text-white text-sm font-medium tracking-wide uppercase rounded-sm hover:bg-primary-800 transition-colors shadow-sm"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
