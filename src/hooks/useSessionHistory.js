import { useState, useEffect, useCallback } from 'react';
import { storage, generateId } from '../utils/helpers';

const HISTORY_KEY = 'adjudicator_history';
const MAX_HISTORY_ITEMS = 50;

/**
 * Custom hook for managing session history
 * Persists analysis sessions to localStorage and provides CRUD operations
 */
export function useSessionHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from storage on mount
  useEffect(() => {
    const stored = storage.get(HISTORY_KEY, []);
    // Defer state update to next tick to avoid synchronous update in effect
    setTimeout(() => {
        setHistory(stored);
        setIsLoading(false);
    }, 0);
  }, []);

  // Save history to storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      storage.set(HISTORY_KEY, history);
    }
  }, [history, isLoading]);

  /**
   * Add a new session to history
   * @param {Object} session - Session data
   * @param {string} session.type - Type of analysis (judge, board, coach, extemp)
   * @param {string} session.title - Session title/topic
   * @param {Object} session.input - Input data (transcript, images, audio info)
   * @param {string} session.result - AI analysis result
   * @param {Object} session.metadata - Additional metadata (speechType, side, etc.)
   */
  const addSession = useCallback((session) => {
    const newSession = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...session,
    };

    setHistory(prev => {
      const updated = [newSession, ...prev];
      // Keep only the most recent items
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });

    return newSession.id;
  }, []);

  /**
   * Delete a session from history
   * @param {string} id - Session ID to delete
   */
  const deleteSession = useCallback((id) => {
    setHistory(prev => prev.filter(session => session.id !== id));
  }, []);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  /**
   * Get a single session by ID
   * @param {string} id - Session ID
   */
  const getSession = useCallback((id) => {
    return history.find(session => session.id === id);
  }, [history]);

  /**
   * Get sessions filtered by type
   * @param {string} type - Session type to filter by
   */
  const getSessionsByType = useCallback((type) => {
    return history.filter(session => session.type === type);
  }, [history]);

  /**
   * Update session with additional data (e.g., notes)
   * @param {string} id - Session ID
   * @param {Object} updates - Data to update
   */
  const updateSession = useCallback((id, updates) => {
    setHistory(prev => prev.map(session => 
      session.id === id 
        ? { ...session, ...updates, updatedAt: new Date().toISOString() }
        : session
    ));
  }, []);

  /**
   * Export history as JSON
   */
  const exportHistory = useCallback(() => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `adjudicator-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [history]);

  /**
   * Import history from JSON file
   * @param {File} file - JSON file to import
   */
  const importHistory = useCallback(async (file) => {
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      if (Array.isArray(imported)) {
        setHistory(prev => {
          // Merge imported with existing, removing duplicates by ID
          const existingIds = new Set(prev.map(s => s.id));
          const newSessions = imported.filter(s => !existingIds.has(s.id));
          return [...newSessions, ...prev].slice(0, MAX_HISTORY_ITEMS);
        });
        return { success: true, count: imported.length };
      }
      return { success: false, error: 'Invalid format' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, []);

  // Statistics
  const stats = {
    total: history.length,
    byType: {
      judge: history.filter(s => s.type === 'judge').length,
      board: history.filter(s => s.type === 'board').length,
      coach: history.filter(s => s.type === 'coach').length,
      strategy: history.filter(s => s.type === 'strategy').length,
      extemp: history.filter(s => s.type === 'extemp').length,
      tone: history.filter(s => s.type === 'tone').length,
    },
    lastSession: history[0] || null,
  };

  return {
    history,
    isLoading,
    stats,
    addSession,
    deleteSession,
    clearHistory,
    getSession,
    getSessionsByType,
    updateSession,
    exportHistory,
    importHistory,
  };
}

export default useSessionHistory;
