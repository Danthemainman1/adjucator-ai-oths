/**
 * Evidence/Research Library
 * Store, organize, and track debate evidence cards
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Tag,
  Calendar,
  Link2,
  Star,
  StarOff,
  Edit3,
  Trash2,
  Copy,
  Download,
  ChevronDown,
  ChevronRight,
  FileText,
  Clock,
  BarChart3,
  ExternalLink,
  RefreshCw,
  X,
  Save,
  Bookmark,
  ArrowUpDown,
  Check
} from 'lucide-react';
import { useEvidence } from '../../hooks/useDebateData';
import { useAuth } from '../../contexts/AuthContext';

// Citation formats
const CITATION_FORMATS = {
  mla: (card) => {
    const date = card.date ? new Date(card.date) : new Date();
    return `${card.author || 'Unknown'}. "${card.title}." ${card.source || 'Unknown Source'}, ${date.getFullYear()}.`;
  },
  apa: (card) => {
    const date = card.date ? new Date(card.date) : new Date();
    return `${card.author || 'Unknown'} (${date.getFullYear()}). ${card.title}. ${card.source || 'Unknown Source'}.`;
  },
  chicago: (card) => {
    const date = card.date ? new Date(card.date) : new Date();
    return `${card.author || 'Unknown'}. "${card.title}." ${card.source || 'Unknown Source'}, ${date.getFullYear()}.`;
  }
};

// Empty state
const EmptyEvidence = ({ onAdd }) => (
  <div className="text-center py-16">
    <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6 mx-auto w-fit">
      <BookOpen className="w-12 h-12 text-slate-500" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">No Evidence Cards Yet</h3>
    <p className="text-slate-400 max-w-md mx-auto mb-6">
      Build your research library by adding evidence cards. Tag, rate, and track usage across debates.
    </p>
    <button
      onClick={onAdd}
      className="px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium hover:bg-cyan-500/20 transition-all inline-flex items-center gap-2"
    >
      <Plus className="w-5 h-5" />
      Add Your First Card
    </button>
  </div>
);

// Add/Edit Evidence Modal
const EvidenceModal = ({ isOpen, onClose, onSave, evidence = null }) => {
  const [formData, setFormData] = useState(evidence || {
    title: '',
    content: '',
    warrantedAnalysis: '',
    source: '',
    author: '',
    date: '',
    url: '',
    tags: [],
    quality: 3,
    format: 'Public Forum',
    side: 'neutral'
  });
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('content');

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
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
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">
            {evidence ? 'Edit Evidence Card' : 'Add New Evidence'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">Store and organize your research</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-4 border-b border-slate-800">
          {[
            { id: 'content', label: 'Content' },
            { id: 'source', label: 'Source Info' },
            { id: 'metadata', label: 'Tags & Rating' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'content' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Card Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief description (e.g., 'Climate change causes extinction')"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Evidence Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Paste the full evidence text here..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Warranted Analysis</label>
                <textarea
                  value={formData.warrantedAnalysis}
                  onChange={(e) => setFormData({ ...formData, warrantedAnalysis: e.target.value })}
                  placeholder="Your analysis: Why is this evidence important? How does it support your argument?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
                />
              </div>
            </>
          )}

          {activeTab === 'source' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Source Name</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="e.g., New York Times, Nature Journal"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name(s)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Publication Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  />
                </div>
              </div>

              {/* Citation Preview */}
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800/50">
                <h4 className="text-sm font-medium text-slate-400 mb-3">Citation Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 w-16">MLA:</span>
                    <span className="text-slate-300">{CITATION_FORMATS.mla(formData)}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 w-16">APA:</span>
                    <span className="text-slate-300">{CITATION_FORMATS.apa(formData)}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 w-16">Chicago:</span>
                    <span className="text-slate-300">{CITATION_FORMATS.chicago(formData)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'metadata' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Format</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  >
                    {['Public Forum', 'Lincoln-Douglas', 'Policy', 'Congress', 'World Schools', 'General'].map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Side</label>
                  <select
                    value={formData.side}
                    onChange={(e) => setFormData({ ...formData, side: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  >
                    <option value="neutral">Neutral</option>
                    <option value="pro">Pro/Aff</option>
                    <option value="con">Con/Neg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Quality Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, quality: level })}
                      className={`p-1 transition-all ${
                        level <= formData.quality ? 'text-amber-400' : 'text-slate-600'
                      }`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                  <span className="text-slate-400 text-sm ml-2">
                    {formData.quality === 1 && 'Weak'}
                    {formData.quality === 2 && 'Fair'}
                    {formData.quality === 3 && 'Good'}
                    {formData.quality === 4 && 'Strong'}
                    {formData.quality === 5 && 'Excellent'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Tags</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm flex items-center gap-2">
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {/* Suggested Tags */}
                <div className="mt-3">
                  <p className="text-xs text-slate-500 mb-2">Suggested tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {['economy', 'climate', 'security', 'healthcare', 'education', 'foreign policy', 'technology', 'environment'].map(tag => (
                      !formData.tags.includes(tag) && (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setFormData({ ...formData, tags: [...formData.tags, tag] })}
                          className="px-2 py-1 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 text-xs hover:text-white hover:border-slate-600 transition-all"
                        >
                          + {tag}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

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
              {evidence ? 'Update' : 'Save'} Card
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Evidence Card Component
const EvidenceCard = ({ card, onEdit, onDelete, onCopy }) => {
  const [expanded, setExpanded] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState(null);

  const qualityColors = ['', 'text-red-400', 'text-orange-400', 'text-amber-400', 'text-emerald-400', 'text-cyan-400'];
  const sideColors = {
    neutral: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    pro: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    con: 'bg-red-500/10 text-red-400 border-red-500/30'
  };

  const handleCopyCitation = async (format) => {
    const citation = CITATION_FORMATS[format](card);
    await navigator.clipboard.writeText(citation);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleCopyContent = async () => {
    await navigator.clipboard.writeText(card.content);
    onCopy && onCopy();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-slate-800/60 bg-slate-900/30 hover:border-slate-700/60 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{card.title}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-slate-400 text-sm flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {card.source || 'Unknown Source'}
            </span>
            {card.date && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(card.date).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Quality Stars */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(level => (
              <Star 
                key={level}
                className={`w-4 h-4 ${
                  level <= card.quality ? qualityColors[card.quality] : 'text-slate-700'
                } ${level <= card.quality ? 'fill-current' : ''}`}
              />
            ))}
          </div>
          
          {/* Side Badge */}
          <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${sideColors[card.side || 'neutral']}`}>
            {card.side === 'pro' ? 'Pro' : card.side === 'con' ? 'Con' : 'Neutral'}
          </span>
        </div>
      </div>

      {/* Tags */}
      {card.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {card.tags.map((tag, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-400 text-xs flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content Preview */}
      <p className={`text-slate-300 text-sm ${expanded ? '' : 'line-clamp-3'}`}>
        {card.content}
      </p>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {card.warrantedAnalysis && (
              <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <h4 className="text-sm font-medium text-purple-400 mb-2">Warranted Analysis</h4>
                <p className="text-slate-300 text-sm">{card.warrantedAnalysis}</p>
              </div>
            )}

            {/* Citation Formats */}
            <div className="mt-4 p-3 rounded-xl bg-slate-800/30 border border-slate-800/50">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Copy Citation</h4>
              <div className="flex gap-2">
                {['mla', 'apa', 'chicago'].map(format => (
                  <button
                    key={format}
                    onClick={() => handleCopyCitation(format)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      copiedFormat === format
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {copiedFormat === format ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Usage Stats */}
            {card.usageCount > 0 && (
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="text-slate-400 flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  Used {card.usageCount} times
                </span>
                {card.lastUsed && (
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Last: {new Date(card.lastUsed).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
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
            onClick={handleCopyContent}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
            title="Copy content"
          >
            <Copy className="w-4 h-4" />
          </button>
          {card.url && (
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
              title="Open source"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={() => onEdit(card)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const EvidenceLibrary = ({ apiKey }) => {
  const { evidence, loading, allTags, addEvidence, updateEvidence, deleteEvidence, filters, setFilters } = useEvidence();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const filteredEvidence = useMemo(() => {
    let filtered = evidence.filter(card => {
      const matchesSearch = !searchQuery || 
        card.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.source?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === 'all' || card.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case 'quality':
        filtered.sort((a, b) => (b.quality || 0) - (a.quality || 0));
        break;
      case 'usage':
        filtered.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
        break;
    }

    return filtered;
  }, [evidence, searchQuery, selectedTag, sortBy]);

  const handleSaveCard = async (data) => {
    if (editingCard) {
      await updateEvidence(editingCard.id, data);
      setEditingCard(null);
    } else {
      await addEvidence(data);
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            Evidence Library
          </h1>
          <p className="text-slate-400 mt-1">Store, organize, and track your debate research</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Evidence
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search evidence..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
          />
        </div>
        
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white focus:border-cyan-500 outline-none"
        >
          <option value="all">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white focus:border-cyan-500 outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="quality">Highest Quality</option>
          <option value="usage">Most Used</option>
        </select>
      </div>

      {/* Stats Bar */}
      {evidence.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Cards', value: evidence.length, color: 'cyan' },
            { label: 'Pro Evidence', value: evidence.filter(e => e.side === 'pro').length, color: 'emerald' },
            { label: 'Con Evidence', value: evidence.filter(e => e.side === 'con').length, color: 'red' },
            { label: 'High Quality', value: evidence.filter(e => e.quality >= 4).length, color: 'amber' },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
              <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tags Cloud */}
      {allTags.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
          <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Tags ({allTags.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => {
              const count = evidence.filter(e => e.tags?.includes(tag)).length;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                    selectedTag === tag
                      ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
                      : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {tag}
                  <span className="text-xs opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Evidence Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : evidence.length === 0 ? (
        <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/30">
          <EmptyEvidence onAdd={() => setShowAddModal(true)} />
        </div>
      ) : filteredEvidence.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No evidence matches your search
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredEvidence.map(card => (
            <EvidenceCard
              key={card.id}
              card={card}
              onEdit={(c) => {
                setEditingCard(c);
                setShowAddModal(true);
              }}
              onDelete={deleteEvidence}
              onCopy={() => {}}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showAddModal && (
          <EvidenceModal
            isOpen={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              setEditingCard(null);
            }}
            onSave={handleSaveCard}
            evidence={editingCard}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EvidenceLibrary;
