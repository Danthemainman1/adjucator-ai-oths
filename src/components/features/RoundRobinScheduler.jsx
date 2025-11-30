import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Plus,
  Trash2,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  Printer,
  RefreshCw,
  Shuffle,
  Eye,
  ChevronDown,
  ChevronRight,
  X,
  Edit2,
  Copy,
  Grid3X3,
  List,
  Trophy,
  BarChart3,
  Settings,
  Filter,
  Search,
  FileText
} from 'lucide-react';

// Format presets
const FORMAT_PRESETS = {
  policy: { name: 'Policy', roundTime: 90, prepTime: 10, breakTime: 15 },
  ld: { name: 'Lincoln Douglas', roundTime: 45, prepTime: 5, breakTime: 10 },
  pf: { name: 'Public Forum', roundTime: 40, prepTime: 5, breakTime: 10 },
  congress: { name: 'Congress', roundTime: 60, prepTime: 0, breakTime: 15 },
  parli: { name: 'Parliamentary', roundTime: 35, prepTime: 15, breakTime: 10 }
};

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Format time display
const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
};

// Round-robin algorithm to generate matchups
const generateRoundRobinMatchups = (teams, roundsPerPairing = 1) => {
  if (teams.length < 2) return [];
  
  const teamList = [...teams];
  // Add bye if odd number of teams
  if (teamList.length % 2 !== 0) {
    teamList.push({ id: 'bye', name: 'BYE', school: '' });
  }
  
  const numTeams = teamList.length;
  const numRounds = (numTeams - 1) * roundsPerPairing;
  const matchesPerRound = numTeams / 2;
  const rounds = [];
  
  // Circle method for round-robin
  for (let round = 0; round < numRounds; round++) {
    const matches = [];
    const roundTeams = [...teamList];
    
    // Rotate teams (keep first team fixed)
    const rotations = round % (numTeams - 1);
    for (let r = 0; r < rotations; r++) {
      const last = roundTeams.pop();
      roundTeams.splice(1, 0, last);
    }
    
    // Generate matches for this round
    for (let i = 0; i < matchesPerRound; i++) {
      const team1 = roundTeams[i];
      const team2 = roundTeams[numTeams - 1 - i];
      
      // Skip bye matches
      if (team1.id === 'bye' || team2.id === 'bye') continue;
      
      // Alternate home/away (aff/neg) based on round
      const affTeam = round % 2 === 0 ? team1 : team2;
      const negTeam = round % 2 === 0 ? team2 : team1;
      
      matches.push({
        id: generateId(),
        roundNumber: round + 1,
        matchNumber: i + 1,
        affTeam: affTeam.id,
        negTeam: negTeam.id,
        venue: null,
        timeSlot: null,
        judge: null,
        status: 'scheduled',
        winner: null,
        notes: ''
      });
    }
    
    rounds.push({
      id: generateId(),
      roundNumber: round + 1,
      matches,
      startTime: null,
      status: 'pending'
    });
  }
  
  return rounds;
};

// Detect conflicts
const detectConflicts = (rounds, teams, venues) => {
  const conflicts = [];
  
  rounds.forEach((round, roundIdx) => {
    const roundMatches = round.matches;
    
    // Check for team double-booking within same round
    const teamsInRound = new Map();
    roundMatches.forEach((match) => {
      [match.affTeam, match.negTeam].forEach((teamId) => {
        if (teamsInRound.has(teamId)) {
          conflicts.push({
            type: 'team-double-book',
            severity: 'error',
            roundNumber: round.roundNumber,
            message: `Team "${teams.find(t => t.id === teamId)?.name}" has multiple matches in Round ${round.roundNumber}`
          });
        }
        teamsInRound.set(teamId, true);
      });
    });
    
    // Check for venue double-booking
    if (round.startTime) {
      const venuesInSlot = new Map();
      roundMatches.forEach((match) => {
        if (match.venue && match.timeSlot === round.startTime) {
          if (venuesInSlot.has(match.venue)) {
            conflicts.push({
              type: 'venue-double-book',
              severity: 'error',
              roundNumber: round.roundNumber,
              message: `Venue "${venues.find(v => v.id === match.venue)?.name}" is double-booked in Round ${round.roundNumber}`
            });
          }
          venuesInSlot.set(match.venue, true);
        }
      });
    }
    
    // Check for insufficient venues
    const availableVenues = venues.filter(v => v.available).length;
    if (roundMatches.length > availableVenues && availableVenues > 0) {
      conflicts.push({
        type: 'insufficient-venues',
        severity: 'warning',
        roundNumber: round.roundNumber,
        message: `Round ${round.roundNumber} has ${roundMatches.length} matches but only ${availableVenues} venues available`
      });
    }
  });
  
  return conflicts;
};

