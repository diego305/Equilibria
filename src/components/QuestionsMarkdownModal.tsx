import React, { useState } from 'react';
import {
  X,
  FileText,
  Moon,
  Apple,
  Brain,
  Activity,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getQuestions, getPillars } from '../data/wellnessData';
import { PillarId } from '../types/wellness';

interface QuestionsMarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionsMarkdownModal: React.FC<QuestionsMarkdownModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, t } = useLanguage();
  const [selectedPillarFilter, setSelectedPillarFilter] = useState<string>('all');

  if (!isOpen) return null;

  const questions = getQuestions(language);
  const pillars = getPillars(language);

  const pillarBadgeIcons: Record<PillarId, React.ReactNode> = {
    sleep: <Moon className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />,
    nutrition: <Apple className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
    mind: <Brain className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />,
    exercise: <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />,
  };

  const filteredQuestions =
    selectedPillarFilter === 'all'
      ? questions
      : questions.filter((q) => q.pillar === selectedPillarFilter);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#101917] rounded-2xl sm:rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transition-all">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-start sm:items-center justify-between gap-4 bg-stone-50/70 dark:bg-stone-900/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2
                id="modal-headline"
                className="text-base sm:text-lg font-bold text-stone-900 dark:text-white truncate"
              >
                {t('mdModalTitle')}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                {t('mdModalSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
            aria-label={t('mdClose')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Pillar Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedPillarFilter('all')}
              className={`px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                selectedPillarFilter === 'all'
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              {language === 'en' ? 'All (16)' : 'Todas (16)'}
            </button>
            {(['sleep', 'nutrition', 'mind', 'exercise'] as PillarId[]).map((pKey) => {
              const p = pillars[pKey];
              const isSelected = selectedPillarFilter === pKey;
              return (
                <button
                  key={pKey}
                  onClick={() => setSelectedPillarFilter(pKey)}
                  className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  {pillarBadgeIcons[pKey]}
                  <span>{p.name.split(' ')[0]} (4)</span>
                </button>
              );
            })}
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const p = pillars[q.pillar];
              const qNum = questions.findIndex((item) => item.id === q.id) + 1;
              const letterBadges = ['A', 'B', 'C', 'D'];

              return (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800/90 transition-all"
                >
                  {/* Top Pill / Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-800 px-2.5 py-0.5 rounded-md border border-stone-200 dark:border-stone-700">
                      {pillarBadgeIcons[q.pillar]}
                      <span>
                        {p.name} · {language === 'en' ? 'Question' : 'Pregunta'} {qNum} de 16
                      </span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <h3 className="font-semibold text-sm sm:text-base text-stone-900 dark:text-white leading-snug">
                    {q.question}
                  </h3>

                  {/* Scientific Context */}
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 italic leading-relaxed">
                    💡 {q.context}
                  </p>

                  {/* Multiple Choice Options List */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={opt.id}
                        className="p-2.5 rounded-xl bg-white dark:bg-stone-800/70 border border-stone-200/80 dark:border-stone-700/60 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center justify-center shrink-0">
                          {letterBadges[oIdx]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-medium text-stone-900 dark:text-stone-100">
                              {opt.label}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-semibold shrink-0">
                              {opt.score} {language === 'en' ? 'pt' : 'pto'}
                              {opt.score > 1 ? 's' : ''}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-tight">
                            {opt.subtext}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scoring Summary Footer inside Modal */}
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs text-stone-700 dark:text-stone-300 space-y-1">
            <div className="font-semibold text-emerald-900 dark:text-emerald-200">
              {language === 'en'
                ? 'Total Score & Habit Matrix'
                : 'Baremo de Evaluación y Puntuación'}
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400">
              {language === 'en'
                ? '16 questions · 4 options each (1 to 4 pts) · Minimum: 16 pts · Maximum: 64 pts. Each pillar contributes up to 16 points to the balance chart.'
                : '16 preguntas · 4 opciones c/u (1 a 4 pts) · Mínimo: 16 pts · Máximo: 64 pts. Cada pilar aporta hasta 16 puntos al radar de equilibrio.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/40 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span>{language === 'en' ? '16 Habit Assessment Questions' : '16 Preguntas de Evaluación de Hábitos'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-medium transition-colors cursor-pointer"
          >
            {t('mdClose')}
          </button>
        </div>
      </div>
    </div>
  );
};
