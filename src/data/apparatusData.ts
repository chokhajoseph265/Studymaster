import { ApparatusItem, HazardSymbolItem } from '../types/chemistry';

export const LABORATORY_APPARATUS: ApparatusItem[] = [
  {
    id: 'app-test-tube',
    name: 'Test Tube',
    category: 'reaction',
    svgType: 'test-tube',
    description: 'A cylindrical glass tube with a rounded U-shaped bottom and an open top, designed for holding, mixing, and heating small quantities of chemical substances.',
    primaryUse: 'Used for conducting qualitative chemical tests, observing color changes, precipitates, and gentle heating of liquid samples.',
    safetyTip: 'Always use a wooden test tube holder when heating. Never point the open mouth of the test tube towards yourself, a classmate, or any person.'
  },
  {
    id: 'app-brush',
    name: 'Test Tube Brush',
    category: 'holding',
    svgType: 'brush',
    description: 'A wire-handled brush with stiff nylon bristles tailored to scrub the cylindrical glass walls and curved bottom of test tubes and narrow glassware.',
    primaryUse: 'Used for thorough cleaning and scrubbing of chemical residues and precipitates from test tubes, boiling tubes, and measuring cylinders.',
    safetyTip: 'Insert and withdraw gently with a twisting motion. Never jab the brush forcefully against the bottom to avoid puncturing fragile glassware.'
  },
  {
    id: 'app-conical-flask',
    name: 'Conical Flask (Erlenmeyer)',
    category: 'reaction',
    svgType: 'conical-flask',
    description: 'A flat-bottomed laboratory flask with a conical body and cylindrical neck, allowing vigorous swirling without splashing liquids over the rim.',
    primaryUse: 'Indispensable in acid-base volumetric titrations, mixing reagents, collecting filtrates, and conducting reactions that produce gas.',
    safetyTip: 'Hold by the narrow neck when swirling. Check for hairline fractures before applying heat over a wire gauze.'
  },
  {
    id: 'app-round-bottom-flask',
    name: 'Round-Bottom Flask',
    category: 'reaction',
    svgType: 'round-bottom-flask',
    description: 'A spherical glass flask with a narrow neck engineered for uniform heat distribution across its spherical surface during prolonged boiling.',
    primaryUse: 'Used in distillation setups, refluxing reactions, and organic synthesis where even heating of volatile liquids is required.',
    safetyTip: 'Must always be supported by a clamp on a retort stand or set upon a cork ring; it cannot stand upright unsupported on a flat bench.'
  },
  {
    id: 'app-evaporating-dish',
    name: 'Evaporating Dish',
    category: 'separation',
    svgType: 'evaporating-dish',
    description: 'A shallow, glazed porcelain or ceramic bowl with a pouring spout designed to withstand direct high temperatures for solvent evaporation.',
    primaryUse: 'Used to evaporate excess liquid or water from solutions to obtain concentrated solutions or dry salt crystals during crystallization.',
    safetyTip: 'Always handle with crucible tongs when hot. Ceramic dishes retain intense heat long after the Bunsen burner flame is extinguished.'
  },
  {
    id: 'app-glass-rod',
    name: 'Glass Stirring Rod',
    category: 'reaction',
    svgType: 'glass-rod',
    description: 'A solid cylindrical borosilicate glass rod with smooth rounded ends used to stir mixtures, facilitate dissolution, and guide decantation.',
    primaryUse: 'Accelerates the dissolving of solids in liquids, ensures uniform temperature distribution, and prevents splashing when pouring liquids.',
    safetyTip: 'Stir with gentle circular motions. Do not tap violently against the bottom or thin walls of beakers, as sudden impacts can shatter the glass.'
  },
  {
    id: 'app-burette',
    name: 'Burette',
    category: 'measurement',
    svgType: 'burette',
    description: 'A long, precisely graduated vertical glass tube equipped with a stopcock tap at the lower end, calibrated in 0.1 cm³ subdivisions.',
    primaryUse: 'Accurately delivers variable, measured volumes of standard solutions in quantitative volumetric analyses (titrations).',
    safetyTip: 'Fill below eye level using a small filter funnel to prevent acid splashes into the eyes. Ensure the tip is filled with solution with no air bubbles.'
  },
  {
    id: 'app-measuring-cylinder',
    name: 'Measuring Cylinder',
    category: 'measurement',
    svgType: 'measuring-cylinder',
    description: 'A tall, narrow cylindrical glass or polypropylene vessel calibrated with volume markings and fitted with a stable base and pouring spout.',
    primaryUse: 'Measures approximate to moderate volumes of liquids (e.g. 10 ml to 1000 ml) quickly for preparation of reagents and solutions.',
    safetyTip: 'Always read horizontally at eye level with the bottom of the curved liquid meniscus. Never heat liquids directly inside a measuring cylinder.'
  },
  {
    id: 'app-funnel',
    name: 'Filter Funnel',
    category: 'separation',
    svgType: 'funnel',
    description: 'A wide conical mouth with a narrow stem used to channel liquids and support folded filter paper cones during mechanical separation.',
    primaryUse: 'Used in filtration to separate insoluble solid residues from liquid filtrates, and for safely pouring liquids into narrow-necked bottles.',
    safetyTip: 'The folded filter paper must never extend beyond the top glass rim of the funnel. Wet paper lightly with distilled water to ensure proper adhesion.'
  },
  {
    id: 'app-mortar-pestle',
    name: 'Mortar & Pestle',
    category: 'reaction',
    svgType: 'mortar-pestle',
    description: 'A heavy porcelain bowl (mortar) and a club-shaped grinding rod (pestle) used for mechanical size reduction and homogenization.',
    primaryUse: 'Crushes, grinds, and pulverizes large crystal lumps or plant specimens into fine, easily soluble powders before chemical reactions.',
    safetyTip: 'Grind solids with a steady twisting and circular rubbing pressure; never hammer or strike violently, which can crack the porcelain bowl.'
  },
  {
    id: 'app-clamp-stand',
    name: 'Retort Stand & Clamp',
    category: 'support',
    svgType: 'clamp-stand',
    description: 'A heavy cast-iron rectangular base supporting a vertical steel rod, fitted with adjustable bossheads and clamps to hold glassware rigid.',
    primaryUse: 'Holds burettes during titrations, supports condensers and distillation flasks, and stabilizes elevated laboratory apparatus.',
    safetyTip: 'Position the clamp directly above the heavy metal base to prevent the stand from tipping over under the weight of glass assemblies.'
  },
  {
    id: 'app-beaker',
    name: 'Beaker',
    category: 'reaction',
    svgType: 'beaker',
    description: 'A simple cylindrical container with a flat bottom, straight sides, and a small spout for pouring liquids and preparing solutions.',
    primaryUse: 'Holding liquids, dissolving solids, performing general chemical reactions, heating water baths, and collecting filtrate runoff.',
    safetyTip: 'Graduation lines on a beaker are approximate approximations. Never use beaker markings for precise quantitative measurements.'
  },
  {
    id: 'app-tripod-stand',
    name: 'Tripod Stand',
    category: 'support',
    svgType: 'tripod-stand',
    description: 'A three-legged iron platform providing a stable, elevated support for beakers and flasks directly above a Bunsen burner flame.',
    primaryUse: 'Supports wire gauze, sand baths, or pipeclay triangles beneath apparatus undergoing heating by a gas burner or spirit burner.',
    safetyTip: 'Ensure all three metal legs rest flat and securely on the workbench before placing loaded glassware on top.'
  },
  {
    id: 'app-wire-gauze',
    name: 'Wire Gauze (with Ceramic Center)',
    category: 'support',
    svgType: 'wire-gauze',
    description: 'A square sheet of woven iron wire mesh featuring a heat-resistant ceramic center circle, placed directly onto a tripod stand.',
    primaryUse: 'Diffuses the direct flame heat evenly across the bottom of glassware, preventing localized hot spots and thermal shock fractures.',
    safetyTip: 'Never heat glass beakers or flasks directly over a naked Bunsen flame without wire gauze; thermal stress will crack the glass.'
  },
  {
    id: 'app-bunsen-burner',
    name: 'Bunsen Burner',
    category: 'heating',
    svgType: 'bunsen-burner',
    description: 'A metal laboratory gas burner with an adjustable rotating collar regulating air intake to control flame type and heat intensity.',
    primaryUse: 'Provides adjustable heat for chemical reactions, sterilizing equipment, boiling liquids, and conducting flame tests for metal cations.',
    safetyTip: 'Light the match and hold it near the top of the barrel BEFORE turning on the gas tap. Close the air hole first for a safe, visible yellow flame.'
  },
  {
    id: 'app-tongs',
    name: 'Crucible & Apparatus Tongs',
    category: 'holding',
    svgType: 'tongs',
    description: 'Scissor-like steel gripping instruments with curved serrated tips engineered to grip hot glassware and ceramic crucibles securely.',
    primaryUse: 'Picking up, lifting, and transferring red-hot evaporating dishes, porcelain crucibles, small beakers, and hot reaction vessels.',
    safetyTip: 'Test the grip firmly before lifting hot items. Never handle hot equipment while wearing greasy gloves or rushing across the laboratory.'
  }
];

