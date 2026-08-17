import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from './supabase';
import type { DealRecord, Buyer, BriefingIssue } from './types';
import { records as demoRecords } from './records';
import { buyers as demoBuyers } from './buyers';
import { latestIssue as demoBriefing } from './briefing';
import {
  getPublishedRecords,
  getBuyers,
  getDataMode,
  getCatalogUpdatedDate,
} from './service';

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
  const serviceMode = getDataMode();
  const serviceRecords = serviceMode === 'published' ? getPublishedRecords() : null;
  const serviceBuyers = serviceMode === 'published' ? getBuyers() : null;

  const records = initialRecords || serviceRecords || demoRecords;
  const buyers = initialBuyers || serviceBuyers || demoBuyers;
  const [briefing, setBriefing] = useState<BriefingIssue>(initialBriefing || demoBriefing);
  const isLive = !!initialRecords || serviceMode === 'published';
  const loading = false;
  const latestVerifiedDate = (() => {
    const source = initialRecords || serviceRecords;
    if (source) {
      const dates = source.map(r => r.lastVerified).filter(Boolean).sort().reverse();
      return dates[0] || null;
    }
    return serviceMode === 'published' ? getCatalogUpdatedDate() : null;
  })();

  // Fetch the briefing from Supabase (records/buyers are already loaded by service.ts)
  useEffect(() => {
    if (initialBriefing) return;
    if (!supabase || serviceMode !== 'published') return;

    let cancelled = false;

    async function fetchBriefing() {
      try {
        const briefingRes = await supabase!
          .from('briefings')
          .select('*')
          .eq('is_published', true)
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (cancelled || !briefingRes.data) return;

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
            records,
            buyers,
          );
          setBriefing(resolved);
        }
      } catch (err) {
        console.warn('DataProvider: briefing fetch failed.', err);
      }
    }

    fetchBriefing();
    return () => { cancelled = true; };
  }, []);

  return (
    <DataContext.Provider value={{ records, buyers, briefing, isLive, loading, latestVerifiedDate }}>
      {children}
    </DataContext.Provider>
  );
}
