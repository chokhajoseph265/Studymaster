import React from 'react';
import { Volume2, VolumeX, Pause, Play, Gauge } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface TextToSpeechButtonProps {
  text: string;
  id?: string;
  label?: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'pill';
  showSpeedControl?: boolean;
  className?: string;
}

export const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({
  text,
  id,
  label = 'Read Aloud',
  size = 'md',
  variant = 'pill',
  showSpeedControl = true,
  className = ''
}) => {
  const {
    speechSupported,
    isSpeaking,
    isPaused,
    currentSpeechText,
    activeSpeechId,
    speechRate,
    setSpeechRate,
    speak,
    pauseSpeech,
    resumeSpeech,
    stopSpeech
  } = useAccessibility();

  // Determine if this instance is actively playing
  const effectiveId = id || text.slice(0, 50);
  const isCurrentTarget =
    isSpeaking &&
    (activeSpeechId
      ? activeSpeechId === effectiveId
      : Boolean(currentSpeechText && (text.includes(currentSpeechText.slice(0, 25)) || currentSpeechText.includes(text.slice(0, 25)))));

  if (!speechSupported) {
    return null;
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTarget) {
      if (isPaused) {
        resumeSpeech();
      } else {
        pauseSpeech();
      }
    } else {
      speak(text, undefined, effectiveId);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopSpeech();
  };

  // Cycle speed across standard range: 0.25 -> 0.5 -> 0.75 -> 1.0 -> 1.25 -> 1.5 -> 0.25
  const handleCycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const speeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5];
    const currentIndex = speeds.findIndex((s) => Math.abs(s - speechRate) < 0.1);
    const nextIndex = currentIndex === -1 || currentIndex >= speeds.length - 1 ? 0 : currentIndex + 1;
    setSpeechRate(speeds[nextIndex]);
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-1 gap-1',
    md: 'text-xs px-3 py-1.5 gap-1.5',
    lg: 'text-sm px-4 py-2 gap-2'
  }[size];

  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs',
    secondary: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 font-bold',
    ghost: 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800',
    pill: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 font-bold shadow-2xs'
  }[variant];

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        className={`rounded-full flex items-center transition-all ${sizeClasses} ${
          isCurrentTarget
            ? 'bg-amber-500 text-neutral-950 font-black shadow-md animate-pulse'
            : variantClasses
        }`}
        title={
          isCurrentTarget
            ? isPaused
              ? 'Resume reading'
              : 'Pause reading'
            : `Read text aloud at ${speechRate}x speed (Offline Voice Reader)`
        }
        aria-label={label}
      >
        {isCurrentTarget ? (
          isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Listening...</span>
            </>
          )
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-current" />
            <span>{label}</span>
          </>
        )}
      </button>

      {/* Speed Rate Pill (0.25x to 1.5x) */}
      {showSpeedControl && (
        <button
          type="button"
          onClick={handleCycleSpeed}
          className="px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px] font-bold text-neutral-700 dark:text-neutral-300 hover:bg-emerald-50 hover:text-emerald-700 transition"
          title={`Current speech speed: ${speechRate}x. Tap to cycle between 0.25x and 1.5x.`}
        >
          {speechRate}x
        </button>
      )}

      {isCurrentTarget && (
        <button
          type="button"
          onClick={handleStop}
          className="p-1 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          title="Stop reading"
          aria-label="Stop reading"
        >
          <VolumeX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

