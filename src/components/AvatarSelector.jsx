import React, { useState } from 'react';
import { X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { avatars, AVATAR_CATEGORIES, getAvatarsByCategory, getAllCategories } from '../data/avatars';
import { cn } from '../utils/helpers';

// Single Avatar Display Component
export const Avatar = ({ avatar, size = 'md', className, showName = false, onClick, selected = false }) => {
  const sizes = {
    xs: 'w-8 h-8 text-sm',
    sm: 'w-10 h-10 text-base',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl',
    xl: 'w-32 h-32 text-5xl'
  };

  if (!avatar) {
    return (
      <div className={cn(
        'rounded-full bg-slate-700 flex items-center justify-center',
        sizes[size],
        className
      )}>
        <span className="text-slate-500">?</span>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-1', onClick && 'cursor-pointer')} onClick={onClick}>
      <div className={cn(
        'rounded-full flex items-center justify-center transition-all duration-200',
        `bg-gradient-to-br ${avatar.gradient}`,
        sizes[size],
        selected && 'ring-4 ring-cyan-500 ring-offset-2 ring-offset-slate-900',
        onClick && 'hover:scale-110 hover:shadow-lg',
        className
      )}>
        <span className="drop-shadow-md">{avatar.emoji}</span>
      </div>
      {showName && (
        <span className="text-xs text-slate-400 text-center">{avatar.name}</span>
      )}
    </div>
  );
};

// Avatar Selector Modal Component
const AvatarSelector = ({ isOpen, onClose, onSelect, currentAvatarId }) => {
  const categories = getAllCategories();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(
    currentAvatarId ? avatars.find(a => a.id === currentAvatarId) : null
  );

  const categoryAvatars = getAvatarsByCategory(selectedCategory);
  const currentCategoryIndex = categories.indexOf(selectedCategory);

  const handlePrevCategory = () => {
    const newIndex = currentCategoryIndex > 0 ? currentCategoryIndex - 1 : categories.length - 1;
    setSelectedCategory(categories[newIndex]);
  };

  const handleNextCategory = () => {
    const newIndex = currentCategoryIndex < categories.length - 1 ? currentCategoryIndex + 1 : 0;
    setSelectedCategory(categories[newIndex]);
  };

  const handleSelect = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Choose Your Avatar</h2>
            <p className="text-sm text-slate-400 mt-1">Select a profile picture that represents you</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Navigation */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrevCategory}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1 text-center">
            <span className="text-lg font-semibold text-white">{selectedCategory}</span>
            <div className="flex justify-center gap-1 mt-2">
              {categories.map((cat, idx) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    cat === selectedCategory ? 'bg-cyan-500 w-4' : 'bg-slate-600 hover:bg-slate-500'
                  )}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleNextCategory}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar Grid */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
            {categoryAvatars.map((avatar) => (
              <Avatar
                key={avatar.id}
                avatar={avatar}
                size="md"
                showName
                selected={selectedAvatar?.id === avatar.id}
                onClick={() => setSelectedAvatar(avatar)}
              />
            ))}
          </div>
        </div>

        {/* Preview & Confirm */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedAvatar ? (
              <>
                <Avatar avatar={selectedAvatar} size="lg" />
                <div>
                  <p className="text-white font-medium">{selectedAvatar.name}</p>
                  <p className="text-sm text-slate-400">{selectedAvatar.category}</p>
                </div>
              </>
            ) : (
              <p className="text-slate-400">Select an avatar to preview</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedAvatar}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Select Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// First-time Avatar Selection (for new users or users without avatar)
export const AvatarOnboarding = ({ onComplete, userName }) => {
  const categories = getAllCategories();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const categoryAvatars = getAvatarsByCategory(selectedCategory);

  const handleComplete = () => {
    if (selectedAvatar) {
      onComplete(selectedAvatar);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome{userName ? `, ${userName}` : ''}! 🎉
          </h1>
          <p className="text-slate-400 text-lg">
            Let's personalize your profile with an avatar
          </p>
        </div>

        {/* Avatar Selection Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
          {/* Category Tabs */}
          <div className="p-4 border-b border-slate-800 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                    cat === selectedCategory
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Grid */}
          <div className="p-6 max-h-[350px] overflow-y-auto">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {categoryAvatars.map((avatar) => (
                <Avatar
                  key={avatar.id}
                  avatar={avatar}
                  size="md"
                  showName
                  selected={selectedAvatar?.id === avatar.id}
                  onClick={() => setSelectedAvatar(avatar)}
                />
              ))}
            </div>
          </div>

          {/* Selection Preview */}
          <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {selectedAvatar ? (
                <>
                  <Avatar avatar={selectedAvatar} size="lg" className="shadow-xl" />
                  <div>
                    <p className="text-white font-semibold text-lg">{selectedAvatar.name}</p>
                    <p className="text-sm text-slate-400">{selectedAvatar.category}</p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center">
                    <span className="text-slate-500 text-2xl">?</span>
                  </div>
                  <p className="text-slate-400">Choose an avatar to continue</p>
                </div>
              )}
            </div>

            <button
              onClick={handleComplete}
              disabled={!selectedAvatar}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => onComplete(null)}
            className="text-slate-500 hover:text-slate-400 text-sm transition-colors underline underline-offset-2"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
