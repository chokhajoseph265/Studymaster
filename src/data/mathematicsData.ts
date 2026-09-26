import { Subject, Topic, NoteItem, PracticeQuestion, Quiz } from '../types';

export const MATHEMATICS_SUBJECT: Subject = {
  id: 'subj-math',
  name: 'Mathematics',
  forms: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
  icon: 'Calculator',
  category: 'Sciences',
  description: 'Numbers and numeration, algebraic processes, geometry and trigonometry, coordinate geometry, matrices, vectors, probability, statistics, and calculus for JCE and MSCE.',
  status: 'published'
};

export const MATHEMATICS_TOPICS: Topic[] = [
  // --- FORM 1 (JCE Foundation) ---
  {
    id: 'topic-math-f1-numbers',
    subjectId: 'subj-math',
    form: 'Form 1',
    title: 'Topic 1: Number Bases, HCF/LCM & Directed Numbers',
    summary: 'Master integers, operations with directed numbers (BODMAS), prime factorisation, HCF, LCM, and conversions between Base 10, Base 2 (binary), and other bases.',
    order: 1,
    status: 'published',
    keyConcepts: [
      'Directed Numbers & Number Line arithmetic',
      'Order of Operations (BODMAS/PEMDAS)',
      'Prime Factorisation (Factor Tree & Continuous Division)',
      'Highest Common Factor (HCF) & Lowest Common Multiple (LCM)',
      'Converting Denary (Base 10) to Binary (Base 2) and other bases'
    ],
    formulasOrFacts: [
      'Negative × Negative = Positive; Negative × Positive = Negative',
      'LCM = Product of highest powers of all prime factors',
      'HCF = Product of lowest common powers of shared prime factors'
    ],
    manebExamFocus: 'MANEB JCE Paper 1 frequently tests converting numbers between Base 10 and Base 2 or Base 5, as well as applying BODMAS to fractions.'
  },
  {
    id: 'topic-math-f1-angles-polygons',
    subjectId: 'subj-math',
    form: 'Form 1',
    title: 'Topic 2: Angles, Parallel Lines & Properties of Polygons',
    summary: 'Complementary, supplementary, vertically opposite, alternate, and corresponding angles; sum of interior and exterior angles of n-sided regular polygons.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'Angle relationships on straight lines and around a point',
      'Parallel lines with a transversal: Alternate (Z), Corresponding (F), Allied/Co-interior (C)',
      'Sum of interior angles of an n-sided polygon: (n - 2) × 180°',
      'Sum of exterior angles of any convex polygon is always 360°',
      'Interior + Exterior angle at any vertex = 180°'
    ],
    formulasOrFacts: [
      'Sum of Interior Angles = (n - 2) × 180°',
      'Each Interior Angle of Regular Polygon = [(n - 2) × 180°] ÷ n',
      'Each Exterior Angle = 360° ÷ n'
    ],
    manebExamFocus: 'In polygon angle questions, it is almost always faster to calculate the exterior angle first using 360° ÷ n, and then subtract from 180° to find the interior angle.'
  },

  // --- FORM 2 (JCE Mastery) ---
  {
    id: 'topic-math-f2-algebraic-fractions',
    subjectId: 'subj-math',
    form: 'Form 2',
    title: 'Topic 3: Algebraic Expressions, Expansion & Factorisation',
    summary: 'Expanding single and double brackets, factorising by common factor, grouping in pairs, difference of two squares, and simplifying algebraic fractions.',
    order: 1,
    status: 'published',
    keyConcepts: [
      'Distributive Law: a(b + c) = ab + ac',
      'Expanding Binomials (FOIL method)',
      'Difference of Two Squares: a² - b² = (a - b)(a + b)',
      'Factorising Quadratic Expressions (x² + bx + c)',
      'Adding, subtracting, and simplifying algebraic fractions'
    ],
    formulasOrFacts: [
      '(a + b)² = a² + 2ab + b²',
      '(a - b)² = a² - 2ab + b²',
      'a² - b² = (a - b)(a + b)'
    ],
    manebExamFocus: 'Before using grouping or quadratic techniques, always check if there is a common monomial factor that can be factored out of all terms first!'
  },
  {
    id: 'topic-math-f2-pythagoras-bearings',
    subjectId: 'subj-math',
    form: 'Form 2',
    title: 'Topic 4: Pythagoras’ Theorem & 3-Figure Bearings',
    summary: 'Right-angled triangles, finding hypotenuse and leg lengths, Pythagorean triples, 3-figure bearings from True North, and practical navigation problems.',
    order: 2,
    status: 'published',
    keyConcepts: [
      "Pythagoras' Theorem: a² + b² = c² (where c is the hypotenuse opposite 90°)",
      'Common Pythagorean Triples: 3-4-5, 5-12-13, 7-24-25, 8-15-17',
      'Definition of 3-figure bearing: Measured clockwise from True North (000° to 360°)',
      'Reverse / Back Bearings (add 180° if < 180°; subtract 180° if > 180°)',
      'Angles of elevation and depression'
    ],
    formulasOrFacts: [
      'c = √(a² + b²); a = √(c² - b²)',
      'Back Bearing = Forward Bearing ± 180°'
    ],
    manebExamFocus: 'Always draw a North arrow at EVERY reference point in a bearing diagram before calculating alternate or allied angles.'
  },

  // --- FORM 3 (MSCE Intermediate) ---
  {
    id: 'topic-math-f3-quadratics-formula',
    subjectId: 'subj-math',
    form: 'Form 3',
    title: 'Topic 5: Quadratic Equations, Completing the Square & Formula',
    summary: 'Solving ax² + bx + c = 0 by factorisation, completing the square method, the quadratic formula, the discriminant nature of roots, and parabola graphs.',
    order: 1,
    status: 'published',
    keyConcepts: [
      'Standard Quadratic Form: ax² + bx + c = 0',
      'Completing the Square method',
      'The Quadratic Formula: x = [-b ± √(b² - 4ac)] / (2a)',
      'The Discriminant (Δ = b² - 4ac): Δ > 0 (2 distinct real roots), Δ = 0 (1 repeated root), Δ < 0 (no real roots)',
      'Axis of symmetry: x = -b / (2a); vertex coordinates of parabolic graphs'
    ],
    formulasOrFacts: [
      'x = [-b ± √(b² - 4ac)] ÷ (2a)',
      'Discriminant: Δ = b² - 4ac'
    ],
    manebExamFocus: 'When applying the quadratic formula, write down a, b, and c with their exact positive/negative signs first. A common sign error occurs when b is negative (e.g. -(-5) = +5).'
  },
  {
    id: 'topic-math-f3-trig-sine-cosine',
    subjectId: 'subj-math',
    form: 'Form 3',
    title: 'Topic 6: Advanced Trigonometry: Sine Rule, Cosine Rule & Area',
    summary: 'Trigonometry for non-right-angled triangles, the Sine Rule, the Cosine Rule, the area formula (1/2 ab sin C), and 3D geometric problem solving.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'The Sine Rule: a / sin(A) = b / sin(B) = c / sin(C)',
      'The Cosine Rule for sides: a² = b² + c² - 2bc cos(A)',
      'The Cosine Rule for angles: cos(A) = (b² + c² - a²) / (2bc)',
      'Area of any triangle: Area = 1/2 × a × b × sin(C)',
      'Solving 3D triangles involving towers, flagpoles, and hills'
    ],
    formulasOrFacts: [
      'Sine Rule: a / sin A = b / sin B = c / sin C',
      'Cosine Rule: a² = b² + c² - 2bc cos A',
      'Area = 1/2 ab sin C'
    ],
    manebExamFocus: 'Use the Cosine Rule when you know all three sides (SSS) or two sides and the included angle (SAS). Use the Sine Rule when you have a matching side-and-opposite-angle pair.'
  },

  // --- FORM 4 (MSCE Senior Mastery) ---
  {
    id: 'topic-math-f4-matrices-transformations',
    subjectId: 'subj-math',
    form: 'Form 4',
    title: 'Topic 7: Matrices, Determinants & 2×2 Simultaneous Solutions',
    summary: 'Matrix addition, scalar multiplication, matrix multiplication, determinant and inverse of 2×2 matrices, and solving simultaneous equations using matrix methods.',
    order: 1,
    status: 'published',
    keyConcepts: [
      'Order of a Matrix (Rows × Columns)',
      'Matrix Multiplication (Row by Column condition)',
      'Determinant of Matrix M = [a, b; c, d] is det(M) = ad - bc',
      'Singular Matrix (det = 0, no inverse exists)',
      'Inverse Matrix: M⁻¹ = (1 / det(M)) × [d, -b; -c, a]',
      'Solving Linear Systems: AX = B -> X = A⁻¹B'
    ],
    formulasOrFacts: [
      'det(A) = ad - bc',
      'A⁻¹ = 1/(ad - bc) × [d, -b; -c, a]',
      'AA⁻¹ = I = [1, 0; 0, 1]'
    ],
    manebExamFocus: 'MANEB MSCE Paper 2 always features a compulsory 6-to-8 mark question requiring candidates to solve simultaneous linear equations using the matrix inversion method.'
  },
  {
    id: 'topic-math-f4-coordinate-geometry-calculus',
    subjectId: 'subj-math',
    form: 'Form 4',
    title: 'Topic 8: Coordinate Geometry, Circle Theorems & Differentiation',
    summary: 'Gradient, midpoint, length of line segment, parallel and perpendicular lines, tangent to a circle, circle theorems, and basic differentiation of polynomials for tangents/normals.',
    order: 2,
    status: 'published',
    keyConcepts: [
      'Distance formula: d = √[(x₂ - x₁)² + (y₂ - y₁)²]',
      'Midpoint formula: M = ((x₁ + x₂) / 2, (y₁ + y₂) / 2)',
      'Gradient: m = (y₂ - y₁) / (x₂ - x₁); Equation: y - y₁ = m(x - x₁)',
      'Perpendicular lines condition: m₁ × m₂ = -1',
      'Circle Theorems: Angle at centre is twice angle at circumference; Angles in same segment are equal; Cyclic quadrilateral opposite angles sum to 180°',
      'Basic Differentiation: If y = axⁿ, then dy/dx = n·axⁿ⁻¹'
    ],
    formulasOrFacts: [
      'm₁ × m₂ = -1 for perpendicular lines',
      'Equation of straight line: y = mx + c or y - y₁ = m(x - x₁)',
      'dy/dx of xⁿ = n·xⁿ⁻¹'
    ],
    manebExamFocus: 'When finding the perpendicular bisector of a line segment, first find the midpoint, calculate the original gradient m, take the negative reciprocal (-1/m), and use y - y₁ = m(x - x₁).'
  }
];

