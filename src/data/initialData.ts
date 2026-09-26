import {
  FormInfo,
  Subject,
  Topic,
  NoteItem,
  Lesson,
  PracticeQuestion,
  Quiz,
  PastPaper,
  ExamTip,
  AvatarOption,
  Badge,
  LeaderboardEntry,
  PremiumPlan,
  AdConfiguration,
  Announcement,
  PaymentMethodsConfig,
  CommunityLinksConfig,
  ManebTimetableItem,
  ChiefExaminerInsight,
  MarkingSchemeSimItem,
  ReportIssue
} from '../types';
import {
  CHEMISTRY_SUBJECT,
  FORM_1_CHEMISTRY_TOPICS,
  ALL_FORM_1_CHEMISTRY_NOTES,
  FORM_1_CHEMISTRY_LESSONS,
  FORM_1_CHEMISTRY_QUESTIONS,
  FORM_1_CHEMISTRY_QUIZZES
} from './chemistry';
import {
  SENIOR_CHEMISTRY_TOPICS,
  SENIOR_CHEMISTRY_NOTES,
  SENIOR_CHEMISTRY_QUESTIONS,
  SENIOR_CHEMISTRY_QUIZZES
} from './chemistrySeniorData';
import {
  PHYSICS_SUBJECT,
  PHYSICS_TOPICS,
  PHYSICS_NOTES,
  PHYSICS_QUESTIONS,
  PHYSICS_QUIZZES
} from './physicsData';
import {
  BIOLOGY_SUBJECT,
  BIOLOGY_TOPICS,
  BIOLOGY_NOTES,
  BIOLOGY_QUESTIONS,
  BIOLOGY_QUIZZES
} from './biologyData';
import {
  MATHEMATICS_SUBJECT,
  MATHEMATICS_TOPICS,
  MATHEMATICS_NOTES,
  MATHEMATICS_QUESTIONS,
  MATHEMATICS_QUIZZES
} from './mathematicsData';

export const INITIAL_FORMS: FormInfo[] = [
  { id: 'form-1', name: 'Form 1', alias: 'Junior 1', description: 'Foundation secondary syllabus & basic concepts', order: 1 },
  { id: 'form-2', name: 'Form 2', alias: 'Junior 2', description: 'JCE preparation, scientific principles & core analysis', order: 2 },
  { id: 'form-3', name: 'Form 3', alias: 'Senior 3', description: 'Senior secondary topics, advanced theory & applications', order: 3 },
  { id: 'form-4', name: 'Form 4', alias: 'Senior 4', description: 'MSCE graduation, national exam mastery & revision', order: 4 },
];

export const INITIAL_AVATARS: AvatarOption[] = [
  { id: 'avatar-1', name: 'Kondwani', emoji: '🧑🏾‍🎓', accentBg: 'bg-emerald-100 text-emerald-800', label: 'Math & Physics Scholar' },
  { id: 'avatar-2', name: 'Chisomo', emoji: '👩🏾‍🔬', accentBg: 'bg-teal-100 text-teal-800', label: 'Biology & Chem Whiz' },
  { id: 'avatar-3', name: 'Thokozani', emoji: '👨🏾‍🏫', accentBg: 'bg-emerald-50 text-emerald-900', label: 'Literature & History Sage' },
  { id: 'avatar-4', name: 'Tadala', emoji: '👩🏾‍💻', accentBg: 'bg-green-100 text-green-800', label: 'Computer & Tech Lead' },
  { id: 'avatar-5', name: 'Blessings', emoji: '🧑🏾‍🌾', accentBg: 'bg-lime-100 text-lime-800', label: 'Agriculture Pioneer' },
  { id: 'avatar-6', name: 'Alinane', emoji: '👩🏾‍🎓', accentBg: 'bg-emerald-100 text-emerald-900', label: 'Honor Roll Achiever' },
  { id: 'avatar-7', name: 'Madalitso', emoji: '👨🏾‍🎓', accentBg: 'bg-teal-50 text-teal-900', label: 'MSCE Distinction Seeker' },
  { id: 'avatar-8', name: 'Yamikani', emoji: '👩🏾‍🏫', accentBg: 'bg-green-50 text-green-900', label: 'Creative Writer & Poet' },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-starter',
    name: 'First Step to Distinction',
    description: 'Completed your first study note and lesson on StudyMaster.',
    requirement: 'Complete 1 note or lesson',
    icon: '🌱',
    rarity: 'Common',
    pointsReward: 50,
    category: 'Study'
  },
  {
    id: 'badge-quiz-ace',
    name: 'Quiz Master',
    description: 'Scored 100% on any subject quiz.',
    requirement: 'Score 100% on a quiz',
    icon: '🎯',
    rarity: 'Silver',
    pointsReward: 120,
    category: 'Quiz'
  },
  {
    id: 'badge-math-whiz',
    name: 'Malawi Math Champion',
    description: 'Solved 5 step-by-step worked algebra or calculus examples.',
    requirement: 'Complete 5 Math worked examples',
    icon: '📐',
    rarity: 'Gold',
    pointsReward: 200,
    category: 'Study'
  },
  {
    id: 'badge-science-guru',
    name: 'Laboratory Genius',
    description: 'Completed 3 Physics, Chemistry & Biology topics.',
    requirement: 'Study 3 Science topics',
    icon: '🧪',
    rarity: 'Gold',
    pointsReward: 220,
    category: 'Study'
  },
  {
    id: 'badge-past-paper-pro',
    name: 'MANEB Paper Conqueror',
    description: 'Downloaded and revised 3 official past exam papers.',
    requirement: 'Download 3 Past Papers',
    icon: '📜',
    rarity: 'Silver',
    pointsReward: 150,
    category: 'PastPapers'
  },
  {
    id: 'badge-focus-champion',
    name: 'Deep Focus Pioneer',
    description: 'Completed a 25-minute Pomodoro study block in Focus Mode.',
    requirement: 'Finish 25 min Focus session',
    icon: '⏳',
    rarity: 'Silver',
    pointsReward: 100,
    category: 'Special'
  },
  {
    id: 'badge-dedicated-scholar',
    name: 'Dedicated Scholar',
    description: 'Completed 5 thorough subject study sessions on StudyMaster.',
    requirement: 'Complete 5 study sessions',
    icon: '🌟',
    rarity: 'Malawi Champion',
    pointsReward: 350,
    category: 'Study'
  },
  {
    id: 'badge-top-scholar',
    name: 'National Top 10 Scholar',
    description: 'Reached the weekly Top 10 student leaderboard of Malawi.',
    requirement: 'Reach Top 10 on Weekly Leaderboard',
    icon: '🇲🇼',
    rarity: 'Malawi Champion',
    pointsReward: 500,
    category: 'Special'
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-agri',
    name: 'Agriculture',
    forms: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    icon: 'Sprout',
    category: 'Commercial',
    description: 'Crop production, soil science, livestock husbandry, farm machinery & agricultural economics.',
    status: 'published'
  },
  BIOLOGY_SUBJECT,
  CHEMISTRY_SUBJECT,
  {
    id: 'subj-chichewa',
    name: 'Chichewa',
    forms: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    icon: 'Languages',
    category: 'Languages',
    description: 'Mawu, Chiganizo, Zolemba zamatsenga, Zikhulupiriro ndi Zofotokoza zaku Malawi.',
    status: 'published'
  },
  {
    id: 'subj-cs',
    name: 'Computer Studies',
    forms: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    icon: 'Laptop',
    category: 'Technical',
    description: 'Hardware, software, networking, internet, database management & basic algorithm logic.',
    status: 'published'
  },
  {
    id: 'subj-eng',
    name: 'English Language & Literature',
    forms: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    icon: 'BookOpen',
    category: 'Languages',
    description: 'Grammar, essay writing, comprehension, poetry analysis, prose & set book studies.',
    status: 'published'
  },
  {
    id: 'subj-geo',
    name: 'Geography',
    forms: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    icon: 'Globe',
    category: 'Humanities',
    description: 'Physical geography, map work, climate of Malawi, agriculture, minerals & population.',
    status: 'published'
  },
  {
    id: 'subj-history',
    name: 'History',
    forms: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    icon: 'Landmark',
    category: 'Humanities',
    description: 'Malawian pre-colonial history, colonial rule, independence struggle, African nationalism & World Wars.',
    status: 'published'
  },
  MATHEMATICS_SUBJECT,
  PHYSICS_SUBJECT,
  {
    id: 'subj-social',
    name: 'Social & Development Studies',
    forms: ['Form 1', 'Form 2'],
    icon: 'Users',
    category: 'Humanities',
    description: 'Civic education, democracy, human rights, gender equity & community development.',
    status: 'published'
  }
];

