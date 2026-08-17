import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { DealRecord, Buyer, BriefingIssue } from './types';
import { records as demoRecords } from './records';
import { buyers as demoBuyers } from './buyers';
import { latestIssue as demoBriefing } from './briefing';

interface DataContextValue {
  records: DealRecord[];
  buyers: Buyer[];
  briefing: BriefingIssue;
  isLive: boolean;
  loading: boolean;
  latestVerifiedDate: string | null;
}

const DataContext = createContext<DataContextValue>({
  records: demoRecords,
  buyers: demoBuyers,
  briefing: demoBriefing,
  isLive: false,
  loading: true,
  latestVerifiedDate: null,
});

export function useData() {
  return useContext(DataContext);
}

function mapDbRecordToLocal(row: Record<string, unknown>): DealRecord {
  const recordBuyers = (row.record_buyers as { buyer_id: string; is_primary: boolean }[]) || [];
  const secondaryBuyerIds = recordBuyers
    .filter(rb => !rb.is_primary)
    .map(rb => rb.buyer_id);

  return {
    id: row.id as string,
    date: row.date as string,
    buyer: row.buyer as string,
    buyerId: row.buyer_id as string,
    headline: row.headline as string,
    recordType: row.record_type as DealRecord['recordType'],
    recordClass: row.record_class as DealRecord['recordClass'],
    strategicTags: (row.strategic_tags as DealRecord['strategicTags']) || [],
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
    secondaryBuyerIds,
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

function resolveBriefing(
  dbRow: Record<string, unknown>,
  mandates: Record<string, unknown>[],
  quickCuts: Record<string, unknown>[],
  records: DealRecord[],
  buyers: Buyer[],
): BriefingIssue {
  const moneyMoveIds = (dbRow.money_moves as string[]) || [];
  const legacyCrossoverIds = (dbRow.legacy_crossovers as string[]) || [];
  const buyerToWatchId = dbRow.buyer_to_watch as string;

  const resolveRecordMoves = (ids: string[]) =>
    ids
      .map(id => records.find(r => r.id === id))
      .filter((r): r is DealRecord => !!r)
      .map(r => ({
        headline: r.headline,
        move: r.summary,
        read: r.whyItMatters || r.interpretation,
        recordMatch: r.id,
        sources: r.sources.map(s => ({ name: s.name, url: s.url })),
      }));

  const watchBuyer = buyers.find(b => b.id === buyerToWatchId);

  return {
    id: dbRow.id as string,
    date: dbRow.date as string,
    issueLabel: dbRow.issue_label as string,
    coverageWindow: '',
    headline: dbRow.headline as string,
    deck: (dbRow.deck as string) || '',
    readTime: '',
    substackUrl: 'https://thepickupco.substack.com/',
    atAGlance: [],
    signalThisWeek: ((dbRow.signal_this_week as string) || '').split('\n\n').filter(Boolean),
    moneyMoves: resolveRecordMoves(moneyMoveIds),
    legacyCrossovers: resolveRecordMoves(legacyCrossoverIds),
    mandatesForming: mandates.map(m => ({
      buyer: m.signal_type as string,
      confidence: (m.confidence as BriefingIssue['mandatesForming'][0]['confidence']),
      signal: m.explanation as string,
      whyItMatters: (m.why_it_matters as string) || '',
      evidence: (m.evidence_url as string)
        ? [{ name: 'Source', url: m.evidence_url as string }]
        : [],
    })),
    buyerToWatch: watchBuyer
      ? {
          name: watchBuyer.name,
          buyerMatch: watchBuyer.id,
          apparentMandate: watchBuyer.currentMandate,
          route: watchBuyer.contactRoute || 'No confirmed public route.',
          namedExecutive: '',
          unknown: watchBuyer.openQuestions.join(' '),
        }
      : demoBriefing.buyerToWatch,
    quickCuts: quickCuts.map(qc => ({
      headline: qc.headline as string,
      summary: (qc.summary as string) || '',
      sourceName: 'Source',
      sourceUrl: (qc.source_url as string) || '',
    })),
  };
}

interface DataProviderProps {
  children: ReactNode;
  initialRecords?: DealRecord[];
  initialBuyers?: Buyer[];
  initialBriefing?: BriefingIssue;
}

export function DataProvider({ children, initialRecords, initialBuyers, initialBriefing }: DataProviderProps) {
  const [records, setRecords] = useState<DealRecord[]>(initialRecords || demoRecords);
  const [buyers, setBuyers] = useState<Buyer[]>(initialBuyers || demoBuyers);
  const [briefing, setBriefing] = useState<BriefingIssue>(initialBriefing || demoBriefing);
  const [isLive, setIsLive] = useState(!!initialRecords);
  const [loading, setLoading] = useState(!initialRecords);
  const [latestVerifiedDate, setLatestVerifiedDate] = useState<string | null>(() => {
    if (initialRecords) {
      const dates = initialRecords.map(r => r.lastVerified).filter(Boolean).sort().reverse();
      return dates[0] || null;
    }
    return null;
  });

  useEffect(() => {
    if (initialRecords) return;
    if (!supabase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchLiveData() {
      try {
        const [recordsRes, buyersRes] = await Promise.all([
          supabase!.from('records').select('*, record_buyers(buyer_id, is_primary)').eq('is_published', true).order('date', { ascending: false }),
          supabase!.from('buyers').select('*').eq('is_published', true).order('last_verified', { ascending: false }),
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

          // Fetch latest published briefing
          const briefingRes = await supabase!
            .from('briefings')
            .select('*')
            .eq('is_published', true)
            .order('date', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!cancelled && briefingRes.data) {
            const bId = briefingRes.data.id;
            const [mandatesRes, quickCutsRes] = await Promise.all([
              supabase!.from('briefing_mandates').select('*').eq('briefing_id', bId).order('position'),
              supabase!.from('briefing_quick_cuts').select('*').eq('briefing_id', bId).order('position'),
            ]);

            if (!cancelled) {
              const resolved = resolveBriefing(
                briefingRes.data,
                mandatesRes.data || [],
                quickCutsRes.data || [],
                liveRecords,
                liveBuyers,
              );
              setBriefing(resolved);
            }
          }
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
    <DataContext.Provider value={{ records, buyers, briefing, isLive, loading, latestVerifiedDate }}>
      {children}
    </DataContext.Provider>
  );
}
