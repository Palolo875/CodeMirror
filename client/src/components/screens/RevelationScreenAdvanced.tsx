import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Share2,
  Lightbulb,
  Bookmark,
  BookOpen,
  CheckCircle,
  Activity,
  Calculator,
  Search,
  Eye,
  Brain,
  Zap,
  TrendingUp,
  Target,
  BarChart3,
  Settings
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { FinancialData, EmotionalContext, Insight } from '../../types';
import { AdvancedDashboard } from '../ui/AdvancedDashboard';
import { AdvancedSimulator } from '../ui/AdvancedSimulator';
import { HiddenFeesDetector } from '../ui/HiddenFeesDetector';
import { ExportShareSystem } from '../ui/ExportShareSystem';
import { DeepInsights } from '../ui/DeepInsights';
// Removed confetti import for compatibility

interface RevelationScreenAdvancedProps {
  question: string;
  financialData: FinancialData;
  emotionalContext: EmotionalContext;
  onBack: () => void;
  onNewExploration: () => void;
  onSaveExploration: (insights: Insight[]) => void;
  explorationId: string;
  onViewJournal: () => void;
  onViewLearning: () => void;
}

export function RevelationScreenAdvanced({
  question,
  financialData,
  emotionalContext,
  onBack,
  onNewExploration,
  onSaveExploration,
  explorationId,
  onViewJournal,
  onViewLearning,
}: RevelationScreenAdvancedProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Calculate key metrics for display
  const totalIncome = financialData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = [
    ...financialData.fixedExpenses,
    ...financialData.variableExpenses,
    ...financialData.debts
  ].reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  useEffect(() => {
    // Simulate loading time for dramatic effect
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (balance > 0) {
        setShowCelebration(true);
        // Celebration effect without external library
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [balance]);

  const handleSaveExploration = () => {
    const insights: Insight[] = [
      {
        id: '1',
        type: balance >= 0 ? 'recommendation' : 'warning',
        title: balance >= 0 ? 'Situation financière équilibrée' : 'Attention au déficit',
        description: `Solde mensuel de ${balance.toLocaleString()}€`,
        priority: 'high',
        impact: Math.abs(balance)
      }
    ];
    
    onSaveExploration(insights);
    setIsSaved(true);
    
    // Reset after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  const tabs = [
    {
      id: 'dashboard',
      name: 'Tableau de bord',
      icon: <BarChart3 size={20} />,
      description: 'Vue d\'ensemble détaillée'
    },
    {
      id: 'insights',
      name: 'Insights IA',
      icon: <Brain size={20} />,
      description: 'Analyses approfondies'
    },
    {
      id: 'simulator',
      name: 'Simulations',
      icon: <Calculator size={20} />,
      description: 'Scénarios personnalisés'
    },
    {
      id: 'fees',
      name: 'Frais cachés',
      icon: <Search size={20} />,
      description: 'Détection intelligente'
    }
  ];

  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme.gradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 border-4 border-white/30 rounded-full animate-spin">
              <div className="w-8 h-8 bg-white rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Lightbulb className="text-white animate-pulse" size={48} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Analyse en cours...
          </h2>
          <p className="text-white/70 max-w-md mx-auto">
            Intelligence artificielle en action : analyse de vos données financières, 
            détection de patterns et génération d'insights personnalisés.
          </p>
          <div className="mt-8 flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-white/60 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold text-white mb-2"
              >
                Félicitations !
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-xl"
              >
                Votre situation financière est positive
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-3 glassmorphism rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="text-white" size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Révélations financières
              </h1>
              <p className="text-white/70">
                Question : "{question}"
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <ExportShareSystem
              data={{
                financialData,
                emotionalContext,
                insights: undefined,
                simulationResults: undefined
              }}
              targetElement={dashboardRef}
              title="Analyse Financière Rivela"
            />
            
            <button
              onClick={handleSaveExploration}
              className={`p-3 rounded-full transition-colors ${
                isSaved 
                  ? 'bg-green-500 text-white' 
                  : 'glassmorphism hover:bg-white/20 text-white'
              }`}
            >
              {isSaved ? <CheckCircle size={24} /> : <Bookmark size={24} />}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glassmorphism rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              {totalIncome.toLocaleString()}€
            </div>
            <div className="text-white/70">Revenus mensuels</div>
          </div>
          <div className="glassmorphism rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {totalExpenses.toLocaleString()}€
            </div>
            <div className="text-white/70">Dépenses totales</div>
          </div>
          <div className="glassmorphism rounded-xl p-6 text-center">
            <div className={`text-3xl font-bold mb-2 ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {balance >= 0 ? '+' : ''}{balance.toLocaleString()}€
            </div>
            <div className="text-white/70">Solde mensuel</div>
          </div>
          <div className="glassmorphism rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {savingsRate.toFixed(1)}%
            </div>
            <div className="text-white/70">Taux d'épargne</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="glassmorphism rounded-xl p-2 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[hsl(var(--rivela-accent))] text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  {tab.icon}
                </div>
                <div className="font-medium text-sm mb-1">{tab.name}</div>
                <div className="text-xs opacity-80">{tab.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div ref={dashboardRef} className="mb-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AdvancedDashboard
                  financialData={financialData}
                  emotionalContext={emotionalContext}
                  historicalData={[]}
                />
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DeepInsights
                  financialData={financialData}
                  emotionalContext={emotionalContext}
                  previousData={[]}
                />
              </motion.div>
            )}

            {activeTab === 'simulator' && (
              <motion.div
                key="simulator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AdvancedSimulator
                  financialData={financialData}
                  onSaveScenario={(scenario) => {
                    // TODO: Save scenario to database or local storage
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'fees' && (
              <motion.div
                key="fees"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <HiddenFeesDetector
                  financialData={financialData}
                  onFeesDetected={(fees) => {
                    // TODO: Alert user about detected hidden fees
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
          <button
            onClick={onViewJournal}
            className="glassmorphism hover:bg-white/20 text-white px-8 py-4 rounded-xl transition-colors flex items-center space-x-3"
          >
            <BookOpen size={24} />
            <div>
              <div className="font-medium">Journal Financier</div>
              <div className="text-sm text-white/70">Consultez vos explorations</div>
            </div>
          </button>
          
          <button
            onClick={onViewLearning}
            className="glassmorphism hover:bg-white/20 text-white px-8 py-4 rounded-xl transition-colors flex items-center space-x-3"
          >
            <Zap size={24} />
            <div>
              <div className="font-medium">Centre d'Apprentissage</div>
              <div className="text-sm text-white/70">Modules personnalisés</div>
            </div>
          </button>
          
          <button
            onClick={onNewExploration}
            className="bg-[hsl(var(--rivela-accent))] hover:bg-[hsl(var(--rivela-accent))]/80 text-white px-8 py-4 rounded-xl transition-colors flex items-center space-x-3"
          >
            <Target size={24} />
            <div>
              <div className="font-medium">Nouvelle Exploration</div>
              <div className="text-sm text-white/90">Approfondir l'analyse</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}