export const INITIAL_TOPICS: Topic[] = [
  ...FORM_1_CHEMISTRY_TOPICS,
  ...SENIOR_CHEMISTRY_TOPICS,
  ...PHYSICS_TOPICS,
  ...BIOLOGY_TOPICS,
  ...MATHEMATICS_TOPICS,
  // Math Form 2
  {
    id: 'topic-math-f2-algebra',
    subjectId: 'subj-math',
    form: 'Form 2',
    title: 'Algebraic Expressions & Linear Equations',
    summary: 'Master the fundamentals of factorisation, expanding brackets, and solving simultaneous linear equations with two unknowns.',
    order: 1,
    status: 'published',
    keyConcepts: ['Variables and Coefficients', 'Distributive Law', 'Grouping Method Factorisation', 'Elimination & Substitution'],
    formulasOrFacts: ['a(b + c) = ab + ac', '(a + b)(a - b) = a² - b²', '(a + b)² = a² + 2ab + b²']
  },
  {
    id: 'topic-math-f2-pythagoras',
    subjectId: 'subj-math',
    form: 'Form 2',
    title: "Pythagoras' Theorem & Right-Angled Triangles",
    summary: 'Understand the geometric relationship between sides of right-angled triangles and apply it to real-world distance problems.',
    order: 2,
    status: 'published',
    keyConcepts: ['Hypotenuse identification', 'Square roots & surds', 'Pythagorean Triples (3-4-5, 5-12-13)', '3D spatial applications'],
    formulasOrFacts: ['a² + b² = c² (where c is the hypotenuse)', 'c = √(a² + b²)']
  },
  // Math Form 4 (MSCE)
  {
    id: 'topic-math-f4-quadratic',
    subjectId: 'subj-math',
    form: 'Form 4',
    title: 'Quadratic Equations & Graphs',
    summary: 'Solve quadratic equations using the quadratic formula, completing the square, and graphical analysis of parabolas for MSCE.',
    order: 1,
    status: 'published',
    keyConcepts: ['Discriminant (b² - 4ac)', 'Completing the Square', 'Vertex & Axis of Symmetry', 'Roots & X-intercepts'],
    formulasOrFacts: ['x = [-b ± √(b² - 4ac)] / (2a)', 'Discriminant Δ = b² - 4ac: if Δ > 0 (2 real roots), Δ = 0 (1 root), Δ < 0 (no real roots)']
  },
  {
    id: 'topic-math-f4-trig',
    subjectId: 'subj-math',
    form: 'Form 4',
    title: 'Trigonometry & Sine/Cosine Rules',
    summary: 'Learn non-right-angled triangle solutions, bearings, angles of elevation/depression, and area calculations.',
    order: 2,
    status: 'published',
    keyConcepts: ['Sine Rule', 'Cosine Rule', 'Area of Triangle = 1/2 a b sin(C)', '3-Figure Bearings'],
    formulasOrFacts: ['a / sin(A) = b / sin(B) = c / sin(C)', 'c² = a² + b² - 2ab cos(C)', 'Area = 1/2 ab sin(C)']
  },
  // Physics Form 2
  {
    id: 'topic-phys-f2-matter',
    subjectId: 'subj-physics',
    form: 'Form 2',
    title: 'Structure of the Atom & Periodic Table',
    summary: 'Explore protons, neutrons, electrons, electron configuration (2,8,8), and how elements are arranged in Groups and Periods.',
    order: 1,
    status: 'published',
    keyConcepts: ['Subatomic particles & charges', 'Atomic Number (Z) & Mass Number (A)', 'Valency and chemical bonding', 'Metals vs Non-metals'],
    formulasOrFacts: ['Number of Neutrons = Mass Number - Atomic Number (A - Z)', 'Electron shells max: 2 (1st), 8 (2nd), 8 (3rd)']
  },
  // Physics Form 4
  {
    id: 'topic-phys-f4-electricity',
    subjectId: 'subj-physics',
    form: 'Form 4',
    title: 'Current Electricity & Ohms Law',
    summary: 'Analyse series and parallel circuits, voltage, resistance, electrical power, and domestic wiring safety in Malawi.',
    order: 1,
    status: 'published',
    keyConcepts: ["Ohm's Law (V = IR)", 'Resistors in Series vs Parallel', 'Electrical Energy & Kilowatt-Hours (ESCOM tariffs)', 'Fuses & Earth wire protection'],
    formulasOrFacts: ['V = I × R', 'R_series = R1 + R2 + ...', '1 / R_parallel = 1/R1 + 1/R2', 'P = V × I = I²R = V²/R']
  },
  // Biology Form 2
  {
    id: 'topic-bio-f2-cells',
    subjectId: 'subj-bio',
    form: 'Form 2',
    title: 'Cell Structure, Organisation & Microscopy',
    summary: 'Compare plant and animal cells, organelle functions (nucleus, chloroplast, cell wall, mitochondria), and specialised cells.',
    order: 1,
    status: 'published',
    keyConcepts: ['Plant vs Animal Cell differences', 'Magnification = Image size / Actual size', 'Cell specialization (Root hair, RBC, Xylem)', 'Diffusion & Osmosis'],
    formulasOrFacts: ['Magnification (M) = Size of Image (I) / Real Size of Object (A)', 'Plant cells have: Chloroplasts, Large Central Vacuole, Cellulose Cell Wall']
  },
  // Biology Form 4
  {
    id: 'topic-bio-f4-genetics',
    subjectId: 'subj-bio',
    form: 'Form 4',
    title: 'Genetics, Inheritance & DNA Structure',
    summary: 'Mendelian genetics, monohybrid crosses, Punnett squares, dominant/recessive alleles, co-dominance, and blood group inheritance.',
    order: 1,
    status: 'published',
    keyConcepts: ['Alleles, Genotype & Phenotype', 'Homozygous vs Heterozygous', 'Mendels Monohybrid Ratio (3:1)', 'ABO Blood Group System'],
    formulasOrFacts: ['Phenotypic ratio of F2 generation for heterozygous cross (Bb × Bb) = 3 Dominant : 1 Recessive']
  },
  // English Form 4
  {
    id: 'topic-eng-f4-essay',
    subjectId: 'subj-eng',
    form: 'Form 4',
    title: 'MSCE Discursive & Argumentative Essay Mastery',
    summary: 'Techniques for structuring compelling 450-word compositions with thesis statements, logical paragraphs, transitions, and conclusion.',
    order: 1,
    status: 'published',
    keyConcepts: ['PEEL Paragraph Structure (Point, Evidence, Explanation, Link)', 'Transitional markers', 'Formal register & vocabulary', 'Proofreading for tense consistency'],
    formulasOrFacts: ['Ideal Composition Structure: Introduction (10%), 3 Body Paragraphs (75%), Conclusion (15%)']
  },
  // Geography Form 3
  {
    id: 'topic-geo-f3-malawi',
    subjectId: 'subj-geo',
    form: 'Form 3',
    title: 'Physical Features, Rift Valley & Climate of Malawi',
    summary: 'Formation of Lake Malawi, Shire Valley, Mulanje Massif, Zomba Plateau, rainfall patterns (Inter-Tropical Convergence Zone ITCZ).',
    order: 1,
    status: 'published',
    keyConcepts: ['East African Rift System tectonics', 'Relief rainfall vs Convectional rainfall', 'Lake Malawi basin ecology', 'Soil types across Shire Highlands'],
    formulasOrFacts: ['Highest peak in Malawi: Sapitwa Peak (Mulanje Massif) at 3,002 metres above sea level']
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  ...ALL_FORM_1_CHEMISTRY_NOTES,
  ...SENIOR_CHEMISTRY_NOTES,
  ...PHYSICS_NOTES,
  ...BIOLOGY_NOTES,
  ...MATHEMATICS_NOTES
];

export const INITIAL_LESSONS: Lesson[] = [
  ...FORM_1_CHEMISTRY_LESSONS,
  {
    id: 'lesson-math-f2-1',
    topicId: 'topic-math-f2-algebra',
    subjectId: 'subj-math',
    form: 'Form 2',
    title: 'Lesson 1: Mastering Linear Equations with Two Unknowns',
    introduction: 'In this lesson, you will learn how to systematically solve pairs of linear equations where two variables interact, using both substitution and elimination methods commonly tested in MANEB JCE examinations.',
    explanation: 'A single linear equation like 2x + y = 10 has infinitely many pairs of solutions (e.g., x=1, y=8 or x=2, y=6). However, when we have two distinct linear equations involving the same variables, there is usually exactly one unique point (x,y) that satisfies both simultaneously.\n\nThe two core methods are:\n1. Elimination: Make the coefficients of one variable equal in magnitude and add or subtract the equations.\n2. Substitution: Rearrange one equation to express one variable in terms of the other, then substitute into the remaining equation.',
    importantPoints: [
      'Choose the method that requires the fewest fractions.',
      'If coefficients have the same sign (+ and +), subtract the equations.',
      'If coefficients have opposite signs (+ and -), add the equations.',
      'Check your solution in both original equations.'
    ],
    examples: [
      {
        id: 'ex-less-1',
        title: 'Solving via Substitution',
        problem: 'Solve: y = 2x - 1 and 3x + y = 14',
        stepByStepSolution: [
          { step: 1, explanation: 'Substitute (2x - 1) in place of y in the second equation: 3x + (2x - 1) = 14' },
          { step: 2, explanation: 'Simplify: 5x - 1 = 14 => 5x = 15 => x = 3' },
          { step: 3, explanation: 'Find y: y = 2(3) - 1 = 6 - 1 = 5' }
        ],
        finalAnswer: 'x = 3, y = 5',
        keyTakeaway: 'Substitution is especially fast when one equation already isolates a variable.'
      }
    ],
    summary: 'Simultaneous equations represent the intersection of two straight lines on a Cartesian plane. Mastery of elimination and substitution provides the foundation for coordinate geometry and word problem formulation.',
    practicePrompt: 'Try solving: 5x + 3y = 21 and 2x + 3y = 12 using the elimination method.',
    version: 1,
    status: 'published',
    updatedAt: '2026-03-21'
  }
];

export const INITIAL_QUESTIONS: PracticeQuestion[] = [
  ...FORM_1_CHEMISTRY_QUESTIONS,
  ...SENIOR_CHEMISTRY_QUESTIONS,
  ...PHYSICS_QUESTIONS,
  ...BIOLOGY_QUESTIONS,
  ...MATHEMATICS_QUESTIONS,
  {
    id: 'q-math-1',
    topicId: 'topic-math-f2-algebra',
    subjectId: 'subj-math',
    form: 'Form 2',
    question: 'Factorise completely: 4x² - 36',
    options: ['(2x - 6)(2x + 6)', '4(x - 3)(x + 3)', '4(x - 9)(x + 9)', '(4x - 6)(x + 6)'],
    correctAnswerIndex: 1,
    explanation: 'First extract the highest common factor 4: 4(x² - 9). Then apply the difference of two squares to (x² - 9) = (x - 3)(x + 3). Thus, 4(x - 3)(x + 3).',
    difficulty: 'Medium',
    points: 10,
    status: 'published'
  },
  {
    id: 'q-math-2',
    topicId: 'topic-math-f2-algebra',
    subjectId: 'subj-math',
    form: 'Form 2',
    question: 'Solve for x: 3(2x - 4) = 18',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
    correctAnswerIndex: 2,
    explanation: 'Divide both sides by 3: 2x - 4 = 6. Add 4 to both sides: 2x = 10. Divide by 2: x = 5.',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  },
  {
    id: 'q-bio-1',
    topicId: 'topic-bio-f2-cells',
    subjectId: 'subj-bio',
    form: 'Form 2',
    question: 'Which of the following cellular structures is present in plant cells but absent in animal cells?',
    options: ['Mitochondria', 'Cellulose Cell Wall', 'Cell Membrane', 'Ribosomes'],
    correctAnswerIndex: 1,
    explanation: 'Cellulose cell walls and large permanent chloroplasts are distinct features of plant cells. Mitochondria, cell membranes, and ribosomes exist in both.',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  },
  {
    id: 'q-bio-2',
    topicId: 'topic-bio-f2-cells',
    subjectId: 'subj-bio',
    form: 'Form 2',
    question: 'An image of a bacterium measures 20 mm under a magnification of x4000. What is the actual length of the bacterium?',
    options: ['0.005 μm', '5 μm', '50 μm', '0.5 μm'],
    correctAnswerIndex: 1,
    explanation: 'Actual Size = Image / Magnification. 20 mm = 20,000 μm. 20,000 / 4000 = 5 μm.',
    difficulty: 'Medium',
    points: 10,
    status: 'published'
  },
  {
    id: 'q-phys-1',
    topicId: 'topic-phys-f4-electricity',
    subjectId: 'subj-physics',
    form: 'Form 4',
    question: 'Two resistors of 6 Ω and 3 Ω are connected in parallel. What is their equivalent total resistance?',
    options: ['9 Ω', '2 Ω', '4.5 Ω', '18 Ω'],
    correctAnswerIndex: 1,
    explanation: 'For two resistors in parallel: R = (R1 * R2) / (R1 + R2) = (6 * 3) / (6 + 3) = 18 / 9 = 2 Ω.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  ...FORM_1_CHEMISTRY_QUIZZES,
  ...SENIOR_CHEMISTRY_QUIZZES,
  ...PHYSICS_QUIZZES,
  ...BIOLOGY_QUIZZES,
  ...MATHEMATICS_QUIZZES,
  {
    id: 'quiz-math-f2-algebra',
    topicId: 'topic-math-f2-algebra',
    subjectId: 'subj-math',
    form: 'Form 2',
    title: 'Algebra & Factorisation Master Quiz',
    description: 'Test your grasp of expanding brackets, grouping, quadratic expressions, and linear equations.',
    timeLimitMinutes: 10,
    pointsAwarded: 50,
    status: 'published',
    version: 1,
    questions: [
      INITIAL_QUESTIONS[0],
      INITIAL_QUESTIONS[1],
      {
        id: 'q-math-3',
        topicId: 'topic-math-f2-algebra',
        subjectId: 'subj-math',
        form: 'Form 2',
        question: 'Expand and simplify: (2x + 3)(x - 4)',
        options: ['2x² - 5x - 12', '2x² + 5x - 12', '2x² - 8x + 3', '2x² - 12'],
        correctAnswerIndex: 0,
        explanation: 'FOIL: 2x*x + 2x*(-4) + 3*x + 3*(-4) = 2x² - 8x + 3x - 12 = 2x² - 5x - 12.',
        difficulty: 'Medium',
        points: 10,
        status: 'published'
      },
      {
        id: 'q-math-4',
        topicId: 'topic-math-f2-algebra',
        subjectId: 'subj-math',
        form: 'Form 2',
        question: 'If 2x + y = 11 and x - y = 1, find the value of x.',
        options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
        correctAnswerIndex: 1,
        explanation: 'Add the two equations: (2x + y) + (x - y) = 11 + 1 => 3x = 12 => x = 4.',
        difficulty: 'Hard',
        points: 15,
        status: 'published'
      }
    ]
  },
  {
    id: 'quiz-bio-f2-cells',
    topicId: 'topic-bio-f2-cells',
    subjectId: 'subj-bio',
    form: 'Form 2',
    title: 'Cell Biology & Organelles Assessment',
    description: 'Assess your understanding of plant/animal cell structures, organelles, and biological magnification calculations.',
    timeLimitMinutes: 8,
    pointsAwarded: 40,
    status: 'published',
    version: 1,
    questions: [
      INITIAL_QUESTIONS[2],
      INITIAL_QUESTIONS[3],
      {
        id: 'q-bio-3',
        topicId: 'topic-bio-f2-cells',
        subjectId: 'subj-bio',
        form: 'Form 2',
        question: 'Which organelle is responsible for aerobic cellular respiration and ATP synthesis?',
        options: ['Chloroplast', 'Mitochondrion', 'Endoplasmic Reticulum', 'Golgi Apparatus'],
        correctAnswerIndex: 1,
        explanation: 'Mitochondria are the powerhouses of cells where glucose is broken down in the presence of oxygen to produce ATP.',
        difficulty: 'Easy',
        points: 10,
        status: 'published'
      }
    ]
  }
];

export const INITIAL_PAST_PAPERS: PastPaper[] = [
  {
    id: 'paper-msce-math-2024-p1',
    subjectId: 'subj-math',
    subjectName: 'Mathematics',
    form: 'Form 4',
    year: 2024,
    paperNumber: 'Paper 1',
    category: 'MSCE',
    title: '2024 MANEB MSCE Mathematics Paper 1',
    description: 'Official MANEB MSCE examination covering algebra, arithmetic, quadratic equations, geometry, trigonometry, and statistics.',
    fileSizeMb: 1.8,
    downloadUrl: '/downloads/msce-math-2024-p1.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Includes detailed step-by-step mark allocations for Section A (50 marks) and Section B (50 marks).',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 342,
    uploadedAt: '2025-01-10',
    questionsExcerpt: [
      { qNumber: 1, text: 'Evaluate: 3 1/2 + 2 1/4 ÷ 1 1/8 without using a calculator.', marks: 4 },
      { qNumber: 2, text: 'Solve the equation: 2x² - 7x + 3 = 0 using the quadratic formula.', marks: 6 },
      { qNumber: 3, text: 'In triangle ABC, AB = 8 cm, AC = 11 cm and angle BAC = 64°. Calculate the length of BC.', marks: 6 },
      { qNumber: 4, text: 'A line passes through (2, 5) and is perpendicular to 3x - 2y = 8. Find its equation.', marks: 5 }
    ]
  },
  {
    id: 'paper-msce-phys-2024-p1',
    subjectId: 'subj-physics',
    subjectName: 'Physics',
    form: 'Form 4',
    year: 2024,
    paperNumber: 'Paper 1 (Theory & Structured)',
    category: 'MSCE',
    title: '2024 MANEB MSCE Physics Theory',
    description: 'Covers kinematics, dynamics, work and power, current electricity, electromagnetic induction, and optics.',
    fileSizeMb: 2.1,
    downloadUrl: '/downloads/msce-phys-2024-p1.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Full marking scheme with expected chemical equations and numerical derivations.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 289,
    uploadedAt: '2025-01-12',
    questionsExcerpt: [
      { qNumber: 1, text: 'State Newton’s Second Law of Motion and derive the formula F = ma.', marks: 4 },
      { qNumber: 2, text: 'Calculate the resistance of a 1.5 m nichrome wire of cross-sectional area 2.0 x 10⁻⁷ m² if resistivity is 1.1 x 10⁻⁶ Ωm.', marks: 5 },
      { qNumber: 3, text: 'A step-down transformer has 1200 primary turns and 60 secondary turns. If the input voltage is 240 V, calculate the output voltage.', marks: 5 }
    ]
  },
  {
    id: 'paper-msce-chem-2024-p1',
    subjectId: 'subj-chem',
    subjectName: 'Chemistry',
    form: 'Form 4',
    year: 2024,
    paperNumber: 'Paper 1 (Theory & Practical Analysis)',
    category: 'MSCE',
    title: '2024 MANEB MSCE Chemistry Theory',
    description: 'Covers atomic structure, ionic and covalent bonding, mole concept, acid-base titrations, electrochemistry, and organic fuels.',
    fileSizeMb: 2.0,
    downloadUrl: '/downloads/msce-chem-2024-p1.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Full marking scheme with balanced chemical equations, state symbols, and stoichiometry steps.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 265,
    uploadedAt: '2025-01-14',
    questionsExcerpt: [
      { qNumber: 1, text: 'State the difference between isotopes and allotropes with two suitable examples.', marks: 4 },
      { qNumber: 2, text: 'In a titration, 25.0 cm³ of 0.1 mol/dm³ NaOH neutralises 20.0 cm³ of HCl. Calculate the concentration of the acid.', marks: 5 },
      { qNumber: 3, text: 'Explain using Le Chatelier principle the effect of increasing pressure on the Haber process: N₂ + 3H₂ ⇌ 2NH₃.', marks: 5 }
    ]
  },
  {
    id: 'paper-jce-math-2024-p1',
    subjectId: 'subj-math',
    subjectName: 'Mathematics',
    form: 'Form 2',
    year: 2024,
    paperNumber: 'Paper 1',
    category: 'JCE',
    title: '2024 MANEB JCE Mathematics Paper',
    description: 'Junior Certificate of Education national examination for Form 2 students.',
    fileSizeMb: 1.4,
    downloadUrl: '/downloads/jce-math-2024-p1.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Complete model answers with common student pitfalls highlighted.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 415,
    uploadedAt: '2025-01-05',
    questionsExcerpt: [
      { qNumber: 1, text: 'Express 0.3636... as a fraction in its lowest terms.', marks: 3 },
      { qNumber: 2, text: 'Find the size of the interior angle of a regular 8-sided polygon (octagon).', marks: 4 },
      { qNumber: 3, text: 'A farmer bought 12 bags of fertilizer for MK 360,000. How much did 7 bags cost?', marks: 3 }
    ]
  },
  {
    id: 'paper-msce-bio-2023-p1',
    subjectId: 'subj-bio',
    subjectName: 'Biology',
    form: 'Form 4',
    year: 2023,
    paperNumber: 'Paper 1 (Theory)',
    category: 'MSCE',
    title: '2023 MANEB MSCE Biology Paper 1',
    description: 'National MSCE Biology examination paper covering physiology, genetics, plant transport, and ecology.',
    fileSizeMb: 1.9,
    downloadUrl: '/downloads/msce-bio-2023-p1.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Includes required diagram labeling criteria and key biological terminology points.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 310,
    uploadedAt: '2024-02-18'
  },
  {
    id: 'paper-msce-eng-2024-p2',
    subjectId: 'subj-eng',
    subjectName: 'English Language & Literature',
    form: 'Form 4',
    year: 2024,
    paperNumber: 'Paper 2 (Literature)',
    category: 'MSCE',
    title: '2024 MANEB MSCE English Literature Paper',
    description: 'Prose, Poetry, and Drama analysis for senior secondary students in Malawi.',
    fileSizeMb: 1.2,
    downloadUrl: '/downloads/msce-eng-2024-p2.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Essay grading rubric for contextual analysis, thematic exploration, and character development.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 198,
    uploadedAt: '2025-01-20'
  },
  // --- FORM 1 SECONDARY SCHOOL EXAMINATION PAPERS ---
  {
    id: 'paper-f1-math-term1-2024',
    subjectId: 'subj-math',
    subjectName: 'Mathematics',
    form: 'Form 1',
    year: 2024,
    paperNumber: 'Paper 1 (End of Term 1)',
    category: 'End of Term',
    title: 'Form 1 Mathematics End of Term 1 Examination',
    description: 'Secondary school Term 1 examination covering operations with directed numbers, HCF & LCM, fractions, decimals, and linear equations in one variable.',
    fileSizeMb: 1.1,
    downloadUrl: '/downloads/f1-math-term1-2024.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Method marks (M1) awarded for clear working and accuracy marks (A1) for final simplified answers.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 380,
    uploadedAt: '2024-12-05',
    questionsExcerpt: [
      { qNumber: 1, text: 'Evaluate: (-18) ÷ (-3) + (-4) × 2 without using a calculator.', marks: 3 },
      { qNumber: 2, text: 'Find the lowest common multiple (LCM) and highest common factor (HCF) of 24, 36, and 54 using prime factorisation.', marks: 5 },
      { qNumber: 3, text: 'Solve for x: 3(2x - 4) = 4x + 6.', marks: 4 },
      { qNumber: 4, text: 'A secondary school class in Zomba has 45 students. If the ratio of boys to girls is 2:3, calculate the number of girls in the class.', marks: 4 }
    ]
  },
  {
    id: 'paper-f1-chem-term2-2024',
    subjectId: 'subj-chem',
    subjectName: 'Chemistry',
    form: 'Form 1',
    year: 2024,
    paperNumber: 'Paper 1 (End of Term 2)',
    category: 'End of Term',
    title: 'Form 1 Chemistry End of Term 2 Examination',
    description: 'Summative paper assessing laboratory safety, apparatus, states of matter, kinetic theory, mixtures, and physical separation techniques.',
    fileSizeMb: 1.3,
    downloadUrl: '/downloads/f1-chem-term2-2024.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Step-by-step marking guide covering separation technique justifications and particle arrangement diagrams.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 295,
    uploadedAt: '2024-12-08',
    questionsExcerpt: [
      { qNumber: 1, text: 'Name two laboratory hazards and describe the proper safety protocol when heating substances in a test tube.', marks: 4 },
      { qNumber: 2, text: 'Using the kinetic theory of matter, explain why solids have a fixed volume while gases do not.', marks: 4 },
      { qNumber: 3, text: 'Describe how a pure sample of salt can be obtained from a sand and salt-water mixture in the laboratory.', marks: 6 }
    ]
  },
  {
    id: 'paper-f1-bio-promo-2024',
    subjectId: 'subj-bio',
    subjectName: 'Biology',
    form: 'Form 1',
    year: 2024,
    paperNumber: 'Paper 1 (End of Year Promotional)',
    category: 'End of Term',
    title: 'Form 1 Biology End of Year Promotional Examination',
    description: 'Annual promotional examination testing cell structure, magnification, light microscope handling, and characteristics of living things.',
    fileSizeMb: 1.5,
    downloadUrl: '/downloads/f1-bio-promo-2024.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Includes strict criteria for biological diagram labels, clean continuous pencil lines, and correct plant vs animal cell comparisons.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 340,
    uploadedAt: '2024-12-10',
    questionsExcerpt: [
      { qNumber: 1, text: 'State three structural differences between an onion epidermal plant cell and a human cheek animal cell.', marks: 3 },
      { qNumber: 2, text: 'If a specimen is viewed with an eyepiece of magnification x10 and an objective lens of x40, calculate total magnification.', marks: 2 },
      { qNumber: 3, text: 'Explain why chlorophyll is essential for the process of photosynthesis in green plants.', marks: 4 }
    ]
  },
  {
    id: 'paper-f1-phys-term3-2024',
    subjectId: 'subj-physics',
    subjectName: 'Physics',
    form: 'Form 1',
    year: 2024,
    paperNumber: 'Paper 1 (End of Term 3)',
    category: 'End of Term',
    title: 'Form 1 Physics End of Term 3 Examination',
    description: 'School assessment on measurement of length, area, volume, mass and density, vernier calipers, and basic pressure in liquids.',
    fileSizeMb: 1.4,
    downloadUrl: '/downloads/f1-phys-term3-2024.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'GRASP method required for all density calculations with full SI units rewarded.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 270,
    uploadedAt: '2024-12-12',
    questionsExcerpt: [
      { qNumber: 1, text: 'Explain the difference between fundamental quantities and derived quantities, giving two examples of each.', marks: 4 },
      { qNumber: 2, text: 'A rectangular stone block has dimensions 4 cm by 5 cm by 10 cm and a mass of 540 g. Calculate its density in g/cm³ and kg/m³.', marks: 5 }
    ]
  },
  {
    id: 'paper-f1-eng-midterm-2024',
    subjectId: 'subj-eng',
    subjectName: 'English Language & Literature',
    form: 'Form 1',
    year: 2024,
    paperNumber: 'Paper 1 (Mid-Term Test)',
    category: 'Mid-Term',
    title: 'Form 1 English Language Mid-Term Test',
    description: 'Grammar mechanics, parts of speech, punctuation, comprehension passage, and short narrative composition.',
    fileSizeMb: 1.0,
    downloadUrl: '/downloads/f1-eng-midterm-2024.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Mark scheme assessing sentence agreement, correct verb tenses, and paragraph transitions.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 220,
    uploadedAt: '2024-10-15'
  },
  // --- FORM 2 SECONDARY SCHOOL EXAMINATION PAPERS ---
  {
    id: 'paper-f2-bio-jce-2024',
    subjectId: 'subj-bio',
    subjectName: 'Biology',
    form: 'Form 2',
    year: 2024,
    paperNumber: 'Paper 1 (National JCE)',
    category: 'JCE',
    title: '2024 MANEB JCE Biology Examination Paper',
    description: 'Junior Certificate of Education national paper testing human digestion, respiratory gas exchange, blood circulation, and malaria prevention.',
    fileSizeMb: 1.6,
    downloadUrl: '/downloads/f2-bio-jce-2024.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Complete model answers with enzyme action criteria and circulatory system diagrams.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 430,
    uploadedAt: '2025-01-08',
    questionsExcerpt: [
      { qNumber: 1, text: 'Name the enzyme produced in the stomach and state its optimum pH and function.', marks: 3 },
      { qNumber: 2, text: 'Describe four adaptations of the human alveoli that facilitate rapid diffusion of respiratory gases.', marks: 4 },
      { qNumber: 3, text: 'Explain how the use of treated mosquito nets interrupts the transmission cycle of Plasmodium in Malawi.', marks: 4 }
    ]
  },
  {
    id: 'paper-f2-chem-mock-2024',
    subjectId: 'subj-chem',
    subjectName: 'Chemistry',
    form: 'Form 2',
    year: 2024,
    paperNumber: 'Paper 1 (Cluster Mock)',
    category: 'Mock',
    title: 'Form 2 Zonal Cluster Mock Examination - Chemistry',
    description: 'Joint cluster mock examination on atomic structure, electron configuration, chemical formulas, acids, bases, and salts.',
    fileSizeMb: 1.5,
    downloadUrl: '/downloads/f2-chem-mock-2024.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Includes electronic configuration mark scheme and neutralization reaction balanced equations.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 310,
    uploadedAt: '2024-11-20',
    questionsExcerpt: [
      { qNumber: 1, text: 'An element has atomic number 12 and mass number 24. Write its electronic configuration and deduce its group and period.', marks: 4 },
      { qNumber: 2, text: 'Write a balanced chemical equation for the reaction between dilute hydrochloric acid and calcium carbonate (CaCO₃).', marks: 4 }
    ]
  },
  {
    id: 'paper-f2-phys-term2-2024',
    subjectId: 'subj-physics',
    subjectName: 'Physics',
    form: 'Form 2',
    year: 2024,
    paperNumber: 'Paper 1 (End of Term 2)',
    category: 'End of Term',
    title: 'Form 2 Physics End of Term 2 Examination',
    description: 'Term 2 examination assessing moments of forces, center of gravity, equilibrium, and simple machines (pulleys and levers).',
    fileSizeMb: 1.3,
    downloadUrl: '/downloads/f2-phys-term2-2024.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Detailed marks for stating the principle of moments and calculating mechanical advantage and velocity ratio.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 285,
    uploadedAt: '2024-12-04',
    questionsExcerpt: [
      { qNumber: 1, text: 'State the Principle of Moments. A uniform meter rule is balanced at its 50 cm mark with a 20 N load at the 20 cm mark. Where must a 30 N load be placed?', marks: 5 },
      { qNumber: 2, text: 'Define mechanical advantage (MA) and velocity ratio (VR) of a machine.', marks: 3 }
    ]
  },
  // --- FORM 3 SECONDARY SCHOOL EXAMINATION PAPERS ---
  {
    id: 'paper-f3-math-term1-2024',
    subjectId: 'subj-math',
    subjectName: 'Mathematics',
    form: 'Form 3',
    year: 2024,
    paperNumber: 'Paper 1 (End of Term 1)',
    category: 'End of Term',
    title: 'Form 3 Mathematics End of Term 1 Examination',
    description: 'Senior secondary assessment covering quadratic equations, simultaneous equations, laws of indices, logarithms, and coordinate geometry.',
    fileSizeMb: 1.7,
    downloadUrl: '/downloads/f3-math-term1-2024.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Full marking scheme for algebraic manipulation, completing the square, and graphical coordinate solutions.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 360,
    uploadedAt: '2024-12-06',
    questionsExcerpt: [
      { qNumber: 1, text: 'Solve the simultaneous equations: 2x + 3y = 13 and 5x - 2y = 4.', marks: 4 },
      { qNumber: 2, text: 'Solve for x without using logarithm tables: log₁₀(x + 3) + log₁₀(x - 3) = log₁₀ 16.', marks: 4 },
      { qNumber: 3, text: 'Find the coordinates of the midpoint and the gradient of the line joining P(-3, 7) and Q(5, -1).', marks: 4 }
    ]
  },
  {
    id: 'paper-f3-chem-term2-2024',
    subjectId: 'subj-chem',
    subjectName: 'Chemistry',
    form: 'Form 3',
    year: 2024,
    paperNumber: 'Paper 1 (End of Term 2)',
    category: 'End of Term',
    title: 'Form 3 Chemistry End of Term 2 Examination',
    description: 'Stoichiometry, the mole concept, reacting masses, molar gas volume, chemical equilibrium, and redox reactions.',
    fileSizeMb: 1.6,
    downloadUrl: '/downloads/f3-chem-term2-2024.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Step-by-step scoring of mole conversions, balancing redox half-equations, and equilibrium shifts.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 320,
    uploadedAt: '2024-12-09',
    questionsExcerpt: [
      { qNumber: 1, text: 'Calculate the mass of copper(II) sulfate formed when 4.0 g of copper(II) oxide completely reacts with excess dilute sulfuric acid: CuO + H₂SO₄ → CuSO₄ + H₂O.', marks: 5 },
      { qNumber: 2, text: 'Define oxidation and reduction in terms of electron transfer and oxidation numbers.', marks: 4 }
    ]
  },
  {
    id: 'paper-f3-phys-mock-2024',
    subjectId: 'subj-physics',
    subjectName: 'Physics',
    form: 'Form 3',
    year: 2024,
    paperNumber: 'Paper 1 (Cluster Assessment)',
    category: 'Mock',
    title: 'Form 3 Secondary Schools Cluster Test - Physics',
    description: 'Joint secondary cluster assessment on kinematics, equations of uniformly accelerated motion, Newton laws, and electrical circuits.',
    fileSizeMb: 1.7,
    downloadUrl: '/downloads/f3-phys-mock-2024.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Formula substitution guidelines, circuit diagram evaluation, and unit conformity.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 305,
    uploadedAt: '2024-11-25',
    questionsExcerpt: [
      { qNumber: 1, text: 'A car accelerates uniformly from rest to 25 m/s in 10 seconds. Calculate its acceleration and the total distance covered.', marks: 5 },
      { qNumber: 2, text: 'Three resistors of 4 Ω, 6 Ω, and 12 Ω are connected in parallel across a 12 V battery. Calculate the effective resistance and the total circuit current.', marks: 5 }
    ]
  },
  {
    id: 'paper-f3-bio-promo-2024',
    subjectId: 'subj-bio',
    subjectName: 'Biology',
    form: 'Form 3',
    year: 2024,
    paperNumber: 'Paper 1 (End of Year Promotional)',
    category: 'End of Term',
    title: 'Form 3 Biology End of Year Promotional Examination',
    description: 'Senior promotional exam testing excretion and osmoregulation, nephron anatomy, mammalian nervous coordination, and plant tropisms.',
    fileSizeMb: 1.8,
    downloadUrl: '/downloads/f3-bio-promo-2024.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Nephron ultrafiltration and selective reabsorption marking points with clear biological keyword allocations.',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 315,
    uploadedAt: '2024-12-14',
    questionsExcerpt: [
      { qNumber: 1, text: 'Describe the processes of ultrafiltration and selective reabsorption in the human nephron.', marks: 6 },
      { qNumber: 2, text: 'Compare a reflex arc with a voluntary action, explaining why reflex actions protect the body from danger.', marks: 4 }
    ]
  },
  // --- FORM 4 SECONDARY SCHOOL CLUSTER MOCK & JOINT PAPERS ---
  {
    id: 'paper-f4-math-mock-2024',
    subjectId: 'subj-math',
    subjectName: 'Mathematics',
    form: 'Form 4',
    year: 2024,
    paperNumber: 'Paper 2 (District Mock)',
    category: 'Mock',
    title: 'District Joint Mock Examination - Mathematics Paper 2',
    description: 'Joint secondary school mock examination covering trigonometry, circle geometry theorems, probability, statistics, and 3D vectors.',
    fileSizeMb: 2.2,
    downloadUrl: '/downloads/f4-math-mock-2024.pdf',
    hasMarkingGuide: true,
    markingGuideSummary: 'Section A & B breakdown with detailed geometrical deduction reasons (e.g. angle at center is twice angle at circumference).',
    offlineAvailable: true,
    status: 'published',
    downloadCount: 450,
    uploadedAt: '2025-02-01',
    questionsExcerpt: [
      { qNumber: 1, text: 'Points A, B, and C lie on a circle center O. Angle AOC = 110°. Calculate the value of angle ABC and give a geometric reason.', marks: 4 },
      { qNumber: 2, text: 'A bag contains 5 red balls and 7 blue balls. Two balls are drawn at random without replacement. Calculate the probability that both balls are of different colors.', marks: 5 }
    ]
  }
];

export const INITIAL_EXAM_TIPS: ExamTip[] = [
  {
    id: 'tip-1',
    title: 'MANEB Science Calculation Method: GRASP',
    category: 'Mathematics & Sciences',
    summary: 'Never lose partial marks on physics and chemistry numerical problems.',
    details: 'Always follow the GRASP protocol:\n1. **G**iven: List all variables with correct SI units (e.g., m = 2 kg, v = 10 m/s).\n2. **R**equired: Write down what variable you are solving for (e.g., Kinetic Energy = ?).\n3. **A**pproach/Formula: State the base formula explicitly (e.g., KE = 1/2 m v²).\n4. **S**ubstitute: Plug the numbers into the equation.\n5. **P**rovide final answer: Include the numerical value and correct SI unit (Joules). Even if your calculation slips, MANEB awards formula and substitution marks!',
    applicableForms: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    author: 'MANEB Senior Examiner Panel',
    icon: 'Brain'
  },
  {
    id: 'tip-2',
    title: 'Mastering the 3-Hour MSCE Examination Clock',
    category: 'Time Management',
    summary: 'How to allocate minutes per mark to avoid leaving unanswered questions.',
    details: 'In a 100-mark 2.5 hour (150 minutes) paper:\n- Allocate **1.2 minutes per mark**.\n- A 6-mark question should take at most 7 minutes.\n- Reserve the first 10 minutes for reading the entire paper and selecting Section B optional questions wisely.\n- Leave the last 15 minutes to re-check calculations and verify that all question numbers are clearly written.',
    applicableForms: ['Form 3', 'Form 4'],
    author: 'StudyMaster Academic Advisors',
    icon: 'Clock'
  },
  {
    id: 'tip-3',
    title: 'Biology Diagram Precision: 5 Golden Rules',
    category: 'General Strategy',
    summary: 'Avoid zero marks on cellular and anatomical sketches.',
    details: 'MANEB biological drawing marking criteria are strict:\n1. **Sharp HB Pencil Only**: Never use ink, gel pens or felt tips.\n2. **Clean Continuous Lines**: No feathering, sketching, or fuzzy lines.\n3. **No Shading**: Shading is penalized. Use stippling (dots) if representing density.\n4. **Ruler-Drawn Horizontal Label Lines**: Touch the specific organelle directly; do not add arrowheads unless indicating direction of flow.\n5. **State Magnification and Title**: Always place an underlined heading and scale.',
    applicableForms: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    author: 'National Science Curriculum Team',
    icon: 'FileCheck'
  },
  {
    id: 'tip-4',
    title: 'English Composition: The PEEL Technique',
    category: 'Essay Writing',
    summary: 'Score 18+ out of 20 on your MANEB essay body paragraphs.',
    details: 'Each body paragraph should follow:\n- **P (Point)**: State the topic sentence clearly.\n- **E (Evidence)**: Provide a specific real-world or textual example.\n- **E (Explanation)**: Explain how this evidence proves your central thesis.\n- **L (Link)**: Conclude the paragraph and bridge seamlessly to the next thought.',
    applicableForms: ['Form 2', 'Form 3', 'Form 4'],
    author: 'Head of English, Chichiri Secondary School',
    icon: 'BookOpen'
  }
];

export const INITIAL_PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: 'monthly',
    name: '1-Month All-Access Pass',
    durationMonths: 1,
    priceMWK: 600,
    originalPriceMWK: 1200,
    features: [
      '100% Ad-Free uninterrupted study experience',
      'Unlimited StudyMaster Assist queries across all subjects',
      'Full comprehensive access to all notes, lessons & past papers',
      'Exclusive worked examples with complete step-by-step steps',
      'Official MANEB past paper marking guides & model answers',
      'Custom Focus Mode ambient study sounds & productivity tracking'
    ],
    status: 'active'
  },
  {
    id: 'two_month',
    name: '2-Month Term Saver Pass',
    durationMonths: 2,
    priceMWK: 1000,
    originalPriceMWK: 2000,
    discountBadge: 'Best Value',
    features: [
      'Everything included in the 1-Month Plan',
      'Full Term coverage leading up to terminal & national exams',
      'Priority StudyMaster Assist syllabus retrieval',
      'Complete comprehensive coverage across all 4 Forms',
      'Special MSCE & JCE National Mock examination packs',
      'Exclusive Malawi Top Scholar Gold honor badge'
    ],
    status: 'active'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'usr-chifundo', username: 'Chifundo_Phiri', avatarId: 'avatar-1', weeklyPoints: 1420, totalPoints: 4850, activeForm: 'Form 4', badgeCount: 7, topBadge: 'Malawi Math Champion' },
  { rank: 2, userId: 'usr-tamandani', username: 'Tamandani_Banda', avatarId: 'avatar-2', weeklyPoints: 1290, totalPoints: 4210, activeForm: 'Form 4', badgeCount: 6, topBadge: 'Laboratory Genius' },
  { rank: 3, userId: 'usr-kumbukani', username: 'Kumbukani_Moyo', avatarId: 'avatar-3', weeklyPoints: 1150, totalPoints: 3940, activeForm: 'Form 3', badgeCount: 5, topBadge: 'MANEB Paper Conqueror' },
  { rank: 4, userId: 'usr-zione', username: 'Zione_Chirwa', avatarId: 'avatar-6', weeklyPoints: 1040, totalPoints: 3600, activeForm: 'Form 2', badgeCount: 5, topBadge: 'Quiz Master' },
  { rank: 5, userId: 'usr-gift', username: 'Gift_Kamanga', avatarId: 'avatar-5', weeklyPoints: 980, totalPoints: 3120, activeForm: 'Form 3', badgeCount: 4, topBadge: 'Deep Focus Pioneer' },
  { rank: 6, userId: 'usr-memory', username: 'Memory_Gondwe', avatarId: 'avatar-4', weeklyPoints: 890, totalPoints: 2890, activeForm: 'Form 4', badgeCount: 4, topBadge: 'Dedicated Scholar' },
  { rank: 7, userId: 'usr-stanley', username: 'Stanley_Nyirenda', avatarId: 'avatar-7', weeklyPoints: 810, totalPoints: 2640, activeForm: 'Form 2', badgeCount: 3, topBadge: 'Quiz Master' },
  { rank: 8, userId: 'usr-elinat', username: 'Elinat_Mvula', avatarId: 'avatar-8', weeklyPoints: 750, totalPoints: 2420, activeForm: 'Form 1', badgeCount: 3, topBadge: 'First Step to Distinction' },
  { rank: 9, userId: 'usr-tiwonge', username: 'Tiwonge_Mkandawire', avatarId: 'avatar-2', weeklyPoints: 690, totalPoints: 2280, activeForm: 'Form 3', badgeCount: 3, topBadge: 'Laboratory Genius' },
  { rank: 10, userId: 'usr-taonga', username: 'Taonga_Tembo', avatarId: 'avatar-1', weeklyPoints: 640, totalPoints: 2150, activeForm: 'Form 4', badgeCount: 2, topBadge: 'MANEB Paper Conqueror' }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '🇲🇼 2025 MSCE & JCE Revision Sprint Now Active!',
    message: 'New worked examples, marking guides, and practice quizzes for Mathematics, Physics, Chemistry, and Biology are now published across all forms.',
    type: 'exam_alert',
    targetForm: 'All Forms',
    createdAt: '2026-03-20',
    active: true
  },
  {
    id: 'ann-2',
    title: '📚 Complete Secondary Curriculum Library Ready',
    message: 'All syllabus notes, worked step-by-step examples, and MANEB past papers are up to date and ready for your revision!',
    type: 'info',
    targetForm: 'All Forms',
    createdAt: '2026-03-18',
    active: true
  }
];

