import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  Plus,
  Minus
} from 'lucide-react';

const PRESETS = [
  { label: '1 min', seconds: 60 },
  { label: '2 min', seconds: 120 },
  { label: '3 min', seconds: 180 },
  { label: '4 min', seconds: 240 },
  { label: '5 min', seconds: 300 },
  { label: '6 min', seconds: 360 },
  { label: '7 min', seconds: 420 },
  { label: '8 min', seconds: 480 }
];

const DebateClock = () => {
  const [totalSeconds, setTotalSeconds] = useState(300); // 5 min default
  const [timeLeft, setTimeLeft] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new AudioContext();
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // State update is fine here as it's within interval callback
            setIsRunning(false);
            if (soundEnabled) playBeep();
            return 0;
          }
          // Warning beep at 30 seconds
          if (prev === 31 && soundEnabled) playBeep(800, 0.1);
          // Warning beep at 10 seconds
          if (prev === 11 && soundEnabled) playBeep(600, 0.1);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, soundEnabled]);

  const playBeep = (freq = 440, duration = 0.3) => {
    if (!audioRef.current) return;
    try {
      const oscillator = audioRef.current.createOscillator();
      const gainNode = audioRef.current.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioRef.current.destination);
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioRef.current.currentTime + duration);
      oscillator.start(audioRef.current.currentTime);
      oscillator.stop(audioRef.current.currentTime + duration);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const toggleTimer = () => {
    if (audioRef.current?.state === 'suspended') {
      audioRef.current.resume();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalSeconds);
  };

  const setPreset = (seconds) => {
    setIsRunning(false);
    setTotalSeconds(seconds);
    setTimeLeft(seconds);
  };

  const adjustTime = (delta) => {
    const newTime = Math.max(10, Math.min(3600, totalSeconds + delta));
    setTotalSeconds(newTime);
    if (!isRunning) setTimeLeft(newTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft / totalSeconds;
  const isWarning = timeLeft <= 30 && timeLeft > 10;
  const isCritical = timeLeft <= 10;

  const getColor = () => {
    if (isCritical) return { ring: 'stroke-red-500', text: 'text-red-400', bg: 'bg-red-500/20' };
    if (isWarning) return { ring: 'stroke-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { ring: 'stroke-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/20' };
  };

  const colors = getColor();

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Debate Clock</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 transition-colors ${showSettings ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Timer Display */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Circular Progress */}
          <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-800"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              className={colors.ring}
              strokeDasharray={`${progress * 283} 283`}
              initial={false}
              animate={{ strokeDasharray: `${progress * 283} 283` }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className={`text-6xl font-mono font-bold ${colors.text}`}
              animate={{ scale: isCritical && isRunning ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: isCritical && isRunning ? Infinity : 0, duration: 1 }}
            >
              {formatTime(timeLeft)}
            </motion.div>
            <div className="text-slate-500 text-sm mt-2">
              {isRunning ? 'Running' : timeLeft === 0 ? 'Time!' : 'Paused'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={resetTimer}
            className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <button
            onClick={toggleTimer}
            className={`p-6 rounded-full transition-colors ${
              isRunning
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => adjustTime(30)}
              disabled={isRunning}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => adjustTime(-30)}
              disabled={isRunning}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Presets */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4"
          >
            <h3 className="text-white font-medium mb-3">Quick Presets</h3>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map(preset => (
                <button
                  key={preset.seconds}
                  onClick={() => setPreset(preset.seconds)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    totalSeconds === preset.seconds
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <label className="text-slate-400 text-sm mb-2 block">Custom Time (seconds)</label>
              <input
                type="number"
                min="10"
                max="3600"
                value={totalSeconds}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 60;
                  setTotalSeconds(val);
                  if (!isRunning) setTimeLeft(val);
                }}
                disabled={isRunning}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white disabled:opacity-50"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DebateClock;
