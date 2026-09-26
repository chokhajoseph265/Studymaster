import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  Calculator,
  Compass
} from 'lucide-react';
import { ExamTip } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const ExamTipsView: React.FC = () => {
  const { activeForm } = useAuth();
  const [tips, setTips] = useState<ExamTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      try {
        const data = await api.getExamTips(activeForm);
        setTips(data);
      } catch (e) {
        console.warn('Exam tips error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [activeForm]);

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-md border border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md">
                MANEB Tactics
              </span>
              <span className="text-xs text-neutral-300 font-semibold">{activeForm} Guide</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              National Examination Strategies
            </h1>
            <p className="text-xs text-amber-100/90 font-medium mt-0.5 max-w-md">
              Examiner advice, time management models, formula methods and scoring techniques.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
            <Lightbulb className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Strategies List */}
      {loading ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-neutral-200 text-xs font-medium text-neutral-500">
          Loading examiner tactics...
        </div>
      ) : (
        <div className="space-y-3">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {tip.category}
                  </span>
                  <span className="text-xs font-bold text-neutral-500">
                    {tip.subjectName || 'All Subjects'}
                  </span>
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-extrabold text-neutral-900">
                {tip.title}
              </h3>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium space-y-2">
                <p className="font-semibold text-neutral-900">{tip.summary}</p>
                <p className="text-neutral-600 whitespace-pre-line">{tip.details}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
