import React, { useEffect } from 'react'
import { useAppStore } from '../store'
import { Card, Badge, Progress, Button } from '../components/ui'
import { 
  Activity, 
  Award, 
  TrendingUp, 
  Clock, 
  Mic, 
  Image, 
  Zap, 
  ArrowRight,
  Target,
  Flame,
  BookOpen,
  ChevronRight
} from 'lucide-react'
import { cn, formatRelativeTime } from '../utils/helpers'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts'

const Dashboard = () => {
  const { 
    user, 
    history, 
    progressData, 
    calculateStats, 
    setActiveTab,
    apiKeys,
    provider 
  } = useAppStore()

  useEffect(() => {
    calculateStats()
  }, [history])

  const quickActions = [
    { id: 'speech', label: 'Analyze Speech', icon: Mic, color: 'cyan', description: 'Paste transcript for AI feedback' },
    { id: 'listen', label: 'Live Coaching', icon: Activity, color: 'purple', description: 'Real-time audio analysis' },
    { id: 'board', label: 'Evaluate Flow', icon: Image, color: 'amber', description: 'Upload your debate flow' },
    { id: 'strategy', label: 'Generate Strategy', icon: Zap, color: 'emerald', description: 'AI-powered case building' },
  ]

  const hasApiKey = apiKeys[provider]

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-800/50 p-8">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <Badge variant="primary" className="mb-4">
              <Flame className="w-3 h-3" />
              {history.length > 0 ? `${history.length} sessions completed` : 'Welcome!'}
            </Badge>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              {user ? `Welcome back, ${user.username || user.email?.split('@')[0]}!` : 'Welcome to Adjudicator AI'}
            </h1>
            <p className="text-slate-400 max-w-xl">
              Your AI-powered debate coach. Analyze speeches, get real-time feedback, and improve your competitive speaking skills.
            </p>

            {!hasApiKey && (
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-amber-400 text-sm">
                  ⚠️ Add your API key in Settings to enable AI analysis features.
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 text-amber-400"
                  onClick={() => setActiveTab('settings')}
                >
                  Go to Settings <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Activity}
            label="Total Sessions"
            value={progressData.totalSessions}
            change="+12%"
            changeType="positive"
            color="cyan"
          />
          <StatCard
            icon={Award}
            label="Average Score"
            value={progressData.averageScore || 'N/A'}
            suffix={progressData.averageScore ? '/100' : ''}
            change="+5 pts"
            changeType="positive"
            color="purple"
          />
          <StatCard
            icon={TrendingUp}
            label="Skill Growth"
            value="+15%"
            description="Last 30 days"
            color="emerald"
          />
          <StatCard
            icon={Clock}
            label="Practice Time"
            value={Math.round(history.length * 5)}
            suffix=" min"
            description="Estimated total"
            color="amber"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <QuickActionCard
                  key={action.id}
                  {...action}
                  onClick={() => setActiveTab(action.id)}
                />
              ))}
            </div>
          </div>

          {/* Skills Radar */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Skill Overview
            </h2>
            <Card className="p-6">
              {Object.keys(progressData.skillProgress).length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart 
                      data={Object.entries(progressData.skillProgress).map(([key, value]) => ({
                        skill: key,
                        value: value,
                        fullMark: 10
                      }))}
                    >
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis 
                        dataKey="skill" 
                        tick={{ fill: '#94a3b8', fontSize: 11 }} 
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 10]} 
                        tick={false} 
                        axisLine={false} 
                      />
                      <Radar 
                        name="Score" 
                        dataKey="value" 
                        stroke="#06b6d4" 
                        strokeWidth={2}
                        fill="#06b6d4" 
                        fillOpacity={0.2} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="text-slate-400 text-sm">Complete sessions to see skill breakdown</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Progress Chart & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Over Time */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Progress Over Time
            </h3>
            {progressData.recentScores.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={progressData.recentScores.map((score, idx) => ({
                      session: idx + 1,
                      score
                    })).reverse()}
                  >
                    <XAxis 
                      dataKey="session" 
                      stroke="#64748b" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      stroke="#64748b" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      dot={{ fill: '#06b6d4', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#06b6d4' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-sm">Complete sessions to track progress</p>
                </div>
              </div>
            )}
          </Card>

          {/* Recent Sessions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Recent Sessions
              </h3>
              {history.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('history')}>
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
            
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.slice(0, 5).map((session, idx) => (
                  <div 
                    key={session.id || idx}
                    className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => {
                      useAppStore.getState().setCurrentSession({ result: session.result })
                      setActiveTab(session.type === 'speech' ? 'speech' : session.type)
                    }}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      session.type === 'speech' ? 'bg-cyan-500/10' :
                      session.type === 'listen' ? 'bg-purple-500/10' :
                      'bg-amber-500/10'
                    )}>
                      {session.type === 'speech' ? <Mic className="w-5 h-5 text-cyan-400" /> :
                       session.type === 'listen' ? <Activity className="w-5 h-5 text-purple-400" /> :
                       <Image className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {session.topic || 'Untitled Session'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatRelativeTime(session.date)}
                      </p>
                    </div>
                    <Badge variant={session.type === 'speech' ? 'primary' : 'secondary'}>
                      {session.type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-sm">No sessions yet</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setActiveTab('speech')}
                  >
                    Start your first analysis
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Pro Tips */}
        <Card className="p-6 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Pro Tip</h3>
              <p className="text-slate-400 text-sm">
                Use the Live Coaching feature during practice rounds to get real-time feedback on your pacing, volume, and filler word usage. It's like having a coach in your ear!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, suffix = '', change, changeType, description, color }) => {
  const colors = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20'
  }

  const iconColors = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400'
  }

  return (
    <Card className={cn('p-5 bg-gradient-to-br border', colors[color])}>
      <div className="flex items-center justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center', iconColors[color])}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            changeType === 'positive' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          )}>
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {value}{suffix}
      </div>
      <div className="text-sm text-slate-400">{description || label}</div>
    </Card>
  )
}

// Quick Action Card
const QuickActionCard = ({ id, label, icon: Icon, color, description, onClick }) => {
  const colors = {
    cyan: 'group-hover:border-cyan-500/30 group-hover:bg-cyan-500/5',
    purple: 'group-hover:border-purple-500/30 group-hover:bg-purple-500/5',
    amber: 'group-hover:border-amber-500/30 group-hover:bg-amber-500/5',
    emerald: 'group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5'
  }

  const iconColors = {
    cyan: 'text-cyan-400 group-hover:text-cyan-300',
    purple: 'text-purple-400 group-hover:text-purple-300',
    amber: 'text-amber-400 group-hover:text-amber-300',
    emerald: 'text-emerald-400 group-hover:text-emerald-300'
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group w-full p-5 text-left rounded-2xl border border-slate-800/50 bg-slate-900/30',
        'transition-all duration-300 hover:shadow-lg',
        colors[color]
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          'w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center',
          'group-hover:scale-110 transition-transform duration-300',
          iconColors[color]
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-0.5">{label}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
      </div>
    </button>
  )
}

export default Dashboard
