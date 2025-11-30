/**
 * Tournament Management
 * Calendar, round tracking, judge preferences, and bracket predictions
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Trophy,
  MapPin,
  Clock,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Edit3,
  Trash2,
  Star,
  Target,
  Medal,
  Flag,
  Plane,
  Hotel,
  AlertCircle,
  CheckCircle,
  Circle,
  RefreshCw,
  Save,
  X,
  Gavel,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Info
} from 'lucide-react';
import { useTournaments, useJudges } from '../../hooks/useDebateData';
import { useAuth } from '../../contexts/AuthContext';

// Empty State
const EmptyTournaments = ({ onAdd }) => (
  <div className="text-center py-16">
    <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6 mx-auto w-fit">
      <Trophy className="w-12 h-12 text-slate-500" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">No Tournaments Scheduled</h3>
    <p className="text-slate-400 max-w-md mx-auto mb-6">
      Add upcoming tournaments to track rounds, manage judge preferences, and stay organized.
    </p>
    <button
      onClick={onAdd}
      className="px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium hover:bg-cyan-500/20 transition-all inline-flex items-center gap-2"
    >
      <Plus className="w-5 h-5" />
      Add Tournament
    </button>
  </div>
);

// Add/Edit Tournament Modal
const TournamentModal = ({ isOpen, onClose, onSave, tournament = null }) => {
  const [formData, setFormData] = useState(tournament || {
    name: '',
    date: '',
    endDate: '',
    location: '',
    format: 'Public Forum',
    level: 'Local',
    registrationDeadline: '',
    notes: '',
    travelInfo: {
      flight: '',
      hotel: '',
      transportation: ''
    }
  });

  if (!isOpen) return null;

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
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">
            {tournament ? 'Edit Tournament' : 'Add Tournament'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Tournament Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Harvard National Forensics Tournament"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, State"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Registration Deadline</label>
              <input
                type="date"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Format</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 outline-none"
              >
                {['Public Forum', 'Lincoln-Douglas', 'Policy', 'Congress', 'World Schools', 'Multiple'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 outline-none"
              >
                {['Local', 'Regional', 'State', 'National', 'International'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Travel Info */}
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Travel Information (Optional)
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.travelInfo.flight}
                onChange={(e) => setFormData({
                  ...formData,
                  travelInfo: { ...formData.travelInfo, flight: e.target.value }
                })}
                placeholder="Flight details"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-cyan-500 outline-none"
              />
              <input
                type="text"
                value={formData.travelInfo.hotel}
                onChange={(e) => setFormData({
                  ...formData,
                  travelInfo: { ...formData.travelInfo, hotel: e.target.value }
                })}
                placeholder="Hotel/accommodation"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none resize-none"
            />
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
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors"
            >
              {tournament ? 'Update' : 'Add'} Tournament
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Tournament Card
const TournamentCard = ({ tournament, onEdit, onDelete, onClick }) => {
  const tournamentDate = new Date(tournament.date);
  const isUpcoming = tournamentDate > new Date();
  const daysUntil = Math.ceil((tournamentDate - new Date()) / (1000 * 60 * 60 * 24));
  
  const levelColors = {
    Local: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    Regional: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    State: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    National: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    International: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="p-5 rounded-2xl border border-slate-800/60 bg-slate-900/30 hover:border-slate-700/60 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col items-center justify-center">
            <span className="text-xs text-cyan-400 font-medium">
              {tournamentDate.toLocaleString('default', { month: 'short' }).toUpperCase()}
            </span>
            <span className="text-xl font-bold text-white">
              {tournamentDate.getDate()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
              {tournament.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
              <MapPin className="w-3 h-3" />
              {tournament.location || 'TBD'}
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${levelColors[tournament.level]}`}>
          {tournament.level}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-slate-400 flex items-center gap-1">
          <Trophy className="w-4 h-4" />
          {tournament.format}
        </span>
        {tournament.rounds?.length > 0 && (
          <span className="text-slate-400 flex items-center gap-1">
            <Target className="w-4 h-4" />
            {tournament.rounds.length} rounds
          </span>
        )}
      </div>

      {isUpcoming && daysUntil <= 14 && (
        <div className={`mt-4 px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
          daysUntil <= 3 
            ? 'bg-red-500/10 border border-red-500/20 text-red-400'
            : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
        }`}>
          <AlertCircle className="w-4 h-4" />
          {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow!' : `${daysUntil} days away`}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/50">
        <div className="flex items-center gap-2">
          {tournament.rounds?.length > 0 ? (
            <span className="text-emerald-400 text-sm flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Tracking
            </span>
          ) : (
            <span className="text-slate-500 text-sm flex items-center gap-1">
              <Circle className="w-4 h-4" />
              No rounds yet
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(tournament); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(tournament.id); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Tournament Detail View
const TournamentDetail = ({ tournament, onBack, onAddRound, onUpdateTournament }) => {
  const [showRoundModal, setShowRoundModal] = useState(false);

  const rounds = tournament.rounds || [];
  const wins = rounds.filter(r => r.result === 'win').length;
  const losses = rounds.filter(r => r.result === 'loss').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{tournament.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(tournament.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {tournament.location || 'TBD'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowRoundModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Round
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 text-center">
          <p className="text-2xl font-bold text-white">{rounds.length}</p>
          <p className="text-slate-500 text-sm">Rounds</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <p className="text-2xl font-bold text-emerald-400">{wins}</p>
          <p className="text-slate-500 text-sm">Wins</p>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-2xl font-bold text-red-400">{losses}</p>
          <p className="text-slate-500 text-sm">Losses</p>
        </div>
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
          <p className="text-2xl font-bold text-cyan-400">
            {rounds.length > 0 ? ((wins / rounds.length) * 100).toFixed(0) : 0}%
          </p>
          <p className="text-slate-500 text-sm">Win Rate</p>
        </div>
      </div>

      {/* Rounds List */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Round History</h2>
        {rounds.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-slate-900/30 border border-slate-800/50">
            <Target className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No rounds recorded yet</p>
            <p className="text-slate-500 text-sm">Add your first round to start tracking</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rounds.map((round, i) => (
              <div
                key={round.id || i}
                className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 flex items-center gap-4"
              >
                <div className={`w-2 h-12 rounded-full ${
                  round.result === 'win' ? 'bg-emerald-500' : 'bg-red-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{round.roundName}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{round.side}</span>
                  </div>
                  <p className="text-slate-500 text-sm">
                    vs {round.opponent || 'Unknown'} {round.opponentSchool && `(${round.opponentSchool})`}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    round.result === 'win'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {round.result === 'win' ? 'Win' : 'Loss'}
                  </span>
                  {round.speakerPoints && (
                    <p className="text-slate-500 text-sm mt-1">{round.speakerPoints} speaks</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Travel Info */}
      {(tournament.travelInfo?.flight || tournament.travelInfo?.hotel) && (
        <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
          <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <Plane className="w-4 h-4" />
            Travel Information
          </h3>
          <div className="space-y-2 text-sm">
            {tournament.travelInfo.flight && (
              <div className="flex items-start gap-2">
                <span className="text-slate-500">Flight:</span>
                <span className="text-slate-300">{tournament.travelInfo.flight}</span>
              </div>
            )}
            {tournament.travelInfo.hotel && (
              <div className="flex items-start gap-2">
                <span className="text-slate-500">Hotel:</span>
                <span className="text-slate-300">{tournament.travelInfo.hotel}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Round Modal */}
      <AnimatePresence>
        {showRoundModal && (
          <AddRoundModal
            isOpen={showRoundModal}
            onClose={() => setShowRoundModal(false)}
            onSave={(round) => onAddRound(tournament.id, round)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Add Round Modal
const AddRoundModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    roundName: 'Round 1',
    opponent: '',
    opponentSchool: '',
    side: 'Pro',
    result: 'win',
    speakerPoints: '',
    judge: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      speakerPoints: formData.speakerPoints ? parseFloat(formData.speakerPoints) : null
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl"
      >
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Add Round</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Round</label>
            <select
              value={formData.roundName}
              onChange={(e) => setFormData({ ...formData, roundName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 outline-none"
            >
              {['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', 'Octofinals', 'Quarterfinals', 'Semifinals', 'Finals'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Opponent</label>
              <input
                type="text"
                value={formData.opponent}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                placeholder="Name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">School</label>
              <input
                type="text"
                value={formData.opponentSchool}
                onChange={(e) => setFormData({ ...formData, opponentSchool: e.target.value })}
                placeholder="School"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Side</label>
              <select
                value={formData.side}
                onChange={(e) => setFormData({ ...formData, side: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 outline-none"
              >
                <option value="Pro">Pro</option>
                <option value="Con">Con</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Result</label>
              <select
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 outline-none"
              >
                <option value="win">Win</option>
                <option value="loss">Loss</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Speaks</label>
              <input
                type="number"
                step="0.1"
                value={formData.speakerPoints}
                onChange={(e) => setFormData({ ...formData, speakerPoints: e.target.value })}
                placeholder="28.5"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Judge</label>
            <input
              type="text"
              value={formData.judge}
              onChange={(e) => setFormData({ ...formData, judge: e.target.value })}
              placeholder="Judge name"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors"
            >
              Add Round
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Judge Preferences Section
const JudgePreferences = ({ judges, onAddJudge, onUpdateJudge }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Gavel className="w-5 h-5 text-cyan-400" />
          Judge Preferences
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Judge
        </button>
      </div>

      {judges.length === 0 ? (
        <div className="text-center py-8 rounded-xl bg-slate-900/30 border border-slate-800/50">
          <Gavel className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No judges recorded yet</p>
          <p className="text-slate-500 text-sm">Track judge preferences to adapt your strategy</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {judges.map(judge => (
            <div
              key={judge.id}
              className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-medium">{judge.name}</h3>
                  <p className="text-slate-500 text-sm">{judge.affiliation}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(level => (
                    <Star
                      key={level}
                      className={`w-4 h-4 ${
                        level <= judge.rating ? 'text-amber-400 fill-current' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                {judge.paradigm && (
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500">Paradigm:</span>
                    <span className="text-slate-300">{judge.paradigm}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <span className={`flex items-center gap-1 text-xs ${
                    judge.leansPro ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    <ThumbsUp className="w-3 h-3" />
                    Pro
                  </span>
                  <span className={`flex items-center gap-1 text-xs ${
                    judge.leansCon ? 'text-red-400' : 'text-slate-500'
                  }`}>
                    <ThumbsDown className="w-3 h-3" />
                    Con
                  </span>
                  <span className={`flex items-center gap-1 text-xs ${
                    !judge.leansPro && !judge.leansCon ? 'text-cyan-400' : 'text-slate-500'
                  }`}>
                    <Minus className="w-3 h-3" />
                    Neutral
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Judge Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddJudgeModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSave={onAddJudge}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Add Judge Modal
const AddJudgeModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    affiliation: '',
    paradigm: '',
    rating: 3,
    leansPro: false,
    leansCon: false,
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    setFormData({ name: '', affiliation: '', paradigm: '', rating: 3, leansPro: false, leansCon: false, notes: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl"
      >
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Add Judge</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Judge name"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Affiliation</label>
            <input
              type="text"
              value={formData.affiliation}
              onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
              placeholder="School/Organization"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: level })}
                  className="p-1"
                >
                  <Star className={`w-6 h-6 ${
                    level <= formData.rating ? 'text-amber-400 fill-current' : 'text-slate-700'
                  }`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Paradigm</label>
            <textarea
              value={formData.paradigm}
              onChange={(e) => setFormData({ ...formData, paradigm: e.target.value })}
              placeholder="Judge's preferred arguments, style preferences..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors"
            >
              Add Judge
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Main Component
const TournamentManagement = ({ apiKey }) => {
  const { tournaments, loading, addTournament, updateTournament, deleteTournament, addRound } = useTournaments();
  const { judges, addJudge, updateJudge } = useJudges();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [activeView, setActiveView] = useState('upcoming');

  const upcomingTournaments = useMemo(() => {
    return tournaments
      .filter(t => new Date(t.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [tournaments]);

  const pastTournaments = useMemo(() => {
    return tournaments
      .filter(t => new Date(t.date) < new Date())
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [tournaments]);

  const handleSaveTournament = async (data) => {
    if (editingTournament) {
      await updateTournament(editingTournament.id, data);
      setEditingTournament(null);
    } else {
      await addTournament(data);
    }
    setShowAddModal(false);
  };

  if (selectedTournament) {
    return (
      <TournamentDetail
        tournament={selectedTournament}
        onBack={() => setSelectedTournament(null)}
        onAddRound={addRound}
        onUpdateTournament={updateTournament}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-cyan-400" />
            Tournaments
          </h1>
          <p className="text-slate-400 mt-1">Manage your tournament schedule and track rounds</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Tournament
        </button>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800/50 w-fit">
        {[
          { id: 'upcoming', label: `Upcoming (${upcomingTournaments.length})` },
          { id: 'past', label: `Past (${pastTournaments.length})` },
          { id: 'judges', label: `Judges (${judges.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === tab.id
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : activeView === 'judges' ? (
        <JudgePreferences judges={judges} onAddJudge={addJudge} onUpdateJudge={updateJudge} />
      ) : (
        <>
          {(activeView === 'upcoming' ? upcomingTournaments : pastTournaments).length === 0 ? (
            <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/30">
              <EmptyTournaments onAdd={() => setShowAddModal(true)} />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(activeView === 'upcoming' ? upcomingTournaments : pastTournaments).map(tournament => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  onClick={() => setSelectedTournament(tournament)}
                  onEdit={(t) => {
                    setEditingTournament(t);
                    setShowAddModal(true);
                  }}
                  onDelete={deleteTournament}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showAddModal && (
          <TournamentModal
            isOpen={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              setEditingTournament(null);
            }}
            onSave={handleSaveTournament}
            tournament={editingTournament}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TournamentManagement;
