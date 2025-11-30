/**
 * Shared UI Components - Premium Enterprise Polish
 * Reusable components with stunning visuals and micro-interactions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

// ============================================
// Loading States & Skeletons
// ============================================

export const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-slate-800/50',
    light: 'bg-slate-700/30',
    card: 'bg-slate-800/30'
  };

  return (
    <div className={`animate-pulse rounded-xl ${variants[variant]} ${className}`}>
      <div className="relative overflow-hidden h-full w-full">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-700/20 to-transparent" />
      </div>
    </div>
  );
};

export const CardSkeleton = ({ lines = 3 }) => (
  <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={`h-3 w-${['full', '5/6', '4/5'][i % 3]}`} />
    ))}
  </div>
);

export const StatCardSkeleton = () => (
  <div className="relative p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30">
    <div className="flex items-start justify-between">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="w-12 h-12 rounded-xl" />
    </div>
  </div>
);

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className={`${sizes[size]} border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
        </div>
      </div>
      {text && <p className="text-slate-400 text-sm animate-pulse">{text}</p>}
    </div>
  );
};

export const LoadingDots = () => (
  <span className="inline-flex gap-1">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </span>
);

// ============================================
// Empty States
// ============================================

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  variant = 'default'
}) => {
  const variants = {
    default: { icon: 'text-slate-500', bg: 'bg-slate-800/50 border-slate-700/50' },
    success: { icon: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    warning: { icon: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30' },
    info: { icon: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/30' }
  };

  const v = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className={`p-5 rounded-2xl ${v.bg} border mb-6 mx-auto w-fit`}
      >
        <Icon className={`w-12 h-12 ${v.icon}`} />
      </motion.div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 max-w-md mx-auto mb-6">{description}</p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all inline-flex items-center gap-2"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

// ============================================
// Animated Number Counter
// ============================================

export const AnimatedNumber = ({ value, duration = 1000, prefix = '', suffix = '', decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = typeof value === 'number' ? value : parseFloat(value) || 0;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};

// ============================================
// Progress Ring
// ============================================

export const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'cyan',
  showValue = true,
  label,
  animate = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colors = {
    cyan: { stroke: '#06b6d4', glow: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))' },
    emerald: { stroke: '#10b981', glow: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))' },
    purple: { stroke: '#a855f7', glow: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))' },
    amber: { stroke: '#f59e0b', glow: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))' },
    red: { stroke: '#ef4444', glow: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))' }
  };

  const c = colors[color] || colors.cyan;

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={c.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ filter: c.glow }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">
            <AnimatedNumber value={progress} suffix="%" />
          </span>
          {label && <span className="text-xs text-slate-400">{label}</span>}
        </div>
      )}
    </div>
  );
};

// ============================================
// Gradient Cards
// ============================================

export const GradientCard = ({
  children,
  gradient = 'cyan',
  className = '',
  hover = true,
  glow = false
}) => {
  const gradients = {
    cyan: 'from-cyan-500/10 via-transparent to-blue-500/5',
    purple: 'from-purple-500/10 via-transparent to-pink-500/5',
    emerald: 'from-emerald-500/10 via-transparent to-teal-500/5',
    amber: 'from-amber-500/10 via-transparent to-orange-500/5',
    red: 'from-red-500/10 via-transparent to-rose-500/5'
  };

  const glows = {
    cyan: 'shadow-cyan-500/5',
    purple: 'shadow-purple-500/5',
    emerald: 'shadow-emerald-500/5',
    amber: 'shadow-amber-500/5',
    red: 'shadow-red-500/5'
  };

  return (
    <motion.div
      whileHover={hover ? { scale: 1.01, y: -2 } : {}}
      className={`relative group ${className}`}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[gradient]} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Glow effect */}
      {glow && (
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradients[gradient]} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
      )}
      
      {/* Main card */}
      <div className={`relative p-6 rounded-2xl border border-slate-800/60 bg-slate-900/50 backdrop-blur-sm ${hover ? 'hover:border-slate-700/80' : ''} transition-all duration-300 ${glow ? `shadow-2xl ${glows[gradient]}` : ''}`}>
        {children}
      </div>
    </motion.div>
  );
};

// ============================================
// Stat Card with Gradient
// ============================================

