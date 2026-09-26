import React, { useState, useEffect, useRef } from 'react';
import { useBattery } from '../../context/BatteryContext';
import {
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw,
  Moon,
  Zap
} from 'lucide-react';

export const ScreenOffAudioOverlay: React.FC = () => {
  const { screenOffAudio, setScreenOffAudio, activeAudioTrack } = useBattery();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (screenOffAudio && activeAudioTrack) {
      if (audioRef.current) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [screenOffAudio, activeAudioTrack]);

  if (!screenOffAudio || !activeAudioTrack) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeekRelative = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 text-neutral-400 select-none">
      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        src={activeAudioTrack.src}
        autoPlay
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Top Bar: Minimalist Battery Notice & Exit */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-600 text-xs font-mono">
          <Moon className="w-3.5 h-3.5 text-emerald-800" />
          <span>AMOLED Audio Power-Saver (Screen 99% Dark)</span>
        </div>

        <button
          type="button"
          onClick={() => setScreenOffAudio(false)}
          className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 text-neutral-500 hover:text-white transition"
          title="Exit Screen-Off Mode"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Middle: Extremely Dim Track Info */}
      <div className="text-center space-y-3 max-w-sm mx-auto">
        <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-900 flex items-center justify-center mx-auto text-emerald-900">
          <Zap className="w-5 h-5 animate-pulse" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-700 tracking-widest block">
            {activeAudioTrack.subject || 'StudyMaster Audio Lesson'}
          </span>
          <h2 className="text-sm font-semibold text-neutral-500 line-clamp-2">
            {activeAudioTrack.title}
          </h2>
        </div>

        {/* Ultra-low contrast timeline */}
        <div className="space-y-1 pt-4">
          <div className="w-full h-1 bg-neutral-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-900 transition-all duration-300"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-neutral-700">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls: Tactile, Low-Brightness Touch Controls */}
      <div className="flex flex-col items-center gap-4 pb-4 max-w-xs mx-auto w-full">
        <div className="flex items-center justify-center gap-6 w-full">
          <button
            type="button"
            onClick={() => handleSeekRelative(-10)}
            className="p-3 rounded-full bg-neutral-950 text-neutral-600 hover:text-neutral-300 border border-neutral-900"
            title="Rewind 10 seconds"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-neutral-900 text-emerald-500 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center shadow-lg transition"
            title={isPlaying ? 'Pause Audio' : 'Play Audio'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSeekRelative(10)}
            className="p-3 rounded-full bg-neutral-950 text-neutral-600 hover:text-neutral-300 border border-neutral-900"
            title="Forward 10 seconds"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between w-full pt-2">
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-lg text-neutral-700 hover:text-neutral-400"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <span className="text-[10px] text-neutral-700 font-mono">
            Screen pixels turned OFF for max battery
          </span>

          <button
            type="button"
            onClick={() => setScreenOffAudio(false)}
            className="text-[11px] font-bold text-neutral-600 hover:text-neutral-400"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
