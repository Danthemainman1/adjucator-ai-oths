import React from 'react';
import { motion } from 'framer-motion';
import {
  Mic, Target, Activity, History, Clock, FileText, Play, MessageSquare, Lightbulb, ChevronRight
} from 'lucide-react';

const Dashboard = ({ setActiveTab }) => {
  const getStartedCards = [
    { 
      label: 'SPEECH ANALYSIS',
      title: 'Analyze First Speech',
      description: 'Upload or record a speech to get AI-powered feedback on delivery, structure, and argumentation.',
      action: 'Start Analysis',
      tab: 'judge'
    },
    { 
      label: 'LIVE COACHING',
      title: 'Start Coaching Session',
      description: 'Begin a live session to get real-time feedback as you practice your speech or debate.',
      action: 'Start Live Coach',
      tab: 'coach'
    },
    { 
      label: 'STRATEGY BUILDER',
      title: 'Build Match Strategy',
      description: 'Construct winning debate strategies with AI-powered case analysis and argument mapping.',
      action: 'Open Builder',
      tab: 'strategy'
    },
    { 
      label: 'TONE ANALYSIS',
      title: 'Analyze Tone & Persuasion',
      description: 'Break down the rhetorical tone and persuasive elements embedded in your speeches.',
      action: 'Open Tone Analyzer',
      tab: 'tone'
    },
  ];

  const quickActions = [
    { label: 'New Analysis', tab: 'judge' },
    { label: 'Start Coaching', tab: 'coach' },
    { label: 'Build Strategy', tab: 'strategy' },
    { label: 'View History', tab: 'history' },
  ];

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="border-b border-hairline pb-4">
        <h1 className="text-3xl font-serif text-ink tracking-tight">Dashboard</h1>
        <p className="text-ink-muted mt-2">Welcome. Select a tool below to begin your session.</p>
      </div>

      {/* Asymmetric Reading-Style Layout for Core Tools */}
      <div>
        <h2 className="text-sm font-medium text-ink-muted label-caps mb-6">Core Instruments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-hairline rounded-md border border-hairline overflow-hidden">
          {getStartedCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-parchment p-8 flex flex-col group hover:bg-surface-card transition-colors"
            >
              <p className="label-caps text-ink-faint mb-2">{card.label}</p>
              <h3 className="text-xl font-serif text-ink mb-3 group-hover:text-accent-crimson transition-colors">{card.title}</h3>
              <p className="text-ink-muted text-sm flex-1 max-w-sm mb-6 leading-relaxed">
                {card.description}
              </p>
              <div className="mt-auto">
                <button
                  onClick={() => setActiveTab(card.tab)}
                  className="text-sm font-medium text-ink hover:text-accent-crimson transition-colors flex items-center gap-1 group-hover:underline underline-offset-4 decoration-accent-crimson/30"
                >
                  {card.action}
                  <ChevronRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Empty Performance Chart */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-medium text-ink-muted label-caps border-b border-hairline pb-4">Statistical Overview</h2>
          <div className="card p-8 h-[300px] flex flex-col items-center justify-center text-center">
             <Activity className="w-8 h-8 text-ink-faint mb-4 stroke-[1.25]" />
             <p className="text-ink font-medium">Insufficient performance data</p>
             <p className="text-ink-muted text-sm mt-1 max-w-sm">Complete your initial analysis to begin tracking debate progress metrics over time.</p>
          </div>
        </div>

        {/* Quick Actions List (Plain text, no icons) */}
        <div className="space-y-6">
          <h2 className="text-sm font-medium text-ink-muted label-caps border-b border-hairline pb-4">Quick Index</h2>
          <div className="flex flex-col">
            {quickActions.map((action, index) => (
              <button
                key={action.label}
                onClick={() => setActiveTab(action.tab)}
                className="w-full text-left py-3 border-b border-hairline/50 text-ink-muted hover:text-accent-crimson transition-colors flex justify-between items-center group"
              >
                <span className="font-medium text-sm">{action.label}</span>
                <span className="text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Getting Started Brief */}
      <div className="card bg-surface-dark border-none p-8 md:p-12 text-ink-light flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mt-12 rounded-lg">
        <div className="max-w-xl">
          <h3 className="text-xl font-serif text-surface-parchment mb-2">Initialize Your Session</h3>
          <p className="text-ink-faint text-sm leading-relaxed">
            Begin by conducting an analysis on an existing speech transcript or recording. The system will benchmark your structural execution and provide empirical insights.
          </p>
        </div>
        <button 
          onClick={() => setActiveTab('judge')}
          className="btn bg-accent-crimson text-surface-parchment hover:bg-accent-hover shrink-0"
        >
          Begin Analysis
        </button>
      </div>

    </div>
  );
};
export default Dashboard;
