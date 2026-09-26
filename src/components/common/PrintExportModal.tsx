import React, { useRef } from 'react';
import {
  Printer,
  FileText,
  X,
  Copy,
  Check,
  Download,
  BookOpen,
  Share2
} from 'lucide-react';
import { FormLevel, NoteItem, Topic } from '../../types';

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: Topic;
  note?: NoteItem;
  subjectName?: string;
  form?: FormLevel;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  topic,
  note,
  subjectName = 'General Studies',
  form = 'Form 4'
}) => {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    if (!printRef.current) return;
    const textContent = printRef.current.innerText;
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 flex flex-col overflow-hidden text-white max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Print & Boarding School Study Sheet Exporter
              </h3>
              <p className="text-[11px] text-neutral-400">
                Format clean offline paper handouts for prep hours & cyber cafe printing
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

        {/* Action Controls Bar */}
        <div className="p-3 bg-neutral-950/90 border-b border-neutral-800 flex items-center justify-between gap-2">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>High-Contrast Monochrome Paper Layout</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy All Text'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas Preview */}
        <div className="p-6 overflow-y-auto flex-1 bg-neutral-800/40">
          <div
            ref={printRef}
            className="bg-white text-neutral-900 p-8 rounded-2xl shadow-xl max-w-xl mx-auto space-y-6 font-serif leading-relaxed text-sm print:p-0 print:shadow-none print:rounded-none"
          >
            {/* Header Stamp */}
            <div className="border-b-2 border-neutral-900 pb-4 flex justify-between items-start">
              <div>
                <h1 className="text-lg font-black tracking-tight text-neutral-950 uppercase font-sans">
                  StudyMaster
                </h1>
                <p className="text-xs font-bold text-neutral-700 font-sans">
                  MANEB Secondary School Revision Handout
                </p>
              </div>
              <div className="text-right text-xs font-mono font-bold text-neutral-700">
                <div>{form} • {subjectName}</div>
                <div>Date: {new Date().toLocaleDateString('en-GB')}</div>
              </div>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl font-bold text-neutral-950 font-sans">
                {topic?.title || note?.title || 'Syllabus Topic Notes'}
              </h2>
              {topic?.summary && (
                <p className="text-xs text-neutral-600 mt-1 italic">
                  Overview: {topic.summary}
                </p>
              )}
            </div>

            {/* Key Concepts */}
            {topic?.keyConcepts && topic.keyConcepts.length > 0 && (
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-300 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 font-sans">
                  Key Syllabus Concepts:
                </h3>
                <ul className="list-disc list-inside text-xs space-y-1 text-neutral-800">
                  {topic.keyConcepts.map((kc, i) => (
                    <li key={i}>{kc}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Content */}
            <div className="space-y-4 text-xs leading-relaxed text-neutral-900">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-300 pb-1 font-sans">
                Theory Notes & Definitions
              </h3>
              <div className="whitespace-pre-line">
                {note?.content || topic?.summary || 'Comprehensive theory notes.'}
              </div>
            </div>

            {/* Worked Examples if present */}
            {note?.workedExamples && note.workedExamples.length > 0 && (
              <div className="space-y-4 pt-3 border-t border-neutral-300">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950 font-sans">
                  Worked Examination Examples & Solutions
                </h3>
                {note.workedExamples.map((ex, idx) => (
                  <div key={idx} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                    <h4 className="font-bold text-xs text-neutral-950 font-sans">
                      Example {idx + 1}: {ex.title}
                    </h4>
                    <p className="text-xs font-medium text-neutral-800">{ex.problem}</p>
                    <div className="space-y-1 pl-2 border-l-2 border-neutral-400 text-xs">
                      {ex.stepByStepSolution.map((s) => (
                        <div key={s.step} className="flex items-start gap-1.5">
                          <strong className="text-neutral-900">{s.step}.</strong> <span>{s.explanation}</span>
                          {s.mathOrCode && <div className="font-mono text-neutral-700">{s.mathOrCode}</div>}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs font-bold text-neutral-900 pt-1">
                      Final Answer: <span className="font-mono">{ex.finalAnswer}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-neutral-300 pt-3 flex justify-between items-center text-[10px] text-neutral-500 font-mono">
              <span>StudyMaster — Offline Learning Handout</span>
              <span>www.studymaster.mw</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
