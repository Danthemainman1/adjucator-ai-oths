/**
 * Evidence Library - PREMIUM POLISH
 * Beautiful card-based evidence management
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Plus,
  Filter,
  Tag,
  Star,
  Copy,
  ExternalLink,
  Clock,
  FileText,
  Bookmark,
  BookMarked,
  ChevronRight,
  X,
  Check,
  Sparkles,
  Quote,
  Link2,
  Calendar,
  User,
  Download,
  MoreVertical,
  Edit3,
  Trash2,
  FolderOpen
} from 'lucide-react';
import { useEvidence } from '../../hooks/useDebateData';
import { useAuth } from '../../contexts/AuthContext';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.3 }
  }
};

// Quality Rating Stars
const QualityStars = ({ rating, onChange, readonly = true, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => {
        const filled = (hoverRating || rating) >= star;
        return (
          <motion.button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            whileHover={!readonly ? { scale: 1.2 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            className={readonly ? 'cursor-default' : 'cursor-pointer'}
          >
            <Star 
              className={`${sizes[size]} transition-colors ${
                filled ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
};

// Tag Pill Component
const TagPill = ({ label, color = 'slate', onRemove, onClick }) => {
  const colors = {
    slate: 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700',
    cyan: 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border-cyan-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30',
    purple: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/30',
    amber: 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/30',
    red: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/30',
    blue: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/30'
  };

  return (
    <motion.span
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${colors[color]} transition-colors cursor-pointer`}
    >
      <Tag className="w-3 h-3" />
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:text-white transition-colors"
        >
          ×
        </button>
      )}
    </motion.span>
  );
};

// Empty State
const EmptyEvidence = ({ onAdd }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-20"
  >
    <div className="relative inline-block mb-8">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 w-32 h-32 rounded-full bg-cyan-500/20 blur-xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        className="absolute inset-0 w-32 h-32 rounded-full bg-blue-500/20 blur-xl"
      />
      
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl shadow-2xl"
      >
        <BookOpen className="w-16 h-16 text-cyan-400" />
        <motion.div
          animate={{ rotate: [0, 10, 0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-6 h-6 text-amber-400" />
        </motion.div>
      </motion.div>
    </div>
    
    <h3 className="text-2xl font-bold text-white mb-3">Build Your Evidence Arsenal</h3>
    <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
      Store your best cards, organize by topic, and access them instantly during rounds. 
      Quality evidence wins debates.
    </p>
    
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onAdd}
      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-lg shadow-cyan-500/25 inline-flex items-center gap-3"
    >
      <Plus className="w-5 h-5" />
      Add Your First Card
      <ChevronRight className="w-5 h-5" />
    </motion.button>
  </motion.div>
);

// Evidence Card Component
const EvidenceCard = ({ evidence, onClick, onCopy, isExpanded }) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(evidence.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  const tagColors = ['cyan', 'purple', 'emerald', 'amber', 'blue', 'red'];

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.01, y: -4 }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      <div className="glass-panel relative p-5 overflow-hidden group-hover:border-white/20 transition-all">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        
        {/* Header */}
        <div className="relative flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg truncate group-hover:text-cyan-400 transition-colors">
              {evidence.title}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {evidence.author || 'Unknown'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {evidence.year || 'N/A'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <QualityStars rating={evidence.quality || 3} size="sm" />
            
            {/* Action buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="relative mb-4">
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-cyan-500 to-blue-600" />
          <p className="pl-4 text-slate-400 text-sm line-clamp-3 leading-relaxed italic">
            "{evidence.content}"
          </p>
        </div>

        {/* Source */}
        {evidence.source && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            <Link2 className="w-4 h-4 text-slate-500" />
            <span className="text-slate-500 truncate">{evidence.source}</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {evidence.tags?.slice(0, 4).map((tag, i) => (
            <TagPill 
              key={tag} 
              label={tag} 
              color={tagColors[i % tagColors.length]} 
            />
          ))}
          {evidence.tags?.length > 4 && (
            <span className="text-xs text-slate-500 self-center">
              +{evidence.tags.length - 4} more
            </span>
          )}
        </div>

        {/* Usage stats */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/50">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              Used {evidence.usageCount || 0} times
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {evidence.lastUsed ? new Date(evidence.lastUsed).toLocaleDateString() : 'Never'}
            </span>
          </div>
          
          {evidence.bookmarked && (
            <BookMarked className="w-4 h-4 text-amber-400" />
          )}
        </div>

        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );
};

// Citation Formatter
const CitationFormatter = ({ evidence, format = 'mla' }) => {
  const [copied, setCopied] = useState(false);
  
  const formatCitation = () => {
    const { author, title, source, year, url } = evidence;
    
    switch (format) {
      case 'mla':
        return `${author || 'Unknown'}. "${title}." ${source || 'N/A'}, ${year || 'n.d.'}.`;
      case 'apa':
        return `${author || 'Unknown'}. (${year || 'n.d.'}) ${title}. ${source || 'N/A'}.`;
      case 'chicago':
        return `${author || 'Unknown'}. "${title}." ${source || 'N/A'} (${year || 'n.d.'}).`;
      default:
        return `${author || 'Unknown'} - ${title} (${year || 'n.d.'})`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatCitation());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 rounded-xl bg-slate-950/30 border border-white/10">
      <p className="text-slate-300 text-sm font-mono">{formatCitation()}</p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCopy}
        className="mt-3 px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-medium hover:bg-slate-600 transition-colors flex items-center gap-2"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Copy Citation'}
      </motion.button>
    </div>
  );
};

// Evidence Detail Modal
const EvidenceDetailModal = ({ evidence, isOpen, onClose, onEdit, onDelete }) => {
  const [activeFormat, setActiveFormat] = useState('mla');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !evidence) return null;

  const handleCopyContent = () => {
    navigator.clipboard.writeText(evidence.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel w-full max-w-3xl max-h-[90vh] overflow-hidden p-0"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10" />
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{evidence.title}</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {evidence.author || 'Unknown'}
                </span>
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {evidence.year || 'N/A'}
                </span>
                <QualityStars rating={evidence.quality || 3} />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={onEdit}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <Edit3 className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Quote className="w-5 h-5 text-cyan-400" />
                Evidence Content
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyContent}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>
            <div className="relative p-5 rounded-xl bg-slate-950/30 border border-white/5">
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-cyan-500 to-blue-600" />
              <p className="pl-4 text-slate-300 leading-relaxed whitespace-pre-wrap">
                {evidence.content}
              </p>
            </div>
          </div>

          {/* Source */}
          {evidence.source && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/30 border border-white/5">
              <Link2 className="w-5 h-5 text-slate-500" />
              <a 
                href={evidence.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
              >
                {evidence.source}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Tags */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-400" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {evidence.tags?.map((tag, i) => (
                <TagPill 
                  key={tag} 
                  label={tag} 
                  color={['cyan', 'purple', 'emerald', 'amber', 'blue'][i % 5]} 
                />
              ))}
            </div>
          </div>

          {/* Citation Formatter */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              Citation
            </h3>
            <div className="flex items-center gap-2 mb-3">
              {['mla', 'apa', 'chicago'].map(format => (
                <button
                  key={format}
                  onClick={() => setActiveFormat(format)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFormat === format
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
            <CitationFormatter evidence={evidence} format={activeFormat} />
          </div>

          {/* Usage Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/30 text-center border border-white/5">
              <p className="text-2xl font-bold text-white">{evidence.usageCount || 0}</p>
              <p className="text-slate-500 text-sm">Times Used</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/30 text-center border border-white/5">
              <p className="text-2xl font-bold text-white">{evidence.quality || 0}</p>
              <p className="text-slate-500 text-sm">Quality Rating</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/30 text-center border border-white/5">
              <p className="text-2xl font-bold text-white">
                {evidence.lastUsed ? new Date(evidence.lastUsed).toLocaleDateString() : 'Never'}
              </p>
              <p className="text-slate-500 text-sm">Last Used</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Add Evidence Modal
const AddEvidenceModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    source: '',
    url: '',
    content: '',
    tags: '',
    quality: 3
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      usageCount: 0,
      createdAt: new Date().toISOString()
    });
    onClose();
    setFormData({
      title: '',
      author: '',
      year: '',
      source: '',
      url: '',
      content: '',
      tags: '',
      quality: 3
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-hidden p-0"
      >
        <div className="relative p-6 border-b border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                </div>
                Add Evidence Card
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Card Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Climate Change Impact on Economy"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Quality</label>
              <div className="pt-2">
                <QualityStars 
                  rating={formData.quality} 
                  onChange={(r) => setFormData({ ...formData, quality: r })}
                  readonly={false}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Source / Publication</label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="e.g., The New York Times, Nature Journal"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">URL (optional)</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Evidence Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Paste your evidence card content here..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., climate, economy, impact, 2024"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25"
            >
              Add Evidence
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Main Component
const EvidenceLibrary = ({ apiKey }) => {
  const { user } = useAuth();
  const { evidence, loading, saveEvidence, deleteEvidence } = useEvidence();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    evidence?.forEach(e => e.tags?.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [evidence]);

  // Filter and sort evidence
  const filteredEvidence = useMemo(() => {
    let result = [...(evidence || [])];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.title?.toLowerCase().includes(query) ||
        e.content?.toLowerCase().includes(query) ||
        e.author?.toLowerCase().includes(query) ||
        e.tags?.some(t => t.toLowerCase().includes(query))
      );
    }
    
    // Tag filter
    if (filterTag !== 'all') {
      result = result.filter(e => e.tags?.includes(filterTag));
    }
    
    // Sort
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'quality':
        result.sort((a, b) => (b.quality || 0) - (a.quality || 0));
        break;
      case 'usage':
        result.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
        break;
      case 'alpha':
        result.sort((a, b) => a.title?.localeCompare(b.title));
        break;
    }
    
    return result;
  }, [evidence, searchQuery, filterTag, sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
                <BookOpen className="w-7 h-7 text-cyan-400" />
              </div>
              Evidence Library
            </h1>
            <p className="text-slate-400 mt-2">
              {evidence?.length || 0} cards • Organize and access your research instantly
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/25 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Card
          </motion.button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search evidence..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tag filter */}
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 outline-none transition-all"
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 outline-none transition-all"
            >
              <option value="recent">Most Recent</option>
              <option value="quality">Highest Quality</option>
              <option value="usage">Most Used</option>
              <option value="alpha">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 animate-pulse">
                <div className="space-y-3">
                  <div className="h-5 w-3/4 bg-slate-800 rounded" />
                  <div className="h-4 w-1/2 bg-slate-800 rounded" />
                  <div className="h-20 bg-slate-800 rounded" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-slate-800 rounded-full" />
                    <div className="h-6 w-16 bg-slate-800 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvidence.length === 0 ? (
          <div className="p-8 rounded-3xl border border-slate-800/60 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
            {evidence?.length === 0 ? (
              <EmptyEvidence onAdd={() => setShowAddModal(true)} />
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                <p className="text-slate-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-4"
          >
            {filteredEvidence.map(item => (
              <EvidenceCard
                key={item.id}
                evidence={item}
                onClick={() => setSelectedEvidence(item)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddEvidenceModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSave={saveEvidence}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEvidence && (
          <EvidenceDetailModal
            evidence={selectedEvidence}
            isOpen={!!selectedEvidence}
            onClose={() => setSelectedEvidence(null)}
            onEdit={() => {}}
            onDelete={() => deleteEvidence(selectedEvidence.id)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EvidenceLibrary;
