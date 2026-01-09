import React from 'react';
import TopNav from './TopNav';

const EnterpriseLayout = ({ children, activeTab, setActiveTab, onSettingsClick }) => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-teal/20">
      {/* Background - Elegant & Clean (No Deep Space) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-base-white/50">
        {/* Subtle Wave or Gradient to matching theme */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-teal/5 to-transparent opacity-60" />
      </div>

      {/* Top Navigation */}
      <TopNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onSettingsClick={onSettingsClick}
      />

      {/* Main Content */}
      <main className="relative pt-6 pb-20 lg:pb-8 min-h-screen">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};

export default EnterpriseLayout;
