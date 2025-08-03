import React from 'react';
import { AlertTriangle, Search } from 'lucide-react';
import { FinancialData } from '../../types';

interface HiddenFeesDetectorProps {
  financialData: FinancialData;
}

export function HiddenFeesDetector({ financialData }: HiddenFeesDetectorProps) {
  // Detect potential hidden fees or optimization opportunities
  const detections = [];

  // Check for multiple bank accounts/cards
  const bankRelatedExpenses = financialData.fixedExpenses.filter(expense =>
    expense.name.toLowerCase().includes('banque') ||
    expense.name.toLowerCase().includes('carte') ||
    expense.name.toLowerCase().includes('compte')
  );

  if (bankRelatedExpenses.length > 1) {
    detections.push({
      type: 'warning',
      title: 'Frais bancaires multiples détectés',
      description: 'Vous avez plusieurs frais bancaires. Considérez regrouper vos comptes.',
      amount: bankRelatedExpenses.reduce((sum, item) => sum + item.amount, 0),
    });
  }

  // Check for subscription services
  const subscriptions = financialData.fixedExpenses.filter(expense =>
    expense.name.toLowerCase().includes('netflix') ||
    expense.name.toLowerCase().includes('spotify') ||
    expense.name.toLowerCase().includes('prime') ||
    expense.name.toLowerCase().includes('abonnement')
  );

  if (subscriptions.length > 3) {
    detections.push({
      type: 'opportunity',
      title: 'Nombreux abonnements détectés',
      description: `${subscriptions.length} abonnements trouvés. Vérifiez lesquels vous utilisez réellement.`,
      amount: subscriptions.reduce((sum, item) => sum + item.amount, 0),
    });
  }

  // Check for high variable expenses
  const totalVariable = financialData.variableExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = financialData.income.reduce((sum, item) => sum + item.amount, 0);
  
  if (totalVariable > totalIncome * 0.3) {
    detections.push({
      type: 'warning',
      title: 'Dépenses variables élevées',
      description: 'Vos dépenses variables représentent plus de 30% de vos revenus.',
      amount: totalVariable - (totalIncome * 0.3),
    });
  }

  return (
    <div className="glassmorphism rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Search size={20} className="mr-2 text-amber-400" />
        Détecteur d'optimisations
      </h3>

      {detections.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-emerald-400" />
          </div>
          <p className="text-white/80">
            Aucune optimisation majeure détectée dans vos finances actuelles.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {detections.map((detection, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                detection.type === 'warning'
                  ? 'border-amber-500/30 bg-amber-500/10'
                  : 'border-emerald-500/30 bg-emerald-500/10'
              }`}
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle
                  size={20}
                  className={`mt-1 ${
                    detection.type === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{detection.title}</h4>
                  <p className="text-white/80 text-sm mb-2">{detection.description}</p>
                  <div className="flex items-center text-sm">
                    <span className="text-white/60">Montant concerné:</span>
                    <span className="ml-2 font-medium text-white">
                      {detection.amount.toFixed(0)}€/mois
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
