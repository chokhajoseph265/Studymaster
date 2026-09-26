/**
 * High-definition SVG diagrams for Malawi Form 1 Chemistry
 */

export const SVG_DIFFUSION_EXPERIMENT = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 450" width="100%" height="100%">
  <defs>
    <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#bae6fd" stop-opacity="0.9"/>
    </linearGradient>
    <radialGradient id="purpleDiffusion" cx="50%" cy="90%" r="70%">
      <stop offset="0%" stop-color="#7e22ce" stop-opacity="0.95"/>
      <stop offset="35%" stop-color="#a855f7" stop-opacity="0.7"/>
      <stop offset="70%" stop-color="#c084fc" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#e9d5ff" stop-opacity="0.1"/>
    </radialGradient>
  </defs>
  <rect width="700" height="450" fill="#f8fafc" rx="16"/>
  <text x="350" y="36" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#0f172a">Investigating Diffusion in Liquids (Potassium Permanganate)</text>
  
  <!-- Left: Initial Setup (Thistle Funnel) -->
  <g transform="translate(60, 60)">
    <text x="120" y="24" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#0369a1">Stage 1: Initial Setup</text>
    <!-- Beaker -->
    <rect x="30" y="50" width="180" height="230" rx="8" fill="url(#waterGrad)" stroke="#0284c7" stroke-width="3"/>
    <!-- Water Level -->
    <line x1="30" y1="90" x2="210" y2="90" stroke="#0284c7" stroke-width="2" stroke-dasharray="4,4"/>
    <text x="218" y="94" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#0369a1">Water level</text>
    <!-- Thistle Funnel -->
    <path d="M 100 10 L 140 10 L 126 50 L 126 260 L 114 260 L 114 50 Z" fill="#ffffff" stroke="#334155" stroke-width="2"/>
    <ellipse cx="120" cy="10" rx="20" ry="6" fill="#f1f5f9" stroke="#334155" stroke-width="2"/>
    <text x="120" y="-4" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#334155">Thistle funnel</text>
    <!-- KMnO4 crystals at base of thistle funnel -->
    <circle cx="116" cy="270" r="5" fill="#581c87"/>
    <circle cx="124" cy="270" r="6" fill="#6b21a8"/>
    <circle cx="120" cy="265" r="5" fill="#4c1d95"/>
    <text x="120" y="305" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#6b21a8">KMnO₄ crystals introduced</text>
  </g>

  <!-- Right: After 5-10 Minutes (Diffusion complete) -->
  <g transform="translate(400, 60)">
    <text x="120" y="24" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#7e22ce">Stage 2: After 5 Minutes (Diffused)</text>
    <!-- Beaker with diffused purple solution -->
    <rect x="30" y="50" width="180" height="230" rx="8" fill="url(#purpleDiffusion)" stroke="#7e22ce" stroke-width="3"/>
    <!-- Water meniscus -->
    <path d="M 30 90 Q 120 95 210 90" fill="none" stroke="#7e22ce" stroke-width="2"/>
    <text x="218" y="94" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#7e22ce">Uniform purple solution</text>
    
    <!-- Moving particle markers -->
    <circle cx="60" cy="130" r="3" fill="#6b21a8"/>
    <circle cx="150" cy="120" r="3" fill="#6b21a8"/>
    <circle cx="90" cy="180" r="3" fill="#6b21a8"/>
    <circle cx="170" cy="200" r="3" fill="#6b21a8"/>
    <circle cx="80" cy="240" r="3" fill="#6b21a8"/>
    <circle cx="140" cy="250" r="3" fill="#6b21a8"/>

    <text x="120" y="305" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#7e22ce">Particles in constant random motion</text>
  </g>

  <!-- Bottom Key Explanation Banner -->
  <rect x="50" y="380" width="600" height="50" rx="10" fill="#ede9fe" stroke="#c4b5fd" stroke-width="1.5"/>
  <text x="350" y="410" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#4c1d95">Key Principle: Solute particles spread from high concentration at the crystals to low concentration across water.</text>
</svg>
`)}`;

