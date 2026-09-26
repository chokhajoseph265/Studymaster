import React from 'react';
import { useBattery } from '../../context/BatteryContext';
import { Moon, Zap, Hand } from 'lucide-react';

export const InactivityDimmerOverlay: React.FC = () => {
  const { isIdleDimmed, wakeFromIdle, themeMode } = useBattery();

  if (!isIdleDimmed) return null;

  return (
    <div
      onClick={wakeFromIdle}
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-opacity duration-300 select-none"
      title="Tap anywhere to resume your study session"
    >
      <div className="max-w-xs space-y-4 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-emerald-400">
          <Moon className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-black text-neutral-200 flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-500 fill-current" />
            <span>Battery Guard Active</span>
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Screen dimmed to prevent battery drain while idle on your study desk.
          </p>
        </div>

        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-emerald-300">
            <Hand className="w-3.5 h-3.5" />
            <span>Tap anywhere to wake screen</span>
          </div>
        </div>
      </div>
    </div>
  );
};
