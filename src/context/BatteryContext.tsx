import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type ThemeMode = 'light' | 'dark' | 'amoled';

interface BatteryContextType {
  ecoMode: boolean;
  setEcoMode: (enabled: boolean) => void;
  toggleEcoMode: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  highContrastAmber: boolean;
  setHighContrastAmber: (enabled: boolean) => void;
  inactivityGuard: boolean;
  setInactivityGuard: (enabled: boolean) => void;
  isIdleDimmed: boolean;
  wakeFromIdle: () => void;
  screenOffAudio: boolean;
  setScreenOffAudio: (active: boolean) => void;
  activeAudioTrack: { title: string; src: string; subject?: string } | null;
  setActiveAudioTrack: (track: { title: string; src: string; subject?: string } | null) => void;
  batteryLevel: number | null; // 0 to 100
  isCharging: boolean | null;
  openBatteryModal: boolean;
  setOpenBatteryModal: (open: boolean) => void;
  estimatedExtraHours: number;
}

const BatteryContext = createContext<BatteryContextType | undefined>(undefined);

export const BatteryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Extreme Eco Mode State
  const [ecoMode, setEcoModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('studymaster_eco_mode') === 'true';
    } catch {
      return false;
    }
  });

  // 2. Theme Mode (Light / Dark / True AMOLED Pure Black)
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('studymaster_theme_mode') as ThemeMode;
      return saved === 'amoled' || saved === 'dark' ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  // 3. High Contrast Low-Glare Amber for night AMOLED reading
  const [highContrastAmber, setHighContrastAmberState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('studymaster_amber_mode') === 'true';
    } catch {
      return false;
    }
  });

  // 4. Inactivity Guard (Auto-dim screen after 2 minutes of idle time)
  const [inactivityGuard, setInactivityGuardState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('studymaster_inactivity_guard');
      return saved !== null ? saved === 'true' : true; // default enabled
    } catch {
      return true;
    }
  });

  const [isIdleDimmed, setIsIdleDimmed] = useState<boolean>(false);
  const [screenOffAudio, setScreenOffAudio] = useState<boolean>(false);
  const [activeAudioTrack, setActiveAudioTrack] = useState<{ title: string; src: string; subject?: string } | null>(null);
  const [openBatteryModal, setOpenBatteryModal] = useState<boolean>(false);

  // 5. Battery API State
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Setters with persistence
  const setEcoMode = (enabled: boolean) => {
    setEcoModeState(enabled);
    localStorage.setItem('studymaster_eco_mode', String(enabled));
    if (enabled && themeMode === 'light') {
      // Automatically switch to AMOLED for maximum power saving
      setThemeMode('amoled');
    }
  };

  const toggleEcoMode = () => {
    setEcoMode(!ecoMode);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('studymaster_theme_mode', mode);
  };

  const setHighContrastAmber = (enabled: boolean) => {
    setHighContrastAmberState(enabled);
    localStorage.setItem('studymaster_amber_mode', String(enabled));
  };

  const setInactivityGuard = (enabled: boolean) => {
    setInactivityGuardState(enabled);
    localStorage.setItem('studymaster_inactivity_guard', String(enabled));
    if (!enabled) {
      setIsIdleDimmed(false);
    }
  };

  // Sync DOM classes
  useEffect(() => {
    const root = document.documentElement;
    
    // Eco Mode Class
    if (ecoMode) {
      root.classList.add('eco-mode-active');
    } else {
      root.classList.remove('eco-mode-active');
    }

    // Theme Mode Classes
    root.classList.remove('dark', 'amoled-theme', 'amber-night-mode');
    if (themeMode === 'amoled') {
      root.classList.add('dark', 'amoled-theme');
      if (highContrastAmber) {
        root.classList.add('amber-night-mode');
      }
    } else if (themeMode === 'dark') {
      root.classList.add('dark');
    }
  }, [ecoMode, themeMode, highContrastAmber]);

  // Battery API Listener (Chrome / Android WebView)
  useEffect(() => {
    let batteryObj: any = null;

    const updateBatteryInfo = (battery: any) => {
      const level = Math.round(battery.level * 100);
      setBatteryLevel(level);
      setIsCharging(battery.charging);

      // Auto-suggest Eco Mode on low battery (< 20%)
      if (level <= 20 && !battery.charging && !ecoMode) {
        const warned = sessionStorage.getItem('low_battery_notified');
        if (!warned) {
          sessionStorage.setItem('low_battery_notified', 'true');
          setOpenBatteryModal(true);
        }
      }
    };

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        batteryObj = battery;
        updateBatteryInfo(battery);

        battery.addEventListener('levelchange', () => updateBatteryInfo(battery));
        battery.addEventListener('chargingchange', () => updateBatteryInfo(battery));
      }).catch(() => {
        // Fallback for browsers that block battery API
        setBatteryLevel(null);
      });
    }

    return () => {
      if (batteryObj) {
        try {
          batteryObj.removeEventListener('levelchange', () => {});
          batteryObj.removeEventListener('chargingchange', () => {});
        } catch {
          // ignore cleanup
        }
      }
    };
  }, [ecoMode]);

  // Inactivity Watcher (2 minutes idle)
  const resetIdleTimer = useCallback(() => {
    if (isIdleDimmed) {
      setIsIdleDimmed(false);
    }

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    if (inactivityGuard && !screenOffAudio) {
      // 2 minutes = 120,000 ms
      idleTimerRef.current = setTimeout(() => {
        setIsIdleDimmed(true);
      }, 120000);
    }
  }, [inactivityGuard, isIdleDimmed, screenOffAudio]);

  const wakeFromIdle = () => {
    setIsIdleDimmed(false);
    resetIdleTimer();
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    
    events.forEach((evt) => {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach((evt) => {
        window.removeEventListener(evt, resetIdleTimer);
      });
    };
  }, [resetIdleTimer]);

  // Calculate estimated extra study hours gained
  const estimatedExtraHours = (themeMode === 'amoled' ? 2.5 : 0) + (ecoMode ? 1.5 : 0) + (inactivityGuard ? 1.0 : 0);

  return (
    <BatteryContext.Provider
      value={{
        ecoMode,
        setEcoMode,
        toggleEcoMode,
        themeMode,
        setThemeMode,
        highContrastAmber,
        setHighContrastAmber,
        inactivityGuard,
        setInactivityGuard,
        isIdleDimmed,
        wakeFromIdle,
        screenOffAudio,
        setScreenOffAudio,
        activeAudioTrack,
        setActiveAudioTrack,
        batteryLevel,
        isCharging,
        openBatteryModal,
        setOpenBatteryModal,
        estimatedExtraHours
      }}
    >
      {children}
    </BatteryContext.Provider>
  );
};

export const useBattery = () => {
  const context = useContext(BatteryContext);
  if (!context) {
    throw new Error('useBattery must be used within a BatteryProvider');
  }
  return context;
};
