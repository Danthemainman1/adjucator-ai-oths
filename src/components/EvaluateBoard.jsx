import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Loader2, AlertCircle, Upload, X, Image as ImageIcon, CheckCircle2, Copy, History } from 'lucide-react';
import { speechTypes } from '../data/constants';
import { EVENT_SUBCATEGORIES, getApplicableSides } from '../data/eventConfig';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSessionHistory } from '../hooks/useSessionHistory';

const EvaluateBoard = ({ apiKey }) => {
    const [speechType, setSpeechType] = useState('Public Forum (PF)');
    const [side, setSide] = useState('Pro/Affirmative');
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef(null);
    const { addSession } = useSessionHistory();
    
    // Get applicable sides based on event type
    const applicableSides = getApplicableSides(speechType);
    
    // Update side when speech type changes
    const handleSpeechTypeChange = (newType) => {
        setSpeechType(newType);
        const newSides = getApplicableSides(newType);
        if (!newSides.includes(side)) {
            setSide(newSides[0]);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        files.forEach(file => {
            if (file.size > 4 * 1024 * 1024) {
                setError(prev => (prev ? `${prev} ` : '') + `Skipped ${file.name} (too large).`);
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                setImages(prev => [...prev, {
                    id: Math.random().toString(36).substr(2, 9),
                    url: reader.result,
                    raw: base64String,
                    mimeType: file.type,
                    name: file.name
                }]);
            };
            reader.readAsDataURL(file);
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (id) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const handleAnalyze = async () => {
        if (!apiKey) {
            setError('Please enter a valid Gemini API Key in Settings.');
            return;
        }
        if (images.length === 0 && !description.trim()) {
            setError('Please upload images of the board or provide a description.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

            const prompt = `
        Expert Debate Coach (Flowing). Evaluate board/flow. 
        Context: ${speechType}, ${side}, Topic: ${topic}. 
        Assess Organization, Grouping, Legibility, Suggestions. 
        User Notes: ${description}. 
        
        Please provide the output in the following Markdown format:
        ## Executive Summary
        (Brief overview)

        ## Scorecard
        | Category | Score (0-10) | Notes |
        | --- | --- | --- |
        | Organization | | |
        | Grouping | | |
        | Legibility | | |
        | Strategy | | |
        | **Total** | **(Sum)** | |

        ## Detailed Feedback
        ...
      `;

            const imageParts = images.map(img => ({
                inlineData: {
                    data: img.raw,
                    mimeType: img.mimeType
                }
            }));

            const result = await model.generateContent([prompt, ...imageParts]);
            const response = await result.response;
            const text = response.text();

            setResult(text);
            
            // Auto-save to history
            addSession({
                type: 'board',
                title: topic || 'Board Evaluation',
                input: { imageCount: images.length, description: description.substring(0, 200) },
                result: text,
                metadata: { speechType, side, topic }
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Gemini Error:", err);
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
                // Fallback logic
                const prompt = `... (same prompt) ...`;
                // Simplified for brevity in this artifact
                setError(`Error: ${err.message}. Please try again.`);
            } catch (fallbackErr) {
                setError(`Error: ${err.message}`);
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

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
            {/* Input Panel */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <div className="glass-card space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Format</label>
                            <select
                                value={speechType}
                                onChange={(e) => handleSpeechTypeChange(e.target.value)}
                                className="input-field"
                            >
                                {Object.entries(EVENT_SUBCATEGORIES).map(([subcategory, types]) => (
                                    <optgroup key={subcategory} label={subcategory}>
                                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Side</label>
                            <select
                                value={side}
                                onChange={(e) => setSide(e.target.value)}
                                className="input-field"
                            >
                                {applicableSides.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Topic</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Resolved: The United States should..."
                            className="input-field"
                        />
                    </div>
                </div>

                <div className="flex-1 glass-card flex flex-col p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50 bg-slate-900/50">
                        <label className="text-sm font-medium text-text-secondary">Board Images & Notes</label>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                        {/* Image Grid */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {images.map(img => (
                                    <div key={img.id} className="relative group aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                                        <img src={img.url} alt="Board" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(img.id)}
                                            className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Area */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                        >
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-sm font-medium">Click to upload images</span>
                            <span className="text-xs opacity-70">Max 4MB per file</span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                multiple
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add any specific notes or questions about the flow..."
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-primary resize-none h-24"
                        />
                    </div>

                    <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 flex justify-between items-center">
                        <span className="text-xs text-text-muted">{images.length} images</span>
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            {loading ? 'Analyzing...' : 'Evaluate Board'}
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
                        <ImageIcon className="w-4 h-4 text-primary" />
                        Evaluation
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
                            <ImageIcon className="w-16 h-16 mb-4" />
                            <p>Upload board images and click Evaluate.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EvaluateBoard;
