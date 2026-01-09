import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme definitions - Royal / Gold-Flow
export const THEMES = {
  // Theme 1: Teal-Gold Dominance
  teal: {
    id: 'teal',
    name: 'Royal Teal',
    icon: '🔷',
    colors: {
      bgPrimary: '#faf9f6',
      bgSecondary: '#ffffff',
      textPrimary: '#08313d',
      textSecondary: '#666666',
      primary: '#0f4c5c',
      accent: '#d4af37',
      border: 'rgba(212, 175, 55, 0.3)',
    }
  },
  // Theme 2: Emerald-Gold
  emerald: {
    id: 'emerald',
    name: 'Noble Emerald',
    icon: '🌿',
    colors: {
      bgPrimary: '#fcfdfc',
      bgSecondary: '#ffffff',
      textPrimary: '#052910',
      textSecondary: '#666666',
      primary: '#10451d',
      accent: '#d4af37',
      border: 'rgba(212, 175, 55, 0.3)',
    }
  },
  // Theme 3: Red-Gold
  red: {
    id: 'red',
    name: 'Imperial Red',
    icon: '👑',
    colors: {
      bgPrimary: '#fdfcfc',
      bgSecondary: '#ffffff',
      textPrimary: '#5c0f0f',
      textSecondary: '#666666',
      primary: '#8a1c1c',
      accent: '#d4af37',
      border: 'rgba(212, 175, 55, 0.3)',
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
