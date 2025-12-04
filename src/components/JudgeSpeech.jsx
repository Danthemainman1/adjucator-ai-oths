import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Loader2, AlertCircle, RefreshCw, Copy, CheckCircle2, History, Info, Gavel } from 'lucide-react';
import { speechTypes } from '../data/constants';
import { 
  getEventConfig, 
  getApplicableSides, 
  generateEventPrompt,
  eventCategoryMap,
  EVENT_CATEGORY_LABELS,
  EVENT_SUBCATEGORIES,
  getEventDescription
} from '../data/eventConfig';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSessionHistory } from '../hooks/useSessionHistory';

const JudgeSpeech = ({ apiKey }) => {
    const [speechType, setSpeechType] = useState('Public Forum (PF)');
    const [side, setSide] = useState('Proposition/Affirmative');
    const [topic, setTopic] = useState('');
    const [transcript, setTranscript] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const { addSession } = useSessionHistory();

    // Get event-specific configuration
    const eventConfig = useMemo(() => getEventConfig(speechType), [speechType]);
    const applicableSides = useMemo(() => getApplicableSides(speechType), [speechType]);
    const eventCategory = eventCategoryMap[speechType];
    const categoryLabel = EVENT_CATEGORY_LABELS[eventCategory];

    // Update side when speech type changes if current side isn't applicable
    const handleSpeechTypeChange = (newType) => {
        setSpeechType(newType);
        const newApplicableSides = getApplicableSides(newType);
        if (!newApplicableSides.includes(side)) {
            setSide(newApplicableSides[0]);
        }
    };

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

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

            // Use event-specific prompt generation
            const prompt = generateEventPrompt(speechType, topic, side, transcript);

            const genResult = await model.generateContent(prompt);
            const response = await genResult.response;
            const text = response.text();

            setResult(text);
            
            // Auto-save to history
            addSession({
                type: 'judge',
                title: topic || `${speechType} Analysis`,
                input: { transcript: transcript.substring(0, 500) + (transcript.length > 500 ? '...' : '') },
                result: text,
                metadata: { 
                    speechType, 
                    side: eventConfig.showOpposingArguments ? side : null, 
                    topic,
                    eventCategory
                }
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Gemini Error:", err);
            // Fallback to 1.5-flash if 2.0 fails
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
                const prompt = generateEventPrompt(speechType, topic, side, transcript);
                const genResult = await model.generateContent(prompt);
                const response = await genResult.response;
                const text = response.text();
                setResult(text);
            } catch (fallbackErr) {
                setError(`Error: ${err.message}. Please try again.`);
            }
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Group speech types by subcategory for better organized dropdown
    const groupedSpeechTypes = useMemo(() => {
        return EVENT_SUBCATEGORIES;
    }, []);
    
    // Get event description for tooltip
    const currentEventDescription = useMemo(() => {
        return getEventDescription(speechType);
    }, [speechType]);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Speech Analysis</h1>
                    <p className="text-slate-400 mt-1">Get AI-powered feedback on your speeches</p>
                </div>
                {categoryLabel && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
                        <span className="text-lg">{categoryLabel.icon}</span>
                        <span className={`text-sm font-medium ${categoryLabel.color}`}>
                            {categoryLabel.label}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Input Panel */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Event Format</label>
                                <select
                                    value={speechType}
                                    onChange={(e) => handleSpeechTypeChange(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                >
                                    {Object.entries(groupedSpeechTypes).map(([subcategory, types]) => (
                                        <optgroup key={subcategory} label={subcategory}>
                                            {types.map(t => <option key={t} value={t}>{t}</option>)}
                                        </optgroup>
                                    ))}
                                </select>
                                {/* Event description tooltip */}
                                <p className="mt-2 text-xs text-slate-500">{currentEventDescription}</p>
                            </div>
                            
                            {eventConfig.showOpposingArguments ? (
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Side/Position</label>
                                    <select
                                        value={side}
                                        onChange={(e) => setSide(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                    >
                                        {applicableSides.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Speaker Role</label>
                                    <select
                                        value={side}
                                        onChange={(e) => setSide(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                    >
                                        {applicableSides.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                {eventConfig.showOpposingArguments ? 'Resolution/Topic' : 'Speech Topic/Prompt'}
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder={
                                    eventConfig.showOpposingArguments 
                                        ? "Resolved: The United States should..." 
                                        : "Enter the topic or prompt..."
                                }
                                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                            />
                        </div>

                        {/* Event-specific focus areas */}
                        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                            <div className="flex items-center gap-2 mb-3">
                                <Info className="w-4 h-4 text-cyan-400" />
                                <span className="text-sm font-medium text-slate-300">Analysis Focus Areas</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {eventConfig.focusAreas.slice(0, 4).map((area, idx) => (
                                    <span 
                                        key={idx}
                                        className="px-3 py-1.5 text-xs font-medium bg-slate-900/50 text-slate-400 rounded-lg border border-slate-700/50"
                                    >
                                        {area}
                                    </span>
                                ))}
                                {eventConfig.focusAreas.length > 4 && (
                                    <span className="px-3 py-1.5 text-xs text-slate-500">
                                        +{eventConfig.focusAreas.length - 4} more
                                    </span>
                                )}
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
                            placeholder="Paste your speech text here..."
                            className="flex-1 w-full bg-transparent p-4 resize-none focus:outline-none font-mono text-sm text-slate-200 placeholder-slate-600 min-h-[200px]"
                        />
                        <div className="p-4 border-t border-slate-800/60 bg-slate-900/50 flex justify-between items-center">
                            <span className="text-xs text-slate-500 font-medium">{transcript.length.toLocaleString()} characters</span>
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                {loading ? 'Analyzing...' : 'Analyze Speech'}
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
                            <Gavel className="w-5 h-5 text-cyan-400" />
                            {eventConfig.name} Evaluation
                        </h3>
                        {result && (
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
                        {result ? (
                            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-cyan-400 prose-headings:font-semibold prose-a:text-cyan-400 prose-strong:text-white prose-table:border-collapse prose-th:border prose-th:border-slate-700 prose-td:border prose-td:border-slate-700 prose-th:p-3 prose-td:p-3 prose-th:bg-slate-800/50 prose-th:text-left">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 py-16">
                                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
                                    <span className="text-3xl">{categoryLabel?.icon || '⚖️'}</span>
                                </div>
                                <p className="text-center max-w-xs">
                                    Ready to evaluate your {eventConfig.name.toLowerCase()} speech.
                                    <br />
                                    <span className="text-sm text-slate-600">
                                        Enter your speech and click Analyze.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JudgeSpeech;
