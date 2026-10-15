import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { GoogleSheetsProvider, useGoogleSheets } from './context/GoogleSheetsContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroIntro } from './components/HeroIntro';
import { QuestionCard } from './components/QuestionCard';
import { ResultsOverview } from './components/ResultsOverview';
import { ComparativeView } from './components/ComparativeView';
import { ParticipantsDashboard } from './components/ParticipantsDashboard';
import { HistoryView } from './components/HistoryView';
import { HabitPillarGuide } from './components/HabitPillarGuide';
import { QuestionsMarkdownModal } from './components/QuestionsMarkdownModal';
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
import { OwnerSheetConfigModal } from './components/OwnerSheetConfigModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function WellnessApp() {
  const { language, t } = useLanguage();
  const {
    sheetRecords,
    statusMessage,
    clearStatusMessage,
    isConfigModalOpen,
    setIsConfigModalOpen,
    saveRecord,
  } = useGoogleSheets();
  const [currentTab, setCurrentTab] = useState<'quiz' | 'results' | 'compare' | 'history' | 'guide'>('quiz');
  const [userName, setUserName] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<EvaluationResult | null>(null);
  const [storedEvaluations, setStoredEvaluations] = useState<StoredEvaluation[]>([]);
  const [hasResume, setHasResume] = useState<boolean>(false);
  const [isMarkdownModalOpen, setIsMarkdownModalOpen] = useState<boolean>(false);
  const [autoSaveToSheets, setAutoSaveToSheets] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('equilibria_autosave_sheets');
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  const handleToggleAutoSave = (val: boolean) => {
    setAutoSaveToSheets(val);
    try {
      localStorage.setItem('equilibria_autosave_sheets', String(val));
    } catch (e) {
      console.warn('Could not persist autoSaveToSheets preference', e);
    }
  };

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

      // Auto-save to Google Sheets if user activated it in the registration step
      if (autoSaveToSheets) {
        saveRecord(result).catch((err) => {
          console.warn('Auto-save to Google Sheets failed or deferred:', err);
        });
      }
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

  // Select a past evaluation from history, comparison, or Google Sheets database
  const handleSelectEvaluation = (evalId: string) => {
    const found =
      storedEvaluations.find((e) => e.id === evalId) ||
      sheetRecords.find((e) => e.id === evalId);
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
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0c1412] text-stone-800 dark:text-stone-100 flex flex-col transition-colors selection:bg-emerald-100 dark:selection:bg-emerald-950/60">
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
        onOpenQuestionsMd={() => setIsMarkdownModalOpen(true)}
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
                onOpenQuestionsMd={() => setIsMarkdownModalOpen(true)}
                autoSaveToSheets={autoSaveToSheets}
                setAutoSaveToSheets={handleToggleAutoSave}
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
          <ParticipantsDashboard
            storedEvaluations={storedEvaluations}
            sheetRecords={sheetRecords}
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
      <footer className="border-t border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-[#101917]/70 backdrop-blur-sm py-6 text-center text-xs text-stone-500 dark:text-stone-400 no-print transition-colors">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800 dark:text-stone-200">{t('appName')}</span>
            <span>·</span>
            <span>{t('footerSub')}</span>
          </div>
          <div className="text-[11px] text-stone-400 dark:text-stone-500">
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

      {/* 16 Questions & Answers Markdown Modal */}
      <QuestionsMarkdownModal
        isOpen={isMarkdownModalOpen}
        onClose={() => setIsMarkdownModalOpen(false)}
      />

      {/* Owner Google Sheet Configuration Modal for Third Parties / Testers */}
      <OwnerSheetConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

      {/* Floating Status Notification Toast */}
      {statusMessage && (
        <div
          className={`fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 max-w-md p-4 rounded-2xl shadow-xl border flex items-start gap-3 animate-in slide-in-from-bottom-3 duration-200 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100'
              : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100'
          }`}
          role="alert"
        >
          <div className="shrink-0 mt-0.5">
            {statusMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            {statusMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
            {statusMessage.type === 'info' && <Info className="w-5 h-5 text-stone-500" />}
          </div>
          <div className="flex-1 text-xs sm:text-sm leading-snug">
            {statusMessage.text}
          </div>
          <button
            onClick={clearStatusMessage}
            className="shrink-0 p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <GoogleSheetsProvider>
          <WellnessApp />
        </GoogleSheetsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

