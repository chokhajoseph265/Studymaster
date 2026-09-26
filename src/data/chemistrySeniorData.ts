import { Topic, NoteItem, PracticeQuestion, Quiz } from '../types';

export const SENIOR_CHEMISTRY_TOPICS: Topic[] = [
  // Form 2
  {
    id: 'topic-chem-f2-bonding',
    subjectId: 'subj-chem',
    form: 'Form 2',
    title: 'Chemical Bonding & Molecular Structure',
    summary: 'Investigate ionic, covalent, and metallic bonding, crystal lattices, electron transfer, dot-and-cross diagrams, and physical properties of bonded substances.',
    order: 1,
    status: 'published',
    keyConcepts: [
      'Ionic Bonding: Electron transfer from metals to non-metals',
      'Giant Ionic Lattices: High melting points, electrical conductivity in molten/aqueous states',
      'Covalent Bonding: Sharing of electron pairs between non-metals',
      'Simple Molecular vs Giant Covalent Structures (Diamond, Graphite, Silicon Dioxide)',
      'Metallic Bonding: Positive metal ions surrounded by a delocalised sea of electrons'
    ],
    formulasOrFacts: [
      'Ionic: NaCl, MgO, CaCl₂',
      'Covalent: H₂O, CO₂, CH₄, NH₃',
      'Allotropes of Carbon: Diamond (tetrahedral, non-conductor), Graphite (hexagonal layers, conducts electricity due to free electrons)'
    ]
  },
  {
    id: 'topic-chem-f2-acids-bases',
    subjectId: 'subj-chem',
    form: 'Form 2',
    title: 'Acids, Bases, Salts & Indicators',
    summary: 'Understand the properties of acids and bases, pH scale, acid-base neutralization reactions, preparation of soluble and insoluble salts, and natural/synthetic indicators in Malawi.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'Acids: Proton (H⁺) donors; taste sour, turn blue litmus red, pH < 7',
      'Bases & Alkalis: Proton acceptors; soluble bases produce OH⁻ ions, turn red litmus blue, pH > 7',
      'Neutralisation: Acid + Base → Salt + Water (H⁺ + OH⁻ → H₂O)',
      'Reactions with Metals: Acid + Metal → Salt + Hydrogen Gas',
      'Reactions with Carbonates: Acid + Carbonate → Salt + Water + Carbon Dioxide',
      'Salt Preparation Methods: Titration, Excess Insoluble Base, Precipitation'
    ],
    formulasOrFacts: [
      'HCl + NaOH → NaCl + H₂O',
      'H₂SO₄ + CuO → CuSO₄ + H₂O',
      '2HCl + CaCO₃ → CaCl₂ + H₂O + CO₂'
    ]
  },
  // Form 3
  {
    id: 'topic-chem-f3-mole-concept',
    subjectId: 'subj-chem',
    form: 'Form 3',
    title: 'The Mole Concept & Stoichiometry',
    summary: 'Master Avogadro constant, molar mass, molar gas volume at RTP, concentration of solutions (mol/dm³), empirical and molecular formulas, and volumetric titration calculations.',
    order: 1,
    status: 'published',
    keyConcepts: [
      'The Mole: 6.02 × 10²³ elementary particles (Avogadro Constant)',
      'Molar Mass (M): Mass in grams of 1 mole of substance (g/mol)',
      'Molar Gas Volume: 24.0 dm³ (24,000 cm³) at Room Temperature & Pressure (R.T.P.)',
      'Molarity: Concentration in moles per cubic decimetre (mol/dm³)',
      'Empirical Formula: Simplest whole-number ratio of atoms in a compound',
      'Molecular Formula: Actual number of atoms of each element in a molecule'
    ],
    formulasOrFacts: [
      'Number of Moles (n) = Mass (m) / Molar Mass (M)',
      'Number of Moles (gases) = Volume (dm³) / 24 dm³',
      'Concentration (C) = Moles (n) / Volume (dm³)',
      'C₁V₁ / n₁ = C₂V₂ / n₂'
    ]
  },
  {
    id: 'topic-chem-f3-electrochem',
    subjectId: 'subj-chem',
    form: 'Form 3',
    title: 'Electrochemistry & Electrolysis',
    summary: 'Explore electrolytic cells, electrolytes vs non-electrolytes, selective discharge of ions at electrodes, industrial extraction of aluminium, electroplating, and simple chemical cells.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'Electrolysis: Decomposition of an electrolyte by passing an electric current',
      'Anode (Positive Electrode): Site of oxidation (loss of electrons)',
      'Cathode (Negative Electrode): Site of reduction (gain of electrons)',
      'Electrochemical Series & Selective Discharge Factors: Position, concentration, nature of electrodes',
      'Industrial Electrolysis: Extraction of Aluminium (Hall-Héroult process with cryolite)',
      'Electroplating: Coating iron/steel objects with copper, nickel, or silver to prevent rusting and enhance appearance'
    ],
    formulasOrFacts: [
      'PANIC: Positive Anode, Negative Is Cathode',
      'OIL RIG: Oxidation Is Loss, Reduction Is Gain of electrons',
      'Cathode reaction: Cu²⁺(aq) + 2e⁻ → Cu(s)',
      'Anode reaction: 4OH⁻(aq) → 2H₂O(l) + O₂(g) + 4e⁻'
    ]
  },
  // Form 4
  {
    id: 'topic-chem-f4-rates-equilibrium',
    subjectId: 'subj-chem',
    form: 'Form 4',
    title: 'Reaction Kinetics & Chemical Equilibrium',
    summary: 'Analyse collision theory, factors affecting rate of reaction (surface area, concentration, temperature, catalyst), reversible reactions, dynamic equilibrium, and Le Chatelier Principle.',
    order: 1,
    status: 'published',
    keyConcepts: [
      'Collision Theory: Reacting particles must collide with sufficient activation energy (Ea) and correct orientation',
      'Factors Increasing Rate: Temperature, Concentration, Surface Area, Catalysts',
      'Catalyst Function: Lowers activation energy by providing an alternative reaction pathway without being consumed',
      'Reversible Reactions & Dynamic Equilibrium: Rates of forward and reverse reactions are equal; concentrations remain constant',
      'Le Chatelier Principle: A system in equilibrium responds to counteract any imposed change in temperature, pressure, or concentration',
      'Industrial Equilibrium: Haber Process for Ammonia (N₂ + 3H₂ ⇌ 2NH₃; 450°C, 200 atm, Fe catalyst)'
    ],
    formulasOrFacts: [
      'Rate of Reaction = (Change in Amount of Reactant or Product) / Time',
      'Haber Process: ΔH is negative (Exothermic); compromise 450°C for optimal rate vs yield',
      'Contact Process: 2SO₂ + O₂ ⇌ 2SO₃ (V₂O₅ catalyst, 450°C, 1-2 atm)'
    ]
  },
  {
    id: 'topic-chem-f4-organic-homologous',
    subjectId: 'subj-chem',
    form: 'Form 4',
    title: 'Organic Chemistry: Hydrocarbons, Alcohols & Polymers',
    summary: 'Comprehensive study of homologous series (Alkanes, Alkenes, Alcohols, Carboxylic Acids), IUPAC nomenclature, addition vs substitution reactions, fermentation, and synthetic/natural polymers.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'Homologous Series: Family of organic compounds with same general formula, similar chemical properties, and gradation in physical properties',
      'Alkanes (CnH2n+2): Saturated hydrocarbons; combustion and substitution with halogens (UV light)',
      'Alkenes (CnH2n): Unsaturated hydrocarbons with C=C double bond; bromine water test (red-brown to colourless)',
      'Alcohols (CnH2n+1OH): Ethanol production by fermentation of sugar cane / maize or hydration of ethene',
      'Carboxylic Acids (CnH2n+1COOH): Weak organic acids (e.g. ethanoic acid / vinegar)',
      'Addition Polymerisation: Monomers join to form polyethene; Condensation Polymerisation (Nylon, Terylene, Proteins)'
    ],
    formulasOrFacts: [
      'Alkane General Formula: CnH2n+2',
      'Alkene General Formula: CnH2n',
      'Alcohol General Formula: CnH2n+1OH',
      'Carboxylic Acid: CnH2n+1COOH',
      'Fermentation: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ (Yeast enzyme zymase at 37°C)'
    ]
  }
];

