import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { useTheme, THEMES } from '../contexts/ThemeContext';

const ThemeSelector = ({ compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { theme, themeId, setTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeList = Object.values(THEMES);

  if (compact) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors text-text-secondary hover:text-white"
          title="Change theme"
        >
          <span className="text-lg">{theme.icon}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 glass-card p-2 z-50"
            >
              {themeList.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    themeId === t.id
                      ? 'bg-primary/20 text-primary'
                      : 'text-text-secondary hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{t.icon}</span>
                  <span className="flex-1 text-left text-sm font-medium">{t.name}</span>
                  {themeId === t.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-slate-800/50 hover:text-white transition-all"
      >
        <Palette className="w-5 h-5" />
        <span className="font-medium flex-1 text-left">Theme</span>
        <span className="text-lg">{theme.icon}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-1 space-y-1">
              {themeList.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    themeId === t.id
                      ? 'bg-primary/20 text-primary'
                      : 'text-text-secondary hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{t.icon}</span>
                  <span className="flex-1 text-left text-sm font-medium">{t.name}</span>
                  {themeId === t.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Theme preview card for settings
export const ThemePreviewCard = ({ themeData, isSelected, onSelect }) => {
  const colors = themeData.colors;
  
  return (
    <button
      onClick={onSelect}
      className={`relative p-4 rounded-xl border-2 transition-all ${
        isSelected 
          ? 'border-primary ring-2 ring-primary/20' 
          : 'border-transparent hover:border-slate-600'
      }`}
      style={{ backgroundColor: colors.bgSecondary }}
    >
      {/* Mini preview */}
      <div className="space-y-2">
        {/* Header bar */}
        <div 
          className="h-2 w-12 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
        
        {/* Content lines */}
        <div className="space-y-1">
          <div 
            className="h-1.5 w-full rounded-full"
            style={{ backgroundColor: colors.textPrimary, opacity: 0.3 }}
          />
          <div 
            className="h-1.5 w-3/4 rounded-full"
            style={{ backgroundColor: colors.textSecondary, opacity: 0.3 }}
          />
          <div 
            className="h-1.5 w-1/2 rounded-full"
            style={{ backgroundColor: colors.textMuted, opacity: 0.3 }}
          />
        </div>
        
        {/* Button */}
        <div 
          className="h-3 w-8 rounded"
          style={{ backgroundColor: colors.primary }}
        />
      </div>
      
      {/* Label */}
      <div className="mt-3 flex items-center justify-between">
        <span 
          className="text-sm font-medium"
          style={{ color: colors.textPrimary }}
        >
          {themeData.icon} {themeData.name}
        </span>
        {isSelected && (
          <Check className="w-4 h-4" style={{ color: colors.primary }} />
        )}
      </div>
    </button>
  );
};

export default ThemeSelector;
