import type {
  ActionRouteStatus,
  BriefingIssue,
  Buyer,
  BuyerType,
  Confidence,
  DealRecord,
  EvidenceTier,
  EventClass,
  Format,
  ProfessionalAction,
  RecordType,
  Territory,
} from './types';
import { records as demonstrationRecords } from './records';
import { buyers as demonstrationBuyers } from './buyers';
import { latestIssue } from './briefing';
import { supabase } from './supabase';

type DatabaseRecordRow = {
  id: string;
  date: string;
  buyer: string;
  buyer_id: string;
  record_buyers: Array<{ buyer_id: string; is_primary: boolean }> | null;
  headline: string;
  record_type: string;
  event_class: string;
  format: string;
  territory: string;
  evidence_tier: string;
  confidence: string;
  summary: string;
  verified_facts: string[] | null;
  interpretation: string | null;
  why_it_matters: string | null;
  action: ProfessionalAction | null;
  sources: DealRecord['sources'] | null;
  related_record_ids: string[] | null;
  first_captured: string;
  last_verified: string;
  locked: boolean;
};

type DatabaseBuyerRow = {
  id: string;
  name: string;
  type: string;
  description: string;
  primary_formats: string[] | null;
  territory: string;
  current_mandate: string;
  mandate_confidence: string;
  mandate_evidence: string[] | null;
  recent_activity: string | null;
  activity_timeline: Buyer['activityTimeline'] | null;
  contact_route: string | null;
  contact_route_url: string | null;
  open_questions: string[] | null;
  last_verified: string;
};

let publishedRecords: DealRecord[] | null = null;
let publishedBuyers: Buyer[] | null = null;
let dataMode: 'demonstration' | 'published' = 'demonstration';

function mapRecord(row: DatabaseRecordRow): DealRecord {
  const action = row.action ?? {
    status: 'none' as ActionRouteStatus,
    label: 'No confirmed route',
    description: '',
  };

  return {
    id: row.id,
    date: row.date,
    buyer: row.buyer,
    buyerId: row.buyer_id,
    secondaryBuyerIds: (row.record_buyers ?? [])
      .filter((buyer) => !buyer.is_primary && buyer.buyer_id !== row.buyer_id)
      .map((buyer) => buyer.buyer_id),
    headline: row.headline,
    recordType: row.record_type as RecordType,
    eventClass: row.event_class as EventClass,
    format: row.format as Format,
    territory: row.territory as Territory,
    evidenceTier: row.evidence_tier as EvidenceTier,
    confidence: row.confidence as Confidence,
    summary: row.summary,
    verifiedFacts: row.verified_facts ?? [],
    interpretation: row.interpretation ?? '',
    whyItMatters: row.why_it_matters ?? '',
    action,
    sources: row.sources ?? [],
    relatedRecordIds: row.related_record_ids ?? [],
    firstCaptured: row.first_captured,
    lastVerified: row.last_verified,
    locked: row.locked,
  };
}

function mapBuyer(row: DatabaseBuyerRow, liveRecords: DealRecord[]): Buyer {
  const recordIds = liveRecords
    .filter((record) =>
      record.buyerId === row.id || record.secondaryBuyerIds.includes(row.id)
    )
    .map((record) => record.id);

  return {
    id: row.id,
    name: row.name,
    type: row.type as BuyerType,
    description: row.description,
    primaryFormats: (row.primary_formats ?? []) as Format[],
    territory: row.territory as Territory,
    currentMandate: row.current_mandate,
    mandateConfidence: row.mandate_confidence as Confidence,
    mandateEvidence: row.mandate_evidence ?? [],
    recentActivity: row.recent_activity ?? '',
    activityTimeline: row.activity_timeline ?? [],
    recordIds,
    contactRoute: row.contact_route_url ?? row.contact_route,
    openQuestions: row.open_questions ?? [],
    lastVerified: row.last_verified,
  };
}

