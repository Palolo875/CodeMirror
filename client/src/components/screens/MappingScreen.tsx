import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  TrendingUp,
  Home,
  ShoppingCart,
  CreditCard,
  Target,
  Heart,
  Briefcase,
  Info,
} from 'lucide-react';
import { FinancialInput } from '../ui/FinancialInput';
import { EmotionalContext } from '../ui/EmotionalContext';
import { AssetsInput } from '../ui/AssetsInput';
import { useTheme } from '../../contexts/ThemeContext';
import { FinancialData, EmotionalContext as EmotionalContextType } from '../../types';

interface MappingScreenProps {
  question: string;
  onBack: () => void;
  onComplete: (data: FinancialData, emotional: EmotionalContextType) => void;
}

export function MappingScreen({ question, onBack, onComplete }: MappingScreenProps) {
  const { theme } = useTheme();
  const [financialData, setFinancialData] = useState<FinancialData>({
    income: [],
    fixedExpenses: [],
    variableExpenses: [],
    debts: [],
    goals: [],
    assets: [],
  });
  const [emotionalContext, setEmotionalContext] = useState<EmotionalContextType>({
    mood: 5,
    tags: [],
    notes: '',
  });
  const [activeSection, setActiveSection] = useState('income');
  const [progress, setProgress] = useState(0);

  // Calculate progress
  useEffect(() => {
    const sections = [
      'income',
      'fixedExpenses',
      'variableExpenses',
      'debts',
      'goals',
      'assets',
      'emotional',
    ];
    const completedSections = sections.filter((section) => {
      if (section === 'emotional') {
        return emotionalContext.tags.length > 0;
      }
      return financialData[section as keyof FinancialData]?.length > 0;
    }).length;
    setProgress(Math.round((completedSections / sections.length) * 100));
  }, [financialData, emotionalContext]);

  const sections = [
    {
      id: 'income',
      name: 'Revenus',
      icon: <TrendingUp size={20} />,
    },
    {
      id: 'fixedExpenses',
      name: 'Dépenses Fixes',
      icon: <Home size={20} />,
    },
    {
      id: 'variableExpenses',
      name: 'Dépenses Variables',
      icon: <ShoppingCart size={20} />,
    },
    {
      id: 'debts',
      name: 'Dettes',
      icon: <CreditCard size={20} />,
    },
    {
      id: 'goals',
      name: 'Objectifs',
      icon: <Target size={20} />,
    },
    {
      id: 'assets',
      name: 'Actifs',
      icon: <Briefcase size={20} />,
    },
    {
      id: 'emotional',
      name: 'Contexte Émotionnel',
      icon: <Heart size={20} />,
    },
  ];

  const handleAddItem = (section: string, item: any) => {
    setFinancialData((prev) => ({
      ...prev,
      [section]: [...prev[section as keyof FinancialData] as any[], item],
    }));
  };

  const handleRemoveItem = (section: string, index: number) => {
    setFinancialData((prev) => ({
      ...prev,
      [section]: (prev[section as keyof FinancialData] as any[]).filter((_, i) => i !== index),
    }));
  };

  const handleEmotionalUpdate = (data: EmotionalContextType) => {
    setEmotionalContext(data);
  };

  const handleSubmit = () => {
    onComplete(financialData, emotionalContext);
  };

  const isReadyToSubmit = () => {
    // Check that at least one category contains data
    return Object.values(financialData).some((category) => category.length > 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="max-w-6xl mx-auto mt-6"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Cartographie Financière</h1>
            <p className="text-white/80 text-sm mt-1">Étape 2 sur 3</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-sm mr-2 text-white">{progress}%</div>
          <div className="w-32 h-2 bg-white/20 rounded-full">
            <div
              className="h-full bg-[hsl(var(--rivela-accent))] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="glassmorphism rounded-xl p-4 mb-6">
        <h2 className="font-medium mb-2 text-white">Votre question</h2>
        <p className="italic text-white/80">{question}</p>
      </div>

      <div className="flex overflow-x-auto pb-2 mb-6 gap-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center p-3 rounded-md whitespace-nowrap transition-colors ${
              activeSection === section.id
                ? 'bg-[hsl(var(--rivela-primary))] font-medium text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.name}
            {section.id !== 'emotional' &&
              (financialData[section.id as keyof FinancialData] as any[])?.length > 0 && (
                <span className="ml-2 bg-white/20 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {(financialData[section.id as keyof FinancialData] as any[]).length}
                </span>
              )}
          </button>
        ))}
      </div>

      <div className="glassmorphism rounded-xl p-6 mb-6">
        {activeSection === 'emotional' ? (
          <EmotionalContext
            value={emotionalContext}
            onChange={handleEmotionalUpdate}
          />
        ) : activeSection === 'assets' ? (
          <AssetsInput
            assets={financialData.assets}
            onAddAsset={(item) => handleAddItem('assets', item)}
            onRemoveAsset={(index) => handleRemoveItem('assets', index)}
          />
        ) : (
          <FinancialInput
            section={activeSection}
            items={financialData[activeSection as keyof FinancialData] as any[]}
            onAddItem={(item) => handleAddItem(activeSection, item)}
            onRemoveItem={(index) => handleRemoveItem(activeSection, index)}
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-white/80">
          <Info size={16} className="mr-2" />
          <span>
            Plus vous ajoutez d'informations, plus vos insights seront précis
          </span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!isReadyToSubmit()}
          className={`bg-[hsl(var(--rivela-primary))] hover:bg-[hsl(var(--rivela-primary))]/80 text-white font-medium py-3 px-8 rounded-xl shadow-lg transition-colors ${
            !isReadyToSubmit() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Révéler mes insights
        </button>
      </div>
    </motion.div>
  );
}
