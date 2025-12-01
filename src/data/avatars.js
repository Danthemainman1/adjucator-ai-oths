// Profile Avatar Collection
// Organized by themes for easy browsing

export const AVATAR_CATEGORIES = {
  DEBATE: 'Debate & Speech',
  ANIMALS: 'Animals',
  ABSTRACT: 'Abstract & Patterns',
  NATURE: 'Nature',
  SPACE: 'Space & Cosmic',
  GAMING: 'Gaming & Fun',
  PROFESSIONAL: 'Professional',
  SEASONAL: 'Seasonal'
};

// SVG-based avatars using gradients and shapes for unique profile pictures
export const avatars = [
  // ==================== DEBATE & SPEECH THEME ====================
  {
    id: 'debate-gavel',
    category: AVATAR_CATEGORIES.DEBATE,
    name: 'The Judge',
    gradient: 'from-amber-500 to-orange-600',
    emoji: '⚖️',
    bgPattern: 'radial'
  },
  {
    id: 'debate-podium',
    category: AVATAR_CATEGORIES.DEBATE,
    name: 'Podium Pro',
    gradient: 'from-blue-500 to-indigo-600',
    emoji: '🎤',
    bgPattern: 'linear'
  },
  {
    id: 'debate-scroll',
    category: AVATAR_CATEGORIES.DEBATE,
    name: 'The Scholar',
    gradient: 'from-emerald-500 to-teal-600',
    emoji: '📜',
    bgPattern: 'radial'
  },
  {
    id: 'debate-brain',
    category: AVATAR_CATEGORIES.DEBATE,
    name: 'Big Brain',
    gradient: 'from-pink-500 to-rose-600',
    emoji: '🧠',
    bgPattern: 'mesh'
  },
  {
    id: 'debate-trophy',
    category: AVATAR_CATEGORIES.DEBATE,
    name: 'Champion',
    gradient: 'from-yellow-400 to-amber-500',
    emoji: '🏆',
    bgPattern: 'radial'
  },
  {
    id: 'debate-fire',
    category: AVATAR_CATEGORIES.DEBATE,
    name: 'Hot Take',
    gradient: 'from-orange-500 to-red-600',
    emoji: '🔥',
    bgPattern: 'linear'
  },

  // ==================== ANIMALS THEME ====================
  {
    id: 'animal-owl',
    category: AVATAR_CATEGORIES.ANIMALS,
    name: 'Wise Owl',
    gradient: 'from-amber-600 to-yellow-500',
    emoji: '🦉',
    bgPattern: 'radial'
  },
  {
    id: 'animal-lion',
    category: AVATAR_CATEGORIES.ANIMALS,
    name: 'Bold Lion',
    gradient: 'from-orange-500 to-amber-400',
    emoji: '🦁',
    bgPattern: 'linear'
  },
  {
    id: 'animal-fox',
    category: AVATAR_CATEGORIES.ANIMALS,
    name: 'Clever Fox',
    gradient: 'from-orange-600 to-red-500',
    emoji: '🦊',
    bgPattern: 'mesh'
  },
  {
    id: 'animal-wolf',
    category: AVATAR_CATEGORIES.ANIMALS,
    name: 'Lone Wolf',
    gradient: 'from-slate-500 to-gray-600',
    emoji: '🐺',
    bgPattern: 'radial'
  },
  {
    id: 'animal-eagle',
    category: AVATAR_CATEGORIES.ANIMALS,
    name: 'Sharp Eagle',
    gradient: 'from-amber-700 to-yellow-600',
    emoji: '🦅',
    bgPattern: 'linear'
  },
  {
    id: 'animal-dragon',
    category: AVATAR_CATEGORIES.ANIMALS,
    name: 'Fire Dragon',
    gradient: 'from-red-600 to-orange-500',
    emoji: '🐉',
    bgPattern: 'mesh'
  },
  {
    id: 'animal-unicorn',
    category: AVATAR_CATEGORIES.ANIMALS,
    name: 'Magic Unicorn',
    gradient: 'from-pink-400 to-purple-500',
    emoji: '🦄',
    bgPattern: 'radial'
  },
  {
    id: 'animal-penguin',
    category: AVATAR_CATEGORIES.ANIMALS,
    name: 'Cool Penguin',
    gradient: 'from-slate-600 to-blue-500',
    emoji: '🐧',
    bgPattern: 'linear'
  },

  // ==================== ABSTRACT THEME ====================
  {
    id: 'abstract-prism',
    category: AVATAR_CATEGORIES.ABSTRACT,
    name: 'Prism',
    gradient: 'from-cyan-400 via-purple-500 to-pink-500',
    emoji: '💎',
    bgPattern: 'mesh'
  },
  {
    id: 'abstract-wave',
    category: AVATAR_CATEGORIES.ABSTRACT,
    name: 'Wave',
    gradient: 'from-blue-400 to-cyan-500',
    emoji: '🌊',
    bgPattern: 'linear'
  },
  {
    id: 'abstract-flame',
    category: AVATAR_CATEGORIES.ABSTRACT,
    name: 'Flame',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    emoji: '🔶',
    bgPattern: 'radial'
  },
  {
    id: 'abstract-aurora',
    category: AVATAR_CATEGORIES.ABSTRACT,
    name: 'Aurora',
    gradient: 'from-green-400 via-cyan-500 to-blue-500',
    emoji: '✨',
    bgPattern: 'mesh'
  },
  {
    id: 'abstract-neon',
    category: AVATAR_CATEGORIES.ABSTRACT,
    name: 'Neon',
    gradient: 'from-pink-500 via-purple-500 to-indigo-500',
    emoji: '💜',
    bgPattern: 'radial'
  },
  {
    id: 'abstract-sunset',
    category: AVATAR_CATEGORIES.ABSTRACT,
    name: 'Sunset',
    gradient: 'from-orange-400 via-pink-500 to-purple-600',
    emoji: '🌅',
    bgPattern: 'linear'
  },

  // ==================== NATURE THEME ====================
  {
    id: 'nature-mountain',
    category: AVATAR_CATEGORIES.NATURE,
    name: 'Mountain',
    gradient: 'from-slate-600 to-emerald-600',
    emoji: '🏔️',
    bgPattern: 'linear'
  },
  {
    id: 'nature-forest',
    category: AVATAR_CATEGORIES.NATURE,
    name: 'Forest',
    gradient: 'from-green-600 to-emerald-500',
    emoji: '🌲',
    bgPattern: 'radial'
  },
  {
    id: 'nature-ocean',
    category: AVATAR_CATEGORIES.NATURE,
    name: 'Ocean',
    gradient: 'from-blue-500 to-teal-500',
    emoji: '🐚',
    bgPattern: 'mesh'
  },
  {
    id: 'nature-flower',
    category: AVATAR_CATEGORIES.NATURE,
    name: 'Flower',
    gradient: 'from-pink-400 to-rose-500',
    emoji: '🌸',
    bgPattern: 'radial'
  },
  {
    id: 'nature-leaf',
    category: AVATAR_CATEGORIES.NATURE,
    name: 'Leaf',
    gradient: 'from-lime-500 to-green-600',
    emoji: '🍀',
    bgPattern: 'linear'
  },
  {
    id: 'nature-storm',
    category: AVATAR_CATEGORIES.NATURE,
    name: 'Storm',
    gradient: 'from-slate-700 to-indigo-600',
    emoji: '⛈️',
    bgPattern: 'mesh'
  },

  // ==================== SPACE THEME ====================
  {
    id: 'space-galaxy',
    category: AVATAR_CATEGORIES.SPACE,
    name: 'Galaxy',
    gradient: 'from-purple-600 via-pink-500 to-blue-600',
    emoji: '🌌',
    bgPattern: 'mesh'
  },
  {
    id: 'space-moon',
    category: AVATAR_CATEGORIES.SPACE,
    name: 'Moon',
    gradient: 'from-slate-400 to-gray-500',
    emoji: '🌙',
    bgPattern: 'radial'
  },
  {
    id: 'space-star',
    category: AVATAR_CATEGORIES.SPACE,
    name: 'Star',
    gradient: 'from-yellow-300 to-amber-400',
    emoji: '⭐',
    bgPattern: 'radial'
  },
  {
    id: 'space-rocket',
    category: AVATAR_CATEGORIES.SPACE,
    name: 'Rocket',
    gradient: 'from-red-500 to-orange-500',
    emoji: '🚀',
    bgPattern: 'linear'
  },
  {
    id: 'space-planet',
    category: AVATAR_CATEGORIES.SPACE,
    name: 'Planet',
    gradient: 'from-teal-500 to-cyan-400',
    emoji: '🪐',
    bgPattern: 'mesh'
  },
  {
    id: 'space-ufo',
    category: AVATAR_CATEGORIES.SPACE,
    name: 'UFO',
    gradient: 'from-green-400 to-emerald-500',
    emoji: '🛸',
    bgPattern: 'radial'
  },

  // ==================== GAMING THEME ====================
  {
    id: 'gaming-controller',
    category: AVATAR_CATEGORIES.GAMING,
    name: 'Gamer',
    gradient: 'from-purple-500 to-pink-500',
    emoji: '🎮',
    bgPattern: 'linear'
  },
  {
    id: 'gaming-sword',
    category: AVATAR_CATEGORIES.GAMING,
    name: 'Knight',
    gradient: 'from-slate-500 to-blue-600',
    emoji: '⚔️',
    bgPattern: 'radial'
  },
  {
    id: 'gaming-wizard',
    category: AVATAR_CATEGORIES.GAMING,
    name: 'Wizard',
    gradient: 'from-indigo-500 to-purple-600',
    emoji: '🧙',
    bgPattern: 'mesh'
  },
  {
    id: 'gaming-ninja',
    category: AVATAR_CATEGORIES.GAMING,
    name: 'Ninja',
    gradient: 'from-slate-700 to-gray-800',
    emoji: '🥷',
    bgPattern: 'linear'
  },
  {
    id: 'gaming-robot',
    category: AVATAR_CATEGORIES.GAMING,
    name: 'Robot',
    gradient: 'from-cyan-500 to-blue-500',
    emoji: '🤖',
    bgPattern: 'radial'
  },
  {
    id: 'gaming-alien',
    category: AVATAR_CATEGORIES.GAMING,
    name: 'Alien',
    gradient: 'from-green-500 to-lime-400',
    emoji: '👽',
    bgPattern: 'mesh'
  },

  // ==================== PROFESSIONAL THEME ====================
  {
    id: 'pro-briefcase',
    category: AVATAR_CATEGORIES.PROFESSIONAL,
    name: 'Business',
    gradient: 'from-slate-600 to-gray-700',
    emoji: '💼',
    bgPattern: 'linear'
  },
  {
    id: 'pro-graduation',
    category: AVATAR_CATEGORIES.PROFESSIONAL,
    name: 'Graduate',
    gradient: 'from-blue-600 to-indigo-600',
    emoji: '🎓',
    bgPattern: 'radial'
  },
  {
    id: 'pro-lightbulb',
    category: AVATAR_CATEGORIES.PROFESSIONAL,
    name: 'Innovator',
    gradient: 'from-yellow-400 to-orange-400',
    emoji: '💡',
    bgPattern: 'radial'
  },
  {
    id: 'pro-chart',
    category: AVATAR_CATEGORIES.PROFESSIONAL,
    name: 'Analyst',
    gradient: 'from-emerald-500 to-teal-500',
    emoji: '📈',
    bgPattern: 'linear'
  },
  {
    id: 'pro-book',
    category: AVATAR_CATEGORIES.PROFESSIONAL,
    name: 'Reader',
    gradient: 'from-amber-600 to-orange-500',
    emoji: '📚',
    bgPattern: 'mesh'
  },
  {
    id: 'pro-target',
    category: AVATAR_CATEGORIES.PROFESSIONAL,
    name: 'Focused',
    gradient: 'from-red-500 to-rose-500',
    emoji: '🎯',
    bgPattern: 'radial'
  },

  // ==================== SEASONAL THEME ====================
  {
    id: 'season-snowflake',
    category: AVATAR_CATEGORIES.SEASONAL,
    name: 'Winter',
    gradient: 'from-blue-300 to-cyan-400',
    emoji: '❄️',
    bgPattern: 'radial'
  },
  {
    id: 'season-sun',
    category: AVATAR_CATEGORIES.SEASONAL,
    name: 'Summer',
    gradient: 'from-yellow-400 to-orange-400',
    emoji: '☀️',
    bgPattern: 'radial'
  },
  {
    id: 'season-fall',
    category: AVATAR_CATEGORIES.SEASONAL,
    name: 'Autumn',
    gradient: 'from-orange-500 to-red-500',
    emoji: '🍂',
    bgPattern: 'linear'
  },
  {
    id: 'season-spring',
    category: AVATAR_CATEGORIES.SEASONAL,
    name: 'Spring',
    gradient: 'from-pink-400 to-green-400',
    emoji: '🌷',
    bgPattern: 'mesh'
  },
  {
    id: 'season-rainbow',
    category: AVATAR_CATEGORIES.SEASONAL,
    name: 'Rainbow',
    gradient: 'from-red-400 via-yellow-400 via-green-400 to-blue-400',
    emoji: '🌈',
    bgPattern: 'linear'
  },
  {
    id: 'season-party',
    category: AVATAR_CATEGORIES.SEASONAL,
    name: 'Party',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    emoji: '🎉',
    bgPattern: 'mesh'
  }
];

// Get avatars by category
export const getAvatarsByCategory = (category) => {
  return avatars.filter(a => a.category === category);
};

// Get avatar by ID
export const getAvatarById = (id) => {
  return avatars.find(a => a.id === id);
};

// Get all unique categories
export const getAllCategories = () => {
  return Object.values(AVATAR_CATEGORIES);
};

// Default avatar if none selected
export const DEFAULT_AVATAR = avatars[0];
