import React, { useState, useEffect } from 'react';
import { NoteItem, Topic } from '../../types';
import {
  ArrowLeft,
  Moon,
  Sun,
  Type,
  Maximize2,
  Minimize2,
  BookOpen,
  Volume2,
  Clock,
  Zap,
  Bookmark,
  Check
} from 'lucide-react';
import { useBattery } from '../../context/BatteryContext';
import { TextToSpeechButton } from '../common/TextToSpeechButton';
import { MathMarkdown } from '../common/MathMarkdown';

interface EReaderStudyViewProps {
  note: NoteItem;
  topic: Topic;
  subjectName?: string;
  onClose: () => void;
  onOpenScreenOffAudio?: () => void;
}

export const EReaderStudyView: React.FC<EReaderStudyViewProps> = ({
  note,
  topic,
  subjectName = 'Subject',
  onClose,
  onOpenScreenOffAudio
}) => {
  const { themeMode, setThemeMode, ecoMode } = useBattery();
  const [eReaderTheme, setEReaderTheme] = useState<'amoled' | 'sepia' | 'light'>('amoled');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      if (total > 0) {
        setScrollProgress(Math.min(100, Math.round((el.scrollTop / total) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getThemeClasses = () => {
    if (eReaderTheme === 'amoled') return 'bg-black text-neutral-200';
    if (eReaderTheme === 'sepia') return 'e-reader-sepia';
    return 'bg-white text-neutral-900';
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-xs sm:text-sm leading-relaxed';
      case 'lg':
        return 'text-base sm:text-lg leading-relaxed';
      case 'xl':
        return 'text-lg sm:text-xl leading-loose';
      default:
        return 'text-sm sm:text-base leading-relaxed';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()} transition-colors duration-200 pb-20 select-text`}>
      {/* Top Floating Minimalist Toolbar */}
      <header
        className={`sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b backdrop-blur-md ${
          eReaderTheme === 'amoled'
            ? 'bg-black/90 border-neutral-900 text-neutral-400'
            : eReaderTheme === 'sepia'
            ? 'bg-[#fbf0d9]/90 border-[#ebd9b8] text-[#5e4b33]'
            : 'bg-white/90 border-neutral-200 text-neutral-600'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition hover:opacity-80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit E-Reader</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Offline Text to Speech voice reader */}
          <TextToSpeechButton
            text={`${note.title}. ${note.content}`}
            label="Listen"
            size="sm"
            variant="secondary"
          />

          {/* Audio Lecture Link if Available */}
          {(note.audioFile?.dataUrl || note.audioUrl) && onOpenScreenOffAudio && (
            <button
              type="button"
              onClick={onOpenScreenOffAudio}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 text-xs font-bold"
              title="Listen with Screen-Off Audio Mode"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Screen-Off Audio</span>
            </button>
          )}

          {/* Theme Switcher: AMOLED / Sepia / Light */}
          <div className="flex items-center rounded-xl border p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setEReaderTheme('amoled')}
              className={`px-2 py-1 rounded-lg ${
                eReaderTheme === 'amoled' ? 'bg-neutral-900 text-emerald-400' : 'opacity-60'
              }`}
              title="OLED Pure Black (Maximum Battery Saver)"
            >
              OLED
            </button>
            <button
              type="button"
              onClick={() => setEReaderTheme('sepia')}
              className={`px-2 py-1 rounded-lg ${
                eReaderTheme === 'sepia' ? 'bg-[#ebd9b8] text-[#3d2b14]' : 'opacity-60'
              }`}
              title="Sepia Book Paper"
            >
              Paper
            </button>
            <button
              type="button"
              onClick={() => setEReaderTheme('light')}
              className={`px-2 py-1 rounded-lg ${
                eReaderTheme === 'light' ? 'bg-neutral-200 text-neutral-900' : 'opacity-60'
              }`}
              title="Crisp White"
            >
              Day
            </button>
          </div>

          {/* Font Size Adjuster */}
          <div className="flex items-center rounded-xl border p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                if (fontSize === 'xl') setFontSize('lg');
                else if (fontSize === 'lg') setFontSize('base');
                else if (fontSize === 'base') setFontSize('sm');
              }}
              className="px-2 py-1 hover:opacity-75"
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => {
                if (fontSize === 'sm') setFontSize('base');
                else if (fontSize === 'base') setFontSize('lg');
                else if (fontSize === 'lg') setFontSize('xl');
              }}
              className="px-2 py-1 hover:opacity-75"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>
        </div>
      </header>

      {/* Reading Progress Line */}
      <div className="w-full h-1 bg-neutral-800 sticky top-[53px] z-30">
        <div
          className="h-full bg-emerald-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Content Container (Constrained 65-75ch for optimal reading posture & zero GPU redraw) */}
      <main className="max-w-2xl mx-auto px-5 py-8 space-y-6">
        {/* Title and Metadata Header */}
        <div className="space-y-2 pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500">
            <span>{topic.form}</span>
            <span>•</span>
            <span>{subjectName}</span>
            <span>•</span>
            <span>E-Reader Eco-Mode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {topic.title}
          </h1>
          {topic.summary && (
            <p className="text-sm opacity-80 italic pt-1">
              "{topic.summary}"
            </p>
          )}
        </div>

        {/* Core Concepts Highlighting */}
        {topic.keyConcepts && topic.keyConcepts.length > 0 && (
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              eReaderTheme === 'amoled'
                ? 'bg-neutral-950 border-neutral-900'
                : eReaderTheme === 'sepia'
                ? 'bg-[#f4e6cc] border-[#dec9a7]'
                : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <span className="text-xs font-black uppercase tracking-wider block opacity-75">
              Key Syllabus Principles:
            </span>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              {topic.keyConcepts.map((kc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{kc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Formulas / Facts */}
        {topic.formulasOrFacts && topic.formulasOrFacts.length > 0 && (
          <div
            className={`p-4 rounded-2xl border space-y-2 font-mono ${
              eReaderTheme === 'amoled'
                ? 'bg-neutral-950 border-neutral-900 text-emerald-300'
                : eReaderTheme === 'sepia'
                ? 'bg-[#f4e6cc] border-[#dec9a7] text-[#4a351a]'
                : 'bg-neutral-100 border-neutral-300 text-neutral-900'
            }`}
          >
            <span className="text-xs font-black uppercase tracking-wider block opacity-75">
              Core Formulas:
            </span>
            <div className="space-y-1 text-xs sm:text-sm">
              {topic.formulasOrFacts.map((formula, i) => (
                <div key={i} className="py-1">
                  <MathMarkdown content={formula} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note Body Text */}
        <article className={`space-y-4 ${getFontSizeClass()}`}>
          {note.content.split('\n\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (trimmed.startsWith('## ')) {
              return (
                <h2
                  key={index}
                  className="text-lg sm:text-xl font-black pt-4 pb-1 border-b opacity-90"
                >
                  <MathMarkdown inline content={trimmed.replace('## ', '')} />
                </h2>
              );
            }
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={index} className="text-base font-bold pt-2 text-emerald-500">
                  <MathMarkdown inline content={trimmed.replace('### ', '')} />
                </h3>
              );
            }
            if (trimmed.startsWith('#### ')) {
              return (
                <h4 key={index} className="text-sm font-bold pt-1 text-emerald-400">
                  <MathMarkdown inline content={trimmed.replace('#### ', '')} />
                </h4>
              );
            }
            if (trimmed.startsWith('> ')) {
              return (
                <blockquote
                  key={index}
                  className="pl-4 py-2 border-l-2 border-emerald-500 italic opacity-85 my-3"
                >
                  <MathMarkdown content={trimmed.replace(/^>\s+/gm, '')} />
                </blockquote>
              );
            }
            if (trimmed.startsWith('$$')) {
              return (
                <div key={index} className="py-3 px-4 rounded-xl border border-emerald-500/30 my-3 text-center">
                  <MathMarkdown content={trimmed} />
                </div>
              );
            }
            return (
              <div key={index} className="leading-relaxed">
                <MathMarkdown content={paragraph} />
              </div>
            );
          })}
        </article>

        {/* Worked Examples in E-Reader */}
        {note.workedExamples && note.workedExamples.length > 0 && (
          <div className="pt-6 border-t border-neutral-800 space-y-4">
            <h2 className="text-base font-black opacity-90 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>Model Worked Solutions ({note.workedExamples.length})</span>
            </h2>

            {note.workedExamples.map((ex, exIdx) => (
              <div
                key={ex.id || exIdx}
                className={`p-4 rounded-2xl border space-y-3 ${
                  eReaderTheme === 'amoled'
                    ? 'bg-neutral-950 border-neutral-900'
                    : eReaderTheme === 'sepia'
                    ? 'bg-[#f4e6cc] border-[#dec9a7]'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <h3 className="font-bold text-sm">{ex.title}</h3>
                <div className="text-xs sm:text-sm font-medium opacity-90">
                  <strong className="block mb-1 text-emerald-500">Question:</strong>
                  <MathMarkdown content={ex.problem} />
                </div>
                <div className="space-y-1.5 pt-1 text-xs sm:text-sm">
                  {ex.stepByStepSolution.map((s) => (
                    <div key={s.step} className="flex items-start gap-2">
                      <span className="font-mono text-emerald-500 font-bold">{s.step}.</span>
                      <div className="flex-1">
                        <span>{s.explanation}</span>
                        {s.mathOrCode && (
                          <div className="mt-1 font-mono text-xs text-emerald-400">
                            <MathMarkdown content={s.mathOrCode} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {ex.finalAnswer && (
                  <div className="pt-2 border-t border-neutral-800/50 text-xs font-bold text-emerald-400">
                    Result: <MathMarkdown inline content={ex.finalAnswer} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* End of Note Footnote */}
        <div className="pt-10 text-center text-xs opacity-50 font-mono">
          <span>End of {topic.title} • StudyMaster</span>
        </div>
      </main>
    </div>
  );
};
