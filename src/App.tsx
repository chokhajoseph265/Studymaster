import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BatteryProvider, useBattery } from './context/BatteryContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { SplashScreen } from './components/common/SplashScreen';
import { Header } from './components/common/Header';
import { BottomNav, TabType } from './components/common/BottomNav';
import { StudentDashboard } from './components/student/StudentDashboard';
import { ReadingRuler } from './components/common/ReadingRuler';
import { InactivityDimmerOverlay } from './components/common/InactivityDimmerOverlay';
import { ScreenOffAudioOverlay } from './components/common/ScreenOffAudioOverlay';
import { InstallAppBanner } from './components/common/InstallAppBanner';
import { NotificationToast } from './components/common/NotificationToast';
import { notificationService } from './services/notificationService';
import { BUILT_IN_NOTIFICATIONS } from './components/common/NotificationsModal';
import { Subject, Topic, NoteItem, Quiz, PastPaper, Announcement } from './types';
import { api } from './services/api';
import { offlineStorage } from './services/offlineStorage';
import { syncManager } from './services/syncManager';
import { INITIAL_SUBJECTS, INITIAL_TOPICS } from './data/initialData';
import { WifiOff, BookOpen, Loader2 } from 'lucide-react';

// Helper to safely load dynamic imports with auto-retry and cache-busting fallback
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 2,
  interval = 800
): React.LazyExoticComponent<T> {
  return lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      const attempt = (remainingRetries: number) => {
        factory()
          .then(resolve)
          .catch((error) => {
            if (remainingRetries > 0) {
              setTimeout(() => attempt(remainingRetries - 1), interval);
            } else {
              // If dynamic import failed, check if this is a chunk reload issue and reload once
              const hasReloaded = sessionStorage.getItem('chunk_load_failed_reload');
              if (!hasReloaded && typeof window !== 'undefined') {
                sessionStorage.setItem('chunk_load_failed_reload', '1');
                window.location.reload();
                return;
              }
              sessionStorage.removeItem('chunk_load_failed_reload');
              reject(error);
            }
          });
      };
      attempt(retries);
    })
  );
}

// Code-Split Views (Loaded with auto-retry and fail-safe recovery)
const SubjectsExplorerView = lazyWithRetry(() => import('./components/student/SubjectsExplorerView').then(m => ({ default: m.SubjectsExplorerView })));
const SubjectDetailView = lazyWithRetry(() => import('./components/student/SubjectDetailView').then(m => ({ default: m.SubjectDetailView })));
const TopicStudyView = lazyWithRetry(() => import('./components/student/TopicStudyView').then(m => ({ default: m.TopicStudyView })));
const QuizPlayer = lazyWithRetry(() => import('./components/student/QuizPlayer').then(m => ({ default: m.QuizPlayer })));
const PastPapersView = lazyWithRetry(() => import('./components/student/PastPapersView').then(m => ({ default: m.PastPapersView })));
const StudyMasterAssistView = lazyWithRetry(() => import('./components/student/StudyMasterAssistView').then(m => ({ default: m.StudyMasterAssistView })));
const WeeklyLeaderboardView = lazyWithRetry(() => import('./components/student/WeeklyLeaderboardView').then(m => ({ default: m.WeeklyLeaderboardView })));
const ExamTipsView = lazyWithRetry(() => import('./components/student/ExamTipsView').then(m => ({ default: m.ExamTipsView })));
const AdminPortal = lazyWithRetry(() => import('./components/admin/AdminPortal').then(m => ({ default: m.AdminPortal })));

