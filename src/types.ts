/**
 * StudyMaster Malawi - TypeScript Type Definitions
 */

export type FormLevel = 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4';

export type PrimaryLevel = 'Standard 5' | 'Standard 6' | 'Standard 7' | 'Standard 8';
export type EducationLevel = PrimaryLevel | FormLevel;

export type StudyFeatureMode =
  | 'ask'
  | 'math'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'ict'
  | 'language'
  | 'quiz'
  | 'explain_answer'
  | 'summarize'
  | 'exam_practice';

export interface FormInfo {
  id: string;
  name: FormLevel;
  alias: string; // e.g. 'Junior 1', 'Junior 2', 'Senior 3', 'Senior 4'
  description: string;
  order: number;
}

export interface Subject {
  id: string;
  name: string;
  forms: FormLevel[];
  icon: string;
  category: 'Sciences' | 'Languages' | 'Humanities' | 'Commercial' | 'Technical';
  description: string;
  topicCount?: number;
  status: 'published' | 'draft' | 'deactivated';
}

export interface Topic {
  id: string;
  subjectId: string;
  form: FormLevel;
  title: string;
  summary: string;
  order: number;
  status: 'published' | 'draft' | 'deactivated';
  keyConcepts?: string[];
  formulasOrFacts?: string[];
  manebExamFocus?: string; // Compatibility alias
}

export interface NoteItem {
  id: string;
  topicId: string;
  subjectId: string;
  form: FormLevel;
  formLevel?: FormLevel; // Compatibility alias
  noteFormat?: 'text' | 'document' | 'image' | 'audio' | 'video' | 'multimedia';
  title: string;
  summary: string;
  lessonBadge?: string;
  learningObjectives?: string[];
  keyPoints?: string[];
  vocabulary?: { term: string; definition: string }[];
  didYouKnow?: string;
  quickCheckQuestions?: { id?: string; question: string; answer?: string }[];
  keyTakeaway?: string;
  content: string; // Markdown or rich structured text with headings, tables, diagrams
  workedExamples?: WorkedExample[];
  diagramUrl?: string;
  imageUrl?: string; // Compatibility alias for diagramUrl
  diagramCaption?: string;
  additionalImages?: { id: string; url: string; caption: string }[];
  audioUrl?: string;
  audioTitle?: string;
  audioDurationSeconds?: number;
  videoUrl?: string;
  videoTitle?: string;
  documentUrl?: string;
  documentName?: string;
  documentSizeBytes?: number;
  // Direct device uploaded media & documents
  documentFile?: { name: string; mimeType: string; dataUrl: string; sizeBytes?: number };
  imageFile?: { name: string; mimeType: string; dataUrl: string; caption?: string };
  audioFile?: { name: string; title?: string; mimeType: string; dataUrl: string; durationSeconds?: number };
  videoFile?: { name: string; title?: string; mimeType: string; dataUrl: string };
  version: number;
  status: 'published' | 'draft' | 'deactivated';
  offlineAvailable: boolean;
  assistAvailable: boolean;
  updatedAt: string;
  estimatedReadTimeMinutes: number;
}

export interface WorkedExample {
  id: string;
  title: string;
  problem: string;
  stepByStepSolution: { step: number; explanation: string; mathOrCode?: string }[];
  steps?: string[]; // Compatibility alias for string[] steps
  finalAnswer: string;
  keyTakeaway: string;
}

export interface Lesson {
  id: string;
  topicId: string;
  subjectId: string;
  form: FormLevel;
  title: string;
  introduction: string;
  explanation: string;
  examples: WorkedExample[];
  importantPoints: string[];
  practicePrompt?: string;
  summary: string;
  version: number;
  status: 'published' | 'draft' | 'deactivated';
  updatedAt: string;
}

export interface PracticeQuestion {
  id: string;
  topicId: string;
  subjectId: string;
  form: FormLevel;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  status: 'published' | 'draft' | 'deactivated';
}

