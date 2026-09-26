import logoPureWhite from '../assets/images/logo_pure_white_bg_1788089418545.jpg';
import logoCleanWhiteAlt from '../assets/images/logo_clean_white_alt_1788089436563.jpg';
import logoUserExact from '../assets/images/user_exact_logo_1788089949135.jpg';
import logoBrandFull from '../assets/images/studymaster_full_brand_logo_1788090312869.jpg';
import logoBrandEmblemClean from '../assets/images/studymaster_brand_emblem_clean_1788090325632.jpg';
import logoEmblem from '../assets/images/studymaster_emblem_logo_1788087060174.jpg';
import logoVar1 from '../assets/images/logo_var1_scholar_wings_1788089111748.jpg';
import logoVar2 from '../assets/images/logo_var2_gold_quill_1788089125479.jpg';
import logoVar4 from '../assets/images/logo_var4_stylus_modern_1788089149330.jpg';
import logoVar5 from '../assets/images/logo_var5_scholar_crest_1788089164831.jpg';
import logoOptionA from '../assets/images/logo_option_a_minimal_1788087979637.jpg';

export interface LogoOption {
  id: string;
  name: string;
  tagline: string;
  imageSrc: string;
}

export const LOGO_OPTIONS: LogoOption[] = [
  {
    id: 'pure_white_clean',
    name: 'Pure White (Seamless Clean Symbol)',
    tagline: 'Flawless 100% white background, graduate scholar, red & green wings, open book & gold pen',
    imageSrc: logoPureWhite
  },
  {
    id: 'clean_white_alt',
    name: 'Vibrant Winged Emblem (No Words)',
    tagline: 'High contrast vibrant Malawi wings on solid white',
    imageSrc: logoCleanWhiteAlt
  },
  {
    id: 'studymaster_full_brand',
    name: 'Official Brand Emblem with Text',
    tagline: 'Full emblem featuring bold "StudyMaster Malawi" lettering',
    imageSrc: logoBrandFull
  },
  {
    id: 'studymaster_emblem_clean',
    name: 'Clean 3D Brand Badge',
    tagline: '3D educational badge with crisp typography',
    imageSrc: logoBrandEmblemClean
  },
  {
    id: 'user_exact_chosen',
    name: 'Original Scholar Emblem',
    tagline: 'Symbol emblem with scholar avatar & pen',
    imageSrc: logoUserExact
  },
  {
    id: 'var1_scholar_wings',
    name: 'High-Gloss Scholar Wings',
    tagline: 'Dynamic 3D curved aerodynamic wings in Malawi flag colors',
    imageSrc: logoVar1
  },
  {
    id: 'var2_gold_quill',
    name: 'Rising Sun & Gold Pen',
    tagline: 'Triumphant graduate figure with golden rays',
    imageSrc: logoVar2
  },
  {
    id: 'var4_stylus_modern',
    name: 'Modern Digital Stylus',
    tagline: 'Contemporary tech-education hybrid badge',
    imageSrc: logoVar4
  },
  {
    id: 'var5_scholar_crest',
    name: 'Golden Ring Scholar Crest',
    tagline: 'Circular academic crest seal',
    imageSrc: logoVar5
  },
  {
    id: 'option_a_minimal',
    name: 'Minimalist Vector',
    tagline: 'Clean geometric vector emblem',
    imageSrc: logoOptionA
  }
];

export const DEFAULT_LOGO_ID = 'pure_white_clean';

export function getActiveLogoSrc(): string {
  if (typeof window !== 'undefined') {
    const savedId = localStorage.getItem('studymaster_selected_logo_id');
    if (savedId) {
      const match = LOGO_OPTIONS.find(l => l.id === savedId);
      if (match) return match.imageSrc;
    }
  }
  return logoPureWhite;
}

export function setActiveLogoId(id: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('studymaster_selected_logo_id', id);
    window.dispatchEvent(new CustomEvent('studymaster_logo_changed', { detail: { id } }));
  }
}
