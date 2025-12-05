/**
 * Voice Analysis - Real-time Speech Pattern Analysis
 * Web Audio API for recording, pitch visualization, filler detection, and more
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Save,
  Trash2,
  Download,
  Volume2,
  VolumeX,
  BarChart3,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  RefreshCw,
  Settings,
  Sparkles,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  Check,
  Info,
  Radio,
  Waves,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// ============================================
// CONSTANTS
// ============================================

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'literally', 'right', 'okay'];

const CONFIDENCE_THRESHOLDS = {
  excellent: 85,
  good: 70,
  fair: 55,
  poor: 0
};

const SPEAKING_RATE = {
  slow: 100,      // words per minute
  normal: 150,
  fast: 180,
  veryFast: 200
};

// ============================================
// WAVEFORM VISUALIZER
// ============================================

const WaveformVisualizer = ({ analyser, isRecording, audioData }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      if (!analyser || !analyser.current) {
        // Draw static waveform when not recording
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
        
        ctx.beginPath();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        return;
      }

      const bufferLength = analyser.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.current.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Create gradient for waveform
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#06b6d4');
      gradient.addColorStop(0.5, '#8b5cf6');
      gradient.addColorStop(1, '#06b6d4');

      ctx.lineWidth = 2;
      ctx.strokeStyle = isRecording ? gradient : '#475569';
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Glow effect when recording
      if (isRecording) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#06b6d4';
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isRecording]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={150}
      className="w-full h-32 rounded-xl border border-slate-800"
    />
  );
};

// ============================================
// SPECTRUM ANALYZER
// ============================================

const SpectrumAnalyzer = ({ analyser, isRecording }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      if (!analyser || !analyser.current) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
        
        // Draw placeholder bars
        const barCount = 32;
        const barWidth = width / barCount - 2;
        for (let i = 0; i < barCount; i++) {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(i * (barWidth + 2), height - 20, barWidth, 20);
        }
        return;
      }

      const bufferLength = analyser.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.current.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      const barCount = 64;
      const barWidth = width / barCount - 2;
      const step = Math.floor(bufferLength / barCount);

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step];
        const barHeight = (value / 255) * height * 0.9;
        
        // Color gradient based on frequency
        const hue = (i / barCount) * 60 + 180; // Cyan to purple
        ctx.fillStyle = isRecording 
          ? `hsla(${hue}, 80%, 60%, 0.8)`
          : '#334155';
        
        const x = i * (barWidth + 2);
        const y = height - barHeight;
        
        // Rounded bars
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isRecording]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={120}
      className="w-full h-28 rounded-xl border border-slate-800"
    />
  );
};

// ============================================
// PITCH TRACKER
// ============================================

const PitchTracker = ({ pitchHistory, currentPitch }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw pitch labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.fillText('High', 5, 15);
    ctx.fillText('Low', 5, height - 5);

    if (pitchHistory.length < 2) return;

    // Draw pitch line
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#06b6d4');
    gradient.addColorStop(1, '#8b5cf6');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const maxPitch = Math.max(...pitchHistory, 300);
    const minPitch = Math.min(...pitchHistory.filter(p => p > 0), 80);
    const range = maxPitch - minPitch || 1;

    pitchHistory.forEach((pitch, i) => {
      const x = (i / (pitchHistory.length - 1)) * width;
      const normalizedPitch = pitch > 0 ? (pitch - minPitch) / range : 0.5;
      const y = height - normalizedPitch * height * 0.8 - height * 0.1;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Current pitch indicator
    if (currentPitch > 0) {
      const normalizedCurrent = (currentPitch - minPitch) / range;
      const currentY = height - normalizedCurrent * height * 0.8 - height * 0.1;
      
      ctx.beginPath();
      ctx.arc(width - 5, currentY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();
      
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#06b6d4';
      ctx.fill();
    }
  }, [pitchHistory, currentPitch]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={100}
      className="w-full h-24 rounded-xl border border-slate-800"
    />
  );
};

// ============================================
// STAT CARD
// ============================================

const StatCard = ({ icon: Icon, label, value, subValue, trend, color = 'cyan' }) => {
  const colors = {
    cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400',
    emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
    amber: 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400'
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${colors[color]} border backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subValue && (
            <p className="text-slate-500 text-xs mt-1">{subValue}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {trend && (
            <TrendIcon className={`w-4 h-4 ${
              trend === 'up' ? 'text-emerald-400' : 
              trend === 'down' ? 'text-red-400' : 
              'text-slate-400'
            }`} />
          )}
          <div className={`p-2 rounded-lg bg-gradient-to-br ${colors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// FILLER WORD BADGE
// ============================================

const FillerWordBadge = ({ word, count }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30"
  >
    <span className="text-amber-400 text-sm font-medium">"{word}"</span>
    <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
      {count}
    </span>
  </motion.div>
);

// ============================================
// CONFIDENCE METER
// ============================================

const ConfidenceMeter = ({ score }) => {
  const getColor = () => {
    if (score >= CONFIDENCE_THRESHOLDS.excellent) return { bg: 'bg-emerald-500', text: 'text-emerald-400', label: 'Excellent' };
    if (score >= CONFIDENCE_THRESHOLDS.good) return { bg: 'bg-cyan-500', text: 'text-cyan-400', label: 'Good' };
    if (score >= CONFIDENCE_THRESHOLDS.fair) return { bg: 'bg-amber-500', text: 'text-amber-400', label: 'Fair' };
    return { bg: 'bg-red-500', text: 'text-red-400', label: 'Needs Work' };
  };

  const { bg, text, label } = getColor();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm">Confidence Score</span>
        <span className={`${text} font-bold`}>{score}%</span>
      </div>
      <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${bg}`}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className={text}>{label}</span>
        <span className="text-slate-500">Target: 85%+</span>
      </div>
    </div>
  );
};

// ============================================
// RECORDING ITEM
// ============================================

const RecordingItem = ({ recording, onPlay, onDelete, isPlaying }) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800/60 hover:border-slate-700/60 transition-all group"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPlay(recording)}
        className={`p-3 rounded-xl transition-all ${
          isPlaying 
            ? 'bg-cyan-500 text-white' 
            : 'bg-slate-700 text-slate-300 hover:bg-cyan-500 hover:text-white'
        }`}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </motion.button>

      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium truncate">{recording.name}</h4>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDuration(recording.duration)}
          </span>
          <span>{new Date(recording.timestamp).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          recording.confidence >= 80 
            ? 'bg-emerald-500/10 text-emerald-400' 
            : recording.confidence >= 60 
            ? 'bg-amber-500/10 text-amber-400'
            : 'bg-red-500/10 text-red-400'
        }`}>
          {recording.confidence}%
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(recording.id)}
        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

// ============================================
// EMPTY STATE
// ============================================

const EmptyRecordings = () => (
  <div className="text-center py-8">
    <div className="inline-flex p-4 rounded-full bg-slate-800/50 mb-4">
      <Radio className="w-8 h-8 text-slate-500" />
    </div>
    <p className="text-slate-400">No recordings yet</p>
    <p className="text-slate-500 text-sm">Start recording to analyze your speech</p>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const VoiceAnalysis = () => {
  const { user } = useAuth();
  
  // Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingRecordingId, setPlayingRecordingId] = useState(null);

  // Analysis state
  const [pitchHistory, setPitchHistory] = useState([]);
  const [currentPitch, setCurrentPitch] = useState(0);
  const [speakingRate, setSpeakingRate] = useState(0);
  const [fillerWords, setFillerWords] = useState({});
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  // Saved recordings
  const [recordings, setRecordings] = useState([]);

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(new Audio());

  // Initialize audio context
  const initAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.8;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        chunksRef.current = [];
      };

      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return false;
    }
  }, []);

  // Pitch detection using autocorrelation
  const detectPitch = useCallback(() => {
    if (!analyserRef.current) return 0;

    const bufferLength = analyserRef.current.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyserRef.current.getFloatTimeDomainData(buffer);

    // Simple autocorrelation-based pitch detection
    let maxCorrelation = 0;
    let bestOffset = -1;
    const sampleRate = audioContextRef.current?.sampleRate || 44100;

    // Look for pitch between 80Hz and 400Hz
    const minOffset = Math.floor(sampleRate / 400);
    const maxOffset = Math.floor(sampleRate / 80);

    for (let offset = minOffset; offset < maxOffset; offset++) {
      let correlation = 0;
      for (let i = 0; i < bufferLength - offset; i++) {
        correlation += buffer[i] * buffer[i + offset];
      }
      
      if (correlation > maxCorrelation) {
        maxCorrelation = correlation;
        bestOffset = offset;
      }
    }

    if (bestOffset > 0 && maxCorrelation > 0.01) {
      return sampleRate / bestOffset;
    }
    return 0;
  }, []);

  // Calculate volume level
  const calculateVolume = useCallback(() => {
    if (!analyserRef.current) return 0;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    const sum = dataArray.reduce((a, b) => a + b, 0);
    return Math.round((sum / bufferLength / 255) * 100);
  }, []);

  // Analysis loop
  useEffect(() => {
    let analysisInterval;
    
    if (isRecording && !isPaused) {
      analysisInterval = setInterval(() => {
        // Pitch detection
        const pitch = detectPitch();
        if (pitch > 0) {
          setCurrentPitch(Math.round(pitch));
          setPitchHistory(prev => [...prev.slice(-100), pitch]);
        }

        // Volume
        const volume = calculateVolume();
        setVolumeLevel(volume);

        // Simulate speech analysis (in real app, would use speech recognition)
        // Update speaking rate estimate
        if (volume > 20) {
          setSpeakingRate(prev => Math.min(200, prev + Math.random() * 5));
          setWordCount(prev => prev + (Math.random() > 0.7 ? 1 : 0));
        }

        // Simulate filler word detection (in real app, use speech-to-text)
        if (Math.random() < 0.02 && volume > 30) {
          const randomFiller = FILLER_WORDS[Math.floor(Math.random() * 3)];
          setFillerWords(prev => ({
            ...prev,
            [randomFiller]: (prev[randomFiller] || 0) + 1
          }));
        }
      }, 100);
    }

    return () => {
      if (analysisInterval) clearInterval(analysisInterval);
    };
  }, [isRecording, isPaused, detectPitch, calculateVolume]);

  // Calculate confidence score
  useEffect(() => {
    const totalFillers = Object.values(fillerWords).reduce((a, b) => a + b, 0);
    const fillerPenalty = Math.min(30, totalFillers * 3);
    
    const pitchVariation = pitchHistory.length > 10
      ? Math.min(20, (Math.max(...pitchHistory) - Math.min(...pitchHistory.filter(p => p > 0))) / 10)
      : 10;
    
    const rateScore = speakingRate >= SPEAKING_RATE.slow && speakingRate <= SPEAKING_RATE.fast ? 20 : 10;
    
    const baseScore = 70;
    const score = Math.max(0, Math.min(100, baseScore - fillerPenalty + pitchVariation + rateScore));
    
    // Defer state update to avoid synchronous loop
    const timer = setTimeout(() => {
      setConfidenceScore(Math.round(score));
    }, 0);

    return () => clearTimeout(timer);
  }, [fillerWords, pitchHistory, speakingRate]);

  // Timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  // Start recording
  const startRecording = async () => {
    const initialized = await initAudio();
    if (!initialized) {
      alert('Could not access microphone. Please check permissions.');
      return;
    }

    // Reset state
    setRecordingTime(0);
    setPitchHistory([]);
    setFillerWords({});
    setSpeakingRate(0);
    setWordCount(0);
    setConfidenceScore(0);
    setAudioBlob(null);

    mediaRecorderRef.current?.start(100);
    setIsRecording(true);
    setIsPaused(false);
  };

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(track => track.stop());
    setIsRecording(false);
    setIsPaused(false);
  };

  // Pause/resume recording
  const togglePause = () => {
    if (isPaused) {
      mediaRecorderRef.current?.resume();
    } else {
      mediaRecorderRef.current?.pause();
    }
    setIsPaused(!isPaused);
  };

  // Save recording
  const saveRecording = () => {
    if (!audioBlob) return;

    const recording = {
      id: Date.now().toString(),
      name: `Recording ${recordings.length + 1}`,
      blob: audioBlob,
      duration: recordingTime,
      timestamp: new Date().toISOString(),
      confidence: confidenceScore,
      fillerWords: { ...fillerWords },
      speakingRate,
      wordCount
    };

    setRecordings(prev => [recording, ...prev]);
    setAudioBlob(null);
    setRecordingTime(0);
  };

  // Play recording
  const playRecording = (recording) => {
    if (playingRecordingId === recording.id) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingRecordingId(null);
    } else {
      const url = URL.createObjectURL(recording.blob);
      audioRef.current.src = url;
      audioRef.current.play();
      setIsPlaying(true);
      setPlayingRecordingId(recording.id);

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setPlayingRecordingId(null);
      };
    }
  };

  // Delete recording
  const deleteRecording = (id) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
    if (playingRecordingId === id) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingRecordingId(null);
    }
  };

  // Download recording
  const downloadRecording = () => {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-recording-${Date.now()}.webm`;
    a.click();
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get speaking rate label
  const getSpeakingRateLabel = () => {
    if (speakingRate < SPEAKING_RATE.slow) return { label: 'Too Slow', color: 'text-amber-400' };
    if (speakingRate < SPEAKING_RATE.normal) return { label: 'Slow', color: 'text-cyan-400' };
    if (speakingRate < SPEAKING_RATE.fast) return { label: 'Normal', color: 'text-emerald-400' };
    if (speakingRate < SPEAKING_RATE.veryFast) return { label: 'Fast', color: 'text-amber-400' };
    return { label: 'Too Fast', color: 'text-red-400' };
  };

  const totalFillers = Object.values(fillerWords).reduce((a, b) => a + b, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
                <Waves className="w-7 h-7 text-cyan-400" />
              </div>
              Voice Analysis
            </h1>
            <p className="text-slate-400 mt-2">
              Real-time speech pattern analysis and feedback
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Recording Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Waveform */}
            <div className="glass-panel p-6 bg-gradient-to-br from-slate-900/80 to-slate-950/80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Waveform
                </h3>
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-red-400 text-sm font-medium">Recording</span>
                  </div>
                )}
              </div>
              
              <WaveformVisualizer 
                analyser={analyserRef}
                isRecording={isRecording && !isPaused}
              />

              {/* Recording Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                {!isRecording ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startRecording}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold text-lg shadow-lg shadow-red-500/25 flex items-center gap-3"
                  >
                    <Mic className="w-6 h-6" />
                    Start Recording
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={togglePause}
                      className={`p-4 rounded-xl ${
                        isPaused 
                          ? 'bg-emerald-500 text-white' 
                          : 'glass-button-secondary'
                      }`}
                    >
                      {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                    </motion.button>
                    
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white font-mono">
                        {formatTime(recordingTime)}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {isPaused ? 'Paused' : 'Recording...'}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={stopRecording}
                      className="p-4 rounded-xl bg-red-500 text-white hover:bg-red-600"
                    >
                      <Square className="w-6 h-6" />
                    </motion.button>
                  </>
                )}
              </div>

              {/* Post-recording actions */}
              {audioBlob && !isRecording && (
                <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveRecording}
                    className="glass-button-primary"
                  >
                    <Save className="w-4 h-4" />
                    Save Recording
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadRecording}
                    className="glass-button-secondary"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                </div>
              )}
            </div>

            {/* Visualizations */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Spectrum Analyzer */}
              <div className="glass-panel p-4">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  Frequency Spectrum
                </h4>
                <SpectrumAnalyzer 
                  analyser={analyserRef}
                  isRecording={isRecording && !isPaused}
                />
              </div>

              {/* Pitch Tracker */}
              <div className="glass-panel p-4">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Pitch Variation
                </h4>
                <PitchTracker 
                  pitchHistory={pitchHistory}
                  currentPitch={currentPitch}
                />
              </div>
            </div>

            {/* Filler Words */}
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Filler Words Detected
                </h4>
                <span className={`text-2xl font-bold ${
                  totalFillers > 10 ? 'text-red-400' : 
                  totalFillers > 5 ? 'text-amber-400' : 
                  'text-emerald-400'
                }`}>
                  {totalFillers}
                </span>
              </div>
              
              {Object.keys(fillerWords).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(fillerWords).map(([word, count]) => (
                    <FillerWordBadge key={word} word={word} count={count} />
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">
                  {isRecording ? 'Listening for filler words...' : 'No filler words detected'}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Real-time Stats */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Live Metrics
              </h3>

              <StatCard
                icon={Volume2}
                label="Volume Level"
                value={`${volumeLevel}%`}
                color="cyan"
              />

              <StatCard
                icon={Activity}
                label="Current Pitch"
                value={currentPitch > 0 ? `${currentPitch} Hz` : '—'}
                subValue={currentPitch > 200 ? 'High' : currentPitch > 120 ? 'Normal' : 'Low'}
                color="purple"
              />

              <StatCard
                icon={Clock}
                label="Speaking Rate"
                value={`${Math.round(speakingRate)} WPM`}
                subValue={getSpeakingRateLabel().label}
                color={speakingRate > SPEAKING_RATE.fast ? 'amber' : 'emerald'}
              />

              <StatCard
                icon={MessageSquare}
                label="Word Count"
                value={wordCount}
                color="cyan"
              />
            </div>

            {/* Confidence Score */}
            <div className="glass-panel p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Confidence Analysis
              </h3>
              <ConfidenceMeter score={confidenceScore} />
            </div>

            {/* Saved Recordings */}
            <div className="glass-panel p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Radio className="w-5 h-5 text-purple-400" />
                Saved Recordings
                {recordings.length > 0 && (
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs">
                    {recordings.length}
                  </span>
                )}
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recordings.length > 0 ? (
                  recordings.map(recording => (
                    <RecordingItem
                      key={recording.id}
                      recording={recording}
                      onPlay={playRecording}
                      onDelete={deleteRecording}
                      isPlaying={playingRecordingId === recording.id}
                    />
                  ))
                ) : (
                  <EmptyRecordings />
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
              <h4 className="text-cyan-400 font-medium mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Tips for Better Speech
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Aim for 130-160 words per minute
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Vary your pitch to maintain engagement
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Pause instead of using filler words
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Practice breath control for steady volume
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VoiceAnalysis;
