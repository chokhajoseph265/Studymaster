import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Plus,
  Calculator,
  Zap,
  Atom,
  Dna,
  BookOpen,
  Camera,
  X,
  Volume2,
  VolumeX,
  Copy,
  Check,
  AlertCircle,
  GraduationCap,
  ChevronRight,
  Search,
  CheckSquare,
  ArrowRight,
  Lightbulb,
  Trash2,
  MessageSquare,
  Clock,
  Mic,
  MicOff,
  PanelLeft,
  FileQuestion,
  HelpCircle,
  Layers,
  FlaskConical,
  Bell,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { AssistResponse, StudyFeatureMode, EducationLevel } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useBattery } from '../../context/BatteryContext';
import { AccessibilitySymbol } from '../common/AccessibilitySymbol';
import { api } from '../../services/api';
import { TutorTextbookResponse } from './TutorTextbookResponse';

interface StudyMasterAssistViewProps {
  initialQuery?: string;
  onOpenTopic?: (topicId: string, subjectId: string) => void;
  onOpenMoreMenu?: () => void;
  onOpenCalculator?: () => void;
  onOpenNotifications?: () => void;
  onOpenPeriodicTable?: () => void;
  onOpenInstall?: () => void;
  onOpenSearch?: () => void;
  unreadNotificationsCount?: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  mode?: StudyFeatureMode;
  educationLevel?: string;
  studentAttempt?: string;
  citations?: AssistResponse['sourceCitations'];
  matchedTopic?: string;
  matchedSubject?: string;
  matchedForm?: string;
  attachedImage?: string;
}

interface ChatSession {
  id: string;
  title: string;
  mode: StudyFeatureMode;
  educationLevel: EducationLevel;
  createdAt: number;
  messages: ChatMessage[];
  activeTopicId?: string;
  activeTopicTitle?: string;
  activeSubjectId?: string;
  activeSubjectName?: string;
  activeForm?: string;
}

const STORAGE_KEY = 'studymaster_ai_sessions_v2';
const ACTIVE_SESSION_KEY = 'studymaster_ai_active_session_id_v2';

// Smart pedagogical intent tags for one-tap guidance
const PEDAGOGICAL_ACTIONS = [
  { id: 'step_by_step', label: 'Step-by-Step', icon: CheckSquare, prefix: 'Please explain step-by-step: ' },
  { id: 'check_answer', label: 'Check My Work', icon: CheckSquare, prefix: '' },
  { id: 'practice_quiz', label: 'Practice Quiz', icon: FileQuestion, prefix: 'Generate a 3-question practice quiz on: ' },
  { id: 'chichewa', label: "Elezani m'Chichewa", icon: Globe, prefix: "Chonde fotokozani m'Chichewa ndi zitsanzo: " },
  { id: 'summarize', label: 'Summarize Notes', icon: BookOpen, prefix: 'Provide a concise syllabus summary of: ' },
  { id: 'formula_rules', label: 'Formulas & Laws', icon: Zap, prefix: 'State the formulas, SI units, and rules for: ' },
];

// Starter prompts spanning various forms and subjects showing universal coverage
const STARTER_PROMPTS: Array<{ title: string; query: string; icon: string; tag: string }> = [
  {
    title: 'Quadratic Equations & Formula',
    query: 'Solve 2x² + 5x - 3 = 0 step-by-step using factorization and quadratic formula',
    icon: '📐',
    tag: 'Mathematics • Form 3'
  },
  {
    title: 'Photosynthesis & Leaf Anatomy',
    query: 'Explain the light and dark stages of photosynthesis with the balanced chemical equation',
    icon: '🌿',
    tag: 'Biology • Form 2'
  },
  {
    title: "Ohm's Law & Solar Power",
    query: "Explain Ohm's Law and calculate resistance in a 12V Malawian solar battery circuit with 3A current",
    icon: '⚡',
    tag: 'Physical Science • Form 3'
  },
  {
    title: 'Acids, Bases & Neutralisation',
    query: 'Explain acid-base neutralisation with balanced chemical equations and everyday Malawian examples like ash and soap',
    icon: '🧪',
    tag: 'Chemistry • Form 4'
  },
  {
    title: 'Maravi Empire History',
    query: 'What were the main political and economic factors for the rise and fall of the Maravi Kingdom?',
    icon: '🏛️',
    tag: 'History • Form 2'
  },
  {
    title: 'Plant Cell vs Animal Cell',
    query: 'Describe the main differences between plant and animal cells under a light microscope with clear functions',
    icon: '🔬',
    tag: 'Biology • Form 1'
  }
];

