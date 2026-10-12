import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  Printer,
  RotateCcw,
  GitCompare,
  CheckCircle2,
  Moon,
  Apple,
  Brain,
  Activity,
  Calendar,
  Share2,
} from 'lucide-react';
import { EvaluationResult, PillarId } from '../types/wellness';
import { getPillars } from '../data/wellnessData';
import { RadarChart } from './RadarChart';
import { generateEvaluationPDF } from '../utils/pdfExport';
import { useLanguage } from '../context/LanguageContext';

interface ResultsOverviewProps {
  result: EvaluationResult;
  onRetake: () => void;
  onGoToCompare: () => void;
  pastEvaluationCount: number;
}

export const ResultsOverview: React.FC<ResultsOverviewProps> = ({
  result,
  onRetake,
  onGoToCompare,
  pastEvaluationCount,
}) => {
  const { language, t } = useLanguage();
  const pillars = getPillars(language);
  const [activePillarTab, setActivePillarTab] = useState<PillarId | 'all'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Trigger gentle confetti on results mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0d9488', '#10b981', '#6366f1', '#f59e0b'],
        disableForReducedMotion: true,
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  }, []);

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      generateEvaluationPDF(result, language);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareSummary = () => {
    const isEn = language === 'en';
    const text = isEn
      ? `Equilibria: My Healthy Habits score is ${result.totalScore}% (${result.archetype.title})! Sleep: ${result.pillarScores.sleep}%, Nutrition: ${result.pillarScores.nutrition}%, Mind: ${result.pillarScores.mind}%, Exercise: ${result.pillarScores.exercise}%.`
      : `Equilibria: Mi puntuación en Buenos Hábitos Saludables es de ${result.totalScore}% (${result.archetype.title})! Sueño: ${result.pillarScores.sleep}%, Alimentación: ${result.pillarScores.nutrition}%, Mente: ${result.pillarScores.mind}%, Ejercicio: ${result.pillarScores.exercise}%.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }
  };

  const getScoreRating = (score: number) => {
    if (score >= 85) return { label: t('ratingOptimal'), color: 'text-emerald-600 dark:text-emerald-400' };
    if (score >= 70) return { label: t('ratingHealthy'), color: 'text-teal-600 dark:text-teal-400' };
    if (score >= 50) return { label: t('ratingDeveloping'), color: 'text-amber-600 dark:text-amber-400' };
    return { label: t('ratingPriority'), color: 'text-rose-600 dark:text-rose-400' };
  };

  const pillarIcons: Record<PillarId, React.ReactNode> = {
    sleep: <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    nutrition: <Apple className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    mind: <Brain className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    exercise: <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800 no-print">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            {t('resultsKicker')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5">
            {t('resultsTitle')} {result.userName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('evaluatedOn')}{' '}
            {new Date(result.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
            title={language === 'en' ? 'Download PDF report' : 'Descargar reporte en formato PDF'}
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? t('btnGeneratingPdf') : t('btnExportPdf')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            title={language === 'en' ? 'Print document' : 'Imprimir versión documento'}
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{t('btnPrint')}</span>
          </button>

          <button
            onClick={handleShareSummary}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            title={language === 'en' ? 'Copy summary to share' : 'Copiar resumen para compartir'}
          >
            <Share2 className="w-4 h-4" />
            <span>{copyFeedback ? t('btnShared') : t('btnShare')}</span>
          </button>

          {pastEvaluationCount > 0 && (
            <button
              onClick={onGoToCompare}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <GitCompare className="w-4 h-4" />
              <span>{t('btnCompareProgress')}</span>
            </button>
          )}

          <button
            onClick={onRetake}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            title={language === 'en' ? 'Retake quiz' : 'Repetir cuestionario'}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">{t('btnRetake')}</span>
          </button>
        </div>
      </div>

      {/* Main Score & Archetype Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Radial score visual */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* SVG circular track */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100 dark:text-slate-800"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="#0d9488"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.totalScore / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                  {result.totalScore}%
                </span>
                <span className="text-[11px] font-medium text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                  {t('vitalBalance')}
                </span>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              {t('averageScore')}
            </div>
          </div>

          {/* Archetype prose */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                {t('archetypeKicker')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {result.archetype.title}
              </h2>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1 italic">
                "{result.archetype.tagline}"
              </p>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {result.archetype.description}
            </p>

            {/* Quick pillar badges */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              {(Object.keys(result.pillarScores) as PillarId[]).map((pid) => (
                <div
                  key={pid}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {pillars[pid].name.split(' ')[0]}:
                  </span>
                  <span className="font-mono tabular-nums font-bold text-teal-700 dark:text-teal-400">
                    {result.pillarScores[pid]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wellness Presentation Takeaway Formula Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-50 via-indigo-50 to-emerald-50 dark:from-teal-950/40 dark:via-indigo-950/30 dark:to-emerald-950/40 border border-teal-200/80 dark:border-teal-800/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-300">
            {t('formulaBannerKicker')}
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {t('formulaTitle')}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {t('formulaSubtitle')}
          </p>
        </div>
        <button
          onClick={onRetake}
          className="shrink-0 px-4 py-2 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors"
        >
          {t('formulaRetakeBtn')}
        </button>
      </div>

      {/* Visual Comparison: Radar Spider Chart & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Radar Spider Chart Card */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors flex flex-col items-center">
          <div className="w-full mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('radarTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('radarDesc')}
            </p>
          </div>

          <RadarChart currentScores={result.pillarScores} size={300} />
        </div>

        {/* 4 Pillars Breakdown Column */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('pillarBreakdownTitle')}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{t('targetLabel')}</span>
          </div>

          {(Object.keys(result.pillarScores) as PillarId[]).map((pid) => {
            const pillar = pillars[pid];
            const score = result.pillarScores[pid];
            const rating = getScoreRating(score);

            return (
              <div
                key={pid}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      {pillarIcons[pid]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {pillar.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {pillar.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                      {score}%
                    </div>
                    <span className={`text-[11px] font-semibold ${rating.color}`}>
                      {rating.label}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      score >= 85
                        ? 'bg-emerald-500'
                        : score >= 70
                        ? 'bg-teal-500'
                        : score >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                {/* Key takeaway */}
                <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {pillar.presentationTakeaway}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individualized Recommendations & Action Plan */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {t('recsKicker')}
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {t('recsTitle')} {result.userName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('recsDesc')}
            </p>
          </div>

          {/* Pillar filter selector */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActivePillarTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activePillarTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('tabAll')}
            </button>
            {(Object.keys(pillars) as PillarId[]).map((pid) => (
              <button
                key={pid}
                onClick={() => setActivePillarTab(pid)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activePillarTab === pid
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {pillars[pid].name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(result.recommendations) as PillarId[])
            .filter((pid) => activePillarTab === 'all' || activePillarTab === pid)
            .map((pid) => {
              const pillar = pillars[pid];
              const recs = result.recommendations[pid];

              return (
                <div
                  key={pid}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-2xs">
                      {pillarIcons[pid]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {pillar.name}
                      </h4>
                      <span className="text-[11px] font-mono tabular-nums text-teal-600 dark:text-teal-400">
                        {result.pillarScores[pid]}% {language === 'en' ? 'score' : 'obtenido'}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {recs.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
        </div>

        {/* 7-Day Action Plan Challenge */}
        <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-800/60 space-y-3">
          <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200">
            <Calendar className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            <h4 className="text-sm sm:text-base font-bold">
              {t('actionPlanTitle')}
            </h4>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            {t('actionPlanDesc')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {result.actionPlan.map((action, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-teal-900/60 shadow-2xs text-xs"
              >
                <div className="font-bold text-teal-800 dark:text-teal-300 mb-1">
                  {t('stepPrefix')}{idx + 1}
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
