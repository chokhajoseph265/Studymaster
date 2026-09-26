# StudyMaster Malawi 🇲🇼

> **Empowering Secondary School Students across Malawi for JCE & MSCE MANEB Examination Excellence.**

StudyMaster Malawi is a comprehensive educational platform and curriculum management system designed specifically for the Malawi Secondary School Curriculum (Forms 1–4, preparing for Junior Certificate of Education [JCE] and Malawi School Certificate of Education [MSCE] examinations).

---

## 🌟 Core Features

### 1. Student Learning Hub
* **Class Form Selection**: Tailored for **Form 1 (Junior 1)**, **Form 2 (Junior 2 - JCE)**, **Form 3 (Senior 3)**, and **Form 4 (Senior 4 - MSCE)**.
* **Curriculum Subjects**: Mathematics, Physical Science, Chemistry, Biology, English, Chichewa, Geography, History, Agriculture, Social & Development Studies, and Computer Studies.
* **Interactive Revision Notes**: Multi-media notes supporting structured text, PDF documents, scientific diagrams with zoom, audio voice lectures, and video demonstrations.
* **Beautiful Mathematical & Scientific Notation**: Full KaTeX rendering for fractions, radicals, powers, systems of equations, matrices, and chemical formulas.
* **Topic Quizzes & Progress Tracking**: Real-time knowledge checks, gamification points, and achievement badges.
* **Offline Study Mode**: Local caching and background queue synchronization for uninterrupted learning with limited connectivity.

### 2. Admin Management Console
* **Direct Curriculum Hierarchy**:
  1. **Forms Screen**: Overview of Forms 1–4 with real-time counters.
  2. **Subjects Screen**: Filter and select subjects applicable to each Form.
  3. **Topics Screen**: Manage syllabus chapters and add/edit/delete topics.
  4. **Notes Studio**: Create, edit, and publish rich revision notes with media attachments and live KaTeX preview.
* **Admin Security**: PIN-protected console (4-digit passcode), lockout protection, and configurable device session settings.

---

## 📚 StudyMaster Assist — Pedagogical Architecture

StudyMaster incorporates an empathetic, patient, and highly intelligent human-like teaching persona:

### Core Teaching Principles
1. **Teach the Student, Not the Topic**:
   * Prioritize deep student understanding over information dumping.
   * Follow the pedagogical loop: **Explain → Demonstrate → Check understanding → Adapt → Continue**.
2. **Proper Mathematical & Scientific Notation**:
   * Formatted using clean LaTeX/KaTeX blocks ($$ or $).
   * Raw LaTeX or code syntax is never exposed unrendered to students.
   * Formats matrices, fractions ($\frac{a}{b}$), roots ($\sqrt{x}$), scientific notation ($3.0 \times 10^8 \text{ m/s}$), and balanced chemical equations ($\text{H}_2\text{SO}_4$).
3. **Progressive Learning Levels**:
   * **Level 1**: Basic core concept in simple, accessible language.
   * **Level 2**: Clear illustrative example.
   * **Level 3**: Breakdown of why and how each step works.
   * **Level 4**: Guided step-by-step practice.
   * **Level 5**: Independent check questions.
   * **Level 6**: Advanced challenges and MANEB exam-style questions.
4. **Malawi Context & MANEB Standards**:
   * Practical real-world Malawian examples (farming, solar energy, local ecology).
   * Exam preparation aligned with MANEB command words (*state, describe, explain, calculate, deduce*) and marking schemes (M1 method marks, A1 accuracy marks).

---

## 🛠️ Technology Stack

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Motion.
* **Mathematics & Markdown**: `katex`, `remark-math`, `rehype-katex`, `react-markdown`.
* **Backend**: Node.js, Express, TypeScript (`tsx`).
* **Database & Sync**: Firestore integration, Cross-tab BroadcastChannel sync manager, LocalStorage offline fallback.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (version 18 or higher)
* npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-github-repo-url>
cd studymaster-malawi

# Install dependencies
npm install

# Start development server
npm run dev
```

The application runs locally on `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

---

## 📄 License
Private & Proprietary — Developed for StudyMaster Malawi Educational Initiative.