export const StudyMasterAssistView: React.FC<StudyMasterAssistViewProps> = ({
  initialQuery = '',
  onOpenTopic,
  onOpenCalculator,
  onOpenNotifications,
  onOpenPeriodicTable,
  onOpenSearch,
  unreadNotificationsCount = 0,
}) => {
  const { activeForm: userForm, user } = useAuth();
  const {
    speak,
    stopSpeech,
    isSpeaking,
    activeSpeechId,
    speechSupported,
    setOpenAccessibilityModal,
    dyslexiaFont,
    highContrastMode,
    readingRuler,
  } = useAccessibility();
  const { themeMode, setThemeMode } = useBattery();

  // The AI Tutor is universal and covers all classes (Forms 1–4, JCE/MSCE, and Primary foundations).
  // Student's registered profile form is used only as background context if needed.
  const enrolledForm = (user?.activeForm || userForm || 'Form 2') as EducationLevel;
  const educationLevel: EducationLevel = 'All Classes' as any;

  // UI state
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState<boolean>(false);
  const [query, setQuery] = useState(initialQuery);
  const [studentAttempt, setStudentAttempt] = useState<string>('');
  const [showAttemptBox, setShowAttemptBox] = useState<boolean>(false);
  const [showActionChips, setShowActionChips] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Homework image upload
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [imageNotes, setImageNotes] = useState<string>('');

  // Voice speech-to-text
  const [isListening, setIsListening] = useState<boolean>(false);

  // Audio and clipboard state
  const speakingId = isSpeaking ? activeSpeechId : null;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Saved sessions management
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((s: any) => ({
          ...s,
          messages: (s.messages || []).map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
      }
    } catch {}
    return [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    try {
      return localStorage.getItem(ACTIVE_SESSION_KEY) || '';
    } catch {
      return '';
    }
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialQueryHandledRef = useRef<string>('');

  // Active session and its messages
  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
  const messages = activeSession ? activeSession.messages : [];

  // Persist sessions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      if (activeSessionId) {
        localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
      }
    } catch {}
  }, [sessions, activeSessionId]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [query]);

  // Initial query execution if passed from another view (e.g. topic page)
  useEffect(() => {
    if (initialQuery && initialQuery.trim() && initialQuery !== initialQueryHandledRef.current) {
      initialQueryHandledRef.current = initialQuery;
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  // Create new conversation
  const handleNewChat = () => {
    const newSessionId = 'session-' + Date.now();
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Conversation',
      mode: 'ask',
      educationLevel,
      createdAt: Date.now(),
      messages: []
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    setQuery('');
    setStudentAttempt('');
    setShowAttemptBox(false);
    setAttachedImage(null);
    setImageNotes('');
    setError(null);
    setHistoryDrawerOpen(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // Switch to an existing session
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setError(null);
    setHistoryDrawerOpen(false);
  };

  // Delete a specific session
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    if (activeSessionId === sessionId) {
      setActiveSessionId(updated.length > 0 ? updated[0].id : '');
    }
  };

  // Clear all sessions
  const handleClearAllSessions = () => {
    if (confirm('Clear all conversation history?')) {
      setSessions([]);
      setActiveSessionId('');
      setHistoryDrawerOpen(false);
    }
  };

  // Handle homework photo upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError('Photo is too large. Please select an image under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedImage(event.target?.result as string);
      setImageNotes(file.name);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Voice speech-to-text dictation
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice dictation is not supported in your browser. Please type your question.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-MW'; // Malawian English fallback
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // TTS Read Aloud (Connected to unified AccessibilityContext)
  const handleToggleSpeak = (id: string, text: string) => {
    if (!speechSupported) return;

    if (isSpeaking && activeSpeechId === id) {
      stopSpeech();
    } else {
      const cleanForSpeech = (raw: string) => {
        return raw
          .replace(/\\begin\{[a-z*]+\}[\s\S]*?\\end\{[a-z*]+\}/gi, ' mathematical matrix or equation ')
          .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2')
          .replace(/\\sqrt\{([^}]+)\}/g, 'square root of $1')
          .replace(/\\pm/g, 'plus or minus')
          .replace(/\\times/g, ' multiplied by ')
          .replace(/\\cdot/g, ' times ')
          .replace(/\^(\d+)/g, ' to the power $1')
          .replace(/\$+/g, '')
          .replace(/#{1,6}\s+/g, '')
          .replace(/[*_`]/g, '')
          .replace(/\n\n+/g, '. ')
          .trim();
      };
      speak(cleanForSpeech(text), undefined, id);
    }
  };

  // Copy answer to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Send message to Gemini
  const handleSend = async (
    textToSend: string,
    customAttempt?: string,
    customMode?: StudyFeatureMode
  ) => {
    const trimmed = textToSend.trim();
    const effectiveAttempt = (customAttempt !== undefined ? customAttempt : studentAttempt).trim();
    const effectiveMode = customMode || 'ask';

    if (!trimmed && !attachedImage && !effectiveAttempt) return;

    setError(null);
    setLoading(true);

    let targetSessionId = activeSessionId;
    if (!targetSessionId) {
      targetSessionId = 'session-' + Date.now();
      const newSession: ChatSession = {
        id: targetSessionId,
        title: trimmed.slice(0, 36) || 'Homework Scan',
        mode: effectiveMode,
        educationLevel,
        createdAt: Date.now(),
        messages: []
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(targetSessionId);
    }

    const userMsgId = 'msg-u-' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: trimmed || (attachedImage ? 'Homework snapshot attached for review.' : ''),
      timestamp: new Date(),
      mode: effectiveMode,
      educationLevel,
      studentAttempt: effectiveAttempt || undefined,
      attachedImage: attachedImage || undefined
    };

    const attemptToSend = effectiveAttempt;

    // Optimistically update conversation
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === targetSessionId) {
          const isFirst = s.messages.length === 0;
          return {
            ...s,
            title: isFirst ? (trimmed.slice(0, 36) || 'Homework Question') : s.title,
            messages: [...s.messages, newUserMsg]
          };
        }
        return s;
      })
    );

    setQuery('');
    setStudentAttempt('');
    setShowAttemptBox(false);

    // Scroll to user's question at top so student reads answer from top without autoscroll to bottom
    setTimeout(() => {
      const questionEl = document.getElementById(userMsgId);
      if (questionEl) {
        questionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);

    // Build chat history for Gemini multi-turn context (with topic continuity memory)
    const targetSession = sessions.find((s) => s.id === targetSessionId);
    const currentMsgs = targetSession?.messages || [];
    let contextMsgs = currentMsgs;
    if (currentMsgs.length > 12) {
      contextMsgs = [currentMsgs[0], ...currentMsgs.slice(-11)];
    }
    const historyPayload = contextMsgs.map((m) => ({
      role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
      text: m.text
    }));

    const activeTopicId = targetSession?.activeTopicId;
    const activeSubjectId = targetSession?.activeSubjectId;
    const activeTopicTitle = targetSession?.activeTopicTitle;
    const activeSubjectName = targetSession?.activeSubjectName;

    const imageToSend = attachedImage;
    const imageNotesToSend = imageNotes;
    setAttachedImage(null);
    setImageNotes('');

    const assistantMsgId = 'msg-a-' + Date.now();
    let accumulatedAnswer = '';
    let isFirstToken = true;

    try {
      await api.streamAssist(
        {
          query: trimmed,
          educationLevel,
          mode: effectiveMode,
          studentAttempt: attemptToSend || undefined,
          hasImage: !!imageToSend,
          imageNotes: imageNotesToSend,
          imageData: imageToSend || undefined,
          history: historyPayload,
          activeTopicId,
          activeSubjectId,
          activeTopicTitle,
          activeSubjectName
        },
        {
          onChunk: (chunk: string) => {
            if (isFirstToken) {
              isFirstToken = false;
              setLoading(false);
            }
            accumulatedAnswer += chunk;
            setSessions((prev) =>
              prev.map((s) => {
                if (s.id === targetSessionId) {
                  const existingIdx = s.messages.findIndex((m) => m.id === assistantMsgId);
                  if (existingIdx >= 0) {
                    const next = [...s.messages];
                    next[existingIdx] = {
                      ...next[existingIdx],
                      text: accumulatedAnswer
                    };
                    return { ...s, messages: next };
                  } else {
                    return {
                      ...s,
                      messages: [
                        ...s.messages,
                        {
                          id: assistantMsgId,
                          role: 'assistant',
                          text: accumulatedAnswer,
                          timestamp: new Date(),
                          mode: effectiveMode,
                          educationLevel
                        }
                      ]
                    };
                  }
                }
                return s;
              })
            );
          },
          onDone: (res: AssistResponse) => {
            setLoading(false);
            setSessions((prev) =>
              prev.map((s) => {
                if (s.id === targetSessionId) {
                  const existingIdx = s.messages.findIndex((m) => m.id === assistantMsgId);
                  const completeMsg: ChatMessage = {
                    id: assistantMsgId,
                    role: 'assistant',
                    text: res.answer || accumulatedAnswer,
                    timestamp: new Date(),
                    mode: res.mode || effectiveMode,
                    educationLevel: res.educationLevel || educationLevel,
                    citations: res.sourceCitations,
                    matchedTopic: res.matchedTopic,
                    matchedSubject: res.matchedSubject,
                    matchedForm: res.matchedForm || educationLevel
                  };

                  const updatedMessages = existingIdx >= 0
                    ? s.messages.map((m, idx) => idx === existingIdx ? completeMsg : m)
                    : [...s.messages, completeMsg];

                  const isPlaceholderTitle = s.title === 'Homework Question' || s.title.startsWith('Homework Scan') || s.title === 'New Conversation';

                  return {
                    ...s,
                    title: isPlaceholderTitle && res.matchedTopic ? res.matchedTopic : s.title,
                    activeTopicTitle: res.matchedTopic || s.activeTopicTitle,
                    activeSubjectName: res.matchedSubject || s.activeSubjectName,
                    activeTopicId: res.sourceCitations?.[0]?.topicId || s.activeTopicId,
                    activeSubjectId: res.sourceCitations?.[0]?.subjectId || s.activeSubjectId,
                    activeForm: res.matchedForm || s.activeForm,
                    messages: updatedMessages
                  };
                }
                return s;
              })
            );
          },
          onError: (streamErr: Error) => {
            setError(streamErr.message || 'Unable to reach StudyMaster Assist.');
          }
        }
      );
    } catch (e: any) {
      setError(e.message || 'Unable to reach StudyMaster Assist. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(query);
    }
  };

  const starterCards = STARTER_PROMPTS;

  return (
    <div className="relative flex flex-col w-full h-[calc(100dvh-58px)] bg-slate-50 dark:bg-black overflow-hidden font-sans">
      {/* ================================================================= */}
      {/* 1. UNIFIED SINGLE TOP BAR (BEST-IN-CLASS SINGLE NAV)              */}
      {/* ================================================================= */}
      <header className="h-14 px-3 sm:px-5 bg-white dark:bg-black border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between gap-2 sm:gap-4 shrink-0 z-30 shadow-2xs">
        {/* Left: History drawer toggle & Brand identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setHistoryDrawerOpen((prev) => !prev)}
            className="p-2 rounded-xl text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 border border-slate-200 dark:border-neutral-800 transition-colors shrink-0 relative"
            title="Conversation History"
            aria-label="Toggle history drawer"
          >
            <PanelLeft className="w-4 h-4" />
            {sessions.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-black" />
            )}
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  StudyMaster Assist
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Curriculum Tutor
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-neutral-400 hidden xs:block truncate">
                Malawi Secondary & Primary Curriculum Tutor
              </p>
            </div>
          </div>
        </div>

        {/* Right: Dedicated Buttons for Calculator, Periodic Table, Accessibility, Power Saving & New Chat */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* 1. Calculator Button */}
          {onOpenCalculator && (
            <button
              type="button"
              onClick={onOpenCalculator}
              className="h-8.5 sm:h-9 flex items-center gap-1.5 px-2 sm:px-2.5 rounded-xl bg-slate-50 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-neutral-700 hover:border-emerald-300 dark:hover:border-emerald-700 text-slate-700 dark:text-neutral-200 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-semibold transition-all active:scale-95 shadow-2xs shrink-0 cursor-pointer"
              title="Open Scientific Calculator"
              aria-label="Scientific Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="hidden lg:inline text-[11px]">Calculator</span>
            </button>
          )}

          {/* 2. Periodic Table Button */}
          {onOpenPeriodicTable && (
            <button
              type="button"
              onClick={onOpenPeriodicTable}
              className="h-8.5 sm:h-9 flex items-center gap-1.5 px-2 sm:px-2.5 rounded-xl bg-slate-50 dark:bg-neutral-800 hover:bg-purple-50 dark:hover:bg-purple-950/60 border border-slate-200 dark:border-neutral-700 hover:border-purple-300 dark:hover:border-purple-700 text-slate-700 dark:text-neutral-200 hover:text-purple-700 dark:hover:text-purple-300 text-xs font-semibold transition-all active:scale-95 shadow-2xs shrink-0 cursor-pointer"
              title="Open Interactive Periodic Table"
              aria-label="Periodic Table"
            >
              <FlaskConical className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span className="hidden lg:inline text-[11px]">Periodic Table</span>
            </button>
          )}

          {/* 3. Accessibility Button */}
          <button
            type="button"
            onClick={() => setOpenAccessibilityModal(true)}
            className={`h-8.5 sm:h-9 flex items-center gap-1.5 px-2 sm:px-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 shadow-2xs shrink-0 cursor-pointer ${
              dyslexiaFont || highContrastMode || readingRuler || isSpeaking
                ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-400/40'
                : 'bg-slate-50 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 hover:border-blue-300 dark:hover:border-blue-700 text-slate-700 dark:text-neutral-200 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-700 dark:hover:text-blue-300'
            }`}
            title="Inclusive Learning Hub (Assistive & Accessibility Tools)"
            aria-label="Inclusive Learning Hub"
          >
            <AccessibilitySymbol
              className={`w-3.5 h-3.5 shrink-0 ${
                dyslexiaFont || highContrastMode || readingRuler || isSpeaking
                  ? 'text-white'
                  : 'text-blue-600 dark:text-blue-400'
              }`}
            />
            <span className="hidden lg:inline text-[11px]">Inclusive Hub</span>
          </button>

          {/* 4. Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => setThemeMode(themeMode === 'amoled' ? 'light' : 'amoled')}
            className="h-8.5 sm:h-9 flex items-center justify-center px-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 shadow-2xs shrink-0 cursor-pointer bg-slate-50 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 hover:border-emerald-300 dark:hover:border-emerald-700 text-slate-700 dark:text-neutral-200"
            title={themeMode === 'amoled' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={themeMode === 'amoled' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {themeMode === 'light' ? (
              <Moon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 shrink-0" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
          </button>

          {/* + New Chat Action */}
          <button
            type="button"
            onClick={handleNewChat}
            className="h-8.5 sm:h-9 flex items-center gap-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs transition-all active:scale-95 shrink-0 cursor-pointer"
            title="Start new conversation"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </header>

      {/* ================================================================= */}
      {/* 2. CHAT CANVAS & HISTORY DRAWER                                   */}
      {/* ================================================================= */}
      <div className="flex-1 flex min-w-0 w-full overflow-hidden relative">
        {/* Backdrop for Drawer on mobile */}
        {historyDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-2xs transition-opacity"
            onClick={() => setHistoryDrawerOpen(false)}
          />
        )}

        {/* History Slide-out Drawer */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-black border-r border-slate-200 dark:border-neutral-800 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
            historyDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Chats</h2>
            </div>
            <button
              type="button"
              onClick={() => setHistoryDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat in Drawer */}
          <div className="p-3">
            <button
              type="button"
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-neutral-200 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-neutral-700 font-semibold text-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Conversation</span>
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
            {sessions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 dark:text-neutral-500">
                <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                No saved chats yet. Your questions and tutor explanations will appear here.
              </div>
            ) : (
              sessions.map((session) => {
                const isCurrent = session.id === activeSessionId;
                return (
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session.id)}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 font-semibold'
                        : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-start gap-2 truncate flex-1">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400 group-hover:text-emerald-600" />
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-xs">{session.title || 'Untitled Chat'}</span>
                        {session.activeTopicTitle && (
                          <span className="block truncate text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                            {session.activeSubjectName ? `${session.activeSubjectName} • ` : ''}{session.activeTopicTitle}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-opacity shrink-0"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-3 border-t border-slate-200 dark:border-neutral-800 bg-slate-50/70 dark:bg-neutral-900/50 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-neutral-400">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>MANEB Standards</span>
            </div>
            {sessions.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllSessions}
                className="text-[11px] text-slate-400 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </aside>

        {/* Main Chat Stream */}
        <main className="flex-1 flex flex-col min-w-0 h-full bg-white dark:bg-black relative">
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-6">
            {messages.length === 0 ? (
              /* ============================================================= */
              /* 3. WELCOME / STARTER VIEW (POLISHED, FOCUSED HERO)             */
              /* ============================================================= */
              <div className="max-w-2xl mx-auto py-6 sm:py-10 text-center space-y-6 animate-fadeIn">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-700 text-white shadow-sm">
                  <GraduationCap className="w-7 h-7" />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    StudyMaster Assist
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 mt-1.5 max-w-lg mx-auto leading-relaxed">
                    Your personal human-like teacher for the Malawi Curriculum. Ask questions, solve equations, check your homework, or scan textbook exercises.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-medium">
                      All Classes Covered: JCE & MSCE
                    </span>
                    <span className="text-[11px] px-3 py-1 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 font-medium">
                      Ask revision, current lessons, or advanced topics
                    </span>
                  </div>
                </div>

                {/* Homework Photo Upload Banner */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-400 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Have a handwritten question or textbook problem?
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-neutral-300 mt-0.5">
                        Take or upload a photo. Teacher Assist will inspect your working step by step.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* Starter Question Cards */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
                    Try an example question
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                    {starterCards.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(item.query)}
                        className="p-3.5 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/70 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xs transition-all text-left flex flex-col justify-between gap-2 group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                            {item.tag}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-2 mt-0.5 leading-relaxed">
                            {item.query}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ============================================================= */
              /* 4. CONVERSATION MESSAGES STREAM                               */
              /* ============================================================= */
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Topic Continuity Focus Banner */}
                {activeSession?.activeTopicTitle && (
                  <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs shadow-2xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 shrink-0">
                        Lesson Focus:
                      </span>
                      <span className="text-slate-700 dark:text-neutral-200 truncate font-medium">
                        {activeSession.activeSubjectName ? `${activeSession.activeSubjectName} • ` : ''}{activeSession.activeTopicTitle}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleNewChat}
                      className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 hover:underline shrink-0 flex items-center gap-1"
                      title="Start a new topic"
                    >
                      <span>Change Topic</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      id={msg.id}
                      className={`flex flex-col scroll-mt-4 ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      {/* User Message Bubble */}
                      {isUser ? (
                        <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
                          {msg.attachedImage && (
                            <div className="rounded-2xl overflow-hidden border border-emerald-500/30 shadow-xs">
                              <img
                                src={msg.attachedImage}
                                alt="Student snapshot"
                                className="max-h-60 rounded-xl object-contain bg-slate-900/10"
                              />
                            </div>
                          )}
                          <div className="p-3.5 sm:p-4 rounded-2xl rounded-tr-xs bg-emerald-600 text-white shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </div>
                          {msg.studentAttempt && (
                            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200">
                              <span className="font-bold block text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                My Attempted Solution:
                              </span>
                              <p className="mt-0.5">{msg.studentAttempt}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Assistant Message Bubble (KaTeX & Textbook response) */
                        <div className="w-full">
                          <TutorTextbookResponse
                            messageId={msg.id}
                            content={msg.text}
                            matchedSubject={msg.matchedSubject || 'Curriculum Subject'}
                            matchedTopic={msg.matchedTopic}
                            matchedForm={msg.matchedForm || educationLevel}
                            timestamp={msg.timestamp}
                            speakingId={speakingId}
                            copiedId={copiedId}
                            onToggleSpeak={handleToggleSpeak}
                            onCopy={handleCopy}
                            citations={msg.citations}
                            onOpenTopic={onOpenTopic}
                            onQuickPrompt={(prompt) => handleSend(prompt)}
                            onAnswerQuickCheck={(question, answer) => {
                              handleSend(
                                `Can you please check my answer to this question: "${question}"?`,
                                answer,
                                'explain_answer'
                              );
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading / Generating State */}
                {loading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs animate-pulse">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-2xl rounded-tl-xs bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                          Teacher Assist is preparing step-by-step notes
                        </span>
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                        Checking syllabus learning objectives, formulas, and pedagogical breakdown...
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{error}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSend(messages[messages.length - 1]?.text || query)}
                      className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 text-[11px]"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ============================================================= */}
          {/* 5. UNIFIED FLOATING INPUT COMPOSER (BOTTOM)                   */}
          {/* ============================================================= */}
          <div className="p-2 sm:p-2.5 border-t border-slate-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 backdrop-blur-md">
            <div className="max-w-3xl mx-auto space-y-1.5">
              {/* Optional Quick Pedagogical Action Chips (Only shown when toggled via ✨) */}
              {showActionChips && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs animate-fadeIn">
                  {PEDAGOGICAL_ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => {
                          if (action.id === 'check_answer') {
                            setShowAttemptBox((prev) => !prev);
                            setShowActionChips(false);
                          } else if (action.prefix) {
                            setQuery((prev) => (prev ? `${action.prefix}${prev}` : action.prefix));
                            textareaRef.current?.focus();
                            setShowActionChips(false);
                          }
                        }}
                        className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-200 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 border border-slate-200/80 dark:border-neutral-800 shrink-0"
                      >
                        <Icon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{action.label}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setShowActionChips(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300 shrink-0"
                    title="Close prompts"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Expandable "Check My Work" Attempt Box */}
              {showAttemptBox && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                      Your Attempted Solution / Steps (Optional):
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAttemptBox(false)}
                      className="text-amber-600 hover:text-amber-800 dark:hover:text-amber-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    value={studentAttempt}
                    onChange={(e) => setStudentAttempt(e.target.value)}
                    placeholder="e.g., I got x = 3 because I subtracted 5 from both sides, but I'm unsure about the sign..."
                    rows={2}
                    className="w-full text-xs bg-white dark:bg-neutral-900 border border-amber-200 dark:border-amber-700/60 rounded-lg p-2 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                  />
                </div>
              )}

              {/* Attached Photo Preview Tag */}
              {attachedImage && (
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 w-fit">
                  <img
                    src={attachedImage}
                    alt="Snapshot thumbnail"
                    className="w-7 h-7 rounded-md object-cover"
                  />
                  <span className="text-xs font-medium text-emerald-900 dark:text-emerald-200 max-w-xs truncate">
                    {imageNotes || 'Homework snapshot ready'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedImage(null);
                      setImageNotes('');
                    }}
                    className="p-1 rounded-md text-emerald-600 hover:text-red-600"
                    title="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Ultra-Compact Composer Input Bar */}
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-xl px-2 py-1 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all shadow-2xs">
                {/* Photo Upload Icon */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white transition-colors shrink-0"
                  title="Attach homework photo"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Voice Dictation Icon */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-500 dark:text-neutral-400'
                  }`}
                  title={isListening ? 'Listening...' : 'Voice dictation'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Quick Prompts Shortcut Button */}
                <button
                  type="button"
                  onClick={() => setShowActionChips((prev) => !prev)}
                  className={`p-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1 ${
                    showActionChips
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-500 dark:text-neutral-400'
                  }`}
                  title="Quick study prompts (Step-by-step, Quiz, Chichewa, etc.)"
                >
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-semibold hidden md:inline">Prompts</span>
                </button>

                {/* Primary Textarea */}
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask StudyMaster AI any question from any class..."
                  rows={1}
                  className="flex-1 bg-transparent border-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none resize-none py-1 px-1 max-h-32 leading-relaxed"
                />

                {/* Send Button */}
                <button
                  type="button"
                  onClick={() => handleSend(query)}
                  disabled={loading || (!query.trim() && !attachedImage && !studentAttempt.trim())}
                  className="p-1.5 sm:p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
                  aria-label="Send query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
