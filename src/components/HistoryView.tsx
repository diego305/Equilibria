import React, { useState } from 'react';
import {
  Trash2,
  Eye,
  Calendar,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  HardDrive,
  ExternalLink,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  UploadCloud,
  Settings,
  Users,
} from 'lucide-react';
import { StoredEvaluation } from '../types/wellness';
import { useLanguage } from '../context/LanguageContext';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { GoogleSheetsIntegrationCard } from './GoogleSheetsIntegrationCard';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

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
  const isEn = language === 'en';

  const {
    isConnected,
    isThirdPartyReady,
    ownerConfig,
    setIsConfigModalOpen,
    spreadsheet,
    sheetRecords,
    isLoading,
    isSaving,
    isRemoving,
    saveRecord,
    removeRecord,
    clearAllRecords,
    isRecordSaved,
    refreshRecords,
  } = useGoogleSheets();

  const [activeTab, setActiveTab] = useState<'local' | 'sheets'>('local');
  const [confirmClearLocal, setConfirmClearLocal] = useState(false);
  const [confirmDeleteSheetId, setConfirmDeleteSheetId] = useState<string | null>(null);
  const [confirmClearSheetModal, setConfirmClearSheetModal] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(evaluations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `equilibria_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSyncAllLocalToSheets = async () => {
    if (!isConnected || evaluations.length === 0) return;
    setIsSyncingAll(true);
    try {
      for (const evalItem of evaluations) {
        if (!isRecordSaved(evalItem.id)) {
          await saveRecord(evalItem);
        }
      }
      await refreshRecords();
    } catch (err) {
      console.error('Error syncing all to sheets:', err);
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleConfirmDeleteSheetRecord = async () => {
    if (!confirmDeleteSheetId) return;
    await removeRecord(confirmDeleteSheetId);
    setConfirmDeleteSheetId(null);
  };

  const handleConfirmClearSheet = async () => {
    await clearAllRecords();
    setConfirmClearSheetModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            {t('historyKicker')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
            {t('historyTitle')}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{t('historyDesc')}</p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'local' && evaluations.length > 0 && (
            <>
              <button
                onClick={handleExportJSON}
                className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title={isEn ? 'Download JSON backup' : 'Descargar copia de seguridad en JSON'}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('btnExportJson')}</span>
              </button>

              {confirmClearLocal ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onClearAll();
                      setConfirmClearLocal(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    {t('btnConfirmClear')}
                  </button>
                  <button
                    onClick={() => setConfirmClearLocal(false)}
                    className="px-2 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400 cursor-pointer"
                  >
                    {t('btnCancel')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClearLocal(true)}
                  className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('btnClearAll')}</span>
                </button>
              )}
            </>
          )}

          <button
            onClick={onTakeNewTest}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-medium shadow-xs transition-all cursor-pointer"
          >
            {t('btnNewTest')}
          </button>
        </div>
      </div>

      {/* Database Source Switcher: Local Browser Storage vs Google Sheets */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('local')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'local'
                ? 'bg-white dark:bg-[#14201c] text-emerald-800 dark:text-emerald-300 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('dbTabLocal')}</span>
            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              {evaluations.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sheets')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'sheets'
                ? 'bg-white dark:bg-[#14201c] text-emerald-800 dark:text-emerald-300 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('dbTabSheets')}</span>
            {(isConnected || isThirdPartyReady || sheetRecords.length > 0) && (
              <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {sheetRecords.length}
              </span>
            )}
          </button>
        </div>

        {/* Extra sync action if both have records */}
        {(isConnected || isThirdPartyReady) && activeTab === 'local' && evaluations.length > 0 && (
          <button
            onClick={handleSyncAllLocalToSheets}
            disabled={isSyncingAll}
            className="px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
            title={isEn ? 'Save all local records to Google Sheets' : 'Guardar todas las evaluaciones locales en Google Sheets'}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>
              {isSyncingAll
                ? isEn
                  ? 'Syncing...'
                  : 'Sincronizando...'
                : t('btnSyncAllToSheets')}
            </span>
          </button>
        )}
      </div>

      {/* TAB CONTENT: LOCAL STORAGE */}
      {activeTab === 'local' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-950 dark:text-emerald-200">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t('privacyNotice')}</span>
          </div>

          {evaluations.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#101917] rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-3">
              <Calendar className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {t('noHistoryTitle')}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                {t('noHistoryDesc')}
              </p>
              <button
                onClick={onTakeNewTest}
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium cursor-pointer"
              >
                {t('btnTakeTestNow')}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {evaluations.map((item) => {
                const inSheets = isRecordSaved(item.id);
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#101917] border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-stone-300 dark:hover:border-stone-700"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                          {item.userName}
                        </h3>
                        <span className="text-xs font-mono tabular-nums font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                          {item.totalScore}%
                        </span>
                        {(isConnected || isThirdPartyReady) && inSheets && (
                          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2 py-0.2 rounded-full inline-flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            {isEn ? 'In Sheets' : 'En Sheets'}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
                        <span>
                          {new Date(item.date).toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>·</span>
                        <span className="text-stone-700 dark:text-stone-300 font-medium">
                          {item.archetypeTitle}
                        </span>
                      </div>

                      {/* Micro pillars breakdown */}
                      <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono tabular-nums text-stone-600 dark:text-stone-400">
                        <span>
                          {isEn ? 'Sleep' : 'Sueño'}: {item.pillarScores.sleep}%
                        </span>
                        <span>·</span>
                        <span>
                          {isEn ? 'Food' : 'Alim'}: {item.pillarScores.nutrition}%
                        </span>
                        <span>·</span>
                        <span>
                          {isEn ? 'Mind' : 'Mente'}: {item.pillarScores.mind}%
                        </span>
                        <span>·</span>
                        <span>
                          {isEn ? 'Exercise' : 'Ejer'}: {item.pillarScores.exercise}%
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Save to sheets button if connected and not yet in sheets */}
                      {(isConnected || isThirdPartyReady) && !inSheets && (
                        <button
                          onClick={() => saveRecord(item)}
                          disabled={isSaving}
                          className="px-2.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                          title={isEn ? 'Save this to Google Sheets' : 'Guardar esta prueba en Google Sheets'}
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{t('btnSaveToSheets')}</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectEvaluation(item.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('btnViewResults')}</span>
                      </button>

                      <button
                        onClick={() => onDeleteEvaluation(item.id)}
                        className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title={isEn ? 'Delete this evaluation from local storage' : 'Eliminar esta evaluación del almacenamiento local'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: GOOGLE SHEETS DATABASE */}
      {activeTab === 'sheets' && (
        <div className="space-y-5">
          {/* Main Google Sheets Connection Card */}
          <GoogleSheetsIntegrationCard />

          {(isConnected || isThirdPartyReady || sheetRecords.length > 0) && (
            <div className="space-y-4">
              {/* Sheets DB Toolbar */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#101917] border border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {isEn ? 'Records in Google Sheets' : 'Registros en Google Sheets'}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                    {sheetRecords.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => refreshRecords()}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    title={isEn ? 'Refresh records from Sheets' : 'Recargar registros desde Google Sheets'}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">{isEn ? 'Refresh' : 'Actualizar'}</span>
                  </button>

                  <button
                    onClick={() => setIsConfigModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    title={isEn ? 'Configure third party connection' : 'Configurar conexión para terceros'}
                  >
                    <Settings className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">{isEn ? 'Configure' : 'Configurar'}</span>
                  </button>

                  {sheetRecords.length > 0 && (
                    <button
                      onClick={() => setConfirmClearSheetModal(true)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t('btnClearAll')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Records List from Sheet */}
              {sheetRecords.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-[#101917] rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-3">
                  <FileSpreadsheet className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {t('noSheetsRecordsTitle')}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                    {t('noSheetsRecordsDesc')}
                  </p>
                  {evaluations.length > 0 && (
                    <button
                      onClick={handleSyncAllLocalToSheets}
                      disabled={isSyncingAll}
                      className="mt-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{t('btnSyncAllToSheets')}</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {sheetRecords.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-white dark:bg-[#101917] border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-stone-300 dark:hover:border-stone-700"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                            {item.userName}
                          </h3>
                          <span className="text-xs font-mono tabular-nums font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                            {item.totalScore}%
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">
                            Fila #{item.sheetRowNumber}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
                          <span>
                            {new Date(item.date).toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span>·</span>
                          <span className="text-stone-700 dark:text-stone-300 font-medium">
                            {item.archetypeTitle}
                          </span>
                        </div>

                        {/* Pillar scores */}
                        <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono tabular-nums text-stone-600 dark:text-stone-400">
                          <span>
                            {isEn ? 'Sleep' : 'Sueño'}: {item.pillarScores.sleep}%
                          </span>
                          <span>·</span>
                          <span>
                            {isEn ? 'Food' : 'Alim'}: {item.pillarScores.nutrition}%
                          </span>
                          <span>·</span>
                          <span>
                            {isEn ? 'Mind' : 'Mente'}: {item.pillarScores.mind}%
                          </span>
                          <span>·</span>
                          <span>
                            {isEn ? 'Exercise' : 'Ejer'}: {item.pillarScores.exercise}%
                          </span>
                        </div>
                      </div>

                      {/* Actions for Sheet record */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onSelectEvaluation(item.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('btnViewResults')}</span>
                        </button>

                        <button
                          onClick={() => setConfirmDeleteSheetId(item.id)}
                          disabled={isRemoving}
                          className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                          title={isEn ? 'Remove this record from Google Sheets' : 'Quitar este registro de Google Sheets'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{t('btnRemoveFromSheets')}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal: Delete single row from Google Sheets (MANDATORY per skill) */}
      <ConfirmDeleteModal
        isOpen={confirmDeleteSheetId !== null}
        title={t('confirmDeleteTitle')}
        description={t('confirmDeleteDesc')}
        itemName={confirmDeleteSheetId ? `ID: ${confirmDeleteSheetId}` : undefined}
        confirmLabel={isEn ? 'Yes, Delete Row' : 'Sí, Quitar de Sheets'}
        cancelLabel={isEn ? 'Cancel' : 'Cancelar'}
        isLoading={isRemoving}
        onConfirm={handleConfirmDeleteSheetRecord}
        onCancel={() => setConfirmDeleteSheetId(null)}
      />

      {/* Confirmation Modal: Clear all rows from Google Sheets (MANDATORY per skill) */}
      <ConfirmDeleteModal
        isOpen={confirmClearSheetModal}
        title={t('confirmClearSheetTitle')}
        description={t('confirmClearSheetDesc')}
        confirmLabel={isEn ? 'Yes, Clear All' : 'Sí, Vaciar Base de Datos'}
        cancelLabel={isEn ? 'Cancel' : 'Cancelar'}
        isLoading={isRemoving}
        onConfirm={handleConfirmClearSheet}
        onCancel={() => setConfirmClearSheetModal(false)}
      />
    </div>
  );
};
