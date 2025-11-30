/**
 * Opponent Intelligence System
 * Track opponents, their patterns, and generate counter-strategies
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Target,
  Shield,
  BookOpen,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit3,
  Trash2,
  Eye,
  AlertTriangle,
  Zap,
  TrendingUp,
  Clock,
  Award,
  X,
  Save,
  Lightbulb,
  RefreshCw,
  School,
  Star
} from 'lucide-react';
import { useOpponents } from '../../hooks/useDebateData';
import { useAuth } from '../../contexts/AuthContext';
import { callGeminiAPI } from '../../utils/api';

// Empty state
const EmptyOpponents = ({ onAdd }) => (
  <div className="text-center py-16">
    <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6 mx-auto w-fit">
      <Users className="w-12 h-12 text-slate-500" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">No Opponents Tracked Yet</h3>
    <p className="text-slate-400 max-w-md mx-auto mb-6">
      Start building your opponent database to track patterns, weaknesses, and develop winning counter-strategies.
    </p>
    <button
      onClick={onAdd}
      className="px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium hover:bg-cyan-500/20 transition-all inline-flex items-center gap-2"
    >
      <UserPlus className="w-5 h-5" />
      Add Your First Opponent
    </button>
  </div>
);

// Add/Edit Opponent Modal
const OpponentModal = ({ isOpen, onClose, onSave, opponent = null }) => {
  const [formData, setFormData] = useState(opponent || {
    name: '',
    school: '',
    format: 'Public Forum',
    skillLevel: 'intermediate',
    debateStyle: '',
    strengths: [],
    weaknesses: [],
    commonArguments: [],
    notes: [],
    threatLevel: 3
  });
  const [newStrength, setNewStrength] = useState('');
  const [newWeakness, setNewWeakness] = useState('');
  const [newArgument, setNewArgument] = useState('');

  if (!isOpen) return null;

  const handleAddItem = (field, value, setter) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] || []), value.trim()]
      });
      setter('');
    }
  };

  const handleRemoveItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h2 className="text-xl font-bold text-white">
            {opponent ? 'Edit Opponent' : 'Add New Opponent'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">Build your opponent intelligence profile</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Opponent's name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">School</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder="School/Team name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Primary Format</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              >
                {['Public Forum', 'Lincoln-Douglas', 'Policy', 'Congress', 'World Schools', 'Extemp'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Skill Level</label>
              <select
                value={formData.skillLevel}
                onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              >
                <option value="novice">Novice</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="elite">Elite/National</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Threat Level</label>
              <div className="flex items-center gap-1 pt-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, threatLevel: level })}
                    className={`p-1 transition-all ${
                      level <= formData.threatLevel ? 'text-amber-400' : 'text-slate-600'
                    }`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Debate Style</label>
            <textarea
              value={formData.debateStyle}
              onChange={(e) => setFormData({ ...formData, debateStyle: e.target.value })}
              placeholder="Describe their general approach (aggressive, technical, narrative-focused...)"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
            />
          </div>

          {/* Strengths */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Strengths</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                placeholder="Add a strength..."
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('strengths', newStrength, setNewStrength))}
              />
              <button
                type="button"
                onClick={() => handleAddItem('strengths', newStrength, setNewStrength)}
                className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.strengths?.map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
                  {s}
                  <button type="button" onClick={() => handleRemoveItem('strengths', i)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Weaknesses</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newWeakness}
                onChange={(e) => setNewWeakness(e.target.value)}
                placeholder="Add a weakness..."
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('weaknesses', newWeakness, setNewWeakness))}
              />
              <button
                type="button"
                onClick={() => handleAddItem('weaknesses', newWeakness, setNewWeakness)}
                className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.weaknesses?.map((w, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                  {w}
                  <button type="button" onClick={() => handleRemoveItem('weaknesses', i)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Common Arguments */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Common Arguments</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newArgument}
                onChange={(e) => setNewArgument(e.target.value)}
                placeholder="Add an argument they frequently use..."
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('commonArguments', newArgument, setNewArgument))}
              />
              <button
                type="button"
                onClick={() => handleAddItem('commonArguments', newArgument, setNewArgument)}
                className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.commonArguments?.map((a, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm flex items-center gap-2">
                  {a}
                  <button type="button" onClick={() => handleRemoveItem('commonArguments', i)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {opponent ? 'Update' : 'Save'} Opponent
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Opponent Card Component
const OpponentCard = ({ opponent, onEdit, onDelete, onView, onGenerateStrategy }) => {
  const [expanded, setExpanded] = useState(false);

  const threatColors = {
    1: 'text-green-400',
    2: 'text-green-400',
    3: 'text-amber-400',
    4: 'text-orange-400',
    5: 'text-red-400'
  };

  const skillColors = {
    novice: 'bg-green-500/10 text-green-400 border-green-500/30',
    intermediate: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    elite: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-slate-800/60 bg-slate-900/30 hover:border-slate-700/60 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-lg">
            {opponent.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{opponent.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {opponent.school && (
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  <School className="w-3 h-3" />
                  {opponent.school}
                </span>
              )}
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 text-sm">{opponent.format}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Threat Level */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(level => (
              <Star 
                key={level}
                className={`w-4 h-4 ${
                  level <= opponent.threatLevel ? threatColors[opponent.threatLevel] : 'text-slate-700'
                } ${level <= opponent.threatLevel ? 'fill-current' : ''}`}
              />
            ))}
          </div>
          
          {/* Skill Badge */}
          <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${skillColors[opponent.skillLevel]}`}>
            {opponent.skillLevel}
          </span>
        </div>
      </div>

      {/* Debate Style */}
      {opponent.debateStyle && (
        <p className="text-slate-400 text-sm mt-3 line-clamp-2">{opponent.debateStyle}</p>
      )}

      {/* Quick Stats */}
      <div className="flex items-center gap-4 mt-4">
        {opponent.strengths?.length > 0 && (
          <span className="text-emerald-400 text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {opponent.strengths.length} strengths
          </span>
        )}
        {opponent.weaknesses?.length > 0 && (
          <span className="text-red-400 text-sm flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            {opponent.weaknesses.length} weaknesses
          </span>
        )}
        {opponent.commonArguments?.length > 0 && (
          <span className="text-cyan-400 text-sm flex items-center gap-1">
            <Target className="w-4 h-4" />
            {opponent.commonArguments.length} known args
          </span>
        )}
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
              {opponent.strengths?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Strengths
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {opponent.strengths.map((s, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {opponent.weaknesses?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Weaknesses
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {opponent.weaknesses.map((w, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {opponent.commonArguments?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    Common Arguments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {opponent.commonArguments.map((a, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/50">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
        >
          {expanded ? 'Show less' : 'Show more'}
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onGenerateStrategy(opponent)}
            className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all text-sm flex items-center gap-1"
          >
            <Zap className="w-4 h-4" />
            Counter Strategy
          </button>
          <button
            onClick={() => onEdit(opponent)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(opponent.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Counter Strategy Modal
const CounterStrategyModal = ({ isOpen, onClose, opponent, apiKey }) => {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');

  if (!isOpen) return null;

  const generateStrategy = async () => {
    if (!apiKey) {
      alert('Please configure your Gemini API key in settings');
      return;
    }

    setLoading(true);
    try {
      const prompt = `You are an expert debate coach. Generate a comprehensive counter-strategy for debating against this opponent:

**Opponent Profile:**
- Name: ${opponent.name}
- School: ${opponent.school || 'Unknown'}
- Format: ${opponent.format}
- Skill Level: ${opponent.skillLevel}
- Debate Style: ${opponent.debateStyle || 'Not specified'}
- Known Strengths: ${opponent.strengths?.join(', ') || 'None recorded'}
- Known Weaknesses: ${opponent.weaknesses?.join(', ') || 'None recorded'}
- Common Arguments: ${opponent.commonArguments?.join(', ') || 'None recorded'}

${topic ? `**Debate Topic:** ${topic}` : ''}

Provide:
1. **Pre-Round Preparation** - What to research and prepare
2. **Opening Strategy** - How to start the debate
3. **Exploiting Weaknesses** - Specific tactics to use
4. **Defending Against Strengths** - How to neutralize their advantages
5. **Cross-Examination Tips** - Questions to ask
6. **Predicted Arguments & Responses** - What they'll likely argue and how to counter
7. **Key Phrases to Use** - Impactful language
8. **Closing Strategy** - How to finish strong

Format your response with clear headers and bullet points.`;

      const response = await callGeminiAPI(prompt, apiKey);
      setStrategy(response);
    } catch (err) {
      console.error('Error generating strategy:', err);
      setStrategy('Error generating strategy. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Counter Strategy Generator
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Generate AI-powered strategy to defeat {opponent.name}
          </p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {!strategy ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Debate Topic (Optional)
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter the debate resolution for topic-specific strategy..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800/50">
                <h3 className="text-white font-medium mb-2">Opponent Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Format:</span>
                    <span className="text-slate-300 ml-2">{opponent.format}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Skill:</span>
                    <span className="text-slate-300 ml-2">{opponent.skillLevel}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Style:</span>
                    <span className="text-slate-300 ml-2">{opponent.debateStyle || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={generateStrategy}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:from-purple-400 hover:to-cyan-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating Strategy...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-5 h-5" />
                    Generate Counter Strategy
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800/50 whitespace-pre-wrap text-slate-300 leading-relaxed">
                {strategy}
              </div>
              <button
                onClick={() => setStrategy(null)}
                className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                Generate New Strategy
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Main Component
const OpponentIntelligence = ({ apiKey }) => {
  const { opponents, loading, addOpponent, updateOpponent, deleteOpponent } = useOpponents();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOpponent, setEditingOpponent] = useState(null);
  const [strategyOpponent, setStrategyOpponent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState('all');

  const filteredOpponents = useMemo(() => {
    return opponents.filter(opp => {
      const matchesSearch = !searchQuery || 
        opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.school?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFormat = filterFormat === 'all' || opp.format === filterFormat;
      return matchesSearch && matchesFormat;
    });
  }, [opponents, searchQuery, filterFormat]);

  const handleSaveOpponent = async (data) => {
    if (editingOpponent) {
      await updateOpponent(editingOpponent.id, data);
      setEditingOpponent(null);
    } else {
      await addOpponent(data);
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-cyan-400" />
            Opponent Intelligence
          </h1>
          <p className="text-slate-400 mt-1">Track opponents, patterns, and generate winning strategies</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Add Opponent
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opponents..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
          />
        </div>
        <select
          value={filterFormat}
          onChange={(e) => setFilterFormat(e.target.value)}
          className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white focus:border-cyan-500 outline-none"
        >
          <option value="all">All Formats</option>
          {['Public Forum', 'Lincoln-Douglas', 'Policy', 'Congress', 'World Schools', 'Extemp'].map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Stats Bar */}
      {opponents.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Opponents', value: opponents.length, color: 'cyan' },
            { label: 'High Threat', value: opponents.filter(o => o.threatLevel >= 4).length, color: 'red' },
            { label: 'With Notes', value: opponents.filter(o => o.notes?.length > 0).length, color: 'purple' },
            { label: 'Elite Level', value: opponents.filter(o => o.skillLevel === 'elite').length, color: 'amber' },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
              <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Opponents Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : opponents.length === 0 ? (
        <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/30">
          <EmptyOpponents onAdd={() => setShowAddModal(true)} />
        </div>
      ) : filteredOpponents.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No opponents match your search
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredOpponents.map(opponent => (
            <OpponentCard
              key={opponent.id}
              opponent={opponent}
              onEdit={(opp) => {
                setEditingOpponent(opp);
                setShowAddModal(true);
              }}
              onDelete={deleteOpponent}
              onView={() => {}}
              onGenerateStrategy={(opp) => setStrategyOpponent(opp)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <OpponentModal
            isOpen={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              setEditingOpponent(null);
            }}
            onSave={handleSaveOpponent}
            opponent={editingOpponent}
          />
        )}
        {strategyOpponent && (
          <CounterStrategyModal
            isOpen={!!strategyOpponent}
            onClose={() => setStrategyOpponent(null)}
            opponent={strategyOpponent}
            apiKey={apiKey}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpponentIntelligence;
