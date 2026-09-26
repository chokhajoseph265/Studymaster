import React, { useState, useEffect } from 'react';
import { useAccessibility, RulerColor } from '../../context/AccessibilityContext';
import { X } from 'lucide-react';

const COLOR_CONFIGS: Record<
  RulerColor,
  {
    border: string;
    bg: string;
    guideLine: string;
  }
> = {
  clear: {
    border: 'border-emerald-500/90 dark:border-emerald-400/90',
    bg: 'bg-transparent',
    guideLine: 'border-emerald-500/30 dark:border-emerald-400/25'
  },
  amber: {
    border: 'border-amber-400 dark:border-amber-500',
    bg: 'bg-amber-300/15 dark:bg-amber-400/10',
    guideLine: 'border-amber-400/30 dark:border-amber-400/20'
  },
  emerald: {
    border: 'border-emerald-400 dark:border-emerald-500',
    bg: 'bg-emerald-300/15 dark:bg-emerald-400/10',
    guideLine: 'border-emerald-400/30 dark:border-emerald-400/20'
  },
  sky: {
    border: 'border-sky-400 dark:border-sky-500',
    bg: 'bg-sky-300/15 dark:bg-sky-400/10',
    guideLine: 'border-sky-400/30 dark:border-sky-400/20'
  },
  purple: {
    border: 'border-purple-400 dark:border-purple-500',
    bg: 'bg-purple-300/15 dark:bg-purple-400/10',
    guideLine: 'border-purple-400/30 dark:border-purple-400/20'
  },
  neutral: {
    border: 'border-slate-400 dark:border-slate-500',
    bg: 'bg-transparent',
    guideLine: 'border-slate-400/20 dark:border-slate-400/15'
  }
};

export const ReadingRuler: React.FC = () => {
  const {
    readingRuler,
    setReadingRuler,
    rulerColor,
    rulerShade,
    rulerHeight
  } = useAccessibility();

  // Viewport height for maintaining stationary reading position
  const [viewportHeight, setViewportHeight] = useState<number>(() => {
    if (typeof window !== 'undefined') return window.innerHeight;
    return 800;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Quick keyboard escape to dismiss
  useEffect(() => {
    if (!readingRuler) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setReadingRuler(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readingRuler, setReadingRuler]);

  if (!readingRuler) return null;

  // Stationary position: perfectly anchored at ergonomic reading line (38% from top of screen)
  const rulerY = Math.round(viewportHeight * 0.38);
  const currentTheme = COLOR_CONFIGS[rulerColor] || COLOR_CONFIGS.clear;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
      {/* 
        SURROUNDING NOTES SHADING:
        - Dims text above and below the stationary reading guide so the student's eyes
          stay focused on the active reading line while scrolling.
      */}
      {rulerShade !== 'none' && (
        <>
          {/* Top shading above ruler */}
          <div
            className={`absolute top-0 left-0 right-0 pointer-events-none transition-colors duration-150 ${
              rulerShade === 'subtle'
                ? 'bg-slate-950/30 dark:bg-black/55 backdrop-blur-[0.5px]'
                : 'bg-slate-950/50 dark:bg-black/75 backdrop-blur-[1px]'
            }`}
            style={{ height: `${Math.max(0, rulerY - rulerHeight / 2)}px` }}
          />

          {/* Bottom shading below ruler */}
          <div
            className={`absolute bottom-0 left-0 right-0 pointer-events-none transition-colors duration-150 ${
              rulerShade === 'subtle'
                ? 'bg-slate-950/30 dark:bg-black/55 backdrop-blur-[0.5px]'
                : 'bg-slate-950/50 dark:bg-black/75 backdrop-blur-[1px]'
            }`}
            style={{
              top: `${Math.max(0, rulerY + rulerHeight / 2)}px`
            }}
          />
        </>
      )}

      {/* 
        STATIONARY LINE READING GUIDE BAR:
        - Stationary frame at 38% viewport height
        - Clear default highlighter tint framing the active text
        - Upper & lower boundary borders with dashed guide line
        - Single minimalist dismiss button on the right edge
      */}
      <div
        className={`absolute left-0 right-0 border-y-2 ${currentTheme.border} ${currentTheme.bg} transition-colors duration-150 pointer-events-none flex items-center justify-end px-3 sm:px-6 shadow-sm`}
        style={{
          top: `${Math.max(0, rulerY - rulerHeight / 2)}px`,
          height: `${rulerHeight}px`
        }}
      >
        {/* Center reading guideline */}
        <div
          className={`absolute left-0 right-0 border-t border-dashed ${currentTheme.guideLine} pointer-events-none`}
          style={{ top: '50%' }}
        />

        {/* Minimalist Close Button on far right */}
        <div className="pointer-events-auto z-20">
          <button
            type="button"
            onClick={() => setReadingRuler(false)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-900/90 dark:bg-neutral-950/90 text-neutral-300 hover:text-white hover:bg-rose-600 border border-neutral-700/80 shadow-md backdrop-blur-xs transition-all cursor-pointer active:scale-90"
            title="Close Line Reading Guide (Esc)"
            aria-label="Close Line Reading Guide"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
