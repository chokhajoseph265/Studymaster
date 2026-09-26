import { Lesson, PracticeQuestion, Quiz } from '../../types';

export const FORM_1_CHEMISTRY_LESSONS: Lesson[] = [
  {
    id: 'lesson-chem-f1-t1',
    topicId: 'topic-chem-f1-t1-intro',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Lesson 1: Laboratory Safety, Apparatus and Measurement Mastery',
    introduction: 'Welcome to Form 1 Chemistry! In this fundamental lesson, you will learn why chemistry matters in Malawi, essential lab safety rules, how to read a triple beam balance and measuring cylinder, and the 5 steps of scientific inquiry.',
    explanation: 'Chemistry investigates matter, its transformations, and energy changes. The laboratory is where hypotheses are tested, requiring rigorous adherence to safety rules and precise measurement in standard SI units.',
    importantPoints: [
      'Glassware must always be held with two hands.',
      'Never taste or directly inhale laboratory chemicals.',
      'Liquid volume in a measuring cylinder is always measured from the bottom of the meniscus at eye level.',
      'Scientific inquiry follows: 1. Problem → 2. Hypothesis → 3. Experiment → 4. Analysis → 5. Conclusion.'
    ],
    summary: 'Mastering safety rules, SI unit prefixes, and experimental methods prepares you for success throughout the chemistry syllabus.',
    examples: [],
    version: 1,
    status: 'published',
    updatedAt: '2026-09-01'
  },
  {
    id: 'lesson-chem-f1-t3',
    topicId: 'topic-chem-f1-t3-matter',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Lesson 2: Matter, Elements, Solutions and Separation Techniques',
    introduction: 'Explore how particles are arranged in solids, liquids, and gases, how diffusion occurs, and how chemists separate complex mixtures into pure substances.',
    explanation: 'All matter is particulate. Pure substances consist of single elements or definite compounds, while mixtures can be separated using physical techniques like filtration, fractional distillation, and paper chromatography.',
    importantPoints: [
      'Solids vibrate in fixed positions, liquids slide past one another, and gases move randomly at high velocities.',
      'Fractional distillation separates miscible liquids (e.g. ethanol at 78°C and water at 100°C) using a fractionating column.',
      'Paper chromatography separates dyes using a stationary phase (filter paper) and mobile phase (solvent).'
    ],
    summary: 'Physical separation techniques rely on differences in boiling point, solubility, particle size, and magnetic properties.',
    examples: [],
    version: 1,
    status: 'published',
    updatedAt: '2026-09-01'
  },
  {
    id: 'lesson-chem-f1-t4',
    topicId: 'topic-chem-f1-t4-atomic',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Lesson 3: Atomic Structure, Electron Shells and Isotopes',
    introduction: 'Understand the building blocks of matter: protons, neutrons, and electrons, how they are arranged in shells, and why isotopes exist.',
    explanation: 'An atom has a central nucleus surrounded by electron shells. The 2.8.8.2 electron rule dictates chemical bonding. Isotopes have identical proton numbers but different neutron numbers.',
    importantPoints: [
      'Protons (+1, 1 amu) and Neutrons (0, 1 amu) reside in the nucleus.',
      'Electrons (-1, ~0 mass) occupy shells (maximum 2 in 1st, 8 in 2nd, 8 in 3rd).',
      'Relative Atomic Mass (RAM) is calculated as a weighted average of isotopic abundances.'
    ],
    summary: 'Electron configurations determine chemical properties and position in the Periodic Table.',
    examples: [],
    version: 1,
    status: 'published',
    updatedAt: '2026-09-01'
  },
  {
    id: 'lesson-chem-f1-t6',
    topicId: 'topic-chem-f1-t6-reactions',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Lesson 4: Balancing Equations and Mass Calculations',
    introduction: 'Learn how to write and balance chemical equations, verify the Law of Conservation of Matter, and calculate reactant masses and percentage composition.',
    explanation: 'Chemical reactions rearrange atoms without creating or destroying matter. Coefficients balance the number of atoms on both sides of the equation.',
    importantPoints: [
      'Balance chemical equations only by multiplying coefficients, never by changing subscripts.',
      'Total mass of reactants must equal total mass of products.',
      'Percentage composition by mass = (mass of element in formula / RFM) × 100%.'
    ],
    summary: 'Stoichiometry enables precise calculation of reactants needed and products formed in chemical industry.',
    examples: [],
    version: 1,
    status: 'published',
    updatedAt: '2026-09-01'
  }
];

