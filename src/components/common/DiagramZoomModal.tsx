import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
  Sun,
  Moon,
  Info,
  Volume2
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface DiagramZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  title?: string;
  caption?: string;
}

export const DiagramZoomModal: React.FC<DiagramZoomModalProps> = ({
  isOpen,
  onClose,
  imageUrl = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
  title = 'MANEB Science Apparatus Diagram',
  caption = 'Standard laboratory setup for Secondary Science experiments and examinations.'
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const { speak, isSpeaking, stopSpeech } = useAccessibility();

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 4.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.8));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setIsInverted(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      speak(`Scientific Diagram: ${title}. ${caption || 'Inspect the labels and structures closely.'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[90vh] bg-neutral-950 rounded-3xl shadow-2xl border border-neutral-800 flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 max-w-[70%]">
            <Maximize2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-sm font-extrabold text-white truncate">{title}</h3>
              <p className="text-[11px] text-neutral-400 truncate">
                {caption || 'Pinch or zoom to inspect high-resolution anatomical & circuit details'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReadAloud}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                isSpeaking
                  ? 'bg-amber-500 text-neutral-950 animate-pulse'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
              }`}
              title="Voice narration of diagram description"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Listen</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Zoomable Canvas Stage */}
        <div
          className="flex-1 overflow-hidden relative flex items-center justify-center bg-neutral-950 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="transition-transform duration-75"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`
            }}
          >
            <img
              src={imageUrl}
              alt={title}
              referrerPolicy="no-referrer"
              className={`max-h-[68vh] max-w-[85vw] object-contain rounded-xl shadow-2xl transition-filter ${
                isInverted ? 'filter invert brightness-90 contrast-125' : ''
              }`}
            />
          </div>

          {/* Quick Helper Floating Overlay */}
          <div className="absolute top-4 left-4 pointer-events-none bg-neutral-900/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-neutral-700 text-[11px] font-mono text-neutral-300">
            Zoom: {Math.round(zoomLevel * 100)}% {zoomLevel > 1 ? '• Drag to pan' : ''}
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleZoomIn}
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center gap-1.5"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-emerald-400" />
              <span>Zoom In</span>
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center gap-1.5"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-amber-400" />
              <span>Zoom Out</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
              title="Reset Zoom & Position"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsInverted(!isInverted)}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
                isInverted
                  ? 'bg-purple-600 text-white'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
              }`}
              title="Invert Colors for High Contrast"
            >
              {isInverted ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{isInverted ? 'Normal Colors' : 'High Contrast Invert'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
            >
              Done Viewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
