import React, { useState } from 'react';
import { GitCompare, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { PillarId, StoredEvaluation } from '../types/wellness';
import { getPillars } from '../data/wellnessData';
import { RadarChart } from './RadarChart';
import { useLanguage } from '../context/LanguageContext';

interface ComparativeViewProps {
  storedEvaluations: StoredEvaluation[];
  currentEvaluation?: StoredEvaluation;
  onTakeNewTest: () => void;
  onSelectEvaluation: (evalId: string) => void;
}

export const ComparativeView: React.FC<ComparativeViewProps> = ({
  storedEvaluations,
  currentEvaluation,
  onTakeNewTest,
  onSelectEvaluation,
}) => {
  const { language, t } = useLanguage();
  const pillars = getPillars(language);

  // Available list of evaluations (including current if available)
  const allList: StoredEvaluation[] = [];
  if (currentEvaluation && !storedEvaluations.some((s) => s.id === currentEvaluation.id)) {
    allList.push(currentEvaluation);
  }
  allList.push(...storedEvaluations);

  const [selectedIdA, setSelectedIdA] = useState<string>(
    allList[0]?.id || ''
  );
  const [selectedIdB, setSelectedIdB] = useState<string>(
    allList[1]?.id || allList[0]?.id || ''
  );

  const evalA = allList.find((e) => e.id === selectedIdA) || allList[0];
  const evalB = allList.find((e) => e.id === selectedIdB) || (allList.length > 1 ? allList[1] : undefined);

  if (allList.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <GitCompare className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
          {t('noEvalsToCompareTitle')}
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
          {t('noEvalsToCompareDesc')}
        </p>
        <button
          onClick={onTakeNewTest}
          className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-xs cursor-pointer"
        >
          {t('btnStartFirstTest')}
        </button>
      </div>
    );
  }

  const renderDelta = (scoreA: number, scoreB: number) => {
    const diff = scoreA - scoreB;
    if (diff > 0) {
      return (
        <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
          <TrendingUp className="w-3.5 h-3.5" />
          +{diff}%
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="flex items-center gap-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
          <TrendingDown className="w-3.5 h-3.5" />
          {diff}%
        </span>
      );
    }
    return (
      <span className="flex items-center gap-0.5 text-xs font-semibold text-stone-400 font-mono tabular-nums">
        <Minus className="w-3.5 h-3.5" />
        0%
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Title & Selectors */}
      <div className="border-b border-stone-200/80 dark:border-stone-800 pb-6 space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            {t('compareKicker')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
            {t('compareTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            {t('compareDesc')}
          </p>
        </div>

        {/* Dropdown selectors for comparing 2 tests */}
        {allList.length >= 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/60">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t('compareEvalA')}
              </label>
              <select
                value={selectedIdA}
                onChange={(e) => setSelectedIdA(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#101917] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {allList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.userName} ({item.totalScore}%) —{' '}
                    {new Date(item.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t('compareEvalB')}
              </label>
              <select
                value={selectedIdB}
                onChange={(e) => setSelectedIdB(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#101917] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {allList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.userName} ({item.totalScore}%) —{' '}
                    {new Date(item.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {evalA && (
        <>
          {/* Main Comparison Visuals */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Superimposed Radar Spider Chart */}
            <div className="lg:col-span-6 bg-white dark:bg-[#101917] rounded-3xl p-6 sm:p-8 border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col items-center">
              <div className="w-full mb-3">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {t('superimposedRadar')}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">{evalA.userName} ({evalA.totalScore}%)</span>
                  {evalB && evalB.id !== evalA.id && (
                    <span> · <span className="font-semibold text-sky-700 dark:text-sky-400">{evalB.userName} ({evalB.totalScore}%)</span></span>
                  )}
                </p>
              </div>

              <RadarChart
                currentScores={evalA.pillarScores}
                comparisonScores={evalB && evalB.id !== evalA.id ? evalB.pillarScores : undefined}
                comparisonLabel={evalB ? `${evalB.userName} (${evalB.totalScore}%)` : undefined}
                size={300}
              />
            </div>

            {/* Side-by-side Pillar Comparison Bars */}
            <div className="lg:col-span-6 bg-white dark:bg-[#101917] rounded-3xl p-6 sm:p-8 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {t('barCompareTitle')}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {t('barCompareDesc')}
                </p>
              </div>

              <div className="space-y-4">
                {(Object.keys(pillars) as PillarId[]).map((pid) => {
                  const pillar = pillars[pid];
                  const scoreA = evalA.pillarScores[pid] || 0;
                  const scoreB = evalB ? evalB.pillarScores[pid] || 0 : 0;

                  return (
                    <div key={pid} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {pillar.name}
                        </span>
                        {evalB && evalB.id !== evalA.id && renderDelta(scoreA, scoreB)}
                      </div>

                      {/* Bar A (Emerald) */}
                      <div className="relative w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                        {/* 80% mark */}
                        <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-emerald-500/80 z-10" />
                        <div
                          className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${scoreA}%` }}
                        />
                      </div>

                      {/* Bar B if comparing (Calm Sky Blue) */}
                      {evalB && evalB.id !== evalA.id && (
                        <div className="relative w-full h-2.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden opacity-90">
                          <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-emerald-500/80 z-10" />
                          <div
                            className="h-full bg-sky-600 dark:bg-sky-500 rounded-full transition-all duration-500"
                            style={{ width: `${scoreB}%` }}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 font-mono tabular-nums">
                        <span>{evalA.userName}: {scoreA}%</span>
                        {evalB && evalB.id !== evalA.id && <span>{evalB.userName}: {scoreB}%</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary table */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500 dark:text-stone-400">Total {evalA.userName}: </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
                    {evalA.totalScore}%
                  </span>
                </div>
                {evalB && evalB.id !== evalA.id && (
                  <div>
                    <span className="text-stone-500 dark:text-stone-400">Total {evalB.userName}: </span>
                    <span className="font-bold text-sky-700 dark:text-sky-400 font-mono tabular-nums">
                      {evalB.totalScore}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline of evaluations */}
          <div className="bg-white dark:bg-[#101917] rounded-3xl p-6 sm:p-8 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {t('historyTimelineTitle')} ({allList.length})
            </h3>

            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {allList.map((item, index) => (
                <div
                  key={item.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-stone-50/70 dark:hover:bg-stone-800/40 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {item.userName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        <span>{new Date(item.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}</span>
                        <span>·</span>
                        <span className="text-stone-700 dark:text-stone-300 font-medium">
                          {item.archetypeTitle}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-base font-extrabold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                        {item.totalScore}%
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectEvaluation(item.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t('btnViewReport')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
