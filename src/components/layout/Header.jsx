import React from 'react'
import { useAppStore } from '../../store'
import { LogOut, Search } from 'lucide-react'
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
        'h-16 bg-surface-parchment border-b border-hairline',
        'flex items-center justify-between px-8 shrink-0 z-20 sticky top-0'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22H6L12 10L18 22H22L12 2Z" fill="currentColor" className="text-accent-crimson"/>
          </svg>
          <span className="font-serif text-lg tracking-tight font-medium text-ink hidden sm:block">
            Adjudicator AI
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          className="p-2 text-ink-muted hover:text-ink transition-colors"
          title="Search"
        >
          <Search size={18} strokeWidth={1.5} />
        </button>

        {user ? (
          <div className="flex items-center gap-4 pl-6 border-l border-hairline">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-sans font-medium text-ink">
                {user.displayName || user.email?.split('@')[0]}
              </p>
              <p className="label-caps text-ink-faint">Adjudicator</p>
            </div>
            
            <button 
              onClick={() => onNavigate('profile')}
              className="w-8 h-8 rounded border border-hairline flex items-center justify-center bg-surface-card text-ink font-sans text-sm font-medium hover:border-accent-crimson transition-colors"
            >
              {(user.displayName || user.email)?.[0]?.toUpperCase() || 'U'}
            </button>
            
            <button
              onClick={handleSignOut}
              className="p-2 text-ink-muted hover:text-accent-crimson transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => openModal('login')}
            className="btn btn-primary"
          >
            Get Started
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
