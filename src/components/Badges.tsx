import type { RecordType, RecordClass, StrategicTag, Format, EvidenceTier, Confidence, BuyerType, ActionRouteStatus } from '../data/types';

const recordTypeLabels: Record<RecordType, string> = {
  acquisition: 'Acquisition',
  commission: 'Commission',
  fund_launch: 'Fund Launch',
  partnership: 'Partnership',
  license: 'License',
  development: 'Development',
};

const recordClassLabels: Record<RecordClass, string> = {
  confirmed_deal: 'Confirmed Deal',
  developing_signal: 'Developing Signal',
  context: 'Context',
};

const strategicTagLabels: Record<StrategicTag, string> = {
  legacy_crossover: 'Legacy Crossover',
  vertical: 'Vertical',
  creator_led: 'Creator-led',
  fast: 'FAST',
  brand_funded: 'Brand-funded',
};

const formatLabels: Record<Format, string> = {
  microdrama: 'Microdrama',
  short_form: 'Short Form',
  feature: 'Feature',
  series: 'Series',
  unscripted: 'Unscripted',
  branded: 'Branded',
  fast_channel: 'FAST Channel',
  interactive: 'Interactive',
};

const buyerTypeLabels: Record<BuyerType, string> = {
  microdrama_platform: 'Microdrama Platform',
  creator_studio: 'Creator Studio',
  brand_funded: 'Brand-Funded',
  fast_channel: 'FAST Channel',
  digital_platform: 'Digital Platform',
  legacy_studio: 'Legacy Studio',
  streamer: 'Streamer',
  financier: 'Financier',
};

const evidenceTierLabels: Record<EvidenceTier, string> = {
  tier_1: 'Tier 1',
  tier_2: 'Tier 2',
  tier_3: 'Tier 3',
  tier_4: 'Tier 4',
};

const confidenceLabels: Record<Confidence, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const actionRouteLabels: Record<ActionRouteStatus, string> = {
  not_researched: 'Not researched',
  underway: 'Research underway',
  verified: 'Verified route',
  likely: 'Likely route',
  researched_none: 'No public route identified',
};

export function RecordTypeBadge({ type }: { type: RecordType }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-ink-50 text-ink-700 border border-ink-200">
      {recordTypeLabels[type]}
    </span>
  );
}

export function RecordClassBadge({ recordClass }: { recordClass: RecordClass }) {
  const styles: Record<RecordClass, string> = {
    confirmed_deal: 'bg-forest-50 text-forest-800 border-forest-200',
    developing_signal: 'bg-amber-50 text-amber-800 border-amber-200',
    context: 'bg-ink-50 text-ink-600 border-ink-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${styles[recordClass]}`}>
      {recordClassLabels[recordClass]}
    </span>
  );
}

export function StrategicTagBadge({ tag }: { tag: StrategicTag }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-burgundy-50 text-burgundy-800 border border-burgundy-100">
      {strategicTagLabels[tag]}
    </span>
  );
}

export function FormatBadge({ format }: { format: Format }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-cream-200 text-ink-600 border border-ink-100">
      {formatLabels[format]}
    </span>
  );
}

export function BuyerTypeBadge({ type }: { type: BuyerType }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-ink-50 text-ink-600 border border-ink-200">
      {buyerTypeLabels[type]}
    </span>
  );
}

export function EvidenceBadge({ tier }: { tier: EvidenceTier }) {
  const styles: Record<EvidenceTier, string> = {
    tier_1: 'bg-forest-50 text-forest-800 border-forest-200',
    tier_2: 'bg-amber-50 text-amber-800 border-amber-200',
    tier_3: 'bg-ink-50 text-ink-600 border-ink-200',
    tier_4: 'bg-ink-50 text-ink-400 border-ink-100',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${styles[tier]}`}>
      {evidenceTierLabels[tier]}
    </span>
  );
}

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const styles: Record<Confidence, string> = {
    high: 'bg-forest-50 text-forest-800 border-forest-200',
    medium: 'bg-amber-50 text-amber-800 border-amber-200',
    low: 'bg-ink-50 text-ink-500 border-ink-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${styles[confidence]}`}>
      {confidenceLabels[confidence]} confidence
    </span>
  );
}

export function ActionRouteBadge({ status }: { status: ActionRouteStatus }) {
  const styles: Record<ActionRouteStatus, string> = {
    not_researched: 'bg-ink-50 text-ink-500 border-ink-200',
    underway: 'bg-blue-50 text-blue-800 border-blue-200',
    verified: 'bg-forest-50 text-forest-800 border-forest-200',
    likely: 'bg-amber-50 text-amber-800 border-amber-200',
    researched_none: 'bg-ink-50 text-ink-500 border-ink-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${styles[status]}`}>
      {actionRouteLabels[status]}
    </span>
  );
}

export { recordTypeLabels, recordClassLabels, strategicTagLabels, formatLabels, buyerTypeLabels, evidenceTierLabels, confidenceLabels, actionRouteLabels };
