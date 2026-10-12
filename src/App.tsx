import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroIntro } from './components/HeroIntro';
import { QuestionCard } from './components/QuestionCard';
import { ResultsOverview } from './components/ResultsOverview';
import { ComparativeView } from './components/ComparativeView';
import { HistoryView } from './components/HistoryView';
import { HabitPillarGuide } from './components/HabitPillarGuide';
import { getQuestions, calculateEvaluation } from './data/wellnessData';
import { EvaluationResult, StoredEvaluation } from './types/wellness';
import {
  getStoredEvaluations,
  saveEvaluationToHistory,
  deleteStoredEvaluation,
  clearAllEvaluations,
  getInProgressState,
  saveInProgressState,
  clearInProgressState,
} from './utils/storage';

function WellnessApp() {
  const { language, t } = useLanguage();
  const [currentTab, setCurrentTab] = useState<'quiz' | 'results' | 'compare' | 'history' | 'guide'>('quiz');
  const [userName, setUserName] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<EvaluationResult | null>(null);
  const [storedEvaluations, setStoredEvaluations] = useState<StoredEvaluation[]>([]);
  const [hasResume, setHasResume] = useState<boolean>(false);

  const questions = getQuestions(language);

  // Load stored evaluations and in-progress state on mount
  useEffect(() => {
    const list = getStoredEvaluations();
    setStoredEvaluations(list);

    const inProgress = getInProgressState();
    if (inProgress && Object.keys(inProgress.answers).length > 0) {
      setHasResume(true);
      if (inProgress.userName) {
        setUserName(inProgress.userName);
      }
    }
  }, []);

  // Sync results text when language changes
  useEffect(() => {
    if (currentResult) {
      const updated = calculateEvaluation(currentResult.answers, currentResult.userName, language);
      updated.id = currentResult.id;
      updated.date = currentResult.date;
      setCurrentResult(updated);
    }
  }, [language]);

  // Autosave in-progress state as user answers
  useEffect(() => {
    if (isQuizActive && Object.keys(answers).length > 0) {
      saveInProgressState({
        userName,
        currentQuestionIndex,
        answers,
        updatedAt: new Date().toISOString(),
      });
      setHasResume(true);
    }
  }, [isQuizActive, answers, currentQuestionIndex, userName]);

  // Start test from fresh
  const handleStartTest = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsQuizActive(true);
    setCurrentTab('quiz');
    clearInProgressState();
    setHasResume(false);
  };

  // Resume test in progress
  const handleResumeTest = () => {
    const inProgress = getInProgressState();
    if (inProgress) {
      setAnswers(inProgress.answers || {});
      setCurrentQuestionIndex(inProgress.currentQuestionIndex || 0);
      setUserName(inProgress.userName || '');
      setIsQuizActive(true);
      setCurrentTab('quiz');
    } else {
      handleStartTest();
    }
  };

  // Option selection
  const handleSelectOption = (optionId: string) => {
    const q = questions[currentQuestionIndex];
    if (!q) return;
    setAnswers((prev) => ({
      ...prev,
      [q.id]: optionId,
    }));
  };

  // Next question / finish
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate and save
      const result = calculateEvaluation(answers, userName, language);
      setCurrentResult(result);
      const updatedList = saveEvaluationToHistory(result);
      setStoredEvaluations(updatedList);
      clearInProgressState();
      setHasResume(false);
      setIsQuizActive(false);
      setCurrentTab('results');
    }
  };

  // Prev question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Reset entire test
  const handleResetTest = () => {
    setIsQuizActive(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    clearInProgressState();
    setHasResume(false);
    setCurrentTab('quiz');
  };

  // Select a past evaluation from history or comparison
  const handleSelectEvaluation = (evalId: string) => {
    const found = storedEvaluations.find((e) => e.id === evalId);
    if (found) {
      const regenerated = calculateEvaluation(found.answers, found.userName, language);
      regenerated.id = found.id;
      regenerated.date = found.date;
      setCurrentResult(regenerated);
      setCurrentTab('results');
    }
  };

  // Delete evaluation
  const handleDeleteEvaluation = (evalId: string) => {
    const updated = deleteStoredEvaluation(evalId);
    setStoredEvaluations(updated);
    if (currentResult?.id === evalId) {
      setCurrentResult(null);
    }
  };

  // Clear all
  const handleClearAllHistory = () => {
    clearAllEvaluations();
    setStoredEvaluations([]);
    setCurrentResult(null);
  };

  const currentQ = questions[currentQuestionIndex] || questions[0];

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors selection:bg-teal-100 dark:selection:bg-teal-900/40">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'quiz' && !isQuizActive && currentResult) {
            setCurrentTab('quiz');
          } else {
            setCurrentTab(tab);
          }
        }}
        onResetTest={handleResetTest}
        hasResults={currentResult !== null}
        historyCount={storedEvaluations.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 pb-20 md:pb-12">
        {currentTab === 'quiz' && (
          <>
            {!isQuizActive ? (
              <HeroIntro
                userName={userName}
                setUserName={setUserName}
                onStart={handleStartTest}
                hasResume={hasResume}
                onResume={handleResumeTest}
                onOpenGuide={() => setCurrentTab('guide')}
              />
            ) : (
              <QuestionCard
                question={currentQ}
                currentIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                selectedOptionId={answers[currentQ.id]}
                onSelectOption={handleSelectOption}
                onNext={handleNextQuestion}
                onPrev={handlePrevQuestion}
                isLast={currentQuestionIndex === questions.length - 1}
              />
            )}
          </>
        )}

        {currentTab === 'results' && currentResult && (
          <ResultsOverview
            result={currentResult}
            onRetake={handleStartTest}
            onGoToCompare={() => setCurrentTab('compare')}
            pastEvaluationCount={storedEvaluations.length}
          />
        )}

        {currentTab === 'compare' && (
          <ComparativeView
            storedEvaluations={storedEvaluations}
            currentEvaluation={
              currentResult
                ? {
                    id: currentResult.id,
                    date: currentResult.date,
                    userName: currentResult.userName,
                    totalScore: currentResult.totalScore,
                    pillarScores: currentResult.pillarScores,
                    answers: currentResult.answers,
                    archetypeTitle: currentResult.archetype.title,
                  }
                : undefined
            }
            onTakeNewTest={handleStartTest}
            onSelectEvaluation={handleSelectEvaluation}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            evaluations={storedEvaluations}
            onSelectEvaluation={handleSelectEvaluation}
            onDeleteEvaluation={handleDeleteEvaluation}
            onClearAll={handleClearAllHistory}
            onTakeNewTest={handleStartTest}
          />
        )}

        {currentTab === 'guide' && (
          <HabitPillarGuide onStartTest={handleStartTest} />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 no-print transition-colors">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{t('appName')}</span>
            <span>·</span>
            <span>{t('footerSub')}</span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            {t('footerPillars')}
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation for Thumb Reach */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'results' && !currentResult) {
            setCurrentTab('quiz');
          } else {
            setCurrentTab(tab);
          }
        }}
        hasResults={currentResult !== null}
        historyCount={storedEvaluations.length}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <WellnessApp />
      </LanguageProvider>
    </ThemeProvider>
  );
}
