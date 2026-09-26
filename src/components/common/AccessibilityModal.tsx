import React from 'react';
import {
  Eye,
  Volume2,
  Hand,
  RotateCcw,
  VolumeX,
  Type,
  X
} from 'lucide-react';
import { useAccessibility, TextScale, RulerColor, RulerShade } from '../../context/AccessibilityContext';
import { AccessibilitySymbol } from './AccessibilitySymbol';

export const AccessibilityModal: React.FC = () => {
  const {
    openAccessibilityModal,
    setOpenAccessibilityModal,
    textScale,
    setTextScale,
    dyslexiaFont,
    setDyslexiaFont,
    highContrastMode,
    setHighContrastMode,
    largeTouchTargets,
    setLargeTouchTargets,
    readingRuler,
    setReadingRuler,
    rulerColor,
    setRulerColor,
    rulerShade,
    setRulerShade,
    speechRate,
    setSpeechRate,
    stopSpeech,
    isSpeaking,
    resetAllSettings
  } = useAccessibility();

  // Keyboard escape key listener for accessible modal closing
  React.useEffect(() => {
    if (!openAccessibilityModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopSpeech();
        setOpenAccessibilityModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openAccessibilityModal, setOpenAccessibilityModal, stopSpeech]);

  if (!openAccessibilityModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-labelledby="accessibility-modal-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-emerald-700 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold shrink-0 shadow-xs">
              <AccessibilitySymbol className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 id="accessibility-modal-title" className="font-extrabold text-base leading-tight">
                Inclusive Learning Hub
              </h2>
              <p className="text-xs text-emerald-100/90 font-medium">
                Assistive tools for visual, hearing, dyslexia, and customized learning
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopSpeech();
              setOpenAccessibilityModal(false);
            }}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close Inclusive Learning Hub"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Single Screen Unified Features List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 text-sm divide-y divide-neutral-200/80 dark:divide-neutral-800">
          {/* SECTION 1: VISION & TYPOGRAPHY */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <Type className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Vision & Typography</span>
            </div>

            {/* Font Size Scaling */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">
                    Text Size Scaling
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {textScale === 'normal' ? 'Standard (100%)' : textScale === 'large' ? 'Large (125%)' : 'Extra Large (150%)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-0.5">
                {(['normal', 'large', 'extra-large'] as TextScale[]).map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => setTextScale(scale)}
                    className={`p-2 rounded-xl border text-center transition-all font-bold text-xs cursor-pointer ${
                      textScale === scale
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-emerald-400'
                    }`}
                  >
                    {scale === 'normal' && 'Aa Standard'}
                    {scale === 'large' && 'Aa Large'}
                    {scale === 'extra-large' && 'Aa XL'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dyslexia-Friendly Font */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-neutral-900 dark:text-neutral-100">
                  Dyslexia-Friendly Typography
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Distinct character weights and generous letter spacing for effortless reading.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDyslexiaFont(!dyslexiaFont)}
                className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 cursor-pointer ${
                  dyslexiaFont ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
                role="switch"
                aria-checked={dyslexiaFont}
                aria-label="Toggle Dyslexia-Friendly Typography"
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    dyslexiaFont ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* High Contrast Black & Yellow Mode */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-neutral-900 dark:text-neutral-100">
                  High-Contrast (Yellow on Black)
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  High luminance contrast for low-vision readers and bright sunlight environments.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHighContrastMode(!highContrastMode)}
                className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 cursor-pointer ${
                  highContrastMode ? 'bg-amber-500' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
                role="switch"
                aria-checked={highContrastMode}
                aria-label="Toggle High-Contrast Yellow on Black"
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full transition-transform duration-200 ease-in-out ${
                    highContrastMode ? 'translate-x-5.5 bg-neutral-950' : 'translate-x-0 bg-white'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* SECTION 2: LINE READING GUIDE */}
          <div className="pt-4 space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Line Reading Guide</span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">
                    Stationary Line Reading Guide
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Frames the active reading line while notes scroll naturally beneath it.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReadingRuler(!readingRuler)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 cursor-pointer ${
                    readingRuler ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                  role="switch"
                  aria-checked={readingRuler}
                  aria-label="Toggle Stationary Line Reading Guide"
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                      readingRuler ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {readingRuler && (
                <div className="pt-2.5 border-t border-neutral-200 dark:border-neutral-700/80 space-y-3">
                  {/* Tint Color */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      Highlighter Tint Colour
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {(
                        [
                          { id: 'clear', label: 'Clear', color: 'border-2 border-dashed border-emerald-500 bg-transparent' },
                          { id: 'amber', label: 'Amber', color: 'bg-amber-400' },
                          { id: 'emerald', label: 'Mint', color: 'bg-emerald-400' },
                          { id: 'sky', label: 'Sky', color: 'bg-sky-400' },
                          { id: 'purple', label: 'Lavender', color: 'bg-purple-400' }
                        ] as { id: RulerColor; label: string; color: string }[]
                      ).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setRulerColor(c.id)}
                          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border text-[11px] font-bold transition cursor-pointer ${
                            rulerColor === c.id
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                              : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${c.color} border border-black/10`} />
                          <span>{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Surrounding Notes Shading */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-neutral-700 dark:text-neutral-300 block">
                        Surrounding Notes Shading
                      </span>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        Dims surrounding text to concentrate eyes on the active line.
                      </p>
                    </div>
                    <div className="flex items-center bg-white dark:bg-neutral-900 rounded-xl p-1 border border-neutral-200 dark:border-neutral-700 shrink-0">
                      {(
                        [
                          { id: 'subtle', label: 'Shaded' },
                          { id: 'medium', label: 'Deep Focus' },
                          { id: 'none', label: 'Off' }
                        ] as { id: RulerShade; label: string }[]
                      ).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setRulerShade(s.id)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            rulerShade === s.id
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: VOICE & AUDIO (TEXT-TO-SPEECH) */}
          <div className="pt-4 space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Voice & Audio Reader</span>
            </div>

            {isSpeaking && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 text-xs font-semibold">
                  <Volume2 className="w-4 h-4 text-rose-600 animate-pulse shrink-0" />
                  <span>Voice Reader is currently active</span>
                </div>
                <button
                  type="button"
                  onClick={stopSpeech}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition shrink-0 cursor-pointer"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Voice</span>
                </button>
              </div>
            )}

            {/* Speech Speed Control */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                    Speech Rate (0.25x – 1.5x)
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {speechRate <= 0.25
                      ? '0.25x • Very Slow (Pronunciation & Phonics)'
                      : speechRate <= 0.5
                      ? '0.5x • Slow & Clear (Comprehension)'
                      : speechRate <= 0.75
                      ? '0.75x • Relaxed Pace'
                      : speechRate === 1.0
                      ? '1.0x • Natural Standard Pace'
                      : speechRate <= 1.25
                      ? '1.25x • Brisk Study Pace'
                      : '1.5x • Fast Revision Pace'}
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800 shrink-0">
                  {speechRate.toFixed(2)}x
                </span>
              </div>

              {/* Interactive Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0.25"
                  max="1.5"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  aria-label="Speech rate slider"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 font-bold px-0.5">
                  <span>0.25x (Slow)</span>
                  <span>1.0x (Standard)</span>
                  <span>1.5x (Fast)</span>
                </div>
              </div>

              {/* Preset Speed Pills */}
              <div className="grid grid-cols-6 gap-1.5 pt-0.5">
                {[0.25, 0.5, 0.75, 1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setSpeechRate(rate)}
                    className={`py-1 rounded-xl border text-center transition-all font-bold text-xs cursor-pointer ${
                      Math.abs(speechRate - rate) < 0.01
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-emerald-400'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4: MOTOR & TOUCH */}
          <div className="pt-4 space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <Hand className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Motor & Touch</span>
            </div>

            {/* Large Touch Targets */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-neutral-900 dark:text-neutral-100">
                  Large Touch Targets (48px+)
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Expands tap areas for buttons, quiz options, and navigation for easier physical selection.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLargeTouchTargets(!largeTouchTargets)}
                className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 cursor-pointer ${
                  largeTouchTargets ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
                role="switch"
                aria-checked={largeTouchTargets}
                aria-label="Toggle Large Touch Targets"
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    largeTouchTargets ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 shrink-0">
          <button
            type="button"
            onClick={resetAllSettings}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopSpeech();
              setOpenAccessibilityModal(false);
            }}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
