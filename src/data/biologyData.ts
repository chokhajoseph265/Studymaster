import { Subject, Topic, NoteItem, PracticeQuestion, Quiz } from '../types';

export const BIOLOGY_SUBJECT: Subject = {
  id: 'subj-bio',
  name: 'Biology',
  forms: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
  icon: 'Dna',
  category: 'Sciences',
  description: 'Living organisms, cell structure, plant and animal nutrition, transport systems, respiration, reproduction, ecology, and Mendelian genetics for JCE and MSCE.',
  status: 'published'
};

export const BIOLOGY_TOPICS: Topic[] = [
  // --- FORM 1 (JCE Foundation) ---
  {
    id: 'topic-bio-f1-characteristics',
    subjectId: 'subj-bio',
    form: 'Form 1',
    title: 'Topic 1: Characteristics of Living Organisms & Classification',
    summary: 'The 7 vital characteristics of life (MRS GREN), use of hand lenses and light microscopes, binomial nomenclature, and the 5 kingdoms of living things.',
    order: 1,
    status: 'published',
    keyConcepts: [
      '7 Life Processes: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition (MRS GREN)',
      'Magnification Formula (M = I ÷ A)',
      'The 5 Kingdoms: Monera, Protoctista, Fungi, Plantae, Animalia',
      'Binomial Nomenclature (Genus capitalized, species lowercase, underlined or italicized)',
      'Construction & Use of Dichotomous Keys'
    ],
    formulasOrFacts: [
      'Magnification (M) = Size of Image (I) ÷ Actual Size of Object (A)',
      '1 millimetre (mm) = 1,000 micrometres (µm)',
      'Scientific Name rule: Homo sapiens (underlined separately when handwritten)'
    ],
    manebExamFocus: 'MANEB JCE tests dichotomous key identification and converting mm to µm before calculating microscopic magnification.'
  },
  {
    id: 'topic-bio-f1-nutrition',
    subjectId: 'subj-bio',
    form: 'Form 1',
    title: 'Topic 2: Plant Nutrition, Leaf Anatomy & Photosynthesis',
    summary: 'Internal structure of a dicotyledonous leaf, chloroplast structure, light and dark stages of photosynthesis, and testing leaves for starch.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'Word & Chemical Equations of Photosynthesis',
      'Leaf Adaptations (Palisade mesophyll, stomata, xylem, phloem)',
      'Role of Chlorophyll and Sunlight in Photolysis of Water',
      'Destarching Plants & Testing for Starch using Iodine Solution',
      'Factors Affecting Rate of Photosynthesis (Light intensity, CO₂ concentration, Temperature)'
    ],
    formulasOrFacts: [
      'Chemical Equation: 6CO₂ + 6H₂O --(light & chlorophyll)--> C₆H₁₂O₆ + 6O₂',
      'Iodine test: Starch turns iodine from brown/yellow to blue-black.',
      'Destarching: Leaving potted plant in dark cupboard for 48 hours to exhaust starch reserves.'
    ],
    manebExamFocus: 'Always remember the sequence for starch testing: boil in water to kill cells, boil in ethanol in a water bath to extract chlorophyll, dip in warm water to soften, add iodine.'
  },

  // --- FORM 2 (JCE Mastery) ---
  {
    id: 'topic-bio-f2-transport',
    subjectId: 'subj-bio',
    form: 'Form 2',
    title: 'Topic 3: Transport in Flowering Plants & Transpiration',
    summary: 'Water and mineral absorption by root hair cells, xylem vessels, phloem translocation, transpiration pull, and factors controlling stomatal transpiration in Malawi.',
    order: 1,
    status: 'published',
    keyConcepts: [
      'Root Hair Cell Adaptations (Large surface area, thin wall, concentrated cell sap)',
      'Diffusion, Osmosis and Active Transport across root membranes',
      'Xylem vs Phloem Structure and Function',
      'Transpiration Stream & Potometer measurements',
      'Environmental Factors: Temperature, Humidity, Wind speed, Light intensity'
    ],
    formulasOrFacts: [
      'Xylem: Dead, hollow, lignified vessels transporting water and mineral salts upwards.',
      'Phloem: Living sieve tubes and companion cells translocating sucrose and amino acids bidirectionally.',
      'Transpiration rate increases with higher temperature, higher wind speed, lower humidity, and higher light.'
    ],
    manebExamFocus: 'In potometer experiment questions, the bubble measures the rate of water absorption, which is approximately equal to the rate of transpiration.'
  },
  {
    id: 'topic-bio-f2-respiration',
    subjectId: 'subj-bio',
    form: 'Form 2',
    title: 'Topic 4: Gaseous Exchange & Human Respiration',
    summary: 'Alveolar adaptations for gaseous exchange, mechanism of inhalation and exhalation, aerobic vs anaerobic respiration, and lactic acid oxygen debt.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'Aerobic Respiration vs Anaerobic Respiration (Fermentation)',
      'Human Respiratory Tract (Trachea, Bronchi, Bronchioles, Alveoli)',
      'Adaptations of Alveoli (Large surface area, moist surface, 1-cell thick walls, dense capillary network)',
      'Inhalation vs Exhalation mechanics (Diaphragm & Intercostal muscles)',
      'Oxygen Debt during strenuous sports and sprinting'
    ],
    formulasOrFacts: [
      'Aerobic: C₆H₁₂O₆ + 6O₂ --> 6CO₂ + 6H₂O + 2880 kJ (38 ATP)',
      'Anaerobic in Muscles: C₆H₁₂O₆ --> 2 Lactic Acid + 150 kJ (2 ATP)',
      'Anaerobic in Yeast: C₆H₁₂O₆ --> 2 Ethanol + 2CO₂ + Energy'
    ],
    manebExamFocus: 'Inhalation: External intercostals contract, ribs move up and out, diaphragm flattens, thorax volume increases, pressure drops below atmospheric, air rushes in.'
  },

  // --- FORM 3 (MSCE Intermediate) ---
  {
    id: 'topic-bio-f3-circulatory-system',
    subjectId: 'subj-bio',
    form: 'Form 3',
    title: 'Topic 5: Human Circulatory System & Double Circulation',
    summary: 'Internal structure of the human heart, cardiac cycle, arteries, veins, capillaries, blood composition, phagocytosis, antibodies, and ABO blood grouping.',
    order: 1,
    status: 'published',
    keyConcepts: [
      'Double Circulation: Pulmonary and Systemic Circulation',
      'Heart Chambers, Valves (Tricuspid, Bicuspid/Mitral, Semilunar) and Coronary Arteries',
      'Arteries (thick muscular wall, small lumen) vs Veins (thin wall, large lumen, valves)',
      'Blood Components: Plasma, Red Blood Cells (haemoglobin), White Blood Cells (lymphocytes & phagocytes), Platelets',
      'ABO Blood Groups, Antigens, Antibodies & Blood Transfusion Compatibility'
    ],
    formulasOrFacts: [
      'Universal Donor: Blood Group O (has neither A nor B antigens on RBCs)',
      'Universal Recipient: Blood Group AB (has neither anti-A nor anti-B antibodies in plasma)',
      'Left ventricle has the thickest muscular wall because it pumps oxygenated blood to the whole body at high pressure.'
    ],
    manebExamFocus: 'Remember the anatomical left of the heart appears on the right side of a diagram. Always label from the patient’s perspective!'
  },
  {
    id: 'topic-bio-f3-excretion-homeostasis',
    subjectId: 'subj-bio',
    form: 'Form 3',
    title: 'Topic 6: Excretion, Kidney Function & Homeostasis',
    summary: 'Kidney anatomy, nephron ultrafiltration, selective reabsorption, osmoregulation by ADH hormone, negative feedback loops, and skin thermoregulation.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'Difference between Excretion and Egestion',
      'Nephron Structure: Bowman’s Capsule, Glomerulus, Proximal Convoluted Tubule, Loop of Henle, Collecting Duct',
      'Ultrafiltration under high hydrostatic pressure and Selective Reabsorption of glucose',
      'Role of Antidiuretic Hormone (ADH) from pituitary gland during dehydration',
      'Thermoregulation: Vasodilation, Vasoconstriction, Sweating & Shivering'
    ],
    formulasOrFacts: [
      'Urine composition: Water, Urea, Uric acid, and excess Mineral salts (NO glucose or protein in healthy urine).',
      'When blood water is low: Pituitary secretes MORE ADH -> Collecting duct becomes more permeable -> More water reabsorbed -> Small volume of concentrated urine produced.'
    ],
    manebExamFocus: 'Glucose is 100% reabsorbed in the proximal convoluted tubule via active transport. Its presence in urine indicates diabetes mellitus.'
  },

  // --- FORM 4 (MSCE Senior Mastery) ---
  {
    id: 'topic-bio-f4-genetics-dna',
    subjectId: 'subj-bio',
    form: 'Form 4',
    title: 'Topic 7: Genetics, DNA Structure & Monohybrid Inheritance',
    summary: 'Structure of DNA and nucleotides, mitosis vs meiosis, Mendel’s laws, monohybrid crosses, Punnett squares, sex determination, sex-linked traits (haemophilia, colour blindness), and gene mutations.',
    order: 1,
    status: 'published',
    keyConcepts: [
      'DNA Double Helix Structure: Phosphate group, Deoxyribose sugar, and 4 Nitrogenous Bases (A-T, G-C)',
      'Genes, Alleles, Homozygous, Heterozygous, Genotype & Phenotype',
      'Monohybrid Genetic Crosses & 3:1 Phenotypic Ratio',
      'Co-dominance and Incomplete Dominance in Plants and Blood Groups',
      'Sex-Linkage: X-linked recessive traits like Haemophilia and Red-Green Colour Blindness'
    ],
    formulasOrFacts: [
      'Base Pairing Rule: Adenine pairs with Thymine (A=T); Guanine pairs with Cytosine (G≡C)',
      'Monohybrid F2 phenotypic ratio for complete dominance = 3 Dominant : 1 Recessive',
      'Human Sex Chromosomes: Female = 44 + XX, Male = 44 + XY'
    ],
    manebExamFocus: 'In genetic cross diagrams, always write: (1) Parental phenotypes, (2) Parental genotypes, (3) Gametes (circled), (4) Punnett square/fertilization, (5) Offspring genotypes and phenotypes with clear ratios.'
  },
  {
    id: 'topic-bio-f4-ecology-conservation',
    subjectId: 'subj-bio',
    form: 'Form 4',
    title: 'Topic 8: Ecology, Food Webs, Nutrient Cycles & Conservation',
    summary: 'Trophic levels, 10% energy transfer rule, pyramids of numbers and biomass, carbon and nitrogen cycles, deforestation, overfishing in Lake Malawi, and conservation.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'Ecosystem Components: Producers, Primary/Secondary Consumers, Decomposers',
      'Food Chains, Food Webs & 10% Energy Transfer Efficiency Rule',
      'Carbon Cycle & Global Warming / Greenhouse Effect',
      'Nitrogen Cycle: Nitrogen-fixing bacteria (Rhizobium in groundnut root nodules), Nitrifying bacteria, Denitrifying bacteria',
      'Conservation of Malawian Ecosystems: Lake Malawi cichlid fish (Chambo) and Mulanje Cedar forests'
    ],
    formulasOrFacts: [
      'Only ~10% of energy is transferred from one trophic level to the next; 90% is lost as heat, respiration, and excretion.',
      'Nitrogen Fixation: N₂ gas --> Ammonium/Nitrates by Rhizobium bacteria in legume root nodules.',
      'Denitrification: Nitrates --> N₂ gas by Pseudomonas bacteria in waterlogged anaerobic soils.'
    ],
    manebExamFocus: 'MANEB frequently asks why food chains rarely exceed 4 or 5 trophic levels: energy loss at each step is so high that insufficient energy remains to support higher trophic levels.'
  }
];

