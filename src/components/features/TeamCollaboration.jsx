/**
 * Team Collaboration - PREMIUM POLISH
 * Beautiful team management with chat, documents, and checklists
 */

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  FileText,
  CheckSquare,
  Plus,
  Send,
  Search,
  Settings,
  Crown,
  Shield,
  Star,
  X,
  Check,
  Edit3,
  Trash2,
  MoreVertical,
  Clock,
  Calendar,
  ChevronRight,
  FolderOpen,
  Upload,
  Download,
  Paperclip,
  Image,
  Link2,
  UserPlus,
  UserMinus,
  Bell,
  BellOff,
  Copy,
  Share2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Sparkles,
  Trophy,
  Target,
  Mic,
  Video,
  Phone
} from 'lucide-react';
import { useTeams } from '../../hooks/useDebateData';
// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

// Role Badge Component
const RoleBadge = ({ role }) => {
  const roleConfig = {
    captain: { label: 'Captain', icon: Crown, color: 'from-amber-500 to-orange-600', bg: 'bg-surface-offset', border: 'border-hairline', text: 'text-ink' },
    coach: { label: 'Coach', icon: Shield, color: 'from-purple-500 to-indigo-600', bg: 'bg-surface-offset', border: 'border-hairline', text: 'text-ink' },
    varsity: { label: 'Varsity', icon: Star, color: 'from-cyan-500 to-blue-600', bg: 'bg-surface-offset', border: 'border-hairline', text: 'text-ink' },
    jv: { label: 'JV', icon: Target, color: 'from-emerald-500 to-green-600', bg: 'bg-surface-offset', border: 'border-hairline', text: 'text-ink' },
    novice: { label: 'Novice', icon: Sparkles, color: 'from-slate-400 to-slate-600', bg: 'bg-surface-offset0/10', border: 'border-hairline', text: 'text-ink-muted' }
  };

  const config = roleConfig[role] || roleConfig.novice;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.border} ${config.text} border`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

// Online Status Indicator
const OnlineIndicator = ({ isOnline, size = 'sm' }) => {
  const sizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <span className={`relative flex ${sizes[size]}`}>
      {isOnline && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-surface-offset opacity-75"></span>
      )}
      <span className={`relative inline-flex rounded-full ${sizes[size]} ${isOnline ? 'bg-surface-offset' : 'bg-surface-offset0'}`}></span>
    </span>
  );
};

// Avatar Component
const Avatar = ({ name, image, size = 'md', showOnline, isOnline }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  };

  const colors = [
    'from-cyan-500 to-blue-600',
    'from-purple-500 to-indigo-600',
    'from-emerald-500 to-green-600',
    'from-amber-500 to-orange-600',
    'from-pink-500 to-rose-600'
  ];

  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="relative">
      {image ? (
        <img 
          src={image} 
          alt={name} 
          className={`${sizes[size]} rounded-xl object-cover ring-2 ring-hairline`}
        />
      ) : (
        <div className={`${sizes[size]} rounded-xl  ${colors[colorIndex]} flex items-center justify-center text-accent-crimson font-bold shadow-lg`}>
          {initials}
        </div>
      )}
      {showOnline && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <OnlineIndicator isOnline={isOnline} size="sm" />
        </div>
      )}
    </div>
  );
};

// Empty State
const EmptyTeam = ({ onCreateTeam }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-20"
  >
    <div className="relative inline-block mb-8">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 w-32 h-32 rounded-full bg-surface-offset blur-xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        className="absolute inset-0 w-32 h-32 rounded-full bg-surface-offset blur-xl"
      />
      
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative p-6 rounded-3xl /80 to-slate-900/80 border border-hairline/50  shadow-2xl"
      >
        <Users className="w-16 h-16 text-ink" />
        <motion.div
          animate={{ rotate: [0, 10, 0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-6 h-6 text-ink" />
        </motion.div>
      </motion.div>
    </div>
    
    <h3 className="text-2xl font-bold text-accent-crimson mb-3">Build Your Dream Team</h3>
    <p className="text-ink-muted max-w-md mx-auto mb-8 leading-relaxed">
      Collaborate with teammates, share strategies, and prepare for tournaments together. 
      Winning teams communicate.
    </p>
    
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onCreateTeam}
      className="px-8 py-4 rounded-2xl  text-accent-crimson font-semibold text-lg shadow-lg shadow-cyan-500/25 inline-flex items-center gap-3"
    >
      <Plus className="w-5 h-5" />
      Create or Join Team
      <ChevronRight className="w-5 h-5" />
    </motion.button>
  </motion.div>
);

// Team Member Card
const MemberCard = ({ member, isCurrentUser, onMessage, onRemove }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -2 }}
      className="relative group"
    >
      <div className="absolute -inset-1 /5 to-purple-500/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all" />
      
      <div className="glass-panel p-4 hover:border-white/20 transition-all">
        <div className="flex items-center gap-4">
          <Avatar 
            name={member.name} 
            image={member.avatar} 
            size="lg" 
            showOnline 
            isOnline={member.isOnline} 
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-accent-crimson font-semibold truncate">
                {member.name}
                {isCurrentUser && <span className="text-ink-muted ml-1">(You)</span>}
              </h4>
              {member.isOnline && (
                <span className="text-xs text-ink">Online</span>
              )}
            </div>
            <p className="text-ink-muted text-sm truncate">{member.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <RoleBadge role={member.role} />
              {member.events?.map(event => (
                <span key={event} className="text-xs px-2 py-0.5 rounded-full bg-[var(--card-bg)] text-ink-muted">
                  {event}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onMessage?.(member)}
              className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-offset transition-all"
            >
              <MessageSquare className="w-5 h-5" />
            </motion.button>
            
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg text-ink-muted hover:text-accent-crimson hover:bg-[var(--card-bg)] transition-all"
              >
                <MoreVertical className="w-5 h-5" />
              </motion.button>
              
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-[var(--bg-accent-crimson)] border border-hairline rounded-xl shadow-xl z-50 py-1">
                    <button className="w-full px-4 py-2 text-left text-sm text-ink-muted hover:bg-[var(--card-bg)] flex items-center gap-2">
                      <Eye className="w-4 h-4" /> View Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-ink-muted hover:bg-[var(--card-bg)] flex items-center gap-2">
                      <Edit3 className="w-4 h-4" /> Edit Role
                    </button>
                    {!isCurrentUser && (
                      <button 
                        onClick={() => onRemove?.(member)}
                        className="w-full px-4 py-2 text-left text-sm text-accent-crimson hover:bg-accent-crimson/10 flex items-center gap-2"
                      >
                        <UserMinus className="w-4 h-4" /> Remove
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Chat Message Component
const ChatMessage = ({ message, isOwn, senderName, senderAvatar, timestamp }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
  >
    <Avatar name={senderName} image={senderAvatar} size="sm" />
    <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
        <span className="text-sm font-medium text-ink-muted">{senderName}</span>
        <span className="text-xs text-ink-muted">{timestamp}</span>
      </div>
      <div className={`p-3 rounded-2xl ${
        isOwn 
          ? ' text-accent-crimson rounded-br-md' 
          : 'bg-[var(--card-bg)] text-ink-muted rounded-bl-md'
      }`}>
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  </motion.div>
);

// Chat Panel
const ChatPanel = ({ teamId, members }) => {
  // Load messages from localStorage for persistence
  const storageKey = `team_chat_${teamId || 'default'}`;
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (err) {
      console.error('Failed to save chat messages:', err);
    }
  }, [messages, storageKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: 'You',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString(),
      isOwn: true
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="glass-panel flex flex-col h-[500px] overflow-hidden p-0">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-ink" />
            <h3 className="text-accent-crimson font-semibold">Team Chat</h3>
            <span className="px-2 py-0.5 rounded-full bg-surface-offset text-ink text-xs">
              {members?.filter(m => m.isOnline).length || 0} online
            </span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-lg text-ink-muted hover:text-accent-crimson hover:bg-[var(--card-bg)] transition-all"
            >
              <Phone className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-lg text-ink-muted hover:text-accent-crimson hover:bg-[var(--card-bg)] transition-all"
            >
              <Video className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="p-3 bg-[var(--card-bg)]/50 rounded-full mb-3">
              <MessageSquare className="w-6 h-6 text-ink-muted" />
            </div>
            <p className="text-ink-muted text-sm mb-1">No messages yet</p>
            <p className="text-ink-muted text-xs">Start the conversation with your team!</p>
          </div>
        ) : (
          messages.map(msg => (
            <ChatMessage
              key={msg.id}
              message={msg.message}
              isOwn={msg.isOwn}
              senderName={msg.sender}
              timestamp={msg.timestamp}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2 rounded-lg text-ink-muted hover:text-accent-crimson hover:bg-[var(--card-bg)] transition-all"
          >
            <Paperclip className="w-5 h-5" />
          </motion.button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--card-bg)]/50 border border-hairline text-accent-crimson placeholder-slate-500 focus:border-hairline focus:ring-2 focus:ring-hairline outline-none transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-3 rounded-xl  text-accent-crimson shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Document Card
const DocumentCard = ({ doc, onClick }) => {
  const typeConfig = {
    case: { icon: FileText, color: 'text-ink', bg: 'bg-surface-offset' },
    evidence: { icon: FileText, color: 'text-ink', bg: 'bg-surface-offset' },
    strategy: { icon: Target, color: 'text-ink', bg: 'bg-surface-offset' },
    notes: { icon: FileText, color: 'text-ink', bg: 'bg-surface-offset' }
  };

  const config = typeConfig[doc.type] || typeConfig.notes;
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={onClick}
      className="glass-panel p-4 hover:border-white/20 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-accent-crimson font-medium truncate group-hover:text-ink transition-colors">
            {doc.title}
          </h4>
          <p className="text-ink-muted text-sm mt-1">
            Updated {doc.updatedAt} by {doc.updatedBy}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-ink-muted group-hover:text-ink-muted transition-colors" />
      </div>
    </motion.div>
  );
};

// Checklist Component
const PrepChecklist = ({ tournament }) => {
  const [items, setItems] = useState([
    { id: 1, text: 'Complete Aff case', done: false },
    { id: 2, text: 'Complete Neg blocks', done: false },
    { id: 3, text: 'Update evidence files', done: false },
    { id: 4, text: 'Practice round with team', done: false },
    { id: 5, text: 'Review judge paradigms', done: false },
    { id: 6, text: 'Prepare extension files', done: false }
  ]);
  const [newItem, setNewItem] = useState('');

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, { id: Date.now(), text: newItem, done: false }]);
    setNewItem('');
  };

  const completedCount = items.filter(i => i.done).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-surface-offset">
            <CheckSquare className="w-5 h-5 text-ink" />
          </div>
          <div>
            <h3 className="text-accent-crimson font-semibold">Tournament Prep</h3>
            <p className="text-ink-muted text-sm">{tournament || 'Next Tournament'}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-accent-crimson">{completedCount}/{items.length}</span>
          <p className="text-ink-muted text-xs">tasks complete</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-[var(--card-bg)] mb-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full rounded-full "
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
        {items.map(item => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              item.done ? 'bg-surface-offset' : 'bg-[var(--card-bg)]/30 hover:bg-[var(--card-bg)]/50'
            }`}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleItem(item.id)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                item.done 
                  ? 'bg-surface-offset border-hairline' 
                  : 'border-hairline hover:border-hairline'
              }`}
            >
              {item.done && <Check className="w-3 h-3 text-accent-crimson" />}
            </motion.button>
            <span className={`flex-1 text-sm ${item.done ? 'text-ink-muted line-through' : 'text-ink-muted'}`}>
              {item.text}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Add item */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          placeholder="Add task..."
          className="flex-1 px-3 py-2 rounded-lg bg-[var(--card-bg)]/50 border border-hairline text-accent-crimson text-sm placeholder-slate-500 focus:border-hairline outline-none transition-all"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addItem}
          className="p-2 rounded-lg bg-[var(--card-bg)] text-ink-muted hover:text-accent-crimson transition-colors"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

// Main Component
const TeamCollaboration = () => {
  const { teams, createTeam } = useTeams();
  const [activeView, setActiveView] = useState('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Get the first team the user is a member of
  const team = teams?.[0];
  const members = team?.members || [];

  // Use actual team data - no mock data for new users
  const currentTeam = team;
  const teamMembers = members;

  const views = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'prep', label: 'Prep', icon: CheckSquare }
  ];

  // Check if user has a real team
  const hasTeam = !!team;

  if (!hasTeam) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-accent-crimson tracking-tight flex items-center gap-3">
              <div className="p-2.5 rounded-xl /20 to-blue-600/20 border border-hairline">
                <Users className="w-7 h-7 text-ink" />
              </div>
              Team Collaboration
            </h1>
            <p className="text-ink-muted mt-2">
              Work together to dominate every tournament
            </p>
          </div>

          <div className="glass-panel p-8">
            <EmptyTeam onCreateTeam={() => createTeam?.({ name: 'My Team' })} />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-accent-crimson tracking-tight flex items-center gap-3">
              <div className="p-2.5 rounded-xl /20 to-blue-600/20 border border-hairline">
                <Users className="w-7 h-7 text-ink" />
              </div>
              {currentTeam.name}
            </h1>
            <p className="text-ink-muted mt-2">
              {teamMembers.length} members • {teamMembers.filter(m => m.isOnline).length} online
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowInviteModal(true)}
            className="px-5 py-2.5 rounded-xl  text-accent-crimson font-medium shadow-lg shadow-cyan-500/25 flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Invite Member
          </motion.button>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[var(--bg-accent-crimson)]/50 border border-hairline/50 w-fit">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === view.id
                  ? 'bg-[var(--card-bg)] text-accent-crimson'
                  : 'text-ink-muted hover:text-accent-crimson hover:bg-[var(--card-bg)]/50'
              }`}
            >
              <view.icon className="w-4 h-4" />
              {view.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              {/* Members */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-lg font-semibold text-accent-crimson flex items-center gap-2">
                  <Users className="w-5 h-5 text-ink" />
                  Team Members
                </h2>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {teamMembers.map(member => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      isCurrentUser={member.name === 'You'}
                      onMessage={() => setActiveView('chat')}
                      onRemove={() => console.log('Remove member:', member.id)}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="glass-panel p-5">
                  <h3 className="text-accent-crimson font-semibold mb-4">Team Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-ink-muted">Win Rate</span>
                      <span className="text-accent-crimson font-bold">{currentTeam?.stats?.winRate || '—'}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink-muted">Tournaments</span>
                      <span className="text-accent-crimson font-bold">{currentTeam?.stats?.tournaments || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink-muted">Trophies</span>
                      <span className="text-accent-crimson font-bold flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-ink" /> {currentTeam?.stats?.trophies || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prep Checklist */}
                <PrepChecklist tournament={currentTeam?.nextTournament || "No upcoming tournament"} />
              </div>
            </motion.div>
          )}

          {activeView === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ChatPanel teamId={currentTeam.id} members={teamMembers} />
            </motion.div>
          )}

          {activeView === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-accent-crimson flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-ink" />
                  Shared Documents
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-[var(--card-bg)] text-accent-crimson text-sm font-medium hover:bg-surface-parchment transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </motion.button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {currentTeam.documents.map(doc => (
                  <DocumentCard key={doc.id} doc={doc} onClick={() => {}} />
                ))}
              </div>
            </motion.div>
          )}

          {activeView === 'prep' && (
            <motion.div
              key="prep"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <PrepChecklist tournament={currentTeam?.tournaments?.[0] || "Upcoming Tournament"} />
              <PrepChecklist tournament={currentTeam?.tournaments?.[1] || "Next Tournament"} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70  p-4"
            onClick={(e) => e.target === e.currentTarget && setShowInviteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-accent-crimson flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-ink" />
                  Invite Team Member
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 rounded-xl text-ink-muted hover:text-accent-crimson hover:bg-[var(--card-bg)] transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-muted mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="teammate@school.edu"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)]/50 border border-hairline text-accent-crimson placeholder-slate-500 focus:border-hairline focus:ring-2 focus:ring-hairline outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-muted mb-2">Role</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)]/50 border border-hairline text-accent-crimson focus:border-hairline outline-none transition-all">
                    <option value="novice">Novice</option>
                    <option value="jv">JV</option>
                    <option value="varsity">Varsity</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl  text-accent-crimson font-semibold shadow-lg shadow-cyan-500/25"
                >
                  Send Invitation
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeamCollaboration;
