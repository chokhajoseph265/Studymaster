import React, { useState } from 'react';
import {
  X,
  LifeBuoy,
  HelpCircle,
  MessageSquarePlus,
  Phone,
  ChevronDown,
  ChevronUp,
  Search,
  Send,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  BookOpen,
  WifiOff,
  BatteryCharging,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ReportIssue } from '../../types';
import { api } from '../../services/api';

export interface HelpFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'faq' | 'feedback' | 'contact';
}

interface FaqItem {
  id: string;
  category: 'general' | 'offline' | 'maneb' | 'tutor' | 'battery';
  question: string;
  answer: string;
  tags: string[];
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'offline',
    question: 'How do I use StudyMaster offline without mobile data or airtime?',
    tags: ['Offline', 'PWA', 'Data Bundle'],
    answer:
      'StudyMaster is engineered with offline-first PWA caching. Once you open any subject, lesson notes, or past papers while connected, they automatically store into your phone browser storage. You can continue reading notes, attempting quizzes, and checking formulas even when you run out of airtime or internet connectivity.'
  },
  {
    id: 'faq-2',
    category: 'maneb',
    question: 'Where can I find MANEB past papers and marking schemes?',
    tags: ['MANEB', 'MSCE', 'JCE', 'Exams'],
    answer:
      'Tap the "Past Papers" tab in the bottom navigation. Official MSCE and JCE exam papers (2018–2025) are organized by subject. Each paper offers both standard reading mode and interactive timed mock exam mode, followed by step-by-step marking schemes with method (M) and accuracy (A) mark breakdowns.'
  },
  {
    id: 'faq-3',
    category: 'tutor',
    question: 'How does StudyMaster Assist teach step-by-step?',
    tags: ['Tutor', 'Assist', 'Chichewa'],
    answer:
      'StudyMaster Assist follows our core philosophy: «Teach the student, not the topic.» Rather than information-dumping, it breaks concepts into progressive levels: basic concept → clear starter example → breakdown → guided practice question → student independent check. It renders all math formulas, vectors, matrices, and balanced chemical equations in clean mathematical notation.'
  },
  {
    id: 'faq-4',
    category: 'battery',
    question: 'How does the Eco Battery Saver mode help during load-shedding?',
    tags: ['Battery', 'Blackout', 'Eco Mode'],
    answer:
      'Malawian students often study under load-shedding. When you switch on Eco Battery Saver via the lightning bolt icon in the top header, the app turns into high-contrast AMOLED pure black, stops CPU-intensive background tasks, and allows Screen-Off Audio mode so you can listen to voice lessons with your screen turned off to save phone battery.'
  },
  {
    id: 'faq-5',
    category: 'maneb',
    question: 'What is the difference between JCE and MSCE preparation modes?',
    tags: ['Forms', 'Syllabus', 'JCE', 'MSCE'],
    answer:
      'Use the Form selector at the top of your dashboard to switch between Form 1–2 (Junior Secondary Certificate of Education - JCE) and Form 3–4 (Malawi School Certificate of Education - MSCE). The questions, syllabus units, and mock timers automatically adapt to your chosen level.'
  },
  {
    id: 'faq-6',
    category: 'general',
    question: 'Can I report a typo, wrong marking answer, or missing syllabus diagram?',
    tags: ['Report', 'Typo', 'Corrections'],
    answer:
      'Yes! Open the "Report & Feedback" tab right here in this dialog. Select the category (such as "Content Error" or "Quiz Question Issue"), describe what you noticed, and submit. Our academic coordinators review submissions daily and update the syllabus content accordingly.'
  }
];