export const FORM_1_CHEMISTRY_QUESTIONS: PracticeQuestion[] = [
  // Topic 1 Questions
  {
    id: 'q-chem-f1-1',
    topicId: 'topic-chem-f1-t1-intro',
    subjectId: 'subj-chem',
    form: 'Form 1',
    question: 'Which branch of chemistry deals with the study of carbon compounds, excluding simple oxides and carbonates?',
    options: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Analytical Chemistry'],
    correctAnswerIndex: 1,
    explanation: 'Organic chemistry is specifically the study of carbon-containing compounds (excluding oxides of carbon and carbonates).',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  },
  {
    id: 'q-chem-f1-2',
    topicId: 'topic-chem-f1-t1-intro',
    subjectId: 'subj-chem',
    form: 'Form 1',
    question: 'How should the volume of a liquid in a glass measuring cylinder be read?',
    options: [
      'At the top of the meniscus looking downwards',
      'At the bottom of the meniscus at eye level',
      'At the middle of the liquid column from above',
      'From the highest point the liquid touches the glass'
    ],
    correctAnswerIndex: 1,
    explanation: 'Liquid volume in a measuring cylinder must always be read from the bottom of the concave meniscus with the eye positioned horizontally at the same level.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  },
  {
    id: 'q-chem-f1-3',
    topicId: 'topic-chem-f1-t1-intro',
    subjectId: 'subj-chem',
    form: 'Form 1',
    question: 'What is the correct sequence of steps in the scientific method of investigation?',
    options: [
      'Conclusion → Experiment → Problem → Hypothesis → Analysis',
      'Identify Problem → Formulate Hypothesis → Test Hypothesis (Experiment) → Analyse Results → Conclusion',
      'Hypothesis → Conclusion → Problem → Experiment → Analysis',
      'Experiment → Identify Problem → Hypothesis → Analysis → Conclusion'
    ],
    correctAnswerIndex: 1,
    explanation: 'Scientific inquiry begins with identifying a problem, proposing a hypothesis, testing via experimentation, analyzing data, and drawing a conclusion.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  },

  // Topic 2 Questions
  {
    id: 'q-chem-f1-4',
    topicId: 'topic-chem-f1-t2-math',
    subjectId: 'subj-chem',
    form: 'Form 1',
    question: 'How many significant figures are in the number 0.00890?',
    options: ['5', '2', '3', '6'],
    correctAnswerIndex: 2,
    explanation: 'Leading zeros (0.00) are not significant. The digits 8, 9 and the trailing zero after decimal (0) are significant, giving 3 significant figures.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  },
  {
    id: 'q-chem-f1-5',
    topicId: 'topic-chem-f1-t2-math',
    subjectId: 'subj-chem',
    form: 'Form 1',
    question: 'Express 0.00067 in standard scientific notation.',
    options: ['6.7 × 10⁻⁴', '6.7 × 10⁴', '67 × 10⁻⁵', '0.67 × 10⁻³'],
    correctAnswerIndex: 0,
    explanation: 'Moving the decimal point 4 places to the right gives 6.7 × 10⁻⁴.',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  },

  // Topic 3 Questions
  {
    id: 'q-chem-f1-6',
    topicId: 'topic-chem-f1-t3-matter',
    subjectId: 'subj-chem',
    form: 'Form 1',
    question: 'Which method is used in laboratories to separate a mixture of ethanol and water?',
    options: ['Simple Filtration', 'Paper Chromatography', 'Fractional Distillation', 'Magnetism'],
    correctAnswerIndex: 2,
    explanation: 'Ethanol (boiling point 78°C) and water (boiling point 100°C) are miscible liquids with different boiling points separated by fractional distillation.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  },
  {
    id: 'q-chem-f1-7',
    topicId: 'topic-chem-f1-t3-matter',
    subjectId: 'subj-chem',
    form: 'Form 1',
    question: 'What is the Latin name and chemical symbol for Sodium?',
    options: ['Kalium (K)', 'Natrium (Na)', 'Ferrum (Fe)', 'Cuprum (Cu)'],
    correctAnswerIndex: 1,
    explanation: 'Sodium derives its chemical symbol Na from its Latin name Natrium.',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  },

  // Topic 4 Questions
  {
    id: 'q-chem-f1-8',
    topicId: 'topic-chem-f1-t4-atomic',
    subjectId: 'subj-chem',
    form: 'Form 1',
    question: 'A sodium atom (Na) has atomic number 11. What is its electron configuration?',
    options: ['2.9', '2.8.1', '2.8.8.1', '2.2.7'],
    correctAnswerIndex: 1,
    explanation: 'The 1st shell holds 2 electrons, the 2nd holds 8, and the remaining 1 occupies the 3rd shell (2.8.1).',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  },
  {
    id: 'q-chem-f1-9',
    topicId: 'topic-chem-f1-t4-atomic',
    subjectId: 'subj-chem',
    form: 'Form 1',
    question: 'Isotopes of the same element have:',
    options: [
      'Same mass number but different atomic number',
      'Same atomic number (protons) but different mass number (neutrons)',
      'Different number of protons and electrons',
      'Completely different chemical properties'
    ],
    correctAnswerIndex: 1,
    explanation: 'Isotopes have the same number of protons (atomic number Z) and electrons, but differ in the number of neutrons in their nucleus.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  },

  // Topic 5 Questions
  {
    id: 'q-chem-f1-10',
    topicId: 'topic-chem-f1-t5-periodic',
    subjectId: 'subj-chem',
    form: 'Form 1',
    question: 'Which family of elements in the Periodic Table contains Fluorine, Chlorine, Bromine, and Iodine?',
    options: ['Alkali Metals', 'Alkaline Earth Metals', 'Halogens', 'Noble Gases'],
    correctAnswerIndex: 2,
    explanation: 'Group VII elements (F, Cl, Br, I) are known as the halogens ("salt formers").',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  },

  // Topic 6 Questions
  {
    id: 'q-chem-f1-11',
    topicId: 'topic-chem-f1-t6-reactions',
    subjectId: 'subj-chem',
    form: 'Form 1',
    question: 'What is the balanced form of the equation: Mg + O₂ → MgO?',
    options: ['Mg + O₂ → MgO₂', '2Mg + O₂ → 2MgO', 'Mg₂ + O₂ → 2MgO', '2Mg + 2O₂ → 2MgO'],
    correctAnswerIndex: 1,
    explanation: 'Placing a coefficient 2 before Mg and 2 before MgO balances both Magnesium (2) and Oxygen (2) atoms without changing chemical formulas.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  },
  {
    id: 'q-chem-f1-12',
    topicId: 'topic-chem-f1-t6-reactions',
    subjectId: 'subj-chem',
    form: 'Form 1',
    question: 'Calculate the percentage by mass of Calcium in CaCO₃ (RAM: Ca=40, C=12, O=16).',
    options: ['12%', '48%', '40%', '100%'],
    correctAnswerIndex: 2,
    explanation: 'RFM of CaCO₃ = 40 + 12 + 48 = 100 amu. % Ca = (40 / 100) × 100% = 40%.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  },

  // Topic 7 Questions
  {
    id: 'q-chem-f1-13',
    topicId: 'topic-chem-f1-t7-organic',
    subjectId: 'subj-chem',
    form: 'Form 1',
    question: 'Which petroleum fraction is primarily used as fuel for jet aircraft and domestic cooking stoves?',
    options: ['Diesel', 'Bitumen', 'Kerosene (Paraffin)', 'Lubricating oil'],
    correctAnswerIndex: 2,
    explanation: 'Kerosene (paraffin, C₁₀–C₁₅) is specifically used as aviation jet fuel and for household paraffin lamps and wick stoves.',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  },
  {
    id: 'q-chem-f1-14',
    topicId: 'topic-chem-f1-t7-organic',
    subjectId: 'subj-chem',
    form: 'Form 1',
    question: 'Why are biofuels like bioethanol considered renewable, whereas petroleum is non-renewable?',
    options: [
      'Biofuels do not release carbon dioxide when burned',
      'Biofuels can be replenished continuously by cultivating more crops, whereas petroleum requires millions of years to form',
      'Petroleum burns without any heat',
      'Biofuels are extracted directly from underground ocean reservoirs'
    ],
    correctAnswerIndex: 1,
    explanation: 'Biofuels come from living plant biomass that can be replanted and grown annually in a sustainable cycle.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  }
];

export const FORM_1_CHEMISTRY_QUIZZES: Quiz[] = [
  {
    id: 'quiz-chem-f1-intro',
    topicId: 'topic-chem-f1-t1-intro',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Form 1 Chemistry: Lab Safety, Apparatus & Inquiry Quiz',
    description: 'Test your understanding of laboratory safety rules, apparatus functions, hazard symbols, and scientific method steps.',
    questions: FORM_1_CHEMISTRY_QUESTIONS.filter(q => q.topicId === 'topic-chem-f1-t1-intro'),
    timeLimitMinutes: 10,
    pointsAwarded: 50,
    status: 'published',
    version: 1
  },
  {
    id: 'quiz-chem-f1-matter',
    topicId: 'topic-chem-f1-t3-matter',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Form 1 Chemistry: Matter, Solutions & Separation Quiz',
    description: 'Test your knowledge on states of matter, diffusion, elements, molecules, and separation techniques (distillation, chromatography, filtration).',
    questions: FORM_1_CHEMISTRY_QUESTIONS.filter(q => q.topicId === 'topic-chem-f1-t3-matter'),
    timeLimitMinutes: 10,
    pointsAwarded: 50,
    status: 'published',
    version: 1
  },
  {
    id: 'quiz-chem-f1-atomic',
    topicId: 'topic-chem-f1-t4-atomic',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Form 1 Chemistry: Atomic Structure & Isotopes Quiz',
    description: 'Test your grasp of electron configurations (2.8.8.2), atomic number Z, mass number A, and isotopic abundance calculations.',
    questions: FORM_1_CHEMISTRY_QUESTIONS.filter(q => q.topicId === 'topic-chem-f1-t4-atomic'),
    timeLimitMinutes: 10,
    pointsAwarded: 50,
    status: 'published',
    version: 1
  },
  {
    id: 'quiz-chem-f1-reactions',
    topicId: 'topic-chem-f1-t6-reactions',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Form 1 Chemistry: Balancing Equations & Stoichiometry Quiz',
    description: 'Test your equation balancing, Law of Conservation of Mass calculations, and percentage composition formulas.',
    questions: FORM_1_CHEMISTRY_QUESTIONS.filter(q => q.topicId === 'topic-chem-f1-t6-reactions'),
    timeLimitMinutes: 12,
    pointsAwarded: 60,
    status: 'published',
    version: 1
  },
  {
    id: 'quiz-chem-f1-organic',
    topicId: 'topic-chem-f1-t7-organic',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Form 1 Chemistry: Organic Compounds & Fuels Quiz',
    description: 'Test your mastery of biofuels, fossil fuels, petroleum fractional distillation, and uses of hydrocarbon fractions.',
    questions: FORM_1_CHEMISTRY_QUESTIONS.filter(q => q.topicId === 'topic-chem-f1-t7-organic'),
    timeLimitMinutes: 10,
    pointsAwarded: 50,
    status: 'published',
    version: 1
  }
];
