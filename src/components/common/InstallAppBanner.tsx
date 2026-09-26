import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import { getActiveLogoSrc } from '../../data/logos';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallAppBannerProps {
  onOpenModal: () => void;
}

export const InstallAppBanner: React.FC<InstallAppBannerProps> = ({ onOpenModal }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined') {
      return ((window as unknown as { __studymaster_deferred_prompt?: BeforeInstallPromptEvent }).__studymaster_deferred_prompt) || null;
    }
    return null;
  });
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return typeof window !== 'undefined'
      ? sessionStorage.getItem('studymaster_install_dismissed') === 'true'
      : false;
  });
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    // Check if already running in standalone PWA app mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsStandalone(true);
      return;
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

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('studymaster-prompt-captured', checkGlobalPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('studymaster-prompt-captured', checkGlobalPrompt);
    };
  }, []);

  if (isStandalone || isDismissed) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsDismissed(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        onOpenModal();
      }
    } else {
      onOpenModal();
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('studymaster_install_dismissed', 'true');
  };

  const logoSrc = getActiveLogoSrc();

  return (
    <div className="bg-emerald-950 text-white px-3 sm:px-4 py-2 border-b border-emerald-800 shadow-xs relative z-30 animate-in fade-in slide-in-from-top-2">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white p-0.5 shadow-sm shrink-0 flex items-center justify-center">
            <img
              src={logoSrc}
              alt="StudyMaster Icon"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase bg-emerald-500/40 text-emerald-200 px-1.5 py-0.2 rounded">
                Installable App
              </span>
              <p className="text-xs font-bold text-white truncate">Install StudyMaster on your Phone</p>
            </div>
            <p className="text-[10px] text-emerald-200/80 truncate hidden xs:block">
              Full screen • No Chrome address bar • 100% Offline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Install App</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