export const INITIAL_AD_CONFIG: AdConfiguration = [
  {
    enabled: true,
    bannerAdFrequencyMinutes: 15,
    rewardedStudyAdMinutes: 30,
    showOnDashboard: true,
    showOnSubjectBrowser: true,
    sponsorName: 'National Bank of Malawi Mo626 Student Pay',
    sponsorTagline: 'Empowering Malawian Scholars with Fast, Safe Digital Study Transactions.',
    sponsorCtaUrl: 'https://natbank.co.mw'
  }
][0];

export const INITIAL_PAYMENT_METHODS: PaymentMethodsConfig = {
  airtelNumber: '+265 999 123 456',
  airtelName: 'StudyMaster Malawi (Joseph Chokhapo)',
  airtelAccountName: 'StudyMaster Malawi (Joseph Chokhapo)',
  tnmNumber: '+265 888 123 456',
  tnmName: 'StudyMaster Malawi Educational Services',
  tnmAccountName: 'StudyMaster Malawi Educational Services',
  monthlyPriceMWK: 600,
  twoMonthPriceMWK: 1000,
  bankAccounts: [
    {
      id: 'bank-1',
      bankName: 'National Bank of Malawi (NBM)',
      accountName: 'StudyMaster Malawi Education',
      accountNumber: '1004829104',
      branch: 'Victoria Avenue Service Centre, Blantyre',
      instructions: 'Use your StudyMaster username or phone number as the payment reference.'
    },
    {
      id: 'bank-2',
      bankName: 'Standard Bank Malawi',
      accountName: 'StudyMaster Malawi Digital Academy',
      accountNumber: '910003849102',
      branch: 'Capital City Branch, Lilongwe',
      instructions: 'Deposit or transfer using Mo626 or 247 Online banking.'
    },
    {
      id: 'bank-3',
      bankName: 'FDH Bank',
      accountName: 'StudyMaster Learning Technologies',
      accountNumber: '145000092837',
      branch: 'Limbe Branch, Blantyre',
      instructions: 'FDH Mobile / 525 wallet transfer supported.'
    }
  ],
  instructionsNote: 'After completing your transaction via PayChangu, enter your transaction reference number and upload your receipt screenshot below for prompt verification & activation.'
};

