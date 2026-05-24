import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Gavel,
  Save,
  Trash2,
  Plus,
  Clock,
  FileText,
  ChevronDown,
  Check
} from 'lucide-react';

const DEFAULT_SECTIONS = [
  { id: 'aff-case', label: 'Affirmative Case', placeholder: 'Key arguments, values, contentions...' },
  { id: 'neg-case', label: 'Negative Case', placeholder: 'Key arguments, values, contentions...' },
  { id: 'clash', label: 'Clash Points', placeholder: 'Where do the cases interact? Key conflicts...' },
  { id: 'cx', label: 'Cross-Examination', placeholder: 'Important admissions, key questions...' },
  { id: 'voting', label: 'Voting Issues', placeholder: 'Why you\'re voting the way you are...' },
  { id: 'feedback', label: 'Feedback Notes', placeholder: 'Constructive feedback for debaters...' }
];

const JudgeNotes = () => {
  const [rounds, setRounds] = useState([]);
  const [activeRoundId, setActiveRoundId] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('judge-notes');
    if (saved) {
      const parsed = JSON.parse(saved);
      setRounds(parsed);
      if (parsed.length > 0) setActiveRoundId(parsed[0].id);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (rounds.length > 0) {
      localStorage.setItem('judge-notes', JSON.stringify(rounds));
    }
  }, [rounds]);

  const activeRound = rounds.find(r => r.id === activeRoundId);

  const createRound = () => {
    const newRound = {
      id: Date.now().toString(),
      name: `Round ${rounds.length + 1}`,
      createdAt: new Date().toISOString(),
      sections: DEFAULT_SECTIONS.reduce((acc, s) => ({ ...acc, [s.id]: '' }), {})
    };
    setRounds([newRound, ...rounds]);
    setActiveRoundId(newRound.id);
  };

  const updateRoundName = (name) => {
    setRounds(rounds.map(r => 
      r.id === activeRoundId ? { ...r, name } : r
    ));
  };

  const updateSection = (sectionId, value) => {
    setRounds(rounds.map(r => 
      r.id === activeRoundId 
        ? { ...r, sections: { ...r.sections, [sectionId]: value } }
        : r
    ));
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 300);
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const deleteRound = (id) => {
    const filtered = rounds.filter(r => r.id !== id);
    setRounds(filtered);
    localStorage.setItem('judge-notes', JSON.stringify(filtered));
    if (activeRoundId === id) {
      setActiveRoundId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 /20 to-orange-500/20 rounded-lg">
              <Gavel className="w-6 h-6 text-ink" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-accent-crimson">Judge Notes</h1>
              <p className="text-ink-muted text-sm">Track notes during debates</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-sm"
              >
                {saveStatus === 'saving' ? (
                  <span className="text-ink-muted">Saving...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-ink" />
                    <span className="text-ink">Saved</span>
                  </>
                )}
              </motion.div>
            )}
            <button
              onClick={createRound}
              className="flex items-center gap-2 px-4 py-2 bg-surface-offset hover:bg-surface-offset text-accent-crimson rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Round
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Rounds List */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card-bg)]/50 border border-hairline/50 rounded-xl p-4">
              <h3 className="text-accent-crimson font-medium mb-3">Rounds</h3>
              {rounds.length === 0 ? (
                <div className="text-center py-8 text-ink-muted">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No rounds yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {rounds.map(round => (
                    <div
                      key={round.id}
                      onClick={() => setActiveRoundId(round.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all group ${
                        activeRoundId === round.id
                          ? 'bg-surface-offset border border-hairline'
                          : 'bg-[var(--bg-accent-crimson)]/50 hover:bg-[var(--card-bg)]/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-accent-crimson font-medium truncate">{round.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRound(round.id);
                          }}
                          className="p-1 text-ink-muted hover:text-accent-crimson opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-ink-muted mt-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(round.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes Editor */}
          <div className="lg:col-span-3">
            {activeRound ? (
              <div className="bg-[var(--card-bg)]/50 border border-hairline/50 rounded-xl p-4">
                {/* Round Name */}
                <input
                  type="text"
                  value={activeRound.name}
                  onChange={(e) => updateRoundName(e.target.value)}
                  className="text-xl font-semibold bg-transparent text-accent-crimson focus:outline-none w-full mb-4 border-b border-transparent focus:border-hairline pb-2"
                />

                {/* Sections */}
                <div className="space-y-4">
                  {DEFAULT_SECTIONS.map(section => (
                    <NoteSection
                      key={section.id}
                      label={section.label}
                      placeholder={section.placeholder}
                      value={activeRound.sections[section.id] || ''}
                      onChange={(value) => updateSection(section.id, value)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[var(--card-bg)]/50 border border-hairline/50 rounded-xl p-8 text-center">
                <Gavel className="w-12 h-12 mx-auto mb-3 text-ink-muted" />
                <p className="text-ink-muted">Select a round or create a new one</p>
                <button
                  onClick={createRound}
                  className="mt-4 px-4 py-2 bg-surface-parchment hover:bg-surface-offset text-accent-crimson rounded-lg transition-colors"
                >
                  Create Round
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NoteSection = ({ label, placeholder, value, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border border-hairline/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-[var(--bg-accent-crimson)]/50 hover:bg-[var(--bg-accent-crimson)]/70 transition-colors"
      >
        <span className="text-accent-crimson font-medium">{label}</span>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4 text-ink-muted" />
        </motion.div>
      </button>
      {isExpanded && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 bg-[var(--bg-accent-crimson)]/30 text-accent-crimson placeholder-slate-600 focus:outline-none resize-none min-h-[100px]"
        />
      )}
    </div>
  );
};

export default JudgeNotes;
