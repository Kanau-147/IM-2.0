export interface TimelineSnapshot {
  year: number;
  date: string;
  title: string;
  snippet: string;
  waybackUrl: string;
  keyChange: string;
}

export interface Milestone {
  year: string;
  event: string;
  impact: string;
}

export interface SemanticDrift {
  peakEraValueProp: string;
  currentStatusProp: string;
  discrepancyNote: string;
}

export interface AIAnalysis {
  executiveSummary: string;
  historicalSignificance: string;
  whatHappenedAutopsy: string;
  fateCategory: 'Acquired & Sunset' | 'Defunct / Inactive' | 'Domain Squatted / Parked' | 'Radical Pivot' | 'Operational Evolution';
  keyMilestones: Milestone[];
  semanticDrift: SemanticDrift;
  preservationRisk: 'Low' | 'Moderate' | 'Critical' | 'Lost';
  evidenceTakeaways: string[];
}

export interface InvestigationReport {
  id: string;
  url: string;
  domain: string;
  title: string;
  investigatedAt: string;
  status: 'Active' | 'Defunct' | 'Redirected' | 'Parked' | 'Rebranded';
  httpStatus: number;
  redirectTarget?: string;
  redirectChain: { from: string; to: string; code: number }[];
  firstCaptured: string;
  lastCaptured: string;
  totalCaptures: number;
  timelineSnapshots: TimelineSnapshot[];
  currentLive: {
    available: boolean;
    title: string;
    finalUrl: string;
    contentSample: string;
  };
  aiAnalysis: AIAnalysis;
  evidenceTags: string[];
}

export interface DatasetItem {
  id: string;
  url: string;
  name: string;
  yearFounded?: number | string;
  yearSunset?: number | string;
  category: string;
  fate?: string;
  notes?: string;
  investigationId?: string;
}