export const HAZARD_SYMBOLS: HazardSymbolItem[] = [
  {
    id: 'hazard-toxic',
    name: 'Toxic / Poisonous',
    symbol: '💀',
    meaning: 'Substances that can cause severe illness, poisoning, organ damage, or fatal death if swallowed, inhaled, or absorbed through the skin.',
    precaution: 'Work inside a well-ventilated fume cupboard. Wear nitrile gloves and never inhale fumes. Keep strictly locked in poison cupboards.',
    example: 'Potassium cyanide, mercury compounds, chlorine gas, concentrated methanol.',
    color: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-200 border-purple-300 dark:border-purple-700',
    dangerLevel: 'Extreme Danger'
  },
  {
    id: 'hazard-flammable',
    name: 'Highly Flammable',
    symbol: '🔥',
    meaning: 'Chemicals that ignite easily and catch fire rapidly at low temperatures or when exposed to open flames, sparks, or friction.',
    precaution: 'Keep far away from Bunsen burners, naked flames, sparks, and electrical heaters. Store in grounded flammable storage cabinets.',
    example: 'Ethanol, petrol, acetone, diethyl ether, kerosene, magnesium ribbon.',
    color: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    dangerLevel: 'High Danger'
  },
  {
    id: 'hazard-corrosive',
    name: 'Corrosive',
    symbol: '🧪',
    meaning: 'Substances that attack, burn, and destroy living body tissue (skin, eyes, lungs) and corrode laboratory metal benches upon contact.',
    precaution: 'Wear chemical-resistant splash goggles, laboratory apron, and rubber gloves. If spilled, flush immediately with copious cold water for 15 minutes.',
    example: 'Concentrated sulfuric acid (H₂SO₄), concentrated nitric acid (HNO₃), sodium hydroxide pellets (NaOH).',
    color: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-200 border-rose-300 dark:border-rose-700',
    dangerLevel: 'Extreme Danger'
  },
  {
    id: 'hazard-oxidising',
    name: 'Oxidising Agent',
    symbol: '⭕🔥',
    meaning: 'Substances that release oxygen and intensify fires or cause flammable combustible materials to explode or burn violently.',
    precaution: 'Never store oxidizers next to organic flammable solvents, fuels, or reducing agents. Keep sealed in a cool, dry location.',
    example: 'Potassium permanganate (KMnO₄), hydrogen peroxide (H₂O₂), potassium chlorate (KClO₃).',
    color: 'text-orange-600 dark:text-orange-400',
    badgeBg: 'bg-orange-100 text-orange-900 dark:bg-orange-950/80 dark:text-orange-200 border-orange-300 dark:border-orange-700',
    dangerLevel: 'High Danger'
  },
  {
    id: 'hazard-harmful',
    name: 'Harmful / Irritant',
    symbol: '✖',
    meaning: 'Chemicals that cause redness, skin rashes, blisters, respiratory tract irritation, or mild systemic health effects upon contact.',
    precaution: 'Avoid direct skin contact and inhalation of dust or vapors. Wear safety glasses, lab coat, and wash hands thoroughly after lab work.',
    example: 'Dilute hydrochloric acid, copper(II) sulfate crystals, bleach solution, calcium chloride.',
    color: 'text-yellow-600 dark:text-yellow-400',
    badgeBg: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950/80 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
    dangerLevel: 'Caution'
  },
  {
    id: 'hazard-environmental',
    name: 'Dangerous to the Environment',
    symbol: '🌳🐟',
    meaning: 'Substances that cause acute or chronic toxic destruction to aquatic ecosystems, soil microorganisms, fish, and wildlife.',
    precaution: 'Never pour waste down laboratory sinks into communal drains. Collect in designated chemical waste jars for neutralization or safe disposal.',
    example: 'Lead compounds, copper salts, silver nitrate solutions, heavy metal wastes.',
    color: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
    dangerLevel: 'Warning'
  },
  {
    id: 'hazard-explosive',
    name: 'Explosive',
    symbol: '💥',
    meaning: 'Unstable chemicals that can undergo violent and rapid exothermic decomposition, generating destructive shockwaves, blast heat, and flying shards.',
    precaution: 'Store in spark-free explosion-proof containers away from shock, friction, heat, and open fire. Handle strictly according to safety protocols.',
    example: 'Dry ammonium nitrate, picric acid, organic peroxides, gunpowder mixtures.',
    color: 'text-red-700 dark:text-red-400',
    badgeBg: 'bg-red-100 text-red-900 dark:bg-red-950/80 dark:text-red-200 border-red-300 dark:border-red-700',
    dangerLevel: 'Extreme Danger'
  },
  {
    id: 'hazard-gas',
    name: 'Gas Under Pressure',
    symbol: '🛢️',
    meaning: 'Compressed, liquefied, or dissolved gases in cylinders that can explode if heated or cause rapid asphyxiation and cryogenic frostbite if leaking.',
    precaution: 'Chain and strap gas cylinders vertically to the laboratory wall. Transport only with cylinder trolleys and protective valve caps fitted.',
    example: 'Compressed oxygen cylinders, liquid nitrogen containers, carbon dioxide cylinders.',
    color: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950/80 dark:text-cyan-200 border-cyan-300 dark:border-cyan-700',
    dangerLevel: 'High Danger'
  }
];
