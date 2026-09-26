import React from 'react';
import { useBattery } from '../../context/BatteryContext';
import {
  Sun,
  Moon,
  X
} from 'lucide-react';

export const BatteryHubModal: React.FC = () => {
  const {
    openBatteryModal,
    setOpenBatteryModal,
    themeMode,
    setThemeMode
  } = useBattery();

  if (!openBatteryModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={() => setOpenBatteryModal(false)}
    >
      <div
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Dark Mode"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold">
              {themeMode === 'amoled' ? (
                <Moon className="w-4.5 h-4.5" />
              ) : (
                <Sun className="w-4.5 h-4.5" />
              )}
            </div>
            <h2 className="text-base font-black text-neutral-900 dark:text-white">
              Dark Mode
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setOpenBatteryModal(false)}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            title="Close"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Symbols Only Theme Selector */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              setThemeMode('light');
              setOpenBatteryModal(false);
            }}
            className={`p-4 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
              themeMode === 'light'
                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500/30 shadow-xs'
                : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:border-emerald-400'
            }`}
            title="Light Mode"
            aria-label="Light Mode"
          >
            <Sun className="w-7 h-7" />
          </button>

          <button
            type="button"
            onClick={() => {
              setThemeMode('amoled');
              setOpenBatteryModal(false);
            }}
            className={`p-4 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
              themeMode === 'amoled'
                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500/30 shadow-xs'
                : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:border-emerald-400'
            }`}
            title="Dark Mode"
            aria-label="Dark Mode"
          >
            <Moon className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