export const SVG_ATOMIC_STRUCTURE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <rect width="600" height="450" fill="#ffffff" rx="16"/>
  <text x="300" y="32" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#0f172a">Atomic Structure of Sodium (Na - 2.8.1)</text>

  <g transform="translate(300, 240)">
    <!-- 3rd Shell (Outer Shell - 1 electron) -->
    <circle cx="0" cy="0" r="160" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6,4"/>
    <circle cx="0" cy="-160" r="7" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
    <text x="0" y="-175" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#0284c7">1 Valence Electron (3rd Shell)</text>

    <!-- 2nd Shell (8 electrons) -->
    <circle cx="0" cy="0" r="110" fill="none" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="0" cy="-110" r="6" fill="#0284c7"/>
    <circle cx="0" cy="110" r="6" fill="#0284c7"/>
    <circle cx="-110" cy="0" r="6" fill="#0284c7"/>
    <circle cx="110" cy="0" r="6" fill="#0284c7"/>
    <circle cx="-78" cy="-78" r="6" fill="#0284c7"/>
    <circle cx="78" cy="-78" r="6" fill="#0284c7"/>
    <circle cx="-78" cy="78" r="6" fill="#0284c7"/>
    <circle cx="78" cy="78" r="6" fill="#0284c7"/>

    <!-- 1st Shell (2 electrons) -->
    <circle cx="0" cy="0" r="60" fill="none" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="-60" cy="0" r="6" fill="#0284c7"/>
    <circle cx="60" cy="0" r="6" fill="#0284c7"/>

    <!-- Central Nucleus -->
    <circle cx="0" cy="0" r="32" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
    <text x="0" y="-6" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#ffffff">11p⁺</text>
    <text x="0" y="12" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#ffffff">12n⁰</text>
    <text x="0" y="24" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#fee2e2">Na</text>
  </g>
</svg>
`)}`;

