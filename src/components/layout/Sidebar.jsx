import React from 'react'
import { Gavel, Mic, Layout as LayoutIcon, Target, Brain, HelpCircle, History, Menu, ChevronLeft } from 'lucide-react'
import { useAppStore } from '../../store'
import { cn } from '../../utils/helpers'

const Sidebar = ({ onNavigate, currentPage }) => {
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  
  const navItems = [
    { id: 'judge', label: 'Judge Speech', icon: Gavel },
    { id: 'board', label: 'Evaluate Board', icon: LayoutIcon },
    { id: 'coach', label: 'Live Coach', icon: Mic },
    { id: 'strategy', label: 'Strategy', icon: Target },
    { id: 'tone', label: 'Tone Analysis', icon: Brain },
    { id: 'extemp', label: 'Extemp Gen', icon: HelpCircle },
    { id: 'history', label: 'History', icon: History },
  ]

  return (
    <aside 
      className={cn(
        'fixed left-0 top-0 h-full z-30 transition-all duration-300 ease-out',
        'bg-surface-offset border-r border-hairline',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-hairline">
        <div className={cn("flex items-center gap-3 overflow-hidden transition-all", !sidebarOpen && "w-0 opacity-0")}>
           <span className="label-caps text-ink font-semibold">Menu</span>
        </div>
        
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-ink-muted hover:text-ink transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <nav className="p-4 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = currentPage === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex items-center gap-3 w-full p-2 rounded-sm transition-all duration-200 group relative',
                isActive ? 'text-ink font-medium' : 'text-ink-muted hover:text-ink hover:bg-surface-card'
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-[-16px] top-0 bottom-0 w-[2px] bg-accent-crimson rounded-r-sm" />
              )}
              
              <item.icon 
                size={18} 
                strokeWidth={1.5}
                className={isActive ? 'text-accent-crimson' : 'text-ink-faint group-hover:text-ink-muted'}
              />
              
              <span className={cn(
                'text-sm tracking-tight whitespace-nowrap transition-all duration-200',
                !sidebarOpen && 'opacity-0 w-0 hidden'
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