export const MATHEMATICS_NOTES: NoteItem[] = [
  // Form 1 Note
  {
    id: 'note-math-f1-numbers-1',
    topicId: 'topic-math-f1-numbers',
    subjectId: 'subj-math',
    form: 'Form 1',
    title: 'Number Bases & Converting Base 10 to Binary and Base 5',
    summary: 'Systematic explanation of place values, continuous division method for base conversions, and converting back to denary using power expansion.',
    estimatedReadTimeMinutes: 7,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-21',
    content: `# MATHEMATICS
## Form: Form 1 | Term: Term 1
---

### 📘 Topic: Number Bases & Conversions

#### 1. Core Definition
* **Number Base:** The number of unique digits (including zero) that a positional numeral system uses to represent numbers. Base 10 (Denary) uses digits 0–9; Base 2 (Binary) uses 0 and 1; Base 5 (Quinary) uses 0–4.

#### 2. Main Summary Points
* **Denary (Base 10) Place Values:** $10^0 = 1, 10^1 = 10, 10^2 = 100, 10^3 = 1000$.
* **Binary (Base 2) Place Values:** $2^0 = 1, 2^1 = 2, 2^2 = 4, 2^3 = 8, 2^4 = 16, 2^5 = 32$.
* **Converting from Base 10 to Any Base $n$ (Successive Division):**
  - Divide the denary number repeatedly by the new base $n$.
  - Record the remainder at each division step.
  - Read the remainders from bottom to top (most significant digit to least significant digit).
* **Converting from Any Base $n$ to Base 10 (Expanded Power Form):**
  - Multiply each digit by its positional place value $n^k$ (where $k$ is the position starting with 0 from right to left).
  - Sum the resulting products.

#### 3. Short Example / Formula
* *Example:* Convert $1101_2$ to Base 10:
  $$1101_2 = (1 \\times 2^3) + (1 \\times 2^2) + (0 \\times 2^1) + (1 \\times 2^0) = 8 + 4 + 0 + 1 = \\mathbf{13_{10}}$$

#### 4. 💡 MANEB Exam Tip
* A number in Base $n$ can **never** contain the digit $n$ or any digit greater than $n$. For example, $352_5$ is mathematically impossible because 5 cannot be a digit in Base 5!`,
    workedExamples: [
      {
        id: 'we-math-f1-base-conv',
        title: 'Worked Example: Converting Denary 43 to Binary and Base 5',
        problem: 'Convert the number 43 in Base 10 to: (a) Base 2 (binary), and (b) Base 5.',
        stepByStepSolution: [
          { step: 1, explanation: 'For Base 2, repeatedly divide 43 by 2 and note remainders:\n43 ÷ 2 = 21 R 1\n21 ÷ 2 = 10 R 1\n10 ÷ 2 = 5 R 0\n5 ÷ 2 = 2 R 1\n2 ÷ 2 = 1 R 0\n1 ÷ 2 = 0 R 1' },
          { step: 2, explanation: 'Read remainders from bottom to top: 101011 in Base 2.' },
          { step: 3, explanation: 'For Base 5, repeatedly divide 43 by 5:\n43 ÷ 5 = 8 R 3\n8 ÷ 5 = 1 R 3\n1 ÷ 5 = 0 R 1' },
          { step: 4, explanation: 'Read remainders from bottom to top: 133 in Base 5.' }
        ],
        finalAnswer: '(a) 43₁₀ = 101011₂   (b) 43₁₀ = 133₅',
        keyTakeaway: 'Always verify by expanding your answer back: 1×5² + 3×5¹ + 3×5⁰ = 25 + 15 + 3 = 43.'
      }
    ]
  },

  // Form 2 Note
  {
    id: 'note-math-f2-pythagoras-1',
    topicId: 'topic-math-f2-pythagoras-bearings',
    subjectId: 'subj-math',
    form: 'Form 2',
    title: 'Pythagoras’ Theorem & 3-Figure Compass Bearings',
    summary: 'Hypotenuse identification, square root simplification, and calculating forward and reverse bearings in navigation.',
    estimatedReadTimeMinutes: 8,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-21',
    content: `# MATHEMATICS
## Form: Form 2 | Term: Term 2
---

### 📘 Topic: Pythagoras’ Theorem & 3-Figure Bearings

#### 1. Core Definition
* **Pythagoras’ Theorem:** In any right-angled triangle, the area of the square whose side is the hypotenuse is equal to the sum of the areas of the squares on the other two legs ($a^2 + b^2 = c^2$).
* **Three-Figure Bearing:** The angular direction of a point measured clockwise from True North, expressed as a three-digit angle (e.g. $045^\\circ$, $120^\\circ$, $285^\\circ$).

#### 2. Main Summary Points
* **Hypotenuse Identification:** The hypotenuse is always the longest side of a right-angled triangle and lies directly opposite the $90^\\circ$ right angle.
* **Finding the Hypotenuse:** $c = \\sqrt{a^2 + b^2}$.
* **Finding a Shorter Side:** $a = \\sqrt{c^2 - b^2}$.
* **Three Rules of Bearings:**
  1. Always measure clockwise.
  2. Always start from True North ($000^\\circ$).
  3. Always write with three digits (e.g. write $50^\\circ$ as $050^\\circ$).
* **Back (Reverse) Bearing Rule:**
  - If Forward Bearing $< 180^\\circ$: **$\\text{Back Bearing} = \\text{Forward Bearing} + 180^\\circ$**.
  - If Forward Bearing $\\ge 180^\\circ$: **$\\text{Back Bearing} = \\text{Forward Bearing} - 180^\\circ$**.

#### 3. Short Example / Formula
* *Example:* The bearing of Zomba from Blantyre is $035^\\circ$. The bearing of Blantyre from Zomba is:
  $$\\text{Back Bearing} = 035^\\circ + 180^\\circ = \\mathbf{215^\\circ}$$

#### 4. 💡 MANEB Exam Tip
* When solving bearings word problems involving distances and directions, always sketch a large, clear diagram with a distinct North arrow at every station. Use alternate angles (Z-angles) between parallel North lines to find unknown angles!`,
    workedExamples: [
      {
        id: 'we-math-f2-bearings',
        title: 'Worked Example: Distance and Bearing Navigation',
        problem: 'A ship sails from Monkey Bay on a bearing of 090° (due East) for 12 km to point P, and then sails due North for 9 km to point Q. Calculate: (a) The direct distance from Monkey Bay to Q, and (b) The 3-figure bearing of Q from Monkey Bay.',
        stepByStepSolution: [
          { step: 1, explanation: 'Recognize that due East and due North meet at an angle of 90°, forming a right-angled triangle.' },
          { step: 2, explanation: 'Apply Pythagoras’ theorem to find distance d: d² = 12² + 9² = 144 + 81 = 225. Therefore, d = √225 = 15 km.' },
          { step: 3, explanation: 'Calculate the angle θ North of East using trigonometry: tan(θ) = Opposite / Adjacent = 9 / 12 = 0.75. θ = arctan(0.75) ≈ 36.87°.' },
          { step: 4, explanation: 'Since East is 090°, bearing of Q from Monkey Bay = 090° - 36.87° = 053.13° ≈ 053°.' }
        ],
        finalAnswer: '(a) Direct distance = 15 km   (b) Bearing = 053°',
        keyTakeaway: 'Recognizing Pythagorean triples like 9-12-15 (multiple of 3-4-5) saves valuable time in non-calculator examinations.'
      }
    ]
  },

  // Form 3 Note
  {
    id: 'note-math-f3-quadratics-1',
    topicId: 'topic-math-f3-quadratics-formula',
    subjectId: 'subj-math',
    form: 'Form 3',
    title: 'Solving Quadratics: Factoring, Completing the Square & Formula',
    summary: 'Derivation and application of the quadratic formula, interpreting the discriminant Δ, and completing the square for vertex coordinates.',
    estimatedReadTimeMinutes: 9,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-22',
    content: `# MATHEMATICS
## Form: Form 3 | Term: Term 1
---

### 📘 Topic: Quadratic Equations & Formula

#### 1. Core Definition
* **Quadratic Equation:** A second-degree polynomial equation of the standard form $ax^2 + bx + c = 0$ (where $a \\ne 0$, and $a, b, c$ are real numbers).

#### 2. Main Summary Points
* **Three Methods of Solution:**
  1. **Factorisation:** Factorise into two binomial brackets $(px + q)(rx + s) = 0$, then set each factor to zero.
  2. **Completing the Square:** Divide by $a$, move $c$ to the right, and add $(\\frac{b}{2a})^2$ to both sides.
  3. **The Quadratic Formula:**
     $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
* **The Discriminant ($\\Delta = b^2 - 4ac$):**
  - $\\Delta > 0$: Two distinct, unequal real roots (parabola cuts x-axis twice).
  - $\\Delta = 0$: Exactly one repeated/equal real root (parabola touches x-axis at its vertex).
  - $\\Delta < 0$: No real roots (parabola does not touch or intersect the x-axis).
* **Parabola Axis of Symmetry:** The vertical line passing through the vertex given by $x = -\\frac{b}{2a}$.

#### 3. Short Example / Formula
* *Example:* Solve $2x^2 + 5x - 3 = 0$:
  - $a = 2, b = 5, c = -3$
  - $\\Delta = 5^2 - 4(2)(-3) = 25 + 24 = 49$
  - $x = \\frac{-5 \\pm \\sqrt{49}}{2(2)} = \\frac{-5 \\pm 7}{4}$
  - $x_1 = \\frac{-5 + 7}{4} = \\frac{2}{4} = \\mathbf{0.5}$; $x_2 = \\frac{-5 - 7}{4} = \\frac{-12}{4} = \\mathbf{-3}$.

#### 4. 💡 MANEB Exam Tip
* When an MSCE question says "Give your answer correct to 2 decimal places" or "leave in surd form", it is an immediate cue that the quadratic **cannot be factorised** and you must use the quadratic formula!`,
    workedExamples: [
      {
        id: 'we-math-f3-quad-comp',
        title: 'Worked Example: Solving by Completing the Square',
        problem: 'Solve the equation x² - 6x - 7 = 0 by the method of completing the square.',
        stepByStepSolution: [
          { step: 1, explanation: 'Rearrange the equation so the constant term is on the right-hand side: x² - 6x = 7.' },
          { step: 2, explanation: 'Find half of the coefficient of x: half of -6 is -3.' },
          { step: 3, explanation: 'Square this number: (-3)² = 9. Add 9 to both sides of the equation: x² - 6x + 9 = 7 + 9 -> x² - 6x + 9 = 16.' },
          { step: 4, explanation: 'Write the left-hand side as a perfect square: (x - 3)² = 16.' },
          { step: 5, explanation: 'Take the square root of both sides: x - 3 = ±√16 -> x - 3 = ±4.' },
          { step: 6, explanation: 'Solve for x: x = 3 + 4 = 7, or x = 3 - 4 = -1.' }
        ],
        finalAnswer: 'x = 7 or x = -1',
        keyTakeaway: 'Always add (b/2)² to BOTH sides of the equation to keep the equation balanced.'
      }
    ]
  },

  // Form 4 Note
  {
    id: 'note-math-f4-matrices-1',
    topicId: 'topic-math-f4-matrices-transformations',
    subjectId: 'subj-math',
    form: 'Form 4',
    title: 'Matrices: Determinants, Inverses & Solving Simultaneous Systems',
    summary: 'Row-by-column multiplication rules, computing determinants of 2x2 matrices, finding the adjoint and inverse, and matrix inversion equation solving.',
    estimatedReadTimeMinutes: 9,
    version: 1,
    status: 'published',
    offlineAvailable: true,
    assistAvailable: true,
    updatedAt: '2026-03-22',
    content: `# MATHEMATICS
## Form: Form 4 | Term: Term 1
---

### 📘 Topic: Matrices & Simultaneous Equations

#### 1. Core Definition
* **Matrix:** A rectangular array of numbers arranged in rows and columns. A matrix with $m$ rows and $n$ columns has order $m \\times n$.

#### 2. Main Summary Points
* **Matrix Multiplication Condition:** Two matrices $A$ and $B$ can only be multiplied ($AB$) if the number of columns in $A$ equals the number of rows in $B$ ($(m \\times k) \\times (k \\times n) = (m \\times n)$).
* **Determinant of a $2 \\times 2$ Matrix:**
  For $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, $\\det(A) = ad - bc$.
* **Singular Matrix:** A matrix whose determinant equals zero ($\\det(A) = 0$). A singular matrix has no multiplicative inverse.
* **Inverse of a $2 \\times 2$ Matrix ($A^{-1}$):**
  $$A^{-1} = \\frac{1}{\\det(A)} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$
  *(Swap elements on the leading diagonal; negate elements on the other diagonal).*
* **Solving Simultaneous Equations Using Matrix Method:**
  Given:
  $$\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases} \\Rightarrow \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} e \\\\ f \\end{pmatrix}$$
  Let $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, $X = \\begin{pmatrix} x \\\\ y \\end{pmatrix}$, $B = \\begin{pmatrix} e \\\\ f \\end{pmatrix}$.
  Then: $AX = B \\Rightarrow X = A^{-1}B$.

#### 3. Short Example / Formula
* *Example:* Find the inverse of $M = \\begin{pmatrix} 3 & 2 \\\\ 4 & 3 \\end{pmatrix}$:
  - $\\det(M) = (3)(3) - (2)(4) = 9 - 8 = 1$.
  - $M^{-1} = \\frac{1}{1} \\begin{pmatrix} 3 & -2 \\\\ -4 & 3 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 3 & -2 \\\\ -4 & 3 \\end{pmatrix}}$.

#### 4. 💡 MANEB Exam Tip
* In matrix multiplication, $AB \\ne BA$ (matrix multiplication is non-commutative). Always pre-multiply by $A^{-1}$ ($X = A^{-1}B$), never post-multiply ($BA^{-1}$), which is algebraically invalid!`,
    workedExamples: [
      {
        id: 'we-math-f4-matrix-sim',
        title: 'Worked Example: Solving Simultaneous Equations by Matrix Inversion',
        problem: 'Use matrix method to solve the simultaneous equations:\n3x + 2y = 13\n2x - y = 4',
        stepByStepSolution: [
          { step: 1, explanation: 'Express the system in matrix form AX = B:\n[3, 2; 2, -1] [x; y] = [13; 4]' },
          { step: 2, explanation: 'Calculate determinant of coefficient matrix A:\ndet(A) = (3)(-1) - (2)(2) = -3 - 4 = -7.' },
          { step: 3, explanation: 'Find inverse matrix A⁻¹:\nA⁻¹ = (1 / -7) [-1, -2; -2, 3] = [1/7, 2/7; 2/7, -3/7].' },
          { step: 4, explanation: 'Calculate X = A⁻¹B:\nx = (1/7)(13) + (2/7)(4) = 13/7 + 8/7 = 21/7 = 3.\ny = (2/7)(13) + (-3/7)(4) = 26/7 - 12/7 = 14/7 = 2.' }
        ],
        finalAnswer: 'x = 3, y = 2',
        keyTakeaway: 'Check your result in equation 1: 3(3) + 2(2) = 9 + 4 = 13. Verified!'
      }
    ]
  }
];

