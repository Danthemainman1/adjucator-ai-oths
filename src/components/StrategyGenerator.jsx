import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
    Target, 
    Loader2, 
    AlertCircle, 
    Copy, 
    CheckCircle2, 
    History,
    Sparkles,
    BookOpen,
    Swords,
    Shield,
    Clock,
    Lightbulb
} from 'lucide-react';
import { speechTypes, sides } from '../data/constants';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSessionHistory } from '../hooks/useSessionHistory';

const StrategyGenerator = ({ apiKey }) => {
    const [speechType, setSpeechType] = useState('Public Forum (PF)');
    const [side, setSide] = useState('Proposition/Affirmative');
    const [topic, setTopic] = useState('');
    const [context, setContext] = useState('');
    const [strategyType, setStrategyType] = useState('comprehensive');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const { addSession } = useSessionHistory();

    const strategyTypes = [
        { id: 'comprehensive', label: 'Full Strategy', icon: Target, description: 'Complete debate strategy with arguments, rebuttals, and flow' },
        { id: 'arguments', label: 'Argument Builder', icon: Lightbulb, description: 'Focus on constructing strong arguments' },
        { id: 'rebuttals', label: 'Rebuttal Prep', icon: Shield, description: 'Anticipate and counter opponent arguments' },
        { id: 'crossfire', label: 'Cross-Ex Prep', icon: Swords, description: 'Strategic questions and responses' },
    ];

    const handleGenerate = async () => {
        if (!apiKey) {
            setError('Please enter a valid Gemini API Key in Settings.');
            return;
        }
        if (!topic.trim()) {
            setError('Please enter the debate topic or resolution.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

            const prompts = {
                comprehensive: `You are an expert Debate Coach preparing a student for a ${speechType} debate.

**Topic/Resolution:** ${topic}
**Side:** ${side}
${context ? `**Additional Context:** ${context}` : ''}

Generate a COMPREHENSIVE DEBATE STRATEGY. Include:

## 📋 Strategic Overview
A brief (2-3 sentence) overview of the best approach for this position.

## 🎯 Core Framework
The central theme/value/criterion that should anchor all arguments.

## 💡 Main Arguments (3-4)
For each argument provide:
### Argument 1: [Compelling Title]
- **Claim**: The main assertion (1 sentence)
- **Warrant**: The logical reasoning (2-3 sentences)
- **Impact**: Why this matters - include magnitude, timeframe, probability
- **Evidence Needed**: Specific types of sources/data to find
- **Tag Line**: A memorable 5-7 word summary

## 🛡️ Anticipated Opponent Arguments
For the top 3 likely opponent arguments:
### Counter to: [Their Argument]
- **Their likely claim**: What they'll say
- **Your response strategy**: How to refute it
- **Turn potential**: Can you flip this to your advantage?

## ⚔️ Cross-Examination Strategy
### Questions to Ask
1. [Strategic question with goal]
2. [Strategic question with goal]
3. [Strategic question with goal]

### Likely Questions You'll Face
- [Question] → [Prepared response]
- [Question] → [Prepared response]

## 📊 Flow Visualization
\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                      ${side.toUpperCase()} FLOW                 │
├─────────────┬─────────────┬─────────────┬──────────────────────┤
│ CONSTRUCTIVE│  REBUTTAL   │   SUMMARY   │    FINAL FOCUS       │
├─────────────┼─────────────┼─────────────┼──────────────────────┤
│ [Arg 1]     │ [Extend]    │ [Voters]    │ [Key takeaway]       │
├─────────────┼─────────────┼─────────────┼──────────────────────┤
│ [Arg 2]     │ [Respond]   │ [Weigh]     │ [Emotional close]    │
└─────────────┴─────────────┴─────────────┴──────────────────────┘
\`\`\`

## ⏱️ Time Allocation
| Speech | Time | Focus |
|--------|------|-------|
| Constructive | X min | ... |
| Rebuttal | X min | ... |
| Summary | X min | ... |
| Final Focus | X min | ... |

## 🏆 Win Conditions
The 2-3 things that MUST happen to win this round:
1. ...
2. ...
3. ...

## 💎 Power Phrases
5 memorable phrases to use during the round:
1. "..."
2. "..."
3. "..."
4. "..."
5. "..."
`,
                arguments: `You are an expert Debate Coach specializing in argument construction for ${speechType}.

**Topic/Resolution:** ${topic}
**Side:** ${side}
${context ? `**Additional Context:** ${context}` : ''}

Generate 4-5 STRONG ARGUMENTS for this position:

## Argument Analysis Framework

For EACH argument, provide:

### 💡 Argument [N]: [Compelling Title]

#### The Claim
A clear, assertive 1-sentence statement.

#### Logical Structure
- **Premise 1**: ...
- **Premise 2**: ...
- **Conclusion**: ...

#### Warrant Deep-Dive
Explain the logical reasoning in 3-4 sentences. Why does the claim follow from the evidence?

#### Impact Calculus
| Factor | Assessment |
|--------|------------|
| **Magnitude** | How big is the impact? |
| **Probability** | How likely? |
| **Timeframe** | When does it occur? |
| **Reversibility** | Can it be undone? |

#### Evidence Guide
- **Statistics needed**: ...
- **Expert quotes**: Types of experts to cite
- **Case studies**: Historical/current examples to find
- **Logical backing**: Philosophical/theoretical support

#### Delivery Tips
- Opening hook: "..."
- Key transition phrases
- Powerful conclusion line

#### Vulnerability Analysis
- Weakest point of this argument
- How opponents might attack
- Pre-emptive defense strategy

---

## Argument Hierarchy
Rank arguments by strength and when to deploy them:
1. **Strongest** (Lead with this): Argument X
2. **Most Emotional** (Final Focus): Argument Y
3. **Technical** (For experienced judges): Argument Z
`,
                rebuttals: `You are an expert Debate Coach specializing in rebuttal strategy for ${speechType}.

**Topic/Resolution:** ${topic}
**Your Side:** ${side}
**Opponent's Side:** ${side.includes('Affirmative') || side.includes('Pro') ? 'Opposition/Negative' : 'Proposition/Affirmative'}
${context ? `**Additional Context:** ${context}` : ''}

Generate a COMPREHENSIVE REBUTTAL PREPARATION guide:

## 🔮 Opponent Argument Predictions

### Predicted Argument 1: [Title]
**What they'll likely say:**
> [Their argument in their words]

**Why this is flawed:**
- Logical flaw: ...
- Evidence problem: ...
- Impact overreach: ...

**Your Rebuttal Response:**
"[Exact words to say - 30-45 seconds]"

**The Turn (flip it to your advantage):**
"Actually, this argument supports OUR side because..."

---

### Predicted Argument 2: [Title]
[Same structure]

---

### Predicted Argument 3: [Title]
[Same structure]

---

## 🛡️ Defense Blocks

### If They Attack Your [Argument 1]:
**Their likely attack:** ...
**Your defense:** "[30-second response]"

### If They Attack Your [Argument 2]:
**Their likely attack:** ...
**Your defense:** "[30-second response]"

## ⚡ Quick-Fire Responses
One-liner responses to common attacks:

| If they say... | You respond... |
|----------------|----------------|
| "..." | "..." |
| "..." | "..." |
| "..." | "..." |

## 📊 Weighing Mechanisms
How to compare impacts when both sides have valid points:

### Magnitude Weighing
"Even if they win X, our impact of Y is larger because..."

### Probability Weighing
"Their impact is speculative, while ours is empirically proven..."

### Timeframe Weighing
"Their impact is long-term and uncertain, our harm is happening now..."

## 🎯 Kill Shots
Arguments that completely devastate common opponent positions:

1. **Against [common position]:** ...
2. **Against [common position]:** ...
`,
                crossfire: `You are an expert Debate Coach specializing in Cross-Examination/Crossfire strategy for ${speechType}.

**Topic/Resolution:** ${topic}
**Your Side:** ${side}
${context ? `**Additional Context:** ${context}` : ''}

Generate a COMPREHENSIVE CROSS-EXAMINATION STRATEGY:

## 🎯 Your Questioning Strategy

### Goal-Oriented Questions
Each question should serve a strategic purpose:

#### Setup Questions (Establish facts)
1. **Question:** "..."
   - **Goal:** Get them to admit X
   - **Follow-up if yes:** "..."
   - **Follow-up if no:** "..."

2. **Question:** "..."
   - **Goal:** ...

#### Trap Questions (Expose contradictions)
1. **Question:** "..."
   - **The trap:** If they say X, point out Y
   - **Delivery:** Stay calm, don't telegraph

2. **Question:** "..."
   - **The trap:** ...

#### Concession Questions (Get admissions)
1. **Question:** "..."
   - **Looking for:** Them to admit your framing
   - **Use in later speeches:** "They agreed that..."

### Question Sequences
**To undermine their Argument 1:**
1. First ask: "..."
2. Then: "..."
3. Finish with: "..."

**To support your Argument 1:**
1. First ask: "..."
2. Then: "..."
3. Finish with: "..."

## 🛡️ Defending in Cross-Ex

### Likely Questions You'll Face
| Their Question | Your Response Strategy |
|----------------|----------------------|
| "..." | [Don't concede X, instead say...] |
| "..." | [Bridge to your argument...] |
| "..." | [Ask for clarification to buy time...] |

### Deflection Techniques
- **"That's not the right framing..."** then reframe
- **"The real question is..."** pivot to your ground
- **"We can discuss that, but first..."** delay and redirect

### Trap Avoidance
Common traps and how to spot/avoid them:
1. **The false dichotomy:** They present only two options. Response: "Those aren't the only options..."
2. **The hypothetical spiral:** They create unrealistic scenarios. Response: "In the real world..."
3. **The quote trap:** They try to get quotable admissions. Response: "What I'm saying is..." (reframe)

## 💪 Power Moves

### Taking Control
- "Let me finish this point..."
- "That's a different question, I'm asking about..."
- "With respect, that doesn't answer the question..."

### Memorable Moments
Crossfire zingers (use sparingly):
- "So you're agreeing with us that..."
- "If that's true, then your entire case falls apart..."
- "You've just proven our point..."

## ⏱️ Time Management
| Phase | Your Goals |
|-------|------------|
| First 30 sec | Establish one key admission |
| Middle | Build your trap sequence |
| Final 30 sec | Land your strongest point |
`
            };

            const result = await model.generateContent(prompts[strategyType]);
            const response = await result.response;
            const text = response.text();

            setResult(text);

            // Auto-save to history
            addSession({
                type: 'strategy',
                title: `${strategyTypes.find(s => s.id === strategyType)?.label}: ${topic.substring(0, 50)}`,
                input: { topic, context },
                result: text,
                metadata: { speechType, side, topic, strategyType }
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
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                            <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Strategy Generator</h2>
                            <p className="text-xs text-text-muted">AI-powered debate preparation</p>
                        </div>
                    </div>

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
                        <label className="block text-sm font-medium text-text-secondary mb-1">Topic / Resolution</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Resolved: The United States should substantially increase..."
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                            Additional Context <span className="text-text-muted">(optional)</span>
                        </label>
                        <textarea
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="E.g., specific arguments you want to focus on, your opponent's known style, judge preferences..."
                            className="input-field resize-none h-20"
                        />
                    </div>
                </div>

                {/* Strategy Type Selection */}
                <div className="glass-card p-4">
                    <label className="block text-sm font-medium text-text-secondary mb-3">Strategy Type</label>
                    <div className="grid grid-cols-2 gap-3">
                        {strategyTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => setStrategyType(type.id)}
                                    className={`p-4 rounded-xl border text-left transition-all ${
                                        strategyType === type.id
                                            ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/10'
                                            : 'bg-slate-900/30 border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <Icon className={`w-5 h-5 ${strategyType === type.id ? 'text-primary' : 'text-text-muted'}`} />
                                        <span className={`font-medium ${strategyType === type.id ? 'text-white' : 'text-text-secondary'}`}>
                                            {type.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-muted">{type.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={loading || !topic.trim()}
                    className="btn-primary py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating Strategy...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Generate Strategy
                        </>
                    )}
                </button>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}
            </div>

            {/* Output Panel */}
            <div className="w-full lg:w-1/2 glass-card overflow-hidden flex flex-col p-0">
                <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Strategy Playbook
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
                        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-cyan-400 prose-a:text-accent prose-strong:text-white prose-table:border-collapse prose-th:border prose-th:border-slate-700 prose-td:border prose-td:border-slate-700 prose-th:p-2 prose-td:p-2 prose-th:bg-slate-800/50 prose-code:bg-slate-800 prose-code:px-1 prose-code:rounded prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-blockquote:border-l-primary prose-blockquote:bg-slate-900/50 prose-blockquote:py-1">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                            <Target className="w-16 h-16 mb-4" />
                            <p className="text-center max-w-xs">
                                Enter your debate topic and select a strategy type to generate your personalized playbook.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StrategyGenerator;