export const BIOLOGY_NOTES: NoteItem[] = [
  // Form 1 Note
  {
    id: 'note-bio-f1-nutrition-1',
    topicId: 'topic-bio-f1-nutrition',
    subjectId: 'subj-bio',
    form: 'Form 1',
    title: 'Photosynthesis, Internal Leaf Anatomy & Starch Experiments',
    summary: 'Detailed study of the light and dark stages of photosynthesis, internal cellular layers of the leaf, and protocol for testing leaves for starch.',
    estimatedReadTimeMinutes: 7,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-21',
    content: `# BIOLOGY
## Form: Form 1 | Term: Term 2
---

### 📘 Topic: Plant Nutrition, Leaf Anatomy & Photosynthesis

#### 1. Core Definition
* **Photosynthesis:** The biological process by which green plants manufacture organic carbohydrates (glucose) from carbon dioxide and water using light energy absorbed by chlorophyll, releasing oxygen as a byproduct.

#### 2. Main Summary Points
* **Overall Equation:** $6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow[\\text{chlorophyll}]{\\text{sunlight}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$.
* **Leaf Adaptations:**
  - **Upper Cuticle & Epidermis:** Transparent waxy layer allowing maximum sunlight to penetrate while preventing excessive water loss.
  - **Palisade Mesophyll:** Vertically packed columnar cells densely loaded with chloroplasts for maximum light absorption.
  - **Spongy Mesophyll:** Loosely arranged cells with large intercellular air spaces for rapid diffusion of $\\text{CO}_2$ and $\\text{O}_2$.
  - **Stomata & Guard Cells:** Microscopic pores primarily on the lower epidermis regulating gaseous exchange and transpiration.
* **Testing a Leaf for Starch (The 4-Step Method):**
  1. Boil leaf in water for 1 minute (kills protoplasm and breaks cell membranes).
  2. Boil leaf in ethanol inside a hot water bath (removes green chlorophyll pigment).
  3. Dip leaf into warm water (softens the brittle, dehydrated leaf).
  4. Spread leaf on a white tile and add drops of iodine solution. A blue-black colour indicates starch is present.

#### 3. Short Example / Formula
* *Formula:* **Rate of Photosynthesis ∝ Light Intensity × $\\text{CO}_2$ Concentration**
* *Example:* If a variegated leaf (green and white) is tested for starch after exposure to sunlight, only the green patches turn blue-black because only green regions contain chlorophyll to synthesize starch.

#### 4. 💡 MANEB Exam Tip
* In laboratory questions, **never heat ethanol directly over a Bunsen flame** because ethanol is highly inflammable! Always specify heating in a water bath.`,
    workedExamples: [
      {
        id: 'we-bio-f1-starch',
        title: 'Worked Example: Designing a Controlled Experiment for Sunlight Requirement',
        problem: 'Describe how an MSCE or JCE candidate can experimentally prove that sunlight is necessary for photosynthesis.',
        stepByStepSolution: [
          { step: 1, explanation: 'Destarch a potted green plant by keeping it in complete darkness for 48 hours to ensure all existing starch is metabolized.' },
          { step: 2, explanation: 'Cover part of a selected leaf on both sides with an opaque black paper clip or aluminium foil. Leave the remaining parts uncovered.' },
          { step: 3, explanation: 'Expose the plant to bright sunlight for 5 to 6 hours.' },
          { step: 4, explanation: 'Detach the leaf, remove the black paper, and carry out the 4-step iodine starch test.' },
          { step: 5, explanation: 'Record observations: The uncovered region turns blue-black (starch synthesized), while the covered region remains pale brown/yellow (no starch synthesized), proving light is essential.' }
        ],
        finalAnswer: 'Only the region exposed to sunlight tests positive for starch with iodine solution.',
        keyTakeaway: 'Destarching before starting any photosynthesis experiment is mandatory to prove newly formed starch was produced during the test.'
      }
    ]
  },

  // Form 2 Note
  {
    id: 'note-bio-f2-respiration-1',
    topicId: 'topic-bio-f2-respiration',
    subjectId: 'subj-bio',
    form: 'Form 2',
    title: 'Cellular Respiration, Alveolar Gas Exchange & Oxygen Debt',
    summary: 'Aerobic versus anaerobic respiration pathways, ventilation mechanics of the thoracic cage, and alveolar adaptations for diffusion.',
    estimatedReadTimeMinutes: 8,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-21',
    content: `# BIOLOGY
## Form: Form 2 | Term: Term 1
---

### 📘 Topic: Gaseous Exchange & Human Respiration

#### 1. Core Definition
* **Respiration:** The enzymatic breakdown of nutrient molecules (glucose) inside living cells to liberate chemical energy in the form of Adenosine Triphosphate (ATP).

#### 2. Main Summary Points
* **Aerobic Respiration:** Occurs in mitochondria in the presence of oxygen:
  $$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\rightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + 2880\\text{ kJ (38 ATP)}$$
* **Anaerobic Respiration in Human Muscles:** Occurs during vigorous exercise when oxygen supply cannot meet muscle demand:
  $$\\text{C}_6\\text{H}_{12}\\text{O}_6 \\rightarrow 2\\text{ Lactic Acid} + 150\\text{ kJ (2 ATP)}$$
* **Oxygen Debt:** The additional volume of oxygen required after strenuous exercise to oxidize accumulated toxic lactic acid into harmless carbon dioxide and water in the liver.
* **Alveoli Adaptations for Efficient Gas Exchange:**
  - Millions of microscopic alveoli provide an immense surface area (approx. $70\\text{ m}^2$).
  - Extremely thin walls consisting of a single layer of squamous epithelial cells ($< 1\\text{ µm}$).
  - Lined with a thin film of moisture in which gases dissolve before diffusing.
  - Surrounded by an extensive network of blood capillaries maintaining a steep concentration gradient.

#### 3. Short Example / Formula
* *Inspiration Mechanics:* Diaphragm contracts (moves down) + External intercostal muscles contract (ribs move up and out) $\\rightarrow$ Thoracic volume increases $\\rightarrow$ Pressure decreases below atmospheric pressure $\\rightarrow$ Air rushes into lungs.

#### 4. 💡 MANEB Exam Tip
* Do not confuse **breathing/ventilation** (the physical muscular movement of air into and out of lungs) with **respiration** (the biochemical release of energy within cells).`,
    workedExamples: [
      {
        id: 'we-bio-f2-alveoli',
        title: 'Worked Example: Calculating Fick’s Law of Diffusion in Human Lungs',
        problem: 'Explain three structural features of the human lung that maximize the rate of diffusion of oxygen into the bloodstream in accordance with Fick’s Law.',
        stepByStepSolution: [
          { step: 1, explanation: 'State Fick’s Law: Rate of Diffusion ∝ (Surface Area × Concentration Difference) ÷ Diffusion Distance.' },
          { step: 2, explanation: 'Feature 1 (Surface Area): Over 300 million alveoli give an enormous total surface area, multiplying the rate of gas movement.' },
          { step: 3, explanation: 'Feature 2 (Diffusion Distance): The combined thickness of alveolar wall and capillary endothelium is just one cell layer thick, keeping diffusion distance minimal.' },
          { step: 4, explanation: 'Feature 3 (Concentration Gradient): Constant ventilation and continuous blood flow rapidly transport oxygen away, maintaining a steep concentration gradient.' }
        ],
        finalAnswer: 'High surface area, minimal diffusion distance (<1 µm), and continuous steep concentration gradient maximize diffusion.',
        keyTakeaway: 'Always connect each anatomical adaptation directly to one parameter in Fick’s Law of diffusion.'
      }
    ]
  },

  // Form 3 Note
  {
    id: 'note-bio-f3-circ-1',
    topicId: 'topic-bio-f3-circulatory-system',
    subjectId: 'subj-bio',
    form: 'Form 3',
    title: 'Double Circulation, Heart Anatomy & Blood Group Compatibility',
    summary: 'Comprehensive analysis of systemic and pulmonary circulation, valve actions during ventricular systole and diastole, and ABO transfusion rules.',
    estimatedReadTimeMinutes: 9,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-22',
    content: `# BIOLOGY
## Form: Form 3 | Term: Term 2
---

### 📘 Topic: Human Circulatory System & Double Circulation

#### 1. Core Definition
* **Double Circulation:** A circulatory system in which blood passes through the heart twice during one complete circuit of the body (pulmonary circulation to lungs and systemic circulation to body organs).

#### 2. Main Summary Points
* **Heart Structure & Blood Flow:**
  - Deoxygenated blood from the body enters the **Right Atrium** via the Vena Cava.
  - Passes through the **Tricuspid Valve** into the **Right Ventricle**.
  - Pumped through the pulmonary semilunar valve into the **Pulmonary Artery** to the lungs.
  - Oxygenated blood returns via the **Pulmonary Veins** into the **Left Atrium**.
  - Passes through the **Bicuspid (Mitral) Valve** into the **Left Ventricle**.
  - Pumped at high pressure through the aortic semilunar valve into the **Aorta** to supply the entire body.
* **Blood Vessels Comparison:**
  - **Arteries:** Thick muscular and elastic walls to withstand high surge pressure from ventricles; narrow lumen; no valves (except aorta/pulmonary artery).
  - **Veins:** Thinner walls, wider lumen with low pressure; contain semilunar valves to prevent backflow of blood towards extremities.
  - **Capillaries:** Microscopic, 1-cell thick permeable walls facilitating rapid nutrient, waste, and gas exchange.
* **ABO Blood Transfusion Rules:**
  - **Group A:** Antigens A on RBC; Antibodies anti-B in plasma.
  - **Group B:** Antigens B on RBC; Antibodies anti-A in plasma.
  - **Group AB:** Both A and B antigens; NEITHER anti-A nor anti-B antibodies (**Universal Recipient**).
  - **Group O:** NEITHER A nor B antigens; Both anti-A and anti-B antibodies (**Universal Donor**).

#### 3. Short Example / Formula
* *Example:* If Group A donor blood is mistakenly transfused into a Group B patient, the patient's anti-A antibodies bind to the donor's A antigens, causing lethal **agglutination** (clumping of red blood cells).

#### 4. 💡 MANEB Exam Tip
* The **Left Ventricle** wall is approximately three times thicker than the Right Ventricle wall because the left ventricle must generate enough hydraulic pressure to overcome vascular resistance across the whole body, whereas the right ventricle only pumps to the nearby lungs.`,
    workedExamples: [
      {
        id: 'we-bio-f3-blood',
        title: 'Worked Example: Determining Safe Blood Transfusions',
        problem: 'An accident victim at Queen Elizabeth Central Hospital with blood group B urgently requires a blood transfusion. Available donor blood units are Group A, Group B, Group AB, and Group O. Identify which donor bloods are medically safe and justify your answer.',
        stepByStepSolution: [
          { step: 1, explanation: 'Analyze recipient blood (Group B): Patient has Antigen B on RBCs and Anti-A antibodies in blood plasma.' },
          { step: 2, explanation: 'Evaluate Group A donor: Possesses Antigen A. The recipient’s Anti-A antibodies will attack and agglutinate donor RBCs. UNSAFE.' },
          { step: 3, explanation: 'Evaluate Group AB donor: Possesses Antigen A. Recipient’s Anti-A antibodies will cause agglutination. UNSAFE.' },
          { step: 4, explanation: 'Evaluate Group B donor: Possesses Antigen B. Recipient plasma has no anti-B antibodies. SAFE (identical group).' },
          { step: 5, explanation: 'Evaluate Group O donor: Has neither Antigen A nor Antigen B. The recipient’s antibodies have no antigens to attack. SAFE (universal donor).' }
        ],
        finalAnswer: 'Safe donor blood groups: Group B and Group O.',
        keyTakeaway: 'Always look at the DONOR’s red blood cell ANTIGENS and check if the RECIPIENT’s plasma ANTIBODIES will attack them.'
      }
    ]
  },

  // Form 4 Note
  {
    id: 'note-bio-f4-genetics-1',
    topicId: 'topic-bio-f4-genetics-dna',
    subjectId: 'subj-bio',
    form: 'Form 4',
    title: 'Mendelian Genetics, Monohybrid Crosses & Sex Determination',
    summary: 'Alleles, dominant and recessive traits, constructing Punnett squares, sex chromosome inheritance, and pedigree charts for MSCE.',
    estimatedReadTimeMinutes: 9,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-22',
    content: `# BIOLOGY
## Form: Form 4 | Term: Term 1
---

### 📘 Topic: Genetics, DNA Structure & Monohybrid Inheritance

#### 1. Core Definition
* **Monohybrid Cross:** A genetic cross between two individual organisms involving the inheritance of single pair of contrasting alleles for one particular trait.

#### 2. Main Summary Points
* **Key Terminology:**
  - **Gene:** A specific segment of DNA residing at a particular locus on a chromosome that codes for a specific polypeptide or trait.
  - **Allele:** An alternative form of the same gene (e.g. $T$ for tallness, $t$ for dwarfness).
  - **Homozygous:** Having two identical alleles for a gene ($TT$ or $tt$).
  - **Heterozygous:** Having two different alleles for a gene ($Tt$).
  - **Genotype:** The genetic makeup of an organism in terms of alleles (e.g. $Bb$).
  - **Phenotype:** The observable physical or physiological characteristic of an organism resulting from genotype and environmental interaction.
* **Mendel’s First Law (Law of Segregation):** During gamete formation, the two alleles responsible for a trait separate from each other so that each gamete carries only one allele for each gene.
* **Sex Determination in Humans:**
  - Females possess two homologous $X$ chromosomes ($44 + XX$).
  - Males possess one $X$ and one smaller $Y$ chromosome ($44 + XY$).
  - Every child inherits an $X$ chromosome from the mother. If the fertilizing sperm carries an $X$, the baby is female ($XX$); if it carries a $Y$, the baby is male ($XY$). The statistical probability is exactly **1 : 1 (50%)** for each pregnancy.

#### 3. Short Example / Formula
* *Example (Heterozygous cross $Tt \\times Tt$):*
  - Gametes: $T, t$ and $T, t$
  - Offspring Genotypes: $1\\text{ }TT : 2\\text{ }Tt : 1\\text{ }tt$
  - Offspring Phenotypes: **3 Tall : 1 Dwarf** ($75\\% : 25\\%$).

#### 4. 💡 MANEB Exam Tip
* When drawing genetic crosses in MANEB MSCE exams, you **must circle the gametes** to represent that they are haploid sex cells. Omitting circles or failing to write both genotype and phenotype ratios costs easy marks!`,
    workedExamples: [
      {
        id: 'we-bio-f4-albinism',
        title: 'Worked Example: Predicting Inheritance of Albinism',
        problem: 'In humans, normal skin pigmentation is controlled by a dominant allele (A), while albinism is caused by a recessive allele (a). Two parents with normal skin pigmentation have an albino child. (a) Determine the genotypes of the parents. (b) Using a genetic diagram, determine the probability that their next child will also be an albino.',
        stepByStepSolution: [
          { step: 1, explanation: 'Identify child’s genotype: Since albinism is recessive, the albino child must be homozygous recessive (aa).' },
          { step: 2, explanation: 'Deduce parental genotypes: For the child to have (aa), one "a" allele must come from each parent. Since both parents have normal pigmentation, both parents must be heterozygous carriers: Mother = Aa, Father = Aa.' },
          { step: 3, explanation: 'State Parental Phenotypes: Normal Carrier × Normal Carrier. Genotypes: Aa × Aa.' },
          { step: 4, explanation: 'Gametes: Mother produces (A) and (a); Father produces (A) and (a).' },
          { step: 5, explanation: 'Punnett Square: AA (Normal 25%), Aa (Normal Carrier 25%), Aa (Normal Carrier 25%), aa (Albino 25%).' }
        ],
        finalAnswer: '(a) Both parents have genotype Aa. (b) Probability of next child being albino = 1/4 or 25%.',
        keyTakeaway: 'Each pregnancy is an independent event with its own 25% probability of resulting in an albino child.'
      }
    ]
  }
];

