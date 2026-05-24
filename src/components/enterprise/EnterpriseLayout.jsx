import React from 'react';
import TopNav from './TopNav';

const EnterpriseLayout = ({ children, activeTab, setActiveTab, onSettingsClick }) => {
  return (
    <div className="min-h-screen bg-surface-parchment text-ink selection:bg-accent-crimson selection:text-surface-parchment font-sans">
      <TopNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onSettingsClick={onSettingsClick}
      />
      <main className="relative pt-6 pb-20 lg:pb-8 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};
export default EnterpriseLayout;
