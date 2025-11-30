import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Lock, 
  Unlock, 
  UserPlus, 
  Crown, 
  Calendar,
  Trophy,
  Shield,
  Mic,
  MessageSquare,
  Filter,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../utils/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  onSnapshot,
  orderBy
} from 'firebase/firestore';

// Speech events configuration
const SPEECH_EVENTS = {
  interpretation: [
    { id: 'OO', label: 'Original Oratory', icon: Mic },
    { id: 'INF', label: 'Informative Speaking', icon: MessageSquare },
    { id: 'DI', label: 'Dramatic Interpretation', icon: Shield },
    { id: 'HI', label: 'Humorous Interpretation', icon: Crown },
    { id: 'DUO', label: 'Duo Interpretation', icon: Users },
    { id: 'POI', label: 'Program Oral Interpretation', icon: Trophy }
  ],
  limited_prep: [
    { id: 'EXT', label: 'Extemporaneous Speaking', icon: Calendar },
    { id: 'IMP', label: 'Impromptu Speaking', icon: MessageSquare }
  ],
  debate: [
    { id: 'PF', label: 'Public Forum', icon: Users },
    { id: 'LD', label: 'Lincoln-Douglas', icon: Shield },
    { id: 'POLICY', label: 'Policy Debate', icon: Trophy },
    { id: 'CONGRESS', label: 'Congressional Debate', icon: Crown },
    { id: 'BP', label: 'British Parliamentary', icon: MessageSquare },
    { id: 'WORLDS', label: 'World Schools', icon: Calendar }
  ]
};

