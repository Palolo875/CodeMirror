import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  CreditCard,
  Home,
  Car,
  Smartphone,
  Zap,
  Shield,
  TrendingUp,
  Calculator,
  Eye,
  EyeOff,
  Info,
  ExternalLink
} from 'lucide-react';
import { FinancialData } from '../../types';

interface HiddenFee {
  id: string;
  category: string;
  name: string;
  description: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'once';
  impact: 'low' | 'medium' | 'high';
  detected: boolean;
  suggestions: string[];
  icon: React.ReactNode;
}

interface HiddenFeesDetectorProps {
  financialData: FinancialData;
  onFeesDetected?: (fees: HiddenFee[]) => void;
}

const feeCategories = [
  {
    id: 'banking',
    name: 'Services bancaires',
    icon: <CreditCard size={20} />,
    color: 'blue'
  },
  {
    id: 'housing',
    name: 'Logement',
    icon: <Home size={20} />,
    color: 'green'
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: <Car size={20} />,
    color: 'purple'
  },
  {
    id: 'utilities',
    name: 'Utilitaires',
    icon: <Zap size={20} />,
    color: 'amber'
  },
  {
    id: 'subscriptions',
    name: 'Abonnements',
    icon: <Smartphone size={20} />,
    color: 'red'
  },
  {
    id: 'insurance',
    name: 'Assurances',
    icon: <Shield size={20} />,
    color: 'emerald'
  }
];

