/**
 * Debate Timer - Professional Timer with Speech Segments
 * Customizable time limits, audio alerts, keyboard shortcuts
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Settings,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  X,
  Check,
  Clock,
  AlertTriangle,
  Zap,
  Trophy,
  Users,
  MessageSquare,
  Shield,
  Target,
  Keyboard,
  Save,
  FolderOpen,
  Maximize2,
  Minimize2,
  SkipForward,
  Edit3,
  Trash2,
  Copy
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// ============================================
// DEBATE FORMAT PRESETS
// ============================================

const DEBATE_FORMATS = {
  ld: {
    name: 'Lincoln-Douglas',
    shortName: 'LD',
    segments: [
      { name: 'AC', fullName: 'Affirmative Constructive', time: 360, speaker: 'aff' },
      { name: 'CX', fullName: 'Cross-Examination', time: 180, speaker: 'neg' },
      { name: 'NC', fullName: 'Negative Constructive', time: 420, speaker: 'neg' },
      { name: 'CX', fullName: 'Cross-Examination', time: 180, speaker: 'aff' },
      { name: '1AR', fullName: 'First Affirmative Rebuttal', time: 240, speaker: 'aff' },
      { name: 'NR', fullName: 'Negative Rebuttal', time: 360, speaker: 'neg' },
      { name: '2AR', fullName: 'Second Affirmative Rebuttal', time: 180, speaker: 'aff' }
    ],
    prepTime: { aff: 240, neg: 240 }
  },
  pf: {
    name: 'Public Forum',
    shortName: 'PF',
    segments: [
      { name: 'Pro', fullName: 'First Pro Speech', time: 240, speaker: 'pro' },
      { name: 'Con', fullName: 'First Con Speech', time: 240, speaker: 'con' },
      { name: 'CX', fullName: 'Crossfire', time: 180, speaker: 'both' },
      { name: 'Pro', fullName: 'Second Pro Speech', time: 240, speaker: 'pro' },
      { name: 'Con', fullName: 'Second Con Speech', time: 240, speaker: 'con' },
      { name: 'CX', fullName: 'Crossfire', time: 180, speaker: 'both' },
      { name: 'Sum', fullName: 'Pro Summary', time: 180, speaker: 'pro' },
      { name: 'Sum', fullName: 'Con Summary', time: 180, speaker: 'con' },
      { name: 'GCX', fullName: 'Grand Crossfire', time: 180, speaker: 'both' },
      { name: 'FF', fullName: 'Pro Final Focus', time: 120, speaker: 'pro' },
      { name: 'FF', fullName: 'Con Final Focus', time: 120, speaker: 'con' }
    ],
    prepTime: { pro: 120, con: 120 }
  },
  policy: {
    name: 'Policy',
    shortName: 'CX',
    segments: [
      { name: '1AC', fullName: 'First Affirmative Constructive', time: 480, speaker: 'aff' },
      { name: 'CX', fullName: 'Cross-Examination', time: 180, speaker: 'neg' },
      { name: '1NC', fullName: 'First Negative Constructive', time: 480, speaker: 'neg' },
      { name: 'CX', fullName: 'Cross-Examination', time: 180, speaker: 'aff' },
      { name: '2AC', fullName: 'Second Affirmative Constructive', time: 480, speaker: 'aff' },
      { name: 'CX', fullName: 'Cross-Examination', time: 180, speaker: 'neg' },
      { name: '2NC', fullName: 'Second Negative Constructive', time: 480, speaker: 'neg' },
      { name: 'CX', fullName: 'Cross-Examination', time: 180, speaker: 'aff' },
      { name: '1NR', fullName: 'First Negative Rebuttal', time: 300, speaker: 'neg' },
      { name: '1AR', fullName: 'First Affirmative Rebuttal', time: 300, speaker: 'aff' },
      { name: '2NR', fullName: 'Second Negative Rebuttal', time: 300, speaker: 'neg' },
      { name: '2AR', fullName: 'Second Affirmative Rebuttal', time: 300, speaker: 'aff' }
    ],
    prepTime: { aff: 480, neg: 480 }
  },
  parli: {
    name: 'Parliamentary',
    shortName: 'Parli',
    segments: [
      { name: 'PM', fullName: 'Prime Minister Constructive', time: 420, speaker: 'gov' },
      { name: 'LO', fullName: 'Leader of Opposition', time: 480, speaker: 'opp' },
      { name: 'MG', fullName: 'Member of Government', time: 480, speaker: 'gov' },
      { name: 'MO', fullName: 'Member of Opposition', time: 480, speaker: 'opp' },
      { name: 'LOR', fullName: 'Leader of Opposition Rebuttal', time: 240, speaker: 'opp' },
      { name: 'PMR', fullName: 'Prime Minister Rebuttal', time: 300, speaker: 'gov' }
    ],
    prepTime: { gov: 0, opp: 0 }
  },
  congress: {
    name: 'Congressional Debate',
    shortName: 'Congress',
    segments: [
      { name: 'Auth', fullName: 'Authorship Speech', time: 180, speaker: 'author' },
      { name: 'Q1', fullName: 'Question Period 1', time: 120, speaker: 'floor' },
      { name: 'Neg1', fullName: 'First Negative Speech', time: 180, speaker: 'neg' },
      { name: 'Q2', fullName: 'Question Period 2', time: 120, speaker: 'floor' },
      { name: 'Aff', fullName: 'Affirmative Speech', time: 180, speaker: 'aff' },
      { name: 'Q3', fullName: 'Question Period 3', time: 120, speaker: 'floor' },
      { name: 'Neg2', fullName: 'Second Negative Speech', time: 180, speaker: 'neg' },
      { name: 'Q4', fullName: 'Question Period 4', time: 120, speaker: 'floor' }
    ],
    prepTime: {}
  },
  bp: {
    name: 'British Parliamentary',
    shortName: 'BP',
    segments: [
      { name: 'PM', fullName: 'Prime Minister', time: 420, speaker: 'og' },
      { name: 'LO', fullName: 'Leader of Opposition', time: 420, speaker: 'oo' },
      { name: 'DPM', fullName: 'Deputy Prime Minister', time: 420, speaker: 'og' },
      { name: 'DLO', fullName: 'Deputy Leader of Opposition', time: 420, speaker: 'oo' },
      { name: 'MG', fullName: 'Member of Government', time: 420, speaker: 'cg' },
      { name: 'MO', fullName: 'Member of Opposition', time: 420, speaker: 'co' },
      { name: 'GW', fullName: 'Government Whip', time: 420, speaker: 'cg' },
      { name: 'OW', fullName: 'Opposition Whip', time: 420, speaker: 'co' }
    ],
    prepTime: {}
  },
  worldschools: {
    name: 'World Schools',
    shortName: 'WSDC',
    segments: [
      { name: '1P', fullName: 'First Proposition', time: 480, speaker: 'prop' },
      { name: '1O', fullName: 'First Opposition', time: 480, speaker: 'opp' },
      { name: '2P', fullName: 'Second Proposition', time: 480, speaker: 'prop' },
      { name: '2O', fullName: 'Second Opposition', time: 480, speaker: 'opp' },
      { name: '3P', fullName: 'Third Proposition', time: 480, speaker: 'prop' },
      { name: '3O', fullName: 'Third Opposition', time: 480, speaker: 'opp' },
      { name: 'OR', fullName: 'Opposition Reply', time: 240, speaker: 'opp' },
      { name: 'PR', fullName: 'Proposition Reply', time: 240, speaker: 'prop' }
    ],
    prepTime: {}
  },
  ipda: {
    name: 'IPDA',
    shortName: 'IPDA',
    segments: [
      { name: 'AC', fullName: 'Affirmative Constructive', time: 300, speaker: 'aff' },
      { name: 'CX', fullName: 'Cross-Examination', time: 120, speaker: 'neg' },
      { name: 'NC', fullName: 'Negative Constructive', time: 300, speaker: 'neg' },
      { name: 'CX', fullName: 'Cross-Examination', time: 120, speaker: 'aff' },
      { name: 'AR', fullName: 'Affirmative Rebuttal', time: 180, speaker: 'aff' },
      { name: 'NR', fullName: 'Negative Rebuttal', time: 180, speaker: 'neg' },
      { name: 'AFR', fullName: 'Affirmative Final Response', time: 60, speaker: 'aff' }
    ],
    prepTime: { aff: 0, neg: 0 }
  },
  npda: {
    name: 'NPDA',
    shortName: 'NPDA',
    segments: [
      { name: 'PMC', fullName: 'Prime Minister Constructive', time: 420, speaker: 'gov' },
      { name: 'LOC', fullName: 'Leader of Opposition Constructive', time: 420, speaker: 'opp' },
      { name: 'MGC', fullName: 'Member of Government Constructive', time: 420, speaker: 'gov' },
      { name: 'MOC', fullName: 'Member of Opposition Constructive', time: 420, speaker: 'opp' },
      { name: 'LOR', fullName: 'Leader of Opposition Rebuttal', time: 300, speaker: 'opp' },
      { name: 'PMR', fullName: 'Prime Minister Rebuttal', time: 300, speaker: 'gov' }
    ],
    prepTime: { gov: 300, opp: 300 }
  },
  custom: {
    name: 'Custom',
    shortName: 'Custom',
    segments: [],
    prepTime: { side1: 180, side2: 180 }
  }
};

// Time alert thresholds (seconds remaining)
const ALERT_THRESHOLDS = [60, 30, 10, 0];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatTime = (seconds) => {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  const sign = seconds < 0 ? '-' : '';
  return `${sign}${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatTimeVerbose = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
};

// ============================================
// CIRCULAR PROGRESS COMPONENT
// ============================================

const CircularProgress = ({ progress, size = 300, strokeWidth = 12, timeRemaining, totalTime, isRunning, isOvertime }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const getColor = () => {
    if (isOvertime) return '#ef4444';
    if (progress <= 10) return '#ef4444';
    if (progress <= 25) return '#f59e0b';
    return '#06b6d4';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="absolute transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
            filter: isRunning ? `drop-shadow(0 0 10px ${getColor()})` : 'none'
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={timeRemaining}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className={`text-5xl font-bold font-mono ${
            isOvertime ? 'text-red-400' : 
            progress <= 10 ? 'text-red-400' : 
            progress <= 25 ? 'text-amber-400' : 
            'text-white'
          }`}
        >
          {formatTime(timeRemaining)}
        </motion.span>
        <span className="text-slate-500 text-sm mt-2">
          of {formatTimeVerbose(totalTime)}
        </span>
        {isOvertime && (
          <span className="text-red-400 text-xs mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            OVERTIME
          </span>
        )}
      </div>

      {/* Pulsing ring when running */}
      {isRunning && (
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: getColor() }}
        />
      )}
    </div>
  );
};

