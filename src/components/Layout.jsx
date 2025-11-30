import React, { useState } from 'react';
import {
    Gavel,
    Mic,
    Layout as LayoutIcon,
    Settings,
    Menu,
    X,
    HelpCircle,
    History,
    Target,
    Brain
} from 'lucide-react';
import UserProfileMenu from './UserProfileMenu';
import ThemeSelector from './ThemeSelector';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children, activeTab, setActiveTab, showSettings, setShowSettings }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const { theme } = useTheme();

    const navItems = [
        { id: 'judge', label: 'Judge Speech', icon: Gavel },
        { id: 'board', label: 'Evaluate Board', icon: LayoutIcon },
        { id: 'coach', label: 'Live Coach', icon: Mic },
        { id: 'strategy', label: 'Strategy', icon: Target },
        { id: 'tone', label: 'Tone Analysis', icon: Brain },
        { id: 'extemp', label: 'Extemp Gen', icon: HelpCircle },
        { id: 'history', label: 'History', icon: History },
    ];

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Sidebar - Desktop */}
            <aside 
                className="hidden md:flex flex-col w-64 border-r backdrop-blur-xl fixed h-full z-20"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
            >
                <div className="p-6 flex items-center space-x-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
                        style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))` }}
                    >
                        <Gavel className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        Adjudicator
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group"
                            style={{
                                backgroundColor: activeTab === item.id ? 'rgba(var(--primary-rgb, 6, 182, 212), 0.1)' : 'transparent',
                                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-secondary)',
                                border: activeTab === item.id ? '1px solid rgba(var(--primary-rgb, 6, 182, 212), 0.2)' : '1px solid transparent'
                            }}
                        >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? '' : 'group-hover:scale-110 transition-transform'}`} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all"
                        style={{
                            backgroundColor: showSettings ? 'rgba(var(--accent-rgb, 168, 85, 247), 0.1)' : 'transparent',
                            color: showSettings ? 'var(--accent)' : 'var(--text-secondary)'
                        }}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </button>

                    <ThemeSelector />

                    {/* User Profile Menu */}
                    {isAuthenticated && (
                        <div className="pt-2 border-t mt-2" style={{ borderColor: 'var(--border)' }}>
                            <UserProfileMenu onSettingsClick={() => setShowSettings(true)} />
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Header */}
            <div 
                className="md:hidden fixed top-0 left-0 right-0 z-30 backdrop-blur-lg border-b px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
            >
                <div className="flex items-center space-x-2">
                    <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))` }}
                    >
                        <Gavel className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Adjudicator</span>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSelector compact />
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        className="p-2"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-20 backdrop-blur-xl pt-20 px-6 space-y-4 md:hidden animate-in slide-in-from-top-10"
                    style={{ backgroundColor: 'var(--bg-primary)', opacity: 0.98 }}
                >
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-4 p-4 rounded-xl border"
                            style={{
                                backgroundColor: activeTab === item.id ? 'rgba(var(--primary-rgb, 6, 182, 212), 0.1)' : 'transparent',
                                borderColor: activeTab === item.id ? 'rgba(var(--primary-rgb, 6, 182, 212), 0.2)' : 'var(--border)',
                                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-secondary)'
                            }}
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
                        className="w-full flex items-center space-x-4 p-4 rounded-xl border"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
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