export const SENIOR_CHEMISTRY_NOTES: NoteItem[] = [
  {
    id: 'note-chem-f2-bonding-1',
    topicId: 'topic-chem-f2-bonding',
    subjectId: 'subj-chem',
    form: 'Form 2',
    title: 'Chemical Bonding: Ionic, Covalent and Metallic Structures',
    summary: 'Comprehensive examination notes on atomic stability, electron transfer, shared pairs, crystal lattices, and physical properties for MANEB JCE.',
    estimatedReadTimeMinutes: 8,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-22',
    content: `## 1. Why Do Atoms Form Chemical Bonds?
Atoms form chemical bonds to achieve a stable octet (or duplet for Hydrogen and Helium) electronic configuration—equivalent to the noble gases in Group VIII (Group 0).

---

## 2. Ionic (Electrovalent) Bonding
- **Mechanism:** Transfer of one or more valence electrons from a metallic atom to a non-metallic atom.
- **Cation Formation:** Metal atom loses electrons → positively charged ion (e.g., Na → Na⁺ + e⁻).
- **Anion Formation:** Non-metal atom gains electrons → negatively charged ion (e.g., Cl + e⁻ → Cl⁻).
- **Bonding Force:** Strong electrostatic attraction between oppositely charged ions in a 3-dimensional giant ionic lattice.

### Key Physical Properties of Ionic Compounds
1. **High Melting and Boiling Points:** Huge amounts of heat energy needed to overcome strong electrostatic lattice forces.
2. **Electrical Conductivity:**
   - **Solid State:** Non-conductor (ions held tightly in fixed lattice positions).
   - **Molten or Aqueous Solution:** Excellent conductor (ions are free to move and carry electric charge).
3. **Solubility:** Readily soluble in polar solvents (water); insoluble in organic solvents.

---

## 3. Covalent Bonding
- **Mechanism:** Sharing of pairs of electrons between non-metal atoms.
- **Single Covalent Bond:** 1 shared electron pair (e.g., H₂, Cl₂, HCl).
- **Double Covalent Bond:** 2 shared electron pairs (e.g., O₂, CO₂).
- **Triple Covalent Bond:** 3 shared electron pairs (e.g., N₂).

### Comparison: Simple Molecular vs Giant Covalent
| Property | Simple Molecular (H₂O, CO₂, CH₄) | Giant Covalent (Diamond, Graphite) |
| :--- | :--- | :--- |
| **Structure** | Discrete molecules held by weak van der Waals forces | Continuous network of strong covalent bonds |
| **Melting Point** | Low (weak intermolecular forces break easily) | Extremely high (>3500°C for diamond) |
| **Conductivity** | Non-conductor in all states | Non-conductor (except Graphite due to delocalised electrons) |

> **MANEB Exam Tip:** When explaining why simple molecular substances have low boiling points, never say the covalent bonds break! State clearly that only the weak intermolecular forces between molecules are overcome by heat!`,
    workedExamples: [
      {
        id: 'we-chem-bonding-1',
        title: 'Worked Example: Electronic Configuration & Ionic Formula Deduction',
        problem: 'Element X has atomic number 12 and Element Y has atomic number 17. Deduce the formula of the compound formed between X and Y and explain the type of bonding.',
        stepByStepSolution: [
          { step: 1, explanation: 'Write electron configurations: X (Z=12) is 2,8,2. Y (Z=17) is 2,8,7.' },
          { step: 2, explanation: 'Identify ion formation: Metal X loses 2 valence electrons to form X²⁺. Non-metal Y gains 1 electron to form Y⁻.' },
          { step: 3, explanation: 'Balance ionic charges: One X²⁺ ion requires two Y⁻ ions for electrical neutrality.' },
          { step: 4, explanation: 'State formula and bond: Formula is XY₂ (Magnesium Chloride, MgCl₂). The bonding is ionic bonding.' }
        ],
        finalAnswer: 'Formula: XY₂; Bonding: Ionic Bonding',
        keyTakeaway: 'Always cross valencies to ensure total positive charge equals total negative charge in the formula unit.'
      }
    ]
  },
  {
    id: 'note-chem-f3-mole-1',
    topicId: 'topic-chem-f3-mole-concept',
    subjectId: 'subj-chem',
    form: 'Form 3',
    title: 'The Mole Concept, Molar Volume and Stoichiometric Calculations',
    summary: 'Master the fundamental quantitative laws of chemistry: Avogadro number, reacting masses, gas molar volume at RTP, and molarity calculations.',
    estimatedReadTimeMinutes: 9,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-24',
    content: `## 1. Defining the Mole
A **mole** is the amount of substance that contains as many elementary entities (atoms, molecules, or ions) as there are atoms in exactly 12 grams of pure Carbon-12.
- **Avogadro's Constant (L):** **6.02 × 10²³ particles/mol**

---

## 2. Core Mole Roadmaps & Formulas

### Formula 1: Mass to Moles
$$\\text{Number of Moles } (n) = \\frac{\\text{Mass in grams } (m)}{\\text{Molar Mass } (M)}$$

### Formula 2: Gas Volume at R.T.P.
At Room Temperature and Pressure (25°C, 1 atm):
- **1 mole of any gas occupies 24.0 dm³ (or 24,000 cm³)**
$$\\text{Number of Moles } (n) = \\frac{\\text{Gas Volume in } \\text{dm}^3}{24.0 \\text{ dm}^3} = \\frac{\\text{Gas Volume in } \\text{cm}^3}{24,000 \\text{ cm}^3}$$

### Formula 3: Solution Molarity
$$\\text{Concentration } (C) = \\frac{\\text{Moles of Solute } (n)}{\\text{Volume of Solution in } \\text{dm}^3 (V)}$$
$$\\text{Mass Concentration } (\\text{g/dm}^3) = \\text{Molarity } (\\text{mol/dm}^3) \\times \\text{Molar Mass } (M)$$

---

## 3. Acid-Base Titration Equation
For reaction: $a\\text{Acid} + b\\text{Base} \\rightarrow \\text{Products}$:
$$\\frac{C_A \\times V_A}{a} = \\frac{C_B \\times V_B}{b}$$
Where:
- $C_A, C_B$ = Molar concentrations of acid and base
- $V_A, V_B$ = Volumes of acid and base used in titration
- $a, b$ = Mole stoichiometric coefficients from the balanced equation`,
    workedExamples: [
      {
        id: 'we-chem-mole-1',
        title: 'Worked Example: Acid-Base Titration Molarity Calculation',
        problem: 'In a titration experiment, 25.0 cm³ of 0.10 mol/dm³ Sodium Hydroxide (NaOH) required exactly 20.0 cm³ of Hydrochloric Acid (HCl) for complete neutralisation. Calculate the concentration of the hydrochloric acid in mol/dm³ and in g/dm³. (RAM: H=1, Cl=35.5)',
        stepByStepSolution: [
          { step: 1, explanation: 'Write balanced equation: HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l). Mole ratio is 1:1 (a=1, b=1).' },
          { step: 2, explanation: 'Calculate moles of NaOH used: n = C × V = 0.10 mol/dm³ × (25.0 / 1000 dm³) = 0.0025 moles.' },
          { step: 3, explanation: 'Determine moles of HCl from mole ratio: Since ratio is 1:1, moles of HCl = 0.0025 moles.' },
          { step: 4, explanation: 'Calculate molar concentration of HCl: C = n / V = 0.0025 mol / (20.0 / 1000 dm³) = 0.125 mol/dm³.' },
          { step: 5, explanation: 'Convert to g/dm³: Molar mass of HCl = 1 + 35.5 = 36.5 g/mol. Mass conc = 0.125 × 36.5 = 4.56 g/dm³.' }
        ],
        finalAnswer: 'Molarity = 0.125 mol/dm³; Mass concentration = 4.56 g/dm³',
        keyTakeaway: 'Always convert titration volumes from cm³ to dm³ by dividing by 1000 before computing molarity!'
      }
    ]
  },
  {
    id: 'note-chem-f4-rates-1',
    topicId: 'topic-chem-f4-rates-equilibrium',
    subjectId: 'subj-chem',
    form: 'Form 4',
    title: 'Reaction Kinetics, Catalysis and Le Chatelier Principle',
    summary: 'Master activation energy, collision theory, rate graphs, industrial synthesis (Haber and Contact processes), and dynamic equilibrium for MSCE.',
    estimatedReadTimeMinutes: 8,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-24',
    content: `## 1. Collision Theory of Chemical Reactions
For a chemical reaction to occur:
1. Particles must collide with one another.
2. The colliding particles must possess minimum energy equal to or greater than the **Activation Energy ($E_a$)**.
3. Particles must collide with the correct geometric orientation.

---

## 2. Factors Controlling Reaction Rate
- **Surface Area of Solids:** Smaller particle size → larger total surface area exposed → more frequent collisions.
- **Concentration of Solutions:** Higher number of solute particles per unit volume → higher frequency of effective collisions.
- **Temperature:** Increases average kinetic energy of particles → particles move faster and a much higher fraction possess energy $\\ge E_a$.
- **Catalyst:** Provides an alternative reaction pathway with lower activation energy without being chemically consumed.

---

## 3. Le Chatelier's Principle & Dynamic Equilibrium
"When a system at dynamic chemical equilibrium is subjected to a disturbance in temperature, pressure, or concentration, the position of equilibrium shifts in such a direction as to counteract the imposed disturbance."

### The Haber Process Case Study
$$\\text{N}_2(\\text{g}) + 3\\text{H}_2(\\text{g}) \\rightleftharpoons 2\\text{NH}_3(\\text{g}) \\quad \\Delta H = -92 \\text{ kJ/mol (Exothermic)}$$

- **Effect of Increasing Pressure:** 4 moles of gas on left vs. 2 moles of gas on right. Increasing pressure shifts equilibrium to the right (higher ammonia yield).
- **Effect of Temperature:** Forward reaction is exothermic. Lower temperature favors higher equilibrium yield, but slows reaction rate drastically. Hence, an **optimum compromise temperature of 450°C** is used with an Iron (Fe) catalyst and 200 atm pressure.`,
    workedExamples: [
      {
        id: 'we-chem-rates-1',
        title: 'Worked Example: Predicting Equilibrium Shift',
        problem: 'Consider the reaction: 2SO₂(g) + O₂(g) ⇌ 2SO₃(g) (ΔH = -197 kJ/mol). Predict and explain the effect on the yield of sulfur trioxide (SO₃) of: (a) Increasing the overall pressure, (b) Increasing the reaction temperature.',
        stepByStepSolution: [
          { step: 1, explanation: 'Count gas moles: Left side has 2 + 1 = 3 moles of gas. Right side has 2 moles of gas.' },
          { step: 2, explanation: '(a) Pressure increase: According to Le Chatelier principle, equilibrium shifts towards the side with fewer gas molecules (the right). Therefore, the yield of SO₃ increases.' },
          { step: 3, explanation: '(b) Temperature increase: The forward reaction is exothermic (releases heat). Adding heat shifts equilibrium in the endothermic direction (to the left) to absorb heat. Therefore, the yield of SO₃ decreases.' }
        ],
        finalAnswer: '(a) Yield of SO₃ increases; (b) Yield of SO₃ decreases',
        keyTakeaway: 'Equilibrium always shifts to oppose the change: higher pressure favors fewer moles; higher temperature favors the endothermic direction.'
      }
    ]
  }
];

