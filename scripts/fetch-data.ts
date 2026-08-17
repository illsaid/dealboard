import { createClient } from '@supabase/supabase-js';
import { records as demoRecords } from '../src/data/records.ts';
import { buyers as demoBuyers } from '../src/data/buyers.ts';
import { latestIssue as demoBriefing } from '../src/data/briefing.ts';
import type { BriefingIssue } from '../src/data/types.ts';

export async function fetchPublishedData() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('[prerender] No Supabase credentials — using demo data');
    return { records: demoRecords, buyers: demoBuyers, briefing: demoBriefing, source: 'demo' as const };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

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

    if (!recordsResult.data?.length || !buyersResult.data?.length) {
      console.log('[prerender] Supabase returned empty published data — using demo data');
      return { records: demoRecords, buyers: demoBuyers, briefing: demoBriefing, source: 'demo' as const };
    }

    const records = recordsResult.data.map((row) => ({
      id: row.id,
      date: row.date,
      buyer: row.buyer,
      buyerId: row.buyer_id,
      secondaryBuyerIds: (row.record_buyers ?? [])
        .filter((b: { is_primary: boolean; buyer_id: string }) => !b.is_primary && b.buyer_id !== row.buyer_id)
        .map((b: { buyer_id: string }) => b.buyer_id),
      headline: row.headline,
      recordType: row.record_type,
      recordClass: row.record_class,
      strategicTags: row.strategic_tags ?? [],
      format: row.format,
      territory: row.territory,
      evidenceTier: row.evidence_tier,
      confidence: row.confidence,
      summary: row.summary,
      verifiedFacts: row.verified_facts ?? [],
      interpretation: row.interpretation ?? '',
      whyItMatters: row.why_it_matters ?? '',
      action: row.action ?? { status: 'not_researched', label: 'Route not researched', description: '' },
      sources: row.sources ?? [],
      relatedRecordIds: row.related_record_ids ?? [],
      firstCaptured: row.first_captured,
      lastVerified: row.last_verified,
      locked: row.locked,
    }));

    const buyers = buyersResult.data.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      description: row.description,
      primaryFormats: row.primary_formats ?? [],
      territory: row.territory,
      currentMandate: row.current_mandate,
      mandateConfidence: row.mandate_confidence,
      mandateEvidence: row.mandate_evidence ?? [],
      recentActivity: row.recent_activity ?? '',
      activityTimeline: row.activity_timeline ?? [],
      recordIds: records.filter(r => r.buyerId === row.id || r.secondaryBuyerIds.includes(row.id)).map(r => r.id),
      contactRoute: row.contact_route_url ?? row.contact_route,
      openQuestions: row.open_questions ?? [],
      lastVerified: row.last_verified,
    }));

    // Fetch latest published briefing
    let briefing: BriefingIssue = demoBriefing;
    const briefingRes = await supabase
      .from('briefings')
      .select('*')
      .eq('is_published', true)
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (briefingRes.data) {
      const b = briefingRes.data;
      const [mandatesRes, quickCutsRes] = await Promise.all([
        supabase.from('briefing_mandates').select('*').eq('briefing_id', b.id).order('position'),
        supabase.from('briefing_quick_cuts').select('*').eq('briefing_id', b.id).order('position'),
      ]);

      const moneyMoveIds: string[] = b.money_moves || [];
      const legacyCrossoverIds: string[] = b.legacy_crossovers || [];
      const resolveRecords = (ids: string[]) =>
        ids.map(id => records.find(r => r.id === id)).filter(Boolean).map(r => ({
          headline: r!.headline,
          move: r!.summary,
          read: r!.whyItMatters || r!.interpretation,
          recordMatch: r!.id,
          sources: (r!.sources || []).map((s: { name: string; url: string }) => ({ name: s.name, url: s.url })),
        }));

      const watchBuyer = buyers.find(bu => bu.id === b.buyer_to_watch);

      briefing = {
        id: b.id,
        date: b.date,
        issueLabel: b.issue_label,
        coverageWindow: '',
        headline: b.headline,
        deck: b.deck || '',
        readTime: '',
        substackUrl: 'https://thepickupco.substack.com/',
        atAGlance: [],
        signalThisWeek: (b.signal_this_week || '').split('\n\n').filter(Boolean),
        moneyMoves: resolveRecords(moneyMoveIds),
        legacyCrossovers: resolveRecords(legacyCrossoverIds),
        mandatesForming: (mandatesRes.data || []).map((m: Record<string, unknown>) => ({
          buyer: m.signal_type as string,
          confidence: m.confidence as 'high' | 'medium' | 'low',
          signal: m.explanation as string,
          whyItMatters: (m.why_it_matters as string) || '',
          evidence: (m.evidence_url as string) ? [{ name: 'Source', url: m.evidence_url as string }] : [],
        })),
        buyerToWatch: watchBuyer
          ? {
              name: watchBuyer.name,
              buyerMatch: watchBuyer.id,
              apparentMandate: watchBuyer.currentMandate,
              route: watchBuyer.contactRoute || 'No confirmed public route.',
              namedExecutive: '',
              unknown: (watchBuyer.openQuestions || []).join(' '),
            }
          : demoBriefing.buyerToWatch,
        quickCuts: (quickCutsRes.data || []).map((qc: Record<string, unknown>) => ({
          headline: qc.headline as string,
          summary: (qc.summary as string) || '',
          sourceName: 'Source',
          sourceUrl: (qc.source_url as string) || '',
        })),
      };
      console.log(`[prerender] Loaded published briefing: ${briefing.id}`);
    }

    console.log(`[prerender] Loaded ${records.length} records, ${buyers.length} buyers from Supabase`);
    return { records, buyers, briefing, source: 'supabase' as const };
  } catch (error) {
    console.warn('[prerender] Supabase fetch failed — using demo data:', error);
    return { records: demoRecords, buyers: demoBuyers, briefing: demoBriefing, source: 'demo' as const };
  }
}
