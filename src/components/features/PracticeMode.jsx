/**
 * Practice Mode & Drills
 * Timed drills, response practice, and skill building
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
  Shuffle
} from 'lucide-react';
import { usePractice } from '../../hooks/useDebateData';
import { useAuth } from '../../contexts/AuthContext';
import { callGeminiAPI } from '../../utils/api';

// Drill Types
const DRILL_TYPES = [
  {
    id: 'timed-response',
    name: 'Timed Response',
    description: 'Practice speaking for set durations',
    icon: Clock,
    color: 'cyan',
    durations: [30, 60, 120, 180, 240]
  },
  {
    id: 'refutation',
    name: 'Argument Refutation',
    description: 'Counter arguments under pressure',
    icon: Target,
    color: 'purple',
    durations: [30, 60]
  },
  {
    id: 'cross-ex',
    name: 'Cross Examination',
    description: 'Practice CX questions & answers',
    icon: MessageSquare,
    color: 'orange',
    durations: [180]
  },
  {
    id: 'impromptu',
    name: 'Impromptu Topics',
    description: 'Random topics, minimal prep',
    icon: Shuffle,
    color: 'emerald',
    durations: [120, 180, 300]
  }
];

// Sample prompts for different drill types
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

// Empty State
const EmptyPractice = ({ onStart }) => (
  <div className="text-center py-16">
    <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6 mx-auto w-fit">
      <Target className="w-12 h-12 text-slate-500" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">Ready to Practice?</h3>
    <p className="text-slate-400 max-w-md mx-auto mb-6">
      Sharpen your skills with timed drills, refutation practice, and cross-examination simulations.
    </p>
    <button
      onClick={onStart}
      className="px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium hover:bg-cyan-500/20 transition-all inline-flex items-center gap-2"
    >
      <Play className="w-5 h-5" />
      Start Your First Drill
    </button>
  </div>
);

// Timer Component
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
    if (progress > 50) return 'text-cyan-400';
    if (progress > 25) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="relative">
      <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-slate-800"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          strokeDasharray={`${progress * 2.83} 283`}
          className={getColor()}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold tracking-tight ${getColor()}`}>
          {formatTime(timeLeft)}
        </span>
        <span className="text-slate-500 text-sm mt-1">remaining</span>
      </div>
    </div>
  );
};

// Drill Card
const DrillCard = ({ drill, onSelect }) => {
  const Icon = drill.icon;
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(drill)}
      className={`w-full p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 hover:border-${drill.color}-500/50 hover:bg-slate-800/30 transition-all text-left group`}
    >
      <div className={`w-14 h-14 rounded-xl bg-${drill.color}-500/10 border border-${drill.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-7 h-7 text-${drill.color}-400`} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{drill.name}</h3>
      <p className="text-slate-400 text-sm mb-4">{drill.description}</p>
      <div className="flex items-center gap-2">
        {drill.durations.slice(0, 3).map(d => (
          <span key={d} className="px-2 py-1 rounded-lg bg-slate-800/50 text-slate-400 text-xs">
            {d < 60 ? `${d}s` : `${d / 60}m`}
          </span>
        ))}
        {drill.durations.length > 3 && (
          <span className="text-slate-500 text-xs">+{drill.durations.length - 3} more</span>
        )}
      </div>
    </motion.button>
  );
};

// Active Drill Session
const DrillSession = ({ drill, duration, prompt, onComplete, onCancel, apiKey }) => {
  const [phase, setPhase] = useState('prep'); // prep, active, review
  const [isRunning, setIsRunning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [prepTime, setPrepTime] = useState(15);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Speech recognition
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

    // Analyze if we have a transcript and API key
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
      } catch (err) {
        console.error('Analysis error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveAndExit = () => {
    onComplete({
      type: drill.id,
      duration,
      prompt,
      transcript,
      analysis,
      score: analysis ? extractScore(analysis) : null
    });
  };

  const extractScore = (text) => {
    const match = text.match(/Overall Score[:\s]*(\d+)/i);
    return match ? parseInt(match[1]) * 10 : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              {React.createElement(drill.icon, { className: `w-6 h-6 text-${drill.color}-400` })}
              {drill.name}
            </h2>
            <p className="text-slate-400 mt-1">
              {phase === 'prep' && 'Prepare your response'}
              {phase === 'active' && 'Speak now!'}
              {phase === 'review' && 'Review your performance'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            Exit
          </button>
        </div>

        {/* Prompt */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 mb-8">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Your Prompt</h3>
          <p className="text-xl text-white font-medium">
            {typeof prompt === 'object' ? prompt.claim || prompt.topic : prompt}
          </p>
          {typeof prompt === 'object' && prompt.role && (
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
              prompt.role === 'questioner' 
                ? 'bg-purple-500/10 text-purple-400' 
                : 'bg-cyan-500/10 text-cyan-400'
            }`}>
              Role: {prompt.role}
            </span>
          )}
        </div>

        {/* Timer / Content Area */}
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          {phase === 'prep' && (
            <div className="text-center">
              <div className="text-6xl font-bold text-cyan-400 mb-4">{prepTime}</div>
              <p className="text-slate-400 mb-8">seconds to prepare</p>
              <div className="flex items-center gap-4 justify-center">
                <button
                  onClick={() => {
                    setPhase('active');
                    setIsRunning(true);
                    startRecording();
                  }}
                  className="px-8 py-4 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-400 transition-colors flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start Speaking
                </button>
                <button
                  onClick={() => setPrepTime(Math.max(5, prepTime - 5))}
                  className="px-4 py-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  -5s
                </button>
                <button
                  onClick={() => setPrepTime(prepTime + 5)}
                  className="px-4 py-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  +5s
                </button>
              </div>
            </div>
          )}

          {phase === 'active' && (
            <div className="text-center">
              <DrillTimer
                duration={duration}
                isRunning={isRunning}
                onComplete={handleDrillComplete}
              />
              
              {/* Recording Indicator */}
              <div className="flex items-center justify-center gap-3 mt-8">
                {isRecording ? (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-400">Recording...</span>
                  </>
                ) : (
                  <>
                    <MicOff className="w-5 h-5 text-slate-500" />
                    <span className="text-slate-500">Microphone off</span>
                  </>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 justify-center mt-6">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                    isRunning 
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' 
                      : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isRunning ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={handleDrillComplete}
                  className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Finish Early
                </button>
              </div>

              {/* Live Transcript */}
              {transcript && (
                <div className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 max-h-32 overflow-y-auto">
                  <p className="text-slate-300 text-sm text-left">{transcript}</p>
                </div>
              )}
            </div>
          )}

          {phase === 'review' && (
            <div className="w-full space-y-6">
              {/* Transcript */}
              {transcript && (
                <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Your Response</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{transcript}</p>
                </div>
              )}

              {/* Analysis */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <span className="text-slate-400 ml-3">Analyzing your response...</span>
                </div>
              ) : analysis ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <h4 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    AI Analysis
                  </h4>
                  <div className="text-slate-300 text-sm whitespace-pre-wrap">{analysis}</div>
                </div>
              ) : !transcript ? (
                <div className="text-center py-8 text-slate-400">
                  <MicOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No speech detected. Make sure your microphone is enabled.
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setPhase('prep');
                    setTranscript('');
                    setAnalysis(null);
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Again
                </button>
                <button
                  onClick={handleSaveAndExit}
                  className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-400 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Save & Exit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Duration Selector Modal
const DurationSelector = ({ drill, onSelect, onCancel }) => {
  const Icon = drill.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6"
      >
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-xl bg-${drill.color}-500/10 border border-${drill.color}-500/20 flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`w-8 h-8 text-${drill.color}-400`} />
          </div>
          <h2 className="text-xl font-bold text-white">{drill.name}</h2>
          <p className="text-slate-400 text-sm mt-1">Select duration</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {drill.durations.map(d => (
            <button
              key={d}
              onClick={() => onSelect(d)}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all text-center"
            >
              <span className="text-2xl font-bold text-white">
                {d < 60 ? d : d / 60}
              </span>
              <span className="text-slate-400 text-sm ml-1">
                {d < 60 ? 'seconds' : 'minutes'}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="w-full mt-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

// Stats Card
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className={`p-4 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 text-${color}-400`} />
      <div>
        <p className={`text-xl font-bold text-${color}-400`}>{value}</p>
        <p className="text-slate-400 text-xs">{label}</p>
      </div>
    </div>
  </div>
);

// Main Component
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
    
    // Get random prompt
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
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Target className="w-8 h-8 text-cyan-400" />
          Practice Mode
        </h1>
        <p className="text-slate-400 mt-1">Sharpen your skills with targeted drills</p>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <StatsCard icon={Target} label="Total Sessions" value={stats.totalSessions} color="cyan" />
          <StatsCard icon={Clock} label="Practice Time" value={`${Math.round(stats.totalTime / 60)}m`} color="purple" />
          <StatsCard icon={Flame} label="Day Streak" value={stats.streak} color="orange" />
          <StatsCard icon={Star} label="Avg Score" value={stats.avgScore || '-'} color="emerald" />
        </div>
      )}

      {/* Drill Types */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Choose a Drill</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DRILL_TYPES.map(drill => (
            <DrillCard key={drill.id} drill={drill} onSelect={handleSelectDrill} />
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Practice</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/30">
            <EmptyPractice onStart={() => handleSelectDrill(DRILL_TYPES[0])} />
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session, i) => {
              const drillType = DRILL_TYPES.find(d => d.id === session.type) || DRILL_TYPES[0];
              const Icon = drillType.icon;
              return (
                <div key={session.id || i} className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-${drillType.color}-500/10 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${drillType.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{drillType.name}</p>
                    <p className="text-slate-500 text-sm">
                      {session.duration}s • {new Date(session.createdAt?.toDate?.() || session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {session.score && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      session.score >= 80 ? 'bg-emerald-500/10 text-emerald-400' :
                      session.score >= 60 ? 'bg-cyan-500/10 text-cyan-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {session.score}/100
                    </span>
                  )}
                </div>
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
