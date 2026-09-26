import { Subject, Topic, NoteItem, PracticeQuestion, Quiz } from '../types';

export const PHYSICS_SUBJECT: Subject = {
  id: 'subj-physics',
  name: 'Physics',
  forms: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
  icon: 'Atom',
  category: 'Sciences',
  description: 'Mechanics, properties of matter, heat and thermodynamics, waves and optics, electricity, magnetism, electronics, and nuclear physics for JCE and MSCE.',
  status: 'published'
};

export const PHYSICS_TOPICS: Topic[] = [
  // --- FORM 1 (JCE Foundation) ---
  {
    id: 'topic-phys-f1-measurements',
    subjectId: 'subj-physics',
    form: 'Form 1',
    title: 'Topic 1: Measurements & Physical Quantities',
    summary: 'Master fundamental and derived physical quantities, SI base units, vernier callipers, micrometer screw gauges, measuring volume of irregular solids, and density calculations.',
    order: 1,
    status: 'published',
    keyConcepts: [
      'Fundamental Quantities (Length, Mass, Time, Temperature, Electric Current)',
      'Derived Quantities (Area, Volume, Speed, Density, Force)',
      'Precision Instruments (Vernier Calliper & Micrometer Screw Gauge)',
      'Density and Relative Density',
      'GRASP Method for Physics Problem Solving'
    ],
    formulasOrFacts: [
      'Density (ρ) = Mass (m) ÷ Volume (V) [kg/m³ or g/cm³]',
      '1 g/cm³ = 1,000 kg/m³',
      'Relative Density = Density of substance ÷ Density of water (1,000 kg/m³)'
    ],
    manebExamFocus: 'MANEB frequently tests reading Vernier callipers (accuracy 0.01 cm) and micrometer screw gauges (accuracy 0.01 mm) including zero error adjustment.'
  },
  {
    id: 'topic-phys-f1-force-pressure',
    subjectId: 'subj-physics',
    form: 'Form 1',
    title: 'Topic 2: Force, Mass & Pressure',
    summary: 'Study contact and non-contact forces, vectors vs scalars, Hooke’s Law of elasticity, pressure in solids and liquids, and hydraulic lift applications.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'Types of Forces (Gravitational, Frictional, Tension, Upthrust)',
      "Hooke's Law & Elastic Limit (F = ke)",
      'Solid Pressure (P = F ÷ A)',
      'Liquid Pressure (P = hρg)',
      'Pascal Principle & Hydraulic Machines'
    ],
    formulasOrFacts: [
      "Hooke's Law: F = k × e (where k is spring constant in N/m)",
      'Solid Pressure: P = Force (N) ÷ Area (m²) [in Pascals, Pa]',
      'Liquid Pressure: P = h × ρ × g (Depth × Density × Acceleration due to gravity 9.8 m/s²)'
    ],
    manebExamFocus: 'Remember that liquid pressure acts equally in all directions and depends strictly on depth, not the shape of the container.'
  },

  // --- FORM 2 (JCE Mastery) ---
  {
    id: 'topic-phys-f2-work-energy',
    subjectId: 'subj-physics',
    form: 'Form 2',
    title: 'Topic 3: Work, Energy, Power & Simple Machines',
    summary: 'Understand work done, kinetic and gravitational potential energy, conservation of energy, power calculations, and mechanical efficiency of levers, pulleys, and inclined planes.',
    order: 1,
    status: 'published',
    keyConcepts: [
      'Work Done (W = F × d in Joules)',
      'Kinetic Energy (E_k = 1/2 m v²)',
      'Gravitational Potential Energy (E_p = m g h)',
      'Law of Conservation of Mechanical Energy',
      'Mechanical Advantage (MA), Velocity Ratio (VR) & Efficiency (η)'
    ],
    formulasOrFacts: [
      'Work = Force × distance moved in direction of force (W = F × s)',
      'Power (P) = Work done ÷ Time taken (Watts, W)',
      'Efficiency (η) = (MA ÷ VR) × 100% = (Useful Work Output ÷ Work Input) × 100%'
    ],
    manebExamFocus: 'Efficiency of any real machine is always less than 100% due to friction and the weight of moving parts.'
  },
  {
    id: 'topic-phys-f2-heat-transfer',
    subjectId: 'subj-physics',
    form: 'Form 2',
    title: 'Topic 4: Thermal Physics & Heat Transfer',
    summary: 'Temperature vs heat, Celsius and Kelvin scales, linear expansion of metals, bimetallic strips, conduction, convection in Malawian climate, and thermal radiation.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'Difference between Heat Energy (J) and Temperature (K or °C)',
      'Thermometric Properties & Liquid-in-Glass Thermometers',
      'Bimetallic Strips in Fire Alarms & Thermostats',
      'Conduction, Convection currents, and Thermal Radiation',
      'The Vacuum Flask (Thermos) insulation mechanisms'
    ],
    formulasOrFacts: [
      'Temperature in Kelvin: T(K) = θ(°C) + 273.15',
      'Good emitters and absorbers: Dull, matte black surfaces',
      'Good reflectors and poor emitters: Shiny, polished silver surfaces'
    ],
    manebExamFocus: 'Be ready to explain how each feature of a vacuum flask prevents conduction, convection, and radiation.'
  },

  // --- FORM 3 (MSCE Intermediate) ---
  {
    id: 'topic-phys-f3-kinematics-dynamics',
    subjectId: 'subj-physics',
    form: 'Form 3',
    title: 'Topic 5: Linear Motion & Newton’s Laws of Motion',
    summary: 'Equations of uniformly accelerated linear motion, velocity-time and displacement-time graphs, Newton’s three laws, momentum, and impulse.',
    order: 1,
    status: 'published',
    keyConcepts: [
      'Displacement, Velocity, and Uniform Acceleration',
      'Velocity-Time Graphs (Gradient = Acceleration, Area = Displacement)',
      "Newton's First Law (Inertia)",
      "Newton's Second Law (F = ma = Δp/Δt)",
      "Newton's Third Law (Action-Reaction Pairs)",
      'Linear Momentum (p = mv) & Conservation of Momentum'
    ],
    formulasOrFacts: [
      'v = u + at',
      's = ut + 1/2 at²',
      'v² = u² + 2as',
      'Impulse = Force × time = Change in momentum (m(v - u))'
    ],
    manebExamFocus: 'In graph questions, calculating the area under a velocity-time graph gives total distance travelled. Do not confuse this with distance-time graphs where gradient represents speed.'
  },
  {
    id: 'topic-phys-f3-waves-light',
    subjectId: 'subj-physics',
    form: 'Form 3',
    title: 'Topic 6: Waves, Sound & Geometrical Optics',
    summary: 'Transverse vs longitudinal waves, wave equation, reflection and refraction of light, Snell’s Law, refractive index, total internal reflection, and thin converging/diverging lenses.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'Wave Equation (v = f × λ)',
      'Sound Waves & Echoes in cliffs/buildings',
      "Laws of Refraction & Snell's Law (n = sin i / sin r)",
      'Critical Angle & Total Internal Reflection (Optical fibres)',
      'Convex Lens Ray Diagrams & Magnification'
    ],
    formulasOrFacts: [
      'v = f × λ (Velocity = Frequency × Wavelength)',
      'Refractive Index: n = sin(i) ÷ sin(r) = c ÷ v = 1 ÷ sin(C)',
      'Lens Equation: 1/f = 1/u + 1/v (Real-is-positive convention)'
    ],
    manebExamFocus: 'Ensure ruler-drawn rays in lens diagrams have directional arrows indicating the light path.'
  },

  // --- FORM 4 (MSCE Senior Mastery) ---
  {
    id: 'topic-phys-f4-current-electricity',
    subjectId: 'subj-physics',
    form: 'Form 4',
    title: 'Topic 7: Current Electricity, Circuits & Ohm’s Law',
    summary: 'Electric potential, current, electromotive force (EMF) vs terminal voltage, internal resistance, resistors in series and parallel networks, and electrical power tariffs.',
    order: 1,
    status: 'published',
    keyConcepts: [
      "Ohm's Law & I-V characteristics of ohmic and non-ohmic conductors",
      'EMF and Internal Resistance (E = V + Ir = I(R + r))',
      'Series and Parallel Resistor Combinations',
      'Electrical Energy and Power (P = VI = I²R = V²/R)',
      'Household Electrical Wiring (Live, Neutral, Earth wires & Fuses in Malawi)'
    ],
    formulasOrFacts: [
      'V = I × R',
      'R_series = R₁ + R₂ + R₃',
      '1/R_parallel = 1/R₁ + 1/R₂',
      'Commercial Energy (kWh) = [Power (W) × Time (h)] ÷ 1000'
    ],
    manebExamFocus: 'Always connect ammeters in series (low internal resistance) and voltmeters in parallel (high internal resistance).'
  },
  {
    id: 'topic-phys-f4-electromagnetism',
    subjectId: 'subj-physics',
    form: 'Form 4',
    title: 'Topic 8: Electromagnetism & Electromagnetic Induction',
    summary: 'Magnetic fields of currents, Fleming’s Left-Hand and Right-Hand rules, electric motors, Faraday’s and Lenz’s laws, AC generators, and electrical transformers.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'Magnetic Field Patterns around straight wires, solenoids, and bar magnets',
      "Fleming's Left-Hand Rule for DC Electric Motors",
      "Faraday's Law of Electromagnetic Induction & Lenz's Law",
      'Step-up and Step-down Transformers',
      'High Voltage Power Transmission in Malawi (reducing I²R power loss)'
    ],
    formulasOrFacts: [
      'Transformer Equation: V_p ÷ V_s = N_p ÷ N_s = I_s ÷ I_p (for 100% ideal transformer)',
      'Power Transmission Loss: P_loss = I² × R_cable',
      'Lenz’s Law: The direction of induced current opposes the change causing it.'
    ],
    manebExamFocus: 'MANEB frequently asks why electricity is transmitted at high voltage across Malawi: raising voltage lowers current, drastically cutting heat loss in cables.'
  }
];

