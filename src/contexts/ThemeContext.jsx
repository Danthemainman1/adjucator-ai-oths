import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme definitions - Scholarly / Editorial Design
export const THEMES = {
  light: {
    id: 'light',
    name: 'Paper',
    icon: '📜',
    colors: {
      bgPrimary: '#F9F9F7',
      bgSecondary: '#FFFFFF',
      bgTertiary: '#F0F0F0',
      textPrimary: '#1A1A1A',
      textSecondary: '#4A4A4A',
      textMuted: '#717171',
      primary: '#002147', // Oxford Blue
      primaryHover: '#243b53',
      accent: '#800020', // Burgundy
      border: '#E5E5E5',
      glass: 'rgba(255, 255, 255, 0.95)',
      cardBg: '#FFFFFF',
      inputBg: '#FFFFFF',
      success: '#355E3B',
      warning: '#C5A059',
      error: '#800020',
    }
  },
  dark: {
    id: 'dark',
    name: 'Dark Academia',
    icon: '🕯️',
    colors: {
      bgPrimary: '#1A1A1A',
      bgSecondary: '#242424',
      bgTertiary: '#2D2D2D',
      textPrimary: '#EAEAEA',
      textSecondary: '#B0B0B0',
      textMuted: '#717171',
      primary: '#486581',
      primaryHover: '#627d98',
      accent: '#C5A059', // Muted Gold
      border: '#333333',
      glass: 'rgba(26, 26, 26, 0.95)',
      cardBg: '#242424',
      inputBg: '#1A1A1A',
      success: '#4A7A53',
      warning: '#C5A059',
      error: '#A34040',
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
