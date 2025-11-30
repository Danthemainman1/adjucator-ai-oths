/**
 * Advanced Analytics Dashboard - PREMIUM POLISH
 * Beautiful data visualization with stunning animations
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Target,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Users,
  Award,
  Zap,
  ChevronRight,
  ChevronDown,
  Plus,
  Filter,
  Download,
  RefreshCw,
  Mic,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Star,
  Medal,
  Crown,
  Flame,
  X
} from 'lucide-react';
import { useAnalytics } from '../../hooks/useDebateData';
import { useAuth } from '../../contexts/AuthContext';

// Debate formats
const DEBATE_FORMATS = [
  'Public Forum', 'Lincoln-Douglas', 'Policy', 'Congress', 
  'World Schools', 'Extemp', 'Original Oratory', 'Impromptu'
];

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// ============================================
// Animated Number Counter
// ============================================
const AnimatedNumber = ({ value, duration = 1000, prefix = '', suffix = '', decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const endValue = typeof value === 'number' ? value : parseFloat(value) || 0;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = endValue * easeOutQuart;
      
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
// Progress Ring Component
// ============================================
const ProgressRing = ({
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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800"
        />
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
// Gradient Stat Card
// ============================================
const GradientStatCard = ({
  label,
  value,
  change,
  icon: Icon,
  color = 'cyan',
  subtitle
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
      <div className={`absolute -inset-1 bg-gradient-to-r ${c.bg} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`} />
      
      <div className={`relative p-6 rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} backdrop-blur-sm overflow-hidden`}>
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
// Badge Component
// ============================================
const Badge = ({ children, variant = 'default', size = 'md' }) => {
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
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </motion.span>
  );
};

// ============================================
// Skeleton Components
// ============================================
const StatCardSkeleton = () => (
  <div className="relative p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-3">
        <div className="h-4 w-24 bg-slate-800 rounded" />
        <div className="h-8 w-20 bg-slate-800 rounded" />
        <div className="h-3 w-32 bg-slate-800 rounded" />
      </div>
      <div className="w-12 h-12 bg-slate-800 rounded-xl" />
    </div>
  </div>
);

const Skeleton = ({ className = '' }) => (
  <div className={`bg-slate-800/50 rounded-xl animate-pulse ${className}`} />
);

// Empty state with beautiful illustration
const EmptyAnalytics = ({ onAddDebate }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-20"
  >
    <div className="relative inline-block mb-8">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 w-32 h-32 rounded-full bg-cyan-500/20 blur-xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        className="absolute inset-0 w-32 h-32 rounded-full bg-purple-500/20 blur-xl"
      />
      
      <motion.div
        initial={{ rotate: -10 }}
        animate={{ rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl shadow-2xl"
      >
        <BarChart3 className="w-16 h-16 text-cyan-400" />
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-6 h-6 text-amber-400" />
        </motion.div>
      </motion.div>
    </div>
    
    <h3 className="text-2xl font-bold text-white mb-3">Start Your Debate Journey</h3>
    <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
      Track your debates to unlock powerful analytics, visualize your progress, 
      and gain insights that will help you win more rounds.
    </p>
    
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onAddDebate}
      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-lg shadow-cyan-500/25 inline-flex items-center gap-3"
    >
      <Plus className="w-5 h-5" />
      Record Your First Debate
      <ChevronRight className="w-5 h-5" />
    </motion.button>
  </motion.div>
);

// Beautiful Add Debate Modal
const AddDebateModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    format: 'Public Forum',
    tournament: '',
    round: 'Round 1',
    opponent: '',
    opponentSchool: '',
    side: 'Pro',
    result: 'win',
    speakerPoints: '',
    score: '',
    topic: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      speakerPoints: formData.speakerPoints ? parseFloat(formData.speakerPoints) : null,
      score: formData.score ? parseInt(formData.score) : null
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl shadow-black/50 max-h-[90vh] overflow-hidden"
      >
        <div className="relative p-6 border-b border-slate-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                  <Trophy className="w-5 h-5 text-cyan-400" />
                </div>
                Record Debate
              </h2>
              <p className="text-slate-400 text-sm mt-1">Track your performance and build your analytics</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Format</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              >
                {DEBATE_FORMATS.map(format => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Tournament</label>
              <input
                type="text"
                value={formData.tournament}
                onChange={(e) => setFormData({ ...formData, tournament: e.target.value })}
                placeholder="e.g., Harvard Invitational"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Round</label>
              <select
                value={formData.round}
                onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              >
                {['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', 'Octofinals', 'Quarterfinals', 'Semifinals', 'Finals'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Opponent Name</label>
              <input
                type="text"
                value={formData.opponent}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                placeholder="Opponent's name"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Opponent School</label>
              <input
                type="text"
                value={formData.opponentSchool}
                onChange={(e) => setFormData({ ...formData, opponentSchool: e.target.value })}
                placeholder="School name"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Result Selection - Beautiful Cards */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-400">Result</label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData({ ...formData, result: 'win' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.result === 'win'
                    ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                }`}
              >
                <Trophy className={`w-8 h-8 mx-auto mb-2 ${formData.result === 'win' ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className={`font-semibold ${formData.result === 'win' ? 'text-emerald-400' : 'text-slate-400'}`}>Win</span>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData({ ...formData, result: 'loss' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.result === 'loss'
                    ? 'bg-red-500/20 border-red-500 shadow-lg shadow-red-500/20'
                    : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                }`}
              >
                <Target className={`w-8 h-8 mx-auto mb-2 ${formData.result === 'loss' ? 'text-red-400' : 'text-slate-500'}`} />
                <span className={`font-semibold ${formData.result === 'loss' ? 'text-red-400' : 'text-slate-400'}`}>Loss</span>
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Side</label>
              <select
                value={formData.side}
                onChange={(e) => setFormData({ ...formData, side: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              >
                <option value="Pro">Pro/Aff</option>
                <option value="Con">Con/Neg</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Speaker Points</label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="30"
                value={formData.speakerPoints}
                onChange={(e) => setFormData({ ...formData, speakerPoints: e.target.value })}
                placeholder="28.5"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Key takeaways, what worked, areas to improve..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25"
            >
              Save Debate
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Beautiful Win Rate Donut Chart
const WinRateChart = ({ wins, losses }) => {
  const total = wins + losses;
  const winRate = total > 0 ? (wins / total) * 100 : 0;
  
  return (
    <div className="flex items-center gap-8">
      <div className="relative">
        <ProgressRing 
          progress={winRate} 
          size={140} 
          strokeWidth={12} 
          color={winRate >= 50 ? 'emerald' : 'amber'}
          label="Win Rate"
        />
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-4 rounded-full border border-dashed border-slate-700/50"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-emerald-500"
            />
          </div>
          <div>
            <span className="text-2xl font-bold text-white">{wins}</span>
            <span className="text-slate-400 ml-2">Wins</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-slate-600" />
          <div>
            <span className="text-2xl font-bold text-white">{losses}</span>
            <span className="text-slate-400 ml-2">Losses</span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-800">
          <p className="text-slate-500">{total} total debates</p>
        </div>
      </div>
    </div>
  );
};

// Animated Bar Chart for Trends
const TrendChart = ({ data }) => {
  const months = Object.keys(data).sort().slice(-12);
  const values = months.map(m => {
    const stats = data[m];
    return stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
  });
  const maxValue = Math.max(...values, 100);

  if (months.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500">
        <p>Record more debates to see trends</p>
      </div>
    );
  }

  return (
    <div className="relative h-56">
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {[100, 75, 50, 25, 0].map(v => (
          <div key={v} className="flex items-center gap-2">
            <span className="text-xs text-slate-600 w-8">{v}%</span>
            <div className="flex-1 border-t border-slate-800/50 border-dashed" />
          </div>
        ))}
      </div>
      
      <div className="absolute inset-0 pt-4 pb-6 pl-10 flex items-end justify-between gap-2">
        {values.map((value, index) => (
          <div key={months[index]} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: `${(value / maxValue) * 100}%`, opacity: 1 }}
              transition={{ delay: index * 0.05, duration: 0.6, ease: 'easeOut' }}
              className="relative w-full rounded-t-lg cursor-pointer group"
              style={{
                background: value >= 50 
                  ? 'linear-gradient(to top, rgba(16, 185, 129, 0.8), rgba(6, 182, 212, 0.6))'
                  : 'linear-gradient(to top, rgba(245, 158, 11, 0.8), rgba(251, 191, 36, 0.6))',
                minHeight: '4px'
              }}
            >
              <div 
                className="absolute inset-0 rounded-t-lg blur-md opacity-50"
                style={{
                  background: value >= 50 
                    ? 'linear-gradient(to top, rgb(16, 185, 129), rgb(6, 182, 212))'
                    : 'linear-gradient(to top, rgb(245, 158, 11), rgb(251, 191, 36))'
                }}
              />
              
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                {value.toFixed(0)}% win rate
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-r border-b border-slate-700 rotate-45" />
              </div>
            </motion.div>
            <span className="text-[10px] text-slate-500 font-medium">
              {months[index].split('-')[1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Format Breakdown with animated bars
const FormatBreakdown = ({ data }) => {
  const formats = Object.entries(data);
  
  if (formats.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No format data available
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {formats.map(([format, stats], index) => {
        const winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
        const color = winRate >= 70 ? 'emerald' : winRate >= 50 ? 'cyan' : winRate >= 30 ? 'amber' : 'red';
        
        return (
          <motion.div
            key={format}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium flex items-center gap-2">
                {format}
                {winRate >= 70 && <Crown className="w-4 h-4 text-amber-400" />}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-sm">
                  {stats.wins}W - {stats.losses}L
                </span>
                <Badge variant={color === 'emerald' ? 'success' : color === 'cyan' ? 'info' : color === 'amber' ? 'warning' : 'danger'}>
                  {winRate.toFixed(0)}%
                </Badge>
              </div>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${winRate}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  background: `linear-gradient(90deg, ${
                    color === 'emerald' ? 'rgb(16, 185, 129), rgb(6, 182, 212)' :
                    color === 'cyan' ? 'rgb(6, 182, 212), rgb(99, 102, 241)' :
                    color === 'amber' ? 'rgb(245, 158, 11), rgb(251, 191, 36)' :
                    'rgb(239, 68, 68), rgb(248, 113, 113)'
                  })`
                }}
              >
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Head-to-Head Leaderboard
const HeadToHead = ({ data }) => {
  const opponents = Object.entries(data)
    .map(([name, stats]) => ({
      name,
      ...stats,
      winRate: stats.total > 0 ? (stats.wins / stats.total) * 100 : 0
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  if (opponents.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No opponent data available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {opponents.map((opponent, index) => (
        <motion.div
          key={opponent.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.01, x: 4 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/30 border border-slate-800/50 hover:border-slate-700/50 transition-all cursor-pointer group"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
            index === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            index === 1 ? 'bg-slate-400/20 text-slate-300 border border-slate-400/30' :
            index === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/30' :
            'bg-slate-800 text-slate-400'
          }`}>
            {index + 1}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate group-hover:text-cyan-400 transition-colors">
              {opponent.name}
            </p>
            <p className="text-slate-500 text-sm">{opponent.total} debates</p>
          </div>
          
          <div className="text-right">
            <p className={`text-lg font-bold ${
              opponent.winRate >= 50 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {opponent.winRate.toFixed(0)}%
            </p>
            <p className="text-slate-500 text-xs">{opponent.wins}W-{opponent.losses}L</p>
          </div>
          
          <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
        </motion.div>
      ))}
    </div>
  );
};

// Recent Debates List
const RecentDebates = ({ debates }) => (
  <div className="space-y-3">
    {debates.slice(0, 5).map((debate, index) => (
      <motion.div
        key={debate.id || index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01 }}
        className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800/50 hover:bg-slate-800/50 transition-all cursor-pointer group"
      >
        <div className={`relative w-2 h-14 rounded-full ${
          debate.result === 'win' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute inset-0 rounded-full ${
              debate.result === 'win' ? 'bg-emerald-500' : 'bg-red-500'
            } blur-sm`}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-medium">{debate.tournament || 'Practice'}</span>
            <span className="text-slate-600">•</span>
            <Badge variant="info" size="sm">{debate.format}</Badge>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            vs {debate.opponent || 'Unknown'} • {debate.round}
          </p>
        </div>
        
        <div className="text-right">
          <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
            debate.result === 'win' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : 'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}>
            {debate.result === 'win' ? '🏆 Win' : 'Loss'}
          </span>
          {debate.speakerPoints && (
            <p className="text-slate-500 text-sm mt-1">
              <Star className="w-3 h-3 inline-block text-amber-400 mr-1" />
              {debate.speakerPoints} speaks
            </p>
          )}
        </div>
      </motion.div>
    ))}
  </div>
);

// Loading Skeleton
const AnalyticsSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    <div className="grid lg:grid-cols-2 gap-6">
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
    <Skeleton className="h-80 rounded-2xl" />
  </div>
);

// Main Analytics Component
const AnalyticsDashboard = ({ apiKey }) => {
  const { user, isAuthenticated } = useAuth();
  const { analytics, loading, error, refetch, saveDebate } = useAnalytics();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeView, setActiveView] = useState('overview');

  const handleSaveDebate = async (debate) => {
    try {
      await saveDebate(debate);
    } catch (err) {
      console.error('Error saving debate:', err);
    }
  };

  const hasData = analytics && analytics.totalDebates > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-8">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
                <BarChart3 className="w-7 h-7 text-cyan-400" />
              </div>
              Analytics
              <Badge variant="info">Premium</Badge>
            </h1>
            <p className="text-slate-400 mt-2">Track your debate performance and progress</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={refetch}
              className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/25 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Record Debate
            </motion.button>
          </div>
        </motion.div>

        {/* View Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 p-1.5 bg-slate-900/50 rounded-2xl border border-slate-800/50 w-fit"
        >
          {[
            { id: 'overview', label: 'Overview', icon: PieChart },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'opponents', label: 'Head-to-Head', icon: Users },
            { id: 'formats', label: 'By Format', icon: BarChart3 }
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeView === tab.id
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {loading ? (
          <AnalyticsSkeleton />
        ) : !hasData ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 rounded-3xl border border-slate-800/60 bg-gradient-to-b from-slate-900/50 to-slate-950/50"
          >
            <EmptyAnalytics onAddDebate={() => setShowAddModal(true)} />
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Stats Overview */}
            {activeView === 'overview' && (
              <>
                <motion.div 
                  variants={itemVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  <GradientStatCard
                    label="Total Debates"
                    value={analytics.totalDebates.toString()}
                    icon={Mic}
                    color="cyan"
                  />
                  <GradientStatCard
                    label="Win Rate"
                    value={`${analytics.winRate}`}
                    change={5}
                    icon={Trophy}
                    color="emerald"
                  />
                  <GradientStatCard
                    label="Total Wins"
                    value={analytics.totalWins.toString()}
                    icon={Award}
                    color="purple"
                  />
                  <GradientStatCard
                    label="Win Streak"
                    value={analytics.currentStreak?.toString() || '0'}
                    subtitle="Current streak"
                    icon={Flame}
                    color="amber"
                  />
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <motion.div
                    variants={itemVariants}
                    className="p-6 rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/50 to-slate-950/50"
                  >
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-cyan-400" />
                      Win/Loss Ratio
                    </h3>
                    <WinRateChart wins={analytics.totalWins} losses={analytics.totalLosses} />
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="p-6 rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/50 to-slate-950/50"
                  >
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                      Performance by Format
                    </h3>
                    <FormatBreakdown data={analytics.formatStats} />
                  </motion.div>
                </div>

                <motion.div
                  variants={itemVariants}
                  className="p-6 rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/50 to-slate-950/50"
                >
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    Recent Debates
                  </h3>
                  <RecentDebates debates={analytics.recentDebates} />
                </motion.div>
              </>
            )}

            {activeView === 'trends' && (
              <motion.div
                variants={itemVariants}
                className="p-6 rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/50 to-slate-950/50"
              >
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Win Rate Trend (Last 12 Months)
                </h3>
                <TrendChart data={analytics.monthlyStats} />
              </motion.div>
            )}

            {activeView === 'opponents' && (
              <motion.div
                variants={itemVariants}
                className="p-6 rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/50 to-slate-950/50"
              >
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Head-to-Head Records
                </h3>
                <HeadToHead data={analytics.opponentStats} />
              </motion.div>
            )}

            {activeView === 'formats' && (
              <motion.div
                variants={itemVariants}
                className="grid md:grid-cols-2 gap-6"
              >
                {Object.entries(analytics.formatStats).map(([format, stats], index) => {
                  const winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
                  return (
                    <motion.div
                      key={format}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="p-6 rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/50 to-slate-950/50 hover:border-slate-700/60 transition-all"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-white font-semibold text-lg">{format}</h4>
                        <ProgressRing
                          progress={winRate}
                          size={60}
                          strokeWidth={6}
                          color={winRate >= 50 ? 'emerald' : 'amber'}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 rounded-xl bg-slate-800/30">
                          <p className="text-2xl font-bold text-white">{stats.total}</p>
                          <p className="text-slate-500 text-sm">Total</p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10">
                          <p className="text-2xl font-bold text-emerald-400">{stats.wins}</p>
                          <p className="text-slate-500 text-sm">Wins</p>
                        </div>
                        <div className="p-3 rounded-xl bg-red-500/10">
                          <p className="text-2xl font-bold text-red-400">{stats.losses}</p>
                          <p className="text-slate-500 text-sm">Losses</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {showAddModal && (
            <AddDebateModal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              onSave={handleSaveDebate}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