export const INITIAL_COMMUNITY_LINKS: CommunityLinksConfig = {
  facebookUrl: 'https://facebook.com/studymastermalawi',
  facebookPageName: 'StudyMaster Malawi Official Community',
  whatsappGroupUrl: 'https://chat.whatsapp.com/StudyMasterMalawiStudents',
  whatsappGroupName: 'StudyMaster Malawi National Study Group (MSCE & JCE)',
  supportPhone: '+265 888 123 456',
  supportEmail: 'support@studymastermalawi.mw',
  enabled: true
};

export const INITIAL_MANEB_TIMETABLE: ManebTimetableItem[] = [
  {
    id: 'msce-math-1',
    examLevel: 'MSCE',
    code: 'M011/1',
    subject: 'Mathematics',
    paper: 'Paper 1 (Core & Non-Calculator)',
    date: '2026-06-23',
    dayOfWeek: 'Tuesday',
    session: 'Morning (08:00 - 10:30)',
    durationMinutes: 150,
    instructions: 'Answer all questions in Section A and 3 questions from Section B. Full working must be clearly shown.',
    requiredEquipment: ['Mathematical Set', 'Blue/Black Pen', 'Pencil', 'Ruler']
  },
  {
    id: 'msce-math-2',
    examLevel: 'MSCE',
    code: 'M011/2',
    subject: 'Mathematics',
    paper: 'Paper 2 (Calculations & Statistics)',
    date: '2026-06-25',
    dayOfWeek: 'Thursday',
    session: 'Morning (08:00 - 10:30)',
    durationMinutes: 150,
    instructions: 'Silent non-programmable electronic calculators and 4-figure mathematical tables allowed.',
    requiredEquipment: ['Non-Programmable Calculator', 'Mathematical Set', 'Graph Paper']
  },
  {
    id: 'msce-phy-1',
    examLevel: 'MSCE',
    code: 'M031/1',
    subject: 'Physics',
    paper: 'Paper 1 (Theory & Structured)',
    date: '2026-06-30',
    dayOfWeek: 'Tuesday',
    session: 'Morning (08:00 - 10:30)',
    durationMinutes: 150,
    instructions: 'Constants provided on page 2. State formulas before substitution.',
    requiredEquipment: ['Scientific Calculator', 'Clear 30cm Ruler', 'Pencil for circuit diagrams']
  },
  {
    id: 'msce-chem-1',
    examLevel: 'MSCE',
    code: 'M032/1',
    subject: 'Chemistry',
    paper: 'Paper 1 (Theory & Practical Analysis)',
    date: '2026-07-01',
    dayOfWeek: 'Wednesday',
    session: 'Morning (08:00 - 10:30)',
    durationMinutes: 150,
    instructions: 'Periodic table provided. State symbols required for full marks in balanced equations.',
    requiredEquipment: ['Scientific Calculator', 'Blue/Black Pen', 'Pencil']
  },
  {
    id: 'msce-bio-1',
    examLevel: 'MSCE',
    code: 'M021/1',
    subject: 'Biology',
    paper: 'Paper 1 (Theory & Physiology)',
    date: '2026-07-02',
    dayOfWeek: 'Thursday',
    session: 'Morning (08:00 - 10:30)',
    durationMinutes: 150,
    instructions: 'Drawings must be done in sharp pencil. No shading allowed. Clear horizontal label lines.',
    requiredEquipment: ['HB Pencil', 'Clean Eraser', 'Sharpener', 'Clear Ruler']
  },
  {
    id: 'msce-eng-1',
    examLevel: 'MSCE',
    code: 'M001/1',
    subject: 'English',
    paper: 'Paper 1 (Composition & Summary)',
    date: '2026-06-22',
    dayOfWeek: 'Monday',
    session: 'Morning (08:00 - 10:30)',
    durationMinutes: 120,
    instructions: 'Write clearly and observe paragraphing, punctuation, and word count constraints.',
    requiredEquipment: ['Blue/Black Ballpoint Pen']
  },
  {
    id: 'jce-math-1',
    examLevel: 'JCE',
    code: 'J011/1',
    subject: 'Mathematics',
    paper: 'Paper 1 (General Mathematics)',
    date: '2026-06-15',
    dayOfWeek: 'Monday',
    session: 'Morning (08:00 - 10:30)',
    durationMinutes: 120,
    instructions: 'Answer all questions in the spaces provided.',
    requiredEquipment: ['Mathematical Set', 'Blue/Black Pen', 'Pencil']
  }
];

