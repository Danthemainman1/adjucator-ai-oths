import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Main application store
export const useAppStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Settings (consolidated)
      settings: {
        apiKey: '',
        apiProvider: 'gemini',
        model: 'gemini-pro',
        theme: 'dark',
        accentColor: 'cyan',
        soundEnabled: true,
        liveCoachingTips: true
      },
      setSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
      
      // Sidebar state
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // History
      history: [],
      addToHistory: (session) => set((state) => ({
        history: [
          { ...session, timestamp: session.timestamp || new Date().toISOString() },
          ...state.history
        ].slice(0, 100)
      })),
      removeFromHistory: (timestamp) => set((state) => ({
        history: state.history.filter(h => h.timestamp !== timestamp)
      })),
      clearHistory: () => set({ history: [] }),
      
      // Current session state
      currentSession: {
        result: null,
        radarData: null,
        loading: false,
        error: null
      },
      setCurrentSession: (updates) => set((state) => ({
        currentSession: { ...state.currentSession, ...updates }
      })),
      resetCurrentSession: () => set({
        currentSession: { result: null, radarData: null, loading: false, error: null }
      }),
      
      // Modals
      modals: {
        login: false,
        help: false,
        settings: false
      },
      openModal: (modal) => set((state) => ({
        modals: { ...state.modals, [modal]: true }
      })),
      closeModal: (modal) => set((state) => ({
        modals: { ...state.modals, [modal]: false }
      })),
      
      // Get stats from history
      getStats: () => {
        const history = get().history || []
        const now = new Date()
        
        // Calculate streak
        let streak = 0
        const dates = [...new Set(history.map(h => new Date(h.timestamp).toDateString()))]
        const sortedDates = dates.sort((a, b) => new Date(b) - new Date(a))
        
        for (let i = 0; i < sortedDates.length; i++) {
          const expectedDate = new Date(now)
          expectedDate.setDate(expectedDate.getDate() - i)
          if (sortedDates[i] === expectedDate.toDateString()) {
            streak++
          } else {
            break
          }
        }
        
        // Calculate total time from sessions
        const totalTime = history.reduce((acc, h) => acc + (h.duration || 5), 0)
        
        return {
          totalSessions: history.length,
          totalTime: Math.round(totalTime),
          streak,
          lastSession: history[0]?.timestamp
        }
      }
    }),
    {
      name: 'adjudicator-storage',
      partialize: (state) => ({
        settings: state.settings,
        history: state.history,
        sidebarOpen: state.sidebarOpen
      })
    }
  )
)

// Timer store for Judge Tools
export const useTimerStore = create((set, get) => ({
  mainTimer: 0,
  isMainRunning: false,
  prepA: 180,
  prepB: 180,
  isPrepARunning: false,
  isPrepBRunning: false,
  
  setMainTimer: (time) => set({ mainTimer: time }),
  setIsMainRunning: (running) => set({ isMainRunning: running }),
  setPrepA: (time) => set({ prepA: time }),
  setPrepB: (time) => set({ prepB: time }),
  setIsPrepARunning: (running) => set({ isPrepARunning: running }),
  setIsPrepBRunning: (running) => set({ isPrepBRunning: running }),
  
  toggleTimer: (timerType) => {
    const state = get()
    switch (timerType) {
      case 'main':
        set({ isMainRunning: !state.isMainRunning })
        break
      case 'prepA':
        set({ isPrepARunning: !state.isPrepARunning })
        break
      case 'prepB':
        set({ isPrepBRunning: !state.isPrepBRunning })
        break
    }
  },
  
  resetTimer: (timerType, defaultValue) => {
    switch (timerType) {
      case 'main':
        set({ mainTimer: defaultValue, isMainRunning: false })
        break
      case 'prepA':
        set({ prepA: defaultValue, isPrepARunning: false })
        break
      case 'prepB':
        set({ prepB: defaultValue, isPrepBRunning: false })
        break
    }
  },
  
  tick: () => {
    const state = get()
    const updates = {}
    
    if (state.isMainRunning && state.mainTimer > 0) {
      updates.mainTimer = state.mainTimer - 1
    }
    if (state.isPrepARunning && state.prepA > 0) {
      updates.prepA = state.prepA - 1
    }
    if (state.isPrepBRunning && state.prepB > 0) {
      updates.prepB = state.prepB - 1
    }
    
    if (Object.keys(updates).length > 0) {
      set(updates)
    }
  }
}))