export function HiddenFeesDetector({ financialData, onFeesDetected }: HiddenFeesDetectorProps) {
  const [detectedFees, setDetectedFees] = useState<HiddenFee[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [scanProgress, setScanProgress] = useState(0);
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});

  const potentialFees: HiddenFee[] = [
    {
      id: 'bank-account-fees',
      category: 'banking',
      name: 'Frais de tenue de compte',
      description: 'Frais mensuels ou trimestriels prélevés par votre banque',
      amount: 12,
      frequency: 'monthly',
      impact: 'medium',
      detected: false,
      suggestions: [
        'Négocier la suppression avec votre conseiller',
        'Considérer une banque en ligne sans frais',
        'Grouper vos comptes pour réduire les frais'
      ],
      icon: <CreditCard size={16} />
    },
    {
      id: 'overdraft-fees',
      category: 'banking',
      name: 'Frais de découvert',
      description: 'Agios et commissions prélevés en cas de compte débiteur',
      amount: 45,
      frequency: 'monthly',
      impact: 'high',
      detected: false,
      suggestions: [
        'Mettre en place des alertes de solde',
        'Négocier une autorisation de découvert',
        'Utiliser une carte à débit différé'
      ],
      icon: <AlertTriangle size={16} />
    },
    {
      id: 'card-fees',
      category: 'banking',
      name: 'Cotisation carte bancaire',
      description: 'Frais annuels pour votre carte de crédit ou premium',
      amount: 120,
      frequency: 'yearly',
      impact: 'medium',
      detected: false,
      suggestions: [
        'Vérifier si vous utilisez les services inclus',
        'Passer à une carte gratuite si possible',
        'Négocier la gratuité selon vos revenus'
      ],
      icon: <CreditCard size={16} />
    },
    {
      id: 'insurance-overlaps',
      category: 'insurance',
      name: 'Doublons d\'assurance',
      description: 'Couvertures redondantes entre différents contrats',
      amount: 180,
      frequency: 'yearly',
      impact: 'high',
      detected: false,
      suggestions: [
        'Faire un audit de vos assurances',
        'Supprimer les garanties en double',
        'Grouper vos contrats chez un assureur'
      ],
      icon: <Shield size={16} />
    },
    {
      id: 'subscription-overlaps',
      category: 'subscriptions',
      name: 'Abonnements inutilisés',
      description: 'Services payants que vous n\'utilisez plus',
      amount: 35,
      frequency: 'monthly',
      impact: 'medium',
      detected: false,
      suggestions: [
        'Faire le tri dans vos abonnements',
        'Utiliser des services gratuits alternatifs',
        'Partager des comptes familiaux'
      ],
      icon: <Smartphone size={16} />
    },
    {
      id: 'energy-peak-hours',
      category: 'utilities',
      name: 'Tarifs heures pleines',
      description: 'Surcoût électricité en heures de pointe',
      amount: 25,
      frequency: 'monthly',
      impact: 'medium',
      detected: false,
      suggestions: [
        'Décaler l\'utilisation d\'appareils énergivores',
        'Investir dans un programmateur',
        'Changer pour un tarif heures pleines/creuses'
      ],
      icon: <Zap size={16} />
    },
    {
      id: 'car-insurance-excess',
      category: 'transport',
      name: 'Franchise élevée assurance auto',
      description: 'Montant à votre charge en cas de sinistre',
      amount: 800,
      frequency: 'once',
      impact: 'high',
      detected: false,
      suggestions: [
        'Comparer les franchises entre assureurs',
        'Opter pour une franchise réduite si budget le permet',
        'Améliorer votre conduite pour bénéficier de bonus'
      ],
      icon: <Car size={16} />
    },
    {
      id: 'home-maintenance',
      category: 'housing',
      name: 'Charges de copropriété gonflées',
      description: 'Frais de gestion et travaux parfois surévalués',
      amount: 150,
      frequency: 'monthly',
      impact: 'medium',
      detected: false,
      suggestions: [
        'Participer aux assemblées générales',
        'Demander des devis comparatifs',
        'Contester les charges abusives'
      ],
      icon: <Home size={16} />
    }
  ];

  const runScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    const foundFees: HiddenFee[] = [];

    // Simulate scanning process
    for (let i = 0; i < potentialFees.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setScanProgress(((i + 1) / potentialFees.length) * 100);

      const fee = potentialFees[i];
      // Simulate detection logic based on financial data
      const detectionProbability = calculateDetectionProbability(fee, financialData);
      
      if (Math.random() < detectionProbability) {
        foundFees.push({ ...fee, detected: true });
      }
    }

    setDetectedFees(foundFees);
    setIsScanning(false);
    
    if (onFeesDetected) {
      onFeesDetected(foundFees);
    }
  };

  const calculateDetectionProbability = (fee: HiddenFee, data: FinancialData): number => {
    // Enhanced detection logic based on financial patterns
    const totalExpenses = [...data.fixedExpenses, ...data.variableExpenses];
    
    switch (fee.category) {
      case 'banking':
        // Higher probability if no banking expenses declared or very low amounts
        const bankingExpenses = totalExpenses.filter(exp => 
          exp.name.toLowerCase().includes('banque') || 
          exp.name.toLowerCase().includes('compte')
        );
        return bankingExpenses.length === 0 ? 0.8 : 0.4;
        
      case 'insurance':
        const insuranceExpenses = totalExpenses.filter(exp =>
          exp.name.toLowerCase().includes('assurance')
        );
        return insuranceExpenses.length > 2 ? 0.7 : 0.3;
        
      case 'subscriptions':
        const subscriptionExpenses = totalExpenses.filter(exp =>
          exp.name.toLowerCase().includes('abonnement') ||
          exp.name.toLowerCase().includes('netflix') ||
          exp.name.toLowerCase().includes('spotify')
        );
        return subscriptionExpenses.length > 3 ? 0.6 : 0.2;
        
      case 'utilities':
        const utilityExpenses = totalExpenses.filter(exp =>
          exp.name.toLowerCase().includes('électricité') ||
          exp.name.toLowerCase().includes('gaz')
        );
        return utilityExpenses.some(exp => exp.amount > 100) ? 0.5 : 0.2;
        
      default:
        return 0.4;
    }
  };

  const totalHiddenAmount = detectedFees.reduce((sum, fee) => {
    const multiplier = fee.frequency === 'yearly' ? 1/12 : fee.frequency === 'once' ? 1/60 : 1;
    return sum + (fee.amount * multiplier);
  }, 0);

  const filteredFees = selectedCategory === 'all' 
    ? detectedFees 
    : detectedFees.filter(fee => fee.category === selectedCategory);

  const toggleDetails = (feeId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [feeId]: !prev[feeId]
    }));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = feeCategories.find(cat => cat.id === categoryId);
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400',
      green: 'bg-green-500/20 text-green-400',
      purple: 'bg-purple-500/20 text-purple-400',
      amber: 'bg-amber-500/20 text-amber-400',
      red: 'bg-red-500/20 text-red-400',
      emerald: 'bg-emerald-500/20 text-emerald-400'
    };
    return colors[category?.color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
          <Search className="mr-3" size={32} />
          Détecteur de frais cachés
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto mb-6">
          Identifiez les frais cachés et les coûts inutiles dans vos finances 
          pour optimiser votre budget et économiser des centaines d'euros par an.
        </p>
        
        {!isScanning && detectedFees.length === 0 && (
          <button
            onClick={runScan}
            className="bg-[hsl(var(--rivela-accent))] hover:bg-[hsl(var(--rivela-accent))]/80 text-white px-8 py-3 rounded-lg transition-colors flex items-center mx-auto"
          >
            <Search className="mr-2" size={20} />
            Lancer l'analyse
          </button>
        )}
      </div>

      {/* Scanning Animation */}
      {isScanning && (
        <div className="glassmorphism rounded-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-[hsl(var(--rivela-accent))] border-t-transparent rounded-full animate-spin" />
            <h3 className="text-xl font-semibold text-white mb-2">Analyse en cours...</h3>
            <p className="text-white/70">Détection des frais cachés dans vos finances</p>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div 
              className="bg-[hsl(var(--rivela-accent))] h-2 rounded-full transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <div className="text-white/80">{scanProgress.toFixed(0)}% complété</div>
        </div>
      )}

      {/* Results Summary */}
      {detectedFees.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism rounded-xl p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {detectedFees.length}
              </div>
              <div className="text-white/70">Frais détectés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">
                {totalHiddenAmount.toLocaleString()}€
              </div>
              <div className="text-white/70">Coût mensuel estimé</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                {(totalHiddenAmount * 12).toLocaleString()}€
              </div>
              <div className="text-white/70">Économies potentielles/an</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Filter */}
      {detectedFees.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[hsl(var(--rivela-accent))] text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Tous ({detectedFees.length})
          </button>
          {feeCategories.map((category) => {
            const count = detectedFees.filter(fee => fee.category === category.id).length;
            if (count === 0) return null;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                  selectedCategory === category.id
                    ? 'bg-[hsl(var(--rivela-accent))] text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.name} ({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Detected Fees List */}
      <AnimatePresence>
        {filteredFees.map((fee, index) => (
          <motion.div
            key={fee.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
            className="glassmorphism rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(fee.category)}`}>
                  {fee.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{fee.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(fee.impact)}`}>
                      Impact {fee.impact === 'high' ? 'élevé' : fee.impact === 'medium' ? 'moyen' : 'faible'}
                    </span>
                  </div>
                  <p className="text-white/70 mb-3">{fee.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-emerald-400">
                      <DollarSign size={16} className="mr-1" />
                      {fee.amount}€ 
                      <span className="text-white/60 ml-1">
                        /{fee.frequency === 'monthly' ? 'mois' : fee.frequency === 'yearly' ? 'an' : 'unique'}
                      </span>
                    </div>
                    <div className="flex items-center text-white/60">
                      <TrendingUp size={16} className="mr-1" />
                      {(fee.amount * (fee.frequency === 'yearly' ? 1 : fee.frequency === 'monthly' ? 12 : 1)).toLocaleString()}€/an
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleDetails(fee.id)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                {showDetails[fee.id] ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <AnimatePresence>
              {showDetails[fee.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-white/20 pt-4"
                >
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <Info size={16} className="mr-2" />
                    Suggestions d'optimisation
                  </h4>
                  <div className="space-y-2">
                    {fee.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-[hsl(var(--rivela-accent))] rounded-full mt-2 mr-3 flex-shrink-0" />
                        <p className="text-white/80">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="text-[hsl(var(--rivela-accent))] hover:text-[hsl(var(--rivela-accent))]/80 flex items-center text-sm">
                      <ExternalLink size={16} className="mr-1" />
                      En savoir plus
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Action Buttons */}
      {detectedFees.length > 0 && (
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => {
              setDetectedFees([]);
              setScanProgress(0);
            }}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
          >
            <Search className="mr-2" size={20} />
            Nouvelle analyse
          </button>
          <button className="bg-[hsl(var(--rivela-primary))] hover:bg-[hsl(var(--rivela-primary))]/80 text-white px-6 py-3 rounded-lg transition-colors flex items-center">
            <Calculator className="mr-2" size={20} />
            Planifier les économies
          </button>
        </div>
      )}
    </div>
  );
}