export interface Quiz {
  id: string;
  topicId: string;
  subjectId: string;
  form: FormLevel;
  title: string;
  description: string;
  questions: PracticeQuestion[];
  timeLimitMinutes: number;
  pointsAwarded: number;
  status: 'published' | 'draft' | 'deactivated';
  version: number;
}

export interface PastPaper {
  id: string;
  subjectId: string;
  subjectName: string;
  form: FormLevel;
  formLevel?: FormLevel; // Compatibility alias
  year: number;
  paperNumber: string; // e.g. 'Paper 1', 'Paper 2 (Practical)', 'Paper 3'
  category: 'MSCE' | 'JCE' | 'Mock' | 'End of Term' | 'Mid-Term' | 'School Assessment' | 'National Revision' | string;
  title: string;
  description: string;
  fileSizeMb: number;
  fileSizeBytes?: number; // Compatibility alias
  downloadUrl: string;
  fileName?: string; // Compatibility alias
  hasMarkingGuide: boolean;
  hasMarkingScheme?: boolean; // Compatibility alias
  durationMinutes?: number; // Compatibility alias
  totalMarks?: number; // Compatibility alias
  isPremiumOnly?: boolean; // Compatibility alias
  markingGuideSummary?: string;
  markingSchemeSummary?: string; // Compatibility alias
  questionsExcerpt?: { qNumber: number; text: string; marks: number }[];
  sampleQuestions?: { qNumber: number; text: string; marks: number }[]; // Compatibility alias
  offlineAvailable: boolean;
  status: 'published' | 'draft' | 'deactivated';
  downloadCount: number;
  uploadedAt: string;
}

export interface ExamTip {
  id: string;
  title: string;
  subjectName?: string; // Compatibility alias
  category: 'General Strategy' | 'Mathematics & Sciences' | 'Essay Writing' | 'Time Management' | 'MANEB Preparation';
  summary: string;
  details: string;
  applicableForms: FormLevel[];
  author: string;
  icon: string;
}

export interface StudentUser {
  id: string;
  username: string; // Permanent, unique
  emailOrPhone: string;
  avatarId: string;
  activeForm: FormLevel;
  points: number;
  weeklyPoints: number;
  badges: string[]; // Badge IDs
  completedActivityIds: string[]; // Track unique awards to prevent repeat point milking
  isPremium: boolean;
  premiumExpiry?: string;
  trialExpiresAt?: string; // 2-day trial expiry timestamp
  createdAt: string;
  lastLoginAt: string;
  isAdmin?: boolean;
  status?: 'active' | 'deactivated';
}

export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  accentBg: string;
  label: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  requirement: string;
  icon: string;
  rarity: 'Common' | 'Silver' | 'Gold' | 'Malawi Champion';
  pointsReward: number;
  category: 'Study' | 'Quiz' | 'PastPapers' | 'Special';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarId: string;
  weeklyPoints: number;
  totalPoints: number;
  activeForm: FormLevel;
  badgeCount: number;
  topBadge?: string;
  isPremium?: boolean;
  schoolName?: string;
  district?: string;
}

export interface DownloadedItem {
  id: string; // e.g. note-123 or paper-456
  type: 'note' | 'lesson' | 'past_paper' | 'quiz_package';
  title: string;
  subjectName: string;
  form: FormLevel;
  version: number;
  latestServerVersion: number;
  downloadedAt: string;
  fileSizeBytes: number;
  data: any; // Full cached payload
}

export interface AssistKnowledgeDoc {
  id: string;
  form: FormLevel;
  subjectId: string;
  topicId: string;
  title: string;
  keywords: string[];
  content: string;
  workedExamplesSummary?: string;
  status: 'active' | 'disabled';
}

export interface AssistResponse {
  query: string;
  matchedTopic?: string;
  matchedSubject?: string;
  matchedForm?: string;
  answer: string;
  confidence: 'High' | 'Moderate' | 'Low' | 'Unreliable Image / Not In Syllabus';
  sourceCitations: {
    type: 'Note' | 'Lesson' | 'Worked Example' | 'Past Paper';
    title: string;
    topicId?: string;
    subjectId?: string;
  }[];
  workedExample?: WorkedExample;
  studyTip?: string;
  mode?: StudyFeatureMode;
  educationLevel?: string;
}

