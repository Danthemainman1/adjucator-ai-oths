/**
 * Practice Mode & Drills - Premium Polished Version
 * Animated timers, progress rings, completion celebrations, and stunning visuals
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Mic,
  MicOff,
  CheckCircle,
  XCircle,
  Zap,
  Trophy,
  Flame,
  TrendingUp,
  ChevronRight,
  Plus,
  RefreshCw,
  Volume2,
  MessageSquare,
  HelpCircle,
  BarChart3,
  Star,
  Award,
  Timer,
  ArrowRight,
  Shuffle,
  Sparkles,
  Crown,
  Medal,
  Brain,
  Lightbulb,
  Rocket,
  PartyPopper
} from 'lucide-react';
import { usePractice } from '../../hooks/useDebateData';
import { useAuth } from '../../contexts/AuthContext';
import { callGeminiAPI } from '../../utils/api';

// ============================================================================
// ANIMATED COMPONENTS
// ============================================================================

// Confetti Celebration Component
const Confetti = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 1, 
            y: -20, 
            x: Math.random() * window.innerWidth,
            rotate: 0,
            scale: 1
          }}
          animate={{ 
            opacity: 0, 
            y: window.innerHeight + 100, 
            rotate: 720,
            scale: 0.5
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            delay: Math.random() * 0.5,
            ease: "easeOut"
          }}
          className="absolute"
          style={{
            width: 10 + Math.random() * 10,
            height: 10 + Math.random() * 10,
            background: ['#22d3ee', '#a855f7', '#f97316', '#22c55e', '#eab308'][Math.floor(Math.random() * 5)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px'
          }}
        />
      ))}
    </div>
  );
};

// Animated Progress Ring with Glow
const AnimatedProgressRing = ({ progress, size = 200, strokeWidth = 8, color = 'cyan', children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  const colorClasses = {
    cyan: { stroke: 'stroke-cyan-400', glow: 'drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]' },
    purple: { stroke: 'stroke-purple-400', glow: 'drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]' },
    orange: { stroke: 'stroke-orange-400', glow: 'drop-shadow-[0_0_15px_rgba(251,146,60,0.6)]' },
    emerald: { stroke: 'stroke-emerald-400', glow: 'drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]' },
    amber: { stroke: 'stroke-amber-400', glow: 'drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]' },
    red: { stroke: 'stroke-red-400', glow: 'drop-shadow-[0_0_15px_rgba(248,113,113,0.6)]' }
  };
  
  const colorClass = colorClasses[color] || colorClasses.cyan;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className={`transform -rotate-90 ${colorClass.glow}`} width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-800/60"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={colorClass.stroke}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

// Pulsing Recording Indicator
const PulsingIndicator = ({ isActive, color = 'red' }) => (
  <div className="relative flex items-center justify-center">
    {isActive && (
      <>
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`absolute w-4 h-4 rounded-full bg-${color}-500`}
        />
        <motion.div
          animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className={`absolute w-4 h-4 rounded-full bg-${color}-500`}
        />
      </>
    )}
    <motion.div
      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.5, repeat: Infinity }}
      className={`w-4 h-4 rounded-full ${isActive ? `bg-${color}-500` : 'bg-slate-600'}`}
    />
  </div>
);

// Shimmer Loading Effect
const Shimmer = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 rounded-xl ${className}`} />
);

// Animated Counter
const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (typeof value !== 'number') return;
    
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return <span>{displayValue}</span>;
};

// ============================================================================
// DRILL TYPES & DATA
// ============================================================================

const DRILL_TYPES = [
  {
    id: 'timed-response',
    name: 'Timed Response',
    description: 'Practice speaking for set durations',
    icon: Clock,
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    borderGlow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]',
    durations: [30, 60, 120, 180, 240]
  },
  {
    id: 'refutation',
    name: 'Argument Refutation',
    description: 'Counter arguments under pressure',
    icon: Target,
    color: 'purple',
    gradient: 'from-purple-500/20 to-pink-500/20',
    borderGlow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
    durations: [30, 60]
  },
  {
    id: 'cross-ex',
    name: 'Cross Examination',
    description: 'Practice CX questions & answers',
    icon: MessageSquare,
    color: 'orange',
    gradient: 'from-orange-500/20 to-amber-500/20',
    borderGlow: 'hover:shadow-[0_0_30px_rgba(251,146,60,0.15)]',
    durations: [180]
  },
  {
    id: 'impromptu',
    name: 'Impromptu Topics',
    description: 'Random topics, minimal prep',
    icon: Shuffle,
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    borderGlow: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]',
    durations: [120, 180, 300]
  }
];

const DRILL_PROMPTS = {
  'timed-response': [
    "Explain why education funding should be increased",
    "Argue for or against social media regulation",
    "Defend the importance of free speech on college campuses",
    "Explain the benefits of renewable energy investment",
    "Argue for or against universal basic income",
    "Discuss the ethics of artificial intelligence",
    "Defend the role of government in healthcare",
    "Explain why immigration reform is necessary"
  ],
  'refutation': [
    { claim: "Minimum wage increases cause unemployment", side: 'oppose' },
    { claim: "Climate change is the most pressing issue of our time", side: 'oppose' },
    { claim: "Privacy should be sacrificed for national security", side: 'oppose' },
    { claim: "Standardized testing improves education outcomes", side: 'oppose' },
    { claim: "Social media companies should be liable for user content", side: 'oppose' },
    { claim: "Universal healthcare would bankrupt the economy", side: 'oppose' }
  ],
  'cross-ex': [
    { topic: "Government surveillance", role: 'questioner' },
    { topic: "Criminal justice reform", role: 'questioner' },
    { topic: "Environmental regulations", role: 'questioner' },
    { topic: "Free trade agreements", role: 'answerer' },
    { topic: "Immigration policy", role: 'answerer' }
  ],
  'impromptu': [
    "Technology has made us more connected but less social",
    "The pen is mightier than the sword",
    "History repeats itself",
    "Money can't buy happiness",
    "Actions speak louder than words",
    "The ends justify the means",
    "Knowledge is power"
  ]
};

// ============================================================================
// EMPTY STATE
// ============================================================================

const EmptyPractice = ({ onStart }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16"
  >
    {/* Animated illustration */}
    <div className="relative w-32 h-32 mx-auto mb-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border-2 border-dashed border-slate-700"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center"
      >
        <Target className="w-12 h-12 text-cyan-400" />
      </motion.div>
      {/* Orbiting dots */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 1 }}
          className="absolute inset-0"
          style={{ transformOrigin: 'center center' }}
        >
          <div 
            className="absolute w-3 h-3 rounded-full bg-cyan-400"
            style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}
          />
        </motion.div>
      ))}
    </div>
    
    <h3 className="text-2xl font-bold text-white mb-3">Ready to Level Up?</h3>
    <p className="text-slate-400 max-w-md mx-auto mb-8 text-lg">
      Sharpen your skills with timed drills, refutation practice, and cross-examination simulations.
    </p>
    
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onStart}
      className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all inline-flex items-center gap-3"
    >
      <Play className="w-5 h-5" />
      Start Your First Drill
      <motion.span
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <ArrowRight className="w-5 h-5" />
      </motion.span>
    </motion.button>
  </motion.div>
);

