/**
 * Debate Platform Data Service
 * Comprehensive data management for all platform features
 */

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../utils/firebase';

// ============================================
// ANALYTICS & DEBATE RECORDS
// ============================================

export const saveDebateRecord = async (userId, record) => {
  const debatesRef = collection(db, 'users', userId, 'debates');
  const docRef = await addDoc(debatesRef, {
    ...record,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const getDebateRecords = async (userId, filters = {}) => {
  const debatesRef = collection(db, 'users', userId, 'debates');
  let q = query(debatesRef, orderBy('createdAt', 'desc'));
  
  if (filters.format) {
    q = query(q, where('format', '==', filters.format));
  }
  if (filters.limit) {
    q = query(q, limit(filters.limit));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAnalytics = async (userId) => {
  const debates = await getDebateRecords(userId);
  
  // Calculate win/loss by format
  const formatStats = {};
  const tournamentStats = {};
  const monthlyStats = {};
  const opponentStats = {};
  
  debates.forEach(debate => {
    // Format stats
    if (!formatStats[debate.format]) {
      formatStats[debate.format] = { wins: 0, losses: 0, total: 0 };
    }
    formatStats[debate.format].total++;
    if (debate.result === 'win') formatStats[debate.format].wins++;
    else if (debate.result === 'loss') formatStats[debate.format].losses++;
    
    // Tournament stats
    if (debate.tournament) {
      if (!tournamentStats[debate.tournament]) {
        tournamentStats[debate.tournament] = { wins: 0, losses: 0, total: 0, speakerPoints: [] };
      }
      tournamentStats[debate.tournament].total++;
      if (debate.result === 'win') tournamentStats[debate.tournament].wins++;
      else tournamentStats[debate.tournament].losses++;
      if (debate.speakerPoints) tournamentStats[debate.tournament].speakerPoints.push(debate.speakerPoints);
    }
    
    // Monthly trends
    const date = debate.createdAt?.toDate?.() || new Date(debate.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = { wins: 0, losses: 0, total: 0, avgScore: [] };
    }
    monthlyStats[monthKey].total++;
    if (debate.result === 'win') monthlyStats[monthKey].wins++;
    else monthlyStats[monthKey].losses++;
    if (debate.score) monthlyStats[monthKey].avgScore.push(debate.score);
    
    // Opponent stats
    if (debate.opponent) {
      if (!opponentStats[debate.opponent]) {
        opponentStats[debate.opponent] = { wins: 0, losses: 0, total: 0 };
      }
      opponentStats[debate.opponent].total++;
      if (debate.result === 'win') opponentStats[debate.opponent].wins++;
      else opponentStats[debate.opponent].losses++;
    }
  });
  
  return {
    totalDebates: debates.length,
    totalWins: debates.filter(d => d.result === 'win').length,
    totalLosses: debates.filter(d => d.result === 'loss').length,
    winRate: debates.length > 0 ? (debates.filter(d => d.result === 'win').length / debates.length * 100).toFixed(1) : 0,
    formatStats,
    tournamentStats,
    monthlyStats,
    opponentStats,
    recentDebates: debates.slice(0, 10)
  };
};

// ============================================
// OPPONENT INTELLIGENCE
// ============================================

export const saveOpponent = async (userId, opponent) => {
  const opponentsRef = collection(db, 'users', userId, 'opponents');
  const docRef = await addDoc(opponentsRef, {
    ...opponent,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateOpponent = async (userId, opponentId, data) => {
  const opponentRef = doc(db, 'users', userId, 'opponents', opponentId);
  await updateDoc(opponentRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const getOpponents = async (userId) => {
  const opponentsRef = collection(db, 'users', userId, 'opponents');
  const q = query(opponentsRef, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getOpponentById = async (userId, opponentId) => {
  const opponentRef = doc(db, 'users', userId, 'opponents', opponentId);
  const snapshot = await getDoc(opponentRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const deleteOpponent = async (userId, opponentId) => {
  const opponentRef = doc(db, 'users', userId, 'opponents', opponentId);
  await deleteDoc(opponentRef);
};

export const addOpponentNote = async (userId, opponentId, note) => {
  const opponentRef = doc(db, 'users', userId, 'opponents', opponentId);
  await updateDoc(opponentRef, {
    notes: arrayUnion({
      id: Date.now().toString(),
      content: note,
      createdAt: new Date().toISOString()
    }),
    updatedAt: serverTimestamp()
  });
};

// ============================================
// EVIDENCE LIBRARY
// ============================================

export const saveEvidence = async (userId, evidence) => {
  const evidenceRef = collection(db, 'users', userId, 'evidence');
  const docRef = await addDoc(evidenceRef, {
    ...evidence,
    usageCount: 0,
    usedInDebates: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateEvidence = async (userId, evidenceId, data) => {
  const evidenceRef = doc(db, 'users', userId, 'evidence', evidenceId);
  await updateDoc(evidenceRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const getEvidence = async (userId, filters = {}) => {
  const evidenceRef = collection(db, 'users', userId, 'evidence');
  let q = query(evidenceRef, orderBy('createdAt', 'desc'));
  
  if (filters.limit) {
    q = query(q, limit(filters.limit));
  }
  
  const snapshot = await getDocs(q);
  let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Client-side filtering for tags (Firestore doesn't support array-contains with orderBy well)
  if (filters.tag) {
    results = results.filter(e => e.tags?.includes(filters.tag));
  }
  if (filters.search) {
    const search = filters.search.toLowerCase();
    results = results.filter(e => 
      e.title?.toLowerCase().includes(search) ||
      e.content?.toLowerCase().includes(search) ||
      e.source?.toLowerCase().includes(search)
    );
  }
  
  return results;
};

export const getEvidenceById = async (userId, evidenceId) => {
  const evidenceRef = doc(db, 'users', userId, 'evidence', evidenceId);
  const snapshot = await getDoc(evidenceRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const deleteEvidence = async (userId, evidenceId) => {
  const evidenceRef = doc(db, 'users', userId, 'evidence', evidenceId);
  await deleteDoc(evidenceRef);
};

export const trackEvidenceUsage = async (userId, evidenceId, debateId) => {
  const evidenceRef = doc(db, 'users', userId, 'evidence', evidenceId);
  const evidence = await getDoc(evidenceRef);
  if (evidence.exists()) {
    await updateDoc(evidenceRef, {
      usageCount: (evidence.data().usageCount || 0) + 1,
      usedInDebates: arrayUnion(debateId),
      lastUsed: serverTimestamp()
    });
  }
};

// ============================================
// PRACTICE & DRILLS
// ============================================

export const savePracticeSession = async (userId, session) => {
  const practiceRef = collection(db, 'users', userId, 'practice');
  const docRef = await addDoc(practiceRef, {
    ...session,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const getPracticeSessions = async (userId, filters = {}) => {
  const practiceRef = collection(db, 'users', userId, 'practice');
  let q = query(practiceRef, orderBy('createdAt', 'desc'));
  
  if (filters.type) {
    q = query(q, where('type', '==', filters.type));
  }
  if (filters.limit) {
    q = query(q, limit(filters.limit));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getPracticeStats = async (userId) => {
  const sessions = await getPracticeSessions(userId);
  
  const stats = {
    totalSessions: sessions.length,
    totalTime: sessions.reduce((acc, s) => acc + (s.duration || 0), 0),
    byType: {},
    streak: 0,
    avgScore: 0
  };
  
  sessions.forEach(session => {
    if (!stats.byType[session.type]) {
      stats.byType[session.type] = { count: 0, totalScore: 0 };
    }
    stats.byType[session.type].count++;
    if (session.score) stats.byType[session.type].totalScore += session.score;
  });
  
  // Calculate average score
  const scoredSessions = sessions.filter(s => s.score);
  if (scoredSessions.length > 0) {
    stats.avgScore = (scoredSessions.reduce((acc, s) => acc + s.score, 0) / scoredSessions.length).toFixed(1);
  }
  
  // Calculate streak
  const today = new Date();
  let streakDays = 0;
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    const hasSession = sessions.some(s => {
      const sessionDate = s.createdAt?.toDate?.() || new Date(s.createdAt);
      return sessionDate.toISOString().split('T')[0] === dateStr;
    });
    if (hasSession) streakDays++;
    else if (i > 0) break;
  }
  stats.streak = streakDays;
  
  return stats;
};

// ============================================
// TEAM COLLABORATION
// ============================================

export const createTeam = async (userId, team) => {
  const teamsRef = collection(db, 'teams');
  const docRef = await addDoc(teamsRef, {
    ...team,
    ownerId: userId,
    members: [{ id: userId, role: 'owner', joinedAt: new Date().toISOString() }],
    inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  // Add team reference to user
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    teams: arrayUnion(docRef.id)
  });
  
  return docRef.id;
};

export const getTeam = async (teamId) => {
  const teamRef = doc(db, 'teams', teamId);
  const snapshot = await getDoc(teamRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const getUserTeams = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return [];
  
  const teamIds = userSnap.data().teams || [];
  const teams = await Promise.all(teamIds.map(id => getTeam(id)));
  return teams.filter(Boolean);
};

export const joinTeamByCode = async (userId, inviteCode) => {
  const teamsRef = collection(db, 'teams');
  const q = query(teamsRef, where('inviteCode', '==', inviteCode.toUpperCase()));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    throw new Error('Invalid invite code');
  }
  
  const teamDoc = snapshot.docs[0];
  const teamData = teamDoc.data();
  
  // Check if already a member
  if (teamData.members.some(m => m.id === userId)) {
    throw new Error('Already a member of this team');
  }
  
  // Add member to team
  await updateDoc(doc(db, 'teams', teamDoc.id), {
    members: arrayUnion({
      id: userId,
      role: 'member',
      joinedAt: new Date().toISOString()
    }),
    updatedAt: serverTimestamp()
  });
  
  // Add team to user
  await updateDoc(doc(db, 'users', userId), {
    teams: arrayUnion(teamDoc.id)
  });
  
  return teamDoc.id;
};

export const saveTeamDocument = async (teamId, document) => {
  const docsRef = collection(db, 'teams', teamId, 'documents');
  const docRef = await addDoc(docsRef, {
    ...document,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const getTeamDocuments = async (teamId) => {
  const docsRef = collection(db, 'teams', teamId, 'documents');
  const q = query(docsRef, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addTeamComment = async (teamId, documentId, comment) => {
  const commentsRef = collection(db, 'teams', teamId, 'documents', documentId, 'comments');
  const docRef = await addDoc(commentsRef, {
    ...comment,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

// ============================================
// TOURNAMENT MANAGEMENT
// ============================================

export const saveTournament = async (userId, tournament) => {
  const tournamentsRef = collection(db, 'users', userId, 'tournaments');
  const docRef = await addDoc(tournamentsRef, {
    ...tournament,
    rounds: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateTournament = async (userId, tournamentId, data) => {
  const tournamentRef = doc(db, 'users', userId, 'tournaments', tournamentId);
  await updateDoc(tournamentRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const getTournaments = async (userId) => {
  const tournamentsRef = collection(db, 'users', userId, 'tournaments');
  const q = query(tournamentsRef, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getTournamentById = async (userId, tournamentId) => {
  const tournamentRef = doc(db, 'users', userId, 'tournaments', tournamentId);
  const snapshot = await getDoc(tournamentRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const deleteTournament = async (userId, tournamentId) => {
  const tournamentRef = doc(db, 'users', userId, 'tournaments', tournamentId);
  await deleteDoc(tournamentRef);
};

export const addTournamentRound = async (userId, tournamentId, round) => {
  const tournamentRef = doc(db, 'users', userId, 'tournaments', tournamentId);
  await updateDoc(tournamentRef, {
    rounds: arrayUnion({
      id: Date.now().toString(),
      ...round,
      createdAt: new Date().toISOString()
    }),
    updatedAt: serverTimestamp()
  });
};

// Judge preferences
export const saveJudgePreference = async (userId, judge) => {
  const judgesRef = collection(db, 'users', userId, 'judges');
  const docRef = await addDoc(judgesRef, {
    ...judge,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const getJudgePreferences = async (userId) => {
  const judgesRef = collection(db, 'users', userId, 'judges');
  const q = query(judgesRef, orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateJudgePreference = async (userId, judgeId, data) => {
  const judgeRef = doc(db, 'users', userId, 'judges', judgeId);
  await updateDoc(judgeRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};
