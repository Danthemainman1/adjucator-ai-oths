import React, { useState, useEffect } from 'react';
import EnterpriseLayout from './components/enterprise/EnterpriseLayout';
import Dashboard from './components/enterprise/Dashboard';
import JudgeSpeech from './components/JudgeSpeech';
import EvaluateBoard from './components/EvaluateBoard';
import LiveCoach from './components/LiveCoach';
import ExtempGenerator from './components/ExtempGenerator';
import StrategyGenerator from './components/StrategyGenerator';
import HistoryPanel from './components/HistoryPanel';
import ToneAnalyzer from './components/ToneAnalyzer';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
// New Feature Components
import AnalyticsDashboard from './components/features/AnalyticsDashboard';
import OpponentIntelligence from './components/features/OpponentIntelligence';
import EvidenceLibrary from './components/features/EvidenceLibrary';
import PracticeMode from './components/features/PracticeMode';
import TeamCollaboration from './components/features/TeamCollaboration';
import TournamentManagement from './components/features/TournamentManagement';
import ArgumentFlowchart from './components/features/ArgumentFlowchart';
import VoiceAnalysis from './components/features/VoiceAnalysis';
import DebateTimer from './components/features/DebateTimer';
import SpeechOutlineBuilder from './components/features/SpeechOutlineBuilder';
import RoundRobinScheduler from './components/features/RoundRobinScheduler';
import QuickStatsWidget from './components/features/QuickStatsWidget';
import MotionLibrary from './components/features/MotionLibrary';
import JudgeBallotGenerator from './components/features/JudgeBallotGenerator';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Settings, Loader2 } from 'lucide-react';

// Loading spinner component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
    <div className="text-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin mx-auto" style={{ color: 'var(--primary)' }} />
      <p style={{ color: 'var(--text-secondary)' }}>Loading Adjudicator AI...</p>
    </div>
  </div>
);

// Placeholder components for now
const Placeholder = ({ title }) => (
  <div className="glass-card flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center animate-float">
      <span className="text-4xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
    <p style={{ color: 'var(--text-secondary)' }} className="max-w-md">
      This feature is currently being revamped with premium aesthetics. Check back soon!
    </p>
  </div>
);

const SettingsModal = ({ isOpen, onClose, apiKey, setApiKey, openaiKey, setOpenaiKey }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="glass-card w-full max-w-md space-y-6 animate-in zoom-in-95">
        <h2 className="text-xl font-bold flex items-center" style={{ color: 'var(--text-primary)' }}>
          <Settings className="w-5 h-5 mr-2" style={{ color: 'var(--primary)' }} />
          Configuration
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Google Gemini API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="input-field"
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Required for most features.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>OpenAI API Key (Optional)</label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
              className="input-field"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}>
            Close
          </button>
          <button onClick={onClose} className="btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Main authenticated app content
function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_key') || '');
  const [openaiKey, setOpenaiKey] = useState(localStorage.getItem('openai_key') || '');
  const [isGuest, setIsGuest] = useState(localStorage.getItem('guest_mode') === 'true');
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    localStorage.setItem('gemini_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('openai_key', openaiKey);
  }, [openaiKey]);

  // Check if user has seen landing before or is already authenticated
  useEffect(() => {
    if (isAuthenticated || isGuest) {
      setShowLanding(false);
    }
  }, [isAuthenticated, isGuest]);

  // Show loading screen while checking auth state
  if (loading) {
    return <LoadingScreen />;
  }

  // Show landing page for first-time visitors
  if (showLanding && !isAuthenticated && !isGuest) {
    return (
      <LandingPage
        onGetStarted={() => setShowLanding(false)}
        onContinueAsGuest={() => {
          setIsGuest(true);
          localStorage.setItem('guest_mode', 'true');
          setShowLanding(false);
        }}
      />
    );
  }

  // Show auth page if not authenticated and not in guest mode
  if (!isAuthenticated && !isGuest) {
    return (
      <AuthPage 
        onSkip={() => {
          setIsGuest(true);
          localStorage.setItem('guest_mode', 'true');
        }} 
      />
    );
  }

  return (
    <EnterpriseLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onSettingsClick={() => setShowSettings(true)}
    >
      {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
      {activeTab === 'analytics' && <AnalyticsDashboard />}
      {activeTab === 'judge' && <JudgeSpeech apiKey={apiKey} />}
      {activeTab === 'board' && <EvaluateBoard apiKey={apiKey} />}
      {activeTab === 'coach' && <LiveCoach apiKey={apiKey} />}
      {activeTab === 'practice' && <PracticeMode apiKey={apiKey} />}
      {activeTab === 'tournaments' && <TournamentManagement />}
      {activeTab === 'opponents' && <OpponentIntelligence apiKey={apiKey} />}
      {activeTab === 'evidence' && <EvidenceLibrary />}
      {activeTab === 'team' && <TeamCollaboration />}
      {activeTab === 'strategy' && <StrategyGenerator apiKey={apiKey} />}
      {activeTab === 'extemp' && <ExtempGenerator apiKey={apiKey} />}
      {activeTab === 'tone' && <ToneAnalyzer apiKey={apiKey} />}
      {activeTab === 'history' && <HistoryPanel />}
      {activeTab === 'flowchart' && <ArgumentFlowchart />}
      {activeTab === 'voice' && <VoiceAnalysis />}
      {activeTab === 'timer' && <DebateTimer />}
      {activeTab === 'outline' && <SpeechOutlineBuilder />}
      {activeTab === 'scheduler' && <RoundRobinScheduler />}
      {activeTab === 'quickstats' && <QuickStatsWidget />}
      {activeTab === 'motions' && <MotionLibrary />}
      {activeTab === 'ballot' && <JudgeBallotGenerator />}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        openaiKey={openaiKey}
        setOpenaiKey={setOpenaiKey}
      />
    </EnterpriseLayout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
