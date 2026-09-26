import React, { useState, useEffect } from 'react';
import {
  Search,
  Menu,
  Bell,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SecondRowNav } from './SecondRowNav';
import { AppLogoIcon } from './AppLogo';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMoreMenu: () => void;
  onOpenCalculator: () => void;
  onOpenNotifications?: () => void;
  onOpenPeriodicTable: () => void;
  onOpenInstall?: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenMoreMenu,
  onOpenCalculator,
  onOpenNotifications,
  onOpenPeriodicTable,
  onOpenInstall,
  unreadNotificationsCount = 0
}) => {
  const { activeForm } = useAuth();
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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white shadow-xs transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4 pb-2.5 sm:pb-3 space-y-2.5">
        {/* ROW 1: MORE BUTTON, CENTERED LOGO & ACTIONS (NOTIFICATIONS + INSTALL) */}
        <div className="w-full grid grid-cols-3 items-center">
          {/* Left: More Menu Button */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={onOpenMoreMenu}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition-all cursor-pointer shrink-0 active:scale-95 group"
              title="Settings & Tools"
              aria-label="Settings and Tools Menu"
            >
              <Menu className="w-5 h-5 stroke-[2.2] group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Center: App Logo */}
          <div className="flex items-center justify-center">
            <AppLogoIcon sizeClass="w-9 h-9 sm:w-10 sm:h-10" />
          </div>

          {/* Right: Install App & Notifications */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            {!isStandalone && onOpenInstall && (
              <button
                type="button"
                onClick={onOpenInstall}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 h-10 sm:h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all cursor-pointer shrink-0 active:scale-95 font-bold text-xs"
                title="Install StudyMaster App on Device"
                aria-label="Install StudyMaster App"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden xs:inline">Install</span>
              </button>
            )}

            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400/50 transition-all cursor-pointer shrink-0 active:scale-95 group"
                title={`Notifications & Alerts (${unreadNotificationsCount} unread)`}
                aria-label="Notifications & Alerts"
              >
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-700 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs border-2 border-white dark:border-slate-900 animate-pulse">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ROW 2: FULL PROMINENT SEARCH BAR (BELOW THE MORE BUTTON) */}
        <div
          onClick={onOpenSearch}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenSearch();
            }
          }}
          className="w-full h-11 sm:h-12 flex items-center justify-between gap-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer shadow-2xs transition-all hover:border-emerald-500/60 group active:scale-[0.99]"
          title="Search topics, notes & past papers"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 truncate">
              Search {activeForm} notes, past papers & formulas...
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400 shadow-2xs">
              <span>Quick Search</span>
              <kbd className="font-mono text-[9px] bg-slate-100 dark:bg-slate-800 px-1 py-0.2 rounded text-slate-600 dark:text-slate-300">↵</kbd>
            </span>
            <span className="md:hidden text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              Search
            </span>
          </div>
        </div>

        {/* ROW 3: SECOND ROW NAVIGATION (STATUS & UTILITY BAR) */}
        <SecondRowNav
          onOpenCalculator={onOpenCalculator}
          onOpenPeriodicTable={onOpenPeriodicTable}
          onOpenInstall={onOpenInstall}
          className="px-0 py-0 bg-transparent dark:bg-transparent border-0 shadow-none"
        />
      </div>
    </header>
  );
};


