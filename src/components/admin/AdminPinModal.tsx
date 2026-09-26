import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  AlertTriangle,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_ADMIN_PIN = '2026';

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockTimer, setLockTimer] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [savedPin, setSavedPin] = useState<string>(() => {
    return localStorage.getItem('studymaster_admin_pin') || DEFAULT_ADMIN_PIN;
  });

  // Handle Lockout countdown
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

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (isLocked) return;
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMsg('');

      // Auto-validate once 4 digits entered
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
    if (inputPin === savedPin) {
      // Success
      setErrorMsg('');
      setPin('');
      setAttempts(0);
      onSuccess();
    } else {
      // Failed
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');

      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTimer(30); // 30 seconds lockout
        setErrorMsg('Too many failed attempts. Locked for 30s.');
      } else {
        setErrorMsg(`Incorrect PIN. ${3 - newAttempts} attempts remaining.`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-sm bg-neutral-900 text-white rounded-3xl border border-neutral-800 p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mt-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-700/60 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black tracking-tight text-white">
            Admin Access Verification
          </h2>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
            Enter your 4-digit Administrator Security PIN to access CMS and student management tools.
          </p>
        </div>

        {/* PIN Indicators (Dots) */}
        <div className="flex justify-center items-center gap-3 my-6">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-emerald-500 scale-110 shadow-sm shadow-emerald-500/50'
                    : 'bg-neutral-800 border border-neutral-700'
                }`}
              />
            );
          })}
        </div>

        {/* Error / Lockout Message */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-2.5 rounded-xl text-xs font-bold text-center mb-4 flex items-center justify-center gap-1.5 ${
              isLocked
                ? 'bg-red-950/80 text-red-300 border border-red-800/80'
                : 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{isLocked ? `Locked. Retry in ${lockTimer}s` : errorMsg}</span>
          </motion.div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={isLocked}
              onClick={() => handleKeyPress(digit)}
              className="h-13 rounded-2xl bg-neutral-800/90 hover:bg-neutral-700 active:bg-emerald-900 border border-neutral-700/70 text-lg font-bold text-white transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            disabled={isLocked || pin.length === 0}
            onClick={handleClear}
            className="h-13 rounded-2xl bg-neutral-800/40 hover:bg-neutral-800 text-xs font-bold text-neutral-400 transition-all flex items-center justify-center disabled:opacity-30"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={isLocked}
            onClick={() => handleKeyPress('0')}
            className="h-13 rounded-2xl bg-neutral-800/90 hover:bg-neutral-700 active:bg-emerald-900 border border-neutral-700/70 text-lg font-bold text-white transition-all flex items-center justify-center disabled:opacity-40 shadow-xs"
          >
            0
          </button>
          <button
            type="button"
            disabled={isLocked || pin.length === 0}
            onClick={handleDelete}
            className="h-13 rounded-2xl bg-neutral-800/40 hover:bg-neutral-800 text-xs font-bold text-neutral-400 transition-all flex items-center justify-center disabled:opacity-30"
          >
            ⌫
          </button>
        </div>

        {/* Default PIN Helper Info for Creator */}
        <div className="mt-5 pt-3 border-t border-neutral-800/80 text-center">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-[11px] text-neutral-400 hover:text-emerald-400 font-semibold inline-flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Master PIN' : 'View Default Admin PIN'}</span>
          </button>

          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 p-2 rounded-xl bg-neutral-800/80 border border-neutral-700 text-[11px] text-neutral-300"
            >
              Default Admin PIN: <strong className="text-emerald-400 font-mono tracking-widest">{DEFAULT_ADMIN_PIN}</strong>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
