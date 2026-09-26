import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Search,
  Filter,
  Calendar,
  Layers,
  BookOpen,
  Award,
  ExternalLink,
  ChevronRight,
  Eye,
  X
} from 'lucide-react';
import { PastPaper, Subject, FormLevel } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { offlineStorage } from '../../services/offlineStorage';
import { INITIAL_SUBJECTS } from '../../data/initialData';

interface PastPapersViewProps {
  onBack?: () => void;
}

export const PastPapersView: React.FC<PastPapersViewProps> = ({ onBack }) => {
  const { activeForm, user, triggerCelebration } = useAuth();

  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>(activeForm || 'all');
  const [subjectsList, setSubjectsList] = useState<Subject[]>(() =>
    INITIAL_SUBJECTS.filter((s) => !activeForm || s.forms.includes(activeForm)).sort((a, b) => a.name.localeCompare(b.name))
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Paper preview modal
  const [previewPaper, setPreviewPaper] = useState<PastPaper | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSubjects = async () => {
      try {
        const formParam = selectedForm === 'all' ? undefined : (selectedForm as FormLevel);
        const list = await api.getSubjects(formParam);
        if (isMounted && list && list.length > 0) {
          setSubjectsList([...list].sort((a, b) => a.name.localeCompare(b.name)));
        }
      } catch {}
    };
    fetchSubjects();
    return () => {
      isMounted = false;
    };
  }, [selectedForm]);

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      try {
        const data = await api.getPastPapers(
          selectedSubjectId === 'all' ? undefined : selectedSubjectId,
          selectedForm === 'all' ? undefined : selectedForm,
          selectedYear === 'all' ? undefined : parseInt(selectedYear),
          selectedCategory === 'all' ? undefined : selectedCategory
        );
        setPapers(data);
      } catch (e) {
        console.warn('Past papers load error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [selectedForm, selectedSubjectId, selectedCategory, selectedYear]);

  const filteredPapers = papers.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.subjectName.toLowerCase().includes(q) ||
      (p.form && p.form.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      p.year.toString().includes(q)
    );
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'End of Term':
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800';
      case 'Mid-Term':
        return 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 border-sky-200 dark:border-sky-800';
      case 'Mock':
        return 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 border-purple-200 dark:border-purple-800';
      case 'MSCE':
        return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800';
      case 'JCE':
        return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800';
      default:
        return 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-md border border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/40">
                Secondary School Papers
              </span>
              <span className="text-xs text-neutral-300 font-semibold">Form 1–4 Examination Bank</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              Secondary School Past Papers & Examinations
            </h1>
            <p className="text-xs text-neutral-300 font-medium mt-0.5 max-w-lg">
              End of Term papers, Mid-Term tests, Cluster Mocks, and MANEB past papers with marking guides for Form 1–4.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 shrink-0">
            <FileText className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers by subject, term, year, or school..."
            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {/* Secondary Form Level Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Class / Form Level
            </label>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Forms (Form 1–4)</option>
              <option value="Form 1">Form 1</option>
              <option value="Form 2">Form 2</option>
              <option value="Form 3">Form 3</option>
              <option value="Form 4">Form 4</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Subjects</option>
              {subjectsList.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Exam Category Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Examination Type
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Paper Types</option>
              <option value="End of Term">End of Term Exams (Term 1, 2, 3)</option>
              <option value="Mid-Term">Mid-Term & Monthly Tests</option>
              <option value="Mock">Cluster & District Mocks</option>
              <option value="MANEB">MANEB National (MSCE & JCE)</option>
              <option value="MSCE">MSCE National Papers</option>
              <option value="JCE">JCE National Papers</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
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

      {/* Past Papers List */}
      {loading ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
          Loading secondary school past examinations...
        </div>
      ) : filteredPapers.length > 0 ? (
        <div className="space-y-3">
          {filteredPapers.map((paper) => {
            const badgeClass = getCategoryBadgeClass(paper.category);
            return (
              <div
                key={paper.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-xs shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border whitespace-nowrap ${badgeClass}`}>
                        {paper.category} • {paper.year}
                      </span>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                        {paper.form}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {paper.subjectName}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        ({paper.paperNumber})
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                      {paper.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-medium">
                      {paper.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <span>Approx {paper.fileSizeMb} MB</span>
                      <span>•</span>
                      <span>Includes Marking Guide & Worked Answers</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreviewPaper(paper)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Paper & Questions</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-300">No past papers found matching this filter.</p>
          <p>Try selecting "All Forms (Form 1–4)" or choosing "All Subjects".</p>
        </div>
      )}

      {/* PAPER PREVIEW MODAL */}
      {previewPaper && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800">
            <div className="p-4 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-extrabold">{previewPaper.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/60">
                      {previewPaper.form}
                    </span>
                    <span className="text-[10px] text-slate-300">
                      {previewPaper.category} • {previewPaper.paperNumber}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPaper(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Examination Scope:</span>
                <p className="text-slate-600 dark:text-slate-300">{previewPaper.description}</p>
              </div>

              {previewPaper.sampleQuestions && previewPaper.sampleQuestions.length > 0 && (
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                    Sample Official Questions:
                  </h4>
                  <div className="space-y-2">
                    {previewPaper.sampleQuestions.map((q: any, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                        <strong className="text-emerald-800 dark:text-emerald-400">Q{typeof q === 'object' && q.qNumber ? q.qNumber : i + 1}.</strong>{' '}
                        {typeof q === 'string' ? q : q.text}{' '}
                        {typeof q === 'object' && q.marks ? (
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">({q.marks} Marks)</span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewPaper.markingSchemeSummary && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200">
                  <h4 className="font-black mb-1">Official Marking Guide & Solutions Criteria:</h4>
                  <p className="leading-relaxed">{previewPaper.markingSchemeSummary}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setPreviewPaper(null)}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
