import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  BookOpen,
  GraduationCap,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  UploadCloud,
  FileCheck,
  Clock,
  Sparkles,
  HelpCircle,
  Layers,
  X,
  Save,
  Check,
  ExternalLink
} from 'lucide-react';
import { PastPaper, Subject, FormLevel } from '../../types';
import { api } from '../../services/api';

interface PastPaperStudioProps {
  subjects: Subject[];
  onBack: () => void;
  showToast: (msg: string) => void;
}

export const PastPaperStudio: React.FC<PastPaperStudioProps> = ({
  subjects,
  onBack,
  showToast
}) => {
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedForm, setSelectedForm] = useState<string>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Modal State: Create / Edit
  const [showEditorModal, setShowEditorModal] = useState<boolean>(false);
  const [editingPaper, setEditingPaper] = useState<Partial<PastPaper> | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Modal State: Preview
  const [previewPaper, setPreviewPaper] = useState<PastPaper | null>(null);

  // File Upload Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneInputRef = useRef<HTMLInputElement>(null);

  // Load Past Papers
  const loadPapers = async () => {
    try {
      setLoading(true);
      const data = await api.getPastPapers();
      setPapers(data || []);
    } catch (err) {
      console.warn('Failed to load past papers:', err);
      showToast('Could not load past papers from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPapers();
  }, []);

  // Filtered Papers
  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(q);
        const matchesSubject = p.subjectName?.toLowerCase().includes(q);
        const matchesCategory = p.category?.toLowerCase().includes(q);
        const matchesYear = p.year?.toString().includes(q);
        const matchesPaperNum = p.paperNumber?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubject && !matchesCategory && !matchesYear && !matchesPaperNum) {
          return false;
        }
      }

      // Form filter
      if (selectedForm !== 'all') {
        const pForm = p.form || p.formLevel;
        if (pForm !== selectedForm) return false;
      }

      // Subject filter
      if (selectedSubjectId !== 'all' && p.subjectId !== selectedSubjectId) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Year filter
      if (selectedYear !== 'all' && p.year?.toString() !== selectedYear) {
        return false;
      }

      return true;
    });
  }, [papers, searchQuery, selectedForm, selectedSubjectId, selectedCategory, selectedYear]);

  // Statistics
  const stats = useMemo(() => {
    const total = papers.length;
    const msce = papers.filter((p) => p.category === 'MSCE').length;
    const jce = papers.filter((p) => p.category === 'JCE').length;
    const withScheme = papers.filter((p) => p.hasMarkingGuide || p.hasMarkingScheme).length;
    const totalDownloads = papers.reduce((acc, p) => acc + (p.downloadCount || 0), 0);
    return { total, msce, jce, withScheme, totalDownloads };
  }, [papers]);

  // Open Create Modal
  const handleOpenCreate = () => {
    const currentYear = new Date().getFullYear();
    setEditingPaper({
      id: `paper-${Date.now()}`,
      title: '',
      subjectId: subjects[0]?.id || 'subj-math',
      subjectName: subjects[0]?.name || 'Mathematics',
      form: 'Form 4',
      year: currentYear,
      paperNumber: 'Paper 1 (Theory)',
      category: 'MSCE',
      description: 'Official MANEB examination paper with questions, instructions, and marks distribution.',
      fileSizeMb: 1.5,
      downloadUrl: '',
      hasMarkingGuide: true,
      markingGuideSummary: 'Includes detailed step-by-step mark allocations and expected answers.',
      offlineAvailable: true,
      status: 'published',
      downloadCount: 0,
      uploadedAt: new Date().toISOString().split('T')[0],
      questionsExcerpt: [
        { qNumber: 1, text: 'Sample Question 1', marks: 5 },
        { qNumber: 2, text: 'Sample Question 2', marks: 10 }
      ]
    });
    setShowEditorModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (paper: PastPaper) => {
    setEditingPaper({ ...paper });
    setShowEditorModal(true);
  };

  // Auto-detect paper metadata from filename (e.g. 2024_MSCE_Mathematics_Paper_1.pdf)
  const autoDetectPaperMeta = (fileName: string) => {
    const cleanName = fileName.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ');
    const lower = cleanName.toLowerCase();

    // 1. Year
    const yearMatch = cleanName.match(/\b(20[123]\d)\b/);
    const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();

    // 2. Category
    let category: PastPaper['category'] = 'MSCE';
    if (lower.includes('jce') || lower.includes('junior')) category = 'JCE';
    else if (lower.includes('mock') || lower.includes('trial')) category = 'Mock';
    else if (lower.includes('end of term') || lower.includes('term 3') || lower.includes('term 2')) category = 'End of Term';
    else if (lower.includes('mid term') || lower.includes('mid-term')) category = 'Mid-Term';
    else if (lower.includes('revision') || lower.includes('national')) category = 'National Revision';

    // 3. Form Level
    let form: FormLevel = category === 'JCE' ? 'Form 2' : 'Form 4';
    if (lower.includes('form 1') || lower.includes('form1')) form = 'Form 1';
    else if (lower.includes('form 2') || lower.includes('form2')) form = 'Form 2';
    else if (lower.includes('form 3') || lower.includes('form3')) form = 'Form 3';
    else if (lower.includes('form 4') || lower.includes('form4')) form = 'Form 4';

    // 4. Subject match
    let matchedSubj = subjects.find((s) => lower.includes(s.name.toLowerCase()));
    if (!matchedSubj) {
      if (lower.includes('math')) matchedSubj = subjects.find((s) => s.name.toLowerCase().includes('math'));
      else if (lower.includes('phys')) matchedSubj = subjects.find((s) => s.name.toLowerCase().includes('phys'));
      else if (lower.includes('chem')) matchedSubj = subjects.find((s) => s.name.toLowerCase().includes('chem'));
      else if (lower.includes('bio')) matchedSubj = subjects.find((s) => s.name.toLowerCase().includes('bio'));
      else if (lower.includes('agri')) matchedSubj = subjects.find((s) => s.name.toLowerCase().includes('agri'));
      else if (lower.includes('geog')) matchedSubj = subjects.find((s) => s.name.toLowerCase().includes('geog'));
      else if (lower.includes('hist')) matchedSubj = subjects.find((s) => s.name.toLowerCase().includes('hist'));
      else if (lower.includes('eng')) matchedSubj = subjects.find((s) => s.name.toLowerCase().includes('eng'));
      else if (lower.includes('chich')) matchedSubj = subjects.find((s) => s.name.toLowerCase().includes('chich'));
    }
    const subjectId = matchedSubj?.id || subjects[0]?.id || 'subj-math';
    const subjectName = matchedSubj?.name || subjects[0]?.name || 'Mathematics';

    // 5. Paper Number
    let paperNumber = 'Paper 1 (Theory)';
    if (lower.includes('paper 1') || lower.includes('paper1') || lower.includes('p1')) paperNumber = 'Paper 1 (Theory)';
    else if (lower.includes('paper 2') || lower.includes('paper2') || lower.includes('p2')) {
      paperNumber = lower.includes('pract') ? 'Paper 2 (Practical)' : 'Paper 2';
    } else if (lower.includes('paper 3') || lower.includes('paper3') || lower.includes('p3')) {
      paperNumber = 'Paper 3';
    }

    // 6. Title
    const title = `${year} MANEB ${category} ${subjectName} ${paperNumber}`;

    return { title, subjectId, subjectName, form, year, category, paperNumber };
  };

  // Handle direct file drops or selection
  const handleDirectFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter(
      (f) => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf'
    );
    if (files.length === 0) {
      alert('Please upload PDF past paper files (.pdf).');
      return;
    }

    if (files.length === 1) {
      // Single file upload: auto-fill & open editor modal for review/customization
      const file = files[0];
      const meta = autoDetectPaperMeta(file.name);
      try {
        setIsUploading(true);
        const uploaded = await api.uploadPastPaperFile(file);
        setEditingPaper({
          id: `paper-${Date.now()}`,
          ...meta,
          fileName: uploaded.fileName,
          fileSizeMb: uploaded.fileSizeMb,
          fileSizeBytes: uploaded.fileSizeBytes,
          downloadUrl: uploaded.downloadUrl,
          description: `Official MANEB ${meta.category} examination paper with complete questions and syllabus scope.`,
          hasMarkingGuide: true,
          markingGuideSummary: 'Includes detailed step-by-step mark allocations and expected answers.',
          offlineAvailable: true,
          status: 'published',
          downloadCount: 0,
          uploadedAt: new Date().toISOString().split('T')[0],
          questionsExcerpt: [
            { qNumber: 1, text: 'Sample Question 1', marks: 5 },
            { qNumber: 2, text: 'Sample Question 2', marks: 10 }
          ]
        });
        setShowEditorModal(true);
        showToast(`Auto-detected: ${meta.title}`);
      } catch (e) {
        showToast('Error uploading PDF file.');
      } finally {
        setIsUploading(false);
      }
    } else {
      // Batch upload multiple files at once!
      setIsUploading(true);
      setUploadProgress({ current: 0, total: files.length });
      let successCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress({ current: i + 1, total: files.length });
        try {
          const uploaded = await api.uploadPastPaperFile(file);
          const meta = autoDetectPaperMeta(file.name);
          const paperPayload: Partial<PastPaper> = {
            id: `paper-${Date.now()}-${i}`,
            ...meta,
            fileName: uploaded.fileName,
            fileSizeMb: uploaded.fileSizeMb,
            fileSizeBytes: uploaded.fileSizeBytes,
            downloadUrl: uploaded.downloadUrl,
            description: `Official MANEB ${meta.category} examination paper.`,
            hasMarkingGuide: true,
            markingGuideSummary: 'Includes mark allocations and official answers.',
            offlineAvailable: true,
            status: 'published',
            downloadCount: 0,
            uploadedAt: new Date().toISOString().split('T')[0],
            questionsExcerpt: []
          };
          await api.saveAdminPastPaper(paperPayload, false);
          successCount++;
        } catch (e) {
          console.error('Failed to batch upload file:', file.name, e);
        }
      }

      setIsUploading(false);
      setUploadProgress(null);
      showToast(`Batch uploaded ${successCount} past papers successfully!`);
      await loadPapers();
    }
  };

  // Handle PDF File Upload inside Modal
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPaper) return;

    try {
      setIsUploading(true);
      const uploaded = await api.uploadPastPaperFile(file);
      setEditingPaper((prev) => ({
        ...prev,
        fileName: uploaded.fileName,
        fileSizeMb: uploaded.fileSizeMb,
        fileSizeBytes: uploaded.fileSizeBytes,
        downloadUrl: uploaded.downloadUrl
      }));
      showToast(`PDF "${file.name}" (${uploaded.fileSizeMb} MB) uploaded.`);
    } catch (e) {
      showToast('Error uploading PDF file.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Save
  const handleSavePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPaper || !editingPaper.title?.trim()) {
      alert('Please provide a title for the past paper.');
      return;
    }

    try {
      setIsSaving(true);
      const isEdit = papers.some((p) => p.id === editingPaper.id);

      // Match subjectName
      const subj = subjects.find((s) => s.id === editingPaper.subjectId);
      const payload: Partial<PastPaper> = {
        ...editingPaper,
        subjectName: subj?.name || editingPaper.subjectName || 'General',
        hasMarkingGuide: editingPaper.hasMarkingGuide ?? true,
        offlineAvailable: editingPaper.offlineAvailable ?? true,
        status: editingPaper.status || 'published',
        year: Number(editingPaper.year) || new Date().getFullYear(),
        fileSizeMb: Number(editingPaper.fileSizeMb) || 1.5
      };

      await api.saveAdminPastPaper(payload, isEdit);
      showToast(isEdit ? 'Past paper updated successfully!' : 'New past paper published!');
      setShowEditorModal(false);
      setEditingPaper(null);
      await loadPapers();
    } catch (err) {
      console.error('Failed to save past paper:', err);
      showToast('Error saving past paper.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleDeletePaper = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.deleteAdminPastPaper(id);
      showToast('Past paper deleted successfully.');
      setPapers((prev) => prev.filter((p) => p.id !== id));
      if (previewPaper?.id === id) setPreviewPaper(null);
    } catch (err) {
      console.error('Failed to delete past paper:', err);
      showToast('Error deleting past paper.');
    }
  };

  // Handle Toggle Status (published / draft)
  const handleToggleStatus = async (paper: PastPaper) => {
    const newStatus = paper.status === 'published' ? 'draft' : 'published';
    try {
      await api.saveAdminPastPaper({ ...paper, status: newStatus }, true);
      setPapers((prev) =>
        prev.map((p) => (p.id === paper.id ? { ...p, status: newStatus } : p))
      );
      showToast(`Paper marked as ${newStatus}.`);
    } catch (err) {
      console.error('Status toggle failed:', err);
      showToast('Failed to update paper status.');
    }
  };

  // Add Question to Excerpt
  const handleAddQuestion = () => {
    if (!editingPaper) return;
    const currentQuestions = editingPaper.questionsExcerpt || [];
    const nextNum = currentQuestions.length + 1;
    setEditingPaper({
      ...editingPaper,
      questionsExcerpt: [
        ...currentQuestions,
        { qNumber: nextNum, text: `Examination question ${nextNum}`, marks: 5 }
      ]
    });
  };

  // Remove Question
  const handleRemoveQuestion = (idx: number) => {
    if (!editingPaper) return;
    const currentQuestions = (editingPaper.questionsExcerpt || []).filter((_, i) => i !== idx);
    setEditingPaper({
      ...editingPaper,
      questionsExcerpt: currentQuestions
    });
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------------- */}
      {/* TOP HEADER & BREADCRUMB */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xs"
            title="Return to Admin Dashboard Home"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Admin Home</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Past Paper Studio</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold border border-purple-200">
                  MANEB Exam Bank
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage, upload, and organize national MSCE & JCE examination papers and official marking guides.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm shadow-purple-200 cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>+ Upload Past Paper</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* STATS OVERVIEW CARDS */}
      {/* ------------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Total Papers</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.total}</p>
          <span className="text-[10px] text-slate-400">Stored in repository</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">MSCE Papers</span>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-900">{stats.msce}</p>
          <span className="text-[10px] text-purple-600 font-medium">Form 4 Graduation Exams</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">JCE Papers</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-900">{stats.jce}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Form 2 Junior Exams</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">Marking Guides</span>
            <FileCheck className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-900">{stats.withScheme}</p>
          <span className="text-[10px] text-amber-600 font-medium">Answer keys included</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* DRAG & DROP PAST PAPER UPLOAD ZONE */}
      {/* ------------------------------------------------------------------------- */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleDirectFiles(e.dataTransfer.files);
          }
        }}
        className={`p-6 sm:p-7 rounded-3xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center space-y-3 cursor-pointer shadow-xs ${
          isDragging
            ? 'border-purple-600 bg-purple-100/70 scale-[1.01]'
            : 'border-purple-300 hover:border-purple-500 bg-gradient-to-r from-purple-50/70 via-white to-purple-50/40 hover:bg-purple-50/90'
        }`}
        onClick={() => dropzoneInputRef.current?.click()}
      >
        <input
          type="file"
          ref={dropzoneInputRef}
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleDirectFiles(e.target.files);
            }
          }}
        />

        <div className="w-13 h-13 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-200">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="font-black text-base sm:text-lg text-slate-900">
            Upload MANEB Examination PDF Papers
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Drag &amp; drop PDF past papers here, or <span className="text-purple-700 font-extrabold underline">browse from your computer / device</span>. Supports multiple files at once.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-semibold text-purple-900">
          <span className="px-2.5 py-1 rounded-full bg-white border border-purple-200 shadow-2xs">
            📄 Formats: .pdf documents
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white border border-purple-200 shadow-2xs">
            ⚡ Smart Filename Auto-Detection
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white border border-purple-200 shadow-2xs">
            🇲🇼 MSCE &amp; JCE Marking Schemes
          </span>
        </div>

        {isUploading && (
          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-purple-800 animate-pulse">
            <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin" />
            <span>
              {uploadProgress
                ? `Uploading paper ${uploadProgress.current} of ${uploadProgress.total}...`
                : 'Uploading and processing PDF...'}
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* FILTERS & SEARCH BAR */}
      {/* ------------------------------------------------------------------------- */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past papers by title, subject, year, or category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-600 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Clear Filter if active */}
          {(selectedForm !== 'all' || selectedSubjectId !== 'all' || selectedCategory !== 'all' || selectedYear !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSelectedForm('all');
                setSelectedSubjectId('all');
                setSelectedCategory('all');
                setSelectedYear('all');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer self-end md:self-auto shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Form Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Form Level:
            </label>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-700 focus:outline-none focus:border-purple-600 cursor-pointer"
            >
              <option value="all">All Forms</option>
              <option value="Form 1">Form 1</option>
              <option value="Form 2">Form 2 (JCE)</option>
              <option value="Form 3">Form 3</option>
              <option value="Form 4">Form 4 (MSCE)</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Subject:
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-700 focus:outline-none focus:border-purple-600 cursor-pointer"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Exam Type:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-700 focus:outline-none focus:border-purple-600 cursor-pointer"
            >
              <option value="all">All Exam Types</option>
              <option value="MSCE">MSCE National Exam</option>
              <option value="JCE">JCE National Exam</option>
              <option value="Mock">Mock / Trial Exam</option>
              <option value="End of Term">End of Term Exam</option>
              <option value="Mid-Term">Mid-Term Assessment</option>
              <option value="National Revision">National Revision</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Year:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-700 focus:outline-none focus:border-purple-600 cursor-pointer"
            >
              <option value="all">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* PAST PAPERS LIST / GRID */}
      {/* ------------------------------------------------------------------------- */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-white rounded-3xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-sm text-slate-600">Loading Examination Bank...</p>
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-white rounded-3xl border border-slate-200">
          <FileText className="w-12 h-12 mx-auto text-slate-300" />
          <p className="font-bold text-base text-slate-700">No past papers found.</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search query or filters, or click &quot;Upload Past Paper&quot; above to add a new MANEB examination paper.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-2 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm shadow-purple-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Past Paper</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPapers.map((paper) => {
            const hasScheme = paper.hasMarkingGuide || paper.hasMarkingScheme;
            const isPublished = paper.status !== 'draft';
            return (
              <div
                key={paper.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-purple-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 group"
              >
                {/* Top Section */}
                <div className="space-y-3">
                  {/* Badges Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-900 font-extrabold">
                        {paper.year}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-bold">
                        {paper.category || 'MSCE'}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                        {paper.form || paper.formLevel || 'Form 4'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(paper)}
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] cursor-pointer transition ${
                        isPublished
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      }`}
                      title="Click to toggle Published / Draft status"
                    >
                      {isPublished ? '● Published' : '○ Draft'}
                    </button>
                  </div>

                  {/* Title & Subject */}
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-purple-900 transition-colors leading-snug">
                      {paper.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                      <span>{paper.subjectName}</span>
                      <span>•</span>
                      <span>{paper.paperNumber || 'Paper 1'}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {paper.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {paper.description}
                    </p>
                  )}

                  {/* Marking Guide & Offline badges */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px] pt-1">
                    {hasScheme ? (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3 text-amber-600" />
                        <span>Marking Scheme Attached</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 font-semibold">
                        No Marking Scheme
                      </span>
                    )}

                    {paper.fileSizeMb && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 font-semibold">
                        PDF • {paper.fileSizeMb} MB
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 font-semibold">
                      {paper.downloadCount || 0} downloads
                    </span>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewPaper(paper)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-700 transition cursor-pointer"
                      title="Preview Past Paper & Questions"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(paper)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition cursor-pointer"
                      title="Edit Paper Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeletePaper(paper.id, paper.title)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition cursor-pointer"
                      title="Delete Past Paper"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Direct Test Download Link if available */}
                  {paper.downloadUrl ? (
                    <a
                      href={paper.downloadUrl}
                      download={`${paper.title}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-600 text-slate-700 hover:text-white font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">No File Uploaded</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT PAST PAPER */}
      {/* ------------------------------------------------------------------------- */}
      {showEditorModal && editingPaper && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    {papers.some((p) => p.id === editingPaper.id)
                      ? 'Edit Past Paper'
                      : 'Upload New Past Paper'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    National Examination Bank • MANEB Curriculum Standards
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Discard past paper changes?')) {
                    setShowEditorModal(false);
                    setEditingPaper(null);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handleSavePaper} className="p-5 space-y-4 overflow-y-auto text-xs flex-1">
              {/* Paper Title */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Examination Paper Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingPaper.title || ''}
                  onChange={(e) => setEditingPaper({ ...editingPaper, title: e.target.value })}
                  placeholder="e.g. 2024 MANEB MSCE Physical Science Paper 1 - Theory"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-purple-600 text-xs"
                />
              </div>

              {/* Grid: Subject & Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingPaper.subjectId || ''}
                    onChange={(e) => {
                      const sid = e.target.value;
                      const subj = subjects.find((s) => s.id === sid);
                      setEditingPaper({
                        ...editingPaper,
                        subjectId: sid,
                        subjectName: subj?.name || ''
                      });
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-purple-600 text-xs cursor-pointer"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Form Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingPaper.form || 'Form 4'}
                    onChange={(e) =>
                      setEditingPaper({
                        ...editingPaper,
                        form: e.target.value as FormLevel,
                        formLevel: e.target.value as FormLevel
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-purple-600 text-xs cursor-pointer"
                  >
                    <option value="Form 1">Form 1</option>
                    <option value="Form 2">Form 2 (JCE Examination)</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4">Form 4 (MSCE Examination)</option>
                  </select>
                </div>
              </div>

              {/* Grid: Year, Paper Number & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Exam Year <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="2010"
                    max="2035"
                    required
                    value={editingPaper.year || new Date().getFullYear()}
                    onChange={(e) =>
                      setEditingPaper({ ...editingPaper, year: parseInt(e.target.value) || 2024 })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-purple-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Paper Number
                  </label>
                  <input
                    type="text"
                    value={editingPaper.paperNumber || 'Paper 1'}
                    onChange={(e) =>
                      setEditingPaper({ ...editingPaper, paperNumber: e.target.value })
                    }
                    placeholder="e.g. Paper 1, Paper 2 (Practical)"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-purple-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={editingPaper.category || 'MSCE'}
                    onChange={(e) =>
                      setEditingPaper({ ...editingPaper, category: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-purple-600 text-xs cursor-pointer"
                  >
                    <option value="MSCE">MSCE National Exam</option>
                    <option value="JCE">JCE National Exam</option>
                    <option value="Mock">Mock / Trial Exam</option>
                    <option value="End of Term">End of Term Exam</option>
                    <option value="Mid-Term">Mid-Term Assessment</option>
                    <option value="National Revision">National Revision</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Description / Syllabus Topics Covered
                </label>
                <textarea
                  rows={2}
                  value={editingPaper.description || ''}
                  onChange={(e) => setEditingPaper({ ...editingPaper, description: e.target.value })}
                  placeholder="Outline topics covered, target grade boundaries, or examination advice..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:border-purple-600 text-xs leading-relaxed"
                />
              </div>

              {/* PDF Document Upload Area */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-950 flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-purple-600" />
                    <span>Examination PDF Document</span>
                  </span>
                  {editingPaper.downloadUrl && (
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                      ✓ Document Attached
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600">
                  Attach the official question paper PDF so secondary students across Malawi can download and study offline.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-purple-100 border border-purple-300 text-purple-900 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{editingPaper.downloadUrl ? 'Replace PDF File' : 'Upload PDF File'}</span>
                  </button>

                  <div className="w-full sm:flex-1">
                    <input
                      type="text"
                      value={editingPaper.downloadUrl || ''}
                      onChange={(e) =>
                        setEditingPaper({ ...editingPaper, downloadUrl: e.target.value })
                      }
                      placeholder="Or enter direct PDF download URL..."
                      className="w-full p-2 rounded-xl bg-white border border-purple-200 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                {editingPaper.fileName && (
                  <p className="text-[10px] text-purple-800 font-mono">
                    File: {editingPaper.fileName} ({editingPaper.fileSizeMb || 1.5} MB)
                  </p>
                )}
              </div>

              {/* Marking Scheme Toggle & Summary */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPaper.hasMarkingGuide ?? true}
                      onChange={(e) =>
                        setEditingPaper({
                          ...editingPaper,
                          hasMarkingGuide: e.target.checked,
                          hasMarkingScheme: e.target.checked
                        })
                      }
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-amber-600" />
                      <span>Includes Official Marking Scheme / Answer Key</span>
                    </span>
                  </label>
                  <span className="text-[10px] text-amber-800 font-semibold">Teacher Verified</span>
                </div>

                {(editingPaper.hasMarkingGuide ?? true) && (
                  <div className="pt-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-amber-900 mb-1">
                      Marking Guide Notes &amp; Step-by-Step Solutions:
                    </label>
                    <textarea
                      rows={3}
                      value={editingPaper.markingGuideSummary || ''}
                      onChange={(e) =>
                        setEditingPaper({ ...editingPaper, markingGuideSummary: e.target.value })
                      }
                      placeholder="Outline mark allocation criteria, method marks (M1), accuracy marks (A1), and model answers..."
                      className="w-full p-2.5 rounded-xl bg-white border border-amber-300 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-amber-600"
                    />
                  </div>
                )}
              </div>

              {/* Sample Questions Excerpt Builder */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-emerald-600" />
                      <span>Sample Examination Questions (Excerpt)</span>
                    </span>
                    <p className="text-[10px] text-slate-500">
                      Students preview these sample questions before downloading the full PDF.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(editingPaper.questionsExcerpt || []).map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2 text-xs"
                    >
                      <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-900 font-bold font-mono text-[10px] shrink-0 mt-0.5">
                        Q{q.qNumber || qIdx + 1}
                      </span>
                      <div className="flex-1 space-y-1.5">
                        <textarea
                          rows={2}
                          value={q.text}
                          onChange={(e) => {
                            const updated = [...(editingPaper.questionsExcerpt || [])];
                            updated[qIdx] = { ...updated[qIdx], text: e.target.value };
                            setEditingPaper({ ...editingPaper, questionsExcerpt: updated });
                          }}
                          placeholder="Type examination question text..."
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                        />
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-slate-500 font-semibold">Marks:</span>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={q.marks}
                            onChange={(e) => {
                              const updated = [...(editingPaper.questionsExcerpt || [])];
                              updated[qIdx] = {
                                ...updated[qIdx],
                                marks: parseInt(e.target.value) || 1
                              };
                              setEditingPaper({ ...editingPaper, questionsExcerpt: updated });
                            }}
                            className="w-16 p-1 rounded-md bg-slate-50 border border-slate-200 text-center font-bold text-slate-800"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={editingPaper.status || 'published'}
                    onChange={(e) =>
                      setEditingPaper({
                        ...editingPaper,
                        status: e.target.value as 'published' | 'draft' | 'deactivated'
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-purple-600 text-xs cursor-pointer"
                  >
                    <option value="published">Published (Visible to Students)</option>
                    <option value="draft">Draft (Admin Only)</option>
                    <option value="deactivated">Deactivated</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPaper.offlineAvailable ?? true}
                      onChange={(e) =>
                        setEditingPaper({ ...editingPaper, offlineAvailable: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-xs text-slate-800">
                      Enable Offline Student Storage
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowEditorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm shadow-purple-200 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save & Publish Paper'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* MODAL: PREVIEW PAST PAPER */}
      {/* ------------------------------------------------------------------------- */}
      {previewPaper && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900">
                    {previewPaper.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{previewPaper.subjectName}</span>
                    <span>•</span>
                    <span>{previewPaper.form || previewPaper.formLevel || 'Form 4'}</span>
                    <span>•</span>
                    <span>{previewPaper.year}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPaper(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs flex-1">
              {/* Overview */}
              {previewPaper.description && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">
                    Syllabus Scope &amp; Overview
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {previewPaper.description}
                  </p>
                </div>
              )}

              {/* Marking Guide */}
              {(previewPaper.hasMarkingGuide || previewPaper.hasMarkingScheme) && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-900 font-extrabold">
                    <FileCheck className="w-4 h-4 text-amber-600" />
                    <span>Official Marking Guide Summary</span>
                  </div>
                  <p className="text-amber-950 font-medium leading-relaxed">
                    {previewPaper.markingGuideSummary ||
                      previewPaper.markingSchemeSummary ||
                      'Includes comprehensive mark allocations and model answers.'}
                  </p>
                </div>
              )}

              {/* Sample Questions */}
              {previewPaper.questionsExcerpt && previewPaper.questionsExcerpt.length > 0 && (
                <div className="space-y-2">
                  <span className="font-black text-xs text-slate-900 uppercase tracking-wider block">
                    Sample Questions from Examination
                  </span>
                  <div className="space-y-2">
                    {previewPaper.questionsExcerpt.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-800">
                            Question {q.qNumber || idx + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                            {q.marks} Marks
                          </span>
                        </div>
                        <p className="text-slate-800 font-medium">{q.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">
                {previewPaper.fileSizeMb ? `${previewPaper.fileSizeMb} MB PDF` : 'PDF Document'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewPaper(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Close Preview
                </button>
                {previewPaper.downloadUrl && (
                  <a
                    href={previewPaper.downloadUrl}
                    download={`${previewPaper.title}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm shadow-purple-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Paper</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
