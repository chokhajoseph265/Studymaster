import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  WifiOff,
  GraduationCap,
  ExternalLink,
  Laptop,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { getActiveLogoSrc } from '../../data/logos';
import { getPublicAppUrl, getPublicHost, openInPublicTab } from '../../utils/urlHelper';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  appType?: 'student' | 'admin';
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose, appType = 'student' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined') {
      return ((window as unknown as { __studymaster_deferred_prompt?: BeforeInstallPromptEvent }).__studymaster_deferred_prompt) || null;
    }
    return null;
  });
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'pc' | 'features'>('android');
  const [isInstalling, setIsInstalling] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Check if already in standalone display mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
    }

    const checkGlobalPrompt = () => {
      const globalPrompt = (window as unknown as { __studymaster_deferred_prompt?: BeforeInstallPromptEvent }).__studymaster_deferred_prompt;
      if (globalPrompt) {
        setDeferredPrompt(globalPrompt);
      }
    };
    checkGlobalPrompt();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as unknown as { __studymaster_deferred_prompt?: Event }).__studymaster_deferred_prompt = e;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      (window as unknown as { __studymaster_deferred_prompt?: Event }).__studymaster_deferred_prompt = undefined;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('studymaster-prompt-captured', checkGlobalPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('studymaster-prompt-captured', checkGlobalPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('Install prompt error:', err);
      } finally {
        setIsInstalling(false);
      }
    }
  };

  const targetPath = appType === 'admin' ? '/admin' : '/?app=student';
  const publicShareUrl = getPublicAppUrl(targetPath);

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(publicShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const logoSrc = getActiveLogoSrc();
  const currentHost = getPublicHost();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with App Icon */}
        <div className={`p-5 border-b relative flex items-center gap-4 ${
          appType === 'admin' 
            ? 'bg-slate-900 border-slate-800 text-white' 
            : 'bg-emerald-900 border-emerald-800/60 text-white'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-lg shrink-0 flex items-center justify-center border border-white/20">
            <img
              src={appType === 'admin' ? '/admin-icon.svg' : logoSrc}
              alt={appType === 'admin' ? 'StudyMaster Admin' : 'StudyMaster'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="pr-6">
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full ${
                appType === 'admin'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30'
              }`}>
                Official PWA App
              </span>
              <span className={`text-[10px] font-bold ${appType === 'admin' ? 'text-emerald-400' : 'text-emerald-300'}`}>
                {appType === 'admin' ? 'Admin & Teacher Console' : 'Form 1–4 Student Edition'}
              </span>
            </div>
            <h2 className="text-lg font-black mt-1 leading-tight text-white">
              {appType === 'admin' ? 'Install StudyMaster Admin Portal' : 'Install StudyMaster'}
            </h2>
            <p className={`text-xs ${appType === 'admin' ? 'text-slate-400' : 'text-emerald-200/80'}`}>
              {appType === 'admin'
                ? 'Dedicated management app for curriculum and exam bulletins'
                : 'Installable on Android, iPhone, iPad, Windows & Mac'}
            </p>
          </div>
        </div>

        {/* Status / Quick Action Button */}
        <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isInstalled
                ? `${appType === 'admin' ? 'Admin Portal' : 'StudyMaster'} is installed and running in Standalone App Mode!`
                : deferredPrompt
                ? 'Ready to install directly on your device with 1 tap!'
                : 'Follow the instructions below to install on your phone or PC.'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {deferredPrompt && !isInstalled && (
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isInstalling ? 'Installing...' : '1-Tap Install Now'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => openInPublicTab(targetPath)}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 cursor-pointer"
              title="Open in external browser window to install"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Chrome</span>
            </button>
          </div>
        </div>

        {/* Public Share URL Box (Prevents 404 / Page Not Found) */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Direct Public URL:
            </span>
            <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 truncate block">
              {publicShareUrl}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="px-2.5 py-1.5 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`flex-1 min-w-[100px] py-3 text-center border-b-2 transition cursor-pointer ${
              activeTab === 'android'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Android
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`flex-1 min-w-[100px] py-3 text-center border-b-2 transition cursor-pointer ${
              activeTab === 'ios'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            iPhone / iPad
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pc')}
            className={`flex-1 min-w-[100px] py-3 text-center border-b-2 transition cursor-pointer ${
              activeTab === 'pc'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            PC / Mac
          </button>
          {appType === 'student' && (
            <button
              type="button"
              onClick={() => setActiveTab('features')}
              className={`flex-1 min-w-[100px] py-3 text-center border-b-2 transition cursor-pointer ${
                activeTab === 'features'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Offline Study
            </button>
          )}
        </div>

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* OFFLINE STUDY FEATURES TAB (STUDENT ONLY) */}
          {activeTab === 'features' && appType === 'student' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200">
                <p className="font-bold mb-1">🇲🇼 100% Offline Studying for Malawian Students:</p>
                <p className="text-[11px] leading-relaxed">
                  Once installed, StudyMaster saves all your syllabus notes, past exam questions, and study tools on your phone. You do not need airtime or bundle data to read notes or practice quizzes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    📚
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">Full Syllabus Notes</h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Forms 1, 2, 3 & 4</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    📝
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">MANEB Past Papers</h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Model answers & marking schemes</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    🔬
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">Science Tools</h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Periodic Table & Calculator</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    🎓
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">StudyMaster Assist</h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Step-by-step syllabus explanations</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. ANDROID TAB */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200">
                <p className="font-bold mb-1">📱 Android WebAPK Installation:</p>
                <p className="text-[11px] leading-relaxed">
                  Installs as a real Android application inside your phone&apos;s app drawer with zero URL bars and full offline caching.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Open in Google Chrome or Samsung Internet</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Ensure you are visiting <span className="font-mono text-emerald-600 font-bold">{currentHost}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Tap Chrome Menu (⋮ 3 Dots)</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Located in the top-right corner of your browser.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      Tap <span className="text-emerald-600 font-black">&quot;Install app&quot;</span> or &quot;Install {appType === 'admin' ? 'StudyMaster Admin' : 'StudyMaster'}&quot;
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Confirm installation. The {appType === 'admin' ? 'Admin Portal' : 'Student App'} will immediately appear as an independent app icon on your home screen!
                    </p>
                  </div>
                </div>

                {/* Helpful Note about Add Shortcut vs Install App */}
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-[11px] space-y-1.5">
                  <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <span>💡 Seeing &quot;Add shortcut&quot; instead of &quot;Install app&quot;?</span>
                  </p>
                  <p className="text-amber-800 dark:text-amber-400 leading-relaxed">
                    This happens when viewing inside the Google AI Studio preview frame or before the service worker finishes caching. To trigger the true <strong>&quot;Install app&quot;</strong> button, open the direct link in a real Chrome browser tab outside AI Studio.
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => openInPublicTab(targetPath)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] inline-flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open in Full Browser Tab</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. IOS TAB */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200">
                <p className="font-bold mb-1">🍎 iPhone & iPad (Safari):</p>
                <p className="text-[11px] leading-relaxed">
                  Apple Safari provides instant home-screen standalone installation with full offline storage and no URL bars.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Open in Safari</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Make sure you are browsing in Safari (not an embedded in-app browser).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Tap the Share Button (📤)</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      The box with the upward arrow at the bottom center of your screen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Tap &quot;Add to Home Screen&quot;</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Scroll down and tap <strong>Add to Home Screen</strong>, then tap <strong>Add</strong> at the top right.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. PC / MAC TAB */}
          {activeTab === 'pc' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                <p className="font-bold mb-1">💻 Windows, Mac & Linux Desktop:</p>
                <p className="text-[11px] leading-relaxed">
                  StudyMaster can be installed as a native desktop application via Google Chrome, Microsoft Edge, or Brave.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Look for the Install Icon in the URL Bar</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      On Chrome or Edge, an icon with a monitor and down arrow (<Download className="w-3 h-3 inline text-emerald-600" />) appears at the right side of the address bar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Click &quot;Install {appType === 'admin' ? 'StudyMaster Admin' : 'StudyMaster'}&quot;</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      A native desktop window opens with its own standalone icon on your desktop, taskbar, or dock.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold transition cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy App Link'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
