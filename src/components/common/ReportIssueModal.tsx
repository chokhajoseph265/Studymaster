import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  X,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  HelpCircle,
  Paperclip,
  Check,
  AlertCircle
} from 'lucide-react';
import { ReportIssue, StudentUser } from '../../types';
import { api } from '../../services/api';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser | null;
  defaultSubjectId?: string;
  defaultSubjectName?: string;
  defaultTopicId?: string;
  defaultTopicTitle?: string;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  defaultSubjectId,
  defaultSubjectName,
  defaultTopicId,
  defaultTopicTitle
}) => {
  const [category, setCategory] = useState<ReportIssue['category']>('Content Error');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [myReports, setMyReports] = useState<ReportIssue[]>([]);
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadUserReports();
    }
  }, [isOpen, currentUser]);

  const loadUserReports = async () => {
    if (!currentUser) return;
    setLoadingHistory(true);
    try {
      const list = await api.getReports(currentUser.id);
      setMyReports(list);
    } catch (e) {
      console.warn('Failed to load user reports:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.submitReport({
        userId: currentUser?.id || 'guest-student',
        username: currentUser?.username || 'Student',
        category,
        subjectId: defaultSubjectId,
        subjectName: defaultSubjectName,
        topicId: defaultTopicId,
        topicTitle: defaultTopicTitle,
        title: title.trim(),
        description: description.trim(),
        screenshotUrl: screenshotUrl.trim()
      });

      setSubmittedSuccess(true);
      setMyReports((prev) => [res, ...prev]);
      setTitle('');
      setDescription('');
      setScreenshotUrl('');
    } catch (e: any) {
      alert(e.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                Report Error or Ask Support
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Help us improve StudyMaster content & exam materials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-4 pt-2 gap-2 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => {
              setActiveTab('submit');
              setSubmittedSuccess(false);
            }}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'submit'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            New Report Ticket
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              loadUserReports();
            }}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            My Tickets ({myReports.length})
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'submit' ? (
            submittedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Report Received!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  Zikomo! Our academic reviewers and administrators will review the reported issue promptly and reply directly to your account.
                </p>
                <div className="pt-3 flex justify-center gap-3">
                  <button
                    onClick={() => setSubmittedSuccess(false)}
                    className="px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition"
                  >
                    Submit Another Note
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Context Tag if provided */}
                {(defaultSubjectName || defaultTopicTitle) && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    <span>
                      Reporting about: <strong className="font-semibold">{defaultSubjectName || 'Subject'}</strong> {defaultTopicTitle ? `• ${defaultTopicTitle}` : ''}
                    </span>
                  </div>
                )}

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Issue Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'Content Error',
                      'Quiz Question Issue',
                      'Payment & Premium',
                      'Past Paper Typo',
                      'App Bug / Technical',
                      'General Feedback'
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat as any)}
                        className={`p-2 rounded-xl text-left text-xs font-medium border transition flex items-center justify-between ${
                          category === cat
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold ring-1 ring-emerald-500'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        {category === cat && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Summary / Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Typo in Quadratic formula Step 2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Detailed Explanation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the typo, incorrect question answer, or issue clearly so our curriculum team can rectify it immediately..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  />
                </div>

                {/* Optional Screenshot URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Paperclip className="w-3.5 h-3.5" />
                      Screenshot / Image Link (Optional)
                    </span>
                    <span className="text-[10px] text-slate-400">Google Drive / Imgur / Cloud link</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={screenshotUrl}
                    onChange={(e) => setScreenshotUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !title.trim() || !description.trim()}
                    className="px-5 py-2 text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition flex items-center gap-2 shadow-md shadow-emerald-600/20"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Submit Report
                      </>
                    )}
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="space-y-3">
              {loadingHistory ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading your tickets...
                </div>
              ) : myReports.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    You have not submitted any issue reports yet.
                  </p>
                </div>
              ) : (
                myReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {report.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          report.status === 'resolved'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : report.status === 'in_progress'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {report.title}
                    </h5>

                    <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                      {report.description}
                    </p>

                    {report.adminReply && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-700 dark:text-emerald-400">
                          <MessageSquare className="w-3.5 h-3.5" />
                          StudyMaster Team Response ({report.resolvedBy || 'Admin'}):
                        </div>
                        <p className="whitespace-pre-wrap">{report.adminReply}</p>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 pt-1 flex justify-between">
                      <span>Submitted on {new Date(report.createdAt).toLocaleDateString()}</span>
                      {report.subjectName && <span>{report.subjectName}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
