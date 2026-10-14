import React from 'react';
import { Moon, Apple, Brain, Activity, Play, RotateCcw, ShieldCheck, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroIntroProps {
  userName: string;
  setUserName: (name: string) => void;
  onStart: () => void;
  hasResume: boolean;
  onResume: () => void;
  onOpenGuide: () => void;
  onOpenQuestionsMd: () => void;
}

export const HeroIntro: React.FC<HeroIntroProps> = ({
  userName,
  setUserName,
  onStart,
  hasResume,
  onResume,
  onOpenGuide,
  onOpenQuestionsMd,
}) => {
  const { t } = useLanguage();

  return (
    <div className="py-6 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Banner Kicker & Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t('heroBadge')}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-100 text-balance leading-tight">
          {t('heroTitle')}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed text-pretty">
          {t('heroDesc')}
        </p>
      </div>

      {/* The 4 Pillars Preview Grid */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pilar 1: Sueño (Calm Sky Blue) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#101917] border border-stone-200/90 dark:border-stone-800/90 hover:border-sky-300 dark:hover:border-sky-700/60 transition-all shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
            <Moon className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
            {t('p1Name')}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
            {t('p1Desc')}
          </p>
        </div>

        {/* Pilar 2: Alimentación (Soft Sage Green) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#101917] border border-stone-200/90 dark:border-stone-800/90 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <Apple className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
            {t('p2Name')}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
            {t('p2Desc')}
          </p>
        </div>

        {/* Pilar 3: Salud Mental (Tranquil Eucalyptus Teal) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#101917] border border-stone-200/90 dark:border-stone-800/90 hover:border-teal-300 dark:hover:border-teal-700/60 transition-all shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
            <Brain className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
            {t('p3Name')}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
            {t('p3Desc')}
          </p>
        </div>

        {/* Pilar 4: Ejercicio (Vital Cyan-Blue) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#101917] border border-stone-200/90 dark:border-stone-800/90 hover:border-cyan-300 dark:hover:border-cyan-700/60 transition-all shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
            {t('p4Name')}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
            {t('p4Desc')}
          </p>
        </div>
      </div>

      {/* Wellness Formula Banner */}
      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/70 to-sky-50/80 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-sky-950/30 border border-emerald-100 dark:border-emerald-900/40 text-center">
        <p className="text-xs sm:text-sm font-medium text-emerald-900 dark:text-emerald-200">
          <span className="font-bold">{t('formulaTitle')}</span>
        </p>
        <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
          {t('formulaSubtitle')}
        </p>
      </div>

      {/* User Input & Action Card */}
      <div className="mt-8 bg-white dark:bg-[#101917] rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-xs max-w-xl mx-auto space-y-6">
        <div>
          <label
            htmlFor="userName"
            className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2"
          >
            {t('nameLabel')}
          </label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder={t('namePlaceholder')}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm transition-all"
            maxLength={30}
          />
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1.5">
            {t('nameHelp')}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onStart}
            className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-all transform active:scale-[0.99] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t('btnStart')}</span>
          </button>

          {hasResume && (
            <button
              onClick={onResume}
              className="py-3.5 px-5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/80 font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('btnResume')}</span>
            </button>
          )}

          {/* Secondary Button: 16 Questions & Multiple Choices in Markdown */}
          <button
            type="button"
            onClick={onOpenQuestionsMd}
            className="py-3.5 px-4 rounded-xl border border-emerald-300/80 dark:border-emerald-800/80 bg-emerald-50/70 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            title={t('btnViewQuestionsMd')}
          >
            <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>{t('btnMarkdownQuestions')}</span>
          </button>
        </div>

        {/* Secondary helper info */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
          <span>{t('quizDetails')}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenQuestionsMd}
              className="text-emerald-700 dark:text-emerald-400 hover:underline font-medium cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('btnMarkdownQuestions')}</span>
            </button>
            <span>·</span>
            <button
              onClick={onOpenGuide}
              className="text-emerald-700 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
            >
              {t('linkGuide')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
