import React, { useState } from 'react'
import { useAppStore } from '../../store'
import { LogOut, Search, X, ArrowRight } from 'lucide-react'
import { cn } from '../../utils/helpers'
import { signOut } from 'firebase/auth'
import { auth } from '../../utils/firebase'

const Header = ({ onNavigate }) => {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { 
    user, 
    openModal,
    setUser 
  } = useAppStore()

  const quickLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'judge', label: 'Judge Speech' },
    { id: 'coach', label: 'Live Coach' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'history', label: 'History' },
  ]

  const filteredLinks = quickLinks.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.includes(searchQuery.toLowerCase())
  )

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
        'relative h-16 bg-surface-parchment border-b border-hairline',
        'flex items-center justify-between px-8 shrink-0 z-20 sticky top-0'
      )}
    >
      <div className="flex items-center gap-4">
        <button type="button" className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22H6L12 10L18 22H22L12 2Z" fill="currentColor" className="text-accent-crimson"/>
          </svg>
          <span className="font-serif text-lg tracking-tight font-medium text-ink hidden sm:block">
            Adjudicator AI
          </span>
        </button>
      </div>

      <div className="flex items-center gap-6">
        <button 
          className="p-2 text-ink-muted hover:text-ink transition-colors"
          title="Search"
          onClick={() => setShowSearch((value) => !value)}
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

      {showSearch && (
        <div className="absolute right-8 top-16 z-50 w-[22rem] rounded-2xl border border-hairline bg-surface-parchment shadow-2xl p-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-sm font-medium text-ink">Quick Navigation</p>
              <p className="text-xs text-ink-muted">Jump to any workspace section</p>
            </div>
            <button type="button" onClick={() => setShowSearch(false)} className="p-1.5 rounded-lg hover:bg-surface-offset text-ink-muted hover:text-ink">
              <X size={16} />
            </button>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sections..."
            className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-hairline text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-hairline"
          />
          <div className="mt-3 max-h-56 overflow-y-auto space-y-1">
            {filteredLinks.length > 0 ? filteredLinks.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  setShowSearch(false)
                }}
                className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-ink-muted hover:bg-surface-offset hover:text-ink transition-colors"
              >
                <span>{item.label}</span>
                <ArrowRight size={14} />
              </button>
            )) : (
              <p className="px-3 py-4 text-sm text-ink-muted">No matching sections.</p>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
