import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Moon, Apple, Brain, Activity } from 'lucide-react';
import { Option, PillarId, Question } from '../types/wellness';
import { getPillars } from '../data/wellnessData';
import { useLanguage } from '../context/LanguageContext';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isLast: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
  onNext,
  onPrev,
  isLast,
}) => {
  const { language, t } = useLanguage();
  const pillars = getPillars(language);
  const pillar = pillars[question.pillar];

  // Render natural soothing icons
  const renderPillarIcon = (pid: PillarId) => {
    switch (pid) {
      case 'sleep':
        return <Moon className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'nutrition':
        return <Apple className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'mind':
        return <Brain className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'exercise':
        return <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Keyboard shortcut listener: 1, 2, 3, 4 to select, Enter to advance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= question.options.length) {
        const opt = question.options[num - 1];
        if (opt) {
          onSelectOption(opt.id);
        }
      } else if (e.key === 'Enter' && selectedOptionId) {
        onNext();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, selectedOptionId, currentIndex, onSelectOption, onNext, onPrev]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Progress & Pillar Bar */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800">
              {renderPillarIcon(question.pillar)}
            </span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              {pillar.name}
            </span>
          </div>
          <div className="font-mono tabular-nums font-medium">
            {language === 'en' ? 'Question' : 'Pregunta'} {currentIndex + 1} {t('questionOf')} {totalQuestions}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-stone-200/70 dark:bg-stone-800 overflow-hidden">
          <div
            className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-[#101917] rounded-3xl p-6 sm:p-8 border border-stone-200/90 dark:border-stone-800 shadow-xs transition-colors">
        {/* Question Header */}
        <div className="space-y-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 leading-snug">
            {question.question}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            {question.context}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {question.options.map((opt: Option, index: number) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSelectOption(opt.id)}
                type="button"
                className={`w-full min-h-[58px] p-4 rounded-2xl text-left border transition-all flex items-center justify-between gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 dark:border-emerald-500 shadow-xs ring-1 ring-emerald-500/30'
                    : 'border-stone-200/90 dark:border-stone-800/90 bg-stone-50/40 dark:bg-stone-800/40 hover:bg-stone-100/70 dark:hover:bg-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {/* Option index indicator */}
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                        : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-sm font-medium block leading-snug ${
                        isSelected
                          ? 'text-emerald-950 dark:text-emerald-100 font-semibold'
                          : 'text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      {opt.label}
                    </span>
                    {opt.subtext && (
                      <span className="text-xs text-stone-500 dark:text-stone-400 block mt-0.5">
                        {opt.subtext}
                      </span>
                    )}
                  </div>
                </div>

                {/* Check indicator */}
                <div className="shrink-0">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-stone-300 dark:border-stone-700 group-hover:border-stone-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Keyboard shortcut hint */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 text-[11px] text-stone-400 dark:text-stone-500 flex items-center justify-between">
          <span>{t('tipKeys')}</span>
          <span>{t('tipEnter')}</span>
        </div>

        {/* Navigation Actions */}
        <div className="mt-6 flex items-center justify-between gap-3 pt-2">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            type="button"
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentIndex === 0
                ? 'opacity-0 pointer-events-none'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('btnPrev')}</span>
          </button>

          <button
            onClick={onNext}
            disabled={!selectedOptionId}
            type="button"
            className={`min-h-[44px] px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
              selectedOptionId
                ? 'bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white active:scale-[0.98]'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
            }`}
          >
            <span>{isLast ? t('btnSeeResults') : t('btnNext')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
