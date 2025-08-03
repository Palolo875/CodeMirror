import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  TrendingUp,
  Target,
  DollarSign,
  Plus,
  Minus, 
  RotateCcw,
  Save,
  Play,
  PauseCircle,
  BarChart3,
  PieChart,
  Calendar,
  Settings,
  Lightbulb,
  AlertTriangle,
  CheckCircleIcon
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { FinancialData } from '../../types';

interface Scenario {
  id: string;
  name: string;
  description: string;
  changes: {
    incomeMultiplier: number;
    expenseMultiplier: number;
    newIncome?: number;
    newExpenses?: number;
    duration: number; // months
  };
  results?: {
    monthlyImpact: number;
    yearlyImpact: number;
    cumulativeImpact: number;
  };
}

interface AdvancedSimulatorProps {
  financialData: FinancialData;
  onSaveScenario?: (scenario: Scenario) => void;
}

const predefinedScenarios: Scenario[] = [
  {
    id: 'promotion',
    name: 'Promotion (+20% revenus)',
    description: 'Simulation d\'une augmentation de salaire de 20%',
    changes: {
      incomeMultiplier: 1.2,
      expenseMultiplier: 1.0,
      duration: 12
    }
  },
  {
    id: 'expense-reduction',
    name: 'Réduction dépenses (-15%)',
    description: 'Optimisation du budget avec réduction des dépenses variables',
    changes: {
      incomeMultiplier: 1.0,
      expenseMultiplier: 0.85,
      duration: 12
    }
  },
  {
    id: 'side-income',
    name: 'Revenus complémentaires',
    description: 'Ajout de 500€/mois de revenus supplémentaires',
    changes: {
      incomeMultiplier: 1.0,
      expenseMultiplier: 1.0,
      newIncome: 500,
      duration: 12
    }
  },
  {
    id: 'emergency',
    name: 'Urgence financière',
    description: 'Perte de 30% des revenus pendant 6 mois',
    changes: {
      incomeMultiplier: 0.7,
      expenseMultiplier: 1.0,
      duration: 6
    }
  }
];