export const SENIOR_CHEMISTRY_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'q-chem-f2-1',
    topicId: 'topic-chem-f2-bonding',
    subjectId: 'subj-chem',
    form: 'Form 2',
    question: 'Why do ionic compounds such as sodium chloride conduct electricity when molten or in aqueous solution, but not in solid form?',
    options: [
      'Electrons are shared between ions in the liquid state',
      'Ions are free to move and carry electric charge in molten/aqueous states',
      'The sodium atoms lose their valence electrons when heated',
      'Water molecules break down into hydrogen ions and conduct electricity'
    ],
    correctAnswerIndex: 1,
    explanation: 'In the solid state, ions are locked into fixed positions within the giant lattice. When molten or dissolved in water, the lattice breaks down and ions are mobile to carry current.',
    difficulty: 'Medium',
    points: 10,
    status: 'published'
  },
  {
    id: 'q-chem-f3-1',
    topicId: 'topic-chem-f3-mole-concept',
    subjectId: 'subj-chem',
    form: 'Form 3',
    question: 'What volume does 0.5 moles of carbon dioxide gas occupy at room temperature and pressure (R.T.P.)? (Molar gas volume = 24.0 dm³/mol)',
    options: ['12.0 dm³', '24.0 dm³', '48.0 dm³', '6.0 dm³'],
    correctAnswerIndex: 0,
    explanation: 'Volume = moles × molar gas volume = 0.5 mol × 24.0 dm³/mol = 12.0 dm³.',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  },
  {
    id: 'q-chem-f4-1',
    topicId: 'topic-chem-f4-rates-equilibrium',
    subjectId: 'subj-chem',
    form: 'Form 4',
    question: 'In the Haber process: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) (ΔH = -92 kJ/mol), what will happen to the equilibrium position if the reaction pressure is increased?',
    options: [
      'Shifts to the left because there are more molecules on the right',
      'Shifts to the right because the right side has fewer gas molecules (2 vs 4)',
      'Remains unchanged because pressure only affects rate, not equilibrium',
      'Shifts to the left to absorb the excess pressure energy'
    ],
    correctAnswerIndex: 1,
    explanation: 'There are 4 moles of gas on the left and 2 moles on the right. Increasing pressure drives the system toward fewer gas molecules to reduce pressure, shifting equilibrium to the right.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  }
];

