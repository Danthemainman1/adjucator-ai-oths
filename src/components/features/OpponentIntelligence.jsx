/**
 * Opponent Intelligence System - PREMIUM POLISH
 * Beautiful opponent tracking with threat analysis
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Zap,
  Brain,
  Search,
  Plus,
  Filter,
  ChevronRight,
  ChevronDown,
  X,
  Star,
  Sword,
  Eye,
  FileText,
  Clock,
  Trophy,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Crown,
  Flame,
  BarChart3
} from 'lucide-react';
import { useOpponents } from '../../hooks/useDebateData';
import { useAuth } from '../../contexts/AuthContext';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

// Threat Level Configuration
const THREAT_LEVELS = {
  high: {
    label: 'High Threat',
    color: 'red',
    bgClass: 'bg-red-500/10 border-red-500/30',
    textClass: 'text-red-400',
    icon: AlertTriangle,
    glow: 'shadow-red-500/20'
  },
  medium: {
    label: 'Medium Threat',
    color: 'amber',
    bgClass: 'bg-amber-500/10 border-amber-500/30',
    textClass: 'text-amber-400',
    icon: AlertCircle,
    glow: 'shadow-amber-500/20'
  },
  low: {
    label: 'Low Threat',
    color: 'emerald',
    bgClass: 'bg-emerald-500/10 border-emerald-500/30',
    textClass: 'text-emerald-400',
    icon: CheckCircle2,
    glow: 'shadow-emerald-500/20'
  }
};

// Empty State
const EmptyOpponents = ({ onAdd }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-20"
  >
    <div className="relative inline-block mb-8">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 w-32 h-32 rounded-full bg-red-500/20 blur-xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        className="absolute inset-0 w-32 h-32 rounded-full bg-amber-500/20 blur-xl"
      />
      
      <motion.div
        animate={{ rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl shadow-2xl"
      >
        <Target className="w-16 h-16 text-red-400" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 -right-2"
        >
          <Eye className="w-6 h-6 text-amber-400" />
        </motion.div>
      </motion.div>
    </div>
    
    <h3 className="text-2xl font-bold text-white mb-3">Know Your Competition</h3>
    <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
      Track opponents, analyze their strategies, and prepare winning counter-arguments. 
      Intelligence wins debates.
    </p>
    
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onAdd}
      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold text-lg shadow-lg shadow-red-500/25 inline-flex items-center gap-3"
    >
      <Plus className="w-5 h-5" />
      Add First Opponent
      <ChevronRight className="w-5 h-5" />
    </motion.button>
  </motion.div>
);

// Threat Badge Component
const ThreatBadge = ({ level, size = 'md', pulse = false }) => {
  const config = THREAT_LEVELS[level] || THREAT_LEVELS.medium;
  const Icon = config.icon;
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2'
  };

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center font-semibold rounded-full border ${config.bgClass} ${config.textClass} ${sizes[size]} ${pulse ? 'animate-pulse' : ''}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      {config.label}
    </motion.span>
  );
};

// Win Rate Ring
const WinRateRing = ({ winRate, size = 60 }) => {
  const radius = (size - 6) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (winRate / 100) * circumference;
  const color = winRate >= 50 ? '#ef4444' : '#10b981';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-slate-800"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-bold ${winRate >= 50 ? 'text-red-400' : 'text-emerald-400'}`}>
          {winRate}%
        </span>
      </div>
    </div>
  );
};

// Opponent Card Component
const OpponentCard = ({ opponent, onClick, isSelected }) => {
  const threatConfig = THREAT_LEVELS[opponent.threatLevel] || THREAT_LEVELS.medium;
  const winRate = opponent.debates?.total > 0 
    ? Math.round((opponent.debates.wins / opponent.debates.total) * 100) 
    : 0;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative group cursor-pointer ${isSelected ? 'ring-2 ring-cyan-500' : ''}`}
    >
      {/* Glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${
        opponent.threatLevel === 'high' ? 'from-red-500/20 to-orange-500/20' :
        opponent.threatLevel === 'medium' ? 'from-amber-500/20 to-yellow-500/20' :
        'from-emerald-500/20 to-teal-500/20'
      } rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`} />
      
      <div className="relative p-5 rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm hover:border-slate-700/60 transition-all overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative flex items-start gap-4">
          {/* Avatar with threat indicator */}
          <div className="relative">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
              opponent.threatLevel === 'high' ? 'from-red-500/30 to-orange-600/30' :
              opponent.threatLevel === 'medium' ? 'from-amber-500/30 to-yellow-600/30' :
              'from-emerald-500/30 to-teal-600/30'
            } flex items-center justify-center text-2xl font-bold text-white border ${threatConfig.bgClass}`}>
              {opponent.name?.[0]?.toUpperCase() || '?'}
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                opponent.threatLevel === 'high' ? 'bg-red-500' :
                opponent.threatLevel === 'medium' ? 'bg-amber-500' :
                'bg-emerald-500'
              } border-2 border-slate-900`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-white font-semibold text-lg truncate group-hover:text-cyan-400 transition-colors">
                  {opponent.name}
                </h3>
                <p className="text-slate-500 text-sm">{opponent.school || 'Unknown School'}</p>
              </div>
              <ThreatBadge level={opponent.threatLevel} size="sm" />
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                <Sword className="w-4 h-4" />
                <span>{opponent.debates?.total || 0} debates</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Trophy className={winRate >= 50 ? 'w-4 h-4 text-red-400' : 'w-4 h-4 text-emerald-400'} />
                <span className={winRate >= 50 ? 'text-red-400' : 'text-emerald-400'}>
                  {opponent.debates?.wins || 0}W - {opponent.debates?.losses || 0}L
                </span>
              </div>
            </div>

            {/* Strengths/Weaknesses preview */}
            {(opponent.strengths?.length > 0 || opponent.weaknesses?.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {opponent.strengths?.slice(0, 2).map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/20">
                    💪 {s}
                  </span>
                ))}
                {opponent.weaknesses?.slice(0, 2).map((w, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    🎯 {w}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Win rate indicator */}
          <div className="hidden sm:block">
            <WinRateRing winRate={winRate} />
          </div>
        </div>

        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );
};

