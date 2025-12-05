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
    yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', badge: 'bg-yellow-500' },
    purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', badge: 'bg-purple-500' },
    blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', badge: 'bg-blue-500' },
    green: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', badge: 'bg-green-500' },
    red: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', badge: 'bg-red-500' }
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
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Team Roster</h1>
              <p className="text-slate-400 text-sm">{members.length} team member{members.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
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
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {editingId ? 'Edit Member' : 'Add Team Member'}
                  </h2>
                  <button onClick={resetForm} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full name"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      {ROLES.map(role => (
                        <option key={role.id} value={role.id}>{role.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Notes</label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Partner, events, etc."
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={resetForm}
                    className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.name.trim()}
                    className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
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
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400 mb-4">No team members yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
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
                    <h2 className="text-white font-medium">{role.label}</h2>
                    <span className="text-slate-500 text-sm">({roleMembers.length})</span>
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
                            <h3 className="text-white font-semibold">{member.name}</h3>
                            {member.notes && (
                              <p className="text-slate-400 text-sm mt-1">{member.notes}</p>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => editMember(member)}
                              className="p-1.5 text-slate-400 hover:text-white transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteMember(member.id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
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
                                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                              >
                                <Mail className="w-3 h-3" />
                                {member.email}
                              </a>
                            )}
                            {member.phone && (
                              <a
                                href={`tel:${member.phone}`}
                                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
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
