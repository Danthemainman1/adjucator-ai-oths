import React, { useState } from 'react';
import { 
  Bell, Settings, ChevronDown, LogOut, User,
  HelpCircle, Search, BarChart3, Target, BookOpen,
  Dumbbell, Users, Trophy, Mic, Brain, Lightbulb,
  FileText, History, MoreHorizontal, GitBranch, Timer,
  List, Calendar, Activity, ScrollText, Clipboard,
  Sliders, FileEdit, LayoutGrid, Award, Flag, Shield,
  PenTool
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/helpers';

const TopNav = ({ activeTab, setActiveTab, onSettingsClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'judge', label: 'Analyze', icon: Mic },
    { id: 'coach', label: 'Live Coach', icon: Brain },
    { id: 'practice', label: 'Practice', icon: Dumbbell },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
  ];

  const secondaryNavItems = [
    { id: 'quickstats', label: 'Quick Stats', icon: Activity },
    { id: 'motions', label: 'Motion Library', icon: ScrollText },
    { id: 'ballot', label: 'Ballot Generator', icon: Clipboard },
    { id: 'flowchart', label: 'Flowchart', icon: GitBranch },
    { id: 'voice', label: 'Voice Analysis', icon: Mic },
    { id: 'timer', label: 'Debate Timer', icon: Timer },
    { id: 'presets', label: 'Timer Presets', icon: Sliders },
    { id: 'notes', label: 'Notes', icon: FileEdit },
    { id: 'cards', label: 'Card Organizer', icon: LayoutGrid },
    { id: 'formatguide', label: 'Format Guide', icon: BookOpen },
    { id: 'speakerpoints', label: 'Speaker Points', icon: Award },
    { id: 'clock', label: 'Debate Clock', icon: Timer },
    { id: 'validator', label: 'Arg Validator', icon: Shield },
    { id: 'judgenotes', label: 'Judge Notes', icon: PenTool },
    { id: 'roster', label: 'Team Roster', icon: Users },
    { id: 'outline', label: 'Outline Builder', icon: List },
    { id: 'scheduler', label: 'Round Scheduler', icon: Calendar },
    { id: 'opponents', label: 'Opponents', icon: Target },
    { id: 'evidence', label: 'Evidence Library', icon: BookOpen },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'strategy', label: 'Strategy', icon: Lightbulb },
    { id: 'extemp', label: 'Extemp', icon: FileText },
    { id: 'tone', label: 'Tone Analysis', icon: Mic },
    { id: 'history', label: 'History', icon: History },
  ];

  const notifications = [];
  const unreadCount = 0;

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 h-16 bg-surface-parchment border-b border-hairline">
      <div className="h-full px-6 flex items-center justify-between mx-auto max-w-[1400px]">
        {/* Left: Logo & Nav */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 group"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22H6L12 10L18 22H22L12 2Z" fill="currentColor" className="text-accent-crimson"/>
            </svg>
            <div className="flex flex-col items-start leading-none mt-1 hidden sm:flex">
              <span className="text-lg font-serif font-medium text-ink tracking-tight">Adjudicator AI</span>
            </div>
          </button>

          <div className="hidden lg:block h-6 w-px bg-hairline" />

          {/* Center: Navigation */}
          <div className="hidden xl:flex items-center gap-1">
            {primaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors",
                  activeTab === item.id
                    ? "font-medium text-ink bg-surface-card"
                    : "text-ink-muted hover:text-ink hover:bg-surface-offset"
                )}
              >
                {item.label}
              </button>
            ))}
            
            {/* More dropdown */}
            <div className="relative ml-1">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors",
                  secondaryNavItems.some(item => item.id === activeTab)
                   ? "font-medium text-ink bg-surface-card"
                   : "text-ink-muted hover:text-ink hover:bg-surface-offset"
                )}
              >
                More
                <ChevronDown className="w-3 h-3" />
              </button>

              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute left-0 top-full mt-2 w-64 bg-surface-parchment border border-hairline rounded shadow-subtle p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-1">
                      {secondaryNavItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setShowMoreMenu(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded transition-colors text-left mb-1",
                            activeTab === item.id
                              ? "bg-surface-card text-ink font-medium"
                              : "text-ink-muted hover:text-ink hover:bg-surface-card"
                          )}
                        >
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-ink-muted hover:text-ink transition-colors relative"
          >
            <Bell size={18} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent-crimson rounded-full" />
            )}
          </button>

          <button 
            onClick={onSettingsClick}
            className="p-2 text-ink-muted hover:text-ink transition-colors"
          >
            <Settings size={18} strokeWidth={1.5} />
          </button>

          {/* User Menu */}
          <div className="relative pl-4 border-l border-hairline ml-2">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 rounded p-0.5 hover:bg-surface-card transition-colors group"
            >
              <div className="text-right hidden md:block mr-1">
                 <p className="text-sm font-sans font-medium text-ink leading-tight">{user?.displayName || 'User'}</p>
                 <p className="label-caps text-ink-faint">Adjudicator</p>
              </div>
              <div className="w-8 h-8 rounded border border-hairline flex items-center justify-center bg-surface-card text-ink font-sans text-sm font-medium group-hover:border-accent-crimson transition-colors">
                {user?.displayName?.[0] || 'U'}
              </div>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-parchment border border-hairline rounded shadow-subtle z-50 overflow-hidden">
                  <div className="p-1.5">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded text-ink-muted hover:text-ink hover:bg-surface-card transition-colors text-left text-sm">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <div className="h-px bg-hairline my-1" />
                    <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded text-accent-crimson hover:bg-surface-card transition-colors text-left text-sm font-medium">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default TopNav;
