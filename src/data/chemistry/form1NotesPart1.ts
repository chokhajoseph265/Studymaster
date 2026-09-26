import { NoteItem } from '../../types';
import { SVG_DIFFUSION_EXPERIMENT, SVG_TRIPLE_BEAM_BALANCE } from './form1Diagrams';

export const FORM_1_CHEMISTRY_NOTES_PART_1: NoteItem[] = [
  // ==========================================
  // TOPIC 1: INTRODUCTION TO CHEMISTRY
  // ==========================================
  {
    id: 'note-chem-f1-t1',
    topicId: 'topic-chem-f1-t1-intro',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'TOPIC 1 : INTRODUCTION TO CHEMISTRY',
    lessonBadge: 'TOPIC 1',
    summary: 'Meaning and branches of chemistry, importance in everyday life, application areas, careers, laboratory safety rules, apparatus, hazard symbols, SI units, and scientific inquiry.',
    estimatedReadTimeMinutes: 12,
    version: 3,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-09-01',
    diagramUrl: SVG_TRIPLE_BEAM_BALANCE,
    diagramCaption: 'Figure 1.1: The Triple Beam Balance and procedure for reading mass accurately in grams.',
    learningObjectives: [
      'Define chemistry and state its six main branches.',
      'Explain the importance and application of chemistry in everyday Malawian life.',
      'Describe chemistry-related careers and their societal importance.',
      'State laboratory safety rules, protective equipment, and common hazard symbols.',
      'Identify basic and derived SI units of measurement and instruments for measuring physical quantities.',
      'Outline the 5 steps of the scientific method of investigation.'
    ],
    keyPoints: [
      'Chemistry is the branch of science dealing with elements, the compounds they form, and the reactions they undergo.',
      'The 6 branches are physical, environmental, analytical, industrial, organic, and inorganic chemistry.',
      'Basic SI units are metre (m), kilogram (kg), second (s), and Kelvin (K).',
      'The scientific method follows: Problem → Hypothesis → Experiment → Analysis → Conclusion.'
    ],
    vocabulary: [
      {
        term: 'Chemistry',
        definition: 'Branch of science dealing with elements and the compounds they form and the reactions they undergo.'
      },
      {
        term: 'Meniscus',
        definition: 'The curve on the surface of a liquid caused by surface tension and attraction to glass walls.'
      },
      {
        term: 'Hypothesis',
        definition: 'A guessed or proposed answer to a scientific problem based on observation and knowledge.'
      },
      {
        term: 'SI Units',
        definition: 'International System of Units used standardly in scientific measurements worldwide.'
      }
    ],
    didYouKnow: 'When reading liquid volume in a measuring cylinder, always read the bottom of the curved meniscus at eye level to prevent parallax error.',
    quickCheckQuestions: [
      {
        question: 'Define chemistry and name three of its branches.',
        answer: 'Chemistry is the study of elements, compounds, and the reactions they undergo. Branches include Physical, Organic, Inorganic, Analytical, Industrial, and Environmental Chemistry.'
      },
      {
        question: 'Why should liquid volume be read at the bottom of the meniscus at eye level?',
        answer: 'To avoid parallax error and obtain an accurate volume reading.'
      },
      {
        question: 'What are the 5 steps of scientific inquiry?',
        answer: '1. Identify a problem, 2. Formulate a hypothesis, 3. Test the hypothesis (experiment), 4. Analyse results, 5. Draw a conclusion.'
      },
      {
        question: 'List four basic SI units and their symbols.',
        answer: 'Length (Metre, m), Mass (Kilogram, kg), Time (Second, s), Temperature (Kelvin, K).'
      }
    ],
    keyTakeaway: 'Chemistry is a foundational practical science applied across medicine, agriculture, and water purification, guided by strict laboratory safety and precision measurements.',
    content: `## MEANING OF CHEMISTRY

Chemistry is the branch of science dealing with elements and the compounds they form and the reactions they undergo.

---

## BRANCHES OF CHEMISTRY

The branches of chemistry include physical, environmental, analytical, industrial, organic and inorganic chemistry.

- **a. PHYSICAL CHEMISTRY** – It is the study of how chemical compounds and their constituents react with each other.
- **b. ENVIRONMENTAL CHEMISTRY** – It is the study of how chemicals react naturally in the environment and human impact on natural systems.
- **c. ANALYTICAL CHEMISTRY** – It is the study of separation, identification, and quantification of the chemical components of natural and artificial materials.
- **d. INDUSTRIAL CHEMISTRY** – It is the study of the application of physical and chemical processes towards the change of raw materials into beneficial products.
- **e. ORGANIC CHEMISTRY** – It is the study of compounds that contain carbon except oxides of carbon and carbonates.
- **f. INORGANIC CHEMISTRY** – It is the study of compounds that do not contain carbon and non-living things.

---

## IMPORTANCE OF CHEMISTRY IN EVERYDAY LIFE

Chemistry is important in everyday life and it is applied in different ways:

- **Water treatment** – Different chemical processes (e.g. chlorination) are used to purify water so that it is safe for drinking.
- **Cooking nsima** – Mixing and heating ingredients applies fundamental concepts in chemistry.
- **Making a cup of tea** – Extraction and dissolution of tea leaves and sugar into boiling water.
- **Pharmaceuticals** – Synthesis and preparation of life-saving medicines.
- **Food industries** – Food processing (e.g. lime is added to brown sugar so that it turns into white refined sugar).
- **Manufacture of soap and detergents** – Saponification of fats and oils with alkalis to remove dirt.
- **Manufacture of pesticides & fertilisers** – Formulations that control pests and boost agricultural crop yields.

---

## AREAS WHERE CHEMISTRY IS APPLIED

- Pharmaceutical companies that manufacture medical drugs.
- Companies that make food and drinks (soft and alcoholic).
- Companies that manufacture petroleum and oil products.
- Companies that manufacture fertilizers and pesticides.
- Water purification and supply boards (e.g. Blantyre Water Board, Lilongwe Water Board).
- The mining and mineral extraction industries.

---

## CAREERS IN CHEMISTRY AND THEIR IMPORTANCE

Most careers in modern society require the application of the knowledge in chemistry.

- **a. Medicine and nursing** – Doctors and nurses need chemistry as part of their medical training.
- **b. Pharmacist** – Pharmacists require chemistry to understand and dispense medications safely.
- **c. Food chemist** – Food chemists test manufactured food and beverages to ensure they are safe to consume.
- **d. Teacher chemist** – Chemistry teachers prepare students for scientific careers by teaching chemistry in schools.
- **e. Environmental chemist** – Involved in managing the environment, ensuring rivers and lakes are not polluted and waste is properly disposed of.

---

## LABORATORY

A laboratory is a special room equipped for conducting scientific research and experimentation.

### SAFETY RULES IN THE LABORATORY

1. Do not drink, taste nor eat anything in the laboratory. Any chemical is never tasted in the laboratory but can be tested.
2. Handle all materials in the laboratory carefully. Glassware must be held with both hands.
3. Never run or play in the laboratory.
4. Wear protective materials such as lab coat, an apron, and safety goggles.
5. Never work in the laboratory barefooted; always wear closed shoes.
6. Avoid disturbing or pushing a colleague who is busy working in the laboratory.
7. Clean all equipment and workplaces after each laboratory period.
8. Tie up long hair and avoid wearing loose clothing which could catch fire or get caught in equipment.
9. Follow experimental procedures strictly and do not take short cuts.
10. Avoid carrying out any other experiments other than the one given by the teacher.
11. Turn off water, gas and electricity outlets immediately when not in use.
12. Keep open flames and flammable solutions far apart.
13. Keep electrical equipment away from water and keep areas around electrical apparatus dry.
14. Always clean glassware before and after using them.
15. Always work in a well-ventilated area (or fume cupboard for toxic gases).
16. Keep hands away from face, eyes, mouth and body while handling chemicals.
17. When first entering a laboratory, do not touch any equipment or materials until instructed to do so.

### PROTECTIVE EQUIPMENT IN THE LABORATORY

In chemistry, essential protective equipment includes **safety goggles**, **protective gloves**, **laboratory coats and aprons**, **respiratory/gas masks**, **eye wash stations**, and **fire extinguishers / fire blankets**.

---

## HAZARD SYMBOLS

A hazard symbol tells you the dangers associated with handling laboratory chemicals and apparatus:

| Hazard Symbol | Meaning | Example / Precaution |
| :--- | :--- | :--- |
| **✖** | **Harmful or Irritant substance** | Avoid inhalation and direct skin contact; causes blisters or rashes. |
| **💀** | **Toxic substance** | Poisonous; can cause serious illness or death if swallowed or inhaled. |
| **🔥** | **Highly Flammable** | Catches fire easily; keep away from Bunsen burner open flames. |
| **🧪** | **Corrosive** | Attacks and destroys living tissue and metals; wear protective gloves. |
| **🌳 / 🐟** | **Dangerous to the Environment** | Toxic to aquatic life and soil organisms; do not pour directly into sinks. |

---

## THE SI UNIT SYSTEM OF MEASUREMENT

The system of measurement used in science is known as the **SI system of units** (*Système International d'Unités*).

### BASIC UNITS
Basic units are a set of unrelated units that form the basis of the SI system. These quantities cannot be expressed in terms of other quantities.

| Quantity | Unit Name | Unit Symbol |
| :--- | :--- | :--- |
| **Length** | Metre | $\text{m}$ |
| **Mass** | Kilogram | $\text{kg}$ |
| **Time** | Second | $\text{s}$ |
| **Temperature** | Kelvin | $\text{K}$ |

### DERIVED UNITS
These are units obtained from combination of basic units through multiplication and division.

| Quantity | Name of Unit | Unit Symbol / Formula |
| :--- | :--- | :--- |
| **Area** | square metre | $\text{m}^2$ |
| **Volume** | cubic metre | $\text{m}^3$ |
| **Speed** | metre per second | $\text{m/s}$ or $\text{m}\cdot\text{s}^{-1}$ |
| **Density** | kilogram per cubic metre | $\text{kg/m}^3$ or $\text{kg}\cdot\text{m}^{-3}$ |

> **Density Formula:**
> $$\text{Density } (\rho) = \frac{\text{Mass } (m)}{\text{Volume } (V)}$$

### SI PREFIXES FOR UNITS OF MEASUREMENTS
The SI prefix is an affix added to the name of a basic unit indicating whether the unit is a multiple or fraction:

| Prefix | Symbol | Factor (Power of 10) | Standard Value |
| :--- | :--- | :--- | :--- |
| **nano** | $\text{n}$ | $10^{-9}$ | $0.000000001$ |
| **micro** | $\mu$ | $10^{-6}$ | $0.000001$ |
| **milli** | $\text{m}$ | $10^{-3}$ | $0.001$ |
| **kilo** | $\text{k}$ | $10^{3}$ | $1\,000$ |
| **mega** | $\text{M}$ | $10^{6}$ | $1\,000\,000$ |
| **giga** | $\text{G}$ | $10^{9}$ | $1\,000\,000\,000$ |

---

## MEASURING PHYSICAL QUANTITIES

Physical quantities must be measured as accurately as possible using calibrated instruments:

### a. MEASURING MASS
The mass of an object is measured using a **balance**. The **triple beam balance** is commonly used in the chemistry laboratory.

**How to use the Triple Beam Balance:**
1. Put the balance on a flat, hard surface where no wind is blowing.
2. Move all rider masses to the zero marks.
3. Adjust the zeroing screw until the pointer rests exactly at zero.
4. Place the object on the pan carefully.
5. Move the 100g mass first until the beam topples, then move it one notch back.
6. Move the 10g mass gradually until it topples again, then move one notch back.
7. Slide the small 1g rider mass until the pointer aligns with zero.
8. Read the mass by adding the positions of all three beams:  
> $$\text{Total Mass} = 300\text{ g} + 40\text{ g} + 5\text{ g} = 345\text{ g}$$

### b. MEASURING VOLUME
The instrument for measuring volume of a liquid is the **measuring cylinder** (available in sizes like 25 ml, 50 ml, 100 ml, 500 ml, and 1000 ml).

**How to read volume:**
The volume of a liquid must be read from the **bottom of the meniscus** with your eye positioned horizontally level with the liquid surface to avoid parallax error.

### c. MEASURING TEMPERATURE
Temperature is measured using a **thermometer**. The commonly used laboratory thermometer is the **liquid-in-glass thermometer** (filled with mercury or coloured alcohol).

### d. MEASURING TIME
Time is measured using a **stopwatch** (digital stopwatch with start/stop and reset buttons).

---

## SCIENTIFIC METHOD OF INVESTIGATION

Chemistry is a practical subject that follows the systematic scientific method of enquiry:

1. **Identify a Problem** – Asking questions about natural phenomena (e.g. *What causes rusting? Why do plastics not decompose easily?*).
2. **Formulating a Hypothesis** – A sensible guessed answer to the problem formulated from experience and observation.
3. **Testing the Hypothesis** – Conducting a controlled experiment to accept, modify, or reject the hypothesis.
4. **Analyse the Results** – Examining collected experimental data and making sense of measurements.
5. **Conclusion** – Drawn from data: if the hypothesis is supported, it is adopted; if false, it is rejected and a new hypothesis is tested.`,
    workedExamples: [
      {
        id: 'we-chem-t1-1',
        title: 'Triple Beam Balance Reading',
        problem: 'A student measures a sample using a triple beam balance. The 100g beam indicates 300g, the 10g beam indicates 40g, and the 1g beam indicates 5g. What is the total mass?',
        stepByStepSolution: [
          { step: 1, explanation: 'Identify the beam positions:', mathOrCode: 'Beam 1 = 300 g, Beam 2 = 40 g, Beam 3 = 5 g' },
          { step: 2, explanation: 'Add the three values together:', mathOrCode: '300 + 40 + 5 = 345 g' }
        ],
        finalAnswer: '345 g',
        keyTakeaway: 'Always sum all three beams and ensure the pointer was zeroed before taking measurements.'
      }
    ]
  },

  // ==========================================
  // TOPIC 2: ESSENTIAL MATHEMATICAL SKILLS
  // ==========================================
  {
    id: 'note-chem-f1-t2',
    topicId: 'topic-chem-f1-t2-math',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'TOPIC 2 : ESSENTIAL MATHEMATICAL SKILLS IN CHEMISTRY',
    lessonBadge: 'TOPIC 2',
    summary: 'Expressing numbers in standard form, rules for significant figures, calculating with precision, accuracy vs precision, and constructing scientific line graphs, bar graphs, and pie charts.',
    estimatedReadTimeMinutes: 12,
    version: 3,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-09-01',
    learningObjectives: [
      'Express very large and very small numbers in standard form (scientific notation).',
      'State and apply the 6 guidelines for writing significant figures.',
      'Express calculated results to the correct number of significant figures.',
      'Distinguish between accuracy and precision with experimental examples.',
      'Construct and interpret scientific line graphs, bar graphs, and pie charts.'
    ],
    keyPoints: [
      'Standard form writes numbers as A × 10ⁿ where 1 ≤ A < 10.',
      'Non-zero digits and zeros between non-zero digits are always significant.',
      'When multiplying/dividing, round the final answer to match the least number of significant figures.',
      'Line graphs show continuous trends; on a graph of A against B, A is on the vertical y-axis and B is on the horizontal x-axis.'
    ],
    vocabulary: [
      {
        term: 'Standard Form',
        definition: 'Scientific notation writing numbers in the form A × 10ⁿ where 1 ≤ A < 10.'
      },
      {
        term: 'Significant Figures',
        definition: 'Digits in a number that carry meaning contributing to its measurement precision.'
      },
      {
        term: 'Accuracy',
        definition: 'How close a measured experimental value is to the true or accepted actual value.'
      },
      {
        term: 'Precision',
        definition: 'How close repeated experimental measurements are to each other.'
      }
    ],
    didYouKnow: 'On any scientific graph entitled "A graph of A against B", quantity A is ALWAYS plotted on the vertical y-axis and quantity B is on the horizontal x-axis.',
    quickCheckQuestions: [
      {
        question: 'Write $300{,}000{,}000$ and $0.00067$ in standard form.',
        answer: '$$300{,}000{,}000 = 3.0 \\times 10^8 \\quad \\text{and} \\quad 0.00067 = 6.7 \\times 10^{-4}$$'
      },
      {
        question: 'How many significant figures are in $40{,}072$ and $0.0089$?',
        answer: '$40{,}072$ has 5 significant figures (zeros between non-zeros count); $0.0089$ has 2 significant figures (leading zeros do not count).'
      },
      {
        question: 'Calculate $(2.467 \\times 465) \\div 2.7$ to the correct number of significant figures.',
        answer: '$$\\frac{2.467 \\times 465}{2.7} = 424.872\\dots \\approx 420$$ Rounded to 2 significant figures because $2.7$ has the least number of significant figures (2 sig figs).'
      }
    ],
    keyTakeaway: 'Accurate reporting of experimental measurements requires applying standard form, significant figure guidelines, and proper graphing conventions.',
    content: `## EXPRESSING NUMBERS IN STANDARD FORM

The standard form or scientific notation is a special way of writing very large or very small numbers. When a number is expressed in standard form, its meaning or value does not change.

The number is written in two parts which give the original number when multiplied: one number between 1 and 10, and the other as a power of ten:

$$A \\times 10^n \\quad (1 \\le A < 10, \\, n \\in \\mathbb{Z})$$

### EXPRESSING VERY BIG NUMBERS IN STANDARD NOTATION
Place a decimal point just after the first digit, followed by $\\times 10$ to the positive power of the number of places moved from the decimal point to the last digit:

- **4 500:** $$4\\,500 = 4.5 \\times 10^3$$
- **67 413:** $$67\\,413 = 6.7413 \\times 10^4$$
- **300 000 000:** $$300\\,000\\,000 = 3.0 \\times 10^8$$

### EXPRESSING VERY SMALL NUMBERS IN STANDARD FORM
Place the decimal point just after the first non-zero digit, followed by $\\times 10$ to the negative power of places moved:

- **0.00067:** $$0.00067 = 6.7 \\times 10^{-4}$$
- **0.00145:** $$0.00145 = 1.45 \\times 10^{-3}$$
- **0.335:** $$0.335 = 3.35 \\times 10^{-1}$$

---

## SIGNIFICANT FIGURES

Significant figures of a number are those digits that carry meaning contributing to its precision.

### GUIDELINES FOR WRITING SIGNIFICANT FIGURES

1. **All non-zero digits are significant.**  
   *(e.g. $6753$ has 4 significant figures).*
2. **Zeroes between non-zero digits are significant.**  
   *(e.g. $40\\,072$ has 5 significant figures).*
3. **Zeroes to the left of non-zero digits are not significant.**  
   *(e.g. $0.89$ has 2 sig figs; $0.089$ has 2 sig figs; $0.0089$ has 2 sig figs).*
4. **If a number ends in zeroes to the right of a decimal point, the zeroes are significant.**  
   *(e.g. $9.0$ has 2 significant figures).*
5. **In a figure without a decimal point, the rightmost non-zero digit is the least significant figure.**  
   *(e.g. in $7900$, the least significant digit is 9; $7900$ has 2 sig figs).*
6. **Rounding:** If the next digit after the last significant figure is 4 or less, round down. If 5 or more, round up.  
   *(e.g. $14.628$ to 4 sig figs is $14.63$; $15.473$ to 4 sig figs is $15.47$).*

---

## EXPRESSING NUMERICAL RESULTS TO CORRECT NUMBER OF SIGNIFICANT FIGURES

The result obtained from adding, subtracting, multiplying, or dividing numbers must be quoted based on the number that has the **least number of significant figures**.

**Example 1 (Addition):**  
Add: $2\\,345$, $7\\,800$ and $934\\,456$.  
- Answer is **$940\\,000$** (and not $944\\,601$) because **$7\\,800$** has the least number of significant figures (2 sig figs).

**Example 2 (Multiplication & Division):**  
Work out: $(2.467 \\times 465) \\div 2.7$  
$$\\frac{2.467 \\times 465}{2.7} = 424.872222\\dots \\approx 420 \\quad (\\text{to 2 significant figures})$$

---

## ACCURACY AND PRECISION

- **Accuracy** is how close a measured value is to the actual (true) value.
- **Precision** is how close the measured values are to each other.

**Example:**  
Consider three measurements: $30.01\\text{ g}$, $30.02\\text{ g}$, and $30.03\\text{ g}$. If the true value is $30.0\\text{ g}$, then all three measurements are **accurate** (very close to the actual value) and also **precise** (very close to each other).

---

## GRAPHS IN SCIENCE

Graphs are pictorial representations of data values measured in an experiment.

### TYPES OF GRAPHS

- **a. LINE GRAPHS** – Uses points connected by a line to show continuous data.
  - **Title:** e.g. "A graph of temperature against time".
  - **Axes:** From any statement *"a graph of A against B"*, **A must be on the vertical axis ($y$-axis)** and **B must be on the horizontal axis ($x$-axis)**.
  - **Scale:** A regular range of numbers showing units.
  - **Origin:** The point $(0,0)$ where the vertical and horizontal axes meet.
- **b. BAR GRAPHS** – Displays data using rectangular bars to show comparisons between distinct categories.
- **c. PIE CHARTS** – Displays data as circular sectors where each segment represents a proportion of $360^\\circ$.`,
    workedExamples: [
      {
        id: 'we-chem-t2-1',
        title: 'Scientific Notation Conversion',
        problem: 'Write down (a) $67\\,413$ and (b) $0.00145$ in standard form.',
        stepByStepSolution: [
          { step: 1, explanation: 'For 67 413, move decimal point 4 places to the left:', mathOrCode: '67\\,413 = 6.7413 \\times 10^4' },
          { step: 2, explanation: 'For 0.00145, move decimal point 3 places to the right:', mathOrCode: '0.00145 = 1.45 \\times 10^{-3}' }
        ],
        finalAnswer: '(a) $6.7413 \\times 10^4$, (b) $1.45 \\times 10^{-3}$',
        keyTakeaway: 'Numbers greater than 10 have positive powers of 10; decimals between 0 and 1 have negative powers of 10.'
      }
    ]
  },

  // ==========================================
  // TOPIC 3: COMPOSITION AND CLASSIFICATION OF MATTER
  // ==========================================
  {
    id: 'note-chem-f1-t3',
    topicId: 'topic-chem-f1-t3-matter',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'TOPIC 3: COMPOSITION AND CLASSIFICATION OF MATTER',
    lessonBadge: 'TOPIC 3',
    summary: 'States and properties of matter, particulate nature, diffusion, elements, chemical symbols, molecules, compounds, chemical formulae, pure substances vs mixtures, solutions, and 6 separation techniques.',
    estimatedReadTimeMinutes: 15,
    version: 3,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-09-01',
    diagramUrl: SVG_DIFFUSION_EXPERIMENT,
    diagramCaption: 'Figure 3.1: Investigating diffusion in liquids using potassium permanganate crystals and water in a beaker.',
    learningObjectives: [
      'Define matter and describe the properties of solids, liquids, and gases.',
      'Explain the particulate nature of matter and describe the diffusion experiment.',
      'Identify the first 20 elements, their symbols, and Latin origins.',
      'Distinguish between elements, compounds, and mixtures.',
      'Write and interpret chemical formulae and count constituent atoms.',
      'Describe 6 separation methods: filtration, decantation, evaporation, distillation, paper chromatography, and magnetism.'
    ],
    keyPoints: [
      'Matter is anything that has mass and occupies space, existing as solids, liquids, or gases.',
      'Diffusion is the movement of particles from higher to lower concentration, proving particles are in constant motion.',
      'An element contains only one kind of atom; a compound contains two or more elements chemically combined.',
      'In chemical formulae, subscripts indicate the number of atoms (e.g. H₂O has 2 H and 1 O).'
    ],
    vocabulary: [
      {
        term: 'Matter',
        definition: 'Anything that has mass and occupies space.'
      },
      {
        term: 'Atom',
        definition: 'The smallest particle of matter.'
      },
      {
        term: 'Molecule',
        definition: 'The smallest particle of an element or compound that can exist in a free and separate state.'
      },
      {
        term: 'Diffusion',
        definition: 'The movement of particles from a region of higher concentration to lower concentration.'
      },
      {
        term: 'Saturated Solution',
        definition: 'A solution in which no more solute can dissolve at that particular temperature.'
      }
    ],
    didYouKnow: 'Ethanol boils at 78°C while water boils at 100°C, enabling fractional distillation to separate them completely in a fractionating column.',
    quickCheckQuestions: [
      {
        question: 'What is diffusion and what does it prove about matter?',
        answer: 'Diffusion is the movement of particles from high to low concentration. It proves that matter is made of tiny particles in constant random motion.'
      },
      {
        question: 'Give the chemical symbols and Latin names for Sodium, Potassium, Copper, and Iron.',
        answer: 'Sodium = Na (Natrium), Potassium = K (Kalium), Copper = Cu (Cuprum), Iron = Fe (Ferrum).'
      },
      {
        question: 'How many total atoms are in one molecule of copper nitrate, Cu(NO₃)₂?',
        answer: '9 atoms (1 Copper + 2 Nitrogen + 6 Oxygen).'
      },
      {
        question: 'State the difference between simple distillation and fractional distillation.',
        answer: 'Simple distillation separates a dissolved solid/solvent from a solution (e.g. water from salt solution); fractional distillation separates miscible liquids with different boiling points (e.g. ethanol and water).'
      }
    ],
    keyTakeaway: 'Understanding the particulate structure of matter explains physical states, solubility, and the laboratory techniques used to separate pure substances from mixtures.',
    content: `## MATTER

Matter is defined as anything that has mass and occupies space.

---

## STATES OF MATTER

There are three states of matter: **solids**, **liquids**, and **gases**.

### PROPERTIES OF MATTER

#### 1. SOLIDS
- Particles in solids are tightly packed, usually in a regular pattern.
- They do not flow because particles are not free to move, but vibrate in fixed positions.
- They have a definite shape and a definite volume.
- They are difficult to compress.

#### 2. LIQUIDS
- Particles in liquids are close together, but with no regular arrangement.
- Liquids flow because their particles are free to move while sticking together.
- They have an indefinite shape (take the shape of the container) and a definite volume.
- They are difficult to compress.

#### 3. GASES
- Particles are very far apart from each other with no regular arrangement.
- Particles move randomly at very high speeds in all directions.
- They have an indefinite shape and an indefinite volume.
- They can be easily compressed and flow freely.

---

## THE PARTICULATE NATURE OF MATTER

The particulate nature of matter explains how matter is put together:
- Matter is made up of small particles called **molecules**.
- The molecules are in turn made up of indivisible and invisible particles called **atoms**.

> **Atom** is defined as the smallest particle of matter.

---

## EVIDENCE OF THE PARTICULATE NATURE OF MATTER: DIFFUSION

The particulate nature of matter can be proved using the concept of **diffusion**.

> **Diffusion** is defined as the movement of particles from a region of a higher concentration to a region of a lower concentration.

- Diffusion takes place mainly in liquids and gases, occurring most quickly in gases because gas particles are far apart and move at high speeds.
- It does not take place in solids because solid particles are not free to move.

### INVESTIGATING DIFFUSION IN LIQUIDS
- **Materials:** A beaker, water, potassium permanganate crystals, thistle funnel.
- **Procedure:**
  1. Put the thistle funnel into the beaker.
  2. Slide a few crystals of potassium permanganate into the beaker through the thistle funnel.
  3. Pour water into the beaker and carefully remove the thistle funnel.
  4. Leave the set up for 5 minutes without shaking or swirling.
- **Observation:** The purple colour of potassium permanganate distributes evenly throughout the water.
- **Explanation:** Purple solute particles leave the crystals, collide with moving water particles, and spread evenly. This proves that matter is made of tiny particles in constant motion.

### COMMON EXAMPLES OF DIFFUSION IN EVERYDAY LIFE
- Smelling food being cooked when entering a restaurant or kitchen.
- Sugar dissolving and diffusing in water.
- Coffee grains spreading in hot water.
- Aroma of a person wearing perfumed clothes.

---

## ELEMENTS

An element is a substance which cannot be split into simpler substances by chemical means. Elements are made from only one kind of atom.

### CHEMICAL SYMBOLS OF ATOMS OF ELEMENTS
The chemical symbol is a shorthand form for writing the names of elements:
- All chemical symbols consist of **one or two letters**.
- The **first letter must always be capital** (e.g. H, C, N).
- A second lower-case letter is added when elements share the same initial letter (e.g. Ca, Cl, Mg).

### THE FIRST TWENTY ELEMENTS
| Name of Element | Chemical Symbol | Name of Element | Chemical Symbol |
| :--- | :--- | :--- | :--- |
| **Hydrogen** | H | **Sodium** | Na |
| **Helium** | He | **Magnesium** | Mg |
| **Lithium** | Li | **Aluminium** | Al |
| **Beryllium** | Be | **Silicon** | Si |
| **Boron** | B | **Phosphorous** | P |
| **Carbon** | C | **Sulphur** | S |
| **Nitrogen** | N | **Chlorine** | Cl |
| **Oxygen** | O | **Argon** | Ar |
| **Fluorine** | F | **Potassium** | K |
| **Neon** | Ne | **Calcium** | Ca |

### ELEMENTS WITH SYMBOLS DERIVED FROM LATIN NAMES
| Element | Latin Name | Chemical Symbol |
| :--- | :--- | :--- |
| **Sodium** | Natrium | **Na** |
| **Potassium** | Kalium | **K** |
| **Copper** | Cuprum | **Cu** |
| **Iron** | Ferrum | **Fe** |
| **Silver** | Argentum | **Ag** |
| **Lead** | Plumbum | **Pb** |
| **Gold** | Aurum | **Au** |
| **Mercury** | Hydrargyrum | **Hg** |

---

## MOLECULES

A molecule is the smallest particle of an element or a compound which can exist in a free and separate state.

### TYPES OF MOLECULES
- **a. MONOATOMIC MOLECULES** – Composed of one atom: $\text{He}$ (Helium), $\text{Ne}$ (Neon), $\text{Ar}$ (Argon), $\text{Xe}$ (Xenon), $\text{Rn}$ (Radon).
- **b. DIATOMIC MOLECULES** – Composed of two atoms: $\text{H}_2$ (Hydrogen), $\text{O}_2$ (Oxygen), $\text{N}_2$ (Nitrogen), $\text{F}_2$ (Fluorine), $\text{Cl}_2$ (Chlorine), $\text{Br}_2$ (Bromine), $\text{I}_2$ (Iodine).
- **c. POLYATOMIC MOLECULES** – Composed of three or more atoms: $\text{O}_3$ (Ozone), $\text{P}_4$ (Phosphorus), $\text{S}_8$ (Sulphur).

---

## COMPOUNDS

A compound is a pure substance made up of two or more different chemical elements chemically combined in a definite proportion.

### DIFFERENCES BETWEEN AN ELEMENT AND A COMPOUND
| Element | Compound |
| :--- | :--- |
| Made up of only one kind of atom | Made up of two or more elements chemically combined |
| Cannot be split into simpler substances by chemical means | Can be split into individual elements using chemical reactions |
| Represented by chemical symbols of atoms | Represented by chemical formulae |

---

## CHEMICAL FORMULAE OF SUBSTANCES

A chemical formula shows the types of atoms present and how many there are for each type:
- Types of atoms are indicated by **chemical symbols**.
- The number of atoms is indicated by a **subscript** (lowered small digit).

**Examples of Counting Atoms:**
- **Water ($\text{H}_2\text{O}$):**  
  $$2\text{ H} + 1\text{ O} = 3\text{ atoms in total}$$
- **Glucose ($\text{C}_6\text{H}_{12}\text{O}_6$):**  
  $$6\text{ C} + 12\text{ H} + 6\text{ O} = 24\text{ atoms in total}$$
- **Sodium Sulphate ($\text{Na}_2\text{SO}_4$):**  
  $$2\text{ Na} + 1\text{ S} + 4\text{ O} = 7\text{ atoms in total}$$
- **Copper(II) Nitrate ($\text{Cu(NO}_3)_2$):**  
  $$1\text{ Cu} + (2 \times 1\text{ N}) + (2 \times 3\text{ O}) = 1 + 2 + 6 = 9\text{ atoms in total}$$

---

## PURE SUBSTANCES AND MIXTURES

- **Pure Substance:** Has definite and constant properties throughout (e.g. pure water, refined sugar, ethanol).
- **Mixture:** Contains two or more substances not chemically joined together.
  - **Homogeneous Mixture:** Particles are uniformly distributed (e.g. salt solution, sugar solution, air).
  - **Heterogeneous Mixture:** Particles are not evenly distributed (e.g. sand and water, rock, muddy Lake Malawi water).

---

## SOLUTIONS & SOLUBILITY

A solution is a homogeneous mixture of a **solute** (substance that dissolves) and a **solvent** (liquid in which solute dissolves).
- **Aqueous solution:** Solvent is water (e.g. salt solution, tea).
- **Non-aqueous solution:** Solvent is not water (e.g. iodine in alcohol, grease in petrol).
- **Saturated solution:** A solution in which no more solute can dissolve at that particular temperature.
- **Unsaturated solution:** A solution in which more solute can dissolve at that temperature.

### FACTORS AFFECTING SOLUBILITY
1. **Temperature:** Solubility of most solids in liquids increases as temperature rises.
2. **Particle Size:** Smaller particles (fine powder) have a greater surface area exposed and dissolve much faster than large lumps.
3. **Stirring / Agitation:** Increases contact between solute and solvent particles.
4. **Nature of Solute and Solvent:** "Like dissolves like" (polar solutes dissolve in polar solvents such as water).

---

## METHODS OF SEPARATING MIXTURES

1. **Filtration:** Separates an insoluble solid from a liquid using filter paper (retains *residue*, passes *filtrate*; e.g. sand from water, muddy river water).
2. **Decantation:** Carefully pouring off the top liquid layer after solid settles or separating immiscible liquids (e.g. oil and water).
3. **Evaporation:** Separating a soluble solid from a liquid by heating until the solvent escapes (e.g. obtaining salt from Lake Chilwa brine).
4. **Simple Distillation:** Separates a pure solvent from a solution by boiling and condensing (e.g. pure distilled water from mineral water).
5. **Fractional Distillation:** Separates miscible liquids with different boiling points using a fractionating column (e.g. ethanol at $78^\circ\text{C}$ from water at $100^\circ\text{C}$; crude oil refining).
6. **Paper Chromatography:** Separates coloured substances (plant pigments, food dyes, ink dyes) based on different rates of movement over filter paper.
   > **Retention Factor ($R_f$):**
   > $$R_f = \frac{\text{Distance moved by solute spot}}{\text{Distance moved by solvent front}}$$
7. **Magnetism:** Separates magnetic materials (iron filings) from non-magnetic substances (sulphur powder, sand).`,
    workedExamples: [
      {
        id: 'we-chem-t3-1',
        title: 'Counting Atoms in a Chemical Formula',
        problem: 'Work out the total number of atoms present in one molecule of copper(II) nitrate, $\\text{Cu(NO}_3)_2$.',
        stepByStepSolution: [
          { step: 1, explanation: 'Identify atoms inside the bracket $(\\text{NO}_3)_2$ multiplied by subscript 2:', mathOrCode: '\\text{Nitrogen (N)} = 1 \\times 2 = 2 \\text{ atoms}; \\quad \\text{Oxygen (O)} = 3 \\times 2 = 6 \\text{ atoms}' },
          { step: 2, explanation: 'Add the single copper atom outside the bracket:', mathOrCode: '\\text{Copper (Cu)} = 1 \\text{ atom}' },
          { step: 3, explanation: 'Sum all constituent atoms:', mathOrCode: '1 + 2 + 6 = 9 \\text{ atoms in total}' }
        ],
        finalAnswer: '9 atoms',
        keyTakeaway: 'Subscripts outside brackets multiply every element inside the bracket.'
      }
    ]
  }
];