export const SENIOR_CHEMISTRY_QUIZZES: Quiz[] = [
  {
    id: 'quiz-chem-f2-bonding',
    topicId: 'topic-chem-f2-bonding',
    subjectId: 'subj-chem',
    form: 'Form 2',
    title: 'Chemical Bonding & Structure Quiz',
    description: 'Assess your understanding of ionic, covalent, and metallic bonds, electron transfer, and lattice conductivity.',
    timeLimitMinutes: 10,
    pointsAwarded: 50,
    status: 'published',
    version: 1,
    questions: [
      SENIOR_CHEMISTRY_QUESTIONS[0]
    ]
  },
  {
    id: 'quiz-chem-f3-mole',
    topicId: 'topic-chem-f3-mole-concept',
    subjectId: 'subj-chem',
    form: 'Form 3',
    title: 'Mole Concept & Stoichiometry Assessment',
    description: 'Master reacting masses, molar gas volume, and titration calculations for senior secondary chemistry.',
    timeLimitMinutes: 10,
    pointsAwarded: 50,
    status: 'published',
    version: 1,
    questions: [
      SENIOR_CHEMISTRY_QUESTIONS[1]
    ]
  },
  {
    id: 'quiz-chem-f4-rates',
    topicId: 'topic-chem-f4-rates-equilibrium',
    subjectId: 'subj-chem',
    form: 'Form 4',
    title: 'Kinetics & Chemical Equilibrium Master Quiz',
    description: 'Test your grasp of collision theory, activation energy, catalysts, and Le Chatelier principle.',
    timeLimitMinutes: 10,
    pointsAwarded: 50,
    status: 'published',
    version: 1,
    questions: [
      SENIOR_CHEMISTRY_QUESTIONS[2]
    ]
  }
];
