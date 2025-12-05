import React, { useState, useRef, useEffect } from 'react';
import { 
  Gavel, 
  Bell, 
  Settings, 
  ChevronDown,
  LogOut,
  User,
  CreditCard,
  HelpCircle,
  Search,
  Command,
  BarChart3,
  Target,
  BookOpen,
  Dumbbell,
  Users,
  Trophy,
  Mic,
  Brain,
  Lightbulb,
  FileText,
  History,
  MoreHorizontal,
  GitBranch,
  Timer,
  List,
  Calendar,
  Activity,
  ScrollText,
  ClipboardCheck,
  Settings2,
  StickyNote,
  LayoutGrid,
  BookMarked,
  Medal,
  Hourglass,
  ShieldCheck,
  NotebookPen,
  UsersRound
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const TopNav = ({ activeTab, setActiveTab, onSettingsClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();

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
    { id: 'ballot', label: 'Ballot Generator', icon: ClipboardCheck },
    { id: 'flowchart', label: 'Flowchart', icon: GitBranch },
    { id: 'voice', label: 'Voice Analysis', icon: Mic },
    { id: 'timer', label: 'Debate Timer', icon: Timer },
    { id: 'presets', label: 'Timer Presets', icon: Settings2 },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'cards', label: 'Card Organizer', icon: LayoutGrid },
    { id: 'formatguide', label: 'Format Guide', icon: BookMarked },
    { id: 'speakerpoints', label: 'Speaker Points', icon: Medal },
    { id: 'clock', label: 'Debate Clock', icon: Hourglass },
    { id: 'validator', label: 'Arg Validator', icon: ShieldCheck },
    { id: 'judgenotes', label: 'Judge Notes', icon: NotebookPen },
    { id: 'roster', label: 'Team Roster', icon: UsersRound },
    { id: 'outline', label: 'Outline Builder', icon: List },
    { id: 'scheduler', label: 'Round Scheduler', icon: Calendar },
    { id: 'opponents', label: 'Opponents', icon: Target },
    { id: 'evidence', label: 'Evidence Library', icon: BookOpen },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'strategy', label: 'Strategy', icon: Lightbulb },
    { id: 'extemp', label: 'Extemp', icon: FileText },
    { id: 'tone', label: 'Tone Analysis', icon: Mic },
    { id: 'history', label: 'History', icon: History },
  ];

  // All nav items for mobile
  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  const notifications = [
    { id: 1, title: 'Analysis Complete', message: 'Your PF speech analysis is ready', time: '2m ago', unread: true },
    { id: 2, title: 'New Feature', message: 'Team collaboration now available', time: '1h ago', unread: true },
    { id: 3, title: 'Weekly Report', message: 'Your performance summary is ready', time: '1d ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 h-16 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-lg">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Gavel className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-white tracking-tight">Adjudicator</span>
              <span className="text-lg font-light text-slate-400 ml-1">AI</span>
            </div>
          </button>

          {/* Center: Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {primaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-white/10 text-white shadow-inner border border-white/5'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            
            {/* More dropdown */}
            <div className="relative ml-1">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  secondaryNavItems.some(item => item.id === activeTab)
                    ? 'bg-white/10 text-white shadow-inner border border-white/5'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <MoreHorizontal className="w-4 h-4" />
                More
                <ChevronDown className="w-3 h-3" />
              </button>

              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute left-0 top-full mt-2 w-64 glass-panel p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                      {secondaryNavItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setShowMoreMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                            activeTab === item.id
                              ? 'bg-cyan-500/10 text-cyan-400'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
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
        <div className="flex items-center gap-2">
          {/* Search Shortcut */}
          <div className="hidden md:flex relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <button className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/50 border border-white/10 text-slate-400 hover:text-white transition-all">
              <Search className="w-4 h-4" />
              <span className="text-sm">Search...</span>
              <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-white/5 rounded border border-white/10 font-mono">⌘K</kbd>
            </button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full ring-2 ring-slate-950" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-cyan-500/10 text-cyan-400 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer ${
                          notification.unread ? 'bg-slate-800/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <span className="w-2 h-2 mt-2 bg-cyan-500 rounded-full flex-shrink-0" />
                          )}
                          <div className={notification.unread ? '' : 'ml-5'}>
                            <p className="text-sm font-medium text-white">{notification.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{notification.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-800">
                    <button className="w-full py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Settings */}
          <button 
            onClick={onSettingsClick}
            className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="relative ml-2">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-slate-800/50 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'G'}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                  {/* User Info */}
                  <div className="p-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg">
                        {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'G'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {user?.displayName || 'Guest User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user?.email || 'guest@adjudicator.ai'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onSettingsClick();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all text-left"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Profile Settings</span>
                    </button>
                    
                    {/* Theme Toggle */}
                    <div className="px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Dark Mode</span>
                        <button 
                          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            theme === 'dark' ? 'bg-cyan-500' : 'bg-slate-700'
                          }`}
                        >
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            theme === 'dark' ? 'left-6' : 'left-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Logout */}
                  {isAuthenticated && (
                    <div className="p-2 border-t border-slate-800">
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/60 px-2 py-2 z-50">
        <div className="flex items-center justify-around">
          {primaryNavItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'text-cyan-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
          {/* More button for mobile */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all ${
                secondaryNavItems.some(item => item.id === activeTab)
                  ? 'text-cyan-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
            
            {showMoreMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                <div className="absolute bottom-full right-0 mb-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                  <div className="p-2 max-h-[50vh] overflow-y-auto">
                    {secondaryNavItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setShowMoreMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                          activeTab === item.id
                            ? 'bg-cyan-500/10 text-cyan-400'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
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
    </nav>
  );
};

export default TopNav;
