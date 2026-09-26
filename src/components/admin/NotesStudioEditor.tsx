import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Save,
  X,
  Eye,
  Edit3,
  Columns,
  BookOpen,
  Sparkles,
  HelpCircle,
  Calculator,
  Star,
  Compass,
  FileText,
  List,
  ListOrdered,
  Bold,
  Italic,
  Code,
  Table as TableIcon,
  Plus,
  Trash2,
  UploadCloud,
  File,
  Image as ImageIcon,
  Music,
  Video,
  Layers,
  ChevronRight,
  Clock,
  Target,
  CheckCircle2,
  Info,
  Maximize2,
  Minimize2,
  Check
} from 'lucide-react';
import { NoteItem, Subject, Topic, FormLevel } from '../../types';
import { TextbookNoteView } from '../student/TextbookNoteView';
import {
  NotesStudioVisualEditor,
  parseMarkdownToSections,
  sectionsToMarkdown,
  VisualSection
} from './NotesStudioVisualEditor';

interface NotesStudioEditorProps {
  initialNote: Partial<NoteItem>;
  selectedForm: FormLevel;
  selectedSubject: Subject;
  selectedTopic: Topic;
  onSave: (savedNote: NoteItem) => Promise<void>;
  onCancel: () => void;
  onFileUpload?: (file: File, type: 'document' | 'image' | 'audio' | 'video') => Promise<void>;
}

