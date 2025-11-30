import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Loader2, AlertCircle, RefreshCw, Copy, CheckCircle2, History, Info, Gavel } from 'lucide-react';
import { speechTypes, sides } from '../data/constants';
import { 
  getEventConfig, 
  getApplicableSides, 
  generateEventPrompt,
  eventCategoryMap,
  EVENT_CATEGORY_LABELS
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
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

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
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

    // Group speech types by category for the dropdown
    const groupedSpeechTypes = useMemo(() => {
        const groups = {};
        speechTypes.forEach(type => {
            const cat = eventCategoryMap[type];
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(type);
        });
        return groups;
    }, []);

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
            {/* Input Panel */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <div className="glass-card space-y-4">
                    {/* Event Category Badge */}
                    {categoryLabel && (
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{categoryLabel.icon}</span>
                            <span className={`text-sm font-medium ${categoryLabel.color}`}>
                                {categoryLabel.label}
                            </span>
                            {eventConfig.showOpposingArguments && (
                                <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">
                                    Includes Clash Analysis
                                </span>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Event Format</label>
                            <select
                                value={speechType}
                                onChange={(e) => handleSpeechTypeChange(e.target.value)}
                                className="input-field"
                            >
                                {Object.entries(groupedSpeechTypes).map(([category, types]) => {
                                    const catLabel = EVENT_CATEGORY_LABELS[category];
                                    return (
                                        <optgroup key={category} label={`${catLabel?.icon || ''} ${catLabel?.label || category}`}>
                                            {types.map(t => <option key={t} value={t}>{t}</option>)}
                                        </optgroup>
                                    );
                                })}
                            </select>
                        </div>
                        
                        {/* Only show Side selector for debate events */}
                        {eventConfig.showOpposingArguments ? (
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Side/Position</label>
                                <select
                                    value={side}
                                    onChange={(e) => setSide(e.target.value)}
                                    className="input-field"
                                >
                                    {applicableSides.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Speaker Role</label>
                                <select
                                    value={side}
                                    onChange={(e) => setSide(e.target.value)}
                                    className="input-field"
                                >
                                    {applicableSides.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
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
                            className="input-field"
                        />
                    </div>

                    {/* Event-specific focus areas */}
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-text-secondary">
                                This analysis will focus on:
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {eventConfig.focusAreas.slice(0, 4).map((area, idx) => (
                                <span 
                                    key={idx}
                                    className="px-2 py-1 text-xs bg-slate-700/50 text-text-secondary rounded-full"
                                >
                                    {area}
                                </span>
                            ))}
                            {eventConfig.focusAreas.length > 4 && (
                                <span className="px-2 py-1 text-xs text-text-muted">
                                    +{eventConfig.focusAreas.length - 4} more
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 glass-card flex flex-col p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50 bg-slate-900/50">
                        <label className="text-sm font-medium text-text-secondary">Speech Transcript</label>
                    </div>
                    <textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder="Paste the speech text here..."
                        className="flex-1 w-full bg-transparent p-4 resize-none focus:outline-none font-mono text-sm text-text-primary"
                    />
                    <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 flex justify-between items-center">
                        <span className="text-xs text-text-muted">{transcript.length} chars</span>
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            {loading ? 'Analyzing...' : `Judge ${eventConfig.name}`}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
            </div>

            {/* Output Panel */}
            <div className="w-full lg:w-1/2 glass-card overflow-hidden flex flex-col p-0">
                <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Gavel className="w-4 h-4 text-primary" />
                        {eventConfig.name} Evaluation
                    </h3>
                    {result && (
                        <div className="flex items-center gap-2">
                            {saved && (
                                <span className="text-xs text-emerald-400 flex items-center gap-1">
                                    <History className="w-3 h-3" /> Saved
                                </span>
                            )}
                            <button
                                onClick={copyToClipboard}
                                className="text-text-secondary hover:text-white transition-colors"
                                title="Copy to clipboard"
                            >
                                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {result ? (
                        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-cyan-400 prose-a:text-accent prose-strong:text-white prose-table:border-collapse prose-th:border prose-th:border-slate-700 prose-td:border prose-td:border-slate-700 prose-th:p-2 prose-td:p-2 prose-th:bg-slate-800/50">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                            <span className="text-5xl mb-4">{categoryLabel?.icon || '⚖️'}</span>
                            <p className="text-center">
                                Ready to evaluate your {eventConfig.name.toLowerCase()} speech.
                                <br />
                                <span className="text-xs">
                                    Enter details and click Analyze.
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JudgeSpeech;
