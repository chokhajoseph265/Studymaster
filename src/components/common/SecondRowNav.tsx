import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Calculator,
  FlaskConical,
  Download,
  Menu,
  Search,
  PanelLeftOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBattery } from '../../context/BatteryContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { AccessibilitySymbol } from './AccessibilitySymbol';

export interface SecondRowNavProps {
  onOpenMoreMenu?: () => void;
  onOpenCalculator: () => void;
  onOpenNotifications?: () => void;
  onOpenPeriodicTable: () => void;
  onOpenInstall?: () => void;
  onOpenSearch?: () => void;
  onToggleSidebar?: () => void;
  unreadNotificationsCount?: number;
  isAssistScreen?: boolean;
  className?: string;
}

export const SecondRowNav: React.FC<SecondRowNavProps> = ({
  onOpenMoreMenu,
  onOpenCalculator,
  onOpenNotifications,
  onOpenPeriodicTable,
  onOpenInstall,
  onOpenSearch,
  onToggleSidebar,
  unreadNotificationsCount = 0,
  isAssistScreen = false,
  className = ''
}) => {
  const { user, activeForm } = useAuth();
  const { themeMode, setThemeMode } = useBattery();
  const { setOpenAccessibilityModal, dyslexiaFont, highContrastMode, readingRuler, isSpeaking } = useAccessibility();
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsStandalone(true);
    }
  }, []);

  return (
    <div
      className={`w-full flex items-center gap-1.5 sm:gap-2 py-0.5 px-0 bg-transparent dark:bg-transparent text-slate-900 dark:text-white transition-all ${className}`}
    >
      {/* Toggle Teacher Sidebar if on Assist Screen */}
      {isAssistScreen && onToggleSidebar ? (
        <button
          id="btn-nav-chats"
          type="button"
          onClick={onToggleSidebar}
          className="flex-1 min-w-0 h-9 sm:h-10 flex items-center justify-center px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-2xs cursor-pointer active:scale-95"
          title="Open Study Sessions & Tools Sidebar"
          aria-label="Toggle Study Sessions Sidebar"
        >
          <PanelLeftOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        </button>
      ) : onOpenMoreMenu ? (
        <button
          id="btn-nav-settings"
          type="button"
          onClick={onOpenMoreMenu}
          className="flex-1 min-w-0 h-9 sm:h-10 flex items-center justify-center px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-2xs cursor-pointer active:scale-95 group"
          title="Settings & Tools"
          aria-label="Settings"
        >
          <Menu className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
        </button>
      ) : null}

      {/* 1. 🌙/☀️ Dark Mode Toggle */}
      <button
        id="btn-nav-dark-mode"
        type="button"
        onClick={() => setThemeMode(themeMode === 'amoled' ? 'light' : 'amoled')}
        className="flex-1 min-w-0 h-9 sm:h-10 flex items-center justify-center px-2 rounded-xl border transition-all shadow-2xs cursor-pointer active:scale-95 bg-slate-100 dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80"
        title={themeMode === 'amoled' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label={themeMode === 'amoled' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {themeMode === 'light' ? (
          <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
        ) : (
          <Sun className="w-4 h-4 text-amber-400 shrink-0" />
        )}
      </button>

      {/* 2. Encircled Accessibility Hub Symbol */}
      <button
        id="btn-nav-accessibility"
        type="button"
        onClick={() => setOpenAccessibilityModal(true)}
        className={`flex-1 min-w-0 h-9 sm:h-10 flex items-center justify-center px-2 rounded-xl border transition-all shadow-2xs cursor-pointer active:scale-95 ${
          dyslexiaFont || highContrastMode || readingRuler || isSpeaking
            ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-400/40'
            : 'bg-slate-100 dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80'
        }`}
        title="Inclusive Learning Hub (Assistive & Accessibility Tools)"
        aria-label="Inclusive Learning Hub"
      >
        <AccessibilitySymbol
          className={`w-4.5 h-4.5 shrink-0 ${
            dyslexiaFont || highContrastMode || readingRuler || isSpeaking
              ? 'text-white'
              : 'text-blue-600 dark:text-blue-400'
          }`}
        />
      </button>

      {/* 3. Quick Scientific Calculator */}
      <button
        id="btn-nav-calculator"
        type="button"
        onClick={onOpenCalculator}
        className="flex-1 min-w-0 h-9 sm:h-10 flex items-center justify-center px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300/90 dark:border-emerald-700/80 text-emerald-800 dark:text-emerald-200 transition-colors shadow-2xs cursor-pointer active:scale-95"
        title="Open Scientific Calculator (MANEB / Science calculations)"
        aria-label="Scientific Calculator"
      >
        <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
      </button>

      {/* 4. Periodic Table & Chemistry Guide */}
      <button
        id="btn-nav-periodic"
        type="button"
        onClick={onOpenPeriodicTable}
        className="flex-1 min-w-0 h-9 sm:h-10 flex items-center justify-center px-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-300/90 dark:border-teal-700/80 text-teal-800 dark:text-teal-200 transition-colors shadow-2xs cursor-pointer active:scale-95"
        title="Open Periodic Table & Chemistry Guide (Elements, Valency, Radicals)"
        aria-label="Periodic Table"
      >
        <FlaskConical className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
      </button>

      {/* 5. Quick Search button (if available and needed on Assist screen) */}
      {onOpenSearch && isAssistScreen && (
        <button
          id="btn-nav-search"
          type="button"
          onClick={onOpenSearch}
          className="flex-1 min-w-0 h-9 sm:h-10 flex items-center justify-center px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs cursor-pointer active:scale-95"
          title="Search notes & past papers"
          aria-label="Search"
        >
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
        </button>
      )}

      {/* 6. Install App Button if not standalone */}
      {!isStandalone && onOpenInstall && (
        <button
          id="btn-nav-install"
          type="button"
          onClick={onOpenInstall}
          className="flex flex-1 min-w-0 h-9 sm:h-10 items-center justify-center px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer active:scale-95"
          title="Install StudyMaster App on Device"
          aria-label="Install App"
        >
          <Download className="w-4 h-4 stroke-[2.5] shrink-0" />
        </button>
      )}
    </div>
  );
};
