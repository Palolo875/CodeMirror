export interface FinancialItem {
  id: string;
  name: string;
  amount: number;
  category?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'savings' | 'investment' | 'property' | 'other';
  value: number;
  description?: string;
}

export interface FinancialData {
  income: FinancialItem[];
  fixedExpenses: FinancialItem[];
  variableExpenses: FinancialItem[];
  debts: FinancialItem[];
  goals: FinancialItem[];
  assets: Asset[];
}

export interface EmotionalContext {
  mood: number;
  tags: string[];
  notes: string;
}

export interface Insight {
  id: string;
  type: 'warning' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  impact: number;
  priority: 'high' | 'medium' | 'low';
}

export interface JournalEntry {
  id: string;
  date: string;
  question: string;
  financialData: FinancialData;
  emotionalContext: EmotionalContext;
  insights: Insight[];
  savedAt: string;
}

export interface Theme {
  name: string;
  gradient: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

export interface FeedbackData {
  rating: number;
  comment?: string;
  category?: string;
}
