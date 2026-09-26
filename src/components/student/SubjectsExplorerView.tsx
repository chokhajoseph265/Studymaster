import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Calculator,
  FlaskConical,
  Atom,
  Dna,
  Languages,
  Landmark,
  Globe,
  Laptop,
  Sprout,
  TrendingUp,
  Users,
  ChevronRight,
  GraduationCap,
  X
} from 'lucide-react';
import { Subject, FormLevel } from '../../types';
import { INITIAL_SUBJECTS, INITIAL_TOPICS } from '../../data/initialData';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface SubjectsExplorerViewProps {
  onSelectSubject: (subject: Subject) => void;
  onOpenTopic?: (topicId: string, subjectId: string) => void;
}

export const SubjectsExplorerView: React.FC<SubjectsExplorerViewProps> = ({
  onSelectSubject,
  onOpenTopic
}) => {
  const { activeForm, setActiveForm } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subjectsList, setSubjectsList] = useState<Subject[]>(() =>
    INITIAL_SUBJECTS.filter((s) => s.forms.includes(activeForm)).sort((a, b) => a.name.localeCompare(b.name))
  );
  const [loading, setLoading] = useState<boolean>(false);

  // Form options with exam levels
  const formOptions: { level: FormLevel; stage: string; exam: string }[] = [
    { level: 'Form 1', stage: 'Junior Secondary', exam: 'JCE Foundation' },
    { level: 'Form 2', stage: 'Junior Secondary', exam: 'JCE Examination' },
    { level: 'Form 3', stage: 'Senior Secondary', exam: 'MSCE Foundation' },
    { level: 'Form 4', stage: 'Senior Secondary', exam: 'MSCE Examination' }
  ];

  const categories: string[] = ['All', 'Sciences', 'Humanities', 'Languages', 'Commercial'];

  // Fetch subjects whenever activeForm changes
  useEffect(() => {
    let isMounted = true;
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const list = await api.getSubjects(activeForm);
        if (isMounted && list && list.length > 0) {
          setSubjectsList([...list].sort((a, b) => a.name.localeCompare(b.name)));
        } else if (isMounted) {
          setSubjectsList(
            INITIAL_SUBJECTS.filter((s) => s.forms.includes(activeForm)).sort((a, b) => a.name.localeCompare(b.name))
          );
        }
      } catch {
        if (isMounted) {
          setSubjectsList(
            INITIAL_SUBJECTS.filter((s) => s.forms.includes(activeForm)).sort((a, b) => a.name.localeCompare(b.name))
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSubjects();
    return () => {
      isMounted = false;
    };
  }, [activeForm]);

  // Filter subjects by category & search query, always arranged in alphabetical order
  const filteredSubjects = useMemo(() => {
    return [...subjectsList]
      .filter((s) => {
        const matchesCategory =
          selectedCategory === 'All' ||
          s.category.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesSearch =
          !searchQuery.trim() ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [subjectsList, selectedCategory, searchQuery]);

  // Subject icon & styling helper with high contrast, large accessible sizing
  const getSubjectVisuals = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('math')) {
      return {
        icon: <Calculator className="w-7 h-7 text-emerald-700 dark:text-emerald-400" />,
        bg: 'bg-emerald-50 dark:bg-emerald-950/80 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/80 border-emerald-200 dark:border-emerald-800'
      };
    }
    if (n.includes('physic')) {
      return {
        icon: <Atom className="w-7 h-7 text-sky-700 dark:text-sky-400" />,
        bg: 'bg-sky-50 dark:bg-sky-950/80 group-hover:bg-sky-100 dark:group-hover:bg-sky-900/80 border-sky-200 dark:border-sky-800'
      };
    }
    if (n.includes('chem')) {
      return {
        icon: <FlaskConical className="w-7 h-7 text-teal-700 dark:text-teal-400" />,
        bg: 'bg-teal-50 dark:bg-teal-950/80 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/80 border-teal-200 dark:border-teal-800'
      };
    }
    if (n.includes('bio')) {
      return {
        icon: <Dna className="w-7 h-7 text-green-700 dark:text-green-400" />,
        bg: 'bg-green-50 dark:bg-green-950/80 group-hover:bg-green-100 dark:group-hover:bg-green-900/80 border-green-200 dark:border-green-800'
      };
    }
    if (n.includes('agri')) {
      return {
        icon: <Sprout className="w-7 h-7 text-lime-700 dark:text-lime-400" />,
        bg: 'bg-lime-50 dark:bg-lime-950/80 group-hover:bg-lime-100 dark:group-hover:bg-lime-900/80 border-lime-200 dark:border-lime-800'
      };
    }
    if (n.includes('chichewa') || n.includes('english') || n.includes('french')) {
      return {
        icon: <Languages className="w-7 h-7 text-amber-700 dark:text-amber-400" />,
        bg: 'bg-amber-50 dark:bg-amber-950/80 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/80 border-amber-200 dark:border-amber-800'
      };
    }
    if (n.includes('history')) {
      return {
        icon: <Landmark className="w-7 h-7 text-orange-700 dark:text-orange-400" />,
        bg: 'bg-orange-50 dark:bg-orange-950/80 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/80 border-orange-200 dark:border-orange-800'
      };
    }
    if (n.includes('geography')) {
      return {
        icon: <Globe className="w-7 h-7 text-blue-700 dark:text-blue-400" />,
        bg: 'bg-blue-50 dark:bg-blue-950/80 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/80 border-blue-200 dark:border-blue-800'
      };
    }
    if (n.includes('computer')) {
      return {
        icon: <Laptop className="w-7 h-7 text-indigo-700 dark:text-indigo-400" />,
        bg: 'bg-indigo-50 dark:bg-indigo-950/80 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/80 border-indigo-200 dark:border-indigo-800'
      };
    }
    if (n.includes('business') || n.includes('account') || n.includes('econom')) {
      return {
        icon: <TrendingUp className="w-7 h-7 text-rose-700 dark:text-rose-400" />,
        bg: 'bg-rose-50 dark:bg-rose-950/80 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/80 border-rose-200 dark:border-rose-800'
      };
    }
    if (n.includes('social') || n.includes('life')) {
      return {
        icon: <Users className="w-7 h-7 text-purple-700 dark:text-purple-400" />,
        bg: 'bg-purple-50 dark:bg-purple-950/80 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/80 border-purple-200 dark:border-purple-800'
      };
    }
    return {
      icon: <BookOpen className="w-7 h-7 text-emerald-700 dark:text-emerald-400" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/80 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/80 border-emerald-200 dark:border-emerald-800'
    };
  };

  const activeOption = formOptions.find((f) => f.level === activeForm) || formOptions[1];

  return (
    <div className="space-y-5 pb-24 px-4 py-4 max-w-5xl mx-auto">
      {/* 1. Header Banner with Form Selector */}
      <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                Curriculum Explorer
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {activeOption.stage} • {activeOption.exam}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1 text-slate-900 dark:text-white">
              {activeForm} Secondary Subjects
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 max-w-xl font-medium">
              Choose your form level below to explore syllabus chapters, revision notes, tests, and past examination papers.
            </p>
          </div>

          {/* Form Selector Tabs */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 pb-1">
              Select Form:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {formOptions.map((f) => {
                const isActive = activeForm === f.level;
                return (
                  <button
                    key={f.level}
                    type="button"
                    onClick={() => setActiveForm(f.level)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm scale-102 ring-2 ring-emerald-500/30'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{f.level}</span>
                    <span
                      className={`text-[9px] font-semibold whitespace-nowrap ${
                        isActive ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {f.exam.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filters & Search Bar */}
      <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeForm} subjects...`}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </section>

      {/* 3. Subjects Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs font-semibold">
          Loading {activeForm} subjects...
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No subjects found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
            No subjects match "{searchQuery}" in {selectedCategory === 'All' ? activeForm : `${activeForm} • ${selectedCategory}`}.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 transition cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredSubjects.map((subject) => {
            const subjectTopics = INITIAL_TOPICS.filter(
              (t) => t.subjectId === subject.id && t.form === activeForm
            );
            const topicCount = subjectTopics.length > 0 ? subjectTopics.length : 6;
            const visual = getSubjectVisuals(subject.name);

            return (
              <div
                key={subject.id}
                role="button"
                tabIndex={0}
                aria-label={`Open ${subject.name}, ${activeForm}, ${topicCount} topics`}
                onClick={() => onSelectSubject(subject)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectSubject(subject);
                  }
                }}
                className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 active:scale-[0.99] transition-all shadow-2xs hover:shadow-md group relative flex flex-col justify-between cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-emerald-500/30 text-left select-none"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center shrink-0 transition-all shadow-xs ${visual.bg}`}>
                        {visual.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {subject.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                            {subject.category}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {activeForm}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 whitespace-nowrap">
                      {topicCount} Topics
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                    {subject.description}
                  </p>
                </div>

                <div className="pt-3.5 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>Open Subject Notes & Quizzes</span>
                  </span>

                  <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
