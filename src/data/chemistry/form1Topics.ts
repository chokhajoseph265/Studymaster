import { Subject, Topic } from '../../types';

export const CHEMISTRY_SUBJECT: Subject = {
  id: 'subj-chem',
  name: 'Chemistry',
  forms: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
  icon: 'FlaskConical',
  category: 'Sciences',
  description: 'Introduction to chemistry, scientific methods, atomic structure, periodic table, chemical equations, stoichiometric calculations, and organic fuels for Junior and Senior secondary.',
  status: 'published'
};

export const FORM_1_CHEMISTRY_TOPICS: Topic[] = [
  {
    id: 'topic-chem-f1-t1-intro',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Topic 1: Introduction to Chemistry & Laboratory Safety',
    summary: 'Explore the meaning and branches of chemistry, real-life applications in Malawi, careers, laboratory safety rules, apparatus, hazard symbols, SI measurement units, and the scientific method of inquiry.',
    order: 1,
    status: 'published',
    keyConcepts: [
      'Meaning & 6 Branches of Chemistry',
      'Applications in Malawi (Water Treatment, Food, Soap, Medicine)',
      'Laboratory Safety Rules & Protective Equipment (PPE)',
      'Common Apparatus & Hazard Warning Symbols',
      'SI Units, Derived Units & Metric Prefixes',
      'Measuring Mass, Volume, Temperature & Time',
      '5 Steps of Scientific Inquiry'
    ],
    formulasOrFacts: [
      'Basic SI Units: Length (m), Mass (kg), Time (s), Temperature (K)',
      'Derived Units: Area (m²), Volume (m³), Speed (m/s), Density (kg/m³)',
      'Metric Prefixes: nano (10⁻⁹), micro (10⁻⁶), milli (10⁻³), kilo (10³), mega (10⁶), giga (10⁹)'
    ]
  },
  {
    id: 'topic-chem-f1-t2-math',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Topic 2: Essential Mathematical Skills in Chemistry',
    summary: 'Master standard scientific notation, rules for determining significant figures in measurements, calculations, accuracy vs. precision, and plotting line graphs, bar graphs, and pie charts.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'Standard Form / Scientific Notation (A × 10ⁿ where 1 ≤ A < 10)',
      '6 Core Rules of Significant Figures',
      'Significant Figures in Calculations (Least sig-figs rule)',
      'Accuracy vs. Precision in Experimental Data',
      'Scientific Graphing: Line Graphs, Bar Graphs & Pie Charts'
    ],
    formulasOrFacts: [
      'Standard Form: A × 10ⁿ (Positive n for large numbers, negative n for decimals)',
      'Accuracy = Closeness of measured value to true value',
      'Precision = Closeness of repeated measurements to each other'
    ]
  },
  {
    id: 'topic-chem-f1-t3-matter',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Topic 3: Composition & Classification of Matter and Separation of Mixtures',
    summary: 'Understand the 3 states of matter, particulate nature, diffusion, elements (first 20 elements and Latin names), molecules, compounds, chemical formulae, solutions, solubility factors, and physical separation techniques.',
    order: 3,
    status: 'published',
    keyConcepts: [
      '3 States of Matter (Solids, Liquids, Gases) & Particle Models',
      'Particulate Nature of Matter & Diffusion in Liquids/Gases',
      'First 20 Elements & Symbols (including Latin origins: Na, K, Cu, Fe, Ag, Pb, Au, Hg)',
      'Monoatomic, Diatomic & Polyatomic Molecules',
      'Elements vs. Compounds & Chemical Formulae Interpretation',
      'Pure Substances vs. Homogeneous and Heterogeneous Mixtures',
      'Types of Solutions (Solid-in-solid, Liquid-in-liquid, Solid-in-liquid, Gas-in-liquid)',
      'Factors Affecting Solubility (Temperature, Particle Size, Polarity)',
      'Separation Techniques: Filtration, Decantation, Evaporation, Simple Distillation, Fractional Distillation, Paper Chromatography, Magnetism'
    ],
    formulasOrFacts: [
      'Subscript in formula indicates number of atoms (e.g., C₆H₁₂O₆ has 6 C, 12 H, 6 O)',
      'Ethanol boils at 78°C; Water boils at 100°C (separated by fractional distillation)',
      'Solvent Front = furthest point reached by solvent on chromatography paper'
    ]
  },
  {
    id: 'topic-chem-f1-t4-atomic',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Topic 4: Atomic Structure & Isotopes',
    summary: 'Examine subatomic particles (protons, neutrons, electrons), electron configuration (2.8.8.2 rule), atomic number (Z), mass number (A), nuclide notation, and calculate relative atomic mass (RAM) from isotope abundances.',
    order: 4,
    status: 'published',
    keyConcepts: [
      'Subatomic Particles: Protons (+1, 1 amu), Electrons (-1, ~0 mass), Neutrons (0, 1 amu)',
      'Atomic Structure: Dense Nucleus & Concentric Energy Levels (Shells)',
      'Electron Configuration Rule (1st shell: 2, 2nd: 8, 3rd: 8, 4th: 18)',
      'Atomic Number (Z) vs. Mass Number (A = Z + N)',
      'Nuclide Notation (ᴬ_Z X)',
      'Isotopes Definition & Examples (Hydrogen 1/2/3, Carbon 12/14, Chlorine 35/37)',
      'Calculating Relative Atomic Mass (RAM) from Percentage Abundances'
    ],
    formulasOrFacts: [
      'Mass Number A = Atomic Number Z + Number of Neutrons N',
      'RAM of Element X = (RPA₁ × RIM₁) + (RPA₂ × RIM₂)',
      'Example: Chlorine RAM = (0.75 × 35) + (0.25 × 37) = 35.5 amu'
    ]
  },
  {
    id: 'topic-chem-f1-t5-periodic',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Topic 5: The Periodic Table of Elements',
    summary: 'Study the organization of the first 20 elements, Groups (I to VIII) and Periods (1 to 4), classification into metals, metalloids, and non-metals, and family characteristics (Alkali metals, Alkaline earth metals, Halogens, Noble gases).',
    order: 5,
    status: 'published',
    keyConcepts: [
      'Organization of the First 20 Elements by Atomic Number',
      'Groups (Families): Vertical columns = same number of valence electrons',
      'Periods (Series): Horizontal rows = same number of electron shells',
      'Metals (Grp I, II, III), Metalloids (Grp III, IV), Non-metals (Grp V, VI, VII, VIII)',
      'Family Names: Group I (Alkali Metals), Group II (Alkaline Earth Metals), Group VII (Halogens), Group VIII (Noble/Inert Gases)'
    ],
    formulasOrFacts: [
      'Group Number = Number of Valence (Outermost) Electrons',
      'Period Number = Number of Occupied Electron Shells',
      'Group VIII Noble Gases have complete outer shells (stable and inert)'
    ]
  },
  {
    id: 'topic-chem-f1-t6-reactions',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Topic 6: Physical & Chemical Changes and Reaction Stoichiometry',
    summary: 'Differentiate physical and chemical changes, construct word and symbol equations, master equation balancing by multiplying coefficients, verify the Law of Conservation of Matter, calculate reactant/product masses, and compute percentage composition by mass.',
    order: 6,
    status: 'published',
    keyConcepts: [
      'Differences between Physical and Chemical Changes',
      'Chemical Reactions: Reactants → Products (Bond breaking and bond reforming)',
      'Writing Word Equations & Chemical Formula Equations with State Symbols (s, l, g, aq)',
      'Step-by-Step Balancing of Chemical Equations using Whole-Number Coefficients',
      'The Law of Conservation of Matter (Total Mass of Reactants = Total Mass of Products)',
      'Stoichiometric Mass Calculations using Proportions',
      'Percentage Composition by Mass = (Total Mass of Element / RFM) × 100%'
    ],
    formulasOrFacts: [
      'Total Mass of Reactants = Total Mass of Products',
      'Percentage Composition = (n × RAM of Element / Relative Formula Mass) × 100%',
      'CaCO₃: Ca = 40%, C = 12%, O = 48% (RFM = 100 amu)'
    ]
  },
  {
    id: 'topic-chem-f1-t7-organic',
    subjectId: 'subj-chem',
    form: 'Form 1',
    title: 'Topic 7: Organic Compounds & Fuels',
    summary: 'Discover organic chemistry, natural and synthetic sources of carbon compounds, biofuels vs. fossil fuels, petroleum (crude oil) composition, fractional distillation column separation, and specific industrial uses of petroleum fractions.',
    order: 7,
    status: 'published',
    keyConcepts: [
      'Definition of Organic Compounds (Carbon-based, excluding oxides and carbonates)',
      'Sources of Organic Compounds: Plants/Animals, Fossil Fuels, Natural Gas (95% Methane), Coal',
      'Fuels in Malawian Homes (Charcoal, Butane, Paraffin, Wood, Petrol, Diesel, Ethanol, Methylated Spirit)',
      'Biofuels (Renewable: Wood, Biogas, Biodiesel, Ethanol) vs. Fossil Fuels (Non-renewable)',
      'Petroleum as a Mixture of Hydrocarbons',
      'Industrial Fractional Distillation of Petroleum (Temperature gradient: 25°C at top to >400°C at bottom)',
      '8 Petroleum Fractions & Everyday Uses: Refinery Gas, Petrol/Gasoline, Naphtha, Kerosene/Paraffin, Diesel, Fuel Oil, Lubricants/Waxes, Bitumen/Asphalt'
    ],
    formulasOrFacts: [
      'Hydrocarbon = Compound containing carbon and hydrogen atoms only',
      'Natural Gas is 95% Methane (CH₄)',
      'Fractions condense at different heights based on boiling points (Lowest boiling point collects at the top)'
    ]
  }
];
