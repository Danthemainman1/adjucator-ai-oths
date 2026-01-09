import React from 'react'
import { useAppStore } from '../../store'
import { cn } from '../../utils/helpers'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = ({ children, currentPage, onNavigate }) => {
  const { sidebarOpen } = useAppStore()

  return (
    <div className="min-h-screen bg-paper text-ink-black font-sans selection:bg-primary-100 selection:text-primary-900">
      {/* Sidebar - Assuming it exists or will be added */}
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Main Content */}
      <div 
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300 ease-out',
          sidebarOpen ? 'ml-64' : 'ml-20'
        )}
      >
        <Header onNavigate={onNavigate} />
        
        <main className="flex-1 overflow-auto p-8 md:p-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