export const SVG_PERIODIC_TABLE_FIRST20 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 380" width="100%" height="100%">
  <rect width="760" height="380" fill="#ffffff" rx="16"/>
  <text x="380" y="30" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#0f172a">Periodic Table of the First 20 Elements</text>
  
  <g transform="translate(30, 50)" font-family="system-ui, sans-serif">
    <!-- Group headers -->
    <text x="40" y="20" font-size="12" font-weight="800" fill="#047857">I</text>
    <text x="125" y="20" font-size="12" font-weight="800" fill="#047857">II</text>
    <text x="210" y="20" font-size="12" font-weight="800" fill="#047857">III</text>
    <text x="295" y="20" font-size="12" font-weight="800" fill="#047857">IV</text>
    <text x="380" y="20" font-size="12" font-weight="800" fill="#047857">V</text>
    <text x="465" y="20" font-size="12" font-weight="800" fill="#047857">VI</text>
    <text x="550" y="20" font-size="12" font-weight="800" fill="#047857">VII</text>
    <text x="635" y="20" font-size="12" font-weight="800" fill="#047857">VIII</text>

    <!-- Period 1 -->
    <rect x="0" y="35" width="80" height="60" rx="6" fill="#f0fdf4" stroke="#16a34a"/>
    <text x="10" y="52" font-size="10" font-weight="700" fill="#166534">1</text>
    <text x="40" y="68" text-anchor="middle" font-size="18" font-weight="900" fill="#14532d">H</text>
    <text x="40" y="86" text-anchor="middle" font-size="10" fill="#166534">1</text>

    <rect x="595" y="35" width="80" height="60" rx="6" fill="#f8fafc" stroke="#64748b"/>
    <text x="605" y="52" font-size="10" font-weight="700" fill="#334155">2</text>
    <text x="635" y="68" text-anchor="middle" font-size="18" font-weight="900" fill="#0f172a">He</text>
    <text x="635" y="86" text-anchor="middle" font-size="10" fill="#334155">2</text>

    <!-- Period 2 -->
    <rect x="0" y="105" width="80" height="60" rx="6" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="10" y="122" font-size="10" font-weight="700" fill="#1e40af">3</text>
    <text x="40" y="138" text-anchor="middle" font-size="18" font-weight="900" fill="#1e3a8a">Li</text>
    <text x="40" y="156" text-anchor="middle" font-size="10" fill="#1e40af">2.1</text>

    <rect x="85" y="105" width="80" height="60" rx="6" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="95" y="122" font-size="10" font-weight="700" fill="#1e40af">4</text>
    <text x="125" y="138" text-anchor="middle" font-size="18" font-weight="900" fill="#1e3a8a">Be</text>
    <text x="125" y="156" text-anchor="middle" font-size="10" fill="#1e40af">2.2</text>

    <rect x="170" y="105" width="80" height="60" rx="6" fill="#fefce8" stroke="#ca8a04"/>
    <text x="180" y="122" font-size="10" font-weight="700" fill="#854d0e">5</text>
    <text x="210" y="138" text-anchor="middle" font-size="18" font-weight="900" fill="#713f12">B</text>
    <text x="210" y="156" text-anchor="middle" font-size="10" fill="#854d0e">2.3</text>

    <rect x="255" y="105" width="80" height="60" rx="6" fill="#fef2f2" stroke="#ef4444"/>
    <text x="265" y="122" font-size="10" font-weight="700" fill="#991b1b">6</text>
    <text x="295" y="138" text-anchor="middle" font-size="18" font-weight="900" fill="#7f1d1d">C</text>
    <text x="295" y="156" text-anchor="middle" font-size="10" fill="#991b1b">2.4</text>

    <rect x="340" y="105" width="80" height="60" rx="6" fill="#fef2f2" stroke="#ef4444"/>
    <text x="350" y="122" font-size="10" font-weight="700" fill="#991b1b">7</text>
    <text x="380" y="138" text-anchor="middle" font-size="18" font-weight="900" fill="#7f1d1d">N</text>
    <text x="380" y="156" text-anchor="middle" font-size="10" fill="#991b1b">2.5</text>

    <rect x="425" y="105" width="80" height="60" rx="6" fill="#fef2f2" stroke="#ef4444"/>
    <text x="435" y="122" font-size="10" font-weight="700" fill="#991b1b">8</text>
    <text x="465" y="138" text-anchor="middle" font-size="18" font-weight="900" fill="#7f1d1d">O</text>
    <text x="465" y="156" text-anchor="middle" font-size="10" fill="#991b1b">2.6</text>

    <rect x="510" y="105" width="80" height="60" rx="6" fill="#fef2f2" stroke="#ef4444"/>
    <text x="520" y="122" font-size="10" font-weight="700" fill="#991b1b">9</text>
    <text x="550" y="138" text-anchor="middle" font-size="18" font-weight="900" fill="#7f1d1d">F</text>
    <text x="550" y="156" text-anchor="middle" font-size="10" fill="#991b1b">2.7</text>

    <rect x="595" y="105" width="80" height="60" rx="6" fill="#f8fafc" stroke="#64748b"/>
    <text x="605" y="122" font-size="10" font-weight="700" fill="#334155">10</text>
    <text x="635" y="138" text-anchor="middle" font-size="18" font-weight="900" fill="#0f172a">Ne</text>
    <text x="635" y="156" text-anchor="middle" font-size="10" fill="#334155">2.8</text>

    <!-- Period 3 -->
    <rect x="0" y="175" width="80" height="60" rx="6" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="10" y="192" font-size="10" font-weight="700" fill="#1e40af">11</text>
    <text x="40" y="208" text-anchor="middle" font-size="18" font-weight="900" fill="#1e3a8a">Na</text>
    <text x="40" y="226" text-anchor="middle" font-size="10" fill="#1e40af">2.8.1</text>

    <rect x="85" y="175" width="80" height="60" rx="6" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="95" y="192" font-size="10" font-weight="700" fill="#1e40af">12</text>
    <text x="125" y="208" text-anchor="middle" font-size="18" font-weight="900" fill="#1e3a8a">Mg</text>
    <text x="125" y="226" text-anchor="middle" font-size="10" fill="#1e40af">2.8.2</text>

    <rect x="170" y="175" width="80" height="60" rx="6" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="180" y="192" font-size="10" font-weight="700" fill="#1e40af">13</text>
    <text x="210" y="208" text-anchor="middle" font-size="18" font-weight="900" fill="#1e3a8a">Al</text>
    <text x="210" y="226" text-anchor="middle" font-size="10" fill="#1e40af">2.8.3</text>

    <rect x="255" y="175" width="80" height="60" rx="6" fill="#fefce8" stroke="#ca8a04"/>
    <text x="265" y="192" font-size="10" font-weight="700" fill="#854d0e">14</text>
    <text x="295" y="208" text-anchor="middle" font-size="18" font-weight="900" fill="#713f12">Si</text>
    <text x="295" y="226" text-anchor="middle" font-size="10" fill="#854d0e">2.8.4</text>

    <rect x="340" y="175" width="80" height="60" rx="6" fill="#fef2f2" stroke="#ef4444"/>
    <text x="350" y="192" font-size="10" font-weight="700" fill="#991b1b">15</text>
    <text x="380" y="208" text-anchor="middle" font-size="18" font-weight="900" fill="#7f1d1d">P</text>
    <text x="380" y="226" text-anchor="middle" font-size="10" fill="#991b1b">2.8.5</text>

    <rect x="425" y="175" width="80" height="60" rx="6" fill="#fef2f2" stroke="#ef4444"/>
    <text x="435" y="192" font-size="10" font-weight="700" fill="#991b1b">16</text>
    <text x="465" y="208" text-anchor="middle" font-size="18" font-weight="900" fill="#7f1d1d">S</text>
    <text x="465" y="226" text-anchor="middle" font-size="10" fill="#991b1b">2.8.6</text>

    <rect x="510" y="175" width="80" height="60" rx="6" fill="#fef2f2" stroke="#ef4444"/>
    <text x="520" y="192" font-size="10" font-weight="700" fill="#991b1b">17</text>
    <text x="550" y="208" text-anchor="middle" font-size="18" font-weight="900" fill="#7f1d1d">Cl</text>
    <text x="550" y="226" text-anchor="middle" font-size="10" fill="#991b1b">2.8.7</text>

    <rect x="595" y="175" width="80" height="60" rx="6" fill="#f8fafc" stroke="#64748b"/>
    <text x="605" y="192" font-size="10" font-weight="700" fill="#334155">18</text>
    <text x="635" y="208" text-anchor="middle" font-size="18" font-weight="900" fill="#0f172a">Ar</text>
    <text x="635" y="226" text-anchor="middle" font-size="10" fill="#334155">2.8.8</text>

    <!-- Period 4 -->
    <rect x="0" y="245" width="80" height="60" rx="6" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="10" y="262" font-size="10" font-weight="700" fill="#1e40af">19</text>
    <text x="40" y="278" text-anchor="middle" font-size="18" font-weight="900" fill="#1e3a8a">K</text>
    <text x="40" y="296" text-anchor="middle" font-size="10" fill="#1e40af">2.8.8.1</text>

    <rect x="85" y="245" width="80" height="60" rx="6" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="95" y="262" font-size="10" font-weight="700" fill="#1e40af">20</text>
    <text x="125" y="278" text-anchor="middle" font-size="18" font-weight="900" fill="#1e3a8a">Ca</text>
    <text x="125" y="296" text-anchor="middle" font-size="10" fill="#1e40af">2.8.8.2</text>
  </g>
