import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  BookOpen, 
  Zap, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { MalawiFlagBadge } from './MalawiFlagBadge';
import { getActiveLogoSrc } from '../../data/logos';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Loading MANEB syllabus & lessons...');
  const [isReady, setIsReady] = useState(false);
  const [logoSrc] = useState<string>(getActiveLogoSrc());
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    // Smooth progress simulation over 2.4 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 2.5;
        if (next >= 30 && next < 65) {
          setStatusText('Preparing Form 1–4 notes & past papers...');
        } else if (next >= 65 && next < 95) {
          setStatusText('Activating offline study engine...');
        } else if (next >= 95) {
          setStatusText('Ready! Welcome to StudyMaster');
          setIsReady(true);
        }
        return next > 100 ? 100 : next;
      });
    }, 45);

    // Auto-finish after completion
    const timer = setTimeout(() => {
      onFinishRef.current?.();
    }, 2700);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const handleSkip = () => {
    onFinishRef.current?.();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="studymaster-splash"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.99 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none overflow-hidden bg-slate-950/80 backdrop-blur-md"
      >
        {/* Soft atmospheric gradient glow matching the app palette */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-emerald-600/15 blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-red-600/10 blur-3xl" />
        </div>

        {/* Central Card styled precisely to match StudyMaster's visual identity */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-sm sm:max-w-md rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-900 dark:text-white"
        >
          {/* Top Bar: Malawi Badge & Skip Action */}
          <div className="flex items-center justify-between mb-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-2xs">
              <MalawiFlagBadge size="sm" showText={false} />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Malawi
              </span>
            </div>

            <button
              id="btn-skip-splash"
              type="button"
              onClick={handleSkip}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <span>Skip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center Brand Identity (Matches AppLogo hero variant) */}
          <div className="flex flex-col items-center text-center relative z-10 mb-6">
            {/* Circular Official Logo Emblem */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="w-24 h-24 sm:w-28 sm:h-28 mb-3 p-1.5 bg-white rounded-full shadow-md border border-slate-200 flex items-center justify-center shrink-0"
            >
              <img
                src={logoSrc}
                alt="StudyMaster Malawi"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-full"
              />
            </motion.div>

            {/* Wordmark strictly matching AppLogo & Header */}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-sans flex items-center justify-center gap-0.5 mb-1">
              <span>Study</span>
              <span className="text-red-600">Master</span>
            </h1>

            {/* Official App Tagline */}
            <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 italic tracking-wide mb-2.5">
              Learn • Practice • Excel
            </p>

            {/* Secondary School Track Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
              <span>Forms 1 – 4 • MANEB JCE &amp; MSCE</span>
            </div>
          </div>

          {/* Feature Badges matching app card styling */}
          <div className="grid grid-cols-3 gap-2 mb-6 relative z-10">
            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 text-center shadow-2xs">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1" />
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">MANEB Syllabus</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 text-center shadow-2xs">
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 mb-1" />
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">100% Offline</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 text-center shadow-2xs">
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Past Papers</span>
            </div>
          </div>

          {/* Progress & Status Section */}
          <div className="space-y-3 relative z-10">
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-emerald-600 shadow-xs relative overflow-hidden"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>

            {/* Status Text & Percentage */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium px-1">
              <span className="flex items-center gap-1.5 truncate">
                {isReady ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                )}
                <span className="truncate">{statusText}</span>
              </span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0 ml-2">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Primary Action Button (Matches app primary buttons) */}
            <div className="pt-2">
              <button
                id="btn-enter-studymaster"
                type="button"
                onClick={handleSkip}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm tracking-wide shadow-md hover:shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>{isReady ? 'Get Started' : 'Enter StudyMaster'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
