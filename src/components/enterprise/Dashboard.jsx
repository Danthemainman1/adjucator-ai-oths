import React from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  Target,
  Activity,
  History,
  TrendingUp,
  Clock,
  Award,
  ChevronRight,
  Zap,
  BarChart3,
  FileText,
  Play
} from 'lucide-react';

const Dashboard = ({ setActiveTab }) => {
  // Mock data for demonstration
  const stats = [
    { label: 'Speeches Analyzed', value: '47', change: '+12%', icon: Mic, color: 'cyan' },
    { label: 'Hours Coached', value: '23.5', change: '+8%', icon: Clock, color: 'purple' },
    { label: 'Avg. Score', value: '84', change: '+5pts', icon: Award, color: 'emerald' },
    { label: 'Strategies Built', value: '18', change: '+3', icon: Target, color: 'orange' },
  ];

  const recentActivity = [
    { type: 'analysis', title: 'PF Rebuttal Analysis', time: '2 hours ago', score: 87 },
    { type: 'coach', title: 'Live Coaching Session', time: '5 hours ago', duration: '12:34' },
    { type: 'strategy', title: 'LD Case Strategy', time: 'Yesterday', topic: 'Privacy vs Security' },
    { type: 'analysis', title: 'Extemp Speech Review', time: '2 days ago', score: 92 },
  ];

  const quickActions = [
    { label: 'New Analysis', icon: FileText, tab: 'judge', color: 'from-cyan-500 to-blue-500' },
    { label: 'Start Coaching', icon: Play, tab: 'coach', color: 'from-purple-500 to-pink-500' },
    { label: 'Build Strategy', icon: Target, tab: 'strategy', color: 'from-orange-500 to-red-500' },
    { label: 'View History', icon: History, tab: 'history', color: 'from-emerald-500 to-teal-500' },
  ];

  // Performance chart data (fake)
  const chartData = [65, 72, 68, 80, 75, 85, 82, 88, 84, 91, 87, 94];
  const maxValue = Math.max(...chartData);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back. Here's your performance overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl" />
              <div className="relative p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm hover:border-slate-700/60 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-2 tracking-tight">{stat.value}</p>
                    <p className={`text-sm mt-1 font-medium ${
                      stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {stat.change} <span className="text-slate-500">vs last month</span>
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm h-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Performance Trend</h2>
                <p className="text-sm text-slate-400">Your score improvement over time</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">+29% improvement</span>
              </div>
            </div>

            {/* Simple CSS Chart */}
            <div className="relative h-48 mt-4">
              <div className="absolute inset-0 flex items-end justify-between gap-2 px-2">
                {chartData.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(value / maxValue) * 100}%` }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                      className="w-full bg-gradient-to-t from-cyan-500/80 to-cyan-400/40 rounded-t-lg relative group cursor-pointer hover:from-cyan-400 hover:to-cyan-300/60 transition-all"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 rounded text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {value}%
                      </div>
                    </motion.div>
                    <span className="text-xs text-slate-500">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[100, 75, 50, 25, 0].map((val) => (
                  <div key={val} className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 w-8">{val}</span>
                    <div className="flex-1 h-px bg-slate-800/50" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm h-full"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => setActiveTab(action.tab)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-800/60 bg-slate-900/50 hover:bg-slate-800/50 hover:border-slate-700 transition-all group"
                  >
                    <div className={`p-2.5 rounded-lg bg-gradient-to-br ${action.color} shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="flex-1 text-left text-white font-medium">{action.label}</span>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          <button 
            onClick={() => setActiveTab('history')}
            className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-800/40 bg-slate-900/20 hover:bg-slate-800/30 hover:border-slate-700/50 transition-all cursor-pointer"
            >
              <div className={`p-2.5 rounded-lg ${
                activity.type === 'analysis' ? 'bg-cyan-500/10 text-cyan-400' :
                activity.type === 'coach' ? 'bg-purple-500/10 text-purple-400' :
                'bg-orange-500/10 text-orange-400'
              }`}>
                {activity.type === 'analysis' ? <FileText className="w-5 h-5" /> :
                 activity.type === 'coach' ? <Activity className="w-5 h-5" /> :
                 <Target className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{activity.title}</p>
                <p className="text-sm text-slate-500">{activity.time}</p>
              </div>
              <div className="text-right">
                {activity.score && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activity.score >= 90 ? 'bg-emerald-500/10 text-emerald-400' :
                    activity.score >= 80 ? 'bg-cyan-500/10 text-cyan-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {activity.score}/100
                  </span>
                )}
                {activity.duration && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400">
                    {activity.duration}
                  </span>
                )}
                {activity.topic && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-500/10 text-orange-400 truncate max-w-[150px] inline-block">
                    {activity.topic}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pro Tip Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-slate-800/60"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10" />
        <div className="relative p-6 flex items-center gap-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">Pro Tip: Consistent Practice</h3>
            <p className="text-slate-400 text-sm mt-1">
              Debaters who analyze at least 3 speeches per week see 40% faster improvement in their scores.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('judge')}
            className="px-5 py-2.5 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
          >
            Start Analysis
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
