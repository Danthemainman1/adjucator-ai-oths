import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import {
  Layers,
  Plus,
  Trash2,
  GripVertical,
  Tag,
  Edit3,
  Check,
  X,
  FolderOpen
} from 'lucide-react';

const CATEGORIES = [
  { id: 'pro', name: 'Pro Arguments', color: 'emerald' },
  { id: 'con', name: 'Con Arguments', color: 'red' },
  { id: 'evidence', name: 'Evidence', color: 'blue' },
  { id: 'rebuttals', name: 'Rebuttals', color: 'purple' },
  { id: 'notes', name: 'General Notes', color: 'slate' }
];

const getColorClasses = (color) => {
  const colors = {
    emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', badge: 'bg-emerald-500' },
    red: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', badge: 'bg-red-500' },
    blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', badge: 'bg-blue-500' },
    purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', badge: 'bg-purple-500' },
    slate: { bg: 'bg-slate-500/20', border: 'border-slate-500/50', text: 'text-slate-400', badge: 'bg-slate-500' }
  };
  return colors[color] || colors.slate;
};

const CardOrganizer = () => {
  const [cards, setCards] = useState([]);
  const [activeCategory, setActiveCategory] = useState('pro');
  const [editingId, setEditingId] = useState(null);
  const [newCardText, setNewCardText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('debate-cards');
    if (saved) {
      setCards(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('debate-cards', JSON.stringify(cards));
  }, [cards]);

  const addCard = () => {
    if (!newCardText.trim()) return;
    const newCard = {
      id: Date.now().toString(),
      text: newCardText.trim(),
      category: activeCategory,
      createdAt: new Date().toISOString()
    };
    setCards([...cards, newCard]);
    setNewCardText('');
    setShowAddForm(false);
  };

  const updateCard = (id, text) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, text } : card
    ));
    setEditingId(null);
  };

  const deleteCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const moveCard = (id, newCategory) => {
    setCards(cards.map(card =>
      card.id === id ? { ...card, category: newCategory } : card
    ));
  };

  const getCategoryCards = (categoryId) => {
    return cards.filter(card => card.category === categoryId);
  };

  const activeCards = getCategoryCards(activeCategory);
  const activeCategoryData = CATEGORIES.find(c => c.id === activeCategory);
  const colors = getColorClasses(activeCategoryData?.color || 'slate');

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg">
              <Layers className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Card Organizer</h1>
              <p className="text-slate-400 text-sm">Organize debate arguments by category</p>
            </div>
          </div>
          <div className="text-slate-400 text-sm">
            {cards.length} card{cards.length !== 1 ? 's' : ''} total
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(category => {
            const catColors = getColorClasses(category.color);
            const count = getCategoryCards(category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeCategory === category.id
                    ? `${catColors.bg} ${catColors.border} border ${catColors.text}`
                    : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${catColors.badge}`} />
                {category.name}
                {count > 0 && (
                  <span className="px-1.5 py-0.5 bg-slate-900/50 rounded text-xs">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Cards Area */}
        <div className={`bg-slate-800/50 border ${colors.border} rounded-xl p-4 min-h-[500px]`}>
          {/* Add Card Button */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className={`w-full p-4 border-2 border-dashed ${colors.border} rounded-lg ${colors.text} hover:${colors.bg} transition-colors flex items-center justify-center gap-2 mb-4`}
            >
              <Plus className="w-5 h-5" />
              Add Card to {activeCategoryData?.name}
            </button>
          ) : (
            <div className={`p-4 ${colors.bg} border ${colors.border} rounded-lg mb-4`}>
              <textarea
                value={newCardText}
                onChange={(e) => setNewCardText(e.target.value)}
                placeholder="Enter argument, evidence, or note..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => { setShowAddForm(false); setNewCardText(''); }}
                  className="px-3 py-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addCard}
                  disabled={!newCardText.trim()}
                  className={`px-4 py-1.5 ${colors.badge} text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Add Card
                </button>
              </div>
            </div>
          )}

          {/* Cards List */}
          {activeCards.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No cards in {activeCategoryData?.name}</p>
              <p className="text-sm">Add a card to get started</p>
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={activeCards}
              onReorder={(newOrder) => {
                const otherCards = cards.filter(c => c.category !== activeCategory);
                setCards([...otherCards, ...newOrder]);
              }}
              className="space-y-3"
            >
              {activeCards.map(card => (
                <Reorder.Item
                  key={card.id}
                  value={card}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <CardItem
                    card={card}
                    colors={colors}
                    isEditing={editingId === card.id}
                    onEdit={() => setEditingId(card.id)}
                    onSave={(text) => updateCard(card.id, text)}
                    onCancel={() => setEditingId(null)}
                    onDelete={() => deleteCard(card.id)}
                    onMove={(newCat) => moveCard(card.id, newCat)}
                    categories={CATEGORIES}
                    currentCategory={activeCategory}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>
      </div>
    </div>
  );
};

const CardItem = ({ card, colors, isEditing, onEdit, onSave, onCancel, onDelete, onMove, categories, currentCategory }) => {
  const [editText, setEditText] = useState(card.text);
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  return (
    <motion.div
      layout
      className={`group p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg hover:border-slate-600 transition-colors`}
    >
      {isEditing ? (
        <div>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:outline-none resize-none"
            rows={3}
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={onCancel}
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSave(editText)}
              className="p-1.5 text-emerald-400 hover:text-emerald-300"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <div className="text-slate-600 mt-1">
            <GripVertical className="w-4 h-4" />
          </div>
          <p className="flex-1 text-white whitespace-pre-wrap">{card.text}</p>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Move to category */}
            <div className="relative">
              <button
                onClick={() => setShowMoveMenu(!showMoveMenu)}
                className="p-1.5 text-slate-500 hover:text-white transition-colors"
                title="Move to category"
              >
                <Tag className="w-4 h-4" />
              </button>
              {showMoveMenu && (
                <div className="absolute right-0 top-8 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 py-1 min-w-[150px]">
                  {categories
                    .filter(c => c.id !== currentCategory)
                    .map(cat => {
                      const catColors = getColorClasses(cat.color);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            onMove(cat.id);
                            setShowMoveMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                        >
                          <span className={`w-2 h-2 rounded-full ${catColors.badge}`} />
                          {cat.name}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
            <button
              onClick={onEdit}
              className="p-1.5 text-slate-500 hover:text-white transition-colors"
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CardOrganizer;
