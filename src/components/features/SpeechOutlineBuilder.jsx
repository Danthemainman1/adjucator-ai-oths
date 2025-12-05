import React, { useState } from 'react';
import { AnimatePresence, Reorder, motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Trash2,
  GripVertical,
  Clock,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Upload,
  Save,
  FolderOpen,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Tag,
  StickyNote,
  Layers,
  FileDown,
  Printer,
  RotateCcw,
  Wand2,
  Layout
} from 'lucide-react';

// Pre-built templates for different debate formats
const OUTLINE_TEMPLATES = {
  policy_1ac: {
    name: 'Policy 1AC',
    format: 'Policy',
    totalTime: 480, // 8 minutes
    sections: [
      {
        id: 'inherency',
        type: 'contention',
        title: 'Inherency',
        timeAllocation: 60,
        collapsed: false,
        notes: '',
        subPoints: [
          {
            id: 'inh-a',
            type: 'subpoint',
            title: 'Current System Fails',
            timeAllocation: 30,
            notes: '',
            evidence: [
              { id: 'inh-ev1', tag: 'Status quo inadequate', source: '', notes: '' }
            ]
          },
          {
            id: 'inh-b',
            type: 'subpoint',
            title: 'No Change Coming',
            timeAllocation: 30,
            notes: '',
            evidence: [
              { id: 'inh-ev2', tag: 'No political will', source: '', notes: '' }
            ]
          }
        ]
      },
      {
        id: 'plan',
        type: 'contention',
        title: 'Plan Text',
        timeAllocation: 30,
        collapsed: false,
        notes: 'Read slowly and clearly',
        subPoints: []
      },
      {
        id: 'solvency',
        type: 'contention',
        title: 'Solvency',
        timeAllocation: 120,
        collapsed: false,
        notes: '',
        subPoints: [
          {
            id: 'solv-a',
            type: 'subpoint',
            title: 'Plan Solves the Problem',
            timeAllocation: 60,
            notes: '',
            evidence: [
              { id: 'solv-ev1', tag: 'Expert analysis', source: '', notes: '' },
              { id: 'solv-ev2', tag: 'Historical precedent', source: '', notes: '' }
            ]
          },
          {
            id: 'solv-b',
            type: 'subpoint',
            title: 'Implementation Feasible',
            timeAllocation: 60,
            notes: '',
            evidence: [
              { id: 'solv-ev3', tag: 'Resources available', source: '', notes: '' }
            ]
          }
        ]
      },
      {
        id: 'adv1',
        type: 'contention',
        title: 'Advantage 1: [Title]',
        timeAllocation: 135,
        collapsed: false,
        notes: '',
        subPoints: [
          {
            id: 'adv1-a',
            type: 'subpoint',
            title: 'Link',
            timeAllocation: 45,
            notes: '',
            evidence: [
              { id: 'adv1-ev1', tag: 'Problem exists', source: '', notes: '' }
            ]
          },
          {
            id: 'adv1-b',
            type: 'subpoint',
            title: 'Internal Link',
            timeAllocation: 30,
            notes: '',
            evidence: [
              { id: 'adv1-ev2', tag: 'Escalation scenario', source: '', notes: '' }
            ]
          },
          {
            id: 'adv1-c',
            type: 'subpoint',
            title: 'Impact',
            timeAllocation: 60,
            notes: '',
            evidence: [
              { id: 'adv1-ev3', tag: 'Magnitude/scope', source: '', notes: '' },
              { id: 'adv1-ev4', tag: 'Timeframe', source: '', notes: '' }
            ]
          }
        ]
      },
      {
        id: 'adv2',
        type: 'contention',
        title: 'Advantage 2: [Title]',
        timeAllocation: 135,
        collapsed: false,
        notes: '',
        subPoints: [
          {
            id: 'adv2-a',
            type: 'subpoint',
            title: 'Link',
            timeAllocation: 45,
            notes: '',
            evidence: []
          },
          {
            id: 'adv2-b',
            type: 'subpoint',
            title: 'Internal Link',
            timeAllocation: 30,
            notes: '',
            evidence: []
          },
          {
            id: 'adv2-c',
            type: 'subpoint',
            title: 'Impact',
            timeAllocation: 60,
            notes: '',
            evidence: []
          }
        ]
      }
    ]
  },
  ld_aff: {
    name: 'LD Affirmative Case',
    format: 'Lincoln Douglas',
    totalTime: 360, // 6 minutes
    sections: [
      {
        id: 'intro',
        type: 'contention',
        title: 'Introduction',
        timeAllocation: 30,
        collapsed: false,
        notes: 'Hook the judge',
        subPoints: []
      },
      {
        id: 'resolution',
        type: 'contention',
        title: 'Resolution & Definitions',
        timeAllocation: 30,
        collapsed: false,
        notes: '',
        subPoints: [
          {
            id: 'def-a',
            type: 'subpoint',
            title: 'Key Terms',
            timeAllocation: 15,
            notes: '',
            evidence: []
          },
          {
            id: 'def-b',
            type: 'subpoint',
            title: 'Framework/Standard',
            timeAllocation: 15,
            notes: '',
            evidence: []
          }
        ]
      },
      {
        id: 'value',
        type: 'contention',
        title: 'Value Premise',
        timeAllocation: 45,
        collapsed: false,
        notes: '',
        subPoints: [
          {
            id: 'val-a',
            type: 'subpoint',
            title: 'Value Statement',
            timeAllocation: 20,
            notes: '',
            evidence: []
          },
          {
            id: 'val-b',
            type: 'subpoint',
            title: 'Value Justification',
            timeAllocation: 25,
            notes: '',
            evidence: []
          }
        ]
      },
      {
        id: 'criterion',
        type: 'contention',
        title: 'Value Criterion',
        timeAllocation: 45,
        collapsed: false,
        notes: '',
        subPoints: [
          {
            id: 'crit-a',
            type: 'subpoint',
            title: 'Criterion Statement',
            timeAllocation: 15,
            notes: '',
            evidence: []
          },
          {
            id: 'crit-b',
            type: 'subpoint',
            title: 'Link to Value',
            timeAllocation: 30,
            notes: '',
            evidence: []
          }
        ]
      },
      {
        id: 'cont1',
        type: 'contention',
        title: 'Contention 1',
        timeAllocation: 90,
        collapsed: false,
        notes: '',
        subPoints: [
          {
            id: 'c1-a',
            type: 'subpoint',
            title: 'Claim',
            timeAllocation: 30,
            notes: '',
            evidence: []
          },
          {
            id: 'c1-b',
            type: 'subpoint',
            title: 'Warrant',
            timeAllocation: 30,
            notes: '',
            evidence: []
          },
          {
            id: 'c1-c',
            type: 'subpoint',
            title: 'Impact to Criterion',
            timeAllocation: 30,
            notes: '',
            evidence: []
          }
        ]
      },
      {
        id: 'cont2',
        type: 'contention',
        title: 'Contention 2',
        timeAllocation: 90,
        collapsed: false,
        notes: '',
        subPoints: [
          {
            id: 'c2-a',
            type: 'subpoint',
            title: 'Claim',
            timeAllocation: 30,
            notes: '',
            evidence: []
          },
          {
            id: 'c2-b',
            type: 'subpoint',
            title: 'Warrant',
            timeAllocation: 30,
            notes: '',
            evidence: []
          },
          {
            id: 'c2-c',
            type: 'subpoint',
            title: 'Impact to Criterion',
            timeAllocation: 30,
            notes: '',
            evidence: []
          }
        ]
      },
      {
        id: 'conclusion',
        type: 'contention',
        title: 'Conclusion',
        timeAllocation: 30,
        collapsed: false,
        notes: 'Restate value and criterion',
        subPoints: []
      }
    ]
  },
  pf_case: {
    name: 'Public Forum Case',
    format: 'Public Forum',
    totalTime: 240, // 4 minutes
    sections: [
      {
        id: 'intro',
        type: 'contention',
        title: 'Introduction/Hook',
        timeAllocation: 20,
        collapsed: false,
        notes: 'Grab attention, state resolution stance',
        subPoints: []
      },
      {
        id: 'framework',
        type: 'contention',
        title: 'Framework (Optional)',
        timeAllocation: 20,
        collapsed: false,
        notes: '',
        subPoints: []
      },
      {
        id: 'cont1',
        type: 'contention',
        title: 'Contention 1',
        timeAllocation: 90,
        collapsed: false,
        notes: '',
        subPoints: [
          {
            id: 'pf-c1-claim',
            type: 'subpoint',
            title: 'Claim/Tagline',
            timeAllocation: 10,
            notes: '',
            evidence: []
          },
          {
            id: 'pf-c1-warrant',
            type: 'subpoint',
            title: 'Warrant/Analysis',
            timeAllocation: 40,
            notes: '',
            evidence: [
              { id: 'pf-c1-ev1', tag: 'Evidence 1', source: '', notes: '' },
              { id: 'pf-c1-ev2', tag: 'Evidence 2', source: '', notes: '' }
            ]
          },
          {
            id: 'pf-c1-impact',
            type: 'subpoint',
            title: 'Impact',
            timeAllocation: 40,
            notes: '',
            evidence: []
          }
        ]
      },
      {
        id: 'cont2',
        type: 'contention',
        title: 'Contention 2',
        timeAllocation: 90,
        collapsed: false,
        notes: '',
        subPoints: [
          {
            id: 'pf-c2-claim',
            type: 'subpoint',
            title: 'Claim/Tagline',
            timeAllocation: 10,
            notes: '',
            evidence: []
          },
          {
            id: 'pf-c2-warrant',
            type: 'subpoint',
            title: 'Warrant/Analysis',
            timeAllocation: 40,
            notes: '',
            evidence: []
          },
          {
            id: 'pf-c2-impact',
            type: 'subpoint',
            title: 'Impact',
            timeAllocation: 40,
            notes: '',
            evidence: []
          }
        ]
      },
      {
        id: 'conclusion',
        type: 'contention',
        title: 'Conclusion/Weighing',
        timeAllocation: 20,
        collapsed: false,
        notes: 'Summarize why your impacts outweigh',
        subPoints: []
      }
    ]
  },
  congress_speech: {
    name: 'Congress Speech',
    format: 'Congressional Debate',
    totalTime: 180, // 3 minutes
    sections: [
      {
        id: 'intro',
        type: 'contention',
        title: 'Introduction',
        timeAllocation: 20,
        collapsed: false,
        notes: 'Hook + thesis',
        subPoints: []
      },
      {
        id: 'point1',
        type: 'contention',
        title: 'Point 1',
        timeAllocation: 50,
        collapsed: false,
        notes: '',
        subPoints: [
          {
            id: 'cong-p1-claim',
            type: 'subpoint',
            title: 'Claim',
            timeAllocation: 10,
            notes: '',
            evidence: []
          },
          {
            id: 'cong-p1-evidence',
            type: 'subpoint',
            title: 'Evidence',
            timeAllocation: 25,
            notes: '',
            evidence: [
              { id: 'cong-ev1', tag: 'Statistic/Quote', source: '', notes: '' }
            ]
          },
          {
            id: 'cong-p1-analysis',
            type: 'subpoint',
            title: 'Analysis',
            timeAllocation: 15,
            notes: '',
            evidence: []
          }
        ]
      },
      {
        id: 'point2',
        type: 'contention',
        title: 'Point 2',
        timeAllocation: 50,
        collapsed: false,
        notes: '',
        subPoints: [
          {
            id: 'cong-p2-claim',
            type: 'subpoint',
            title: 'Claim',
            timeAllocation: 10,
            notes: '',
            evidence: []
          },
          {
            id: 'cong-p2-evidence',
            type: 'subpoint',
            title: 'Evidence',
            timeAllocation: 25,
            notes: '',
            evidence: []
          },
          {
            id: 'cong-p2-analysis',
            type: 'subpoint',
            title: 'Analysis',
            timeAllocation: 15,
            notes: '',
            evidence: []
          }
        ]
      },
      {
        id: 'point3',
        type: 'contention',
        title: 'Point 3 (Optional)',
        timeAllocation: 40,
        collapsed: false,
        notes: '',
        subPoints: []
      },
      {
        id: 'conclusion',
        type: 'contention',
        title: 'Conclusion',
        timeAllocation: 20,
        collapsed: false,
        notes: 'Call to action - urge passage/defeat',
        subPoints: []
      }
    ]
  },
  blank: {
    name: 'Blank Outline',
    format: 'Custom',
    totalTime: 300,
    sections: []
  }
};

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Format time display
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Evidence Tag Component
const EvidenceTag = ({ evidence, onChange, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 space-y-2"
    >
      <div className="flex items-start gap-2">
        <Tag className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={evidence.tag}
            onChange={(e) => onChange({ ...evidence, tag: e.target.value })}
            placeholder="Evidence tag..."
            className="w-full bg-transparent text-white text-sm font-medium focus:outline-none"
          />
        </div>
        <button
          onClick={onDelete}
          className="p-1 text-slate-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      
      <input
        type="text"
        value={evidence.source}
        onChange={(e) => onChange({ ...evidence, source: e.target.value })}
        placeholder="Source (Author, Year)..."
        className="w-full bg-slate-800/50 text-slate-300 text-xs px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
      />
      
      {isEditing ? (
        <textarea
          value={evidence.notes}
          onChange={(e) => onChange({ ...evidence, notes: e.target.value })}
          onBlur={() => setIsEditing(false)}
          placeholder="Notes about this evidence..."
          className="w-full bg-slate-800/50 text-slate-400 text-xs px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500/50 min-h-[60px]"
          autoFocus
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="text-xs text-slate-500 cursor-pointer hover:text-slate-400"
        >
          {evidence.notes || '+ Add notes...'}
        </div>
      )}
    </div>
  );
};

