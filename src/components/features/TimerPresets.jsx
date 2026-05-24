import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Clock,
  Play,
  Settings,
  ChevronRight,
  Timer,
  Users,
  Gavel,
  Check,
  Copy,
  Star,
  StarOff
} from 'lucide-react';

// Debate format presets with detailed time configurations
const DEBATE_PRESETS = {
  ld: {
    id: 'ld',
    name: 'Lincoln-Douglas',
    shortName: 'LD',
    color: 'blue',
    description: 'Traditional value debate format',
    totalTime: 38,
    speeches: [
      { name: 'Affirmative Constructive', abbrev: 'AC', time: 360, side: 'aff' },
      { name: 'Cross-Examination', abbrev: 'CX', time: 180, side: 'neg' },
      { name: 'Negative Constructive', abbrev: 'NC', time: 420, side: 'neg' },
      { name: 'Cross-Examination', abbrev: 'CX', time: 180, side: 'aff' },
      { name: '1st Affirmative Rebuttal', abbrev: '1AR', time: 240, side: 'aff' },
      { name: 'Negative Rebuttal', abbrev: 'NR', time: 360, side: 'neg' },
      { name: '2nd Affirmative Rebuttal', abbrev: '2AR', time: 180, side: 'aff' }
    ],
    prepTime: { aff: 240, neg: 240 }
  },
  pf: {
    id: 'pf',
    name: 'Public Forum',
    shortName: 'PF',
    color: 'green',
    description: 'Team-based persuasive debate',
    totalTime: 33,
    speeches: [
      { name: 'First Speaker (Team A)', abbrev: 'A1', time: 240, side: 'a' },
      { name: 'First Speaker (Team B)', abbrev: 'B1', time: 240, side: 'b' },
      { name: 'Crossfire', abbrev: 'CF1', time: 180, side: 'both' },
      { name: 'Second Speaker (Team A)', abbrev: 'A2', time: 240, side: 'a' },
      { name: 'Second Speaker (Team B)', abbrev: 'B2', time: 240, side: 'b' },
      { name: 'Crossfire', abbrev: 'CF2', time: 180, side: 'both' },
      { name: 'Summary (Team A)', abbrev: 'A3', time: 180, side: 'a' },
      { name: 'Summary (Team B)', abbrev: 'B3', time: 180, side: 'b' },
      { name: 'Grand Crossfire', abbrev: 'GCF', time: 180, side: 'both' },
      { name: 'Final Focus (Team A)', abbrev: 'A4', time: 120, side: 'a' },
      { name: 'Final Focus (Team B)', abbrev: 'B4', time: 120, side: 'b' }
    ],
    prepTime: { a: 120, b: 120 }
  },
  policy: {
    id: 'policy',
    name: 'Policy Debate',
    shortName: 'Policy',
    color: 'purple',
    description: 'Evidence-intensive team debate',
    totalTime: 72,
    speeches: [
      { name: '1st Affirmative Constructive', abbrev: '1AC', time: 480, side: 'aff' },
      { name: 'Cross-Examination', abbrev: 'CX', time: 180, side: 'neg' },
      { name: '1st Negative Constructive', abbrev: '1NC', time: 480, side: 'neg' },
      { name: 'Cross-Examination', abbrev: 'CX', time: 180, side: 'aff' },
      { name: '2nd Affirmative Constructive', abbrev: '2AC', time: 480, side: 'aff' },
      { name: 'Cross-Examination', abbrev: 'CX', time: 180, side: 'neg' },
      { name: '2nd Negative Constructive', abbrev: '2NC', time: 480, side: 'neg' },
      { name: 'Cross-Examination', abbrev: 'CX', time: 180, side: 'aff' },
      { name: '1st Negative Rebuttal', abbrev: '1NR', time: 300, side: 'neg' },
      { name: '1st Affirmative Rebuttal', abbrev: '1AR', time: 300, side: 'aff' },
      { name: '2nd Negative Rebuttal', abbrev: '2NR', time: 300, side: 'neg' },
      { name: '2nd Affirmative Rebuttal', abbrev: '2AR', time: 300, side: 'aff' }
    ],
    prepTime: { aff: 480, neg: 480 }
  },
  congress: {
    id: 'congress',
    name: 'Congressional Debate',
    shortName: 'Congress',
    color: 'amber',
    description: 'Legislative simulation format',
    totalTime: 'Variable',
    speeches: [
      { name: 'Authorship/Sponsorship', abbrev: 'Auth', time: 180, side: 'pro' },
      { name: 'First Negation', abbrev: '1st Neg', time: 180, side: 'con' },
      { name: 'Pro Speech', abbrev: 'Pro', time: 180, side: 'pro' },
      { name: 'Con Speech', abbrev: 'Con', time: 180, side: 'con' },
      { name: 'Questioning Period', abbrev: 'QP', time: 120, side: 'both' }
    ],
    prepTime: null
  },
  parli: {
    id: 'parli',
    name: 'Parliamentary Debate',
    shortName: 'Parli',
    color: 'red',
    description: 'NPDA/APDA style debate',
    totalTime: 47,
    speeches: [
      { name: 'Prime Minister Constructive', abbrev: 'PMC', time: 420, side: 'gov' },
      { name: 'Leader of Opposition Constructive', abbrev: 'LOC', time: 480, side: 'opp' },
      { name: 'Member of Government', abbrev: 'MG', time: 480, side: 'gov' },
      { name: 'Member of Opposition', abbrev: 'MO', time: 480, side: 'opp' },
      { name: 'Leader of Opposition Rebuttal', abbrev: 'LOR', time: 240, side: 'opp' },
      { name: 'Prime Minister Rebuttal', abbrev: 'PMR', time: 300, side: 'gov' }
    ],
    prepTime: { gov: 0, opp: 0 },
    notes: '15 minutes prep before round begins'
  },
  worldschools: {
    id: 'worldschools',
    name: 'World Schools',
    shortName: 'WSDC',
    color: 'cyan',
    description: 'International team format',
    totalTime: 57,
    speeches: [
      { name: '1st Proposition', abbrev: '1st Prop', time: 480, side: 'prop' },
      { name: '1st Opposition', abbrev: '1st Opp', time: 480, side: 'opp' },
      { name: '2nd Proposition', abbrev: '2nd Prop', time: 480, side: 'prop' },
      { name: '2nd Opposition', abbrev: '2nd Opp', time: 480, side: 'opp' },
      { name: '3rd Proposition', abbrev: '3rd Prop', time: 480, side: 'prop' },
      { name: '3rd Opposition', abbrev: '3rd Opp', time: 480, side: 'opp' },
      { name: 'Opposition Reply', abbrev: 'Opp Reply', time: 240, side: 'opp' },
      { name: 'Proposition Reply', abbrev: 'Prop Reply', time: 240, side: 'prop' }
    ],
    prepTime: null,
    notes: 'POIs allowed during speeches (1-7 min mark)'
  },
  bp: {
    id: 'bp',
    name: 'British Parliamentary',
    shortName: 'BP',
    color: 'indigo',
    description: 'Four-team competitive format',
    totalTime: 56,
    speeches: [
      { name: 'Prime Minister', abbrev: 'PM', time: 420, side: 'og' },
      { name: 'Leader of Opposition', abbrev: 'LO', time: 420, side: 'oo' },
      { name: 'Deputy Prime Minister', abbrev: 'DPM', time: 420, side: 'og' },
      { name: 'Deputy Leader of Opposition', abbrev: 'DLO', time: 420, side: 'oo' },
      { name: 'Member of Government', abbrev: 'MG', time: 420, side: 'cg' },
      { name: 'Member of Opposition', abbrev: 'MO', time: 420, side: 'co' },
      { name: 'Government Whip', abbrev: 'GW', time: 420, side: 'cg' },
      { name: 'Opposition Whip', abbrev: 'OW', time: 420, side: 'co' }
    ],
    prepTime: null,
    notes: '15 min prep. POIs allowed (1-6 min). Teams: OG, OO, CG, CO'
  },
  ipda: {
    id: 'ipda',
    name: 'IPDA',
    shortName: 'IPDA',
    color: 'teal',
    description: 'International Public Debate Association',
    totalTime: 26,
    speeches: [
      { name: 'Affirmative Constructive', abbrev: 'AC', time: 300, side: 'aff' },
      { name: 'Negative Constructive', abbrev: 'NC', time: 300, side: 'neg' },
      { name: 'Affirmative Rebuttal', abbrev: 'AR', time: 300, side: 'aff' },
      { name: 'Negative Rebuttal', abbrev: 'NR', time: 300, side: 'neg' },
      { name: 'Affirmative Closing', abbrev: 'ACL', time: 120, side: 'aff' },
      { name: 'Negative Closing', abbrev: 'NCL', time: 120, side: 'neg' }
    ],
    prepTime: { aff: 0, neg: 0 },
    notes: '30 min prep before round. Topics drawn 30 min prior.'
  },
  npda: {
    id: 'npda',
    name: 'NPDA',
    shortName: 'NPDA',
    color: 'rose',
    description: 'National Parliamentary Debate Association',
    totalTime: 47,
    speeches: [
      { name: 'Prime Minister Constructive', abbrev: 'PMC', time: 420, side: 'gov' },
      { name: 'Leader of Opposition Constructive', abbrev: 'LOC', time: 480, side: 'opp' },
      { name: 'Member of Government', abbrev: 'MG', time: 480, side: 'gov' },
      { name: 'Member of Opposition', abbrev: 'MO', time: 480, side: 'opp' },
      { name: 'Leader of Opposition Rebuttal', abbrev: 'LOR', time: 240, side: 'opp' },
      { name: 'Prime Minister Rebuttal', abbrev: 'PMR', time: 300, side: 'gov' }
    ],
    prepTime: { gov: 0, opp: 0 },
    notes: '15 min prep. POIs allowed (first & last min protected).'
  },
  nfa_ld: {
    id: 'nfa_ld',
    name: 'NFA Lincoln-Douglas',
    shortName: 'NFA-LD',
    color: 'violet',
    description: 'National Forensic Association LD',
    totalTime: 36,
    speeches: [
      { name: 'Affirmative Constructive', abbrev: 'AC', time: 360, side: 'aff' },
      { name: 'Cross-Examination', abbrev: 'CX', time: 180, side: 'neg' },
      { name: 'Negative Constructive', abbrev: 'NC', time: 420, side: 'neg' },
      { name: 'Cross-Examination', abbrev: 'CX', time: 180, side: 'aff' },
      { name: 'Affirmative Rebuttal', abbrev: 'AR', time: 360, side: 'aff' },
      { name: 'Negative Rebuttal', abbrev: 'NR', time: 300, side: 'neg' },
      { name: 'Affirmative Closing', abbrev: 'ACL', time: 180, side: 'aff' }
    ],
    prepTime: { aff: 240, neg: 240 }
  },
  apda: {
    id: 'apda',
    name: 'APDA',
    shortName: 'APDA',
    color: 'emerald',
    description: 'American Parliamentary Debate Association',
    totalTime: 40,
    speeches: [
      { name: 'Prime Minister Constructive', abbrev: 'PMC', time: 420, side: 'gov' },
      { name: 'Leader of Opposition Constructive', abbrev: 'LOC', time: 480, side: 'opp' },
      { name: 'Member of Government', abbrev: 'MG', time: 480, side: 'gov' },
      { name: 'Member of Opposition', abbrev: 'MO', time: 480, side: 'opp' },
      { name: 'Leader of Opposition Rebuttal', abbrev: 'LOR', time: 240, side: 'opp' },
      { name: 'Prime Minister Rebuttal', abbrev: 'PMR', time: 300, side: 'gov' }
    ],
    prepTime: { gov: 0, opp: 0 },
    notes: '15 min prep. Case statements common. POIs allowed.'
  },
  big_questions: {
    id: 'big_questions',
    name: 'Big Questions',
    shortName: 'BQ',
    color: 'sky',
    description: 'NSDA philosophical debate format',
    totalTime: 32,
    speeches: [
      { name: 'First Pro Constructive', abbrev: '1PC', time: 300, side: 'pro' },
      { name: 'First Con Constructive', abbrev: '1CC', time: 300, side: 'con' },
      { name: 'Crossfire', abbrev: 'CF', time: 180, side: 'both' },
      { name: 'Second Pro Constructive', abbrev: '2PC', time: 300, side: 'pro' },
      { name: 'Second Con Constructive', abbrev: '2CC', time: 300, side: 'con' },
      { name: 'Crossfire', abbrev: 'CF2', time: 180, side: 'both' },
      { name: 'Pro Summary', abbrev: 'PS', time: 180, side: 'pro' },
      { name: 'Con Summary', abbrev: 'CS', time: 180, side: 'con' },
      { name: 'Grand Crossfire', abbrev: 'GCF', time: 180, side: 'both' },
      { name: 'Pro Final Focus', abbrev: 'PFF', time: 120, side: 'pro' },
      { name: 'Con Final Focus', abbrev: 'CFF', time: 120, side: 'con' }
    ],
    prepTime: { pro: 120, con: 120 }
  }
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatMinutes = (seconds) => {
  const mins = Math.floor(seconds / 60);
  return mins === 1 ? '1 min' : `${mins} mins`;
};

const getColorClasses = (color) => {
  const colors = {
    blue: { bg: 'bg-accent-crimson/20', border: 'border-accent-crimson/50', text: 'text-ink', badge: 'bg-accent-crimson' },
    green: { bg: 'bg-surface-offset', border: 'border-hairline', text: 'text-ink', badge: 'bg-surface-offset' },
    purple: { bg: 'bg-surface-offset', border: 'border-hairline', text: 'text-ink', badge: 'bg-surface-offset' },
    amber: { bg: 'bg-surface-offset', border: 'border-hairline', text: 'text-ink', badge: 'bg-surface-offset' },
    red: { bg: 'bg-accent-crimson/20', border: 'border-accent-crimson/50', text: 'text-accent-crimson', badge: 'bg-accent-crimson' },
    cyan: { bg: 'bg-surface-offset', border: 'border-hairline', text: 'text-ink', badge: 'bg-surface-offset' },
    indigo: { bg: 'bg-accent-crimson/20', border: 'border-hairline', text: 'text-ink', badge: 'bg-accent-crimson' },
    teal: { bg: 'bg-accent-crimson/20', border: 'border-accent-crimson/50', text: 'text-teal-400', badge: 'bg-accent-crimson' },
    rose: { bg: 'bg-accent-crimson/20', border: 'border-accent-crimson/50', text: 'text-accent-crimson', badge: 'bg-accent-crimson' },
    violet: { bg: 'bg-violet-500/20', border: 'border-violet-500/50', text: 'text-violet-400', badge: 'bg-violet-500' },
    emerald: { bg: 'bg-surface-offset', border: 'border-hairline', text: 'text-ink', badge: 'bg-surface-offset' },
    sky: { bg: 'bg-sky-500/20', border: 'border-sky-500/50', text: 'text-sky-400', badge: 'bg-sky-500' }
  };
  return colors[color] || colors.blue;
};

const TimerPresets = () => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('debate-timer-favorites');
    return saved ? JSON.parse(saved) : ['ld', 'pf'];
  });
  const [copiedId, setCopiedId] = useState(null);

  const toggleFavorite = (presetId) => {
    const newFavorites = favorites.includes(presetId)
      ? favorites.filter(id => id !== presetId)
      : [...favorites, presetId];
    setFavorites(newFavorites);
    localStorage.setItem('debate-timer-favorites', JSON.stringify(newFavorites));
  };

  const copyPresetConfig = (preset) => {
    const config = JSON.stringify(preset, null, 2);
    navigator.clipboard.writeText(config);
    setCopiedId(preset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const presetsList = Object.values(DEBATE_PRESETS);
  const favoritePresets = presetsList.filter(p => favorites.includes(p.id));
  const otherPresets = presetsList.filter(p => !favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 /20 to-red-500/20 rounded-lg">
              <Timer className="w-6 h-6 text-accent-crimson" />
            </div>
            <h1 className="text-2xl font-bold text-accent-crimson">Timer Presets</h1>
          </div>
          <p className="text-ink-muted">
            Pre-configured timing structures for common debate formats
          </p>
        </div>

        {/* Favorites Section */}
        {favoritePresets.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-ink fill-ink" />
              <h2 className="text-lg font-semibold text-accent-crimson">Favorites</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoritePresets.map(preset => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  isSelected={selectedPreset?.id === preset.id}
                  isFavorite={true}
                  onSelect={() => setSelectedPreset(selectedPreset?.id === preset.id ? null : preset)}
                  onToggleFavorite={() => toggleFavorite(preset.id)}
                  onCopy={() => copyPresetConfig(preset)}
                  copied={copiedId === preset.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Presets */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-accent-crimson mb-4">
            {favoritePresets.length > 0 ? 'All Formats' : 'Debate Formats'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherPresets.map(preset => (
              <PresetCard
                key={preset.id}
                preset={preset}
                isSelected={selectedPreset?.id === preset.id}
                isFavorite={false}
                onSelect={() => setSelectedPreset(selectedPreset?.id === preset.id ? null : preset)}
                onToggleFavorite={() => toggleFavorite(preset.id)}
                onCopy={() => copyPresetConfig(preset)}
                copied={copiedId === preset.id}
              />
            ))}
          </div>
        </div>

        {/* Selected Preset Details */}
        <AnimatePresence>
          {selectedPreset && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[var(--card-bg)]/50 border border-hairline/50 rounded-xl p-6"
            >
              <PresetDetails preset={selectedPreset} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Reference */}
        <div className="mt-8 bg-[var(--card-bg)]/30 border border-hairline/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-accent-crimson mb-4">Quick Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-ink-muted border-b border-hairline">
                  <th className="text-left py-2 px-3">Format</th>
                  <th className="text-center py-2 px-3">Total Time</th>
                  <th className="text-center py-2 px-3">Speeches</th>
                  <th className="text-center py-2 px-3">Prep Time</th>
                </tr>
              </thead>
              <tbody>
                {presetsList.map(preset => {
                  const colors = getColorClasses(preset.color);
                  const totalPrepTime = preset.prepTime
                    ? Object.values(preset.prepTime).reduce((a, b) => a + b, 0)
                    : 0;
                  return (
                    <tr key={preset.id} className="border-b border-hairline/50 hover:bg-[var(--card-bg)]/30">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${colors.badge}`} />
                          <span className="text-accent-crimson font-medium">{preset.shortName}</span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-3 text-ink-muted">
                        {typeof preset.totalTime === 'number' ? `${preset.totalTime} min` : preset.totalTime}
                      </td>
                      <td className="text-center py-3 px-3 text-ink-muted">
                        {preset.speeches.length}
                      </td>
                      <td className="text-center py-3 px-3 text-ink-muted">
                        {totalPrepTime > 0 ? formatMinutes(totalPrepTime) + ' per side' : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const PresetCard = ({ preset, isSelected, isFavorite, onSelect, onToggleFavorite, onCopy, copied }) => {
  const colors = getColorClasses(preset.color);
  const totalPrepTime = preset.prepTime
    ? Object.values(preset.prepTime).reduce((a, b) => a + b, 0) / 2
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
        isSelected
          ? `${colors.bg} ${colors.border}`
          : 'bg-[var(--card-bg)]/50 border-hairline/50 hover:border-hairline'
      }`}
      onClick={onSelect}
    >
      {/* Favorite & Copy buttons */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
          className="p-1.5 rounded-lg hover:bg-surface-parchment/50 text-ink-muted hover:text-accent-crimson transition-colors"
          title="Copy configuration"
        >
          {copied ? <Check className="w-4 h-4 text-ink" /> : <Copy className="w-4 h-4" />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="p-1.5 rounded-lg hover:bg-surface-parchment/50 transition-colors"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <Star className="w-4 h-4 text-ink fill-ink" />
          ) : (
            <StarOff className="w-4 h-4 text-ink-muted hover:text-ink" />
          )}
        </button>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Gavel className={`w-5 h-5 ${colors.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-accent-crimson font-semibold">{preset.name}</h3>
          <p className="text-ink-muted text-sm truncate">{preset.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-ink-muted">
          <Clock className="w-4 h-4 text-ink-muted" />
          <span>{typeof preset.totalTime === 'number' ? `${preset.totalTime} min` : preset.totalTime}</span>
        </div>
        <div className="flex items-center gap-1.5 text-ink-muted">
          <Users className="w-4 h-4 text-ink-muted" />
          <span>{preset.speeches.length} speeches</span>
        </div>
        {totalPrepTime > 0 && (
          <div className="flex items-center gap-1.5 text-ink-muted">
            <Timer className="w-4 h-4 text-ink-muted" />
            <span>{formatMinutes(totalPrepTime)} prep</span>
          </div>
        )}
      </div>

      {/* Expand indicator */}
      <div className={`absolute bottom-3 right-3 transition-transform ${isSelected ? 'rotate-90' : ''}`}>
        <ChevronRight className="w-4 h-4 text-ink-muted" />
      </div>
    </motion.div>
  );
};

const PresetDetails = ({ preset }) => {
  const colors = getColorClasses(preset.color);

  const getSideLabel = (side) => {
    const labels = {
      aff: 'Affirmative',
      neg: 'Negative',
      a: 'Team A',
      b: 'Team B',
      pro: 'Pro',
      con: 'Con',
      gov: 'Government',
      opp: 'Opposition',
      prop: 'Proposition',
      both: 'Both'
    };
    return labels[side] || side;
  };

  const getSideColor = (side) => {
    const sideColors = {
      aff: 'text-ink',
      neg: 'text-accent-crimson',
      a: 'text-ink',
      b: 'text-accent-crimson',
      pro: 'text-ink',
      con: 'text-accent-crimson',
      gov: 'text-ink',
      opp: 'text-accent-crimson',
      prop: 'text-ink',
      both: 'text-ink'
    };
    return sideColors[side] || 'text-ink-muted';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${colors.bg}`}>
            <Gavel className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-accent-crimson">{preset.name}</h2>
            <p className="text-ink-muted">{preset.description}</p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg ${colors.bg} ${colors.text} font-medium`}>
          {typeof preset.totalTime === 'number' ? `${preset.totalTime} minutes total` : preset.totalTime}
        </div>
      </div>

      {/* Prep Time */}
      {preset.prepTime && Object.values(preset.prepTime).some(t => t > 0) && (
        <div className="mb-6 p-4 bg-[var(--bg-accent-crimson)]/50 rounded-lg">
          <h3 className="text-sm font-medium text-ink-muted mb-3">Prep Time</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(preset.prepTime).map(([side, time]) => (
              <div key={side} className="flex items-center gap-2">
                <span className={getSideColor(side)}>{getSideLabel(side)}:</span>
                <span className="text-accent-crimson font-mono">{formatTime(time)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {preset.notes && (
        <div className="mb-6 p-4 bg-surface-offset border border-hairline rounded-lg">
          <p className="text-ink text-sm">{preset.notes}</p>
        </div>
      )}

      {/* Speech Order */}
      <div>
        <h3 className="text-sm font-medium text-ink-muted mb-3">Speech Order</h3>
        <div className="space-y-2">
          {preset.speeches.map((speech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-3 bg-[var(--bg-accent-crimson)]/50 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--card-bg)] flex items-center justify-center text-ink-muted text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-accent-crimson font-medium">{speech.name}</span>
                  <span className="px-2 py-0.5 bg-[var(--card-bg)] rounded text-xs text-ink-muted font-mono">
                    {speech.abbrev}
                  </span>
                </div>
                <span className={`text-sm ${getSideColor(speech.side)}`}>
                  {getSideLabel(speech.side)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-accent-crimson font-mono text-lg">{formatTime(speech.time)}</div>
                <div className="text-ink-muted text-xs">{formatMinutes(speech.time)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimerPresets;
