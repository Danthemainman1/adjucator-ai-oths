import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Mic, Square, Loader2, AlertCircle, Activity, Play, RotateCcw, CheckCircle2, Copy, History } from 'lucide-react';
import { speechTypes, sides } from '../data/constants';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSessionHistory } from '../hooks/useSessionHistory';

// --- Visualizer Components ---

const AudioVisualizer = ({ analyser, isRecording }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!analyser || !isRecording || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let animationId;

        const draw = () => {
            animationId = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                // Gradient color based on height
                const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
                gradient.addColorStop(0, '#06b6d4'); // Cyan
                gradient.addColorStop(1, '#8b5cf6'); // Violet

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();

        return () => cancelAnimationFrame(animationId);
    }, [analyser, isRecording]);

    if (!isRecording) return <div className="w-full h-24 bg-slate-900/50 rounded-lg flex items-center justify-center text-slate-700 text-xs">Visualizer Ready</div>;

    return <canvas ref={canvasRef} width={300} height={100} className="w-full h-24 rounded-lg bg-slate-900/50" />;
};

const ToneIndicator = ({ analyser, isRecording }) => {
    const [metrics, setMetrics] = useState({ volume: 0, brightness: 0 });
    const [feedback, setFeedback] = useState({ label: 'Ready', color: 'text-slate-500' });
    const smoothedMetrics = useRef({ volume: 0, brightness: 0 });

    useEffect(() => {
        if (!analyser || !isRecording) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const waveformArray = new Uint8Array(analyser.fftSize);

        let updateId;

        const update = () => {
            analyser.getByteFrequencyData(dataArray);
            analyser.getByteTimeDomainData(waveformArray);

            // Calculate Volume (RMS)
            let sum = 0;
            for (let i = 0; i < waveformArray.length; i++) {
                const amplitude = (waveformArray[i] - 128) / 128;
                sum += amplitude * amplitude;
            }
            const rawVolume = Math.sqrt(sum / waveformArray.length); // 0 to 1

            // Calculate Brightness (Spectral Centroid)
            let numerator = 0;
            let denominator = 0;
            for (let i = 0; i < bufferLength; i++) {
                numerator += i * dataArray[i];
                denominator += dataArray[i];
            }
            const rawBrightness = denominator === 0 ? 0 : (numerator / denominator) / bufferLength; // 0 to 1

            // Apply Smoothing
            const alpha = 0.15;
            smoothedMetrics.current.volume = smoothedMetrics.current.volume * (1 - alpha) + rawVolume * alpha;
            smoothedMetrics.current.brightness = smoothedMetrics.current.brightness * (1 - alpha) + rawBrightness * alpha;

            const { volume, brightness } = smoothedMetrics.current;
            setMetrics({ volume, brightness });

            // Determine Tone Label
            if (volume < 0.01) {
                setFeedback({ label: 'Listening...', color: 'text-slate-500' });
            } else if (volume < 0.05) {
                setFeedback({ label: 'Too Quiet', color: 'text-amber-500' });
            } else if (volume > 0.6) {
                setFeedback({ label: 'Too Loud', color: 'text-red-500' });
            } else {
                if (brightness > 0.5) {
                    setFeedback({ label: 'Urgent / Intense', color: 'text-orange-500' });
                } else if (brightness < 0.2) {
                    setFeedback({ label: 'Serious', color: 'text-indigo-500' });
                } else {
                    setFeedback({ label: 'Balanced', color: 'text-green-500' });
                }
            }

            updateId = requestAnimationFrame(update);
        };

        update();
        return () => cancelAnimationFrame(updateId);
    }, [analyser, isRecording]);

    if (!isRecording) return null;

    return (
        <div className="flex flex-col items-center space-y-2 mt-4 animate-in fade-in">
            <div className={`text-lg font-bold ${feedback.color} transition-colors duration-300`}>
                {feedback.label}
            </div>
            <div className="flex space-x-4 text-xs text-slate-400">
                <div className="flex flex-col items-center">
                    <div className="h-16 w-4 bg-slate-800 rounded-full overflow-hidden relative">
                        <div
                            className="absolute bottom-0 left-0 w-full bg-cyan-500 transition-all duration-100"
                            style={{ height: `${Math.min(metrics.volume * 200, 100)}%` }}
                        ></div>
                    </div>
                    <span className="mt-1">Vol</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="h-16 w-4 bg-slate-800 rounded-full overflow-hidden relative">
                        <div
                            className="absolute bottom-0 left-0 w-full bg-purple-500 transition-all duration-100"
                            style={{ height: `${Math.min(metrics.brightness * 300, 100)}%` }}
                        ></div>
                    </div>
                    <span className="mt-1">Tone</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const LiveCoach = ({ apiKey }) => {
    const [speechType, setSpeechType] = useState('Public Forum (PF)');
    const [side, setSide] = useState('Proposition/Affirmative');
    const [topic, setTopic] = useState('');

    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioData, setAudioData] = useState(null); // Base64 for API
    const [analyser, setAnalyser] = useState(null);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);

    const { addSession } = useSessionHistory();

    const mediaRecorderRef = useRef(null);
    const timerRef = useRef(null);
    const chunksRef = useRef([]);
    const audioContextRef = useRef(null);
    const streamRef = useRef(null);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const startRecording = async () => {
        setError('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Audio Context Setup for Visualization
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyserNode = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyserNode);
            analyserNode.fftSize = 256;

            audioContextRef.current = audioContext;
            setAnalyser(analyserNode);

            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);

                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64String = reader.result.split(',')[1];
                    setAudioData({ raw: base64String, mimeType: blob.type });
                };

                // Cleanup
                if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
                if (audioContextRef.current) {
                    audioContextRef.current.close();
                    audioContextRef.current = null;
                    setAnalyser(null);
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);
            setAudioData(null);
            setAudioBlob(null);
            setResult(null);

            timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        } catch (err) {
            setError("Could not access microphone. Ensure permissions are granted.");
            console.error(err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const resetRecording = () => {
        setAudioData(null);
        setAudioBlob(null);
        setRecordingTime(0);
        setResult(null);
        setError('');
    };

    const handleAnalyze = async () => {
        if (!apiKey) {
            setError('Please enter a valid Gemini API Key in Settings.');
            return;
        }
        if (!audioData) {
            setError('Please record audio first.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

            const prompt = `
        Expert Speech Coach. Listen to audio. 
        Context: ${speechType}, ${side}, Topic: ${topic}. 
        Evaluate: 
        1. Vocal Delivery (Pace, Tone, Fluency, Emotion). 
        2. Content (Clarity, Persuasion). 
        3. Score (0-100).
        
        Please provide the output in the following Markdown format:
        ## Executive Summary
        (Brief overview)

        ## Scorecard
        | Category | Score (0-10) | Notes |
        | --- | --- | --- |
        | Vocal Delivery | | |
        | Content | | |
        | Persuasion | | |
        | **Total** | **(Sum)** | |

        ## Detailed Feedback
        ...
      `;

            const audioPart = {
                inlineData: {
                    data: audioData.raw,
                    mimeType: audioData.mimeType
                }
            };

            const result = await model.generateContent([prompt, audioPart]);
            const response = await result.response;
            const text = response.text();

            setResult(text);
            
            // Auto-save to history
            addSession({
                type: 'coach',
                title: topic || 'Live Coaching Session',
                input: { duration: formatTime(recordingTime) },
                result: text,
                metadata: { speechType, side, topic, recordingDuration: recordingTime }
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Gemini Error:", err);
            // Fallback logic could go here
            setError(`Error: ${err.message}. Please try again.`);
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
                                onChange={(e) => setSpeechType(e.target.value)}
                                className="input-field"
                            >
                                {speechTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Side</label>
                            <select
                                value={side}
                                onChange={(e) => setSide(e.target.value)}
                                className="input-field"
                            >
                                {sides.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Topic</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Topic or Resolution..."
                            className="input-field"
                        />
                    </div>
                </div>

                <div className="flex-1 glass-card flex flex-col p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50 bg-slate-900/50">
                        <label className="text-sm font-medium text-text-secondary">Live Recording</label>
                    </div>

                    <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-8">
                        {/* Timer */}
                        <div className={`text-6xl font-mono font-bold tracking-tighter ${isRecording ? 'text-red-500 animate-pulse' : 'text-text-primary'}`}>
                            {formatTime(recordingTime)}
                        </div>

                        {/* Visualizer */}
                        <div className="w-full max-w-md">
                            <AudioVisualizer analyser={analyser} isRecording={isRecording} />
                            <ToneIndicator analyser={analyser} isRecording={isRecording} />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                            {!isRecording ? (
                                <button
                                    onClick={startRecording}
                                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 transition-all hover:scale-110 active:scale-95"
                                >
                                    <Mic className="w-8 h-8 text-white" />
                                </button>
                            ) : (
                                <button
                                    onClick={stopRecording}
                                    className="w-16 h-16 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
                                >
                                    <Square className="w-6 h-6 text-white fill-current" />
                                </button>
                            )}
                        </div>

                        {audioBlob && !isRecording && (
                            <div className="flex items-center gap-4 animate-in fade-in">
                                <audio controls src={URL.createObjectURL(audioBlob)} className="h-10 rounded-lg" />
                                <button onClick={resetRecording} className="p-2 text-text-muted hover:text-white transition-colors">
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 flex justify-between items-center">
                        <span className="text-xs text-text-muted">{audioBlob ? 'Audio recorded' : 'Ready to record'}</span>
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !audioData}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                            {loading ? 'Analyzing...' : 'Analyze Audio'}
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
                        <Activity className="w-4 h-4 text-primary" />
                        Coaching Feedback
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
                            <Mic className="w-16 h-16 mb-4" />
                            <p>Record speech and click Analyze.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveCoach;