// ============================================================================
// STATS CARDS
// ============================================================================

const GradientStatCard = ({ icon: Icon, label, value, color, suffix = '' }) => {
  const gradients = {
    cyan: 'from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-500/20',
    purple: 'from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20',
    orange: 'from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/20',
    emerald: 'from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20'
  };
  
  const iconColors = {
    cyan: 'text-cyan-400 bg-cyan-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    orange: 'text-orange-400 bg-orange-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br ${gradients[color]} border backdrop-blur-sm transition-all duration-300`}
    >
      {/* Background glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-${color}-500/10 blur-3xl`} />
      
      <div className="relative flex items-start gap-4">
        <div className={`p-3 rounded-xl ${iconColors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className={`text-2xl font-bold text-${color}-400`}>
            {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
            {suffix}
          </p>
          <p className="text-slate-400 text-sm mt-0.5">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// DRILL CARD
// ============================================================================

const DrillCard = ({ drill, onSelect, index }) => {
  const Icon = drill.icon;
  
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(drill)}
      className={`group relative w-full p-6 rounded-2xl border border-slate-800/60 bg-gradient-to-br ${drill.gradient} backdrop-blur-sm hover:border-${drill.color}-500/50 ${drill.borderGlow} transition-all duration-500 text-left overflow-hidden`}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-${drill.color}-500/10 blur-2xl`}
        />
      </div>
      
      <div className="relative">
        {/* Icon with animation */}
        <motion.div 
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className={`w-16 h-16 rounded-2xl bg-${drill.color}-500/10 border border-${drill.color}-500/30 flex items-center justify-center mb-5 group-hover:shadow-lg group-hover:shadow-${drill.color}-500/20 transition-all`}
        >
          <Icon className={`w-8 h-8 text-${drill.color}-400`} />
        </motion.div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-${drill.color}-300 transition-colors">
          {drill.name}
        </h3>
        <p className="text-slate-400 text-sm mb-5 line-clamp-2">{drill.description}</p>
        
        {/* Duration tags */}
        <div className="flex flex-wrap items-center gap-2">
          {drill.durations.slice(0, 3).map(d => (
            <span 
              key={d} 
              className={`px-3 py-1.5 rounded-lg bg-slate-800/60 text-slate-300 text-xs font-medium border border-slate-700/50 group-hover:border-${drill.color}-500/30 transition-colors`}
            >
              {d < 60 ? `${d}s` : `${d / 60}m`}
            </span>
          ))}
          {drill.durations.length > 3 && (
            <span className="text-slate-500 text-xs font-medium">
              +{drill.durations.length - 3} more
            </span>
          )}
        </div>
        
        {/* Start indicator */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className={`absolute top-6 right-6 flex items-center gap-2 text-${drill.color}-400 text-sm font-medium`}
        >
          Start
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.button>
  );
};

