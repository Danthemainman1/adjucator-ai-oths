import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Mic, Square, Play, Pause, RotateCcw, Lightbulb, AlertTriangle, TrendingUp, Volume2 } from 'lucide-react'
import { Card, CardHeader, Button, Badge, Select, Progress } from '../components/ui'
import { useAppStore } from '../store'
import { speechTimes } from '../utils/constants'
import { callGeminiAPI, callOpenAIAPI } from '../utils/api'
import { cn, formatTime } from '../utils/helpers'

const LiveCoaching = () => {
  const { settings } = useAppStore()
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [format, setFormat] = useState('BP')
  const [transcript, setTranscript] = useState('')
  const [liveCoachingTips, setLiveCoachingTips] = useState([])
  const [fillerWords, setFillerWords] = useState({ um: 0, uh: 0, like: 0, you_know: 0, basically: 0 })
  const [speechMetrics, setSpeechMetrics] = useState({ pace: 0, volume: 0, clarity: 0 })
  const [audioData, setAudioData] = useState([])
  
  const mediaRecorderRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const timerRef = useRef(null)
  const recognitionRef = useRef(null)
  const audioChunksRef = useRef([])

  // Get allocated time for format
  const getAllocatedTime = () => {
    const formatTimes = speechTimes[format]
    if (!formatTimes) return 420 // 7 mins default
    const timeStr = Object.values(formatTimes)[0]
    const match = timeStr.match(/(\d+)/)
    return match ? parseInt(match[1]) * 60 : 420
  }

  const allocatedTime = getAllocatedTime()

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
            // Detect filler words
            detectFillerWords(result[0].transcript)
          } else {
            interimTranscript += result[0].transcript
          }
        }

        setTranscript(prev => prev + finalTranscript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'no-speech') {
          // Restart recognition
          if (isRecording && !isPaused) {
            recognitionRef.current.start()
          }
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isRecording, isPaused])

  // Detect filler words
  const detectFillerWords = (text) => {
    const lower = text.toLowerCase()
    const patterns = {
      um: /\bum+\b/g,
      uh: /\buh+\b/g,
      like: /\blike\b/g,
      you_know: /\byou know\b/g,
      basically: /\bbasically\b/g
    }

    setFillerWords(prev => ({
      um: prev.um + (lower.match(patterns.um) || []).length,
      uh: prev.uh + (lower.match(patterns.uh) || []).length,
      like: prev.like + (lower.match(patterns.like) || []).length,
      you_know: prev.you_know + (lower.match(patterns.you_know) || []).length,
      basically: prev.basically + (lower.match(patterns.basically) || []).length
    }))
  }

  // Audio visualization
  const startAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      
      // Also set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data)
      }
      mediaRecorderRef.current.start(1000) // Collect data every second

      // Start visualization loop
      const visualize = () => {
        if (!isRecording || isPaused) return
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(dataArray)
        
        // Calculate average volume
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
        setSpeechMetrics(prev => ({
          ...prev,
          volume: Math.round(avg / 2.55), // Convert to percentage
          pace: Math.round(transcript.split(' ').length / (duration / 60) || 0)
        }))

        // Update waveform data
        setAudioData(Array.from(dataArray.slice(0, 32)))
        
        requestAnimationFrame(visualize)
      }
      visualize()

    } catch (err) {
      console.error('Error accessing microphone:', err)
    }
  }

  // Timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [isRecording, isPaused])

  // Generate live coaching tip
  const generateCoachingTip = async () => {
    if (transcript.length < 50) return
    
    const prompt = `You are a live speech coach for a ${format} debate. Based on this partial transcript, provide ONE brief, actionable tip (max 20 words):

"${transcript.slice(-500)}"

Focus on: argumentation, structure, or delivery. Be encouraging but direct.`

    try {
      const response = settings.apiProvider === 'openai'
        ? await callOpenAIAPI(settings.apiKey, prompt, settings.model)
        : await callGeminiAPI(settings.apiKey, prompt, settings.model)
      
      if (response) {
        setLiveCoachingTips(prev => [...prev.slice(-4), {
          id: Date.now(),
          text: response.slice(0, 100),
          timestamp: duration
        }])
      }
    } catch (err) {
      console.error('Error generating tip:', err)
    }
  }

  // Generate tips periodically
  useEffect(() => {
    if (isRecording && !isPaused && duration > 0 && duration % 30 === 0) {
      generateCoachingTip()
    }
  }, [duration, isRecording, isPaused])

  // Start recording
  const handleStart = async () => {
    setIsRecording(true)
    setIsPaused(false)
    await startAudioAnalysis()
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (e) {
        // Recognition might already be started
      }
    }
  }

  // Pause recording
  const handlePause = () => {
    setIsPaused(true)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
    }
    clearInterval(timerRef.current)
  }

  // Resume recording
  const handleResume = () => {
    setIsPaused(false)
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
    }
  }

  // Stop recording
  const handleStop = () => {
    setIsRecording(false)
    setIsPaused(false)
    clearInterval(timerRef.current)
    
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
  }

  // Reset everything
  const handleReset = () => {
    handleStop()
    setDuration(0)
    setTranscript('')
    setLiveCoachingTips([])
    setFillerWords({ um: 0, uh: 0, like: 0, you_know: 0, basically: 0 })
    setSpeechMetrics({ pace: 0, volume: 0, clarity: 0 })
    setAudioData([])
    audioChunksRef.current = []
  }

  const progressPercent = Math.min((duration / allocatedTime) * 100, 100)
  const isOverTime = duration > allocatedTime
  const totalFillers = Object.values(fillerWords).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Coaching</h1>
          <p className="text-slate-400 mt-1">Real-time feedback and speech analysis</p>
        </div>
        <Select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          options={Object.keys(speechTimes).map(f => ({ value: f, label: f }))}
          className="w-32"
        />
      </div>

      {/* Main Recording Area */}
      <Card className="p-8">
        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className={cn(
            "text-6xl font-mono font-bold mb-2 transition-colors",
            isOverTime ? "text-red-400" : "text-white"
          )}>
            {formatTime(duration)}
          </div>
          <div className="text-slate-400 text-sm">
            Allocated: {formatTime(allocatedTime)}
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 max-w-md mx-auto">
            <Progress 
              value={progressPercent} 
              className={cn(isOverTime && "[&>div]:bg-red-500")}
            />
          </div>
        </div>

        {/* Waveform Visualization */}
        <div className="flex items-end justify-center h-24 gap-1 mb-8 bg-slate-900/50 rounded-2xl p-4">
          {audioData.length > 0 ? (
            audioData.map((value, i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(4, value / 3)}px` }}
              />
            ))
          ) : (
            // Placeholder bars
            Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-4 bg-slate-700 rounded-full"
              />
            ))
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isRecording ? (
            <Button
              size="lg"
              onClick={handleStart}
              className="!rounded-full !w-16 !h-16 bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
            >
              <Mic className="h-6 w-6" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={handleReset}
                className="!rounded-full !w-12 !h-12"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              
              {isPaused ? (
                <Button
                  size="lg"
                  onClick={handleResume}
                  className="!rounded-full !w-16 !h-16 bg-gradient-to-br from-green-500 to-emerald-600"
                >
                  <Play className="h-6 w-6" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handlePause}
                  className="!rounded-full !w-16 !h-16 bg-gradient-to-br from-amber-500 to-orange-600"
                >
                  <Pause className="h-6 w-6" />
                </Button>
              )}
              
              <Button
                variant="destructive"
                onClick={handleStop}
                className="!rounded-full !w-12 !h-12"
              >
                <Square className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Speech Pace */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="text-sm text-slate-400">Speaking Pace</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {speechMetrics.pace} <span className="text-lg text-slate-400">wpm</span>
          </div>
          <div className="text-xs text-slate-500">
            {speechMetrics.pace < 100 ? 'Speaking slowly' : 
             speechMetrics.pace > 160 ? 'Speaking quickly' : 'Good pace'}
          </div>
        </Card>

        {/* Volume Level */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Volume2 className="h-5 w-5 text-purple-400" />
            </div>
            <span className="text-sm text-slate-400">Volume</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {speechMetrics.volume}%
          </div>
          <Progress value={speechMetrics.volume} className="mt-2" />
        </Card>

        {/* Filler Words */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <span className="text-sm text-slate-400">Filler Words</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {totalFillers}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(fillerWords).map(([word, count]) => count > 0 && (
              <Badge key={word} variant="secondary" className="text-xs">
                {word.replace('_', ' ')}: {count}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Live Coaching Tips & Transcript */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Tips */}
        <Card>
          <CardHeader
            title="Live Coaching Tips"
            icon={<Lightbulb className="h-5 w-5 text-amber-400" />}
          />
          <div className="p-4 space-y-3">
            {liveCoachingTips.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Tips will appear as you speak...</p>
              </div>
            ) : (
              liveCoachingTips.map((tip) => (
                <div
                  key={tip.id}
                  className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl animate-fadeIn"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-200">{tip.text}</p>
                      <span className="text-xs text-slate-500 mt-1">
                        at {formatTime(tip.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Live Transcript */}
        <Card>
          <CardHeader
            title="Live Transcript"
            icon={<Mic className="h-5 w-5 text-cyan-400" />}
          />
          <div className="p-4">
            <div className="h-64 overflow-y-auto bg-slate-900/50 rounded-xl p-4 font-mono text-sm">
              {transcript || (
                <span className="text-slate-500 italic">
                  Your speech will appear here in real-time...
                </span>
              )}
              {isRecording && !isPaused && (
                <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
              )}
            </div>
            <div className="mt-2 text-xs text-slate-500 flex justify-between">
              <span>{transcript.split(' ').filter(Boolean).length} words</span>
              <span>{transcript.length} characters</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LiveCoaching
