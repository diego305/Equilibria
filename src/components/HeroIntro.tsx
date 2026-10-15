import React, { useState } from 'react';
import {
  Moon,
  Apple,
  Brain,
  Activity,
  Play,
  RotateCcw,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Settings,
  Users,
  Database,
  Sparkles,
  Info,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useGoogleSheets } from '../context/GoogleSheetsContext';

interface HeroIntroProps {
  userName: string;
  setUserName: (name: string) => void;
  onStart: () => void;
  hasResume: boolean;
  onResume: () => void;
  onOpenGuide: () => void;
  onOpenQuestionsMd: () => void;
  autoSaveToSheets: boolean;
  setAutoSaveToSheets: (enabled: boolean) => void;
}

export const HeroIntro: React.FC<HeroIntroProps> = ({
  userName,
  setUserName,
  onStart,
  hasResume,
  onResume,
  onOpenGuide,
  onOpenQuestionsMd,
  autoSaveToSheets,
  setAutoSaveToSheets,
}) => {
  const { language, t } = useLanguage();
  const {
    isConnected,
    isThirdPartyReady,
    spreadsheet,
    ownerConfig,
    setIsConfigModalOpen,
  } = useGoogleSheets();

  // Step 1: Name registration · Step 2: Google Sheets storage activation
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const isEn = language === 'en';

  const handleProceedToStep2 = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCurrentStep(2);
  };

  const handleStartQuizFromStep2 = () => {
    onStart();
  };

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
        {/* Pilar 1: Sueño */}
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

        {/* Pilar 2: Alimentación */}
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

        {/* Pilar 3: Salud Mental */}
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

        {/* Pilar 4: Ejercicio */}
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

      {/* 2-Step Onboarding Card: Registration -> Google Sheets Storage Activation */}
      <div className="mt-8 bg-white dark:bg-[#101917] rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-sm max-w-xl mx-auto space-y-6">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentStep === 1
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-600/30'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                1
              </span>
              <span>{t('stepName')}</span>
            </button>

            <span className="text-stone-300 dark:text-stone-700">→</span>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentStep === 2
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-600/30'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                2
              </span>
              <span>{t('stepSheets')}</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
            {isEn ? `Step ${currentStep} of 2` : `Paso ${currentStep} de 2`}
          </span>
        </div>

        {/* STEP 1: Name / Identifier Registration */}
        {currentStep === 1 && (
          <form onSubmit={handleProceedToStep2} className="space-y-6">
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
                autoFocus
              />
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1.5">
                {t('nameHelp')}
              </p>
            </div>

            {/* Buttons for Step 1 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-all transform active:scale-[0.99] cursor-pointer"
              >
                <span>{t('btnNextStepSheets')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {hasResume && (
                <button
                  type="button"
                  onClick={onResume}
                  className="py-3.5 px-5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/80 font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('btnResume')}</span>
                </button>
              )}
            </div>
          </form>
        )}

        {/* STEP 2: Activate Google Sheets Data Storage */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  {t('stepSheets')}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                {t('step2Title')}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                {t('step2Subtitle')}
              </p>
            </div>

            {/* Interactive Activation Switch Card */}
            <div
              onClick={() => setAutoSaveToSheets(!autoSaveToSheets)}
              role="checkbox"
              aria-checked={autoSaveToSheets}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setAutoSaveToSheets(!autoSaveToSheets);
                }
              }}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                autoSaveToSheets
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      autoSaveToSheets
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {t('toggleAutoSave')}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {t('toggleAutoSaveSubtext')}
                    </p>
                  </div>
                </div>

                {/* Animated Switch Pill */}
                <div
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${
                    autoSaveToSheets ? 'bg-emerald-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-xs flex items-center justify-center">
                    {autoSaveToSheets ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Status indicator badge inside card */}
              <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {autoSaveToSheets ? t('tagAutoSaveEnabled') : t('tagAutoSaveDisabled')}
                </span>
                <span className="text-stone-500 dark:text-stone-400">
                  {isEn ? 'Tap anywhere to toggle' : 'Toca para activar o desactivar'}
                </span>
              </div>
            </div>

            {/* Google Sheets Connection Context / Target Sheet Details */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isConnected || isThirdPartyReady
                        ? 'bg-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-amber-400 ring-2 ring-amber-400/20'
                    }`}
                  />
                  <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                    {isConnected || isThirdPartyReady
                      ? t('sheetsStatusActive')
                      : t('sheetsStatusPending')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  title={isEn ? 'Configure owner sheet' : 'Configurar hoja del evaluador'}
                >
                  <Settings className="w-3 h-3" />
                  <span>{isEn ? 'Configure' : 'Configurar'}</span>
                </button>
              </div>

              <div className="text-xs text-stone-600 dark:text-stone-300 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 dark:text-stone-400">
                    {isEn ? 'Assigned Name:' : 'Nombre para la evaluación:'}
                  </span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 font-mono">
                    {userName.trim() || (isEn ? 'Participant (Default)' : 'Participante (Por defecto)')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 dark:text-stone-400">
                    {isEn ? 'Target Database:' : 'Destino:'}
                  </span>
                  <span className="font-medium text-emerald-800 dark:text-emerald-300 truncate max-w-[220px]">
                    {spreadsheet?.name ||
                      (ownerConfig.ownerName
                        ? `${ownerConfig.ownerName}`
                        : 'Equilibria - Base de Datos')}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons for Step 2 */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleStartQuizFromStep2}
                className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-all transform active:scale-[0.99] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t('btnStartQuizWithSheets')}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-3.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 font-medium text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('btnBackToName')}</span>
              </button>
            </div>
          </div>
        )}

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
