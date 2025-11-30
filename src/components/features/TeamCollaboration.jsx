/**
 * Team Collaboration
 * Shared docs, case files, chat, and role management
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  UserMinus,
  Crown,
  Shield,
  FileText,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Edit3,
  Trash2,
  Share2,
  Link2,
  Calendar,
  Clock,
  Star,
  RefreshCw,
  X,
  Save,
  Send,
  Folder,
  FolderPlus,
  CheckSquare,
  Square,
  LogOut
} from 'lucide-react';
import { useTeams } from '../../hooks/useDebateData';
import { useAuth } from '../../contexts/AuthContext';
import * as debateService from '../../services/debateService';

// Empty State
const EmptyTeams = ({ onCreateTeam, onJoinTeam }) => (
  <div className="text-center py-16">
    <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6 mx-auto w-fit">
      <Users className="w-12 h-12 text-slate-500" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">No Teams Yet</h3>
    <p className="text-slate-400 max-w-md mx-auto mb-6">
      Create or join a team to collaborate on strategy docs, share case files, and prepare for tournaments together.
    </p>
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onCreateTeam}
        className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Create Team
      </button>
      <button
        onClick={onJoinTeam}
        className="px-6 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
      >
        <UserPlus className="w-5 h-5" />
        Join Team
      </button>
    </div>
  </div>
);

// Create Team Modal
const CreateTeamModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState('Public Forum');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, description, format });
    onClose();
    setName('');
    setDescription('');
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
          <h2 className="text-xl font-bold text-white">Create Team</h2>
          <p className="text-slate-400 text-sm mt-1">Start collaborating with teammates</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Team Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Harvard Debate Team"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Primary Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 outline-none"
            >
              {['Public Forum', 'Lincoln-Douglas', 'Policy', 'Congress', 'World Schools'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Team description..."
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
              Create Team
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Join Team Modal
const JoinTeamModal = ({ isOpen, onClose, onJoin }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onJoin(inviteCode.toUpperCase());
      onClose();
      setInviteCode('');
    } catch (err) {
      setError(err.message);
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
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl"
      >
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Join Team</h2>
          <p className="text-slate-400 text-sm mt-1">Enter the team invite code</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Invite Code</label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="e.g., ABC123"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-center text-2xl tracking-widest font-mono"
              maxLength={6}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

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
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors disabled:opacity-50"
            >
              {loading ? 'Joining...' : 'Join Team'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Team Card
const TeamCard = ({ team, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`w-full p-4 rounded-xl text-left transition-all ${
      isActive
        ? 'bg-cyan-500/10 border-2 border-cyan-500/50'
        : 'bg-slate-900/30 border border-slate-800/60 hover:border-slate-700/60'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
        {team.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold truncate">{team.name}</h3>
        <p className="text-slate-400 text-sm">{team.members?.length || 1} members • {team.format}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-500" />
    </div>
  </button>
);

// Team Dashboard
const TeamDashboard = ({ team, onBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('documents');
  const [documents, setDocuments] = useState([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const isOwner = team.ownerId === user?.uid;
  const currentMember = team.members?.find(m => m.id === user?.uid);

  useEffect(() => {
    loadDocuments();
  }, [team.id]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs = await debateService.getTeamDocuments(team.id);
      setDocuments(docs);
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(team.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCreateDocument = async (doc) => {
    try {
      await debateService.saveTeamDocument(team.id, {
        ...doc,
        authorId: user.uid,
        authorName: user.displayName || user.email
      });
      loadDocuments();
    } catch (err) {
      console.error('Error creating document:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
            {team.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{team.name}</h1>
            <p className="text-slate-400">{team.format} • {team.members?.length || 1} members</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Invite Code */}
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-2"
          >
            {copiedCode ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                {team.inviteCode}
              </>
            )}
          </button>
          
          {isOwner && (
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800/50 w-fit">
        {[
          { id: 'documents', label: 'Documents', icon: FileText },
          { id: 'members', label: 'Members', icon: Users },
          { id: 'prep', label: 'Prep Checklist', icon: CheckSquare }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Team Documents</h2>
            <button
              onClick={() => setShowDocModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Document
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No documents yet</p>
              <p className="text-slate-500 text-sm">Create your first shared document</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 hover:border-slate-700/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      <div>
                        <h3 className="text-white font-medium">{doc.title}</h3>
                        <p className="text-slate-500 text-xs">{doc.type}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs ${
                      doc.side === 'pro' ? 'bg-emerald-500/10 text-emerald-400' :
                      doc.side === 'con' ? 'bg-red-500/10 text-red-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {doc.side || 'General'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2">{doc.content?.substring(0, 150)}...</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/50">
                    <span className="text-slate-500 text-xs">
                      By {doc.authorName}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {new Date(doc.createdAt?.toDate?.() || doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Team Members</h2>
          <div className="space-y-3">
            {team.members?.map((member, i) => (
              <div
                key={member.id}
                className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-medium">
                  {member.name?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{member.name || 'Team Member'}</p>
                    {member.role === 'owner' && (
                      <Crown className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <p className="text-slate-500 text-sm">
                    {member.speakerRole || 'No role assigned'} • Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </p>
                </div>
                <select
                  className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 text-sm focus:border-cyan-500 outline-none"
                  defaultValue={member.speakerRole || ''}
                >
                  <option value="">No role</option>
                  <option value="1st Speaker">1st Speaker</option>
                  <option value="2nd Speaker">2nd Speaker</option>
                  <option value="3rd Speaker">3rd Speaker</option>
                  <option value="Flex">Flex</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'prep' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Tournament Prep Checklist</h2>
          <div className="space-y-2">
            {[
              { label: 'Case files organized', checked: false },
              { label: 'Evidence cards tagged', checked: false },
              { label: 'Blocks written for common args', checked: false },
              { label: 'Practice rounds completed', checked: false },
              { label: 'Judge preferences researched', checked: false },
              { label: 'Flow paper prepared', checked: false },
              { label: 'Timer app downloaded', checked: true },
              { label: 'Travel arrangements confirmed', checked: false }
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/50 flex items-center gap-3 cursor-pointer hover:bg-slate-800/30 transition-all"
              >
                <button className="text-slate-400 hover:text-cyan-400 transition-colors">
                  {item.checked ? (
                    <CheckSquare className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <span className={`${item.checked ? 'text-slate-500 line-through' : 'text-white'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Document Modal */}
      <AnimatePresence>
        {showDocModal && (
          <NewDocumentModal
            isOpen={showDocModal}
            onClose={() => setShowDocModal(false)}
            onCreate={handleCreateDocument}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// New Document Modal
const NewDocumentModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Case File',
    side: 'neutral',
    content: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
    setFormData({ title: '', type: 'Case File', side: 'neutral', content: '' });
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
          <h2 className="text-xl font-bold text-white">New Document</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Document title"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 outline-none"
              >
                {['Case File', 'Strategy Doc', 'Evidence Block', 'Flow Template', 'Notes'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Side</label>
              <select
                value={formData.side}
                onChange={(e) => setFormData({ ...formData, side: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-cyan-500 outline-none"
              >
                <option value="neutral">General</option>
                <option value="pro">Pro/Aff</option>
                <option value="con">Con/Neg</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Document content..."
              rows={10}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 outline-none resize-none"
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
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Document
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Main Component
const TeamCollaboration = ({ apiKey }) => {
  const { teams, loading, createTeam, joinTeam } = useTeams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleCreateTeam = async (data) => {
    await createTeam(data);
  };

  const handleJoinTeam = async (code) => {
    await joinTeam(code);
  };

  if (selectedTeam) {
    return <TeamDashboard team={selectedTeam} onBack={() => setSelectedTeam(null)} />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-cyan-400" />
            Team Collaboration
          </h1>
          <p className="text-slate-400 mt-1">Work together on strategy, cases, and tournament prep</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Join Team
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Team
          </button>
        </div>
      </div>

      {/* Teams List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : teams.length === 0 ? (
        <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/30">
          <EmptyTeams 
            onCreateTeam={() => setShowCreateModal(true)} 
            onJoinTeam={() => setShowJoinModal(true)} 
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              onClick={() => setSelectedTeam(team)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateTeamModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateTeam}
          />
        )}
        {showJoinModal && (
          <JoinTeamModal
            isOpen={showJoinModal}
            onClose={() => setShowJoinModal(false)}
            onJoin={handleJoinTeam}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamCollaboration;
