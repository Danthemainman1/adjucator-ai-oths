/**
 * Advanced Analytics Dashboard
 * Comprehensive debate performance tracking & visualization
 */

import React, { useState, useMemo } from 'react';
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
  Minus
} from 'lucide-react';
import { useAnalytics } from '../../hooks/useDebateData';
import { useAuth } from '../../contexts/AuthContext';

// Debate formats
const DEBATE_FORMATS = [
  'Public Forum', 'Lincoln-Douglas', 'Policy', 'Congress', 
  'World Schools', 'Extemp', 'Original Oratory', 'Impromptu'
];

// Empty state component
const EmptyAnalytics = ({ onAddDebate }) => (
  <div className="text-center py-16">
    <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6 mx-auto w-fit">
      <BarChart3 className="w-12 h-12 text-slate-500" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">No Debate Records Yet</h3>
    <p className="text-slate-400 max-w-md mx-auto mb-6">
      Start tracking your debates to see comprehensive analytics, win rates, and performance trends.
    </p>
    <button
      onClick={onAddDebate}
      className="px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium hover:bg-cyan-500/20 transition-all inline-flex items-center gap-2"
    >
      <Plus className="w-5 h-5" />
      Record Your First Debate
    </button>
  </div>
);

// Add Debate Modal
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Record Debate</h2>
          <p className="text-slate-400 text-sm mt-1">Track your performance and build your analytics</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Format</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              >
                {DEBATE_FORMATS.map(format => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Tournament</label>
              <input
                type="text"
                value={formData.tournament}
                onChange={(e) => setFormData({ ...formData, tournament: e.target.value })}
                placeholder="e.g., Harvard Invitational"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Round</label>
              <select
                value={formData.round}
                onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              >
                {['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', 'Octofinals', 'Quarterfinals', 'Semifinals', 'Finals'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Opponent Name</label>
              <input
                type="text"
                value={formData.opponent}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                placeholder="Opponent's name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Opponent School</label>
              <input
                type="text"
                value={formData.opponentSchool}
                onChange={(e) => setFormData({ ...formData, opponentSchool: e.target.value })}
                placeholder="School name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Side</label>
              <select
                value={formData.side}
                onChange={(e) => setFormData({ ...formData, side: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              >
                <option value="Pro">Pro/Aff</option>
                <option value="Con">Con/Neg</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Result</label>
              <select
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              >
                <option value="win">Win</option>
                <option value="loss">Loss</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Speaker Points</label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="30"
                value={formData.speakerPoints}
                onChange={(e) => setFormData({ ...formData, speakerPoints: e.target.value })}
                placeholder="28.5"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Topic/Resolution</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="The debate resolution..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Key takeaways, what worked, areas to improve..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors"
            >
              Save Debate
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, change, icon: Icon, color, subtitle }) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl" />
      <div className="relative p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm hover:border-slate-700/60 transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">{label}</p>
            <p className="text-3xl font-bold text-white mt-2 tracking-tight">{value}</p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${
                isNeutral ? 'text-slate-500' : isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {isNeutral ? (
                  <Minus className="w-4 h-4" />
                ) : isPositive ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>{isNeutral ? 'No change' : `${Math.abs(change)}%`}</span>
                <span className="text-slate-500 ml-1">vs last month</span>
              </div>
            )}
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
            <Icon className={`w-6 h-6 text-${color}-400`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Win Rate Chart
const WinRateChart = ({ data }) => {
  const total = data.wins + data.losses;
  const winRate = total > 0 ? (data.wins / total) * 100 : 0;
  
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-slate-800"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${winRate * 2.51} 251`}
            className="text-cyan-500"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{winRate.toFixed(0)}%</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500" />
          <span className="text-slate-300">{data.wins} Wins</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-700" />
          <span className="text-slate-300">{data.losses} Losses</span>
        </div>
        <p className="text-sm text-slate-500 mt-2">{total} total debates</p>
      </div>
    </div>
  );
};

// Performance Trend Chart
const PerformanceTrendChart = ({ data }) => {
  const months = Object.keys(data).sort().slice(-12);
  const values = months.map(m => {
    const stats = data[m];
    return stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
  });
  const maxValue = Math.max(...values, 100);

  if (months.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500">
        No trend data available yet
      </div>
    );
  }

  return (
    <div className="relative h-48">
      <div className="absolute inset-0 flex items-end justify-between gap-1 px-2">
        {values.map((value, index) => (
          <div key={months[index]} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(value / maxValue) * 100}%` }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="w-full bg-gradient-to-t from-cyan-500/80 to-cyan-400/40 rounded-t-lg relative group cursor-pointer hover:from-cyan-400 hover:to-cyan-300/60 transition-all min-h-[4px]"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 rounded text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {value.toFixed(0)}%
              </div>
            </motion.div>
            <span className="text-xs text-slate-500">
              {months[index].split('-')[1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Format Breakdown
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
    <div className="space-y-4">
      {formats.map(([format, stats]) => {
        const winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
        return (
          <div key={format} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">{format}</span>
              <span className="text-slate-400 text-sm">
                {stats.wins}W - {stats.losses}L ({winRate.toFixed(0)}%)
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${winRate}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full ${
                  winRate >= 70 ? 'bg-emerald-500' :
                  winRate >= 50 ? 'bg-cyan-500' :
                  winRate >= 30 ? 'bg-amber-500' : 'bg-red-500'
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Head-to-Head Section
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
        <div
          key={opponent.name}
          className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/30 border border-slate-800/50 hover:bg-slate-800/50 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white font-medium text-sm">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{opponent.name}</p>
            <p className="text-slate-500 text-sm">{opponent.total} debates</p>
          </div>
          <div className="text-right">
            <p className={`font-semibold ${
              opponent.winRate >= 50 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {opponent.winRate.toFixed(0)}%
            </p>
            <p className="text-slate-500 text-xs">{opponent.wins}W-{opponent.losses}L</p>
          </div>
        </div>
      ))}
    </div>
  );
};

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

  // Demo data for visual appeal when empty
  const hasData = analytics && analytics.totalDebates > 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-cyan-400" />
            Analytics
          </h1>
          <p className="text-slate-400 mt-1">Track your debate performance and progress</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refetch}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Record Debate
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800/50 w-fit">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'trends', label: 'Trends' },
          { id: 'opponents', label: 'Head-to-Head' },
          { id: 'formats', label: 'By Format' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === tab.id
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : !hasData ? (
        <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/30">
          <EmptyAnalytics onAddDebate={() => setShowAddModal(true)} />
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          {activeView === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total Debates"
                  value={analytics.totalDebates}
                  icon={Mic}
                  color="cyan"
                />
                <StatCard
                  label="Win Rate"
                  value={`${analytics.winRate}%`}
                  change={5}
                  icon={Trophy}
                  color="emerald"
                />
                <StatCard
                  label="Total Wins"
                  value={analytics.totalWins}
                  icon={Award}
                  color="purple"
                />
                <StatCard
                  label="Total Losses"
                  value={analytics.totalLosses}
                  icon={Target}
                  color="orange"
                />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Win Rate Donut */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30"
                >
                  <h3 className="text-lg font-semibold text-white mb-6">Win/Loss Ratio</h3>
                  <WinRateChart data={{ wins: analytics.totalWins, losses: analytics.totalLosses }} />
                </motion.div>

                {/* Format Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30"
                >
                  <h3 className="text-lg font-semibold text-white mb-6">Performance by Format</h3>
                  <FormatBreakdown data={analytics.formatStats} />
                </motion.div>
              </div>

              {/* Recent Debates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30"
              >
                <h3 className="text-lg font-semibold text-white mb-6">Recent Debates</h3>
                <div className="space-y-3">
                  {analytics.recentDebates.slice(0, 5).map((debate, index) => (
                    <div
                      key={debate.id || index}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800/50"
                    >
                      <div className={`w-2 h-12 rounded-full ${
                        debate.result === 'win' ? 'bg-emerald-500' : 'bg-red-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{debate.tournament || 'Practice'}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{debate.format}</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                          vs {debate.opponent || 'Unknown'} • {debate.round}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          debate.result === 'win' 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {debate.result === 'win' ? 'Win' : 'Loss'}
                        </span>
                        {debate.speakerPoints && (
                          <p className="text-slate-500 text-sm mt-1">{debate.speakerPoints} speaks</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {/* Trends View */}
          {activeView === 'trends' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Win Rate Trend (Last 12 Months)</h3>
              <PerformanceTrendChart data={analytics.monthlyStats} />
            </motion.div>
          )}

          {/* Head-to-Head View */}
          {activeView === 'opponents' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Head-to-Head Records</h3>
              <HeadToHead data={analytics.opponentStats} />
            </motion.div>
          )}

          {/* Format View */}
          {activeView === 'formats' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Detailed Format Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(analytics.formatStats).map(([format, stats]) => {
                  const winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
                  return (
                    <div key={format} className="p-4 rounded-xl bg-slate-800/30 border border-slate-800/50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-semibold">{format}</h4>
                        <span className={`text-2xl font-bold ${
                          winRate >= 50 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {winRate.toFixed(0)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-white">{stats.total}</p>
                          <p className="text-slate-500 text-sm">Total</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-emerald-400">{stats.wins}</p>
                          <p className="text-slate-500 text-sm">Wins</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-400">{stats.losses}</p>
                          <p className="text-slate-500 text-sm">Losses</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Add Debate Modal */}
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
  );
};

export default AnalyticsDashboard;
