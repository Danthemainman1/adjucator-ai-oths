import React, { useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AvatarSelector from './AvatarSelector';
import { getAvatarById, getDefaultAvatar } from '../data/avatars';

const AvatarSelectionPrompt = () => {
  const { needsAvatarSelection, skipAvatarSelection, setAvatar, userProfile } = useAuth();
  const [showSelector, setShowSelector] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  if (!needsAvatarSelection) return null;

  const handleSelectAvatar = async (avatar) => {
    setSelectedAvatar(avatar);
    setShowSelector(false);
  };

  const handleConfirm = async () => {
    if (selectedAvatar) {
      await setAvatar(selectedAvatar);
    } else {
      // Set default avatar if none selected
      const defaultAvatar = getDefaultAvatar();
      await setAvatar(defaultAvatar);
    }
  };

  const handleSkip = () => {
    skipAvatarSelection();
  };

  const currentAvatar = selectedAvatar || getDefaultAvatar();
  const displayName = userProfile?.displayName || 'there';

  return (
    <>
      {/* Full screen overlay */}
      <div className="fixed inset-0 z-50 bg-bg-primary/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="glass-card space-y-6 text-center">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Profile Setup</span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome, {displayName}!
              </h2>
              <p className="text-text-secondary">
                Choose a profile avatar to personalize your debate journey
              </p>
            </div>

            {/* Avatar Preview */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowSelector(true)}
                className="group relative"
              >
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${currentAvatar.color} flex items-center justify-center text-4xl shadow-lg transition-transform group-hover:scale-105`}>
                  {currentAvatar.emoji}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Change</span>
                </div>
              </button>
            </div>

            <p className="text-sm text-text-muted">
              {selectedAvatar ? currentAvatar.name : 'Click the avatar to browse all options'}
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setShowSelector(true)}
                className="btn-secondary w-full py-3 flex items-center justify-center gap-2"
              >
                Choose Your Avatar
              </button>
              
              <button
                onClick={handleConfirm}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {selectedAvatar ? 'Continue' : 'Use Default Avatar'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Skip option */}
            <button
              onClick={handleSkip}
              className="text-text-muted hover:text-text-secondary text-sm transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      <AvatarSelector
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        onSelect={handleSelectAvatar}
        currentAvatarId={selectedAvatar?.id}
      />
    </>
  );
};

export default AvatarSelectionPrompt;
