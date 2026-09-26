import React, { useState } from 'react';
import {
  FileCode2,
  CheckCircle2,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FormLevel } from '../../types';

export interface StructuredQuestion {
  id: string;
  subject: string;
  form: FormLevel;
  paper: string; // e.g. 'MSCE Paper 2 (Theory & Calculations)'
  questionText: string;
  totalMarks: number;
  parts: {
    partLabel: string;
    prompt: string;
    marks: number;
    modelSteps: {
      stepNumber: number;
      description: string;
      markType: 'M1 (Method Formula)' | 'A1 (Accuracy)' | 'B1 (Fact/Unit)';
      markValue: number;
    }[];
    examinerWarning: string;
  }[];
}

const SAMPLE_STRUCTURED_QUESTIONS: StructuredQuestion[] = [
  {
    id: 'struct-1',
    subject: 'Physics',
    form: 'Form 4',
    paper: 'MSCE Physics Paper 1',
    questionText: 'A car of mass 1200 kg travelling at a constant velocity of 20 m/s accelerates uniformly to 30 m/s in a time of 5 seconds.',
    totalMarks: 6,
    parts: [
      {
        partLabel: '(a)',
        prompt: 'Calculate the acceleration of the car. [2 marks]',
        marks: 2,
        modelSteps: [
          {
            stepNumber: 1,
            description: 'State formula: a = (v - u) / t',
            markType: 'M1 (Method Formula)',
            markValue: 1
          },
          {
            stepNumber: 2,
            description: 'Substitution & Answer: a = (30 - 20) / 5 = 2 m/s²',
            markType: 'A1 (Accuracy)',
            markValue: 1
          }
        ],
        examinerWarning: 'Deduct 1 mark if unit (m/s² or ms⁻²) is omitted.'
      },
      {
        partLabel: '(b)',
        prompt: 'Calculate the resultant force acting on the car during this acceleration. [2 marks]',
        marks: 2,
        modelSteps: [
          {
            stepNumber: 1,
            description: 'State Newton’s 2nd Law formula: F = m × a',
            markType: 'M1 (Method Formula)',
            markValue: 1
          },
          {
            stepNumber: 2,
            description: 'Substitution & Answer: F = 1200 kg × 2 m/s² = 2400 N',
            markType: 'A1 (Accuracy)',
            markValue: 1
          }
        ],
        examinerWarning: 'Final answer must include Newtons (N).'
      },
      {
        partLabel: '(c)',
        prompt: 'Calculate the work done by the engine during this 5-second period. [2 marks]',
        marks: 2,
        modelSteps: [
          {
            stepNumber: 1,
            description: 'Find distance: s = ut + ½at² = (20×5) + ½(2)(5)² = 100 + 25 = 125 m',
            markType: 'M1 (Method Formula)',
            markValue: 1
          },
          {
            stepNumber: 2,
            description: 'Work W = F × s = 2400 N × 125 m = 300,000 J (or 300 kJ)',
            markType: 'A1 (Accuracy)',
            markValue: 1
          }
        ],
        examinerWarning: 'Alternative method using change in kinetic energy ½m(v² - u²) is awarded full marks.'
      }
    ]
  },
  {
    id: 'struct-2',
    subject: 'Mathematics',
    form: 'Form 4',
    paper: 'MSCE Mathematics Paper 2',
    questionText: 'The 3rd term of an Arithmetic Progression (AP) is 14 and the 9th term is 38.',
    totalMarks: 5,
    parts: [
      {
        partLabel: '(a)',
        prompt: 'Form two simultaneous linear equations for the terms. [2 marks]',
        marks: 2,
        modelSteps: [
          {
            stepNumber: 1,
            description: 'T₃ = a + 2d = 14',
            markType: 'M1 (Method Formula)',
            markValue: 1
          },
          {
            stepNumber: 2,
            description: 'T₉ = a + 8d = 38',
            markType: 'A1 (Accuracy)',
            markValue: 1
          }
        ],
        examinerWarning: 'Both equations must be simplified in terms of a and d.'
      },
      {
        partLabel: '(b)',
        prompt: 'Find the first term (a) and common difference (d). [3 marks]',
        marks: 3,
        modelSteps: [
          {
            stepNumber: 1,
            description: 'Subtracting equations: 6d = 24 => d = 4',
            markType: 'M1 (Method Formula)',
            markValue: 1
          },
          {
            stepNumber: 2,
            description: 'Substitute d into T₃: a + 2(4) = 14 => a = 6',
            markType: 'A1 (Accuracy)',
            markValue: 1
          },
          {
            stepNumber: 3,
            description: 'Final values: First term a = 6, Common difference d = 4',
            markType: 'B1 (Fact/Unit)',
            markValue: 1
          }
        ],
        examinerWarning: 'Candidates who guess without showing algebraic elimination lose method marks.'
      }
    ]
  }
];

interface StructuredTheorySandboxProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeForm?: FormLevel;
}

