import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ArrowRight,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { Quiz, Badge } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { TextToSpeechButton } from '../common/TextToSpeechButton';

interface QuizPlayerProps {
  quiz: Quiz;
  onClose: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onClose }) => {
  const { user, triggerCelebration, refreshUser } = useAuth();

  // Total time limit in seconds
  const totalSeconds = quiz.timeLimitMinutes * 60;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(totalSeconds);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Result state
  const [submissionResult, setSubmissionResult] = useState<{
    scorePercentage: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    pointsEarned: number;
    alreadyAwarded: boolean;
    newBadges: Badge[];
    results: any[];
  } | null>(null);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const currentQ = quiz.questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmitQuiz = async () => {
    if (submitting || isSubmitted) return;
    setSubmitting(true);

    try {
      const res = await api.submitQuiz({
        quizId: quiz.id,
        answers,
        userId: user?.id
      });

      setSubmissionResult(res);
      setIsSubmitted(true);

      if (res.passed) {
        triggerCelebration(`Quiz Passed: ${res.scorePercentage}%!`);
      }
      if (res.pointsEarned > 0) {
        await refreshUser();
      }
    } catch (e) {
      console.warn('Quiz submission error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 dark:border-slate-800 flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-emerald-950 border-b border-emerald-900/60 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                {quiz.form} • Interactive Assessment
              </span>
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight line-clamp-1">
                {quiz.title}
              </h2>
            </div>
          </div>

          {!isSubmitted && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono font-bold text-amber-300">
              <Timer className="w-4 h-4 text-amber-400" />
              <span>{formattedTime}</span>
            </div>
          )}
        </div>

        {/* Quiz Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {!isSubmitted ? (
            <>
              {/* Question Progress Tracker */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-neutral-500 dark:text-slate-400 mb-2">
                  <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">
                    {answers.filter((a) => a !== -1).length} answered
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / quiz.questions.length) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-slate-800/80 border border-neutral-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-slate-400">
                    Difficulty: {currentQ.difficulty} • Points: {currentQ.points}
                  </span>
                  <TextToSpeechButton
                    id={`quiz-q-${currentQ.id || currentIndex}`}
                    text={`Question ${currentIndex + 1}: ${currentQ.question}. Options: ${currentQ.options.map((opt, i) => `Option ${String.fromCharCode(65 + i)}: ${opt}`).join('. ')}`}
                    label="Read Question"
                    size="sm"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = answers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 shadow-xs'
                          : 'border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-neutral-300 dark:hover:border-slate-600 text-neutral-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                            isSelected ? 'bg-emerald-700 text-white' : 'bg-neutral-100 dark:bg-slate-700 text-neutral-600 dark:text-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* RESULTS SCREEN */
            <div className="space-y-5">
              <div className="text-center p-6 rounded-3xl bg-gradient-to-b from-emerald-50 via-white to-neutral-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-emerald-200/80 dark:border-slate-800 shadow-xs space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-2xl mx-auto shadow-xs">
                  {submissionResult?.passed ? '🏆' : '📚'}
                </div>

                <div>
                  <h3 className="text-xl font-black text-neutral-900 dark:text-white">
                    {submissionResult?.passed ? 'Quiz Passed with Distinction!' : 'Keep Practicing!'}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
                    You answered {submissionResult?.correctCount} out of {submissionResult?.totalQuestions} questions correctly.
                  </p>
                </div>

                {/* Score Big Indicator */}
                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-center min-w-[100px] shadow-2xs">
                    <span className="text-[10px] font-bold text-neutral-400 dark:text-slate-400 block uppercase">
                      Final Score
                    </span>
                    <span className="text-2xl font-black text-neutral-900 dark:text-white">
                      {submissionResult?.scorePercentage}%
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-700 text-white text-center min-w-[120px] shadow-xs">
                    <span className="text-[10px] font-bold text-emerald-200 block uppercase">
                      Points Awarded
                    </span>
                    <span className="text-2xl font-black flex items-center justify-center gap-1">
                      <Award className="w-5 h-5 text-amber-300" />
                      +{submissionResult?.pointsEarned}
                    </span>
                  </div>
                </div>

                {submissionResult?.alreadyAwarded && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200 dark:border-amber-800">
                    * You already earned qualifying points for this quiz previously. Keep studying to maintain your weekly leaderboard rank!
                  </p>
                )}

                {/* New Badges Earned */}
                {submissionResult?.newBadges && submissionResult.newBadges.length > 0 && (
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left">
                    <span className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                      <Award className="w-4 h-4 text-amber-600" />
                      New Badge Unlocked!
                    </span>
                    {submissionResult.newBadges.map((b) => (
                      <div key={b.id} className="flex items-center gap-2 text-xs font-bold text-amber-950 dark:text-amber-200">
                        <span className="text-lg">{b.icon}</span>
                        <span>{b.name} — +{b.pointsReward} bonus points</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Question Explanations */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-neutral-800 dark:text-slate-200 uppercase tracking-wider">
                  Detailed Answer Review & Solutions:
                </h4>

                {quiz.questions.map((q, idx) => {
                  const studentAns = answers[idx];
                  const isCorrect = studentAns === q.correctAnswerIndex;

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-neutral-200 dark:border-slate-700 text-xs space-y-2 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-neutral-900 dark:text-white">
                          Q{idx + 1}. {q.question}
                        </span>
                        {isCorrect ? (
                          <span className="text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="text-red-700 dark:text-red-300 font-extrabold flex items-center gap-1 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full shrink-0">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>

                      <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-slate-900 text-neutral-700 dark:text-slate-300">
                        <strong>Correct Answer:</strong> {q.options[q.correctAnswerIndex]}
                      </div>

                      <p className="text-[11px] text-neutral-500 dark:text-slate-400 leading-relaxed">
                        💡 <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-neutral-200/80 dark:border-slate-800 bg-neutral-50 dark:bg-slate-900 flex items-center justify-between">
          {!isSubmitted ? (
            <>
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((p) => p - 1)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-neutral-100 dark:hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-neutral-700 dark:text-slate-200 border border-neutral-200 dark:border-slate-700 transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentIndex < quiz.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((p) => p + 1)}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmitQuiz}
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-black shadow-md flex items-center gap-1.5"
                  >
                    <span>{submitting ? 'Submitting...' : 'Submit Assessment'}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md transition-colors"
            >
              Return to Subject Topics
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
