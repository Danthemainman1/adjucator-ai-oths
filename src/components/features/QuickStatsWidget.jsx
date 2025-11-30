/**
 * QuickStatsWidget - Comprehensive Stats Display
 * Win/loss records, tournament results, upcoming matches, speaker points
 * With animated progress bars and color-coded badges
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Award,
  Star,
  Flame,
  Zap,
  Medal,
  ChevronRight,
  ChevronDown,
  BarChart3,
  PieChart,
  Activity,
  Users,
  MapPin,
  Crown,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// Mock data - in production would come from Firebase/API
// Returns empty state for new users with no data
const getEmptyStats = () => ({
  overall: {
    wins: 0,
    losses: 0,
    ties: 0,
    totalRounds: 0,
    winRate: 0,
    winStreak: 0,
    bestStreak: 0,
    improvement: 0
  },
  bySide: {
    aff: { wins: 0, losses: 0, winRate: 0 },
    neg: { wins: 0, losses: 0, winRate: 0 }
  },
  byFormat: {},
  speakerPoints: {
    average: 0,
    highest: 0,
    lowest: 0,
    recent: [],
    percentile: 0,
    trend: 'stable'
  },
  recentTournaments: [],
  upcomingMatches: [],
  achievements: [],
  headToHead: []
});

// Animated counter component
const AnimatedNumber = ({ value, duration = 1000, decimals = 0, suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const startValue = displayValue;
    const change = value - startValue;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + change * easeOut;
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue.toFixed(decimals)}{suffix}</span>;
};

// Progress bar component
const ProgressBar = ({ value, max = 100, color = 'cyan', size = 'md', showLabel = true, animated = true }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    cyan: 'from-cyan-500 to-blue-500',
    green: 'from-emerald-500 to-green-500',
    purple: 'from-purple-500 to-indigo-500',
    orange: 'from-orange-500 to-amber-500',
    red: 'from-red-500 to-rose-500',
    gold: 'from-yellow-400 to-amber-500'
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-700/50 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-slate-400">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

// Badge component
const StatBadge = ({ label, value, trend, color = 'slate' }) => {
  const colorClasses = {
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    slate: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${colorClasses[color]}`}>
      <span>{label}</span>
      <span className="font-bold">{value}</span>
      {trend && (
        <span className={trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}>
          {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : trend === 'down' ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
        </span>
      )}
    </div>
  );
};

// Win/Loss Card
const WinLossCard = ({ stats }) => {
  const { wins, losses, ties, winRate, winStreak, improvement } = stats;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          Win/Loss Record
        </h3>
        <StatBadge 
          label="Win Rate" 
          value={`${winRate}%`} 
          trend={improvement > 0 ? 'up' : improvement < 0 ? 'down' : 'stable'}
          color={winRate >= 70 ? 'green' : winRate >= 50 ? 'orange' : 'red'}
        />
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-400">
            <AnimatedNumber value={wins} />
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Wins</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-400">
            <AnimatedNumber value={losses} />
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Losses</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-400">
            <AnimatedNumber value={ties} />
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Ties</div>
        </div>
      </div>

      {/* Win Rate Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-400">Overall Win Rate</span>
          <span className="text-white font-medium">{winRate}%</span>
        </div>
        <ProgressBar value={winRate} max={100} color="cyan" size="md" showLabel={false} />
      </div>

      {/* Streak & Improvement */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-slate-400">Current Streak:</span>
          <span className="text-white font-semibold">{winStreak}W</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          {improvement > 0 ? (
            <>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">+{improvement}%</span>
            </>
          ) : improvement < 0 ? (
            <>
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-red-400">{improvement}%</span>
            </>
          ) : (
            <span className="text-slate-400">No change</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Side Stats Card
const SideStatsCard = ({ bySide }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
    >
      <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
          <PieChart className="w-4 h-4 text-white" />
        </div>
        Performance by Side
      </h3>

      {/* Aff Stats */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span className="text-white font-medium">Affirmative</span>
          </div>
          <span className="text-cyan-400 font-semibold">{bySide.aff.winRate}%</span>
        </div>
        <ProgressBar value={bySide.aff.winRate} max={100} color="cyan" size="sm" showLabel={false} />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{bySide.aff.wins}W - {bySide.aff.losses}L</span>
          <span>{bySide.aff.wins + bySide.aff.losses} rounds</span>
        </div>
      </div>

      {/* Neg Stats */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-white font-medium">Negative</span>
          </div>
          <span className="text-orange-400 font-semibold">{bySide.neg.winRate}%</span>
        </div>
        <ProgressBar value={bySide.neg.winRate} max={100} color="orange" size="sm" showLabel={false} />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{bySide.neg.wins}W - {bySide.neg.losses}L</span>
          <span>{bySide.neg.wins + bySide.neg.losses} rounds</span>
        </div>
      </div>
    </motion.div>
  );
};

// Speaker Points Card
const SpeakerPointsCard = ({ speakerPoints }) => {
  const { average, highest, lowest, recent, percentile, trend } = speakerPoints;
  const maxSp = 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
            <Star className="w-4 h-4 text-white" />
          </div>
          Speaker Points
        </h3>
        <StatBadge 
          label="Top" 
          value={`${percentile}%`} 
          color="gold"
        />
      </div>

      {/* Average Display */}
      <div className="text-center mb-4">
        <div className="text-5xl font-bold text-white mb-1">
          <AnimatedNumber value={average} decimals={1} />
        </div>
        <div className="text-sm text-slate-400">Average Speaker Points</div>
      </div>

      {/* Progress to 30 */}
      <div className="mb-4">
        <ProgressBar value={average} max={maxSp} color="gold" size="lg" showLabel={false} />
        <div className="flex justify-between text-xs mt-1">
          <span className="text-slate-500">26</span>
          <span className="text-slate-500">27</span>
          <span className="text-slate-500">28</span>
          <span className="text-slate-500">29</span>
          <span className="text-amber-400 font-semibold">30</span>
        </div>
      </div>

      {/* High/Low */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700">
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-400">{highest}</div>
          <div className="text-xs text-slate-400">Personal Best</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-slate-400">{lowest}</div>
          <div className="text-xs text-slate-400">Season Low</div>
        </div>
        <div className="flex items-center gap-1">
          {trend === 'up' ? (
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          ) : trend === 'down' ? (
            <TrendingDown className="w-5 h-5 text-red-400" />
          ) : (
            <Activity className="w-5 h-5 text-slate-400" />
          )}
          <span className={`text-sm font-medium ${
            trend === 'up' ? 'text-emerald-400' : 
            trend === 'down' ? 'text-red-400' : 
            'text-slate-400'
          }`}>
            {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
          </span>
        </div>
      </div>

      {/* Recent Trend */}
      <div className="mt-4 pt-3 border-t border-slate-700">
        <div className="text-xs text-slate-400 mb-2">Recent Rounds</div>
        <div className="flex items-end justify-between h-12 gap-1">
          {recent.map((sp, idx) => {
            const height = ((sp - 26) / 4) * 100; // Normalize to 26-30 range
            return (
              <motion.div
                key={idx}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className={`flex-1 rounded-t ${
                  sp >= 29 ? 'bg-emerald-500' :
                  sp >= 28 ? 'bg-cyan-500' :
                  sp >= 27 ? 'bg-amber-500' :
                  'bg-slate-500'
                }`}
                title={`${sp} pts`}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// Tournament Results Card
const TournamentResultsCard = ({ tournaments }) => {
  const getPlaceColor = (place, total) => {
    const percentile = (place / total) * 100;
    if (place === 1) return 'text-yellow-400';
    if (place === 2) return 'text-slate-300';
    if (place === 3) return 'text-orange-400';
    if (percentile <= 25) return 'text-emerald-400';
    if (percentile <= 50) return 'text-cyan-400';
    return 'text-slate-400';
  };

  const getPlaceIcon = (place) => {
    if (place === 1) return <Crown className="w-4 h-4 text-yellow-400" />;
    if (place === 2) return <Medal className="w-4 h-4 text-slate-300" />;
    if (place === 3) return <Medal className="w-4 h-4 text-orange-400" />;
    return <Award className="w-4 h-4 text-slate-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          Recent Tournaments
        </h3>
        <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {tournaments.map((tournament, idx) => (
          <motion.div
            key={tournament.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex-shrink-0">
              {getPlaceIcon(tournament.place)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm truncate">
                  {tournament.name}
                </span>
                {tournament.speakerAward && (
                  <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{new Date(tournament.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{tournament.record}</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${getPlaceColor(tournament.place, tournament.totalTeams)}`}>
                #{tournament.place}
              </div>
              <div className="text-xs text-slate-500">of {tournament.totalTeams}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Upcoming Matches Card
const UpcomingMatchesCard = ({ matches }) => {
  const getDaysUntil = (date) => {
    const today = new Date();
    const matchDate = new Date(date);
    const diffTime = matchDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          Upcoming Matches
        </h3>
      </div>

      <div className="space-y-3">
        {matches.map((match, idx) => {
          const daysUntil = getDaysUntil(match.date);
          
          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="p-3 bg-slate-700/30 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-white font-medium text-sm">{match.tournament}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3 h-3" />
                    {match.location}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  match.registered 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {match.registered ? 'Registered' : 'Not Registered'}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-600/50 text-slate-300 text-xs rounded">
                    {match.format}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(match.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  daysUntil <= 3 ? 'text-red-400' :
                  daysUntil <= 7 ? 'text-amber-400' :
                  'text-slate-400'
                }`}>
                  <Clock className="w-3 h-3" />
                  {daysUntil === 0 ? 'Today' :
                   daysUntil === 1 ? 'Tomorrow' :
                   `${daysUntil} days`}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Achievements Card
const AchievementsCard = ({ achievements }) => {
  const iconMap = {
    trophy: Trophy,
    star: Star,
    flame: Flame,
    zap: Zap,
    medal: Medal
  };

  const colorMap = {
    gold: 'from-yellow-400 to-amber-500 text-yellow-400',
    purple: 'from-purple-500 to-indigo-500 text-purple-400',
    orange: 'from-orange-500 to-red-500 text-orange-400',
    cyan: 'from-cyan-500 to-blue-500 text-cyan-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          Achievements
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement, idx) => {
          const Icon = iconMap[achievement.icon] || Trophy;
          const colorClass = colorMap[achievement.color] || colorMap.gold;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx }}
              className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white text-sm font-medium">{achievement.name}</div>
                <div className={`text-lg font-bold ${colorClass.split(' ')[2]}`}>×{achievement.count}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Head to Head Card
const HeadToHeadCard = ({ records }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg">
            <Users className="w-4 h-4 text-white" />
          </div>
          Head-to-Head Records
        </h3>
      </div>

      <div className="space-y-3">
        {records.map((record, idx) => {
          const total = record.wins + record.losses;
          const winRate = total > 0 ? (record.wins / total) * 100 : 0;
          
          return (
            <motion.div
              key={record.opponent}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">{record.opponent}</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-semibold">{record.wins}W</span>
                  <span className="text-slate-500">-</span>
                  <span className="text-red-400 font-semibold">{record.losses}L</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${winRate}%` }}
                    transition={{ duration: 0.5, delay: 0.2 * idx }}
                    className={`h-full rounded-full ${
                      winRate >= 50 ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  winRate >= 50 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {winRate.toFixed(0)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Format Stats Card
const FormatStatsCard = ({ byFormat }) => {
  const formats = Object.entries(byFormat);
  const colors = ['cyan', 'purple', 'orange', 'green'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg">
            <Target className="w-4 h-4 text-white" />
          </div>
          Performance by Format
        </h3>
      </div>

      <div className="space-y-4">
        {formats.map(([format, stats], idx) => (
          <div key={format}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-white text-sm">{format}</span>
              <span className="text-xs text-slate-400">
                {stats.wins}W - {stats.losses}L
              </span>
            </div>
            <ProgressBar 
              value={stats.winRate} 
              max={100} 
              color={colors[idx % colors.length]} 
              size="sm" 
              showLabel={false} 
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Empty State Component
const EmptyStatsCard = ({ title, icon: Icon, message, actionText, onAction }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
  >
    <div className="text-center py-6">
      <div className="p-3 bg-slate-700/50 rounded-full w-fit mx-auto mb-3">
        <Icon className="w-6 h-6 text-slate-500" />
      </div>
      <h3 className="text-white font-medium mb-1">{title}</h3>
      <p className="text-slate-400 text-sm mb-4">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  </motion.div>
);

// Main Component
const QuickStatsWidget = ({ compact = false }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('season');

  useEffect(() => {
    // Load empty state for new users - in production, fetch from Firebase
    const timer = setTimeout(() => {
      // TODO: Replace with actual data fetch from useAnalytics hook
      // For now, show empty state for new users
      setStats(getEmptyStats());
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const refreshStats = () => {
    setLoading(true);
    setTimeout(() => {
      // TODO: Replace with actual data refresh
      setStats(getEmptyStats());
      setLoading(false);
    }, 500);
  };

  // Check if user has any data
  const hasData = stats && stats.overall.totalRounds > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
          <p className="text-slate-400">Loading stats...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">Unable to load statistics</p>
      </div>
    );
  }

  // Show welcome state for new users with no data
  if (!hasData) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              Quick Stats
            </h1>
            <p className="text-slate-400 mt-1">
              Your performance at a glance
            </p>
          </div>
        </div>

        {/* Welcome State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-2xl p-8 text-center"
        >
          <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full w-fit mx-auto mb-4">
            <BarChart3 className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Welcome to Your Stats Dashboard</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            Start logging your debate rounds to see detailed statistics, win rates, 
            speaker points, and track your improvement over time.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-4 py-2 bg-slate-700/50 rounded-lg">
              <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <span className="text-xs text-slate-400">Tournament Results</span>
            </div>
            <div className="px-4 py-2 bg-slate-700/50 rounded-lg">
              <Star className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <span className="text-xs text-slate-400">Speaker Points</span>
            </div>
            <div className="px-4 py-2 bg-slate-700/50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-xs text-slate-400">Win Rate Trends</span>
            </div>
            <div className="px-4 py-2 bg-slate-700/50 rounded-lg">
              <Users className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <span className="text-xs text-slate-400">Head-to-Head</span>
            </div>
          </div>
        </motion.div>

        {/* Empty Stats Grid Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
          <EmptyStatsCard
            title="Win/Loss Record"
            icon={BarChart3}
            message="No rounds logged yet"
          />
          <EmptyStatsCard
            title="Speaker Points"
            icon={Star}
            message="Points will appear after your first round"
          />
          <EmptyStatsCard
            title="Recent Tournaments"
            icon={Trophy}
            message="Enter your tournament results"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            Quick Stats
          </h1>
          <p className="text-slate-400 mt-1">
            Your performance at a glance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="season">This Season</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={refreshStats}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <WinLossCard stats={stats.overall} />
        <SideStatsCard bySide={stats.bySide} />
        <SpeakerPointsCard speakerPoints={stats.speakerPoints} />
        <TournamentResultsCard tournaments={stats.recentTournaments} />
        <UpcomingMatchesCard matches={stats.upcomingMatches} />
        <AchievementsCard achievements={stats.achievements} />
        <HeadToHeadCard records={stats.headToHead} />
        <FormatStatsCard byFormat={stats.byFormat} />
      </div>
    </div>
  );
};

export default QuickStatsWidget;
