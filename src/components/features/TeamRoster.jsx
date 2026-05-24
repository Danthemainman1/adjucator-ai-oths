import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Users,
  Plus,
  Trash2,
  Edit3,
  Mail,
  Phone,
  X,
  Check,
  User,
  Crown,
  Star
} from 'lucide-react';

const ROLES = [
  { id: 'captain', label: 'Team Captain', color: 'yellow', icon: Crown },
  { id: 'varsity', label: 'Varsity', color: 'purple', icon: Star },
  { id: 'jv', label: 'Junior Varsity', color: 'blue', icon: User },
  { id: 'novice', label: 'Novice', color: 'green', icon: User },
  { id: 'coach', label: 'Coach', color: 'red', icon: Crown }
];

const getColorClasses = (color) => {
  const colors = {
    yellow: { bg: 'bg-surface-offset', border: 'border-hairline', text: 'text-ink', badge: 'bg-surface-offset' },
    purple: { bg: 'bg-surface-offset', border: 'border-hairline', text: 'text-ink', badge: 'bg-surface-offset' },
    blue: { bg: 'bg-accent-crimson/20', border: 'border-accent-crimson/50', text: 'text-ink', badge: 'bg-accent-crimson' },
    green: { bg: 'bg-surface-offset', border: 'border-hairline', text: 'text-ink', badge: 'bg-surface-offset' },
    red: { bg: 'bg-accent-crimson/20', border: 'border-accent-crimson/50', text: 'text-accent-crimson', badge: 'bg-accent-crimson' }
  };
  return colors[color] || colors.blue;
};

const TeamRoster = () => {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'varsity',
    email: '',
    phone: '',
    notes: ''
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('team-roster');
    if (saved) {
        // Defer state update
        setTimeout(() => {
            setMembers(JSON.parse(saved));
        }, 0);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('team-roster', JSON.stringify(members));
  }, [members]);

  const resetForm = () => {
    setFormData({ name: '', role: 'varsity', email: '', phone: '', notes: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      setMembers(members.map(m => 
        m.id === editingId ? { ...formData, id: editingId } : m
      ));
    } else {
      setMembers([...members, { ...formData, id: Date.now().toString() }]);
    }
    resetForm();
  };

  const editMember = (member) => {
    setFormData(member);
    setEditingId(member.id);
    setShowForm(true);
  };

  const deleteMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  // Group by role
  const groupedMembers = ROLES.reduce((acc, role) => {
    acc[role.id] = members.filter(m => m.role === role.id);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 /20 to-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-ink" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-accent-crimson">Team Roster</h1>
              <p className="text-ink-muted text-sm">{members.length} team member{members.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-offset hover:bg-surface-offset text-accent-crimson rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={resetForm}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={e => e.stopPropagation()}
                className="bg-[var(--card-bg)] border border-hairline rounded-xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-accent-crimson">
                    {editingId ? 'Edit Member' : 'Add Team Member'}
                  </h2>
                  <button onClick={resetForm} className="text-ink-muted hover:text-accent-crimson">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-ink-muted text-sm mb-1 block">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full name"
                      className="w-full px-4 py-2 bg-[var(--bg-accent-crimson)] border border-hairline rounded-lg text-accent-crimson placeholder-slate-500 focus:outline-none focus:border-hairline"
                    />
                  </div>

                  <div>
                    <label className="text-ink-muted text-sm mb-1 block">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2 bg-[var(--bg-accent-crimson)] border border-hairline rounded-lg text-accent-crimson focus:outline-none focus:border-hairline"
                    >
                      {ROLES.map(role => (
                        <option key={role.id} value={role.id}>{role.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-ink-muted text-sm mb-1 block">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full px-4 py-2 bg-[var(--bg-accent-crimson)] border border-hairline rounded-lg text-accent-crimson placeholder-slate-500 focus:outline-none focus:border-hairline"
                    />
                  </div>

                  <div>
                    <label className="text-ink-muted text-sm mb-1 block">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-2 bg-[var(--bg-accent-crimson)] border border-hairline rounded-lg text-accent-crimson placeholder-slate-500 focus:outline-none focus:border-hairline"
                    />
                  </div>

                  <div>
                    <label className="text-ink-muted text-sm mb-1 block">Notes</label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Partner, events, etc."
                      className="w-full px-4 py-2 bg-[var(--bg-accent-crimson)] border border-hairline rounded-lg text-accent-crimson placeholder-slate-500 focus:outline-none focus:border-hairline"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={resetForm}
                    className="flex-1 py-2 bg-surface-parchment hover:bg-surface-offset text-accent-crimson rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.name.trim()}
                    className="flex-1 py-2 bg-surface-offset hover:bg-surface-offset disabled:bg-surface-parchment disabled:cursor-not-allowed text-accent-crimson rounded-lg transition-colors"
                  >
                    {editingId ? 'Save Changes' : 'Add Member'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roster List */}
        {members.length === 0 ? (
          <div className="bg-[var(--card-bg)]/50 border border-hairline/50 rounded-xl p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-ink-muted" />
            <p className="text-ink-muted mb-4">No team members yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-surface-parchment hover:bg-surface-offset text-accent-crimson rounded-lg transition-colors"
            >
              Add First Member
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {ROLES.map(role => {
              const roleMembers = groupedMembers[role.id];
              if (roleMembers.length === 0) return null;

              const colors = getColorClasses(role.color);
              const Icon = role.icon;

              return (
                <div key={role.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                    <h2 className="text-accent-crimson font-medium">{role.label}</h2>
                    <span className="text-ink-muted text-sm">({roleMembers.length})</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {roleMembers.map(member => (
                      <motion.div
                        key={member.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl ${colors.bg} border ${colors.border} group`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-accent-crimson font-semibold">{member.name}</h3>
                            {member.notes && (
                              <p className="text-ink-muted text-sm mt-1">{member.notes}</p>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => editMember(member)}
                              className="p-1.5 text-ink-muted hover:text-accent-crimson transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteMember(member.id)}
                              className="p-1.5 text-ink-muted hover:text-accent-crimson transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {(member.email || member.phone) && (
                          <div className="flex flex-wrap gap-3 mt-3 text-sm">
                            {member.email && (
                              <a
                                href={`mailto:${member.email}`}
                                className="flex items-center gap-1 text-ink-muted hover:text-accent-crimson transition-colors"
                              >
                                <Mail className="w-3 h-3" />
                                {member.email}
                              </a>
                            )}
                            {member.phone && (
                              <a
                                href={`tel:${member.phone}`}
                                className="flex items-center gap-1 text-ink-muted hover:text-accent-crimson transition-colors"
                              >
                                <Phone className="w-3 h-3" />
                                {member.phone}
                              </a>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamRoster;
