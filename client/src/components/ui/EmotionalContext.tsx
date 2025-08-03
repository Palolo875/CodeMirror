import React from 'react';
import { EmotionalContext as EmotionalContextType } from '../../types';

interface EmotionalContextProps {
  value: EmotionalContextType;
  onChange: (context: EmotionalContextType) => void;
}

const emotionalTags = [
  'Anxieux', 'Curieux', 'Motivé', 'Confus', 'Optimiste', 'Inquiet',
  'Déterminé', 'Frustré', 'Confiant', 'Perdu', 'Espoir', 'Stress'
];

export function EmotionalContext({ value, onChange }: EmotionalContextProps) {
  const handleMoodChange = (mood: number) => {
    onChange({ ...value, mood });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = value.tags.includes(tag)
      ? value.tags.filter(t => t !== tag)
      : [...value.tags, tag];
    onChange({ ...value, tags: newTags });
  };

  const handleNotesChange = (notes: string) => {
    onChange({ ...value, notes });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white mb-4">Contexte émotionnel</h3>
      
      {/* Mood slider */}
      <div>
        <label className="block text-white/80 mb-3">
          Comment vous sentez-vous par rapport à vos finances ?
        </label>
        <div className="flex items-center space-x-4">
          <span className="text-white/60 text-sm">Stressé</span>
          <div className="flex-1 relative">
            <input
              type="range"
              min="1"
              max="10"
              value={value.mood}
              onChange={(e) => handleMoodChange(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, hsl(var(--rivela-accent)) 0%, hsl(var(--rivela-accent)) ${((value.mood - 1) / 9) * 100}%, rgba(255,255,255,0.2) ${((value.mood - 1) / 9) * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-white/60">
              <span>1</span>
              <span className="font-medium text-[hsl(var(--rivela-accent))]">{value.mood}</span>
              <span>10</span>
            </div>
          </div>
          <span className="text-white/60 text-sm">Confiant</span>
        </div>
      </div>

      {/* Emotional tags */}
      <div>
        <label className="block text-white/80 mb-3">
          Tags émotionnels (sélectionnez tous ceux qui vous correspondent)
        </label>
        <div className="flex flex-wrap gap-2">
          {emotionalTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                value.tags.includes(tag)
                  ? 'bg-[hsl(var(--rivela-accent))] text-white'
                  : 'bg-white/20 text-white/80 hover:bg-[hsl(var(--rivela-accent))] hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {value.tags.length > 0 && (
          <div className="mt-2 text-sm text-white/60">
            {value.tags.length} tag{value.tags.length > 1 ? 's' : ''} sélectionné{value.tags.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-white/80 mb-3">
          Notes additionnelles (optionnel)
        </label>
        <textarea
          value={value.notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Décrivez votre situation ou vos préoccupations financières..."
          className="w-full h-24 p-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--rivela-accent))] resize-none"
        />
      </div>
    </div>
  );
}
