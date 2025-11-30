import React, { useState } from 'react'
import { Settings as SettingsIcon, Key, Palette, Bell, Shield, Database, Download, Upload, Trash2, Check, Moon, Sun, Monitor } from 'lucide-react'
import { Card, CardHeader, Button, Input, Select, Badge } from '../components/ui'
import { useAppStore } from '../store'
import { cn } from '../utils/helpers'

const Settings = () => {
  const { settings, setSettings, clearHistory, history } = useAppStore()
  const [showApiKey, setShowApiKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const themes = [
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'system', label: 'System', icon: Monitor }
  ]

  const providers = [
    { value: 'gemini', label: 'Google Gemini' },
    { value: 'openai', label: 'OpenAI GPT' }
  ]

  const models = {
    gemini: [
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
      { value: 'gemini-pro', label: 'Gemini Pro' }
    ],
    openai: [
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
    ]
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const exportData = () => {
    const data = {
      settings,
      history,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `adjudicator-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result)
          if (data.settings) {
            setSettings(data.settings)
          }
          alert('Data imported successfully!')
        } catch (err) {
          alert('Error importing data. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Configure your Adjudicator AI experience</p>
      </div>

      {/* API Configuration */}
      <Card className="p-6">
        <CardHeader
          title="API Configuration"
          icon={<Key className="h-5 w-5 text-cyan-400" />}
        />
        
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                AI Provider
              </label>
              <Select
                value={settings.apiProvider}
                onChange={(e) => setSettings({ apiProvider: e.target.value })}
                options={providers}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Model
              </label>
              <Select
                value={settings.model}
                onChange={(e) => setSettings({ model: e.target.value })}
                options={models[settings.apiProvider] || models.gemini}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              API Key
            </label>
            <div className="flex gap-2">
              <Input
                type={showApiKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => setSettings({ apiKey: e.target.value })}
                placeholder="Enter your API key..."
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? 'Hide' : 'Show'}
              </Button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Your API key is stored locally and never sent to our servers.
              {settings.apiProvider === 'gemini' 
                ? ' Get your key from Google AI Studio.'
                : ' Get your key from OpenAI Platform.'}
            </p>
          </div>

          {settings.apiKey && (
            <Badge variant="default" className="bg-green-500/20 text-green-400">
              <Check className="h-3 w-3 mr-1" />
              API Key Configured
            </Badge>
          )}
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-6">
        <CardHeader
          title="Appearance"
          icon={<Palette className="h-5 w-5 text-purple-400" />}
        />
        
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map(theme => (
                <button
                  key={theme.value}
                  onClick={() => setSettings({ theme: theme.value })}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                    settings.theme === theme.value
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-slate-800 hover:border-slate-700"
                  )}
                >
                  <theme.icon className="h-6 w-6" />
                  <span className="text-sm">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Accent Color
            </label>
            <div className="flex gap-2">
              {['cyan', 'purple', 'green', 'amber', 'rose', 'blue'].map(color => (
                <button
                  key={color}
                  onClick={() => setSettings({ accentColor: color })}
                  className={cn(
                    "w-10 h-10 rounded-full transition-transform hover:scale-110",
                    settings.accentColor === color && "ring-2 ring-white ring-offset-2 ring-offset-slate-950",
                    color === 'cyan' && "bg-cyan-500",
                    color === 'purple' && "bg-purple-500",
                    color === 'green' && "bg-green-500",
                    color === 'amber' && "bg-amber-500",
                    color === 'rose' && "bg-rose-500",
                    color === 'blue' && "bg-blue-500"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <CardHeader
          title="Notifications"
          icon={<Bell className="h-5 w-5 text-amber-400" />}
        />
        
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-200">Timer Sounds</p>
              <p className="text-xs text-slate-500">Play sounds for timer events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled ?? true}
                onChange={(e) => setSettings({ soundEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-200">Live Coaching Tips</p>
              <p className="text-xs text-slate-500">Show AI tips during recording</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.liveCoachingTips ?? true}
                onChange={(e) => setSettings({ liveCoachingTips: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
            </label>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <CardHeader
          title="Data Management"
          icon={<Database className="h-5 w-5 text-green-400" />}
        />
        
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            
            <label>
              <Button variant="outline" as="span" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-200">Clear History</p>
                <p className="text-xs text-slate-500">
                  {history?.length || 0} sessions stored
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure? This cannot be undone.')) {
                    clearHistory()
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy */}
      <Card className="p-6">
        <CardHeader
          title="Privacy & Security"
          icon={<Shield className="h-5 w-5 text-rose-400" />}
        />
        
        <div className="mt-4 space-y-3 text-sm text-slate-400">
          <p>• All data is stored locally on your device</p>
          <p>• API keys are never transmitted to our servers</p>
          <p>• AI requests go directly to your chosen provider</p>
          <p>• No analytics or tracking is performed</p>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="min-w-[120px]">
          {saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </div>
  )
}

export default Settings