export const GradientStatCard = ({
  label,
  value,
  change,
  icon: Icon,
  color = 'cyan',
  subtitle,
  trend
}) => {
  const isPositive = change > 0;
  const isNeutral = change === 0 || change === undefined;

  const colors = {
    cyan: { bg: 'from-cyan-500/20 to-cyan-600/5', border: 'border-cyan-500/20', icon: 'text-cyan-400', iconBg: 'bg-cyan-500/10' },
    emerald: { bg: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/20', icon: 'text-emerald-400', iconBg: 'bg-emerald-500/10' },
    purple: { bg: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/20', icon: 'text-purple-400', iconBg: 'bg-purple-500/10' },
    amber: { bg: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/20', icon: 'text-amber-400', iconBg: 'bg-amber-500/10' },
    red: { bg: 'from-red-500/20 to-red-600/5', border: 'border-red-500/20', icon: 'text-red-400', iconBg: 'bg-red-500/10' }
  };

  const c = colors[color] || colors.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative group cursor-default"
    >
      {/* Glow effect on hover */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${c.bg} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`} />
      
      <div className={`relative p-6 rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} backdrop-blur-sm overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-400 font-medium mb-1">{label}</p>
            <p className="text-3xl font-bold text-white tracking-tight">
              <AnimatedNumber value={parseFloat(value) || 0} decimals={value.toString().includes('.') ? 1 : 0} />
              {value.toString().includes('%') && '%'}
            </p>
            {change !== undefined && (
              <div className={`flex items-center gap-1.5 mt-2 text-sm font-medium ${
                isNeutral ? 'text-slate-500' : isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {!isNeutral && (
                  <motion.div
                    initial={{ rotate: isPositive ? -45 : 45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {isPositive ? '↑' : '↓'}
                  </motion.div>
                )}
                <span>{isNeutral ? 'No change' : `${Math.abs(change)}%`}</span>
                <span className="text-slate-500">vs last month</span>
              </div>
            )}
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
          
          <motion.div
            whileHover={{ rotate: 5, scale: 1.1 }}
            className={`p-3 rounded-xl ${c.iconBg} border ${c.border}`}
          >
            <Icon className={`w-6 h-6 ${c.icon}`} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// Toast Notifications
// ============================================

export const Toast = ({ type = 'success', message, onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const types = {
    success: { icon: CheckCircle2, bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400' },
    error: { icon: AlertCircle, bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-400' },
    info: { icon: Sparkles, bg: 'bg-cyan-500/10 border-cyan-500/30', text: 'text-cyan-400' }
  };

  const t = types[type] || types.info;
  const Icon = t.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50, scale: isVisible ? 1 : 0.9 }}
      className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl ${t.bg} border backdrop-blur-xl shadow-2xl flex items-center gap-3 z-[100]`}
    >
      <Icon className={`w-5 h-5 ${t.text}`} />
      <span className="text-white text-sm font-medium">{message}</span>
    </motion.div>
  );
};

// ============================================
// Animated Badges
// ============================================

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  pulse = false,
  icon: Icon
}) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/10 text-red-400 border-red-500/30',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${pulse ? 'animate-pulse' : ''}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </motion.span>
  );
};

// ============================================
// Animated Tag Pills
// ============================================

export const TagPill = ({ label, color = 'slate', onRemove, onClick }) => {
  const colors = {
    slate: 'bg-slate-800 text-slate-300 hover:bg-slate-700',
    cyan: 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20',
    red: 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
  };

  return (
    <motion.span
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${colors[color]} transition-colors cursor-pointer`}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-white transition-colors"
        >
          ×
        </button>
      )}
    </motion.span>
  );
};

// ============================================
// Star Rating
// ============================================

export const StarRating = ({ rating, maxRating = 5, size = 'md', onChange, readonly = true }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = (hoverRating || rating) > i;
        return (
          <motion.button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(i + 1)}
            onMouseEnter={() => !readonly && setHoverRating(i + 1)}
            onMouseLeave={() => setHoverRating(0)}
            whileHover={!readonly ? { scale: 1.2 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <svg
              className={`${sizes[size]} ${
                filled ? 'text-amber-400' : 'text-slate-700'
              } transition-colors`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </motion.button>
        );
      })}
    </div>
  );
};

// ============================================
// Page Transition Wrapper
// ============================================

export const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// ============================================
// Animated Counter Badge
// ============================================

export const CounterBadge = ({ count, max = 99 }) => (
  <motion.span
    key={count}
    initial={{ scale: 1.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-xs font-bold bg-red-500 text-white rounded-full"
  >
    {count > max ? `${max}+` : count}
  </motion.span>
);

// ============================================
// Shimmer Animation CSS (add to globals.css)
// ============================================
// @keyframes shimmer {
//   100% { transform: translateX(100%); }
// }

export default {
  Skeleton,
  CardSkeleton,
  StatCardSkeleton,
  LoadingSpinner,
  LoadingDots,
  EmptyState,
  AnimatedNumber,
  ProgressRing,
  GradientCard,
  GradientStatCard,
  Toast,
  Badge,
  TagPill,
  StarRating,
  PageTransition,
  CounterBadge
};
