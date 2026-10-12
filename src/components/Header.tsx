import React from 'react';
import { Sun, Moon, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  currentTab: 'quiz' | 'results' | 'compare' | 'history' | 'guide';
  onSelectTab: (tab: 'quiz' | 'results' | 'compare' | 'history' | 'guide') => void;
  onResetTest: () => void;
  hasResults: boolean;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onResetTest,
  hasResults,
  historyCount,
}) => {
  const { toggleTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onSelectTab(hasResults ? 'results' : 'quiz')}
          className="flex items-center gap-2.5 text-left text-slate-900 dark:text-white whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-teal-700 transition-colors">
            E
          </div>
          <div>
            <span className="font-semibold text-base sm:text-lg tracking-tight block leading-tight">
              {t('appName')}
            </span>
            <span className="text-[10px] text-teal-700 dark:text-teal-400 block font-normal leading-none tracking-normal">
              {t('appSubname')}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs lg:text-sm font-medium">
          <button
            onClick={() => onSelectTab('quiz')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'quiz'
                ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/50 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t('navQuiz')}
          </button>

          {hasResults && (
            <button
              onClick={() => onSelectTab('results')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'results'
                  ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/50 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t('navResults')}
            </button>
          )}

          <button
            onClick={() => onSelectTab('compare')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'compare'
                ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/50 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t('navCompare')}
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentTab === 'history'
                ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/50 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>{t('navHistory')}</span>
            {historyCount > 0 && (
              <span className="text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('guide')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'guide'
                ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/50 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t('navPillars')}
          </button>
        </nav>

        {/* Zone 3: Primary Action, Theme & Language Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Language Toggle Button: English / Español (two exclusive options) */}
          <div
            className="flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
            role="group"
            aria-label="Seleccionar idioma / Select language"
          >
            <button
              type="button"
              onClick={() => setLanguage('es')}
              className={`min-h-[34px] px-2.5 py-1 rounded-md transition-all ${
                language === 'es'
                  ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Español"
              aria-pressed={language === 'es'}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`min-h-[34px] px-2.5 py-1 rounded-md transition-all ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
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
            className="min-h-[36px] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">{language === 'en' ? 'Light' : 'Claro'}</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <span className="hidden sm:inline">{language === 'en' ? 'Dark' : 'Oscuro'}</span>
              </>
            )}
          </button>

          {/* New Test / Restart button */}
          <button
            onClick={onResetTest}
            className="px-3.5 py-2 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 rounded-lg shadow-sm transition-all whitespace-nowrap flex items-center gap-1.5"
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