const TeamBrowser = () => {
  const { user, isAuthenticated } = useAuth();
  const [teams, setTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'debate',
    events: [],
    isPrivate: false,
    maxMembers: 20
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    // Real-time listener for all teams
    const teamsQuery = query(
      collection(db, 'teams'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(teamsQuery, (snapshot) => {
      const teamsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeams(teamsData);
      
      // Filter user's teams
      const userTeams = teamsData.filter(team => 
        team.members?.includes(user.uid)
      );
      setMyTeams(userTeams);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching teams:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated, user]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showNotification('Please sign in to create a team', 'error');
      return;
    }

    try {
      const teamData = {
        ...formData,
        owner: user.uid,
        ownerName: user.displayName || user.email,
        members: [user.uid],
        memberDetails: [{
          uid: user.uid,
          name: user.displayName || user.email,
          email: user.email,
          role: 'owner',
          joinedAt: new Date().toISOString()
        }],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'teams'), teamData);
      
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        category: 'debate',
        events: [],
        isPrivate: false,
        maxMembers: 20
      });
      
      showNotification('Team created successfully!');
    } catch (error) {
      console.error('Error creating team:', error);
      showNotification('Failed to create team', 'error');
    }
  };

  const handleJoinTeam = async (teamId, team) => {
    if (!isAuthenticated) {
      showNotification('Please sign in to join a team', 'error');
      return;
    }

    if (team.members?.includes(user.uid)) {
      showNotification('You are already a member of this team', 'info');
      return;
    }

    if (team.members?.length >= team.maxMembers) {
      showNotification('Team is full', 'error');
      return;
    }

    try {
      const teamRef = doc(db, 'teams', teamId);
      await updateDoc(teamRef, {
        members: arrayUnion(user.uid),
        memberDetails: arrayUnion({
          uid: user.uid,
          name: user.displayName || user.email,
          email: user.email,
          role: 'member',
          joinedAt: new Date().toISOString()
        }),
        updatedAt: serverTimestamp()
      });
      
      showNotification('Successfully joined team!');
    } catch (error) {
      console.error('Error joining team:', error);
      showNotification('Failed to join team', 'error');
    }
  };

  const handleLeaveTeam = async (teamId, team) => {
    if (team.owner === user.uid) {
      showNotification('Team owner cannot leave. Transfer ownership or delete the team.', 'error');
      return;
    }

    try {
      const teamRef = doc(db, 'teams', teamId);
      const memberDetail = team.memberDetails?.find(m => m.uid === user.uid);
      
      await updateDoc(teamRef, {
        members: arrayRemove(user.uid),
        memberDetails: arrayRemove(memberDetail),
        updatedAt: serverTimestamp()
      });
      
      showNotification('Left team successfully');
    } catch (error) {
      console.error('Error leaving team:', error);
      showNotification('Failed to leave team', 'error');
    }
  };

  const toggleEventSelection = (eventId) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId]
    }));
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || team.category === filterCategory;
    const isVisible = !team.isPrivate || team.members?.includes(user?.uid);
    
    return matchesSearch && matchesCategory && isVisible;
  });

  // Auth lock
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-6 px-4">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-30" />
          <div className="relative w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-800">
            <Lock className="w-12 h-12 text-cyan-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Authentication Required</h2>
          <p className="text-slate-400 max-w-md">
            Please sign in to browse teams, create your own team, and collaborate with other debaters.
          </p>
        </div>
        <button className="btn-primary">
          Sign In to Continue
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 glass-card px-6 py-4 flex items-center gap-3 animate-in slide-in-from-top ${
          notification.type === 'error' ? 'border-red-500/50' : 
          notification.type === 'info' ? 'border-blue-500/50' : 'border-green-500/50'
        }`}>
          {notification.type === 'success' && <Check className="w-5 h-5 text-green-400" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
          {notification.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-400" />}
          <span className="text-white">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="glass-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-cyan-400" />
              Team Browser
            </h1>
            <p className="text-slate-400 mt-2">
              Find, join, or create teams to collaborate with other debaters
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Team
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              showFilters ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/50' : 'bg-slate-800 text-slate-300 border-slate-700'
            } border`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
            {['all', 'debate', 'interpretation', 'limited_prep'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                } border`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* My Teams */}
      {myTeams.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            My Teams ({myTeams.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {myTeams.map((team) => (
              <TeamCard 
                key={team.id} 
                team={team} 
                user={user}
                onJoin={handleJoinTeam}
                onLeave={handleLeaveTeam}
                isMember={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Teams */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          Browse Teams ({filteredTeams.length})
        </h2>
        
        {filteredTeams.length === 0 ? (
          <div className="glass-card text-center py-12">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No teams found</h3>
            <p className="text-slate-400 mb-6">
              {searchQuery || filterCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a team!'}
            </p>
            {!searchQuery && filterCategory === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create First Team
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTeams.map((team) => (
              <TeamCard 
                key={team.id} 
                team={team} 
                user={user}
                onJoin={handleJoinTeam}
                onLeave={handleLeaveTeam}
                isMember={team.members?.includes(user.uid)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Plus className="w-6 h-6 text-cyan-400" />
                Create New Team
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Debate Warriors"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell others about your team..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                    >
                      <option value="debate">Debate</option>
                      <option value="interpretation">Interpretation</option>
                      <option value="limited_prep">Limited Prep</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Max Members
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="100"
                      value={formData.maxMembers}
                      onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500"
                  />
                  <label htmlFor="isPrivate" className="text-sm text-slate-300 flex items-center gap-2">
                    {formData.isPrivate ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    Private Team (invite-only)
                  </label>
                </div>
              </div>

              {/* Event Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Select Events
                </label>
                <div className="space-y-4">
                  {Object.entries(SPEECH_EVENTS).map(([category, events]) => (
                    <div key={category}>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                        {category.replace('_', ' ')}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {events.map((event) => (
                          <button
                            key={event.id}
                            type="button"
                            onClick={() => toggleEventSelection(event.id)}
                            className={`p-3 rounded-lg border transition-all text-left ${
                              formData.events.includes(event.id)
                                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <event.icon className="w-4 h-4" />
                              <span className="text-sm font-medium">{event.id}</span>
                            </div>
                            <span className="text-xs opacity-70 mt-1 block">{event.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Team Card Component
const TeamCard = ({ team, user, onJoin, onLeave, isMember }) => {
  const isOwner = team.owner === user.uid;
  const isFull = team.members?.length >= team.maxMembers;

  return (
    <div className="glass-card hover:border-cyan-500/30 transition-all space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white">{team.name}</h3>
            {team.isPrivate && <Lock className="w-4 h-4 text-slate-500" />}
            {isOwner && <Crown className="w-4 h-4 text-yellow-400" />}
          </div>
          <p className="text-sm text-slate-400 line-clamp-2">{team.description || 'No description'}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-slate-400">
          <Users className="w-4 h-4" />
          <span>{team.members?.length || 0}/{team.maxMembers}</span>
        </div>
        <div className="px-2 py-1 bg-slate-800 rounded text-xs text-cyan-400 capitalize">
          {team.category}
        </div>
      </div>

      {/* Events */}
      {team.events?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {team.events.map((eventId) => (
            <span
              key={eventId}
              className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300"
            >
              {eventId}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="pt-3 border-t border-slate-800">
        {isMember ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-400 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Member
            </span>
            {!isOwner && (
              <button
                onClick={() => onLeave(team.id, team)}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Leave Team
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => onJoin(team.id, team)}
            disabled={isFull}
            className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              isFull
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-600 text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            {isFull ? 'Team Full' : 'Join Team'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamBrowser;
