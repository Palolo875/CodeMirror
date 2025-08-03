import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { QuestionScreen } from './components/screens/QuestionScreen';
import { MappingScreen } from './components/screens/MappingScreen';
import { RevelationScreenAdvanced as RevelationScreen } from './components/screens/RevelationScreenAdvanced';
import { JournalScreen } from './components/screens/JournalScreen';
import { LearningScreen } from './components/screens/LearningScreen';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ThemeProvider } from './contexts/ThemeContext';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FeedbackSurvey } from './components/ui/FeedbackSurvey';
import { FinancialData, EmotionalContext, JournalEntry, Insight, FeedbackData } from './types';

type Screen = 'question' | 'mapping' | 'revelation' | 'journal' | 'learning';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('question');
  const [question, setQuestion] = useState('');
  const [financialData, setFinancialData] = useState<FinancialData>({
    income: [],
    fixedExpenses: [],
    variableExpenses: [],
    debts: [],
    goals: [],
    assets: [],
  });
  const [emotionalContext, setEmotionalContext] = useState<EmotionalContext>({
    mood: 5,
    tags: [],
    notes: '',
  });
  const [journal, setJournal] = useLocalStorage<JournalEntry[]>('rivela-journal', []);
  const [currentExplorationId, setCurrentExplorationId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionCount, setSessionCount] = useLocalStorage('rivela-session-count', 0);

  // Memoize recent explorations to avoid unnecessary recalculations
  const recentExplorations = useMemo(() => journal.slice(0, 3), [journal]);

  // Memoize session count increment check
  const shouldShowFeedback = useMemo(() => {
    return sessionCount === 3 || (journal.length > 0 && journal.length % 3 === 0);
  }, [sessionCount, journal.length]);

  // Increment session count and show feedback after several sessions
  useEffect(() => {
    setSessionCount((prevCount: number) => prevCount + 1);
    // Show survey after 3 sessions or after saving several explorations
    if (shouldShowFeedback) {
      setTimeout(() => {
        setShowFeedback(true);
      }, 60000); // Show after 1 minute of usage
    }
  }, [shouldShowFeedback]);

  const goToScreen = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  // Memoize callback functions to prevent unnecessary re-renders
  const handleQuestionSubmit = useCallback((q: string) => {
    setQuestion(q);
    // Create new exploration ID
    const newExplorationId = uuidv4();
    setCurrentExplorationId(newExplorationId);
    goToScreen('mapping');
  }, []);

  const handleMappingComplete = useCallback((data: FinancialData, emotional: EmotionalContext) => {
    setFinancialData(data);
    setEmotionalContext(emotional);
    goToScreen('revelation');
  }, []);

  const saveExplorationToJournal = useCallback((insights: Insight[]) => {
    if (!currentExplorationId) return;

    const newEntry: JournalEntry = {
      id: currentExplorationId,
      date: new Date().toISOString(),
      question,
      financialData,
      emotionalContext,
      insights,
      savedAt: format(new Date(), "d MMMM yyyy 'à' HH:mm", {
        locale: fr,
      }),
    };
    setJournal((prev: JournalEntry[]) => [newEntry, ...prev]);
  }, [currentExplorationId, question, financialData, emotionalContext]);

  const loadExplorationFromJournal = useCallback((explorationId: string) => {
    const exploration = journal.find((entry) => entry.id === explorationId);
    if (exploration) {
      setQuestion(exploration.question);
      setFinancialData(exploration.financialData);
      setEmotionalContext(exploration.emotionalContext);
      setCurrentExplorationId(explorationId);
      goToScreen('revelation');
    }
  }, [journal]);

  const deleteExplorationFromJournal = useCallback((explorationId: string) => {
    setJournal((prev: JournalEntry[]) => prev.filter((entry) => entry.id !== explorationId));
  }, []);

  const handleFeedbackSubmit = useCallback((feedback: FeedbackData) => {
    // TODO: Send feedback to API endpoint
    // For now, we'll just store it locally or send to analytics
    setShowFeedback(false);
  }, []);

  const resetToNewExploration = useCallback(() => {
    setQuestion('');
    setFinancialData({
      income: [],
      fixedExpenses: [],
      variableExpenses: [],
      debts: [],
      goals: [],
      assets: [],
    });
    setEmotionalContext({
      mood: 5,
      tags: [],
      notes: '',
    });
    setCurrentExplorationId(null);
    goToScreen('question');
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Layout currentScreen={currentScreen} onNavigate={goToScreen}>
        {currentScreen === 'question' && (
          <QuestionScreen
            onSubmit={handleQuestionSubmit}
            recentExplorations={recentExplorations}
            onLoadExploration={loadExplorationFromJournal}
          />
        )}
        {currentScreen === 'mapping' && (
          <MappingScreen
            question={question}
            onBack={() => goToScreen('question')}
            onComplete={handleMappingComplete}
          />
        )}
        {currentScreen === 'revelation' && (
          <RevelationScreen
            question={question}
            financialData={financialData}
            emotionalContext={emotionalContext}
            onBack={() => goToScreen('mapping')}
            onNewExploration={resetToNewExploration}
            onSaveExploration={saveExplorationToJournal}
            explorationId={currentExplorationId || ''}
            onViewJournal={() => goToScreen('journal')}
            onViewLearning={() => goToScreen('learning')}
          />
        )}
        {currentScreen === 'journal' && (
          <JournalScreen
            journal={journal}
            onLoadExploration={loadExplorationFromJournal}
            onDeleteExploration={deleteExplorationFromJournal}
            onBack={() => goToScreen('question')}
            onNewExploration={resetToNewExploration}
          />
        )}
        {currentScreen === 'learning' && (
          <LearningScreen
            onBack={() => goToScreen('revelation')}
            financialData={financialData}
            emotionalContext={emotionalContext}
          />
        )}
        
        {/* Floating feedback button always visible */}
        <FeedbackSurvey
          type="fab"
          onClose={() => setShowFeedback(true)}
          onSubmit={handleFeedbackSubmit}
        />
        
        {/* Feedback modal that appears automatically */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <FeedbackSurvey
              onClose={() => setShowFeedback(false)}
              onSubmit={handleFeedbackSubmit}
            />
          </div>
        )}
        </Layout>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