// ============================================================================
// DURATION SELECTOR MODAL
// ============================================================================

const DurationSelector = ({ drill, onSelect, onCancel }) => {
  const Icon = drill.icon;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-900 to-${drill.color}-950/20 border border-slate-800 rounded-3xl shadow-2xl shadow-${drill.color}-500/10 p-8`}
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className={`w-20 h-20 rounded-2xl bg-${drill.color}-500/10 border border-${drill.color}-500/30 flex items-center justify-center mx-auto mb-5`}
          >
            <Icon className={`w-10 h-10 text-${drill.color}-400`} />
          </motion.div>
          <h2 className="text-2xl font-bold text-white">{drill.name}</h2>
          <p className="text-slate-400 text-sm mt-2">How long do you want to practice?</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {drill.durations.map((d, i) => (
            <motion.button
              key={d}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(d)}
              className={`group p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-${drill.color}-500/50 hover:bg-${drill.color}-500/10 transition-all text-center`}
            >
              <span className={`text-3xl font-bold text-white group-hover:text-${drill.color}-400 transition-colors`}>
                {d < 60 ? d : d / 60}
              </span>
              <span className="text-slate-400 text-sm ml-1 block mt-1">
                {d < 60 ? 'seconds' : 'minutes'}
              </span>
            </motion.button>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onCancel}
          className="w-full mt-6 py-4 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all font-medium"
        >
          Cancel
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// DRILL TIMER
// ============================================================================

const DrillTimer = ({ duration, isRunning, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setTimeLeft(duration);
    setProgress(100);
  }, [duration]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0) onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        setProgress((newTime / duration) * 100);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, duration, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getColor = () => {
    if (progress > 50) return 'cyan';
    if (progress > 25) return 'amber';
    return 'red';
  };

  return (
    <AnimatedProgressRing
      progress={progress}
      size={220}
      strokeWidth={10}
      color={getColor()}
    >
      <div className="flex flex-col items-center">
        <motion.span 
          key={timeLeft}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-5xl font-bold tracking-tight text-${getColor()}-400`}
        >
          {formatTime(timeLeft)}
        </motion.span>
        <span className="text-slate-500 text-sm mt-1">remaining</span>
      </div>
    </AnimatedProgressRing>
  );
};

// ============================================================================
// COMPLETION CELEBRATION
// ============================================================================