// Code-Split Modals
const AuthModal = lazyWithRetry(() => import('./components/student/AuthModal').then(m => ({ default: m.AuthModal })));
const GlobalSearchModal = lazyWithRetry(() => import('./components/common/GlobalSearchModal').then(m => ({ default: m.GlobalSearchModal })));
const BatteryHubModal = lazyWithRetry(() => import('./components/common/BatteryHubModal').then(m => ({ default: m.BatteryHubModal })));
const AccessibilityModal = lazyWithRetry(() => import('./components/common/AccessibilityModal').then(m => ({ default: m.AccessibilityModal })));
const MoreMenuModal = lazyWithRetry(() => import('./components/common/MoreMenuModal').then(m => ({ default: m.MoreMenuModal })));
const ScientificCalculatorModal = lazyWithRetry(() => import('./components/common/ScientificCalculatorModal').then(m => ({ default: m.ScientificCalculatorModal })));
const PeriodicTableModal = lazyWithRetry(() => import('./components/common/PeriodicTableModal').then(m => ({ default: m.PeriodicTableModal })));
const NotificationsModal = lazyWithRetry(() => import('./components/common/NotificationsModal').then(m => ({ default: m.NotificationsModal })));
const ChichewaGlossaryModal = lazyWithRetry(() => import('./components/common/ChichewaGlossaryModal').then(m => ({ default: m.ChichewaGlossaryModal })));
const DiagramZoomModal = lazyWithRetry(() => import('./components/common/DiagramZoomModal').then(m => ({ default: m.DiagramZoomModal })));
const StructuredTheorySandbox = lazyWithRetry(() => import('./components/common/StructuredTheorySandbox').then(m => ({ default: m.StructuredTheorySandbox })));
const ParentReportModal = lazyWithRetry(() => import('./components/common/ParentReportModal').then(m => ({ default: m.ParentReportModal })));
const InstallAppModal = lazyWithRetry(() => import('./components/common/InstallAppModal').then(m => ({ default: m.InstallAppModal })));

const ViewLoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-pulse">
    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-3 shadow-2xs">
      <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
    </div>
    <p className="text-xs font-semibold text-slate-500">Loading study material...</p>
  </div>
);

const checkIsAdminRoute = () => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  // Explicit student route overrides
  if (
    search.includes('app=student') ||
    search.includes('mode=student') ||
    path.startsWith('/student') ||
    hash.startsWith('#student') ||
    hash.startsWith('#/student')
  ) {
    return false;
  }

  return (
    hostname.startsWith('admin.') ||
    path.startsWith('/admin') ||
    hash.startsWith('#admin') ||
    hash.startsWith('#/admin') ||
    search.includes('mode=admin') ||
    search.includes('app=admin')
  );
};

