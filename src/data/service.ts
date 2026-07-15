import type { DealRecord, Buyer, BriefingIssue } from './types';
import { records } from './records';
import { buyers } from './buyers';
import { latestIssue } from './briefing';

export function getPublishedRecords(): DealRecord[] {
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRecordById(id: string): DealRecord | undefined {
  return records.find(r => r.id === id);
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
