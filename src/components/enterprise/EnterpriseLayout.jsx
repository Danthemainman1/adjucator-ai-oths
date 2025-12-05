import React from 'react';
import TopNav from './TopNav';

const EnterpriseLayout = ({ children, activeTab, setActiveTab, onSettingsClick }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30">
      {/* Animated Deep Space Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#020617]" />
        
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDuration: '12s', animationDelay: '2s' }} />

        {/* Subtle Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
          }}
        />
      </div>

      {/* Top Navigation */}
      <TopNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onSettingsClick={onSettingsClick}
      />

      {/* Main Content */}
      <main className="relative pt-16 pb-20 lg:pb-8 min-h-screen">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default EnterpriseLayout;
