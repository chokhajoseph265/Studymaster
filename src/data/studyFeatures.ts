import { StudyFeatureMode, EducationLevel } from '../types';

export interface StudyFeature {
  id: StudyFeatureMode;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: 'Core AI Tutoring' | 'Exam & Revision Tools';
  icon: string; // Lucide icon name
  badgeColor: string; // Tailwind color classes
  borderColor: string;
  bgColor: string;
  placeholder: string;
  samplePrompts: {
    primary: string[];
    secondary: string[];
  };
}

export const EDUCATION_LEVELS: {
  id: EducationLevel;
  name: string;
  category: 'Primary School (PSLCE)' | 'Secondary School (JCE & MSCE)';
  examBadge: string;
  shortTag: string;
  description: string;
}[] = [
  {
    id: 'Standard 5',
    name: 'Standard 5 (Std 5)',
    category: 'Primary School (PSLCE)',
    examBadge: 'Primary Foundation',
    shortTag: 'Std 5',
    description: 'Foundation arithmetic, English reading, Science and Agriculture basics.'
  },
  {
    id: 'Standard 6',
    name: 'Standard 6 (Std 6)',
    category: 'Primary School (PSLCE)',
    examBadge: 'Primary Intermediate',
    shortTag: 'Std 6',
    description: 'Fractions, grammar, environmental science, and social studies.'
  },
  {
    id: 'Standard 7',
    name: 'Standard 7 (Std 7)',
    category: 'Primary School (PSLCE)',
    examBadge: 'Upper Primary',
    shortTag: 'Std 7',
    description: 'Decimals, Malawi geography, human body systems, electricity basics.'
  },
  {
    id: 'Standard 8',
    name: 'Standard 8 (Std 8 - PSLCE)',
    category: 'Primary School (PSLCE)',
    examBadge: 'PSLCE National Exam',
    shortTag: 'Std 8 (PSLCE)',
    description: 'PSLCE candidate preparation with past exam pattern mastery.'
  },
  {
    id: 'Form 1',
    name: 'Form 1 (Junior 1)',
    category: 'Secondary School (JCE & MSCE)',
    examBadge: 'Junior Secondary',
    shortTag: 'Form 1',
    description: 'Introduction to secondary sciences, algebra, chemistry, biology and humanities.'
  },
  {
    id: 'Form 2',
    name: 'Form 2 (JCE Exam)',
    category: 'Secondary School (JCE & MSCE)',
    examBadge: 'JCE National Exam',
    shortTag: 'Form 2 (JCE)',
    description: 'MANEB JCE examination syllabus mastery and worked solutions.'
  },
  {
    id: 'Form 3',
    name: 'Form 3 (Senior 3)',
    category: 'Secondary School (JCE & MSCE)',
    examBadge: 'Senior Secondary',
    shortTag: 'Form 3',
    description: 'Advanced mathematics, physics formulas, organic chemistry, and biology.'
  },
  {
    id: 'Form 4',
    name: 'Form 4 (MSCE Exam)',
    category: 'Secondary School (JCE & MSCE)',
    examBadge: 'MSCE National Exam',
    shortTag: 'Form 4 (MSCE)',
    description: 'MSCE graduation examination revision, past papers, and chief examiner tips.'
  }
];

