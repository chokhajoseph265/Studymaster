import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  ChevronRight, 
  HelpCircle,
  Sliders,
  Download,
  Smartphone
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelpAndFeedback?: () => void;
  onOpenAdmin?: () => void;
  onOpenAssist?: () => void;
  onOpenCalculator?: () => void;
  onOpenNotifications?: () => void;
  onOpenPeriodicTable?: () => void;
  onOpenChichewa?: () => void;
  onOpenDiagrams?: () => void;
  onOpenTheorySandbox?: () => void;
  onOpenParentReport?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenInstall?: () => void;
}

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({
  isOpen,
  onClose,
  onOpenHelpAndFeedback,
  onOpenInstall
}) => {
  const { 
    setOpenAccessibilityModal, 
    dyslexiaFont, 
    highContrastMode, 
    readingRuler, 
    isSpeaking 
  } = useAccessibility();
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsStandalone(true);
    }
  }, []);

  if (!isOpen) return null;

  const isSettingsCustomized = dyslexiaFont || highContrastMode || readingRuler || isSpeaking;

  return (
    <div id="more-menu-modal" className="fixed inset-0 z-50 flex items-stretch justify-start">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside 
        role="dialog"
        aria-modal="true"
        aria-label="Settings and Options"
        className="relative w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-full z-10 text-slate-900 dark:text-white transition-transform transform animate-in slide-in-from-left duration-300 ease-out"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white font-bold shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Menu
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Settings & assistance
              </p>
            </div>
          </div>

          <button
            id="btn-close-more-menu"
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-200/80 dark:bg-slate-700/80 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {/* Install App Option (Highlighted if not in standalone) */}
          {!isStandalone && onOpenInstall && (
            <button
              id="btn-more-install"
              type="button"
              onClick={() => {
                onClose();
                onOpenInstall();
              }}
              className="w-full p-4 rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40 flex items-center justify-between text-left transition-all group active:scale-[0.99] cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <Download className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-emerald-950 dark:text-emerald-200 truncate">
                      Install App on Phone / PC
                    </h4>
                    <span className="text-[9px] font-black uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full shrink-0">
                      Offline
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300/90 mt-0.5 line-clamp-2 font-medium">
                    Add StudyMaster icon to home screen for full offline study
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          )}

          {/* Settings Option */}
          <button
            id="btn-more-settings"
            type="button"
            onClick={() => {
              onClose();
              setOpenAccessibilityModal(true);
            }}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-all group active:scale-[0.99] cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                    Settings
                  </h4>
                  {isSettingsCustomized && (
                    <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full shrink-0">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  Accessibility, dyslexia fonts, reading ruler, audio & display
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* Help & Feedback Option */}
          {onOpenHelpAndFeedback && (
            <button
              id="btn-more-help"
              type="button"
              onClick={() => {
                onClose();
                onOpenHelpAndFeedback();
              }}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-all group active:scale-[0.99] cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    Help & Feedback
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    FAQs, study guides, WhatsApp support & suggestions
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-center shrink-0">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            StudyMaster Malawi • Secondary School Prep
          </p>
        </div>
      </aside>
    </div>
  );
};
