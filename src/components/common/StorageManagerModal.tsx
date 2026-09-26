import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  Trash2,
  CheckCircle2,
  RefreshCw,
  X,
  FileText,
  Volume2,
  FileSpreadsheet,
  Zap,
  Download,
  AlertTriangle
} from 'lucide-react';
import { offlineStorage } from '../../services/offlineStorage';

interface StorageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorageManagerModal: React.FC<StorageManagerModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<{
    totalBytes: number;
    notesBytes: number;
    audioBytes: number;
    papersBytes: number;
    quizBytes: number;
    downloadCount: number;
    estimatedDeviceLimitMb: number;
  }>({
    totalBytes: 0,
    notesBytes: 0,
    audioBytes: 0,
    papersBytes: 0,
    quizBytes: 0,
    downloadCount: 0,
    estimatedDeviceLimitMb: 50
  });

  const [notification, setNotification] = useState<string | null>(null);

  const calculateStorage = async () => {
    setLoading(true);
    try {
      const items = offlineStorage.getDownloadedItems();

      let notesBytes = 0;
      let audioBytes = 0;
      let papersBytes = 0;
      let quizBytes = 0;

      items.forEach((item) => {
        const size = item.fileSizeBytes || JSON.stringify(item.data).length;
        if (item.type === 'note') notesBytes += size;
        else if (item.type === 'past_paper') papersBytes += size;
        else if (item.type === 'quiz_package') quizBytes += size;
        else notesBytes += size;
      });

      // Calculate localStorage footprint
      let localTotal = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const val = localStorage.getItem(key) || '';
          localTotal += (key.length + val.length) * 2;
          if (key.includes('audio') || key.includes('voice')) {
            audioBytes += val.length * 2;
          }
        }
      }

      const total = notesBytes + audioBytes + papersBytes + quizBytes + localTotal;

      setStats({
        totalBytes: total,
        notesBytes,
        audioBytes,
        papersBytes,
        quizBytes,
        downloadCount: items.length,
        estimatedDeviceLimitMb: 50
      });
    } catch (e) {
      console.warn('Storage calc error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      calculateStorage();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleClearAudioCache = () => {
    let cleared = 0;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.includes('audio') || key.includes('tts') || key.includes('voice_cache'))) {
        localStorage.removeItem(key);
        cleared++;
      }
    }
    setNotification(`Successfully cleared audio cache (${cleared} files freed).`);
    calculateStorage();
    setTimeout(() => setNotification(null), 3500);
  };

  const handleClearCompletedPapers = async () => {
    try {
      const all = offlineStorage.getDownloadedItems();
      let count = 0;
      for (const item of all) {
        if (item.type === 'past_paper') {
          offlineStorage.removeDownloadedItem(item.id);
          count++;
        }
      }
      setNotification(`Removed ${count} downloaded past paper archives.`);
      calculateStorage();
      setTimeout(() => setNotification(null), 3500);
    } catch {
      setNotification('Failed to clear papers.');
    }
  };

  const handleClearAllOfflineData = async () => {
    if (!window.confirm('Are you sure you want to clear all offline downloaded notes and papers? (Your online points and account are safe!)')) {
      return;
    }
    try {
      offlineStorage.clearAllDownloads();
      setNotification('All offline storage successfully cleared and optimized!');
      calculateStorage();
      setTimeout(() => setNotification(null), 3500);
    } catch {
      setNotification('Failed to clear offline storage.');
    }
  };

  const totalMb = stats.totalBytes / (1024 * 1024);
  const percentUsed = Math.min((totalMb / stats.estimatedDeviceLimitMb) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Phone Storage & Offline Cache Manager
              </h3>
              <p className="text-[11px] text-neutral-400">
                Optimize device memory & manage downloaded syllabus materials
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Notification banner */}
          {notification && (
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Usage Meter Card */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium">StudyMaster Device Footprint</span>
              <span className="font-bold text-emerald-400 font-mono">
                {formatSize(stats.totalBytes)} / ~50 MB Allocation
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${Math.max(percentUsed, 4)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>Local Offline Cache</span>
              <span className="text-amber-400 font-semibold">{percentUsed.toFixed(1)}% of budget</span>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-neutral-400 block">Syllabus Notes</span>
                <span className="font-extrabold text-white font-mono">{formatSize(stats.notesBytes)}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-neutral-400 block">Past Papers & Mocks</span>
                <span className="font-extrabold text-white font-mono">{formatSize(stats.papersBytes)}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-neutral-400 block">Audio & TTS Cache</span>
                <span className="font-extrabold text-white font-mono">{formatSize(stats.audioBytes)}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-neutral-400 block">Quiz & Progress Data</span>
                <span className="font-extrabold text-white font-mono">{formatSize(stats.quizBytes)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
              One-Tap Clean-Up Actions
            </h4>

            <button
              type="button"
              onClick={handleClearAudioCache}
              className="w-full p-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-between text-left transition"
            >
              <div>
                <div className="font-bold text-xs text-white">Clear Voice & Audio Cache</div>
                <div className="text-[11px] text-neutral-400">
                  Frees up temporary audio speech buffers while keeping written notes intact
                </div>
              </div>
              <Trash2 className="w-4 h-4 text-amber-400 shrink-0" />
            </button>

            <button
              type="button"
              onClick={handleClearCompletedPapers}
              className="w-full p-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-between text-left transition"
            >
              <div>
                <div className="font-bold text-xs text-white">Clear Cached Papers</div>
                <div className="text-[11px] text-neutral-400">
                  Cleans cached examination papers to reclaim local storage
                </div>
              </div>
              <Trash2 className="w-4 h-4 text-purple-400 shrink-0" />
            </button>

            <button
              type="button"
              onClick={handleClearAllOfflineData}
              className="w-full p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/60 flex items-center justify-between text-left transition text-rose-300"
            >
              <div>
                <div className="font-bold text-xs">Purge Entire Offline Storage</div>
                <div className="text-[11px] text-rose-400/80">
                  Resets local cache back to zero (Cloud account & points remain safe)
                </div>
              </div>
              <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={calculateStorage}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalculate</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