export const STUDY_FEATURES: StudyFeature[] = [
  {
    id: 'ask',
    name: 'Ask AI',
    shortName: 'Ask AI',
    tagline: 'Patient, intelligent tutor across all subjects',
    description: 'Ask any question in plain language. Understand concepts step by step with clear Malawian examples.',
    category: 'Core AI Tutoring',
    icon: 'MessageSquareText',
    badgeColor: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    bgColor: 'bg-indigo-500',
    placeholder: 'Ask any question in simple words (e.g., "Why do leaves change color in autumn?" or "How does solar power work?")...',
    samplePrompts: {
      primary: [
        'Explain how plants make food in simple words',
        'Why do we need to wash hands before eating?',
        'How does a water cycle work in Malawi?'
      ],
      secondary: [
        'Explain the difference between physical and chemical changes with examples',
        'How does the greenhouse effect cause climate change in Southern Africa?',
        'Describe the functions of the liver and pancreas in human digestion'
      ]
    }
  },
  {
    id: 'math',
    name: 'Mathematics Tutor',
    shortName: 'Math',
    tagline: 'Formulas, substitutions, calculations & step-by-step solutions',
    description: 'Breaks down every mathematical problem with explicit formulas, value substitutions, line-by-line calculations, and final boxed answers.',
    category: 'Core AI Tutoring',
    icon: 'Calculator',
    badgeColor: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
    borderColor: 'border-blue-200 dark:border-blue-800',
    bgColor: 'bg-blue-600',
    placeholder: 'Type a math problem (e.g., "Solve 2x² - 8 = 0", "Find gradient of line joining (2,3) and (6,11)", or "Calculate simple interest")...',
    samplePrompts: {
      primary: [
        'Find the perimeter and area of a rectangle with length 12m and width 7m',
        'Solve: 3x + 9 = 24',
        'Divide 150 kwacha among 3 children in the ratio 2:3:5'
      ],
      secondary: [
        'Solve the quadratic equation 2x² + 5x - 3 = 0 using the quadratic formula',
        'Calculate the volume and total surface area of a cylinder with radius 7cm and height 10cm (take π = 22/7)',
        'In a right-angled triangle, hypotenuse is 13cm and base is 5cm. Find the height using Pythagoras theorem'
      ]
    }
  },
  {
    id: 'physics',
    name: 'Physics Tutor',
    shortName: 'Physics',
    tagline: 'Formula, knowns, unknowns, calculations & correct SI units',
    description: 'Systematic physics problem solving: lists known & unknown quantities, states the governing formula, substitutes values, and reports final answers with correct units.',
    category: 'Core AI Tutoring',
    icon: 'Atom',
    badgeColor: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
    borderColor: 'border-sky-200 dark:border-sky-800',
    bgColor: 'bg-sky-600',
    placeholder: 'Enter a physics question (e.g., "A car travels 150m in 10s. Find speed.", "Explain Ohm\'s Law and calculate resistance if V=12V and I=2A")...',
    samplePrompts: {
      primary: [
        'Calculate the speed of a bus that travels 120 km in 2 hours',
        'Explain what friction is and give 2 ways it helps us in daily life',
        'How does a simple lever help us lift heavy loads?'
      ],
      secondary: [
        'A 1200kg car accelerates from rest at 2.5 m/s² for 8 seconds. Calculate the net force and final velocity',
        'Calculate the electrical energy consumed when a 60W bulb operates for 5 hours. Express in Joules and kWh',
        'A ray of light enters glass from air at an angle of incidence of 30°. If refractive index is 1.5, find angle of refraction'
      ]
    }
  },
  {
    id: 'chemistry',
    name: 'Chemistry Tutor',
    shortName: 'Chemistry',
    tagline: 'Balanced equations, formulas, state symbols & reaction steps',
    description: 'Explains chemical equations, balancing step-by-step, state symbols (s, l, g, aq), ionic bonding, stoichiometry, and real-world Malawian chemical processes.',
    category: 'Core AI Tutoring',
    icon: 'FlaskConical',
    badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    bgColor: 'bg-emerald-600',
    placeholder: 'Type a chemistry question (e.g., "Balance: Al + O₂ → Al₂O₃", "What is an ionic bond and how does NaCl form?", "Explain pH scale")...',
    samplePrompts: {
      primary: [
        'What are the 3 states of matter and what happens during melting and boiling?',
        'Why does iron rust and how can we prevent rusting on hoe blades and iron roofs?',
        'Explain the difference between a mixture and a compound with examples'
      ],
      secondary: [
        'Write and balance the chemical equation for the reaction between hydrochloric acid and calcium carbonate, including state symbols',
        'Explain the ionic bonding in magnesium oxide (MgO) using electron shell configurations',
        'Calculate the percentage composition of nitrogen in ammonium nitrate fertilizer (NH₄NO₃) given N=14, H=1, O=16'
      ]
    }
  },
  {
    id: 'biology',
    name: 'Biology Tutor',
    shortName: 'Biology',
    tagline: 'Living systems, cellular processes & structure-to-function adaptations',
    description: 'Explains biological structures and processes using clear language, step-by-step mechanisms, and authentic Malawian flora, fauna, and health examples.',
    category: 'Core AI Tutoring',
    icon: 'Leaf',
    badgeColor: 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800',
    borderColor: 'border-teal-200 dark:border-teal-800',
    bgColor: 'bg-teal-600',
    placeholder: 'Enter a biology topic (e.g., "Explain photosynthesis step by step", "How does the malaria parasite life cycle work?", "Structure of human heart")...',
    samplePrompts: {
      primary: [
        'Describe the life cycle of a mosquito and how to prevent malaria in our homes',
        'What are the parts of a plant and what is the job of the roots and leaves?',
        'List 3 balanced diet nutrients found in Malawian foods like nsima, usipa, and pumpkin leaves'
      ],
      secondary: [
        'Explain the light and dark stages of photosynthesis with chemical equations and limiting factors',
        'Compare the adaptations of xylem vessels and phloem sieve tubes for transport in flowering plants',
        'Explain how genetic inheritance works for sickle-cell anemia using a genetic cross diagram'
      ]
    }
  },
  {
    id: 'ict',
    name: 'ICT Tutor',
    shortName: 'ICT',
    tagline: 'Computer hardware, software, networking, Office & cyber safety',
    description: 'Teaches digital literacy, computer architecture, operating systems, spreadsheets, networking, the internet, and ethical safety practices.',
    category: 'Core AI Tutoring',
    icon: 'Laptop',
    badgeColor: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    bgColor: 'bg-cyan-600',
    placeholder: 'Ask an ICT question (e.g., "Difference between RAM and ROM", "How does an IP address work?", "Explain basic Excel formulas like SUM and AVERAGE")...',
    samplePrompts: {
      primary: [
        'What are the main parts of a computer and what does each part do?',
        'What is the difference between input devices and output devices?',
        'How can a student stay safe when using the internet or a smartphone?'
      ],
      secondary: [
        'Explain the difference between primary memory (RAM/ROM) and secondary storage (HDD/SSD)',
        'Compare LAN, MAN, and WAN computer network topologies with their advantages and disadvantages',
        'Write a simple algorithm and flowchart to find the average of three examination marks'
      ]
    }
  },
  {
    id: 'language',
    name: 'Language & Communication',
    shortName: 'Language',
    tagline: 'English grammar, essay composition, comprehension & Chichewa bridges',
    description: 'Improves English writing, sentence structure, punctuation, vocabulary, essay frameworks (narrative, descriptive, argumentative), and bilingual understanding.',
    category: 'Core AI Tutoring',
    icon: 'BookOpenCheck',
    badgeColor: 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-800',
    borderColor: 'border-violet-200 dark:border-violet-800',
    bgColor: 'bg-violet-600',
    placeholder: 'Ask a language question (e.g., "How to write a formal letter to a headteacher", "Active vs passive voice", "Correct my paragraph grammar")...',
    samplePrompts: {
      primary: [
        'Explain the difference between nouns, verbs, and adjectives with examples',
        'How do we use punctuation marks like capital letters, full stops, and commas?',
        'Write a short 5-sentence paragraph about my favorite school day'
      ],
      secondary: [
        'Explain the rules for changing direct speech into reported speech with 4 examples',
        'Outline a high-scoring argumentative essay: "Should boarding schools abolish prep hours?"',
        'Explain the grammatical difference between "who" and "whom" and between "affect" and "effect"'
      ]
    }
  },
  {
    id: 'quiz',
    name: 'Generate Quiz',
    shortName: 'Quiz Gen',
    tagline: 'Instant 3–5 question practice quiz with answer keys & explanations',
    description: 'Generates a customized interactive quiz with realistic multiple-choice questions (A, B, C, D) followed by detailed pedagogical explanations.',
    category: 'Exam & Revision Tools',
    icon: 'HelpCircle',
    badgeColor: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800',
    borderColor: 'border-purple-200 dark:border-purple-800',
    bgColor: 'bg-purple-600',
    placeholder: 'Topic for quiz (e.g., "Form 1 Chemistry: Separation of mixtures", "Form 2 Math: Simultaneous equations", "Std 8 Science: Human body")...',
    samplePrompts: {
      primary: [
        'Generate a 3-question quiz on Standard 8 Science: Electricity and Circuits',
        'Generate a 4-question quiz on Standard 7 Math: Fractions and Decimals',
        'Generate a 3-question quiz on Primary Agriculture: Soil Erosion Prevention'
      ],
      secondary: [
        'Generate a 4-question quiz on Form 1 Chemistry: Separation techniques (filtration, evaporation, chromatography)',
        'Generate a 4-question quiz on Form 2 Mathematics: Linear equations and inequalities',
        'Generate a 4-question quiz on Form 4 Biology: Genetics and Mendelian inheritance'
      ]
    }
  },
  {
    id: 'explain_answer',
    name: 'Explain My Answer',
    shortName: 'Explain Answer',
    tagline: 'Verify student answers, diagnose mistakes & provide full corrections',
    description: 'Check whether your answer is correct. Identifies what was done right, pinpoints any arithmetic or conceptual mistakes, and shows the ideal step-by-step solution.',
    category: 'Exam & Revision Tools',
    icon: 'CheckCircle2',
    badgeColor: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    borderColor: 'border-rose-200 dark:border-rose-800',
    bgColor: 'bg-rose-600',
    placeholder: 'Paste your question and your answer (e.g., "Question: Solve 3x - 5 = 10. My answer: x = 3. Is this correct?")...',
    samplePrompts: {
      primary: [
        'Question: What is 4/5 + 1/5? My answer is 5/10. Did I get it right?',
        'Question: What do green plants need for photosynthesis? My answer: Water and sunshine. Am I missing anything?',
        'Question: 24 divided by 4 plus 2. My answer is 4. Is my order of operations correct?'
      ],
      secondary: [
        'Question: Solve 2x² - 8 = 0. My answer: x = 2. Did I miss anything?',
        'Question: What is the oxidation state of sulfur in H₂SO₄? My answer: +6 because 2(+1) + S + 4(-2) = 0. Did I explain it correctly?',
        'Question: A car travels 100m in 4s. I calculated acceleration as 25 m/s². Is that correct or did I calculate speed?'
      ]
    }
  },
  {
    id: 'summarize',
    name: 'Summarize Notes',
    shortName: 'Summarize',
    tagline: 'Transform textbooks & class notes into structured revision points',
    description: 'Condenses dense textbook chapters or handwritten notes into clean bullet points, core definitions, essential formulas, and high-priority exam takeaways.',
    category: 'Exam & Revision Tools',
    icon: 'FileText',
    badgeColor: 'text-fuchsia-700 dark:text-fuchsia-300 bg-fuchsia-50 dark:bg-fuchsia-950/60 border-fuchsia-200 dark:border-fuchsia-800',
    borderColor: 'border-fuchsia-200 dark:border-fuchsia-800',
    bgColor: 'bg-fuchsia-600',
    placeholder: 'Paste the notes or topic you want summarized into easy-to-revise points...',
    samplePrompts: {
      primary: [
        'Summarize the key facts about the water cycle and clouds for Primary Science',
        'Summarize the digestive system organs and their main functions into revision bullets',
        'Summarize the causes and effects of deforestation in Malawi'
      ],
      secondary: [
        'Summarize the topic "Acids, Bases and Salts" for Form 1 Chemistry with key definitions and chemical tests',
        'Summarize Newton\'s Three Laws of Motion with formulas, examples, and MANEB exam points',
        'Summarize the respiratory system in humans: pathway of air, alveoli adaptations, and gas exchange'
      ]
    }
  },
  {
    id: 'exam_practice',
    name: 'Exam Practice',
    shortName: 'Exam Prep',
    tagline: 'MANEB & PSLCE style questions with marks, command words & marking schemes',
    description: 'Simulates official MANEB (PSLCE / JCE / MSCE) examination questions with realistic mark allocations [3 marks], command word analysis, and method mark schemes.',
    category: 'Exam & Revision Tools',
    icon: 'GraduationCap',
    badgeColor: 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800',
    borderColor: 'border-orange-200 dark:border-orange-800',
    bgColor: 'bg-orange-600',
    placeholder: 'Subject or topic for exam practice (e.g., "MSCE Physics: Electric circuits calculation [4 marks]", "JCE Math: Factorization [3 marks]")...',
    samplePrompts: {
      primary: [
        'Give me a PSLCE-style question on Primary Mathematics: Word problem on profit and percentage loss [4 marks]',
        'Give me a PSLCE Science question on seed germination conditions with mark allocation [3 marks]',
        'Give me an English comprehension question with a short passage and questions [5 marks]'
      ],
      secondary: [
        'Give me a MANEB MSCE Physics question on projectile motion or energy conservation with full mark scheme [4 marks]',
        'Give me a JCE Mathematics question on simultaneous equations by elimination with method marks (M1, A1) [4 marks]',
        'Give me an MSCE Chemistry question on rates of reaction and collision theory with marking criteria [5 marks]'
      ]
    }
  }
];