</svg>
`)}`;

export const SVG_FRACTIONAL_DISTILLATION = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%">
  <defs>
    <linearGradient id="heatGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#ea580c"/>
      <stop offset="50%" stop-color="#facc15"/>
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="480" fill="#ffffff" rx="16"/>
  <text x="400" y="32" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#0f172a">Fractional Distillation of Ethanol and Water</text>

  <!-- Distillation Flask & Heating -->
  <g transform="translate(100, 180)">
    <!-- Round bottom flask -->
    <path d="M 50 40 L 50 0 L 70 0 L 70 40 A 50 50 0 1 1 50 40 Z" fill="#e0f2fe" stroke="#334155" stroke-width="2.5"/>
    <text x="60" y="100" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#0369a1">Ethanol + Water</text>
    <!-- Bunsen Burner -->
    <rect x="45" y="165" width="30" height="40" fill="#64748b" stroke="#334155" stroke-width="2"/>
    <path d="M 45 165 Q 60 125 75 165 Z" fill="url(#heatGrad)"/>
    <text x="60" y="225" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#ea580c">HEAT</text>
  </g>

  <!-- Fractionating Column with Glass Beads -->
  <g transform="translate(150, 40)">
    <rect x="0" y="50" width="20" height="130" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
    <!-- Glass Beads pattern -->
    <circle cx="10" cy="70" r="4" fill="#94a3b8"/>
    <circle cx="10" cy="85" r="4" fill="#94a3b8"/>
    <circle cx="10" cy="100" r="4" fill="#94a3b8"/>
    <circle cx="10" cy="115" r="4" fill="#94a3b8"/>
    <circle cx="10" cy="130" r="4" fill="#94a3b8"/>
    <circle cx="10" cy="145" r="4" fill="#94a3b8"/>
    <circle cx="10" cy="160" r="4" fill="#94a3b8"/>
    <!-- Labels -->
    <line x1="-10" y1="110" x2="-60" y2="110" stroke="#047857" stroke-width="1.5"/>
    <text x="-65" y="105" text-anchor="end" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#047857">Fractionating column</text>
    <text x="-65" y="120" text-anchor="end" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#64748b">(Packed with glass beads)</text>

    <!-- Thermometer at column top -->
    <rect x="8" y="0" width="4" height="60" fill="#e2e8f0" stroke="#ef4444" stroke-width="1.5"/>
    <circle cx="10" cy="58" r="3" fill="#ef4444"/>
    <text x="18" y="25" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#dc2626">78°C (Ethanol b.p.)</text>
  </g>

  <!-- Liebig Condenser -->
  <g transform="translate(170, 90)">
    <!-- Inner Tube -->
    <line x1="0" y1="0" x2="320" y2="160" stroke="#334155" stroke-width="5"/>
    <!-- Outer Water Jacket -->
    <line x1="40" y1="20" x2="280" y2="140" stroke="#38bdf8" stroke-width="26" stroke-linecap="round" opacity="0.6"/>
    <text x="160" y="60" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#0284c7">Liebig Condenser</text>
    
    <!-- Water Out -->
    <line x1="80" y1="30" x2="80" y2="0" stroke="#0284c7" stroke-width="2"/>
    <text x="80" y="-6" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#0284c7">Water OUT</text>
    
    <!-- Water In -->
    <line x1="240" y1="130" x2="240" y2="160" stroke="#0284c7" stroke-width="2"/>
    <text x="240" y="178" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#0284c7">Water IN</text>
  </g>

  <!-- Receiving Beaker & Pure Ethanol -->
  <g transform="translate(490, 260)">
    <rect x="0" y="20" width="80" height="90" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="2.5"/>
    <rect x="5" y="60" width="70" height="46" rx="4" fill="#86efac" opacity="0.8"/>
    <text x="40" y="85" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#15803d">Pure Ethanol</text>
    <text x="40" y="130" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#15803d">(Boiling point 78°C)</text>
  </g>

  <!-- Summary Box -->
  <rect x="80" y="420" width="640" height="40" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="400" y="445" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#334155">Principle: Ethanol (78°C) boils and condenses before water (100°C), achieving clean separation.</text>