export const INITIAL_CHIEF_EXAMINER_INSIGHTS: ChiefExaminerInsight[] = [
  {
    id: 'insight-math-1',
    subjectId: 'subj-math',
    subjectName: 'Mathematics',
    form: 'Form 4',
    year: 2025,
    title: 'Chief Examiner Report: Quadratic Equations & Trigonometry Analysis',
    paperCategory: 'MSCE Paper 1 & Paper 2',
    keyWeaknessesReported: [
      'Candidates frequently make sign errors when applying the quadratic formula: x = (-b ± √(b² - 4ac)) / (2a), particularly when b is negative.',
      'Premature rounding in multi-step trigonometric bearing questions causes loss of final accuracy marks (A1).',
      'Failure to state intermediate equations before substituting values in simultaneous word problems.'
    ],
    scoringPitfalls: [
      'Omitting degree symbol (°) on angles results in penalty on final answers.',
      'Not writing quadratic equations in standard ax² + bx + c = 0 form prior to factorization.',
      'Failing to reject negative solutions in practical measurement or geometric word problems.'
    ],
    examinerRecommendations: [
      'Always retain at least 4 significant figures in intermediate calculations before writing the final answer to 3 significant figures.',
      'Show all factoring steps clearly. An unsubstantiated correct answer only scores 1 mark out of 4.',
      'Draw large, clear labelled diagrams with North arrows for all three-figure bearing questions.'
    ],
    documentName: 'MANEB_Math_Chief_Examiner_Report_2025.pdf',
    documentUrl: 'https://studymastermalawi.mw/docs/examiner/math-2025.pdf',
    imageCaption: 'Official MANEB marking key breakdown for 6-mark quadratic graph problem.',
    status: 'published',
    createdAt: '2026-02-10'
  },
  {
    id: 'insight-bio-1',
    subjectId: 'subj-bio',
    subjectName: 'Biology',
    form: 'Form 4',
    year: 2025,
    title: 'Chief Examiner Report: Biological Drawings & Genetics Problem Solving',
    paperCategory: 'MSCE Paper 1 & Paper 3 (Practical)',
    keyWeaknessesReported: [
      'Shading diagrams: Candidates still lose all technique marks by using pencil shading instead of stippling.',
      'Label lines crossing each other or with arrowheads pointing the wrong direction.',
      'Punnett squares missing parental phenotypes, parental genotypes, and gamete circles.'
    ],
    scoringPitfalls: [
      'Using ink or gel pens on biological drawings leads to automatic forfeiture of drawing marks.',
      'Failing to underline scientific binomial nomenclature (e.g. Zea mays).',
      'Confusing phenotypic ratio (e.g. 3 Tall : 1 Dwarf) with genotypic ratio (1 TT : 2 Tt : 1 tt).'
    ],
    examinerRecommendations: [
      'Use a sharp HB pencil only. Draw continuous, single, smooth outlines without feathering.',
      'Label lines must be drawn with a ruler horizontally and touch the exact structure.',
      'Always include the title at the top (underlined) and magnification (e.g. x200) at the bottom.'
    ],
    documentName: 'MANEB_Biology_Practical_Guidelines_2025.pdf',
    documentUrl: 'https://studymastermalawi.mw/docs/examiner/bio-drawings-2025.pdf',
    imageCaption: 'Example of Grade 1 Biological Drawing with perfect horizontal ruler lines.',
    status: 'published',
    createdAt: '2026-02-15'
  },
  {
    id: 'insight-phy-1',
    subjectId: 'subj-physics',
    subjectName: 'Physics',
    form: 'Form 4',
    year: 2025,
    title: 'Chief Examiner Report: Electrical Circuit Calculations & Mechanics Analysis',
    paperCategory: 'MSCE Paper 1 (Physics Theory)',
    keyWeaknessesReported: [
      'Missing SI units on calculated values (e.g. stating 4.5 instead of 4.5 Amperes or 4.5 A).',
      'Confusing potential difference (voltage) in series vs parallel circuits.',
      'Incorrect algebraic manipulation of the kinetic energy formula KE = 1/2 m v² when solving for velocity.'
    ],
    scoringPitfalls: [
      'Writing uppercase letters for lowercase unit symbols (e.g. writing "SEC" instead of "s" for seconds).',
      'Not stating the primary formula (e.g. V = IR or Q = It) before numerical calculation.',
      'Omitting directional arrows on ray diagrams and magnetic field lines.'
    ],
    examinerRecommendations: [
      'Always start calculation problems with: (1) Formula, (2) Substitution with units, (3) Final answer with correct SI unit.',
      'Practice drawing parallel and series circuit diagrams with proper voltmeter and ammeter positions.',
      'Memorize standard physical constants from page 2 of the MANEB question paper.'
    ],
    documentName: 'MANEB_Physics_Examiner_Insights.pdf',
    documentUrl: 'https://studymastermalawi.mw/docs/examiner/physics-2025.pdf',
    imageCaption: 'Circuit resistor network rubric and kinematics calculation checklist.',
    status: 'published',
    createdAt: '2026-02-20'
  },
  {
    id: 'insight-chem-1',
    subjectId: 'subj-chem',
    subjectName: 'Chemistry',
    form: 'Form 4',
    year: 2025,
    title: 'Chief Examiner Report: Chemical Stoichiometry & Acid-Base Titrations',
    paperCategory: 'MSCE Paper 1 (Chemistry Theory & Practical Analysis)',
    keyWeaknessesReported: [
      'Unbalanced chemical equations and omitting state symbols: (s), (l), (g), (aq).',
      'Incorrect conversion from cm³ to dm³ (1 dm³ = 1000 cm³) in molarity calculations.',
      'Confusing ionic bonding (electron transfer) with covalent bonding (electron sharing).'
    ],
    scoringPitfalls: [
      'Forgetting that diatomics like Oxygen and Hydrogen exist as O₂ and H₂ in chemical equations.',
      'Failing to show mole ratios from the balanced chemical equation before multiplying.',
      'Writing charges outside brackets incorrectly in Lewis dot-and-cross diagrams.'
    ],
    examinerRecommendations: [
      'Always balance both atoms and charges across reactant and product sides.',
      'Use the mole triangle formulas: n = m / M and n = C × V (dm³).',
      'Learn the solubility rules to quickly identify precipitate state symbols.'
    ],
    documentName: 'MANEB_Chemistry_Examiner_Insights.pdf',
    documentUrl: 'https://studymastermalawi.mw/docs/examiner/chemistry-2025.pdf',
    imageCaption: 'Stoichiometry mole roadmap and titration volumetric calculation scoring grid.',
    status: 'published',
    createdAt: '2026-02-22'
  }
];

