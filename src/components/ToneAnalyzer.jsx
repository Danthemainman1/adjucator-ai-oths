import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Brain, 
  Loader2, 
  AlertCircle, 
  Copy, 
  CheckCircle2, 
  History,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  Scale,
  Lightbulb,
  BarChart3,
  Send,
  Info
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSessionHistory } from '../hooks/useSessionHistory';

// Confidence level indicators
const CONFIDENCE_LEVELS = {
  uncertain: { label: 'Uncertain', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', icon: TrendingDown },
  moderate: { label: 'Moderate', color: 'text-blue-400', bgColor: 'bg-blue-500/20', icon: Minus },
  strong: { label: 'Strong', color: 'text-green-400', bgColor: 'bg-green-500/20', icon: TrendingUp }
};

// Emotional tones
const EMOTIONAL_TONES = {
  passionate: { label: 'Passionate', color: 'text-red-400', bgColor: 'bg-red-500/20', emoji: '🔥' },
  neutral: { label: 'Neutral', color: 'text-gray-400', bgColor: 'bg-gray-500/20', emoji: '😐' },
  analytical: { label: 'Analytical', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', emoji: '🧠' },
  inspiring: { label: 'Inspiring', color: 'text-purple-400', bgColor: 'bg-purple-500/20', emoji: '✨' },
  urgent: { label: 'Urgent', color: 'text-orange-400', bgColor: 'bg-orange-500/20', emoji: '⚡' }
};

// Rhetorical appeals
const RHETORICAL_APPEALS = {
  ethos: { 
    label: 'Ethos', 
    description: 'Credibility & Authority', 
    color: 'from-blue-500 to-indigo-500',
    icon: Scale 
  },
  pathos: { 
    label: 'Pathos', 
    description: 'Emotional Appeal', 
    color: 'from-red-500 to-pink-500',
    icon: Heart 
  },
  logos: { 
    label: 'Logos', 
    description: 'Logic & Reasoning', 
    color: 'from-green-500 to-emerald-500',
    icon: Lightbulb 
  }
};

// Progress indicator component
const ToneProgressBar = ({ sections }) => {
  if (!sections || sections.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
        <BarChart3 className="w-4 h-4" />
        <span>Tone Progression</span>
      </div>
      <div className="flex h-8 rounded-lg overflow-hidden">
        {sections.map((section, index) => {
          const tone = EMOTIONAL_TONES[section.tone] || EMOTIONAL_TONES.neutral;
          return (
            <div
              key={index}
              className={`flex-1 ${tone.bgColor} flex items-center justify-center text-xs font-medium ${tone.color} border-r border-bg-primary last:border-r-0 transition-all hover:brightness-125`}
              title={`${section.label}: ${tone.label}`}
            >
              <span className="hidden sm:inline">{section.label}</span>
              <span className="sm:hidden">{tone.emoji}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-text-muted">
        <span>Opening</span>
        <span>Closing</span>
      </div>
    </div>
  );
};

// Rhetorical appeal gauge
const AppealGauge = ({ type, score }) => {
  const appeal = RHETORICAL_APPEALS[type];
  if (!appeal) return null;
  
  const Icon = appeal.icon;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${appeal.color} flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">{appeal.label}</div>
            <div className="text-xs text-text-muted">{appeal.description}</div>
          </div>
        </div>
        <span className="text-lg font-bold text-white">{score}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${appeal.color} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

const ToneAnalyzer = ({ apiKey }) => {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const { addSession } = useSessionHistory();

  const handleAnalyze = async () => {
    if (!apiKey) {
      setError('Please enter a valid Gemini API Key in Settings.');
      return;
    }
    if (!transcript.trim()) {
      setError('Please enter the speech transcript.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setAnalysisData(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `You are an expert rhetorical analyst and speech coach. Analyze the following speech for tone, rhetorical techniques, and emotional impact.

SPEECH TEXT:
${transcript}

Provide your analysis in the following JSON format (ONLY output valid JSON, no markdown):
{
  "overallConfidence": "uncertain" | "moderate" | "strong",
  "dominantTone": "passionate" | "neutral" | "analytical" | "inspiring" | "urgent",
  "rhetoricalAppeals": {
    "ethos": <number 0-100>,
    "pathos": <number 0-100>,
    "logos": <number 0-100>
  },
  "toneProgression": [
    { "label": "Intro", "tone": "neutral" },
    { "label": "Build", "tone": "analytical" },
    { "label": "Peak", "tone": "passionate" },
    { "label": "Close", "tone": "inspiring" }
  ],
  "confidenceIndicators": {
    "hedgingPhrases": ["maybe", "perhaps", "I think"],
    "assertivePhrases": ["clearly", "undoubtedly", "must"],
    "hedgeCount": <number>,
    "assertiveCount": <number>
  },
  "techniques": [
    {
      "name": "Anaphora",
      "description": "Repetition at the beginning of sentences",
      "example": "We will fight... We will win...",
      "effectiveness": "high" | "medium" | "low"
    }
  ],
  "emotionalArc": {
    "opening": { "emotion": "hopeful", "intensity": 60 },
    "middle": { "emotion": "determined", "intensity": 80 },
    "closing": { "emotion": "triumphant", "intensity": 95 }
  },
  "recommendations": [
    "Add more concrete evidence to strengthen logos appeal",
    "Consider varying sentence length for better rhythm"
  ],
  "summary": "A two-sentence summary of the overall rhetorical effectiveness."
}`;

      const genResult = await model.generateContent(prompt);
      const response = await genResult.response;
      const text = response.text();

      // Parse JSON from response
      let parsedData;
      try {
        // Try to extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseErr) {
        console.error('JSON parse error:', parseErr);
        // Fallback: just show the raw text
        setResult(text);
        return;
      }

      setAnalysisData(parsedData);

      // Auto-save to history
      addSession({
        type: 'tone',
        title: 'Tone Analysis',
        input: { transcript: transcript.substring(0, 500) + (transcript.length > 500 ? '...' : '') },
        result: JSON.stringify(parsedData, null, 2),
        metadata: { 
          confidence: parsedData.overallConfidence,
          dominantTone: parsedData.dominantTone
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

    } catch (err) {
      console.error("Gemini Error:", err);
      setError(`Error: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (analysisData) {
      navigator.clipboard.writeText(JSON.stringify(analysisData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const confidenceConfig = analysisData?.overallConfidence 
    ? CONFIDENCE_LEVELS[analysisData.overallConfidence] 
    : null;
  
  const toneConfig = analysisData?.dominantTone 
    ? EMOTIONAL_TONES[analysisData.dominantTone] 
    : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Tone Analysis</h1>
        <p className="text-slate-400 mt-1">Analyze rhetorical impact and emotional tone</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Input Panel */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-slate-300">This analysis detects:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Confidence Level', 'Emotional Tone', 'Ethos/Pathos/Logos', 'Rhetorical Techniques'].map((item, idx) => (
                  <span key={idx} className="px-3 py-1.5 text-xs font-medium bg-slate-900/50 text-slate-400 rounded-lg border border-slate-700/50">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800/60 bg-slate-900/50">
              <label className="text-sm font-medium text-slate-300">Speech Transcript</label>
            </div>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your speech text here for detailed tone and rhetorical analysis..."
              className="flex-1 w-full bg-transparent p-4 resize-none focus:outline-none font-mono text-sm text-slate-200 placeholder-slate-600 min-h-[300px]"
            />
            <div className="p-4 border-t border-slate-800/60 bg-slate-900/50 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">{transcript.length.toLocaleString()} characters</span>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? 'Analyzing...' : 'Analyze Tone'}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="w-full lg:w-1/2 rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800/60 bg-slate-900/50 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Rhetorical Analysis
            </h3>
            {analysisData && (
              <div className="flex items-center gap-3">
                {saved && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                    <History className="w-3 h-3" /> Saved
                  </span>
                )}
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {analysisData ? (
              <div className="space-y-6">
                {/* Overall Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  {confidenceConfig && (
                    <div className={`p-4 rounded-xl ${confidenceConfig.bgColor} border border-slate-700/50`}>
                      <div className="flex items-center gap-2 mb-2">
                        <confidenceConfig.icon className={`w-5 h-5 ${confidenceConfig.color}`} />
                        <span className="text-sm text-slate-400">Confidence</span>
                      </div>
                      <div className={`text-xl font-bold ${confidenceConfig.color}`}>
                        {confidenceConfig.label}
                      </div>
                    </div>
                  )}

                  {toneConfig && (
                    <div className={`p-4 rounded-xl ${toneConfig.bgColor} border border-slate-700/50`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{toneConfig.emoji}</span>
                        <span className="text-sm text-slate-400">Dominant Tone</span>
                      </div>
                      <div className={`text-xl font-bold ${toneConfig.color}`}>
                        {toneConfig.label}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rhetorical Appeals */}
                <div className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/30 space-y-4">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-purple-400" />
                    Rhetorical Appeals
                  </h4>
                  {analysisData.rhetoricalAppeals && (
                    <div className="space-y-4">
                      <AppealGauge type="ethos" score={analysisData.rhetoricalAppeals.ethos} />
                      <AppealGauge type="pathos" score={analysisData.rhetoricalAppeals.pathos} />
                      <AppealGauge type="logos" score={analysisData.rhetoricalAppeals.logos} />
                    </div>
                  )}
                </div>

                {/* Tone Progression */}
                {analysisData.toneProgression && (
                  <div className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/30">
                    <ToneProgressBar sections={analysisData.toneProgression} />
                  </div>
                )}

                {/* Techniques */}
                {analysisData.techniques && analysisData.techniques.length > 0 && (
                  <div className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/30 space-y-3">
                    <h4 className="font-semibold text-white">Rhetorical Techniques</h4>
                    <div className="space-y-3">
                      {analysisData.techniques.map((tech, idx) => (
                        <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-white">{tech.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              tech.effectiveness === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                              tech.effectiveness === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {tech.effectiveness}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">{tech.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {analysisData.recommendations && (
                  <div className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/30 space-y-3">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {analysisData.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Summary */}
                {analysisData.summary && (
                  <div className="p-5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <h4 className="font-semibold text-purple-400 mb-2">Summary</h4>
                    <p className="text-slate-300">{analysisData.summary}</p>
                  </div>
                )}
              </div>
            ) : result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-16">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8" />
                </div>
                <p className="text-center max-w-xs">
                  Paste your speech transcript to analyze rhetorical impact and emotional tone.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToneAnalyzer;