// Opponent Detail Panel
const OpponentDetailPanel = ({ opponent, onClose, onGenerateStrategy }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!opponent) return null;

  const threatConfig = THREAT_LEVELS[opponent.threatLevel] || THREAT_LEVELS.medium;
  const winRate = opponent.debates?.total > 0 
    ? Math.round((opponent.debates.wins / opponent.debates.total) * 100) 
    : 0;

  const handleGenerateStrategy = async () => {
    setIsGenerating(true);
    await onGenerateStrategy?.(opponent);
    setIsGenerating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="h-full overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="relative p-6 border-b border-slate-800 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${
          opponent.threatLevel === 'high' ? 'from-red-500/10 via-transparent to-orange-500/5' :
          opponent.threatLevel === 'medium' ? 'from-amber-500/10 via-transparent to-yellow-500/5' :
          'from-emerald-500/10 via-transparent to-teal-500/5'
        }`} />
        
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
              opponent.threatLevel === 'high' ? 'from-red-500/30 to-orange-600/30' :
              opponent.threatLevel === 'medium' ? 'from-amber-500/30 to-yellow-600/30' :
              'from-emerald-500/30 to-teal-600/30'
            } flex items-center justify-center text-3xl font-bold text-white border ${threatConfig.bgClass}`}>
              {opponent.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{opponent.name}</h2>
              <p className="text-slate-400">{opponent.school || 'Unknown School'}</p>
              <ThreatBadge level={opponent.threatLevel} size="md" />
            </div>
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

      {/* Tabs */}
      <div className="flex items-center gap-2 p-4 border-b border-slate-800/50">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'history', label: 'History', icon: Clock },
          { id: 'strategy', label: 'Strategy', icon: Brain }
        ].map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(100%-200px)] space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800/50 text-center">
                <p className="text-3xl font-bold text-white">{opponent.debates?.total || 0}</p>
                <p className="text-slate-500 text-sm">Total Debates</p>
              </div>
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-3xl font-bold text-red-400">{opponent.debates?.wins || 0}</p>
                <p className="text-slate-500 text-sm">Your Losses</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-3xl font-bold text-emerald-400">{opponent.debates?.losses || 0}</p>
                <p className="text-slate-500 text-sm">Your Wins</p>
              </div>
            </div>

            {/* Strengths */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Opponent Strengths
              </h3>
              <div className="space-y-2">
                {opponent.strengths?.length > 0 ? (
                  opponent.strengths.map((strength, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-slate-300">{strength}</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-slate-500 italic">No strengths recorded yet</p>
                )}
              </div>
            </div>

            {/* Weaknesses */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Opponent Weaknesses
              </h3>
              <div className="space-y-2">
                {opponent.weaknesses?.length > 0 ? (
                  opponent.weaknesses.map((weakness, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-slate-300">{weakness}</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-slate-500 italic">No weaknesses recorded yet</p>
                )}
              </div>
            </div>

            {/* Common Arguments */}
            {opponent.commonArguments?.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Common Arguments
                </h3>
                <div className="flex flex-wrap gap-2">
                  {opponent.commonArguments.map((arg, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {arg}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {opponent.debateHistory?.length > 0 ? (
              opponent.debateHistory.map((debate, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800/50"
                >
                  <div className={`w-2 h-12 rounded-full ${
                    debate.result === 'win' ? 'bg-emerald-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-white font-medium">{debate.tournament}</p>
                    <p className="text-slate-500 text-sm">{debate.round} • {debate.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    debate.result === 'win'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {debate.result === 'win' ? 'Won' : 'Lost'}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">No debate history recorded</p>
            )}
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateStrategy}
              disabled={isGenerating}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/25 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Generating AI Strategy...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Generate AI Counter-Strategy
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {opponent.counterStrategies?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Counter-Strategies
                </h3>
                {opponent.counterStrategies.map((strategy, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20"
                  >
                    <p className="text-slate-300">{strategy}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Add Opponent Modal
const AddOpponentModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    threatLevel: 'medium',
    strengths: '',
    weaknesses: '',
    commonArguments: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      strengths: formData.strengths.split(',').map(s => s.trim()).filter(Boolean),
      weaknesses: formData.weaknesses.split(',').map(s => s.trim()).filter(Boolean),
      commonArguments: formData.commonArguments.split(',').map(s => s.trim()).filter(Boolean),
      debates: { total: 0, wins: 0, losses: 0 }
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
        className="w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="relative p-6 border-b border-slate-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-amber-500/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30">
                  <Target className="w-5 h-5 text-red-400" />
                </div>
                Add Opponent
              </h2>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">School</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Threat Level</label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(THREAT_LEVELS).map(([level, config]) => (
                <motion.button
                  key={level}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, threatLevel: level })}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    formData.threatLevel === level
                      ? `${config.bgClass} border-current ${config.textClass}`
                      : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <config.icon className={`w-6 h-6 mx-auto mb-1 ${formData.threatLevel === level ? config.textClass : ''}`} />
                  <span className="text-sm font-medium">{config.label.split(' ')[0]}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Strengths (comma-separated)</label>
            <input
              type="text"
              value={formData.strengths}
              onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
              placeholder="e.g., Strong rebuttals, Fast speaking, Good evidence"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Weaknesses (comma-separated)</label>
            <input
              type="text"
              value={formData.weaknesses}
              onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
              placeholder="e.g., Weak on CX, Poor time management"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional observations..."
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
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold shadow-lg shadow-red-500/25"
            >
              Add Opponent
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Main Component
const OpponentIntelligence = ({ apiKey }) => {
  const { user } = useAuth();
  const { opponents, loading, saveOpponent, generateCounterStrategy } = useOpponents();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterThreat, setFilterThreat] = useState('all');

  const filteredOpponents = useMemo(() => {
    return (opponents || []).filter(opponent => {
      const matchesSearch = opponent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          opponent.school?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesThreat = filterThreat === 'all' || opponent.threatLevel === filterThreat;
      return matchesSearch && matchesThreat;
    });
  }, [opponents, searchQuery, filterThreat]);

  const handleSaveOpponent = async (opponentData) => {
    await saveOpponent(opponentData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-600/20 border border-red-500/30">
                <Target className="w-7 h-7 text-red-400" />
              </div>
              Opponent Intelligence
            </h1>
            <p className="text-slate-400 mt-2">Track, analyze, and prepare for your competition</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-medium shadow-lg shadow-red-500/25 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Opponent
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opponents..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800/50">
            {[
              { id: 'all', label: 'All' },
              { id: 'high', label: 'High', color: 'text-red-400' },
              { id: 'medium', label: 'Medium', color: 'text-amber-400' },
              { id: 'low', label: 'Low', color: 'text-emerald-400' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setFilterThreat(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterThreat === filter.id
                    ? 'bg-slate-800 text-white'
                    : `text-slate-400 hover:text-white ${filter.color || ''}`
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-800" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-32 bg-slate-800 rounded" />
                    <div className="h-4 w-24 bg-slate-800 rounded" />
                    <div className="h-3 w-full bg-slate-800 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOpponents.length === 0 ? (
          <div className="p-8 rounded-3xl border border-slate-800/60 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
            <EmptyOpponents onAdd={() => setShowAddModal(true)} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Opponent List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`${selectedOpponent ? 'lg:col-span-3' : 'lg:col-span-5'} space-y-4`}
            >
              <div className={`grid ${selectedOpponent ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
                {filteredOpponents.map(opponent => (
                  <OpponentCard
                    key={opponent.id}
                    opponent={opponent}
                    onClick={() => setSelectedOpponent(opponent)}
                    isSelected={selectedOpponent?.id === opponent.id}
                  />
                ))}
              </div>
            </motion.div>

            {/* Detail Panel */}
            <AnimatePresence>
              {selectedOpponent && (
                <div className="lg:col-span-2">
                  <OpponentDetailPanel
                    opponent={selectedOpponent}
                    onClose={() => setSelectedOpponent(null)}
                    onGenerateStrategy={generateCounterStrategy}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddOpponentModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSave={handleSaveOpponent}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OpponentIntelligence;