// Sub-Point Component
const SubPoint = ({ subPoint, onChange, onDelete, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const addEvidence = () => {
    const newEvidence = {
      id: generateId(),
      tag: '',
      source: '',
      notes: ''
    };
    onChange({
      ...subPoint,
      evidence: [...subPoint.evidence, newEvidence]
    });
  };

  const updateEvidence = (evidenceId, updated) => {
    onChange({
      ...subPoint,
      evidence: subPoint.evidence.map(e => e.id === evidenceId ? updated : e)
    });
  };

  const deleteEvidence = (evidenceId) => {
    onChange({
      ...subPoint,
      evidence: subPoint.evidence.filter(e => e.id !== evidenceId)
    });
  };

  return (
    <div
      className="ml-6 border-l-2 border-slate-600 pl-4"
    >
      <div className="bg-slate-800/30 rounded-lg p-3 space-y-3">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <span className="text-cyan-400 text-sm font-medium">
            {String.fromCharCode(65 + index)}.
          </span>
          <input
            type="text"
            value={subPoint.title}
            onChange={(e) => onChange({ ...subPoint, title: e.target.value })}
            placeholder="Sub-point title..."
            className="flex-1 bg-transparent text-white font-medium focus:outline-none"
          />
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            <input
              type="number"
              value={subPoint.timeAllocation}
              onChange={(e) => onChange({ ...subPoint, timeAllocation: parseInt(e.target.value) || 0 })}
              className="w-12 bg-slate-700/50 text-center rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
            <span>sec</span>
          </div>
          <button
            onClick={onDelete}
            className="p-1 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <div
              className="space-y-3"
            >
              {/* Notes */}
              <textarea
                value={subPoint.notes}
                onChange={(e) => onChange({ ...subPoint, notes: e.target.value })}
                placeholder="Notes for this sub-point..."
                className="w-full bg-slate-700/30 text-slate-300 text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500/50 min-h-[60px]"
              />

              {/* Evidence Tags */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Evidence</span>
                  <button
                    onClick={addEvidence}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Evidence
                  </button>
                </div>
                <AnimatePresence>
                  {subPoint.evidence.map((ev) => (
                    <EvidenceTag
                      key={ev.id}
                      evidence={ev}
                      onChange={(updated) => updateEvidence(ev.id, updated)}
                      onDelete={() => deleteEvidence(ev.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Contention Component
const Contention = ({ contention, onChange, onDelete, index }) => {
  const [isCollapsed, setIsCollapsed] = useState(contention.collapsed);

  const totalSubPointTime = contention.subPoints.reduce((acc, sp) => acc + sp.timeAllocation, 0);
  const timeStatus = totalSubPointTime > contention.timeAllocation ? 'over' : 
                     totalSubPointTime < contention.timeAllocation * 0.8 ? 'under' : 'good';

  const addSubPoint = () => {
    const newSubPoint = {
      id: generateId(),
      type: 'subpoint',
      title: '',
      timeAllocation: 30,
      notes: '',
      evidence: []
    };
    onChange({
      ...contention,
      subPoints: [...contention.subPoints, newSubPoint]
    });
  };

  const updateSubPoint = (subPointId, updated) => {
    onChange({
      ...contention,
      subPoints: contention.subPoints.map(sp => sp.id === subPointId ? updated : sp)
    });
  };

  const deleteSubPoint = (subPointId) => {
    onChange({
      ...contention,
      subPoints: contention.subPoints.filter(sp => sp.id !== subPointId)
    });
  };

  const reorderSubPoints = (newOrder) => {
    onChange({
      ...contention,
      subPoints: newOrder
    });
  };

  return (
    <div
      className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
    >
      {/* Contention Header */}
      <div className="p-4 bg-slate-800/80">
        <div className="flex items-center gap-3">
          <GripVertical className="w-5 h-5 text-slate-500 cursor-grab" />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <span className="text-purple-400 font-bold text-lg">
            {index + 1}.
          </span>
          <input
            type="text"
            value={contention.title}
            onChange={(e) => onChange({ ...contention, title: e.target.value })}
            placeholder="Contention title..."
            className="flex-1 bg-transparent text-white text-lg font-semibold focus:outline-none"
          />
          
          {/* Time Allocation */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
            timeStatus === 'over' ? 'bg-red-500/20 text-red-400' :
            timeStatus === 'under' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            <Clock className="w-4 h-4" />
            <input
              type="number"
              value={contention.timeAllocation}
              onChange={(e) => onChange({ ...contention, timeAllocation: parseInt(e.target.value) || 0 })}
              className="w-14 bg-transparent text-center font-medium focus:outline-none"
            />
            <span className="text-sm">sec</span>
            {timeStatus === 'over' && <AlertCircle className="w-4 h-4" />}
            {timeStatus === 'good' && <CheckCircle className="w-4 h-4" />}
          </div>
          
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Time breakdown */}
        {contention.subPoints.length > 0 && (
          <div className="mt-2 ml-12 text-xs text-slate-500">
            Sub-points total: {formatTime(totalSubPointTime)} / {formatTime(contention.timeAllocation)} allocated
          </div>
        )}
      </div>

      {/* Contention Body */}
      <AnimatePresence>
        {!isCollapsed && (
          <div
            className="p-4 space-y-4"
          >
            {/* Notes */}
            <div className="flex items-start gap-2">
              <StickyNote className="w-4 h-4 text-slate-400 mt-2" />
              <textarea
                value={contention.notes}
                onChange={(e) => onChange({ ...contention, notes: e.target.value })}
                placeholder="Notes for this contention..."
                className="flex-1 bg-slate-700/30 text-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500/50 min-h-[60px]"
              />
            </div>

            {/* Sub-Points */}
            <div className="space-y-3">
              <Reorder.Group
                axis="y"
                values={contention.subPoints}
                onReorder={reorderSubPoints}
                className="space-y-3"
              >
                {contention.subPoints.map((sp, idx) => (
                  <Reorder.Item key={sp.id} value={sp}>
                    <SubPoint
                      subPoint={sp}
                      onChange={(updated) => updateSubPoint(sp.id, updated)}
                      onDelete={() => deleteSubPoint(sp.id)}
                      index={idx}
                    />
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              <button
                onClick={addSubPoint}
                className="ml-6 flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Sub-Point
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Component
const SpeechOutlineBuilder = () => {
  const [outline, setOutline] = useState({
    id: generateId(),
    name: 'Untitled Outline',
    format: 'Custom',
    totalTime: 300,
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const [savedOutlines, setSavedOutlines] = useState([]);
  const [showTemplates, setShowTemplates] = useState(true);
  const [showSavedOutlines, setShowSavedOutlines] = useState(false);

  // Calculate totals
  const totalAllocatedTime = outline.sections.reduce((acc, section) => acc + section.timeAllocation, 0);
  const totalEvidenceCount = outline.sections.reduce((acc, section) => 
    acc + section.subPoints.reduce((subAcc, sp) => subAcc + sp.evidence.length, 0), 0);
  const timeStatus = totalAllocatedTime > outline.totalTime ? 'over' : 
                     totalAllocatedTime < outline.totalTime * 0.9 ? 'under' : 'good';

  // Load template
  const loadTemplate = (templateKey) => {
    const template = OUTLINE_TEMPLATES[templateKey];
    setOutline({
      ...template,
      id: generateId(),
      name: template.name,
      sections: template.sections.map(s => ({
        ...s,
        id: generateId(),
        subPoints: s.subPoints.map(sp => ({
          ...sp,
          id: generateId(),
          evidence: sp.evidence.map(e => ({ ...e, id: generateId() }))
        }))
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setShowTemplates(false);
  };

  // Add new contention
  const addContention = () => {
    const newContention = {
      id: generateId(),
      type: 'contention',
      title: '',
      timeAllocation: 60,
      collapsed: false,
      notes: '',
      subPoints: []
    };
    setOutline(prev => ({
      ...prev,
      sections: [...prev.sections, newContention],
      updatedAt: new Date().toISOString()
    }));
  };

  // Update contention
  const updateContention = (contentionId, updated) => {
    setOutline(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === contentionId ? updated : s),
      updatedAt: new Date().toISOString()
    }));
  };

  // Delete contention
  const deleteContention = (contentionId) => {
    setOutline(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== contentionId),
      updatedAt: new Date().toISOString()
    }));
  };

  // Reorder contentions
  const reorderContentions = (newOrder) => {
    setOutline(prev => ({
      ...prev,
      sections: newOrder,
      updatedAt: new Date().toISOString()
    }));
  };

  // Save outline
  const saveOutline = () => {
    const updated = { ...outline, updatedAt: new Date().toISOString() };
    setSavedOutlines(prev => {
      const existing = prev.findIndex(o => o.id === outline.id);
      if (existing >= 0) {
        const newOutlines = [...prev];
        newOutlines[existing] = updated;
        return newOutlines;
      }
      return [...prev, updated];
    });
    setOutline(updated);
  };

  // Load saved outline
  const loadSavedOutline = (savedOutline) => {
    setOutline(savedOutline);
    setShowSavedOutlines(false);
  };

  // Export functions
  const exportToJSON = () => {
    const dataStr = JSON.stringify(outline, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${outline.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToMarkdown = () => {
    let md = `# ${outline.name}\n\n`;
    md += `**Format:** ${outline.format}  \n`;
    md += `**Total Time:** ${formatTime(outline.totalTime)}\n\n`;
    md += `---\n\n`;

    outline.sections.forEach((section, idx) => {
      md += `## ${idx + 1}. ${section.title || 'Untitled'} (${formatTime(section.timeAllocation)})\n\n`;
      
      if (section.notes) {
        md += `*${section.notes}*\n\n`;
      }

      section.subPoints.forEach((sp, spIdx) => {
        md += `### ${String.fromCharCode(65 + spIdx)}. ${sp.title || 'Untitled'} (${formatTime(sp.timeAllocation)})\n\n`;
        
        if (sp.notes) {
          md += `${sp.notes}\n\n`;
        }

        sp.evidence.forEach((ev) => {
          md += `- **[${ev.tag || 'Evidence'}]** ${ev.source || ''}\n`;
          if (ev.notes) {
            md += `  - ${ev.notes}\n`;
          }
        });

        if (sp.evidence.length > 0) md += '\n';
      });

      md += '\n';
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${outline.name.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToHTML = () => {
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${outline.name}</title>
  <style>
    body { font-family: 'Georgia', serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { color: #1a1a2e; border-bottom: 2px solid #4a4a8a; padding-bottom: 10px; }
    h2 { color: #4a4a8a; margin-top: 30px; }
    h3 { color: #6a6aaa; margin-left: 20px; }
    .meta { color: #666; font-style: italic; margin-bottom: 20px; }
    .time { color: #888; font-size: 0.9em; }
    .notes { background: #f5f5f5; padding: 10px; border-left: 3px solid #4a4a8a; margin: 10px 0; }
    .evidence { margin-left: 40px; padding: 10px; background: #fafafa; border-radius: 5px; margin-bottom: 10px; }
    .evidence-tag { font-weight: bold; color: #4a4a8a; }
    .evidence-source { color: #666; font-style: italic; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <h1>${outline.name}</h1>
  <div class="meta">
    <strong>Format:</strong> ${outline.format} | 
    <strong>Total Time:</strong> ${formatTime(outline.totalTime)}
  </div>
`;

    outline.sections.forEach((section, idx) => {
      html += `  <h2>${idx + 1}. ${section.title || 'Untitled'} <span class="time">(${formatTime(section.timeAllocation)})</span></h2>\n`;
      
      if (section.notes) {
        html += `  <div class="notes">${section.notes}</div>\n`;
      }

      section.subPoints.forEach((sp, spIdx) => {
        html += `  <h3>${String.fromCharCode(65 + spIdx)}. ${sp.title || 'Untitled'} <span class="time">(${formatTime(sp.timeAllocation)})</span></h3>\n`;
        
        if (sp.notes) {
          html += `  <p>${sp.notes}</p>\n`;
        }

        sp.evidence.forEach((ev) => {
          html += `  <div class="evidence">
    <span class="evidence-tag">[${ev.tag || 'Evidence'}]</span>
    <span class="evidence-source">${ev.source || ''}</span>
    ${ev.notes ? `<p>${ev.notes}</p>` : ''}
  </div>\n`;
        });
      });
    });

    html += `</body>\n</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${outline.name.replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const importOutline = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result);
        setOutline({
          ...imported,
          id: generateId(),
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error('Failed to import outline:', err);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Auto-suggest time allocation
  const suggestTimeAllocation = () => {
    if (outline.sections.length === 0) return;

    const timePerSection = Math.floor(outline.totalTime / outline.sections.length);
    
    setOutline(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        const subPointCount = section.subPoints.length || 1;
        const timePerSubPoint = Math.floor(section.timeAllocation / subPointCount);
        
        return {
          ...section,
          timeAllocation: timePerSection,
          subPoints: section.subPoints.map(sp => ({
            ...sp,
            timeAllocation: timePerSubPoint
          }))
        };
      }),
      updatedAt: new Date().toISOString()
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            Speech Outline Builder
          </h1>
          <p className="text-slate-400 mt-1">
            Create structured speech outlines with drag-and-drop organization
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Layout className="w-4 h-4" />
            Templates
          </button>
          <button
            onClick={() => setShowSavedOutlines(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Saved
          </button>
        </div>
      </div>

      {/* Template Selector Modal */}
      <AnimatePresence>
        {showTemplates && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTemplates(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-white mb-4">Choose a Template</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(OUTLINE_TEMPLATES).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => loadTemplate(key)}
                    className="p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-purple-500 rounded-xl text-left transition-all"
                  >
                    <div className="font-semibold text-white">{template.name}</div>
                    <div className="text-sm text-slate-400 mt-1">{template.format}</div>
                    <div className="text-xs text-slate-500 mt-2">
                      {formatTime(template.totalTime)} • {template.sections.length} sections
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Saved Outlines Modal */}
      <AnimatePresence>
        {showSavedOutlines && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSavedOutlines(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-white mb-4">Saved Outlines</h2>
              {savedOutlines.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No saved outlines yet</p>
              ) : (
                <div className="space-y-2">
                  {savedOutlines.map((saved) => (
                    <button
                      key={saved.id}
                      onClick={() => loadSavedOutline(saved)}
                      className="w-full p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-left transition-colors"
                    >
                      <div className="font-medium text-white">{saved.name}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {saved.format} • Updated {new Date(saved.updatedAt).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Outline Metadata */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-400 mb-1">Outline Name</label>
            <input
              type="text"
              value={outline.name}
              onChange={(e) => setOutline(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Format</label>
            <select
              value={outline.format}
              onChange={(e) => setOutline(prev => ({ ...prev, format: e.target.value }))}
              className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="Custom">Custom</option>
              <option value="Policy">Policy</option>
              <option value="Lincoln Douglas">Lincoln Douglas</option>
              <option value="Public Forum">Public Forum</option>
              <option value="Congressional Debate">Congressional Debate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Total Time (seconds)</label>
            <input
              type="number"
              value={outline.totalTime}
              onChange={(e) => setOutline(prev => ({ ...prev, totalTime: parseInt(e.target.value) || 0 }))}
              className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-700">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
            timeStatus === 'over' ? 'bg-red-500/20 text-red-400' :
            timeStatus === 'under' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span className="font-medium">{formatTime(totalAllocatedTime)}</span>
            <span className="text-sm opacity-75">/ {formatTime(outline.totalTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Layers className="w-4 h-4" />
            <span>{outline.sections.length} contentions</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <BookOpen className="w-4 h-4" />
            <span>{totalEvidenceCount} evidence cards</span>
          </div>
          <button
            onClick={suggestTimeAllocation}
            className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors ml-auto"
          >
            <Wand2 className="w-4 h-4" />
            Auto-allocate time
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={addContention}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Contention
        </button>
        <button
          onClick={saveOutline}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <div className="h-6 w-px bg-slate-700" />
        <button
          onClick={exportToMarkdown}
          className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm"
        >
          <FileDown className="w-4 h-4" />
          Markdown
        </button>
        <button
          onClick={exportToHTML}
          className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm"
        >
          <Printer className="w-4 h-4" />
          HTML
        </button>
        <button
          onClick={exportToJSON}
          className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          JSON
        </button>
        <label className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm cursor-pointer">
          <Upload className="w-4 h-4" />
          Import
          <input
            type="file"
            accept=".json"
            onChange={importOutline}
            className="hidden"
          />
        </label>
        <button
          onClick={() => loadTemplate('blank')}
          className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm ml-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Contentions List */}
      <div className="space-y-4">
        {outline.sections.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400">No contentions yet</h3>
            <p className="text-slate-500 mt-1">Start by choosing a template or adding your first contention</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setShowTemplates(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
              >
                Choose Template
              </button>
              <button
                onClick={addContention}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Start from Scratch
              </button>
            </div>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={outline.sections}
            onReorder={reorderContentions}
            className="space-y-4"
          >
            {outline.sections.map((section, idx) => (
              <Reorder.Item key={section.id} value={section}>
                <Contention
                  contention={section}
                  onChange={(updated) => updateContention(section.id, updated)}
                  onDelete={() => deleteContention(section.id)}
                  index={idx}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
};

export default SpeechOutlineBuilder;
