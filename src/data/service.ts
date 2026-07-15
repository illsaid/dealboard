import type { DealRecord, Buyer, BriefingIssue, Territory } from './types';
import { records } from './records';
import { buyers } from './buyers';
import { latestIssue } from './briefing';

export function getPublishedRecords(): DealRecord[] {
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRecordById(id: string): DealRecord | undefined {
  return records.find(r => r.id === id);
}

export function getAccessibleRecordById(id: string): DealRecord | undefined {
  const record = records.find(r => r.id === id);
  if (record?.locked) return undefined;
  return record;
}

export function isRecordLocked(id: string): boolean {
  const record = records.find(r => r.id === id);
  return record?.locked === true;
}

export function getBuyers(): Buyer[] {
  return buyers.sort((a, b) => new Date(b.lastVerified).getTime() - new Date(a.lastVerified).getTime());
}

export function getBuyerById(id: string): Buyer | undefined {
  return buyers.find(b => b.id === id);
}

export function getLatestIssue(): BriefingIssue {
  return latestIssue;
}

export function getRecordsForBuyer(buyerId: string): DealRecord[] {
  return records.filter(r => r.buyerId === buyerId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNewThisWeekCount(): number {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return records.filter(r => new Date(r.date) >= oneWeekAgo).length;
}

export function getConfirmedDeals(): DealRecord[] {
  return records
    .filter(r => r.eventClass === 'confirmed_deal')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getDevelopingSignals(): DealRecord[] {
  return records
    .filter(r => r.eventClass === 'developing_signal')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getLegacyCrossovers(): DealRecord[] {
  return records
    .filter(r => r.eventClass === 'legacy_crossover')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getUniqueBuyerNames(): string[] {
  return [...new Set(records.map(r => r.buyer))].sort();
}

export function getUniqueTerritories(): Territory[] {
  return [...new Set(records.map(r => r.territory))].sort() as Territory[];
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || singular + 's');
}
