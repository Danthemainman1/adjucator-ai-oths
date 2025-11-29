import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import JudgeSpeech from './components/JudgeSpeech';
import EvaluateBoard from './components/EvaluateBoard';
import LiveCoach from './components/LiveCoach';
import ExtempGenerator from './components/ExtempGenerator';
import { Settings, AlertCircle } from 'lucide-react';

// Placeholder components for now
const Placeholder = ({ title }) => (
  <div className="glass-card flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center animate-float">
      <span className="text-4xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    <p className="text-text-secondary max-w-md">
      This feature is currently being revamped with premium aesthetics. Check back soon!
    </p>
  </div>
);

const SettingsModal = ({ isOpen, onClose, apiKey, setApiKey, openaiKey, setOpenaiKey }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="glass-card w-full max-w-md space-y-6 animate-in zoom-in-95">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Settings className="w-5 h-5 mr-2 text-primary" />
          Configuration
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Google Gemini API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="input-field"
            />
            <p className="text-xs text-text-muted mt-1">Required for most features.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">OpenAI API Key (Optional)</label>
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
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-text-secondary hover:bg-slate-800 transition-colors">
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

function App() {
  const [activeTab, setActiveTab] = useState('judge');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_key') || '');
  const [openaiKey, setOpenaiKey] = useState(localStorage.getItem('openai_key') || '');

  useEffect(() => {
    localStorage.setItem('gemini_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('openai_key', openaiKey);
  }, [openaiKey]);

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      showSettings={showSettings}
      setShowSettings={setShowSettings}
    >
      {activeTab === 'judge' && <JudgeSpeech apiKey={apiKey} />}
      {activeTab === 'board' && <EvaluateBoard apiKey={apiKey} />}
      {activeTab === 'coach' && <LiveCoach apiKey={apiKey} />}
      {activeTab === 'extemp' && <ExtempGenerator apiKey={apiKey} />}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        openaiKey={openaiKey}
        setOpenaiKey={setOpenaiKey}
      />
    </Layout>
  );
}

export default App;
