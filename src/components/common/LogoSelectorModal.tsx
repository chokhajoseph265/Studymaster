import React, { useState } from 'react';
import { Check, X, Image as ImageIcon } from 'lucide-react';
import { LOGO_OPTIONS, getActiveLogoSrc, setActiveLogoId } from '../../data/logos';

interface LogoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoSelectorModal: React.FC<LogoSelectorModalProps> = ({ isOpen, onClose }) => {
  const [selectedSrc, setSelectedSrc] = useState<string>(getActiveLogoSrc());

  if (!isOpen) return null;

  const handleSelect = (id: string, src: string) => {
    setActiveLogoId(id);
    setSelectedSrc(src);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Choose App Logo & Emblem</h2>
              <p className="text-xs text-slate-500">Tap your favorite design to instantly set it across the app</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {LOGO_OPTIONS.map((logo) => {
            const isCurrent = selectedSrc === logo.imageSrc;
            return (
              <button
                key={logo.id}
                type="button"
                onClick={() => handleSelect(logo.id, logo.imageSrc)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-4 ${
                  isCurrent
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-xs border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={logo.imageSrc}
                    alt={logo.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {logo.name}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {logo.tagline}
                  </p>
                </div>
                <div className="shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                      isCurrent
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isCurrent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