export function AdvancedSimulator({ financialData, onSaveScenario }: AdvancedSimulatorProps) {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [customScenario, setCustomScenario] = useState<Scenario>({
    id: 'custom',
    name: 'Scénario personnalisé',
    description: 'Créez votre propre simulation',
    changes: {
      incomeMultiplier: 1.0,
      expenseMultiplier: 1.0,
      duration: 12
    }
  });
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Calculate base financial metrics
  const totalIncome = financialData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalFixedExpenses = financialData.fixedExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalVariableExpenses = financialData.variableExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalDebts = financialData.debts.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = totalFixedExpenses + totalVariableExpenses + totalDebts;
  const currentBalance = totalIncome - totalExpenses;

  const runSimulation = (scenario: Scenario) => {
    setIsSimulating(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const { incomeMultiplier, expenseMultiplier, newIncome = 0, newExpenses = 0, duration } = scenario.changes;
      
      const projectedIncome = (totalIncome * incomeMultiplier) + newIncome;
      const projectedExpenses = (totalExpenses * expenseMultiplier) + newExpenses;
      const projectedBalance = projectedIncome - projectedExpenses;
      
      const monthlyImpact = projectedBalance - currentBalance;
      const yearlyImpact = monthlyImpact * 12;
      const cumulativeImpact = monthlyImpact * duration;
      
      // Generate projection data for charts
      const months = Array.from({ length: duration }, (_, i) => i + 1);
      const balanceProjection = months.map(month => {
        return currentBalance + (monthlyImpact * month);
      });
      
      const savingsProjection = months.map(month => {
        return Math.max(0, monthlyImpact * month);
      });

      const results = {
        monthlyImpact,
        yearlyImpact,
        cumulativeImpact,
        projectedIncome,
        projectedExpenses,
        projectedBalance,
        balanceProjection,
        savingsProjection,
        months: months.map(m => `Mois ${m}`),
        riskLevel: calculateRiskLevel(projectedBalance, projectedIncome),
        recommendations: generateRecommendations(scenario, projectedBalance)
      };

      scenario.results = { monthlyImpact, yearlyImpact, cumulativeImpact };
      setSimulationResults(results);
      setIsSimulating(false);
    }, 2000);
  };

  const calculateRiskLevel = (balance: number, income: number): 'low' | 'medium' | 'high' => {
    const savingsRate = income > 0 ? (balance / income) * 100 : 0;
    if (savingsRate >= 20) return 'low';
    if (savingsRate >= 0) return 'medium';
    return 'high';
  };

  const generateRecommendations = (scenario: Scenario, projectedBalance: number): string[] => {
    const recommendations = [];
    
    if (projectedBalance < 0) {
      recommendations.push("Attention : ce scénario génère un déficit. Considérez des mesures d'ajustement.");
      recommendations.push("Réduisez les dépenses non essentielles ou augmentez vos revenus.");
    } else if (projectedBalance > currentBalance) {
      recommendations.push("Excellent ! Ce scénario améliore votre situation financière.");
      recommendations.push("Considérez l'investissement de l'excédent pour maximiser les gains.");
    }
    
    if (scenario.changes.incomeMultiplier > 1) {
      recommendations.push("Profitez de l'augmentation de revenus pour constituer un fonds d'urgence.");
    }
    
    if (scenario.changes.expenseMultiplier < 1) {
      recommendations.push("Maintenez ces bonnes habitudes d'économie sur le long terme.");
    }
    
    return recommendations;
  };

  const chartData = simulationResults ? {
    labels: simulationResults.months,
    datasets: [
      {
        label: 'Solde cumulé',
        data: simulationResults.balanceProjection,
        borderColor: 'hsl(var(--rivela-accent))',
        backgroundColor: 'hsla(var(--rivela-accent), 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Épargne cumulée',
        data: simulationResults.savingsProjection,
        borderColor: 'hsl(var(--rivela-primary))',
        backgroundColor: 'hsla(var(--rivela-primary), 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          callback: function(value: any) {
            return value + '€';
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
          <Calculator className="mr-3" size={32} />
          Simulateur financier avancé
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Explorez différents scénarios financiers et créez vos propres simulations personnalisées
          pour prendre des décisions éclairées.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="glassmorphism rounded-lg p-1 flex">
          <button
            onClick={() => setIsCustomMode(false)}
            className={`px-6 py-2 rounded-md transition-colors ${
              !isCustomMode ? 'bg-[hsl(var(--rivela-accent))] text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Scénarios prédéfinis
          </button>
          <button
            onClick={() => setIsCustomMode(true)}
            className={`px-6 py-2 rounded-md transition-colors ${
              isCustomMode ? 'bg-[hsl(var(--rivela-accent))] text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Simulation personnalisée
          </button>
        </div>
      </div>

      {/* Scenario Selection */}
      {!isCustomMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {predefinedScenarios.map((scenario) => (
            <motion.div
              key={scenario.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`glassmorphism rounded-xl p-6 cursor-pointer transition-all ${
                selectedScenario?.id === scenario.id ? 'ring-2 ring-[hsl(var(--rivela-accent))]' : ''
              }`}
              onClick={() => setSelectedScenario(scenario)}
            >
              <h3 className="text-xl font-semibold text-white mb-2">{scenario.name}</h3>
              <p className="text-white/70 mb-4">{scenario.description}</p>
              <div className="space-y-2 text-sm">
                {scenario.changes.incomeMultiplier !== 1.0 && (
                  <div className="flex items-center text-emerald-400">
                    <TrendingUp size={16} className="mr-2" />
                    Revenus: {((scenario.changes.incomeMultiplier - 1) * 100).toFixed(0)}%
                  </div>
                )}
                {scenario.changes.expenseMultiplier !== 1.0 && (
                  <div className="flex items-center text-blue-400">
                    <Target size={16} className="mr-2" />
                    Dépenses: {((scenario.changes.expenseMultiplier - 1) * 100).toFixed(0)}%
                  </div>
                )}
                {scenario.changes.newIncome && (
                  <div className="flex items-center text-green-400">
                    <Plus size={16} className="mr-2" />
                    +{scenario.changes.newIncome}€/mois
                  </div>
                )}
                <div className="flex items-center text-white/60">
                  <Calendar size={16} className="mr-2" />
                  Durée: {scenario.changes.duration} mois
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Custom Scenario Builder */}
      {isCustomMode && (
        <div className="glassmorphism rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <Settings className="mr-2" />
            Créer une simulation personnalisée
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 mb-2">Nom du scénario</label>
                <input
                  type="text"
                  value={customScenario.name}
                  onChange={(e) => setCustomScenario({...customScenario, name: e.target.value})}
                  className="w-full p-3 bg-white/10 rounded-lg text-white placeholder-white/50 border border-white/20 focus:border-[hsl(var(--rivela-accent))] focus:outline-none"
                  placeholder="Nom de votre scénario"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">Description</label>
                <textarea
                  value={customScenario.description}
                  onChange={(e) => setCustomScenario({...customScenario, description: e.target.value})}
                  className="w-full p-3 bg-white/10 rounded-lg text-white placeholder-white/50 border border-white/20 focus:border-[hsl(var(--rivela-accent))] focus:outline-none"
                  placeholder="Décrivez votre scénario"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">
                  Modification des revenus: {((customScenario.changes.incomeMultiplier - 1) * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={customScenario.changes.incomeMultiplier}
                  onChange={(e) => setCustomScenario({
                    ...customScenario,
                    changes: {...customScenario.changes, incomeMultiplier: parseFloat(e.target.value)}
                  })}
                  className="w-full accent-[hsl(var(--rivela-accent))]"
                />
                <div className="flex justify-between text-sm text-white/60 mt-1">
                  <span>-50%</span>
                  <span>+100%</span>
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-2">
                  Modification des dépenses: {((customScenario.changes.expenseMultiplier - 1) * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={customScenario.changes.expenseMultiplier}
                  onChange={(e) => setCustomScenario({
                    ...customScenario,
                    changes: {...customScenario.changes, expenseMultiplier: parseFloat(e.target.value)}
                  })}
                  className="w-full accent-[hsl(var(--rivela-accent))]"
                />
                <div className="flex justify-between text-sm text-white/60 mt-1">
                  <span>-50%</span>
                  <span>+50%</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white/80 mb-2">Revenus supplémentaires (€/mois)</label>
                <input
                  type="number"
                  value={customScenario.changes.newIncome || 0}
                  onChange={(e) => setCustomScenario({
                    ...customScenario,
                    changes: {...customScenario.changes, newIncome: parseInt(e.target.value) || 0}
                  })}
                  className="w-full p-3 bg-white/10 rounded-lg text-white placeholder-white/50 border border-white/20 focus:border-[hsl(var(--rivela-accent))] focus:outline-none"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">Dépenses supplémentaires (€/mois)</label>
                <input
                  type="number"
                  value={customScenario.changes.newExpenses || 0}
                  onChange={(e) => setCustomScenario({
                    ...customScenario,
                    changes: {...customScenario.changes, newExpenses: parseInt(e.target.value) || 0}
                  })}
                  className="w-full p-3 bg-white/10 rounded-lg text-white placeholder-white/50 border border-white/20 focus:border-[hsl(var(--rivela-accent))] focus:outline-none"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">Durée (mois): {customScenario.changes.duration}</label>
                <input
                  type="range"
                  min="1"
                  max="60"
                  step="1"
                  value={customScenario.changes.duration}
                  onChange={(e) => setCustomScenario({
                    ...customScenario,
                    changes: {...customScenario.changes, duration: parseInt(e.target.value)}
                  })}
                  className="w-full accent-[hsl(var(--rivela-accent))]"
                />
                <div className="flex justify-between text-sm text-white/60 mt-1">
                  <span>1 mois</span>
                  <span>5 ans</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedScenario(customScenario)}
                className="w-full bg-[hsl(var(--rivela-accent))] hover:bg-[hsl(var(--rivela-accent))]/80 text-white py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                <Save className="mr-2" size={20} />
                Préparer la simulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulation Controls */}
      {selectedScenario && (
        <div className="glassmorphism rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <Play className="mr-2" />
              {selectedScenario.name}
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={() => runSimulation(selectedScenario)}
                disabled={isSimulating}
                className="bg-[hsl(var(--rivela-accent))] hover:bg-[hsl(var(--rivela-accent))]/80 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
              >
                {isSimulating ? (
                  <>
                    <PauseCircle className="mr-2 animate-spin" size={20} />
                    Simulation...
                  </>
                ) : (
                  <>
                    <Play className="mr-2" size={20} />
                    Lancer
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setSelectedScenario(null);
                  setSimulationResults(null);
                }}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
              >
                <RotateCcw className="mr-2" size={20} />
                Reset
              </button>
            </div>
          </div>

          <p className="text-white/70 mb-4">{selectedScenario.description}</p>

          {/* Current vs Projected */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="text-white/80 text-sm mb-1">Situation actuelle</h4>
              <div className="text-2xl font-bold text-white">{currentBalance.toLocaleString()}€</div>
              <div className="text-white/60 text-sm">Solde mensuel</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="text-white/80 text-sm mb-1">Situation projetée</h4>
              <div className="text-2xl font-bold text-emerald-400">
                {simulationResults ? simulationResults.projectedBalance.toLocaleString() : '---'}€
              </div>
              <div className="text-white/60 text-sm">Nouveau solde mensuel</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="text-white/80 text-sm mb-1">Impact mensuel</h4>
              <div className={`text-2xl font-bold ${
                simulationResults?.monthlyImpact >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {simulationResults?.monthlyImpact >= 0 ? '+' : ''}
                {simulationResults ? simulationResults.monthlyImpact.toLocaleString() : '---'}€
              </div>
              <div className="text-white/60 text-sm">Différence</div>
            </div>
          </div>
        </div>
      )}

      {/* Simulation Results */}
      <AnimatePresence>
        {simulationResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Impact Summary */}
            <div className="glassmorphism rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <BarChart3 className="mr-2" />
                Résultats de la simulation
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    simulationResults.monthlyImpact >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {simulationResults.monthlyImpact >= 0 ? '+' : ''}
                    {simulationResults.monthlyImpact.toLocaleString()}€
                  </div>
                  <div className="text-white/70">Impact mensuel</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    simulationResults.yearlyImpact >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {simulationResults.yearlyImpact >= 0 ? '+' : ''}
                    {simulationResults.yearlyImpact.toLocaleString()}€
                  </div>
                  <div className="text-white/70">Impact annuel</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    simulationResults.cumulativeImpact >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {simulationResults.cumulativeImpact >= 0 ? '+' : ''}
                    {simulationResults.cumulativeImpact.toLocaleString()}€
                  </div>
                  <div className="text-white/70">Impact cumulé</div>
                </div>
              </div>

              {/* Risk Level */}
              <div className={`p-4 rounded-lg flex items-center ${
                simulationResults.riskLevel === 'low' ? 'bg-emerald-500/20' :
                simulationResults.riskLevel === 'medium' ? 'bg-amber-500/20' : 'bg-red-500/20'
              }`}>
                {simulationResults.riskLevel === 'low' ? (
                  <CheckCircleIcon className="text-emerald-400 mr-3" size={24} />
                ) : (
                  <AlertTriangle className={`mr-3 ${
                    simulationResults.riskLevel === 'medium' ? 'text-amber-400' : 'text-red-400'
                  }`} size={24} />
                )}
                <div>
                  <div className="text-white font-medium">
                    Niveau de risque: {
                      simulationResults.riskLevel === 'low' ? 'Faible' :
                      simulationResults.riskLevel === 'medium' ? 'Moyen' : 'Élevé'
                    }
                  </div>
                  <div className="text-white/70 text-sm">
                    {simulationResults.riskLevel === 'low' && 'Excellente situation financière avec épargne positive'}
                    {simulationResults.riskLevel === 'medium' && 'Situation équilibrée mais surveiller les dépenses'}
                    {simulationResults.riskLevel === 'high' && 'Attention: déficit potentiel, ajustements nécessaires'}
                  </div>
                </div>
              </div>
            </div>

            {/* Projection Chart */}
            {chartData && (
              <div className="glassmorphism rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <TrendingUp className="mr-2" />
                  Évolution projetée
                </h3>
                <div style={{ height: '400px' }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            )}

            {/* Recommendations */}
            {simulationResults.recommendations && (
              <div className="glassmorphism rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Lightbulb className="mr-2" />
                  Recommandations
                </h3>
                <div className="space-y-4">
                  {simulationResults.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-[hsl(var(--rivela-accent))] rounded-full mt-3 mr-3 flex-shrink-0" />
                      <p className="text-white/80">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Scenario */}
            {onSaveScenario && (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    if (selectedScenario) {
                      onSaveScenario(selectedScenario);
                    }
                  }}
                  className="bg-[hsl(var(--rivela-primary))] hover:bg-[hsl(var(--rivela-primary))]/80 text-white px-8 py-3 rounded-lg transition-colors flex items-center"
                >
                  <Save className="mr-2" size={20} />
                  Sauvegarder ce scénario
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}