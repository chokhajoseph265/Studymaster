import React, { useState, useEffect } from 'react';
import { GraduationCap, ShieldCheck, Download, Radio, CheckCircle2, Smartphone, ChevronRight } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface AppModeSwitcherProps {
  currentMode: 'student' | 'admin';
  onSwitchToStudent: () => void;
  onSwitchToAdmin: () => void;
  onOpenInstallModal: () => void;
  className?: string;
}

export const AppModeSwitcher: React.FC<AppModeSwitcherProps> = ({
  currentMode,
  onSwitchToStudent,
  onSwitchToAdmin,
  onOpenInstallModal,
  className = ''
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [installing, setInstalling] = useState(false);

  const handleQuickInstall = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInstallable) {
      setInstalling(true);
      try {
        await install();
      } finally {
        setInstalling(false);
      }
    } else {
      onOpenInstallModal();
    }
  };

  return (
    <div
      className={`w-full bg-slate-900 text-white border-b border-slate-800/90 text-xs py-1.5 px-3 sm:px-6 flex items-center justify-between gap-2 shadow-inner select-none transition-colors ${className}`}
    >
      {/* Left: App Suite Branding & Mode Selector */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        <div className="hidden md:flex items-center gap-1.5 text-slate-400 font-semibold shrink-0 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-200">StudyMaster Suite</span>
          <span className="text-slate-600">•</span>
        </div>

        {/* Segmented Dual App Switcher */}
        <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
          {/* Student App Mode */}
          <button
            type="button"
            onClick={onSwitchToStudent}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-bold text-[11px] sm:text-xs transition-all cursor-pointer ${
              currentMode === 'student'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Switch to Student App (Notes, Quizzes, Past Papers, Teacher Assist)"
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span>Student App</span>
            {currentMode === 'student' && (
              <span className="hidden xs:inline-block w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />
            )}
          </button>

          {/* Admin Portal Mode */}
          <button
            type="button"
            onClick={onSwitchToAdmin}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-bold text-[11px] sm:text-xs transition-all cursor-pointer ${
              currentMode === 'admin'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Switch to Admin Portal (MANEB Bulletins, Syllabus & Content Manager)"
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>Admin Portal</span>
            {currentMode === 'admin' && (
              <span className="hidden xs:inline-block w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Right: Install App Trigger & Standalone Status */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {isInstalled ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] sm:text-[11px] font-bold text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span className="hidden xs:inline">App Installed</span>
            <span className="xs:hidden">Installed</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleQuickInstall}
            disabled={installing}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-[11px] sm:text-xs shadow-xs hover:shadow transition-all cursor-pointer active:scale-95 border border-emerald-500/40"
            title="Install StudyMaster App on your Android, iPhone, or PC for 100% offline study"
          >
            <Download className={`w-3 h-3 ${installing ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">Install App</span>
            <span className="sm:hidden">Install</span>
          </button>
        )}
      </div>
    </div>
  );
};