export const NotesStudioEditor: React.FC<NotesStudioEditorProps> = ({
  initialNote,
  selectedForm,
  selectedSubject,
  selectedTopic,
  onSave,
  onCancel,
  onFileUpload
}) => {
  // Current note draft state
  const [draft, setDraft] = useState<Partial<NoteItem>>({
    ...initialNote,
    lessonBadge: initialNote.lessonBadge || 'CHAPTER LESSON',
    learningObjectives: initialNote.learningObjectives || [],
    estimatedReadTimeMinutes: initialNote.estimatedReadTimeMinutes || 5,
    noteFormat: initialNote.noteFormat || 'text'
  });

  // Builder mode: 'visual' (Zero code, intuitive labeled forms) or 'code' (raw markdown/latex)
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [visualSections, setVisualSections] = useState<VisualSection[]>(() =>
    parseMarkdownToSections(initialNote.content || '')
  );

  // Editor display mode: 'split' (side-by-side edit & app design), 'write' (editor only), 'preview' (student app design)
  const [viewMode, setViewMode] = useState<'split' | 'write' | 'preview'>('split');
  const [showSyntaxGuide, setShowSyntaxGuide] = useState<boolean>(false);
  const [newObjectiveText, setNewObjectiveText] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Attachment URL inputs
  const [docUrlInput, setDocUrlInput] = useState<string>(initialNote.documentUrl || '');
  const [imgUrlInput, setImgUrlInput] = useState<string>(initialNote.imageUrl || initialNote.diagramUrl || '');
  const [audioUrlInput, setAudioUrlInput] = useState<string>(initialNote.audioUrl || '');
  const [videoUrlInput, setVideoUrlInput] = useState<string>(initialNote.videoUrl || '');

  // File input refs
  const docFileRef = useRef<HTMLInputElement>(null);
  const imgFileRef = useRef<HTMLInputElement>(null);
  const audioFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);

  // Textarea ref for selection-aware formatting
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync draft if initialNote changes
  useEffect(() => {
    setDraft({
      ...initialNote,
      lessonBadge: initialNote.lessonBadge || 'CHAPTER LESSON',
      learningObjectives: initialNote.learningObjectives || [],
      estimatedReadTimeMinutes: initialNote.estimatedReadTimeMinutes || 5,
      noteFormat: initialNote.noteFormat || 'text'
    });
    setVisualSections(parseMarkdownToSections(initialNote.content || ''));
  }, [initialNote]);

  // Handler for visual editor updates - automatically syncs draft.content in real time
  const handleVisualSectionsChange = (newSections: VisualSection[]) => {
    setVisualSections(newSections);
    const generatedMarkdown = sectionsToMarkdown(newSections);
    setDraft((prev) => ({
      ...prev,
      content: generatedMarkdown
    }));
  };

  // Switch to visual mode with fresh parse of draft.content
  const handleSwitchToVisual = () => {
    setVisualSections(parseMarkdownToSections(draft.content || ''));
    setEditorMode('visual');
  };

  // Switch to raw code mode with serialized markdown
  const handleSwitchToCode = () => {
    setDraft((prev) => ({
      ...prev,
      content: sectionsToMarkdown(visualSections)
    }));
    setEditorMode('code');
  };

  // Extract sections from content in real-time for the jump navigator
  const contentSections = useMemo(() => {
    const content = draft.content || '';
    const matches: { title: string; lineIndex: number; sectionNum: string }[] = [];
    const lines = content.split('\n');

    let sectionCount = 1;
    lines.forEach((line, idx) => {
      if (line.startsWith('## ')) {
        const raw = line.replace(/^##\s+/, '').trim();
        const numMatch = raw.match(/^(\d+(?:\.\d+)?)\.?\s*(.*)$/);
        const sectionNum = numMatch ? numMatch[1] : `${sectionCount}.0`;
        const title = numMatch ? numMatch[2] : raw;
        matches.push({ title: title || `Section ${sectionCount}`, lineIndex: idx, sectionNum });
        sectionCount++;
      }
    });

    return matches;
  }, [draft.content]);

  // Stats: Word count and recommended read time
  const stats = useMemo(() => {
    const text = draft.content || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const recommendedMinutes = Math.max(2, Math.round(words / 140));
    return { words, recommendedMinutes };
  }, [draft.content]);

  // Handle auto-calculating reading time
  const handleAutoCalcReadTime = () => {
    setDraft((prev) => ({
      ...prev,
      estimatedReadTimeMinutes: stats.recommendedMinutes
    }));
  };

  // Helper to wrap selected text in textarea, or insert snippet at cursor
  const wrapSelection = (before: string, after: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      // Fallback
      setDraft((prev) => ({
        ...prev,
        content: prev.content ? `${prev.content}\n\n${before}${defaultPlaceholder}${after}` : `${before}${defaultPlaceholder}${after}`
      }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = draft.content || '';
    const selectedText = currentText.substring(start, end);

    const replacement = selectedText ? `${before}${selectedText}${after}` : `${before}${defaultPlaceholder}${after}`;

    const newContent = currentText.substring(0, start) + replacement + currentText.substring(end);
    setDraft((prev) => ({ ...prev, content: newContent }));

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursor = start + before.length + (selectedText ? selectedText.length : defaultPlaceholder.length);
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  // Insert a block snippet at the current line or cursor
  const insertBlock = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setDraft((prev) => ({
        ...prev,
        content: prev.content ? `${prev.content}\n\n${snippet}` : snippet
      }));
      return;
    }

    const start = textarea.selectionStart;
    const currentText = draft.content || '';

    // Check if we need leading/trailing newlines for clean separation
    const needsLeadingNewline = start > 0 && currentText[start - 1] !== '\n';
    const prefix = needsLeadingNewline ? '\n\n' : '';
    const suffix = '\n\n';

    const newContent = currentText.substring(0, start) + prefix + snippet + suffix + currentText.substring(start);
    setDraft((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      const nextPos = start + prefix.length + snippet.length + suffix.length;
      textarea.setSelectionRange(nextPos, nextPos);
    }, 10);
  };

  // Jump to section in textarea
  const handleJumpToSection = (lineIndex: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const lines = (draft.content || '').split('\n');
    let charOffset = 0;
    for (let i = 0; i < lineIndex && i < lines.length; i++) {
      charOffset += lines[i].length + 1;
    }

    textarea.focus();
    textarea.setSelectionRange(charOffset, charOffset + lines[lineIndex].length);

    // Scroll textarea to approximately that line
    const lineHeight = 20;
    textarea.scrollTop = Math.max(0, lineIndex * lineHeight - 60);
  };

  // Add learning objective
  const handleAddObjective = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newObjectiveText.trim()) return;

    const updated = [...(draft.learningObjectives || []), newObjectiveText.trim()];
    setDraft((prev) => ({ ...prev, learningObjectives: updated }));
    setNewObjectiveText('');
  };

  // Remove learning objective
  const handleRemoveObjective = (index: number) => {
    const updated = (draft.learningObjectives || []).filter((_, idx) => idx !== index);
    setDraft((prev) => ({ ...prev, learningObjectives: updated }));
  };

  // Handle Save
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title?.trim()) {
      alert('Please provide a note title.');
      return;
    }

    setIsSaving(true);
    try {
      const finalContent =
        draft.content?.trim() ||
        `## 1.0 Introduction to ${draft.title.trim()}\n\n*Comprehensive revision note for ${selectedForm} ${selectedSubject.name} on ${selectedTopic.title}.*`;

      const payload: NoteItem = {
        ...initialNote,
        id: draft.id || `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        topicId: selectedTopic.id,
        subjectId: selectedSubject.id,
        form: selectedForm,
        formLevel: selectedForm,
        title: draft.title.trim(),
        summary: draft.summary?.trim() || `${draft.title.trim()} (${selectedForm})`,
        content: finalContent,
        noteFormat: draft.noteFormat || 'text',
        lessonBadge: draft.lessonBadge?.trim() || 'CHAPTER LESSON',
        learningObjectives: draft.learningObjectives || [],
        estimatedReadTimeMinutes: draft.estimatedReadTimeMinutes || stats.recommendedMinutes,
        documentFile: draft.documentFile,
        documentUrl: draft.documentUrl,
        documentName: draft.documentName,
        documentSizeBytes: draft.documentSizeBytes,
        imageFile: draft.imageFile,
        imageUrl: draft.imageUrl,
        diagramUrl: draft.diagramUrl || draft.imageUrl,
        diagramCaption: draft.diagramCaption,
        audioFile: draft.audioFile,
        audioUrl: draft.audioUrl,
        audioTitle: draft.audioTitle,
        videoFile: draft.videoFile,
        videoUrl: draft.videoUrl,
        videoTitle: draft.videoTitle,
        workedExamples: draft.workedExamples || initialNote.workedExamples || [],
        keyPoints: draft.keyPoints || initialNote.keyPoints || [],
        vocabulary: draft.vocabulary || initialNote.vocabulary || [],
        quickCheckQuestions: draft.quickCheckQuestions || initialNote.quickCheckQuestions || [],
        version: draft.version ? draft.version + 1 : 1,
        status: draft.status || 'published',
        offlineAvailable: draft.offlineAvailable ?? true,
        assistAvailable: draft.assistAvailable ?? true,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      await onSave(payload);
    } catch (err: any) {
      alert(err.message || 'Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  // Preview NoteItem for TextbookNoteView
  const previewNoteItem: NoteItem = useMemo(() => {
    return {
      id: draft.id || 'preview-id',
      topicId: selectedTopic.id,
      subjectId: selectedSubject.id,
      form: selectedForm,
      formLevel: selectedForm,
      title: draft.title?.trim() || 'Untitled Revision Note',
      summary: draft.summary?.trim() || `Study notes for ${selectedSubject.name} (${selectedForm})`,
      content: draft.content || '',
      lessonBadge: draft.lessonBadge || 'CHAPTER LESSON',
      learningObjectives: draft.learningObjectives || [],
      estimatedReadTimeMinutes: draft.estimatedReadTimeMinutes || stats.recommendedMinutes,
      noteFormat: draft.noteFormat || 'text',
      documentFile: draft.documentFile,
      documentUrl: draft.documentUrl,
      documentName: draft.documentName,
      imageFile: draft.imageFile,
      imageUrl: draft.imageUrl,
      diagramUrl: draft.diagramUrl || draft.imageUrl || draft.imageFile?.dataUrl,
      diagramCaption: draft.diagramCaption,
      audioFile: draft.audioFile,
      audioUrl: draft.audioUrl,
      audioTitle: draft.audioTitle,
      videoFile: draft.videoFile,
      videoUrl: draft.videoUrl,
      videoTitle: draft.videoTitle,
      workedExamples: draft.workedExamples || [],
      keyPoints: draft.keyPoints || [],
      vocabulary: draft.vocabulary || [],
      quickCheckQuestions: draft.quickCheckQuestions || [],
      version: draft.version || 1,
      status: draft.status || 'published',
      offlineAvailable: true,
      assistAvailable: true,
      updatedAt: draft.updatedAt || new Date().toISOString().split('T')[0]
    };
  }, [draft, selectedForm, selectedSubject, selectedTopic, stats.recommendedMinutes]);

  return (
    <form onSubmit={handleSaveNote} className="space-y-6 animate-fade-in text-slate-800">
      {/* ------------------------------------------------------------- */}
      {/* TOP COMMAND BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              {selectedForm}
            </span>
            <span>•</span>
            <span className="text-slate-700">{selectedSubject.name}</span>
            <span>•</span>
            <span className="text-emerald-700 font-extrabold truncate max-w-[240px]">
              {selectedTopic.title}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{draft.id ? 'Edit Study Note & Media' : 'Create New Study Note'}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Notes Studio
            </span>
          </h1>
        </div>

        {/* View mode toggle & Action buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Builder Mode: Visual (No Code) vs Raw Text/Code */}
          <div className="p-1 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex items-center gap-1 text-xs font-bold shadow-2xs">
            <button
              type="button"
              onClick={handleSwitchToVisual}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                editorMode === 'visual'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/60'
              }`}
              title="Easy Visual Mode - No codes or markdown symbols required"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visual Builder (No Code)</span>
            </button>

            <button
              type="button"
              onClick={handleSwitchToCode}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                editorMode === 'code'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Raw text & markdown formatting mode"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Raw Text / Code</span>
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('write')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'write' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Full width editor view"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Editor Only</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'split' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Split screen: Edit on left, live student app note on right"
            >
              <Columns className="w-3.5 h-3.5 text-emerald-600" />
              <span>Side-by-Side</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Preview complete note in student textbook layout"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Student App View</span>
            </button>
          </div>

          {/* Syntax Guide Toggle */}
          <button
            type="button"
            onClick={() => setShowSyntaxGuide(!showSyntaxGuide)}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 border cursor-pointer ${
              showSyntaxGuide
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
            title="Show Malawi note design cheat sheet"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Design Guide</span>
          </button>

          {/* Cancel button */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Discard unsaved note edits?')) {
                onCancel();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Cancel
          </button>

          {/* Save button */}
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm shadow-emerald-200 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : draft.id ? 'Save Changes' : 'Publish Note'}</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SYNTAX & DESIGN GUIDE (COLLAPSIBLE) */}
      {/* ------------------------------------------------------------- */}
      {showSyntaxGuide && (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/50 border border-amber-200 shadow-sm space-y-4 text-xs animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200/80">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>StudyMaster Malawi Note Design Standards</span>
            </div>
            <button
              type="button"
              onClick={() => setShowSyntaxGuide(false)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-white border border-amber-200/80 space-y-1 shadow-2xs">
              <span className="font-extrabold text-amber-900 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-600" />
                <span>Exam Tip Card</span>
              </span>
              <p className="text-[11px] text-slate-600 font-mono bg-amber-50/50 p-2 rounded-lg">
                &gt; **MSCE / JCE Exam Tip:** Watch out for unit conversions...
              </p>
              <p className="text-[11px] text-slate-500">Renders as a highlighted golden examiner star card in the app.</p>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-emerald-200 space-y-1 shadow-2xs">
              <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Core Definition</span>
              </span>
              <p className="text-[11px] text-slate-600 font-mono bg-emerald-50/50 p-2 rounded-lg">
                &gt; **Definition:** Density is mass per unit volume.
              </p>
              <p className="text-[11px] text-slate-500">Renders as an emerald card with book icon.</p>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-teal-200 space-y-1 shadow-2xs">
              <span className="font-extrabold text-teal-900 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-teal-600" />
                <span>Scientific Formula</span>
              </span>
              <p className="text-[11px] text-slate-600 font-mono bg-teal-50/50 p-2 rounded-lg">
                &gt; **Formula:** V = I \times R
              </p>
              <p className="text-[11px] text-slate-500">Renders with calculator icon and formula typography.</p>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-sky-200 space-y-1 shadow-2xs">
              <span className="font-extrabold text-sky-900 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-600" />
                <span>Malawi Context</span>
              </span>
              <p className="text-[11px] text-slate-600 font-mono bg-sky-50/50 p-2 rounded-lg">
                &gt; **In Malawi:** ESCOM uses high voltage lines...
              </p>
              <p className="text-[11px] text-slate-500">Renders with compass icon and sky-blue local context styling.</p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* METADATA: TITLE, SUMMARY, BADGE, READING TIME & OBJECTIVES */}
      {/* ------------------------------------------------------------- */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 text-xs">
        {/* Title & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-black text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Note Title: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={draft.title || ''}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="e.g. Acid-Base Neutralisation Reactions & Practical Indicators"
              className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-xs focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-black text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Summary / Key MANEB Focus:
            </label>
            <input
              type="text"
              value={draft.summary || ''}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
              placeholder="Brief summary or key focus points tested in MANEB examinations"
              className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>
        </div>

        {/* Lesson Badge & Read Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block font-bold text-slate-700 mb-1 text-[11px]">
              Chapter / Lesson Badge:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={draft.lessonBadge || ''}
                onChange={(e) => setDraft({ ...draft, lessonBadge: e.target.value })}
                placeholder="e.g. CHAPTER LESSON, CORE REVISION"
                className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-xs uppercase focus:outline-none focus:border-emerald-600"
              />
              <div className="flex gap-1">
                {['CHAPTER 1', 'CORE REVISION', 'LAB PRACTICAL'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDraft({ ...draft, lessonBadge: preset })}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-600 whitespace-nowrap cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-[11px]">
              Estimated Reading Time (Minutes):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={120}
                value={draft.estimatedReadTimeMinutes || 5}
                onChange={(e) => setDraft({ ...draft, estimatedReadTimeMinutes: parseInt(e.target.value) || 5 })}
                className="w-24 p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-xs text-center focus:outline-none focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={handleAutoCalcReadTime}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                title="Calculate reading time based on total word count"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auto-Calc (~{stats.recommendedMinutes} min)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-[11px]">
              Primary Note Format:
            </label>
            <select
              value={draft.noteFormat || 'text'}
              onChange={(e) => setDraft({ ...draft, noteFormat: e.target.value as any })}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-xs focus:outline-none focus:border-emerald-600"
            >
              <option value="text">Structured Text Note</option>
              <option value="document">Document / PDF Syllabus Guide</option>
              <option value="image">Scientific Diagram / Illustration</option>
              <option value="audio">Voice Audio Lecture</option>
              <option value="video">Video Demonstration</option>
              <option value="multimedia">Multi-Media All-in-One</option>
            </select>
          </div>
        </div>

        {/* Learning Objectives Editor ("What You Will Learn" box in the app) */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-600" />
              <span>Learning Objectives ("What You Will Learn" Box in Student App):</span>
            </label>
            <span className="text-[11px] text-slate-500">
              {(draft.learningObjectives || []).length} objectives added
            </span>
          </div>

          {/* Existing Objectives Chips */}
          <div className="flex flex-wrap gap-2">
            {(draft.learningObjectives || []).map((obj, idx) => (
              <div
                key={idx}
                className="pl-3 pr-2 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium text-xs flex items-center gap-2 group shadow-2xs"
              >
                <Check className="w-3 h-3 text-emerald-700 shrink-0" />
                <span className="leading-snug">{obj}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveObjective(idx)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-white transition cursor-pointer"
                  title="Remove objective"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Objective input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newObjectiveText}
              onChange={(e) => setNewObjectiveText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddObjective();
                }
              }}
              placeholder="e.g. State the definition of an acid and base according to Arrhenius theory"
              className="flex-1 p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
            <button
              type="button"
              onClick={handleAddObjective}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Objective</span>
            </button>
          </div>
        </div>

        {/* Media Attachments Section (PDF, Diagram, Audio, Video) */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-emerald-600" />
              <span>Media Attachments (Document, Diagram, Voice Lecture, Video):</span>
            </label>
            <span className="text-[11px] text-slate-500">
              Attach files from device or paste web links
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Document / PDF */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
                <File className="w-3.5 h-3.5 text-slate-600" />
                <span>PDF / Document</span>
              </span>
              <input
                type="text"
                value={draft.documentUrl || ''}
                onChange={(e) => setDraft({ ...draft, documentUrl: e.target.value })}
                placeholder="Paste document link"
                className="w-full p-2 rounded-lg bg-white border border-slate-200 text-[11px] focus:outline-none focus:border-emerald-600"
              />
              <input
                type="file"
                ref={docFileRef}
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onFileUpload) onFileUpload(file, 'document');
                }}
              />
              <button
                type="button"
                onClick={() => docFileRef.current?.click()}
                className="w-full py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold text-center cursor-pointer"
              >
                {draft.documentFile?.name || draft.documentName ? 'Replace File' : 'Upload Document'}
              </button>
            </div>

            {/* 2. Scientific Diagram / Image */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Diagram / Image</span>
              </span>
              <input
                type="text"
                value={draft.imageUrl || draft.diagramUrl || ''}
                onChange={(e) =>
                  setDraft({ ...draft, imageUrl: e.target.value, diagramUrl: e.target.value })
                }
                placeholder="Paste image link"
                className="w-full p-2 rounded-lg bg-white border border-slate-200 text-[11px] focus:outline-none focus:border-emerald-600"
              />
              <input
                type="file"
                ref={imgFileRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onFileUpload) onFileUpload(file, 'image');
                }}
              />
              <button
                type="button"
                onClick={() => imgFileRef.current?.click()}
                className="w-full py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold text-center cursor-pointer"
              >
                {draft.imageFile?.dataUrl || draft.diagramUrl ? 'Replace Diagram' : 'Upload Diagram'}
              </button>
            </div>

            {/* 3. Audio Lecture */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
                <Music className="w-3.5 h-3.5 text-blue-600" />
                <span>Audio Lecture (MP3)</span>
              </span>
              <input
                type="text"
                value={draft.audioUrl || ''}
                onChange={(e) => setDraft({ ...draft, audioUrl: e.target.value })}
                placeholder="Paste audio stream URL"
                className="w-full p-2 rounded-lg bg-white border border-slate-200 text-[11px] focus:outline-none focus:border-emerald-600"
              />
              <input
                type="file"
                ref={audioFileRef}
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onFileUpload) onFileUpload(file, 'audio');
                }}
              />
              <button
                type="button"
                onClick={() => audioFileRef.current?.click()}
                className="w-full py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold text-center cursor-pointer"
              >
                {draft.audioFile?.dataUrl || draft.audioUrl ? 'Replace Audio' : 'Upload Audio MP3'}
              </button>
            </div>

            {/* 4. Video Demonstration */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
                <Video className="w-3.5 h-3.5 text-purple-600" />
                <span>Video Demo / YouTube</span>
              </span>
              <input
                type="text"
                value={draft.videoUrl || ''}
                onChange={(e) => setDraft({ ...draft, videoUrl: e.target.value })}
                placeholder="Paste YouTube or video link"
                className="w-full p-2 rounded-lg bg-white border border-slate-200 text-[11px] focus:outline-none focus:border-emerald-600"
              />
              <input
                type="file"
                ref={videoFileRef}
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onFileUpload) onFileUpload(file, 'video');
                }}
              />
              <button
                type="button"
                onClick={() => videoFileRef.current?.click()}
                className="w-full py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold text-center cursor-pointer"
              >
                {draft.videoFile?.dataUrl || draft.videoUrl ? 'Replace Video' : 'Upload Video File'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RICH CONTENT EDITOR & LIVE STUDENT APP DESIGN PREVIEW */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-4">
        {/* FORMATTING & CURRICULUM TOOLBAR (VISIBLE ONLY IN 'code' MODE) */}
        {viewMode !== 'preview' && editorMode === 'code' && (
          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            {/* Top Row: One-Click Textbook Curriculum Cards (Preserves 100% App Design) */}
            <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-emerald-600" />
                <span>Textbook Cards:</span>
              </span>

              {/* 1. Exam Tip Box */}
              <button
                type="button"
                onClick={() =>
                  wrapSelection(
                    '> **MSCE / JCE Exam Tip:** ',
                    '\n',
                    'Pay close attention to units and common examiner pitfalls.'
                  )
                }
                className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Creates the golden examiner star card in student app"
              >
                <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Exam Tip Box</span>
              </button>

              {/* 2. Core Definition Box */}
              <button
                type="button"
                onClick={() =>
                  wrapSelection(
                    '> **Definition:** ',
                    '\n',
                    'State the fundamental scientific definition or law.'
                  )
                }
                className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Creates the emerald book definition card in student app"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Core Definition</span>
              </button>

              {/* 3. Scientific Formula Box */}
              <button
                type="button"
                onClick={() =>
                  wrapSelection(
                    '> **Formula:** ',
                    '\n',
                    '\\text{RAM} = \\frac{(\\text{Mass}_1 \\times \\%_1) + (\\text{Mass}_2 \\times \\%_2)}{100}'
                  )
                }
                className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Creates the formula card with calculator icon"
              >
                <Calculator className="w-3.5 h-3.5 text-teal-600" />
                <span>Formula Box</span>
              </button>

              {/* 4. Malawi Context Box */}
              <button
                type="button"
                onClick={() =>
                  wrapSelection(
                    '> **In Our Malawian Environment:** ',
                    '\n',
                    'How this applies in Malawi (e.g. Shire River hydro power, Lake Malawi ecology, farming practices).'
                  )
                }
                className="px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Creates the sky blue Malawi environment compass card"
              >
                <Compass className="w-3.5 h-3.5 text-sky-600" />
                <span>Malawi Context</span>
              </button>

              {/* 5. Chapter Section */}
              <button
                type="button"
                onClick={() =>
                  insertBlock('## 1.0 Section Title\nDetailed explanations with concepts and worked principles...')
                }
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5"
                title="Inserts main numbered section header (turns into textbook green banner in student app)"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Section Heading (1.0)</span>
              </button>

              {/* 6. Subsection */}
              <button
                type="button"
                onClick={() =>
                  insertBlock('### Subtopic Detail\nPoint-by-point breakdown with examples and explanations...')
                }
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5"
                title="Inserts subsection with badge numbering (turns into textbook 1.1 badge in student app)"
              >
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>Subsection (1.1)</span>
              </button>
            </div>

            {/* Bottom Row: Markdown & Math Tools */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-1 text-[11px]">
                {/* Bold */}
                <button
                  type="button"
                  onClick={() => wrapSelection('**', '**', 'bold text')}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>

                {/* Italic */}
                <button
                  type="button"
                  onClick={() => wrapSelection('*', '*', 'italic text')}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200"
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>

                {/* Bullet List */}
                <button
                  type="button"
                  onClick={() =>
                    insertBlock(
                      '- **Key Concept 1:** First principle or observation\n- **Key Concept 2:** Second principle or observation\n- **Key Concept 3:** Third principle or observation'
                    )
                  }
                  className="px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1"
                  title="Creates dual-column concept cards with checkmarks"
                >
                  <List className="w-3.5 h-3.5 text-slate-500" />
                  <span>Bullets</span>
                </button>

                {/* Numbered List */}
                <button
                  type="button"
                  onClick={() =>
                    insertBlock(
                      '1. **Step One:** Measure initial quantity carefully\n2. **Step Two:** Heat the solution gradually\n3. **Step Three:** Record temperature at equilibrium'
                    )
                  }
                  className="px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1"
                  title="Creates step-by-step procedure cards with number badges"
                >
                  <ListOrdered className="w-3.5 h-3.5 text-slate-500" />
                  <span>Steps (1,2,3)</span>
                </button>

                {/* Table */}
                <button
                  type="button"
                  onClick={() =>
                    insertBlock(
                      '| Property / Parameter | Solid State | Liquid State | Gaseous State |\n|---|---|---|---|\n| Particle Arrangement | Closely packed in regular lattice | Close together but random | Far apart and random |\n| Particle Movement | Vibrate about fixed positions | Slide over each other | Move rapidly in all directions |\n| Shape & Volume | Definite shape & fixed volume | Takes container shape, fixed volume | Takes shape & fills whole container |'
                    )
                  }
                  className="px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1"
                  title="Creates clean textbook comparison table"
                >
                  <TableIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Table</span>
                </button>

                <span className="w-px h-4 bg-slate-200 mx-1" />

                {/* Math: Inline */}
                <button
                  type="button"
                  onClick={() => wrapSelection('$', '$', 'x^2')}
                  className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-mono font-bold border border-emerald-200"
                  title="Inline math $x$"
                >
                  $x$
                </button>

                {/* Math: Fraction */}
                <button
                  type="button"
                  onClick={() => wrapSelection('$\\frac{', '}{b}$', 'a')}
                  className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-mono font-bold border border-emerald-200"
                  title="Fraction"
                >
                  a/b
                </button>

                {/* Math: Root */}
                <button
                  type="button"
                  onClick={() => wrapSelection('$\\sqrt{', '}$', 'b^2 - 4ac')}
                  className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-mono font-bold border border-emerald-200"
                  title="Square root"
                >
                  √x
                </button>

                {/* Math: Display Block */}
                <button
                  type="button"
                  onClick={() =>
                    insertBlock(
                      '$$\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n$$'
                    )
                  }
                  className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-mono font-bold border border-emerald-200"
                  title="Display equation block"
                >
                  $$ Block $$
                </button>

                {/* Chemical Reaction */}
                <button
                  type="button"
                  onClick={() =>
                    insertBlock(
                      '$$\n\\text{CaCO}_3\\text{ (s)} + 2\\text{HCl}\\text{ (aq)} \\rightarrow \\text{CaCl}_2\\text{ (aq)} + \\text{H}_2\\text{O}\\text{ (l)} + \\text{CO}_2\\text{ (g)}\n$$'
                    )
                  }
                  className="px-2 py-1 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 font-mono font-bold border border-teal-200"
                  title="Balanced chemical reaction"
                >
                  Chemical Eq
                </button>

                {/* Matrix */}
                <button
                  type="button"
                  onClick={() =>
                    insertBlock(
                      '$$\nA = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}\n$$'
                    )
                  }
                  className="px-2 py-1 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 font-mono font-bold border border-teal-200"
                  title="Matrix notation"
                >
                  [Matrix]
                </button>
              </div>

              {/* Word & Stats Counter */}
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
                <span>{stats.words} words</span>
                <span>•</span>
                <span>~{draft.estimatedReadTimeMinutes || stats.recommendedMinutes} min read</span>
              </div>
            </div>

            {/* Quick Section Navigator Jump Bar */}
            {contentSections.length > 0 && (
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="font-bold text-slate-400 uppercase text-[10px] shrink-0">
                  Jump to Section:
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {contentSections.map((sec, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleJumpToSection(sec.lineIndex)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 font-semibold transition cursor-pointer flex items-center gap-1"
                    >
                      <span className="font-mono text-emerald-700 font-bold">{sec.sectionNum}</span>
                      <span className="truncate max-w-[120px]">{sec.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MAIN VIEWPORT: SPLIT-SCREEN OR FULL-WIDTH MODES */}
        {/* ------------------------------------------------------------- */}
        <div
          className={`grid gap-5 ${
            viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {/* LEFT COLUMN: EASY TO EDIT VISUAL BUILDER OR RAW TEXTAREA */}
          {viewMode !== 'preview' && (
            <div className="space-y-3">
              {editorMode === 'visual' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Visual Note Builder:</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleSwitchToCode}
                      className="text-xs text-slate-500 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Code className="w-3 h-3" />
                      <span>Switch to Code / Text View</span>
                    </button>
                  </div>

                  <div className={viewMode === 'split' ? 'max-h-[720px] overflow-y-auto pr-1' : ''}>
                    <NotesStudioVisualEditor
                      sections={visualSections}
                      onChange={handleVisualSectionsChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Raw Markdown &amp; Mathematical Code Editor:</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleSwitchToVisual}
                      className="text-xs text-emerald-700 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Switch to Visual Builder (No Code)</span>
                    </button>
                  </div>

                  {/* Explainer card for symbols like #, *, -, and & */}
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-slate-800 text-[11px] leading-relaxed">
                    <div className="flex items-center justify-between font-bold text-amber-950 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Why do you see symbols like #, *, -, and &amp;?</span>
                      </span>
                      <span className="text-[10px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
                        Formatting Codes
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="p-1.5 rounded-lg bg-white/90 border border-amber-200/50">
                        <code className="text-emerald-700 font-bold">## Title</code>
                        <p className="text-[10px] text-slate-600 mt-0.5">Green Chapter Header</p>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white/90 border border-amber-200/50">
                        <code className="text-amber-800 font-bold">**word**</code>
                        <p className="text-[10px] text-slate-600 mt-0.5">Bold Key Terms</p>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white/90 border border-amber-200/50">
                        <code className="text-sky-700 font-bold">- item</code>
                        <p className="text-[10px] text-slate-600 mt-0.5">Checkmark Bullet List</p>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white/90 border border-amber-200/50">
                        <code className="text-purple-700 font-bold">&amp;</code>
                        <p className="text-[10px] text-slate-600 mt-0.5">&quot;And&quot; in Title / Section</p>
                      </div>
                    </div>
                    <p className="mt-2 text-[10.5px] text-amber-950 font-medium flex items-center gap-1.5 bg-amber-100/60 p-1.5 rounded-xl border border-amber-200/60">
                      <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span><strong>Students do not see these symbols!</strong> The app turns them into textbook banners, bold words, and cards in the live preview.</span>
                    </p>
                  </div>

                  <textarea
                    ref={textareaRef}
                    rows={viewMode === 'split' ? 28 : 22}
                    value={draft.content || ''}
                    onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                    placeholder="Write comprehensive syllabus notes here using ## Section headings, > **MSCE / JCE Exam Tip:**, > **Definition:**, formulas ($$...$$), bullet lists, and tables..."
                    className="w-full p-4 rounded-3xl bg-white border border-slate-300 text-slate-900 font-mono text-xs leading-relaxed focus:outline-none focus:border-emerald-600 shadow-sm transition-all"
                  />
                </div>
              )}
            </div>
          )}

          {/* RIGHT COLUMN: 100% IDENTICAL STUDENT APP DESIGN LIVE PREVIEW */}
          {viewMode !== 'write' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Live Student App Note Design (100% Identical Rendering):</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  App Design Preserved
                </span>
              </div>

              <div
                className={`p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-y-auto ${
                  viewMode === 'split' ? 'max-h-[660px]' : 'min-h-[500px]'
                }`}
              >
                {draft.content?.trim() ? (
                  <TextbookNoteView
                    note={previewNoteItem}
                    subjectName={selectedSubject.name}
                  />
                ) : (
                  <div className="p-12 text-center text-slate-400 space-y-3">
                    <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="font-bold text-sm text-slate-600">
                      No note content typed yet.
                    </p>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Use the quick textbook card buttons above to insert headings, definitions, formulas, and examiner tips. You will see the live textbook design rendered here instantly!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM FOOTER BAR WITH SAVE / CANCEL */}
      {/* ------------------------------------------------------------- */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Notes edited here preserve all textbook layout cards, equations, and media attachments.</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Discard unsaved note edits?')) {
                onCancel();
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-2 shadow-sm shadow-emerald-200 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Revision Note...' : draft.id ? 'Save & Update Note' : 'Publish Revision Note'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
