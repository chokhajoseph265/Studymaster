import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  HelpCircle,
  Eye,
  EyeOff,
  Building2,
  CreditCard,
  BookOpen,
  ExternalLink,
  Layers,
  Radio,
  Download
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AppLogo } from '../common/AppLogo';
import { ConnectedAppsModal } from '../common/ConnectedAppsModal';
import { openInPublicTab } from '../../utils/urlHelper';

interface AdminPortalProps {
  onNavigateToStudent: () => void;
  onOpenInstall?: () => void;
}

const DEFAULT_ADMIN_PIN = '2026';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onNavigateToStudent, onOpenInstall }) => {
  const [showConnectedApps, setShowConnectedApps] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      sessionStorage.getItem('studymaster_admin_authed') === 'true' ||
      localStorage.getItem('studymaster_admin_authed_persistent') === 'true'
    );
  });

  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockTimer, setLockTimer] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(() => {
    return localStorage.getItem('studymaster_admin_authed_persistent') === 'true';
  });
  const [showPinChars, setShowPinChars] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'StudyMaster • Admin Console';
    return () => {
      document.title = 'StudyMaster - MSCE & JCE Secondary School Companion';
    };
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    let interval: any = null;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  const handleKeyPress = (num: string) => {
    if (isLocked) return;
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMsg('');

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    if (isLocked) return;
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    if (isLocked) return;
    setPin('');
    setErrorMsg('');
  };

  const verifyPin = (inputPin: string) => {
    const activePin = localStorage.getItem('studymaster_admin_pin') || DEFAULT_ADMIN_PIN;
    if (inputPin === activePin) {
      setErrorMsg('');
      setPin('');
      setAttempts(0);
      setIsAuthenticated(true);
      sessionStorage.setItem('studymaster_admin_authed', 'true');
      if (rememberDevice) {
        localStorage.setItem('studymaster_admin_authed_persistent', 'true');
      }
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');

      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTimer(30);
        setErrorMsg('Too many failed attempts. Security locked for 30s.');
      } else {
        setErrorMsg(`Incorrect PIN. ${3 - newAttempts} attempts remaining.`);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('studymaster_admin_authed');
    localStorage.removeItem('studymaster_admin_authed_persistent');
    onNavigateToStudent();
  };

  // If successfully logged into admin
  if (isAuthenticated) {
    return (
      <AdminDashboard
        onExitAdmin={handleLogout}
        onSwitchToStudent={onNavigateToStudent}
        onOpenInstall={onOpenInstall}
      />
    );
  }

  // Admin Gateway Login Screen (Clean White Theme)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Bar with Return to Student App Button & Connected Status */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between pt-2 gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateToStudent}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>Go to Student App</span>
          </button>

          <button
            type="button"
            onClick={() => openInPublicTab('/?app=student')}
            className="hidden xs:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
            title="Open Student App in a separate window/tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Open in New Tab</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onOpenInstall && (
            <button
              type="button"
              onClick={onOpenInstall}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              title="Install StudyMaster Admin App on device"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install Admin App</span>
              <span className="sm:hidden">Install</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowConnectedApps(true)}
            className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full transition cursor-pointer"
            title="View connected apps ecosystem"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <Radio className="w-3 h-3 text-emerald-700" />
            <span className="hidden sm:inline">Connected to Student App</span>
            <span className="sm:hidden">Connected</span>
            <Layers className="w-3 h-3 text-emerald-700 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Connected Apps Modal */}
      <ConnectedAppsModal
        isOpen={showConnectedApps}
        onClose={() => setShowConnectedApps(false)}
        currentApp="admin"
        onSwitchToAdmin={() => setShowConnectedApps(false)}
        onSwitchToStudent={() => {
          setShowConnectedApps(false);
          onNavigateToStudent();
        }}
      />

      {/* Main Gateway Card (White background & polished shadows) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto my-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl"
      >
        {/* Brand Icon & Title */}
        <div className="text-center space-y-3 mb-6">
          <div className="flex justify-center mb-1">
            <AppLogo size="lg" variant="icon" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center justify-center gap-1.5">
              <span>StudyMaster Admin</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                MW 🇲🇼
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              National Examination, MANEB Bulletins & Curriculum Management
            </p>
          </div>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center items-center gap-4 my-6">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-mono font-bold transition-all duration-200 ${
                  isFilled
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-md shadow-emerald-100 scale-105'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                {isFilled ? (showPinChars ? pin[index] : '●') : ''}
              </div>
            );
          })}
        </div>

        {/* Error / Lockout Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLocked && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-center gap-2">
            <span>Terminal locked. Retry in {lockTimer}s</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              disabled={isLocked}
              onClick={() => handleKeyPress(num)}
              className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-emerald-600 active:text-white border border-slate-200 text-slate-800 text-xl font-bold transition-all disabled:opacity-40 shadow-xs flex items-center justify-center cursor-pointer"
            >
              {num}
            </button>
          ))}

          <button
            type="button"
            disabled={isLocked || pin.length === 0}
            onClick={handleClear}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold transition-all disabled:opacity-30 border border-slate-200 cursor-pointer"
          >
            Clear
          </button>

          <button
            type="button"
            disabled={isLocked}
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-emerald-600 active:text-white border border-slate-200 text-slate-800 text-xl font-bold transition-all disabled:opacity-40 shadow-xs flex items-center justify-center cursor-pointer"
          >
            0
          </button>

          <button
            type="button"
            disabled={isLocked || pin.length === 0}
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold transition-all disabled:opacity-30 border border-slate-200 cursor-pointer"
          >
            ⌫
          </button>
        </div>

        {/* Options & Helpers */}
        <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => {
                  setRememberDevice(e.target.checked);
                  if (e.target.checked) {
                    localStorage.setItem('studymaster_admin_authed_persistent', 'true');
                  } else {
                    localStorage.removeItem('studymaster_admin_authed_persistent');
                  }
                }}
                className="rounded bg-white border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Remember on this device</span>
            </label>

            <button
              type="button"
              onClick={() => setShowPinChars(!showPinChars)}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px] cursor-pointer"
            >
              {showPinChars ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPinChars ? 'Hide' : 'Show'}</span>
            </button>
          </div>

          <div className="text-center pt-2 space-y-2">
            <button
              type="button"
              onClick={() => {
                setPin('2026');
                verifyPin('2026');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              title="Quickly fill default PIN 2026 and unlock Admin Portal"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span>Quick Login with Admin PIN (2026)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-[11px] text-slate-500 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Default Administrator Access Code</span>
            </button>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600"
              >
                Initial master PIN is <span className="font-mono font-bold text-emerald-700">{DEFAULT_ADMIN_PIN}</span>. You can change this inside the Admin Suite security settings.
              </motion.div>
            )}
          </div>

          {/* Connected Ecosystem Card */}
          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Live Student Syllabus Database</span>
            </div>
            <button
              type="button"
              onClick={() => setShowConnectedApps(true)}
              className="text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
            >
              Connected Apps Hub
            </button>
          </div>
        </div>
      </motion.div>

      {/* Footer Credentials Info */}
      <div className="text-center text-[11px] text-slate-500 py-3">
        StudyMaster Educational Platform • Central Administration
      </div>
    </div>
  );
};
