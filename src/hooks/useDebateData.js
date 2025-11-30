/**
 * Debate Platform Hooks
 * Custom React hooks for data management
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as debateService from '../services/debateService';

// ============================================
// ANALYTICS HOOK
// ============================================

export const useAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await debateService.getAnalytics(user.uid);
      setAnalytics(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const saveDebate = async (debate) => {
    if (!user?.uid) throw new Error('Not authenticated');
    const id = await debateService.saveDebateRecord(user.uid, debate);
    await fetchAnalytics();
    return id;
  };

  return { analytics, loading, error, refetch: fetchAnalytics, saveDebate };
};

// ============================================
// OPPONENTS HOOK
// ============================================

export const useOpponents = () => {
  const { user } = useAuth();
  const [opponents, setOpponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOpponents = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await debateService.getOpponents(user.uid);
      setOpponents(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching opponents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchOpponents();
  }, [fetchOpponents]);

  const addOpponent = async (opponent) => {
    if (!user?.uid) throw new Error('Not authenticated');
    const id = await debateService.saveOpponent(user.uid, opponent);
    await fetchOpponents();
    return id;
  };

  const updateOpponent = async (opponentId, data) => {
    if (!user?.uid) throw new Error('Not authenticated');
    await debateService.updateOpponent(user.uid, opponentId, data);
    await fetchOpponents();
  };

  const deleteOpponent = async (opponentId) => {
    if (!user?.uid) throw new Error('Not authenticated');
    await debateService.deleteOpponent(user.uid, opponentId);
    await fetchOpponents();
  };

  const addNote = async (opponentId, note) => {
    if (!user?.uid) throw new Error('Not authenticated');
    await debateService.addOpponentNote(user.uid, opponentId, note);
    await fetchOpponents();
  };

  return {
    opponents,
    loading,
    error,
    refetch: fetchOpponents,
    addOpponent,
    updateOpponent,
    deleteOpponent,
    addNote
  };
};

// ============================================
// EVIDENCE LIBRARY HOOK
// ============================================

export const useEvidence = (initialFilters = {}) => {
  const { user } = useAuth();
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchEvidence = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await debateService.getEvidence(user.uid, filters);
      setEvidence(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching evidence:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, filters]);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  const addEvidence = async (card) => {
    if (!user?.uid) throw new Error('Not authenticated');
    const id = await debateService.saveEvidence(user.uid, card);
    await fetchEvidence();
    return id;
  };

  const updateEvidence = async (evidenceId, data) => {
    if (!user?.uid) throw new Error('Not authenticated');
    await debateService.updateEvidence(user.uid, evidenceId, data);
    await fetchEvidence();
  };

  const deleteEvidence = async (evidenceId) => {
    if (!user?.uid) throw new Error('Not authenticated');
    await debateService.deleteEvidence(user.uid, evidenceId);
    await fetchEvidence();
  };

  const trackUsage = async (evidenceId, debateId) => {
    if (!user?.uid) throw new Error('Not authenticated');
    await debateService.trackEvidenceUsage(user.uid, evidenceId, debateId);
    await fetchEvidence();
  };

  // Get all unique tags
  const allTags = [...new Set(evidence.flatMap(e => e.tags || []))];

  return {
    evidence,
    loading,
    error,
    filters,
    setFilters,
    allTags,
    refetch: fetchEvidence,
    addEvidence,
    updateEvidence,
    deleteEvidence,
    trackUsage
  };
};

// ============================================
// PRACTICE SESSIONS HOOK
// ============================================

export const usePractice = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [sessionsData, statsData] = await Promise.all([
        debateService.getPracticeSessions(user.uid, { limit: 50 }),
        debateService.getPracticeStats(user.uid)
      ]);
      setSessions(sessionsData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching practice data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveSession = async (session) => {
    if (!user?.uid) throw new Error('Not authenticated');
    const id = await debateService.savePracticeSession(user.uid, session);
    await fetchData();
    return id;
  };

  return {
    sessions,
    stats,
    loading,
    error,
    refetch: fetchData,
    saveSession
  };
};

// ============================================
// TEAMS HOOK
// ============================================

export const useTeams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeams = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await debateService.getUserTeams(user.uid);
      setTeams(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const createTeam = async (team) => {
    if (!user?.uid) throw new Error('Not authenticated');
    const id = await debateService.createTeam(user.uid, team);
    await fetchTeams();
    return id;
  };

  const joinTeam = async (inviteCode) => {
    if (!user?.uid) throw new Error('Not authenticated');
    const id = await debateService.joinTeamByCode(user.uid, inviteCode);
    await fetchTeams();
    return id;
  };

  return {
    teams,
    loading,
    error,
    refetch: fetchTeams,
    createTeam,
    joinTeam
  };
};

// ============================================
// TOURNAMENTS HOOK
// ============================================

export const useTournaments = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTournaments = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await debateService.getTournaments(user.uid);
      setTournaments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const addTournament = async (tournament) => {
    if (!user?.uid) throw new Error('Not authenticated');
    const id = await debateService.saveTournament(user.uid, tournament);
    await fetchTournaments();
    return id;
  };

  const updateTournament = async (tournamentId, data) => {
    if (!user?.uid) throw new Error('Not authenticated');
    await debateService.updateTournament(user.uid, tournamentId, data);
    await fetchTournaments();
  };

  const deleteTournament = async (tournamentId) => {
    if (!user?.uid) throw new Error('Not authenticated');
    await debateService.deleteTournament(user.uid, tournamentId);
    await fetchTournaments();
  };

  const addRound = async (tournamentId, round) => {
    if (!user?.uid) throw new Error('Not authenticated');
    await debateService.addTournamentRound(user.uid, tournamentId, round);
    await fetchTournaments();
  };

  return {
    tournaments,
    loading,
    error,
    refetch: fetchTournaments,
    addTournament,
    updateTournament,
    deleteTournament,
    addRound
  };
};

// ============================================
// JUDGE PREFERENCES HOOK
// ============================================

export const useJudges = () => {
  const { user } = useAuth();
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJudges = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await debateService.getJudgePreferences(user.uid);
      setJudges(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching judges:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchJudges();
  }, [fetchJudges]);

  const addJudge = async (judge) => {
    if (!user?.uid) throw new Error('Not authenticated');
    const id = await debateService.saveJudgePreference(user.uid, judge);
    await fetchJudges();
    return id;
  };

  const updateJudge = async (judgeId, data) => {
    if (!user?.uid) throw new Error('Not authenticated');
    await debateService.updateJudgePreference(user.uid, judgeId, data);
    await fetchJudges();
  };

  return {
    judges,
    loading,
    error,
    refetch: fetchJudges,
    addJudge,
    updateJudge
  };
};

// ============================================
// LOCAL STORAGE HOOK (for guest mode)
// ============================================

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
