import React, { useState } from 'react';
import { HelpCircle, Loader2, AlertCircle, RefreshCw, Copy, CheckCircle2, History } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSessionHistory } from '../hooks/useSessionHistory';

const ExtempGenerator = ({ apiKey }) => {
    const [category, setCategory] = useState('DX'); // DX or NX
    const [difficulty, setDifficulty] = useState('Medium');
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const { addSession } = useSessionHistory();

    const generateQuestion = async () => {
        if (!apiKey) {
            setError('Please enter a valid Gemini API Key in Settings.');
            return;
        }

        setLoading(true);
        setQuestion('');
        setError('');

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

            const prompt = `Generate a single ${difficulty} difficulty Extemporaneous Speaking question for the category ${category === 'DX' ? 'United States Domestic Extemp (DX)' : 'International Extemp (NX)'}. The question should be current, relevant to 2024-2025 events, and formatted as a question. Do not include any other text.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const generatedQuestion = text.trim().replace(/^"|"$/g, '');
            setQuestion(generatedQuestion);
            
            // Auto-save to history
            addSession({
                type: 'extemp',
                title: `${category} Question - ${difficulty}`,
                input: { question: generatedQuestion },
                result: generatedQuestion,
                metadata: { category, difficulty }
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Gemini Error:", err);
            try {
                // Fallback
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
                // ... same prompt ...
                setError(`Error: ${err.message}. Please try again.`);
            } catch (fallbackErr) {
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (question) {
            navigator.clipboard.writeText(question);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Extemp Generator</h1>
                <p className="text-slate-400 mt-1">Generate practice questions for extemporaneous speaking</p>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm space-y-8">
                    {/* Category Toggle */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-300">Category</label>
                        <div className="flex bg-slate-900/50 rounded-xl p-1 border border-slate-800">
                            <button
                                onClick={() => setCategory('DX')}
                                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${category === 'DX' 
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                                    : 'text-slate-400 hover:text-white'}`}
                            >
                                Domestic (DX)
                            </button>
                            <button
                                onClick={() => setCategory('NX')}
                                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${category === 'NX' 
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                                    : 'text-slate-400 hover:text-white'}`}
                            >
                                International (NX)
                            </button>
                        </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-300">Difficulty Level</label>
                        <div className="grid grid-cols-3 gap-4">
                            {['Easy', 'Medium', 'Hard'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`py-4 rounded-xl border transition-all font-medium ${difficulty === level
                                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10'
                                        : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={generateQuestion}
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCw className="w-6 h-6" />}
                        {loading ? 'Generating Question...' : 'Generate New Question'}
                    </button>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {question && (
                        <div className="animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-8 relative group">
                                <p className="text-xl md:text-2xl font-serif text-center text-white leading-relaxed">
                                    "{question}"
                                </p>
                                <button
                                    onClick={copyToClipboard}
                                    className="absolute top-4 right-4 p-2.5 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                                {saved && (
                                    <span className="absolute top-4 left-4 text-xs text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg font-medium">
                                        <History className="w-3 h-3" /> Saved to history
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExtempGenerator;
