import React, { useState } from 'react'
import { Target, Users, Clock, ArrowRight, RotateCcw, Download, Share2, Sparkles, Loader2 } from 'lucide-react'
import { Card, CardHeader, Button, Select, Input, Textarea, Badge } from '../components/ui'
import { useAppStore } from '../store'
import { callGeminiAPI, callOpenAIAPI } from '../utils/api'
import { cn } from '../utils/helpers'
import MarkdownRenderer from '../components/shared/MarkdownRenderer'

const Strategy = () => {
  const { settings, addToHistory } = useAppStore()
  const [motion, setMotion] = useState('')
  const [format, setFormat] = useState('BP')
  const [side, setSide] = useState('gov')
  const [position, setPosition] = useState('OG')
  const [context, setContext] = useState('')
  const [strategy, setStrategy] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('case')

  const formats = [
    { value: 'BP', label: 'British Parliamentary' },
    { value: 'WSDC', label: 'World Schools' },
    { value: 'AP', label: 'Asian Parliamentary' },
    { value: 'LD', label: 'Lincoln-Douglas' },
    { value: 'PF', label: 'Public Forum' }
  ]

  const positions = {
    BP: [
      { value: 'OG', label: 'Opening Government' },
      { value: 'OO', label: 'Opening Opposition' },
      { value: 'CG', label: 'Closing Government' },
      { value: 'CO', label: 'Closing Opposition' }
    ],
    WSDC: [
      { value: '1st', label: 'First Speaker' },
      { value: '2nd', label: 'Second Speaker' },
      { value: '3rd', label: 'Third Speaker' },
      { value: 'reply', label: 'Reply Speaker' }
    ],
    AP: [
      { value: 'PM', label: 'Prime Minister' },
      { value: 'DPM', label: 'Deputy PM' },
      { value: 'GW', label: 'Gov Whip' },
      { value: 'LO', label: 'Leader of Opposition' },
      { value: 'DLO', label: 'Deputy LO' },
      { value: 'OW', label: 'Opp Whip' }
    ]
  }

  const generateStrategy = async () => {
    if (!motion.trim() || !settings.apiKey) return

    setIsGenerating(true)

    const prompt = `You are an expert debate strategist specializing in ${format} format debates.

Motion: "${motion}"
Position: ${position} (${side === 'gov' ? 'Government' : 'Opposition'})
${context ? `Additional Context: ${context}` : ''}

Generate a comprehensive debate strategy including:

## Case Architecture
- **Theme/Principle**: A unifying theme that ties arguments together
- **Main Arguments**: 3-4 strong arguments with clear structure (claim, warrant, impact)
- **Case Split**: How to divide arguments between speakers

## Key Mechanisms
- Important definitions or frameworks
- Burden of proof structure
- Key models or policies (if applicable)

## Anticipating Opposition
- Likely opposing arguments
- Pre-emptive rebuttals
- Points of Engagement

## POI Strategy
- ${side === 'gov' ? 'Points to make during Opposition speeches' : 'Points to make during Government speeches'}
- Questions that expose weaknesses in their case

## Speaker Strategy
- Opening moves
- Key moments to emphasize
- Closing impact

## Win Conditions
- What must be proven to win
- Key comparative points
- How to frame the debate in your favor

Be specific, practical, and tailored to the ${format} format. Use clear markdown formatting.`

    try {
      const response = settings.apiProvider === 'openai'
        ? await callOpenAIAPI(settings.apiKey, prompt, settings.model)
        : await callGeminiAPI(settings.apiKey, prompt, settings.model)

      if (response) {
        setStrategy(response)
        addToHistory({
          type: 'strategy',
          motion,
          format,
          position,
          side,
          result: response.slice(0, 200) + '...',
          timestamp: new Date().toISOString()
        })
      }
    } catch (err) {
      console.error('Error generating strategy:', err)
      setStrategy('Error generating strategy. Please check your API key and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const tabs = [
    { id: 'case', label: 'Case Architecture', icon: Target },
    { id: 'mechanisms', label: 'Mechanisms', icon: Users },
    { id: 'rebuttal', label: 'Rebuttals', icon: ArrowRight },
    { id: 'poi', label: 'POI Strategy', icon: Clock }
  ]

  const handleReset = () => {
    setMotion('')
    setContext('')
    setStrategy(null)
  }

  const handleShare = () => {
    if (strategy) {
      navigator.clipboard.writeText(strategy)
        .then(() => alert('Strategy copied to clipboard!'))
        .catch(console.error)
    }
  }

  const handleDownload = () => {
    if (strategy) {
      const blob = new Blob([strategy], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `strategy-${format}-${position}.md`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Strategy Builder</h1>
          <p className="text-slate-400 mt-1">AI-powered debate strategy and case building</p>
        </div>
        {strategy && (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <Card className="p-6">
            <CardHeader
              title="Setup"
              icon={<Target className="h-5 w-5 text-cyan-400" />}
            />
            
            <div className="mt-4 space-y-4">
              {/* Motion Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Motion / Resolution
                </label>
                <Textarea
                  value={motion}
                  onChange={(e) => setMotion(e.target.value)}
                  placeholder="Enter the motion or resolution..."
                  rows={3}
                />
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Format
                </label>
                <Select
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value)
                    setPosition(positions[e.target.value]?.[0]?.value || 'gov')
                  }}
                  options={formats}
                />
              </div>

              {/* Side Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Side
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={side === 'gov' ? 'default' : 'outline'}
                    onClick={() => setSide('gov')}
                    className="w-full"
                  >
                    Government
                  </Button>
                  <Button
                    variant={side === 'opp' ? 'default' : 'outline'}
                    onClick={() => setSide('opp')}
                    className="w-full"
                  >
                    Opposition
                  </Button>
                </div>
              </div>

              {/* Position */}
              {positions[format] && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Position
                  </label>
                  <Select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    options={positions[format].filter(p => 
                      side === 'gov' 
                        ? ['OG', 'CG', 'PM', 'DPM', 'GW', '1st', '2nd', '3rd', 'reply'].includes(p.value)
                        : ['OO', 'CO', 'LO', 'DLO', 'OW', '1st', '2nd', '3rd', 'reply'].includes(p.value)
                    )}
                  />
                </div>
              )}

              {/* Additional Context */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Additional Context (optional)
                </label>
                <Textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Any specific requirements, target audience, or constraints..."
                  rows={2}
                />
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={generateStrategy}
              disabled={!motion.trim() || isGenerating || !settings.apiKey}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Strategy
                </>
              )}
            </Button>
            <Button variant="ghost" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {!settings.apiKey && (
            <p className="text-xs text-amber-400 text-center">
              Configure your API key in Settings to generate strategies
            </p>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full">
            <CardHeader
              title="Strategy"
              icon={<Sparkles className="h-5 w-5 text-purple-400" />}
            />

            {/* Quick Info Badges */}
            {strategy && (
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="default">{format}</Badge>
                <Badge variant={side === 'gov' ? 'default' : 'secondary'}>
                  {side === 'gov' ? 'Government' : 'Opposition'}
                </Badge>
                <Badge variant="secondary">{position}</Badge>
              </div>
            )}

            <div className="mt-4 min-h-[500px]">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-t-purple-500 rounded-full animate-spin" />
                  </div>
                  <p className="mt-4 text-slate-400">Crafting your strategy...</p>
                  <p className="text-xs text-slate-500 mt-1">Analyzing motion and position</p>
                </div>
              ) : strategy ? (
                <div className="prose prose-invert max-w-none overflow-y-auto max-h-[600px] pr-2">
                  <MarkdownRenderer content={strategy} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Target className="h-12 w-12 text-slate-600 mb-4" />
                  <p className="text-slate-400 mb-2">No strategy generated yet</p>
                  <p className="text-xs text-slate-500">
                    Enter a motion and click "Generate Strategy" to get started
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Tips */}
      <Card className="p-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">Quick Tips:</span>
          <Badge variant="secondary" className="cursor-pointer hover:bg-slate-700">
            Be specific with your motion
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-slate-700">
            Consider your position carefully
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-slate-700">
            Add context for better results
          </Badge>
        </div>
      </Card>
    </div>
  )
}

export default Strategy
