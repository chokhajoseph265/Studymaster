import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Layers,
  GraduationCap,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Database,
  Radio,
  CheckCircle2,
  Lock,
  Smartphone,
  Laptop,
  RefreshCw,
  Zap
} from 'lucide-react';
import { syncManager } from '../../services/syncManager';
import { openInPublicTab } from '../../utils/urlHelper';

interface ConnectedAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApp: 'student' | 'admin';
  onSwitchToAdmin: () => void;
  onSwitchToStudent: () => void;
}

export const ConnectedAppsModal: React.FC<ConnectedAppsModalProps> = ({
  isOpen,
  onClose,
  currentApp,
  onSwitchToAdmin,
  onSwitchToStudent
}) => {
  if (!isOpen) return null;

  const handleOpenAdminInNewTab = () => {
    openInPublicTab('/admin');
  };

  const handleOpenStudentInNewTab = () => {
    openInPublicTab('/?app=student');
  };

  const handleForceSync = () => {
    syncManager.broadcast('general_sync', currentApp);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    StudyMaster Connected Apps
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Live Sync
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Two specialized applications connected by a real-time syllabus engine
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Connection Status Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span className="font-bold text-emerald-950 dark:text-emerald-200 block">
                    Shared Real-Time Curriculum Engine Active
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                    Updates published in the Admin Console synchronize directly to the Student App
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleForceSync}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-slate-700 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 shadow-2xs transition cursor-pointer shrink-0"
                title="Trigger immediate sync check"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Check Sync</span>
              </button>
            </div>

            {/* The 2 Apps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* App 1: Student App */}
              <div
                className={`p-4.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  currentApp === 'student'
                    ? 'bg-gradient-to-b from-emerald-50/40 to-white dark:from-slate-800/80 dark:to-slate-800/40 border-emerald-400 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    {currentApp === 'student' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Current App
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                        Standalone Route: /
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>StudyMaster Student App</span>
                      <span className="text-xs">🇲🇼</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Dedicated learning companion for Form 1–4 secondary school students in Malawi.
                    </p>
                  </div>

                  <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 pt-1">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Forms 1–4 JCE & MSCE Syllabuses</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>StudyMaster Assist (Interactive Teacher)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Past Papers, Timetables & Quizzes</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>100% Offline Cache & Audio Reader</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                  {currentApp === 'student' ? (
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                    >
                      Continue Studying
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSwitchToStudent();
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Switch to Student App</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenStudentInNewTab}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 transition cursor-pointer"
                        title="Open in new window / tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* App 2: Admin App */}
              <div
                className={`p-4.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  currentApp === 'admin'
                    ? 'bg-slate-900 text-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-slate-900 text-white border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    {currentApp === 'admin' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Current App
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
                        Route: /admin
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>StudyMaster Admin Suite</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-700/50 rounded font-mono font-bold">
                        CONSOLE
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Teacher, Ministry & Examiner administrative center for curriculum management.
                    </p>
                  </div>

                  <ul className="text-[11px] text-slate-300 space-y-1.5 pt-1">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Curriculum & Notes Authoring Studio</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>MANEB Exam Timetable & Insights</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Official Broadcasts & Announcements</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Student Registry, Reports & Audit Trail</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800 flex items-center gap-2">
                  {currentApp === 'admin' ? (
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition"
                    >
                      Continue in Admin
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSwitchToAdmin();
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Launch Admin Console</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenAdminInNewTab}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                        title="Open Admin in new window / tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Architecture Explainer */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>How the Two Connected Apps Work Together</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Both applications operate as independent frontends sharing the same central curriculum and user database. When an administrator or teacher publishes revision notes, updates MANEB schedules, or broadcasts emergency examination news in the <strong>Admin Suite</strong>, the changes are instantly synchronized across all devices running the <strong>Student App</strong>.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  <Laptop className="w-3 h-3 text-emerald-600" /> Side-by-Side Dual Window
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  <Smartphone className="w-3 h-3 text-emerald-600" /> Mobile & Desktop Ready
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  <Zap className="w-3 h-3 text-amber-500" /> Instant Push Broadcasts
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>StudyMaster • Connected Ecosystem</span>
            <button
              type="button"
              onClick={onClose}
              className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
