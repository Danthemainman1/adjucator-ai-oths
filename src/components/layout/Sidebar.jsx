import React from 'react'
import { Gavel, Mic, Layout as LayoutIcon, Target, Brain, HelpCircle, History, Menu, ChevronLeft, ChevronRight } from 'lucide-react'
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
        'bg-base-white/80 backdrop-blur-md border-r border-gold/20 shadow-xl',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Sidebar Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-gold/10">
        <div className={cn("flex items-center gap-3 overflow-hidden transition-all", !sidebarOpen && "w-0 opacity-0")}>
           <div className="w-8 h-8 rounded bg-teal flex items-center justify-center text-gold">
             <Gavel size={18} />
           </div>
           <span className="font-serif font-bold text-lg text-teal-dark tracking-tight">Adjudicator</span>
        </div>
        
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-gold-dim hover:text-teal hover:bg-teal/5 rounded-full transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="p-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = currentPage === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex items-center gap-4 w-full p-3 rounded-sm transition-all duration-300 group',
                isActive 
                  ? 'bg-teal text-white shadow-md shadow-teal/20' 
                  : 'text-teal-dark hover:bg-gold/10'
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon 
                size={20} 
                strokeWidth={1.5}
                className={cn(
                  isActive ? 'text-gold' : 'text-teal-dark/70 group-hover:text-teal'
                )}
              />
              
              <span className={cn(
                'font-medium text-sm tracking-wide whitespace-nowrap transition-all duration-300',
                !sidebarOpen && 'opacity-0 w-0 hidden'
              )}>
                {item.label}
              </span>
              
              {isActive && sidebarOpen && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal via-gold to-red opacity-50" />
    </aside>
  )
}

export default Sidebar