// ============================================
// SEGMENT CARD COMPONENT
// ============================================

const SegmentCard = ({ segment, index, isActive, isCompleted, onClick }) => {
  const getSpeakerColor = (speaker) => {
    switch (speaker) {
      case 'aff':
      case 'pro':
      case 'gov':
        return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
      case 'neg':
      case 'con':
      case 'opp':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'both':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      default:
        return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative p-3 rounded-xl border transition-all text-left w-full
        ${isActive 
          ? 'bg-cyan-500/20 border-cyan-500/50 ring-2 ring-cyan-500/30' 
          : isCompleted
          ? 'bg-slate-800/30 border-slate-700/50 opacity-60'
          : 'bg-slate-800/30 border-slate-800/60 hover:border-slate-700/60'
        }
      `}
    >
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-l-xl"
        />
      )}
      
      <div className="flex items-center gap-3">
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
          ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}
        `}>
          {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
              {segment.name}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs border ${getSpeakerColor(segment.speaker)}`}>
              {segment.speaker}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">{segment.fullName}</p>
        </div>
        
        <span className="text-slate-400 font-mono text-sm">
          {formatTimeVerbose(segment.time)}
        </span>
      </div>
    </motion.button>
  );
};

// ============================================
// PREP TIME PANEL
// ============================================

const PrepTimePanel = ({ prepTime, usedPrepTime, onUsePrep, onStopPrep, activePrepSide }) => {
  const sides = Object.keys(prepTime);
  
  return (
    <div>
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-amber-400" />
        Prep Time
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {sides.map(side => {
          const remaining = prepTime[side] - (usedPrepTime[side] || 0);
          const isActive = activePrepSide === side;
          const progress = (remaining / prepTime[side]) * 100;
          
          return (
            <div key={side} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium capitalize ${
                  side.includes('aff') || side.includes('pro') || side.includes('gov') || side === 'side1'
                    ? 'text-cyan-400' 
                    : 'text-red-400'
                }`}>
                  {side}
                </span>
                <span className="text-white font-mono text-sm">
                  {formatTime(remaining)}
                </span>
              </div>
              
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: `${progress}%` }}
                  className={`h-full rounded-full ${
                    progress > 50 ? 'bg-emerald-500' : progress > 25 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => isActive ? onStopPrep() : onUsePrep(side)}
                disabled={remaining <= 0 && !isActive}
                className={`
                  w-full py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-amber-500 text-white'
                    : remaining <= 0
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                  }
                `}
              >
                {isActive ? 'Stop Prep' : 'Use Prep'}
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// KEYBOARD SHORTCUTS MODAL
// ============================================

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', action: 'Play / Pause timer' },
    { key: 'R', action: 'Reset current segment' },
    { key: '←', action: 'Previous segment' },
    { key: '→', action: 'Next segment' },
    { key: 'M', action: 'Toggle sound' },
    { key: 'F', action: 'Toggle fullscreen' },
    { key: '1-9', action: 'Jump to segment' },
    { key: 'P', action: 'Use prep time (cycles sides)' },
    { key: 'Esc', action: 'Close modals / Exit fullscreen' }
  ];

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
        className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            Keyboard Shortcuts
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="space-y-2">
          {shortcuts.map(({ key, action }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <span className="text-slate-300">{action}</span>
              <kbd className="px-3 py-1.5 rounded-lg bg-slate-700 text-white text-sm font-mono border border-slate-600">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// SETTINGS MODAL
// ============================================

const SettingsModal = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

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
        className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Timer Settings
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="space-y-6">
          {/* Sound alerts */}
          <div>
            <label className="flex items-center justify-between">
              <span className="text-slate-300">Sound Alerts</span>
              <button
                onClick={() => onSettingsChange({ ...settings, soundEnabled: !settings.soundEnabled })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  settings.soundEnabled ? 'left-7' : 'left-1'
                }`} />
              </button>
            </label>
          </div>

          {/* Alert times */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Alert at (seconds remaining)</label>
            <div className="flex flex-wrap gap-2">
              {[120, 60, 30, 10, 0].map(time => (
                <button
                  key={time}
                  onClick={() => {
                    const alerts = settings.alertTimes.includes(time)
                      ? settings.alertTimes.filter(t => t !== time)
                      : [...settings.alertTimes, time].sort((a, b) => b - a);
                    onSettingsChange({ ...settings, alertTimes: alerts });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    settings.alertTimes.includes(time)
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {time === 0 ? 'End' : `${time}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Allow overtime */}
          <div>
            <label className="flex items-center justify-between">
              <span className="text-slate-300">Allow Overtime</span>
              <button
                onClick={() => onSettingsChange({ ...settings, allowOvertime: !settings.allowOvertime })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.allowOvertime ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  settings.allowOvertime ? 'left-7' : 'left-1'
                }`} />
              </button>
            </label>
          </div>

          {/* Auto-advance */}
          <div>
            <label className="flex items-center justify-between">
              <span className="text-slate-300">Auto-advance to next segment</span>
              <button
                onClick={() => onSettingsChange({ ...settings, autoAdvance: !settings.autoAdvance })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.autoAdvance ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  settings.autoAdvance ? 'left-7' : 'left-1'
                }`} />
              </button>
            </label>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold"
          >
            Done
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const DebateTimer = () => {
  const { user } = useAuth();
  
  // Format state
  const [selectedFormat, setSelectedFormat] = useState('pf');
  const [segments, setSegments] = useState(DEBATE_FORMATS.pf.segments);
  const [prepTime, setPrepTime] = useState(DEBATE_FORMATS.pf.prepTime);
  
  // Timer state
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(DEBATE_FORMATS.pf.segments[0]?.time || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSegments, setCompletedSegments] = useState([]);
  
  // Prep time state
  const [usedPrepTime, setUsedPrepTime] = useState({});
  const [activePrepSide, setActivePrepSide] = useState(null);
  
  // Settings
  const [settings, setSettings] = useState({
    soundEnabled: true,
    alertTimes: [60, 30, 10, 0],
    allowOvertime: true,
    autoAdvance: false
  });
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastAlertTime, setLastAlertTime] = useState(null);
  
  // Refs
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const containerRef = useRef(null);

  // Current segment
  const currentSegment = segments[currentSegmentIndex];
  const totalTime = currentSegment?.time || 0;
  const progress = totalTime > 0 ? Math.max(0, (timeRemaining / totalTime) * 100) : 0;
  const isOvertime = timeRemaining < 0;

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Play alert sound
  const playAlert = useCallback((type = 'beep') => {
    if (!settings.soundEnabled) return;
    
    try {
      const ctx = initAudio();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Different sounds for different alerts
      switch (type) {
        case 'warning':
          oscillator.frequency.value = 880;
          oscillator.type = 'sine';
          gainNode.gain.value = 0.3;
          break;
        case 'final':
          oscillator.frequency.value = 440;
          oscillator.type = 'square';
          gainNode.gain.value = 0.4;
          break;
        case 'end':
          oscillator.frequency.value = 660;
          oscillator.type = 'sawtooth';
          gainNode.gain.value = 0.5;
          break;
        default:
          oscillator.frequency.value = 660;
          oscillator.type = 'sine';
          gainNode.gain.value = 0.3;
      }
      
      oscillator.start();
      
      // Fade out
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.error('Audio error:', error);
    }
  }, [settings.soundEnabled, initAudio]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          // Check for alerts
          if (settings.alertTimes.includes(newTime) && newTime !== lastAlertTime) {
            setLastAlertTime(newTime);
            if (newTime === 0) {
              playAlert('end');
            } else if (newTime <= 10) {
              playAlert('final');
            } else {
              playAlert('warning');
            }
          }
          
          // Stop at zero if overtime not allowed
          if (newTime <= 0 && !settings.allowOvertime) {
            setIsRunning(false);
            if (settings.autoAdvance && currentSegmentIndex < segments.length - 1) {
              setTimeout(() => nextSegment(), 500);
            }
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, settings, currentSegmentIndex, segments.length, lastAlertTime, playAlert]);

  // Prep time timer
  useEffect(() => {
    let prepTimer;
    
    if (activePrepSide) {
      prepTimer = setInterval(() => {
        setUsedPrepTime(prev => {
          const newUsed = (prev[activePrepSide] || 0) + 1;
          if (newUsed >= prepTime[activePrepSide]) {
            setActivePrepSide(null);
            playAlert('end');
            return { ...prev, [activePrepSide]: prepTime[activePrepSide] };
          }
          return { ...prev, [activePrepSide]: newUsed };
        });
      }, 1000);
    }
    
    return () => {
      if (prepTimer) clearInterval(prepTimer);
    };
  }, [activePrepSide, prepTime, playAlert]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setIsRunning(prev => !prev);
          break;
        case 'r':
          resetSegment();
          break;
        case 'arrowleft':
          prevSegment();
          break;
        case 'arrowright':
          nextSegment();
          break;
        case 'm':
          setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'p':
          handlePrepShortcut();
          break;
        case 'escape':
          if (isFullscreen) {
            document.exitFullscreen?.();
          }
          setShowSettings(false);
          setShowShortcuts(false);
          break;
        default:
          // Number keys 1-9 to jump to segment
          const num = parseInt(e.key);
          if (num >= 1 && num <= segments.length) {
            jumpToSegment(num - 1);
          }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [segments.length, isFullscreen]);

  // Format change
  const handleFormatChange = (formatKey) => {
    const format = DEBATE_FORMATS[formatKey];
    setSelectedFormat(formatKey);
    setSegments(format.segments);
    setPrepTime(format.prepTime);
    setCurrentSegmentIndex(0);
    setTimeRemaining(format.segments[0]?.time || 0);
    setIsRunning(false);
    setCompletedSegments([]);
    setUsedPrepTime({});
    setActivePrepSide(null);
  };

  // Timer controls
  const toggleTimer = () => setIsRunning(prev => !prev);
  
  const resetSegment = () => {
    setTimeRemaining(currentSegment?.time || 0);
    setIsRunning(false);
    setLastAlertTime(null);
  };
  
  const nextSegment = () => {
    if (currentSegmentIndex < segments.length - 1) {
      setCompletedSegments(prev => [...prev, currentSegmentIndex]);
      setCurrentSegmentIndex(prev => prev + 1);
      setTimeRemaining(segments[currentSegmentIndex + 1]?.time || 0);
      setIsRunning(false);
      setLastAlertTime(null);
    }
  };
  
  const prevSegment = () => {
    if (currentSegmentIndex > 0) {
      setCompletedSegments(prev => prev.filter(i => i !== currentSegmentIndex - 1));
      setCurrentSegmentIndex(prev => prev - 1);
      setTimeRemaining(segments[currentSegmentIndex - 1]?.time || 0);
      setIsRunning(false);
      setLastAlertTime(null);
    }
  };
  
  const jumpToSegment = (index) => {
    if (index >= 0 && index < segments.length) {
      setCurrentSegmentIndex(index);
      setTimeRemaining(segments[index]?.time || 0);
      setIsRunning(false);
      setLastAlertTime(null);
      // Mark all previous as completed
      setCompletedSegments(Array.from({ length: index }, (_, i) => i));
    }
  };

  // Prep time controls
  const handleUsePrep = (side) => {
    setIsRunning(false);
    setActivePrepSide(side);
  };
  
  const handleStopPrep = () => {
    setActivePrepSide(null);
  };
  
  const handlePrepShortcut = () => {
    const sides = Object.keys(prepTime);
    if (activePrepSide) {
      setActivePrepSide(null);
    } else {
      // Cycle through sides
      const currentIndex = sides.indexOf(activePrepSide);
      const nextSide = sides[(currentIndex + 1) % sides.length];
      if ((prepTime[nextSide] - (usedPrepTime[nextSide] || 0)) > 0) {
        setActivePrepSide(nextSide);
        setIsRunning(false);
      }
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Reset all
  const resetAll = () => {
    setCurrentSegmentIndex(0);
    setTimeRemaining(segments[0]?.time || 0);
    setIsRunning(false);
    setCompletedSegments([]);
    setUsedPrepTime({});
    setActivePrepSide(null);
    setLastAlertTime(null);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-8' : ''}`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
                <Timer className="w-7 h-7 text-cyan-400" />
              </div>
              Debate Timer
            </h1>
            <p className="text-slate-400 mt-2">
              {DEBATE_FORMATS[selectedFormat].name} Format
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShortcuts(true)}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
              title="Keyboard Shortcuts"
            >
              <Keyboard className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
              title={settings.soundEnabled ? 'Mute' : 'Unmute'}
            >
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Format Selection */}
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(DEBATE_FORMATS).filter(([key]) => key !== 'custom').map(([key, format]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFormatChange(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedFormat === key
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {format.shortName}
            </motion.button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Timer Display */}
          <div className="lg:col-span-2">
            <div className="glass-panel p-8">
              {/* Current Segment Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {currentSegment?.fullName || 'No Segment'}
                </h2>
                <p className="text-slate-400 mt-1">
                  Segment {currentSegmentIndex + 1} of {segments.length}
                </p>
              </div>

              {/* Circular Timer */}
              <div className="flex justify-center mb-8">
                <CircularProgress
                  progress={progress}
                  size={280}
                  strokeWidth={14}
                  timeRemaining={timeRemaining}
                  totalTime={totalTime}
                  isRunning={isRunning}
                  isOvertime={isOvertime}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevSegment}
                  disabled={currentSegmentIndex === 0}
                  className="p-3 rounded-xl bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-600 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetSegment}
                  className="p-3 rounded-xl bg-slate-700 text-white hover:bg-slate-600 transition-all"
                >
                  <RotateCcw className="w-6 h-6" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTimer}
                  className={`p-5 rounded-2xl shadow-lg transition-all ${
                    isRunning
                      ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/25'
                  }`}
                >
                  {isRunning ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetAll}
                  className="p-3 rounded-xl bg-slate-700 text-white hover:bg-slate-600 transition-all"
                  title="Reset All"
                >
                  <RotateCcw className="w-6 h-6" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextSegment}
                  disabled={currentSegmentIndex === segments.length - 1}
                  className="p-3 rounded-xl bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-600 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Keyboard hint */}
              <p className="text-center text-slate-500 text-sm mt-6">
                Press <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono">Space</kbd> to start/stop
              </p>
            </div>

            {/* Prep Time */}
            {Object.keys(prepTime).length > 0 && prepTime[Object.keys(prepTime)[0]] > 0 && (
              <div className="mt-6 glass-panel p-4">
                <PrepTimePanel
                  prepTime={prepTime}
                  usedPrepTime={usedPrepTime}
                  onUsePrep={handleUsePrep}
                  onStopPrep={handleStopPrep}
                  activePrepSide={activePrepSide}
                />
              </div>
            )}
          </div>

          {/* Segment List */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              Speech Segments
            </h3>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {segments.map((segment, index) => (
                <SegmentCard
                  key={index}
                  segment={segment}
                  index={index}
                  isActive={index === currentSegmentIndex}
                  isCompleted={completedSegments.includes(index)}
                  onClick={() => jumpToSegment(index)}
                />
              ))}
            </div>

            {/* Progress summary */}
            <div className="glass-panel p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Progress</span>
                <span className="text-white font-medium">
                  {completedSegments.length} / {segments.length}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedSegments.length / segments.length) * 100}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            settings={settings}
            onSettingsChange={setSettings}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShortcuts && (
          <KeyboardShortcutsModal
            isOpen={showShortcuts}
            onClose={() => setShowShortcuts(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DebateTimer;