// Team Input Component
const TeamInput = ({ team, onChange, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-2"
    >
      <Users className="w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={team.name}
        onChange={(e) => onChange({ ...team, name: e.target.value })}
        placeholder="Team name..."
        className="flex-1 bg-transparent text-white text-sm focus:outline-none"
      />
      <input
        type="text"
        value={team.school || ''}
        onChange={(e) => onChange({ ...team, school: e.target.value })}
        placeholder="School..."
        className="w-32 bg-transparent text-slate-400 text-sm focus:outline-none"
      />
      <button
        onClick={onDelete}
        className="p-1 text-slate-400 hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Venue Input Component
const VenueInput = ({ venue, onChange, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-2"
    >
      <MapPin className="w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={venue.name}
        onChange={(e) => onChange({ ...venue, name: e.target.value })}
        placeholder="Room/Venue name..."
        className="flex-1 bg-transparent text-white text-sm focus:outline-none"
      />
      <label className="flex items-center gap-1 text-xs text-slate-400">
        <input
          type="checkbox"
          checked={venue.available}
          onChange={(e) => onChange({ ...venue, available: e.target.checked })}
          className="rounded border-slate-600"
        />
        Available
      </label>
      <button
        onClick={onDelete}
        className="p-1 text-slate-400 hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Match Card Component
const MatchCard = ({ match, teams, venues, onUpdate, onDelete, compact = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const affTeam = teams.find(t => t.id === match.affTeam);
  const negTeam = teams.find(t => t.id === match.negTeam);
  const venue = venues.find(v => v.id === match.venue);

  const statusColors = {
    scheduled: 'bg-slate-600 text-slate-300',
    in_progress: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400'
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between bg-slate-700/30 rounded-lg p-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-medium">{affTeam?.name || '?'}</span>
          <span className="text-slate-500">vs</span>
          <span className="text-orange-400 font-medium">{negTeam?.name || '?'}</span>
        </div>
        {venue && (
          <span className="text-slate-500 text-xs">{venue.name}</span>
        )}
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-500">Match #{match.matchNumber}</span>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs ${statusColors[match.status]}`}>
              {match.status.replace('_', ' ')}
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Aff Team */}
          <div className="flex-1 text-center">
            <div className="text-xs text-cyan-400 uppercase tracking-wide mb-1">Aff</div>
            <div className="font-semibold text-white">{affTeam?.name || 'TBD'}</div>
            {affTeam?.school && (
              <div className="text-xs text-slate-500">{affTeam.school}</div>
            )}
          </div>

          <div className="text-slate-500 font-bold">vs</div>

          {/* Neg Team */}
          <div className="flex-1 text-center">
            <div className="text-xs text-orange-400 uppercase tracking-wide mb-1">Neg</div>
            <div className="font-semibold text-white">{negTeam?.name || 'TBD'}</div>
            {negTeam?.school && (
              <div className="text-xs text-slate-500">{negTeam.school}</div>
            )}
          </div>
        </div>

        {/* Venue & Time */}
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-400">
          {venue && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {venue.name}
            </div>
          )}
          {match.timeSlot && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {match.timeSlot}
            </div>
          )}
        </div>

        {/* Winner indicator */}
        {match.winner && (
          <div className="mt-3 text-center">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
              <Trophy className="w-3 h-3" />
              Winner: {teams.find(t => t.id === match.winner)?.name}
            </span>
          </div>
        )}
      </div>

      {/* Edit Panel */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700"
          >
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Venue</label>
                  <select
                    value={match.venue || ''}
                    onChange={(e) => onUpdate({ ...match, venue: e.target.value || null })}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white text-sm px-2 py-1 rounded focus:outline-none"
                  >
                    <option value="">Select venue...</option>
                    {venues.filter(v => v.available).map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Status</label>
                  <select
                    value={match.status}
                    onChange={(e) => onUpdate({ ...match, status: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white text-sm px-2 py-1 rounded focus:outline-none"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {match.status === 'completed' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Winner</label>
                  <select
                    value={match.winner || ''}
                    onChange={(e) => onUpdate({ ...match, winner: e.target.value || null })}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white text-sm px-2 py-1 rounded focus:outline-none"
                  >
                    <option value="">Select winner...</option>
                    <option value={match.affTeam}>{affTeam?.name} (Aff)</option>
                    <option value={match.negTeam}>{negTeam?.name} (Neg)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs text-slate-400 mb-1">Notes</label>
                <input
                  type="text"
                  value={match.notes}
                  onChange={(e) => onUpdate({ ...match, notes: e.target.value })}
                  placeholder="Match notes..."
                  className="w-full bg-slate-700/50 border border-slate-600 text-white text-sm px-2 py-1 rounded focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Round Card Component
const RoundCard = ({ round, teams, venues, onUpdateMatch, onUpdateRound, expanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  const completedMatches = round.matches.filter(m => m.status === 'completed').length;
  const progress = round.matches.length > 0 ? (completedMatches / round.matches.length) * 100 : 0;

  return (
    <motion.div
      layout
      className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
    >
      {/* Round Header */}
      <div
        className="p-4 cursor-pointer hover:bg-slate-800/80 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-1 text-slate-400">
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            <div>
              <h3 className="font-semibold text-white">Round {round.roundNumber}</h3>
              <p className="text-xs text-slate-400">
                {round.matches.length} matches • {completedMatches} completed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {round.startTime && (
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                {round.startTime}
              </div>
            )}
            
            {/* Progress bar */}
            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={`h-full ${
                  progress === 100 ? 'bg-green-500' :
                  progress > 0 ? 'bg-yellow-500' : 'bg-slate-600'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Round Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700"
          >
            {/* Round Settings */}
            <div className="p-4 bg-slate-800/30 flex items-center gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Start Time</label>
                <input
                  type="time"
                  value={round.startTime || ''}
                  onChange={(e) => onUpdateRound({ ...round, startTime: e.target.value })}
                  className="bg-slate-700/50 border border-slate-600 text-white text-sm px-2 py-1 rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Status</label>
                <select
                  value={round.status}
                  onChange={(e) => onUpdateRound({ ...round, status: e.target.value })}
                  className="bg-slate-700/50 border border-slate-600 text-white text-sm px-2 py-1 rounded focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Matches Grid */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {round.matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  teams={teams}
                  venues={venues}
                  onUpdate={(updated) => onUpdateMatch(round.id, match.id, updated)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Bracket View Component
const BracketView = ({ rounds, teams, venues }) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-6 min-w-max p-4">
        {rounds.map((round) => (
          <div key={round.id} className="w-64 flex-shrink-0">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-white">Round {round.roundNumber}</h3>
              {round.startTime && (
                <p className="text-xs text-slate-400">{round.startTime}</p>
              )}
            </div>
            <div className="space-y-3">
              {round.matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  teams={teams}
                  venues={venues}
                  onUpdate={() => {}}
                  compact
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Standings Component
const StandingsView = ({ rounds, teams }) => {
  const standings = useMemo(() => {
    const stats = new Map();
    
    teams.forEach((team) => {
      stats.set(team.id, {
        team,
        wins: 0,
        losses: 0,
        affWins: 0,
        negWins: 0,
        totalMatches: 0
      });
    });
    
    rounds.forEach((round) => {
      round.matches.forEach((match) => {
        if (match.status === 'completed' && match.winner) {
          const affStats = stats.get(match.affTeam);
          const negStats = stats.get(match.negTeam);
          
          if (affStats) {
            affStats.totalMatches++;
            if (match.winner === match.affTeam) {
              affStats.wins++;
              affStats.affWins++;
            } else {
              affStats.losses++;
            }
          }
          
          if (negStats) {
            negStats.totalMatches++;
            if (match.winner === match.negTeam) {
              negStats.wins++;
              negStats.negWins++;
            } else {
              negStats.losses++;
            }
          }
        }
      });
    });
    
    return Array.from(stats.values())
      .sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return a.losses - b.losses;
      });
  }, [rounds, teams]);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Current Standings
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr className="text-left text-xs text-slate-400 uppercase tracking-wide">
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3">School</th>
              <th className="px-4 py-3 text-center">W</th>
              <th className="px-4 py-3 text-center">L</th>
              <th className="px-4 py-3 text-center">Aff W</th>
              <th className="px-4 py-3 text-center">Neg W</th>
              <th className="px-4 py-3 text-center">Win %</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((stat, idx) => {
              const winPct = stat.totalMatches > 0 
                ? ((stat.wins / stat.totalMatches) * 100).toFixed(0) 
                : '-';
              
              return (
                <tr key={stat.team.id} className="border-t border-slate-700/50 hover:bg-slate-700/30">
                  <td className="px-4 py-3">
                    <span className={`font-bold ${
                      idx === 0 ? 'text-yellow-400' :
                      idx === 1 ? 'text-slate-300' :
                      idx === 2 ? 'text-orange-400' :
                      'text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{stat.team.name}</td>
                  <td className="px-4 py-3 text-slate-400">{stat.team.school || '-'}</td>
                  <td className="px-4 py-3 text-center text-green-400 font-medium">{stat.wins}</td>
                  <td className="px-4 py-3 text-center text-red-400 font-medium">{stat.losses}</td>
                  <td className="px-4 py-3 text-center text-cyan-400">{stat.affWins}</td>
                  <td className="px-4 py-3 text-center text-orange-400">{stat.negWins}</td>
                  <td className="px-4 py-3 text-center text-slate-300">
                    {winPct !== '-' ? `${winPct}%` : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Component
const RoundRobinScheduler = () => {
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [format, setFormat] = useState('pf');
  const [tournamentName, setTournamentName] = useState('Tournament');
  const [tournamentDate, setTournamentDate] = useState('');
  const [viewMode, setViewMode] = useState('rounds'); // rounds, bracket, standings
  const [showSetup, setShowSetup] = useState(true);

  // Calculate conflicts
  const conflicts = useMemo(() => detectConflicts(rounds, teams, venues), [rounds, teams, venues]);
  const errorCount = conflicts.filter(c => c.severity === 'error').length;
  const warningCount = conflicts.filter(c => c.severity === 'warning').length;

  // Team management
  const addTeam = () => {
    setTeams(prev => [...prev, { id: generateId(), name: '', school: '' }]);
  };

  const updateTeam = (teamId, updated) => {
    setTeams(prev => prev.map(t => t.id === teamId ? updated : t));
  };

  const deleteTeam = (teamId) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  // Venue management
  const addVenue = () => {
    setVenues(prev => [...prev, { id: generateId(), name: '', available: true }]);
  };

  const updateVenue = (venueId, updated) => {
    setVenues(prev => prev.map(v => v.id === venueId ? updated : v));
  };

  const deleteVenue = (venueId) => {
    setVenues(prev => prev.filter(v => v.id !== venueId));
  };

  // Generate schedule
  const generateSchedule = () => {
    const validTeams = teams.filter(t => t.name.trim());
    if (validTeams.length < 2) return;

    const newRounds = generateRoundRobinMatchups(validTeams);
    
    // Auto-assign venues
    const availableVenues = venues.filter(v => v.available);
    newRounds.forEach((round) => {
      round.matches.forEach((match, idx) => {
        if (availableVenues[idx % availableVenues.length]) {
          match.venue = availableVenues[idx % availableVenues.length].id;
        }
      });
    });

    setRounds(newRounds);
    setShowSetup(false);
  };

  // Shuffle matchups
  const shuffleMatchups = () => {
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
    const newRounds = generateRoundRobinMatchups(shuffledTeams.filter(t => t.name.trim()));
    
    // Preserve venue assignments
    const availableVenues = venues.filter(v => v.available);
    newRounds.forEach((round) => {
      round.matches.forEach((match, idx) => {
        if (availableVenues[idx % availableVenues.length]) {
          match.venue = availableVenues[idx % availableVenues.length].id;
        }
      });
    });

    setRounds(newRounds);
  };

  // Update match
  const updateMatch = (roundId, matchId, updated) => {
    setRounds(prev => prev.map(r => 
      r.id === roundId 
        ? { ...r, matches: r.matches.map(m => m.id === matchId ? updated : m) }
        : r
    ));
  };

  // Update round
  const updateRound = (updated) => {
    setRounds(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  // Auto-assign time slots
  const autoAssignTimes = () => {
    const formatSettings = FORMAT_PRESETS[format];
    const baseTime = 9 * 60; // 9:00 AM in minutes
    let currentTime = baseTime;

    setRounds(prev => prev.map((round, idx) => {
      const hours = Math.floor(currentTime / 60);
      const mins = currentTime % 60;
      const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      
      currentTime += formatSettings.roundTime + formatSettings.breakTime;
      
      return {
        ...round,
        startTime: timeStr
      };
    }));
  };

  // Export functions
  const exportSchedule = () => {
    const data = {
      tournament: {
        name: tournamentName,
        date: tournamentDate,
        format: FORMAT_PRESETS[format].name
      },
      teams,
      venues,
      rounds
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tournamentName.replace(/\s+/g, '_')}_schedule.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printSchedule = () => {
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${tournamentName} - Schedule</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; }
    h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
    .meta { text-align: center; color: #666; margin-bottom: 20px; }
    .round { margin-bottom: 30px; page-break-inside: avoid; }
    .round h2 { background: #f0f0f0; padding: 10px; margin: 0; }
    .matches { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px; padding: 10px; }
    .match { border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
    .teams { display: flex; justify-content: space-between; align-items: center; }
    .team { font-weight: bold; }
    .aff { color: #0088cc; }
    .neg { color: #cc8800; }
    .venue { font-size: 12px; color: #666; margin-top: 5px; }
    @media print { .round { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <h1>${tournamentName}</h1>
  <div class="meta">
    ${tournamentDate ? `<p>Date: ${tournamentDate}</p>` : ''}
    <p>Format: ${FORMAT_PRESETS[format].name} | Teams: ${teams.length} | Rounds: ${rounds.length}</p>
  </div>
`;

    rounds.forEach((round) => {
      html += `  <div class="round">
    <h2>Round ${round.roundNumber}${round.startTime ? ` - ${round.startTime}` : ''}</h2>
    <div class="matches">
`;
      round.matches.forEach((match) => {
        const affTeam = teams.find(t => t.id === match.affTeam);
        const negTeam = teams.find(t => t.id === match.negTeam);
        const venue = venues.find(v => v.id === match.venue);
        
        html += `      <div class="match">
        <div class="teams">
          <span class="team aff">${affTeam?.name || 'TBD'}</span>
          <span>vs</span>
          <span class="team neg">${negTeam?.name || 'TBD'}</span>
        </div>
        ${venue ? `<div class="venue">${venue.name}</div>` : ''}
      </div>
`;
      });
      html += `    </div>
  </div>
`;
    });

    html += `</body></html>`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            Round Robin Scheduler
          </h1>
          <p className="text-slate-400 mt-1">
            Generate tournament schedules with conflict detection
          </p>
        </div>

        <div className="flex items-center gap-2">
          {rounds.length > 0 && (
            <>
              <button
                onClick={() => setShowSetup(!showSetup)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Setup
              </button>
              <button
                onClick={printSchedule}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={exportSchedule}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </>
          )}
        </div>
      </div>

      {/* Setup Panel */}
      <AnimatePresence>
        {showSetup && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Tournament Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-400 mb-1">Tournament Name</label>
                  <input
                    type="text"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={tournamentDate}
                    onChange={(e) => setTournamentDate(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  >
                    {Object.entries(FORMAT_PRESETS).map(([key, preset]) => (
                      <option key={key} value={key}>{preset.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Teams Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Teams ({teams.length})
                  </h3>
                  <button
                    onClick={addTeam}
                    className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Team
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <AnimatePresence>
                    {teams.map((team) => (
                      <TeamInput
                        key={team.id}
                        team={team}
                        onChange={(updated) => updateTeam(team.id, updated)}
                        onDelete={() => deleteTeam(team.id)}
                      />
                    ))}
                  </AnimatePresence>
                  {teams.length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-4">
                      Add teams to generate schedule
                    </p>
                  )}
                </div>
              </div>

              {/* Venues Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-400" />
                    Venues ({venues.length})
                  </h3>
                  <button
                    onClick={addVenue}
                    className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Venue
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  <AnimatePresence>
                    {venues.map((venue) => (
                      <VenueInput
                        key={venue.id}
                        venue={venue}
                        onChange={(updated) => updateVenue(venue.id, updated)}
                        onDelete={() => deleteVenue(venue.id)}
                      />
                    ))}
                  </AnimatePresence>
                  {venues.length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-4">
                      Add venues for room assignments
                    </p>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={generateSchedule}
                  disabled={teams.filter(t => t.name.trim()).length < 2}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors font-medium"
                >
                  <Calendar className="w-5 h-5" />
                  Generate Schedule
                </button>
                {rounds.length > 0 && (
                  <>
                    <button
                      onClick={shuffleMatchups}
                      className="flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      <Shuffle className="w-4 h-4" />
                      Shuffle
                    </button>
                    <button
                      onClick={autoAssignTimes}
                      className="flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      Auto Times
                    </button>
                  </>
                )}
                <div className="ml-auto text-sm text-slate-400">
                  {teams.filter(t => t.name.trim()).length} teams → {
                    Math.max(0, teams.filter(t => t.name.trim()).length - 1)
                  } rounds
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conflict Alerts */}
      {conflicts.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="font-medium text-white">
              {errorCount} errors, {warningCount} warnings detected
            </span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {conflicts.map((conflict, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 text-sm px-3 py-2 rounded ${
                  conflict.severity === 'error' 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {conflict.severity === 'error' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                {conflict.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Tabs */}
      {rounds.length > 0 && (
        <>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('rounds')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'rounds'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <List className="w-4 h-4" />
              Rounds
            </button>
            <button
              onClick={() => setViewMode('bracket')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'bracket'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              Bracket
            </button>
            <button
              onClick={() => setViewMode('standings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'standings'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Standings
            </button>
          </div>

          {/* Views */}
          <AnimatePresence mode="wait">
            {viewMode === 'rounds' && (
              <motion.div
                key="rounds"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {rounds.map((round) => (
                  <RoundCard
                    key={round.id}
                    round={round}
                    teams={teams}
                    venues={venues}
                    onUpdateMatch={updateMatch}
                    onUpdateRound={updateRound}
                  />
                ))}
              </motion.div>
            )}

            {viewMode === 'bracket' && (
              <motion.div
                key="bracket"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl"
              >
                <BracketView rounds={rounds} teams={teams} venues={venues} />
              </motion.div>
            )}

            {viewMode === 'standings' && (
              <motion.div
                key="standings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <StandingsView rounds={rounds} teams={teams} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Empty State */}
      {rounds.length === 0 && !showSetup && (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400">No schedule generated</h3>
          <p className="text-slate-500 mt-1">Set up your tournament to generate a schedule</p>
          <button
            onClick={() => setShowSetup(true)}
            className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
          >
            Open Setup
          </button>
        </div>
      )}
    </div>
  );
};

export default RoundRobinScheduler;
