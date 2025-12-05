import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  BarChart3
} from 'lucide-react';

const SpeakerPointsTracker = () => {
  const [entries, setEntries] = useState([]);
  const [newPoints, setNewPoints] = useState('');
  const [newRound, setNewRound] = useState('');
  const [newTournament, setNewTournament] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('speaker-points');
    if (saved) {
        setTimeout(() => {
            setEntries(JSON.parse(saved));
        }, 0);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('speaker-points', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    const points = parseFloat(newPoints);
    if (isNaN(points) || points < 20 || points > 30) return;

    const entry = {
      id: Date.now().toString(),
      points,
      round: newRound || 'Round',
      tournament: newTournament || 'Tournament',
      date: new Date().toISOString()
    };

    setEntries([entry, ...entries]);
    setNewPoints('');
    setNewRound('');
    setNewTournament('');
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // Calculate stats
  const stats = {
    average: entries.length > 0 
      ? (entries.reduce((sum, e) => sum + e.points, 0) / entries.length).toFixed(2)
      : 0,
    highest: entries.length > 0 
      ? Math.max(...entries.map(e => e.points))
      : 0,
    lowest: entries.length > 0 
      ? Math.min(...entries.map(e => e.points))
      : 0,
    total: entries.length,
    recent: entries.slice(0, 5)
  };

  // Trend (compare last 3 to previous 3)
  const getTrend = () => {
    if (entries.length < 4) return 'neutral';
    const recent = entries.slice(0, 3).reduce((s, e) => s + e.points, 0) / 3;
    const previous = entries.slice(3, 6).reduce((s, e) => s + e.points, 0) / Math.min(3, entries.length - 3);
    if (recent > previous + 0.2) return 'up';
    if (recent < previous - 0.2) return 'down';
    return 'neutral';
  };

  const trend = getTrend();

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
            <Award className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Speaker Points Tracker</h1>
            <p className="text-slate-400 text-sm">Track and analyze your speaker points</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Average"
            value={stats.average}
            icon={<BarChart3 className="w-5 h-5" />}
            color="yellow"
          />
          <StatCard
            label="Highest"
            value={stats.highest}
            icon={<TrendingUp className="w-5 h-5" />}
            color="green"
          />
          <StatCard
            label="Lowest"
            value={stats.lowest}
            icon={<TrendingDown className="w-5 h-5" />}
            color="red"
          />
          <StatCard
            label="Rounds"
            value={stats.total}
            icon={<Calendar className="w-5 h-5" />}
            color="blue"
          />
        </div>

        {/* Trend Indicator */}
        {entries.length >= 4 && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            trend === 'up' ? 'bg-green-500/10 border border-green-500/30' :
            trend === 'down' ? 'bg-red-500/10 border border-red-500/30' :
            'bg-slate-800/50 border border-slate-700/50'
          }`}>
            {trend === 'up' && <TrendingUp className="w-5 h-5 text-green-400" />}
            {trend === 'down' && <TrendingDown className="w-5 h-5 text-red-400" />}
            {trend === 'neutral' && <Minus className="w-5 h-5 text-slate-400" />}
            <span className={
              trend === 'up' ? 'text-green-400' :
              trend === 'down' ? 'text-red-400' :
              'text-slate-400'
            }>
              {trend === 'up' && 'Your speaker points are trending upward!'}
              {trend === 'down' && 'Your speaker points have declined recently'}
              {trend === 'neutral' && 'Your speaker points are stable'}
            </span>
          </div>
        )}

        {/* Add Entry Form */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
          <h3 className="text-white font-medium mb-4">Add Speaker Points</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="number"
              step="0.5"
              min="20"
              max="30"
              placeholder="Points (20-30)"
              value={newPoints}
              onChange={(e) => setNewPoints(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500/50"
            />
            <input
              type="text"
              placeholder="Round (optional)"
              value={newRound}
              onChange={(e) => setNewRound(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500/50"
            />
            <input
              type="text"
              placeholder="Tournament (optional)"
              value={newTournament}
              onChange={(e) => setNewTournament(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500/50"
            />
            <button
              onClick={addEntry}
              disabled={!newPoints || parseFloat(newPoints) < 20 || parseFloat(newPoints) > 30}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Entries List */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-white font-medium mb-4">History</h3>
          
          {entries.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No speaker points recorded yet</p>
              <p className="text-sm">Add your first entry above</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold ${
                      entry.points >= 29 ? 'text-green-400' :
                      entry.points >= 27 ? 'text-yellow-400' :
                      entry.points >= 25 ? 'text-slate-300' :
                      'text-red-400'
                    }`}>
                      {entry.points}
                    </div>
                    <div>
                      <div className="text-white">{entry.round}</div>
                      <div className="text-slate-500 text-sm">{entry.tournament}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-sm">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    yellow: 'from-yellow-500/20 to-orange-500/20 text-yellow-400',
    green: 'from-green-500/20 to-emerald-500/20 text-green-400',
    red: 'from-red-500/20 to-rose-500/20 text-red-400',
    blue: 'from-blue-500/20 to-cyan-500/20 text-blue-400'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} p-4 rounded-xl`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
};

export default SpeakerPointsTracker;
