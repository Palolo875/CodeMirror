import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Zap,
  Shield,
  Calendar,
  DollarSign,
  PieChart,
  BarChart3,
  ArrowRight,
  Star,
  Clock,
  Users,
  Award,
  Rocket,
  Heart,
  Eye,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import CountUp from 'react-countup';
import { FinancialData, EmotionalContext } from '../../types';

interface DeepInsightsProps {
  financialData: FinancialData;
  emotionalContext: EmotionalContext;
  previousData?: FinancialData[];
}

interface Insight {
  id: string;
  category: 'positive' | 'warning' | 'opportunity' | 'neutral';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: number; // 0-100
  confidence: number; // 0-100
  recommendations: string[];
  metrics?: {
    current: number;
    target?: number;
    trend?: 'up' | 'down' | 'stable';
  };
  icon: React.ReactNode;
}

interface Prediction {
  id: string;
  timeframe: '3months' | '6months' | '1year' | '5years';
  title: string;
  description: string;
  probability: number;
  impact: 'positive' | 'negative' | 'neutral';
  value?: number;
  factors: string[];
}

interface PersonalityInsight {
  trait: string;
  score: number;
  description: string;
  financialImpact: string;
  suggestions: string[];
}

export function DeepInsights({ financialData, emotionalContext, previousData = [] }: DeepInsightsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPredictions, setShowPredictions] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // Calculate comprehensive metrics
  const totalIncome = financialData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalFixedExpenses = financialData.fixedExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalVariableExpenses = financialData.variableExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalDebts = financialData.debts.reduce((sum, item) => sum + item.amount, 0);
  const totalAssets = financialData.assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalExpenses = totalFixedExpenses + totalVariableExpenses + totalDebts;
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
  const debtToIncomeRatio = totalIncome > 0 ? (totalDebts / totalIncome) * 100 : 0;
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const emergencyFundMonths = totalExpenses > 0 ? totalAssets / totalExpenses : 0;

  // Advanced insights generation
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];

    // Savings Rate Insight
    if (savingsRate >= 20) {
      insights.push({
        id: 'excellent-savings',
        category: 'positive',
        priority: 'high',
        title: 'Excellent taux d\'épargne',
        description: `Votre taux d'épargne de ${savingsRate.toFixed(1)}% est exceptionnel. Vous êtes dans le top 10% des épargnants français.`,
        impact: 95,
        confidence: 98,
        recommendations: [
          'Diversifiez vos investissements pour optimiser les rendements',
          'Considérez des placements à plus long terme',
          'Maintenez cette discipline financière'
        ],
        metrics: { current: savingsRate, target: 20, trend: 'up' },
        icon: <Trophy className="text-yellow-400" size={24} />
      });
    } else if (savingsRate < 5) {
      insights.push({
        id: 'low-savings',
        category: 'warning',
        priority: 'high',
        title: 'Capacité d\'épargne limitée',
        description: `Votre taux d'épargne de ${savingsRate.toFixed(1)}% est insuffisant pour construire une sécurité financière.`,
        impact: 85,
        confidence: 92,
        recommendations: [
          'Identifiez les dépenses réductibles',
          'Automatisez une épargne même petite (50€/mois)',
          'Cherchez des sources de revenus complémentaires'
        ],
        metrics: { current: savingsRate, target: 10, trend: 'stable' },
        icon: <AlertCircle className="text-red-400" size={24} />
      });
    }

    // Debt Management
    if (debtToIncomeRatio > 33) {
      insights.push({
        id: 'high-debt-ratio',
        category: 'warning',
        priority: 'high',
        title: 'Endettement préoccupant',
        description: `Votre ratio d'endettement de ${debtToIncomeRatio.toFixed(1)}% dépasse le seuil recommandé de 33%.`,
        impact: 90,
        confidence: 95,
        recommendations: [
          'Priorisez le remboursement des dettes les plus coûteuses',
          'Négociez un rééchelonnement si nécessaire',
          'Évitez de contracter de nouvelles dettes'
        ],
        metrics: { current: debtToIncomeRatio, target: 33, trend: 'up' },
        icon: <AlertTriangle className="text-red-400" size={24} />
      });
    }

    // Emergency Fund
    if (emergencyFundMonths < 3) {
      insights.push({
        id: 'insufficient-emergency-fund',
        category: 'opportunity',
        priority: 'medium',
        title: 'Fonds d\'urgence insuffisant',
        description: `Votre épargne de précaution couvre ${emergencyFundMonths.toFixed(1)} mois de dépenses. L'idéal est de 3-6 mois.`,
        impact: 75,
        confidence: 88,
        recommendations: [
          'Constituez progressivement un fonds d\'urgence',
          'Placez cette épargne sur un compte accessible',
          'Objectif: 3 mois de charges courantes minimum'
        ],
        metrics: { current: emergencyFundMonths, target: 3, trend: 'stable' },
        icon: <Shield className="text-amber-400" size={24} />
      });
    }

    // Emotional Wellbeing Impact
    if (emotionalContext.mood <= 4) {
      insights.push({
        id: 'financial-stress',
        category: 'warning',
        priority: 'high',
        title: 'Stress financier détecté',
        description: `Votre niveau de satisfaction (${emotionalContext.mood}/10) indique un stress financier important.`,
        impact: 80,
        confidence: 85,
        recommendations: [
          'Priorisez les actions qui réduisent l\'anxiété financière',
          'Considérez un accompagnement en gestion financière',
          'Focalisez sur des gains rapides et visibles'
        ],
        icon: <Heart className="text-red-400" size={24} />
      });
    }

    // Income Optimization
    const incomeVsExpenses = (totalIncome / totalExpenses) * 100;
    if (incomeVsExpenses < 110) {
      insights.push({
        id: 'income-optimization',
        category: 'opportunity',
        priority: 'medium',
        title: 'Potentiel d\'augmentation de revenus',
        description: 'Vos revenus ne dépassent que légèrement vos dépenses. Il existe des opportunités d\'amélioration.',
        impact: 70,
        confidence: 75,
        recommendations: [
          'Négociez une augmentation ou promotion',
          'Développez des compétences valorisables',
          'Explorez des revenus complémentaires'
        ],
        icon: <TrendingUp className="text-blue-400" size={24} />
      });
    }

    // Variable Expenses Pattern
    const variableRatio = totalVariableExpenses / totalExpenses * 100;
    if (variableRatio > 40) {
      insights.push({
        id: 'variable-expenses-high',
        category: 'opportunity',
        priority: 'low',
        title: 'Dépenses variables élevées',
        description: `${variableRatio.toFixed(1)}% de vos dépenses sont variables, offrant une marge d'optimisation.`,
        impact: 60,
        confidence: 80,
        recommendations: [
          'Suivez vos dépenses variables quotidiennement',
          'Fixez-vous un budget mensuel strict',
          'Identifiez vos dépenses impulsives'
        ],
        icon: <Target className="text-purple-400" size={24} />
      });
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const generatePredictions = (): Prediction[] => {
    return [
      {
        id: 'savings-projection',
        timeframe: '1year',
        title: 'Projection d\'épargne annuelle',
        description: `À ce rythme, vous pourriez épargner ${(balance * 12).toLocaleString()}€ cette année.`,
        probability: 85,
        impact: balance > 0 ? 'positive' : 'negative',
        value: balance * 12,
        factors: ['Stabilité des revenus', 'Contrôle des dépenses', 'Discipline d\'épargne']
      },
      {
        id: 'debt-payoff',
        timeframe: '3months',
        title: 'Évolution de l\'endettement',
        description: totalDebts > 0 
          ? `Avec un effort supplémentaire de 10%, vous pourriez réduire vos dettes de ${(totalDebts * 0.3).toLocaleString()}€`
          : 'Excellente gestion, vous restez sans dette significative',
        probability: 70,
        impact: 'positive',
        factors: ['Discipline de remboursement', 'Revenus stables', 'Pas de nouvelles dettes']
      },
      {
        id: 'emergency-fund',
        timeframe: '6months',
        title: 'Constitution du fonds d\'urgence',
        description: emergencyFundMonths < 3
          ? `En épargnant ${Math.ceil((totalExpenses * 3 - totalAssets) / 6).toLocaleString()}€/mois, vous atteindrez 3 mois de réserve`
          : 'Votre fonds d\'urgence restera solide',
        probability: 75,
        impact: 'positive',
        factors: ['Épargne régulière', 'Pas d\'urgences imprévues', 'Revenus maintenus']
      },
      {
        id: 'lifestyle-inflation',
        timeframe: '5years',
        title: 'Évolution du niveau de vie',
        description: 'Avec une croissance de revenus de 3%/an et un contrôle de l\'inflation lifestyle, votre pouvoir d\'achat pourrait augmenter de 15%',
        probability: 60,
        impact: 'positive',
        factors: ['Évolution de carrière', 'Maîtrise des dépenses', 'Investissements judicieux']
      }
    ];
  };

  const analyzePersonality = (): PersonalityInsight[] => {
    return [
      {
        trait: 'Prudence financière',
        score: emergencyFundMonths >= 3 ? 85 : emergencyFundMonths >= 1 ? 60 : 30,
        description: emergencyFundMonths >= 3 
          ? 'Vous privilégiez la sécurité et anticipez les risques'
          : 'Vous pourriez bénéficier d\'une approche plus prudente',
        financialImpact: 'Réduction du stress, stabilité à long terme',
        suggestions: emergencyFundMonths < 3 
          ? ['Construisez progressivement votre épargne de précaution']
          : ['Explorez des investissements plus dynamiques avec l\'excédent']
      },
      {
        trait: 'Discipline budgétaire',
        score: savingsRate >= 15 ? 90 : savingsRate >= 5 ? 70 : balance >= 0 ? 50 : 20,
        description: savingsRate >= 15
          ? 'Excellente maîtrise de vos finances au quotidien'
          : 'Votre discipline budgétaire peut être renforcée',
        financialImpact: 'Capacité d\'atteinte des objectifs financiers',
        suggestions: savingsRate < 15
          ? ['Automatisez votre épargne', 'Utilisez la règle 50/30/20']
          : ['Maintenez vos bonnes habitudes', 'Optimisez vos investissements']
      },
      {
        trait: 'Tolérance au risque',
        score: totalAssets > totalExpenses * 6 ? 70 : debtToIncomeRatio < 20 ? 60 : 40,
        description: 'Votre profil semble modérément conservateur',
        financialImpact: 'Équilibre entre sécurité et croissance du patrimoine',
        suggestions: [
          'Diversifiez progressivement vos placements',
          'Éduquez-vous sur les différents types d\'investissement'
        ]
      }
    ];
  };

  const insights = generateInsights();
  const predictions = generatePredictions();
  const personalityInsights = analyzePersonality();

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  const categoryColors = {
    positive: 'bg-emerald-500/20 text-emerald-400',
    warning: 'bg-red-500/20 text-red-400',
    opportunity: 'bg-blue-500/20 text-blue-400',
    neutral: 'bg-gray-500/20 text-gray-400'
  };

  const priorityOrder = { high: 3, medium: 2, low: 1 };

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header with AI Animation */}
      <div className="text-center">
        <div className="relative inline-block mb-4">
          <Brain className="text-[hsl(var(--rivela-accent))] animate-pulse" size={48} />
          <div className="absolute -top-2 -right-2">
            <Sparkles className="text-yellow-400 animate-bounce" size={20} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Insights & Révélations IA
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Analyse approfondie de votre situation financière avec des recommandations 
          personnalisées et des prédictions basées sur l'intelligence artificielle.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glassmorphism rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            <CountUp end={insights.filter(i => i.category === 'positive').length} duration={2} />
          </div>
          <div className="text-white/70 text-sm">Points forts</div>
        </div>
        <div className="glassmorphism rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-400 mb-1">
            <CountUp end={insights.filter(i => i.category === 'opportunity').length} duration={2} />
          </div>
          <div className="text-white/70 text-sm">Opportunités</div>
        </div>
        <div className="glassmorphism rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-400 mb-1">
            <CountUp end={insights.filter(i => i.category === 'warning').length} duration={2} />
          </div>
          <div className="text-white/70 text-sm">Alertes</div>
        </div>
        <div className="glassmorphism rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            <CountUp end={Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)} duration={2} />%
          </div>
          <div className="text-white/70 text-sm">Fiabilité</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { key: 'all', label: 'Tous', count: insights.length },
          { key: 'positive', label: 'Points forts', count: insights.filter(i => i.category === 'positive').length },
          { key: 'opportunity', label: 'Opportunités', count: insights.filter(i => i.category === 'opportunity').length },
          { key: 'warning', label: 'Alertes', count: insights.filter(i => i.category === 'warning').length }
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === key
                ? 'bg-[hsl(var(--rivela-accent))] text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glassmorphism rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${categoryColors[insight.category]}`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{insight.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      insight.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {insight.priority === 'high' ? 'Prioritaire' : insight.priority === 'medium' ? 'Important' : 'Informatif'}
                    </span>
                  </div>
                  <p className="text-white/80 mb-4">{insight.description}</p>
                  
                  {/* Metrics */}
                  {insight.metrics && (
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-white/60 text-sm">Actuel:</span>
                        <span className="text-white font-medium">{insight.metrics.current.toFixed(1)}</span>
                      </div>
                      {insight.metrics.target && (
                        <div className="flex items-center space-x-2">
                          <span className="text-white/60 text-sm">Objectif:</span>
                          <span className="text-emerald-400 font-medium">{insight.metrics.target}</span>
                        </div>
                      )}
                      {insight.metrics.trend && (
                        <div className="flex items-center space-x-1">
                          {insight.metrics.trend === 'up' && <TrendingUp className="text-emerald-400" size={16} />}
                          {insight.metrics.trend === 'down' && <TrendingDown className="text-red-400" size={16} />}
                          {insight.metrics.trend === 'stable' && <div className="w-4 h-0.5 bg-amber-400" />}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <h4 className="text-white font-medium flex items-center">
                      <Lightbulb className="mr-2" size={16} />
                      Recommandations
                    </h4>
                    {insight.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start">
                        <ArrowRight className="text-[hsl(var(--rivela-accent))] mt-0.5 mr-2 flex-shrink-0" size={16} />
                        <span className="text-white/80 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Confidence Score */}
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={insight.confidence}
                  text={`${insight.confidence}%`}
                  styles={buildStyles({
                    textSize: '24px',
                    textColor: 'white',
                    pathColor: 'hsl(var(--rivela-accent))',
                    trailColor: 'rgba(255, 255, 255, 0.1)'
                  })}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Predictions Section */}
      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white flex items-center">
            <Crystal className="mr-3" size={28} />
            Prédictions & Projections
          </h3>
          <button
            onClick={() => setShowPredictions(!showPredictions)}
            className="bg-[hsl(var(--rivela-accent))] hover:bg-[hsl(var(--rivela-accent))]/80 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {showPredictions ? 'Masquer' : 'Afficher'}
          </button>
        </div>

        <AnimatePresence>
          {showPredictions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {predictions.map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="bg-white/5 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-white">{prediction.title}</h4>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                          {prediction.timeframe === '3months' ? '3 mois' :
                           prediction.timeframe === '6months' ? '6 mois' :
                           prediction.timeframe === '1year' ? '1 an' : '5 ans'}
                        </span>
                      </div>
                      <p className="text-white/80 mb-3">{prediction.description}</p>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-white/60 text-sm">Probabilité:</span>
                          <div className="w-20">
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-[hsl(var(--rivela-accent))] h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${prediction.probability}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-white font-medium text-sm">{prediction.probability}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <span className="text-white/60 text-sm">Facteurs clés:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {prediction.factors.map((factor, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white/10 text-white/80 rounded text-sm">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Personality Analysis */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Users className="mr-3" size={28} />
          Profil Financier Personnel
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personalityInsights.map((trait, index) => (
            <motion.div
              key={trait.trait}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/5 rounded-lg p-4"
            >
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto mb-3">
                  <CircularProgressbar
                    value={trait.score}
                    text={`${trait.score}`}
                    styles={buildStyles({
                      textSize: '20px',
                      textColor: 'white',
                      pathColor: trait.score >= 70 ? '#10b981' : trait.score >= 50 ? '#f59e0b' : '#ef4444',
                      trailColor: 'rgba(255, 255, 255, 0.1)'
                    })}
                  />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">{trait.trait}</h4>
                <p className="text-white/70 text-sm">{trait.description}</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-white/60 text-sm">Impact financier:</span>
                  <p className="text-white/80 text-sm mt-1">{trait.financialImpact}</p>
                </div>
                
                <div>
                  <span className="text-white/60 text-sm">Suggestions:</span>
                  <ul className="mt-1 space-y-1">
                    {trait.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-white/80 text-sm flex items-start">
                        <div className="w-1 h-1 bg-[hsl(var(--rivela-accent))] rounded-full mt-2 mr-2 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper component for Crystal icon (not in lucide-react)
function Crystal({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L16 8H8L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 8L4 14L12 22L20 14L16 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 8L12 22L16 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Helper component for Trophy icon
function Trophy({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 9H4.5C3.67 9 3 8.33 3 7.5S3.67 6 4.5 6H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 9H19.5C20.33 9 21 8.33 21 7.5S20.33 6 19.5 6H18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 6V5C18 3.9 17.1 3 16 3H8C6.9 3 6 3.9 6 5V6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6V13C6 16.31 8.69 19 12 19S18 16.31 18 13V6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 21H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}