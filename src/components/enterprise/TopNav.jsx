import React, { useState } from 'react';
import { 
  Gavel, Bell, Settings, ChevronDown, LogOut, User,
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

  // Primary nav - most used features
  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'judge', label: 'Analyze', icon: Mic },
    { id: 'coach', label: 'Live Coach', icon: Brain },
    { id: 'practice', label: 'Practice', icon: Dumbbell },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
  ];

  // Secondary nav - in "More" dropdown
  const secondaryNavItems = [
    { id: 'quickstats', label: 'Quick Stats', icon: Activity },
    { id: 'motions', label: 'Motion Library', icon: ScrollText },
    { id: 'ballot', label: 'Ballot Generator', icon: Clipboard },
    { id: 'flowchart', label: 'Flowchart', icon: GitBranch },
    { id: 'voice', label: 'Voice Analysis', icon: Mic },
    { id: 'timer', label: 'Debate Timer', icon: Timer },
    { id: 'presets', label: 'Timer Presets', icon: Sliders }, // Replaced Settings2
    { id: 'notes', label: 'Notes', icon: FileEdit },
    { id: 'cards', label: 'Card Organizer', icon: LayoutGrid },
    { id: 'formatguide', label: 'Format Guide', icon: BookOpen },
    { id: 'speakerpoints', label: 'Speaker Points', icon: Award }, // Replaced Medal
    { id: 'clock', label: 'Debate Clock', icon: Timer }, // Replaced Hourglass
    { id: 'validator', label: 'Arg Validator', icon: Shield }, // Replaced ShieldCheck
    { id: 'judgenotes', label: 'Judge Notes', icon: PenTool }, // Replaced NotebookPen
    { id: 'roster', label: 'Team Roster', icon: Users }, // Replaced UsersRound
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
    <nav className="fixed top-0 left-0 right-0 z-50 h-[84px] bg-base-white border-b border-gold/10 shadow-sm transition-all">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 group"
          >
           <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-teal opacity-10 rounded-full group-hover:scale-110 transition-transform duration-500" />
              <div className="relative text-teal-dark group-hover:text-gold transition-colors">
                 <Gavel size={22} strokeWidth={1.5} />
              </div>
            </div>
            
            <div className="hidden sm:block text-left">
              <span className="block text-xl font-serif font-bold text-teal-dark tracking-tighter leading-none">
                Adjudicator<span className="text-gold">.ai</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold-dim font-medium">Enterprise</span>
            </div>
          </button>

          {/* Vertical Divider */}
          <div className="hidden lg:block h-6 w-px bg-gold/20" />

          {/* Center: Navigation */}
          <div className="hidden xl:flex items-center gap-1">
            {primaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300",
                  activeTab === item.id
                    ? "bg-teal text-white shadow-md shadow-teal/10"
                    : "text-teal-dark/70 hover:text-teal-dark hover:bg-teal/5"
                )}
              >
                <item.icon className="w-4 h-4" strokeWidth={1.5} />
                {item.label}
              </button>
            ))}
            
            {/* More dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                  secondaryNavItems.some(item => item.id === activeTab)
                   ? "bg-teal-light/10 text-teal-dark border border-teal/20"
                   : "text-teal-dark/60 hover:text-teal-dark hover:bg-gold/5"
                )}
              >
                More
                <ChevronDown className="w-3 h-3" />
              </button>

              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute left-0 top-full mt-4 w-64 bg-base-white border border-gold/20 rounded-lg shadow-xl shadow-teal/5 p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-1">
                      {secondaryNavItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setShowMoreMenu(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-left mb-1",
                            activeTab === item.id
                              ? "bg-teal/5 text-teal-dark font-medium"
                              : "text-text-muted hover:text-teal-dark hover:bg-gold/5"
                          )}
                        >
                          <item.icon className="w-4 h-4" strokeWidth={1.5} />
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
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gold-dim hover:text-teal hover:bg-teal/5 rounded-full transition-colors relative"
            >
              <Bell size={20} strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red rounded-full ring-2 ring-white" />
              )}
          </button>

          {/* Settings */}
          <button 
            onClick={onSettingsClick}
            className="p-2 text-gold-dim hover:text-teal hover:bg-teal/5 rounded-full transition-colors"
          >
            <Settings size={20} strokeWidth={1.5} />
          </button>

          {/* User Menu */}
          <div className="relative pl-4 border-l border-gold/20 ml-2">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1 rounded-full hover:bg-gold/5 transition-all group"
            >
              <div className="text-right hidden md:block">
                 <p className="text-sm font-serif font-bold text-teal-dark leading-tight">{user?.displayName || 'Adjudicator'}</p>
                 <p className="text-[10px] text-gold-dim uppercase tracking-widest font-medium">Online</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-teal-dark flex items-center justify-center text-gold font-serif text-lg border-2 border-white shadow-sm group-hover:border-gold transition-colors">
                {user?.displayName?.[0] || 'A'}
              </div>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full mt-4 w-56 bg-base-white border border-gold/20 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-text-muted hover:text-teal-dark hover:bg-gold/5 transition-all text-left text-sm">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <div className="h-px bg-gold/10 my-1" />
                    <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red hover:bg-red/5 transition-all text-left text-sm font-medium">
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
