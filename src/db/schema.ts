import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

// Students and users
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  phone: text("phone"),
  role: text("role").default("student"),
  form: text("form").default("Form 4"),
  school: text("school"),
  district: text("district"),
  isPremium: boolean("is_premium").default(false),
  premiumExpiry: text("premium_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subjects (e.g. Mathematics, Physical Science, English, Biology)
export const subjects = pgTable("subjects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  forms: jsonb("forms").$type<string[]>().default(["Form 1", "Form 2", "Form 3", "Form 4"]),
  icon: text("icon").default("BookOpen"),
  description: text("description"),
  topicCount: integer("topic_count").default(0),
  status: text("status").default("published"),
});

// Topics under subjects
export const topics = pgTable("topics", {
  id: text("id").primaryKey(),
  subjectId: text("subject_id").notNull(),
  title: text("title").notNull(),
  form: text("form").notNull(),
  term: text("term").default("Term 1"),
  description: text("description"),
  orderIndex: integer("order_index").default(1),
  isPremiumOnly: boolean("is_premium_only").default(false),
});

// Study Notes & Curriculum Units
export const notes = pgTable("notes", {
  id: text("id").primaryKey(),
  subjectId: text("subject_id").notNull(),
  topicId: text("topic_id").notNull(),
  title: text("title").notNull(),
  contentMarkdown: text("content_markdown").notNull(),
  author: text("author").default("MANEB Curriculum Specialist"),
  readTimeMinutes: integer("read_time_minutes").default(5),
  audioUrl: text("audio_url"),
  videoUrl: text("video_url"),
  pdfUrl: text("pdf_url"),
  diagramUrl: text("diagram_url"),
  isPremiumOnly: boolean("is_premium_only").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quizzes & Practice Tests
export const quizzes = pgTable("quizzes", {
  id: text("id").primaryKey(),
  subjectId: text("subject_id").notNull(),
  topicId: text("topic_id"),
  title: text("title").notNull(),
  form: text("form").notNull(),
  timeLimitMinutes: integer("time_limit_minutes").default(15),
  passPercentage: integer("pass_percentage").default(60),
  questions: jsonb("questions").$type<any[]>().notNull(),
  isPremiumOnly: boolean("is_premium_only").default(false),
});

// Past Exam Papers (MSCE & JCE)
export const pastPapers = pgTable("past_papers", {
  id: text("id").primaryKey(),
  subjectId: text("subject_id").notNull(),
  level: text("level").notNull(), // MSCE | JCE
  year: integer("year").notNull(),
  paperNumber: integer("paper_number").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  markingSchemePdfUrl: text("marking_scheme_pdf_url"),
  solutionsAvailable: boolean("solutions_available").default(true),
});

// Mobile Money & Bank Payments
export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  username: text("username").notNull(),
  studentPhone: text("student_phone"),
  planId: text("plan_id").notNull(),
  amountMWK: integer("amount_mwk").notNull(),
  method: text("method").notNull(), // airtel | mpamba | bank
  transactionRef: text("transaction_ref").notNull(),
  screenshotUrl: text("screenshot_url"),
  status: text("status").default("pending"), // pending | verified | rejected
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  verifiedAt: text("verified_at"),
  verifiedBy: text("verified_by"),
});

// MANEB Timetable & Countdowns
export const examSchedules = pgTable("exam_schedules", {
  id: text("id").primaryKey(),
  level: text("level").notNull(), // MSCE | JCE
  subject: text("subject").notNull(),
  paper: text("paper").notNull(),
  date: text("date").notNull(),
  dayOfWeek: text("day_of_week").notNull(),
  session: text("session").notNull(),
  durationMinutes: integer("duration_minutes").default(120),
  instructions: text("instructions"),
  requiredEquipment: jsonb("required_equipment").$type<string[]>().default([]),
});

// App Global Settings (Mobile Money Numbers, Social Groups)
export const systemSettings = pgTable("system_settings", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
