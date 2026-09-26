/**
 * Chemistry & Laboratory Reference Type Definitions
 */

export interface ApparatusItem {
  id: string;
  name: string;
  category: 'reaction' | 'measurement' | 'heating' | 'separation' | 'support' | 'holding' | string;
  svgType: string;
  description: string;
  primaryUse: string;
  safetyTip: string;
}

export interface HazardSymbolItem {
  id: string;
  name: string;
  symbol: string;
  meaning: string;
  precaution: string;
  example: string;
  color?: string;
  badgeBg?: string;
  dangerLevel: 'Caution' | 'Warning' | 'High Danger' | 'Extreme Danger';
}
