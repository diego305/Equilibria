import React from 'react';
import { Moon, Apple, Brain, Activity, Play, RotateCcw, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroIntroProps {
  userName: string;
  setUserName: (name: string) => void;
  onStart: () => void;
  hasResume: boolean;
  onResume: () => void;
  onOpenGuide: () => void;
}

export const HeroIntro: React.FC<HeroIntroProps> = ({
  userName,
  setUserName,
  onStart,
  hasResume,
  onResume,
  onOpenGuide,
}) => {
  const { t } = useLanguage();

  return (
    <div className="py-6 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Banner Kicker & Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-800 dark:text-teal-300 bg-teal-100/70 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200/60 dark:border-teal-800/60">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>{t('heroBadge')}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white text-balance leading-tight">
          {t('heroTitle')}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed text-pretty">
          {t('heroDesc')}
        </p>
      </div>

      {/* The 4 Pillars Preview Grid */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pilar 1: Sueño */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Moon className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            {t('p1Name')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('p1Desc')}
          </p>
        </div>

        {/* Pilar 2: Alimentación */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <Apple className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            {t('p2Name')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('p2Desc')}
          </p>
        </div>

        {/* Pilar 3: Salud Mental */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700/60 transition-all shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
            <Brain className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            {t('p3Name')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('p3Desc')}
          </p>
        </div>

        {/* Pilar 4: Ejercicio */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700/60 transition-all shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            {t('p4Name')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('p4Desc')}
          </p>
        </div>
      </div>

      {/* Wellness Formula Banner */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-teal-50 via-emerald-50 to-indigo-50 dark:from-teal-950/30 dark:via-emerald-950/20 dark:to-indigo-950/30 border border-teal-100 dark:border-teal-900/40 text-center">
        <p className="text-xs sm:text-sm font-medium text-teal-900 dark:text-teal-200">
          <span className="font-bold">{t('formulaTitle')}</span>
        </p>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
          {t('formulaSubtitle')}
        </p>
      </div>

      {/* User Input & Action Card */}
      <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-xl mx-auto space-y-6">
        <div>
          <label
            htmlFor="userName"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2"
          >
            {t('nameLabel')}
          </label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder={t('namePlaceholder')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
            maxLength={30}
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            {t('nameHelp')}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onStart}
            className="flex-1 py-3.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-[0.99]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t('btnStart')}</span>
          </button>

          {hasResume && (
            <button
              onClick={onResume}
              className="py-3.5 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{t('btnResume')}</span>
            </button>
          )}
        </div>

        {/* Secondary helper info */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{t('quizDetails')}</span>
          <button
            onClick={onOpenGuide}
            className="text-teal-700 dark:text-teal-400 hover:underline font-medium"
          >
            {t('linkGuide')}
          </button>
        </div>
      </div>
    </div>
  );
};
