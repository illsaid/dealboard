export type RecordType = 'acquisition' | 'commission' | 'fund_launch' | 'partnership' | 'license' | 'development';
export type EventClass = 'confirmed_deal' | 'developing_signal' | 'legacy_crossover';
export type Format = 'microdrama' | 'short_form' | 'feature' | 'series' | 'unscripted' | 'branded' | 'fast_channel' | 'interactive';
export type Territory = 'global' | 'north_america' | 'europe' | 'asia_pacific' | 'latin_america' | 'middle_east';
export type EvidenceTier = 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4';
export type Confidence = 'high' | 'medium' | 'low';
export type BuyerType = 'microdrama_platform' | 'creator_studio' | 'brand_funded' | 'fast_channel' | 'digital_platform' | 'legacy_studio' | 'streamer' | 'financier';

export type ActionRouteStatus = 'verified' | 'likely' | 'none';

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
  eventClass: EventClass;
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
  headline: string;
  deck: string;
  signalThisWeek: string;
  moneyMoves: string[];
  mandatesForming: {
    signalType: string;
    confidence: Confidence;
    explanation: string;
    whyItMatters: string;
    evidenceUrl: string;
  }[];
  legacyCrossovers: string[];
  buyerToWatch: string;
  quickCuts: { headline: string; summary: string; sourceUrl: string }[];
}
