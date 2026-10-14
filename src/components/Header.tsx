import React from 'react';
import { Sun, Moon, RefreshCw, FileText, FileSpreadsheet } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useGoogleSheets } from '../context/GoogleSheetsContext';

interface HeaderProps {
  currentTab: 'quiz' | 'results' | 'compare' | 'history' | 'guide';
  onSelectTab: (tab: 'quiz' | 'results' | 'compare' | 'history' | 'guide') => void;
  onResetTest: () => void;
  onOpenQuestionsMd: () => void;
  hasResults: boolean;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onResetTest,
  onOpenQuestionsMd,
  hasResults,
  historyCount,
}) => {
  const { toggleTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isConnected, isThirdPartyReady, sheetRecords } = useGoogleSheets();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-[#0c1412]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onSelectTab(hasResults ? 'results' : 'quiz')}
          className="flex items-center gap-2.5 text-left text-stone-900 dark:text-white whitespace-nowrap shrink-0 group focus:outline-none cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-emerald-800 dark:group-hover:bg-emerald-500 transition-colors">
            E
          </div>
          <div>
            <span className="font-semibold text-base sm:text-lg tracking-tight block leading-tight text-stone-900 dark:text-stone-100">
              {t('appName')}
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-normal leading-none tracking-normal">
              {t('appSubname')}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs lg:text-sm font-medium">
          <button
            onClick={() => onSelectTab('quiz')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'quiz'
                ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/50 font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {t('navQuiz')}
          </button>

          {hasResults && (
            <button
              onClick={() => onSelectTab('results')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'results'
                  ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/50 font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {t('navResults')}
            </button>
          )}

          <button
            onClick={() => onSelectTab('compare')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'compare'
                ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/50 font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {t('navCompare')}
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'history'
                ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/50 font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <span>{t('navHistory')}</span>
            {historyCount > 0 && (
              <span className="text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('guide')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'guide'
                ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/50 font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {t('navPillars')}
          </button>
        </nav>

        {/* Zone 3: Primary Action, Theme & Language Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Toggle Button: English / Español (two exclusive options) */}
          <div
            className="flex items-center p-0.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100/80 dark:bg-stone-900 text-xs font-semibold"
            role="group"
            aria-label="Seleccionar idioma / Select language"
          >
            <button
              type="button"
              onClick={() => setLanguage('es')}
              className={`min-h-[32px] sm:min-h-[34px] px-2 sm:px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                language === 'es'
                  ? 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
              title="Español"
              aria-pressed={language === 'es'}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`min-h-[32px] sm:min-h-[34px] px-2 sm:px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
              title="English"
              aria-pressed={language === 'en'}
            >
              EN
            </button>
          </div>

          {/* Direct Dark / Light Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={
              isDark
                ? language === 'en'
                  ? 'Switch to Light Mode'
                  : 'Cambiar a Modo Claro'
                : language === 'en'
                ? 'Switch to Dark Mode'
                : 'Cambiar a Modo Oscuro'
            }
            aria-label={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            className="min-h-[32px] sm:min-h-[36px] px-2 sm:px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/80 active:bg-stone-200 dark:active:bg-stone-700 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline font-medium">{language === 'en' ? 'Light' : 'Claro'}</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span className="hidden sm:inline font-medium">{language === 'en' ? 'Dark' : 'Oscuro'}</span>
              </>
            )}
          </button>

          {/* Secondary Button: 16 Questions in Markdown */}
          <button
            type="button"
            onClick={onOpenQuestionsMd}
            title={t('btnViewQuestionsMd')}
            aria-label={t('btnViewQuestionsMd')}
            className="min-h-[32px] sm:min-h-[36px] px-2 sm:px-2.5 py-1.5 rounded-lg border border-emerald-200/90 dark:border-emerald-800/80 bg-emerald-50/70 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span className="hidden lg:inline">{t('btnMarkdownQuestions')}</span>
          </button>

          {/* Google Sheets DB Status Indicator / Button */}
          <button
            type="button"
            onClick={() => onSelectTab('history')}
            title={
              isConnected || isThirdPartyReady
                ? language === 'en'
                  ? `Google Sheets connected: ${sheetRecords.length} records`
                  : `Google Sheets conectado: ${sheetRecords.length} registros`
                : language === 'en'
                ? 'Connect Google Sheets Database'
                : 'Conectar Base de Datos Google Sheets'
            }
            aria-label="Google Sheets"
            className={`min-h-[32px] sm:min-h-[36px] px-2 sm:px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
              isConnected || isThirdPartyReady
                ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/80'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden xl:inline">Sheets</span>
            {(isConnected || isThirdPartyReady) && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          {/* New Test / Restart button */}
          <button
            onClick={onResetTest}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg shadow-xs transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('btnNewTest')}</span>
            <span className="sm:hidden">{t('btnNew')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
