/**
 * JudgeBallotGenerator - Standardized Ballot Forms
 * Rubric scoring, speaker points, RFD, signature, PDF export
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Printer,
  Save,
  FolderOpen,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Trophy,
  Star,
  User,
  Users,
  Clock,
  Calendar,
  MapPin,
  Hash,
  ChevronDown,
  ChevronRight,
  Copy,
  RotateCcw,
  Eye,
  Gavel,
  Award,
  MessageSquare,
  PenTool,
  Scale,
  Target,
  Mic,
  Brain,
  Sparkles,
  AlertCircle,
  Info
} from 'lucide-react';

// Debate formats with specific rubric categories
const DEBATE_FORMATS = {
  pf: {
    name: 'Public Forum',
    teams: 2,
    speakersPerTeam: 2,
    maxSpeakerPoints: 30,
    minSpeakerPoints: 20,
    rubricCategories: [
      { id: 'argumentation', label: 'Argumentation & Analysis', weight: 30, description: 'Quality of arguments, logical reasoning, clash' },
      { id: 'evidence', label: 'Use of Evidence', weight: 20, description: 'Quality, relevance, and explanation of sources' },
      { id: 'refutation', label: 'Refutation & Defense', weight: 20, description: 'Responses to opponent arguments, defense of own case' },
      { id: 'delivery', label: 'Delivery & Presentation', weight: 15, description: 'Speaking skills, clarity, eye contact, pace' },
      { id: 'crossfire', label: 'Crossfire Performance', weight: 15, description: 'Questions, answers, engagement in crossfire' }
    ]
  },
  ld: {
    name: 'Lincoln Douglas',
    teams: 2,
    speakersPerTeam: 1,
    maxSpeakerPoints: 30,
    minSpeakerPoints: 20,
    rubricCategories: [
      { id: 'framework', label: 'Value/Criterion Framework', weight: 25, description: 'Quality and defense of philosophical framework' },
      { id: 'argumentation', label: 'Argumentation', weight: 25, description: 'Quality of contentions and logical analysis' },
      { id: 'clash', label: 'Clash & Refutation', weight: 20, description: 'Engagement with opponent, responses, weighing' },
      { id: 'crystallization', label: 'Crystallization', weight: 15, description: 'Summary and focus on key issues' },
      { id: 'delivery', label: 'Delivery', weight: 15, description: 'Speaking skills, persuasion, presence' }
    ]
  },
  policy: {
    name: 'Policy/CX',
    teams: 2,
    speakersPerTeam: 2,
    maxSpeakerPoints: 30,
    minSpeakerPoints: 20,
    rubricCategories: [
      { id: 'case', label: 'Case Arguments', weight: 25, description: 'Quality of affirmative/negative case' },
      { id: 'evidence', label: 'Evidence Quality', weight: 20, description: 'Card quality, warrants, recency' },
      { id: 'strategy', label: 'Strategic Choices', weight: 20, description: 'Argument selection, time allocation, 2NR/2AR' },
      { id: 'cx', label: 'Cross-Examination', weight: 15, description: 'Question quality, answer quality, strategic use' },
      { id: 'delivery', label: 'Delivery & Clarity', weight: 20, description: 'Speed, clarity, organization, signposting' }
    ]
  },
  congress: {
    name: 'Congressional Debate',
    teams: 1,
    speakersPerTeam: 1,
    maxSpeakerPoints: 6,
    minSpeakerPoints: 1,
    rubricCategories: [
      { id: 'argumentation', label: 'Argumentation', weight: 30, description: 'Quality and originality of arguments' },
      { id: 'evidence', label: 'Evidence & Research', weight: 20, description: 'Use of statistics, examples, sources' },
      { id: 'refutation', label: 'Clash & Refutation', weight: 20, description: 'Engagement with previous speakers' },
      { id: 'delivery', label: 'Delivery', weight: 20, description: 'Speaking skills, presence, persuasion' },
      { id: 'procedure', label: 'Parliamentary Procedure', weight: 10, description: 'Knowledge and use of procedure' }
    ]
  },
  parli: {
    name: 'Parliamentary (NPDA)',
    teams: 2,
    speakersPerTeam: 2,
    maxSpeakerPoints: 30,
    minSpeakerPoints: 20,
    rubricCategories: [
      { id: 'case', label: 'Case Construction', weight: 25, description: 'Model/interpretation, argumentation' },
      { id: 'refutation', label: 'Refutation', weight: 25, description: 'Responses, turns, impact comparison' },
      { id: 'poi', label: 'Points of Information', weight: 15, description: 'POI quality and handling' },
      { id: 'strategy', label: 'Strategy & Weighing', weight: 20, description: 'Strategic choices, crystallization' },
      { id: 'delivery', label: 'Delivery', weight: 15, description: 'Speaking skills, wit, presence' }
    ]
  },
  bp: {
    name: 'British Parliamentary',
    teams: 4,
    speakersPerTeam: 2,
    maxSpeakerPoints: 100,
    minSpeakerPoints: 50,
    rubricCategories: [
      { id: 'content', label: 'Content & Analysis', weight: 30, description: 'Depth of argumentation, examples, logical reasoning' },
      { id: 'strategy', label: 'Strategy & Role Fulfilment', weight: 25, description: 'Meeting role requirements, extensions for closing teams' },
      { id: 'engagement', label: 'Engagement & Rebuttal', weight: 20, description: 'Responses to other teams, clash with opposition' },
      { id: 'poi', label: 'POI Handling', weight: 10, description: 'Quality of POIs offered and accepted' },
      { id: 'delivery', label: 'Style & Delivery', weight: 15, description: 'Persuasion, clarity, structure, presence' }
    ]
  },
  wsdc: {
    name: 'World Schools',
    teams: 2,
    speakersPerTeam: 3,
    maxSpeakerPoints: 100,
    minSpeakerPoints: 60,
    rubricCategories: [
      { id: 'content', label: 'Content', weight: 40, description: 'Logic, argumentation, use of examples, case construction' },
      { id: 'style', label: 'Style', weight: 40, description: 'Persuasion, language, vocal variety, presence, eye contact' },
      { id: 'strategy', label: 'Strategy', weight: 20, description: 'Structure, time management, responsiveness, prioritization' }
    ]
  },
  ipda: {
    name: 'IPDA',
    teams: 2,
    speakersPerTeam: 1,
    maxSpeakerPoints: 30,
    minSpeakerPoints: 20,
    rubricCategories: [
      { id: 'argumentation', label: 'Argumentation', weight: 30, description: 'Quality of arguments, logical reasoning' },
      { id: 'clash', label: 'Clash & Refutation', weight: 25, description: 'Engagement with opponent arguments' },
      { id: 'communication', label: 'Communication', weight: 25, description: 'Clarity, accessibility, persuasion for lay judges' },
      { id: 'organization', label: 'Organization & Structure', weight: 20, description: 'Clear structure, signposting, time management' }
    ]
  },
  apda: {
    name: 'APDA',
    teams: 2,
    speakersPerTeam: 2,
    maxSpeakerPoints: 30,
    minSpeakerPoints: 20,
    rubricCategories: [
      { id: 'case', label: 'Case Quality', weight: 25, description: 'Case statement quality, interpretation, modeling' },
      { id: 'argumentation', label: 'Argumentation', weight: 25, description: 'Quality of arguments, logic, analysis' },
      { id: 'refutation', label: 'Refutation & Clash', weight: 20, description: 'Responses to opposition, engagement' },
      { id: 'poi', label: 'POI Performance', weight: 15, description: 'Quality of POIs given and received' },
      { id: 'delivery', label: 'Delivery & Style', weight: 15, description: 'Speaking skills, wit, rhetorical flourish' }
    ]
  }
};

// Speaker point guide
const SPEAKER_POINT_GUIDE = [
  { range: '29.5-30', label: 'Exceptional', description: 'Tournament-winning performance' },
  { range: '29-29.4', label: 'Excellent', description: 'Should be in late elimination rounds' },
  { range: '28.5-28.9', label: 'Very Good', description: 'Should break to elimination rounds' },
  { range: '28-28.4', label: 'Good', description: 'Solid varsity performance' },
  { range: '27.5-27.9', label: 'Above Average', description: 'Competent but room for improvement' },
  { range: '27-27.4', label: 'Average', description: 'Meets basic expectations' },
  { range: '26-26.9', label: 'Below Average', description: 'Significant areas for improvement' },
  { range: '25-25.9', label: 'Needs Work', description: 'Major issues in multiple areas' },
  { range: '20-24.9', label: 'Developmental', description: 'Novice or serious concerns' }
];

// Generate unique ID
const generateId = () => `ballot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Rubric Score Component
const RubricScore = ({ category, score, onChange, maxScore = 10 }) => {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = (pct) => {
    if (pct >= 90) return 'text-emerald-400';
    if (pct >= 80) return 'text-cyan-400';
    if (pct >= 70) return 'text-amber-400';
    if (pct >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-slate-700/30 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-white font-medium">{category.label}</h4>
          <p className="text-xs text-slate-400 mt-0.5">{category.description}</p>
        </div>
        <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded">
          Weight: {category.weight}%
        </span>
      </div>
      
      <div className="flex items-center gap-3 mt-3">
        <input
          type="range"
          min={0}
          max={maxScore}
          step={0.5}
          value={score}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <div className={`text-2xl font-bold w-16 text-right ${getScoreColor(percentage)}`}>
          {score.toFixed(1)}
        </div>
      </div>
      
      {/* Score indicators */}
      <div className="flex justify-between mt-1 text-xs text-slate-500">
        <span>0</span>
        <span>Poor</span>
        <span>Average</span>
        <span>Good</span>
        <span>Excellent</span>
        <span>{maxScore}</span>
      </div>
    </div>
  );
};

