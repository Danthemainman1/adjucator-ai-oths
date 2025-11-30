import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  History as HistoryIcon, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Gavel,
  Mic,
  Image,
  HelpCircle,
  Target,
  Brain,
  ChevronRight,
  ChevronDown,
  Calendar,
  Clock,
  X,
  FileJson,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useSessionHistory } from '../hooks/useSessionHistory';
import { formatRelativeTime, formatDate } from '../utils/helpers';

const TYPE_CONFIG = {
  judge: { 
    icon: Gavel, 
    label: 'Speech Analysis', 
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20'
  },
  board: { 
    icon: Image, 
    label: 'Board Evaluation', 
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20'
  },
  coach: { 
    icon: Mic, 
    label: 'Live Coaching', 
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20'
  },
  strategy: { 
    icon: Target, 
    label: 'Strategy', 
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20'
  },
  extemp: { 
    icon: HelpCircle, 
    label: 'Extemp Question', 
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20'
  },
  tone: { 
    icon: Brain, 
    label: 'Tone Analysis', 
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20'
  },
};

const SessionCard = ({ session, onView, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = TYPE_CONFIG[session.type] || TYPE_CONFIG.judge;
  const Icon = config.icon;

  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm overflow-hidden group">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-xl border ${config.bg}`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${config.bg} ${config.color}`}>
                {config.label}
              </span>
              {session.metadata?.speechType && (
                <span className="text-xs text-slate-500">
                  {session.metadata.speechType}
                </span>
              )}
            </div>
            
            <h3 className="font-medium text-white truncate">
              {session.title || session.metadata?.topic || 'Untitled Session'}
            </h3>
            
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(session.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(session.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              title="Delete session"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-500" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-800/60 p-4 animate-in slide-in-from-top-2">
          {/* Metadata */}
          {session.metadata && (
            <div className="flex flex-wrap gap-2 mb-4">
              {session.metadata.side && (
                <span className="text-xs px-2.5 py-1 bg-slate-800/50 rounded-lg text-slate-400 border border-slate-700/50">
                  {session.metadata.side}
                </span>
              )}
              {session.metadata.difficulty && (
                <span className="text-xs px-2.5 py-1 bg-slate-800/50 rounded-lg text-slate-400 border border-slate-700/50">
                  {session.metadata.difficulty} difficulty
                </span>
              )}
            </div>
          )}

          {/* Result Preview */}
          <div className="bg-slate-900/50 rounded-xl p-4 max-h-[400px] overflow-y-auto border border-slate-800/50">
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-cyan-400 prose-headings:font-semibold prose-a:text-cyan-400 prose-strong:text-white prose-table:border-collapse prose-th:border prose-th:border-slate-700 prose-td:border prose-td:border-slate-700 prose-th:p-3 prose-td:p-3 prose-th:bg-slate-800/50">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {session.result || 'No analysis result available'}
              </ReactMarkdown>
            </div>
          </div>

          {/* Input Preview for Extemp */}
          {session.type === 'extemp' && session.input?.question && (
            <div className="mt-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <h4 className="text-xs font-medium text-slate-500 mb-2">Generated Question</h4>
              <p className="text-white font-serif text-lg">"{session.input.question}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const HistoryPanel = () => {
  const { 
    history, 
    isLoading, 
    stats, 
    deleteSession, 
    clearHistory, 
    exportHistory, 
    importHistory 
  } = useSessionHistory();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = React.useRef(null);

  // Filter and search history
  const filteredHistory = history.filter(session => {
    const matchesType = filterType === 'all' || session.type === filterType;
    const matchesSearch = !searchQuery || 
      session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.metadata?.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.result?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await importHistory(file);
      setImportStatus(result);
      setTimeout(() => setImportStatus(null), 3000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Session History</h1>
          <p className="text-slate-400 mt-1">
            {stats.total} {stats.total === 1 ? 'session' : 'sessions'} recorded
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportHistory}
            disabled={history.length === 0}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50 border border-slate-800"
            title="Export history"
          >
            <Download className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"
            title="Import history"
          >
            <Upload className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-slate-800"
              title="Clear all history"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Import Status */}
      {importStatus && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm animate-in fade-in ${
          importStatus.success 
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {importStatus.success ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Imported {importStatus.count} sessions successfully
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5" />
              Import failed: {importStatus.error}
            </>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(TYPE_CONFIG).map(([type, config]) => {
          const Icon = config.icon;
          const count = stats.byType[type] || 0;
          return (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? 'all' : type)}
              className={`p-4 rounded-xl border text-left transition-all ${
                filterType === type 
                  ? 'border-cyan-500/30 bg-cyan-500/10 shadow-lg shadow-cyan-500/10' 
                  : 'border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/30 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${config.color}`} />
                <div>
                  <div className="text-xl font-bold text-white">{count}</div>
                  <div className="text-xs text-slate-500">{config.label}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all w-full sm:w-48"
        >
          <option value="all">All Types</option>
          {Object.entries(TYPE_CONFIG).map(([type, config]) => (
            <option key={type} value={type}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* Session List */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-4">
          {filteredHistory.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              onDelete={deleteSession}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
          {history.length === 0 ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
                <HistoryIcon className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Sessions Yet</h3>
              <p className="text-slate-500 max-w-md">
                Your analysis sessions will appear here. Try analyzing a speech, using the live coach, 
                or generating a strategy to get started!
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>
              <p className="text-slate-500">
                No sessions match your search criteria.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setFilterType('all'); }}
                className="mt-4 text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-xl font-bold">Clear All History?</h2>
            </div>
            <p className="text-slate-400 mb-6">
              This will permanently delete all {stats.total} sessions. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearHistory();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
