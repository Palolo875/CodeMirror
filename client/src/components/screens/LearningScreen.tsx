import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Target,
  DollarSign,
  PieChart,
  Calculator,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  FileText,
  Users,
  Award,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { FinancialData, EmotionalContext } from '../../types';

interface LearningScreenProps {
  onBack: () => void;
  financialData: FinancialData;
  emotionalContext: EmotionalContext;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: string;
  personalizedTips?: string[];
}

export function LearningScreen({
  onBack,
  financialData,
  emotionalContext,
}: LearningScreenProps) {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('budget');
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  // Calculate personalized recommendations based on user data
  const totalIncome = financialData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = 
    financialData.fixedExpenses.reduce((sum, item) => sum + item.amount, 0) +
    financialData.variableExpenses.reduce((sum, item) => sum + item.amount, 0) +
    financialData.debts.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;
  const hasDebts = financialData.debts.length > 0;
  const hasGoals = financialData.goals.length > 0;
  const isStressed = emotionalContext.mood <= 4 || emotionalContext.tags.includes('Anxieux');

  const learningModules: LearningModule[] = [
    {
      id: 'budget-basics',
      title: 'Les bases du budget personnel',
      description: 'Apprenez à créer et gérer votre budget mensuel efficacement',
      icon: <Calculator size={24} />,
      duration: '15 min',
      difficulty: 'Débutant',
      category: 'budget',
      personalizedTips: balance < 0 ? ['Recommandé pour votre situation actuelle'] : undefined,
    },
    {
      id: 'expense-optimization',
      title: 'Optimiser ses dépenses',
      description: 'Techniques pour réduire vos dépenses sans sacrifier votre qualité de vie',
      icon: <TrendingUp size={24} />,
      duration: '20 min',
      difficulty: 'Intermédiaire',
      category: 'budget',
      personalizedTips: balance < 0 ? ['Prioritaire pour améliorer votre solde'] : undefined,
    },
    {
      id: 'emergency-fund',
      title: 'Constituer un fonds d\'urgence',
      description: 'Pourquoi et comment créer votre coussin de sécurité financier',
      icon: <Target size={24} />,
      duration: '12 min',
      difficulty: 'Débutant',
      category: 'epargne',
      personalizedTips: financialData.assets.length === 0 ? ['Essentiel pour votre sécurité financière'] : undefined,
    },
    {
      id: 'debt-management',
      title: 'Gérer et rembourser ses dettes',
      description: 'Stratégies pour sortir de l\'endettement efficacement',
      icon: <DollarSign size={24} />,
      duration: '25 min',
      difficulty: 'Intermédiaire',
      category: 'dettes',
      personalizedTips: hasDebts ? ['Adapté à votre situation'] : undefined,
    },
    {
      id: 'investment-basics',
      title: 'Introduction aux investissements',
      description: 'Premiers pas dans le monde de l\'investissement',
      icon: <PieChart size={24} />,
      duration: '30 min',
      difficulty: 'Intermédiaire',
      category: 'placement',
    },
    {
      id: 'financial-goals',
      title: 'Définir ses objectifs financiers',
      description: 'Comment établir et atteindre vos objectifs financiers',
      icon: <Target size={24} />,
      duration: '18 min',
      difficulty: 'Débutant',
      category: 'objectifs',
      personalizedTips: !hasGoals ? ['Recommandé pour structurer vos projets'] : undefined,
    },
    {
      id: 'stress-management',
      title: 'Gérer le stress financier',
      description: 'Techniques pour maintenir son bien-être face aux défis financiers',
      icon: <Lightbulb size={24} />,
      duration: '15 min',
      difficulty: 'Débutant',
      category: 'bien-etre',
      personalizedTips: isStressed ? ['Recommandé selon votre contexte émotionnel'] : undefined,
    },
    {
      id: 'retirement-planning',
      title: 'Préparer sa retraite',
      description: 'Stratégies pour assurer votre avenir financier',
      icon: <Award size={24} />,
      duration: '35 min',
      difficulty: 'Avancé',
      category: 'placement',
    },
  ];

  const categories = [
    { id: 'budget', name: 'Budget', icon: <Calculator size={16} /> },
    { id: 'epargne', name: 'Épargne', icon: <Target size={16} /> },
    { id: 'dettes', name: 'Dettes', icon: <DollarSign size={16} /> },
    { id: 'placement', name: 'Placement', icon: <PieChart size={16} /> },
    { id: 'objectifs', name: 'Objectifs', icon: <Target size={16} /> },
    { id: 'bien-etre', name: 'Bien-être', icon: <Lightbulb size={16} /> },
  ];

  const filteredModules = learningModules.filter(
    (module) => module.category === activeCategory
  );

  const personalizedModules = learningModules.filter(
    (module) => module.personalizedTips && module.personalizedTips.length > 0
  );

  const toggleModuleComplete = (moduleId: string) => {
    setCompletedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant':
        return 'bg-green-500/20 text-green-400';
      case 'Intermédiaire':
        return 'bg-amber-500/20 text-amber-400';
      case 'Avancé':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-white/20 text-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="max-w-6xl mx-auto mt-6"
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
              Centre d'apprentissage
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Développez vos compétences financières avec des modules personnalisés
            </p>
          </div>
        </div>
        <div className="text-white/80 text-sm">
          {completedModules.length}/{learningModules.length} modules complétés
        </div>
      </div>

      {/* Personalized Recommendations */}
      {personalizedModules.length > 0 && (
        <div className="glassmorphism rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Lightbulb size={20} className="mr-2 text-[hsl(var(--rivela-accent))]" />
            Recommandations personnalisées
          </h2>
          <p className="text-white/80 mb-4">
            Basées sur votre situation financière et votre contexte émotionnel
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalizedModules.slice(0, 4).map((module) => (
              <motion.div
                key={module.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-[hsl(var(--rivela-accent))]/10 border border-[hsl(var(--rivela-accent))]/30 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="text-[hsl(var(--rivela-accent))]">{module.icon}</div>
                    <span className="font-medium text-white">{module.title}</span>
                  </div>
                  <span className="text-xs text-white/60">{module.duration}</span>
                </div>
                <p className="text-white/80 text-sm mb-2">{module.description}</p>
                {module.personalizedTips && (
                  <div className="text-[hsl(var(--rivela-accent))] text-xs">
                    {module.personalizedTips[0]}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 mb-6 gap-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center p-3 rounded-md whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? 'bg-[hsl(var(--rivela-primary))] font-medium text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
            <span className="ml-2 bg-white/20 text-xs rounded-full px-2 py-1">
              {learningModules.filter((m) => m.category === category.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Learning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="glassmorphism rounded-xl p-6 cursor-pointer transition-all hover:bg-white/20 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-[hsl(var(--rivela-accent))]">{module.icon}</div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(module.difficulty)}`}>
                  {module.difficulty}
                </span>
                <button
                  onClick={() => toggleModuleComplete(module.id)}
                  className={`p-1 rounded-full transition-colors ${
                    completedModules.includes(module.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-white/20 text-white/60 hover:bg-white/30'
                  }`}
                >
                  <CheckCircle size={16} />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-white mb-2 leading-tight">
              {module.title}
            </h3>

            <p className="text-white/80 text-sm mb-4 line-clamp-3">
              {module.description}
            </p>

            {module.personalizedTips && (
              <div className="mb-4 p-3 bg-[hsl(var(--rivela-accent))]/10 rounded-lg border border-[hsl(var(--rivela-accent))]/30">
                <div className="flex items-center text-[hsl(var(--rivela-accent))] text-sm mb-1">
                  <Target size={12} className="mr-1" />
                  <span className="font-medium">Personnalisé pour vous</span>
                </div>
                <p className="text-white/80 text-xs">
                  {module.personalizedTips[0]}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center text-white/60 text-sm">
                <PlayCircle size={14} className="mr-1" />
                {module.duration}
              </div>
              <div className="flex items-center text-[hsl(var(--rivela-accent))] text-sm group-hover:text-white transition-colors">
                <span className="mr-1">Commencer</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-12 glassmorphism rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Award size={20} className="mr-2" />
          Votre progression
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-[hsl(var(--rivela-accent))]/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen size={24} className="text-[hsl(var(--rivela-accent))]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {completedModules.length}
            </div>
            <div className="text-white/80 text-sm">Modules complétés</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users size={24} className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {Math.round((completedModules.length / learningModules.length) * 100)}%
            </div>
            <div className="text-white/80 text-sm">Progression globale</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award size={24} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {personalizedModules.length}
            </div>
            <div className="text-white/80 text-sm">Recommandations actives</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
