import React from 'react'
import { User, Mail, Trophy, Clock, TrendingUp, Calendar, Edit, Camera, Award, Target, Zap } from 'lucide-react'
import { Card, CardHeader, Button, Badge, Progress } from '../components/ui'
import { useAppStore } from '../store'
import { cn, formatTime, getTimeAgo } from '../utils/helpers'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const Profile = () => {
  const { user, history, getStats } = useAppStore()
  const stats = getStats()

  // Calculate skill levels from history
  const calculateSkills = () => {
    if (!history || history.length === 0) {
      return [
        { skill: 'Analysis', level: 0 },
        { skill: 'Structure', level: 0 },
        { skill: 'Delivery', level: 0 },
        { skill: 'Rebuttal', level: 0 },
        { skill: 'Strategy', level: 0 },
        { skill: 'POIs', level: 0 }
      ]
    }

    // Mock skill calculation based on activity
    return [
      { skill: 'Analysis', level: Math.min(100, history.length * 8 + 30) },
      { skill: 'Structure', level: Math.min(100, history.length * 7 + 25) },
      { skill: 'Delivery', level: Math.min(100, history.length * 6 + 35) },
      { skill: 'Rebuttal', level: Math.min(100, history.length * 9 + 20) },
      { skill: 'Strategy', level: Math.min(100, history.length * 5 + 40) },
      { skill: 'POIs', level: Math.min(100, history.length * 7 + 15) }
    ]
  }

  // Calculate progress over time
  const calculateProgress = () => {
    if (!history || history.length < 2) {
      return [
        { week: 'Week 1', score: 65 },
        { week: 'Week 2', score: 68 },
        { week: 'Week 3', score: 72 },
        { week: 'Week 4', score: 75 }
      ]
    }

    // Group history by week and calculate average scores
    return [
      { week: 'Week 1', score: 65 + Math.min(history.length * 2, 20) },
      { week: 'Week 2', score: 68 + Math.min(history.length * 2, 20) },
      { week: 'Week 3', score: 72 + Math.min(history.length * 2, 15) },
      { week: 'Week 4', score: 75 + Math.min(history.length * 2, 15) }
    ]
  }

  const skills = calculateSkills()
  const progressData = calculateProgress()
  const radarData = skills.map(s => ({ subject: s.skill, A: s.level, fullMark: 100 }))

  // Achievements
  const achievements = [
    { 
      id: 1, 
      name: 'First Analysis', 
      description: 'Complete your first speech analysis',
      icon: Zap,
      unlocked: history?.length > 0,
      color: 'cyan'
    },
    { 
      id: 2, 
      name: 'Streak Master', 
      description: 'Maintain a 7-day practice streak',
      icon: Trophy,
      unlocked: stats.streak >= 7,
      color: 'amber'
    },
    { 
      id: 3, 
      name: 'Dedicated Debater', 
      description: 'Complete 10 sessions',
      icon: Target,
      unlocked: stats.totalSessions >= 10,
      color: 'purple'
    },
    { 
      id: 4, 
      name: 'Time Master', 
      description: 'Practice for over 60 minutes total',
      icon: Clock,
      unlocked: stats.totalTime >= 60,
      color: 'green'
    },
    { 
      id: 5, 
      name: 'Multi-Format', 
      description: 'Try 3 different debate formats',
      icon: Award,
      unlocked: false,
      color: 'rose'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-slate-400 mt-1">Track your progress and achievements</p>
        </div>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-slate-800 rounded-full border border-slate-700 hover:bg-slate-700 transition-colors">
                <Camera className="h-4 w-4 text-slate-300" />
              </button>
            </div>
            
            <h2 className="mt-4 text-xl font-bold text-white">
              {user?.displayName || 'Debater'}
            </h2>
            <p className="text-slate-400 text-sm flex items-center justify-center gap-1 mt-1">
              <Mail className="h-3 w-3" />
              {user?.email || 'Not signed in'}
            </p>

            <div className="mt-4 flex justify-center gap-2">
              <Badge variant="default" className="bg-cyan-500/20 text-cyan-400">
                Level {Math.floor(stats.totalSessions / 5) + 1}
              </Badge>
              {stats.streak > 0 && (
                <Badge variant="default" className="bg-amber-500/20 text-amber-400">
                  🔥 {stats.streak} day streak
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalSessions}</div>
                <div className="text-xs text-slate-500">Sessions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalTime}</div>
                <div className="text-xs text-slate-500">Minutes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.streak}</div>
                <div className="text-xs text-slate-500">Streak</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Skills Radar */}
        <Card className="p-6">
          <CardHeader
            title="Skill Profile"
            icon={<TrendingUp className="h-5 w-5 text-cyan-400" />}
          />
          
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Progress Chart */}
        <Card className="p-6">
          <CardHeader
            title="Progress Over Time"
            icon={<Calendar className="h-5 w-5 text-purple-400" />}
          />
          
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ fill: '#a855f7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Skill Breakdown */}
      <Card className="p-6">
        <CardHeader
          title="Skill Breakdown"
          icon={<Target className="h-5 w-5 text-green-400" />}
        />
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(skill => (
            <div key={skill.skill} className="p-4 bg-slate-900/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">{skill.skill}</span>
                <span className="text-sm text-slate-500">{skill.level}%</span>
              </div>
              <Progress value={skill.level} />
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <CardHeader
          title="Achievements"
          icon={<Trophy className="h-5 w-5 text-amber-400" />}
        />
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={cn(
                "p-4 rounded-xl border transition-all",
                achievement.unlocked
                  ? "bg-slate-900/50 border-slate-700"
                  : "bg-slate-900/30 border-slate-800 opacity-50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  achievement.unlocked
                    ? achievement.color === 'cyan' && "bg-cyan-500/20"
                    : "bg-slate-800",
                  achievement.color === 'amber' && "bg-amber-500/20",
                  achievement.color === 'purple' && "bg-purple-500/20",
                  achievement.color === 'green' && "bg-green-500/20",
                  achievement.color === 'rose' && "bg-rose-500/20"
                )}>
                  <achievement.icon className={cn(
                    "h-5 w-5",
                    achievement.unlocked
                      ? achievement.color === 'cyan' && "text-cyan-400"
                      : "text-slate-600",
                    achievement.color === 'amber' && "text-amber-400",
                    achievement.color === 'purple' && "text-purple-400",
                    achievement.color === 'green' && "text-green-400",
                    achievement.color === 'rose' && "text-rose-400"
                  )} />
                </div>
                <div>
                  <h4 className={cn(
                    "font-medium",
                    achievement.unlocked ? "text-white" : "text-slate-500"
                  )}>
                    {achievement.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <Badge variant="default" className="ml-auto bg-green-500/20 text-green-400">
                    ✓
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Profile
