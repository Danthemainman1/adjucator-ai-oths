import React, { useState } from 'react';
import { HelpCircle, Loader2, AlertCircle, RefreshCw, Copy, CheckCircle2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const ExtempGenerator = ({ apiKey }) => {
    const [category, setCategory] = useState('DX'); // DX or NX
    const [difficulty, setDifficulty] = useState('Medium');
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

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
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

            const prompt = `Generate a single ${difficulty} difficulty Extemporaneous Speaking question for the category ${category === 'DX' ? 'United States Domestic Extemp (DX)' : 'International Extemp (NX)'}. The question should be current, relevant to 2024-2025 events, and formatted as a question. Do not include any other text.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setQuestion(text.trim().replace(/^"|"$/g, ''));
        } catch (err) {
            console.error("Gemini Error:", err);
            try {
                // Fallback
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
        <div className="max-w-2xl mx-auto mt-10">
            <div className="glass-card space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <HelpCircle className="w-8 h-8 text-primary" />
                        Extemp Generator
                    </h2>
                    <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-700">
                        <button
                            onClick={() => setCategory('DX')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${category === 'DX' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                        >
                            Domestic (DX)
                        </button>
                        <button
                            onClick={() => setCategory('NX')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${category === 'NX' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                        >
                            International (NX)
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-secondary">Difficulty Level</label>
                    <div className="grid grid-cols-3 gap-4">
                        {['Easy', 'Medium', 'Hard'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setDifficulty(level)}
                                className={`py-3 rounded-xl border transition-all ${difficulty === level
                                        ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10'
                                        : 'bg-slate-900/30 border-slate-700 text-text-secondary hover:border-slate-500 hover:bg-slate-800'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={generateQuestion}
                    disabled={loading}
                    className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCw className="w-6 h-6" />}
                    {loading ? 'Generating Question...' : 'Generate New Question'}
                </button>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
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
                                className="absolute top-4 right-4 p-2 text-text-secondary hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Copy to clipboard"
                            >
                                {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExtempGenerator;
