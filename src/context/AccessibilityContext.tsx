import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type TextScale = 'normal' | 'large' | 'extra-large';
export type RulerColor = 'clear' | 'amber' | 'emerald' | 'sky' | 'purple' | 'neutral';
export type RulerShade = 'none' | 'subtle' | 'medium';

interface AccessibilityContextType {
  // Visual adjustments
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (enabled: boolean) => void;
  highContrastMode: boolean;
  setHighContrastMode: (enabled: boolean) => void;
  largeTouchTargets: boolean;
  setLargeTouchTargets: (enabled: boolean) => void;

  // Cognitive & Focus
  readingRuler: boolean;
  setReadingRuler: (enabled: boolean) => void;
  rulerColor: RulerColor;
  setRulerColor: (color: RulerColor) => void;
  rulerFollowCursor: boolean;
  setRulerFollowCursor: (follow: boolean) => void;
  rulerShade: RulerShade;
  setRulerShade: (shade: RulerShade) => void;
  rulerHeight: number;
  setRulerHeight: (height: number) => void;

  // Text-To-Speech (Offline Browser Web Speech API)
  isSpeaking: boolean;
  isPaused: boolean;
  speechSupported: boolean;
  currentSpeechText: string | null;
  activeSpeechId: string | null;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  speak: (text: string, onEnd?: () => void, id?: string) => void;
  pauseSpeech: () => void;
  resumeSpeech: () => void;
  stopSpeech: () => void;

  // Modal controller
  openAccessibilityModal: boolean;
  setOpenAccessibilityModal: (open: boolean) => void;
  resetAllSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Text Scale
  const [textScale, setTextScaleState] = useState<TextScale>(() => {
    try {
      const saved = localStorage.getItem('studymaster_text_scale');
      return (saved as TextScale) || 'normal';
    } catch {
      return 'normal';
    }
  });