export const INITIAL_MARKING_SIMULATOR_ITEMS: MarkingSchemeSimItem[] = [
  {
    id: 'sim-math-1',
    subject: 'Mathematics',
    form: 'Form 4',
    paper: 'MSCE Paper 1 Section B (Question 14)',
    questionText: 'Solve the quadratic equation by factorisation:\n2x² - 7x + 3 = 0\n(Total: 4 Marks)',
    totalMarks: 4,
    modelAnswer: 'Step 1: Product = 2 × 3 = 6, Sum = -7. Factors are -6 and -1.\nStep 2: Split middle term: 2x² - 6x - x + 3 = 0\nStep 3: Factor by grouping: 2x(x - 3) - 1(x - 3) = 0\nStep 4: (2x - 1)(x - 3) = 0\nStep 5: x = 1/2 or x = 3',
    rubricSteps: [
      {
        stepNumber: 1,
        criterion: 'Identifying correct factor pair (-6 and -1) or splitting middle term into 2x² - 6x - x + 3',
        markType: 'M1 (Method)',
        marksAwarded: 1,
        examinerNote: 'Award 1 mark for correct algebraic grouping attempt.'
      },
      {
        stepNumber: 2,
        criterion: 'Factoring out common terms: 2x(x - 3) - 1(x - 3) = 0',
        markType: 'M1 (Method)',
        marksAwarded: 1,
        examinerNote: 'Must show the binomial (x - 3) extracted cleanly.'
      },
      {
        stepNumber: 3,
        criterion: 'First correct root: x = 1/2 or 0.5',
        markType: 'A1 (Accuracy)',
        marksAwarded: 1,
        examinerNote: 'Award accuracy mark only if previous method marks were obtained.'
      },
      {
        stepNumber: 4,
        criterion: 'Second correct root: x = 3',
        markType: 'A1 (Accuracy)',
        marksAwarded: 1,
        examinerNote: 'Both solutions must be clearly stated.'
      }
    ],
    commonStudentErrors: [
      'Guessing roots without showing factorization (scores max 1 mark out of 4).',
      'Sign error in factors (e.g. writing +6 and +1 instead of -6 and -1).',
      'Forgetting to equate each bracket to zero: 2x - 1 = 0 => x = 1/2.'
    ]
  },
  {
    id: 'sim-bio-1',
    subject: 'Biology',
    form: 'Form 4',
    paper: 'MSCE Paper 2 Section A (Question 3)',
    questionText: 'Explain how the structure of a villus in the human small intestine is adapted for efficient absorption of digested food substances.\n(Total: 5 Marks)',
    totalMarks: 5,
    modelAnswer: '1. One-cell thick epithelium (thin surface) provides a short diffusion distance for nutrients.\n2. Microvilli on epithelial cells vastly increase surface area for maximum absorption rate.\n3. Dense network of blood capillaries rapidly transports absorbed glucose and amino acids, maintaining a steep concentration gradient.\n4. Central lacteal absorbs and transports fatty acids and glycerol into the lymphatic system.\n5. Numerous mitochondria in epithelial cells provide ATP energy for active transport of minerals and glucose.',
    rubricSteps: [
      {
        stepNumber: 1,
        criterion: 'Thin epithelium (one cell thick) -> reduces diffusion distance',
        markType: 'B1 (Independent Fact)',
        marksAwarded: 1,
        examinerNote: 'Must link the structural feature (thin wall) to its functional benefit (short diffusion pathway).'
      },
      {
        stepNumber: 2,
        criterion: 'Microvilli / large number of villi -> increases surface area',
        markType: 'B1 (Independent Fact)',
        marksAwarded: 1,
        examinerNote: 'Mentioning large surface area alone without feature earns 0.'
      },
      {
        stepNumber: 3,
        criterion: 'Dense capillary network -> rapid transport / maintains steep concentration gradient',
        markType: 'B1 (Independent Fact)',
        marksAwarded: 1,
        examinerNote: 'Concentration gradient must be clearly articulated.'
      },
      {
        stepNumber: 4,
        criterion: 'Presence of lacteal -> absorption & transport of lipids/fatty acids/glycerol',
        markType: 'B1 (Independent Fact)',
        marksAwarded: 1,
        examinerNote: 'Award 1 mark for specific identification of lacteal function.'
      },
      {
        stepNumber: 5,
        criterion: 'Abundant mitochondria -> produces ATP for active uptake',
        markType: 'B1 (Independent Fact)',
        marksAwarded: 1,
        examinerNote: 'Must reference ATP or active transport.'
      }
    ],
    commonStudentErrors: [
      'Listing features without stating their functional importance (e.g. "It has capillaries" without explaining concentration gradient).',
      'Confusing lacteal with blood capillaries.',
      'Claiming food is digested in the villus rather than absorbed.'
    ]
  }
];

