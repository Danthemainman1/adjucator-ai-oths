import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme definitions - carefully crafted for harmony
export const THEMES = {
  dark: {
    id: 'dark',
    name: 'Dark',
    icon: '🌙',
    colors: {
      bgPrimary: '#020617',
      bgSecondary: '#0f172a',
      bgTertiary: '#1e293b',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      primary: '#06b6d4',
      primaryHover: '#22d3ee',
      accent: '#a855f7',
      border: 'rgba(51, 65, 85, 0.5)',
      glass: 'rgba(15, 23, 42, 0.8)',
      cardBg: 'rgba(15, 23, 42, 0.5)',
      inputBg: '#020617',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    }
  },
  light: {
    id: 'light',
    name: 'Light',
    icon: '☀️',
    colors: {
      bgPrimary: '#f8fafc',
      bgSecondary: '#f1f5f9',
      bgTertiary: '#e2e8f0',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
      primary: '#0891b2',
      primaryHover: '#06b6d4',
      accent: '#9333ea',
      border: 'rgba(148, 163, 184, 0.3)',
      glass: 'rgba(255, 255, 255, 0.9)',
      cardBg: 'rgba(255, 255, 255, 0.7)',
      inputBg: '#ffffff',
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
    }
  },
  highContrast: {
    id: 'highContrast',
    name: 'High Contrast',
    icon: '◐',
    colors: {
      bgPrimary: '#000000',
      bgSecondary: '#0a0a0a',
      bgTertiary: '#171717',
      textPrimary: '#ffffff',
      textSecondary: '#e5e5e5',
      textMuted: '#a3a3a3',
      primary: '#00d4ff',
      primaryHover: '#5eead4',
      accent: '#c084fc',
      border: 'rgba(255, 255, 255, 0.3)',
      glass: 'rgba(0, 0, 0, 0.95)',
      cardBg: 'rgba(23, 23, 23, 0.9)',
      inputBg: '#000000',
      success: '#4ade80',
      warning: '#fbbf24',
      error: '#f87171',
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    icon: '🌊',
    colors: {
      bgPrimary: '#0c1929',
      bgSecondary: '#132f4c',
      bgTertiary: '#1a3a5c',
      textPrimary: '#e3f2fd',
      textSecondary: '#90caf9',
      textMuted: '#64b5f6',
      primary: '#29b6f6',
      primaryHover: '#4fc3f7',
      accent: '#7c4dff',
      border: 'rgba(41, 182, 246, 0.2)',
      glass: 'rgba(19, 47, 76, 0.85)',
      cardBg: 'rgba(19, 47, 76, 0.6)',
      inputBg: '#0c1929',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    icon: '🌅',
    colors: {
      bgPrimary: '#1a0a0a',
      bgSecondary: '#2d1515',
      bgTertiary: '#3d1f1f',
      textPrimary: '#fef3f2',
      textSecondary: '#fca5a5',
      textMuted: '#f87171',
      primary: '#f97316',
      primaryHover: '#fb923c',
      accent: '#ec4899',
      border: 'rgba(249, 115, 22, 0.2)',
      glass: 'rgba(45, 21, 21, 0.85)',
      cardBg: 'rgba(45, 21, 21, 0.6)',
      inputBg: '#1a0a0a',
      success: '#84cc16',
      warning: '#eab308',
      error: '#ef4444',
    }
  }
};

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const theme = THEMES[themeId] || THEMES.dark;

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const colors = theme.colors;

    // Apply CSS custom properties
    root.style.setProperty('--bg-primary', colors.bgPrimary);
    root.style.setProperty('--bg-secondary', colors.bgSecondary);
    root.style.setProperty('--bg-tertiary', colors.bgTertiary);
    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--text-muted', colors.textMuted);
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-hover', colors.primaryHover);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--glass', colors.glass);
    root.style.setProperty('--card-bg', colors.cardBg);
    root.style.setProperty('--input-bg', colors.inputBg);
    root.style.setProperty('--success', colors.success);
    root.style.setProperty('--warning', colors.warning);
    root.style.setProperty('--error', colors.error);

    // Add theme class for additional styling
    root.className = `theme-${themeId}`;
    
    // Save to localStorage
    localStorage.setItem('theme', themeId);
  }, [themeId, theme]);

  const setTheme = (id) => {
    if (THEMES[id]) {
      setThemeId(id);
    }
  };

  const cycleTheme = () => {
    const themeIds = Object.keys(THEMES);
    const currentIndex = themeIds.indexOf(themeId);
    const nextIndex = (currentIndex + 1) % themeIds.length;
    setThemeId(themeIds[nextIndex]);
  };

  const value = {
    theme,
    themeId,
    setTheme,
    cycleTheme,
    themes: THEMES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
