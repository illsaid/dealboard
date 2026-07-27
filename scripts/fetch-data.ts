import { createClient } from '@supabase/supabase-js';
import { records as demoRecords } from '../src/data/records.ts';
import { buyers as demoBuyers } from '../src/data/buyers.ts';

export async function fetchPublishedData() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('[prerender] No Supabase credentials — using demo data');
    return { records: demoRecords, buyers: demoBuyers, source: 'demo' as const };
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
      return { records: demoRecords, buyers: demoBuyers, source: 'demo' as const };
    }

    const records = recordsResult.data.map((row) => ({
      id: row.id,
      date: row.date,
      buyer: row.buyer,
      buyerId: row.buyer_id,
      secondaryBuyerIds: (row.record_buyers ?? [])
        .filter((b) => !b.is_primary && b.buyer_id !== row.buyer_id)
        .map((b) => b.buyer_id),
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

    console.log(`[prerender] Loaded ${records.length} records, ${buyers.length} buyers from Supabase`);
    return { records, buyers, source: 'supabase' as const };
  } catch (error) {
    console.warn('[prerender] Supabase fetch failed — using demo data:', error);
    return { records: demoRecords, buyers: demoBuyers, source: 'demo' as const };
  }
}
