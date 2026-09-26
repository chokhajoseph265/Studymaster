import {
  StudentUser,
  FormInfo,
  Subject,
  Topic,
  NoteItem,
  Lesson,
  PracticeQuestion,
  Quiz,
  PastPaper,
  ExamTip,
  Badge,
  LeaderboardEntry,
  PremiumPlan,
  PaymentRecord,
  AdConfiguration,
  Announcement,
  AssistResponse,
  StudyFeatureMode,
  PlatformStats,
  AuditLog,
  PaymentMethodsConfig,
  CommunityLinksConfig,
  ManebTimetableItem,
  ChiefExaminerInsight,
  MarkingSchemeSimItem,
  ReportIssue,
  SubjectAnalytics
} from '../types';
import {
  INITIAL_PAYMENT_METHODS,
  INITIAL_COMMUNITY_LINKS,
  INITIAL_MANEB_TIMETABLE,
  INITIAL_CHIEF_EXAMINER_INSIGHTS,
  INITIAL_MARKING_SIMULATOR_ITEMS,
  INITIAL_REPORT_ISSUES,
  INITIAL_PREMIUM_PLANS
} from '../data/initialData';
import { offlineStorage } from './offlineStorage';

const API_BASE = '/api';

export class ApiClient {
  private currentUserId: string | null = null;
  private isSimulatedOffline: boolean = false;

  public setUserId(id: string | null) {
    this.currentUserId = id;
  }

  public setOfflineSimulation(offline: boolean) {
    this.isSimulatedOffline = offline;
  }

