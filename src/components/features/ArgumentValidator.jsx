import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Target,
  FileText,
  Lightbulb,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

const CRITERIA = [
  { id: 'claim', label: 'Clear Claim', description: 'Does your argument have a specific, debatable claim?', icon: Target },
  { id: 'warrant', label: 'Warrant/Reasoning', description: 'Is there logical reasoning explaining WHY the claim is true?', icon: Lightbulb },
  { id: 'evidence', label: 'Evidence/Support', description: 'Do you have facts, statistics, or examples backing it up?', icon: FileText },
  { id: 'impact', label: 'Impact/Significance', description: 'Does your argument explain WHY this matters?', icon: ArrowRight },
  { id: 'link', label: 'Link to Resolution', description: 'Does this connect directly to the debate resolution?', icon: Shield }
];

const ArgumentValidator = () => {
  const [argument, setArgument] = useState('');
  const [checks, setChecks] = useState({});
  const [analyzed, setAnalyzed] = useState(false);

  const toggleCheck = (id) => {
    setChecks(prev => ({
      ...prev,
      [id]: prev[id] === 'yes' ? 'partial' : prev[id] === 'partial' ? 'no' : 'yes'
    }));
  };

  const analyze = () => {
    if (!argument.trim()) return;
    // Initialize all checks as unchecked for user to evaluate
    const initial = {};
    CRITERIA.forEach(c => { initial[c.id] = null; });
    setChecks(initial);
    setAnalyzed(true);
  };

  const reset = () => {
    setArgument('');
    setChecks({});
    setAnalyzed(false);
  };

  // Calculate strength
  const getStrength = () => {
    const values = Object.values(checks).filter(v => v !== null);
    if (values.length === 0) return { score: 0, label: 'Not Evaluated', color: 'slate' };
    
    const score = values.reduce((sum, v) => {
      if (v === 'yes') return sum + 1;
      if (v === 'partial') return sum + 0.5;
      return sum;
    }, 0);
    
    const percentage = (score / CRITERIA.length) * 100;
    
    if (percentage >= 80) return { score: percentage, label: 'Strong', color: 'green' };
    if (percentage >= 60) return { score: percentage, label: 'Good', color: 'blue' };
    if (percentage >= 40) return { score: percentage, label: 'Moderate', color: 'yellow' };
    return { score: percentage, label: 'Weak', color: 'red' };
  };

  const strength = getStrength();

  const getColorClasses = (color) => {
    const colors = {
      green: { bg: 'bg-surface-offset', border: 'border-hairline', text: 'text-ink', bar: 'bg-surface-offset' },
      blue: { bg: 'bg-accent-crimson/20', border: 'border-accent-crimson/50', text: 'text-ink', bar: 'bg-accent-crimson' },
      yellow: { bg: 'bg-surface-offset', border: 'border-hairline', text: 'text-ink', bar: 'bg-surface-offset' },
      red: { bg: 'bg-accent-crimson/20', border: 'border-accent-crimson/50', text: 'text-accent-crimson', bar: 'bg-accent-crimson' },
      slate: { bg: 'bg-surface-offset0/20', border: 'border-hairline', text: 'text-ink-muted', bar: 'bg-surface-offset0' }
    };
    return colors[color] || colors.slate;
  };

  const strengthColors = getColorClasses(strength.color);

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 /20 to-purple-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-ink" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-accent-crimson">Argument Validator</h1>
              <p className="text-ink-muted text-sm">Check your argument structure</p>
            </div>
          </div>
          {analyzed && (
            <button
              onClick={reset}
              className="flex items-center gap-2 px-3 py-2 text-ink-muted hover:text-accent-crimson transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-[var(--card-bg)]/50 border border-hairline/50 rounded-xl p-4 mb-6">
          <label className="text-accent-crimson font-medium mb-2 block">Your Argument</label>
          <textarea
            value={argument}
            onChange={(e) => setArgument(e.target.value)}
            placeholder="Enter your argument here...

Example: Climate change legislation is necessary because rising global temperatures threaten food security. According to NASA, average temperatures have risen 1.1°C since 1880. Without action, we risk widespread famine affecting millions."
            className="w-full h-40 bg-[var(--bg-accent-crimson)]/50 border border-hairline rounded-lg p-4 text-accent-crimson placeholder-slate-600 focus:outline-none focus:border-hairline resize-none"
            disabled={analyzed}
          />
          {!analyzed && (
            <button
              onClick={analyze}
              disabled={!argument.trim()}
              className="mt-4 w-full py-3 bg-accent-crimson hover:bg-accent-crimson disabled:bg-surface-parchment disabled:cursor-not-allowed text-accent-crimson rounded-lg font-medium transition-colors"
            >
              Analyze Argument
            </button>
          )}
        </div>

        {/* Checklist */}
        {analyzed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Strength Indicator */}
            <div className={`p-4 rounded-xl ${strengthColors.bg} border ${strengthColors.border}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-accent-crimson font-medium">Argument Strength</span>
                <span className={`font-bold ${strengthColors.text}`}>{strength.label}</span>
              </div>
              <div className="h-3 bg-[var(--bg-accent-crimson)]/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${strength.score}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`h-full ${strengthColors.bar} rounded-full`}
                />
              </div>
              <div className="text-right text-sm text-ink-muted mt-1">
                {Math.round(strength.score)}%
              </div>
            </div>

            {/* Criteria Checklist */}
            <div className="bg-[var(--card-bg)]/50 border border-hairline/50 rounded-xl p-4">
              <h3 className="text-accent-crimson font-medium mb-4">Evaluate Each Element</h3>
              <p className="text-ink-muted text-sm mb-4">Click each item to cycle through: ✓ Yes → ◐ Partial → ✗ No</p>
              
              <div className="space-y-3">
                {CRITERIA.map((criterion) => {
                  const value = checks[criterion.id];
                  const Icon = criterion.icon;
                  
                  return (
                    <button
                      key={criterion.id}
                      onClick={() => toggleCheck(criterion.id)}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        value === 'yes' ? 'bg-surface-offset border border-hairline' :
                        value === 'partial' ? 'bg-surface-offset border border-hairline' :
                        value === 'no' ? 'bg-accent-crimson/20 border border-accent-crimson/50' :
                        'bg-[var(--bg-accent-crimson)]/50 border border-hairline hover:border-hairline'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          value === 'yes' ? 'bg-surface-offset' :
                          value === 'partial' ? 'bg-surface-offset' :
                          value === 'no' ? 'bg-accent-crimson/20' :
                          'bg-[var(--card-bg)]'
                        }`}>
                          {value === 'yes' ? <CheckCircle className="w-5 h-5 text-ink" /> :
                           value === 'partial' ? <AlertCircle className="w-5 h-5 text-ink" /> :
                           value === 'no' ? <XCircle className="w-5 h-5 text-accent-crimson" /> :
                           <Icon className="w-5 h-5 text-ink-muted" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-accent-crimson font-medium">{criterion.label}</span>
                            <span className={`text-sm ${
                              value === 'yes' ? 'text-ink' :
                              value === 'partial' ? 'text-ink' :
                              value === 'no' ? 'text-accent-crimson' :
                              'text-ink-muted'
                            }`}>
                              {value === 'yes' ? 'Yes' :
                               value === 'partial' ? 'Partial' :
                               value === 'no' ? 'No' :
                               'Click to evaluate'}
                            </span>
                          </div>
                          <p className="text-ink-muted text-sm mt-1">{criterion.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tips */}
            {Object.values(checks).some(v => v === 'no' || v === 'partial') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[var(--card-bg)]/50 border border-hairline/50 rounded-xl p-4"
              >
                <h3 className="text-accent-crimson font-medium mb-3">💡 Improvement Tips</h3>
                <ul className="space-y-2 text-ink-muted text-sm">
                  {checks.claim !== 'yes' && (
                    <li>• Make your claim more specific and debatable</li>
                  )}
                  {checks.warrant !== 'yes' && (
                    <li>• Add reasoning that explains WHY your claim is true</li>
                  )}
                  {checks.evidence !== 'yes' && (
                    <li>• Include statistics, studies, or expert opinions</li>
                  )}
                  {checks.impact !== 'yes' && (
                    <li>• Explain the significance - why should the judge care?</li>
                  )}
                  {checks.link !== 'yes' && (
                    <li>• Directly connect your argument to the resolution</li>
                  )}
                </ul>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArgumentValidator;
