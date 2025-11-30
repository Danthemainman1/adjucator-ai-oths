import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme definitions - Dark and Light only with proper contrast
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
      bgPrimary: '#ffffff',
      bgSecondary: '#f8fafc',
      bgTertiary: '#e2e8f0',
      textPrimary: '#0f172a',
      textSecondary: '#334155',
      textMuted: '#64748b',
      primary: '#0891b2',
      primaryHover: '#0e7490',
      accent: '#7c3aed',
      border: 'rgba(15, 23, 42, 0.15)',
      glass: 'rgba(255, 255, 255, 0.95)',
      cardBg: 'rgba(248, 250, 252, 0.9)',
      inputBg: '#ffffff',
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
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
