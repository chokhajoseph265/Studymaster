import React, { useState } from 'react';
import {
  RotateCw,
  Volume2,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Award,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  chichewaHint?: string;
  category: string;
  subject: string;
  form: string;
}

interface FlashcardDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle?: string;
  subjectName?: string;
  customCards?: Flashcard[];
}

export const FlashcardDeckModal: React.FC<FlashcardDeckModalProps> = ({
  isOpen,
  onClose,
  topicTitle = 'Key Definitions & Formulas',
  subjectName = 'Physics, Chemistry & Biology',
  customCards
}) => {
  const { user, triggerCelebration, awardPoints } = useAuth();
  const { speak, isSpeaking, stopSpeech } = useAccessibility();

  const defaultCards: Flashcard[] = [
    {
      id: 'fc-1',
      front: 'Define: Photosynthesis',
      back: 'The biochemical process by which green plants synthesize glucose from carbon dioxide and water using sunlight energy absorbed by chlorophyll.',
      chichewaHint: 'Kupanga chakudya kwa zomera pogwiritsa ntchito kuwala kwa dzuwa ndi madzi.',
      category: 'Biology',
      subject: 'Biology',
      form: 'Form 3'
    },
    {
      id: 'fc-2',
      front: "State Newton's Second Law of Motion",
      back: 'The rate of change of momentum of a body is directly proportional to the applied resultant force and takes place in the direction of the force (F = ma).',
      chichewaHint: 'Mphamvu yoyendetsa chinthu imadalira kulemera kwake komanso liwiro limene chikuyendera.',
      category: 'Physics',
      subject: 'Physics',
      form: 'Form 4'
    },
    {
      id: 'fc-3',
      front: 'Define: Osmosis',
      back: 'The net movement of water molecules from a region of higher water potential (dilute) to a region of lower water potential (concentrated) across a selectively permeable membrane.',
      chichewaHint: 'Kayendedwe ka madzi kuchoka pomwe pali ambiri kupita pomwe pali ochepa kudzera mu khungu lopyapyala.',
      category: 'Biology',
      subject: 'Biology',
      form: 'Form 2'
    },
    {
      id: 'fc-4',
      front: 'What was the significance of the 1915 Chilembwe Uprising?',
      back: 'Led by John Chilembwe, it was the first armed African anti-colonial revolt against British colonial forced labor (Thangata) and recruitment of Malawian soldiers into World War I.',
      chichewaHint: 'Kukana nkhanza za azungu za Thangata komanso nkhondo ya 1915 motsogozedwa ndi John Chilembwe.',
      category: 'History',
      subject: 'History',
      form: 'Form 4'
    },
    {
      id: 'fc-5',
      front: "State Ohm's Law",
      back: 'The current flowing through a metallic conductor is directly proportional to the potential difference across its ends, provided physical conditions such as temperature remain constant (V = IR).',
      chichewaHint: 'Magetsi oyenda mu waya amakhala ofanana ndi mphamvu ya batire pokhapokha kutentha kusasinthe.',
      category: 'Physics',
      subject: 'Physics',
      form: 'Form 3'
    },
    {
      id: 'fc-6',
      front: 'Define: Ecosystem',
      back: 'A dynamic community of living organisms (biotic) interacting with one another and with the non-living (abiotic) physical environment in a defined area.',
      chichewaHint: 'Malo okhala zamoyo ndi zinthu zopanda moyo zimene zimadalirana pamodzi monga nkhalango kapena nyanja.',
      category: 'Biology',
      subject: 'Biology',
      form: 'Form 1'
    }
  ];

  const cards = customCards && customCards.length > 0 ? customCards : defaultCards;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showChichewa, setShowChichewa] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [reviewIds, setReviewIds] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      const textToRead = isFlipped ? currentCard.back : currentCard.front;
      speak(textToRead);
    }
  };

  const handleResponse = (level: 'again' | 'good' | 'mastered') => {
    if (level === 'mastered') {
      setMasteredIds((prev) => Array.from(new Set([...prev, currentCard.id])));
    } else if (level === 'again') {
      setReviewIds((prev) => Array.from(new Set([...prev, currentCard.id])));
    }

    setIsFlipped(false);
    setShowChichewa(false);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      // Award study points if not already done
      if (awardPoints) {
        awardPoints(15, `Completed ${topicTitle} Flashcards Deck`);
      }
      triggerCelebration('Flashcard Drill Complete! +15 Knowledge Points');
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowChichewa(false);
    setMasteredIds([]);
    setReviewIds([]);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 flex flex-col overflow-hidden text-white min-h-[500px]">
        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">{topicTitle}</h3>
              <p className="text-[11px] text-neutral-400">
                {subjectName} • Spaced Repetition Memory Drill
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          {!isFinished ? (
            <>
              {/* Progress and status */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono font-bold">
                    Card {currentIndex + 1} of {cards.length}
                  </span>
                  <span className="text-[11px] text-neutral-400">{currentCard.category}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <span>{masteredIds.length} Mastered</span>
                </div>
              </div>

              {/* 3D Flip Card Container */}
              <div
                onClick={handleFlip}
                className="w-full h-64 rounded-3xl bg-neutral-950 border border-neutral-800 p-6 flex flex-col justify-between cursor-pointer hover:border-amber-500/50 transition-all shadow-inner relative select-none group"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                    {isFlipped ? 'Answer & Explanation' : 'Prompt / Concept'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeech();
                    }}
                    className={`p-1.5 rounded-full ${
                      isSpeaking ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-300'
                    }`}
                    title="Read aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Main Card Text */}
                <div className="flex-1 flex items-center justify-center text-center my-auto px-2">
                  <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    {isFlipped ? currentCard.back : currentCard.front}
                  </p>
                </div>

                {/* Chichewa Hint if available */}
                {currentCard.chichewaHint && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowChichewa(!showChichewa);
                    }}
                    className="pt-2 border-t border-neutral-800/80 text-left"
                  >
                    <div className="text-[10px] font-bold text-teal-400 flex items-center gap-1 cursor-pointer">
                      <span>🇲🇼 {showChichewa ? 'Tanthauzo m’Chichewa:' : 'Onani m’Chichewa (Chichewa Hint)'}</span>
                    </div>
                    {showChichewa && (
                      <p className="text-xs text-teal-200 mt-1 font-medium italic bg-teal-950/40 p-2 rounded-xl border border-teal-800/40">
                        {currentCard.chichewaHint}
                      </p>
                    )}
                  </div>
                )}

                <div className="text-center text-[10px] text-neutral-500 font-mono">
                  {isFlipped ? 'Tap to see prompt' : 'Tap card to reveal answer'}
                </div>
              </div>

              {/* Leitner Rating Controls */}
              <div className="space-y-2">
                <div className="text-center text-[11px] text-neutral-400 font-medium">
                  Rate how well you knew this concept:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleResponse('again')}
                    className="p-3 rounded-2xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs flex flex-col items-center gap-1 transition"
                  >
                    <RotateCw className="w-4 h-4 text-rose-400" />
                    <span>Again (Need Review)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResponse('good')}
                    className="p-3 rounded-2xl bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-300 font-bold text-xs flex flex-col items-center gap-1 transition"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Good (Getting There)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResponse('mastered')}
                    className="p-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold text-xs flex flex-col items-center gap-1 transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Mastered (Memorized!)</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Drill Complete Summary */
            <div className="p-6 text-center space-y-4 my-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Spaced Memory Drill Complete!</h3>
                <p className="text-xs text-neutral-300 mt-1 max-w-sm mx-auto">
                  You reviewed all {cards.length} key concepts. Regular spaced retrieval cements MANEB exam formulas permanently in your memory.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 grid grid-cols-2 gap-3 text-left">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Mastered Concepts</span>
                  <span className="text-lg font-black text-emerald-400">{masteredIds.length} / {cards.length}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Points Earned</span>
                  <span className="text-lg font-black text-amber-400">+15 Points</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition"
                >
                  Practice Again
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs"
                >
                  Return to Study
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
