import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { FinancialItem } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface FinancialInputProps {
  section: string;
  items: FinancialItem[];
  onAddItem: (item: FinancialItem) => void;
  onRemoveItem: (index: number) => void;
}

const sectionConfig = {
  income: {
    title: 'Revenus',
    placeholder: 'Ex: Salaire principal',
    suggestions: ['Salaire principal', 'Revenus secondaires', 'Freelance', 'Allocations', 'Revenus locatifs'],
  },
  fixedExpenses: {
    title: 'Dépenses fixes',
    placeholder: 'Ex: Loyer',
    suggestions: ['Loyer/Prêt immobilier', 'Assurances', 'Abonnements', 'Électricité/Gaz', 'Internet/Téléphone'],
  },
  variableExpenses: {
    title: 'Dépenses variables',
    placeholder: 'Ex: Alimentation',
    suggestions: ['Alimentation', 'Transport', 'Loisirs', 'Vêtements', 'Santé'],
  },
  debts: {
    title: 'Dettes',
    placeholder: 'Ex: Crédit auto',
    suggestions: ['Crédit auto', 'Crédit conso', 'Carte de crédit', 'Prêt étudiant', 'Dette familiale'],
  },
  goals: {
    title: 'Objectifs',
    placeholder: 'Ex: Épargne d\'urgence',
    suggestions: ['Épargne d\'urgence', 'Vacances', 'Voiture', 'Maison', 'Retraite'],
  },
};

export function FinancialInput({ section, items, onAddItem, onRemoveItem }: FinancialInputProps) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const config = sectionConfig[section as keyof typeof sectionConfig];

  const handleAddItem = () => {
    if (newItemName.trim() && newItemAmount.trim()) {
      const amount = parseFloat(newItemAmount);
      if (!isNaN(amount)) {
        onAddItem({
          id: uuidv4(),
          name: newItemName.trim(),
          amount,
        });
        setNewItemName('');
        setNewItemAmount('');
        setShowSuggestions(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewItemName(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-white mb-4">{config.title}</h3>
      
      {/* Existing items */}
      <div className="space-y-3 mb-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/10">
            <span className="flex-1 text-white">{item.name}</span>
            <span className="text-white font-medium">{item.amount}€</span>
            <button
              onClick={() => onRemoveItem(index)}
              className="text-white/60 hover:text-red-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add new item form */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => {
              setNewItemName(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(newItemName.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={config.placeholder}
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--rivela-accent))]"
            onKeyPress={handleKeyPress}
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && config.suggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/20 z-10">
              {config.suggestions
                .filter(suggestion => 
                  suggestion.toLowerCase().includes(newItemName.toLowerCase()) &&
                  !items.some(item => item.name.toLowerCase() === suggestion.toLowerCase())
                )
                .map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 text-white hover:bg-white/20 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {suggestion}
                  </button>
                ))
              }
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <input
            type="number"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(e.target.value)}
            placeholder="Montant"
            className="flex-1 p-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--rivela-accent))]"
            onKeyPress={handleKeyPress}
          />
          <span className="flex items-center text-white/80 px-2">€</span>
          <button
            onClick={handleAddItem}
            disabled={!newItemName.trim() || !newItemAmount.trim()}
            className="px-4 py-3 bg-[hsl(var(--rivela-accent))] hover:bg-[hsl(var(--rivela-accent))]/80 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
