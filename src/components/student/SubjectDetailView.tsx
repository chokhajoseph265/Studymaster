import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  HelpCircle,
  Calculator,
  FlaskConical,
  Atom,
  Dna,
  Sprout,
  Globe,
  Landmark,
  Languages,
  Laptop,
  TrendingUp,
  Users,
  ChevronRight,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';
import { Subject, Topic, NoteItem, Lesson, Quiz, PastPaper, FormLevel } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { offlineStorage } from '../../services/offlineStorage';

interface SubjectDetailViewProps {
  subject: Subject;
  onBack: () => void;
  onSelectTopic: (topic: Topic) => void;
  onStartQuiz: (quiz: Quiz) => void;
  onSelectPastPaper: (paper: PastPaper) => void;
  onAskAssist: (topicTitle: string) => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subject,
  onBack,
  onSelectTopic,
  onStartQuiz,
  onSelectPastPaper,
  onAskAssist
}) => {
  const { activeForm, setActiveForm, user, triggerCelebration } = useAuth();
  const [activeTab, setActiveTab] = useState<'topics' | 'quizzes' | 'papers'>('topics');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [pastPapers, setPastPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const [topicsData, quizzesData, papersData] = await Promise.all([
          api.getTopics(subject.id, activeForm),
          api.getQuizzes(undefined, subject.id, activeForm),
          api.getPastPapers(subject.id, activeForm)
        ]);
        setTopics(topicsData);
        setQuizzes(quizzesData);
        setPastPapers(papersData);
      } catch (e) {
        console.warn('Subject content load error:', e);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [subject.id, activeForm]);

  const getSubjectHeroVisuals = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('math')) {
      return {
        icon: <Calculator className="w-7 h-7 text-emerald-200" />,
        headerBg: 'bg-emerald-950 text-white shadow-md border border-emerald-800',
        badgeBg: 'text-emerald-300 bg-emerald-900/80 border-emerald-700/50',
        descText: 'text-emerald-100/90'
      };
    }
    if (n.includes('physic')) {
      return {
        icon: <Atom className="w-7 h-7 text-sky-200" />,
        headerBg: 'bg-sky-950 text-white shadow-md border border-sky-800',
        badgeBg: 'text-sky-300 bg-sky-900/80 border-sky-700/50',
        descText: 'text-sky-100/90'
      };
    }
    if (n.includes('chem')) {
      return {
        icon: <FlaskConical className="w-7 h-7 text-teal-200" />,
        headerBg: 'bg-teal-950 text-white shadow-md border border-teal-800',
        badgeBg: 'text-teal-300 bg-teal-900/80 border-teal-700/50',
        descText: 'text-teal-100/90'
      };
    }
    if (n.includes('bio')) {
      return {
        icon: <Dna className="w-7 h-7 text-green-200" />,
        headerBg: 'bg-green-950 text-white shadow-md border border-green-800',
        badgeBg: 'text-green-300 bg-green-900/80 border-green-700/50',
        descText: 'text-green-100/90'
      };
    }
    if (n.includes('agri')) {
      return {
        icon: <Sprout className="w-7 h-7 text-emerald-200" />,
        headerBg: 'bg-emerald-950 text-white shadow-md border border-emerald-800',
        badgeBg: 'text-emerald-300 bg-emerald-900/80 border-emerald-700/50',
        descText: 'text-emerald-100/90'
      };
    }
    if (n.includes('chichewa') || n.includes('english') || n.includes('french')) {
      return {
        icon: <Languages className="w-7 h-7 text-amber-200" />,
        headerBg: 'bg-amber-950 text-white shadow-md border border-amber-800',
        badgeBg: 'text-amber-300 bg-amber-900/80 border-amber-700/50',
        descText: 'text-amber-100/90'
      };
    }
    if (n.includes('history')) {
      return {
        icon: <Landmark className="w-7 h-7 text-amber-200" />,
        headerBg: 'bg-amber-950 text-white shadow-md border border-amber-800',
        badgeBg: 'text-amber-300 bg-amber-900/80 border-amber-700/50',
        descText: 'text-amber-100/90'
      };
    }
    if (n.includes('geography')) {
      return {
        icon: <Globe className="w-7 h-7 text-blue-200" />,
        headerBg: 'bg-blue-950 text-white shadow-md border border-blue-800',
        badgeBg: 'text-blue-300 bg-blue-900/80 border-blue-700/50',
        descText: 'text-blue-100/90'
      };
    }
    if (n.includes('computer')) {
      return {
        icon: <Laptop className="w-7 h-7 text-indigo-200" />,
        headerBg: 'bg-indigo-950 text-white shadow-md border border-indigo-800',
        badgeBg: 'text-indigo-300 bg-indigo-900/80 border-indigo-700/50',
        descText: 'text-indigo-100/90'
      };
    }
    if (n.includes('business') || n.includes('account') || n.includes('econom')) {
      return {
        icon: <TrendingUp className="w-7 h-7 text-rose-200" />,
        headerBg: 'bg-rose-950 text-white shadow-md border border-rose-800',
        badgeBg: 'text-rose-300 bg-rose-900/80 border-rose-700/50',
        descText: 'text-rose-100/90'
      };
    }
    if (n.includes('social') || n.includes('life')) {
      return {
        icon: <Users className="w-7 h-7 text-purple-200" />,
        headerBg: 'bg-purple-950 text-white shadow-md border border-purple-800',
        badgeBg: 'text-purple-300 bg-purple-900/80 border-purple-700/50',
        descText: 'text-purple-100/90'
      };
    }
    return {
      icon: <BookOpen className="w-7 h-7 text-emerald-200" />,
      headerBg: 'bg-emerald-950 text-white shadow-md border border-emerald-800',
      badgeBg: 'text-emerald-300 bg-emerald-900/80 border-emerald-700/50',
      descText: 'text-emerald-100/90'
    };
  };

  const heroVisual = getSubjectHeroVisuals(subject.name);

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto px-1 sm:px-2">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors shadow-2xs self-start cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Subjects</span>
        </button>

        {/* Form Selector */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-1.5 shrink-0">Form:</span>
          {(['Form 1', 'Form 2', 'Form 3', 'Form 4'] as FormLevel[]).map((f) => {
            const isAvailable = subject.forms.includes(f);
            const isActive = activeForm === f;
            return (
              <button
                key={f}
                type="button"
                disabled={!isAvailable}
                onClick={() => setActiveForm(f)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isAvailable
                    ? 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    : 'text-slate-300 dark:text-slate-700 cursor-not-allowed line-through opacity-50'
                }`}
                title={isAvailable ? `Switch to ${f}` : `${subject.name} not offered in ${f}`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Hero Header */}
      <div className={`p-5 sm:p-6 rounded-3xl ${heroVisual.headerBg}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border whitespace-nowrap ${heroVisual.badgeBg}`}>
              {subject.category}
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1.5">
              {subject.name}
            </h1>
            <p className={`text-xs sm:text-sm font-medium mt-1 max-w-md ${heroVisual.descText}`}>
              {subject.description}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            {heroVisual.icon}
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/10 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('topics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
              activeTab === 'topics'
                ? 'bg-white text-emerald-950 dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Topics & Notes ({topics.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quizzes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
              activeTab === 'quizzes'
                ? 'bg-white text-emerald-950 dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Practice Quizzes ({quizzes.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('papers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
              activeTab === 'papers'
                ? 'bg-white text-emerald-950 dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Past Papers ({pastPapers.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
          Loading {subject.name} syllabus resources...
        </div>
      ) : (
        <>
          {/* 1. TOPICS & NOTES TAB */}
          {activeTab === 'topics' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  {activeForm} Syllabus Topics ({topics.length})
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Step-by-step lessons, formulas & worked examples
                </span>
              </div>

              {topics.length > 0 ? (
                <div className="space-y-2.5">
                  {topics.map((topic, index) => {
                    return (
                      <div
                        key={topic.id}
                        onClick={() => onSelectTopic(topic)}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/80 transition-colors">
                              {index + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {topic.title}
                                </h3>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed font-medium">
                                {topic.summary}
                              </p>

                              {topic.keyConcepts && topic.keyConcepts.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {topic.keyConcepts.slice(0, 3).map((kc, i) => (
                                    <span
                                      key={i}
                                      className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                                    >
                                      • {kc}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/80 text-slate-400 dark:text-slate-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors shrink-0">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  No topics published for {activeForm} in {subject.name} yet. Check back soon or switch forms!
                </div>
              )}
            </div>
          )}

          {/* 2. QUIZZES TAB */}
          {activeTab === 'quizzes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  Interactive Practice Quizzes ({quizzes.length})
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  Earn up to 50 pts per quiz
                </span>
              </div>

              {quizzes.length > 0 ? (
                <div className="space-y-2.5">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/80 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800 whitespace-nowrap">
                            +{quiz.pointsAwarded} Pts Award
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            {quiz.questions.length} Questions • {quiz.timeLimitMinutes} Mins
                          </span>
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                          {quiz.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{quiz.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onStartQuiz(quiz)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer whitespace-nowrap"
                      >
                        <span>Start Quiz</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  No active quizzes for this form subject yet. Practice questions are available inside individual topic notes!
                </div>
              )}
            </div>
          )}

          {/* 3. PAST PAPERS TAB */}
          {activeTab === 'papers' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  Secondary School Past Papers ({pastPapers.length})
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Term exams, cluster mocks & past papers with marking guides
                </span>
              </div>

              {pastPapers.length > 0 ? (
                <div className="space-y-2.5">
                  {pastPapers.map((paper) => (
                    <div
                      key={paper.id}
                      onClick={() => onSelectPastPaper(paper)}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-500 hover:shadow-md transition-all cursor-pointer shadow-2xs flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-red-100 dark:group-hover:bg-red-900/80 transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                              {paper.category} {paper.year}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{paper.paperNumber}</span>
                          </div>
                          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mt-0.5">
                            {paper.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">{paper.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">
                          {paper.fileSizeMb} MB
                        </span>
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-1 whitespace-nowrap">
                          <span>View Paper</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  No past papers uploaded for {subject.name} {activeForm} yet.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
