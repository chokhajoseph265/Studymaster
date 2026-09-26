import { NoteItem } from '../../types';
import {
  SVG_ATOMIC_STRUCTURE,
  SVG_PERIODIC_TABLE_FIRST20,
  SVG_FRACTIONAL_DISTILLATION_PETROLEUM
} from './form1Diagrams';

export const FORM_1_CHEMISTRY_NOTES_PART_2: NoteItem[] = [
  // ==========================================
  // TOPIC 4: ATOMIC STRUCTURE
  // ==========================================
  {
    id: 'note-chem-f1-t4',
    topicId: 'topic-chem-f1-t4-atom',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'TOPIC 4 : ATOMIC STRUCTURE',
    lessonBadge: 'TOPIC 4',
    summary: 'Sub-atomic particles (protons, neutrons, electrons), electron configurations of first 20 elements, atomic number (Z), mass number (A), nuclide notation, isotopes, and relative atomic mass (RAM).',
    estimatedReadTimeMinutes: 14,
    version: 3,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-09-01',
    diagramUrl: SVG_ATOMIC_STRUCTURE,
    diagramCaption: 'Figure 4.1: Atomic structure of an atom showing central nucleus with protons and neutrons, surrounded by electrons in energy levels/shells.',
    learningObjectives: [
      'Define an atom and describe the characteristics of protons, neutrons, and electrons.',
      'Write the electron configuration of the first 20 elements.',
      'Distinguish between atomic number (Z) and mass number (A) and calculate neutrons (N = A - Z).',
      'Represent elements using standard nuclide notation (ᴬ_Z X).',
      'Define isotopes and calculate the relative atomic mass (RAM) from isotopic abundances.'
    ],
    keyPoints: [
      'An atom consists of a dense positive nucleus (protons + neutrons) surrounded by electrons in shells.',
      'Proton has +1 charge (1 amu), Electron has -1 charge (almost zero mass), Neutron has 0 charge (1 amu).',
      'Mass number A = Z (protons) + N (neutrons).',
      'Isotopes are atoms of the same element with the same atomic number (Z) but different mass numbers (A).'
    ],
    vocabulary: [
      {
        term: 'Atomic Number (Z)',
        definition: 'The number of protons in the nucleus of an atom.'
      },
      {
        term: 'Mass Number (A)',
        definition: 'The total number of protons and neutrons in the nucleus of an atom.'
      },
      {
        term: 'Electron Configuration',
        definition: 'The arrangement and distribution of electrons across the energy levels/shells of an atom.'
      },
      {
        term: 'Isotopes',
        definition: 'Atoms of the same element with the same atomic number but different mass numbers due to differing neutron counts.'
      }
    ],
    didYouKnow: 'Chlorine exists naturally as 75% Chlorine-35 and 25% Chlorine-37, giving it a Relative Atomic Mass of exactly 35.5 amu.',
    quickCheckQuestions: [
      {
        question: 'State the charge, relative mass, and location of a proton, neutron, and electron.',
        answer: 'Proton: $+1$, $1\\text{ amu}$, nucleus; Neutron: $0$, $1\\text{ amu}$, nucleus; Electron: $-1$, $\\frac{1}{1840}\\text{ amu}$ (almost zero), energy shells.'
      },
      {
        question: 'Write the electron configuration of Sodium (atomic number 11) and Calcium (atomic number 20).',
        answer: 'Sodium: $2.8.1$; \\quad Calcium: $2.8.8.2$'
      },
      {
        question: 'An atom has 17 protons, 17 electrons, and 20 neutrons. State its atomic number, mass number, and nuclide symbol.',
        answer: 'Atomic number $Z = 17$, Mass number $A = 17 + 20 = 37$, Nuclide symbol: ${}^{37}_{17}\\text{Cl}$'
      }
    ],
    keyTakeaway: 'The electronic structure of an atom dictates its chemical identity, position in the Periodic Table, and chemical reactivity.',
    content: `## ATOM

An atom is the smallest particle of matter.

---

## COMPOSITION OF AN ATOM

An atom consists of three sub-atomic particles: **protons**, **neutrons**, and **electrons**. The central part of the atom is called the **nucleus**.

### THE NUCLEUS
- It contains **protons** and **neutrons** (together termed *nucleons*).
- It carries an overall positive charge because of the protons.
- Practically the whole mass of the atom is concentrated in the nucleus.
- It is extremely tiny compared to the overall volume of the atom.

### ENERGY LEVELS OR SHELLS
- Outside the nucleus are regions called **energy levels** or **electron shells**.
- These are specific paths through which electrons orbit around the nucleus.
- Each shell is at a distinct energy distance from the nucleus and holds a definite maximum number of electrons ($2n^2$).

---

## CHARACTERISTICS OF PARTICLES THAT MAKE AN ATOM

1. **PROTONS**
   - Positively charged particles ($+1$ elementary charge).
   - Relative mass = $1\\text{ amu}$ (atomic mass unit).
   - Located inside the nucleus.
2. **ELECTRONS**
   - Negatively charged particles ($-1$ elementary charge).
   - Relative mass = $\\frac{1}{1840}\\text{ amu}$ (negligible).
   - Move rapidly in electron shells around the nucleus.
3. **NEUTRONS**
   - Electrically neutral particles ($0$ charge).
   - Relative mass = $1\\text{ amu}$.
   - Located inside the nucleus.

### SUMMARY TABLE OF SUB-ATOMIC PARTICLES
| Particle | Symbol | Relative Charge | Relative Mass (amu) | Location in Atom |
| :--- | :--- | :--- | :--- | :--- |
| **Proton** | $\\text{p}^+$ | $+1$ | $1$ | Nucleus |
| **Electron** | $\\text{e}^-$ | $-1$ | $\\frac{1}{1840}$ (negligible) | Energy levels / shells |
| **Neutron** | $\\text{n}^0$ | $0$ | $1$ | Nucleus |

---

## ELECTRON CONFIGURATION

Electron configuration describes the arrangement and distribution of electrons in the shells of an atom.

For the first twenty elements, electrons fill shells in order of increasing energy:
- The **1st shell** ($n = 1$) holds a maximum of **$2$ electrons**.
- The **2nd shell** ($n = 2$) holds a maximum of **$8$ electrons**.
- The **3rd shell** ($n = 3$) holds a maximum of **$8$ electrons**.
- The **4th shell** ($n = 4$) holds up to **$2$ electrons** (for Potassium and Calcium).

**Standard Configurations:**
- **Hydrogen (1 e⁻):** $1$
- **Carbon (6 e⁻):** $2.4$
- **Sodium (11 e⁻):** $2.8.1$
- **Calcium (20 e⁻):** $2.8.8.2$

---

## ATOMIC NUMBER AND MASS NUMBER

- **Atomic Number ($Z$):** The number of protons in the nucleus of an atom. It is the unique identity of an element.
- **Mass Number ($A$):** The total number of protons and neutrons in the nucleus of an atom.

> **Fundamental Equations:**
> $$A = Z + N$$
> $$N = A - Z$$
> *(where $A$ = Mass Number, $Z$ = Atomic Number, $N$ = Number of Neutrons)*

In any electrically neutral atom:
$$\\text{Number of Protons } (Z) = \\text{Number of Electrons}$$

---

## NUCLIDE SYMBOLS

A nuclide is written using the chemical symbol with the mass number as the top superscript and the atomic number as the bottom subscript:

$$ {}^{A}_{Z}\text{X} $$

**Examples:**
- **Sodium ($^{23}_{11}\text{Na}$):**
  - Protons = $11$
  - Electrons = $11$
  - Neutrons = $23 - 11 = 12$
- **Carbon-12 ($^{12}_{6}\text{C}$):**
  - Protons = $6$
  - Electrons = $6$
  - Neutrons = $12 - 6 = 6$
- **Chlorine-35 ($^{35}_{17}\text{Cl}$):**
  - Protons = $17$
  - Electrons = $17$
  - Neutrons = $35 - 17 = 18$

---

## ISOTOPES

Isotopes are atoms of the same chemical element that have the **same atomic number ($Z$)** (same number of protons) but **different mass numbers ($A$)** (different numbers of neutrons).

### EXAMPLES OF ISOTOPES
| Element | Isotope Name | Standard Nuclide Notation | Protons ($Z$) | Neutrons ($N$) | Electrons |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hydrogen** | Hydrogen-1 (Protium) | $ {}^{1}_{1}\text{H} $ | $1$ | $0$ | $1$ |
| | Hydrogen-2 (Deuterium) | $ {}^{2}_{1}\text{H} $ | $1$ | $1$ | $1$ |
| | Hydrogen-3 (Tritium) | $ {}^{3}_{1}\text{H} $ | $1$ | $2$ | $1$ |
| **Carbon** | Carbon-12 | $ {}^{12}_{6}\text{C} $ | $6$ | $6$ | $6$ |
| | Carbon-14 | $ {}^{14}_{6}\text{C} $ | $6$ | $8$ | $6$ |
| **Chlorine** | Chlorine-35 | $ {}^{35}_{17}\text{Cl} $ | $17$ | $18$ | $17$ |
| | Chlorine-37 | $ {}^{37}_{17}\text{Cl} $ | $17$ | $20$ | $17$ |

### KEY PROPERTIES OF ISOTOPES
- Have the exact same number of protons and electrons.
- Have differing numbers of neutrons.
- Share identical chemical properties because they have the same valence electron configuration.
- Have slightly different physical properties (such as density and boiling points) due to difference in mass.

---

## CALCULATING RELATIVE ATOMIC MASS (RAM)

Relative Atomic Mass is the weighted average mass of the naturally occurring isotopes of an element relative to $\\frac{1}{12}$th the mass of a Carbon-12 atom:

$$\\text{RAM} = \\frac{(\\%_1 \\times A_1) + (\\%_2 \\times A_2) + \\dots}{100}$$

**Example for Chlorine:**  
Chlorine consists of $75\\%$ $^{35}_{17}\\text{Cl}$ and $25\\%$ $^{37}_{17}\\text{Cl}$:
$$\\text{RAM}(\\text{Cl}) = \\frac{(75 \\times 35) + (25 \\times 37)}{100} = \\frac{2625 + 925}{100} = \\frac{3550}{100} = 35.5\\text{ amu}$$`,
    workedExamples: [
      {
        id: 'we-chem-t4-1',
        title: 'Calculating RAM from Isotopic Abundance',
        problem: 'A natural sample of neon consists of $90\\%$ of atoms of $^{20}_{10}\\text{Ne}$ and $10\\%$ of atoms of $^{22}_{10}\\text{Ne}$. Calculate the relative atomic mass (RAM) of neon.',
        stepByStepSolution: [
          { step: 1, explanation: 'State the formula for Relative Atomic Mass:', mathOrCode: '\\text{RAM} = \\frac{(\\%_1 \\times A_1) + (\\%_2 \\times A_2)}{100}' },
          { step: 2, explanation: 'Substitute the given values:', mathOrCode: '\\text{RAM} = \\frac{(90 \\times 20) + (10 \\times 22)}{100}' },
          { step: 3, explanation: 'Calculate numerator and divide by 100:', mathOrCode: '\\text{RAM} = \\frac{1800 + 220}{100} = \\frac{2020}{100} = 20.2\\text{ amu}' }
        ],
        finalAnswer: '20.2 amu',
        keyTakeaway: 'The relative atomic mass is a weighted average reflecting natural isotopic abundance.'
      }
    ]
  },

  // ==========================================
  // TOPIC 5: THE PERIODIC TABLE
  // ==========================================
  {
    id: 'note-chem-f1-t5',
    topicId: 'topic-chem-f1-t5-periodic',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'TOPIC 5 : THE PERIODIC TABLE',
    lessonBadge: 'TOPIC 5',
    summary: 'Organization of elements into 8 groups and 4 periods, valence electrons, number of shells, metals/metalloids/non-metals distribution, and family names (alkali metals, alkaline earth, halogens, noble gases).',
    estimatedReadTimeMinutes: 12,
    version: 3,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-09-01',
    diagramUrl: SVG_PERIODIC_TABLE_FIRST20,
    diagramCaption: 'Figure 5.1: The Periodic Table of the first twenty elements arranged by Groups (I to VIII) and Periods (1 to 4).',
    learningObjectives: [
      'Define the Periodic Table and state its main features (groups and periods).',
      'Relate the number of valence electrons to group number.',
      'Relate the number of electron shells to period number.',
      'Classify elements into metals, metalloids, and non-metals.',
      'Identify special family names: Alkali metals, Alkaline earth metals, Halogens, and Noble gases.'
    ],
    keyPoints: [
      'Groups are vertical columns (I to VIII); group number = number of valence electrons.',
      'Periods are horizontal rows (1 to 4); period number = number of electron shells.',
      'Metals are on the left (Groups I, II, III); Non-metals are on the right (Groups V, VI, VII, VIII).',
      'Group I = Alkali metals; Group II = Alkaline earth metals; Group VII = Halogens; Group VIII = Noble gases.'
    ],
    vocabulary: [
      {
        term: 'Group',
        definition: 'A vertical column of elements in the Periodic Table having the same number of valence electrons.'
      },
      {
        term: 'Period',
        definition: 'A horizontal row of elements in the Periodic Table having the same number of electron shells.'
      },
      {
        term: 'Valence Electrons',
        definition: 'The electrons in the outermost electron shell of an atom.'
      },
      {
        term: 'Noble Gases',
        definition: 'Unreactive elements in Group VIII with fully filled, stable outer electron shells.'
      }
    ],
    didYouKnow: 'Noble gases in Group VIII (He, Ne, Ar) do not easily react with other elements because their outermost electron shells are completely full and stable.',
    quickCheckQuestions: [
      {
        question: 'What does the group number and period number tell you about an atom?',
        answer: 'Group number tells the number of valence electrons in the outermost shell; Period number tells the total number of electron shells.'
      },
      {
        question: 'Name the special families for Group I, Group II, Group VII, and Group VIII.',
        answer: 'Group I = Alkali metals, Group II = Alkaline earth metals, Group VII = Halogens, Group VIII = Noble gases (inert gases).'
      },
      {
        question: 'An element X has electron configuration 2.8.8.1. State its group and period with reasons.',
        answer: 'Group I (1 valence electron in outermost shell); Period 4 (4 electron shells occupied).'
      }
    ],
    keyTakeaway: 'The Periodic Table organizes elements so that elements with identical valence configurations and chemical properties fall in the same vertical groups.',
    content: `## THE PERIODIC TABLE

The periodic table is a table in which chemical elements are arranged according to their atomic numbers, electron configurations, and recurring chemical properties.

---

## MAIN FEATURES OF THE PERIODIC TABLE

There are two main features of the periodic table: **groups** and **periods**.

### GROUPS
- Vertical columns of elements, also called **families**.
- There are **eight groups**, indicated by Roman numerals: **I, II, III, IV, V, VI, VII, and VIII**.
- Elements in the same group:
  - Have the **same number of electrons in the outermost shell** (valence electrons).
  - Have **similar physical and chemical properties**.
  - Show consistent trends in reactivity, melting, and boiling points.

### PERIODS
- Horizontal rows of elements, also called **series**.
- There are **four periods** in the first twenty elements (indicated by numbers 1, 2, 3, 4).
- All elements in the same period have the **same number of electron shells**.

---

## GENERAL DISTRIBUTION OF ELEMENTS IN THE PERIODIC TABLE

Elements in the Periodic Table are classified into:
- **Metals:** Groups I, II, and III (e.g. Sodium, Magnesium, Aluminium).
- **Metalloids (semi-metals):** Groups III and IV (e.g. Boron, Silicon).
- **Non-metals:** Groups V, VI, VII, and VIII (e.g. Nitrogen, Oxygen, Chlorine, Argon).

---

## ELECTRON CONFIGURATION IN THE PERIODIC TABLE

| Group I | Group II | Group III | Group IV | Group V | Group VI | Group VII | Group VIII |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **H (1)** | | | | | | | **He (2)** |
| **Li (2.1)** | **Be (2.2)** | **B (2.3)** | **C (2.4)** | **N (2.5)** | **O (2.6)** | **F (2.7)** | **Ne (2.8)** |
| **Na (2.8.1)** | **Mg (2.8.2)** | **Al (2.8.3)** | **Si (2.8.4)** | **P (2.8.5)** | **S (2.8.6)** | **Cl (2.8.7)** | **Ar (2.8.8)** |
| **K (2.8.8.1)** | **Ca (2.8.8.2)** | | | | | | |

---

## PREDICTING GROUP AND PERIOD FROM ELECTRON CONFIGURATION

- **Group Number** = Number of valence electrons in the outermost shell.
- **Period Number** = Total number of occupied electron shells.

**Example:** Potassium (³⁹₁₉K)
- Electron configuration = **2.8.8.1**
- Valence electrons = **1** → **Group I**
- Total occupied shells = **4** → **Period 4**
- Number of neutrons = 39 - 19 = **20 neutrons**

---

## SPECIAL FAMILY NAMES OF GROUPS

1. **Group I Elements – Alkali Metals:** Lithium (Li), Sodium (Na), Potassium (K). *(Note: Hydrogen is placed in Group I because it has 1 valence electron, but it is a non-metal gas).*
2. **Group II Elements – Alkaline Earth Metals:** Beryllium (Be), Magnesium (Mg), Calcium (Ca).
3. **Group VII Elements – Halogens:** Fluorine (F), Chlorine (Cl), Bromine (Br), Iodine (I).
4. **Group VIII Elements – Noble Gases (Inert Gases):** Helium (He), Neon (Ne), Argon (Ar). Have full outer shells and do not readily react.`,
    workedExamples: [
      {
        id: 'we-chem-t5-1',
        title: 'Determining Group and Period',
        problem: 'An element X has atomic number 16 and mass number 32. Determine its electron configuration, group, period, and number of neutrons.',
        stepByStepSolution: [
          { step: 1, explanation: 'Distribute 16 electrons into shells:', mathOrCode: '2.8.6' },
          { step: 2, explanation: 'Determine group and period:', mathOrCode: 'Group VI (6 valence electrons), Period 3 (3 shells)' },
          { step: 3, explanation: 'Calculate neutrons:', mathOrCode: 'N = 32 - 16 = 16 neutrons' }
        ],
        finalAnswer: 'Config: 2.8.6; Group VI; Period 3; 16 Neutrons (Element is Sulphur)',
        keyTakeaway: 'Valence electrons determine group; number of shells determines period.'
      }
    ]
  },

  // ==========================================
  // TOPIC 6: PHYSICAL AND CHEMICAL CHANGES
  // ==========================================
  {
    id: 'note-chem-f1-t6',
    topicId: 'topic-chem-f1-t6-changes',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'TOPIC 6 : PHYSICAL AND CHEMICAL CHANGES',
    lessonBadge: 'TOPIC 6',
    summary: 'Physical vs chemical changes, chemical reactions, word and symbol equations, balancing chemical equations, law of conservation of matter, and calculating percentage composition by mass.',
    estimatedReadTimeMinutes: 15,
    version: 3,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-09-01',
    learningObjectives: [
      'Distinguish between physical and chemical changes with characteristics and examples.',
      'Identify reactants and products in a chemical reaction.',
      'Write word equations and balanced chemical symbol equations with state symbols.',
      'State and apply the Law of Conservation of Matter in mass calculations.',
      'Calculate the percentage composition by mass of each element in a compound.'
    ],
    keyPoints: [
      'Physical changes form no new substances and are usually reversible (e.g. melting ice).',
      'Chemical changes form new substances and are irreversible (e.g. burning wood, rusting).',
      'In a balanced chemical equation, the number of atoms of each element must be equal on both sides.',
      'Law of Conservation of Matter: Total mass of reactants = Total mass of products.'
    ],
    vocabulary: [
      {
        term: 'Physical Change',
        definition: 'A process in which no new substance is formed and mass remains unchanged.'
      },
      {
        term: 'Chemical Change',
        definition: 'A process in which new substances with different properties are formed.'
      },
      {
        term: 'Reactants',
        definition: 'Substances that take part in and undergo change during a chemical reaction.'
      },
      {
        term: 'Products',
        definition: 'Substances that are formed as a result of a chemical reaction.'
      }
    ],
    didYouKnow: 'Mass is never lost during a chemical reaction; atoms simply re-arrange to form new substances with identical total mass.',
    quickCheckQuestions: [
      {
        question: 'State three differences between a physical change and a chemical change.',
        answer: '1. Physical: No new substance formed; Chemical: New substance formed. 2. Physical: Reversible; Chemical: Irreversible. 3. Physical: Mass unchanged; Chemical: Mass of individual substances changes.'
      },
      {
        question: 'State the Law of Conservation of Matter.',
        answer: 'Matter is neither created nor destroyed in a chemical reaction; total mass of reactants equals total mass of products.'
      },
      {
        question: 'Balance the equation: H₂ + O₂ → H₂O',
        answer: '2H₂(g) + O₂(g) → 2H₂O(l)'
      }
    ],
    keyTakeaway: 'Chemical equations quantitatively model the rearrangement of atoms during reactions, governed strictly by mass conservation.',
    content: `## PHYSICAL CHANGE

A physical change is a process in which no new substance is formed. Only the physical properties (state, size, shape) of the substance change.

### EXAMPLES OF PHYSICAL CHANGES
- Melting of candle wax
- Melting of ice into water / freezing water into ice
- Dissolving of sugar or salt in water
- Changes of state (condensation, evaporation, sublimation)

### CHARACTERISTICS OF A PHYSICAL CHANGE
- No new substance is formed.
- No energy is either given out or absorbed.
- The mass of the substance does not change.
- The change is usually reversible.

---

## CHEMICAL CHANGE

A chemical change is a process in which a new substance is formed with entirely different properties.

### EXAMPLES OF CHEMICAL CHANGES
- Combustion of fuels (petrol, diesel, gas)
- Burning of wood, charcoal, and paper
- Rusting of iron
- Souring of milk / fermentation

### CHARACTERISTICS OF A CHEMICAL CHANGE
- A new substance is formed.
- Energy is usually given out or absorbed (heat/light).
- The mass of individual reacting substances changes.
- The change is usually irreversible.

---

## DIFFERENCES BETWEEN PHYSICAL AND CHEMICAL CHANGES

| Physical Change | Chemical Change |
| :--- | :--- |
| No new substance is formed | A new substance is formed |
| No energy is either given out or absorbed | Energy is usually given out or absorbed |
| The mass of the substance does not change | The mass of individual reacting substances changes |
| The change is usually reversible | The change is usually irreversible |

---

## CHEMICAL REACTIONS & EQUATIONS

A chemical reaction is the rearrangement of atoms to form new substances.
- **Reactants:** Substances that take part in and undergo change (written on the left).
- **Products:** Substances formed as a result of the reaction (written on the right).

> **Reactants → Products**

### WAYS OF WRITING CHEMICAL EQUATIONS
1. **Word Equations:** Uses names of reactants and products:
   $$\text{Magnesium} + \text{Oxygen} \longrightarrow \text{Magnesium oxide}$$
2. **Chemical Formula Equations:** Uses chemical symbols, formulae, and balancing coefficients:
   $$2\text{Mg(s)} + \text{O}_2\text{(g)} \longrightarrow 2\text{MgO(s)}$$

### STATE SYMBOLS
- **(s)** = solid state
- **(l)** = liquid state
- **(g)** = gaseous state
- **(aq)** = aqueous solution (dissolved in water)

---

## BALANCING CHEMICAL EQUATIONS

Balancing ensures that the exact same number of atoms of each element exists on both the reactant and product sides of the equation.

**Step-by-Step Balancing of $\text{H}_2 + \text{O}_2 \longrightarrow \text{H}_2\text{O}$:**
1. **Count atoms on both sides:**
   - Reactants: $2\text{ H}, \, 2\text{ O}$
   - Products: $2\text{ H}, \, 1\text{ O}$ (Oxygen is unbalanced)
2. **Multiply $\text{H}_2\text{O}$ by coefficient 2:**
   $$\text{H}_2 + \text{O}_2 \longrightarrow 2\text{H}_2\text{O}$$
   *(Now: Reactants have $2\text{ H}$, Products have $4\text{ H}$)*
3. **Multiply $\text{H}_2$ by coefficient 2:**
   $$2\text{H}_2 + \text{O}_2 \longrightarrow 2\text{H}_2\text{O}$$
   *(Reactants: $4\text{ H}, \, 2\text{ O}$; Products: $4\text{ H}, \, 2\text{ O}$ — Balanced!)*
4. **Insert state symbols:**
   $$2\text{H}_2\text{(g)} + \text{O}_2\text{(g)} \longrightarrow 2\text{H}_2\text{O(l)}$$

---

## THE LAW OF CONSERVATION OF MATTER

> **The Law of Conservation of Matter states that matter is neither created nor destroyed during a chemical reaction.**

Total mass of reactants equals total mass of products:
$$\sum \text{Mass of Reactants} = \sum \text{Mass of Products}$$

**Example:**
$$2\text{H}_2\text{(g)} + \text{O}_2\text{(g)} \longrightarrow 2\text{H}_2\text{O(l)}$$
$$4\text{ g (Hydrogen)} + 32\text{ g (Oxygen)} = 36\text{ g (Water)}$$

---

## PERCENTAGE COMPOSITION BY MASS

The percentage by mass of an element in a chemical compound is calculated using:

$$\% \text{ of Element} = \frac{\text{Total Mass of Element in Formula}}{\text{Relative Formula Mass } (M_r) \text{ of Compound}} \times 100\%$$

**Example for Calcium Carbonate ($\text{CaCO}_3$):**  
Given Relative Atomic Masses: $A_r(\text{Ca}) = 40, \, A_r(\text{C}) = 12, \, A_r(\text{O}) = 16$
- **Relative Formula Mass ($M_r$) of $\text{CaCO}_3$:**
  $$M_r = (40 \times 1) + (12 \times 1) + (16 \times 3) = 40 + 12 + 48 = 100\text{ amu}$$
- **$\%$ Calcium ($\text{Ca}$):**
  $$\frac{40}{100} \times 100\% = 40\%$$
- **$\%$ Carbon ($\text{C}$):**
  $$\frac{12}{100} \times 100\% = 12\%$$
- **$\%$ Oxygen ($\text{O}$):**
  $$\frac{48}{100} \times 100\% = 48\%$$`,
    workedExamples: [
      {
        id: 'we-chem-t6-1',
        title: 'Percentage Composition of Ammonium Nitrate',
        problem: 'Work out the percentage composition by mass of each element in ammonium nitrate, $\\text{NH}_4\\text{NO}_3$. $(A_r: \\text{N} = 14, \\, \\text{H} = 1, \\, \\text{O} = 16)$',
        stepByStepSolution: [
          { step: 1, explanation: 'Calculate Relative Formula Mass ($M_r$) of $\\text{NH}_4\\text{NO}_3$:', mathOrCode: 'M_r = (14 \\times 2) + (1 \\times 4) + (16 \\times 3) = 28 + 4 + 48 = 80\\text{ amu}' },
          { step: 2, explanation: 'Calculate percentage of Nitrogen (N):', mathOrCode: '\\%\\text{N} = \\frac{28}{80} \\times 100\\% = 35\\%' },
          { step: 3, explanation: 'Calculate percentage of Hydrogen (H):', mathOrCode: '\\%\\text{H} = \\frac{4}{80} \\times 100\\% = 5\\%' },
          { step: 4, explanation: 'Calculate percentage of Oxygen (O):', mathOrCode: '\\%\\text{O} = \\frac{48}{80} \\times 100\\% = 60\\%' }
        ],
        finalAnswer: '$\\text{N} = 35\\%, \\quad \\text{H} = 5\\%, \\quad \\text{O} = 60\\%$',
        keyTakeaway: 'The sum of all percentage compositions must equal 100%: $35\\% + 5\\% + 60\\% = 100\\%$.'
      }
    ]
  },

  // ==========================================
  // TOPIC 7: ORGANIC COMPOUNDS
  // ==========================================
  {
    id: 'note-chem-f1-t7',
    topicId: 'topic-chem-f1-t7-organic',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'TOPIC 7 : ORGANIC COMPOUNDS',
    lessonBadge: 'TOPIC 7',
    summary: 'Meaning of organic compounds, history, natural sources (plants, animals, fossil fuels), bio fuels vs fossil fuels, petroleum composition, fractional distillation column, and uses of petroleum fractions.',
    estimatedReadTimeMinutes: 12,
    version: 3,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-09-01',
    diagramUrl: SVG_FRACTIONAL_DISTILLATION_PETROLEUM,
    diagramCaption: 'Figure 7.1: Industrial fractional distillation of crude petroleum showing fractions separated by carbon chain length and boiling points.',
    learningObjectives: [
      'Define organic compounds and state compounds excluded from organic chemistry.',
      'Describe sources of organic compounds: living organisms, fossil fuels, natural gas, and coal.',
      'Classify fuels into renewable bio fuels and non-renewable fossil fuels.',
      'Explain how crude petroleum is separated into fractions by fractional distillation.',
      'List the main fractions of petroleum and their domestic and industrial uses.'
    ],
    keyPoints: [
      'Organic compounds contain carbon (except CO, CO₂, metal carbonates, and hydrogen carbonates).',
      'Bio fuels (wood, biogas, ethanol) are renewable; fossil fuels (crude oil, coal, natural gas) are non-renewable.',
      'Petroleum is a mixture of hydrocarbons separated into fractions using fractional distillation.',
      'Fractions with low boiling points and short carbon chains condense at the top (refinery gas, petrol).'
    ],
    vocabulary: [
      {
        term: 'Organic Compound',
        definition: 'A chemical compound that contains the element carbon in its molecule (excluding simple carbon oxides and carbonates).'
      },
      {
        term: 'Hydrocarbon',
        definition: 'An organic compound containing only hydrogen and carbon atoms.'
      },
      {
        term: 'Bio Fuel',
        definition: 'Renewable fuel derived from living or recently harvested plant and organic materials.'
      },
      {
        term: 'Fractional Distillation',
        definition: 'Industrial process separating crude oil into useful fractions based on differences in boiling points.'
      }
    ],
    didYouKnow: 'Bitumen has the longest carbon chains (>C₅₀) and highest boiling point (>400°C), remaining at the bottom of the column to be used for tarmacking roads and waterproofing roofs in Malawi.',
    quickCheckQuestions: [
      {
        question: 'What is an organic compound and which carbon compounds are excluded?',
        answer: 'An organic compound contains carbon. Excluded carbon compounds: carbon monoxide (CO), carbon dioxide (CO₂), metal carbonates, and hydrogen carbonates.'
      },
      {
        question: 'Differentiate between bio fuels and fossil fuels with two examples of each.',
        answer: 'Bio fuels are renewable fuels made from plants (e.g. wood, ethanol, biogas); fossil fuels are non-renewable fuels formed from ancient decomposed organisms (e.g. crude oil, coal, natural gas).'
      },
      {
        question: 'List four fractions obtained from crude petroleum and state one use for each.',
        answer: '1. Petrol: Fuel for vehicles. 2. Kerosene: Jet fuel and lamp lighting. 3. Diesel: Fuel for heavy trucks/buses. 4. Bitumen: Tarmacking roads and roofing.'
      }
    ],
    keyTakeaway: 'Organic chemistry encompasses carbon-based fuels and materials vital to modern Malawian transportation, energy, and industry.',
    content: `## ORGANIC COMPOUNDS

An organic compound is a compound that contains the element **carbon** in its molecule. The branch of chemistry that deals with organic compounds is called **organic chemistry**.

- **Examples of organic compounds:** Proteins, carbohydrates, fats, crude oil, plastics, and medical drugs.
- **Exceptions:** Compounds such as **carbon monoxide (CO)**, **carbon dioxide (CO₂)**, **metal carbonates (e.g. CaCO₃)**, and **hydrogen carbonates** are **NOT** considered organic compounds even though they contain carbon.

---

## HISTORY OF ORGANIC COMPOUNDS

A long time ago, scientists believed that organic compounds could only be produced by living organisms (vital force theory). For example, DNA and insulin in human bodies. Today, it is well established that organic compounds can also be synthesized artificially in laboratories by organic chemists.

---

## SOURCES OF ORGANIC COMPOUNDS

1. **Plants and Animals:** Synthesize carbohydrates, sugars, starches, fats, dyes, and natural drugs.
2. **Fossil Fuels:** Formed from decomposed remains of plants and animals buried under heat and pressure over millions of years.
3. **Natural Gas:** Hydrocarbon found underground above crude oil deposits (contains 95% methane gas).
4. **Coal:** Solid fossil fuel formed from ancient decayed plant vegetation.

---

## ORGANIC COMPOUNDS AS FUELS

A fuel is a substance that is used to provide energy (in solid, liquid, or gas form).

### SUBSTANCES USED AS FUELS IN HOMES
- Charcoal
- Butane (gas cylinders)
- Paraffin (kerosene for lamps/stoves)
- Firewood
- Coal
- Petrol & Diesel
- Ethanol & Methylated spirits

---

## CLASSES OF FUELS

### 1. BIO FUELS
Fuels made from plants and organic matter. They are **renewable** (can be replaced by growing more crops).
- *Examples:* Firewood, biogas, biodiesel, and ethanol (manufactured from sugar and maize starch at Dwangwa and Nchalo).

### 2. FOSSIL FUELS
Fuels formed from ancient remains of decayed plants and animals buried underground. They are **non-renewable**.
- *Examples:* Petroleum (crude oil), coal, and natural gas.

---

## PETROLEUM (CRUDE OIL)

Petroleum is a dark liquid mixture of **hydrocarbons** (compounds containing only carbon and hydrogen atoms).

### SEPARATION BY FRACTIONAL DISTILLATION
Crude oil is separated into useful components called **fractions** using a **fractionating column**.
- Crude oil is heated in a furnace above 400°C.
- Vapours rise up the fractionating column (hot at the bottom, cool at the top).
- Fractions with **lower boiling points** and **shorter carbon chains** condense near the top.
- Fractions with **higher boiling points** and **longer carbon chains** condense near the bottom.

---

## USES OF FRACTIONS OF PETROLEUM

| Fraction | Carbon Atoms | Boiling Point | Domestic & Industrial Uses |
| :--- | :--- | :--- | :--- |
| **Refinery Gas** | C₁ to C₄ | < 25°C | Bottled gas for cooking and heating (LPG/butane). |
| **Petrol (Gasoline)** | C₅ to C₆ | 40°C - 100°C | Fuel for light vehicles and cars. |
| **Naphtha** | C₆ to C₁₀ | 100°C - 170°C | Chemical feedstock for manufacturing plastics. |
| **Kerosene (Paraffin)** | C₁₀ to C₁₅ | 170°C - 250°C | Aviation jet fuel; domestic lamp lighting and stoves. |
| **Diesel Oil** | C₁₅ to C₂₀ | 250°C - 350°C | Fuel for heavy vehicles (lorries, buses, trains). |
| **Fuel Oil** | C₂₀ to C₃₀ | 350°C - 400°C | Fuel for ships, power stations, and industrial boilers. |
| **Lubricating Oil / Wax** | C₃₀ to C₅₀ | > 400°C | Lubricating machine engine parts; making candles and polishes. |
| **Bitumen (Asphalt)** | > C₅₀ | Solid residue | Tarmacking tarmac roads and waterproofing leaking roofs. |`,
    workedExamples: [
      {
        id: 'we-chem-t7-1',
        title: 'Identifying Petroleum Fractions',
        problem: 'Which petroleum fraction is used for tarmacking roads, and why is it collected at the bottom of the fractionating column?',
        stepByStepSolution: [
          { step: 1, explanation: 'Identify the fraction:', mathOrCode: 'Bitumen (asphalt)' },
          { step: 2, explanation: 'Explain column position:', mathOrCode: 'Bitumen contains the largest hydrocarbon molecules (>C₅₀) with the highest boiling points (>400°C), remaining as a thick liquid residue at the base of the column.' }
        ],
        finalAnswer: 'Bitumen (has the highest boiling point and longest carbon chain)',
        keyTakeaway: 'The height at which a fraction condenses depends directly on its boiling point and molecular size.'
      }
    ]
  }
];