const AppContent: React.FC = () => {
  const { isOffline, activeForm } = useAuth();

  // Route State: Separate Admin Portal vs Student App
  const [isAdminPortal, setIsAdminPortal] = useState<boolean>(checkIsAdminRoute);

  // Sync route on popstate and hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminPortal(checkIsAdminRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Update PWA Manifest link, HTML title, theme color and app metadata dynamically according to the active app
  useEffect(() => {
    const manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.href = isAdminPortal ? '/admin-manifest.json' : '/manifest.webmanifest';
    }

    const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.content = isAdminPortal ? '#0f172a' : '#059669';
    }

    const appleTitleMeta = document.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-title"]');
    if (appleTitleMeta) {
      appleTitleMeta.content = isAdminPortal ? 'StudyMaster Admin' : 'StudyMaster';
    }

    const appNameMeta = document.querySelector<HTMLMetaElement>('meta[name="application-name"]');
    if (appNameMeta) {
      appNameMeta.content = isAdminPortal ? 'StudyMaster Admin' : 'StudyMaster';
    }

    if (isAdminPortal) {
      document.title = 'StudyMaster • Admin Console';
    } else {
      document.title = 'StudyMaster - MSCE & JCE Secondary School Companion';
    }
  }, [isAdminPortal]);

  // Navigation and view state for Student App
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedPastPaper, setSelectedPastPaper] = useState<PastPaper | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [assistPrefillQuery, setAssistPrefillQuery] = useState<string>('');
  const [showExamTips, setShowExamTips] = useState<boolean>(false);

  // Secondary Tools Modals state
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState<boolean>(false);
  const [showPeriodicTableModal, setShowPeriodicTableModal] = useState<boolean>(false);
  const [showChichewaModal, setShowChichewaModal] = useState<boolean>(false);
  const [showDiagramModal, setShowDiagramModal] = useState<boolean>(false);
  const [showTheoryModal, setShowTheoryModal] = useState<boolean>(false);
  const [showParentReportModal, setShowParentReportModal] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);

  // Core Modals state
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Dynamic Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Notifications State & Read Tracking
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('studymaster_read_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleMarkAsRead = (id: string) => {
    setReadNotificationIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem('studymaster_read_notifications', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleToggleRead = (id: string) => {
    setReadNotificationIds((prev) => {
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter((item) => item !== id);
      } else {
        next = [...prev, id];
      }
      try {
        localStorage.setItem('studymaster_read_notifications', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleMarkAllAsRead = () => {
    const allIds = [
      ...announcements.map((a) => a.id),
      ...BUILT_IN_NOTIFICATIONS.map((n) => n.id)
    ];
    const uniqueIds = Array.from(new Set(allIds));
    setReadNotificationIds(uniqueIds);
    try {
      localStorage.setItem('studymaster_read_notifications', JSON.stringify(uniqueIds));
    } catch {
      // ignore
    }
  };

  const handleResetNotifications = () => {
    setReadNotificationIds([]);
    try {
      localStorage.removeItem('studymaster_read_notifications');
    } catch {
      // ignore
    }
  };

  const unreadNotificationsCount = useMemo(() => {
    const allIds = [
      ...announcements.map((a) => a.id),
      ...BUILT_IN_NOTIFICATIONS.map((n) => n.id)
    ];
    const uniqueIds = Array.from(new Set(allIds));
    return uniqueIds.filter((id) => !readNotificationIds.includes(id)).length;
  }, [announcements, readNotificationIds]);

  // Track live announcements to dispatch toast notification when new notices arrive
  const prevAnnouncementIdsRef = useRef<string[]>([]);
  const hasInitializedAnnouncementsRef = useRef<boolean>(false);
  useEffect(() => {
    if (announcements.length > 0) {
      if (prevAnnouncementIdsRef.current.length > 0) {
        const newItems = announcements.filter(
          (a) => !prevAnnouncementIdsRef.current.includes(a.id) && !readNotificationIds.includes(a.id)
        );
        if (newItems.length > 0) {
          const latest = newItems[0];
          const isPastPaper = latest.category === 'Past Papers' || latest.actionType === 'past_papers' || !!latest.targetPaperId;
          notificationService.showToast({
            id: latest.id,
            title: latest.title,
            message: latest.message,
            type: latest.type === 'exam_alert' ? 'exam_alert' : latest.type === 'timetable' ? 'timetable' : 'announcement',
            category: latest.category || (isPastPaper ? 'Past Papers' : 'Official Announcement'),
            actionText: latest.actionText || (isPastPaper ? 'Open Past Paper' : 'View Notice'),
            onAction: () => {
              if (isPastPaper && latest.targetPaperId) {
                handleNotificationAction('past_papers', latest.targetPaperId);
              } else if (latest.actionType) {
                handleNotificationAction(latest.actionType, latest.targetPaperId);
              } else {
                setShowNotificationsModal(true);
              }
            }
          });
          if (notificationService.getBrowserPermission() === 'granted') {
            notificationService.sendBrowserNotification(latest.title, {
              body: latest.message
            });
          }
        }
      }
      prevAnnouncementIdsRef.current = announcements.map((a) => a.id);
      hasInitializedAnnouncementsRef.current = true;
    }
  }, [announcements, readNotificationIds]);

  const handleNotificationAction = async (actionType: string, paperId?: string) => {
    if (actionType === 'planner' || actionType === 'past_papers') {
      setActiveTab('past_papers');
      setSelectedTopic(null);
      setSelectedSubject(null);
      setShowExamTips(false);
      if (paperId) {
        try {
          const papers = await api.getPastPapers(undefined, undefined, undefined, undefined, false);
          const matched = papers.find((p) => p.id === paperId);
          if (matched) {
            setSelectedPastPaper(matched);
          }
        } catch {
          // ignore
        }
      }
    } else if (actionType === 'leaderboard') {
      setActiveTab('leaderboard');
    } else if (actionType === 'chemistry') {
      const chem = INITIAL_SUBJECTS.find((s) => s.name.toLowerCase().includes('chem'));
      if (chem) {
        setSelectedSubject(chem);
        setSelectedTopic(null);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAnnouncements = async () => {
      try {
        const data = await api.getAnnouncements();
        if (isMounted && data) {
          setAnnouncements(data);
        }
      } catch (e) {
        console.warn('Announcements load fallback:', e);
      }
    };
    fetchAnnouncements();

    const interval = setInterval(fetchAnnouncements, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Listen to live cross-app sync events from the Admin Suite (via BroadcastChannel and storage)
  useEffect(() => {
    const unsubscribe = syncManager.subscribe(async (event) => {
      console.log('[StudyMaster Sync] Event received by Student App:', event.type);
      if (
        event.type === 'announcements_updated' ||
        event.type === 'general_sync' ||
        event.type === 'notes_updated' ||
        event.type === 'past_papers_updated'
      ) {
        try {
          const fresh = await api.getAnnouncements();
          if (fresh) {
            setAnnouncements(fresh);
          }
        } catch {
          // ignore
        }
      }

      // When a past paper is published by admin, display immediate student alert
      if (event.type === 'past_papers_updated' && event.payload?.paper) {
        const paper: PastPaper = event.payload.paper;
        if (paper.status === 'published' || event.payload?.action === 'published') {
          const paperLabel = `${paper.year} ${paper.category} ${paper.subjectName} (${paper.paperNumber})`;
          notificationService.showToast({
            id: `toast-paper-${paper.id}-${Date.now()}`,
            title: `📄 New Past Paper Published!`,
            message: `${paperLabel} is now ready for revision with worked marking rubrics. Tap to practice!`,
            type: 'exam_alert',
            category: 'Past Paper Alert',
            actionText: 'Open Past Paper',
            onAction: () => {
              setSelectedPastPaper(paper);
              setActiveTab('past_papers');
              setSelectedSubject(null);
              setSelectedTopic(null);
              setShowExamTips(false);
            },
            durationMs: 9000
          });

          if (notificationService.getBrowserPermission() === 'granted') {
            notificationService.sendBrowserNotification(`New ${paper.category} Past Paper Published!`, {
              body: `${paper.year} ${paper.subjectName} (${paper.paperNumber}) is now available in StudyMaster.`
            });
          }
        }
      }
    });
    return unsubscribe;
  }, []);

  // Navigation handlers between Student and Admin apps
  const handleNavigateToAdmin = () => {
    try {
      window.history.pushState({}, '', '/admin');
    } catch {}
    window.location.hash = '#/admin';
    setIsAdminPortal(true);
  };

  const handleNavigateToStudent = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {}
    window.location.hash = '';
    setIsAdminPortal(false);
  };

  // Handle deep open topic
  const handleOpenTopic = (topicId: string, subjectId: string) => {
    const subject = INITIAL_SUBJECTS.find((s) => s.id === subjectId) || INITIAL_SUBJECTS[0];
    const topic = INITIAL_TOPICS.find((t) => t.id === topicId) || INITIAL_TOPICS[0];
    if (topic) {
      setSelectedSubject(subject);
      setSelectedTopic(topic);
    }
  };


  // ==========================================
  // 1. DEDICATED ADMIN PORTAL APP (Route /admin)
  // ==========================================
  if (isAdminPortal) {
    return (
      <Suspense fallback={<ViewLoadingFallback />}>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
          <AdminPortal
            onNavigateToStudent={handleNavigateToStudent}
            onOpenInstall={() => setShowInstallModal(true)}
          />
          {showInstallModal && (
            <InstallAppModal
              isOpen={showInstallModal}
              onClose={() => setShowInstallModal(false)}
              appType="admin"
            />
          )}
        </div>
      </Suspense>
    );
  }

  // ==========================================
  // 2. DEDICATED STUDENT LEARNING APP (Route /)
  // ==========================================
  const isViewingDeepScreen = !!(selectedTopic || selectedSubject || showExamTips || activeTab !== 'home');
  const isAssistFullScreen =
    activeTab === 'assist' &&
    !selectedTopic &&
    !selectedSubject &&
    !showExamTips &&
    !activeQuiz;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Offline Status Warning Bar */}
      {isOffline && (
        <div className="bg-amber-600 text-white text-[11px] font-bold px-4 py-1.5 flex items-center justify-center gap-2 shadow-xs z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode Active • Studying from local cached syllabus materials</span>
        </div>
      )}

      {/* Install App Sticky Notification Banner */}
      <InstallAppBanner onOpenModal={() => setShowInstallModal(true)} />

      {/* Top Header shown on all screens EXCEPT when AI Tutor is full screen with its own docked second row nav */}
      {!isAssistFullScreen && (
        <Header
          onOpenSearch={() => setShowSearchModal(true)}
          onOpenMoreMenu={() => setShowMoreMenu(true)}
          onOpenCalculator={() => setShowCalculatorModal(true)}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          onOpenPeriodicTable={() => setShowPeriodicTableModal(true)}
          onOpenInstall={() => setShowInstallModal(true)}
          unreadNotificationsCount={unreadNotificationsCount}
        />
      )}

      {/* Main Viewport Container */}
      <main
        className={`flex-1 w-full mx-auto ${
          isAssistFullScreen
            ? 'w-full p-0 m-0 max-w-none flex flex-col min-h-0'
            : selectedTopic
            ? 'w-full px-2 sm:px-4 lg:px-8'
            : 'max-w-5xl px-4'
        }`}
      >
        <Suspense fallback={<ViewLoadingFallback />}>
          {/* Active Quiz Player Overlay if running */}
          {activeQuiz && (
            <QuizPlayer
              quiz={activeQuiz}
              onClose={() => setActiveQuiz(null)}
            />
          )}

          {/* 1. TOPIC STUDY VIEW */}
          {selectedTopic ? (
            <div className="py-2">
              <TopicStudyView
                topic={selectedTopic}
                subjectName={selectedSubject?.name || 'Curriculum Subject'}
                onBack={() => setSelectedTopic(null)}
                onStartQuiz={(q) => setActiveQuiz(q)}
                onAskAssist={(q) => {
                  setAssistPrefillQuery(q);
                  setSelectedTopic(null);
                  setSelectedSubject(null);
                  setActiveTab('assist');
                }}
              />
            </div>
          ) : selectedSubject ? (
            /* 2. SUBJECT DETAIL VIEW */
            <div className="px-4 py-4">
              <SubjectDetailView
                subject={selectedSubject}
                onBack={() => setSelectedSubject(null)}
                onSelectTopic={(topic) => setSelectedTopic(topic)}
                onStartQuiz={(quiz) => setActiveQuiz(quiz)}
                onSelectPastPaper={(paper) => {
                  setSelectedSubject(null);
                  setSelectedPastPaper(paper);
                  setActiveTab('past_papers');
                }}
                onAskAssist={(topicTitle) => {
                  setAssistPrefillQuery(`Explain ${topicTitle} in ${selectedSubject.name}`);
                  setSelectedSubject(null);
                  setActiveTab('assist');
                }}
              />
            </div>
          ) : showExamTips ? (
            /* 5. EXAM TIPS VIEW */
            <div className="space-y-4 px-4 py-4">
              <button
                type="button"
                onClick={() => setShowExamTips(false)}
                className="text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs hover:bg-slate-50"
              >
                ← Back to Dashboard
              </button>
              <ExamTipsView />
            </div>
          ) : (
            /* 6. TAB-BASED VIEWS */
            <>
              {activeTab === 'home' && (
                <StudentDashboard
                  onSelectSubject={(subj) => setSelectedSubject(subj)}
                  onOpenSubjects={() => {
                    setActiveTab('subjects');
                    setSelectedSubject(null);
                    setSelectedTopic(null);
                    setShowExamTips(false);
                  }}
                  onOpenAssist={() => setActiveTab('assist')}
                  onOpenPastPapers={() => {
                    setSelectedPastPaper(null);
                    setActiveTab('past_papers');
                  }}
                  onSelectPastPaper={(paper) => {
                    setSelectedPastPaper(paper);
                    setActiveTab('past_papers');
                  }}
                  onOpenLeaderboard={() => setActiveTab('leaderboard')}
                  onOpenExamTips={() => setShowExamTips(true)}
                  onOpenTopic={handleOpenTopic}
                  announcements={announcements}
                />
              )}

              {activeTab === 'subjects' && (
                <SubjectsExplorerView
                  onSelectSubject={(subject) => setSelectedSubject(subject)}
                  onOpenTopic={handleOpenTopic}
                />
              )}

              {activeTab === 'assist' && (
                <StudyMasterAssistView
                  initialQuery={assistPrefillQuery}
                  onOpenTopic={handleOpenTopic}
                  onOpenMoreMenu={() => setShowMoreMenu(true)}
                  onOpenCalculator={() => setShowCalculatorModal(true)}
                  onOpenNotifications={() => setShowNotificationsModal(true)}
                  onOpenPeriodicTable={() => setShowPeriodicTableModal(true)}
                  onOpenInstall={() => setShowInstallModal(true)}
                  onOpenSearch={() => setShowSearchModal(true)}
                  unreadNotificationsCount={unreadNotificationsCount}
                />
              )}

              {activeTab === 'past_papers' && (
                <div className="px-4 py-4">
                  <PastPapersView
                    initialPaperId={selectedPastPaper?.id}
                    onBack={() => {
                      setSelectedPastPaper(null);
                      setActiveTab('home');
                    }}
                  />
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <div className="px-4 py-4">
                  <WeeklyLeaderboardView />
                </div>
              )}
            </>
          )}
        </Suspense>
      </main>

      {/* Bottom Mobile Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedSubject(null);
          setSelectedTopic(null);
          setShowExamTips(false);
        }}
      />

      {/* LAZY LOADED MODALS & TOOLS */}
      <Suspense fallback={null}>
        {/* MORE TOOLS MODAL */}
        <MoreMenuModal
          isOpen={showMoreMenu}
          onClose={() => setShowMoreMenu(false)}
          onOpenAssist={() => setActiveTab('assist')}
          onOpenCalculator={() => setShowCalculatorModal(true)}
          onOpenPeriodicTable={() => setShowPeriodicTableModal(true)}
          onOpenChichewa={() => setShowChichewaModal(true)}
          onOpenDiagrams={() => setShowDiagramModal(true)}
          onOpenTheorySandbox={() => setShowTheoryModal(true)}
          onOpenParentReport={() => setShowParentReportModal(true)}
          onOpenLeaderboard={() => setActiveTab('leaderboard')}
          onOpenInstall={() => setShowInstallModal(true)}
          onOpenAdmin={handleNavigateToAdmin}
        />

        {/* NOTIFICATIONS & MANEB BULLETINS MODAL */}
        <NotificationsModal
          isOpen={showNotificationsModal}
          onClose={() => setShowNotificationsModal(false)}
          announcements={announcements}
          readNotificationIds={readNotificationIds}
          onMarkAsRead={handleMarkAsRead}
          onToggleRead={handleToggleRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onResetNotifications={handleResetNotifications}
          onNavigateAction={handleNotificationAction}
        />

        {/* IN-APP REAL-TIME TOAST NOTIFICATION BANNER */}
        <NotificationToast onOpenNotificationsModal={() => setShowNotificationsModal(true)} />

        {/* SECONDARY SCIENTIFIC & CURRICULUM MODALS */}
        {showCalculatorModal && (
          <ScientificCalculatorModal
            isOpen={showCalculatorModal}
            onClose={() => setShowCalculatorModal(false)}
          />
        )}

        {showPeriodicTableModal && (
          <PeriodicTableModal
            isOpen={showPeriodicTableModal}
            onClose={() => setShowPeriodicTableModal(false)}
          />
        )}

        {showChichewaModal && (
          <ChichewaGlossaryModal
            isOpen={showChichewaModal}
            onClose={() => setShowChichewaModal(false)}
          />
        )}

        {showDiagramModal && (
          <DiagramZoomModal
            isOpen={showDiagramModal}
            onClose={() => setShowDiagramModal(false)}
          />
        )}

        {showTheoryModal && (
          <StructuredTheorySandbox
            isOpen={showTheoryModal}
            onClose={() => setShowTheoryModal(false)}
            activeForm={activeForm}
          />
        )}

        {showParentReportModal && (
          <ParentReportModal
            isOpen={showParentReportModal}
            onClose={() => setShowParentReportModal(false)}
          />
        )}

        {showInstallModal && (
          <InstallAppModal
            isOpen={showInstallModal}
            onClose={() => setShowInstallModal(false)}
            appType="student"
          />
        )}

        {/* CORE MODALS */}
        <GlobalSearchModal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onSelectTopic={(t) => {
            setSelectedTopic(t);
            setShowSearchModal(false);
          }}
          onSelectPastPaper={(p) => {
            setSelectedPastPaper(p);
            setActiveTab('past_papers');
            setShowSearchModal(false);
          }}
        />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </Suspense>

      {/* BATTERY & POWER SAVER OVERLAYS & MODALS */}
      <Suspense fallback={null}>
        <BatteryHubModal />
        <AccessibilityModal />
      </Suspense>
      <InactivityDimmerOverlay />
      <ScreenOffAudioOverlay />

      {/* ACCESSIBILITY & INCLUSION OVERLAYS */}
      <ReadingRuler />
    </div>
  );
};

export default function App() {
  // Show glassmorphism splash on initial launch in the current session
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !sessionStorage.getItem('studymaster_glass_splash_v2');
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleReplaySplash = () => setShowSplash(true);
    window.addEventListener('studymaster:show-splash', handleReplaySplash);
    return () => window.removeEventListener('studymaster:show-splash', handleReplaySplash);
  }, []);

  const handleFinishSplash = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem('studymaster_glass_splash_v2', '1');
    } catch {
      // ignore
    }
  };

  return (
    <AccessibilityProvider>
      <BatteryProvider>
        <AuthProvider>
          {showSplash && <SplashScreen onFinish={handleFinishSplash} />}
          <AppContent />
        </AuthProvider>
      </BatteryProvider>
    </AccessibilityProvider>
  );
}
