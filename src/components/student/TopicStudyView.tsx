import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  HelpCircle,
  CheckCircle2,
  Share2,
  Clock,
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Printer,
  Music,
  Video,
  File,
  ExternalLink,
  Image as ImageIcon,
  Volume2,
  Zap,
  Moon,
  Maximize2,
  GraduationCap
} from 'lucide-react';
import { Topic, NoteItem, Lesson, PracticeQuestion, Quiz, Subject } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useBattery } from '../../context/BatteryContext';
import { api } from '../../services/api';
import { offlineStorage } from '../../services/offlineStorage';
import { EReaderStudyView } from './EReaderStudyView';
import { TextbookNoteView } from './TextbookNoteView';
import { TextToSpeechButton } from '../common/TextToSpeechButton';

interface TopicStudyViewProps {
  topic: Topic;
  subjectName?: string;
  onBack: () => void;
  onStartQuiz?: (quiz: Quiz) => void;
  onAskAssist: (topicQuery: string) => void;
}

function getEmbedVideoUrl(url?: string): string | null {
  if (!url) return null;
  if (url.includes('youtube.com/watch?v=')) {
    const id = url.split('watch?v=')[1]?.split('&')[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  return null;
}

export const TopicStudyView: React.FC<TopicStudyViewProps> = ({
  topic,
  subjectName = 'Subject',
  onBack,
  onStartQuiz,
  onAskAssist
}) => {
  const { user, triggerCelebration } = useAuth();
  const { setScreenOffAudio, setActiveAudioTrack } = useBattery();
  const [note, setNote] = useState<NoteItem | null>(null);
  const [allNotes, setAllNotes] = useState<NoteItem[]>([]);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number>(0);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [relatedQuiz, setRelatedQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEReaderActive, setIsEReaderActive] = useState<boolean>(false);

  // Interactive practice answers state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});
  const [pointsAwarded, setPointsAwarded] = useState<boolean>(false);

  useEffect(() => {
    const fetchTopicData = async () => {
      setLoading(true);
      try {
        // Check offline storage first
        const cachedNote = offlineStorage.getDownloadedItem(`note-${topic.id}`);
        if (cachedNote?.data) {
          setNote(cachedNote.data);
        }

        const [notesList, lessonsList, questionsList, quizzesList] = await Promise.all([
          api.getNotes(topic.id),
          api.getLessons(topic.id),
          api.getQuestions(topic.id),
          api.getQuizzes(topic.id)
        ]);

        if (notesList.length > 0) {
          setAllNotes(notesList);
          setNote(notesList[0]);
          setSelectedNoteIndex(0);
        } else {
          setAllNotes([]);
          setNote(null);
        }
        if (lessonsList.length > 0) setLesson(lessonsList[0]);
        if (questionsList.length > 0) setQuestions(questionsList);
        if (quizzesList.length > 0) setRelatedQuiz(quizzesList[0]);
      } catch (e) {
        console.warn('Topic fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTopicData();
  }, [topic.id]);

  // Handle Launch Screen-off audio
  const handleLaunchScreenOffAudio = (audioUrl: string, title?: string) => {
    setActiveAudioTrack({
      title: title || note?.audioTitle || `${topic.title} Audio Lesson`,
      src: audioUrl,
      subject: subjectName
    });
    setScreenOffAudio(true);
  };

  // If E-Reader Mode is active, render the dedicated low-power reader
  if (isEReaderActive && note) {
    return (
      <EReaderStudyView
        note={note}
        topic={topic}
        subjectName={subjectName}
        onClose={() => setIsEReaderActive(false)}
        onOpenScreenOffAudio={
          note.audioFile?.dataUrl || note.audioUrl
            ? () => handleLaunchScreenOffAudio(note.audioFile?.dataUrl || note.audioUrl || '', note.audioTitle)
            : undefined
        }
      />
    );
  }

  // Handle Practice Question Selection
  const handleSelectAnswer = async (questionId: string, optionIndex: number, question: PracticeQuestion) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setRevealedExplanations((prev) => ({ ...prev, [questionId]: true }));

    if (optionIndex === question.correctAnswerIndex && user && !pointsAwarded) {
      try {
        await api.awardActivityPoints({
          userId: user.id,
          activityId: `practice-q-${question.id}`,
          points: question.points || 10,
          activityName: `Practice Question: ${topic.title}`
        });
        setPointsAwarded(true);
      } catch (e) {
        console.warn('Practice points error:', e);
      }
    }
  };

  return (
    <div className="space-y-5 pb-24 w-full">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* E-Reader Mode (Save Battery) Button */}
          {note && (
            <button
              type="button"
              onClick={() => setIsEReaderActive(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-neutral-800 text-emerald-400 border border-neutral-700 text-xs font-bold shadow-2xs hover:bg-neutral-800 transition"
              title="Launch Distraction-Free E-Reader & Battery Saver Mode"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">E-Reader Mode</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono font-bold">Eco</span>
            </button>
          )}

          {/* Ask Assist Button */}
          <button
            type="button"
            onClick={() => onAskAssist(`Explain ${topic.title} in ${subjectName} ${topic.form}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-2xs"
            title="Ask StudyMaster Assist about this topic"
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Ask Assist</span>
          </button>
        </div>
      </div>

      {/* Topic Title & Metadata Hero */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
          <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            {topic.form}
          </span>
          <span>•</span>
          <span className="text-slate-700 dark:text-slate-300">{subjectName}</span>
          {note?.estimatedReadTimeMinutes && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{note.estimatedReadTimeMinutes} min read</span>
              </span>
            </>
          )}
          {note?.version && (
            <span className="ml-auto text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-400 font-bold">
              v{note.version}
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {topic.title}
        </h1>
      </div>

      {loading ? (
        <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
          Loading topic notes, formulas and step-by-step examples...
        </div>
      ) : (
        <>
          {/* Multi-Note / Study Resources Switcher */}
          {allNotes.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-500 shrink-0">Topic Notes ({allNotes.length}):</span>
              {allNotes.map((n, idx) => {
                const isDoc = !!(n.documentFile || n.documentUrl);
                const isVid = !!(n.videoFile || n.videoUrl);
                const isAud = !!(n.audioFile || n.audioUrl);
                const isImg = !!(n.imageFile || n.imageUrl || (n.diagramUrl && !n.diagramUrl.startsWith('data:image/svg+xml')));
                let iconLabel = '📝';
                if (isDoc) iconLabel = '📄';
                else if (isVid) iconLabel = '🎥';
                else if (isAud) iconLabel = '🎧';
                else if (isImg) iconLabel = '🖼️';

                return (
                  <button
                    key={n.id || idx}
                    type="button"
                    onClick={() => {
                      setSelectedNoteIndex(idx);
                      setNote(n);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                      selectedNoteIndex === idx
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{iconLabel}</span>
                    <span>{n.title}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* SECTION 1: TOPIC TEXTBOOK STUDY NOTES */}
          {note ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                    Official Syllabus Study Notes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TextToSpeechButton
                    text={`${note.title}. ${note.content}`}
                    label="Read Notes Aloud"
                    size="sm"
                    variant="pill"
                  />
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 hidden sm:inline">
                    Updated: {note.updatedAt}
                  </span>
                </div>
              </div>

              {/* Exact Textbook Layout Matching Syllabus Standard */}
              <TextbookNoteView
                note={note}
                subjectName={subjectName}
                onAskAssist={onAskAssist}
                onOpenQuiz={relatedQuiz && onStartQuiz ? () => onStartQuiz(relatedQuiz) : undefined}
              />

              {/* Uploaded Note Media & Attachments Section */}
              {(note.documentFile?.dataUrl || note.documentUrl || note.imageFile?.dataUrl || note.imageUrl || note.diagramUrl || note.audioFile?.dataUrl || note.audioUrl || note.videoFile?.dataUrl || note.videoUrl) && (
                <div className="pt-6 border-t border-neutral-100 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    Attached Media & Resources
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    {/* Audio Lecture */}
                    {(note.audioFile?.dataUrl || note.audioUrl) && (
                      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                            <Music className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            {note.audioTitle || note.audioFile?.name || 'Voice Lecture & Audio Explanation'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleLaunchScreenOffAudio(note.audioFile?.dataUrl || note.audioUrl || '', note.audioTitle)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-900 dark:bg-neutral-800 text-emerald-300 hover:bg-neutral-800 border border-neutral-700 text-[10px] font-bold shadow-xs transition"
                              title="Turn screen black to save 90% battery while listening"
                            >
                              <Moon className="w-3 h-3 text-emerald-400" />
                              <span>Screen-Off Audio Mode</span>
                            </button>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold">Audio Lesson</span>
                          </div>
                        </div>
                        <audio
                          controls
                          className="w-full h-10 rounded-xl"
                          src={note.audioFile?.dataUrl || note.audioUrl}
                        />
                      </div>
                    )}

                    {/* Video Demonstration */}
                    {(note.videoFile?.dataUrl || note.videoUrl) && (
                      <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-red-900 flex items-center gap-1.5">
                            <Video className="w-4 h-4 text-red-600" />
                            {note.videoTitle || note.videoFile?.name || 'Video Demonstration Lesson'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold">Video Lesson</span>
                        </div>
                        <div className="rounded-xl overflow-hidden bg-black flex justify-center">
                          {getEmbedVideoUrl(note.videoUrl) ? (
                            <iframe
                              src={getEmbedVideoUrl(note.videoUrl)!}
                              title={note.videoTitle || 'Video Lesson'}
                              className="w-full h-72 rounded-xl"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              controls
                              className="max-h-72 w-full object-contain"
                              src={note.videoFile?.dataUrl || note.videoUrl}
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Scientific Diagram / Image */}
                    {(note.imageFile?.dataUrl || note.imageUrl || (note.diagramUrl && !note.diagramUrl.startsWith('data:image/svg+xml'))) && (
                      <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-900 flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-purple-600" />
                            {note.diagramCaption || note.imageFile?.caption || note.imageFile?.name || 'Syllabus Diagram / Scientific Illustration'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">Diagram</span>
                        </div>
                        <div className="rounded-xl overflow-hidden bg-white p-2 border border-purple-100 flex justify-center">
                          <img
                            src={note.imageFile?.dataUrl || note.imageUrl || note.diagramUrl}
                            alt={note.diagramCaption || 'Diagram'}
                            className="max-h-72 w-auto object-contain rounded-lg shadow-2xs"
                          />
                        </div>
                        {(note.diagramCaption || note.imageFile?.caption) && (
                          <p className="text-[11px] text-purple-800 italic text-center">
                            {note.diagramCaption || note.imageFile?.caption}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Document / PDF Attachment */}
                    {(note.documentFile?.dataUrl || note.documentUrl) && (
                      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <File className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-emerald-950 dark:text-emerald-200 block">
                              {note.documentName || note.documentFile?.name || 'Attached Syllabus Resource Document'}
                            </span>
                            <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                              Uploaded Study Reference File
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={note.documentFile?.dataUrl || note.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-1.5 shadow-2xs transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open Document</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border border-emerald-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
                    Topic Summary & Overview
                  </h2>
                </div>
                <TextToSpeechButton
                  text={`${topic.title}. Overview: ${topic.summary}. Key concepts include: ${(topic.keyConcepts || []).join(', ')}`}
                  label="Listen"
                  size="sm"
                />
              </div>
              <p className="text-sm text-neutral-800 leading-relaxed font-medium">
                {topic.summary}
              </p>
            </div>
          )}

          {/* SECTION 3: WORKED EXAMPLES */}
          {note?.workedExamples && note.workedExamples.length > 0 && (
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  3. Worked Examples ({note.workedExamples.length})
                </h2>
              </div>

              <div className="space-y-4">
                {note.workedExamples.map((example) => (
                  <div
                    key={example.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {example.title}
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                        Exam Model Solution
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium text-xs text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
                      <strong className="text-emerald-800 dark:text-emerald-400">Problem:</strong> {example.problem}
                    </div>

                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                        Derivation & Solution:
                      </span>
                      {example.stepByStepSolution.map((step) => (
                        <div
                          key={step.step}
                          className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {step.step}
                          </span>
                          <span className="leading-relaxed">{step.explanation}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-950 dark:text-emerald-200">Final Answer:</span>
                      <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                        {example.finalAnswer}
                      </span>
                    </div>

                    {example.keyTakeaway && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        💡 <strong className="text-slate-700 dark:text-slate-300">Examiner Note:</strong> {example.keyTakeaway}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: PRACTICE QUESTIONS */}
          {questions.length > 0 && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <h2 className="text-sm font-black text-slate-900 dark:text-white">
                    4. Check Understanding: Practice Questions
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-800 whitespace-nowrap">
                  +{questions.reduce((a, b) => a + b.points, 0)} Pts Total
                </span>
              </div>

              <div className="space-y-4">
                {questions.map((q, qIndex) => {
                  const selected = selectedAnswers[q.id];
                  const isRevealed = revealedExplanations[q.id];

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                          Q{qIndex + 1}. {q.question}
                        </h3>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 shrink-0">
                          {q.difficulty}
                        </span>
                      </div>

                      {/* Options */}
                      <div className="space-y-1.5">
                        {q.options.map((opt, optIndex) => {
                          const isPicked = selected === optIndex;
                          const isCorrect = optIndex === q.correctAnswerIndex;

                          let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';
                          if (isRevealed) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                            } else if (isPicked && !isCorrect) {
                              btnStyle = 'bg-red-50 dark:bg-red-950/80 border-red-400 text-red-900 dark:text-red-200 font-medium';
                            }
                          }

                          return (
                            <button
                              key={optIndex}
                              type="button"
                              onClick={() => handleSelectAnswer(q.id, optIndex, q)}
                              className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {isRevealed && isCorrect && (
                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation if answered */}
                      {isRevealed && (
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-900 dark:text-emerald-200">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 5: QUIZ LAUNCHER CALLOUT */}
          {relatedQuiz && onStartQuiz && (
            <div className="p-5 rounded-3xl bg-emerald-950 border border-emerald-800/80 text-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                  Ready for Assessment?
                </span>
                <h3 className="text-base font-extrabold mt-0.5">{relatedQuiz.title}</h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  {relatedQuiz.questions.length} questions • {relatedQuiz.timeLimitMinutes} min limit • Earn {relatedQuiz.pointsAwarded} points!
                </p>
              </div>

              <button
                type="button"
                onClick={() => onStartQuiz(relatedQuiz)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black shadow-md transition-colors shrink-0"
              >
                Launch Assessment Quiz
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
