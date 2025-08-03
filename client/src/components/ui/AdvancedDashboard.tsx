import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  PieChart,
  BarChart3,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Star
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import CountUp from 'react-countup';
import { FinancialData, EmotionalContext } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AdvancedDashboardProps {
  financialData: FinancialData;
  emotionalContext: EmotionalContext;
  historicalData?: FinancialData[];
}

interface MetricCard {
  title: string;
  value: number;
  change?: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
  format: 'currency' | 'percentage' | 'number';
}

export function AdvancedDashboard({ financialData, emotionalContext, historicalData = [] }: AdvancedDashboardProps) {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');
  const [selectedMetric, setSelectedMetric] = useState<string>('balance');

  // Calculations
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

  // Financial Health Score (0-100)
  const calculateHealthScore = () => {
    let score = 50; // Base score
    
    // Positive balance adds points
    if (balance > 0) score += 20;
    else score -= 30;
    
    // Savings rate impact
    if (savingsRate >= 20) score += 20;
    else if (savingsRate >= 10) score += 10;
    else if (savingsRate < 0) score -= 20;
    
    // Debt ratio impact
    if (debtToIncomeRatio < 20) score += 15;
    else if (debtToIncomeRatio > 40) score -= 20;
    
    // Emergency fund
    const emergencyFund = totalAssets / totalExpenses;
    if (emergencyFund >= 3) score += 15;
    else if (emergencyFund < 1) score -= 15;
    
    // Emotional wellbeing
    if (emotionalContext.mood >= 7) score += 10;
    else if (emotionalContext.mood <= 3) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const healthScore = calculateHealthScore();

  const metrics: MetricCard[] = [
    {
      title: 'Revenus mensuels',
      value: totalIncome,
      change: 5.2,
      trend: 'up',
      icon: <TrendingUp size={24} />,
      color: 'emerald',
      format: 'currency'
    },
    {
      title: 'Dépenses totales',
      value: totalExpenses,
      change: -2.1,
      trend: 'down',
      icon: <TrendingDown size={24} />,
      color: 'red',
      format: 'currency'
    },
    {
      title: 'Solde mensuel',
      value: balance,
      change: 12.5,
      trend: balance >= 0 ? 'up' : 'down',
      icon: <DollarSign size={24} />,
      color: balance >= 0 ? 'emerald' : 'red',
      format: 'currency'
    },
    {
      title: 'Taux d\'épargne',
      value: savingsRate,
      change: 3.2,
      trend: 'up',
      icon: <Target size={24} />,
      color: 'blue',
      format: 'percentage'
    },
    {
      title: 'Ratio d\'endettement',
      value: debtToIncomeRatio,
      change: -1.5,
      trend: 'down',
      icon: <AlertCircle size={24} />,
      color: debtToIncomeRatio > 30 ? 'red' : 'amber',
      format: 'percentage'
    },
    {
      title: 'Score de santé financière',
      value: healthScore,
      change: 8.3,
      trend: 'up',
      icon: <Activity size={24} />,
      color: healthScore >= 70 ? 'emerald' : healthScore >= 50 ? 'amber' : 'red',
      format: 'number'
    }
  ];

  // Chart data
  const expenseBreakdownData = {
    labels: ['Dépenses fixes', 'Dépenses variables', 'Dettes'],
    datasets: [{
      data: [totalFixedExpenses, totalVariableExpenses, totalDebts],
      backgroundColor: [
        'hsl(var(--rivela-primary))',
        'hsl(var(--rivela-secondary))',
        'hsl(var(--rivela-accent))'
      ],
      borderWidth: 0
    }]
  };

  const trendData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Revenus',
        data: [2800, 2900, 2850, 3100, 3000, totalIncome],
        borderColor: 'hsl(var(--rivela-accent))',
        backgroundColor: 'hsla(var(--rivela-accent), 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Dépenses',
        data: [2600, 2750, 2700, 2800, 2900, totalExpenses],
        borderColor: 'hsl(var(--rivela-primary))',
        backgroundColor: 'hsla(var(--rivela-primary), 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

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

  const formatValue = (value: number, format: 'currency' | 'percentage' | 'number') => {
    switch (format) {
      case 'currency':
        return `${value.toLocaleString()}€`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toFixed(0);
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'bg-emerald-500/20 text-emerald-400',
      red: 'bg-red-500/20 text-red-400',
      blue: 'bg-blue-500/20 text-blue-400',
      amber: 'bg-amber-500/20 text-amber-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Tableau de bord avancé</h2>
          <p className="text-white/70">Vue d'ensemble complète de votre situation financière</p>
        </div>
        <div className="flex items-center space-x-2">
          {(['1M', '3M', '6M', '1Y'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                timeframe === period
                  ? 'bg-[hsl(var(--rivela-accent))] text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glassmorphism rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => setSelectedMetric(metric.title)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(metric.color)}`}>
                {metric.icon}
              </div>
              {metric.change && (
                <div className={`flex items-center text-sm ${
                  metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="ml-1">{Math.abs(metric.change)}%</span>
                </div>
              )}
            </div>
            <div className="mb-2">
              <div className="text-2xl font-bold text-white">
                <CountUp
                  end={metric.value}
                  duration={2}
                  separator=" "
                  decimals={metric.format === 'percentage' ? 1 : 0}
                  suffix={metric.format === 'currency' ? '€' : metric.format === 'percentage' ? '%' : ''}
                />
              </div>
              <div className="text-white/70 text-sm">{metric.title}</div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${
                  metric.color === 'emerald' ? 'from-emerald-500 to-emerald-400' :
                  metric.color === 'red' ? 'from-red-500 to-red-400' :
                  metric.color === 'blue' ? 'from-blue-500 to-blue-400' :
                  'from-amber-500 to-amber-400'
                }`}
                style={{ 
                  width: `${Math.min(100, Math.max(0, 
                    metric.format === 'percentage' ? metric.value : 
                    metric.title.includes('Score') ? metric.value : 
                    (metric.value / Math.max(...metrics.map(m => m.value))) * 100
                  ))}%` 
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Financial Health Score Circle */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Activity size={20} className="mr-2" />
          Score de santé financière
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-1">
            <div className="w-48 h-48 mx-auto">
              <CircularProgressbar
                value={healthScore}
                text={`${healthScore.toFixed(0)}%`}
                styles={buildStyles({
                  textColor: 'white',
                  pathColor: `hsl(var(--rivela-accent))`,
                  trailColor: 'rgba(255, 255, 255, 0.1)',
                  textSize: '16px'
                })}
              />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Gestion du budget</span>
              <div className="flex items-center">
                <div className="w-32 bg-white/20 rounded-full h-2 mr-3">
                  <div className="h-2 bg-emerald-400 rounded-full" style={{ width: '85%' }} />
                </div>
                <span className="text-white">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Épargne et investissement</span>
              <div className="flex items-center">
                <div className="w-32 bg-white/20 rounded-full h-2 mr-3">
                  <div className="h-2 bg-blue-400 rounded-full" style={{ width: `${Math.max(0, savingsRate)}%` }} />
                </div>
                <span className="text-white">{savingsRate.toFixed(0)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Gestion des dettes</span>
              <div className="flex items-center">
                <div className="w-32 bg-white/20 rounded-full h-2 mr-3">
                  <div className="h-2 bg-amber-400 rounded-full" style={{ width: `${Math.max(0, 100 - debtToIncomeRatio)}%` }} />
                </div>
                <span className="text-white">{Math.max(0, 100 - debtToIncomeRatio).toFixed(0)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Bien-être financier</span>
              <div className="flex items-center">
                <div className="w-32 bg-white/20 rounded-full h-2 mr-3">
                  <div className="h-2 bg-purple-400 rounded-full" style={{ width: `${(emotionalContext.mood / 10) * 100}%` }} />
                </div>
                <span className="text-white">{((emotionalContext.mood / 10) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <PieChart size={20} className="mr-2" />
            Répartition des dépenses
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={expenseBreakdownData} options={{ ...chartOptions, cutout: '60%' }} />
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <BarChart3 size={20} className="mr-2" />
            Évolution sur {timeframe}
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={trendData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Zap size={20} className="mr-2" />
          Actions recommandées
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-left transition-colors">
            <CheckCircle className="text-emerald-400 mb-2" size={20} />
            <div className="text-white font-medium mb-1">Optimiser l'épargne</div>
            <div className="text-white/70 text-sm">+150€/mois possible</div>
          </button>
          <button className="p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-left transition-colors">
            <Target className="text-blue-400 mb-2" size={20} />
            <div className="text-white font-medium mb-1">Réviser le budget</div>
            <div className="text-white/70 text-sm">Réduire de 8% les dépenses</div>
          </button>
          <button className="p-4 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg text-left transition-colors">
            <AlertCircle className="text-amber-400 mb-2" size={20} />
            <div className="text-white font-medium mb-1">Consolider les dettes</div>
            <div className="text-white/70 text-sm">Économiser 45€/mois</div>
          </button>
          <button className="p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-left transition-colors">
            <Star className="text-purple-400 mb-2" size={20} />
            <div className="text-white font-medium mb-1">Planifier l'avenir</div>
            <div className="text-white/70 text-sm">Objectifs à long terme</div>
          </button>
        </div>
      </div>
    </div>
  );
}