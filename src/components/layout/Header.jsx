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

  // Icon common styles: Thin stroke, Gold color
  const iconStyle = { strokeWidth: 1.5 }

  return (
    <header 
      className={cn(
        'h-20 bg-base-white border-b border-gold/30',
        'flex items-center justify-between px-8 shrink-0 z-20 sticky top-0',
        'shadow-sm'
      )}
    >
      {/* Left: Brand/Context */}
      <div className="flex items-center gap-4">
        {/* Adjudicator Logo Text */}
        <h1 className="text-2xl font-serif text-teal-dark tracking-tighter">
          Adjudicator<span className="text-gold">.ai</span>
        </h1>
        
        {/* Vertical Divider */}
        <div className="h-6 w-px bg-gold/30 mx-2" />

        {/* Status */}
        <div className="flex items-center gap-2 px-3 py-1 bg-teal-light/5 border border-teal-light/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-teal font-bold">Online</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* Icon Group */}
        <div className="flex items-center gap-2">
            <button 
            className="p-2 text-gold-dim hover:text-teal hover:bg-teal/5 rounded-full transition-colors"
            title="Search"
            >
            <Search size={20} style={iconStyle} />
            </button>

            <button 
            className="p-2 text-gold-dim hover:text-teal hover:bg-teal/5 rounded-full transition-colors"
            title="Help"
            >
            <HelpCircle size={20} style={iconStyle} />
            </button>

            <button 
            className="relative p-2 text-gold-dim hover:text-teal hover:bg-teal/5 rounded-full transition-colors"
            title="Notifications"
            >
            <Bell size={20} style={iconStyle} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red rounded-full ring-2 ring-white" />
            </button>
        </div>

        {/* User Menu */}
        {user ? (
          <div className="flex items-center gap-4 pl-6 border-l border-gold/20">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-serif font-bold text-teal-dark">
                {user.displayName || user.email?.split('@')[0]}
              </p>
              <p className="text-[10px] text-gold-dim uppercase tracking-widest">Adjudicator</p>
            </div>
            
            <button 
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-full border border-gold/50 p-0.5"
            >
               <div className="w-full h-full rounded-full bg-teal-dark flex items-center justify-center text-gold font-serif text-lg">
                {(user.displayName || user.email)?.[0]?.toUpperCase() || 'U'}
               </div>
            </button>
            
            <button
              onClick={handleSignOut}
              className="p-2 text-gold-dim hover:text-red hover:bg-red/5 rounded-full transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} style={iconStyle} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => openModal('login')}
            className="px-6 py-2 bg-teal text-white text-xs font-bold tracking-widest uppercase border border-teal-dark hover:bg-teal-dark transition-all shadow-gold"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