export const INITIAL_REPORT_ISSUES: ReportIssue[] = [
  {
    id: 'rep-101',
    userId: 'usr-kondwani',
    username: 'kondwani',
    category: 'Content Error',
    subjectId: 'subj-math',
    subjectName: 'Mathematics',
    topicId: 'top-math-1',
    topicTitle: 'Algebraic Expressions & Factorisation',
    title: 'Typo in Worked Example 2 Step 3',
    description: 'In step 3 of example 2 on grouping, the minus sign before 3b was typed as an equals sign. The solution is still correct but looks confusing to junior students.',
    status: 'resolved',
    adminReply: 'Thank you Kondwani! We have corrected the minus sign in version 2 of the note and published the update.',
    resolvedBy: 'studymaster_admin',
    createdAt: '2026-03-21T09:30:00Z',
    updatedAt: '2026-03-21T11:00:00Z'
  },
  {
    id: 'rep-102',
    userId: 'usr-chisomo',
    username: 'chisomo_chem',
    category: 'Quiz Question Issue',
    subjectId: 'subj-bio',
    subjectName: 'Biology',
    topicId: 'top-bio-1',
    topicTitle: 'Cell Structure & Organisation',
    title: 'Question 4 option B clarification',
    description: 'Question 4 asks about plant cell walls. Option B and Option C seem to both state cellulose composition. Could we specify primary vs secondary wall?',
    status: 'pending',
    createdAt: '2026-03-24T14:15:00Z'
  }
];