  // 2. Dyslexia-Friendly Font
  const [dyslexiaFont, setDyslexiaFontState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('studymaster_dyslexia_font') === 'true';
    } catch {
      return false;
    }
  });

  // 3. High Contrast (Luminous Yellow-on-Black for Low Vision)
  const [highContrastMode, setHighContrastModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('studymaster_high_contrast') === 'true';
    } catch {
      return false;
    }
  });

  // 4. Large Touch Targets
  const [largeTouchTargets, setLargeTouchTargetsState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('studymaster_large_touch') === 'true';
    } catch {
      return false;
    }
  });

  // 5. Line Reading Guide / Ruler
  const [readingRuler, setReadingRulerState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('studymaster_reading_ruler') === 'true';
    } catch {
      return false;
    }
  });

  const [rulerColor, setRulerColorState] = useState<RulerColor>(() => {
    try {
      const saved = localStorage.getItem('studymaster_ruler_color');
      return (saved as RulerColor) || 'clear';
    } catch {
      return 'clear';
    }
  });

  const [rulerFollowCursor, setRulerFollowCursorState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('studymaster_ruler_follow');
      return saved !== null ? saved === 'true' : false; // Stationary by default
    } catch {
      return false;
    }
  });

  const [rulerShade, setRulerShadeState] = useState<RulerShade>(() => {
    try {
      const saved = localStorage.getItem('studymaster_ruler_shade');
      return (saved as RulerShade) || 'subtle'; // Surrounding notes shading by default
    } catch {
      return 'subtle';
    }
  });

  const [rulerHeight, setRulerHeightState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('studymaster_ruler_height');
      return saved ? parseInt(saved, 10) : 42;
    } catch {
      return 42;
    }
  });

  // 8. Text-to-Speech Engine
  const [speechSupported, setSpeechSupported] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  });
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentSpeechText, setCurrentSpeechText] = useState<string | null>(null);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [speechRate, setSpeechRateState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('studymaster_speech_rate');
      return saved ? parseFloat(saved) : 1.0;
    } catch {
      return 1.0;
    }
  });

  const [openAccessibilityModal, setOpenAccessibilityModal] = useState<boolean>(false);
  const onSpeechEndCallbackRef = useRef<(() => void) | undefined>(undefined);
  const keepAliveIntervalRef = useRef<any>(null);

  // Check speech synthesis support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSupported('speechSynthesis' in window);
      // Pre-warm voices list
      if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        const handleVoicesChanged = () => {
          window.speechSynthesis.getVoices();
        };
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        return () => {
          window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
      }
    }
  }, []);

  // Cancel any ongoing speech on tab unload / close
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleUnload = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  // Clear keep-alive timer helper
  const clearKeepAlive = () => {
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
  };

  // Persistence handlers
  const setTextScale = (scale: TextScale) => {
    setTextScaleState(scale);
    localStorage.setItem('studymaster_text_scale', scale);
  };

  const setDyslexiaFont = (enabled: boolean) => {
    setDyslexiaFontState(enabled);
    localStorage.setItem('studymaster_dyslexia_font', String(enabled));
  };

  const setHighContrastMode = (enabled: boolean) => {
    setHighContrastModeState(enabled);
    localStorage.setItem('studymaster_high_contrast', String(enabled));
  };

  const setLargeTouchTargets = (enabled: boolean) => {
    setLargeTouchTargetsState(enabled);
    localStorage.setItem('studymaster_large_touch', String(enabled));
  };

  const setReadingRuler = (enabled: boolean) => {
    setReadingRulerState(enabled);
    localStorage.setItem('studymaster_reading_ruler', String(enabled));
  };

  const setRulerColor = (color: RulerColor) => {
    setRulerColorState(color);
    localStorage.setItem('studymaster_ruler_color', color);
  };

  const setRulerFollowCursor = (follow: boolean) => {
    setRulerFollowCursorState(follow);
    localStorage.setItem('studymaster_ruler_follow', String(follow));
  };

  const setRulerShade = (shade: RulerShade) => {
    setRulerShadeState(shade);
    localStorage.setItem('studymaster_ruler_shade', shade);
  };

  const setRulerHeight = (height: number) => {
    const clamped = Math.max(24, Math.min(160, height));
    setRulerHeightState(clamped);
    localStorage.setItem('studymaster_ruler_height', String(clamped));
  };

  const setSpeechRate = (rate: number) => {
    setSpeechRateState(rate);
    localStorage.setItem('studymaster_speech_rate', String(rate));
  };

  const resetAllSettings = () => {
    setTextScale('normal');
    setDyslexiaFont(false);
    setHighContrastMode(false);
    setLargeTouchTargets(false);
    setReadingRuler(false);
    setRulerColor('clear');
    setRulerFollowCursor(false);
    setRulerShade('subtle');
    setRulerHeight(42);
    setSpeechRate(1.0);
    stopSpeech();
  };

  // Text to speech implementation via Web Speech API (runs 100% offline)
  const stopSpeech = useCallback(() => {
    clearKeepAlive();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSpeechText(null);
    setActiveSpeechId(null);
    if (onSpeechEndCallbackRef.current) {
      onSpeechEndCallbackRef.current();
      onSpeechEndCallbackRef.current = undefined;
    }
  }, []);

  const pauseSpeech = useCallback(() => {
    clearKeepAlive();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSpeaking]);

  const resumeSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      // Resume keep-alive
      clearKeepAlive();
      keepAliveIntervalRef.current = setInterval(() => {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
    }
  }, [isPaused]);

  const speak = useCallback(
    (text: string, onEnd?: () => void, id?: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      // Stop any existing utterance & clear timer
      clearKeepAlive();
      window.speechSynthesis.cancel();

      // Clean markdown, LaTeX, formulas, and code syntax for natural human-sounding reading
      const cleanText = text
        .replace(/\\begin\{[^}]+\}/g, '')
        .replace(/\\end\{[^}]+\}/g, '')
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2')
        .replace(/\\sqrt\{([^}]+)\}/g, 'square root of $1')
        .replace(/\\times/g, ' multiplied by ')
        .replace(/\\div/g, ' divided by ')
        .replace(/\\pm/g, ' plus or minus ')
        .replace(/\\le/g, ' less than or equal to ')
        .replace(/\\ge/g, ' greater than or equal to ')
        .replace(/\\ne/g, ' not equal to ')
        .replace(/\\approx/g, ' approximately ')
        .replace(/\\cdot/g, ' times ')
        .replace(/\$\$/g, ' ')
        .replace(/\$/g, ' ')
        .replace(/#+\s+/g, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\\text\{([^}]+)\}/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = speechRate;
      utterance.pitch = 1.0;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredVoice =
          voices.find((v) => v.lang === 'en-GB') ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];
        if (preferredVoice) {
          utterance.voice = preferredVoice;
          utterance.lang = preferredVoice.lang;
        } else {
          utterance.lang = 'en-GB';
        }
      } else {
        utterance.lang = 'en-GB';
      }

      onSpeechEndCallbackRef.current = onEnd;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setCurrentSpeechText(cleanText);
        setActiveSpeechId(id || null);

        // Chrome keep-alive pulse (prevents browser from cutting off speech at ~15s)
        clearKeepAlive();
        keepAliveIntervalRef.current = setInterval(() => {
          if ('speechSynthesis' in window && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 10000);
      };

      utterance.onend = () => {
        clearKeepAlive();
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentSpeechText(null);
        setActiveSpeechId(null);
        if (onSpeechEndCallbackRef.current) {
          onSpeechEndCallbackRef.current();
          onSpeechEndCallbackRef.current = undefined;
        }
      };

      utterance.onerror = () => {
        clearKeepAlive();
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentSpeechText(null);
        setActiveSpeechId(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [speechRate]
  );

  // Sync DOM classes for styling
  useEffect(() => {
    const root = document.documentElement;

    // Text Scale classes
    root.classList.remove('access-text-large', 'access-text-xl');
    if (textScale === 'large') {
      root.classList.add('access-text-large');
    } else if (textScale === 'extra-large') {
      root.classList.add('access-text-xl');
    }

    // Dyslexia Font
    if (dyslexiaFont) {
      root.classList.add('access-dyslexia');
    } else {
      root.classList.remove('access-dyslexia');
    }

    // High Contrast Mode
    if (highContrastMode) {
      root.classList.add('access-high-contrast');
    } else {
      root.classList.remove('access-high-contrast');
    }

    // Large Touch Targets
    if (largeTouchTargets) {
      root.classList.add('access-large-targets');
    } else {
      root.classList.remove('access-large-targets');
    }
  }, [textScale, dyslexiaFont, highContrastMode, largeTouchTargets]);

  return (
    <AccessibilityContext.Provider
      value={{
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
        rulerFollowCursor,
        setRulerFollowCursor,
        rulerShade,
        setRulerShade,
        rulerHeight,
        setRulerHeight,
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
        stopSpeech,
        openAccessibilityModal,
        setOpenAccessibilityModal,
        resetAllSettings
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