export const HelpFeedbackModal: React.FC<HelpFeedbackModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'faq'
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'faq' | 'feedback' | 'contact'>(defaultTab);

  // FAQ state
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Feedback Form State
  const [category, setCategory] = useState<ReportIssue['category']>('Content Error');
  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredFaqs = FAQS.filter((faq) => {
    if (selectedFaqCategory !== 'all' && faq.category !== selectedFaqCategory) {
      return false;
    }
    if (faqSearchQuery.trim()) {
      const q = faqSearchQuery.toLowerCase();
      const matchesQ =
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesQ) return false;
    }
    return true;
  });

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setSubmitError('Please provide both a title and description.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await api.submitReport({
        userId: user?.id || 'guest-student',
        username: user?.username || 'Student',
        category,
        title: title.trim(),
        description: description.trim(),
        subjectName: subjectName.trim() || undefined
      });

      setSubmittedTicketId(result.id);
      setTitle('');
      setSubjectName('');
      setDescription('');
    } catch (err: any) {
      console.error('Failed to submit student report:', err);
      setSubmitError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-feedback-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 id="help-feedback-title" className="text-base font-black text-slate-900 dark:text-white">
                Help & Feedback
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Secondary student guides, syllabus error reports & study helplines
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setActiveTab('faq');
                setSubmittedTicketId(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQs & Guides</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'feedback'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Report & Feedback</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('contact');
                setSubmittedTicketId(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Helplines</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: FAQS & GUIDES */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              {/* Search & Filter */}
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search FAQs (offline, MANEB, marks, formulas)..."
                    value={faqSearchQuery}
                    onChange={(e) => setFaqSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  {[
                    { id: 'all', label: 'All Topics' },
                    { id: 'offline', label: 'Offline Caching' },
                    { id: 'maneb', label: 'MANEB Exams' },
                    { id: 'tutor', label: 'StudyMaster Assist' },
                    { id: 'battery', label: 'Eco Saver' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedFaqCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                        selectedFaqCategory === cat.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accordion FAQ list */}
              <div className="space-y-2.5">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 overflow-hidden transition"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <div className="space-y-1 pr-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {faq.tags.map((t) => (
                              <span
                                key={t}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                          <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                            {faq.question}
                          </h3>
                        </div>
                        <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredFaqs.length === 0 && (
                  <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                    No FAQs match your search query. Try switching categories or check the Helplines tab.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: REPORT & FEEDBACK */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              {submittedTicketId ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-sm text-emerald-900 dark:text-emerald-200">
                    Ticket Submitted Successfully!
                  </h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                    Thank you for helping us maintain accurate secondary school material. Your ticket reference is{' '}
                    <span className="font-mono font-bold bg-white/70 dark:bg-slate-900 px-2 py-0.5 rounded-md">
                      #{submittedTicketId}
                    </span>
                    . Our academic team reviews and updates syllabus notes daily.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedTicketId(null)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Submit Another Report
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Notice a syllabus note error, wrong answer, or missing formula? Let our academic team know so we can correct it for all Malawian students.
                    </span>
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-bold">
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Report Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ReportIssue['category'])}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Content Error">Content Error (Notes / Theory)</option>
                        <option value="Quiz Question Issue">Quiz Question Issue</option>
                        <option value="Past Paper Typo">Past Paper / Marking Scheme</option>
                        <option value="App Bug / Technical">App Bug / Technical Glitch</option>
                        <option value="General Feedback">General Feedback & Suggestions</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Subject (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Physical Science, Mathematics, Biology"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Brief Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Form 3 Chemistry: Missing coefficient in redox equation"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Explanation & Details
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Explain what was incorrect, what the correct answer should be, or any additional context..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Sending Ticket...' : 'Submit Report'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: CONTACT & HELPLINES */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span className="font-extrabold text-xs tracking-wider uppercase text-emerald-400">
                      Malawi Secondary Academic Desk
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Direct Support</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Have questions about your exam registration, tricky MANEB questions, or curriculum clarification? Reach out through our official Malawian support channels.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-xs text-slate-900 dark:text-white">
                    WhatsApp Community
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Join secondary school study circles and teacher Q&A.
                  </p>
                  <p className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    +265 888 123 456
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Phone className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-xs text-slate-900 dark:text-white">
                    Toll-Free SMS Shortcode
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Works on TNM and Airtel Malawi without internet.
                  </p>
                  <p className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                    3040 (Free SMS)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-xs text-slate-900 dark:text-white">
                    Curriculum Email
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    For teachers, schools, and academic partners.
                  </p>
                  <p className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                    support@studymaster.mw
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
