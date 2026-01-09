import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme definitions - Sophisticated / Distinguished Palette
export const THEMES = {
  light: {
    id: 'light',
    name: 'Atelier',
    icon: '🏛️',
    colors: {
      bgPrimary: '#F9F8F4', // Bone
      bgSecondary: '#FFFFFF',
      bgTertiary: '#E5E4DE', // Greige
      textPrimary: '#282C35', // Anthracite
      textSecondary: '#8C847E', // Taupe
      textMuted: '#8E9BAC', // Pewter
      
      primary: '#0A1128', // Midnight Navy
      primaryHover: '#1F4F59', // Petrol Blue
      accent: '#C06C54', // Terracotta
      
      border: '#E5E4DE', // Greige
      glass: 'rgba(255, 255, 255, 0.95)',
      cardBg: '#FFFFFF',
      
      success: '#40826D', // Verdigris
      warning: '#D69E2E', // Ochre
      error: '#4A0404', // Oxblood
    }
  },
  dark: {
    id: 'dark',
    name: 'Midnight',
    icon: '🕯️',
    colors: {
      bgPrimary: '#0A1128', // Midnight Navy
      bgSecondary: '#152238', // Slightly lighter navy
      bgTertiary: '#1F4F59', // Petrol Blue
      textPrimary: '#F9F8F4', // Bone
      textSecondary: '#8E9BAC', // Pewter
      textMuted: '#5B6C86', // Slate Blue
      
      primary: '#B2D3C2', // Celadon (Light Contrast)
      primaryHover: '#9CAF88', // Sage
      accent: '#D69E2E', // Ochre
      
      border: '#1F4F59', // Petrol Blue
      glass: 'rgba(10, 17, 40, 0.9)',
      cardBg: '#152238',
      
      success: '#9CAF88', // Sage
      warning: '#D69E2E', // Ochre
      error: '#9A463D', // Cognac
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
