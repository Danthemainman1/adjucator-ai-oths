import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Save,
  Trash2,
  Plus,
  Search,
  Clock,
  Check,
  ChevronRight
} from 'lucide-react';

const NotesPanel = () => {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('debate-notes');
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotes(parsed);
      if (parsed.length > 0 && !activeNoteId) {
        setActiveNoteId(parsed[0].id);
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('debate-notes', JSON.stringify(notes));
    }
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const createNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (field, value) => {
    setNotes(notes.map(note => 
      note.id === activeNoteId 
        ? { ...note, [field]: value, updatedAt: new Date().toISOString() }
        : note
    ));
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 500);
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const deleteNote = (id) => {
    const filtered = notes.filter(n => n.id !== id);
    setNotes(filtered);
    localStorage.setItem('debate-notes', JSON.stringify(filtered));
    if (activeNoteId === id) {
      setActiveNoteId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Notes Panel</h1>
              <p className="text-slate-400 text-sm">Save debate notes and key points</p>
            </div>
          </div>
          <button
            onClick={createNote}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes List */}
          <div className="lg:col-span-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  {notes.length === 0 ? (
                    <>
                      <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p>No notes yet</p>
                      <p className="text-sm">Click "New Note" to get started</p>
                    </>
                  ) : (
                    <p>No matching notes</p>
                  )}
                </div>
              ) : (
                filteredNotes.map(note => (
                  <motion.div
                    key={note.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      activeNoteId === note.id
                        ? 'bg-emerald-500/20 border border-emerald-500/50'
                        : 'bg-slate-900/50 border border-transparent hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {note.title || 'Untitled'}
                        </h3>
                        <p className="text-slate-400 text-sm truncate">
                          {note.content.slice(0, 50) || 'No content'}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {formatDate(note.updatedAt)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 text-center text-slate-500 text-sm">
              {notes.length} note{notes.length !== 1 ? 's' : ''} saved
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            {activeNote ? (
              <div className="h-full flex flex-col">
                {/* Title */}
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => updateNote('title', e.target.value)}
                    placeholder="Note title..."
                    className="flex-1 text-xl font-semibold bg-transparent text-white placeholder-slate-500 focus:outline-none"
                  />
                  {saveStatus && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1 text-sm"
                    >
                      {saveStatus === 'saving' ? (
                        <span className="text-slate-400">Saving...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Saved</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <textarea
                  value={activeNote.content}
                  onChange={(e) => updateNote('content', e.target.value)}
                  placeholder="Write your debate notes here...

• Key arguments
• Evidence points
• Rebuttals
• Cross-examination questions
• Strategy notes"
                  className="flex-1 min-h-[500px] w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none font-mono text-sm leading-relaxed"
                />

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
                  <span>Last updated: {formatDate(activeNote.updatedAt)}</span>
                  <span>{activeNote.content.length} characters</span>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[500px] flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg">Select a note or create a new one</p>
                  <button
                    onClick={createNote}
                    className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;
