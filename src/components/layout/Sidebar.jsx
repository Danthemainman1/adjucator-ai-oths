import React from 'react'
import { useAppStore } from '../../store'
import { cn } from '../../utils/helpers'
import { 
  Layout, 
  Mic, 
  Image as ImageIcon, 
  Zap, 
  Activity, 
  Gavel, 
  History, 
  Settings,
  Moon,
  Sun,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const Sidebar = ({ currentPage, onNavigate }) => {
  const { 
    settings,
    setSettings, 
    user, 
    sidebarOpen, 
    setSidebarOpen,
    openModal 
  } = useAppStore()

  // Navigation items organized by workflow
  const navGroups = [
    {
      title: 'Analyze',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Layout },
        { id: 'speech-analysis', label: 'Speech Analysis', icon: Mic },
        { id: 'board-evaluation', label: 'Flow Evaluation', icon: ImageIcon },
        { id: 'live-coaching', label: 'Live Coaching', icon: Activity },
      ]
    },
    {
      title: 'Practice',
      items: [
        { id: 'strategy', label: 'Strategy Gen', icon: Zap },
      ]
    },
    {
      title: 'Tools',
      items: [
        { id: 'judge-tools', label: 'Judge Tools', icon: Gavel },
        { id: 'history', label: 'History', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ]

  return (
    <aside 
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col',
        'bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/50',
        'transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-slate-800/50">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 w-full group"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl blur opacity-40 group-hover:opacity-70 transition-all duration-300" />
            <div className="relative p-2.5 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl shadow-lg">
              <Gavel className="w-5 h-5 text-white" />
            </div>
          </div>
          {sidebarOpen && (
            <div className="flex flex-col items-start overflow-hidden">
              <span className="font-bold text-white text-lg leading-tight">Adjudicator</span>
              <span className="text-xs text-cyan-400 font-medium">AI Coach</span>
            </div>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            {sidebarOpen && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {group.title}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavItem
                  key={item.id}
                  {...item}
                  active={currentPage === item.id}
                  onClick={() => onNavigate(item.id)}
                  collapsed={!sidebarOpen}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800/50 space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={() => setSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
            'text-slate-400 hover:text-white hover:bg-slate-800/50',
            'transition-all duration-200'
          )}
        >
          {settings.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          {sidebarOpen && <span className="text-sm">Toggle Theme</span>}
        </button>

        {/* User / Auth */}
        {user ? (
          <div className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl',
            'bg-slate-800/30'
          )}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {(user.username || user.email)?.[0]?.toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.username || user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => openModal('login')}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
              'bg-gradient-to-r from-cyan-500/10 to-purple-500/10',
              'border border-cyan-500/20 text-cyan-400',
              'hover:from-cyan-500/20 hover:to-purple-500/20',
              'transition-all duration-200'
            )}
          >
            <User className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm font-medium">Sign In</span>}
          </button>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-3 py-2',
            'text-slate-500 hover:text-slate-300',
            'transition-colors duration-200'
          )}
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  )
}

// Navigation Item Component
const NavItem = ({ id, label, icon: Icon, active, onClick, collapsed }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
        'transition-all duration-200 group relative',
        active
          ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-transparent text-white'
          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      )}
    >
      <div className="relative">
        <Icon 
          className={cn(
            'w-5 h-5 transition-all duration-200',
            active && 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]'
          )} 
        />
        {active && (
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-r-full" />
        )}
      </div>
      
      {!collapsed && (
        <span className="text-sm font-medium">{label}</span>
      )}

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className={cn(
          'absolute left-full ml-3 px-3 py-2 rounded-lg',
          'bg-slate-900 border border-slate-700 shadow-xl',
          'text-sm text-white whitespace-nowrap',
          'invisible opacity-0 group-hover:visible group-hover:opacity-100',
          'transition-all duration-200 z-50'
        )}>
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-slate-900" />
        </div>
      )}
    </button>
  )
}

export default Sidebar
