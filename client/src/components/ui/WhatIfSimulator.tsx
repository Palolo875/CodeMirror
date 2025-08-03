import React, { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

interface WhatIfSimulatorProps {
  currentBalance: number;
  currentIncome: number;
}

export function WhatIfSimulator({ currentBalance, currentIncome }: WhatIfSimulatorProps) {
  const [incomeChange, setIncomeChange] = useState(0);
  const [expenseReduction, setExpenseReduction] = useState(0);

  const simulatedBalance = currentBalance + incomeChange - expenseReduction;
  const monthlyImpact = incomeChange - expenseReduction;
  const yearlyImpact = monthlyImpact * 12;

  return (
    <div className="glassmorphism rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Calculator size={20} className="mr-2" />
        Simulateur "Et si..."
      </h3>

      <div className="space-y-6">
        <div>
          <label className="block text-white/80 mb-2">
            Changement de revenus mensuel
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="-500"
              max="1000"
              step="50"
              value={incomeChange}
              onChange={(e) => setIncomeChange(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-white font-medium w-20 text-right">
              {incomeChange >= 0 ? '+' : ''}{incomeChange}€
            </span>
          </div>
        </div>

        <div>
          <label className="block text-white/80 mb-2">
            Réduction des dépenses mensuel
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="0"
              max="500"
              step="25"
              value={expenseReduction}
              onChange={(e) => setExpenseReduction(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-white font-medium w-20 text-right">
              -{expenseReduction}€
            </span>
          </div>
        </div>

        <div className="p-4 bg-white/10 rounded-lg">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <TrendingUp size={16} className="mr-2" />
            Impact simulé
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/80">Nouveau solde mensuel:</span>
              <span className={`font-medium ${simulatedBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {simulatedBalance >= 0 ? '+' : ''}{simulatedBalance.toFixed(0)}€
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Impact annuel:</span>
              <span className={`font-medium ${yearlyImpact >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {yearlyImpact >= 0 ? '+' : ''}{yearlyImpact.toLocaleString()}€
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
