import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelector = ({ compact = false }) => {
  const { themeId, setTheme } = useTheme();
  const isDark = themeId === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-sm transition-colors hover:bg-black/5"
        style={{ color: 'var(--text-secondary)' }}
        title={isDark ? 'Switch to Paper mode' : 'Switch to Scholar mode'}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </motion.div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-all hover:bg-black/5"
      style={{ color: 'var(--text-secondary)' }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </motion.div>
      <span className="font-sans text-sm tracking-wide uppercase font-medium flex-1 text-left">{isDark ? 'Dark Academia' : 'Paper Mode'}</span>
    </button>
  );
};

export default ThemeSelector;
