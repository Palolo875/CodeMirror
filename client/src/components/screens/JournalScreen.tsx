import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  Search,
  Calendar,
  Trash2,
  ExternalLink,
  Filter,
  Plus,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '../../contexts/ThemeContext';
import { JournalEntry } from '../../types';

interface JournalScreenProps {
  journal: JournalEntry[];
  onLoadExploration: (explorationId: string) => void;
  onDeleteExploration: (explorationId: string) => void;
  onBack: () => void;
  onNewExploration: () => void;
}

export function JournalScreen({
  journal,
  onLoadExploration,
  onDeleteExploration,
  onBack,
  onNewExploration,
}: JournalScreenProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'insights'>('date');
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  // Filter and sort journal entries
  const filteredEntries = journal
    .filter((entry) =>
      entry.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.insights.some((insight) =>
        insight.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.insights.length - a.insights.length;
    });

  const handleDeleteEntry = (entryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette exploration ?')) {
      onDeleteExploration(entryId);
      if (selectedEntry === entryId) {
        setSelectedEntry(null);
      }
    }
  };

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-red-400 bg-red-500/20';
      case 'opportunity':
        return 'text-emerald-400 bg-emerald-500/20';
      case 'recommendation':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-white/80 bg-white/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="max-w-7xl mx-auto mt-6"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-3 rounded-lg bg-white/20 hover:bg-white/30 flex items-center transition-colors"
          >
            <ArrowLeft size={20} className="mr-2 text-white" />
            <span className="hidden sm:inline text-white">Retour</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <BookOpen size={24} className="mr-2" />
              Journal d'explorations
            </h1>
            <p className="text-white/80 text-sm mt-1">
              {journal.length} exploration{journal.length > 1 ? 's' : ''} sauvegardée{journal.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={onNewExploration}
          className="px-6 py-3 bg-[hsl(var(--rivela-accent))] hover:bg-[hsl(var(--rivela-accent))]/80 text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Nouvelle exploration</span>
        </button>
      </div>

      {journal.length === 0 ? (
        <div className="glassmorphism rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen size={32} className="text-white/60" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Votre journal est vide
          </h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Commencez votre première exploration financière pour voir vos insights apparaître ici.
          </p>
          <button
            onClick={onNewExploration}
            className="px-8 py-3 bg-[hsl(var(--rivela-accent))] hover:bg-[hsl(var(--rivela-accent))]/80 text-white rounded-xl font-medium transition-colors flex items-center space-x-2 mx-auto"
          >
            <Plus size={16} />
            <span>Commencer une exploration</span>
          </button>
        </div>
      ) : (
        <>
          {/* Search and filters */}
          <div className="glassmorphism rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  type="text"
                  placeholder="Rechercher dans vos explorations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--rivela-accent))]"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter size={16} className="text-white/60" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'insights')}
                    className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--rivela-accent))]"
                  >
                    <option value="date" className="bg-gray-800">Plus récent</option>
                    <option value="insights" className="bg-gray-800">Plus d'insights</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Journal entries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="glassmorphism rounded-xl p-6 cursor-pointer transition-all hover:bg-white/20 group"
                onClick={() => onLoadExploration(entry.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center text-white/60 text-sm">
                    <Calendar size={14} className="mr-1" />
                    {format(new Date(entry.date), "d MMM yyyy", { locale: fr })}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleDeleteEntry(entry.id, e)}
                      className="p-2 rounded-full hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Supprimer cette exploration"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ExternalLink size={14} className="text-white/40 group-hover:text-white/80 transition-colors" />
                  </div>
                </div>

                <h3 className="font-semibold text-white mb-3 line-clamp-2 leading-tight">
                  {entry.question}
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-[hsl(var(--rivela-accent))] text-sm">
                    <Zap size={12} className="mr-1" />
                    <span>{entry.insights.length} insight{entry.insights.length > 1 ? 's' : ''}</span>
                  </div>
                  {entry.insights.length > 0 && (
                    <div className={`px-2 py-1 rounded-full text-xs ${getInsightTypeColor(entry.insights[0].type)}`}>
                      {entry.insights[0].type === 'warning' && 'Attention'}
                      {entry.insights[0].type === 'opportunity' && 'Opportunité'}
                      {entry.insights[0].type === 'recommendation' && 'Conseil'}
                    </div>
                  )}
                </div>

                {/* Preview of top insights */}
                <div className="space-y-2">
                  {entry.insights.slice(0, 2).map((insight, index) => (
                    <div key={insight.id} className="text-sm text-white/80">
                      <div className="flex items-start space-x-2">
                        <AlertCircle size={12} className="mt-0.5 text-white/60 flex-shrink-0" />
                        <span className="line-clamp-2">{insight.title}</span>
                      </div>
                    </div>
                  ))}
                  {entry.insights.length > 2 && (
                    <div className="text-xs text-white/60">
                      +{entry.insights.length - 2} autre{entry.insights.length - 2 > 1 ? 's' : ''} insight{entry.insights.length - 2 > 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Financial summary */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-white/60">Revenus</span>
                      <div className="text-white font-medium">
                        {entry.financialData.income.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}€
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">Dépenses</span>
                      <div className="text-white font-medium">
                        {(
                          entry.financialData.fixedExpenses.reduce((sum, item) => sum + item.amount, 0) +
                          entry.financialData.variableExpenses.reduce((sum, item) => sum + item.amount, 0) +
                          entry.financialData.debts.reduce((sum, item) => sum + item.amount, 0)
                        ).toLocaleString()}€
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredEntries.length === 0 && searchTerm && (
            <div className="glassmorphism rounded-xl p-8 text-center">
              <Search size={32} className="text-white/60 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-white/80">
                Essayez avec d'autres termes de recherche.
              </p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
