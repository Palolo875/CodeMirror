import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

interface DashboardProps {
  metrics: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    savingsRate: number;
  };
}

export function Dashboard({ metrics }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Revenus</p>
            <p className="text-2xl font-bold text-white">{metrics.totalIncome.toLocaleString()}€</p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Dépenses</p>
            <p className="text-2xl font-bold text-white">{metrics.totalExpenses.toLocaleString()}€</p>
          </div>
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>

      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Solde</p>
            <p className={`text-2xl font-bold ${metrics.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {metrics.balance >= 0 ? '+' : ''}{metrics.balance.toFixed(0)}€
            </p>
          </div>
          <div className={`w-12 h-12 ${metrics.balance >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'} rounded-full flex items-center justify-center`}>
            <DollarSign className={`w-6 h-6 ${metrics.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
          </div>
        </div>
      </div>

      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Taux d'épargne</p>
            <p className="text-2xl font-bold text-white">{metrics.savingsRate.toFixed(1)}%</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
