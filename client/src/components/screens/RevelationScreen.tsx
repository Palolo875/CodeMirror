import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Share2,
  Lightbulb,
  Bookmark,
  BookOpen,
  CheckCircle,
  FileText,
  Mail,
  ChevronDown,
  ChevronRight,
  Linkedin,
  Twitter,
  Copy,
  Check,
  AlertTriangle,
  TrendingUp,
  PieChart,
} from 'lucide-react';
import { Visualization } from '../ui/Visualization';
import { Dashboard } from '../ui/Dashboard';
import { WhatIfSimulator } from '../ui/WhatIfSimulator';
import { HiddenFeesDetector } from '../ui/HiddenFeesDetector';
import { calculateInsights, calculateProjection } from '../../utils/financialCalculations';
import { useTheme } from '../../contexts/ThemeContext';
import { exportToPDF, shareByEmail } from '../../utils/exportUtils';
import { FinancialData, EmotionalContext, Insight } from '../../types';

interface RevelationScreenProps {
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

export function RevelationScreen({
  question,
  financialData,
  emotionalContext,
  onBack,
  onNewExploration,
  onSaveExploration,
  explorationId,
  onViewJournal,
  onViewLearning,
}: RevelationScreenProps) {
  const { theme } = useTheme();
  const [insights, setInsights] = useState<Insight[] | null>(null);
  const [activeTab, setActiveTab] = useState('insights');
  const [isSaved, setIsSaved] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    recommendations: false,
    predictions: false,
  });

  useEffect(() => {
    // Calculate insights based on financial data and emotional context
    const calculatedInsights = calculateInsights(financialData, emotionalContext);
    
    // Simulate calculation time for effect
    const timer = setTimeout(() => {
      setInsights(calculatedInsights);
    }, 1500);

    return () => clearTimeout(timer);
  }, [financialData, emotionalContext]);

  const handleSaveExploration = () => {
    if (insights) {
      onSaveExploration(insights);
      setIsSaved(true);
      // Reset state after 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }
  };

  const toggleShareMenu = () => {
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  const handleExportPDF = () => {
    exportToPDF({
      question,
      financialData,
      emotionalContext,
      insights: insights || [],
    });
    setIsShareMenuOpen(false);
  };

  const handleShareByEmail = () => {
    shareByEmail({
      question,
      financialData,
      emotionalContext,
      insights: insights || [],
    });
    setIsShareMenuOpen(false);
  };

  const handleShareSocial = (platform: string) => {
    // TODO: Implement actual social sharing integration
    setShareSuccess(platform);
    setTimeout(() => setShareSuccess(null), 3000);
    setIsShareMenuOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(`https://rivela.finance/share/${explorationId}`)
      .then(() => {
        setShareSuccess('copy');
        setTimeout(() => setShareSuccess(null), 3000);
      });
    setIsShareMenuOpen(false);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!insights) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <motion.div
          className="w-16 h-16 border-4 border-white/20 border-t-[hsl(var(--rivela-accent))] rounded-full mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-xl text-white">Analyse en cours...</p>
        <p className="text-sm mt-2 text-white/80">
          Notre moteur scientifique travaille pour vous
        </p>
        <motion.div className="mt-8 max-w-md w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[hsl(var(--rivela-accent))]"
            initial={{ width: '5%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3 }}
          />
        </motion.div>
      </div>
    );
  }

  const totalIncome = financialData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = 
    financialData.fixedExpenses.reduce((sum, item) => sum + item.amount, 0) +
    financialData.variableExpenses.reduce((sum, item) => sum + item.amount, 0) +
    financialData.debts.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.max(0, (balance / totalIncome) * 100) : 0;
  
  const projection = calculateProjection(financialData, insights);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto mt-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-3 rounded-lg bg-white/20 hover:bg-white/30 flex items-center transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span className="hidden sm:inline text-white">Retour</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Votre Révélation Financière</h1>
            <p className="text-white/80 text-sm">Étape 3 sur 3</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveExploration}
            className={`p-2 rounded-full transition-colors relative ${
              isSaved ? 'bg-green-500' : 'bg-white/20 hover:bg-white/30'
            }`}
            disabled={isSaved}
            aria-label={isSaved ? 'Sauvegardé' : 'Sauvegarder'}
            title={isSaved ? 'Sauvegardé' : 'Sauvegarder cette exploration'}
          >
            {isSaved ? <Check size={20} className="text-white" /> : <Bookmark size={20} className="text-white" />}
            {isSaved && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-black/50 px-2 py-1 rounded whitespace-nowrap text-white"
              >
                Sauvegardé !
              </motion.span>
            )}
          </button>
          <div className="relative">
            <button
              onClick={toggleShareMenu}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Partager"
              title="Partager cette exploration"
            >
              <Share2 size={20} className="text-white" />
            </button>
            {isShareMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-56 rounded-md shadow-lg glassmorphism z-10"
              >
                <div className="py-1">
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/20 text-white"
                  >
                    <FileText size={16} className="mr-2" />
                    Exporter en PDF
                  </button>
                  <button
                    onClick={handleShareByEmail}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/20 text-white"
                  >
                    <Mail size={16} className="mr-2" />
                    Partager par email
                  </button>
                  <button
                    onClick={() => handleShareSocial('linkedin')}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/20 text-white"
                  >
                    <Linkedin size={16} className="mr-2" />
                    Partager sur LinkedIn
                  </button>
                  <button
                    onClick={() => handleShareSocial('twitter')}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/20 text-white"
                  >
                    <Twitter size={16} className="mr-2" />
                    Partager sur Twitter
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/20 text-white"
                  >
                    <Copy size={16} className="mr-2" />
                    Copier le lien
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Share success notification */}
      <AnimatePresence>
        {shareSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm"
          >
            {shareSuccess === 'copy' ? 'Lien copié !' : `Partagé sur ${shareSuccess} !`}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          🎯 Vos révélations personnalisées
        </h2>
        <p className="text-lg text-white/80 mb-2">
          Basées sur votre question : <span className="font-medium text-[hsl(var(--rivela-accent))]">"{question}"</span>
        </p>
        <div className="text-sm text-white/60">
          Analyse générée le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Key metrics dashboard */}
      <div className="mb-8">
        <Dashboard
          metrics={{
            totalIncome,
            totalExpenses,
            balance,
            savingsRate,
          }}
        />
      </div>

      {/* Main insights */}
      <div className="space-y-8">
        {/* Financial breakdown */}
        <div className="glassmorphism rounded-2xl p-6">
          <Visualization financialData={financialData} />
        </div>

        {/* Key insights */}
        <div className="glassmorphism rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Lightbulb size={20} className="mr-2 text-[hsl(var(--rivela-accent))]" />
            Insights principaux
          </h3>
          <div className="space-y-4">
            {insights.slice(0, 3).map((insight, index) => (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border ${
                  insight.type === 'warning'
                    ? 'border-red-500/30 bg-red-500/10'
                    : insight.type === 'opportunity'
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-blue-500/30 bg-blue-500/10'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                      insight.type === 'warning'
                        ? 'bg-red-500'
                        : insight.type === 'opportunity'
                        ? 'bg-emerald-500'
                        : 'bg-blue-500'
                    }`}
                  >
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-2">{insight.title}</h4>
                    <p className="text-white/80 text-sm mb-2">{insight.description}</p>
                    {insight.impact > 0 && (
                      <div className="flex items-center text-sm">
                        <TrendingUp size={14} className="mr-1 text-emerald-400" />
                        <span className="text-emerald-400">
                          Impact: +{insight.impact.toFixed(0)}€/mois
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projection */}
        <div className="glassmorphism rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <TrendingUp size={20} className="mr-2 text-emerald-400" />
            Projection avec optimisations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl">
              <h4 className="text-white/80 mb-2">Situation actuelle</h4>
              <div className={`text-3xl font-bold mb-2 ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {balance >= 0 ? '+' : ''}{projection.current.toFixed(0)}€
              </div>
              <p className="text-white/60 text-sm">Solde mensuel</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl">
              <h4 className="text-white/80 mb-2">Avec optimisations</h4>
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                +{projection.optimized.toFixed(0)}€
              </div>
              <p className="text-white/60 text-sm">Nouveau solde</p>
            </div>
          </div>
          {projection.totalSavings > 0 && (
            <div className="mt-6 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <div className="flex items-center text-emerald-400">
                <CheckCircle size={20} className="mr-2" />
                <span className="font-medium">
                  En appliquant ces recommandations, vous pourriez économiser {(projection.totalSavings * 12).toLocaleString()}€ par an !
                </span>
              </div>
            </div>
          )}
        </div>

        {/* What-if simulator */}
        <WhatIfSimulator currentBalance={balance} currentIncome={totalIncome} />

        {/* Hidden fees detector */}
        <HiddenFeesDetector financialData={financialData} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={handleSaveExploration}
          className="flex-1 px-6 py-3 bg-[hsl(var(--rivela-accent))] hover:bg-[hsl(var(--rivela-accent))]/80 text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Bookmark size={16} />
          <span>Sauvegarder cette exploration</span>
        </button>
        <button
          onClick={onViewJournal}
          className="flex-1 px-6 py-3 glassmorphism text-white hover:bg-white/20 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <BookOpen size={16} />
          <span>Voir le journal</span>
        </button>
        <button
          onClick={onViewLearning}
          className="flex-1 px-6 py-3 glassmorphism text-white hover:bg-white/20 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <BookOpen size={16} />
          <span>En apprendre plus</span>
        </button>
      </div>
    </motion.div>
  );
}