export interface PremiumPlan {
  id: 'monthly' | 'two_month';
  name: string;
  durationMonths: number;
  priceMWK: number;
  originalPriceMWK?: number;
  discountBadge?: string;
  features: string[];
  status: 'active' | 'inactive';
}

export interface PaymentRecord {
  id: string;
  userId: string;
  username: string;
  planId: 'monthly' | 'two_month';
  amountMWK: number;
  method: 'PayChangu' | 'PayChangu (Airtel / TNM / Card)' | 'TNM Mpamba' | 'Airtel Money' | 'National Bank Card' | 'Standard Bank Card' | 'FDH Bank' | 'NBS Bank' | 'Visa/Mastercard' | 'Instant Mobile Money Push';
  accountOrPhone: string;
  referenceNumber: string;
  studentPhone?: string;
  screenshotUrl?: string;
  rejectionReason?: string;
  status: 'pending' | 'verified' | 'failed' | 'cancelled' | 'rejected';
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  paychanguTxRef?: string;
}

export interface PayChanguInitResponse {
  status: string;
  message: string;
  checkoutUrl?: string;
  txRef: string;
  amount: number;
  currency: string;
}

export interface PayChanguVerifyResponse {
  status: string;
  message: string;
  isActivated: boolean;
  user?: StudentUser;
  payment?: PaymentRecord;
  txRef: string;
}

export interface BankAccountInfo {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  swiftOrCode?: string;
  instructions?: string;
}

export interface PaymentMethodsConfig {
  airtelNumber: string;
  airtelName: string;
  airtelAccountName?: string;
  tnmNumber: string;
  tnmName: string;
  tnmAccountName?: string;
  monthlyPriceMWK?: number;
  twoMonthPriceMWK?: number;
  bankAccounts: BankAccountInfo[];
  instructionsNote: string;
}

export interface CommunityLinksConfig {
  facebookUrl: string;
  facebookPageName: string;
  whatsappGroupUrl: string;
  whatsappGroupName: string;
  supportPhone: string;
  supportEmail: string;
  enabled: boolean;
}

