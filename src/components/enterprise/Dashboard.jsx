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
  Play,
  Sparkles,
  MessageSquare,
  Lightbulb
} from 'lucide-react';

const Dashboard = ({ setActiveTab }) => {
  // Empty state cards for new users
  const getStartedCards = [
    { 
      label: 'Speech Analysis', 
      icon: Mic, 
      color: 'cyan',
      title: 'No speeches analyzed yet',
      description: 'Upload or record a speech to get AI-powered feedback on delivery, structure, and argumentation.',
      action: 'Analyze First Speech',
      tab: 'judge'
    },
    { 
      label: 'Live Coaching', 
      icon: Activity, 
      color: 'purple',
      title: 'No coaching sessions yet',
      description: 'Start a live session to get real-time feedback as you practice your speech or debate.',
      action: 'Start Coaching',
      tab: 'coach'
    },
    { 
      label: 'Strategy Builder', 
      icon: Target, 
      color: 'orange',
      title: 'No strategies created yet',
      description: 'Build winning debate strategies with AI-powered case analysis and argument mapping.',
      action: 'Build Strategy',
      tab: 'strategy'
    },
    { 
      label: 'Tone Analysis', 
      icon: MessageSquare, 
      color: 'emerald',
      title: 'No tone analyses yet',
      description: 'Analyze the rhetorical tone and persuasive elements of your speeches.',
      action: 'Analyze Tone',
      tab: 'tone'
    },
  ];

  const quickActions = [
    { label: 'New Analysis', icon: FileText, tab: 'judge', color: 'from-cyan-500 to-blue-500' },
    { label: 'Start Coaching', icon: Play, tab: 'coach', color: 'from-purple-500 to-pink-500' },
    { label: 'Build Strategy', icon: Target, tab: 'strategy', color: 'from-orange-500 to-red-500' },
    { label: 'View History', icon: History, tab: 'history', color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome! Let's get started on improving your debate skills.</p>
      </div>

      {/* Get Started Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {getStartedCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl" />
              <div className="relative p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm hover:border-slate-700/60 transition-all h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-${card.color}-500/10 border border-${card.color}-500/20`}>
                    <Icon className={`w-6 h-6 text-${card.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 font-medium">{card.label}</p>
                    <p className="text-lg font-semibold text-white mt-0.5">{card.title}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm flex-1 mb-4">{card.description}</p>
                <button
                  onClick={() => setActiveTab(card.tab)}
                  className={`w-full py-2.5 px-4 rounded-lg bg-${card.color}-500/10 border border-${card.color}-500/30 text-${card.color}-400 font-medium hover:bg-${card.color}-500/20 transition-all flex items-center justify-center gap-2`}
                >
                  <Sparkles className="w-4 h-4" />
                  {card.action}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Empty Performance Chart / Getting Started */}
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
                <p className="text-sm text-slate-400">Track your improvement over time</p>
              </div>
            </div>

            {/* Empty State for Chart */}
            <div className="relative h-48 mt-4 flex flex-col items-center justify-center">
              <div className="absolute inset-0 flex items-end justify-between gap-2 px-2 opacity-20">
                {[40, 55, 45, 60, 50, 65, 58, 70, 63, 75, 68, 80].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      style={{ height: `${height}%` }}
                      className="w-full bg-gradient-to-t from-slate-700/50 to-slate-600/30 rounded-t-lg"
                    />
                  </div>
                ))}
              </div>
              
              <div className="relative z-10 text-center">
                <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700/50 mb-4 mx-auto w-fit">
                  <BarChart3 className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-400 font-medium">No performance data yet</p>
                <p className="text-slate-500 text-sm mt-1">Complete your first analysis to start tracking progress</p>
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

      {/* Recent Activity - Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>

        {/* Empty State */}
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700/50 mb-4">
            <History className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium">No recent activity</p>
          <p className="text-slate-500 text-sm mt-1 text-center max-w-md">
            Your recent analyses, coaching sessions, and strategies will appear here as you use the platform.
          </p>
          <button
            onClick={() => setActiveTab('judge')}
            className="mt-6 px-5 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium hover:bg-cyan-500/20 transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Start Your First Analysis
          </button>
        </div>
      </motion.div>

      {/* Getting Started Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-slate-800/60"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10" />
        <div className="relative p-6 flex items-center gap-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">Getting Started</h3>
            <p className="text-slate-400 text-sm mt-1">
              Start by analyzing your first speech. Upload a recording or paste your speech text to get detailed AI-powered feedback.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('judge')}
            className="px-5 py-2.5 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
          >
            Get Started
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
