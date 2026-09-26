import React, { useState } from 'react';
import {
  BookOpen,
  Calculator,
  Check,
  CheckSquare,
  Compass,
  Copy,
  Eye,
  EyeOff,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Star,
  Target,
  Volume2,
  VolumeX,
  ShieldCheck,
  Send,
  Globe,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { MathMarkdown } from '../common/MathMarkdown';
import { AssistResponse } from '../../types';

interface TutorTextbookResponseProps {
  messageId: string;
  content: string;
  matchedSubject?: string;
  matchedTopic?: string;
  matchedForm?: string;
  timestamp?: Date;
  speakingId?: string | null;
  copiedId?: string | null;
  onToggleSpeak?: (id: string, text: string) => void;
  onCopy?: (id: string, text: string) => void;
  citations?: AssistResponse['sourceCitations'];
  onOpenTopic?: (topicId: string, subjectId: string) => void;
  onQuickPrompt?: (prompt: string) => void;
  onAnswerQuickCheck?: (question: string, answer: string) => void;
}

export const TutorTextbookResponse: React.FC<TutorTextbookResponseProps> = ({
  messageId,
  content,
  matchedSubject = 'Chemistry',
  matchedTopic,
  matchedForm = 'Form 1',
  timestamp,
  speakingId,
  copiedId,
  onToggleSpeak,
  onCopy,
  citations,
  onOpenTopic,
  onQuickPrompt,
  onAnswerQuickCheck
}) => {
  const [showAllAnswers, setShowAllAnswers] = useState<boolean>(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [studentDrafts, setStudentDrafts] = useState<Record<string, string>>({});

  const toggleSingleAnswer = (key: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Helper for inline text rendering with KaTeX support
  const formatInline = (text: string) => {
    return <MathMarkdown inline content={text} />;
  };

  // Parse structured sections from the text, matching Form 1 Chemistry Textbook format
  // Sections are split by ## (e.g. ## 1.0 Title, ## 2.0 Title, or ## Title)
  const parseDocument = (rawText: string) => {
    // 1. Extract Main Title if present (starts with # or **Topic:)
    let mainTitle = matchedTopic || `${matchedSubject} Lesson`;
    let introSummary = '';
    let learningObjectives: string[] = [];
    let keyTakeaway = '';
    let quickCheckList: Array<{ question: string; answer?: string }> = [];

    let cleanText = rawText;

    // Check for top # Heading
    const topTitleMatch = cleanText.match(/^#\s+(.+)$/m);
    if (topTitleMatch) {
      mainTitle = topTitleMatch[1].replace(/^\*+|\*+$/g, '').trim();
      cleanText = cleanText.replace(/^#\s+.+$/m, '').trim();
    }

    // Check for Learning Objectives block (### Learning Objectives)
    const objectivesMatch = cleanText.match(/###\s+(?:Learning Objectives|What You Will Learn)([\s\S]*?)(?=(?:\n##|\n###|$))/i);
    if (objectivesMatch) {
      const rawObjs = objectivesMatch[1].trim();
      const objLines = rawObjs
        .split('\n')
        .map((l) => l.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '').trim())
        .filter((l) => l.length > 0 && !l.toLowerCase().includes('by the end'));
      if (objLines.length > 0) {
        learningObjectives = objLines;
      }
      cleanText = cleanText.replace(objectivesMatch[0], '').trim();
    }

    // Check for Quick Check Questions block
    const quickCheckMatch = cleanText.match(/###\s+(?:Quick Check|Self-Assessment|Practice Check|Review Questions)([\s\S]*?)(?=(?:\n##|\n###|$))/i);
    if (quickCheckMatch) {
      const rawQC = quickCheckMatch[1].trim();
      const items = rawQC.split(/(?=\n(?:\d+\.|\*\*Q|\*\*Question))/i).filter((s) => s.trim().length > 0);
      
      items.forEach((item) => {
        const qMatch = item.match(/(?:(?:^\d+\.|\*\*Question:?|\*\*Q:?)\s*)([\s\S]*?)(?=(?:\n\s*(?:>|Answer:|\*\*Answer:?)|$))/i);
        const aMatch = item.match(/(?:>|Answer:|\*\*Answer:?)\s*([\s\S]*)$/i);
        
        const qText = qMatch ? qMatch[1].trim() : item.split('\n')[0].replace(/^\d+\.\s*/, '').trim();
        const aText = aMatch ? aMatch[1].replace(/^Answer:?\s*/i, '').trim() : undefined;
        
        if (qText) {
          quickCheckList.push({ question: qText, answer: aText });
        }
      });
      cleanText = cleanText.replace(quickCheckMatch[0], '').trim();
    }

    // Check for Key Takeaway block
    const takeawayMatch = cleanText.match(/###\s+(?:Key Takeaway|Chapter Review|Summary Takeaway)([\s\S]*?)(?=(?:\n##|\n###|$))/i);
    if (takeawayMatch) {
      keyTakeaway = takeawayMatch[1].trim().replace(/^[>*•-]\s*/gm, '');
      cleanText = cleanText.replace(takeawayMatch[0], '').trim();
    }

    // Split remaining content into sections by ## or ###
    const hasH2 = /^##\s/m.test(cleanText);
    const hasH3 = /^###\s/m.test(cleanText);

    let rawSections: string[] = [];
    let headingPrefixRegex: RegExp | null = null;

    if (hasH2) {
      rawSections = cleanText.split(/(?=^##\s)/gm);
      headingPrefixRegex = /^##\s+/;
    } else if (hasH3) {
      rawSections = cleanText.split(/(?=^###\s)/gm);
      headingPrefixRegex = /^###\s+/;
    } else {
      rawSections = [cleanText];
    }

    const parsedSections: Array<{ id: number; sectionNumber: string; title: string; content: string }> = [];
    let sectionIdx = 1;

    rawSections.forEach((sec, idx) => {
      const trimmedSec = sec.trim();
      if (!trimmedSec) return;

      const lines = trimmedSec.split('\n');
      const headerLine = lines[0] || '';
      const isHeading = headingPrefixRegex ? headingPrefixRegex.test(headerLine) : false;

      if (!isHeading && idx === 0) {
        // True introductory summary text before the first section heading
        if (!introSummary) {
          introSummary = trimmedSec;
        }
        return;
      }

      const rawSectionTitle = isHeading && headingPrefixRegex
        ? headerLine.replace(headingPrefixRegex, '').trim()
        : headerLine;
      const body = isHeading ? lines.slice(1).join('\n').trim() : lines.join('\n').trim();

      // Section Number normalization (e.g. "1.0 Title")
      let sectionNumber = `${sectionIdx}.0`;
      let cleanSectionTitle = rawSectionTitle;
      const numMatch = rawSectionTitle.match(/^(\d+(?:\.\d+)?)\.?\s*(.*)$/);
      if (numMatch) {
        sectionNumber = numMatch[1].includes('.') ? numMatch[1] : `${numMatch[1]}.0`;
        cleanSectionTitle = numMatch[2];
      }

      parsedSections.push({
        id: sectionIdx,
        sectionNumber,
        title: cleanSectionTitle || `Section ${sectionIdx}`,
        content: body || rawSectionTitle
      });
      sectionIdx++;
    });

    // If no sections were parsed and there is content not absorbed by introSummary
    if (parsedSections.length === 0 && cleanText.trim().length > 0) {
      if (!introSummary) {
        parsedSections.push({
          id: 1,
          sectionNumber: '1.0',
          title: mainTitle,
          content: cleanText.trim()
        });
      }
    }

    return {
      mainTitle,
      introSummary,
      learningObjectives,
      sections: parsedSections,
      quickCheckList,
      keyTakeaway
    };
  };

  const doc = parseDocument(content);

  // Render individual section blocks with the exact visual elements of Form 1 Chemistry notes
  const renderSectionBlocks = (raw: string, sectionNumber: string) => {
    const blocks = raw.split(/\n\n+/);
    let subSectionCount = 1;

    return (
      <div className="space-y-4 text-neutral-800 leading-relaxed font-sans">
        {blocks.map((block, bIdx) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          // Sub-subsection Headings (####)
          if (trimmed.startsWith('#### ')) {
            const subSubTitle = trimmed.replace('#### ', '');
            return (
              <div key={bIdx} className="pt-2 pb-0.5">
                <h4 className="text-sm sm:text-base font-extrabold text-emerald-900 tracking-wide">
                  {formatInline(subSubTitle)}
                </h4>
              </div>
            );
          }

          // Subsection Headings (###) -> e.g. 1.1, 1.2 with emerald pill badge
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
                    {formatInline(subTitle)}
                  </h3>
                </div>
              </div>
            );
          }

          // Display Math Block ($$ ... $$) -> Rendered with Calculator Icon & emerald border
          if (trimmed.startsWith('$$')) {
            return (
              <div
                key={bIdx}
                className="my-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white border-2 border-emerald-300 shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Calculator className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                    Mathematical & Chemical Equation
                  </span>
                </div>
                <div className="py-2 text-center overflow-x-auto text-emerald-950 dark:text-emerald-200 font-bold text-base sm:text-lg">
                  <MathMarkdown content={trimmed} />
                </div>
              </div>
            );
          }

          // Callout / Quote Box (> ) - Categorized into Form 1 Chemistry Textbook Cards
          if (trimmed.startsWith('> ')) {
            const quoteContent = trimmed.replace(/^>\s+/gm, '');
            const lower = quoteContent.toLowerCase();
            const isFormula =
              lower.includes('formula') ||
              lower.includes('ram =') ||
              lower.includes('density') ||
              lower.includes('mass') ||
              lower.includes('v = i') ||
              lower.includes('neutrons =') ||
              lower.includes('moles');
            const isExamTip =
              lower.includes('exam') ||
              lower.includes('tip') ||
              lower.includes('golden rule') ||
              lower.includes('maneb') ||
              lower.includes('caution') ||
              lower.includes('rule:');
            const isLocalContext =
              lower.includes('malawi') ||
              lower.includes('feteleza') ||
              lower.includes('lake') ||
              lower.includes('escom') ||
              lower.includes('illovo') ||
              lower.includes('chimanga') ||
              lower.includes('nsima');

            // 1. Scientific Formula Box
            if (isFormula) {
              return (
                <div
                  key={bIdx}
                  className="my-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white border-2 border-emerald-300 p-4 sm:p-5 shadow-2xs"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Calculator className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
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
                <div
                  key={bIdx}
                  className="my-4 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-50/50 to-white border-2 border-amber-300 p-4 sm:p-5 shadow-2xs"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Star className="w-3.5 h-3.5 fill-white" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900">
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
                <div
                  key={bIdx}
                  className="my-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/40 to-white border-2 border-sky-300 p-4 sm:p-5 shadow-2xs"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-sky-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-sky-900">
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
              <div
                key={bIdx}
                className="my-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-emerald-50/20 to-white border-l-4 border-l-emerald-600 border border-emerald-200/90 p-4 sm:p-5 shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                    Definition & Core Concept
                  </span>
                </div>
                <div className="text-sm sm:text-base font-medium text-neutral-900 pl-6 leading-relaxed">
                  <MathMarkdown content={quoteContent} />
                </div>
              </div>
            );
          }

          // Tables (| col1 | col2 |) -> Form 1 Chemistry Table Design
          if (trimmed.startsWith('|')) {
            const lines = trimmed.split('\n').filter((l) => l.includes('|') && !l.includes(':---'));
            if (lines.length > 0) {
              const headers = lines[0].split('|').map((c) => c.trim()).filter(Boolean);
              const rows = lines.slice(1).map((line) => line.split('|').map((c) => c.trim()).filter(Boolean));

              return (
                <div
                  key={bIdx}
                  className="overflow-x-auto my-4 rounded-2xl border border-emerald-200/90 bg-white shadow-2xs"
                >
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-emerald-800 text-white border-b border-emerald-900">
                        {headers.map((h, hIdx) => (
                          <th
                            key={hIdx}
                            className="py-3 px-4 font-bold text-xs uppercase tracking-wider text-emerald-50"
                          >
                            {formatInline(h)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className={
                            rIdx % 2 === 0
                              ? 'bg-white hover:bg-emerald-50/40 transition-colors'
                              : 'bg-emerald-50/20 hover:bg-emerald-50/50 transition-colors'
                          }
                        >
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="py-2.5 px-4 text-neutral-800">
                              {formatInline(cell)}
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

          // Bullet List (- or • or *) -> Render as crisp concept cards
          if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
            const items = trimmed
              .split(/\n(?=[-•*]\s)/)
              .map((item) => item.replace(/^[-•*]\s+/, '').trim())
              .filter(Boolean);
            const isMulti = items.length > 2;

            return (
              <div key={bIdx} className={`grid ${isMulti ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-3 my-3`}>
                {items.map((item, iIdx) => {
                  const parts = item.split(/\s+–\s+|\s+-\s+/);
                  const titlePart =
                    parts.length > 1 ? parts[0]?.replace(/\*\*/g, '').replace(/^[^\w\s]+\s*/, '') : null;
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
                              {formatInline(titlePart)}
                            </span>
                            <span className="text-neutral-700 font-normal">
                              {formatInline(descPart)}
                            </span>
                          </>
                        ) : (
                          <span className="font-medium text-neutral-800">
                            {formatInline(item)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }

          // Numbered List (1. 2. 3.) -> Step-by-step procedure cards with green badge
          if (/^\d+\.\s/.test(trimmed)) {
            const items = trimmed
              .split(/\n(?=\d+\.\s)/)
              .map((item) => item.replace(/^\d+\.\s+/, '').trim())
              .filter(Boolean);
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
                              {formatInline(titlePart)}
                            </span>
                            <span className="text-neutral-700 font-normal">
                              {formatInline(descPart)}
                            </span>
                          </>
                        ) : (
                          <span className="font-medium text-neutral-800">
                            {formatInline(item)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }

          // Worked Example Block (**Example:** or **Worked Example**)
          const isExampleBlock =
            trimmed.toLowerCase().startsWith('**example') ||
            trimmed.toLowerCase().startsWith('**worked example') ||
            trimmed.toLowerCase().startsWith('**problem:');

          if (isExampleBlock) {
            const lines = trimmed.split('\n');
            const header = lines[0]?.replace(/\*\*/g, '').replace(/:$/, '') || 'Worked Example';
            const body = lines.slice(1).join('\n');

            return (
              <div
                key={bIdx}
                className="my-4 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-teal-50/20 to-white border border-emerald-200/90 p-4 sm:p-5 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <FlaskConical className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                    {header}
                  </span>
                </div>
                {body ? (
                  <div className="text-xs sm:text-sm text-neutral-800 pl-8 leading-relaxed font-medium space-y-1.5">
                    {body.split('\n').map((l, lIdx) => (
                      <div key={lIdx} className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                        {formatInline(l.trim())}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm text-neutral-800 pl-8 leading-relaxed font-medium">
                    {formatInline(trimmed)}
                  </div>
                )}
              </div>
            );
          }

          // Term Definition Cards (**Term:** definition)
          const isTermBlock =
            trimmed.includes('**') &&
            (/^\s*\*\*[^*]+(?::|\s*–|\s*-)\*\*/.test(trimmed) || /^\s*\*\*\d+\.\s+[^*]+(?::|\s*–|\s*-)\*\*/.test(trimmed));

          if (isTermBlock) {
            const termLines = trimmed.split(/\n(?=\s*(?:\*\*\d+\.|\*\*))/).filter((l) => l.trim().length > 0);
            return (
              <div key={bIdx} className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-3.5">
                {termLines.map((tLine, tIdx) => {
                  const match = tLine.match(/^\s*\*\*([^*]+)\*\*(.*)$/);
                  const termTitle = match ? match[1].replace(/^\d+\.\s*/, '').replace(/:$/, '').trim() : null;
                  const termDesc = match ? match[2].replace(/^[:–-]\s*/, '').trim() : tLine;

                  return (
                    <div
                      key={tIdx}
                      className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-emerald-400 hover:shadow-xs transition-all shadow-2xs space-y-1.5"
                    >
                      {termTitle ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                            <span className="font-extrabold text-sm text-emerald-950 dark:text-emerald-300">
                              {termTitle}
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal pl-4">
                            {formatInline(termDesc)}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium">
                          {formatInline(tLine)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          }

          // Key Concept Card (definitions, core laws, principles)
          const isKeyConcept =
            trimmed.toLowerCase().includes('defined as') ||
            trimmed.toLowerCase().includes('states that') ||
            trimmed.toLowerCase().includes('principle:') ||
            trimmed.toLowerCase().includes('golden rule') ||
            trimmed.toLowerCase().includes('remember that');

          if (isKeyConcept) {
            return (
              <div
                key={bIdx}
                className="my-3.5 p-4 sm:p-5 rounded-2xl bg-white border-l-4 border-l-emerald-600 border border-neutral-200/90 shadow-2xs hover:border-emerald-300 transition-all flex items-start gap-3.5"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div className="space-y-1 text-xs sm:text-sm leading-relaxed text-neutral-800 flex-1">
                  <div className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                    Key Concept & Principle
                  </div>
                  <div className="font-semibold text-neutral-900 text-sm sm:text-base leading-relaxed">
                    {formatInline(trimmed)}
                  </div>
                </div>
              </div>
            );
          }

          // Multi-Sentence Paragraph -> Formatted into clean flow cards
          const sentences = trimmed.split(/(?<=[.!?])\s+(?=[A-Z0-9])/).filter((s) => s.trim().length > 0);
          if (sentences.length > 1) {
            return (
              <div
                key={bIdx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2.5 my-3"
              >
                {sentences.map((sentence, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-neutral-800 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0 opacity-80" />
                    <span className="flex-1">{formatInline(sentence)}</span>
                  </div>
                ))}
              </div>
            );
          }

          // Default Single Scannable Statement
          return (
            <div
              key={bIdx}
              className="p-4 sm:p-4.5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-start gap-3 my-2.5"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0 shadow-xs" />
              <div className="text-neutral-900 text-xs sm:text-sm font-semibold leading-relaxed flex-1">
                {formatInline(trimmed)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-black rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs p-4 sm:p-6 space-y-6 antialiased">
      {/* Action Controls: Listen (TTS) & Copy */}
      {(onToggleSpeak || onCopy) && (
        <div className="flex items-center justify-end gap-2 pb-1">
          {onToggleSpeak && (
            <button
              type="button"
              onClick={() => onToggleSpeak(messageId, content)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                speakingId === messageId
                  ? 'bg-amber-100 dark:bg-black text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'bg-white dark:bg-black hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 shadow-2xs'
              }`}
              title={speakingId === messageId ? 'Stop listening' : 'Listen to lesson explanation'}
            >
              {speakingId === messageId ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 animate-pulse" />
                  <span className="text-xs">Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
                  <span className="text-xs">Listen</span>
                </>
              )}
            </button>
          )}

          {onCopy && (
            <button
              type="button"
              onClick={() => onCopy(messageId, content)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-black hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Copy lesson to clipboard"
            >
              {copiedId === messageId ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Top Chapter Banner Header */}
      <div className="bg-white dark:bg-black border border-neutral-200/90 dark:border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-2xs space-y-2">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="px-3 py-1 rounded-lg bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-2xs flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>STUDYMASTER ASSIST LESSON</span>
          </div>
          <div className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-black border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-extrabold tracking-wide flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>MANEB CURRICULUM GROUNDED</span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
          {doc.mainTitle}
        </h2>

        {doc.introSummary && (
          <div className="pt-1 text-xs sm:text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed font-medium">
            <MathMarkdown content={doc.introSummary} />
          </div>
        )}
      </div>

      {/* 3. Learning Objectives Box ("What You Will Learn") */}
      {doc.learningObjectives.length > 0 && (
        <div className="bg-gradient-to-br from-[#f0fdf4] via-emerald-50/40 to-white dark:from-black dark:via-black dark:to-black dark:bg-black border-2 border-emerald-300 dark:border-emerald-700 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200 font-black text-sm sm:text-base">
            <Target className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>Learning Objectives</span>
          </div>
          <p className="text-xs text-emerald-900 dark:text-emerald-300 font-bold">
            By the end of this lesson, you should be able to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {doc.learningObjectives.map((obj, oIdx) => (
              <div
                key={oIdx}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/90 dark:bg-black border border-emerald-200 dark:border-emerald-800 shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm text-neutral-900 dark:text-white font-semibold leading-relaxed">
                  {formatInline(obj)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Numbered Textbook Study Sections (1.0, 2.0, 3.0) */}
      <div className="space-y-6">
        {doc.sections.map((section) => (
          <div
            key={section.id}
            className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-black border border-neutral-200/90 dark:border-neutral-800 shadow-2xs space-y-4"
          >
            {/* Numbered Section Header */}
            <div className="flex items-center gap-3.5 pb-3 border-b-2 border-emerald-100 dark:border-neutral-800">
              <div className="px-3 py-1 rounded-xl bg-emerald-700 text-white font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-xs">
                {section.sectionNumber}
              </div>
              <h3 className="text-base sm:text-xl font-black text-neutral-900 dark:text-white tracking-tight">
                {section.title}
              </h3>
            </div>

            {/* Section Content */}
            <div className="pt-1">
              {renderSectionBlocks(section.content, section.sectionNumber)}
            </div>
          </div>
        ))}
      </div>

      {/* 5. Chapter Review & Key Takeaway Box */}
      {doc.keyTakeaway && (
        <div className="bg-gradient-to-r from-[#f0fdf4] via-emerald-50/60 to-white dark:from-black dark:via-black dark:to-black dark:bg-black border-2 border-emerald-300 dark:border-emerald-700 rounded-3xl p-5 sm:p-6 shadow-2xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="font-black text-sm sm:text-base text-emerald-950 dark:text-emerald-200">
              Chapter Review & Key Takeaway
            </h4>
            <div className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
              <MathMarkdown content={doc.keyTakeaway} />
            </div>
          </div>
        </div>
      )}

      {/* 6. Interactive Quick Check Review Questions */}
      {doc.quickCheckList.length > 0 && (
        <div className="bg-white dark:bg-black rounded-3xl border border-neutral-200/90 dark:border-neutral-800 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <CheckSquare className="w-4 h-4" />
              </div>
              <h4 className="font-black text-sm sm:text-base text-neutral-900 dark:text-white">
                Quick Check Review (Test Understanding)
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setShowAllAnswers(!showAllAnswers)}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 flex items-center gap-1.5 py-1 px-3 rounded-xl bg-emerald-50 dark:bg-black border border-transparent dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-neutral-900 transition cursor-pointer"
            >
              {showAllAnswers ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide All Answers</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Reveal All Answers</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            {doc.quickCheckList.map((qc, qIdx) => {
              const qKey = `qc-${messageId}-${qIdx}`;
              const isRevealed = showAllAnswers || revealedAnswers[qKey];

              return (
                <div
                  key={qIdx}
                  className="p-3.5 rounded-2xl bg-neutral-50/70 dark:bg-black border border-neutral-200/80 dark:border-neutral-800 space-y-2"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      {qIdx + 1}
                    </div>
                    <div className="text-xs sm:text-sm text-neutral-900 dark:text-white font-semibold leading-snug flex-1">
                      {formatInline(qc.question)}
                    </div>
                  </div>

                  {/* Interactive Student Answer Check */}
                  <div className="ml-7 space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type your answer to check with AI..."
                        value={studentDrafts[qKey] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStudentDrafts((prev) => ({ ...prev, [qKey]: val }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && studentDrafts[qKey]?.trim() && onAnswerQuickCheck) {
                            onAnswerQuickCheck(qc.question, studentDrafts[qKey].trim());
                          }
                        }}
                        className="flex-1 text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-400 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                      />
                      {onAnswerQuickCheck && (
                        <button
                          type="button"
                          disabled={!studentDrafts[qKey]?.trim()}
                          onClick={() => {
                            if (studentDrafts[qKey]?.trim()) {
                              onAnswerQuickCheck(qc.question, studentDrafts[qKey].trim());
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-2xs shrink-0"
                        >
                          <Send className="w-3 h-3" />
                          <span>Check</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {qc.answer ? (
                    isRevealed ? (
                      <div className="ml-7 p-3 rounded-xl bg-emerald-50 dark:bg-black border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 font-medium leading-relaxed">
                        <strong className="text-emerald-900 dark:text-emerald-300 font-bold block mb-0.5">Answer:</strong>
                        {formatInline(qc.answer)}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleSingleAnswer(qKey)}
                        className="ml-7 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 py-0.5 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Tap to reveal answer</span>
                      </button>
                    )
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Follow-up Action Chips with StudyMaster Assist */}
      {onQuickPrompt && (
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
            Ask StudyMaster Assist to continue:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Explain in simpler terms', icon: Lightbulb },
              { label: 'Explain with Chichewa analogies', icon: Globe },
              { label: 'Give me a practice question', icon: CheckCircle2 },
              { label: 'Show step-by-step breakdown', icon: HelpCircle }
            ].map((chip, idx) => {
              const Icon = chip.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onQuickPrompt(chip.label)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-neutral-700 dark:text-neutral-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