// Speaker Points Input Component
const SpeakerPointsInput = ({ speaker, points, onChange, format, showGuide = false }) => {
  const [showPointGuide, setShowPointGuide] = useState(showGuide);
  const { minSpeakerPoints, maxSpeakerPoints } = format;

  const getPointsColor = (pts) => {
    if (pts >= 29.5) return 'text-emerald-400';
    if (pts >= 29) return 'text-cyan-400';
    if (pts >= 28.5) return 'text-blue-400';
    if (pts >= 28) return 'text-purple-400';
    if (pts >= 27.5) return 'text-amber-400';
    if (pts >= 27) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-slate-700/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-white font-medium">{speaker.name || `Speaker ${speaker.position}`}</span>
          <span className="text-xs text-slate-500">({speaker.side})</span>
        </div>
        <button
          onClick={() => setShowPointGuide(!showPointGuide)}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <Info className="w-3 h-3" />
          Guide
        </button>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="number"
          min={minSpeakerPoints}
          max={maxSpeakerPoints}
          step={0.1}
          value={points}
          onChange={(e) => onChange(parseFloat(e.target.value) || minSpeakerPoints)}
          className={`w-24 bg-slate-800 border border-slate-600 text-center text-2xl font-bold px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${getPointsColor(points)}`}
        />
        <input
          type="range"
          min={minSpeakerPoints}
          max={maxSpeakerPoints}
          step={0.1}
          value={points}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>

      {/* Point Guide */}
      <AnimatePresence>
        {showPointGuide && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-3 gap-2 text-xs">
              {SPEAKER_POINT_GUIDE.map((guide) => (
                <div key={guide.range} className="text-center">
                  <div className="font-medium text-slate-300">{guide.range}</div>
                  <div className="text-slate-500">{guide.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Team Card Component
const TeamCard = ({ team, isWinner, onToggleWinner, onUpdateSpeaker, onUpdateRubric, format }) => {
  const [showRubric, setShowRubric] = useState(true);
  
  const totalRubricScore = Object.values(team.rubricScores || {}).reduce((sum, score) => sum + score, 0);
  const avgRubricScore = format.rubricCategories.length > 0 
    ? totalRubricScore / format.rubricCategories.length 
    : 0;

  return (
    <div className={`bg-slate-800/50 border rounded-xl overflow-hidden transition-all ${
      isWinner ? 'border-emerald-500/50 ring-2 ring-emerald-500/20' : 'border-slate-700'
    }`}>
      {/* Team Header */}
      <div className={`p-4 border-b ${isWinner ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              team.side === 'Aff' || team.side === 'Pro' || team.side === 'Gov'
                ? 'bg-cyan-500/20 text-cyan-400' 
                : 'bg-orange-500/20 text-orange-400'
            }`}>
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <input
                type="text"
                value={team.name}
                onChange={(e) => onUpdateSpeaker(team.id, 'name', e.target.value)}
                placeholder="Team Name"
                className="bg-transparent text-white font-semibold text-lg focus:outline-none"
              />
              <div className="flex items-center gap-2 text-sm">
                <span className={`${
                  team.side === 'Aff' || team.side === 'Pro' || team.side === 'Gov'
                    ? 'text-cyan-400' : 'text-orange-400'
                }`}>
                  {team.side}
                </span>
                <span className="text-slate-500">•</span>
                <input
                  type="text"
                  value={team.school || ''}
                  onChange={(e) => onUpdateSpeaker(team.id, 'school', e.target.value)}
                  placeholder="School"
                  className="bg-transparent text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
          
          <button
            onClick={() => onToggleWinner(team.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isWinner 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
            }`}
          >
            <Trophy className={`w-4 h-4 ${isWinner ? 'fill-current' : ''}`} />
            {isWinner ? 'Winner' : 'Mark Winner'}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1 text-slate-400">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Avg Points:</span>
            <span className="text-white font-medium">
              {(team.speakers.reduce((sum, s) => sum + s.points, 0) / team.speakers.length).toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Rubric:</span>
            <span className="text-white font-medium">{avgRubricScore.toFixed(1)}/10</span>
          </div>
        </div>
      </div>

      {/* Speaker Points */}
      <div className="p-4 space-y-3">
        <h4 className="text-sm text-slate-400 uppercase tracking-wide flex items-center gap-2">
          <Mic className="w-4 h-4" />
          Speaker Points
        </h4>
        {team.speakers.map((speaker, idx) => (
          <SpeakerPointsInput
            key={speaker.id}
            speaker={speaker}
            points={speaker.points}
            onChange={(pts) => onUpdateSpeaker(team.id, `speaker_${idx}_points`, pts)}
            format={format}
          />
        ))}
      </div>

      {/* Rubric Scoring */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => setShowRubric(!showRubric)}
          className="flex items-center justify-between w-full text-sm text-slate-400 uppercase tracking-wide mb-3"
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Rubric Scoring
          </div>
          {showRubric ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {showRubric && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3"
            >
              {format.rubricCategories.map((category) => (
                <RubricScore
                  key={category.id}
                  category={category}
                  score={team.rubricScores?.[category.id] || 5}
                  onChange={(score) => onUpdateRubric(team.id, category.id, score)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// RFD (Reason for Decision) Component
const RFDSection = ({ rfd, onChange }) => {
  const [charCount, setCharCount] = useState(rfd.length);

  const handleChange = (e) => {
    const text = e.target.value;
    setCharCount(text.length);
    onChange(text);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          Reason for Decision (RFD)
        </h3>
        <span className="text-xs text-slate-500">{charCount} characters</span>
      </div>

      <textarea
        value={rfd}
        onChange={handleChange}
        placeholder="Explain your decision. What were the key voting issues? How did the teams compare on those issues? What feedback would help the debaters improve?

Consider addressing:
• The main arguments and how they were resolved
• Key moments that influenced your decision
• Specific feedback for each team
• What each side did well and areas for improvement"
        rows={8}
        className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
      />

      {/* Quick RFD Templates */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-xs text-slate-500">Quick add:</span>
        {[
          'Better weighing on impacts',
          'Clearer extensions in rebuttals',
          'More responsive to opponent arguments',
          'Stronger evidence comparison'
        ].map((template) => (
          <button
            key={template}
            onClick={() => onChange(rfd + (rfd ? '\n\n' : '') + template)}
            className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
          >
            + {template}
          </button>
        ))}
      </div>
    </div>
  );
};

// Judge Signature Component
const JudgeSignature = ({ signature, onChange }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    setLastPos({ x, y });
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      onChange({
        ...signature,
        image: canvas.toDataURL()
      });
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange({ ...signature, image: null });
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
        <PenTool className="w-5 h-5 text-cyan-400" />
        Judge Information & Signature
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Judge Name</label>
          <input
            type="text"
            value={signature.name || ''}
            onChange={(e) => onChange({ ...signature, name: e.target.value })}
            placeholder="Enter your name"
            className="w-full bg-slate-700/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Affiliation</label>
          <input
            type="text"
            value={signature.affiliation || ''}
            onChange={(e) => onChange({ ...signature, affiliation: e.target.value })}
            placeholder="School/Organization"
            className="w-full bg-slate-700/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-slate-400">Signature (draw below)</label>
          <button
            onClick={clearSignature}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        </div>
        <div className="relative bg-slate-900 border border-slate-600 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={400}
            height={100}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full cursor-crosshair touch-none"
            style={{ height: '100px' }}
          />
          {!signature.image && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-slate-600 text-sm">Sign here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Component
const JudgeBallotGenerator = () => {
  const [ballotFormat, setBallotFormat] = useState('pf');
  const [roundInfo, setRoundInfo] = useState({
    tournament: '',
    round: '',
    room: '',
    date: new Date().toISOString().split('T')[0],
    motion: ''
  });
  const [teams, setTeams] = useState([
    {
      id: 'team1',
      name: '',
      school: '',
      side: 'Pro',
      speakers: [
        { id: 'sp1', name: '', position: 1, side: 'Pro', points: 28.0 },
        { id: 'sp2', name: '', position: 2, side: 'Pro', points: 28.0 }
      ],
      rubricScores: {}
    },
    {
      id: 'team2',
      name: '',
      school: '',
      side: 'Con',
      speakers: [
        { id: 'sp3', name: '', position: 1, side: 'Con', points: 28.0 },
        { id: 'sp4', name: '', position: 2, side: 'Con', points: 28.0 }
      ],
      rubricScores: {}
    }
  ]);
  const [winnerId, setWinnerId] = useState(null);
  const [rfd, setRfd] = useState('');
  const [signature, setSignature] = useState({ name: '', affiliation: '', image: null });
  const [savedBallots, setSavedBallots] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const format = DEBATE_FORMATS[ballotFormat];

  // Update teams when format changes
  const handleFormatChange = (newFormat) => {
    setBallotFormat(newFormat);
    const fmt = DEBATE_FORMATS[newFormat];
    
    const sideNames = {
      pf: ['Pro', 'Con'],
      ld: ['Aff', 'Neg'],
      policy: ['Aff', 'Neg'],
      congress: ['Speaker'],
      parli: ['Gov', 'Opp']
    };

    const newTeams = [];
    for (let t = 0; t < fmt.teams; t++) {
      const speakers = [];
      for (let s = 0; s < fmt.speakersPerTeam; s++) {
        speakers.push({
          id: `sp_${t}_${s}`,
          name: '',
          position: s + 1,
          side: sideNames[newFormat][t],
          points: (fmt.maxSpeakerPoints + fmt.minSpeakerPoints) / 2
        });
      }
      newTeams.push({
        id: `team${t + 1}`,
        name: '',
        school: '',
        side: sideNames[newFormat][t],
        speakers,
        rubricScores: {}
      });
    }
    setTeams(newTeams);
    setWinnerId(null);
  };

  // Update speaker/team info
  const handleUpdateSpeaker = (teamId, field, value) => {
    setTeams(prev => prev.map(team => {
      if (team.id !== teamId) return team;
      
      if (field === 'name' || field === 'school') {
        return { ...team, [field]: value };
      }
      
      if (field.startsWith('speaker_')) {
        const [, idx, prop] = field.split('_');
        const newSpeakers = [...team.speakers];
        newSpeakers[parseInt(idx)] = {
          ...newSpeakers[parseInt(idx)],
          [prop]: value
        };
        return { ...team, speakers: newSpeakers };
      }
      
      return team;
    }));
  };

  // Update rubric scores
  const handleUpdateRubric = (teamId, categoryId, score) => {
    setTeams(prev => prev.map(team => {
      if (team.id !== teamId) return team;
      return {
        ...team,
        rubricScores: {
          ...team.rubricScores,
          [categoryId]: score
        }
      };
    }));
  };

  // Toggle winner
  const handleToggleWinner = (teamId) => {
    setWinnerId(winnerId === teamId ? null : teamId);
  };

  // Calculate weighted score
  const calculateWeightedScore = (team) => {
    let totalScore = 0;
    let totalWeight = 0;
    
    format.rubricCategories.forEach(cat => {
      const score = team.rubricScores?.[cat.id] || 5;
      totalScore += score * cat.weight;
      totalWeight += cat.weight;
    });
    
    return totalWeight > 0 ? (totalScore / totalWeight) : 0;
  };

  // Export to PDF (HTML print)
  const exportToPDF = () => {
    const winningTeam = teams.find(t => t.id === winnerId);
    const losingTeam = teams.find(t => t.id !== winnerId);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Debate Ballot - ${roundInfo.tournament || 'Tournament'}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #1a1a2e; }
    .header { text-align: center; border-bottom: 3px double #333; padding-bottom: 15px; margin-bottom: 20px; }
    .header h1 { font-size: 24px; margin-bottom: 5px; }
    .header .format { color: #666; font-style: italic; }
    .meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; }
    .meta-item { text-align: center; }
    .meta-item label { display: block; font-size: 10px; text-transform: uppercase; color: #666; }
    .meta-item span { font-weight: bold; }
    .motion { background: #e8e8e8; padding: 15px; border-radius: 5px; margin-bottom: 20px; font-style: italic; }
    .teams { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .team { border: 2px solid #ddd; border-radius: 8px; padding: 15px; }
    .team.winner { border-color: #22c55e; background: #f0fdf4; }
    .team-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #ddd; }
    .team-name { font-size: 18px; font-weight: bold; }
    .team-side { color: #666; }
    .winner-badge { background: #22c55e; color: white; padding: 3px 10px; border-radius: 20px; font-size: 12px; }
    .speakers { margin-bottom: 15px; }
    .speaker { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dotted #ddd; }
    .speaker-points { font-weight: bold; font-size: 18px; }
    .rubric { margin-top: 10px; }
    .rubric-item { display: flex; justify-content: space-between; padding: 3px 0; font-size: 12px; }
    .rubric-score { font-weight: bold; }
    .rfd { margin-bottom: 20px; padding: 15px; background: #fafafa; border-left: 4px solid #8b5cf6; }
    .rfd h3 { margin-bottom: 10px; color: #8b5cf6; }
    .rfd p { line-height: 1.6; white-space: pre-wrap; }
    .signature { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; padding-top: 20px; border-top: 2px solid #333; }
    .sig-box { text-align: center; }
    .sig-line { width: 200px; border-bottom: 1px solid #333; margin-bottom: 5px; min-height: 50px; }
    .sig-line img { max-height: 50px; }
    .sig-label { font-size: 12px; color: #666; }
    @media print { 
      body { padding: 10px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${roundInfo.tournament || 'Debate Tournament'}</h1>
    <div class="format">${format.name} Ballot</div>
  </div>

  <div class="meta">
    <div class="meta-item">
      <label>Round</label>
      <span>${roundInfo.round || '-'}</span>
    </div>
    <div class="meta-item">
      <label>Room</label>
      <span>${roundInfo.room || '-'}</span>
    </div>
    <div class="meta-item">
      <label>Date</label>
      <span>${roundInfo.date || '-'}</span>
    </div>
    <div class="meta-item">
      <label>Format</label>
      <span>${format.name}</span>
    </div>
  </div>

  ${roundInfo.motion ? `<div class="motion"><strong>Motion:</strong> ${roundInfo.motion}</div>` : ''}

  <div class="teams">
    ${teams.map(team => `
      <div class="team ${team.id === winnerId ? 'winner' : ''}">
        <div class="team-header">
          <div>
            <div class="team-name">${team.name || 'Team'}</div>
            <div class="team-side">${team.side} • ${team.school || 'School'}</div>
          </div>
          ${team.id === winnerId ? '<span class="winner-badge">WINNER</span>' : ''}
        </div>
        <div class="speakers">
          <strong>Speaker Points:</strong>
          ${team.speakers.map(s => `
            <div class="speaker">
              <span>${s.name || `Speaker ${s.position}`}</span>
              <span class="speaker-points">${s.points.toFixed(1)}</span>
            </div>
          `).join('')}
        </div>
        <div class="rubric">
          <strong>Rubric Scores:</strong>
          ${format.rubricCategories.map(cat => `
            <div class="rubric-item">
              <span>${cat.label}</span>
              <span class="rubric-score">${(team.rubricScores?.[cat.id] || 5).toFixed(1)}/10</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  </div>

  <div class="rfd">
    <h3>Reason for Decision</h3>
    <p>${rfd || 'No RFD provided.'}</p>
  </div>

  <div class="signature">
    <div class="sig-box">
      <div class="sig-line">
        ${signature.image ? `<img src="${signature.image}" alt="Signature" />` : ''}
      </div>
      <div class="sig-label">Judge Signature</div>
    </div>
    <div class="sig-box">
      <div class="sig-line" style="display: flex; align-items: flex-end; justify-content: center; padding-bottom: 5px;">
        ${signature.name || ''}
      </div>
      <div class="sig-label">Print Name</div>
    </div>
    <div class="sig-box">
      <div class="sig-line" style="display: flex; align-items: flex-end; justify-content: center; padding-bottom: 5px;">
        ${signature.affiliation || ''}
      </div>
      <div class="sig-label">Affiliation</div>
    </div>
  </div>
</body>
</html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  // Save ballot
  const saveBallot = () => {
    const ballot = {
      id: generateId(),
      format: ballotFormat,
      roundInfo,
      teams,
      winnerId,
      rfd,
      signature,
      createdAt: new Date().toISOString()
    };
    setSavedBallots(prev => [ballot, ...prev]);
  };

  // Reset ballot
  const resetBallot = () => {
    if (confirm('Are you sure you want to reset the ballot? All data will be lost.')) {
      handleFormatChange(ballotFormat);
      setRoundInfo({
        tournament: '',
        round: '',
        room: '',
        date: new Date().toISOString().split('T')[0],
        motion: ''
      });
      setRfd('');
      setSignature({ name: '', affiliation: '', image: null });
    }
  };

  // Validation
  const isComplete = winnerId && signature.name && rfd.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <Gavel className="w-6 h-6 text-white" />
            </div>
            Judge Ballot Generator
          </h1>
          <p className="text-slate-400 mt-1">
            Create standardized ballots with rubric scoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetBallot}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={saveBallot}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={exportToPDF}
            disabled={!isComplete}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isComplete
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Format Selection & Round Info */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-400 mb-1">Debate Format</label>
            <select
              value={ballotFormat}
              onChange={(e) => handleFormatChange(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              {Object.entries(DEBATE_FORMATS).map(([key, fmt]) => (
                <option key={key} value={key}>{fmt.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-400 mb-1">Tournament</label>
            <input
              type="text"
              value={roundInfo.tournament}
              onChange={(e) => setRoundInfo(prev => ({ ...prev, tournament: e.target.value }))}
              placeholder="Tournament name"
              className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Round</label>
            <input
              type="text"
              value={roundInfo.round}
              onChange={(e) => setRoundInfo(prev => ({ ...prev, round: e.target.value }))}
              placeholder="Round 1"
              className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Room</label>
            <input
              type="text"
              value={roundInfo.room}
              onChange={(e) => setRoundInfo(prev => ({ ...prev, room: e.target.value }))}
              placeholder="Room 101"
              className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Date</label>
            <input
              type="date"
              value={roundInfo.date}
              onChange={(e) => setRoundInfo(prev => ({ ...prev, date: e.target.value }))}
              className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm text-slate-400 mb-1">Motion/Resolution (Optional)</label>
            <input
              type="text"
              value={roundInfo.motion}
              onChange={(e) => setRoundInfo(prev => ({ ...prev, motion: e.target.value }))}
              placeholder="Resolved: ..."
              className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>
      </div>

      {/* Completion Status */}
      {!isComplete && (
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <div className="text-sm">
            <span className="text-amber-400 font-medium">Ballot incomplete:</span>
            <span className="text-slate-400 ml-2">
              {!winnerId && 'Select a winner • '}
              {!signature.name && 'Enter judge name • '}
              {rfd.length === 0 && 'Write an RFD'}
            </span>
          </div>
        </div>
      )}

      {/* Team Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            isWinner={winnerId === team.id}
            onToggleWinner={handleToggleWinner}
            onUpdateSpeaker={handleUpdateSpeaker}
            onUpdateRubric={handleUpdateRubric}
            format={format}
          />
        ))}
      </div>

      {/* RFD */}
      <RFDSection rfd={rfd} onChange={setRfd} />

      {/* Judge Signature */}
      <JudgeSignature signature={signature} onChange={setSignature} />

      {/* Score Summary */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-400" />
          Score Summary
        </h3>

        <div className="grid grid-cols-2 gap-6">
          {teams.map((team) => {
            const totalPoints = team.speakers.reduce((sum, s) => sum + s.points, 0);
            const avgPoints = totalPoints / team.speakers.length;
            const weightedScore = calculateWeightedScore(team);

            return (
              <div
                key={team.id}
                className={`p-4 rounded-lg border ${
                  winnerId === team.id
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-slate-700/30 border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-white">{team.name || 'Team'}</div>
                    <div className="text-sm text-slate-400">{team.side}</div>
                  </div>
                  {winnerId === team.id && (
                    <Trophy className="w-6 h-6 text-emerald-400 fill-current" />
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-amber-400">
                      {totalPoints.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-500">Total Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">
                      {avgPoints.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-500">Avg Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      {weightedScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-500">Rubric Score</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JudgeBallotGenerator;