const CompletionCelebration = ({ score, onContinue }) => {
  const getScoreDetails = () => {
    if (score >= 90) return { icon: Crown, color: 'amber', message: 'Outstanding!', subtitle: "You're a debate champion!" };
    if (score >= 80) return { icon: Trophy, color: 'cyan', message: 'Excellent!', subtitle: 'Top-tier performance!' };
    if (score >= 70) return { icon: Medal, color: 'purple', message: 'Great Job!', subtitle: 'Keep up the momentum!' };
    if (score >= 60) return { icon: Star, color: 'emerald', message: 'Good Work!', subtitle: 'Room to grow, but solid!' };
    return { icon: Target, color: 'orange', message: 'Keep Practicing!', subtitle: 'Every session makes you better!' };
  };
  
  const details = getScoreDetails();
  const Icon = details.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 10 }}
        className={`w-28 h-28 rounded-full bg-gradient-to-br from-${details.color}-500/20 to-${details.color}-600/10 border-2 border-${details.color}-500/40 mx-auto mb-6 flex items-center justify-center shadow-xl shadow-${details.color}-500/20`}
      >
        <Icon className={`w-14 h-14 text-${details.color}-400`} />
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-white mb-2"
      >
        {details.message}
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-slate-400 mb-6"
      >
        {details.subtitle}
      </motion.p>
      
      {score && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-${details.color}-500/10 border border-${details.color}-500/30`}
        >
          <Sparkles className={`w-5 h-5 text-${details.color}-400`} />
          <span className="text-3xl font-bold text-white">{score}</span>
          <span className="text-slate-400">/100</span>
        </motion.div>
      )}
      
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className="block mx-auto mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25"
      >
        Continue
      </motion.button>
    </motion.div>
  );
};

// ============================================================================
// DRILL SESSION
// ============================================================================

const DrillSession = ({ drill, duration, prompt, onComplete, onCancel, apiKey }) => {
  const [phase, setPhase] = useState('prep'); // prep, active, review, celebration
  const [isRunning, setIsRunning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [prepTime, setPrepTime] = useState(15);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };
    }
  }, []);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handlePrepComplete = () => {
    setPhase('active');
    setIsRunning(true);
    startRecording();
  };

  const handleDrillComplete = async () => {
    setIsRunning(false);
    stopRecording();
    setPhase('review');

    if (transcript && apiKey) {
      setLoading(true);
      try {
        const analysisPrompt = `Analyze this debate practice response. The drill was: "${prompt}"

The speaker said:
"${transcript}"

Duration: ${duration} seconds

Provide a brief analysis covering:
1. **Content Quality** (1-10): Were the arguments clear and relevant?
2. **Structure** (1-10): Was there a clear organization?
3. **Delivery Estimate** (1-10): Based on word count and sentence structure
4. **Strengths**: What worked well
5. **Areas to Improve**: Specific suggestions
6. **Overall Score**: X/10

Keep the response concise but actionable.`;

        const response = await callGeminiAPI(analysisPrompt, apiKey);
        setAnalysis(response);
        
        // Show celebration for good scores
        const score = extractScore(response);
        if (score && score >= 70) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
        }
      } catch (err) {
        console.error('Analysis error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveAndExit = () => {
    const score = analysis ? extractScore(analysis) : null;
    if (score && score >= 80) {
      setPhase('celebration');
    } else {
      onComplete({
        type: drill.id,
        duration,
        prompt,
        transcript,
        analysis,
        score
      });
    }
  };

  const extractScore = (text) => {
    const match = text.match(/Overall Score[:\s]*(\d+)/i);
    return match ? parseInt(match[1]) * 10 : null;
  };

  const Icon = drill.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto"
    >
      <Confetti show={showConfetti} />
      
      <div className="w-full max-w-3xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-${drill.color}-500/10 border border-${drill.color}-500/30 flex items-center justify-center`}>
                <Icon className={`w-5 h-5 text-${drill.color}-400`} />
              </div>
              {drill.name}
            </h2>
            <p className="text-slate-400 mt-1">
              {phase === 'prep' && 'Prepare your response'}
              {phase === 'active' && 'Speak now!'}
              {phase === 'review' && 'Review your performance'}
              {phase === 'celebration' && 'Congratulations!'}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700"
          >
            Exit
          </motion.button>
        </motion.div>

        {/* Prompt Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl bg-gradient-to-br from-${drill.color}-500/10 to-transparent border border-${drill.color}-500/20 mb-8`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg bg-${drill.color}-500/10`}>
              <Lightbulb className={`w-5 h-5 text-${drill.color}-400`} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Your Prompt</h3>
              <p className="text-xl text-white font-medium">
                {typeof prompt === 'object' ? prompt.claim || prompt.topic : prompt}
              </p>
              {typeof prompt === 'object' && prompt.role && (
                <span className={`inline-block mt-3 px-4 py-2 rounded-xl text-sm font-medium ${
                  prompt.role === 'questioner' 
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' 
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                }`}>
                  Role: {prompt.role.charAt(0).toUpperCase() + prompt.role.slice(1)}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex flex-col items-center justify-center min-h-[350px]">
          
          {/* Prep Phase */}
          {phase === 'prep' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <AnimatedProgressRing progress={100} size={180} color="cyan">
                <motion.span
                  key={prepTime}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl font-bold text-cyan-400"
                >
                  {prepTime}
                </motion.span>
              </AnimatedProgressRing>
              <p className="text-slate-400 mt-4 mb-8 text-lg">seconds to prepare</p>
              
              <div className="flex items-center gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrepComplete}
                  className="px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all flex items-center gap-3"
                >
                  <Play className="w-6 h-6" />
                  Start Speaking
                </motion.button>
              </div>
              
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setPrepTime(Math.max(5, prepTime - 5))}
                  className="px-4 py-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white transition-colors border border-slate-700/50 hover:border-slate-600"
                >
                  -5s
                </button>
                <button
                  onClick={() => setPrepTime(prepTime + 5)}
                  className="px-4 py-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white transition-colors border border-slate-700/50 hover:border-slate-600"
                >
                  +5s
                </button>
              </div>
            </motion.div>
          )}

          {/* Active Phase */}
          {phase === 'active' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center w-full"
            >
              <DrillTimer
                duration={duration}
                isRunning={isRunning}
                onComplete={handleDrillComplete}
              />
              
              {/* Recording Indicator */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-4 mt-8"
              >
                <PulsingIndicator isActive={isRecording} />
                <span className={isRecording ? 'text-red-400 font-medium' : 'text-slate-500'}>
                  {isRecording ? 'Recording...' : 'Microphone off'}
                </span>
              </motion.div>

              {/* Controls */}
              <div className="flex items-center gap-4 justify-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    isRunning 
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                      : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isRunning ? 'Pause' : 'Resume'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDrillComplete}
                  className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Finish Early
                </motion.button>
              </div>

              {/* Live Transcript */}
              {transcript && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 max-h-32 overflow-y-auto"
                >
                  <p className="text-slate-300 text-sm text-left">{transcript}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Review Phase */}
          {phase === 'review' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full space-y-6"
            >
              {/* Transcript */}
              {transcript && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50"
                >
                  <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    Your Response
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{transcript}</p>
                </motion.div>
              )}

              {/* Analysis */}
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-full border-3 border-cyan-500/30 border-t-cyan-500 mb-4"
                  />
                  <span className="text-slate-400">Analyzing your response with AI...</span>
                </motion.div>
              ) : analysis ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20"
                >
                  <h4 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Analysis
                  </h4>
                  <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{analysis}</div>
                </motion.div>
              ) : !transcript ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-800/50 mx-auto mb-4 flex items-center justify-center">
                    <MicOff className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400">No speech detected. Make sure your microphone is enabled.</p>
                </motion.div>
              ) : null}

              {/* Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setPhase('prep');
                    setTranscript('');
                    setAnalysis(null);
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveAndExit}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Save & Exit
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Celebration Phase */}
          {phase === 'celebration' && (
            <CompletionCelebration
              score={analysis ? extractScore(analysis) : null}
              onContinue={() => onComplete({
                type: drill.id,
                duration,
                prompt,
                transcript,
                analysis,
                score: analysis ? extractScore(analysis) : null
              })}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// RECENT SESSION CARD
// ============================================================================

const RecentSessionCard = ({ session, drillType, index }) => {
  const Icon = drillType.icon;
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'emerald';
    if (score >= 60) return 'cyan';
    return 'amber';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ x: 4 }}
      className={`p-4 rounded-xl bg-gradient-to-r from-${drillType.color}-500/5 to-transparent border border-slate-800/50 hover:border-${drillType.color}-500/30 flex items-center gap-4 transition-all`}
    >
      <div className={`w-12 h-12 rounded-xl bg-${drillType.color}-500/10 border border-${drillType.color}-500/20 flex items-center justify-center`}>
        <Icon className={`w-6 h-6 text-${drillType.color}-400`} />
      </div>
      <div className="flex-1">
        <p className="text-white font-medium">{drillType.name}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-slate-500 text-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {session.duration}s
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500 text-sm">
            {new Date(session.createdAt?.toDate?.() || session.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      {session.score && (
        <div className={`px-4 py-2 rounded-xl bg-${getScoreColor(session.score)}-500/10 border border-${getScoreColor(session.score)}-500/20`}>
          <span className={`text-lg font-bold text-${getScoreColor(session.score)}-400`}>
            {session.score}
          </span>
          <span className="text-slate-500 text-sm">/100</span>
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PracticeMode = ({ apiKey }) => {
  const { sessions, stats, loading, saveSession } = usePractice();
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [showDurationSelector, setShowDurationSelector] = useState(false);
  const [activeDrill, setActiveDrill] = useState(null);

  const handleSelectDrill = (drill) => {
    setSelectedDrill(drill);
    setShowDurationSelector(true);
  };

  const handleSelectDuration = (duration) => {
    setShowDurationSelector(false);
    
    const prompts = DRILL_PROMPTS[selectedDrill.id];
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    setActiveDrill({
      drill: selectedDrill,
      duration,
      prompt
    });
  };

  const handleDrillComplete = async (result) => {
    await saveSession(result);
    setActiveDrill(null);
    setSelectedDrill(null);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center"
            >
              <Target className="w-7 h-7 text-cyan-400" />
            </motion.div>
            Practice Mode
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Sharpen your skills with targeted drills and real-time AI feedback</p>
        </div>
      </motion.div>

      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GradientStatCard icon={Target} label="Total Sessions" value={stats.totalSessions} color="cyan" />
          <GradientStatCard icon={Clock} label="Practice Time" value={Math.round(stats.totalTime / 60)} suffix="m" color="purple" />
          <GradientStatCard icon={Flame} label="Day Streak" value={stats.streak} color="orange" />
          <GradientStatCard icon={Star} label="Avg Score" value={stats.avgScore || '-'} color="emerald" />
        </div>
      )}

      {/* Drill Types */}
      <div>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-bold text-white mb-6 flex items-center gap-3"
        >
          <Zap className="w-5 h-5 text-amber-400" />
          Choose Your Drill
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {DRILL_TYPES.map((drill, index) => (
            <DrillCard key={drill.id} drill={drill} onSelect={handleSelectDrill} index={index} />
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-bold text-white mb-6 flex items-center gap-3"
        >
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Recent Practice
        </motion.h2>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Shimmer key={i} className="h-20" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/50 to-slate-900/30"
          >
            <EmptyPractice onStart={() => handleSelectDrill(DRILL_TYPES[0])} />
          </motion.div>
        ) : (
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session, i) => {
              const drillType = DRILL_TYPES.find(d => d.id === session.type) || DRILL_TYPES[0];
              return (
                <RecentSessionCard
                  key={session.id || i}
                  session={session}
                  drillType={drillType}
                  index={i}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showDurationSelector && selectedDrill && (
          <DurationSelector
            drill={selectedDrill}
            onSelect={handleSelectDuration}
            onCancel={() => {
              setShowDurationSelector(false);
              setSelectedDrill(null);
            }}
          />
        )}
        {activeDrill && (
          <DrillSession
            drill={activeDrill.drill}
            duration={activeDrill.duration}
            prompt={activeDrill.prompt}
            apiKey={apiKey}
            onComplete={handleDrillComplete}
            onCancel={() => {
              setActiveDrill(null);
              setSelectedDrill(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PracticeMode;
