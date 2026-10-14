import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  ExternalLink,
  RefreshCw,
  LogOut,
  PlusCircle,
  Database,
  ShieldCheck,
  AlertCircle,
  Settings,
  Users,
  Send,
  UserCheck,
} from 'lucide-react';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { GoogleSignInButton } from './GoogleSignInButton';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { EvaluationResult, StoredEvaluation } from '../types/wellness';
import { useLanguage } from '../context/LanguageContext';

interface GoogleSheetsIntegrationCardProps {
  evaluation?: EvaluationResult | StoredEvaluation;
  onOpenSheetsTab?: () => void;
  compact?: boolean;
}

export const GoogleSheetsIntegrationCard: React.FC<GoogleSheetsIntegrationCardProps> = ({
  evaluation,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const {
    user,
    isConnected,
    spreadsheet,
    sheetRecords,
    ownerConfig,
    isThirdPartyReady,
    isConfigModalOpen,
    setIsConfigModalOpen,
    isLoading,
    isAuthenticating,
    isSaving,
    isRemoving,
    signIn,
    signOut,
    saveRecord,
    removeRecord,
    isRecordSaved,
    refreshRecords,
  } = useGoogleSheets();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [participantName, setParticipantName] = useState<string>(
    evaluation?.userName || ''
  );

  const isCurrentSaved = evaluation ? isRecordSaved(evaluation.id) : false;

  const handleSaveCurrent = async () => {
    if (!evaluation) return;
    const toSave = {
      ...evaluation,
      userName: participantName.trim() || evaluation.userName || 'Participante',
    };
    await saveRecord(toSave);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    await removeRecord(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  // Determine current active mode
  const activeMode = isConnected
    ? 'oauth'
    : isThirdPartyReady
    ? 'third_party'
    : 'none';

  return (
    <>
      <div className="rounded-3xl border border-emerald-200/90 dark:border-emerald-800/80 bg-white/95 dark:bg-[#111c19]/95 shadow-xs overflow-hidden transition-all">
        {/* Top banner / header of the card */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-sky-50/70 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-sky-950/40 border-b border-emerald-100 dark:border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  {isEn ? 'Assessment Database' : 'Base de Datos de Evaluaciones'}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100/90 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  <Database className="w-2.5 h-2.5" />
                  Google Sheets
                </span>
                {activeMode === 'third_party' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/70 text-teal-800 dark:text-teal-200">
                    <Users className="w-2.5 h-2.5" />
                    {isEn ? 'Third-Party Mode' : 'Modo Terceros'}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                {activeMode === 'third_party'
                  ? isEn
                    ? `Connected to: ${ownerConfig.ownerName || 'Evaluator Sheet'}`
                    : `Hoja del Evaluador: ${ownerConfig.ownerName || 'Propietario'}`
                  : isEn
                  ? 'Google Sheets Assessment Storage'
                  : 'Conexión con Google Sheets'}
              </h3>
            </div>
          </div>

          {/* Right state action */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Direct link to Spreadsheet if available */}
            {(spreadsheet?.webViewLink || ownerConfig.spreadsheetUrl) && (
              <a
                href={spreadsheet?.webViewLink || ownerConfig.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-emerald-950/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs font-medium transition-colors"
                title={isEn ? 'Open spreadsheet in Google Sheets' : 'Abrir hoja de cálculo en Google Sheets'}
              >
                <span>{isEn ? 'Open Sheet' : 'Abrir Hoja'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Refresh records */}
            {(isConnected || isThirdPartyReady) && (
              <button
                onClick={() => refreshRecords()}
                disabled={isLoading}
                className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title={isEn ? 'Refresh data' : 'Actualizar datos'}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}

            {/* Configure Third Party Connection */}
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-emerald-700 transition-colors cursor-pointer"
              title={isEn ? 'Configure connection for third parties' : 'Configurar conexión para terceros / evaluadores'}
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Disconnect OAuth if connected */}
            {isConnected && (
              <button
                onClick={signOut}
                className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title={isEn ? 'Disconnect Google account' : 'Desconectar cuenta Google'}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {activeMode === 'none' ? (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-1.5 max-w-xl">
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    {isEn
                      ? 'Save evaluations into a central Google Sheets database. If you are the owner, connect your Google account or configure the Third-Party Webhook so external testers can save results without logging in.'
                      : 'Guarda tus evaluaciones en una hoja de Google Sheets. Si eres el propietario, inicia sesión con Google o configura el enlace Webhook para que personas externas o terceros guarden sus pruebas sin pedirles cuenta de Google.'}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      {isEn
                        ? 'Data stored directly into the owner\'s Google Drive spreadsheet.'
                        : 'Los datos se guardan directamente en el archivo de Google Drive del evaluador.'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  <GoogleSignInButton
                    onClick={signIn}
                    isLoading={isAuthenticating}
                    label={isEn ? 'Google Sign In (Owner)' : 'Iniciar con Google (Propietario)'}
                  />
                  <button
                    type="button"
                    onClick={() => setIsConfigModalOpen(true)}
                    className="px-3.5 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Configure for Testers' : 'Configurar para Terceros'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Connection Status Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  {isConnected && user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Google User'}
                      className="w-9 h-9 rounded-full border border-emerald-300 dark:border-emerald-700"
                    />
                  ) : activeMode === 'third_party' ? (
                    <div className="w-9 h-9 rounded-2xl bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                      <Users className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                      {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'G'}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                        {isConnected
                          ? user?.displayName || user?.email
                          : ownerConfig.ownerName || 'Base Central de Evaluaciones'}
                      </span>
                      <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        {activeMode === 'third_party'
                          ? isEn
                            ? 'Webhook Ready (Zero Login)'
                            : 'Conexión Directa Activa'
                          : isEn
                          ? 'OAuth Connected'
                          : 'Conectado'}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block truncate max-w-xs sm:max-w-md">
                      {spreadsheet?.name ||
                        (ownerConfig.spreadsheetUrl
                          ? 'Hoja del Propietario Vinculada'
                          : 'Equilibria - Base de Datos de Evaluaciones')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono">
                      {isEn ? 'Sheet Records' : 'Registros en Hoja'}
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400">
                      {sheetRecords.length} {isEn ? 'evaluations' : 'evaluaciones'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Evaluation Action Box */}
              {evaluation && (
                <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#14201c] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                        {isEn ? 'Current Test Result' : 'Resultado de esta Evaluación'}
                      </span>
                      {isCurrentSaved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" />
                          {isEn ? 'Saved in Google Sheets' : 'Guardado en Google Sheets'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-md">
                          <AlertCircle className="w-3 h-3" />
                          {isEn ? 'Not saved in Sheets yet' : 'Aún no guardado en Sheets'}
                        </span>
                      )}
                    </div>

                    {/* Participant Name Editor for clean database entries */}
                    <div className="flex items-center gap-2 max-w-sm">
                      <UserCheck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <input
                        type="text"
                        value={participantName}
                        onChange={(e) => setParticipantName(e.target.value)}
                        placeholder={isEn ? 'Participant Name / Identifier' : 'Nombre o Identificador del Participante'}
                        className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      ID: <span className="font-mono">{evaluation.id}</span> · {evaluation.totalScore}%
                    </p>
                  </div>

                  {/* Save or Remove Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!isCurrentSaved ? (
                      <button
                        type="button"
                        onClick={handleSaveCurrent}
                        disabled={isSaving}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60"
                      >
                        {isSaving ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : activeMode === 'third_party' ? (
                          <Send className="w-4 h-4" />
                        ) : (
                          <PlusCircle className="w-4 h-4" />
                        )}
                        <span>
                          {isSaving
                            ? isEn
                              ? 'Saving to Sheets...'
                              : 'Guardando en Sheets...'
                            : activeMode === 'third_party'
                            ? isEn
                              ? 'Submit to Evaluator Sheet'
                              : 'Guardar en Hoja del Evaluador'
                            : isEn
                            ? 'Save to Google Sheets'
                            : 'Guardar en Google Sheets'}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(evaluation.id)}
                        disabled={isRemoving}
                        className="px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/70 bg-rose-50/60 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                        title={
                          isEn
                            ? 'Remove this evaluation from Google Sheets'
                            : 'Quitar este registro de la base de datos de Google Sheets'
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Remove from Sheets' : 'Quitar de Google Sheets'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Destructive Workspace Operations (Mandatory Requirement) */}
      <ConfirmDeleteModal
        isOpen={confirmDeleteId !== null}
        title={isEn ? 'Remove record from Google Sheets?' : '¿Quitar registro de Google Sheets?'}
        description={
          isEn
            ? 'This action will delete the evaluation row from the connected Google Sheets database. This permanently modifies your sheet data.'
            : 'Esta acción eliminará la fila de esta evaluación en tu hoja de Google Sheets. Esta acción modificará tus datos almacenados.'
        }
        itemName={confirmDeleteId ? `ID: ${confirmDeleteId}` : undefined}
        confirmLabel={isEn ? 'Yes, Delete Row' : 'Sí, Quitar de Sheets'}
        cancelLabel={isEn ? 'Keep Record' : 'Conservar Registro'}
        isLoading={isRemoving}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </>
  );
};
