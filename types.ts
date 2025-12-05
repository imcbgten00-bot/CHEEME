export interface BusinessState {
  idea: string;
  name: string;
  description: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  } | null;
  branding: {
    slogan: string;
    colors: string[];
    logoUrl?: string;
  } | null;
  websiteCode: string | null;
  strategy: string | null;
  simulationData: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
    event: string;
  }[] | null;
  pitchDeck: {
    title: string;
    content: string;
    notes: string;
  }[] | null;
}

export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  IDEA_ANALYZER = 'IDEA_ANALYZER',
  BRANDING = 'BRANDING',
  WEBSITE_BUILDER = 'WEBSITE_BUILDER',
  STRATEGY = 'STRATEGY',
  SIMULATION = 'SIMULATION',
  PITCH_DECK = 'PITCH_DECK'
}

export interface SimulationMetric {
  label: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}