export const MATHEMATICS_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'q-math-1',
    topicId: 'topic-math-f1-numbers',
    subjectId: 'subj-math',
    form: 'Form 1',
    question: 'Convert the binary number 11011₂ into a denary (Base 10) number.',
    options: ['27', '25', '29', '31'],
    correctAnswerIndex: 0,
    explanation: '11011₂ = (1 × 2⁴) + (1 × 2³) + (0 × 2²) + (1 × 2¹) + (1 × 2⁰) = 16 + 8 + 0 + 2 + 1 = 27.',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  },
  {
    id: 'q-math-2',
    topicId: 'topic-math-f2-pythagoras-bearings',
    subjectId: 'subj-math',
    form: 'Form 2',
    question: 'The bearing of point B from point A is 070°. What is the reverse bearing of point A from point B?',
    options: ['110°', '250°', '290°', '020°'],
    correctAnswerIndex: 1,
    explanation: 'Since the forward bearing is less than 180°, add 180°: 070° + 180° = 250°.',
    difficulty: 'Easy',
    points: 10,
    status: 'published'
  },
  {
    id: 'q-math-3',
    topicId: 'topic-math-f3-quadratics-formula',
    subjectId: 'subj-math',
    form: 'Form 3',
    question: 'What is the nature of the roots of the quadratic equation 3x² - 4x + 5 = 0?',
    options: ['Two distinct real roots', 'One repeated real root', 'No real roots', 'Infinite roots'],
    correctAnswerIndex: 2,
    explanation: 'Discriminant Δ = b² - 4ac = (-4)² - 4(3)(5) = 16 - 60 = -44. Since Δ < 0, the equation has no real roots.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  },
  {
    id: 'q-math-4',
    topicId: 'topic-math-f4-matrices-transformations',
    subjectId: 'subj-math',
    form: 'Form 4',
    question: 'If the matrix [2, k; 3, 6] is singular, what is the value of k?',
    options: ['4', '1', '9', '0'],
    correctAnswerIndex: 0,
    explanation: 'A matrix is singular if its determinant is zero: det = (2 × 6) - (3 × k) = 0 -> 12 - 3k = 0 -> 3k = 12 -> k = 4.',
    difficulty: 'Medium',
    points: 15,
    status: 'published'
  }
];

export const MATHEMATICS_QUIZZES: Quiz[] = [
  {
    id: 'quiz-math-jce',
    topicId: 'topic-math-f1-numbers',
    subjectId: 'subj-math',
    form: 'Form 1',
    title: 'Mathematics JCE Foundation Quiz',
    description: 'Test your understanding of binary bases, bearings, and Pythagoras theorem.',
    questions: [MATHEMATICS_QUESTIONS[0], MATHEMATICS_QUESTIONS[1]],
    timeLimitMinutes: 10,
    pointsAwarded: 50,
    status: 'published',
    version: 1
  },
  {
    id: 'quiz-math-msce',
    topicId: 'topic-math-f4-matrices-transformations',
    subjectId: 'subj-math',
    form: 'Form 4',
    title: 'Mathematics MSCE Senior Quiz',
    description: 'Solve quadratic discriminants and determinant problems for MSCE exams.',
    questions: [MATHEMATICS_QUESTIONS[2], MATHEMATICS_QUESTIONS[3]],
    timeLimitMinutes: 12,
    pointsAwarded: 60,
    status: 'published',
    version: 1
  }
];
