export type RecordType = 'acquisition' | 'commission' | 'fund_launch' | 'partnership' | 'license' | 'development';
export type RecordClass = 'confirmed_deal' | 'developing_signal' | 'context';
export type StrategicTag = 'legacy_crossover' | 'vertical' | 'creator_led' | 'fast' | 'brand_funded';
export type Format = 'microdrama' | 'short_form' | 'feature' | 'series' | 'unscripted' | 'branded' | 'fast_channel' | 'interactive';
export type Territory = 'global' | 'north_america' | 'europe' | 'asia_pacific' | 'latin_america' | 'middle_east';
export type EvidenceTier = 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4';
export type Confidence = 'high' | 'medium' | 'low';
export type BuyerType = 'microdrama_platform' | 'creator_studio' | 'brand_funded' | 'fast_channel' | 'digital_platform' | 'legacy_studio' | 'streamer' | 'financier';

export type ActionRouteStatus = 'not_researched' | 'underway' | 'verified' | 'likely' | 'researched_none';

export interface ProfessionalAction {
  status: ActionRouteStatus;
  label: string;
  description: string;
  url?: string;
  evidence?: string;
}

export interface DealRecord {
  id: string;
  date: string;
  buyer: string;
  buyerId: string;
  headline: string;
  recordType: RecordType;
  recordClass: RecordClass;
  strategicTags?: StrategicTag[];
  format: Format;
  territory: Territory;
  evidenceTier: EvidenceTier;
  confidence: Confidence;
  summary: string;
  verifiedFacts: string[];
  interpretation: string;
  whyItMatters: string;
  action: ProfessionalAction;
  sources: { name: string; url: string; readTime: string }[];
  relatedRecordIds: string[];
  secondaryBuyerIds: string[];
  firstCaptured: string;
  lastVerified: string;
  locked?: boolean;
}

export interface Buyer {
  id: string;
  name: string;
  type: BuyerType;
  description: string;
  primaryFormats: Format[];
  territory: Territory;
  currentMandate: string;
  mandateConfidence: Confidence;
  mandateEvidence: string[];
  recentActivity: string;
  activityTimeline: { date: string; event: string }[];
  recordIds: string[];
  contactRoute: string | null;
  openQuestions: string[];
  lastVerified: string;
}

export interface BriefingIssue {
  id: string;
  date: string;
  issueLabel: string;
  coverageWindow: string;
  headline: string;
  deck: string;
  readTime: string;
  substackUrl: string;
  atAGlance: string[];
  signalThisWeek: string[];
  moneyMoves: {
    headline: string;
    move: string;
    read: string;
    recordMatch?: string;
    action?: { label: string; description: string; url: string };
    sources: { name: string; url: string }[];
  }[];
  mandatesForming: {
    buyer: string;
    confidence: Confidence;
    signal: string;
    whyItMatters: string;
    evidence: { name: string; url: string }[];
  }[];
  buyerToWatch: {
    name: string;
    buyerMatch: string;
    apparentMandate: string;
    route: string;
    namedExecutive: string;
    unknown: string;
  };
  quickCuts: { headline: string; summary: string; sourceName: string; sourceUrl: string }[];
}
