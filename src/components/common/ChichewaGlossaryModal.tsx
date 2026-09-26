import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Volume2,
  X,
  Globe,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export interface GlossaryTerm {
  english: string;
  chichewa: string;
  subject: 'Biology' | 'Physics' | 'Chemistry' | 'Physical Science' | 'Mathematics' | 'Geography' | 'Civics / History';
  englishDefinition: string;
  chichewaDefinition: string;
  example: string;
}

interface ChichewaGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearch?: string;
}

export const CHICHEWA_GLOSSARY: GlossaryTerm[] = [
  {
    english: 'Photosynthesis',
    chichewa: 'Kupanga chakudya kwa zomera',
    subject: 'Biology',
    englishDefinition: 'The process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of sugar.',
    chichewaDefinition: 'Njira imene mitengo ndi zomera zobiriwira zimagwiritsira ntchito kuwala kwa dzuwa, madzi ndi mpweya wa carbon dioxide popanga chakudya (shuga) ndi mpweya wa oxygen.',
    example: '6CO₂ + 6H₂O —(Dzuwa & Chlorophyll)→ C₆H₁₂O₆ + 6O₂'
  },
  {
    english: 'Osmosis',
    chichewa: 'Kayendedwe ka madzi kudzera mu khungu lopyapyala',
    subject: 'Biology',
    englishDefinition: 'The movement of water molecules from a solution with a high concentration of water molecules to a solution with a lower concentration of water molecules, through a cell’s partially permeable membrane.',
    chichewaDefinition: 'Mmene madzi amayendera kuchoka pomwe pali madzi ambiri kupita pomwe pali ochepa kudzera mu khungu lapadera limene limalola zinthu zina zokha kudutsa.',
    example: 'Mitsempha ya zomera ikamamwa madzi m’nthaka.'
  },
  {
    english: 'Diffusion',
    chichewa: 'Kufalikira kwa tinthu ting’onoting’ono',
    subject: 'Chemistry',
    englishDefinition: 'The net movement of anything generally from a region of higher concentration to a region of lower concentration.',
    chichewaDefinition: 'Kufalikira kwa tinthu (mpweya kapena madzi) kuchoka pamalo pamene pali tinthu tochuluka kwambiri kupita pamalo pamene pali tochepa mpaka ponse pafanane.',
    example: 'Fungo la mankhwala kapena mafuta onunkhira likafalikira m’chipinda chonse.'
  },
  {
    english: 'Gravity / Acceleration due to gravity',
    chichewa: 'Mphamvu yokoka ya dziko lapansi',
    subject: 'Physics',
    englishDefinition: 'The universal force of attraction acting between all matter, causing unsupported objects to fall towards the center of the Earth at 9.8 m/s².',
    chichewaDefinition: 'Mphamvu imene dziko lapansi lili nayo yokokera zinthu zonse pansi kuti zisayandame m’mlengalenga (Liwiro lake ndi 9.8 m/s²).',
    example: 'Chipatso cha mango chikagwera pansi kuchoka pamtengo.'
  },
  {
    english: 'Respiration',
    chichewa: 'Kutulutsa mphamvu m’chakudya m’thupi',
    subject: 'Biology',
    englishDefinition: 'The chemical process in which food (glucose) is broken down inside living cells to release usable biological energy (ATP).',
    chichewaDefinition: 'Mmene maselo a m’thupi amatengera chakudya chimene tinadya ndi mpweya wa oxygen n’kupangamo mphamvu zotithandiza kuyenda, kuthamanga ndi kugwira ntchito.',
    example: 'Kupuma mpweya wabwino n’cholinga choti thupi lipeze mphamvu.'
  },
  {
    english: 'Ohm’s Law',
    chichewa: 'Lamulo la kayendedwe ka magetsi',
    subject: 'Physics',
    englishDefinition: 'A law stating that electric current is directly proportional to voltage and inversely proportional to resistance (V = IR).',
    chichewaDefinition: 'Lamulo limene limalongosola kuti magetsi oyenda amadalira mphamvu ya batire (voltage) komanso zotchinga (resistance).',
    example: 'V = I × R (Mphamvu ya batire = Magetsi oyenda × Zotchinga).'
  },
  {
    english: 'Ecosystem',
    chichewa: 'Malo okhala ndi kudalirana kwa zamoyo',
    subject: 'Biology',
    englishDefinition: 'A biological community of interacting organisms and their physical non-living environment.',
    chichewaDefinition: 'Ubale ndi kudalirana kwa zamoyo (monga nyama, mitengo, tizilombo) pamodzi ndi zinthu zopanda moyo (monga madzi, miyala, dothi, dzuwa) m’malo amodzi.',
    example: 'Nyanja ya Malawi pamodzi ndi nsomba, madzi ndi zomera zam’madzi.'
  },
  {
    english: 'Evaporation',
    chichewa: 'Kusanduka nthunzi kwa madzi',
    subject: 'Geography',
    englishDefinition: 'The process of a liquid turning into vapor/gas due to heat energy.',
    chichewaDefinition: 'Kusanduka nthunzi kwa madzi chifukwa cha kutentha kwa dzuwa kapena moto.',
    example: 'Madzi akamawira pa moto n’kusanduka nthunzi kapena zovala zikawuma padzuwa.'
  },
  {
    english: 'Condensation',
    chichewa: 'Kusanduka madzi kwa nthunzi',
    subject: 'Geography',
    englishDefinition: 'The conversion of a vapor or gas to a liquid when cooled down.',
    chichewaDefinition: 'Nthunzi ikakumana ndi malo ozizira n’kusandukanso madzi (monga momwe mitambo imapangira mvula).',
    example: 'Madontho a madzi amene amapangika panja pa botolo la madzi ozizira.'
  },
  {
    english: 'Democracy & Governance',
    chichewa: 'Ulamuliro wa anthu ndi ufulu',
    subject: 'Civics / History',
    englishDefinition: 'A system of government by the whole population, typically through elected representatives with respect for human rights.',
    chichewaDefinition: 'Ulamuliro umene nzika za dziko zimasankha okha atsogoleri awo kudzera mu mavoti a ufulu ndi chilungamo, ndi kulemekeza ufulu wachibadwidwe wa aliyense.',
    example: 'Mavoti a 1994 ku Malawi pamene tinalowa mu ulamuliro wa zipani zambiri.'
  }
];

