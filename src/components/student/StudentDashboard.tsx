import React, { useState, useEffect } from 'react';
import {
  Play,
  Calendar,
  BookMarked,
  Edit3,
  X,
  RotateCcw,
  FileText,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Subject, FormLevel, Announcement, PastPaper } from '../../types';
import { INITIAL_SUBJECTS, INITIAL_TOPICS } from '../../data/initialData';
import { api } from '../../services/api';

interface StudentDashboardProps {
  onSelectSubject?: (subject: Subject) => void;
  onOpenSubjects?: () => void;
  onOpenAssist?: () => void;
  onOpenPastPapers?: () => void;
  onSelectPastPaper?: (paper: PastPaper) => void;
  onOpenLeaderboard?: () => void;
  onOpenExamTips: () => void;
  onOpenTopic: (topicId: string, subjectId: string) => void;
  announcements?: Announcement[];
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onSelectSubject: _onSelectSubject,
  onOpenSubjects,
  onOpenAssist: _onOpenAssist,
  onOpenPastPapers: _onOpenPastPapers,
  onSelectPastPaper,
  onOpenLeaderboard: _onOpenLeaderboard,
  onOpenExamTips: _onOpenExamTips,
  onOpenTopic,
  announcements: _announcements = []
}) => {
  const { user, activeForm, setActiveForm } = useAuth();

  // Form options with exam stages matching Subjects screen
  const formOptions: { level: FormLevel; stage: string; exam: string }[] = [
    { level: 'Form 1', stage: 'Junior Secondary', exam: 'JCE Foundation' },
    { level: 'Form 2', stage: 'Junior Secondary', exam: 'JCE Examination' },
    { level: 'Form 3', stage: 'Senior Secondary', exam: 'MSCE Foundation' },
    { level: 'Form 4', stage: 'Senior Secondary', exam: 'MSCE Examination' }
  ];

  // Recent / Featured topic to continue
  const resumeTopic = INITIAL_TOPICS.find((t) => t.form === activeForm) || INITIAL_TOPICS[0];
  const resumeSubject = INITIAL_SUBJECTS.find((s) => s.id === resumeTopic.subjectId) || INITIAL_SUBJECTS[0];
  const activeOption = formOptions.find((f) => f.level === activeForm) || formOptions[1];

  // Default MANEB Dates
  const DEFAULT_MSCE_DATE = '2026-06-23';
  const DEFAULT_JCE_DATE = '2026-06-15';

  // Customizable exam starting dates (persisted in localStorage)
  const [msceDate, setMsceDate] = useState<string>(() => {
    return localStorage.getItem('studymaster_custom_msce_date') || DEFAULT_MSCE_DATE;
  });

  const [jceDate, setJceDate] = useState<string>(() => {
    return localStorage.getItem('studymaster_custom_jce_date') || DEFAULT_JCE_DATE;
  });

  // Modal state for student adding / editing their exam starting date
  const [editingExam, setEditingExam] = useState<'MSCE' | 'JCE' | null>(null);
  const [tempDate, setTempDate] = useState<string>('');

  const openDateEditor = (exam: 'MSCE' | 'JCE') => {
    setEditingExam(exam);
    setTempDate(exam === 'MSCE' ? msceDate : jceDate);
  };

  const saveExamDate = () => {
    if (!tempDate || !editingExam) return;
    if (editingExam === 'MSCE') {
      setMsceDate(tempDate);
      localStorage.setItem('studymaster_custom_msce_date', tempDate);
    } else {
      setJceDate(tempDate);
      localStorage.setItem('studymaster_custom_jce_date', tempDate);
    }
    setEditingExam(null);
  };

  const resetExamDate = () => {
    if (!editingExam) return;
    if (editingExam === 'MSCE') {
      setMsceDate(DEFAULT_MSCE_DATE);
      localStorage.removeItem('studymaster_custom_msce_date');
    } else {
      setJceDate(DEFAULT_JCE_DATE);
      localStorage.removeItem('studymaster_custom_jce_date');
    }
    setEditingExam(null);
  };

  const calculateCountdown = (targetDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate + 'T00:00:00');
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const totalDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const weeks = Math.floor(totalDays / 7);
    return { totalDays, weeks };
  };

  const formatExamDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const msceCountdown = calculateCountdown(msceDate);
  const jceCountdown = calculateCountdown(jceDate);
  const isSenior = activeForm === 'Form 3' || activeForm === 'Form 4';

  // Load recently published past papers so students see them immediately
  const [recentPapers, setRecentPapers] = useState<PastPaper[]>([]);

  useEffect(() => {
    let isMounted = true;
    api
      .getPastPapers()
      .then((papers) => {
        if (isMounted && papers) {
          const published = papers.filter(
            (p) => p.status !== 'draft' && p.status !== 'deactivated'
          );
          setRecentPapers(published.slice(0, 3));
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6 pb-24 px-4 pt-3 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. HERO WELCOME & STUDY COMPANION BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                {activeOption.stage} • {activeOption.exam}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {user?.username ? `Welcome back, ${user.username}` : `Welcome to ${activeForm}`}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
              Master your Malawi syllabus with syllabus-aligned notes, past papers, and interactive teacher guidance.
            </p>
          </div>
        </div>

        {/* Form Selector Bar (Matching the Subject screen design) */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 sm:p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 px-1">
              <div className="text-xs font-extrabold text-slate-700 dark:text-slate-200 tracking-tight flex items-center gap-1.5">
                <span>Select Your Form Level</span>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/80 px-2 py-0.2 rounded-md whitespace-nowrap">
                  Currently in {activeForm}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Tap any form to view subjects and syllabus notes
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {formOptions.map((f) => {
                const isActive = activeForm === f.level;
                return (
                  <button
                    key={f.level}
                    type="button"
                    onClick={() => {
                      setActiveForm(f.level);
                      if (onOpenSubjects) {
                        onOpenSubjects();
                      }
                    }}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm scale-102 ring-2 ring-emerald-500/30'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white active:scale-98'
                    }`}
                    title={`Select ${f.level} and open subjects`}
                  >
                    <span className="text-xs sm:text-sm font-black">{f.level}</span>
                    <span
                      className={`text-[10px] font-semibold whitespace-nowrap ${
                        isActive ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {f.exam}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED FULL-ROW MANEB COUNTDOWN SECTION */}
      <section
        className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm relative overflow-hidden"
        aria-label="MANEB Examination Countdown"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
              <Calendar className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              MANEB Countdown
            </span>
          </div>

          {/* Right: Full Row Countdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
            {/* MSCE Countdown Card - Tappable to add/change exam starting date */}
            <button
              type="button"
              onClick={() => openDateEditor('MSCE')}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center sm:flex-col justify-between sm:justify-center text-left sm:text-center min-w-[155px] cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-98 group ${
                isSenior
                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/80 ring-2 ring-amber-500/25'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700'
              }`}
              title="Tap to set or change your MSCE exam starting date"
              aria-label="Tap to set MSCE exam starting date"
            >
              <div className="space-y-0.5">
                <div className="flex items-center sm:justify-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    MSCE
                  </span>
                  <Edit3 className="w-2.5 h-2.5 text-amber-600/70 dark:text-amber-400/70 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors" />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Starts {formatExamDate(msceDate)}
                </span>
              </div>

              <div className="flex items-baseline sm:justify-center gap-1 mt-0 sm:mt-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {msceCountdown.weeks}
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {msceCountdown.weeks === 1 ? 'week left' : 'weeks left'}
                </span>
              </div>
            </button>

            {/* JCE Countdown Card - Tappable to add/change exam starting date */}
            <button
              type="button"
              onClick={() => openDateEditor('JCE')}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center sm:flex-col justify-between sm:justify-center text-left sm:text-center min-w-[155px] cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-98 group ${
                !isSenior
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/80 ring-2 ring-emerald-500/25'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700'
              }`}
              title="Tap to set or change your JCE exam starting date"
              aria-label="Tap to set JCE exam starting date"
            >
              <div className="space-y-0.5">
                <div className="flex items-center sm:justify-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    JCE
                  </span>
                  <Edit3 className="w-2.5 h-2.5 text-emerald-600/70 dark:text-emerald-400/70 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors" />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Starts {formatExamDate(jceDate)}
                </span>
              </div>

              <div className="flex items-baseline sm:justify-center gap-1 mt-0 sm:mt-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {jceCountdown.weeks}
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {jceCountdown.weeks === 1 ? 'week left' : 'weeks left'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 3. CONTINUE STUDYING / ACTIVE TOPIC CARD */}
      <section className="bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-900/60 rounded-3xl p-4.5 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
              <BookMarked className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Continue Studying • {activeForm}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
                  {resumeSubject.name}
                </span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {resumeTopic.title}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 font-medium">
                {resumeTopic.summary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => onOpenTopic(resumeTopic.id, resumeSubject.id)}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>Resume Study</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. LATEST PUBLISHED PAST PAPERS */}
      {recentPapers.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Latest Published Past Papers</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-extrabold border border-purple-200 dark:border-purple-800">
                    MANEB
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Official national MSCE, JCE, and mock examination papers
                </p>
              </div>
            </div>

            {_onOpenPastPapers && (
              <button
                type="button"
                onClick={_onOpenPastPapers}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Papers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentPapers.map((paper) => (
              <div
                key={paper.id}
                onClick={() => {
                  if (onSelectPastPaper) {
                    onSelectPastPaper(paper);
                  } else if (_onOpenPastPapers) {
                    _onOpenPastPapers();
                  }
                }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between space-y-2.5 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-extrabold">
                      {paper.year} • {paper.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {paper.form || paper.formLevel || 'Form 4'}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                    {paper.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">
                    {paper.subjectName} • {paper.paperNumber || 'Paper 1'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-semibold">{paper.fileSizeMb || 1.5} MB PDF</span>
                  <span className="text-purple-700 dark:text-purple-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Practice Paper</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXAM START DATE PICKER MODAL */}
      {editingExam && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setEditingExam(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exam-date-modal-title"
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                    editingExam === 'MSCE'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="exam-date-modal-title" className="text-base font-black text-slate-900 dark:text-white">
                    Set {editingExam} Exam Start Date
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Adjust countdown for mock exams, school tests, or national MANEB papers
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingExam(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Date Input & Preview */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Examination Starting Date
                </label>
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                />
              </div>

              {/* Live Preview Box */}
              {tempDate && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Calculated Countdown:
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {calculateCountdown(tempDate).weeks} {calculateCountdown(tempDate).weeks === 1 ? 'week remaining' : 'weeks remaining'}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={resetExamDate}
                className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to MANEB</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingExam(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveExamDate}
                  disabled={!tempDate}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  Save Date
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
