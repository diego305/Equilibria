import React from 'react';
import { CheckSquare, BarChart2, GitCompare, History, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  currentTab: 'quiz' | 'results' | 'compare' | 'history' | 'guide';
  onSelectTab: (tab: 'quiz' | 'results' | 'compare' | 'history' | 'guide') => void;
  hasResults: boolean;
  historyCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  hasResults,
  historyCount,
}) => {
  const { language } = useLanguage();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c1412]/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 transition-colors">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        <button
          onClick={() => onSelectTab('quiz')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
            currentTab === 'quiz'
              ? 'text-emerald-700 dark:text-emerald-300 font-semibold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">{language === 'en' ? 'Quiz' : 'Test'}</span>
        </button>

        <button
          onClick={() => onSelectTab(hasResults ? 'results' : 'quiz')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
            currentTab === 'results'
              ? 'text-emerald-700 dark:text-emerald-300 font-semibold'
              : hasResults
              ? 'text-stone-500 dark:text-stone-400'
              : 'text-stone-300 dark:text-stone-700'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">{language === 'en' ? 'Results' : 'Resultados'}</span>
        </button>

        <button
          onClick={() => onSelectTab('compare')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
            currentTab === 'compare'
              ? 'text-emerald-700 dark:text-emerald-300 font-semibold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <GitCompare className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Dashboard</span>
        </button>

        <button
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] relative transition-colors cursor-pointer ${
            currentTab === 'history'
              ? 'text-emerald-700 dark:text-emerald-300 font-semibold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <History className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-700 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">{language === 'en' ? 'History' : 'Historial'}</span>
        </button>

        <button
          onClick={() => onSelectTab('guide')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
            currentTab === 'guide'
              ? 'text-emerald-700 dark:text-emerald-300 font-semibold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">{language === 'en' ? 'Pillars' : 'Pilares'}</span>
        </button>
      </div>
    </nav>
  );
};
