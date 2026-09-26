import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  FileText,
  HelpCircle,
  X,
  ArrowRight
} from 'lucide-react';
import { Subject, Topic, NoteItem, PastPaper } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topic: Topic) => void;
  onSelectPastPaper: (paper: PastPaper) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
  onSelectPastPaper
}) => {
  const { activeForm } = useAuth();
  const [query, setQuery] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchSearchIndex = async () => {
      setLoading(true);
      try {
        const [topicsData, papersData] = await Promise.all([
          api.getTopics(undefined, activeForm),
          api.getPastPapers(undefined, activeForm)
        ]);
        setTopics(topicsData);
        setPapers(papersData);
      } catch (e) {
        console.warn('Search index load error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchIndex();
  }, [isOpen, activeForm]);

  if (!isOpen) return null;

  const filteredTopics = query.trim()
    ? topics.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.summary.toLowerCase().includes(query.toLowerCase()) ||
          t.keyConcepts?.some((k) => k.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const filteredPapers = query.trim()
    ? papers.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.subjectName.toLowerCase().includes(query.toLowerCase()) ||
          p.year.toString().includes(query)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4 pt-16 sm:pt-20">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${activeForm} notes, formulas, topics & papers...`}
            className="w-full text-sm font-semibold text-neutral-900 focus:outline-hidden"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {query.trim() ? (
            <>
              {/* Topics Results */}
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block mb-2">
                  Matching Notes & Topics ({filteredTopics.length})
                </span>
                {filteredTopics.length > 0 ? (
                  <div className="space-y-1.5">
                    {filteredTopics.map((topic) => (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => {
                          onSelectTopic(topic);
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-2xl bg-neutral-50 hover:bg-emerald-50 border border-neutral-200 hover:border-emerald-200 transition-colors flex items-center justify-between text-xs group"
                      >
                        <div className="flex items-center gap-2.5">
                          <BookOpen className="w-4 h-4 text-emerald-700" />
                          <div>
                            <h4 className="font-bold text-neutral-900 group-hover:text-emerald-800">
                              {topic.title}
                            </h4>
                            <p className="text-[11px] text-neutral-500 line-clamp-1">{topic.summary}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-700" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic">No notes matching "{query}".</p>
                )}
              </div>

              {/* Past Papers Results */}
              <div className="pt-2 border-t border-neutral-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block mb-2">
                  Matching Past Papers ({filteredPapers.length})
                </span>
                {filteredPapers.length > 0 ? (
                  <div className="space-y-1.5">
                    {filteredPapers.map((paper) => (
                      <button
                        key={paper.id}
                        type="button"
                        onClick={() => {
                          onSelectPastPaper(paper);
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-2xl bg-neutral-50 hover:bg-red-50 border border-neutral-200 hover:border-red-200 transition-colors flex items-center justify-between text-xs group"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-red-600" />
                          <div>
                            <h4 className="font-bold text-neutral-900 group-hover:text-red-800">
                              {paper.title}
                            </h4>
                            <p className="text-[11px] text-neutral-500">{paper.category} • {paper.year}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-red-700" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic">No past papers matching "{query}".</p>
                )}
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-neutral-400 space-y-1 text-xs">
              <BookOpen className="w-6 h-6 text-emerald-600 mx-auto mb-2 opacity-60" />
              <p className="font-bold text-neutral-700">Type any Malawian topic or formula</p>
              <p>Search across Algebra, Photosynthesis, Ohm's Law, Geography maps and more.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