export const PHYSICS_NOTES: NoteItem[] = [
  // Form 1 Note
  {
    id: 'note-phys-f1-measurements-1',
    topicId: 'topic-phys-f1-measurements',
    subjectId: 'subj-physics',
    form: 'Form 1',
    title: 'Physical Quantities, SI Units & Density Measurements',
    summary: 'Comprehensive foundation in fundamental measurements, vernier callipers, micrometer screw gauges, and water displacement for density determination.',
    estimatedReadTimeMinutes: 7,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-20',
    content: `# PHYSICS
## Form: Form 1 | Term: Term 1
---

### 📘 Topic: Measurements & Physical Quantities

#### 1. Core Definition
* **Physical Quantity:** Any property of a material or physical system that can be quantified and measured with an appropriate scientific instrument.

#### 2. Main Summary Points
* **Fundamental Quantities:** Seven basic quantities that cannot be defined in terms of other quantities (Length in metres, Mass in kilograms, Time in seconds, Temperature in Kelvin).
* **Derived Quantities:** Quantities obtained by multiplying or dividing fundamental quantities (e.g. Area = m², Volume = m³, Density = kg/m³, Speed = m/s).
* **Vernier Calliper:** Reads to an accuracy of 0.01 cm (0.1 mm), used for measuring internal and external diameters of test tubes.
* **Micrometer Screw Gauge:** Reads to an accuracy of 0.01 mm, used for measuring very thin items like pendulum wire diameters.
* **Density of Irregular Solids:** Determined by measuring mass on a beam balance and volume using a measuring cylinder or eureka can via water displacement.

#### 3. Short Example / Formula
* *Formula:* **Density (ρ) = Mass (m) ÷ Volume (V)**
* *Example:* A stone of mass 120 g is immersed in a measuring cylinder containing 50 cm³ of water. The water level rises to 90 cm³.
  - Volume of stone = 90 cm³ - 50 cm³ = 40 cm³.
  - Density = 120 g ÷ 40 cm³ = **3.0 g/cm³** (or 3,000 kg/m³).

#### 4. 💡 MANEB Exam Tip
* Always check for **zero errors** on micrometer screw gauges and vernier callipers before recording your final measurement. If a zero error is positive, subtract it; if negative, add it!`,
    workedExamples: [
      {
        id: 'we-phys-f1-density',
        title: 'Worked Example: Determining Density of a Metallic Cube',
        problem: 'A solid aluminium cube has sides of length 4.0 cm. The mass of the cube is found to be 172.8 g. Calculate the density of aluminium in: (a) g/cm³ and (b) kg/m³.',
        stepByStepSolution: [
          { step: 1, explanation: 'State the given values: Side length = 4.0 cm, Mass m = 172.8 g.' },
          { step: 2, explanation: 'Calculate the volume of the cube: V = side³ = 4.0 cm × 4.0 cm × 4.0 cm = 64.0 cm³.' },
          { step: 3, explanation: 'Apply the density formula for part (a): ρ = m ÷ V = 172.8 g ÷ 64.0 cm³ = 2.7 g/cm³.' },
          { step: 4, explanation: 'Convert to SI units for part (b) by multiplying by 1,000: 2.7 × 1,000 = 2,700 kg/m³.' }
        ],
        finalAnswer: '(a) 2.7 g/cm³  (b) 2,700 kg/m³',
        keyTakeaway: 'To convert density from g/cm³ to kg/m³, multiply by 1,000. To convert kg/m³ to g/cm³, divide by 1,000.'
      }
    ]
  },

  // Form 2 Note
  {
    id: 'note-phys-f2-work-machines-1',
    topicId: 'topic-phys-f2-work-energy',
    subjectId: 'subj-physics',
    form: 'Form 2',
    title: 'Work, Energy, Power & Mechanical Advantage in Pulleys',
    summary: 'Core principles of work done, kinetic vs gravitational potential energy, and calculating mechanical advantage and efficiency of block-and-tackle pulley systems.',
    estimatedReadTimeMinutes: 8,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-20',
    content: `# PHYSICS
## Form: Form 2 | Term: Term 2
---

### 📘 Topic: Work, Energy, Power & Simple Machines

#### 1. Core Definition
* **Work Done:** The product of the force applied on a body and the distance moved in the direction of the force (measured in Joules, J).

#### 2. Main Summary Points
* **Mechanical Energy:** The sum of Kinetic Energy (energy of motion, $E_k = \\frac{1}{2}mv^2$) and Gravitational Potential Energy ($E_p = mgh$).
* **Law of Conservation of Energy:** Energy cannot be created or destroyed, but can only be transformed from one form to another.
* **Mechanical Advantage (MA):** The ratio of load overcome to the effort applied ($MA = \\text{Load} \\div \\text{Effort}$).
* **Velocity Ratio (VR):** The ratio of distance moved by effort to distance moved by load ($VR = d_e \\div d_l$). In a pulley system, VR equals the number of supporting rope segments.
* **Efficiency (η):** The ratio of useful work output to work input, expressed as a percentage: $\\eta = (MA \\div VR) \\times 100\\%$.

#### 3. Short Example / Formula
* *Formula:* **Efficiency (η) = (MA ÷ VR) × 100%**
* *Example:* A pulley system with VR = 4 is used to lift a 600 N load with an effort of 200 N.
  - $MA = 600 \\text{ N} \\div 200 \\text{ N} = 3.0$
  - $\\text{Efficiency} = (3.0 \\div 4) \\times 100\\% = \\mathbf{75\\%}$.

#### 4. 💡 MANEB Exam Tip
* Velocity Ratio (VR) depends solely on the geometry of the machine and **never changes with friction**, whereas Mechanical Advantage (MA) decreases when friction increases!`,
    workedExamples: [
      {
        id: 'we-phys-f2-pulley',
        title: 'Worked Example: Block and Tackle System Analysis',
        problem: 'A block and tackle pulley system having 5 pulleys is used to raise a bag of maize weighing 800 N through a height of 3.0 m. An effort of 200 N is applied. Calculate: (a) Velocity Ratio, (b) Mechanical Advantage, (c) Work Output, and (d) Efficiency of the machine.',
        stepByStepSolution: [
          { step: 1, explanation: 'For a block and tackle system with 5 pulleys, the Velocity Ratio (VR) equals the total number of pulleys: VR = 5.' },
          { step: 2, explanation: 'Calculate Mechanical Advantage: MA = Load ÷ Effort = 800 N ÷ 200 N = 4.0.' },
          { step: 3, explanation: 'Calculate Work Output: Work Output = Load × Load distance = 800 N × 3.0 m = 2,400 Joules.' },
          { step: 4, explanation: 'Calculate Efficiency: η = (MA ÷ VR) × 100% = (4.0 ÷ 5) × 100% = 80%.' }
        ],
        finalAnswer: '(a) VR = 5, (b) MA = 4.0, (c) Work Output = 2,400 J, (d) Efficiency = 80%',
        keyTakeaway: 'Notice MA has no units because it is a pure ratio of forces (Newtons ÷ Newtons).'
      }
    ]
  },

  // Form 3 Note
  {
    id: 'note-phys-f3-motion-1',
    topicId: 'topic-phys-f3-kinematics-dynamics',
    subjectId: 'subj-physics',
    form: 'Form 3',
    title: 'Linear Motion, Equations of Acceleration & Newton’s Laws',
    summary: 'Kinematics equations, interpreting velocity-time graphs, and applying Newton’s second law of motion to vehicles on Malawian roads.',
    estimatedReadTimeMinutes: 9,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-21',
    content: `# PHYSICS
## Form: Form 3 | Term: Term 1
---

### 📘 Topic: Linear Motion & Newton’s Laws of Motion

#### 1. Core Definition
* **Acceleration:** The rate of change of velocity with respect to time ($a = (v - u) \\div t$), measured in metres per second squared ($m/s^2$).

#### 2. Main Summary Points
* **Three Equations of Uniform Acceleration:**
  1. $v = u + at$
  2. $s = ut + \\frac{1}{2}at^2$
  3. $v^2 = u^2 + 2as$
* **Velocity-Time Graphs:** The gradient of the line equals the acceleration. The total area underneath the graph line equals the total displacement (distance travelled).
* **Newton's 1st Law (Inertia):** An object remains at rest or in uniform motion along a straight line unless acted upon by a resultant external force.
* **Newton's 2nd Law:** The rate of change of momentum is directly proportional to the resultant force, yielding $F = ma$.
* **Newton's 3rd Law:** For every action, there is an equal and opposite reaction force acting on different bodies.

#### 3. Short Example / Formula
* *Formula:* **F = m × a** (Force in Newtons = mass in kg × acceleration in m/s²)
* *Example:* A minibus of mass 2,000 kg accelerates from rest to 20 m/s in 8 seconds along the M1 road.
  - Acceleration $a = (20 - 0) \\div 8 = 2.5 \\text{ m/s}^2$.
  - Resultant accelerating force $F = 2000 \\text{ kg} \\times 2.5 \\text{ m/s}^2 = \\mathbf{5,000 \\text{ N}}$.

#### 4. 💡 MANEB Exam Tip
* When a question says a body "starts from rest", set initial velocity $u = 0$. When a vehicle "brakes to a stop", set final velocity $v = 0$ and remember acceleration will have a negative sign (deceleration/retardation).`,
    workedExamples: [
      {
        id: 'we-phys-f3-motion',
        title: 'Worked Example: Distance Travelled from Velocity-Time Profile',
        problem: 'A car travelling at 15 m/s accelerates uniformly at 2.0 m/s² for 6.0 seconds. Calculate: (a) its final velocity, and (b) the distance covered during this 6-second interval.',
        stepByStepSolution: [
          { step: 1, explanation: 'List knowns: Initial velocity u = 15 m/s, Acceleration a = 2.0 m/s², Time t = 6.0 s.' },
          { step: 2, explanation: 'Apply 1st equation of motion: v = u + at = 15 + (2.0 × 6.0) = 15 + 12 = 27 m/s.' },
          { step: 3, explanation: 'Apply 2nd equation of motion: s = ut + 1/2 at² = (15 × 6.0) + 1/2 (2.0)(6.0)² = 90 + 36 = 126 m.' }
        ],
        finalAnswer: '(a) Final velocity = 27 m/s, (b) Distance covered = 126 m',
        keyTakeaway: 'You can cross-check using s = [(u + v) ÷ 2] × t = [(15 + 27) ÷ 2] × 6 = 21 × 6 = 126 m.'
      }
    ]
  },

  // Form 4 Note
  {
    id: 'note-phys-f4-transformer-1',
    topicId: 'topic-phys-f4-electromagnetism',
    subjectId: 'subj-physics',
    form: 'Form 4',
    title: 'Transformers, AC Induction & Grid Transmission in Malawi',
    summary: 'Electromagnetic induction, Faraday’s law, transformer turns ratio, and how high-voltage transmission minimizes grid power dissipation across Malawi.',
    estimatedReadTimeMinutes: 8,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-22',
    content: `# PHYSICS
## Form: Form 4 | Term: Term 2
---

### 📘 Topic: Electromagnetism & Electromagnetic Induction

#### 1. Core Definition
* **Electromagnetic Induction:** The production of an electromotive force (e.m.f.) across an electrical conductor situated in a changing magnetic field.

#### 2. Main Summary Points
* **Faraday's Law:** The magnitude of induced e.m.f. is directly proportional to the rate of change of magnetic flux linkage through the circuit.
* **Lenz's Law:** The direction of an induced current is always such as to oppose the change of magnetic flux producing it.
* **Step-Up Transformer:** Has more turns on the secondary coil ($N_s > N_p$); increases voltage and decreases current.
* **Step-Down Transformer:** Has more turns on the primary coil ($N_p > N_s$); decreases voltage and increases current for consumer safety.
* **Why High Voltage Grid Transmission:** Electrical energy from Nkula Falls or Tedzani hydro stations is stepped up to 132 kV or 66 kV. By increasing voltage, current $I$ decreases dramatically. Since cable power loss is $P_{\\text{loss}} = I^2R$, lower current drastically cuts wasted heat energy.

#### 3. Short Example / Formula
* *Formula:* **$V_p \\div V_s = N_p \\div N_s = I_s \\div I_p$**
* *Example:* A transformer has 400 primary turns and 2,000 secondary turns. If the input primary voltage is 240 V:
  - $V_s = V_p \\times (N_s \\div N_p) = 240 \\times (2000 \\div 400) = 240 \\times 5 = \\mathbf{1,200 \\text{ V}}$ (Step-up).

#### 4. 💡 MANEB Exam Tip
* Transformers operate strictly on **Alternating Current (AC)**. If a question connects a transformer to a DC battery, the secondary voltage is zero because there is no continuous change in magnetic flux!`,
    workedExamples: [
      {
        id: 'we-phys-f4-trans',
        title: 'Worked Example: Transformer Current & Voltage Calculation',
        problem: 'An ideal step-down transformer connected to a 240 V AC supply delivers power to a 12 V, 36 W radio. Calculate: (a) The turns ratio (Np : Ns), (b) The current in the secondary coil, and (c) The current in the primary coil.',
        stepByStepSolution: [
          { step: 1, explanation: 'Find turns ratio: Np ÷ Ns = Vp ÷ Vs = 240 V ÷ 12 V = 20 ÷ 1. The turns ratio Np : Ns is 20 : 1.' },
          { step: 2, explanation: 'Calculate secondary current using P = Vs × Is: Is = P ÷ Vs = 36 W ÷ 12 V = 3.0 A.' },
          { step: 3, explanation: 'For an ideal 100% efficient transformer, Input Power = Output Power: Vp × Ip = 36 W -> Ip = 36 W ÷ 240 V = 0.15 A.' }
        ],
        finalAnswer: '(a) Np : Ns = 20 : 1, (b) Is = 3.0 A, (c) Ip = 0.15 A',
        keyTakeaway: 'Stepping down voltage by a factor of 20 steps up the current by the exact same factor of 20 (0.15 A × 20 = 3.0 A).'
      }
    ]
  }
];

