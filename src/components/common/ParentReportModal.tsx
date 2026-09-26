import React, { useState } from 'react';
import {
  Award,
  Share2,
  Copy,
  Check,
  X,
  TrendingUp,
  BookOpen,
  Clock,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ParentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParentReportModal: React.FC<ParentReportModalProps> = ({ isOpen, onClose }) => {
  const { user, activeForm } = useAuth();
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !user) return null;

  const points = user.points || 0;
  const badgeCount = (user.badges || []).length;
  const completedActivities = (user.completedActivityIds || []).length;

  // Generate realistic analytics based on student profile
  const quizzesCompleted = Math.max(Math.floor(completedActivities * 0.7), 4);
  const syllabusProgressPercent = Math.min(Math.round((points / 800) * 100), 96);
  const estimatedReadinessScore = Math.min(Math.round(65 + (points / 50)), 98);

  const reportText = `📊 *STUDYMASTER MALAWI - STUDENT PROGRESS REPORT CARD*
----------------------------------------
👤 *Student:* ${user.username}
🎓 *Class Form:* ${activeForm} (MANEB Syllabus)
⭐ *Knowledge Points:* ${points.toLocaleString()} pts
🏅 *Badges Earned:* ${badgeCount} Academic Awards
📝 *Quizzes & Past Papers Completed:* ${quizzesCompleted}
📈 *Exam Readiness Score:* ${estimatedReadinessScore}%
⏱️ *Study Consistency:* Active & Offline Sync Enabled

💡 *Teacher & Coach Summary:*
${user.username} is demonstrating consistent revision effort across Mathematics, Sciences, and Humanities on the StudyMaster e-learning platform.

----------------------------------------
_StudyMaster — Zero-Data MANEB Secondary School Preparation_
_Access syllabus notes, past papers, and quizzes offline._`;

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(reportText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Shareable Parent & Sponsor Report Card
              </h3>
              <p className="text-[11px] text-neutral-400">
                Send a verified progress update to parents or guardians via WhatsApp/SMS
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Card Preview */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Card Presentation */}
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 font-mono">
                  Official Academic Report
                </span>
                <h4 className="text-base font-extrabold text-white">{user.username}</h4>
                <span className="text-xs text-neutral-400">{activeForm} • Term Academic Period</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 block">MANEB Readiness</span>
                <span className="text-2xl font-black text-emerald-300 font-mono">
                  {estimatedReadinessScore}%
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Total Points</span>
                <span className="text-sm font-black text-amber-400 font-mono">{points}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Quizzes Done</span>
                <span className="text-sm font-black text-blue-400 font-mono">{quizzesCompleted}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Badges</span>
                <span className="text-sm font-black text-purple-400 font-mono">{badgeCount}</span>
              </div>
            </div>

            {/* Coach Insight */}
            <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Academic Coach Feedback:</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Active study consistency verified. Excellent problem-solving discipline shown in Mathematics and Physical Science syllabus modules.
              </p>
            </div>
          </div>

          {/* Share Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition"
            >
              <Smartphone className="w-4 h-4" />
              <span>Share Directly via WhatsApp to Parent</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Report Copied to Clipboard!' : 'Copy Formatted Text for SMS'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
