import React, { useState, useRef } from 'react'
import { useAppStore } from '../store'
import { Card, Button, Select, Input, Textarea, Badge, Progress } from '../components/ui'
import { 
  Mic, 
  Send, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  FileText,
  Sparkles,
  Download,
  Copy,
  RefreshCw
} from 'lucide-react'
import { cn, copyToClipboard, downloadFile, generateId } from '../utils/helpers'
import { speechTypes, sides, rubrics } from '../utils/constants'
import { callGeminiAPI, callOpenAI, buildAnalysisPrompt, parseRadarData } from '../utils/api'
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts'
import MarkdownRenderer from '../components/shared/MarkdownRenderer'

const SpeechAnalysis = () => {
  const { 
    speechForm, 
    setSpeechForm, 
    currentSession, 
    setCurrentSession,
    apiKeys,
    provider,
    addToHistory
  } = useAppStore()

  const [copied, setCopied] = useState(false)

  const handleAnalyze = async () => {
    const apiKey = apiKeys[provider]
    
    if (!apiKey) {
      setCurrentSession({ error: `Please add your ${provider === 'gemini' ? 'Gemini' : 'OpenAI'} API key in Settings.` })
      return
    }

    if (!speechForm.transcript.trim()) {
      setCurrentSession({ error: 'Please enter speech text to analyze.' })
      return
    }

    setCurrentSession({ loading: true, error: null, result: null, radarData: null })

    try {
      const rubric = rubrics[speechForm.type] || rubrics['default']
      const prompt = buildAnalysisPrompt(
        'speech',
        speechForm.type,
        speechForm.side,
        speechForm.topic,
        rubric
      ) + `\n\nSPEECH TEXT:\n${speechForm.transcript}`

      let result
      if (provider === 'gemini') {
        result = await callGeminiAPI(apiKey, prompt)
      } else {
        result = await callOpenAI(apiKey, prompt)
      }

      const radarData = parseRadarData(result)

      // Save to history
      addToHistory({
        id: generateId(),
        type: 'speech',
        topic: speechForm.topic || speechForm.type,
        result,
        radarData,
        input: speechForm.transcript,
        date: new Date().toISOString()
      })

      setCurrentSession({ result, radarData, loading: false })
    } catch (err) {
      setCurrentSession({ error: err.message, loading: false })
    }
  }

  const handleCopy = async () => {
    if (currentSession.result) {
      await copyToClipboard(currentSession.result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (currentSession.result) {
      const filename = `analysis_${speechForm.topic || 'speech'}_${Date.now()}.md`
      downloadFile(currentSession.result, filename)
    }
  }

  return (
    <div className="h-full flex">
      {/* Left Panel - Input */}
      <div className="w-full lg:w-5/12 flex flex-col border-r border-slate-800/50 bg-slate-950/50">
        {/* Form Header */}
        <div className="p-6 border-b border-slate-800/50">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Mic className="w-5 h-5 text-cyan-400" />
            Speech Analysis
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Select
              label="Format"
              value={speechForm.type}
              onChange={(e) => setSpeechForm({ type: e.target.value })}
              options={speechTypes}
            />
            <Select
              label="Side"
              value={speechForm.side}
              onChange={(e) => setSpeechForm({ side: e.target.value })}
              options={sides}
            />
          </div>

          <Input
            label="Topic / Resolution"
            placeholder="Enter the debate topic..."
            value={speechForm.topic}
            onChange={(e) => setSpeechForm({ topic: e.target.value })}
          />
        </div>

        {/* Transcript Input */}
        <div className="flex-1 p-6">
          <div className="h-full flex flex-col">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Speech Transcript
            </label>
            <Textarea
              className="flex-1 font-mono text-sm"
              placeholder="Paste your speech transcript here..."
              value={speechForm.transcript}
              onChange={(e) => setSpeechForm({ transcript: e.target.value })}
            />
            
            {/* Character Count */}
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>{speechForm.transcript.length.toLocaleString()} characters</span>
              <span>~{Math.round(speechForm.transcript.split(/\s+/).filter(Boolean).length / 150)} min @ 150 WPM</span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-800/50">
          {currentSession.error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {currentSession.error}
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={handleAnalyze}
            disabled={currentSession.loading || !speechForm.transcript.trim()}
            loading={currentSession.loading}
          >
            {currentSession.loading ? (
              <>Analyzing...</>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Speech
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Right Panel - Results */}
      <div className="hidden lg:flex lg:w-7/12 flex-col bg-slate-900/30 overflow-hidden">
        {currentSession.result ? (
          <div className="flex-1 overflow-y-auto p-8">
            {/* Radar Chart */}
            {currentSession.radarData && (
              <Card className="p-6 mb-6">
                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4 text-center">
                  Skills Radar
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={currentSession.radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis 
                        dataKey="subject" 
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
                        dataKey="A" 
                        stroke="#06b6d4" 
                        strokeWidth={2}
                        fill="#06b6d4" 
                        fillOpacity={0.2} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mb-6">
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentSession({ result: null, radarData: null })}>
                <RefreshCw className="w-4 h-4" />
                Clear
              </Button>
            </div>

            {/* Analysis Content */}
            <Card className="p-8">
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={currentSession.result} />
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-400 mb-2">Ready for Analysis</h3>
              <p className="text-slate-500 text-sm max-w-sm">
                Enter your speech transcript and click analyze to get AI-powered feedback
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpeechAnalysis
