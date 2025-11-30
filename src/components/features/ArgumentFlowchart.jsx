/**
 * Argument Flowchart - Interactive Debate Argument Visualization
 * Drag-and-drop nodes, connections, zoom/pan, and export functionality
 */

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Plus,
  Minus,
  ZoomIn,
  ZoomOut,
  Move,
  Download,
  Image,
  FileText,
  Trash2,
  Edit3,
  Link2,
  Unlink,
  RotateCcw,
  Save,
  FolderOpen,
  Copy,
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronRight,
  X,
  Check,
  Sparkles,
  Target,
  Shield,
  Lightbulb,
  MessageSquare,
  AlertTriangle,
  HelpCircle,
  Maximize2,
  Minimize2,
  Grid3X3,
  MousePointer,
  Hand
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const NODE_TYPES = {
  claim: {
    label: 'Claim',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/50',
    textColor: 'text-cyan-400',
    icon: Target,
    description: 'Main argument assertion'
  },
  evidence: {
    label: 'Evidence',
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/50',
    textColor: 'text-emerald-400',
    icon: FileText,
    description: 'Supporting data or facts'
  },
  warrant: {
    label: 'Warrant',
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/50',
    textColor: 'text-purple-400',
    icon: Lightbulb,
    description: 'Reasoning connecting evidence to claim'
  },
  impact: {
    label: 'Impact',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/50',
    textColor: 'text-amber-400',
    icon: AlertTriangle,
    description: 'Significance or consequence'
  },
  response: {
    label: 'Response',
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-400',
    icon: Shield,
    description: 'Counter-argument or rebuttal'
  },
  question: {
    label: 'Question',
    color: 'from-slate-400 to-slate-600',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/50',
    textColor: 'text-slate-400',
    icon: HelpCircle,
    description: 'Cross-examination point'
  }
};

const CONNECTION_TYPES = {
  supports: { label: 'Supports', color: '#22c55e', dash: false },
  attacks: { label: 'Attacks', color: '#ef4444', dash: false },
  responds: { label: 'Responds', color: '#f59e0b', dash: true },
  leads_to: { label: 'Leads To', color: '#8b5cf6', dash: false },
  questions: { label: 'Questions', color: '#64748b', dash: true }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getConnectionPath = (startX, startY, endX, endY) => {
  const midX = (startX + endX) / 2;
  const controlOffset = Math.abs(endX - startX) * 0.3;
  
  // Bezier curve for smoother connections
  return `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;
};

// ============================================
// NODE COMPONENT
// ============================================

const FlowNode = ({
  node,
  isSelected,
  isDragging,
  onSelect,
  onDragStart,
  onDrag,
  onDragEnd,
  onEdit,
  onDelete,
  onStartConnection,
  onEndConnection,
  isConnecting,
  scale
}) => {
  const nodeRef = useRef(null);
  const [localDragging, setLocalDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const config = NODE_TYPES[node.type] || NODE_TYPES.claim;
  const Icon = config.icon;

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();
    
    const rect = nodeRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setLocalDragging(true);
    onDragStart?.(node.id);
    onSelect?.(node.id);
  };

  const handleMouseMove = useCallback((e) => {
    if (!localDragging) return;
    
    const newX = (e.clientX - dragOffset.x) / scale;
    const newY = (e.clientY - dragOffset.y) / scale;
    onDrag?.(node.id, newX, newY);
  }, [localDragging, dragOffset, scale, node.id, onDrag]);

  const handleMouseUp = useCallback(() => {
    if (localDragging) {
      setLocalDragging(false);
      onDragEnd?.(node.id);
    }
  }, [localDragging, node.id, onDragEnd]);

  useEffect(() => {
    if (localDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [localDragging, handleMouseMove, handleMouseUp]);

  const handleConnectionClick = (e, isStart) => {
    e.stopPropagation();
    if (isConnecting) {
      onEndConnection?.(node.id);
    } else if (isStart) {
      onStartConnection?.(node.id);
    }
  };

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        boxShadow: isSelected 
          ? '0 0 0 2px rgba(6, 182, 212, 0.5), 0 20px 40px rgba(0, 0, 0, 0.3)' 
          : '0 10px 30px rgba(0, 0, 0, 0.2)'
      }}
      style={{
        position: 'absolute',
        left: node.x,
        top: node.y,
        cursor: localDragging ? 'grabbing' : 'grab',
        zIndex: isSelected ? 100 : localDragging ? 99 : 10
      }}
      className={`
        w-64 rounded-xl border backdrop-blur-sm
        ${config.bgColor} ${config.borderColor}
        ${isSelected ? 'ring-2 ring-cyan-500/50' : ''}
        transition-shadow duration-200
      `}
      onMouseDown={handleMouseDown}
    >
      {/* Connection Points */}
      <div
        className={`
          absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full 
          bg-slate-700 border-2 border-slate-500 cursor-crosshair
          hover:bg-cyan-500 hover:border-cyan-400 hover:scale-125
          transition-all duration-200
          ${isConnecting ? 'animate-pulse bg-cyan-500 border-cyan-400' : ''}
        `}
        onClick={(e) => handleConnectionClick(e, false)}
      />
      <div
        className={`
          absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full 
          bg-slate-700 border-2 border-slate-500 cursor-crosshair
          hover:bg-emerald-500 hover:border-emerald-400 hover:scale-125
          transition-all duration-200
        `}
        onClick={(e) => handleConnectionClick(e, true)}
      />

      {/* Header */}
      <div className={`flex items-center gap-2 p-3 border-b ${config.borderColor}`}>
        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${config.color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className={`text-xs font-semibold ${config.textColor} uppercase tracking-wider`}>
          {config.label}
        </span>
        
        {/* Actions */}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(node);
            }}
            className="p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(node.id);
            }}
            className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">
          {node.title || 'Untitled'}
        </h4>
        {node.content && (
          <p className="text-slate-400 text-xs line-clamp-3">
            {node.content}
          </p>
        )}
      </div>

      {/* Footer */}
      {node.source && (
        <div className="px-3 pb-3">
          <p className="text-slate-500 text-[10px] truncate">
            Source: {node.source}
          </p>
        </div>
      )}
    </motion.div>
  );
};

// ============================================
// CONNECTION COMPONENT
// ============================================

const Connection = ({ connection, nodes, isSelected, onSelect, onDelete }) => {
  const startNode = nodes.find(n => n.id === connection.from);
  const endNode = nodes.find(n => n.id === connection.to);
  
  if (!startNode || !endNode) return null;

  const startX = startNode.x + 256 + 8; // node width + connector offset
  const startY = startNode.y + 50; // approximate vertical center
  const endX = endNode.x - 8;
  const endY = endNode.y + 50;

  const config = CONNECTION_TYPES[connection.type] || CONNECTION_TYPES.supports;
  const path = getConnectionPath(startX, startY, endX, endY);

  // Calculate midpoint for label
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  return (
    <g 
      className="cursor-pointer" 
      onClick={() => onSelect?.(connection.id)}
    >
      {/* Connection path */}
      <path
        d={path}
        fill="none"
        stroke={config.color}
        strokeWidth={isSelected ? 3 : 2}
        strokeDasharray={config.dash ? '8 4' : 'none'}
        className="transition-all duration-200"
        style={{
          filter: isSelected ? 'drop-shadow(0 0 8px currentColor)' : 'none'
        }}
      />
      
      {/* Arrow marker */}
      <circle
        cx={endX}
        cy={endY}
        r={4}
        fill={config.color}
      />

      {/* Label */}
      <g transform={`translate(${midX}, ${midY})`}>
        <rect
          x={-30}
          y={-10}
          width={60}
          height={20}
          rx={4}
          fill="#1e293b"
          stroke={config.color}
          strokeWidth={1}
          opacity={0.9}
        />
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fill={config.color}
          fontSize={10}
          fontWeight={500}
        >
          {config.label}
        </text>
      </g>

      {/* Delete button (when selected) */}
      {isSelected && (
        <g 
          transform={`translate(${midX + 40}, ${midY})`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(connection.id);
          }}
          className="cursor-pointer"
        >
          <circle r={10} fill="#ef4444" />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={12}
          >
            ×
          </text>
        </g>
      )}
    </g>
  );
};

// ============================================
// ADD NODE MODAL
// ============================================

const AddNodeModal = ({ isOpen, onClose, onAdd, editNode }) => {
  const [formData, setFormData] = useState({
    type: 'claim',
    title: '',
    content: '',
    source: ''
  });

  useEffect(() => {
    if (editNode) {
      setFormData({
        type: editNode.type || 'claim',
        title: editNode.title || '',
        content: editNode.content || '',
        source: editNode.source || ''
      });
    } else {
      setFormData({
        type: 'claim',
        title: '',
        content: '',
        source: ''
      });
    }
  }, [editNode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData, editNode?.id);
    onClose();
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
        className="w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="relative p-6 border-b border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10" />
          <div className="relative flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
                <GitBranch className="w-5 h-5 text-cyan-400" />
              </div>
              {editNode ? 'Edit Node' : 'Add Node'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Node Type */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-400">Node Type</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(NODE_TYPES).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: key })}
                    className={`
                      p-3 rounded-xl border transition-all text-left
                      ${formData.type === key 
                        ? `${config.bgColor} ${config.borderColor} ${config.textColor}` 
                        : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:bg-slate-800/50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <p className="text-xs font-medium">{config.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter node title..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Add details or explanation..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Source */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Source (optional)</label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="Citation or reference..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            />
          </div>

          {/* Actions */}
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
              {editNode ? 'Save Changes' : 'Add Node'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// CONNECTION MODAL
// ============================================

const ConnectionModal = ({ isOpen, onClose, onAdd, fromNode, toNode }) => {
  const [connectionType, setConnectionType] = useState('supports');

  if (!isOpen) return null;

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
        className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-cyan-400" />
            Create Connection
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="mb-6">
          <p className="text-slate-400 text-sm mb-4">
            Connecting <span className="text-cyan-400 font-medium">{fromNode?.title}</span> to{' '}
            <span className="text-emerald-400 font-medium">{toNode?.title}</span>
          </p>

          <div className="space-y-2">
            {Object.entries(CONNECTION_TYPES).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setConnectionType(key)}
                className={`
                  w-full p-3 rounded-xl border transition-all flex items-center gap-3
                  ${connectionType === key 
                    ? 'bg-slate-800 border-slate-600' 
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/50'
                  }
                `}
              >
                <div 
                  className="w-8 h-1 rounded-full"
                  style={{ 
                    backgroundColor: config.color,
                    backgroundImage: config.dash ? `repeating-linear-gradient(90deg, ${config.color}, ${config.color} 4px, transparent 4px, transparent 8px)` : 'none'
                  }}
                />
                <span className="text-white font-medium">{config.label}</span>
                {connectionType === key && (
                  <Check className="w-4 h-4 text-cyan-400 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onAdd(connectionType);
              onClose();
            }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25"
          >
            Connect
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// TOOLBAR COMPONENT
// ============================================

const Toolbar = ({
  scale,
  onZoomIn,
  onZoomOut,
  onResetView,
  onAddNode,
  onExportPNG,
  onExportPDF,
  onSave,
  onLoad,
  tool,
  setTool,
  showGrid,
  setShowGrid
}) => {
  return (
    <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
      {/* Tool Selection */}
      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm flex flex-col gap-1">
        <button
          onClick={() => setTool('select')}
          className={`p-2.5 rounded-lg transition-all ${
            tool === 'select' 
              ? 'bg-cyan-500/20 text-cyan-400' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Select Tool (V)"
        >
          <MousePointer className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTool('pan')}
          className={`p-2.5 rounded-lg transition-all ${
            tool === 'pan' 
              ? 'bg-cyan-500/20 text-cyan-400' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Pan Tool (H)"
        >
          <Hand className="w-5 h-5" />
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm flex flex-col gap-1">
        <button
          onClick={onZoomIn}
          className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <div className="text-center text-xs text-slate-500 py-1">
          {Math.round(scale * 100)}%
        </div>
        <button
          onClick={onZoomOut}
          className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={onResetView}
          className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          title="Reset View (R)"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* View Options */}
      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-2.5 rounded-lg transition-all ${
            showGrid 
              ? 'bg-cyan-500/20 text-cyan-400' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle Grid (G)"
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// RIGHT PANEL COMPONENT
// ============================================

const RightPanel = ({ onAddNode, onExportPNG, onExportPDF, onSave, onLoad, onClear }) => {
  return (
    <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
      {/* Add Node */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddNode}
        className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
        title="Add Node (N)"
      >
        <Plus className="w-5 h-5" />
      </motion.button>

      {/* File Operations */}
      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm flex flex-col gap-1">
        <button
          onClick={onSave}
          className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          title="Save Flowchart"
        >
          <Save className="w-5 h-5" />
        </button>
        <button
          onClick={onLoad}
          className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          title="Load Flowchart"
        >
          <FolderOpen className="w-5 h-5" />
        </button>
      </div>

      {/* Export */}
      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm flex flex-col gap-1">
        <button
          onClick={onExportPNG}
          className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          title="Export as PNG"
        >
          <Image className="w-5 h-5" />
        </button>
        <button
          onClick={onExportPDF}
          className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          title="Export as PDF"
        >
          <FileText className="w-5 h-5" />
        </button>
      </div>

      {/* Clear */}
      <button
        onClick={onClear}
        className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        title="Clear Canvas"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

// ============================================
// NODE TYPE LEGEND
// ============================================

const Legend = () => {
  return (
    <div className="absolute bottom-4 left-4 z-30 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Node Types</h4>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(NODE_TYPES).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <div key={key} className="flex items-center gap-2">
              <div className={`p-1 rounded ${config.bgColor}`}>
                <Icon className={`w-3 h-3 ${config.textColor}`} />
              </div>
              <span className="text-xs text-slate-400">{config.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// EMPTY STATE
// ============================================

const EmptyState = ({ onAddNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="absolute inset-0 flex items-center justify-center pointer-events-none"
  >
    <div className="text-center pointer-events-auto">
      <div className="relative inline-block mb-8">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 w-32 h-32 rounded-full bg-cyan-500/20 blur-xl"
        />
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl shadow-2xl"
        >
          <GitBranch className="w-16 h-16 text-cyan-400" />
        </motion.div>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3">Start Building Your Flow</h3>
      <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        Create argument structures visually. Add claims, evidence, warrants, and connect them to see your case flow.
      </p>
      
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)' }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddNode}
        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-lg shadow-cyan-500/25 inline-flex items-center gap-3"
      >
        <Plus className="w-5 h-5" />
        Add First Node
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  </motion.div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const ArgumentFlowchart = () => {
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Canvas state
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState('select');
  const [showGrid, setShowGrid] = useState(true);

  // Selection state
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);

  // Connection creation state
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [pendingConnection, setPendingConnection] = useState(null);

  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case 'n':
          setShowAddModal(true);
          break;
        case 'v':
          setTool('select');
          break;
        case 'h':
          setTool('pan');
          break;
        case 'g':
          setShowGrid(prev => !prev);
          break;
        case 'r':
          handleResetView();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case 'delete':
        case 'backspace':
          if (selectedNode) {
            handleDeleteNode(selectedNode);
          } else if (selectedConnection) {
            handleDeleteConnection(selectedConnection);
          }
          break;
        case 'escape':
          setIsConnecting(false);
          setConnectionStart(null);
          setSelectedNode(null);
          setSelectedConnection(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, selectedConnection]);

  // Zoom functions
  const handleZoomIn = () => setScale(s => Math.min(s * 1.2, 3));
  const handleZoomOut = () => setScale(s => Math.max(s / 1.2, 0.25));
  const handleResetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(s => Math.min(Math.max(s * delta, 0.25), 3));
    }
  };

  // Pan functions
  const handleCanvasMouseDown = (e) => {
    if (tool === 'pan' || e.button === 1) { // Middle mouse button or pan tool
      setIsPanning(true);
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    } else if (tool === 'select') {
      // Deselect when clicking on canvas
      if (e.target === canvasRef.current || e.target.tagName === 'svg') {
        setSelectedNode(null);
        setSelectedConnection(null);
        if (isConnecting) {
          setIsConnecting(false);
          setConnectionStart(null);
        }
      }
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (isPanning) {
      setOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
  };

  // Node functions
  const handleAddNode = (data, editId) => {
    if (editId) {
      setNodes(nodes.map(n => n.id === editId ? { ...n, ...data } : n));
    } else {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const newNode = {
        id: generateId(),
        ...data,
        x: (containerRect?.width / 2 - 128 - offset.x) / scale + Math.random() * 100 - 50,
        y: (containerRect?.height / 2 - 50 - offset.y) / scale + Math.random() * 100 - 50
      };
      setNodes([...nodes, newNode]);
    }
    setEditingNode(null);
  };

  const handleDeleteNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
    setSelectedNode(null);
  };

  const handleNodeDrag = (nodeId, x, y) => {
    setNodes(nodes.map(n => n.id === nodeId ? { ...n, x, y } : n));
  };

  // Connection functions
  const handleStartConnection = (nodeId) => {
    setIsConnecting(true);
    setConnectionStart(nodeId);
  };

  const handleEndConnection = (nodeId) => {
    if (connectionStart && connectionStart !== nodeId) {
      // Check if connection already exists
      const exists = connections.some(
        c => (c.from === connectionStart && c.to === nodeId) ||
             (c.from === nodeId && c.to === connectionStart)
      );
      
      if (!exists) {
        setPendingConnection({ from: connectionStart, to: nodeId });
        setShowConnectionModal(true);
      }
    }
    setIsConnecting(false);
    setConnectionStart(null);
  };

  const handleAddConnection = (type) => {
    if (pendingConnection) {
      const newConnection = {
        id: generateId(),
        from: pendingConnection.from,
        to: pendingConnection.to,
        type
      };
      setConnections([...connections, newConnection]);
      setPendingConnection(null);
    }
  };

  const handleDeleteConnection = (connectionId) => {
    setConnections(connections.filter(c => c.id !== connectionId));
    setSelectedConnection(null);
  };

  // Export functions
  const handleExportPNG = async () => {
    if (!canvasRef.current) return;

    try {
      // Using html2canvas would be ideal here, but for now we'll create a simple canvas export
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = 1920;
      canvas.height = 1080;
      
      // Fill background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw nodes as rectangles with text
      nodes.forEach(node => {
        const config = NODE_TYPES[node.type];
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(node.x, node.y, 256, 100, 12);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = '14px sans-serif';
        ctx.fillText(node.title || 'Untitled', node.x + 12, node.y + 50);
      });
      
      // Draw connections
      connections.forEach(conn => {
        const startNode = nodes.find(n => n.id === conn.from);
        const endNode = nodes.find(n => n.id === conn.to);
        if (startNode && endNode) {
          const config = CONNECTION_TYPES[conn.type];
          ctx.strokeStyle = config.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(startNode.x + 256, startNode.y + 50);
          ctx.lineTo(endNode.x, endNode.y + 50);
          ctx.stroke();
        }
      });
      
      // Download
      const link = document.createElement('a');
      link.download = `argument-flow-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleExportPDF = () => {
    // For PDF export, we'd typically use a library like jsPDF
    // For now, we'll trigger print dialog which allows saving as PDF
    window.print();
  };

  // Save/Load functions
  const handleSave = () => {
    const data = { nodes, connections, scale, offset };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `argument-flow-${Date.now()}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            setNodes(data.nodes || []);
            setConnections(data.connections || []);
            if (data.scale) setScale(data.scale);
            if (data.offset) setOffset(data.offset);
          } catch (error) {
            console.error('Load failed:', error);
            alert('Failed to load file. Please check the format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClear = () => {
    if (nodes.length === 0 && connections.length === 0) return;
    if (confirm('Clear all nodes and connections?')) {
      setNodes([]);
      setConnections([]);
      setSelectedNode(null);
      setSelectedConnection(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-8rem)]"
    >
      <div className="space-y-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
                <GitBranch className="w-7 h-7 text-cyan-400" />
              </div>
              Argument Flowchart
            </h1>
            <p className="text-slate-400 mt-2">
              {nodes.length} nodes • {connections.length} connections
            </p>
          </div>
        </div>

        {/* Canvas Container */}
        <div 
          ref={containerRef}
          className="flex-1 relative rounded-2xl border border-slate-800/60 bg-slate-950 overflow-hidden"
          style={{ cursor: tool === 'pan' ? 'grab' : isPanning ? 'grabbing' : 'default' }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onWheel={handleWheel}
        >
          {/* Grid Background */}
          {showGrid && (
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(100, 116, 139, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(100, 116, 139, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: `${32 * scale}px ${32 * scale}px`,
                backgroundPosition: `${offset.x}px ${offset.y}px`
              }}
            />
          )}

          {/* Canvas */}
          <div
            ref={canvasRef}
            className="absolute inset-0"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: '0 0'
            }}
          >
            {/* SVG for connections */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ overflow: 'visible' }}
            >
              {connections.map(connection => (
                <Connection
                  key={connection.id}
                  connection={connection}
                  nodes={nodes}
                  isSelected={selectedConnection === connection.id}
                  onSelect={(id) => {
                    setSelectedConnection(id);
                    setSelectedNode(null);
                  }}
                  onDelete={handleDeleteConnection}
                />
              ))}

              {/* Active connection line */}
              {isConnecting && connectionStart && (
                <line
                  x1={nodes.find(n => n.id === connectionStart)?.x + 256 + 8}
                  y1={nodes.find(n => n.id === connectionStart)?.y + 50}
                  x2={(offset.x * -1 + (containerRef.current?.clientWidth / 2 || 0)) / scale}
                  y2={(offset.y * -1 + (containerRef.current?.clientHeight / 2 || 0)) / scale}
                  stroke="#06b6d4"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  className="pointer-events-none"
                />
              )}
            </svg>

            {/* Nodes */}
            {nodes.map(node => (
              <FlowNode
                key={node.id}
                node={node}
                isSelected={selectedNode === node.id}
                onSelect={(id) => {
                  setSelectedNode(id);
                  setSelectedConnection(null);
                }}
                onDragStart={() => {}}
                onDrag={handleNodeDrag}
                onDragEnd={() => {}}
                onEdit={(n) => {
                  setEditingNode(n);
                  setShowAddModal(true);
                }}
                onDelete={handleDeleteNode}
                onStartConnection={handleStartConnection}
                onEndConnection={handleEndConnection}
                isConnecting={isConnecting}
                scale={scale}
              />
            ))}
          </div>

          {/* Empty State */}
          {nodes.length === 0 && (
            <EmptyState onAddNode={() => setShowAddModal(true)} />
          )}

          {/* Toolbar */}
          <Toolbar
            scale={scale}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
            tool={tool}
            setTool={setTool}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
          />

          {/* Right Panel */}
          <RightPanel
            onAddNode={() => setShowAddModal(true)}
            onExportPNG={handleExportPNG}
            onExportPDF={handleExportPDF}
            onSave={handleSave}
            onLoad={handleLoad}
            onClear={handleClear}
          />

          {/* Legend */}
          <Legend />

          {/* Connection mode indicator */}
          {isConnecting && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-sm font-medium flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Click a node to connect
              <button
                onClick={() => {
                  setIsConnecting(false);
                  setConnectionStart(null);
                }}
                className="ml-2 p-1 rounded hover:bg-cyan-500/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddNodeModal
            isOpen={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              setEditingNode(null);
            }}
            onAdd={handleAddNode}
            editNode={editingNode}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConnectionModal && pendingConnection && (
          <ConnectionModal
            isOpen={showConnectionModal}
            onClose={() => {
              setShowConnectionModal(false);
              setPendingConnection(null);
            }}
            onAdd={handleAddConnection}
            fromNode={nodes.find(n => n.id === pendingConnection.from)}
            toNode={nodes.find(n => n.id === pendingConnection.to)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ArgumentFlowchart;