export async function initializeData() {
  if (!supabase) return 'demonstration' as const;

  try {
    const [recordsResult, buyersResult] = await Promise.all([
      supabase
        .from('records')
        .select('*, record_buyers(buyer_id, is_primary)')
        .eq('is_published', true)
        .order('date', { ascending: false }),
      supabase
        .from('buyers')
        .select('*')
        .eq('is_published', true)
        .order('last_verified', { ascending: false }),
    ]);

    if (recordsResult.error) throw recordsResult.error;
    if (buyersResult.error) throw buyersResult.error;

    const liveRecords = (recordsResult.data as DatabaseRecordRow[]).map(mapRecord);
    const liveBuyers = (buyersResult.data as DatabaseBuyerRow[])
      .map((buyer) => mapBuyer(buyer, liveRecords));

    // An empty publication database is expected until the first Airtable row
    // passes Website Ready. Keep the clearly labeled demonstration catalog in
    // place instead of rendering a broken or empty product.
    if (liveRecords.length === 0 || liveBuyers.length === 0) {
      dataMode = 'demonstration';
      return 'demonstration' as const;
    }

    publishedRecords = liveRecords;
    publishedBuyers = liveBuyers;
    dataMode = 'published';
    return 'published' as const;
  } catch (error) {
    dataMode = 'demonstration';
    console.warn('Unable to load published Supabase data; using demonstration data.', error);
    return 'demonstration' as const;
  }
}

export function getDataMode() {
  return dataMode;
}

export function getCatalogUpdatedDate() {
  const timestamps = currentRecords()
    .map((record) => Date.parse(record.lastVerified))
    .filter(Number.isFinite);

  return timestamps.length > 0
    ? new Date(Math.max(...timestamps)).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not yet published';
}

function currentRecords() {
  return publishedRecords ?? demonstrationRecords;
}

function currentBuyers() {
  return publishedBuyers ?? demonstrationBuyers;
}

export function getPublishedRecords(): DealRecord[] {
  return [...currentRecords()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRecordById(id: string): DealRecord | undefined {
  return currentRecords().find((record) => record.id === id)
    ?? demonstrationRecords.find((record) => record.id === id);
}

export function getAccessibleRecordById(id: string): DealRecord | undefined {
  const record = getRecordById(id);
  if (record?.locked) return undefined;
  return record;
}

export function isRecordLocked(id: string): boolean {
  return getRecordById(id)?.locked === true;
}

export function getBuyers(): Buyer[] {
  return [...currentBuyers()].sort((a, b) => new Date(b.lastVerified).getTime() - new Date(a.lastVerified).getTime());
}

export function getBuyerById(id: string): Buyer | undefined {
  return currentBuyers().find((buyer) => buyer.id === id)
    ?? demonstrationBuyers.find((buyer) => buyer.id === id);
}

export function getLatestIssue(): BriefingIssue {
  return latestIssue;
}

export function getRecordsForBuyer(buyerId: string): DealRecord[] {
  return currentRecords()
    .filter((record) =>
      record.buyerId === buyerId || record.secondaryBuyerIds.includes(buyerId)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNewThisWeekCount(): number {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return currentRecords().filter((record) => new Date(record.date) >= oneWeekAgo).length;
}

export function getConfirmedDeals(): DealRecord[] {
  return currentRecords()
    .filter((record) => record.eventClass === 'confirmed_deal')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getDevelopingSignals(): DealRecord[] {
  return currentRecords()
    .filter((record) => record.eventClass === 'developing_signal')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getLegacyCrossovers(): DealRecord[] {
  return currentRecords()
    .filter((record) => record.eventClass === 'legacy_crossover')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getUniqueBuyerNames(): string[] {
  return [...new Set(currentRecords().map((record) => record.buyer))].sort();
}

export function getUniqueTerritories(): Territory[] {
  return [...new Set(currentRecords().map((record) => record.territory))].sort() as Territory[];
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || singular + 's');
}
