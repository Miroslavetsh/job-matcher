export interface Position {
  position_number: number;
  short_name_de: string;
  short_name_en: string;
  unit: string;
  description_de: string;
  description_en: string;
  hero: boolean;
}

export interface Trade {
  code: string;
  name_de: string;
  name_en: string;
  positions: Position[];
}

export interface Catalogue {
  trades: Trade[];
}

export interface IntakeData {
  name: string;
  phone: string;
  email: string;
  address: string;
  company?: string;
  description: string;
  difficultAccess: boolean;
}

export interface IntakeForm extends IntakeData {}

export interface MatchReason {
  matchedKeywords: string[];
  matchedTags?: string[];
  fuzzyMatch: boolean;
  categoryBoost: boolean;
  boostedCategory?: string;
}

export interface MatchResult {
  position: Position;
  score: number;
  why: MatchReason;
}
