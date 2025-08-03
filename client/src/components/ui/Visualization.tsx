import React from 'react';
import { FinancialData } from '../../types';

interface VisualizationProps {
  financialData: FinancialData;
}

export function Visualization({ financialData }: VisualizationProps) {
  const totalIncome = financialData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalFixedExpenses = financialData.fixedExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalVariableExpenses = financialData.variableExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalDebts = financialData.debts.reduce((sum, item) => sum + item.amount, 0);

  const balance = totalIncome - totalFixedExpenses - totalVariableExpenses - totalDebts;

  const data = [
    { label: 'Revenus', amount: totalIncome, color: 'bg-emerald-500', percentage: 100 },
    { label: 'Dépenses fixes', amount: totalFixedExpenses, color: 'bg-amber-500', percentage: (totalFixedExpenses / totalIncome) * 100 },
    { label: 'Dépenses variables', amount: totalVariableExpenses, color: 'bg-purple-500', percentage: (totalVariableExpenses / totalIncome) * 100 },
    { label: 'Dettes', amount: totalDebts, color: 'bg-red-500', percentage: (totalDebts / totalIncome) * 100 },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        Répartition de vos finances
      </h3>
      
      {/* Visual chart representation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simplified pie chart representation */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 via-amber-500 via-purple-500 to-red-500 flex items-center justify-center">
              <div className="w-32 h-32 bg-gray-900/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {balance >= 0 ? '+' : ''}{balance.toFixed(0)}€
                  </div>
                  <div className="text-white/60 text-sm">Solde</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/10">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 ${item.color} rounded`}></div>
                <span className="text-white">{item.label}</span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{item.amount.toLocaleString()}€</div>
                {item.label !== 'Revenus' && (
                  <div className="text-white/60 text-sm">{item.percentage.toFixed(1)}%</div>
                )}
              </div>
            </div>
          ))}
          
          <hr className="border-white/20" />
          
          <div className={`flex items-center justify-between p-3 rounded-lg ${balance >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            <span className="text-white font-medium">Solde mensuel</span>
            <span className={`font-bold ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {balance >= 0 ? '+' : ''}{balance.toFixed(0)}€
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
