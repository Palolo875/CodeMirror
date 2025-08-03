import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, History, ChevronRight, Zap, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '../../contexts/ThemeContext';
import { JournalEntry } from '../../types';

interface QuestionScreenProps {
  onSubmit: (question: string) => void;
  recentExplorations: JournalEntry[];
  onLoadExploration: (explorationId: string) => void;
}

export function QuestionScreen({
  onSubmit,
  recentExplorations,
  onLoadExploration,
}: QuestionScreenProps) {
  const [question, setQuestion] = useState('');
  const { theme } = useTheme();

  const recentQuestions = [
    "Pourquoi j'ai toujours -200€ en fin de mois ?",
    "Puis-je vraiment m'acheter une voiture électrique ?",
    'Comment optimiser mon budget vacances ?',
    'Comment réduire mes dépenses fixes de 15% ?',
    'Quel impact aurait une augmentation de salaire de 10% ?',
    'Combien puis-je économiser en 1 an avec mon budget actuel ?',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
    }
  };

  const selectQuestion = (q: string) => {
    setQuestion(q);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-10 md:mt-20"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Quelle est votre question<br />
          <span className="text-[hsl(var(--rivela-accent))]">financière aujourd'hui ?</span>
        </h1>
        <p className="text-xl text-white/80 mb-8">
          Posez votre question et découvrez des insights personnalisés sur votre situation financière
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex: Pourquoi j'ai toujours -200€ en fin de mois ?"
            className="w-full h-32 p-6 pr-20 rounded-2xl glassmorphism text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--rivela-accent))]/50 text-lg shadow-xl"
            rows={3}
          />
          <button
            type="submit"
            disabled={!question.trim()}
            className="absolute bottom-4 right-4 px-6 py-3 bg-[hsl(var(--rivela-accent))] hover:bg-[hsl(var(--rivela-accent))]/80 text-white rounded-xl font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Explorer</span>
            <Search size={16} />
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glassmorphism rounded-xl p-6"
        >
          <h2 className="text-lg font-medium mb-4 flex items-center text-white">
            <Search size={18} className="mr-2" />
            Questions suggérées
          </h2>
          <div className="space-y-2">
            {recentQuestions.map((q, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => selectQuestion(q)}
                className="w-full p-3 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-left text-white/90 hover:text-white group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{q}</span>
                  <ChevronRight size={16} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glassmorphism rounded-xl p-6"
        >
          <h2 className="text-lg font-medium mb-4 flex items-center text-white">
            <History size={18} className="mr-2" />
            Explorations récentes
          </h2>
          {recentExplorations.length > 0 ? (
            <div className="space-y-2">
              {recentExplorations.map((exploration) => (
                <motion.button
                  key={exploration.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onLoadExploration(exploration.id)}
                  className="w-full p-3 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-left group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-white/60">
                      {format(new Date(exploration.date), "d MMMM yyyy", { locale: fr })}
                    </span>
                    <ExternalLink size={14} className="text-white/40 group-hover:text-white/80 transition-colors" />
                  </div>
                  <div className="font-medium text-white mb-2 line-clamp-2">
                    {exploration.question}
                  </div>
                  <div className="flex items-center text-[hsl(var(--rivela-accent))] text-sm">
                    <Zap size={12} className="mr-1" />
                    <span>{exploration.insights.length} insights découverts</span>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <p>Aucune exploration récente</p>
              <p className="text-sm mt-1">Vos explorations apparaîtront ici</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