</svg>
`)}`;

export const SVG_FRACTIONAL_DISTILLATION_PETROLEUM = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 560" width="100%" height="100%">
  <rect width="850" height="560" fill="#0f172a" rx="16"/>
  <text x="425" y="36" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" font-weight="800" fill="#f8fafc">Industrial Fractional Distillation of Petroleum (Crude Oil)</text>

  <!-- Tower Body -->
  <g transform="translate(100, 60)">
    <!-- Column shell -->
    <rect x="80" y="30" width="160" height="420" rx="40" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
    
    <!-- Temperature indicators on tower -->
    <text x="60" y="55" text-anchor="end" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#38bdf8">Cool (25°C)</text>
    <text x="60" y="440" text-anchor="end" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ef4444">Hot (&gt;400°C)</text>

    <!-- Crude Oil Inflow -->
    <rect x="-40" y="380" width="120" height="24" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>
    <text x="10" y="396" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#f87171">Crude Oil In (400°C)</text>
  </g>

  <!-- Fractions & Outflows -->
  <g transform="translate(350, 75)" font-family="system-ui, sans-serif">
    <!-- Fraction 1: Refinery Gas -->
    <g transform="translate(0, 20)">
      <line x1="-110" y1="15" x2="0" y2="15" stroke="#38bdf8" stroke-width="2"/>
      <rect x="0" y="0" width="460" height="32" rx="6" fill="#0284c7"/>
      <text x="15" y="21" font-size="12" font-weight="800" fill="#ffffff">Refinery Gas (C₁–C₄, &lt;25°C)</text>
      <text x="260" y="21" font-size="11" font-weight="600" fill="#e0f2fe">Bottled gas for cooking &amp; heating</text>
    </g>

    <!-- Fraction 2: Petrol / Gasoline -->
    <g transform="translate(0, 68)">
      <line x1="-110" y1="15" x2="0" y2="15" stroke="#0ea5e9" stroke-width="2"/>
      <rect x="0" y="0" width="460" height="32" rx="6" fill="#0369a1"/>
      <text x="15" y="21" font-size="12" font-weight="800" fill="#ffffff">Petrol / Gasoline (C₅–C₆, ~40–100°C)</text>
      <text x="260" y="21" font-size="11" font-weight="600" fill="#bae6fd">Fuel for motor vehicles &amp; cars</text>
    </g>

    <!-- Fraction 3: Naphtha -->
    <g transform="translate(0, 116)">
      <line x1="-110" y1="15" x2="0" y2="15" stroke="#10b981" stroke-width="2"/>
      <rect x="0" y="0" width="460" height="32" rx="6" fill="#047857"/>
      <text x="15" y="21" font-size="12" font-weight="800" fill="#ffffff">Naphtha (C₆–C₁₀, ~90–150°C)</text>
      <text x="260" y="21" font-size="11" font-weight="600" fill="#a7f3d0">Chemical feedstock for plastics</text>
    </g>

    <!-- Fraction 4: Kerosene / Paraffin -->
    <g transform="translate(0, 164)">
      <line x1="-110" y1="15" x2="0" y2="15" stroke="#eab308" stroke-width="2"/>
      <rect x="0" y="0" width="460" height="32" rx="6" fill="#ca8a04"/>
      <text x="15" y="21" font-size="12" font-weight="800" fill="#ffffff">Kerosene / Paraffin (C₁₀–C₁₅, ~150–240°C)</text>
      <text x="260" y="21" font-size="11" font-weight="600" fill="#fef08a">Jet fuel, paraffin stoves &amp; lamps</text>
    </g>

    <!-- Fraction 5: Diesel -->
    <g transform="translate(0, 212)">
      <line x1="-110" y1="15" x2="0" y2="15" stroke="#f97316" stroke-width="2"/>
      <rect x="0" y="0" width="460" height="32" rx="6" fill="#c2410c"/>
      <text x="15" y="21" font-size="12" font-weight="800" fill="#ffffff">Diesel Oil (C₁₅–C₂₀, ~220–350°C)</text>
      <text x="260" y="21" font-size="11" font-weight="600" fill="#ffedd5">Fuel for lorries, buses &amp; trains</text>
    </g>

    <!-- Fraction 6: Fuel Oil -->
    <g transform="translate(0, 260)">
      <line x1="-110" y1="15" x2="0" y2="15" stroke="#ef4444" stroke-width="2"/>
      <rect x="0" y="0" width="460" height="32" rx="6" fill="#b91c1c"/>
      <text x="15" y="21" font-size="12" font-weight="800" fill="#ffffff">Fuel Oil (C₂₀–C₃₀, ~300–400°C)</text>
      <text x="260" y="21" font-size="11" font-weight="600" fill="#fee2e2">Fuel for cargo ships &amp; power plants</text>
    </g>

    <!-- Fraction 7: Lubricating Fraction -->
    <g transform="translate(0, 308)">
      <line x1="-110" y1="15" x2="0" y2="15" stroke="#a855f7" stroke-width="2"/>
      <rect x="0" y="0" width="460" height="32" rx="6" fill="#7e22ce"/>
      <text x="15" y="21" font-size="12" font-weight="800" fill="#ffffff">Lubricants &amp; Waxes (C₃₀–C₅₀, &gt;400°C)</text>
      <text x="260" y="21" font-size="11" font-weight="600" fill="#f3e8ff">Engine oil, grease, candle wax, polish</text>
    </g>

    <!-- Fraction 8: Bitumen / Asphalt -->
    <g transform="translate(0, 356)">
      <line x1="-110" y1="15" x2="0" y2="15" stroke="#64748b" stroke-width="2"/>
      <rect x="0" y="0" width="460" height="32" rx="6" fill="#334155"/>
      <text x="15" y="21" font-size="12" font-weight="800" fill="#ffffff">Bitumen (C₅₀+, Residue)</text>
      <text x="260" y="21" font-size="11" font-weight="600" fill="#cbd5e1">Tarmacking roads &amp; roof sealing</text>
    </g>
  </g>

  <!-- Bottom Principle -->
  <text x="425" y="525" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">Small carbon molecules rise to the cool top (low boiling point); Large viscous molecules remain at the hot base.</text>
