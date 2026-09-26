import React, { useState } from 'react';
import { Download, CheckCircle2, Smartphone, Apple, ShieldCheck, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'primary' | 'outline' | 'compact' | 'pill';
  onOpenFullGuide?: () => void;
  appName?: 'Student App' | 'Admin Portal' | 'StudyMaster';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'primary',
  onOpenFullGuide,
  appName = 'StudyMaster'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed and running standalone, hide or render minimal badge
  if (isInstalled) {
    if (variant === 'pill') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Installed</span>
        </span>
      );
    }
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
      return;
    }

    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (onOpenFullGuide) {
      onOpenFullGuide();
    } else {
      // Fallback for browsers that require standard menu install
      setShowIOSGuide(true);
    }
  };

  const buttonContent = (
    <>
      <Download className={`w-3.5 h-3.5 ${isInstalling ? 'animate-bounce' : ''}`} />
      <span>Install {appName}</span>
    </>
  );

  return (
    <>
      {variant === 'pill' ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={isInstalling}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer active:scale-95 ${className}`}
          title={`Install ${appName} to your home screen / desktop for instant offline study`}
        >
          {buttonContent}
        </button>
      ) : variant === 'outline' ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={isInstalling}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-600/40 hover:border-emerald-600 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-bold transition-all cursor-pointer active:scale-95 ${className}`}
        >
          {buttonContent}
        </button>
      ) : variant === 'compact' ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={isInstalling}
          className={`p-2 rounded-xl text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${className}`}
          title={`Install ${appName}`}
          aria-label={`Install ${appName}`}
        >
          <Download className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={isInstalling}
          className={`flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:shadow transition-all cursor-pointer active:scale-95 ${className}`}
        >
          {buttonContent}
        </button>
      )}

      {/* iOS / General Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Install {appName}
                </h3>
                <p className="text-xs text-slate-500">Free, fast & works 100% offline</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Apple className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>On iPhone / iPad (Safari):</span>
              </p>
              <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
                <li>Tap the <strong>Share</strong> button (box with upward arrow) at the bottom of Safari.</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong> in the top-right corner.</li>
              </ol>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>On Android / Chrome / Desktop:</span>
                </p>
                <p className="mt-1 leading-relaxed">
                  Tap your browser menu (<strong>⋮</strong> three dots) and select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-xl bg-slate-100 dark:bg-slate-800 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
