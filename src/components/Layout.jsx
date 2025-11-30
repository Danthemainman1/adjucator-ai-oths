import React, { useState } from 'react';
import {
    Gavel,
    Mic,
    Layout as LayoutIcon,
    Settings,
    Menu,
    X,
    Moon,
    Sun,
    HelpCircle,
    History
} from 'lucide-react';

const Layout = ({ children, activeTab, setActiveTab, showSettings, setShowSettings }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    };

    const navItems = [
        { id: 'judge', label: 'Judge Speech', icon: Gavel },
        { id: 'board', label: 'Evaluate Board', icon: LayoutIcon },
        { id: 'coach', label: 'Live Coach', icon: Mic },
        { id: 'extemp', label: 'Extemp Gen', icon: HelpCircle },
        { id: 'history', label: 'History', icon: History },
    ];

    return (
        <div className={`min-h-screen flex bg-bg-primary text-text-primary ${isDarkMode ? 'dark' : ''}`}>
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-bg-secondary/50 backdrop-blur-xl fixed h-full z-20">
                <div className="p-6 flex items-center space-x-3 border-b border-slate-800/50">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                        <Gavel className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Adjudicator
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5'
                                    : 'text-text-secondary hover:bg-slate-800/50 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'animate-pulse-glow' : 'group-hover:scale-110 transition-transform'}`} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800/50 space-y-2">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${showSettings ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-slate-800/50 hover:text-white'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-slate-800/50 hover:text-white transition-all"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-bg-secondary/80 backdrop-blur-lg border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Gavel className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg">Adjudicator</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-text-secondary">
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-20 bg-bg-primary/95 backdrop-blur-xl pt-20 px-6 space-y-4 md:hidden animate-in slide-in-from-top-10">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center space-x-4 p-4 rounded-xl border ${activeTab === item.id
                                    ? 'bg-primary/10 border-primary/20 text-primary'
                                    : 'border-slate-800 text-text-secondary'
                                }`}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-lg font-medium">{item.label}</span>
                        </button>
                    ))}
                    <button
                        onClick={() => {
                            setShowSettings(true);
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-4 p-4 rounded-xl border border-slate-800 text-text-secondary"
                    >
                        <Settings className="w-6 h-6" />
                        <span className="text-lg font-medium">Settings</span>
                    </button>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto h-screen scroll-smooth">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
