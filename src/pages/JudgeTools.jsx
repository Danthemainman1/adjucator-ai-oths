import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Clock, Play, Pause, RotateCcw, Bell, Shuffle, FileText, Users, Timer, Volume2, VolumeX } from 'lucide-react'
import { Card, CardHeader, Button, Select, Input, Badge } from '../components/ui'
import { speechTimes, formatCategories } from '../utils/constants'
import { cn, formatTime } from '../utils/helpers'

const JudgeTools = () => {
  const [activeTab, setActiveTab] = useState('timer')
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Judge Tools</h1>
          <p className="text-slate-400 mt-1">Timers, generators, and debate management tools</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-800 pb-4">
        {[
          { id: 'timer', label: 'Timer', icon: Clock },
          { id: 'motion', label: 'Motion Generator', icon: FileText },
          { id: 'draw', label: 'Draw Generator', icon: Shuffle },
          { id: 'teams', label: 'Team Manager', icon: Users }
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'timer' && <TimerTool />}
      {activeTab === 'motion' && <MotionGenerator />}
      {activeTab === 'draw' && <DrawGenerator />}
      {activeTab === 'teams' && <TeamManager />}
    </div>
  )
}

// Timer Tool
const TimerTool = () => {
  const [format, setFormat] = useState('Public Forum (PF)')
  const [speechType, setSpeechType] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [protectedTime, setProtectedTime] = useState(60)
  const [warned, setWarned] = useState(false)
  
  const timerRef = useRef(null)
  const audioRef = useRef(null)

  // Get speech stages for the selected format
  const speechStages = speechTimes[format] 
    ? speechTimes[format].map(stage => ({
        value: stage.name,
        label: `${stage.name} (${Math.floor(stage.time / 60)}:${String(stage.time % 60).padStart(2, '0')})`
      }))
    : []

  // Get all format names for the dropdown
  const formatOptions = Object.keys(speechTimes).filter(f => f !== 'default').map(f => ({ value: f, label: f }))

  useEffect(() => {
    if (speechType && speechTimes[format]) {
      const stage = speechTimes[format].find(s => s.name === speechType)
      if (stage) {
        setTimeLeft(stage.time)
        setTotalTime(stage.time)
        setWarned(false)
      }
    }
  }, [speechType, format])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            if (soundEnabled) playSound('end')
            return 0
          }
          // Warning at 1 minute
          if (prev === 61 && !warned && soundEnabled) {
            playSound('warning')
            setWarned(true)
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [isRunning, soundEnabled, warned])

  const playSound = (type) => {
    if (!audioRef.current) {
      audioRef.current = new AudioContext()
    }
    const ctx = audioRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    if (type === 'warning') {
      oscillator.frequency.value = 800
      gainNode.gain.value = 0.3
      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.2)
    } else {
      oscillator.frequency.value = 600
      gainNode.gain.value = 0.3
      oscillator.start()
      setTimeout(() => {
        oscillator.frequency.value = 400
      }, 200)
      oscillator.stop(ctx.currentTime + 0.5)
    }
  }

  const progressPercent = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0
  const isProtected = timeLeft > (totalTime - protectedTime) || timeLeft < protectedTime
  const isOvertime = timeLeft <= 0 && isRunning === false && totalTime > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Timer Display */}
      <Card className="lg:col-span-2 p-8">
        <div className="text-center">
          {/* Timer Circle */}
          <div className="relative inline-flex items-center justify-center w-72 h-72 mb-8">
            <svg className="absolute w-full h-full -rotate-90">
              <circle
                cx="144"
                cy="144"
                r="130"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-800"
              />
              <circle
                cx="144"
                cy="144"
                r="130"
                fill="none"
                stroke="url(#timerGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 130}
                strokeDashoffset={2 * Math.PI * 130 * (1 - progressPercent / 100)}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center">
              <div className={cn(
                "text-5xl font-mono font-bold transition-colors",
                isOvertime ? "text-red-400" : "text-white"
              )}>
                {formatTime(timeLeft)}
              </div>
              {isProtected && timeLeft > 0 && (
                <Badge variant="secondary" className="mt-2 bg-amber-500/20 text-amber-400">
                  Protected Time
                </Badge>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => {
                setTimeLeft(totalTime)
                setIsRunning(false)
                setWarned(false)
              }}
              className="!rounded-full !w-12 !h-12"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              onClick={() => setIsRunning(!isRunning)}
              className={cn(
                "!rounded-full !w-20 !h-20",
                isRunning 
                  ? "bg-amber-500 hover:bg-amber-600" 
                  : "bg-gradient-to-br from-cyan-500 to-purple-600"
              )}
            >
              {isRunning ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="!rounded-full !w-12 !h-12"
            >
              {soundEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Settings Panel */}
      <Card className="p-6">
        <CardHeader title="Timer Settings" icon={<Clock className="h-5 w-5 text-cyan-400" />} />
        
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Format</label>
            <Select
              value={format}
              onChange={(e) => {
                setFormat(e.target.value)
                setSpeechType('')
              }}
              options={formatOptions}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Speech Type</label>
            <Select
              value={speechType}
              onChange={(e) => setSpeechType(e.target.value)}
              options={[{ value: '', label: 'Select speech...' }, ...speechStages]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Protected Time (seconds)
            </label>
            <Input
              type="number"
              value={protectedTime}
              onChange={(e) => setProtectedTime(parseInt(e.target.value) || 60)}
              min={0}
              max={120}
            />
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Quick Presets</h4>
            <div className="grid grid-cols-3 gap-2">
              {[5, 7, 8].map(mins => (
                <Button
                  key={mins}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTimeLeft(mins * 60)
                    setTotalTime(mins * 60)
                    setWarned(false)
                  }}
                >
                  {mins}m
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Motion Generator
const MotionGenerator = () => {
  const [category, setCategory] = useState('politics')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [motions, setMotions] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  const categories = [
    { value: 'politics', label: 'Politics & Governance' },
    { value: 'economics', label: 'Economics & Trade' },
    { value: 'social', label: 'Social Issues' },
    { value: 'ethics', label: 'Ethics & Philosophy' },
    { value: 'international', label: 'International Relations' },
    { value: 'technology', label: 'Technology & Science' },
    { value: 'environment', label: 'Environment' },
    { value: 'culture', label: 'Culture & Society' }
  ]

  const difficulties = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'championship', label: 'Championship' }
  ]

  const sampleMotions = {
    politics: [
      'This House Would implement mandatory voting',
      'This House Believes That political parties should be banned',
      'This House Would abolish the electoral college'
    ],
    economics: [
      'This House Would implement Universal Basic Income',
      'This House Believes That free trade does more harm than good',
      'This House Would nationalize Big Tech companies'
    ],
    social: [
      'This House Would legalize all drugs',
      'This House Believes That cancel culture does more harm than good',
      'This House Would abolish private education'
    ],
    ethics: [
      'This House Believes That the ends justify the means',
      'This House Would allow the sale of human organs',
      'This House Believes That humans have a moral obligation to colonize space'
    ],
    international: [
      'This House Would dissolve NATO',
      'This House Believes That economic sanctions are ineffective',
      'This House Would create a global minimum corporate tax'
    ],
    technology: [
      'This House Would ban facial recognition technology',
      'This House Believes That AI poses an existential threat to humanity',
      'This House Would make all software open source'
    ],
    environment: [
      'This House Would ban single-use plastics',
      'This House Believes That nuclear energy is the solution to climate change',
      'This House Would grant legal personhood to nature'
    ],
    culture: [
      'This House Would ban religious symbols in public spaces',
      'This House Believes That cultural appropriation is always wrong',
      'This House Would prioritize preserving minority languages'
    ]
  }

  const generateMotions = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const categoryMotions = sampleMotions[category] || sampleMotions.politics
      const shuffled = [...categoryMotions].sort(() => Math.random() - 0.5)
      setMotions(shuffled)
      setIsGenerating(false)
    }, 500)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-6">
        <CardHeader title="Generator Settings" icon={<FileText className="h-5 w-5 text-cyan-400" />} />
        
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categories}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              options={difficulties}
            />
          </div>

          <Button onClick={generateMotions} disabled={isGenerating} className="w-full">
            <Shuffle className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Motions'}
          </Button>
        </div>
      </Card>

      <Card className="lg:col-span-2 p-6">
        <CardHeader title="Generated Motions" />
        <div className="mt-4 space-y-3">
          {motions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Click "Generate Motions" to create debate topics</p>
            </div>
          ) : (
            motions.map((motion, i) => (
              <div
                key={i}
                className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-slate-200">{motion}</p>
                  <Badge variant="secondary" className="flex-shrink-0">
                    {i === 0 ? 'Main' : `Option ${i + 1}`}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

// Draw Generator
const DrawGenerator = () => {
  const [teams, setTeams] = useState('')
  const [format, setFormat] = useState('BP')
  const [draws, setDraws] = useState([])

  const generateDraw = () => {
    const teamList = teams.split('\n').filter(t => t.trim())
    if (teamList.length < 4) {
      alert('Please enter at least 4 teams')
      return
    }

    const shuffled = [...teamList].sort(() => Math.random() - 0.5)
    const positions = format === 'BP' 
      ? ['OG', 'OO', 'CG', 'CO']
      : ['Gov', 'Opp']
    
    const roomCount = Math.floor(shuffled.length / positions.length)
    const newDraws = []

    for (let i = 0; i < roomCount; i++) {
      const room = {
        room: `Room ${i + 1}`,
        teams: positions.map((pos, j) => ({
          position: pos,
          team: shuffled[i * positions.length + j] || 'BYE'
        }))
      }
      newDraws.push(room)
    }

    setDraws(newDraws)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <CardHeader title="Team Input" icon={<Users className="h-5 w-5 text-cyan-400" />} />
        
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Format</label>
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              options={[
                { value: 'BP', label: 'British Parliamentary (4 teams)' },
                { value: 'AP', label: 'Asian Parliamentary (2 teams)' }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Teams (one per line)
            </label>
            <textarea
              value={teams}
              onChange={(e) => setTeams(e.target.value)}
              placeholder="Team Alpha&#10;Team Beta&#10;Team Gamma&#10;Team Delta"
              rows={8}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>

          <Button onClick={generateDraw} className="w-full">
            <Shuffle className="h-4 w-4 mr-2" />
            Generate Draw
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <CardHeader title="Draw Results" />
        <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto">
          {draws.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Shuffle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter teams and generate a draw</p>
            </div>
          ) : (
            draws.map((room, i) => (
              <div key={i} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <h4 className="font-medium text-white mb-3">{room.room}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {room.teams.map((t, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Badge variant="secondary" className="w-12 justify-center">
                        {t.position}
                      </Badge>
                      <span className="text-sm text-slate-300">{t.team}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

// Team Manager
const TeamManager = () => {
  const [teams, setTeams] = useState([])
  const [newTeam, setNewTeam] = useState({ name: '', speaker1: '', speaker2: '' })

  const addTeam = () => {
    if (newTeam.name && newTeam.speaker1) {
      setTeams([...teams, { ...newTeam, id: Date.now(), wins: 0, losses: 0 }])
      setNewTeam({ name: '', speaker1: '', speaker2: '' })
    }
  }

  const removeTeam = (id) => {
    setTeams(teams.filter(t => t.id !== id))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <CardHeader title="Add Team" icon={<Users className="h-5 w-5 text-cyan-400" />} />
        
        <div className="mt-4 space-y-4">
          <Input
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            placeholder="Team Name"
          />
          <Input
            value={newTeam.speaker1}
            onChange={(e) => setNewTeam({ ...newTeam, speaker1: e.target.value })}
            placeholder="Speaker 1"
          />
          <Input
            value={newTeam.speaker2}
            onChange={(e) => setNewTeam({ ...newTeam, speaker2: e.target.value })}
            placeholder="Speaker 2 (optional)"
          />
          <Button onClick={addTeam} className="w-full">
            Add Team
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <CardHeader title="Teams" />
        <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
          {teams.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No teams added yet</p>
            </div>
          ) : (
            teams.map(team => (
              <div
                key={team.id}
                className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-white">{team.name}</p>
                  <p className="text-xs text-slate-500">
                    {team.speaker1}{team.speaker2 && ` & ${team.speaker2}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTeam(team.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

export default JudgeTools