export const PHYSICS_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'q-phys-1',
    topicId: 'topic-phys-f1-measurements',
    subjectId: 'subj-physics',
    form: 'Form 1',
    question: 'Which of the following instruments is most suitable for measuring the thickness of a single razor blade with an accuracy of 0.01 mm?',
    options: ['Metre rule', 'Vernier calliper', 'Micrometer screw gauge', 'Measuring tape'],
    correctAnswerIndex: 2,
    explanation: 'A micrometer screw gauge has an accuracy of 0.01 mm, making it the most suitable instrument for extremely thin dimensions like a razor blade or copper wire.',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  },
  {
    id: 'q-phys-2',
    topicId: 'topic-phys-f2-work-energy',
    subjectId: 'subj-physics',
    form: 'Form 2',
    question: 'A mechanical pulley system has a Velocity Ratio (VR) of 5 and a Mechanical Advantage (MA) of 4. What is the efficiency of the machine?',
    options: ['80%', '125%', '20%', '90%'],
    correctAnswerIndex: 0,
    explanation: 'Efficiency (η) = (MA ÷ VR) × 100% = (4 ÷ 5) × 100% = 80%.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  },
  {
    id: 'q-phys-3',
    topicId: 'topic-phys-f3-kinematics-dynamics',
    subjectId: 'subj-physics',
    form: 'Form 3',
    question: 'What physical quantity is represented by the gradient of a velocity-time graph?',
    options: ['Speed', 'Displacement', 'Acceleration', 'Work done'],
    correctAnswerIndex: 2,
    explanation: 'The gradient of a velocity-time graph represents acceleration (change in velocity ÷ change in time).',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  },
  {
    id: 'q-phys-4',
    topicId: 'topic-phys-f4-electromagnetism',
    subjectId: 'subj-physics',
    form: 'Form 4',
    question: 'Why is electricity transmitted over long distances in Malawi at very high voltages (e.g. 132 kV)?',
    options: [
      'To increase the speed of electrons in the cable',
      'To reduce current, thereby minimizing I²R heating power losses in the transmission lines',
      'Because transformers only function at voltages above 100 kV',
      'To prevent lightning strikes on transmission pylons'
    ],
    correctAnswerIndex: 1,
    explanation: 'Higher transmission voltage lowers current for the same transmitted power. Because cable power dissipation is P = I²R, reducing current drastically cuts energy losses.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  }
];

export const PHYSICS_QUIZZES: Quiz[] = [
  {
    id: 'quiz-phys-f1-f2',
    topicId: 'topic-phys-f1-measurements',
    subjectId: 'subj-physics',
    form: 'Form 1',
    title: 'Physics JCE Foundations Quiz',
    description: 'Test your understanding of measurements, physical quantities, density, force, and mechanical efficiency.',
    questions: [PHYSICS_QUESTIONS[0], PHYSICS_QUESTIONS[1]],
    timeLimitMinutes: 10,
    pointsAwarded: 50,
    status: 'published',
    version: 1
  },
  {
    id: 'quiz-phys-f3-f4',
    topicId: 'topic-phys-f4-electromagnetism',
    subjectId: 'subj-physics',
    form: 'Form 4',
    title: 'Physics MSCE Advanced Mechanics & Electromagnetism',
    description: 'Challenge your mastery of linear motion graphs, transformers, and power grid transmission.',
    questions: [PHYSICS_QUESTIONS[2], PHYSICS_QUESTIONS[3]],
    timeLimitMinutes: 12,
    pointsAwarded: 60,
    status: 'published',
    version: 1
  }
];