export const BIOLOGY_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'q-bio-1',
    topicId: 'topic-bio-f1-characteristics',
    subjectId: 'subj-bio',
    form: 'Form 1',
    question: 'A microscopic cell photograph has an image length of 30 mm under a magnification of ×600. What is the actual length of the cell in micrometres (µm)?',
    options: ['0.05 µm', '50 µm', '500 µm', '5 µm'],
    correctAnswerIndex: 1,
    explanation: 'First convert 30 mm to µm: 30 × 1,000 = 30,000 µm. Actual Size = Image Size ÷ Magnification = 30,000 µm ÷ 600 = 50 µm.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  },
  {
    id: 'q-bio-2',
    topicId: 'topic-bio-f2-nutrition',
    subjectId: 'subj-bio',
    form: 'Form 1',
    question: 'Why is a green leaf boiled in ethanol inside a water bath during a starch test experiment?',
    options: [
      'To soften the leaf cuticle',
      'To extract chlorophyll so colour changes can be clearly seen',
      'To kill the cells and stop all enzymatic activity',
      'To add glucose back into the mesophyll cells'
    ],
    correctAnswerIndex: 1,
    explanation: 'Boiling in ethanol removes the green chlorophyll pigment, decolourizing the leaf so the blue-black colour of positive iodine test can be clearly observed.',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  },
  {
    id: 'q-bio-3',
    topicId: 'topic-bio-f3-circulatory-system',
    subjectId: 'subj-bio',
    form: 'Form 3',
    question: 'Why is blood group O referred to as the "Universal Donor" in emergency transfusions?',
    options: [
      'It contains both anti-A and anti-B antibodies in its red cells',
      'Its red blood cells have neither A nor B surface antigens to trigger recipient antibodies',
      'It has thick cell walls that resist white blood cell attacks',
      'It has the highest haemoglobin concentration of all blood groups'
    ],
    correctAnswerIndex: 1,
    explanation: 'Group O red blood cells lack both A and B surface antigens, meaning recipient plasma antibodies will not recognize them as foreign or cause agglutination.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  },
  {
    id: 'q-bio-4',
    topicId: 'topic-bio-f4-genetics-dna',
    subjectId: 'subj-bio',
    form: 'Form 4',
    question: 'In humans, what is the theoretical probability of a couple having a male baby in any given pregnancy?',
    options: ['25%', '50%', '75%', '100%'],
    correctAnswerIndex: 1,
    explanation: 'Mothers always contribute an X chromosome. 50% of male sperm carry an X chromosome (producing female XX) and 50% carry a Y chromosome (producing male XY), giving an exact 1:1 (50%) probability.',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  }
];

export const BIOLOGY_QUIZZES: Quiz[] = [
  {
    id: 'quiz-bio-jce',
    topicId: 'topic-bio-f1-characteristics',
    subjectId: 'subj-bio',
    form: 'Form 1',
    title: 'Biology JCE Mastery Quiz',
    description: 'Assess your knowledge of cell magnification, MRS GREN, and leaf starch tests.',
    questions: [BIOLOGY_QUESTIONS[0], BIOLOGY_QUESTIONS[1]],
    timeLimitMinutes: 10,
    pointsAwarded: 50,
    status: 'published',
    version: 1
  },
  {
    id: 'quiz-bio-msce',
    topicId: 'topic-bio-f4-genetics-dna',
    subjectId: 'subj-bio',
    form: 'Form 4',
    title: 'Biology MSCE Genetics & Physiology Quiz',
    description: 'Challenging questions on ABO blood transfusions, monohybrid crosses, and sex chromosomes.',
    questions: [BIOLOGY_QUESTIONS[2], BIOLOGY_QUESTIONS[3]],
    timeLimitMinutes: 12,
    pointsAwarded: 60,
    status: 'published',
    version: 1
  }
];
