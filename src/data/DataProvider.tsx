import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { DealRecord, Buyer } from './types';
import { records as demoRecords } from './records';
import { buyers as demoBuyers } from './buyers';

interface DataContextValue {
  records: DealRecord[];
  buyers: Buyer[];
  isLive: boolean;
  loading: boolean;
  latestVerifiedDate: string | null;
}

const DataContext = createContext<DataContextValue>({
  records: demoRecords,
  buyers: demoBuyers,
  isLive: false,
  loading: true,
  latestVerifiedDate: null,
});

export function useData() {
  return useContext(DataContext);
}

function mapDbRecordToLocal(row: Record<string, unknown>): DealRecord {
  return {
    id: row.id as string,
    date: row.date as string,
    buyer: row.buyer as string,
    buyerId: row.buyer_id as string,
    headline: row.headline as string,
    recordType: row.record_type as DealRecord['recordType'],
    eventClass: row.event_class as DealRecord['eventClass'],
    format: row.format as DealRecord['format'],
    territory: row.territory as DealRecord['territory'],
    evidenceTier: row.evidence_tier as DealRecord['evidenceTier'],
    confidence: row.confidence as DealRecord['confidence'],
    summary: row.summary as string,
    verifiedFacts: (row.verified_facts as string[]) || [],
    interpretation: (row.interpretation as string) || '',
    whyItMatters: (row.why_it_matters as string) || '',
    action: row.action as DealRecord['action'],
    sources: (row.sources as DealRecord['sources']) || [],
    relatedRecordIds: (row.related_record_ids as string[]) || [],
    firstCaptured: (row.first_captured as string) || '',
    lastVerified: (row.last_verified as string) || '',
    locked: (row.locked as boolean) || false,
  };
}

function mapDbBuyerToLocal(row: Record<string, unknown>): Buyer {
  return {
    id: row.id as string,
    name: row.name as string,
    type: row.type as Buyer['type'],
    description: row.description as string,
    primaryFormats: (row.primary_formats as Buyer['primaryFormats']) || [],
    territory: row.territory as Buyer['territory'],
    currentMandate: (row.current_mandate as string) || '',
    mandateConfidence: (row.mandate_confidence as Buyer['mandateConfidence']) || 'low',
    mandateEvidence: (row.mandate_evidence as string[]) || [],
    recentActivity: (row.recent_activity as string) || '',
    activityTimeline: (row.activity_timeline as Buyer['activityTimeline']) || [],
    recordIds: (row.record_ids as string[]) || [],
    contactRoute: (row.contact_route as string) || null,
    openQuestions: (row.open_questions as string[]) || [],
    lastVerified: (row.last_verified as string) || '',
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<DealRecord[]>(demoRecords);
  const [buyers, setBuyers] = useState<Buyer[]>(demoBuyers);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [latestVerifiedDate, setLatestVerifiedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchLiveData() {
      try {
        const [recordsRes, buyersRes] = await Promise.all([
          supabase!.from('records').select('*').order('date', { ascending: false }),
          supabase!.from('buyers').select('*').order('last_verified', { ascending: false }),
        ]);

        if (cancelled) return;

        const liveRecords = recordsRes.data?.map(mapDbRecordToLocal) || [];
        const liveBuyers = buyersRes.data?.map(mapDbBuyerToLocal) || [];

        if (liveRecords.length > 0 && liveBuyers.length > 0) {
          setRecords(liveRecords);
          setBuyers(liveBuyers);
          setIsLive(true);

          const dates = liveRecords
            .map(r => r.lastVerified)
            .filter(Boolean)
            .sort()
            .reverse();
          setLatestVerifiedDate(dates[0] || null);
        }
      } catch {
        // Fallback to demo data silently
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLiveData();
    return () => { cancelled = true; };
  }, []);

  return (
    <DataContext.Provider value={{ records, buyers, isLive, loading, latestVerifiedDate }}>
      {children}
    </DataContext.Provider>
  );
}
