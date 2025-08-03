import { FinancialData, EmotionalContext, Insight } from '../types';

export function calculateInsights(
  financialData: FinancialData,
  emotionalContext: EmotionalContext
): Insight[] {
  const insights: Insight[] = [];

  // Calculate totals
  const totalIncome = financialData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalFixedExpenses = financialData.fixedExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalVariableExpenses = financialData.variableExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalDebts = financialData.debts.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = totalFixedExpenses + totalVariableExpenses + totalDebts;
  const monthlyBalance = totalIncome - totalExpenses;

  // Insight 1: Monthly balance analysis
  if (monthlyBalance < 0) {
    insights.push({
      id: 'negative-balance',
      type: 'warning',
      title: 'Déficit mensuel détecté',
      description: `Vos dépenses dépassent vos revenus de ${Math.abs(monthlyBalance).toFixed(0)}€ par mois. Il est crucial d'agir rapidement pour rééquilibrer votre budget.`,
      impact: Math.abs(monthlyBalance),
      priority: 'high',
    });
  } else if (monthlyBalance < totalIncome * 0.1) {
    insights.push({
      id: 'low-savings',
      type: 'warning',
      title: 'Marge d\'épargne insuffisante',
      description: `Votre capacité d'épargne est de seulement ${monthlyBalance.toFixed(0)}€ par mois (${((monthlyBalance / totalIncome) * 100).toFixed(1)}%). Il est recommandé d'épargner au moins 10% de vos revenus.`,
      impact: totalIncome * 0.1 - monthlyBalance,
      priority: 'medium',
    });
  }

  // Insight 2: Variable expenses analysis
  const variableExpensesRatio = (totalVariableExpenses / totalIncome) * 100;
  if (variableExpensesRatio > 30) {
    const potentialSavings = totalVariableExpenses * 0.15; // 15% reduction potential
    insights.push({
      id: 'high-variable-expenses',
      type: 'opportunity',
      title: 'Dépenses variables élevées',
      description: `Vos dépenses variables représentent ${variableExpensesRatio.toFixed(1)}% de vos revenus. En les réduisant de 15%, vous pourriez économiser ${potentialSavings.toFixed(0)}€ par mois.`,
      impact: potentialSavings,
      priority: 'medium',
    });
  }

  // Insight 3: Debt analysis
  if (totalDebts > totalIncome * 0.3) {
    insights.push({
      id: 'high-debt-ratio',
      type: 'warning',
      title: 'Endettement préoccupant',
      description: `Vos dettes représentent ${((totalDebts / totalIncome) * 100).toFixed(1)}% de vos revenus mensuels. Il est recommandé de ne pas dépasser 30%.`,
      impact: totalDebts - (totalIncome * 0.3),
      priority: 'high',
    });
  }

  // Insight 4: Subscription optimization
  const subscriptionExpenses = financialData.fixedExpenses.filter(expense =>
    expense.name.toLowerCase().includes('abonnement') ||
    expense.name.toLowerCase().includes('netflix') ||
    expense.name.toLowerCase().includes('spotify') ||
    expense.name.toLowerCase().includes('prime')
  );
  
  if (subscriptionExpenses.length > 0) {
    const totalSubscriptions = subscriptionExpenses.reduce((sum, item) => sum + item.amount, 0);
    const potentialSavings = totalSubscriptions * 0.4; // 40% potential savings
    insights.push({
      id: 'subscription-optimization',
      type: 'recommendation',
      title: 'Optimisation des abonnements',
      description: `Vous payez ${totalSubscriptions.toFixed(0)}€/mois en abonnements. En regroupant vos services et éliminant les doublons, vous pourriez économiser ${potentialSavings.toFixed(0)}€/mois.`,
      impact: potentialSavings,
      priority: 'medium',
    });
  }

  // Insight 5: Emergency fund analysis
  const totalAssets = financialData.assets.reduce((sum, asset) => sum + asset.value, 0);
  const emergencyFundTarget = totalExpenses * 3; // 3 months of expenses
  
  if (totalAssets < emergencyFundTarget) {
    insights.push({
      id: 'emergency-fund',
      type: 'recommendation',
      title: 'Fonds d\'urgence insuffisant',
      description: `Votre épargne actuelle de ${totalAssets.toFixed(0)}€ devrait couvrir au moins 3 mois de dépenses (${emergencyFundTarget.toFixed(0)}€). Considérez augmenter votre épargne de sécurité.`,
      impact: emergencyFundTarget - totalAssets,
      priority: 'medium',
    });
  }

  // Insight 6: Emotional context integration
  if (emotionalContext.mood <= 3 && emotionalContext.tags.includes('Anxieux')) {
    insights.push({
      id: 'emotional-stress',
      type: 'recommendation',
      title: 'Impact émotionnel détecté',
      description: 'Votre stress financier semble affecter votre bien-être. Considérez consulter un conseiller financier pour réduire cette anxiété et élaborer un plan d\'action concret.',
      impact: 0,
      priority: 'high',
    });
  }

  // Sort insights by priority and impact
  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.impact - a.impact;
  });
}

export function calculateProjection(financialData: FinancialData, insights: Insight[]): {
  current: number;
  optimized: number;
  totalSavings: number;
} {
  const totalIncome = financialData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = 
    financialData.fixedExpenses.reduce((sum, item) => sum + item.amount, 0) +
    financialData.variableExpenses.reduce((sum, item) => sum + item.amount, 0) +
    financialData.debts.reduce((sum, item) => sum + item.amount, 0);

  const current = totalIncome - totalExpenses;
  const totalSavings = insights
    .filter(insight => insight.type === 'opportunity' || insight.type === 'recommendation')
    .reduce((sum, insight) => sum + insight.impact, 0);
  
  const optimized = current + totalSavings;

  return {
    current,
    optimized,
    totalSavings,
  };
}