  public getIsOffline(): boolean {
    return this.isSimulatedOffline || !navigator.onLine;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (this.getIsOffline()) {
      throw new Error('OfflineMode');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.currentUserId) {
      headers['x-user-id'] = this.currentUserId;
      headers['x-admin-user'] = this.currentUserId;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Network error occurred';
      try {
        const errJson = await response.json();
        errorMessage = errJson.error || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // --- Auth ---
  public async register(payload: { username: string; emailOrPhone: string; password: string; avatarId: string; activeForm: string }) {
    const res = await this.request<{ user: StudentUser; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    this.currentUserId = res.user.id;
    return res;
  }

  public async login(payload: { usernameOrIdentifier: string; password: string }) {
    const res = await this.request<{ user: StudentUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    this.currentUserId = res.user.id;
    return res;
  }

  public async resetPassword(payload: { emailOrPhone: string; newPassword: string }) {
    return this.request<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async getCurrentUser() {
    return this.request<{ user: StudentUser }>('/auth/me');
  }

  public async updateProfile(payload: { avatarId?: string; activeForm?: string }) {
    return this.request<{ user: StudentUser }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  // --- Content ---
  public async getForms(): Promise<FormInfo[]> {
    try {
      return await this.request<FormInfo[]>('/content/forms');
    } catch {
      // Fallback
      return [
        { id: 'form-1', name: 'Form 1', alias: 'Junior 1', description: 'Foundation secondary syllabus', order: 1 },
        { id: 'form-2', name: 'Form 2', alias: 'Junior 2', description: 'JCE preparation & core analysis', order: 2 },
        { id: 'form-3', name: 'Form 3', alias: 'Senior 3', description: 'Senior secondary topics', order: 3 },
        { id: 'form-4', name: 'Form 4', alias: 'Senior 4', description: 'MSCE graduation & exam mastery', order: 4 },
      ];
    }
  }

  public async getSubjects(form?: string): Promise<Subject[]> {
    try {
      const list = await this.request<Subject[]>(`/content/subjects${form ? `?form=${encodeURIComponent(form)}` : ''}`);
      return (list || []).sort((a, b) => a.name.localeCompare(b.name));
    } catch {
      // Return downloaded subjects or initial
      const downloads = offlineStorage.getDownloadedItems();
      const subjectNames = Array.from(new Set(downloads.map((d) => d.subjectName))).sort((a, b) => a.localeCompare(b));
      return subjectNames.map((name, i) => ({
        id: `offline-subj-${i}`,
        name,
        forms: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
        icon: 'BookOpen',
        category: 'Sciences',
        description: 'Available offline on this device',
        status: 'published'
      }));
    }
  }

  public async getTopics(subjectId?: string, form?: string): Promise<Topic[]> {
    return this.request<Topic[]>(`/content/topics?${new URLSearchParams({ ...(subjectId ? { subjectId } : {}), ...(form ? { form } : {}) }).toString()}`);
  }

  public async getNotes(topicId?: string, subjectId?: string, form?: string): Promise<NoteItem[]> {
    return this.request<NoteItem[]>(`/content/notes?${new URLSearchParams({ ...(topicId ? { topicId } : {}), ...(subjectId ? { subjectId } : {}), ...(form ? { form } : {}) }).toString()}`);
  }

  public async getNoteById(id: string): Promise<NoteItem> {
    try {
      return await this.request<NoteItem>(`/content/notes/${id}`);
    } catch (e) {
      const cached = offlineStorage.getDownloadedItem(id);
      if (cached?.data) return cached.data;
      throw e;
    }
  }

  public async getLessons(topicId?: string, subjectId?: string, form?: string): Promise<Lesson[]> {
    return this.request<Lesson[]>(`/content/lessons?${new URLSearchParams({ ...(topicId ? { topicId } : {}), ...(subjectId ? { subjectId } : {}), ...(form ? { form } : {}) }).toString()}`);
  }

  public async getQuestions(topicId?: string, subjectId?: string, form?: string): Promise<PracticeQuestion[]> {
    return this.request<PracticeQuestion[]>(`/content/questions?${new URLSearchParams({ ...(topicId ? { topicId } : {}), ...(subjectId ? { subjectId } : {}), ...(form ? { form } : {}) }).toString()}`);
  }

  public async getQuizzes(topicId?: string, subjectId?: string, form?: string): Promise<Quiz[]> {
    return this.request<Quiz[]>(`/content/quizzes?${new URLSearchParams({ ...(topicId ? { topicId } : {}), ...(subjectId ? { subjectId } : {}), ...(form ? { form } : {}) }).toString()}`);
  }

  public async getQuizById(id: string): Promise<Quiz> {
    try {
      return await this.request<Quiz>(`/content/quizzes/${id}`);
    } catch (e) {
      const cached = offlineStorage.getDownloadedItem(id);
      if (cached?.data) return cached.data;
      throw e;
    }
  }

  public async submitQuiz(payload: { quizId: string; answers: number[]; userId?: string }) {
    try {
      return await this.request<{
        quizId: string;
        totalQuestions: number;
        correctCount: number;
        scorePercentage: number;
        passed: boolean;
        results: any[];
        pointsEarned: number;
        alreadyAwarded: boolean;
        newBadges: Badge[];
      }>('/quizzes/submit', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (e) {
      if (this.getIsOffline()) {
        // Enqueue offline quiz submission for later sync
        offlineStorage.enqueueSync('quiz_submission', payload);
        return {
          quizId: payload.quizId,
          totalQuestions: payload.answers.length,
          correctCount: payload.answers.length,
          scorePercentage: 100,
          passed: true,
          results: [],
          pointsEarned: 0,
          alreadyAwarded: false,
          newBadges: [],
          offlineQueued: true
        };
      }
      throw e;
    }
  }

  public async getPastPapers(subjectId?: string, form?: string, year?: number, category?: string): Promise<PastPaper[]> {
    return this.request<PastPaper[]>(
      `/content/past-papers?${new URLSearchParams({
        ...(subjectId ? { subjectId } : {}),
        ...(form ? { form } : {}),
        ...(year ? { year: year.toString() } : {}),
        ...(category ? { category } : {})
      }).toString()}`
    );
  }

  public async downloadPastPaper(id: string) {
    return this.request<{ paper: PastPaper; pointsEarned: number; newBadges: Badge[] }>(`/content/past-papers/${id}/download`, {
      method: 'POST'
    });
  }

  public async getExamTips(form?: string): Promise<ExamTip[]> {
    return this.request<ExamTip[]>(`/content/exam-tips${form ? `?form=${encodeURIComponent(form)}` : ''}`);
  }

  // --- StudyMaster Assist ---
  public async queryAssist(payload: {
    query: string;
    form?: string;
    educationLevel?: string;
    mode?: StudyFeatureMode;
    subjectId?: string;
    hasImage?: boolean;
    imageNotes?: string;
    studentAttempt?: string;
    history?: Array<{ role: 'user' | 'model'; text: string }>;
    imageData?: string;
    activeTopicId?: string;
    activeSubjectId?: string;
    activeTopicTitle?: string;
    activeSubjectName?: string;
  }): Promise<AssistResponse> {
    return this.request<AssistResponse>('/assist/query', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async streamAssist(
    payload: {
      query: string;
      form?: string;
      educationLevel?: string;
      mode?: StudyFeatureMode;
      subjectId?: string;
      hasImage?: boolean;
      imageNotes?: string;
      studentAttempt?: string;
      history?: Array<{ role: 'user' | 'model'; text: string }>;
      imageData?: string;
      activeTopicId?: string;
      activeSubjectId?: string;
      activeTopicTitle?: string;
      activeSubjectName?: string;
    },
    callbacks: {
      onChunk: (chunk: string) => void;
      onDone: (res: AssistResponse) => void;
      onError: (err: Error) => void;
    },
    signal?: AbortSignal
  ): Promise<void> {
    if (this.getIsOffline()) {
      try {
        const res = await this.queryAssist(payload);
        callbacks.onChunk(res.answer);
        callbacks.onDone(res);
      } catch (err: any) {
        callbacks.onError(err);
      }
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/assist/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.currentUserId ? { 'x-user-id': this.currentUserId } : {})
        },
        body: JSON.stringify(payload),
        signal
      });

      if (!response.ok || !response.body) {
        throw new Error('Streaming failed, falling back');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let finishedData: AssistResponse | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          const trimmed = part.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.type === 'chunk' && data.text) {
                callbacks.onChunk(data.text);
              } else if (data.type === 'done' && data.data) {
                finishedData = data.data;
              } else if (data.type === 'error') {
                throw new Error(data.error || 'Stream error');
              }
            } catch {
              // Ignore partial chunk parsing errors
            }
          }
        }
      }

      if (finishedData) {
        callbacks.onDone(finishedData);
      } else {
        const fallback = await this.queryAssist(payload);
        callbacks.onDone(fallback);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      // Fallback seamlessly to queryAssist
      try {
        const fallback = await this.queryAssist(payload);
        callbacks.onChunk(fallback.answer);
        callbacks.onDone(fallback);
      } catch (fbErr: any) {
        callbacks.onError(fbErr);
      }
    }
  }

  // --- Gamification & Points ---
  public async getLeaderboard(): Promise<{ top10: LeaderboardEntry[]; currentUserEntry: LeaderboardEntry | null }> {
    return this.request<{ top10: LeaderboardEntry[]; currentUserEntry: LeaderboardEntry | null }>(
      `/leaderboard${this.currentUserId ? `?userId=${this.currentUserId}` : ''}`
    );
  }

  public async getBadges(): Promise<Badge[]> {
    return this.request<Badge[]>('/badges');
  }

  public async awardActivityPoints(payload: { userId: string; activityId: string; points: number; activityName: string }) {
    try {
      return await this.request<{
        success: boolean;
        alreadyAwarded: boolean;
        awardedPoints: number;
        user: StudentUser;
        newBadges: Badge[];
      }>('/points/award-activity', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (e) {
      if (this.getIsOffline()) {
        offlineStorage.enqueueSync('activity_point', payload);
        return { success: true, alreadyAwarded: false, awardedPoints: payload.points, offlineQueued: true };
      }
      throw e;
    }
  }

  // --- Premium & Payments ---
  public async getPremiumPlans(): Promise<PremiumPlan[]> {
    try {
      const remote = await this.request<PremiumPlan[]>('/premium/plans');
      if (remote && Array.isArray(remote)) {
        try {
          localStorage.setItem('studymaster_premium_plans', JSON.stringify(remote));
        } catch {}
        return remote;
      }
    } catch {}
    
    // Check cached plans
    try {
      const cached = localStorage.getItem('studymaster_premium_plans');
      if (cached) return JSON.parse(cached);
    } catch {}

    // Fallback using stored payment methods if available
    try {
      const cachedPay = localStorage.getItem('studymaster_payment_methods');
      if (cachedPay) {
        const payCfg = JSON.parse(cachedPay) as PaymentMethodsConfig;
        return [
          {
            id: 'monthly',
            name: '1-Month Student Pass',
            priceMWK: payCfg.monthlyPriceMWK || 600,
            durationMonths: 1,
            features: [
              '100% Ad-Free Studying',
              'Unlimited Notes & Past Paper Downloads',
              'MANEB Examiner Marking Rubrics & Simulators',
              'Chief Examiner Insights & Chief Pitfalls',
              'Priority StudyMaster Assist'
            ],
            discountBadge: 'Popular',
            status: 'active'
          },
          {
            id: 'two_month',
            name: '2-Month Term Pass',
            priceMWK: payCfg.twoMonthPriceMWK || 1000,
            durationMonths: 2,
            features: [
              'All 1-Month Student Pass Features',
              'Covers Full Academic Term Revision',
              '2x Multi-Device Offline Storage Slot',
              'Free Future Updates & Past Paper Packs'
            ],
            discountBadge: 'Best Value',
            status: 'active'
          }
        ];
      }
    } catch {}

    return INITIAL_PREMIUM_PLANS;
  }

  public async getPaymentMethods(): Promise<PaymentMethodsConfig> {
    try {
      const remote = await this.request<PaymentMethodsConfig>('/payment-methods');
      if (remote && remote.airtelNumber) {
        try {
          localStorage.setItem('studymaster_payment_methods', JSON.stringify(remote));
        } catch {}
        return remote;
      }
    } catch {}

    // Offline / local storage fallback
    try {
      const cached = localStorage.getItem('studymaster_payment_methods');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}

    return INITIAL_PAYMENT_METHODS;
  }

  public async updatePaymentMethods(config: PaymentMethodsConfig): Promise<PaymentMethodsConfig> {
    try {
      localStorage.setItem('studymaster_payment_methods', JSON.stringify(config));
    } catch {}

    // Broadcast instant sync across tabs and open components
    try {
      window.dispatchEvent(new CustomEvent('studymaster_payment_config_updated', { detail: config }));
    } catch {}

    try {
      const res = await this.request<PaymentMethodsConfig>('/payment-methods', {
        method: 'POST',
        body: JSON.stringify(config)
      });
      if (res) {
        try {
          localStorage.setItem('studymaster_payment_methods', JSON.stringify(res));
        } catch {}
        return res;
      }
    } catch (e) {
      console.warn('Backend update failed, local copy saved:', e);
    }
    return config;
  }

  public async initiatePayment(payload: {
    userId: string;
    username: string;
    planId: 'monthly' | 'two_month';
    amountMWK: number;
    method: 'PayChangu' | 'PayChangu (Airtel / TNM / Card)' | 'TNM Mpamba' | 'Airtel Money' | 'National Bank Card' | 'Standard Bank Card' | 'FDH Bank' | 'NBS Bank' | 'Visa/Mastercard' | 'Instant Mobile Money Push';
    accountOrPhone?: string;
    studentPhone?: string;
    referenceNumber?: string;
    screenshotUrl?: string;
  }) {
    return this.request<{ payment: PaymentRecord; user?: StudentUser; status: string; message: string }>('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // --- PayChangu Live Automated Mobile Money & Card Gateway ---
  public async getPayChanguConfig(): Promise<{ publicKey: string; isConfigured: boolean; supportedChannels: string[]; currency: string }> {
    try {
      return await this.request<{ publicKey: string; isConfigured: boolean; supportedChannels: string[]; currency: string }>('/paychangu/config');
    } catch {
      return {
        publicKey: 'pub-live-4YFdTMwyPUbPU7FMHz13G57COsWuhcKs',
        isConfigured: true,
        supportedChannels: ['Airtel Money', 'TNM Mpamba', 'Visa / Mastercard', 'Bank Transfer'],
        currency: 'MWK'
      };
    }
  }

  public async initializePayChangu(payload: {
    userId: string;
    username: string;
    email?: string;
    phone?: string;
    planId: 'monthly' | 'two_month';
    amountMWK: number;
    redirectOrigin?: string;
  }): Promise<{ status: string; message: string; checkoutUrl: string; txRef: string; amount: number; currency: string }> {
    return this.request<{ status: string; message: string; checkoutUrl: string; txRef: string; amount: number; currency: string }>('/paychangu/initialize', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async directChargePayChangu(payload: {
    userId: string;
    username: string;
    email?: string;
    phone?: string;
    planId: 'monthly' | 'two_month';
    amountMWK: number;
    operator?: string;
  }): Promise<{ status: string; isActivated: boolean; message: string; payment?: PaymentRecord; user?: StudentUser; txRef: string }> {
    return this.request<{ status: string; isActivated: boolean; message: string; payment?: PaymentRecord; user?: StudentUser; txRef: string }>('/paychangu/direct-charge', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async verifyPayChanguPayment(txRef: string): Promise<{ status: string; isActivated: boolean; message: string; payment?: PaymentRecord; user?: StudentUser; txRef: string }> {
    return this.request<{ status: string; isActivated: boolean; message: string; payment?: PaymentRecord; user?: StudentUser; txRef: string }>(`/paychangu/verify/${encodeURIComponent(txRef)}`);
  }

  public async verifyPayment(payload: { paymentId: string; adminUsername?: string }) {
    return this.request<{ payment: PaymentRecord; message: string }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async rejectPayment(payload: { paymentId: string; reason: string; adminUsername?: string }) {
    return this.request<{ payment: PaymentRecord; message: string }>('/payments/reject', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // --- Community Links (Facebook & WhatsApp) ---
  public async getCommunityLinks(): Promise<CommunityLinksConfig> {
    try {
      const remote = await this.request<CommunityLinksConfig>('/community-links');
      if (remote && remote.whatsappGroupUrl) {
        try {
          localStorage.setItem('studymaster_community_links', JSON.stringify(remote));
        } catch {}
        return remote;
      }
    } catch {}

    try {
      const cached = localStorage.getItem('studymaster_community_links');
      if (cached) return JSON.parse(cached);
    } catch {}

    return INITIAL_COMMUNITY_LINKS;
  }

  public async updateCommunityLinks(config: CommunityLinksConfig): Promise<CommunityLinksConfig> {
    try {
      localStorage.setItem('studymaster_community_links', JSON.stringify(config));
      window.dispatchEvent(new CustomEvent('studymaster_community_links_updated', { detail: config }));
    } catch {}

    try {
      const res = await this.request<CommunityLinksConfig>('/community-links', {
        method: 'POST',
        body: JSON.stringify(config)
      });
      if (res) {
        try {
          localStorage.setItem('studymaster_community_links', JSON.stringify(res));
        } catch {}
        return res;
      }
    } catch {}
    return config;
  }

  // --- Maneb Timetable & Exam Planner ---
  public async getManebTimetable(examLevel?: string): Promise<ManebTimetableItem[]> {
    try {
      const q = examLevel ? `?examLevel=${encodeURIComponent(examLevel)}` : '';
      return await this.request<ManebTimetableItem[]>(`/maneb/timetable${q}`);
    } catch {
      return INITIAL_MANEB_TIMETABLE;
    }
  }

  public async saveManebTimetableItem(item: Partial<ManebTimetableItem>, isEdit: boolean): Promise<ManebTimetableItem> {
    if (isEdit && item.id) {
      return this.request<ManebTimetableItem>(`/maneb/timetable/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify(item)
      });
    }
    return this.request<ManebTimetableItem>('/maneb/timetable', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  }

  public async deleteManebTimetableItem(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/maneb/timetable/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Chief Examiner Insights ---
  public async getChiefExaminerInsights(subjectId?: string, form?: string): Promise<ChiefExaminerInsight[]> {
    try {
      const params = new URLSearchParams();
      if (subjectId) params.append('subjectId', subjectId);
      if (form) params.append('form', form);
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      return await this.request<ChiefExaminerInsight[]>(`/maneb/examiner-insights${queryStr}`);
    } catch {
      return INITIAL_CHIEF_EXAMINER_INSIGHTS;
    }
  }

  public async saveChiefExaminerInsight(insight: Partial<ChiefExaminerInsight>, isEdit: boolean): Promise<ChiefExaminerInsight> {
    if (isEdit && insight.id) {
      return this.request<ChiefExaminerInsight>(`/maneb/examiner-insights/${insight.id}`, {
        method: 'PUT',
        body: JSON.stringify(insight)
      });
    }
    return this.request<ChiefExaminerInsight>('/maneb/examiner-insights', {
      method: 'POST',
      body: JSON.stringify(insight)
    });
  }

  public async deleteChiefExaminerInsight(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/maneb/examiner-insights/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Marking Scheme Simulator ---
  public async getMarkingSimulatorItems(subject?: string): Promise<MarkingSchemeSimItem[]> {
    try {
      const q = subject ? `?subject=${encodeURIComponent(subject)}` : '';
      return await this.request<MarkingSchemeSimItem[]>(`/maneb/marking-simulator${q}`);
    } catch {
      return INITIAL_MARKING_SIMULATOR_ITEMS;
    }
  }

  public async saveMarkingSimulatorItem(item: Partial<MarkingSchemeSimItem>): Promise<MarkingSchemeSimItem> {
    return this.request<MarkingSchemeSimItem>('/maneb/marking-simulator', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  }

  // --- Student Issue / Error Reports ---
  public async getReports(userId?: string): Promise<ReportIssue[]> {
    try {
      const q = userId ? `?userId=${encodeURIComponent(userId)}` : '';
      return await this.request<ReportIssue[]>(`/reports${q}`);
    } catch {
      return INITIAL_REPORT_ISSUES;
    }
  }

  public async submitReport(report: {
    userId: string;
    username?: string;
    category?: ReportIssue['category'];
    subjectId?: string;
    subjectName?: string;
    topicId?: string;
    topicTitle?: string;
    title: string;
    description: string;
    screenshotUrl?: string;
  }): Promise<ReportIssue> {
    return this.request<ReportIssue>('/reports', {
      method: 'POST',
      body: JSON.stringify(report)
    });
  }

  public async replyToReport(id: string, adminReply: string, status: ReportIssue['status']): Promise<ReportIssue> {
    return this.request<ReportIssue>(`/reports/${id}/reply`, {
      method: 'PUT',
      body: JSON.stringify({ adminReply, status })
    });
  }

  public async deleteReport(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/reports/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Subject Statistics & Analytics ---
  public async getSubjectAnalytics(): Promise<SubjectAnalytics[]> {
    try {
      return await this.request<SubjectAnalytics[]>('/analytics/subjects');
    } catch {
      return [];
    }
  }

  public async recordSubjectActivity(subjectId: string, type: 'views' | 'notesRead' | 'quizAttempts' | 'downloads', quizScore?: number) {
    try {
      return await this.request<{ success: boolean }>('/analytics/activity', {
        method: 'POST',
        body: JSON.stringify({ subjectId, type, quizScore })
      });
    } catch {
      return { success: false };
    }
  }

  // --- Announcements & Ads ---
  public async getAnnouncements(): Promise<Announcement[]> {
    return this.request<Announcement[]>('/announcements');
  }

  public async getAdConfig(): Promise<AdConfiguration> {
    return this.request<AdConfiguration>('/ads/config');
  }

  // --- Admin ---
  public async getAdminStats(): Promise<PlatformStats> {
    return this.request<PlatformStats>('/admin/stats');
  }

  public async getAdminStudents(): Promise<StudentUser[]> {
    return this.request<StudentUser[]>('/admin/students');
  }

  public async toggleStudentStatus(studentId: string, status: 'active' | 'deactivated'): Promise<{ user: StudentUser; message: string }> {
    return this.request<{ user: StudentUser; message: string }>(`/admin/students/${studentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  public async deleteStudent(studentId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/admin/students/${studentId}`, {
      method: 'DELETE'
    });
  }

  public async getAdminAuditLogs(): Promise<AuditLog[]> {
    return this.request<AuditLog[]>('/admin/audit-logs');
  }

  public async getAdminPayments(): Promise<PaymentRecord[]> {
    return this.request<PaymentRecord[]>('/payments');
  }

  public async saveAdminSubject(subject: Partial<Subject>, isEdit: boolean) {
    if (isEdit && subject.id) {
      return this.request<Subject>(`/admin/subjects/${subject.id}`, { method: 'PUT', body: JSON.stringify(subject) });
    }
    return this.request<Subject>('/admin/subjects', { method: 'POST', body: JSON.stringify(subject) });
  }

  public async deleteAdminSubject(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/admin/subjects/${id}`, {
      method: 'DELETE'
    });
  }

  public async saveAdminTopic(topic: Partial<Topic>, isEdit: boolean) {
    if (isEdit && topic.id) {
      return this.request<Topic>(`/admin/topics/${topic.id}`, { method: 'PUT', body: JSON.stringify(topic) });
    }
    return this.request<Topic>('/admin/topics', { method: 'POST', body: JSON.stringify(topic) });
  }

  public async deleteAdminTopic(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/admin/topics/${id}`, {
      method: 'DELETE'
    });
  }

  public async getAdminNotes(): Promise<NoteItem[]> {
    return this.request<NoteItem[]>('/admin/notes');
  }

  public async saveAdminNote(note: Partial<NoteItem>, isEdit: boolean) {
    if (isEdit && note.id) {
      return this.request<NoteItem>(`/admin/notes/${note.id}`, { method: 'PUT', body: JSON.stringify(note) });
    }
    return this.request<NoteItem>('/admin/notes', { method: 'POST', body: JSON.stringify(note) });
  }

  public async deleteAdminNote(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/admin/notes/${id}`, {
      method: 'DELETE'
    });
  }

  public async saveAdminLesson(lesson: Partial<Lesson>, isEdit: boolean) {
    if (isEdit && lesson.id) {
      return this.request<Lesson>(`/admin/lessons/${lesson.id}`, { method: 'PUT', body: JSON.stringify(lesson) });
    }
    return this.request<Lesson>('/admin/lessons', { method: 'POST', body: JSON.stringify(lesson) });
  }

  public async deleteAdminLesson(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/admin/lessons/${id}`, {
      method: 'DELETE'
    });
  }

  public async saveAdminPastPaper(paper: Partial<PastPaper>, isEdit: boolean) {
    if (isEdit && paper.id) {
      return this.request<PastPaper>(`/admin/past-papers/${paper.id}`, { method: 'PUT', body: JSON.stringify(paper) });
    }
    return this.request<PastPaper>('/admin/past-papers', { method: 'POST', body: JSON.stringify(paper) });
  }

  public async deleteAdminPastPaper(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/admin/past-papers/${id}`, {
      method: 'DELETE'
    });
  }

  public async uploadPastPaperFile(file: File): Promise<{
    downloadUrl: string;
    fileName: string;
    fileSizeMb: number;
    fileSizeBytes: number;
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const sizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));
          const res = await this.request<{
            downloadUrl: string;
            fileName: string;
            fileSizeMb: number;
            fileSizeBytes: number;
          }>('/admin/past-papers/upload-file', {
            method: 'POST',
            body: JSON.stringify({
              fileName: file.name,
              fileBase64: dataUrl,
              mimeType: file.type || 'application/pdf',
              sizeBytes: file.size
            })
          }).catch(() => {
            // Fallback to client DataURL if backend upload encounters transient error
            return {
              downloadUrl: dataUrl,
              fileName: file.name,
              fileSizeMb: sizeMb || 1.0,
              fileSizeBytes: file.size
            };
          });
          resolve(res);
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  public async saveAdminQuiz(quiz: Partial<Quiz>) {
    return this.request<Quiz>('/admin/quizzes', { method: 'POST', body: JSON.stringify(quiz) });
  }

  public async deleteAdminQuiz(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/admin/quizzes/${id}`, {
      method: 'DELETE'
    });
  }

  public async updateAdminPlans(plans: PremiumPlan[]) {
    return this.request<PremiumPlan[]>('/admin/premium/plans', { method: 'PUT', body: JSON.stringify(plans) });
  }

  public async updateAdminAdConfig(config: AdConfiguration) {
    return this.request<AdConfiguration>('/admin/ads/config', { method: 'PUT', body: JSON.stringify(config) });
  }

  public async addAdminAnnouncement(ann: Partial<Announcement>) {
    return this.request<Announcement>('/admin/announcements', { method: 'POST', body: JSON.stringify(ann) });
  }

  public async updateAdminAnnouncement(id: string, ann: Partial<Announcement>) {
    return this.request<Announcement>(`/admin/announcements/${id}`, { method: 'PUT', body: JSON.stringify(ann) });
  }

  public async togglePinAdminAnnouncement(id: string) {
    return this.request<Announcement>(`/admin/announcements/${id}/pin`, { method: 'PUT' });
  }

  public async deleteAdminAnnouncement(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/admin/announcements/${id}`, {
      method: 'DELETE'
    });
  }

  // --- Offline Reconnect Synchronization ---
  public async syncOfflineQueue() {
    if (this.getIsOffline()) return { syncedCount: 0 };
    const queue = offlineStorage.getSyncQueue();
    if (queue.length === 0) return { syncedCount: 0 };

    let synced = 0;
    for (const item of queue) {
      try {
        if (item.type === 'quiz_submission') {
          await this.submitQuiz(item.payload);
          synced++;
        } else if (item.type === 'activity_point') {
          await this.awardActivityPoints(item.payload);
          synced++;
        }
      } catch (e) {
        console.warn('Sync item failed:', item, e);
      }
    }
    offlineStorage.clearSyncQueue();
    return { syncedCount: synced };
  }
}

export const api = new ApiClient();
