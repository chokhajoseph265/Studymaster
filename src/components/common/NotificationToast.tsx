import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  ChevronRight,
  AlertCircle,
  Calendar,
  BookOpen,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { notificationService, InAppToastPayload } from '../../services/notificationService';

interface NotificationToastProps {
  onOpenNotificationsModal?: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  onOpenNotificationsModal
}) => {
  const [toast, setToast] = useState<InAppToastPayload | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const unsubscribe = notificationService.subscribeToast((current) => {
      setToast(current);
    });
    return unsubscribe;
  }, []);

  if (!toast) return null;

  const handleDismiss = () => {
    notificationService.dismissToast();
  };

  const handleAction = () => {
    if (toast.onAction) {
      toast.onAction();
    } else if (onOpenNotificationsModal) {
      onOpenNotificationsModal();
    }
    notificationService.dismissToast();
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'exam_alert':
        return <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />;
      case 'timetable':
        return <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />;
      case 'curriculum':
        return <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />;
      case 'study_tip':
        return <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />;
      case 'system':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      default:
        return <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />;
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-50 pointer-events-auto transition-all transform animate-in slide-in-from-top-4 duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-amber-400/80 dark:border-amber-600/80 shadow-xl p-3.5 sm:p-4 text-slate-900 dark:text-white flex items-start gap-3 backdrop-blur-md">
        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
              {toast.category || 'StudyMaster Alert'}
            </span>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Dismiss notification"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
            {toast.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {toast.message}
          </p>

          <div className="pt-1.5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAction}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <span>{toast.actionText || 'Open Notification'}</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="px-2 py-1 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-[11px] font-semibold transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