export interface ReportIssue {
  id: string;
  userId: string;
  username: string;
  category: 'Content Error' | 'Quiz Question Issue' | 'Payment & Premium' | 'Past Paper Typo' | 'App Bug / Technical' | 'General Feedback';
  subjectId?: string;
  subjectName?: string;
  topicId?: string;
  topicTitle?: string;
  title: string;
  description: string;
  screenshotUrl?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  adminReply?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SubjectAnalytics {
  subjectId: string;
  subjectName: string;
  category: string;
  viewCount: number;
  quizAttemptCount: number;
  avgQuizScore: number;
  notesReadCount: number;
  downloadsCount: number;
}

export interface ManebTimetableItem {
  id: string;
  examLevel: 'MSCE' | 'JCE' | 'PSLCE' | 'MOCK';
  code: string;
  subject: string;
  paper: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  session: 'Morning (08:00 - 10:30)' | 'Afternoon (13:30 - 16:00)';
  durationMinutes: number;
  instructions: string;
  requiredEquipment: string[];
  venueRequirements?: string; // Compatibility alias
}

export interface ChiefExaminerInsight {
  id: string;
  subjectId: string;
  subjectName: string;
  subject?: string; // Compatibility alias
  form: FormLevel;
  examLevel?: 'MSCE' | 'JCE' | 'PSLCE'; // Compatibility alias
  year: number;
  title: string;
  paperCategory: string;
  examPaper?: string; // Compatibility alias
  keyTopic?: string; // Compatibility alias
  highYieldAreas?: string[]; // Compatibility alias
  keyWeaknessesReported: string[];
  commonMistakes?: string[]; // Compatibility alias
  commonErrors?: string[]; // Compatibility alias
  scoringPitfalls: string[];
  markingTraps?: string[]; // Compatibility alias
  examinerRecommendations: string[];
  recommendations?: string[]; // Compatibility alias
  documentUrl?: string;
  documentName?: string;
  imageUrl?: string;
  imageCaption?: string;
  status: 'published' | 'draft';
  createdAt: string;
}

export interface MarkingSchemeSimItem {
  id: string;
  subject: string;
  form: FormLevel;
  year?: number; // Compatibility alias
  paper: string;
  topic?: string; // Compatibility alias
  questionNumber?: number | string; // Compatibility alias
  questionText: string;
  totalMarks: number;
  maxMarks?: number; // Compatibility alias
  modelAnswer: string;
  rubricSteps: {
    stepNumber: number;
    criterion: string;
    markType: 'M1 (Method)' | 'A1 (Accuracy)' | 'B1 (Independent Fact)' | 'C1 (Conclusion)' | string;
    marksAwarded: number;
    marks?: number; // Compatibility alias
    examinerNote: string;
    idealWorking?: string; // Compatibility alias
    examinerTip?: string; // Compatibility alias
  }[];
  steps?: {
    stepNumber: number;
    criterion: string;
    markType: 'M1 (Method)' | 'A1 (Accuracy)' | 'B1 (Independent Fact)' | 'C1 (Conclusion)' | string;
    marksAwarded: number;
    marks?: number; // Compatibility alias
    examinerNote: string;
    idealWorking?: string; // Compatibility alias
    examinerTip?: string; // Compatibility alias
  }[]; // Compatibility alias for rubricSteps
  commonStudentErrors?: string[];
  rubrics?: {
    pointsRequired: string;
    awardedMarks: number;
    examinerNote: string;
  }[];
  sampleStudentAnswers?: {
    answerText: string;
    scoreAwarded: number;
    feedback: string;
  }[];
}

export interface AdConfiguration {
  enabled: boolean;
  bannerAdFrequencyMinutes: number;
  rewardedStudyAdMinutes: number;
  showOnDashboard: boolean;
  showOnSubjectBrowser: boolean;
  sponsorName: string;
  sponsorTagline: string;
  sponsorCtaUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'exam_alert' | 'update' | 'motivation' | 'timetable' | 'official_notice';
  targetForm?: FormLevel | 'All Forms';
  isPinned?: boolean; // Pinned announcements stay on top with a distinct gold/emerald pinned badge
  category?: 'General' | 'MANEB Timetable' | 'Examination Alert' | 'Curriculum Notice' | 'Academic Update' | 'Past Papers' | string;
  actionText?: string;
  actionType?: 'past_papers' | 'planner' | 'chemistry' | 'leaderboard' | string;
  targetPaperId?: string;
  attachmentUrl?: string; // Compatibility alias
  // Direct File Attachment from device (image, document/pdf, etc.)
  attachment?: {
    name?: string;
    fileName?: string; // Compatibility alias
    type?: 'image' | 'document' | 'pdf' | 'audio' | 'video' | 'other' | string;
    fileType?: string; // Compatibility alias
    mimeType: string;
    dataUrl: string; // Base64 / data URI uploaded from device
    sizeBytes?: number;
  };
  createdAt: string;
  active: boolean;
}

export interface AuditLog {
  id: string;
  adminUsername: string;
  action: string;
  entityType: 'Content' | 'Student' | 'Payment' | 'Settings' | 'Points' | 'PastPaper';
  entityId: string;
  details: string;
  timestamp: string;
}

export interface PlatformStats {
  totalStudents: number;
  activeStudentsToday: number;
  premiumStudents: number;
  totalNotes: number;
  totalQuizzesTaken: number;
  totalDownloads: number;
  pendingPaymentsCount: number;
  publishedPastPapersCount: number;
  revenueMWK?: number;
}

export interface ChemicalElement {
  atomicNumber: number;
  massNumber: number | string;
  symbol: string;
  name: string;
  group: number | string;
  period: number;
  category: 'metal' | 'non-metal' | 'metalloid' | string;
  family?: string;
  electronConfig: number[];
  neutrons: number;
  summary: string;
}

export interface LatinOriginElement {
  symbol: string;
  englishName: string;
  latinOrigin: string;
}
