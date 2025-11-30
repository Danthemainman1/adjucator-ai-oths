/**
 * MotionLibrary - Debate Motions/Resolutions Database
 * Categories, difficulty ratings, source tracking, notes, search/filter
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Star,
  StarOff,
  Tag,
  Calendar,
  Trophy,
  Globe,
  Home,
  Brain,
  Scale,
  Users,
  Gavel,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  Download,
  Upload,
  FolderOpen,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Eye,
  Clock,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  Hash,
  Sparkles,
  AlertCircle,
  Info,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';

// Categories with icons and colors
const CATEGORIES = {
  domestic: {
    label: 'Domestic Policy',
    icon: Home,
    color: 'cyan',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400'
  },
  international: {
    label: 'International Relations',
    icon: Globe,
    color: 'purple',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400'
  },
  philosophy: {
    label: 'Philosophy/Ethics',
    icon: Brain,
    color: 'amber',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400'
  },
  economics: {
    label: 'Economics',
    icon: Scale,
    color: 'emerald',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400'
  },
  social: {
    label: 'Social Issues',
    icon: Users,
    color: 'rose',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-400'
  },
  legal: {
    label: 'Legal/Constitutional',
    icon: Gavel,
    color: 'orange',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400'
  }
};

// Debate formats
const FORMATS = {
  pf: { label: 'Public Forum', short: 'PF' },
  ld: { label: 'Lincoln Douglas', short: 'LD' },
  policy: { label: 'Policy/CX', short: 'CX' },
  congress: { label: 'Congressional', short: 'Congress' },
  parli: { label: 'Parliamentary', short: 'Parli' },
  worlds: { label: 'World Schools', short: 'WSDC' },
  bp: { label: 'British Parliamentary', short: 'BP' }
};

// Difficulty levels
const DIFFICULTY_LEVELS = [
  { value: 1, label: 'Novice', color: 'emerald' },
  { value: 2, label: 'JV', color: 'cyan' },
  { value: 3, label: 'Varsity', color: 'amber' },
  { value: 4, label: 'Elite', color: 'purple' },
  { value: 5, label: 'Championship', color: 'rose' }
];

// Generate unique ID
const generateId = () => `motion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Sample motions data
const SAMPLE_MOTIONS = [
  {
    id: generateId(),
    text: 'Resolved: The United States federal government should substantially increase its protection of water resources in the United States.',
    category: 'domestic',
    format: 'policy',
    difficulty: 4,
    year: 2024,
    month: 'September',
    tournament: 'NSDA National Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['environment', 'water', 'federal policy'],
    notes: 'Year-long topic for Policy debate. Focus areas include Clean Water Act, infrastructure, and tribal water rights.',
    favorited: true,
    timesUsed: 12,
    lastUsed: '2024-11-15',
    createdAt: '2024-08-01'
  },
  {
    id: generateId(),
    text: 'Resolved: The United States ought to guarantee universal basic income.',
    category: 'economics',
    format: 'ld',
    difficulty: 3,
    year: 2024,
    month: 'November',
    tournament: 'November/December LD Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['UBI', 'welfare', 'economics', 'poverty'],
    notes: 'Strong aff ground on poverty reduction, neg ground on inflation and work incentives.',
    favorited: true,
    timesUsed: 8,
    lastUsed: '2024-11-20',
    createdAt: '2024-10-15'
  },
  {
    id: generateId(),
    text: 'Resolved: The European Union should substantially strengthen its defense capabilities independent of the North Atlantic Treaty Organization.',
    category: 'international',
    format: 'pf',
    difficulty: 4,
    year: 2024,
    month: 'December',
    tournament: 'December PF Topic',
    source: 'NSDA',
    sourceUrl: 'https://www.speechanddebate.org',
    tags: ['EU', 'NATO', 'defense', 'foreign policy'],
    notes: 'Topicality on "independent" will be key. Research European strategic autonomy.',
    favorited: false,
    timesUsed: 3,
    lastUsed: '2024-11-28',
    createdAt: '2024-11-01'
  },
  {
    id: generateId(),
    text: 'This House believes that the pursuit of happiness is a more important life goal than the pursuit of meaning.',
    category: 'philosophy',
    format: 'bp',
    difficulty: 3,
    year: 2024,
    month: 'October',
    tournament: 'Cambridge IV',
    source: 'Cambridge Union',
    sourceUrl: '',
    tags: ['philosophy', 'happiness', 'meaning', 'life purpose'],
    notes: 'Classic philosophy motion. Define happiness vs meaning carefully.',
    favorited: true,
    timesUsed: 5,
    lastUsed: '2024-10-25',
    createdAt: '2024-10-01'
  },
  {
    id: generateId(),
    text: 'Resolved: Jury nullification is a legitimate tool for criminal defense.',
    category: 'legal',
    format: 'ld',
    difficulty: 4,
    year: 2024,
    month: 'September',
    tournament: 'Yale Invitational',
    source: 'Yale Debate',
    sourceUrl: '',
    tags: ['jury', 'law', 'justice', 'courts'],
    notes: 'Focus on democratic legitimacy vs rule of law tensions.',
    favorited: false,
    timesUsed: 2,
    lastUsed: '2024-09-20',
    createdAt: '2024-09-01'
  },
  {
    id: generateId(),
    text: 'This House would ban the use of facial recognition technology by law enforcement.',
    category: 'social',
    format: 'parli',
    difficulty: 2,
    year: 2024,
    month: 'November',
    tournament: 'State Championships',
    source: 'Local Circuit',
    sourceUrl: '',
    tags: ['technology', 'privacy', 'police', 'civil liberties'],
    notes: 'Good novice motion. Clear clash on privacy vs security.',
    favorited: false,
    timesUsed: 7,
    lastUsed: '2024-11-10',
    createdAt: '2024-11-05'
  },
  {
    id: generateId(),
    text: 'Resolved: A bill to implement a carbon tax should pass.',
    category: 'economics',
    format: 'congress',
    difficulty: 2,
    year: 2024,
    month: 'October',
    tournament: 'Fall Regional',
    source: 'Regional Circuit',
    sourceUrl: '',
    tags: ['climate', 'tax', 'environment', 'economics'],
    notes: 'Popular Congress topic. Both sides have strong economic arguments.',
    favorited: false,
    timesUsed: 4,
    lastUsed: '2024-10-15',
    createdAt: '2024-10-01'
  },
  {
    id: generateId(),
    text: 'This House believes that Western liberal democracies should adopt deliberative democracy mechanisms.',
    category: 'philosophy',
    format: 'worlds',
    difficulty: 5,
    year: 2024,
    month: 'August',
    tournament: 'World Schools Debate Championship',
    source: 'WSDC',
    sourceUrl: 'https://wsdc.info',
    tags: ['democracy', 'deliberation', 'politics', 'governance'],
    notes: 'Championship-level motion requiring deep knowledge of democratic theory.',
    favorited: true,
    timesUsed: 1,
    lastUsed: '2024-08-15',
    createdAt: '2024-08-01'
  }
];

// Difficulty Badge Component
const DifficultyBadge = ({ level }) => {
  const difficulty = DIFFICULTY_LEVELS.find(d => d.value === level) || DIFFICULTY_LEVELS[2];
  const colorClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    rose: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  };

  return (
    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${colorClasses[difficulty.color]}`}>
      {difficulty.label}
    </span>
  );
};

// Motion Card Component
const MotionCard = ({ motion, onEdit, onDelete, onToggleFavorite, onCopy, viewMode }) => {
  const [expanded, setExpanded] = useState(false);
  const category = CATEGORIES[motion.category] || CATEGORIES.domestic;
  const format = FORMATS[motion.format] || FORMATS.pf;
  const CategoryIcon = category.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(motion.text);
    onCopy?.(motion);
  };

  if (viewMode === 'compact') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`p-4 rounded-lg border ${category.bgColor} ${category.borderColor} hover:border-opacity-60 transition-colors`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br from-${category.color}-500/20 to-${category.color}-600/20`}>
            <CategoryIcon className={`w-4 h-4 ${category.textColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm line-clamp-2">{motion.text}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs text-slate-400">{format.short}</span>
              <span className="text-slate-600">•</span>
              <DifficultyBadge level={motion.difficulty} />
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{motion.year}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(motion.id)}
              className={`p-1.5 rounded transition-colors ${
                motion.favorited 
                  ? 'text-amber-400 hover:text-amber-300' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {motion.favorited ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-500 hover:text-white rounded transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-xl border overflow-hidden ${category.bgColor} ${category.borderColor}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br from-${category.color}-500/20 to-${category.color}-600/20`}>
              <CategoryIcon className={`w-5 h-5 ${category.textColor}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-medium ${category.textColor}`}>{category.label}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">{format.label}</span>
              </div>
              <DifficultyBadge level={motion.difficulty} />
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(motion.id)}
              className={`p-2 rounded-lg transition-colors ${
                motion.favorited 
                  ? 'text-amber-400 hover:bg-amber-500/20' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {motion.favorited ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
            </button>
            <button
              onClick={handleCopy}
              className="p-2 text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              title="Copy motion text"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(motion)}
              className="p-2 text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(motion.id)}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Motion Text */}
      <div className="p-4">
        <p className="text-white font-medium leading-relaxed">{motion.text}</p>
      </div>

      {/* Tags */}
      {motion.tags && motion.tags.length > 0 && (
        <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
          {motion.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded-full"
            >
              <Hash className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta Info */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>Details</span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-3">
                {/* Source Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500 text-xs uppercase tracking-wide">Tournament</span>
                    <p className="text-white">{motion.tournament || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs uppercase tracking-wide">Source</span>
                    <div className="flex items-center gap-1">
                      <p className="text-white">{motion.source || 'Unknown'}</p>
                      {motion.sourceUrl && (
                        <a 
                          href={motion.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs uppercase tracking-wide">Date</span>
                    <p className="text-white">{motion.month} {motion.year}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs uppercase tracking-wide">Times Used</span>
                    <p className="text-white">{motion.timesUsed || 0}</p>
                  </div>
                </div>

                {/* Notes */}
                {motion.notes && (
                  <div className="pt-2 border-t border-slate-700/50">
                    <span className="text-slate-500 text-xs uppercase tracking-wide">Notes</span>
                    <p className="text-slate-300 text-sm mt-1">{motion.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Add/Edit Motion Modal
const MotionModal = ({ isOpen, onClose, motion, onSave }) => {
  const [formData, setFormData] = useState({
    text: '',
    category: 'domestic',
    format: 'pf',
    difficulty: 3,
    year: new Date().getFullYear(),
    month: '',
    tournament: '',
    source: '',
    sourceUrl: '',
    tags: [],
    notes: ''
  });
  const [tagInput, setTagInput] = useState('');

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (motion) {
        setFormData({
          text: motion.text || '',
          category: motion.category || 'domestic',
          format: motion.format || 'pf',
          difficulty: motion.difficulty || 3,
          year: motion.year || new Date().getFullYear(),
          month: motion.month || '',
          tournament: motion.tournament || '',
          source: motion.source || '',
          sourceUrl: motion.sourceUrl || '',
          tags: motion.tags || [],
          notes: motion.notes || ''
        });
      } else {
        setFormData({
          text: '',
          category: 'domestic',
          format: 'pf',
          difficulty: 3,
          year: new Date().getFullYear(),
          month: '',
          tournament: '',
          source: '',
          sourceUrl: '',
          tags: [],
          notes: ''
        });
      }
    }
  }, [isOpen, motion]);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    onSave({
      id: motion?.id || generateId(),
      ...formData,
      favorited: motion?.favorited || false,
      timesUsed: motion?.timesUsed || 0,
      lastUsed: motion?.lastUsed || null,
      createdAt: motion?.createdAt || new Date().toISOString()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {motion ? 'Edit Motion' : 'Add New Motion'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-5">
            {/* Motion Text */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Motion/Resolution Text *</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Resolved: ..."
                rows={3}
                className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                required
              />
            </div>

            {/* Category & Format */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Format</label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  {Object.entries(FORMATS).map(([key, fmt]) => (
                    <option key={key} value={key}>{fmt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Difficulty Level</label>
              <div className="flex items-center gap-2">
                {DIFFICULTY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, difficulty: level.value }))}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.difficulty === level.value
                        ? `bg-${level.color}-500/20 text-${level.color}-400 border border-${level.color}-500/50`
                        : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tournament & Source */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Tournament/Event</label>
                <input
                  type="text"
                  value={formData.tournament}
                  onChange={(e) => setFormData(prev => ({ ...prev, tournament: e.target.value }))}
                  placeholder="e.g., NSDA Nationals"
                  className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="e.g., NSDA"
                  className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>

            {/* Year & Month */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  min={2000}
                  max={2030}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Month</label>
                <select
                  value={formData.month}
                  onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="">Select month...</option>
                  {['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Source URL */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Source URL (optional)</label>
              <input
                type="url"
                value={formData.sourceUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Tags</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag..."
                  className="flex-1 bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-700 text-slate-300 text-sm rounded-full"
                    >
                      <Hash className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-500 hover:text-red-400 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Strategy notes, key arguments, etc."
                rows={3}
                className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors font-medium"
            >
              {motion ? 'Save Changes' : 'Add Motion'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Main Component
const MotionLibrary = () => {
  const [motions, setMotions] = useState(SAMPLE_MOTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('full'); // full, compact
  const [showModal, setShowModal] = useState(false);
  const [editingMotion, setEditingMotion] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Get unique years from motions
  const years = useMemo(() => {
    const yearSet = new Set(motions.map(m => m.year));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [motions]);

  // Filter and sort motions
  const filteredMotions = useMemo(() => {
    let result = [...motions];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.text.toLowerCase().includes(query) ||
        m.tags?.some(t => t.toLowerCase().includes(query)) ||
        m.tournament?.toLowerCase().includes(query) ||
        m.source?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(m => m.category === selectedCategory);
    }

    // Format filter
    if (selectedFormat !== 'all') {
      result = result.filter(m => m.format === selectedFormat);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      result = result.filter(m => m.difficulty === parseInt(selectedDifficulty));
    }

    // Year filter
    if (selectedYear !== 'all') {
      result = result.filter(m => m.year === parseInt(selectedYear));
    }

    // Favorites filter
    if (showFavoritesOnly) {
      result = result.filter(m => m.favorited);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'most-used':
        result.sort((a, b) => (b.timesUsed || 0) - (a.timesUsed || 0));
        break;
      case 'difficulty-asc':
        result.sort((a, b) => a.difficulty - b.difficulty);
        break;
      case 'difficulty-desc':
        result.sort((a, b) => b.difficulty - a.difficulty);
        break;
      case 'alphabetical':
        result.sort((a, b) => a.text.localeCompare(b.text));
        break;
    }

    return result;
  }, [motions, searchQuery, selectedCategory, selectedFormat, selectedDifficulty, selectedYear, showFavoritesOnly, sortBy]);

  // CRUD operations
  const handleSaveMotion = (motionData) => {
    setMotions(prev => {
      const existing = prev.findIndex(m => m.id === motionData.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = motionData;
        return updated;
      }
      return [motionData, ...prev];
    });
  };

  const handleDeleteMotion = (id) => {
    if (confirm('Are you sure you want to delete this motion?')) {
      setMotions(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleToggleFavorite = (id) => {
    setMotions(prev => prev.map(m => 
      m.id === id ? { ...m, favorited: !m.favorited } : m
    ));
  };

  const handleCopyMotion = (motion) => {
    setCopiedId(motion.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEditMotion = (motion) => {
    setEditingMotion(motion);
    setShowModal(true);
  };

  // Export/Import
  const handleExport = () => {
    const data = JSON.stringify(motions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'motion-library.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setMotions(prev => [...imported, ...prev]);
        }
      } catch (err) {
        console.error('Failed to import motions:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFormat('all');
    setSelectedDifficulty('all');
    setSelectedYear('all');
    setShowFavoritesOnly(false);
  };

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedFormat !== 'all',
    selectedDifficulty !== 'all',
    selectedYear !== 'all',
    showFavoritesOnly
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            Motion Library
          </h1>
          <p className="text-slate-400 mt-1">
            {filteredMotions.length} of {motions.length} motions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => {
              setEditingMotion(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Motion
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search motions, tags, tournaments..."
              className="w-full bg-slate-700/50 border border-slate-600 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Quick Filters */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
              showFavoritesOnly
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:text-white'
            }`}
          >
            <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favorites
          </button>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-cyan-500 text-white text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-slate-700/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('full')}
              className={`p-2 rounded ${viewMode === 'full' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2 rounded ${viewMode === 'compact' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 text-white px-3 py-2.5 rounded-lg focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-used">Most Used</option>
            <option value="difficulty-asc">Difficulty ↑</option>
            <option value="difficulty-desc">Difficulty ↓</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-slate-700 grid grid-cols-4 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none text-sm"
                  >
                    <option value="all">All Categories</option>
                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                      <option key={key} value={key}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Format</label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none text-sm"
                  >
                    <option value="all">All Formats</option>
                    {Object.entries(FORMATS).map(([key, fmt]) => (
                      <option key={key} value={key}>{fmt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none text-sm"
                  >
                    <option value="all">All Levels</option>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none text-sm"
                  >
                    <option value="all">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <div className="mt-3 flex items-center justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Quick Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-slate-700 text-white'
              : 'bg-slate-800/50 text-slate-400 hover:text-white'
          }`}
        >
          All
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const Icon = cat.icon;
          const count = motions.filter(m => m.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(selectedCategory === key ? 'all' : key)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? `${cat.bgColor} ${cat.textColor} border ${cat.borderColor}`
                  : 'bg-slate-800/50 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
              <span className="text-xs opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Motions Grid/List */}
      {filteredMotions.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400">No motions found</h3>
          <p className="text-slate-500 mt-1">
            {searchQuery || activeFiltersCount > 0
              ? 'Try adjusting your filters or search query'
              : 'Add your first motion to get started'}
          </p>
          {(searchQuery || activeFiltersCount > 0) && (
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'full' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-2'}>
          <AnimatePresence mode="popLayout">
            {filteredMotions.map((motion) => (
              <MotionCard
                key={motion.id}
                motion={motion}
                viewMode={viewMode}
                onEdit={handleEditMotion}
                onDelete={handleDeleteMotion}
                onToggleFavorite={handleToggleFavorite}
                onCopy={handleCopyMotion}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Copy Toast */}
      <AnimatePresence>
        {copiedId && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            Motion copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <MotionModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingMotion(null);
            }}
            motion={editingMotion}
            onSave={handleSaveMotion}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MotionLibrary;
