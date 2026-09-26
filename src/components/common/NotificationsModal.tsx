import React, { useState, useMemo } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Calendar,
  AlertCircle,
  Pin,
  Lightbulb,
  BookOpen,
  FileText,
  Clock,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { Announcement } from '../../types';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'exam_alert' | 'timetable' | 'curriculum' | 'study_tip' | 'announcement';
  category: string;
  isPinned?: boolean;
  createdAt: string;
  actionText?: string;
  actionType?: 'past_papers' | 'planner' | 'chemistry' | 'leaderboard';
  attachment?: Announcement['attachment'];
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements?: Announcement[];
  onNavigateAction?: (actionType: string) => void;
  readNotificationIds: string[];
  onMarkAsRead: (id: string) => void;
  onToggleRead?: (id: string) => void;
  onMarkAllAsRead: () => void;
  onResetNotifications?: () => void;
}

// Built-in notifications aligned with Malawi syllabus
export const BUILT_IN_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-maneb-2026',
    title: '2026 Examination Notice & Registration',
    message: 'Candidate registration guidelines, examination center codes, and national revision resources are ready for MSCE and JCE candidates.',
    type: 'exam_alert',
    category: 'Exam Notice',
    isPinned: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hrs ago
    actionText: 'View Past Papers',
    actionType: 'past_papers'
  },
  {
    id: 'notif-chem-apparatus',
    title: 'Chemistry Laboratory Apparatus & Safety Notes Updated',
    message: 'New interactive laboratory apparatus illustrations, bunsen burner zones, and standard hazard warning pictograms added to Form 1 Chemistry Topic 1.',
    type: 'curriculum',
    category: 'Syllabus Update',
    isPinned: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hrs ago
    actionText: 'Study Chemistry Notes',
    actionType: 'chemistry'
  },
  {
    id: 'notif-past-papers',
    title: 'Past Papers & Marking Guides',
    message: 'Full past examination papers with worked step-by-step marking rubrics are published and ready for practice.',
    type: 'timetable',
    category: 'Past Papers',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    actionText: 'View Past Papers',
    actionType: 'past_papers'
  },
  {
    id: 'notif-leaderboard-reminder',
    title: 'Weekly Study Points & Honor Roll Leaderboard',
    message: 'Earn 10 points for every completed syllabus note and 25 points for every quiz passed. Climb this week’s national leaderboard!',
    type: 'study_tip',
    category: 'Study Motivation',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    actionText: 'Check Leaderboard',
    actionType: 'leaderboard'
  }
];

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  announcements = [],
  onNavigateAction,
  readNotificationIds,
  onMarkAsRead,
  onToggleRead,
  onMarkAllAsRead,
  onResetNotifications
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  // Merge dynamic announcements with built-in curriculum notifications
  const allNotifications: NotificationItem[] = useMemo(() => {
    const dynamicItems: NotificationItem[] = announcements.map((ann) => ({
      id: ann.id,
      title: ann.title,
      message: ann.message,
      type: ann.type === 'exam_alert' ? 'exam_alert' : ann.type === 'timetable' ? 'timetable' : 'announcement',
      category: ann.category || 'Official Announcement',
      isPinned: ann.isPinned,
      createdAt: ann.createdAt || new Date().toISOString(),
      attachment: ann.attachment
    }));

    // Combined unique list, pinned items first, then by date descending
    const combined = [...dynamicItems, ...BUILT_IN_NOTIFICATIONS];
    return combined.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [announcements]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((item) => {
      const isRead = readNotificationIds.includes(item.id);
      if (activeFilter === 'unread') return !isRead;
      return true;
    });
  }, [allNotifications, activeFilter, readNotificationIds]);

  const unreadCount = useMemo(() => {
    return allNotifications.filter((item) => !readNotificationIds.includes(item.id)).length;
  }, [allNotifications, readNotificationIds]);

  if (!isOpen) return null;

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHrs < 1) return 'Just now';
      if (diffHrs < 24) return `${diffHrs}h ago`;
      const diffDays = Math.floor(diffHrs / 24);
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'exam_alert':
        return <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'timetable':
        return <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'curriculum':
        return <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'study_tip':
        return <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const getBadgeStyle = (type: NotificationItem['type']) => {
    switch (type) {
      case 'exam_alert':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'timetable':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'curriculum':
        return 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      case 'study_tip':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 sm:rounded-3xl rounded-t-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-300 shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Notifications & Alerts
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold shadow-2xs">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Announcements, syllabus updates & study tips
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors flex items-center gap-1 cursor-pointer"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Mark read</span>
              </button>
            )}
            {onResetNotifications && (
              <button
                type="button"
                onClick={onResetNotifications}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                title="Reset all notifications to unread"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              title="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All ({allNotifications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('unread')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeFilter === 'unread'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Notifications Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No notifications to display
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                You’re all caught up! Examination timetables and school announcements will appear here.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isRead = readNotificationIds.includes(notif.id);

              return (
                <div
                  key={notif.id}
                  onClick={() => onMarkAsRead(notif.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isRead
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/80 shadow-2xs hover:bg-amber-50/70'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon container */}
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                      {getNotificationIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getBadgeStyle(notif.type)}`}>
                            {notif.category}
                          </span>
                          {notif.isPinned && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                              <Pin className="w-3 h-3 fill-current" />
                              <span>Pinned</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimestamp(notif.createdAt)}</span>
                          </div>

                          {/* Quick Toggle Read / Unread */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onToggleRead) {
                                onToggleRead(notif.id);
                              } else {
                                onMarkAsRead(notif.id);
                              }
                            }}
                            className={`p-1 rounded-lg transition-colors cursor-pointer ${
                              isRead
                                ? 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                                : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                            }`}
                            title={isRead ? 'Mark as unread' : 'Mark as read'}
                          >
                            {isRead ? (
                              <CheckCheck className="w-3.5 h-3.5" />
                            ) : (
                              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block animate-pulse" />
                            )}
                          </button>
                        </div>
                      </div>

                      <h3 className={`text-xs sm:text-sm font-bold ${isRead ? 'text-slate-800 dark:text-slate-200' : 'text-slate-900 dark:text-white font-extrabold'}`}>
                        {notif.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {notif.message}
                      </p>

                      {/* Attachment preview if present */}
                      {notif.attachment && (
                        <div className="mt-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate flex-1 font-medium">{notif.attachment.name}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {notif.attachment.type}
                          </span>
                        </div>
                      )}

                      {/* Action button if actionable */}
                      {notif.actionText && notif.actionType && onNavigateAction && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead(notif.id);
                              onClose();
                              onNavigateAction(notif.actionType!);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                          >
                            <span>{notif.actionText}</span>
                            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
