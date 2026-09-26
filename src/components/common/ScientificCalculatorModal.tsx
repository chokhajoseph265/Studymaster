import React, { useState, useEffect, useCallback } from 'react';
import {
  Calculator,
  BookOpen,
  X,
  RotateCcw,
  Delete,
  Equal,
  ChevronRight,
  Clock,
  History,
  Copy,
  Check
} from 'lucide-react';

interface ScientificCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'calculator' | 'formulas';
}

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
}

export const ScientificCalculatorModal: React.FC<ScientificCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'calculator'
}) => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'formulas'>(defaultTab);
  const [selectedSubject, setSelectedSubject] = useState<'math' | 'physics' | 'chemistry' | 'biology'>('math');

  // Calculator State
  const [expression, setExpression] = useState<string>('0');
  const [previousResult, setPreviousResult] = useState<string>('0');
  const [isRad, setIsRad] = useState<boolean>(false); // false = Degrees, true = Radians
  const [isInverse, setIsInverse] = useState<boolean>(false); // false = regular trig (sin/cos/tan), true = inverse (asin/acos/atan)
  const [calcHistory, setCalcHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Evaluate Expression Safely
  const evaluateExpression = useCallback(
    (expr: string): string => {
      try {
        if (!expr || expr === 'Error' || expr === '0') return '0';

        let sanitized = expr;

        // Auto-close missing parentheses
        const openCount = (sanitized.match(/\(/g) || []).length;
        const closeCount = (sanitized.match(/\)/g) || []).length;
        if (openCount > closeCount) {
          sanitized += ')'.repeat(openCount - closeCount);
        }

        // Standardize any inverse trig notations that might be pasted or formatted
        sanitized = sanitized.replace(/sin⁻¹\(/g, 'asin(');
        sanitized = sanitized.replace(/cos⁻¹\(/g, 'acos(');
        sanitized = sanitized.replace(/tan⁻¹\(/g, 'atan(');
        sanitized = sanitized.replace(/sin\^-1\(/g, 'asin(');
        sanitized = sanitized.replace(/cos\^-1\(/g, 'acos(');
        sanitized = sanitized.replace(/tan\^-1\(/g, 'atan(');

        // Replace constants
        sanitized = sanitized.replace(/π/g, `(${Math.PI})`);
        sanitized = sanitized.replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, `(${Math.E})`);
        sanitized = sanitized.replace(/Ans/g, `(${parseFloat(previousResult) || 0})`);

        // Replace multiplication and division symbols
        sanitized = sanitized.replace(/×/g, '*').replace(/÷/g, '/');

        // Factorial helper
        const factorial = (n: number): number => {
          if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid Factorial');
          if (n > 170) return Infinity; // max precision limit
          let res = 1;
          for (let i = 2; i <= n; i++) res *= i;
          return res;
        };

        // Handle percentage: e.g. 50% -> (50/100)
        sanitized = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

        // Handle factorials: e.g. 5! -> factorial(5)
        sanitized = sanitized.replace(/(\d+)!/g, 'factorial($1)');

        // Replace powers: x^y -> Math.pow(x, y) via **
        sanitized = sanitized.replace(/\^/g, '**');

        // Replace square root & cube root
        sanitized = sanitized.replace(/√\(/g, 'sqrt(');
        sanitized = sanitized.replace(/√(\d+(\.\d+)?)/g, 'sqrt($1)');
        sanitized = sanitized.replace(/∛\(/g, 'cbrt(');
        sanitized = sanitized.replace(/∛(\d+(\.\d+)?)/g, 'cbrt($1)');

        // Handle implicit multiplication: 2(3) -> 2*(3), (2)(3) -> (2)*(3), 2asin -> 2*asin, )sin -> )*sin
        sanitized = sanitized.replace(/(\d)(\()/g, '$1*$2');
        sanitized = sanitized.replace(/(\))(\d)/g, '$1*$2');
        sanitized = sanitized.replace(/(\))(\()/g, '$1*$2');
        sanitized = sanitized.replace(/(\d)(sin|cos|tan|asin|acos|atan|log|ln|sqrt|cbrt)/g, '$1*$2');
        sanitized = sanitized.replace(/(\))(sin|cos|tan|asin|acos|atan|log|ln|sqrt|cbrt)/g, '$1*$2');

        // Angular converters
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const toDeg = (rad: number) => (rad * 180) / Math.PI;

        // Context scope execution with native trigonometric and scientific functions
        const scope = {
          Math,
          factorial,
          // Trigonometric Functions
          sin: (x: number) => {
            if (!isRad) {
              const mod = ((x % 360) + 360) % 360;
              if (mod === 0 || mod === 180 || mod === 360) return 0;
              if (mod === 90) return 1;
              if (mod === 270) return -1;
              return Math.sin(toRad(x));
            }
            return Math.sin(x);
          },
          cos: (x: number) => {
            if (!isRad) {
              const mod = ((x % 360) + 360) % 360;
              if (mod === 90 || mod === 270) return 0;
              if (mod === 0 || mod === 360) return 1;
              if (mod === 180) return -1;
              return Math.cos(toRad(x));
            }
            return Math.cos(x);
          },
          tan: (x: number) => {
            if (!isRad) {
              const mod = ((x % 180) + 180) % 180;
              if (Math.abs(mod - 90) < 1e-9) {
                throw new Error('Math Error: Tangent undefined at 90°');
              }
              if (mod === 0 || mod === 180) return 0;
              if (mod === 45) return 1;
              if (mod === 135) return -1;
              return Math.tan(toRad(x));
            }
            return Math.tan(x);
          },
          // Inverse Trigonometric Functions
          asin: (x: number) => {
            if (x < -1 || x > 1) {
              throw new Error('Math Error: Domain [-1, 1]');
            }
            const radVal = Math.asin(x);
            if (!isRad) {
              const degVal = toDeg(radVal);
              return Math.round(degVal * 1e12) / 1e12;
            }
            return radVal;
          },
          acos: (x: number) => {
            if (x < -1 || x > 1) {
              throw new Error('Math Error: Domain [-1, 1]');
            }
            const radVal = Math.acos(x);
            if (!isRad) {
              const degVal = toDeg(radVal);
              return Math.round(degVal * 1e12) / 1e12;
            }
            return radVal;
          },
          atan: (x: number) => {
            const radVal = Math.atan(x);
            if (!isRad) {
              const degVal = toDeg(radVal);
              return Math.round(degVal * 1e12) / 1e12;
            }
            return radVal;
          },
          // Logarithms
          log: (x: number) => {
            if (x <= 0) throw new Error('Math Error: Log non-positive');
            return Math.log10(x);
          },
          ln: (x: number) => {
            if (x <= 0) throw new Error('Math Error: Ln non-positive');
            return Math.log(x);
          },
          // Roots & Math helpers
          sqrt: (x: number) => {
            if (x < 0) throw new Error('Math Error: Negative square root');
            return Math.sqrt(x);
          },
          cbrt: (x: number) => Math.cbrt(x),
          abs: (x: number) => Math.abs(x)
        };

        const fn = new Function('scope', `with(scope) { "use strict"; return (${sanitized}); }`);
        const result = fn(scope);

        if (typeof result !== 'number' || !isFinite(result) || isNaN(result)) {
          return 'Error';
        }

        // Format neatly to avoid floating point precision artifacts (e.g. 0.30000000000000004)
        const rounded = Math.round(result * 1e12) / 1e12;
        return String(rounded);
      } catch {
        return 'Error';
      }
    },
    [isRad, previousResult]
  );

  // Handle number & symbol insertion
  const handleInsert = (str: string) => {
    setExpression((prev) => {
      if (prev === '0' || prev === 'Error') {
        // If starting with an operator, keep 0
        if (['+', '×', '÷', '%', '^'].includes(str)) {
          return '0' + str;
        }
        return str;
      }
      // Avoid consecutive operators (e.g. ++ or ×÷)
      const lastChar = prev.slice(-1);
      const isOperator = ['+', '-', '×', '÷', '^'].includes(str);
      const lastIsOperator = ['+', '-', '×', '÷', '^'].includes(lastChar);
      if (isOperator && lastIsOperator) {
        return prev.slice(0, -1) + str;
      }
      return prev + str;
    });
  };

  // Handle scientific function insertion
  const handleFunctionInsert = (fnName: string) => {
    setExpression((prev) => {
      if (prev === '0' || prev === 'Error') {
        return fnName + '(';
      }
      const lastChar = prev.slice(-1);
      if (/\d|\)/.test(lastChar)) {
        return prev + '×' + fnName + '(';
      }
      return prev + fnName + '(';
    });
  };

  // Handle square / cube / power
  const handlePower = (p: number | string) => {
    setExpression((prev) => {
      if (prev === 'Error') return '0';
      if (p === 2) return prev + '^2';
      if (p === 3) return prev + '^3';
      if (p === 'y') return prev + '^';
      return prev;
    });
  };

  // Handle reciprocal 1/x
  const handleReciprocal = () => {
    setExpression((prev) => {
      if (prev === '0' || prev === 'Error') return '1/(';
      return `1/(${prev})`;
    });
  };

  // Handle negate ±
  const handleNegate = () => {
    setExpression((prev) => {
      if (prev === '0' || prev === 'Error') return '-';
      if (prev.startsWith('-(') && prev.endsWith(')')) {
        return prev.slice(2, -1);
      }
      if (prev.startsWith('-')) {
        return prev.slice(1);
      }
      return `-(${prev})`;
    });
  };

  // Handle percentage
  const handlePercent = () => {
    setExpression((prev) => {
      if (prev === '0' || prev === 'Error') return '0';
      return prev + '%';
    });
  };

  // Handle Factorial
  const handleFactorial = () => {
    setExpression((prev) => {
      if (prev === '0' || prev === 'Error') return '0';
      return prev + '!';
    });
  };

  // All Clear
  const handleClear = () => {
    setExpression('0');
  };

  // Clear Entry / Backspace
  const handleBackspace = () => {
    setExpression((prev) => {
      if (prev === 'Error' || prev.length <= 1) return '0';
      // If ends with function like sin(, delete the whole token
      if (prev.endsWith('asin(') || prev.endsWith('acos(') || prev.endsWith('atan(')) {
        return prev.slice(0, -5) || '0';
      }
      if (prev.endsWith('sin(') || prev.endsWith('cos(') || prev.endsWith('tan(') || prev.endsWith('log(')) {
        return prev.slice(0, -4) || '0';
      }
      if (prev.endsWith('ln(') || prev.endsWith('√(') || prev.endsWith('∛(')) {
        return prev.slice(0, -3) || '0';
      }
      return prev.slice(0, -1);
    });
  };

  // Calculate Action (=)
  const handleCalculate = () => {
    if (expression === 'Error') return;
    const res = evaluateExpression(expression);
    if (res !== 'Error') {
      const newItem: HistoryItem = {
        id: 'hist_' + Date.now(),
        expression,
        result: res,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setCalcHistory((prev) => [newItem, ...prev.slice(0, 19)]);
      setPreviousResult(res);
      setExpression(res);
    } else {
      setExpression('Error');
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    if (!isOpen || activeTab !== 'calculator') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleInsert(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        handleInsert('.');
      } else if (e.key === '+') {
        e.preventDefault();
        handleInsert('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleInsert('-');
      } else if (e.key === '*' || e.key === 'x') {
        e.preventDefault();
        handleInsert('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleInsert('÷');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleInsert(e.key);
      } else if (e.key === '^') {
        e.preventDefault();
        handleInsert('^');
      } else if (e.key === '%') {
        e.preventDefault();
        handlePercent();
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab, expression, evaluateExpression]);

  // Format display to render mathematical notation like sin⁻¹
  const formatDisplayExpression = (expr: string): string => {
    if (!expr || expr === '0' || expr === 'Error') return expr;
    return expr
      .replace(/asin\(/g, 'sin⁻¹(')
      .replace(/acos\(/g, 'cos⁻¹(')
      .replace(/atan\(/g, 'tan⁻¹(')
      .replace(/sqrt\(/g, '√(')
      .replace(/cbrt\(/g, '∛(');
  };

  if (!isOpen) return null;

  // Live preview calculation if expression has operations
  const livePreview =
    expression !== '0' && expression !== 'Error' && /[+\-×÷^%!()]|sin|cos|tan|log|ln|sqrt|cbrt/.test(expression)
      ? evaluateExpression(expression)
      : null;

  // MANEB Formulas Database
  const formulas = {
    math: [
      {
        name: 'Quadratic Formula',
        formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
        note: 'Used for solving ax² + bx + c = 0. Discriminant Δ = b² - 4ac.'
      },
      {
        name: 'Sine Rule',
        formula: 'a / sin(A) = b / sin(B) = c / sin(C)',
        note: 'Used in non-right-angled triangles when 2 angles and 1 side are known.'
      },
      {
        name: 'Cosine Rule',
        formula: 'a² = b² + c² - 2bc·cos(A)',
        note: 'Used when 2 sides and the included angle (SAS) are known.'
      },
      {
        name: 'Area of Triangle (Trig)',
        formula: 'Area = ½ · a · b · sin(C)',
        note: 'Calculate area using two sides and the included angle C.'
      },
      {
        name: 'Arithmetic Progression (AP)',
        formula: 'Tₙ = a + (n - 1)d  |  Sₙ = n/2 [2a + (n - 1)d]',
        note: 'a = first term, d = common difference, n = term number.'
      },
      {
        name: 'Geometric Progression (GP)',
        formula: 'Tₙ = a · rⁿ⁻¹  |  Sₙ = a(1 - rⁿ) / (1 - r)',
        note: 'a = first term, r = common ratio (|r| < 1 for S_infinity = a/(1-r)).'
      },
      {
        name: 'Circle Area & Circumference',
        formula: 'A = πr²  |  C = 2πr = πd',
        note: 'Sector Area = (θ / 360°) × πr²; Arc Length = (θ / 360°) × 2πr.'
      },
      {
        name: 'Cylinder & Cone Volumes',
        formula: 'V_cyl = πr²h  |  V_cone = ⅓πr²h  |  V_sphere = ⁴⁄₃πr³',
        note: 'Total surface area of closed cylinder = 2πr(r + h).'
      }
    ],
    physics: [
      {
        name: 'Equations of Linear Motion (SUVAT)',
        formula: 'v = u + at  |  s = ut + ½at²  |  v² = u² + 2as  |  s = ½(u + v)t',
        note: 'u = initial velocity, v = final velocity, a = acceleration, s = distance, t = time.'
      },
      {
        name: "Newton's Second Law & Momentum",
        formula: 'F = m · a  |  p = m · v  |  Impulse = F · Δt = m(v - u)',
        note: 'm = mass in kg, a = acceleration in m/s², F = force in Newtons (N).'
      },
      {
        name: 'Work, Energy & Power',
        formula: 'W = F · d  |  E_k = ½mv²  |  E_p = mgh  |  P = W / t = F · v',
        note: 'g = 9.8 m/s² on Earth. Energy and work measured in Joules (J).'
      },
      {
        name: "Ohm's Law & Electrical Resistance",
        formula: 'V = I · R  |  R_series = R₁ + R₂  |  1/R_parallel = 1/R₁ + 1/R₂',
        note: 'V = voltage (V), I = current (A), R = resistance (Ω).'
      },
      {
        name: 'Electrical Power & Energy Cost',
        formula: 'P = V · I = I²R = V² / R  |  Energy (kWh) = Power(kW) × Time(h)',
        note: '1 unit of electricity = 1 kilowatt-hour (kWh).'
      },
      {
        name: 'Wave Speed Equation',
        formula: 'v = f · λ  |  T = 1 / f',
        note: 'v = wave speed (m/s), f = frequency (Hz), λ = wavelength (m).'
      },
      {
        name: 'Transformer Equation & Efficiency',
        formula: 'V_p / V_s = N_p / N_s = I_s / I_p  |  Efficiency = (P_out / P_in) × 100%',
        note: 'Step-up: N_s > N_p, V_s > V_p. Step-down: N_s < N_p, V_s < V_p.'
      },
      {
        name: 'Physical Constants Reference',
        formula: 'g = 9.8 m/s²  |  c = 3.0 × 10⁸ m/s  |  ρ_water = 1000 kg/m³',
        note: 'Atmospheric pressure = 1.013 × 10⁵ Pa; Absolute zero = -273.15°C.'
      }
    ],
    chemistry: [
      {
        name: 'Mole Concept & Mass',
        formula: 'n = m / M_r  (Moles = Mass (g) / Molar Mass (g/mol))',
        note: 'Avogadro’s Constant L = 6.02 × 10²³ particles/mol.'
      },
      {
        name: 'Solution Concentration',
        formula: 'C = n / V  |  Concentration (g/dm³) = Mass(g) / Volume(dm³)',
        note: 'Convert cm³ to dm³: Divide by 1000 (1 dm³ = 1000 cm³ = 1 Litre).'
      },
      {
        name: 'Molar Gas Volume (RTP)',
        formula: 'Volume (dm³) = n × 24 dm³/mol  (at 20°C and 1 atm)',
        note: 'At standard temperature and pressure (STP), molar volume is 22.4 dm³.'
      },
      {
        name: 'Percentage Yield & Purity',
        formula: '% Yield = (Actual Yield / Theoretical Yield) × 100%',
        note: '% Purity = (Mass of pure substance / Total mass of sample) × 100%.'
      },
      {
        name: 'Reactivity Series of Metals',
        formula: 'K > Na > Ca > Mg > Al > (C) > Zn > Fe > Pb > (H) > Cu > Ag > Au',
        note: 'Metals above Hydrogen displace H⁺ from dilute acids to produce H₂ gas.'
      }
    ],
    biology: [
      {
        name: 'Microscope Magnification Formula',
        formula: 'Magnification (M) = Image Size (I) / Actual Size (A)',
        note: 'Ensure Image size and Actual size are in the same unit (1 mm = 1000 µm).'
      },
      {
        name: 'Aerobic Respiration Equation',
        formula: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP (Energy)',
        note: 'Glucose + Oxygen produces Carbon dioxide, Water, and Energy in mitochondria.'
      },
      {
        name: 'Photosynthesis Equation',
        formula: '6CO₂ + 6H₂O —(Light & Chlorophyll)→ C₆H₁₂O₆ + 6O₂',
        note: 'Light reaction takes place in thylakoid; Dark reaction in stroma.'
      },
      {
        name: 'Mendelian Genetics Ratio',
        formula: 'Monohybrid Heterozygous Cross (Aa × Aa) → 3:1 Phenotype, 1:2:1 Genotype',
        note: 'Dihybrid cross (AaBb × AaBb) yields a 9:3:3:1 phenotypic ratio.'
      }
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-slate-900">
                Calculator
              </h2>
              <p className="text-[11px] text-slate-500">
                Trigonometry, logarithms, powers, roots & formula sheet
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition ${
              activeTab === 'calculator'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Scientific Calculator</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('formulas')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition ${
              activeTab === 'formulas'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Formula Sheet</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-3 bg-white">
          {activeTab === 'calculator' ? (
            <div className="space-y-3">
              {/* LCD Display */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 text-right space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsRad(!isRad)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                        isRad
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {isRad ? 'RAD (Radians)' : 'DEG (Degrees)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInverse(!isInverse)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                        isInverse
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-300 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      2nd (Inv)
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {calcHistory.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowHistory(!showHistory)}
                        className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border transition ${
                          showHistory
                            ? 'bg-slate-200 text-slate-900 border-slate-300 font-bold'
                            : 'text-slate-600 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <History className="w-3 h-3" />
                        <span>History ({calcHistory.length})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Mathematical Expression */}
                <div className="text-xl sm:text-2xl font-mono font-bold text-slate-900 tracking-wider break-all min-h-[34px] flex items-center justify-end select-all">
                  {formatDisplayExpression(expression)}
                </div>

                {/* Live Result Preview */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 text-xs font-mono">
                  <span className="text-slate-500 text-[10px]">
                    {livePreview && livePreview !== 'Error' && livePreview !== expression ? 'Preview' : 'Ans: ' + previousResult}
                  </span>
                  <span className="text-emerald-700 font-bold text-sm">
                    {livePreview && livePreview !== 'Error' && livePreview !== expression ? `= ${livePreview}` : ''}
                  </span>
                </div>
              </div>

              {/* History Drawer */}
              {showHistory && calcHistory.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 max-h-48 overflow-y-auto">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-1 border-b border-slate-200">
                    <span>Recent Calculations</span>
                    <button
                      type="button"
                      onClick={() => setCalcHistory([])}
                      className="text-[10px] text-rose-600 hover:underline font-bold"
                    >
                      Clear History
                    </button>
                  </div>
                  {calcHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setExpression(item.result);
                        setShowHistory(false);
                      }}
                      className="p-2 rounded-xl bg-white hover:bg-emerald-50/70 cursor-pointer text-xs font-mono flex items-center justify-between border border-slate-200 transition group shadow-2xs"
                    >
                      <div className="truncate mr-2">
                        <span className="text-slate-600">{formatDisplayExpression(item.expression)}</span>
                        <span className="text-emerald-700 font-bold ml-2">= {item.result}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 group-hover:text-emerald-700 font-sans font-semibold shrink-0">
                        Tap to Use
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Scientific Functions Grid (Row 1 to 3) */}
              <div className="grid grid-cols-5 gap-1.5 text-xs font-bold font-mono">
                {/* Row 1: Trig Functions */}
                <button
                  type="button"
                  onClick={() => handleFunctionInsert(isInverse ? 'asin' : 'sin')}
                  className={`p-2 rounded-xl border font-bold active:scale-95 transition shadow-2xs ${
                    isInverse
                      ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200/80'
                  }`}
                  title={isInverse ? 'Inverse Sine (asin)' : 'Sine'}
                >
                  {isInverse ? 'sin⁻¹' : 'sin'}
                </button>
                <button
                  type="button"
                  onClick={() => handleFunctionInsert(isInverse ? 'acos' : 'cos')}
                  className={`p-2 rounded-xl border font-bold active:scale-95 transition shadow-2xs ${
                    isInverse
                      ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200/80'
                  }`}
                  title={isInverse ? 'Inverse Cosine (acos)' : 'Cosine'}
                >
                  {isInverse ? 'cos⁻¹' : 'cos'}
                </button>
                <button
                  type="button"
                  onClick={() => handleFunctionInsert(isInverse ? 'atan' : 'tan')}
                  className={`p-2 rounded-xl border font-bold active:scale-95 transition shadow-2xs ${
                    isInverse
                      ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200/80'
                  }`}
                  title={isInverse ? 'Inverse Tangent (atan)' : 'Tangent'}
                >
                  {isInverse ? 'tan⁻¹' : 'tan'}
                </button>
                <button
                  type="button"
                  onClick={() => handleFunctionInsert('sqrt')}
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold active:scale-95 transition shadow-2xs"
                  title="Square Root"
                >
                  √x
                </button>
                <button
                  type="button"
                  onClick={() => handlePower(2)}
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold active:scale-95 transition shadow-2xs"
                  title="Square (x²)"
                >
                  x²
                </button>

                {/* Row 2: Powers, Roots & Logs */}
                <button
                  type="button"
                  onClick={() => handleFunctionInsert('log')}
                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold active:scale-95 transition shadow-2xs"
                  title="Logarithm base 10"
                >
                  log
                </button>
                <button
                  type="button"
                  onClick={() => handleFunctionInsert('ln')}
                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold active:scale-95 transition shadow-2xs"
                  title="Natural Log (ln)"
                >
                  ln
                </button>
                <button
                  type="button"
                  onClick={() => handlePower(3)}
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold active:scale-95 transition shadow-2xs"
                  title="Cube (x³)"
                >
                  x³
                </button>
                <button
                  type="button"
                  onClick={() => handlePower('y')}
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold active:scale-95 transition shadow-2xs"
                  title="Power (xʸ)"
                >
                  xʸ
                </button>
                <button
                  type="button"
                  onClick={handleReciprocal}
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold active:scale-95 transition shadow-2xs"
                  title="Reciprocal (1/x)"
                >
                  1/x
                </button>

                {/* Row 3: Constants & Parentheses */}
                <button
                  type="button"
                  onClick={() => handleInsert('π')}
                  className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold active:scale-95 transition shadow-2xs"
                  title="Pi constant (3.14159...)"
                >
                  π
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert('e')}
                  className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold active:scale-95 transition shadow-2xs"
                  title="Euler constant e (2.71828...)"
                >
                  e
                </button>
                <button
                  type="button"
                  onClick={handleFactorial}
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold active:scale-95 transition shadow-2xs"
                  title="Factorial (n!)"
                >
                  n!
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert('(')}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold active:scale-95 transition shadow-2xs"
                >
                  (
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert(')')}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold active:scale-95 transition shadow-2xs"
                >
                  )
                </button>
              </div>

              {/* Standard Keypad & Operators */}
              <div className="grid grid-cols-4 gap-2 font-bold font-mono pt-1">
                {/* Row 1 */}
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-3 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-black active:scale-95 transition shadow-2xs"
                >
                  AC
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="p-3 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 flex items-center justify-center active:scale-95 transition shadow-2xs"
                  title="Delete last character"
                >
                  <Delete className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handlePercent}
                  className="p-3 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 active:scale-95 transition font-bold shadow-2xs"
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert('÷')}
                  className="p-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition text-lg font-black shadow-xs"
                >
                  ÷
                </button>

                {/* Row 2 */}
                <button
                  type="button"
                  onClick={() => handleInsert('7')}
                  className="p-3 rounded-2xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:scale-95 transition text-lg font-bold shadow-xs"
                >
                  7
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert('8')}
                  className="p-3 rounded-2xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:scale-95 transition text-lg font-bold shadow-xs"
                >
                  8
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert('9')}
                  className="p-3 rounded-2xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:scale-95 transition text-lg font-bold shadow-xs"
                >
                  9
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert('×')}
                  className="p-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition text-lg font-black shadow-xs"
                >
                  ×
                </button>

                {/* Row 3 */}
                <button
                  type="button"
                  onClick={() => handleInsert('4')}
                  className="p-3 rounded-2xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:scale-95 transition text-lg font-bold shadow-xs"
                >
                  4
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert('5')}
                  className="p-3 rounded-2xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:scale-95 transition text-lg font-bold shadow-xs"
                >
                  5
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert('6')}
                  className="p-3 rounded-2xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:scale-95 transition text-lg font-bold shadow-xs"
                >
                  6
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert('-')}
                  className="p-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition text-lg font-black shadow-xs"
                >
                  -
                </button>

                {/* Row 4 */}
                <button
                  type="button"
                  onClick={() => handleInsert('1')}
                  className="p-3 rounded-2xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:scale-95 transition text-lg font-bold shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert('2')}
                  className="p-3 rounded-2xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:scale-95 transition text-lg font-bold shadow-xs"
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert('3')}
                  className="p-3 rounded-2xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:scale-95 transition text-lg font-bold shadow-xs"
                >
                  3
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert('+')}
                  className="p-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition text-lg font-black shadow-xs"
                >
                  +
                </button>

                {/* Row 5 */}
                <button
                  type="button"
                  onClick={handleNegate}
                  className="p-3 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 active:scale-95 transition font-bold shadow-2xs"
                  title="Toggle Positive/Negative"
                >
                  ±
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert('0')}
                  className="p-3 rounded-2xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:scale-95 transition text-lg font-bold shadow-xs"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handleInsert('.')}
                  className="p-3 rounded-2xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:scale-95 transition text-lg font-bold shadow-xs"
                >
                  .
                </button>
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="p-3 rounded-2xl bg-emerald-500 text-white font-black hover:bg-emerald-600 text-lg flex items-center justify-center shadow-md active:scale-95 transition"
                  title="Calculate"
                >
                  <Equal className="w-5 h-5 stroke-[3]" />
                </button>
              </div>

              {/* Bottom Quick Bar: Ans & Sci notation */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => handleInsert('Ans')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-800 font-bold border border-slate-200 transition text-xs shadow-2xs"
                >
                  Ans ({previousResult})
                </button>
                <span className="text-[11px] text-slate-400 font-sans">
                  Keyboard numbers & Enter supported
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Subject Selector */}
              <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedSubject('math')}
                  className={`flex-1 py-1.5 rounded-xl transition ${
                    selectedSubject === 'math'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mathematics
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubject('physics')}
                  className={`flex-1 py-1.5 rounded-xl transition ${
                    selectedSubject === 'physics'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Physics
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubject('chemistry')}
                  className={`flex-1 py-1.5 rounded-xl transition ${
                    selectedSubject === 'chemistry'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Chemistry
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubject('biology')}
                  className={`flex-1 py-1.5 rounded-xl transition ${
                    selectedSubject === 'biology'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Biology
                </button>
              </div>

              {/* Formulas List */}
              <div className="space-y-2.5">
                {formulas[selectedSubject].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.name}</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(item.formula);
                          setCopiedId(item.name);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                        title="Copy formula"
                      >
                        {copiedId === item.name ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs font-bold text-slate-900 tracking-wide select-all shadow-2xs">
                      {item.formula}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end text-xs text-slate-500">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