</svg>
`)}`;

export const SVG_TRIPLE_BEAM_BALANCE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 380" width="100%" height="100%">
  <rect width="760" height="380" fill="#f8fafc" rx="16"/>
  <text x="380" y="32" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#0f172a">The Triple Beam Balance (Laboratory Mass Measurement)</text>

  <g transform="translate(60, 60)">
    <!-- Base Plate -->
    <rect x="20" y="240" width="600" height="24" rx="4" fill="#334155"/>
    <rect x="50" y="264" width="30" height="12" rx="2" fill="#1e293b"/>
    <rect x="560" y="264" width="30" height="12" rx="2" fill="#1e293b"/>

    <!-- Pan Column & Pan -->
    <rect x="80" y="90" width="16" height="150" fill="#64748b"/>
    <ellipse cx="88" cy="85" rx="75" ry="18" fill="#e2e8f0" stroke="#475569" stroke-width="2.5"/>
    <!-- Sample on pan -->
    <path d="M 68 80 L 108 80 L 98 50 L 78 50 Z" fill="#ca8a04" stroke="#854d0e" stroke-width="1.5"/>
    <text x="88" y="70" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#ffffff">SAMPLE</text>
    <text x="88" y="125" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#334155">Pan</text>

    <!-- Fulcrum & Zero Screw -->
    <polygon points="150,240 180,140 210,240" fill="#475569"/>
    <circle cx="150" cy="140" r="10" fill="#94a3b8" stroke="#334155" stroke-width="2"/>
    <text x="120" y="165" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#475569">Zero Screw</text>

    <!-- Three Beams -->
    <!-- Middle Beam (100g notches) -->
    <rect x="180" y="120" width="380" height="14" rx="2" fill="#ffffff" stroke="#334155" stroke-width="1.5"/>
    <text x="190" y="131" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#047857">100g Beam (Notches: 0, 100, 200, 300g, 400g, 500g)</text>
    <!-- Rider 100g at 300g -->
    <rect x="360" y="112" width="16" height="26" rx="2" fill="#047857" stroke="#064e3b" stroke-width="1.5"/>

    <!-- Top Beam (10g notches) -->
    <rect x="180" y="145" width="380" height="14" rx="2" fill="#ffffff" stroke="#334155" stroke-width="1.5"/>
    <text x="190" y="156" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#0284c7">10g Beam (Notches: 0, 10, 20, 30, 40g, ... 100g)</text>
    <!-- Rider 10g at 40g -->
    <rect x="290" y="137" width="14" height="26" rx="2" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>

    <!-- Front Beam (0-10g sliding scale) -->
    <rect x="180" y="170" width="380" height="14" rx="2" fill="#ffffff" stroke="#334155" stroke-width="1.5"/>
    <text x="190" y="181" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#b91c1c">1g Beam (Sliding rider: 0.0g to 10.0g, at 5.0g)</text>
    <!-- Small Rider at 5.0g -->
    <rect x="330" y="165" width="10" height="22" rx="2" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>

    <!-- Pointer and Zero Mark Scale -->
    <line x1="560" y1="150" x2="600" y2="150" stroke="#334155" stroke-width="3"/>
    <polygon points="600,150 615,145 615,155" fill="#ef4444"/>
    <rect x="615" y="125" width="20" height="50" fill="#e2e8f0" stroke="#334155" stroke-width="1.5"/>
    <line x1="615" y1="150" x2="635" y2="150" stroke="#047857" stroke-width="2"/>
    <text x="640" y="154" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#047857">0 (Balance)</text>
  </g>

  <!-- Formula Callout -->
  <rect x="80" y="325" width="600" height="40" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
  <text x="380" y="350" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="#065f46">Total Measured Mass = 300 g (beam 1) + 40 g (beam 2) + 5.0 g (beam 3) = 345.0 g</text>
