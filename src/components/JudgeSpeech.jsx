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
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-teal-dark tracking-tight">Speech Analysis</h1>
                    <p className="text-text-muted mt-1 font-medium">Get AI-powered feedback on your speeches</p>
                </div>
                {categoryLabel && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal/5 border border-teal/10 shadow-sm">
                        <span className="text-lg">{categoryLabel.icon}</span>
                        <span className="text-sm font-bold uppercase tracking-wider text-teal">
                            {categoryLabel.label}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Input Panel */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="p-6 rounded-sm border border-gold/20 bg-base-white shadow-lg shadow-gold/5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gold-dim mb-2">Event Format</label>
                                <select
                                    value={speechType}
                                    onChange={(e) => handleSpeechTypeChange(e.target.value)}
                                    className="w-full px-4 py-3 rounded-sm bg-base-cream border border-gold/20 text-teal-dark focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all outline-none font-medium"
                                >
                                    {Object.entries(groupedSpeechTypes).map(([subcategory, types]) => (
                                        <optgroup key={subcategory} label={subcategory}>
                                            {types.map(t => <option key={t} value={t}>{t}</option>)}
                                        </optgroup>
                                    ))}
                                </select>
                                {/* Event description tooltip */}
                                <p className="mt-2 text-xs text-text-muted/80 italic font-serif">{currentEventDescription}</p>
                            </div>
                            
                            {eventConfig.showOpposingArguments ? (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gold-dim mb-2">Side/Position</label>
                                    <select
                                        value={side}
                                        onChange={(e) => setSide(e.target.value)}
                                        className="w-full px-4 py-3 rounded-sm bg-base-cream border border-gold/20 text-teal-dark focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all outline-none font-medium"
                                    >
                                        {applicableSides.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gold-dim mb-2">Speaker Role</label>
                                    <select
                                        value={side}
                                        onChange={(e) => setSide(e.target.value)}
                                        className="w-full px-4 py-3 rounded-sm bg-base-cream border border-gold/20 text-teal-dark focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all outline-none font-medium"
                                    >
                                        {applicableSides.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gold-dim mb-2">
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
                                className="w-full px-4 py-3 rounded-sm bg-base-cream border border-gold/20 text-teal-dark placeholder:text-text-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all outline-none"
                            />
                        </div>

                        {/* Event-specific focus areas */}
                        <div className="p-4 rounded-sm bg-teal/5 border border-teal/10">
                            <div className="flex items-center gap-2 mb-3">
                                <Info className="w-4 h-4 text-teal" />
                                <span className="text-xs font-bold uppercase tracking-wider text-teal-dark">Analysis Focus Areas</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {eventConfig.focusAreas.slice(0, 4).map((area, idx) => (
                                    <span 
                                        key={idx}
                                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white text-teal-dark rounded-full border border-teal/10 shadow-sm"
                                    >
                                        {area}
                                    </span>
                                ))}
                                {eventConfig.focusAreas.length > 4 && (
                                    <span className="px-3 py-1 text-[10px] font-bold text-text-muted">
                                        +{eventConfig.focusAreas.length - 4} more
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 rounded-sm border border-gold/20 bg-base-white shadow-lg shadow-gold/5 overflow-hidden flex flex-col min-h-[400px]">
                        <div className="p-4 border-b border-gold/10 bg-gold/5 flex justify-between items-center">
                            <label className="text-xs font-bold uppercase tracking-widest text-teal-dark">Speech Transcript</label>
                            <span className="text-[10px] font-mono text-gold-dim">{transcript.length.toLocaleString()} chars</span>
                        </div>
                        <textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Paste your speech text here..."
                            className="flex-1 w-full bg-base-white p-6 resize-none focus:outline-none font-serif text-teal-dark placeholder:text-text-muted/40 text-lg leading-relaxed"
                        />
                        <div className="p-4 border-t border-gold/10 bg-base-cream flex justify-end items-center">
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="px-8 py-3 rounded-sm bg-teal text-white font-bold uppercase tracking-widest text-xs shadow-md shadow-teal/20 hover:bg-teal-dark hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                {loading ? 'Analyzing...' : 'Analyze Speech'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-sm bg-red/5 border border-red/20 flex items-center gap-3 text-red-dark">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}
                </div>

                {/* Output Panel */}
                <div className="w-full lg:w-1/2 rounded-sm border border-gold/20 bg-base-white shadow-lg shadow-gold/5 overflow-hidden flex flex-col min-h-[600px]">
                    <div className="p-4 border-b border-gold/10 bg-teal/5 flex justify-between items-center">
                        <h3 className="font-serif font-bold text-teal-dark flex items-center gap-2">
                            <Gavel className="w-5 h-5 text-gold" />
                            Evaluation
                        </h3>
                        {result && (
                            <div className="flex items-center gap-3">
                                {saved && (
                                    <span className="text-xs text-emerald-dark flex items-center gap-1 font-bold uppercase tracking-wider">
                                        <History className="w-3 h-3" /> Saved
                                    </span>
                                )}
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 rounded-full text-gold-dim hover:text-teal hover:bg-teal/5 transition-all"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-paper-pattern">
                        {result ? (
                            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-teal-dark prose-headings:font-bold prose-p:text-text-secondary prose-p:leading-relaxed prose-strong:text-teal-dark prose-li:text-text-secondary">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-text-muted py-16">
                                <div className="w-20 h-20 rounded-full bg-teal/5 border border-gold/20 flex items-center justify-center mb-6">
                                    <span className="text-4xl opacity-50">{categoryLabel?.icon || '⚖️'}</span>
                                </div>
                                <p className="text-center max-w-xs font-serif text-lg text-teal-dark">
                                    Ready to evaluate your {eventConfig.name.toLowerCase()} speech.
                                </p>
                                <div className="w-12 h-0.5 bg-gold/30 my-4" />
                                <span className="text-xs font-bold uppercase tracking-widest text-gold-dim">
                                    Enter your speech and click Analyze
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JudgeSpeech;
