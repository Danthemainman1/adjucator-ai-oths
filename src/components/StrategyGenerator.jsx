import React, { useState, useMemo } from 'react';
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
    Lightbulb,
    Info
} from 'lucide-react';
import { speechTypes } from '../data/constants';
import { 
    eventCategoryMap, 
    EVENT_CATEGORIES,
    EVENT_SUBCATEGORIES,
    getApplicableSides 
} from '../data/eventConfig';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSessionHistory } from '../hooks/useSessionHistory';

const StrategyGenerator = ({ apiKey }) => {
    // Only show debate and congress events for strategy generator
    const debateEvents = useMemo(() => 
        speechTypes.filter(type => 
            eventCategoryMap[type] === EVENT_CATEGORIES.DEBATE || 
            eventCategoryMap[type] === EVENT_CATEGORIES.CONGRESS
        ),
    []);
    
    // Group debate events by subcategory
    const groupedDebateEvents = useMemo(() => {
        const groups = {};
        Object.entries(EVENT_SUBCATEGORIES).forEach(([subcategory, events]) => {
            const debateOnly = events.filter(e => debateEvents.includes(e));
            if (debateOnly.length > 0) {
                groups[subcategory] = debateOnly;
            }
        });
        return groups;
    }, [debateEvents]);

    const [speechType, setSpeechType] = useState(debateEvents[0] || 'Public Forum (PF)');
    const [side, setSide] = useState('Pro/Affirmative');
    const [topic, setTopic] = useState('');
    const [context, setContext] = useState('');
    const [strategyType, setStrategyType] = useState('comprehensive');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const { addSession } = useSessionHistory();

    const applicableSides = useMemo(() => getApplicableSides(speechType), [speechType]);
    
    // Update side when speech type changes
    const handleSpeechTypeChange = (newType) => {
        setSpeechType(newType);
        const newSides = getApplicableSides(newType);
        if (!newSides.includes(side)) {
            setSide(newSides[0]);
        }
    };

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
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-accent-crimson)] tracking-tight">Strategy Generator</h1>
                <p className="text-[var(--text-muted)] mt-1">Build winning debate strategies with AI</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Input Panel */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="p-6 rounded-2xl border border-[var(--border)]/60 bg-[var(--bg-accent-crimson)]/30  space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Debate Format</label>
                                <select
                                    value={speechType}
                                    onChange={(e) => handleSpeechTypeChange(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-accent-crimson)]/50 border border-[var(--border)] text-[var(--text-accent-crimson)] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                >
                                    {Object.entries(groupedDebateEvents).map(([subcategory, types]) => (
                                        <optgroup key={subcategory} label={subcategory}>
                                            {types.map(t => <option key={t} value={t}>{t}</option>)}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Side</label>
                                <select
                                    value={side}
                                    onChange={(e) => setSide(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-accent-crimson)]/50 border border-[var(--border)] text-[var(--text-accent-crimson)] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                >
                                    {applicableSides.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Info banner */}
                        <div className="p-4 rounded-xl bg-accent-crimson/10 border border-accent-crimson/20">
                            <div className="flex items-center gap-3 text-blue-400 text-sm">
                                <Info className="w-5 h-5 flex-shrink-0" />
                                <span>Strategy Generator is optimized for all NSDA debate formats including Congressional, Parli, and World Schools.</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Topic / Resolution</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Resolved: The United States should substantially increase..."
                                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-accent-crimson)]/50 border border-[var(--border)] text-[var(--text-accent-crimson)] placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                                Additional Context <span className="text-ink-muted">(optional)</span>
                            </label>
                            <textarea
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                placeholder="E.g., specific arguments you want to focus on, your opponent's known style..."
                                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-accent-crimson)]/50 border border-[var(--border)] text-[var(--text-accent-crimson)] placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none h-24"
                            />
                        </div>
                    </div>

                    {/* Strategy Type Selection */}
                    <div className="p-6 rounded-2xl border border-[var(--border)]/60 bg-[var(--bg-accent-crimson)]/30 ">
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-4">Strategy Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            {strategyTypes.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setStrategyType(type.id)}
                                        className={`p-4 rounded-xl border text-left transition-all ${
                                            strategyType === type.id
                                                ? 'bg-orange-500/10 border-orange-500/30 shadow-lg shadow-orange-500/10'
                                                : 'bg-[var(--bg-accent-crimson)]/30 border-[var(--border)] hover:border-[var(--border)] hover:bg-[var(--card-bg)]/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Icon className={`w-5 h-5 ${strategyType === type.id ? 'text-orange-400' : 'text-[var(--text-muted)]'}`} />
                                            <span className={`font-medium ${strategyType === type.id ? 'text-[var(--text-accent-crimson)]' : 'text-[var(--text-muted)]'}`}>
                                                {type.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)]">{type.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !topic.trim()}
                        className="w-full py-4 rounded-xl  text-[var(--text-accent-crimson)] text-lg font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
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
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}
                </div>

                {/* Output Panel */}
                <div className="w-full lg:w-1/2 rounded-2xl border border-[var(--border)]/60 bg-[var(--bg-accent-crimson)]/30  overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-[var(--border)]/60 bg-[var(--bg-accent-crimson)]/50 flex justify-between items-center">
                        <h3 className="font-semibold text-[var(--text-accent-crimson)] flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-orange-400" />
                            Strategy Playbook
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
                                    className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-accent-crimson)] hover:bg-[var(--card-bg)] transition-all"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {result ? (
                            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-orange-400 prose-headings:font-semibold prose-a:text-orange-400 prose-strong:text-[var(--text-accent-crimson)] prose-table:border-collapse prose-th:border prose-th:border-[var(--border)] prose-td:border prose-td:border-[var(--border)] prose-th:p-3 prose-td:p-3 prose-th:bg-[var(--card-bg)]/50 prose-th:text-left prose-code:bg-[var(--card-bg)] prose-code:px-1.5 prose-code:rounded prose-pre:bg-[var(--bg-accent-crimson)] prose-pre:border prose-pre:border-[var(--border)] prose-blockquote:border-l-orange-500 prose-blockquote:bg-[var(--bg-accent-crimson)]/50 prose-blockquote:py-1">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] py-16">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--card-bg)]/50 flex items-center justify-center mb-4">
                                    <Target className="w-8 h-8" />
                                </div>
                                <p className="text-center max-w-xs">
                                    Enter your debate topic and select a strategy type to generate your personalized playbook.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StrategyGenerator;
