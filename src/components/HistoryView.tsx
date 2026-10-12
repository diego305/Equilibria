import React, { useState } from 'react';
import { Trash2, Eye, Calendar, ShieldCheck, Download } from 'lucide-react';
import { StoredEvaluation } from '../types/wellness';
import { useLanguage } from '../context/LanguageContext';

interface HistoryViewProps {
  evaluations: StoredEvaluation[];
  onSelectEvaluation: (evalId: string) => void;
  onDeleteEvaluation: (evalId: string) => void;
  onClearAll: () => void;
  onTakeNewTest: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  evaluations,
  onSelectEvaluation,
  onDeleteEvaluation,
  onClearAll,
  onTakeNewTest,
}) => {
  const { language, t } = useLanguage();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(evaluations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `equilibria_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            {t('historyKicker')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5">
            {t('historyTitle')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('historyDesc')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {evaluations.length > 0 && (
            <>
              <button
                onClick={handleExportJSON}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title={language === 'en' ? 'Download JSON backup' : 'Descargar copia de seguridad en JSON'}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('btnExportJson')}</span>
              </button>

              {confirmClear ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onClearAll();
                      setConfirmClear(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors"
                  >
                    {t('btnConfirmClear')}
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400"
                  >
                    {t('btnCancel')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('btnClearAll')}</span>
                </button>
              )}
            </>
          )}

          <button
            onClick={onTakeNewTest}
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-medium shadow-sm transition-all"
          >
            {t('btnNewTest')}
          </button>
        </div>
      </div>

      {/* Privacy guarantee banner */}
      <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-800/60 flex items-center gap-3 text-xs text-teal-900 dark:text-teal-200">
        <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
        <span>
          {t('privacyNotice')}
        </span>
      </div>

      {/* List */}
      {evaluations.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t('noHistoryTitle')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {t('noHistoryDesc')}
          </p>
          <button
            onClick={onTakeNewTest}
            className="mt-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium"
          >
            {t('btnTakeTestNow')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {evaluations.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.userName}
                  </h3>
                  <span className="text-xs font-mono tabular-nums font-semibold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                    {item.totalScore}%
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    {new Date(item.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>·</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {item.archetypeTitle}
                  </span>
                </div>

                {/* Micro pillars breakdown */}
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono tabular-nums text-slate-600 dark:text-slate-400">
                  <span>{language === 'en' ? 'Sleep' : 'Sueño'}: {item.pillarScores.sleep}%</span>
                  <span>·</span>
                  <span>{language === 'en' ? 'Food' : 'Alim'}: {item.pillarScores.nutrition}%</span>
                  <span>·</span>
                  <span>{language === 'en' ? 'Mind' : 'Mente'}: {item.pillarScores.mind}%</span>
                  <span>·</span>
                  <span>{language === 'en' ? 'Exercise' : 'Ejer'}: {item.pillarScores.exercise}%</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onSelectEvaluation(item.id)}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('btnViewResults')}</span>
                </button>

                <button
                  onClick={() => onDeleteEvaluation(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title={language === 'en' ? 'Delete this evaluation' : 'Eliminar esta evaluación'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