export const ChichewaGlossaryModal: React.FC<ChichewaGlossaryModalProps> = ({
  isOpen,
  onClose,
  initialSearch = ''
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const { speak, isSpeaking, stopSpeech } = useAccessibility();

  if (!isOpen) return null;

  const filtered = CHICHEWA_GLOSSARY.filter((term) => {
    const matchesSearch =
      term.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.chichewa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.englishDefinition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || term.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      speak(text);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 flex flex-col overflow-hidden text-white max-h-[88vh]">
        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                🇲🇼 Bilingual Chichewa Concept Dictionary
              </h3>
              <p className="text-[11px] text-neutral-400">
                Understand difficult MANEB science & math jargon in clear Chichewa
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

        {/* Search & Subject Bar */}
        <div className="p-3 bg-neutral-950/90 border-b border-neutral-800 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Fufuzani mawu (e.g. Photosynthesis, Osmosis, Gravity, Ecosystem)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold">
            {['All', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Geography', 'Civics / History'].map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1 rounded-lg shrink-0 transition ${
                  selectedSubject === sub
                    ? 'bg-teal-600 text-white font-bold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Terms List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-teal-500/50 space-y-2.5 transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-teal-400">{item.english}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                        {item.subject}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-amber-300 mt-0.5">
                      🇲🇼 Chichewa: {item.chichewa}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSpeak(`${item.english}. In Chichewa: ${item.chichewa}. ${item.englishDefinition}`)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition shrink-0"
                    title="Listen to pronunciation & definition"
                  >
                    <Volume2 className="w-4 h-4 text-teal-400" />
                  </button>
                </div>

                {/* English Definition */}
                <div className="text-xs text-neutral-300 leading-relaxed pl-2 border-l-2 border-teal-500/40">
                  <span className="font-bold text-neutral-400">English Definition: </span>
                  {item.englishDefinition}
                </div>

                {/* Chichewa Explanation */}
                <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/40 text-xs text-teal-200 leading-relaxed font-medium">
                  <span className="font-bold text-teal-300 block mb-0.5">Tanthauzo m’Chichewa:</span>
                  {item.chichewaDefinition}
                </div>

                {/* Example */}
                {item.example && (
                  <div className="text-[11px] text-neutral-400 font-mono bg-neutral-900 p-2 rounded-lg">
                    <span className="text-neutral-500">Chitsanzo: </span>
                    {item.example}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-neutral-400 space-y-2">
              <HelpCircle className="w-8 h-8 mx-auto text-neutral-600" />
              <p className="text-xs">Palibe mawu opezeka pa kufufuza kwanu.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('All');
                }}
                className="text-xs text-teal-400 font-bold underline"
              >
                Onetsani mawu onse
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>{filtered.length} terms in offline bilingual vocabulary</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