export const StructuredTheorySandbox: React.FC<StructuredTheorySandboxProps> = ({ isOpen = true, onClose, activeForm }) => {
  const { user, awardPoints, triggerCelebration } = useAuth();
  if (isOpen === false) return null;
  const [selectedQIndex, setSelectedQIndex] = useState<number>(0);
  const [studentAnswers, setStudentAnswers] = useState<{ [key: string]: string }>({});
  const [revealedParts, setRevealedParts] = useState<{ [key: string]: boolean }>({});
  const [checkedSteps, setCheckedSteps] = useState<{ [key: string]: boolean }>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = SAMPLE_STRUCTURED_QUESTIONS[selectedQIndex];

  const handleTextChange = (key: string, val: string) => {
    setStudentAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const toggleReveal = (key: string) => {
    setRevealedParts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCheckStep = (stepKey: string) => {
    setCheckedSteps((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  const handleFinishGrading = () => {
    setIsCompleted(true);
    if (awardPoints) {
      awardPoints(20, `Completed Structured Paper 2 Practice for ${currentQ.subject}`);
    }
    triggerCelebration('Structured Exam Practice Complete! +20 Points');
  };

  // Calculate self-scored marks
  let earnedMarks = 0;
  currentQ.parts.forEach((part, pIdx) => {
    part.modelSteps.forEach((st, sIdx) => {
      const key = `${selectedQIndex}-${pIdx}-${sIdx}`;
      if (checkedSteps[key]) {
        earnedMarks += st.markValue;
      }
    });
  });

  return (
    <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 text-white space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <FileCode2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>MANEB Paper 2 Structured Theory Sandbox</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30">
                Method Marks (M1, A1, B1)
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400">
              Practice calculation steps and self-grade using official MANEB rubrics
            </p>
          </div>
        </div>

        {/* Question Selector */}
        <div className="flex gap-1.5">
          {SAMPLE_STRUCTURED_QUESTIONS.map((q, idx) => (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setSelectedQIndex(idx);
                setIsCompleted(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedQIndex === idx
                  ? 'bg-amber-500 text-neutral-950 shadow-xs'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              Q{idx + 1}: {q.subject.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Box */}
      <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-amber-400 font-bold uppercase">{currentQ.paper}</span>
          <span className="text-neutral-400 font-bold">Total: {currentQ.totalMarks} Marks</span>
        </div>
        <p className="text-sm font-bold text-neutral-200 leading-relaxed">
          {currentQ.questionText}
        </p>
      </div>

      {/* Question Parts */}
      <div className="space-y-4">
        {currentQ.parts.map((part, pIdx) => {
          const partKey = `${selectedQIndex}-${pIdx}`;
          const isRevealed = !!revealedParts[partKey];

          return (
            <div
              key={pIdx}
              className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300">{part.partLabel} {part.prompt}</span>
                <span className="font-mono text-[11px] text-neutral-400">{part.marks} Marks</span>
              </div>

              {/* Student Working Textarea */}
              <div>
                <textarea
                  rows={3}
                  value={studentAnswers[partKey] || ''}
                  onChange={(e) => handleTextChange(partKey, e.target.value)}
                  placeholder="Type your step-by-step working here (e.g. formula used, substitution, units)..."
                  className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Reveal Marking Scheme Toggle */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => toggleReveal(partKey)}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                >
                  {isRevealed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span>{isRevealed ? 'Hide MANEB Marking Rubric' : 'Reveal MANEB Marking Scheme & Method Marks'}</span>
                </button>

                {isRevealed && (
                  <span className="text-[10px] text-neutral-500 italic">
                    Tick the steps you successfully showed in your working:
                  </span>
                )}
              </div>

              {/* Revealed Rubric Steps */}
              {isRevealed && (
                <div className="p-3.5 rounded-xl bg-neutral-900 border border-emerald-900/50 space-y-2.5 animate-in fade-in">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    Official MANEB Rubric Breakdown:
                  </div>

                  <div className="space-y-2">
                    {part.modelSteps.map((step, sIdx) => {
                      const stepKey = `${selectedQIndex}-${pIdx}-${sIdx}`;
                      const isChecked = !!checkedSteps[stepKey];

                      return (
                        <div
                          key={sIdx}
                          onClick={() => toggleCheckStep(stepKey)}
                          className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition select-none ${
                            isChecked
                              ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 rounded text-emerald-500 focus:ring-0"
                          />
                          <div className="flex-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{step.description}</span>
                              <span className="font-mono text-[10px] font-bold text-amber-400 px-1.5 py-0.5 rounded bg-neutral-800">
                                {step.markType} [+{step.markValue}m]
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Examiner Note / Pitfall Warning */}
                  {part.examinerWarning && (
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span><strong>Chief Examiner Note:</strong> {part.examinerWarning}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Grading Tally */}
      <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-mono block">Your Self-Graded Score</span>
            <span className="text-xl font-black text-amber-400">
              {earnedMarks} / {currentQ.totalMarks} Marks
            </span>
          </div>
          {earnedMarks >= currentQ.totalMarks * 0.8 && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Distinction Ready!
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleFinishGrading}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition"
        >
          <Award className="w-4 h-4" />
          <span>Complete & Claim Points (+20 pts)</span>
        </button>
      </div>
    </div>
  );
};
