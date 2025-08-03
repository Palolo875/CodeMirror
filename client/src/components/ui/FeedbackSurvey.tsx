import React, { useState } from 'react';
import { MessageCircle, X, Star } from 'lucide-react';
import { FeedbackData } from '../../types';

interface FeedbackSurveyProps {
  type?: 'modal' | 'fab';
  onClose: () => void;
  onSubmit: (feedback: FeedbackData) => void;
}

export function FeedbackSurvey({ type = 'modal', onClose, onSubmit }: FeedbackSurveyProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        rating,
        comment: comment.trim() || undefined,
        category: category || undefined,
      });
      
      // Reset form
      setRating(0);
      setComment('');
      setCategory('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (type === 'fab') {
    return (
      <button
        onClick={onClose}
        className="fixed bottom-20 right-4 w-14 h-14 bg-[hsl(var(--rivela-accent))] hover:bg-[hsl(var(--rivela-accent))]/80 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110 z-50"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="glassmorphism rounded-2xl p-6 max-w-md w-full mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Votre avis nous intéresse</h3>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <p className="text-white/80 mb-6">
        Comment trouvez-vous votre expérience avec Rivela ?
      </p>

      <div className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-white/80 text-sm mb-3">Note globale</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                className={`w-10 h-10 rounded-full transition-colors flex items-center justify-center ${
                  rating >= value
                    ? 'bg-[hsl(var(--rivela-accent))] text-white'
                    : 'bg-white/20 hover:bg-[hsl(var(--rivela-accent))] text-white'
                }`}
              >
                <Star size={16} fill={rating >= value ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div className="mt-2 text-sm text-white/60">
              {rating === 1 && 'Très insatisfait'}
              {rating === 2 && 'Insatisfait'}
              {rating === 3 && 'Neutre'}
              {rating === 4 && 'Satisfait'}
              {rating === 5 && 'Très satisfait'}
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-white/80 text-sm mb-2">Catégorie (optionnel)</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--rivela-accent))]"
          >
            <option value="" className="bg-gray-800">Sélectionner une catégorie</option>
            <option value="interface" className="bg-gray-800">Interface utilisateur</option>
            <option value="fonctionnalites" className="bg-gray-800">Fonctionnalités</option>
            <option value="performance" className="bg-gray-800">Performance</option>
            <option value="contenu" className="bg-gray-800">Qualité du contenu</option>
            <option value="autre" className="bg-gray-800">Autre</option>
          </select>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-white/80 text-sm mb-2">Commentaire (optionnel)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience, suggestions d'amélioration..."
            className="w-full h-20 p-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--rivela-accent))] resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="w-full px-4 py-3 bg-[hsl(var(--rivela-accent))] hover:bg-[hsl(var(--rivela-accent))]/80 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le feedback'}
        </button>
      </div>
    </div>
  );
}
