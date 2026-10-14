import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Link,
  Code,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Sparkles,
  Users,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { APPS_SCRIPT_TEMPLATE, extractSpreadsheetId } from '../services/googleSheetsService';
import { useLanguage } from '../context/LanguageContext';

interface OwnerSheetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerSheetConfigModal: React.FC<OwnerSheetConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const {
    ownerConfig,
    updateOwnerConfig,
    testWebhook,
    spreadsheet,
    user,
    isConnected,
  } = useGoogleSheets();

  const [activeTab, setActiveTab] = useState<'settings' | 'script' | 'instructions'>('settings');
  const [webhookUrl, setWebhookUrl] = useState(ownerConfig.webhookUrl || '');
  const [sheetInput, setSheetInput] = useState(ownerConfig.spreadsheetUrl || ownerConfig.spreadsheetId || '');
  const [ownerName, setOwnerName] = useState(ownerConfig.ownerName || 'Propietario Equilibria');
  const [enabled, setEnabled] = useState(ownerConfig.enabled ?? true);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      // Save current input temporarily to test
      updateOwnerConfig({ webhookUrl: webhookUrl.trim() });
      const res = await testWebhook();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Error al conectar con el Webhook',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = extractSpreadsheetId(sheetInput);
    const cleanUrl = cleanId ? `https://docs.google.com/spreadsheets/d/${cleanId}/edit` : '';

    updateOwnerConfig({
      webhookUrl: webhookUrl.trim(),
      spreadsheetId: cleanId,
      spreadsheetUrl: cleanUrl,
      ownerName: ownerName.trim(),
      enabled,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleUseCurrentOAuthSheet = () => {
    if (spreadsheet?.id) {
      setSheetInput(spreadsheet.webViewLink || spreadsheet.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#121c19] rounded-3xl border border-emerald-200/90 dark:border-emerald-800/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-sky-950/40 border-b border-emerald-100 dark:border-emerald-900/60 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  {isEn ? 'Third-Party & Testers Connection' : 'Conexión para Terceros y Evaluadores'}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Google Sheets
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                {isEn ? 'Connect Your Personal Google Sheet' : 'Conectar Tu Hoja de Google Sheets'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 px-5 sm:px-6 bg-stone-50/50 dark:bg-[#0f1715] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isEn ? 'Configuration' : 'Configurar Conexión'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('script')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'script'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>{isEn ? 'Apps Script Code (Copy)' : 'Código Apps Script (Copiar)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('instructions')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'instructions'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{isEn ? 'How it works' : '¿Cómo funciona?'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-stone-800 dark:text-stone-200">
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              {/* Informative helper banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5 leading-relaxed">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>{isEn ? 'No Google login needed for respondents!' : '¡Sin inicio de sesión para los evaluados!'}</strong>{' '}
                  {isEn
                    ? 'When you configure your Google Apps Script Webhook, anyone testing this app can save their evaluations straight into your private Google Sheet without friction.'
                    : 'Al vincular el Webhook de Google Apps Script de tu hoja, cualquier tercero o evaluador que pruebe la aplicación podrá guardar sus resultados directamente en tu hoja de Google Sheets de tu propiedad.'}
                </div>
              </div>

              {/* Input 1: Google Apps Script Webhook URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {isEn ? 'Google Apps Script Web App URL (Webhook)' : 'URL de la Aplicación Web (Webhook de Google Apps Script)'}
                  <span className="text-emerald-600 ml-1 font-normal">({isEn ? 'Recommended for third parties' : 'Recomendado para terceros'})</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {isEn
                    ? 'Generated by Google Apps Script in your spreadsheet under Deploy > New deployment > Web app (Anyone).'
                    : 'Se genera en tu Google Sheet en Extensiones > Apps Script > Implementar > Nueva implementación > Aplicación web (Cualquier usuario).'}
                </p>
              </div>

              {/* Test Webhook Button */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !webhookUrl.trim()}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? (isEn ? 'Testing connection...' : 'Probando...') : (isEn ? 'Test Connection' : 'Probar Conexión')}</span>
                </button>

                {testResult && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                      testResult.success
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                    }`}
                  >
                    {testResult.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{testResult.message}</span>
                  </span>
                )}
              </div>

              {/* Input 2: Spreadsheet URL or ID */}
              <div className="space-y-1.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    {isEn ? 'Spreadsheet ID or Full URL' : 'Enlace o ID de tu Hoja de Google Sheets'}
                  </label>
                  {isConnected && spreadsheet?.id && (
                    <button
                      type="button"
                      onClick={handleUseCurrentOAuthSheet}
                      className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Link className="w-3 h-3" />
                      <span>{isEn ? 'Use active Google Drive Sheet' : 'Usar mi hoja activa de Google'}</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={sheetInput}
                  onChange={(e) => setSheetInput(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5.../edit"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {isEn
                    ? 'Allows you to open your spreadsheet directly from the app interface.'
                    : 'Permite abrir directamente tu hoja de cálculo desde la app con un solo clic.'}
                </p>
              </div>

              {/* Input 3: Owner Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {isEn ? 'Evaluator / Owner Name' : 'Nombre del Evaluador o Entidad Propietaria'}
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Ej: Dr. García / Bienestar Saludable"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Toggle: Enable third party saving */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <input
                  type="checkbox"
                  id="enableThirdParty"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="enableThirdParty" className="text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                  <strong>{isEn ? 'Enable direct saving for third parties' : 'Permitir que terceros guarden directamente'}</strong>
                  <span className="block text-[11px] text-stone-500 dark:text-stone-400">
                    {isEn
                      ? 'Shows the "Save to Evaluator Sheet" button on test results.'
                      : 'Muestra el botón "Guardar en Google Sheets del Evaluador" en el resumen de resultados.'}
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs sm:text-sm font-medium rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'Cancelar'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isEn ? 'Saved!' : '¡Guardado!'}</span>
                    </>
                  ) : (
                    <span>{isEn ? 'Save Configuration' : 'Guardar Conexión'}</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {isEn ? 'Ready-to-Use Google Apps Script' : 'Código Google Apps Script Listo para Usar'}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {isEn
                      ? 'Copy this code into your Google Sheets Apps Script editor.'
                      : 'Copia este código y pégalo en el editor de Apps Script de tu hoja de Google Sheets.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  {copiedScript ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Copied to clipboard!' : '¡Copiado al portapapeles!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Copy Script Code' : 'Copiar Código del Script'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code container */}
              <div className="relative rounded-2xl bg-stone-900 text-stone-200 p-4 font-mono text-[11px] sm:text-xs overflow-x-auto max-h-80 border border-stone-800">
                <pre>{APPS_SCRIPT_TEMPLATE}</pre>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{isEn ? 'Important during deployment:' : 'Importante al Implementar:'}</strong>{' '}
                  {isEn
                    ? 'In the "Who has access" field, select "Anyone" so test respondents can save rows without requiring Google authorization.'
                    : 'En el campo "¿Quién tiene acceso?", asegúrate de seleccionar "Cualquier usuario" (Anyone) para que los participantes puedan guardar sus pruebas sin barreras de acceso.'}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                {isEn ? 'Quick 4-Step Setup Guide (2 minutes)' : 'Guía Rápida en 4 Pasos (2 minutos)'}
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100">
                      {isEn ? 'Open Apps Script in your Google Sheet' : 'Abre Apps Script en tu Hoja de Google Sheets'}
                    </h4>
                    <p className="text-stone-600 dark:text-stone-400 text-xs mt-0.5">
                      {isEn
                        ? 'In your spreadsheet, click Extensions > Apps Script in the top menu.'
                        : 'En tu hoja de cálculo de Google Sheets, ve al menú superior: Extensiones > Apps Script.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100">
                      {isEn ? 'Paste the Script Code' : 'Pega el código del script'}
                    </h4>
                    <p className="text-stone-600 dark:text-stone-400 text-xs mt-0.5">
                      {isEn
                        ? 'Delete whatever is in Code.gs and paste the code from the "Apps Script Code" tab above. Save the file (Ctrl+S).'
                        : 'Borra el código que aparezca en el archivo y pega el código de la pestaña "Código Apps Script". Pulsa Guardar (Ctrl+S).'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100">
                      {isEn ? 'Deploy as Web App' : 'Implementar como Aplicación Web'}
                    </h4>
                    <p className="text-stone-600 dark:text-stone-400 text-xs mt-0.5">
                      {isEn
                        ? 'Click the blue Deploy button > New deployment. Select Web app. Under "Execute as" select Me. Under "Who has access" select Anyone. Click Deploy.'
                        : 'Haz clic en el botón azul "Implementar" (arriba a la derecha) > "Nueva implementación". Elige "Aplicación web". Ejecutar como: "Yo". Quién tiene acceso: "Cualquier usuario". Pulsa Implementar.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100">
                      {isEn ? 'Paste the URL in Equilibria' : 'Pega la URL resultante en Equilibria'}
                    </h4>
                    <p className="text-stone-600 dark:text-stone-400 text-xs mt-0.5">
                      {isEn
                        ? 'Copy the resulting Web App URL and paste it in the "Configuration" tab of this modal. Click Test Connection, and you are ready!'
                        : 'Copia la URL de la aplicación web que te da Google y pégala en la pestaña "Configurar Conexión" de este modal. ¡Pulsa Probar Conexión y listo!'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Link to Spreadsheet if known */}
              {ownerConfig.spreadsheetUrl && (
                <div className="pt-2 flex justify-end">
                  <a
                    href={ownerConfig.spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    <span>{isEn ? 'Open your spreadsheet in Google' : 'Abrir tu hoja de cálculo en Google'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
