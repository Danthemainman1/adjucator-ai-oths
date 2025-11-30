import React from 'react';
import TopNav from './TopNav';

const EnterpriseLayout = ({ children, activeTab, setActiveTab, onSettingsClick }) => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs - more subtle */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
        
        {/* Grid pattern - very subtle */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px'
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
