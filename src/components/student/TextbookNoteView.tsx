import React, { useState, useMemo } from 'react';
import {
  Target,
  CheckCircle2,
  Lightbulb,
  Star,
  BookOpen,
  HelpCircle,
  CheckSquare,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  Info,
  Layers,
  FlaskConical,
  GraduationCap,
  Bookmark,
  Share2,
  Printer,
  ChevronRight,
  Compass
} from 'lucide-react';
import { NoteItem } from '../../types';
import { TextToSpeechButton } from '../common/TextToSpeechButton';
import { PeriodicTableView } from './PeriodicTableView';
import { ApparatusGallery } from './ApparatusGallery';
import { MathMarkdown } from '../common/MathMarkdown';

interface TextbookNoteViewProps {
  note: NoteItem;
  subjectName?: string;
  onAskAssist?: (query: string) => void;
  onOpenQuiz?: () => void;
}

export const TextbookNoteView: React.FC<TextbookNoteViewProps> = ({
  note,
  subjectName = 'Chemistry',
  onAskAssist,
  onOpenQuiz
}) => {
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [activeAnswers, setActiveAnswers] = useState<Record<number, boolean>>({});

  // Check if this note is Form 1 Chemistry Topic 1 or other related Form 1 Chemistry topics (measurement, separation techniques, lab apparatus)
  const isForm1ChemApparatusRelated = useMemo(() => {
    const isForm1 = note.form === 'Form 1' || note.form?.toLowerCase().includes('form 1');
    const isChem =
      subjectName.toLowerCase().includes('chem') ||
      note.subjectId?.includes('chem') ||
      note.id?.includes('chem') ||
      note.topicId?.includes('chem');

    if (!isForm1 || !isChem) return false;

    const topicId = (note.topicId || '').toLowerCase();
    const noteId = (note.id || '').toLowerCase();
    const title = (note.title || '').toLowerCase();

    // Form 1 Topic 1 (Introduction to Chemistry & Laboratory Safety, Apparatus, Hazard symbols)
    const isTopic1 =
      topicId.includes('chem-f1-t1') ||
      noteId.includes('chem-f1-t1') ||
      title.includes('introduction to chemistry') ||
      title.includes('safety') ||
      title.includes('apparatus') ||
      title.includes('hazard');

    // Related Form 1 Chemistry Topics:
    // Topic 2: Mathematical Skills & Measurement (measuring cylinder, burette, pipette, balances)
    // Topic 3: Particulate Nature of Matter & Separation Techniques (filtration, evaporation, distillation)
    const isRelatedTopic =
      topicId.includes('chem-f1-t2') ||
      topicId.includes('chem-f1-t3') ||
      noteId.includes('chem-f1-t2') ||
      noteId.includes('chem-f1-t3') ||
      title.includes('mathematical skills') ||
      title.includes('separation') ||
      title.includes('matter');

    return isTopic1 || isRelatedTopic;
  }, [note, subjectName]);

  const toggleSingleAnswer = (idx: number) => {
    setActiveAnswers(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Helper to clean and format inline text with proper math and typography using MathMarkdown
  const formatInlineText = (text: string) => {
    return <MathMarkdown inline content={text} />;
  };

  // Helper to parse markdown-like content into sections with clean numbering (1.0, 2.0 etc.)
  const parseSections = (content: string = '') => {
    if (!content || !content.trim()) return [];
    const rawSections = content.split(/(?=^##\s)/gm);
    const parsed = rawSections.map((sec, idx) => {
      const lines = sec.trim().split('\n');
      const headerLine = lines[0] || '';
      const isH2 = headerLine.startsWith('## ');
      const rawTitle = isH2 ? headerLine.replace(/^##\s+/, '').trim() : (idx === 0 ? 'Overview & Introduction' : `Section ${idx + 1}`);
      const bodyLines = isH2 ? lines.slice(1) : lines;
      
      // Normalize title to classic textbook chapter/section format e.g. "1.0 Title"
      let sectionNumber = `${idx + 1}.0`;
      let cleanTitle = rawTitle;
      
      const numMatch = rawTitle.match(/^(\d+(?:\.\d+)?)\.?\s*(.*)$/);
      if (numMatch) {
        sectionNumber = numMatch[1].includes('.') ? numMatch[1] : `${numMatch[1]}.0`;
        cleanTitle = numMatch[2];
      }

      return {
        id: idx + 1,
        sectionNumber,
        title: cleanTitle || `Section ${idx + 1}`,
        raw: bodyLines.join('\n')
      };
    }).filter(s => s.title.length > 0 && s.raw.trim().length > 0);

    if (parsed.length === 0 && content.trim().length > 0) {
      return [{
        id: 1,
        sectionNumber: '1.0',
        title: 'Core Syllabus Notes',
        raw: content.trim()
      }];
    }

    return parsed;
  };

  const sections = parseSections(note?.content || '');

  // Render markdown-like elements with modern illustrated textbook typography & callouts
  const renderSectionContent = (raw: string, sectionNumber: string) => {
    const blocks = raw.split(/\n\n+/);
    let subSectionCount = 1;

    return (
      <div className="space-y-4 text-neutral-800 leading-relaxed font-sans">
        {blocks.map((block, bIdx) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          // Sub-subsection Headings (####) -> e.g. 1. SOLIDS, 2. LIQUIDS
          if (trimmed.startsWith('#### ')) {
            const subSubTitle = trimmed.replace('#### ', '');
            return (
              <div key={bIdx} className="pt-2 pb-0.5">
                <h4 className="text-sm sm:text-base font-extrabold text-emerald-900 tracking-wide">
                  {formatInlineText(subSubTitle)}
                </h4>
              </div>
            );
          }

          // Subsection Headings (###) -> e.g. 1.1, 1.2
          if (trimmed.startsWith('### ')) {
            const subTitle = trimmed.replace('### ', '');
            const mainNum = sectionNumber.split('.')[0] || '1';
            const subNum = `${mainNum}.${subSectionCount++}`;

            return (
              <div key={bIdx} className="pt-4 pb-1">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-xs tracking-wider">
                    {subNum}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-emerald-950 dark:text-emerald-200">
                    {formatInlineText(subTitle)}
                  </h3>
                </div>
              </div>
            );
          }

          // Display Math Block ($$ ... $$)
          if (trimmed.startsWith('$$')) {
            return (
              <div key={bIdx} className="my-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-2 border-emerald-300 dark:border-emerald-700 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Calculator className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                    Mathematical & Chemical Equation
                  </span>
                </div>
                <div className="py-2 text-center overflow-x-auto text-emerald-950 dark:text-emerald-200 font-bold text-base sm:text-lg">
                  <MathMarkdown content={trimmed} />
                </div>
              </div>
            );
          }

          // Quote / Callout box (> ) - Categorized into distinct textbook callout cards
          if (trimmed.startsWith('> ')) {
            const quoteContent = trimmed.replace(/^>\s+/gm, '');
            const lower = quoteContent.toLowerCase();
            const isFormula = lower.includes('formula') || lower.includes('ram =') || lower.includes('× 10') || lower.includes('v = i') || lower.includes('neutrons =') || lower.includes('% of element');
            const isExamTip = lower.includes('exam') || lower.includes('tip') || lower.includes('golden rule') || lower.includes('caution') || lower.includes('rule:');
            const isLocalContext = lower.includes('malawi') || lower.includes('escom') || lower.includes('lake') || lower.includes('illovo') || lower.includes('lilongwe');

            // 1. Formula & Scientific Calculation Box
            if (isFormula) {
              return (
                <div key={bIdx} className="my-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white dark:from-black dark:via-black dark:to-black dark:bg-black border-2 border-emerald-300 dark:border-emerald-700 p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Calculator className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                      Scientific Formula & Relationship
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-emerald-950 dark:text-emerald-200 pl-8 leading-relaxed overflow-x-auto">
                    <MathMarkdown content={quoteContent} />
                  </div>
                </div>
              );
            }

            // 2. Exam Tip & Syllabus Warning Box
            if (isExamTip) {
              return (
                <div key={bIdx} className="my-4 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-50/50 to-white dark:from-black dark:via-black dark:to-black dark:bg-black border-2 border-amber-300 dark:border-amber-700 p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Star className="w-3.5 h-3.5 fill-white" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
                      MSCE & JCE Examiner's Note
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-medium text-amber-950 dark:text-amber-200 pl-8 leading-relaxed">
                    <MathMarkdown content={quoteContent} />
                  </div>
                </div>
              );
            }

            // 3. Local Malawian Context Box
            if (isLocalContext) {
              return (
                <div key={bIdx} className="my-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/40 to-white dark:from-black dark:via-black dark:to-black dark:bg-black border-2 border-sky-300 dark:border-sky-700 p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-sky-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-sky-900 dark:text-sky-300">
                      In Our Malawian Environment
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-medium text-sky-950 dark:text-sky-200 pl-8 leading-relaxed">
                    <MathMarkdown content={quoteContent} />
                  </div>
                </div>
              );
            }

            // 4. Standard Definition Box
            return (
              <div key={bIdx} className="my-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-emerald-50/20 to-white dark:from-black dark:via-black dark:to-black dark:bg-black border-l-4 border-l-emerald-600 border border-emerald-200/90 dark:border-emerald-800 p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Definition & Core Concept
                  </span>
                </div>
                <div className="text-sm sm:text-base font-medium text-neutral-900 dark:text-neutral-200 pl-6 leading-relaxed">
                  <MathMarkdown content={quoteContent} />
                </div>
              </div>
            );
          }

          // Tables (| col1 | col2 |) -> Rendered as crisp textbook tables
          if (trimmed.startsWith('|')) {
            const lines = trimmed.split('\n').filter(l => l.includes('|') && !l.includes(':---'));
            if (lines.length > 0) {
              const headers = lines[0].split('|').map(c => c.trim()).filter(Boolean);
              const rows = lines.slice(1).map(line => line.split('|').map(c => c.trim()).filter(Boolean));

              return (
                <div key={bIdx} className="overflow-x-auto my-5 rounded-2xl border border-emerald-200/90 bg-white shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-emerald-800 text-white border-b border-emerald-900">
                        {headers.map((h, hIdx) => (
                          <th key={hIdx} className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-emerald-50">
                            {formatInlineText(h)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className={rIdx % 2 === 0 ? 'bg-white hover:bg-emerald-50/40 transition-colors' : 'bg-emerald-50/20 hover:bg-emerald-50/50 transition-colors'}
                        >
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="py-3 px-4 text-neutral-800">
                              {formatInlineText(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
          }

          // Bullet List (- or •) -> Render as compact modern concept tiles
          if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
            const items = trimmed.split(/\n(?=[-•*]\s)/).map(item => item.replace(/^[-•*]\s+/, '').trim());
            const isMulti = items.length > 2;

            return (
              <div key={bIdx} className={`grid ${isMulti ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-3 my-3`}>
                {items.map((item, iIdx) => {
                  const parts = item.split(/\s+–\s+|\s+-\s+/);
                  const titlePart = parts.length > 1 ? parts[0]?.replace(/\*\*/g, '').replace(/^[^\w\s]+\s*/, '') : null;
                  const descPart = parts.length > 1 ? parts.slice(1).join(' – ') : item;

                  return (
                    <div
                      key={iIdx}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white border border-neutral-200/90 hover:border-emerald-400 hover:shadow-xs transition-all flex items-start gap-3 shadow-2xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div className="text-xs sm:text-sm leading-relaxed text-neutral-800">
                        {titlePart ? (
                          <>
                            <span className="font-bold text-emerald-950 dark:text-emerald-300 text-sm block mb-0.5">
                              {formatInlineText(titlePart)}
                            </span>
                            <span className="text-neutral-700 font-normal">
                              {formatInlineText(descPart)}
                            </span>
                          </>
                        ) : (
                          <span className="font-medium text-neutral-800">
                            {formatInlineText(item)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }

          // Numbered List (1. 2. 3.) -> Render as step-by-step procedure & rule cards with clean number badge
          if (/^\d+\.\s/.test(trimmed)) {
            const items = trimmed.split(/\n(?=\d+\.\s)/).map(item => item.replace(/^\d+\.\s+/, '').trim());
            const isMulti = items.length > 3;

            return (
              <div key={bIdx} className={`grid ${isMulti ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-3.5 my-3`}>
                {items.map((item, iIdx) => {
                  const parts = item.split(/\s+–\s+|\s+-\s+/);
                  const titlePart = parts.length > 1 ? parts[0]?.replace(/\*\*/g, '') : null;
                  const descPart = parts.length > 1 ? parts.slice(1).join(' – ') : item;

                  return (
                    <div
                      key={iIdx}
                      className="p-4 rounded-2xl bg-white border border-emerald-200/90 hover:border-emerald-400 hover:shadow-xs transition-all flex items-start gap-3.5 shadow-2xs"
                    >
                      <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        {iIdx + 1}
                      </div>
                      <div className="text-xs sm:text-sm leading-relaxed text-neutral-800 flex-1">
                        {titlePart ? (
                          <>
                            <span className="font-bold text-emerald-950 dark:text-emerald-300 text-sm block mb-1">
                              {formatInlineText(titlePart)}
                            </span>
                            <span className="text-neutral-700 font-normal">
                              {formatInlineText(descPart)}
                            </span>
                          </>
                        ) : (
                          <span className="font-medium text-neutral-800">
                            {formatInlineText(item)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }

          // Lead / Descriptive Concept Paragraphs -> Transformed into Scannable Concept Cards
          const startsWithBold = trimmed.startsWith('**');
          const isExampleBlock = trimmed.toLowerCase().startsWith('**example') || trimmed.toLowerCase().startsWith('**examples:');
          const isProcedureNote = trimmed.toLowerCase().startsWith('**how to') || trimmed.toLowerCase().startsWith('**method:');
          
          // Case A: Example Blocks & Step Walkthroughs inside notes
          if (isExampleBlock || isProcedureNote) {
            const lines = trimmed.split('\n');
            const header = lines[0]?.replace(/\*\*/g, '').replace(/:$/, '') || 'Worked Note Example';
            const body = lines.slice(1).join('\n');

            return (
              <div
                key={bIdx}
                className="my-4 rounded-2xl bg-emerald-50/70 dark:bg-black border border-emerald-200/90 dark:border-emerald-800 p-4 sm:p-5 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    {isProcedureNote ? <FlaskConical className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                    {header}
                  </span>
                </div>
                {body ? (
                  <div className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 pl-8 leading-relaxed font-medium space-y-1.5">
                    {body.split('\n').map((l, lIdx) => (
                      <div key={lIdx} className="bg-white/80 dark:bg-black p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60">
                        {formatInlineText(l.trim())}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 pl-8 leading-relaxed font-medium">
                    {formatInlineText(trimmed)}
                  </div>
                )}
              </div>
            );
          }

          // Case B: Term Definition Cards (e.g. lines starting with **Term:** or numbered **1. Term:**)
          const isTermDefinitionBlock = trimmed.includes('**') && (
            /^\s*\*\*[^*]+(?::|\s*–|\s*-)\*\*/.test(trimmed) ||
            /^\s*\*\*\d+\.\s+[^*]+(?::|\s*–|\s*-)\*\*/.test(trimmed) ||
            trimmed.includes('\n**')
          );

          if (isTermDefinitionBlock) {
            const termLines = trimmed.split(/\n(?=\s*(?:\*\*\d+\.|\*\*))/).filter(l => l.trim().length > 0);
            if (termLines.length > 1 || /^\s*\*\*[^*]+(?::|\s*–|\s*-)\*\*/.test(trimmed)) {
              return (
                <div key={bIdx} className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-3.5">
                  {termLines.map((tLine, tIdx) => {
                    const match = tLine.match(/^\s*\*\*([^*]+)\*\*(.*)$/);
                    const termTitle = match ? match[1].replace(/^\d+\.\s*/, '').replace(/:$/, '').trim() : null;
                    const termDesc = match ? match[2].replace(/^[:–-]\s*/, '').trim() : tLine;

                    return (
                      <div
                        key={tIdx}
                        className="p-4 rounded-2xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-emerald-400 dark:hover:border-emerald-700 hover:shadow-xs transition-all shadow-2xs space-y-1.5"
                      >
                        {termTitle ? (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                              <span className="font-extrabold text-sm text-emerald-950 dark:text-emerald-300">
                                {termTitle}
                              </span>
                            </div>
                            <div className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal pl-4">
                              {formatInlineText(termDesc)}
                            </div>
                          </>
                        ) : (
                          <div className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                            {formatInlineText(tLine)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }
          }

          // Case C: Key Concept Card (Core Definitions, Laws, and Principles)
          const isDefinitionOrPrinciple = 
            trimmed.toLowerCase().includes('defined as') ||
            trimmed.toLowerCase().includes('is the branch of') ||
            trimmed.toLowerCase().includes('are those digits') ||
            trimmed.toLowerCase().includes('is a special room') ||
            trimmed.toLowerCase().includes('must be measured') ||
            trimmed.toLowerCase().includes('states that') ||
            trimmed.toLowerCase().includes('principle:');

          if (isDefinitionOrPrinciple) {
            return (
              <div
                key={bIdx}
                className="my-3.5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-black border-l-4 border-l-emerald-600 border border-neutral-200/90 dark:border-neutral-800 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex items-start gap-3.5"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div className="space-y-1 text-xs sm:text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 flex-1">
                  <div className="text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Key Concept & Principle
                  </div>
                  <div className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base leading-relaxed">
                    {formatInlineText(trimmed)}
                  </div>
                </div>
              </div>
            );
          }

          // Case D: Multi-Sentence Paragraphs -> Formatted with Scannable Flow & Clarity
          const sentences = trimmed.split(/(?<=[.!?])\s+(?=[A-Z0-9])/).filter(s => s.trim().length > 0);
          if (sentences.length > 1) {
            return (
              <div
                key={bIdx}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-black border border-neutral-200/90 dark:border-neutral-800 shadow-2xs space-y-2.5 my-3"
              >
                {sentences.map((sentence, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0 opacity-80" />
                    <span className="flex-1">{formatInlineText(sentence)}</span>
                  </div>
                ))}
              </div>
            );
          }

          // Case E: Single Scannable Concept Statement
          return (
            <div
              key={bIdx}
              className="p-4 sm:p-4.5 rounded-2xl bg-white dark:bg-black border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex items-start gap-3 my-2.5"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0 shadow-xs" />
              <div className="text-neutral-900 dark:text-white text-xs sm:text-sm font-semibold leading-relaxed flex-1">
                {formatInlineText(trimmed)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-black text-neutral-900 dark:text-neutral-100 font-sans antialiased pb-12">
      {/* 1. Textbook Running Header / Breadcrumb */}
      <div className="bg-white dark:bg-black border-b border-neutral-200/90 dark:border-neutral-800 px-4 sm:px-6 py-3.5 mb-6 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>Malawi National Syllabus</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600" />
          <span className="text-emerald-800 dark:text-emerald-300">{note.form || 'Form 1'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600" />
          <span className="text-neutral-900 dark:text-neutral-200">{subjectName}</span>
        </div>

        <div className="flex items-center gap-2">
          <TextToSpeechButton
            text={`${note.title}. ${note.summary || ''}. ${note.content}`}
            title="Listen to textbook lesson"
          />
        </div>
      </div>

      {/* 2. Top Chapter Banner Header */}
      <div className="mb-6 bg-white dark:bg-black border border-neutral-200/90 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <div className="px-3 py-1 rounded-lg bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-2xs">
            {note.lessonBadge || 'CHAPTER LESSON'}
          </div>
          <div className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-black border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-extrabold tracking-wide">
            ~{note.estimatedReadTimeMinutes || 10} MIN STUDY READ
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
          {note.title}
        </h1>

        {note.summary && (
          <p className="mt-3 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
            {note.summary}
          </p>
        )}
      </div>

      {/* 3. Learning Objectives Box ("What You Will Learn") */}
      {(note.learningObjectives || note.summary) && (
        <div className="bg-gradient-to-br from-[#f0fdf4] via-emerald-50/40 to-white dark:from-black dark:via-black dark:to-black dark:bg-black border-2 border-emerald-300 dark:border-emerald-800 rounded-3xl p-6 sm:p-7 mb-8 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-2 text-emerald-950 dark:text-emerald-200 font-black text-base sm:text-lg">
            <Target className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>Learning Objectives</span>
          </div>

          <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-300 font-bold mb-4">
            By the end of this topic, you should be able to:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {note.learningObjectives && note.learningObjectives.length > 0 ? (
              note.learningObjectives.map((obj, oIdx) => (
                <div key={oIdx} className="flex items-start gap-3 p-3 rounded-xl bg-white/90 dark:bg-black border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 font-semibold leading-relaxed">
                    {obj}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/90 dark:bg-black border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 font-semibold leading-relaxed">
                  {note.summary}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Full-Width Textbook Study Layout */}
      <div className="w-full space-y-8">
        {/* Render Main Numbered Sections (1.0, 2.0, 3.0) */}
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-black border border-neutral-200/90 dark:border-neutral-800 shadow-2xs space-y-5">
            {/* Numbered Section Header */}
            <div className="flex items-center gap-3.5 pb-3.5 border-b-2 border-emerald-100 dark:border-emerald-900/60">
              <div className="px-3 py-1 rounded-xl bg-emerald-700 text-white font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-xs">
                {section.sectionNumber}
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                {section.title}
              </h2>
            </div>

            {/* Section Body */}
            <div className="pt-1">
              {renderSectionContent(section.raw, section.sectionNumber)}
            </div>
          </div>
        ))}

        {/* Interactive Periodic Table Component for Periodic Table Topics */}
        {(note.topicId?.includes('periodic') || note.title?.toLowerCase().includes('periodic')) && (
          <div className="w-full">
            <PeriodicTableView />
          </div>
        )}

        {/* Interactive Laboratory Apparatus & Visual Guide for Form 1 Chemistry Topic 1 & Related Topics */}
        {isForm1ChemApparatusRelated && (
          <div className="w-full my-6">
            <ApparatusGallery />
          </div>
        )}

        {/* Render Illustrated Figures / Diagrams with Official Textbook Figure Badges */}
        {note.diagramUrl && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-black border-2 border-emerald-200/90 dark:border-emerald-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-xs font-black uppercase tracking-wider">
                  Figure {note.diagramCaption?.match(/Figure\s*([\d.]+)/i)?.[1] || '1.1'}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-950 dark:text-emerald-200">
                  Scientific Illustrated Diagram
                </span>
              </div>
            </div>

            <div className="flex justify-center p-4 bg-neutral-50/70 dark:bg-black rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800">
              <img
                src={note.diagramUrl}
                alt={note.diagramCaption || note.title}
                className="max-h-96 w-auto object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {note.diagramCaption && (
              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-black border border-emerald-200/60 dark:border-emerald-800 text-center">
                <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 font-bold">
                  {note.diagramCaption}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Worked Examples & Step-by-Step Solutions */}
        {note.workedExamples && note.workedExamples.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-black border-2 border-emerald-300 dark:border-emerald-800 shadow-2xs space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b-2 border-emerald-100 dark:border-emerald-900/60">
              <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white">
                Worked Solutions
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {note.workedExamples.map((we, weIdx) => (
                <div key={weIdx} className="p-5 sm:p-6 rounded-2xl bg-emerald-50/30 dark:bg-black border border-emerald-200 dark:border-emerald-800 space-y-4 shadow-2xs">
                  <div className="font-extrabold text-sm sm:text-base text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-xs font-bold">
                      Example {weIdx + 1}
                    </span>
                    <span className="dark:text-white">{we.title}</span>
                  </div>

                  <div className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 bg-white dark:bg-black p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 font-medium leading-relaxed">
                    <strong className="text-emerald-900 dark:text-emerald-300 font-bold block mb-1">Problem Statement:</strong>
                    <MathMarkdown content={we.problem} />
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {we.stepByStepSolution.map((s, sIdx) => (
                      <div key={sIdx} className="text-xs sm:text-sm flex items-start gap-3 bg-white dark:bg-black p-3.5 rounded-xl border border-emerald-100/90 dark:border-emerald-900/60 shadow-2xs">
                        <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {s.step}
                        </span>
                        <div className="space-y-1 flex-1">
                          <div className="text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed">
                            <MathMarkdown inline content={s.explanation} />
                          </div>
                          {s.mathOrCode && (
                            <div className="bg-emerald-50/80 dark:bg-black px-3 py-2 rounded-lg text-xs mt-1 border border-emerald-100 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 font-bold">
                              <MathMarkdown content={s.mathOrCode} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-emerald-200/80 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                    <span className="font-bold text-neutral-900 dark:text-neutral-200">Final Calculated Result:</span>
                    <span className="font-black text-white bg-emerald-700 px-4 py-1.5 rounded-xl shadow-xs">
                      <MathMarkdown inline content={we.finalAnswer} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chapter Review / Key Takeaways Box */}
        <div className="bg-gradient-to-r from-[#f0fdf4] via-emerald-50/60 to-white dark:from-black dark:via-black dark:to-black dark:bg-black border-2 border-emerald-300 dark:border-emerald-800 rounded-3xl p-6 sm:p-7 shadow-2xs flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-black text-base sm:text-lg text-emerald-950 dark:text-emerald-200">
              Chapter Review & Key Takeaway
            </h4>
            <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-300 leading-relaxed font-medium">
              {note.keyTakeaway ||
                `${note.title.replace(/^Topic\s+\d+:\s*/, '')} provides foundational scientific concepts essential for junior and senior secondary studies, everyday health, agriculture, and technological advancement in Malawi.`}
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SUPPORTING SYLLABUS TOOLS (FULL-WIDTH BOTTOM GRID) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Key Summary Points */}
          <div className="bg-white dark:bg-black rounded-3xl border border-neutral-200/90 dark:border-neutral-800 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Star className="w-4 h-4 fill-white" />
              </div>
              <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                Key Points Summary
              </h3>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
              {note.keyPoints && note.keyPoints.length > 0 ? (
                note.keyPoints.map((kp, kIdx) => (
                  <li key={kIdx} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                    <span className="leading-relaxed font-medium text-neutral-800 dark:text-neutral-200">{kp}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                    <span className="leading-relaxed font-medium text-neutral-800 dark:text-neutral-200">Core conceptual framework based on the Malawi National Syllabus.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                    <span className="leading-relaxed font-medium text-neutral-800 dark:text-neutral-200">Applied to daily life, local industries, and laboratory scientific practice.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                    <span className="leading-relaxed font-medium text-neutral-800 dark:text-neutral-200">Essential foundation for JCE and MSCE examinations.</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Card 2: Key Vocabulary / Glossary */}
          {note.vocabulary && note.vocabulary.length > 0 ? (
            <div className="bg-white dark:bg-black rounded-3xl border border-neutral-200/90 dark:border-neutral-800 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                  Topic Glossary
                </h3>
              </div>

              <div className="space-y-3">
                {note.vocabulary.map((vocab, vIdx) => (
                  <div key={vIdx} className="p-3 rounded-xl bg-neutral-50/80 dark:bg-black border border-neutral-200/60 dark:border-neutral-800 space-y-1">
                    <div className="font-bold text-xs sm:text-sm text-emerald-900 dark:text-emerald-300">
                      {vocab.term}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                      {vocab.definition}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-black rounded-3xl border border-neutral-200/90 dark:border-neutral-800 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                  Scientific Principles
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Core laws, empirical observations, and analytical methodologies tested under MANEB MSCE and JCE standards.
              </p>
            </div>
          )}

          {/* Card 3: Quick Check / Self-Assessment & Trivia */}
          <div className="space-y-6">
            {note.didYouKnow && (
              <div className="bg-gradient-to-br from-amber-50/70 via-amber-50/30 to-white dark:from-black dark:via-black dark:to-black dark:bg-black rounded-3xl border-2 border-amber-300 dark:border-amber-700 p-5 sm:p-6 shadow-2xs space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-amber-200/70 dark:border-amber-805">
                  <div className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 text-sm font-black shadow-2xs">
                    ?
                  </div>
                  <h3 className="font-extrabold text-base text-amber-950 dark:text-amber-200">
                    Science in Action Trivia
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                  {note.didYouKnow}
                </p>
              </div>
            )}

            {note.quickCheckQuestions && note.quickCheckQuestions.length > 0 && (
              <div className="bg-white dark:bg-black rounded-3xl border border-neutral-200/90 dark:border-neutral-800 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                    Quick Check Review
                  </h3>
                </div>

                <div className="space-y-3">
                  {note.quickCheckQuestions.map((qc, qIdx) => {
                    const isRevealed = showAnswers || activeAnswers[qIdx];
                    return (
                      <div key={qIdx} className="p-3.5 rounded-2xl bg-neutral-50/70 dark:bg-black border border-neutral-200/80 dark:border-neutral-800 space-y-2">
                        <div className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            {qIdx + 1}
                          </div>
                          <div className="text-xs sm:text-sm text-neutral-900 dark:text-white font-semibold leading-snug flex-1">
                            <MathMarkdown inline content={qc.question} />
                          </div>
                        </div>

                        {isRevealed && qc.answer ? (
                          <div className="ml-7 p-3 rounded-xl bg-emerald-50 dark:bg-black border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 font-medium leading-relaxed">
                            <strong className="text-emerald-900 dark:text-emerald-400 font-bold block mb-0.5">Answer: </strong>
                            <MathMarkdown content={qc.answer} />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleSingleAnswer(qIdx)}
                            className="ml-7 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1 py-0.5"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Tap to reveal answer</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-50 dark:bg-black hover:bg-emerald-100 dark:hover:bg-neutral-900 transition shadow-2xs border border-emerald-200 dark:border-emerald-800"
                  >
                    {showAnswers ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide All Answers</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show All Answers</span>
                      </>
                    )}
                  </button>

                  {onOpenQuiz && (
                    <button
                      type="button"
                      onClick={onOpenQuiz}
                      className="text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 flex items-center gap-1 py-1.5 px-3 rounded-xl bg-emerald-100 dark:bg-neutral-900 hover:bg-emerald-200 transition border border-emerald-200 dark:border-neutral-700"
                    >
                      <span>Full Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
