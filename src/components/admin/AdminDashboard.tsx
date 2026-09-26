import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  Search,
  ShieldCheck,
  Eye,
  KeyRound,
  Lock,
  ArrowLeft,
  ExternalLink,
  Layers,
  Radio,
  Download,
  UploadCloud,
  X,
  GraduationCap,
  Music,
  Video,
  Image as ImageIcon,
  File,
  ChevronRight,
  LogOut,
  AlertTriangle,
  Clock
} from 'lucide-react';
import {
  Subject,
  Topic,
  NoteItem,
  FormLevel,
  FormInfo
} from '../../types';
import { api } from '../../services/api';
import { syncManager } from '../../services/syncManager';
import { ConnectedAppsModal } from '../common/ConnectedAppsModal';
import { MathMarkdown } from '../common/MathMarkdown';
import { NotesStudioEditor } from './NotesStudioEditor';
import { PastPaperStudio } from './PastPaperStudio';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onSwitchToStudent?: () => void;
  onOpenInstall?: () => void;
}

type AdminScreen = 'forms' | 'subjects' | 'topics' | 'notes' | 'security' | 'past_papers';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitAdmin,
  onSwitchToStudent,
  onOpenInstall
}) => {
  // Navigation Screens State
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>('forms');
  const [screenHistory, setScreenHistory] = useState<AdminScreen[]>(['forms']);

  // Selected Curriculum Hierarchy
  const [selectedForm, setSelectedForm] = useState<FormLevel>('Form 2');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  // Data Store
  const [forms, setForms] = useState<FormInfo[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter
  const [subjectSearch, setSubjectSearch] = useState<string>('');
  const [subjectCategoryFilter, setSubjectCategoryFilter] = useState<string>('all');
  const [topicSearch, setTopicSearch] = useState<string>('');

  // Note Editing & Creation State
  const [editingNote, setEditingNote] = useState<Partial<NoteItem> | null>(null);
  const [previewingNote, setPreviewingNote] = useState<NoteItem | null>(null);
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  const [activeMediaFormat, setActiveMediaFormat] = useState<
    'text' | 'document' | 'image' | 'audio' | 'video' | 'multimedia'
  >('text');

  // Media link inputs
  const [docUrlInput, setDocUrlInput] = useState<string>('');
  const [imgUrlInput, setImgUrlInput] = useState<string>('');
  const [audioUrlInput, setAudioUrlInput] = useState<string>('');
  const [videoUrlInput, setVideoUrlInput] = useState<string>('');

  // Topic Modal State (Create / Edit topic)
  const [showTopicModal, setShowTopicModal] = useState<boolean>(false);
  const [editingTopicItem, setEditingTopicItem] = useState<Partial<Topic> | null>(null);
  const [topicFormTitle, setTopicFormTitle] = useState<string>('');
  const [topicFormSummary, setTopicFormSummary] = useState<string>('');
  const [topicFormConcepts, setTopicFormConcepts] = useState<string>('');

  // Admin Security State
  const [currentPinInput, setCurrentPinInput] = useState<string>('');
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [confirmPinInput, setConfirmPinInput] = useState<string>('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [rememberDevice, setRememberDevice] = useState<boolean>(() => {
    return localStorage.getItem('studymaster_admin_authed_persistent') === 'true';
  });

  // UI Toast & Connected Apps Modal
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showConnectedApps, setShowConnectedApps] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial Data Fetching
  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [formsData, subjectsData, topicsData, notesData] = await Promise.all([
          api.getForms().catch(() => []),
          api.getSubjects().catch(() => []),
          api.getTopics().catch(() => []),
          api.getAdminNotes().catch(() => api.getNotes().catch(() => []))
        ]);

        if (isMounted) {
          setForms(
            formsData && formsData.length > 0
              ? formsData
              : [
                  { id: 'form-1', name: 'Form 1', alias: 'Junior 1', description: 'Secondary school entry syllabus & fundamental principles', order: 1 },
                  { id: 'form-2', name: 'Form 2', alias: 'Junior 2', description: 'Junior Certificate of Education (JCE) syllabus & core analysis', order: 2 },
                  { id: 'form-3', name: 'Form 3', alias: 'Senior 3', description: 'Senior secondary specialization & deep theoretical concepts', order: 3 },
                  { id: 'form-4', name: 'Form 4', alias: 'Senior 4', description: 'Malawi School Certificate of Education (MSCE) graduation mastery', order: 4 }
                ]
          );
          setSubjects(subjectsData || []);
          setTopics(topicsData || []);
          setNotes(notesData || []);
        }
      } catch (err) {
        console.error('Failed to load curriculum data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialData();

    // Listen to sync broadcast events
    const unsub = syncManager.subscribe((event) => {
      if (event.type === 'notes_updated') {
        api.getAdminNotes().then(setNotes).catch(() => {});
      } else if (event.type === 'topics_updated') {
        api.getTopics().then(setTopics).catch(() => {});
      }
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  // Screen Navigation helpers
  const navigateTo = (screen: AdminScreen) => {
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateBack = () => {
    if (editingNote) {
      if (window.confirm('Discard unsaved note edits?')) {
        setEditingNote(null);
      }
      return;
    }

    if (screenHistory.length > 1) {
      const nextHistory = [...screenHistory];
      nextHistory.pop();
      const prevScreen = nextHistory[nextHistory.length - 1];
      setScreenHistory(nextHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('forms');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Form selection
  const handleSelectForm = (form: FormLevel) => {
    setSelectedForm(form);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setEditingNote(null);
    navigateTo('subjects');
  };

  // Subject selection
  const handleSelectSubject = (subj: Subject) => {
    setSelectedSubject(subj);
    setSelectedTopic(null);
    setEditingNote(null);
    navigateTo('topics');
  };

  // Topic selection
  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setEditingNote(null);
    navigateTo('notes');
  };

  // Subjects applicable to the selected Form
  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const matchesForm = !s.forms || s.forms.length === 0 || s.forms.includes(selectedForm);
      const matchesCategory =
        subjectCategoryFilter === 'all' ||
        s.category?.toLowerCase() === subjectCategoryFilter.toLowerCase();
      const matchesSearch =
        !subjectSearch.trim() ||
        s.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
        s.description?.toLowerCase().includes(subjectSearch.toLowerCase());
      return matchesForm && matchesCategory && matchesSearch;
    });
  }, [subjects, selectedForm, subjectCategoryFilter, subjectSearch]);

  // Topics applicable to selected Subject & Form
  const filteredTopics = useMemo(() => {
    if (!selectedSubject) return [];
    return topics
      .filter((t) => {
        const matchesSubject = t.subjectId === selectedSubject.id;
        const topicForm = t.form || (t as any).formLevel;
        const matchesForm = !topicForm || topicForm === selectedForm;
        const matchesSearch =
          !topicSearch.trim() ||
          t.title.toLowerCase().includes(topicSearch.toLowerCase()) ||
          t.summary?.toLowerCase().includes(topicSearch.toLowerCase());
        return matchesSubject && matchesForm && matchesSearch;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [topics, selectedSubject, selectedForm, topicSearch]);

  // Notes applicable to selected Topic
  const filteredNotes = useMemo(() => {
    if (!selectedTopic) return [];
    return notes.filter((n) => {
      const matchTopicId = n.topicId === selectedTopic.id;
      const matchTopicTitle =
        n.title.toLowerCase().includes(selectedTopic.title.toLowerCase()) ||
        n.summary?.toLowerCase().includes(selectedTopic.title.toLowerCase());
      const noteForm = n.form || (n as any).formLevel;
      const matchForm = !noteForm || noteForm === selectedForm;
      return (matchTopicId || matchTopicTitle) && matchForm;
    });
  }, [notes, selectedTopic, selectedForm]);

  // Counts helpers
  const getSubjectCountForForm = (form: FormLevel) => {
    return subjects.filter((s) => !s.forms || s.forms.length === 0 || s.forms.includes(form)).length;
  };

  const getTopicCountForForm = (form: FormLevel) => {
    return topics.filter((t) => (t.form || (t as any).formLevel) === form).length;
  };

  const getNotesCountForForm = (form: FormLevel) => {
    return notes.filter((n) => (n.form || (n as any).formLevel) === form).length;
  };

  const getTopicCountForSubject = (subjId: string, form: FormLevel) => {
    return topics.filter((t) => t.subjectId === subjId && (t.form || (t as any).formLevel) === form).length;
  };

  const getNotesCountForSubject = (subjId: string, form: FormLevel) => {
    return notes.filter((n) => n.subjectId === subjId && (n.form || (n as any).formLevel) === form).length;
  };

  const getNotesCountForTopic = (topicId: string) => {
    return notes.filter((n) => n.topicId === topicId).length;
  };

  // Note creation / editing
  const handleStartAddNote = () => {
    if (!selectedTopic || !selectedSubject) return;

    setEditingNote({
      id: '',
      title: '',
      summary: '',
      content: `## 1.0 Introduction to ${selectedTopic.title}\n\n*Comprehensive revision note for ${selectedForm} ${selectedSubject.name}.*\n\n> **Definition:** State the fundamental scientific or mathematical definition here.\n\n## 2.0 Core Principles & Relationships\n\nExplain key concepts step-by-step with clear explanations:\n\n- **Principle 1:** First essential concept or rule\n- **Principle 2:** Second essential concept or rule\n\n> **Formula:** State the relevant formula or mathematical relationship.\n\n> **MSCE / JCE Exam Tip:** Important caution, common student error, or key exam focus point for MANEB.\n\n## 3.0 In Our Malawian Environment\n\n> **In Our Malawian Environment:** Real-world Malawian example or practical application (e.g. agriculture, Lake Malawi, ESCOM electricity, solar power).\n\n## 4.0 Summary & Review\n\n- Key summary point 1\n- Key summary point 2`,
      topicId: selectedTopic.id,
      subjectId: selectedSubject.id,
      form: selectedForm,
      formLevel: selectedForm,
      noteFormat: 'text',
      lessonBadge: 'CHAPTER LESSON',
      learningObjectives: [
        `Understand the core definitions and principles of ${selectedTopic.title}`,
        'Apply scientific formulas and concepts to solve problems',
        'Relate concepts to everyday applications in Malawi'
      ],
      status: 'published',
      offlineAvailable: true,
      assistAvailable: true,
      version: 1,
      estimatedReadTimeMinutes: 5
    });
    setActiveMediaFormat('text');
    setEditorTab('write');
    setDocUrlInput('');
    setImgUrlInput('');
    setAudioUrlInput('');
    setVideoUrlInput('');
  };

  const handleStartEditNote = (note: NoteItem) => {
    setEditingNote({ ...note });
    setActiveMediaFormat(note.noteFormat || 'text');
    setEditorTab('write');
    setDocUrlInput(note.documentUrl || '');
    setImgUrlInput(note.imageUrl || note.diagramUrl || '');
    setAudioUrlInput(note.audioUrl || '');
    setVideoUrlInput(note.videoUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNoteFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'document' | 'image' | 'audio' | 'video'
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editingNote) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (type === 'document') {
        setEditingNote((prev) => ({
          ...prev,
          documentFile: {
            name: file.name,
            mimeType: file.type || 'application/pdf',
            dataUrl,
            sizeBytes: file.size
          },
          documentName: file.name,
          documentSizeBytes: file.size
        }));
        showToast(`Document "${file.name}" attached successfully.`);
      } else if (type === 'image') {
        setEditingNote((prev) => ({
          ...prev,
          imageFile: {
            name: file.name,
            mimeType: file.type || 'image/png',
            dataUrl,
            caption: prev?.diagramCaption || file.name
          },
          diagramUrl: dataUrl,
          imageUrl: dataUrl
        }));
        showToast(`Diagram "${file.name}" uploaded successfully.`);
      } else if (type === 'audio') {
        setEditingNote((prev) => ({
          ...prev,
          audioFile: {
            name: file.name,
            title: prev?.audioTitle || file.name,
            mimeType: file.type || 'audio/mp3',
            dataUrl
          },
          audioUrl: dataUrl,
          audioTitle: prev?.audioTitle || file.name.replace(/\.[^/.]+$/, '')
        }));
        showToast(`Audio lecture "${file.name}" attached.`);
      } else if (type === 'video') {
        setEditingNote((prev) => ({
          ...prev,
          videoFile: {
            name: file.name,
            title: prev?.videoTitle || file.name,
            mimeType: file.type || 'video/mp4',
            dataUrl
          },
          videoUrl: dataUrl,
          videoTitle: prev?.videoTitle || file.name.replace(/\.[^/.]+$/, '')
        }));
        showToast(`Video lesson "${file.name}" attached.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyDocumentUrl = (url: string) => {
    if (!url.trim()) return;
    setEditingNote((prev) => ({
      ...prev,
      documentUrl: url.trim(),
      documentName: url.split('/').pop() || 'Curriculum Reference Document'
    }));
    showToast('Document link attached.');
  };

  const handleApplyImageUrl = (url: string) => {
    if (!url.trim()) return;
    setEditingNote((prev) => ({
      ...prev,
      imageUrl: url.trim(),
      diagramUrl: url.trim()
    }));
    showToast('Diagram URL linked.');
  };

  const handleApplyAudioUrl = (url: string) => {
    if (!url.trim()) return;
    setEditingNote((prev) => ({
      ...prev,
      audioUrl: url.trim(),
      audioTitle: prev?.audioTitle || 'Voice Audio Lecture'
    }));
    showToast('Audio stream linked.');
  };

  const handleApplyVideoUrl = (url: string) => {
    if (!url.trim()) return;
    setEditingNote((prev) => ({
      ...prev,
      videoUrl: url.trim(),
      videoTitle: prev?.videoTitle || 'Video Lesson Demonstration'
    }));
    showToast('Video link attached.');
  };

  const insertContentSnippet = (snippet: string) => {
    if (!editingNote) return;
    const current = editingNote.content || '';
    setEditingNote({
      ...editingNote,
      content: current ? `${current}\n\n${snippet}` : snippet
    });
  };

  const handleSaveNote = async (notePayload: NoteItem) => {
    if (!selectedTopic || !selectedSubject) return;

    if (!notePayload.title?.trim()) {
      alert('Please enter a note title.');
      return;
    }

    try {
      const isEdit = !!editingNote?.id;
      const saved = await api.saveAdminNote(notePayload, isEdit);

      setNotes((prev) => (isEdit ? prev.map((n) => (n.id === saved.id ? saved : n)) : [saved, ...prev]));
      syncManager.broadcast('notes_updated', 'admin', saved);

      setEditingNote(null);
      showToast(`Revision note "${saved.title}" published successfully!`);
    } catch (err: any) {
      alert(err.message || 'Failed to save note');
      throw err;
    }
  };

  const handleDirectFileUpload = async (file: File, type: 'document' | 'image' | 'audio' | 'video') => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (type === 'document') {
        setEditingNote((prev) =>
          prev
            ? {
                ...prev,
                documentFile: {
                  name: file.name,
                  mimeType: file.type || 'application/pdf',
                  dataUrl,
                  sizeBytes: file.size
                },
                documentName: file.name,
                documentSizeBytes: file.size
              }
            : null
        );
        showToast(`Document "${file.name}" attached successfully.`);
      } else if (type === 'image') {
        setEditingNote((prev) =>
          prev
            ? {
                ...prev,
                imageFile: {
                  name: file.name,
                  mimeType: file.type || 'image/png',
                  dataUrl,
                  caption: prev?.diagramCaption || file.name
                },
                diagramUrl: dataUrl,
                imageUrl: dataUrl
              }
            : null
        );
        showToast(`Diagram "${file.name}" uploaded successfully.`);
      } else if (type === 'audio') {
        setEditingNote((prev) =>
          prev
            ? {
                ...prev,
                audioFile: {
                  name: file.name,
                  title: prev?.audioTitle || file.name,
                  mimeType: file.type || 'audio/mp3',
                  dataUrl
                },
                audioUrl: dataUrl,
                audioTitle: prev?.audioTitle || file.name.replace(/\.[^/.]+$/, '')
              }
            : null
        );
        showToast(`Audio lecture "${file.name}" attached.`);
      } else if (type === 'video') {
        setEditingNote((prev) =>
          prev
            ? {
                ...prev,
                videoFile: {
                  name: file.name,
                  title: prev?.videoTitle || file.name,
                  mimeType: file.type || 'video/mp4',
                  dataUrl
                },
                videoUrl: dataUrl,
                videoTitle: prev?.videoTitle || file.name.replace(/\.[^/.]+$/, '')
              }
            : null
        );
        showToast(`Video lesson "${file.name}" attached.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteNote = async (id: string, noteTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete note "${noteTitle}"?`)) return;
    try {
      await api.deleteAdminNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      syncManager.broadcast('notes_updated', 'admin');
      showToast(`Note "${noteTitle}" deleted.`);
    } catch (err: any) {
      alert(err.message || 'Failed to delete note');
    }
  };

  // Topic handlers
  const handleOpenAddTopicModal = () => {
    setEditingTopicItem(null);
    setTopicFormTitle('');
    setTopicFormSummary('');
    setTopicFormConcepts('');
    setShowTopicModal(true);
  };

  const handleOpenEditTopicModal = (topic: Topic) => {
    setEditingTopicItem(topic);
    setTopicFormTitle(topic.title);
    setTopicFormSummary(topic.summary || '');
    setTopicFormConcepts(topic.keyConcepts ? topic.keyConcepts.join(', ') : '');
    setShowTopicModal(true);
  };

  const handleSaveTopicModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;

    if (!topicFormTitle.trim()) {
      alert('Please enter a topic title.');
      return;
    }

    try {
      const isEdit = !!editingTopicItem?.id;
      const conceptsArray = topicFormConcepts
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const topicPayload: Partial<Topic> = {
        id: editingTopicItem?.id || `topic-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        subjectId: selectedSubject.id,
        form: selectedForm,
        title: topicFormTitle.trim(),
        summary: topicFormSummary.trim() || `Syllabus topic for ${selectedForm} ${selectedSubject.name}`,
        order: editingTopicItem?.order || filteredTopics.length + 1,
        status: 'published',
        keyConcepts: conceptsArray.length > 0 ? conceptsArray : undefined
      };

      const saved = await api.saveAdminTopic(topicPayload, isEdit);
      setTopics((prev) => (isEdit ? prev.map((t) => (t.id === saved.id ? saved : t)) : [...prev, saved]));
      syncManager.broadcast('topics_updated', 'admin', saved);

      setShowTopicModal(false);
      showToast(`Topic "${saved.title}" saved successfully!`);
    } catch (err: any) {
      alert(err.message || 'Failed to save topic');
    }
  };

  const handleDeleteTopic = async (topicId: string, topicTitle: string) => {
    const topicNotesCount = getNotesCountForTopic(topicId);
    if (
      !window.confirm(
        `Delete topic "${topicTitle}"? ${
          topicNotesCount > 0 ? `Warning: This topic has ${topicNotesCount} attached notes.` : ''
        }`
      )
    ) {
      return;
    }

    try {
      await api.deleteAdminTopic(topicId);
      setTopics((prev) => prev.filter((t) => t.id !== topicId));
      syncManager.broadcast('topics_updated', 'admin');
      showToast(`Topic "${topicTitle}" deleted.`);
    } catch (err: any) {
      alert(err.message || 'Failed to delete topic');
    }
  };

  // Security handlers
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('studymaster_admin_pin') || '2026';

    if (currentPinInput !== storedPin) {
      setPinChangeMsg({ type: 'error', text: 'Current passcode is incorrect.' });
      return;
    }

    if (newPinInput.length < 4) {
      setPinChangeMsg({ type: 'error', text: 'New passcode must be at least 4 digits.' });
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setPinChangeMsg({ type: 'error', text: 'New passcodes do not match.' });
      return;
    }

    localStorage.setItem('studymaster_admin_pin', newPinInput);
    setPinChangeMsg({ type: 'success', text: 'Admin passcode updated successfully!' });
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    showToast('Admin PIN changed successfully.');
  };

  const handleResetPinToDefault = () => {
    if (window.confirm('Reset Admin PIN to factory default (2026)?')) {
      localStorage.setItem('studymaster_admin_pin', '2026');
      setPinChangeMsg({ type: 'success', text: 'Passcode reset to default (2026).' });
      showToast('PIN reset to default 2026.');
    }
  };

  const handleToggleRememberDevice = (checked: boolean) => {
    setRememberDevice(checked);
    if (checked) {
      localStorage.setItem('studymaster_admin_authed_persistent', 'true');
      showToast('Device will be remembered.');
    } else {
      localStorage.removeItem('studymaster_admin_authed_persistent');
      showToast('Remember device disabled.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR (Crisp White Theme) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (editingNote && !window.confirm('Discard unsaved note edits?')) return;
                setEditingNote(null);
                setCurrentScreen('forms');
                setScreenHistory(['forms']);
              }}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
                SM
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                    StudyMaster Admin
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    MW 🇲🇼
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Malawi Secondary School Notes & Curriculum Management
                </p>
              </div>
            </button>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2">
            {/* Past Paper Studio Button */}
            <button
              type="button"
              onClick={() => {
                if (currentScreen !== 'past_papers') {
                  navigateTo('past_papers');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                currentScreen === 'past_papers'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200'
              }`}
              title="MANEB MSCE & JCE Past Paper Studio"
            >
              <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
              <span>Past Paper Studio</span>
            </button>

            {/* Admin Security Button */}
            <button
              type="button"
              onClick={() => {
                if (currentScreen !== 'security') {
                  navigateTo('security');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                currentScreen === 'security'
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
              }`}
              title="Admin Security & Access Passcode"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin Security</span>
            </button>

            {/* Install Admin App Button */}
            {onOpenInstall && (
              <button
                type="button"
                onClick={onOpenInstall}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                title="Install StudyMaster Admin App on device"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            )}

            {/* Switch to Student App */}
            {onSwitchToStudent && (
              <button
                type="button"
                onClick={onSwitchToStudent}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Switch to Student App view"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Student App</span>
              </button>
            )}

            {/* Connected Ecosystem Modal trigger */}
            <button
              type="button"
              onClick={() => setShowConnectedApps(true)}
              className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full transition cursor-pointer"
              title="View connected apps ecosystem"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <Radio className="w-3 h-3 text-emerald-700" />
              <span>Live Database</span>
            </button>

            {/* Log Out */}
            <button
              type="button"
              onClick={onExitAdmin}
              className="p-2 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-500 border border-slate-200 transition-colors cursor-pointer"
              title="Log out of Admin Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Connected Apps Modal */}
      <ConnectedAppsModal
        isOpen={showConnectedApps}
        onClose={() => setShowConnectedApps(false)}
        currentApp="admin"
        onSwitchToAdmin={() => setShowConnectedApps(false)}
        onSwitchToStudent={() => {
          setShowConnectedApps(false);
          if (onSwitchToStudent) onSwitchToStudent();
        }}
      />

      {/* MAIN CONTENT AREA (White & Slate Theme) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Loading Indicator */}
        {loading && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl animate-pulse space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">Synchronizing Malawi secondary syllabus...</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 1: HOME SCREEN WITH FORMS */}
        {/* ========================================================================= */}
        {currentScreen === 'forms' && (
          <div className="space-y-6">
            {/* Hero Banner (White with subtle gradient) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-emerald-50 via-white to-slate-50 border border-emerald-200/80 shadow-xs relative overflow-hidden">
              <div className="relative z-10 space-y-2 max-w-2xl">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 block">
                  Malawi Secondary School Curriculum Management
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Curriculum & Revision Notes Studio
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Select a class Form level below to browse its subjects, syllabus topics, and manage revision notes
                  in structured text, documents, diagrams, audio lectures, and video demonstrations.
                </p>
              </div>

              {/* Quick stats badges */}
              <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold text-slate-900">{subjects.length}</span>
                  <span className="text-slate-500">Total Subjects</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  <span className="font-bold text-slate-900">{topics.length}</span>
                  <span className="text-slate-500">Syllabus Topics</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span className="font-bold text-slate-900">{notes.length}</span>
                  <span className="text-slate-500">Revision Notes</span>
                </div>
              </div>
            </div>

            {/* Forms Selection Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>Choose Class Form:</span>
                </h2>
                <span className="text-xs text-slate-500 font-medium">Forms 1 to 4 (JCE & MSCE)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    form: 'Form 1' as FormLevel,
                    title: 'Form 1',
                    alias: 'Junior 1',
                    badge: 'Foundation Level',
                    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                    borderColor: 'border-emerald-200 hover:border-emerald-500',
                    desc: 'Secondary school entry syllabus & fundamental principles across all subjects.'
                  },
                  {
                    form: 'Form 2' as FormLevel,
                    title: 'Form 2',
                    alias: 'Junior 2 (JCE)',
                    badge: 'JCE MANEB Exam Class',
                    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
                    borderColor: 'border-teal-200 hover:border-teal-500',
                    desc: 'Junior Certificate of Education syllabus, scientific analysis & core revision.'
                  },
                  {
                    form: 'Form 3' as FormLevel,
                    title: 'Form 3',
                    alias: 'Senior 3',
                    badge: 'Senior Secondary',
                    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
                    borderColor: 'border-blue-200 hover:border-blue-500',
                    desc: 'Senior secondary syllabus specialization, advanced theory & practical concepts.'
                  },
                  {
                    form: 'Form 4' as FormLevel,
                    title: 'Form 4',
                    alias: 'Senior 4 (MSCE)',
                    badge: 'MSCE MANEB Graduation',
                    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
                    borderColor: 'border-purple-200 hover:border-purple-500',
                    desc: 'Malawi School Certificate of Education graduation, national exam mastery & revision.'
                  }
                ].map((item) => {
                  const subjCount = getSubjectCountForForm(item.form);
                  const topCount = getTopicCountForForm(item.form);
                  const noteCount = getNotesCountForForm(item.form);

                  return (
                    <div
                      key={item.form}
                      onClick={() => handleSelectForm(item.form)}
                      className={`p-5 rounded-3xl bg-white border ${item.borderColor} shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500">{item.alias}</span>
                        </div>

                        <div>
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                            <span>{item.title}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 text-emerald-600" />
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                        <div className="grid grid-cols-3 gap-1 text-center">
                          <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
                            <span className="block text-xs font-black text-slate-900">{subjCount}</span>
                            <span className="block text-[9px] text-slate-500 uppercase font-semibold">Subjects</span>
                          </div>
                          <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
                            <span className="block text-xs font-black text-slate-900">{topCount}</span>
                            <span className="block text-[9px] text-slate-500 uppercase font-semibold">Topics</span>
                          </div>
                          <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
                            <span className="block text-xs font-black text-emerald-700">{noteCount}</span>
                            <span className="block text-[9px] text-slate-500 uppercase font-semibold">Notes</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="w-full py-2 rounded-xl bg-slate-100 group-hover:bg-emerald-600 text-slate-700 group-hover:text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Manage {item.title} Subjects</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Link Card to Past Paper Studio (ABOVE Admin Security) */}
            <div
              onClick={() => navigateTo('past_papers')}
              className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-purple-400 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-purple-900 transition-colors flex items-center gap-1.5">
                    <span>Past Paper Studio</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-extrabold border border-purple-200">
                      MANEB Exam Bank
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload, organize, and manage MSCE &amp; JCE national examination papers, official marking schemes, and answer keys.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-purple-50 group-hover:bg-purple-600 text-purple-900 group-hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-purple-600 group-hover:text-white" />
                <span>Open Past Paper Studio</span>
              </button>
            </div>

            {/* Quick Link Card to Admin Security */}
            <div
              onClick={() => navigateTo('security')}
              className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-800 transition-colors flex items-center gap-1.5">
                    <span>Admin Security & PIN Management</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-200">
                      Protected
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Change admin access PIN, manage remember device settings, and view terminal security.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-slate-100 group-hover:bg-amber-400 group-hover:text-slate-950 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700 group-hover:text-slate-950" />
                <span>Open Security Screen</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: SUBJECTS SCREEN (FOR SELECTED FORM) */}
        {/* ========================================================================= */}
        {currentScreen === 'subjects' && (
          <div className="space-y-5">
            {/* Header with Back button and Form Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={navigateBack}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1 text-xs font-bold shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4 text-emerald-600" />
                  <span>Back to Forms</span>
                </button>
                <div className="h-4 w-px bg-slate-200 mx-1" />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <span>Forms</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-emerald-700">{selectedForm}</span>
                  </div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">{selectedForm} Subjects</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">
                  {filteredSubjects.length} Subjects available for {selectedForm}
                </span>
              </div>
            </div>

            {/* Search and Category Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search subjects (e.g. Mathematics, Chemistry, Biology, English)..."
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-2xs transition"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'All Subjects' },
                  { id: 'Sciences', label: 'Sciences' },
                  { id: 'Languages', label: 'Languages' },
                  { id: 'Humanities', label: 'Humanities' },
                  { id: 'Commercial', label: 'Commercial' },
                  { id: 'Technical', label: 'Technical' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSubjectCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      subjectCategoryFilter === cat.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubjects.length === 0 ? (
                <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2 shadow-xs">
                  <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">No subjects found matching your search</p>
                  <p className="text-xs text-slate-500">Try changing the search filter or category selection.</p>
                </div>
              ) : (
                filteredSubjects.map((subj) => {
                  const topicCount = getTopicCountForSubject(subj.id, selectedForm);
                  const noteCount = getNotesCountForSubject(subj.id, selectedForm);

                  return (
                    <div
                      key={subj.id}
                      onClick={() => handleSelectSubject(subj)}
                      className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {subj.category || 'Sciences'}
                          </span>
                          <span className="text-xs font-bold text-slate-500">{selectedForm}</span>
                        </div>

                        <div>
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                            <span>{subj.name}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 text-emerald-600" />
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{subj.description}</p>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 font-medium">
                            <strong className="text-slate-900">{topicCount}</strong> Topics
                          </span>
                          <span className="text-slate-500 font-medium">
                            <strong className="text-emerald-700">{noteCount}</strong> Notes
                          </span>
                        </div>

                        <span className="text-xs font-bold text-emerald-700 group-hover:underline">
                          View Topics →
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: TOPICS SCREEN (FOR SELECTED SUBJECT & FORM) */}
        {/* ========================================================================= */}
        {currentScreen === 'topics' && selectedSubject && (
          <div className="space-y-5">
            {/* Header with Back button, Breadcrumb & Add Topic Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={navigateBack}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1 text-xs font-bold shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4 text-emerald-600" />
                  <span>Back to Subjects</span>
                </button>
                <div className="h-4 w-px bg-slate-200 mx-1" />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <span onClick={() => navigateTo('forms')} className="hover:text-slate-900 cursor-pointer">
                      Forms
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span onClick={() => navigateTo('subjects')} className="hover:text-slate-900 cursor-pointer">
                      {selectedForm}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-emerald-700">{selectedSubject.name}</span>
                  </div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    {selectedSubject.name} Topics ({selectedForm})
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAddTopicModal}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Topic</span>
                </button>
              </div>
            </div>

            {/* Search Topics Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${selectedSubject.name} topics...`}
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-2xs transition"
              />
            </div>

            {/* Topics List */}
            <div className="space-y-3">
              {filteredTopics.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3 shadow-xs">
                  <Layers className="w-10 h-10 text-slate-400 mx-auto" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      No topics found for {selectedSubject.name} ({selectedForm})
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Click "Add New Topic" to create the first syllabus topic for this subject.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddTopicModal}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Topic</span>
                  </button>
                </div>
              ) : (
                filteredTopics.map((topic, index) => {
                  const topicNotesCount = getNotesCountForTopic(topic.id);

                  return (
                    <div
                      key={topic.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      <div
                        onClick={() => handleSelectTopic(topic)}
                        className="space-y-1.5 flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold text-xs flex items-center justify-center">
                            {topic.order || index + 1}
                          </span>
                          <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {topic.title}
                          </h3>
                        </div>

                        {topic.summary && (
                          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl pl-8">
                            {topic.summary}
                          </p>
                        )}

                        {topic.keyConcepts && topic.keyConcepts.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pl-8 pt-1">
                            {topic.keyConcepts.slice(0, 4).map((c, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                              >
                                {c}
                              </span>
                            ))}
                            {topic.keyConcepts.length > 4 && (
                              <span className="text-[10px] text-slate-500 font-semibold">
                                +{topic.keyConcepts.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                        {/* Notes count badge */}
                        <div
                          onClick={() => handleSelectTopic(topic)}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:border-emerald-500"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="text-slate-900">{topicNotesCount}</span>
                          <span className="text-slate-500">{topicNotesCount === 1 ? 'Note' : 'Notes'}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSelectTopic(topic)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <span>Open Notes</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditTopicModal(topic)}
                            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
                            title="Edit topic details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteTopic(topic.id, topic.title)}
                            className="p-2 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-500 border border-slate-200 transition cursor-pointer"
                            title="Delete topic"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: NOTES SCREEN (EDIT EXISTING & ADD NEW NOTES) */}
        {/* ========================================================================= */}
        {currentScreen === 'notes' && selectedTopic && selectedSubject && (
          <div className="space-y-6">
            {/* Header with Back button, Breadcrumb & Primary Note Creation Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={navigateBack}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1 text-xs font-bold shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4 text-emerald-600" />
                  <span>{editingNote ? 'Back to Notes List' : 'Back to Topics'}</span>
                </button>
                <div className="h-4 w-px bg-slate-200 mx-1" />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <span onClick={() => navigateTo('forms')} className="hover:text-slate-900 cursor-pointer">
                      Forms
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span onClick={() => navigateTo('subjects')} className="hover:text-slate-900 cursor-pointer">
                      {selectedForm}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span onClick={() => navigateTo('topics')} className="hover:text-slate-900 cursor-pointer">
                      {selectedSubject.name}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-emerald-700 truncate max-w-[200px]">{selectedTopic.title}</span>
                  </div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    {editingNote
                      ? editingNote.id
                        ? 'Edit Revision Note'
                        : 'Publish New Revision Note'
                      : `Revision Notes: ${selectedTopic.title}`}
                  </h1>
                </div>
              </div>

              {!editingNote && (
                <button
                  type="button"
                  onClick={handleStartAddNote}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Note</span>
                </button>
              )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* VIEW A: NOTE EDITOR (FOR EDITING EXISTING & ADDING NEW) */}
            {/* ------------------------------------------------------------- */}
            {editingNote ? (
              <NotesStudioEditor
                initialNote={editingNote}
                selectedForm={selectedForm}
                selectedSubject={selectedSubject}
                selectedTopic={selectedTopic}
                onSave={handleSaveNote}
                onCancel={() => setEditingNote(null)}
                onFileUpload={handleDirectFileUpload}
              />
            ) : (
              /* ------------------------------------------------------------- */
              /* VIEW B: EXISTING NOTES LIST FOR THIS TOPIC */
              /* ------------------------------------------------------------- */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Existing Revision Notes ({filteredNotes.length})
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedForm} • {selectedSubject.name}
                  </span>
                </div>

                {filteredNotes.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3 shadow-xs">
                    <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        No revision notes exist for "{selectedTopic.title}" yet.
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Click "Add New Note" to create the first revision note with text, documents, diagrams, audio, or video.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleStartAddNote}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Note</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotes.map((note) => {
                      const hasDoc = !!(note.documentFile?.dataUrl || note.documentUrl);
                      const hasImage = !!(note.imageFile?.dataUrl || note.imageUrl || note.diagramUrl);
                      const hasAudio = !!(note.audioFile?.dataUrl || note.audioUrl);
                      const hasVideo = !!(note.videoFile?.dataUrl || note.videoUrl);

                      return (
                        <div
                          key={note.id}
                          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition flex flex-col md:flex-row md:items-start justify-between gap-4 group"
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200 uppercase">
                                {note.noteFormat || 'Text Note'}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                                {note.estimatedReadTimeMinutes || 3} min read
                              </span>
                              {note.updatedAt && (
                                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Updated {note.updatedAt}</span>
                                </span>
                              )}
                            </div>

                            <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {note.title}
                            </h3>

                            {note.summary && (
                              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{note.summary}</p>
                            )}

                            {/* Attached media indicators */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {hasDoc && (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                                  <File className="w-3 h-3 text-emerald-600" />
                                  <span>Document Attached</span>
                                </span>
                              )}
                              {hasImage && (
                                <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-800 text-[10px] font-bold flex items-center gap-1">
                                  <ImageIcon className="w-3 h-3 text-purple-600" />
                                  <span>Diagram Chart</span>
                                </span>
                              )}
                              {hasAudio && (
                                <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold flex items-center gap-1">
                                  <Music className="w-3 h-3 text-blue-600" />
                                  <span>Audio Lecture</span>
                                </span>
                              )}
                              {hasVideo && (
                                <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-bold flex items-center gap-1">
                                  <Video className="w-3 h-3 text-rose-600" />
                                  <span>Video Demo</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Note Action Buttons */}
                          <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0 self-end md:self-center">
                            {/* Live Preview Button */}
                            <button
                              type="button"
                              onClick={() => setPreviewingNote(note)}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Preview student view"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Preview</span>
                            </button>

                            {/* Edit Note Button */}
                            <button
                              type="button"
                              onClick={() => handleStartEditNote(note)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                              title="Edit this revision note"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Note Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteNote(note.id, note.title)}
                              className="p-2 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-500 border border-slate-200 transition cursor-pointer"
                              title="Delete note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN: PAST PAPER STUDIO */}
        {/* ========================================================================= */}
        {currentScreen === 'past_papers' && (
          <PastPaperStudio
            subjects={subjects}
            onBack={() => {
              setCurrentScreen('forms');
              setScreenHistory(['forms']);
            }}
            showToast={showToast}
          />
        )}

        {/* ========================================================================= */}
        {/* SCREEN 5: ADMIN SECURITY SCREEN */}
        {/* ========================================================================= */}
        {currentScreen === 'security' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <button
                type="button"
                onClick={navigateBack}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1 text-xs font-bold shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-600" />
                <span>Back</span>
              </button>
              <div className="h-4 w-px bg-slate-200 mx-1" />
              <div>
                <span className="text-xs font-bold text-amber-700">Admin Control</span>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Admin Security & Access</h1>
              </div>
            </div>

            {/* Security Status Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900">Administrator Access Protected</h2>
                  <p className="text-xs text-slate-500">
                    The Admin Dashboard is guarded with a 4-digit security PIN and automatic lockout protection.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Session Status</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    Authenticated Administrator
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Terminal Lockout</span>
                  <span className="font-bold text-slate-800">3 Attempts (30s lock)</span>
                </div>
              </div>

              {/* Remember on this device toggle */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Remember Session on This Device</span>
                  <span className="text-slate-500 text-[11px]">
                    Keeps you logged in on this browser without asking for PIN on refresh.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => handleToggleRememberDevice(e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Change Admin PIN Form */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  <span>Update Admin Access Passcode</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Default factory passcode is 2026. Change this to safeguard your curriculum editing console.
                </p>
              </div>

              {pinChangeMsg && (
                <div
                  className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                    pinChangeMsg.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-700'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{pinChangeMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold mb-1 text-slate-700">Current Passcode:</label>
                  <input
                    type="password"
                    required
                    value={currentPinInput}
                    onChange={(e) => setCurrentPinInput(e.target.value)}
                    placeholder="Enter current PIN"
                    className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-sm focus:outline-none focus:border-emerald-600 shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">New Passcode (4+ digits):</label>
                    <input
                      type="password"
                      required
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="e.g. 5831"
                      className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-sm focus:outline-none focus:border-emerald-600 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Confirm New Passcode:</label>
                    <input
                      type="password"
                      required
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value)}
                      placeholder="Repeat new PIN"
                      className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-sm focus:outline-none focus:border-emerald-600 shadow-2xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98"
                >
                  <Save className="w-4 h-4" />
                  <span>Save New Admin Passcode</span>
                </button>
              </form>
            </div>

            {/* Danger / Reset Actions */}
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Factory Passcode Reset</span>
                <span className="text-slate-500 text-[11px]">
                  Resets the passcode back to standard default: 2026.
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetPinToDefault}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold transition cursor-pointer self-start sm:self-auto shadow-2xs"
              >
                Reset to 2026
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT TOPIC MODAL (White Theme) */}
      {/* ========================================================================= */}
      {showTopicModal && selectedSubject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in text-xs text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editingTopicItem ? 'Edit Topic' : 'Add New Topic'}
                </h3>
                <span className="text-[11px] text-slate-500">
                  {selectedForm} • {selectedSubject.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowTopicModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTopicModal} className="space-y-4">
              <div>
                <label className="block font-bold mb-1 text-slate-700">
                  Topic Title: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acids, Bases and Salts"
                  value={topicFormTitle}
                  onChange={(e) => setTopicFormTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-xs focus:outline-none focus:border-emerald-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Summary / Overview:</label>
                <textarea
                  rows={3}
                  placeholder="Brief syllabus outline or MANEB focus for this chapter..."
                  value={topicFormSummary}
                  onChange={(e) => setTopicFormSummary(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs leading-relaxed focus:outline-none focus:border-emerald-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">
                  Key Concepts (comma-separated):
                </label>
                <input
                  type="text"
                  placeholder="e.g. pH Scale, Neutralisation, Indicators, Acid Rain"
                  value={topicFormConcepts}
                  onChange={(e) => setTopicFormConcepts(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTopicModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingTopicItem ? 'Update Topic' : 'Create Topic'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: STUDENT-FACING LIVE NOTE PREVIEW (White Theme) */}
      {/* ========================================================================= */}
      {previewingNote && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl text-xs text-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                  {previewingNote.form || (previewingNote as any).formLevel || selectedForm}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                  {selectedSubject?.name || 'Subject'}
                </span>
                <span className="text-slate-500 font-medium hidden sm:inline">• Student Live View Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingNote(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note Title & Summary */}
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-2">{previewingNote.title}</h2>
              {previewingNote.summary && (
                <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {previewingNote.summary}
                </p>
              )}
            </div>

            {/* Rendered Math & Markdown */}
            {previewingNote.content && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 leading-relaxed overflow-x-auto text-slate-800">
                <MathMarkdown content={previewingNote.content} />
              </div>
            )}

            {/* Attached Media Previews */}
            <div className="space-y-4">
              {/* Document */}
              {(previewingNote.documentFile?.dataUrl || previewingNote.documentUrl) && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <File className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">
                        {previewingNote.documentName || previewingNote.documentFile?.name || 'Study Reference Document'}
                      </span>
                      <span className="text-[11px] text-emerald-700">Curriculum Handout File</span>
                    </div>
                  </div>
                  <a
                    href={previewingNote.documentFile?.dataUrl || previewingNote.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open File</span>
                  </a>
                </div>
              )}

              {/* Diagram / Image */}
              {(previewingNote.imageFile?.dataUrl || previewingNote.imageUrl || previewingNote.diagramUrl) && (
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 text-center">
                  <span className="text-xs font-bold text-purple-900 block">
                    {previewingNote.diagramCaption || 'Scientific Diagram / Syllabus Chart'}
                  </span>
                  <div className="flex justify-center bg-white p-2 rounded-xl border border-purple-100">
                    <img
                      src={previewingNote.imageFile?.dataUrl || previewingNote.imageUrl || previewingNote.diagramUrl}
                      alt="Diagram"
                      className="max-h-72 w-auto object-contain rounded"
                    />
                  </div>
                </div>
              )}

              {/* Audio Lecture */}
              {(previewingNote.audioFile?.dataUrl || previewingNote.audioUrl) && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                  <span className="text-xs font-bold text-blue-900 block">
                    {previewingNote.audioTitle || 'Voice Lecture / Audio Lesson'}
                  </span>
                  <audio
                    controls
                    className="w-full h-9"
                    src={previewingNote.audioFile?.dataUrl || previewingNote.audioUrl}
                  />
                </div>
              )}

              {/* Video Demonstration */}
              {(previewingNote.videoFile?.dataUrl || previewingNote.videoUrl) && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 text-center">
                  <span className="text-xs font-bold text-rose-900 block">
                    {previewingNote.videoTitle || 'Video Lesson / Demonstration'}
                  </span>
                  <div className="rounded-xl overflow-hidden bg-black flex justify-center">
                    {previewingNote.videoUrl?.includes('youtube.com') ||
                    previewingNote.videoUrl?.includes('youtu.be') ? (
                      <iframe
                        src={
                          previewingNote.videoUrl.includes('watch?v=')
                            ? `https://www.youtube.com/embed/${
                                previewingNote.videoUrl.split('watch?v=')[1]?.split('&')[0]
                              }`
                            : previewingNote.videoUrl.includes('youtu.be/')
                            ? `https://www.youtube.com/embed/${
                                previewingNote.videoUrl.split('youtu.be/')[1]?.split('?')[0]
                              }`
                            : previewingNote.videoUrl
                        }
                        title="Video Preview"
                        className="w-full h-72 rounded-xl"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        controls
                        className="max-h-72 w-full object-contain"
                        src={previewingNote.videoFile?.dataUrl || previewingNote.videoUrl}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewingNote(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-auto py-4 px-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <p>StudyMaster Malawi • National Secondary Curriculum Console (Forms 1–4, JCE & MSCE MANEB)</p>
      </footer>
    </div>
  );
};