</svg>
`)}`;

export const SVG_MEASURING_CYLINDER_MENISCUS = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420" width="100%" height="100%">
  <defs>
    <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <rect width="720" height="420" fill="#ffffff" rx="16"/>
  <text x="360" y="32" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#0f172a">Correct Reading of Liquid Volume (Avoiding Parallax Error)</text>

  <g transform="translate(140, 60)">
    <!-- Measuring Cylinder Glass Body -->
    <rect x="60" y="30" width="100" height="280" rx="8" fill="#f8fafc" stroke="#334155" stroke-width="3"/>
    <rect x="30" y="300" width="160" height="20" rx="4" fill="#64748b" stroke="#334155" stroke-width="2"/>

    <!-- Liquid Fill -->
    <path d="M 62 160 Q 110 175 158 160 L 158 300 L 62 300 Z" fill="url(#liquidGrad)"/>
    <!-- Meniscus Line -->
    <path d="M 62 160 Q 110 175 158 160" fill="none" stroke="#0369a1" stroke-width="3"/>

    <!-- Graduations -->
    <line x1="62" y1="60" x2="85" y2="60" stroke="#334155" stroke-width="2"/><text x="92" y="64" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#334155">100 ml</text>
    <line x1="62" y1="100" x2="80" y2="100" stroke="#334155" stroke-width="1.5"/><text x="88" y="104" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#64748b">80 ml</text>
    <line x1="62" y1="140" x2="80" y2="140" stroke="#334155" stroke-width="1.5"/><text x="88" y="144" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#64748b">60 ml</text>
    <line x1="62" y1="172" x2="88" y2="172" stroke="#dc2626" stroke-width="2.5"/><text x="96" y="176" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#dc2626">50 ml (True)</text>
    <line x1="62" y1="210" x2="80" y2="210" stroke="#334155" stroke-width="1.5"/><text x="88" y="214" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#64748b">40 ml</text>
    <line x1="62" y1="250" x2="80" y2="250" stroke="#334155" stroke-width="1.5"/><text x="88" y="254" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#64748b">20 ml</text>

    <!-- Sight Lines & Eyes -->
    <!-- 1. Eye Looking Down (High Error) -->
    <g transform="translate(320, 80)">
      <circle cx="0" cy="0" r="14" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
      <circle cx="-4" cy="2" r="5" fill="#ef4444"/>
      <line x1="-15" y1="6" x2="-190" y2="92" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4"/>
      <text x="22" y="5" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#dc2626">❌ Looking Down: Read too HIGH</text>
    </g>

    <!-- 2. Eye at Horizontal Level (CORRECT) -->
    <g transform="translate(320, 172)">
      <circle cx="0" cy="0" r="14" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <circle cx="-5" cy="0" r="5" fill="#16a34a"/>
      <line x1="-15" y1="0" x2="-210" y2="0" stroke="#16a34a" stroke-width="2.5"/>
      <text x="22" y="5" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="#15803d">✅ CORRECT: Eye at bottom of meniscus</text>
    </g>

    <!-- 3. Eye Looking Up (Low Error) -->
    <g transform="translate(320, 260)">
      <circle cx="0" cy="0" r="14" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
      <circle cx="-4" cy="-2" r="5" fill="#ef4444"/>
      <line x1="-15" y1="-6" x2="-190" y2="-88" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4"/>
      <text x="22" y="5" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#dc2626">❌ Looking Up: Read too LOW</text>
    </g>
  </g>

  <!-- Summary Footer -->
  <rect x="50" y="365" width="620" height="40" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="360" y="390" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">Golden Rule: Always position your eye horizontally level with the bottom of the meniscus.</text>
</svg>
`)}`;
