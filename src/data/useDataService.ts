import { useData } from './DataProvider';
import type { DealRecord, Buyer, Territory } from './types';

export function useRecords() {
  const { records } = useData();
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function useRecordById(id: string): DealRecord | undefined {
  const { records } = useData();
  return records.find(r => r.id === id);
}

export function useAccessibleRecordById(id: string): { record: DealRecord | undefined; isLocked: boolean } {
  const { records } = useData();
  const record = records.find(r => r.id === id);
  if (record?.locked) return { record: undefined, isLocked: true };
  return { record, isLocked: false };
}

export function useBuyers(): Buyer[] {
  const { buyers } = useData();
  return buyers.sort((a, b) => new Date(b.lastVerified).getTime() - new Date(a.lastVerified).getTime());
}

export function useBuyerById(id: string): Buyer | undefined {
  const { buyers } = useData();
  return buyers.find(b => b.id === id);
}

export function useRecordsForBuyer(buyerId: string): DealRecord[] {
  const { records } = useData();
  return records
    .filter(r => r.buyerId === buyerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function useNewThisWeekCount(): number {
  const { records } = useData();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return records.filter(r => new Date(r.date) >= oneWeekAgo).length;
}

export function useUniqueBuyerNames(): string[] {
  const { records } = useData();
  return [...new Set(records.map(r => r.buyer))].sort();
}

export function useUniqueTerritories(): Territory[] {
  const { records } = useData();
  return [...new Set(records.map(r => r.territory))].sort() as Territory[];
}
