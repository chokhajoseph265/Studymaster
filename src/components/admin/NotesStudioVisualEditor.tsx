import React from 'react';
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  BookOpen,
  Star,
  Calculator,
  Compass,
  List,
  FileText,
  Layers,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export interface VisualBlock {
  id: string;
  type:
    | 'paragraph'
    | 'subtopic'
    | 'definition'
    | 'exam_tip'
    | 'formula'
    | 'malawi_context'
    | 'bullets'
    | 'worked_example';
  title?: string;
  text?: string;
  items?: string[];
}

export interface VisualSection {
  id: string;
  sectionNumber?: string;
  title: string;
  blocks: VisualBlock[];
}

/**
 * Parses existing markdown text into structured visual sections and blocks,
 * allowing teachers to edit with ZERO programming or markdown codes.
 */
export function parseMarkdownToSections(content: string = ''): VisualSection[] {
  if (!content || !content.trim()) {
    return [
      {
        id: 'sec-1',
        sectionNumber: '1.0',
        title: 'Introduction & Overview',
        blocks: [
          {
            id: 'blk-1',
            type: 'paragraph',
            text: 'Write the lesson introduction here in natural, simple English.'
          },
          {
            id: 'blk-2',
            type: 'definition',
            title: 'Core Concept',
            text: 'State the official scientific or mathematical definition here.'
          }
        ]
      }
    ];
  }

  // Split content by ## headings
  const rawSections = content.split(/(?=^##\s)/gm);
  const sections: VisualSection[] = [];

  rawSections.forEach((sec, sIdx) => {
    const lines = sec.trim().split('\n');
    const headerLine = lines[0] || '';
    const isH2 = headerLine.startsWith('## ');

    let title = `Section ${sIdx + 1}`;
    let sectionNumber = `${sIdx + 1}.0`;
    let bodyText = sec.trim();

    if (isH2) {
      const rawTitle = headerLine.replace(/^##\s+/, '').trim();
      const numMatch = rawTitle.match(/^(\d+(?:\.\d+)?)\.?\s*(.*)$/);
      if (numMatch) {
        sectionNumber = numMatch[1].includes('.') ? numMatch[1] : `${numMatch[1]}.0`;
        title = numMatch[2] || `Section ${sIdx + 1}`;
      } else {
        title = rawTitle;
      }
      bodyText = lines.slice(1).join('\n').trim();
    }

    const rawBlocks = bodyText.split(/\n\n+/);
    const blocks: VisualBlock[] = [];

    rawBlocks.forEach((b, bIdx) => {
      const trimmed = b.trim();
      if (!trimmed) return;

      const blockId = `b-${sIdx}-${bIdx}-${Math.random().toString(36).substring(2, 6)}`;

      // 1. Exam Tip
      if (
        trimmed.startsWith('> ') &&
        (trimmed.toLowerCase().includes('exam') ||
          trimmed.toLowerCase().includes('tip') ||
          trimmed.toLowerCase().includes('maneb') ||
          trimmed.toLowerCase().includes('caution'))
      ) {
        const clean = trimmed
          .replace(/^>\s+/gm, '')
          .replace(/^\*\*MSCE\s*\/?\s*JCE\s*Exam\s*Tip:\*\*\s*/i, '')
          .replace(/^\*\*Exam\s*Tip:\*\*\s*/i, '')
          .replace(/^\*\*Examiner's\s*Note:\*\*\s*/i, '')
          .trim();
        blocks.push({
          id: blockId,
          type: 'exam_tip',
          text: clean
        });
        return;
      }

      // 2. Definition
      if (trimmed.startsWith('> ') && trimmed.toLowerCase().includes('definition')) {
        const clean = trimmed.replace(/^>\s+/gm, '');
        const matchTitle = clean.match(/^\*\*Definition(?::\s*([^*]+))?:\*\*\s*(.*)$/i);
        blocks.push({
          id: blockId,
          type: 'definition',
          title: matchTitle ? matchTitle[1]?.trim() || '' : '',
          text: matchTitle
            ? matchTitle[2]?.trim() || clean
            : clean.replace(/^\*\*Definition:\*\*\s*/i, '').trim()
        });
        return;
      }

      // 3. Formula
      if (
        trimmed.startsWith('> ') &&
        (trimmed.toLowerCase().includes('formula') ||
          trimmed.toLowerCase().includes('ram =') ||
          trimmed.toLowerCase().includes('equation') ||
          trimmed.toLowerCase().includes('v = i') ||
          trimmed.toLowerCase().includes('density'))
      ) {
        const clean = trimmed.replace(/^>\s+/gm, '');
        const matchTitle = clean.match(/^\*\*Formula(?::\s*([^*]+))?:\*\*\s*(.*)$/i);
        blocks.push({
          id: blockId,
          type: 'formula',
          title: matchTitle ? matchTitle[1]?.trim() || '' : '',
          text: matchTitle
            ? matchTitle[2]?.trim() || clean
            : clean.replace(/^\*\*Formula:\*\*\s*/i, '').trim()
        });
        return;
      }

      // 4. Malawi Context
      if (
        trimmed.startsWith('> ') &&
        (trimmed.toLowerCase().includes('malawi') ||
          trimmed.toLowerCase().includes('environment') ||
          trimmed.toLowerCase().includes('escom') ||
          trimmed.toLowerCase().includes('lake'))
      ) {
        const clean = trimmed
          .replace(/^>\s+/gm, '')
          .replace(/^\*\*In\s*Our\s*Malawian\s*Environment:\*\*\s*/i, '')
          .trim();
        blocks.push({
          id: blockId,
          type: 'malawi_context',
          text: clean
        });
        return;
      }

      // 5. Worked Example
      if (trimmed.startsWith('> ') && trimmed.toLowerCase().includes('example')) {
        const clean = trimmed.replace(/^>\s+/gm, '');
        blocks.push({
          id: blockId,
          type: 'worked_example',
          title: 'Sample Problem',
          text: clean.replace(/^\*\*Worked\s*Example:\*\*\s*/i, '').trim()
        });
        return;
      }

      // 6. Subtopic (###)
      if (trimmed.startsWith('### ')) {
        const subLines = trimmed.split('\n');
        const subTitle = subLines[0].replace(/^###\s+/, '').trim();
        const subRest = subLines.slice(1).join('\n').trim();
        blocks.push({
          id: blockId,
          type: 'subtopic',
          title: subTitle,
          text: subRest
        });
        return;
      }

      // 7. Bullet list (- or *)
      const bLines = trimmed.split('\n').filter((l) => l.trim().length > 0);
      if (bLines.length > 0 && bLines.every((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '))) {
        const items = bLines.map((l) => l.replace(/^[-*]\s+/, '').trim()).filter(Boolean);
        blocks.push({
          id: blockId,
          type: 'bullets',
          items: items.length > 0 ? items : ['First important point']
        });
        return;
      }

      // 8. General paragraph
      blocks.push({
        id: blockId,
        type: 'paragraph',
        text: trimmed
      });
    });

    if (blocks.length === 0) {
      blocks.push({
        id: `b-${sIdx}-empty`,
        type: 'paragraph',
        text: bodyText || ''
      });
    }

    sections.push({
      id: `sec-${sIdx}-${Math.random().toString(36).substring(2, 6)}`,
      sectionNumber,
      title: title || `Section ${sIdx + 1}`,
      blocks
    });
  });

  return sections.length > 0
    ? sections
    : [
        {
          id: 'sec-1',
          sectionNumber: '1.0',
          title: 'Introduction & Overview',
          blocks: [
            {
              id: 'blk-1',
              type: 'paragraph',
              text: 'Write the lesson introduction here in natural, simple English.'
            }
          ]
        }
      ];
}

/**
 * Converts visual sections and blocks back into standard textbook markdown behind the scenes,
 * guaranteeing 100% design fidelity in the student app.
 */
export function sectionsToMarkdown(sections: VisualSection[]): string {
  return sections
    .map((sec, idx) => {
      const num = `${idx + 1}.0`;
      const cleanTitle = sec.title.trim() ? sec.title.trim() : `Section ${idx + 1}`;
      const header = `## ${num} ${cleanTitle}`;

      const blockTexts = sec.blocks
        .map((b) => {
          switch (b.type) {
            case 'paragraph':
              return b.text?.trim() || '';

            case 'subtopic':
              return `### ${b.title?.trim() || 'Subtopic'}${
                b.text?.trim() ? `\n\n${b.text.trim()}` : ''
              }`;

            case 'definition':
              if (b.title?.trim()) {
                return `> **Definition: ${b.title.trim()}**\n> ${b.text?.trim() || ''}`;
              }
              return `> **Definition:** ${b.text?.trim() || ''}`;

            case 'exam_tip':
              return `> **MSCE / JCE Exam Tip:** ${b.text?.trim() || ''}`;

            case 'formula':
              if (b.title?.trim()) {
                return `> **Formula: ${b.title.trim()}**\n> ${b.text?.trim() || ''}`;
              }
              return `> **Formula:** ${b.text?.trim() || ''}`;

            case 'malawi_context':
              return `> **In Our Malawian Environment:** ${b.text?.trim() || ''}`;

            case 'worked_example':
              return `> **Worked Example: ${b.title?.trim() || 'Problem & Calculation'}**\n> ${
                b.text?.trim() || ''
              }`;

            case 'bullets':
              return (b.items || [])
                .filter((it) => it.trim().length > 0)
                .map((it) => `- ${it.trim()}`)
                .join('\n');

            default:
              return b.text?.trim() || '';
          }
        })
        .filter((t) => t.length > 0);

      return `${header}\n\n${blockTexts.join('\n\n')}`;
    })
    .join('\n\n');
}

interface NotesStudioVisualEditorProps {
  sections: VisualSection[];
  onChange: (updatedSections: VisualSection[]) => void;
}

export const NotesStudioVisualEditor: React.FC<NotesStudioVisualEditorProps> = ({
  sections,
  onChange
}) => {
  // Update section title
  const handleUpdateSectionTitle = (secIndex: number, newTitle: string) => {
    const updated = [...sections];
    updated[secIndex] = {
      ...updated[secIndex],
      title: newTitle
    };
    onChange(updated);
  };

  // Move section up
  const handleMoveSectionUp = (secIndex: number) => {
    if (secIndex === 0) return;
    const updated = [...sections];
    const temp = updated[secIndex];
    updated[secIndex] = updated[secIndex - 1];
    updated[secIndex - 1] = temp;
    onChange(updated);
  };

  // Move section down
  const handleMoveSectionDown = (secIndex: number) => {
    if (secIndex === sections.length - 1) return;
    const updated = [...sections];
    const temp = updated[secIndex];
    updated[secIndex] = updated[secIndex + 1];
    updated[secIndex + 1] = temp;
    onChange(updated);
  };

  // Delete section
  const handleDeleteSection = (secIndex: number) => {
    if (sections.length <= 1) {
      alert('A note must have at least one section.');
      return;
    }
    if (window.confirm(`Delete Section ${secIndex + 1}?`)) {
      const updated = sections.filter((_, idx) => idx !== secIndex);
      onChange(updated);
    }
  };

  // Add new section
  const handleAddSection = () => {
    const newNum = `${sections.length + 1}.0`;
    const newSec: VisualSection = {
      id: `sec-${Date.now()}`,
      sectionNumber: newNum,
      title: `Core Concepts & Principles`,
      blocks: [
        {
          id: `b-${Date.now()}-1`,
          type: 'paragraph',
          text: 'Type your explanation for this section here...'
        }
      ]
    };
    onChange([...sections, newSec]);
  };

  // Add block to a section
  const handleAddBlock = (secIndex: number, type: VisualBlock['type']) => {
    const updated = [...sections];
    const sec = updated[secIndex];
    const newBlockId = `b-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    let newBlock: VisualBlock;
    switch (type) {
      case 'definition':
        newBlock = {
          id: newBlockId,
          type: 'definition',
          title: 'Term to Define',
          text: 'Definition or fundamental meaning...'
        };
        break;
      case 'exam_tip':
        newBlock = {
          id: newBlockId,
          type: 'exam_tip',
          text: 'Important point or common mistake to avoid in MANEB MSCE/JCE examinations.'
        };
        break;
      case 'formula':
        newBlock = {
          id: newBlockId,
          type: 'formula',
          title: 'Formula Name',
          text: 'Formula equation or relationship (e.g. Density = Mass / Volume)'
        };
        break;
      case 'malawi_context':
        newBlock = {
          id: newBlockId,
          type: 'malawi_context',
          text: 'How this applies in Malawi (e.g. Lake Malawi, agriculture, ESCOM power, local climate).'
        };
        break;
      case 'bullets':
        newBlock = {
          id: newBlockId,
          type: 'bullets',
          items: ['First key point or observation', 'Second key point or observation']
        };
        break;
      case 'subtopic':
        newBlock = {
          id: newBlockId,
          type: 'subtopic',
          title: 'Subtopic Title',
          text: 'Breakdown of this specific subtopic...'
        };
        break;
      case 'worked_example':
        newBlock = {
          id: newBlockId,
          type: 'worked_example',
          title: 'Sample Exam Problem',
          text: 'Step 1: Write known values\nStep 2: Apply formula\nStep 3: State final answer with proper SI units'
        };
        break;
      default:
        newBlock = {
          id: newBlockId,
          type: 'paragraph',
          text: 'Type your explanation paragraph here...'
        };
    }

    updated[secIndex] = {
      ...sec,
      blocks: [...sec.blocks, newBlock]
    };
    onChange(updated);
  };

  // Update block content
  const handleUpdateBlock = (
    secIndex: number,
    blockIndex: number,
    updates: Partial<VisualBlock>
  ) => {
    const updated = [...sections];
    const sec = updated[secIndex];
    const newBlocks = [...sec.blocks];
    newBlocks[blockIndex] = {
      ...newBlocks[blockIndex],
      ...updates
    };
    updated[secIndex] = {
      ...sec,
      blocks: newBlocks
    };
    onChange(updated);
  };

  // Delete block
  const handleDeleteBlock = (secIndex: number, blockIndex: number) => {
    const updated = [...sections];
    const sec = updated[secIndex];
    if (sec.blocks.length <= 1) {
      // Just clear block text instead of leaving empty section
      const newBlocks = [...sec.blocks];
      newBlocks[0] = { ...newBlocks[0], text: '' };
      updated[secIndex] = { ...sec, blocks: newBlocks };
      onChange(updated);
      return;
    }
    updated[secIndex] = {
      ...sec,
      blocks: sec.blocks.filter((_, idx) => idx !== blockIndex)
    };
    onChange(updated);
  };

  // Handle adding bullet item
  const handleAddBulletItem = (secIndex: number, blockIndex: number) => {
    const updated = [...sections];
    const block = updated[secIndex].blocks[blockIndex];
    const currentItems = block.items || [];
    handleUpdateBlock(secIndex, blockIndex, {
      items: [...currentItems, 'New point or observation']
    });
  };

  // Handle updating bullet item
  const handleUpdateBulletItem = (
    secIndex: number,
    blockIndex: number,
    itemIndex: number,
    value: string
  ) => {
    const updated = [...sections];
    const block = updated[secIndex].blocks[blockIndex];
    const currentItems = [...(block.items || [])];
    currentItems[itemIndex] = value;
    handleUpdateBlock(secIndex, blockIndex, { items: currentItems });
  };

  // Handle removing bullet item
  const handleRemoveBulletItem = (
    secIndex: number,
    blockIndex: number,
    itemIndex: number
  ) => {
    const updated = [...sections];
    const block = updated[secIndex].blocks[blockIndex];
    const currentItems = (block.items || []).filter((_, idx) => idx !== itemIndex);
    handleUpdateBlock(secIndex, blockIndex, { items: currentItems });
  };

  return (
    <div className="space-y-6">
      {/* Intro info banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-emerald-950">
              Visual Note Builder (Zero Code Required)
            </h4>
            <p className="text-xs text-emerald-800">
              Type naturally in the labeled boxes below. The app handles all styling, badges, and textbook cards automatically.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full shrink-0 border border-emerald-300/60">
          Easy Mode Active
        </span>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {sections.map((section, sIdx) => {
          const sectionNum = `${sIdx + 1}.0`;
          return (
            <div
              key={section.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm space-y-5 transition-all hover:border-emerald-300"
            >
              {/* Section Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 flex-1 min-w-[260px]">
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-700 text-white font-mono font-black text-xs tracking-wider shadow-2xs">
                    {sectionNum}
                  </span>
                  <div className="flex-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleUpdateSectionTitle(sIdx, e.target.value)}
                      placeholder="e.g. Introduction to Topic, Chemical Reactions, Physical Properties"
                      className="w-full text-base sm:text-lg font-extrabold text-slate-900 border-b border-slate-200 pb-0.5 focus:outline-none focus:border-emerald-600 bg-transparent placeholder:text-slate-300"
                    />
                  </div>
                </div>

                {/* Section Reorder & Delete Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveSectionUp(sIdx)}
                    disabled={sIdx === 0}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move section up"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveSectionDown(sIdx)}
                    disabled={sIdx === sections.length - 1}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move section down"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(sIdx)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer ml-1"
                    title="Delete entire section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Blocks inside Section */}
              <div className="space-y-4">
                {section.blocks.map((block, bIdx) => {
                  return (
                    <div
                      key={block.id}
                      className="p-4 rounded-2xl border transition-all relative group"
                      style={{
                        backgroundColor:
                          block.type === 'exam_tip'
                            ? '#fffbeb'
                            : block.type === 'definition'
                            ? '#f0fdf4'
                            : block.type === 'formula'
                            ? '#f0fdfa'
                            : block.type === 'malawi_context'
                            ? '#f0f9ff'
                            : block.type === 'worked_example'
                            ? '#fdf4ff'
                            : block.type === 'bullets'
                            ? '#fafaf9'
                            : '#ffffff',
                        borderColor:
                          block.type === 'exam_tip'
                            ? '#fde68a'
                            : block.type === 'definition'
                            ? '#bbf7d0'
                            : block.type === 'formula'
                            ? '#99f6e4'
                            : block.type === 'malawi_context'
                            ? '#bae6fd'
                            : block.type === 'worked_example'
                            ? '#f5d0fe'
                            : block.type === 'bullets'
                            ? '#e7e5e4'
                            : '#e2e8f0'
                      }}
                    >
                      {/* Top label & delete block */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          {block.type === 'exam_tip' && (
                            <>
                              <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                              <span className="text-amber-900 font-black">
                                MSCE / JCE Exam Tip (Golden Card in App)
                              </span>
                            </>
                          )}
                          {block.type === 'definition' && (
                            <>
                              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                              <span className="text-emerald-900 font-black">
                                Core Definition (Highlighted Card in App)
                              </span>
                            </>
                          )}
                          {block.type === 'formula' && (
                            <>
                              <Calculator className="w-3.5 h-3.5 text-teal-700" />
                              <span className="text-teal-900 font-black">
                                Scientific Formula & Calculation
                              </span>
                            </>
                          )}
                          {block.type === 'malawi_context' && (
                            <>
                              <Compass className="w-3.5 h-3.5 text-sky-700" />
                              <span className="text-sky-900 font-black">
                                In Our Malawian Environment (Compass Card)
                              </span>
                            </>
                          )}
                          {block.type === 'subtopic' && (
                            <>
                              <Layers className="w-3.5 h-3.5 text-emerald-700" />
                              <span className="text-emerald-950 font-black">
                                Subtopic Heading (e.g. 1.1, 1.2)
                              </span>
                            </>
                          )}
                          {block.type === 'bullets' && (
                            <>
                              <List className="w-3.5 h-3.5 text-slate-700" />
                              <span className="text-slate-900 font-black">
                                Key Bullet Points (Checkmark Cards in App)
                              </span>
                            </>
                          )}
                          {block.type === 'worked_example' && (
                            <>
                              <HelpCircle className="w-3.5 h-3.5 text-purple-700" />
                              <span className="text-purple-900 font-black">
                                Worked Exam Example
                              </span>
                            </>
                          )}
                          {block.type === 'paragraph' && (
                            <>
                              <FileText className="w-3.5 h-3.5 text-slate-600" />
                              <span className="text-slate-700 font-black">
                                Lesson Explanation (Normal Text)
                              </span>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(sIdx, bIdx)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition cursor-pointer"
                          title="Remove this card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Content Form depending on block type */}

                      {/* 1. Definition Block */}
                      {block.type === 'definition' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={block.title || ''}
                            onChange={(e) =>
                              handleUpdateBlock(sIdx, bIdx, { title: e.target.value })
                            }
                            placeholder="Term / Concept (e.g. Matter, Photosynthesis, Velocity)"
                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-emerald-300 font-bold text-xs text-emerald-950 focus:outline-none focus:border-emerald-600"
                          />
                          <textarea
                            rows={3}
                            value={block.text || ''}
                            onChange={(e) =>
                              handleUpdateBlock(sIdx, bIdx, { text: e.target.value })
                            }
                            placeholder="Type the official definition here in clear, plain words..."
                            className="w-full p-3 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      )}

                      {/* 2. Exam Tip Block */}
                      {block.type === 'exam_tip' && (
                        <div>
                          <textarea
                            rows={3}
                            value={block.text || ''}
                            onChange={(e) =>
                              handleUpdateBlock(sIdx, bIdx, { text: e.target.value })
                            }
                            placeholder="What common mistakes should students watch out for in MANEB exams? (e.g. Remember to write SI units in final answers...)"
                            className="w-full p-3 rounded-xl bg-white border border-amber-300 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-amber-600"
                          />
                        </div>
                      )}

                      {/* 3. Formula Block */}
                      {block.type === 'formula' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={block.title || ''}
                            onChange={(e) =>
                              handleUpdateBlock(sIdx, bIdx, { title: e.target.value })
                            }
                            placeholder="Formula Name (e.g. Density Formula, Speed, Ohm's Law)"
                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-teal-300 font-bold text-xs text-teal-950 focus:outline-none focus:border-teal-600"
                          />
                          <input
                            type="text"
                            value={block.text || ''}
                            onChange={(e) =>
                              handleUpdateBlock(sIdx, bIdx, { text: e.target.value })
                            }
                            placeholder="Equation (e.g. Density = Mass / Volume, or V = I × R)"
                            className="w-full p-3 rounded-xl bg-white border border-teal-300 font-mono text-xs text-teal-950 focus:outline-none focus:border-teal-600"
                          />
                        </div>
                      )}

                      {/* 4. Malawi Context Block */}
                      {block.type === 'malawi_context' && (
                        <div>
                          <textarea
                            rows={3}
                            value={block.text || ''}
                            onChange={(e) =>
                              handleUpdateBlock(sIdx, bIdx, { text: e.target.value })
                            }
                            placeholder="Describe how this applies to daily life in Malawi (e.g. Lake Malawi ecosystem, ESCOM hydroelectric power, farming maize, fertilizer application)..."
                            className="w-full p-3 rounded-xl bg-white border border-sky-300 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-sky-600"
                          />
                        </div>
                      )}

                      {/* 5. Subtopic Block */}
                      {block.type === 'subtopic' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={block.title || ''}
                            onChange={(e) =>
                              handleUpdateBlock(sIdx, bIdx, { title: e.target.value })
                            }
                            placeholder="Subtopic Title (e.g. Properties of Solids, Types of Cells)"
                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-emerald-300 font-bold text-xs text-emerald-950 focus:outline-none focus:border-emerald-600"
                          />
                          <textarea
                            rows={3}
                            value={block.text || ''}
                            onChange={(e) =>
                              handleUpdateBlock(sIdx, bIdx, { text: e.target.value })
                            }
                            placeholder="Explanation for this subtopic..."
                            className="w-full p-3 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      )}

                      {/* 6. Bullets Block */}
                      {block.type === 'bullets' && (
                        <div className="space-y-2">
                          {(block.items || []).map((item, itIdx) => (
                            <div key={itIdx} className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                                ✓
                              </span>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) =>
                                  handleUpdateBulletItem(sIdx, bIdx, itIdx, e.target.value)
                                }
                                placeholder="Enter point or observation..."
                                className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveBulletItem(sIdx, bIdx, itIdx)}
                                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                title="Delete point"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddBulletItem(sIdx, bIdx)}
                            className="mt-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer py-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Another Point</span>
                          </button>
                        </div>
                      )}

                      {/* 7. Worked Example Block */}
                      {block.type === 'worked_example' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={block.title || ''}
                            onChange={(e) =>
                              handleUpdateBlock(sIdx, bIdx, { title: e.target.value })
                            }
                            placeholder="Problem Question (e.g. Calculate density of a 200g stone with volume 40cm³)"
                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-purple-300 font-bold text-xs text-purple-950 focus:outline-none focus:border-purple-600"
                          />
                          <textarea
                            rows={4}
                            value={block.text || ''}
                            onChange={(e) =>
                              handleUpdateBlock(sIdx, bIdx, { text: e.target.value })
                            }
                            placeholder="Step-by-step solution working..."
                            className="w-full p-3 rounded-xl bg-white border border-purple-300 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-purple-600"
                          />
                        </div>
                      )}

                      {/* 8. Regular Paragraph Block */}
                      {block.type === 'paragraph' && (
                        <div>
                          <textarea
                            rows={4}
                            value={block.text || ''}
                            onChange={(e) =>
                              handleUpdateBlock(sIdx, bIdx, { text: e.target.value })
                            }
                            placeholder="Type lesson explanation here in natural, easy-to-read English. No special symbols or codes needed!"
                            className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add New Block To This Section Bar */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                  + Add Element to this Section:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => handleAddBlock(sIdx, 'paragraph')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-600" />
                    <span>Text Explanation</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddBlock(sIdx, 'definition')}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span>+ Definition Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddBlock(sIdx, 'exam_tip')}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span>+ Exam Tip Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddBlock(sIdx, 'formula')}
                    className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5 text-teal-700" />
                    <span>+ Formula Box</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddBlock(sIdx, 'malawi_context')}
                    className="px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 text-sky-700" />
                    <span>+ Malawi Context</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddBlock(sIdx, 'bullets')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <List className="w-3.5 h-3.5 text-slate-600" />
                    <span>+ Bullet Points</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddBlock(sIdx, 'subtopic')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-600" />
                    <span>+ Subtopic</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Button to add a new chapter section */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleAddSection}
          className="w-full py-4 rounded-3xl bg-slate-50 hover:bg-emerald-50 border-2 border-dashed border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-900 font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer active:scale-99 shadow-2xs"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>Add Next Chapter Section (e.g. Section {sections.length + 1}.0)</span>
        </button>
      </div>
    </div>
  );
};
