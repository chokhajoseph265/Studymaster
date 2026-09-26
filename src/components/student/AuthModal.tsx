import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  X,
  Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FormLevel } from '../../types';
import { AvatarPicker } from './AvatarPicker';
import { MalawiFlagBadge } from '../common/MalawiFlagBadge';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, isLoading } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('register');
  const [username, setUsername] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [avatarId, setAvatarId] = useState('avatar-1');
  const [formLevel, setFormLevel] = useState<FormLevel>('Form 2');
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === 'login') {
        if (!username || !password) {
          setError('Please provide your username or email/phone and password.');
          return;
        }
        await login(username, password);
        onClose();
      } else if (mode === 'register') {
        if (!username || !emailOrPhone || !password) {
          setError('Please fill in all required fields.');
          return;
        }
        if (username.length < 3) {
          setError('Username must be at least 3 characters long.');
          return;
        }
        await register({
          username,
          emailOrPhone,
          password,
          avatarId,
          activeForm: formLevel
        });
        onClose();
      } else if (mode === 'reset') {
        if (!emailOrPhone || !password) {
          setError('Please provide your registered email/phone and new password.');
          return;
        }
        setResetSuccess(true);
        setTimeout(() => {
          setMode('login');
          setResetSuccess(false);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[90vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-5 relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                StudyMaster
              </span>
            </div>

            <h2 className="text-xl font-extrabold tracking-tight">
              {mode === 'register' && 'Student Registration'}
              {mode === 'login' && 'Welcome Back'}
              {mode === 'reset' && 'Reset Password'}
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium">
              {mode === 'register' && 'Create your permanent secondary student account.'}
              {mode === 'login' && 'Log in to continue learning, earning points & climbing ranks.'}
              {mode === 'reset' && 'Enter your phone or email to update your secure password.'}
            </p>
          </div>

          {/* Form Content */}
          <div className="p-5 overflow-y-auto flex-1">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Password updated! Redirecting to login...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Permanent Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        placeholder="e.g. kondwani_banda"
                        className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      * Permanent. Cannot be modified after registration.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Email OR Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        required
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="e.g. +265 888 123 456 or student@gmail.com"
                        className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Starting Study Form <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['Form 1', 'Form 2', 'Form 3', 'Form 4'] as FormLevel[]).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFormLevel(f)}
                          className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                            formLevel === f
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                              : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      * You can change forms freely at any time later.
                    </span>
                  </div>

                  <AvatarPicker
                    selectedAvatarId={avatarId}
                    onSelect={setAvatarId}
                  />
                </>
              )}

              {mode === 'login' && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Username, Email, or Phone
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. kondwani or admin@studymaster.mw"
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {mode === 'reset' && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Registered Email or Phone Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="e.g. +265 888 123 456"
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700">
                    {mode === 'reset' ? 'New Password' : 'Password'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>
                      {mode === 'register' && 'Complete Student Registration'}
                      {mode === 'login' && 'Sign In to StudyMaster'}
                      {mode === 'reset' && 'Update Password'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch Mode Links */}
            <div className="mt-4 pt-4 border-t border-neutral-100 text-center">
              {mode === 'register' ? (
                <p className="text-xs text-neutral-600">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError(null);
                    }}
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    Log In here
                  </button>
                </p>
              ) : (
                <p className="text-xs text-neutral-600">
                  New student?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError(null);
                    }}
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    Register free account
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
