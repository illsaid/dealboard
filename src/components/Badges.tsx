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

const confidenceText: Record<Confidence, string> = {
  high: 'text-forest-700',
  medium: 'text-amber-700',
  low: 'text-ink-500',
};

const actionRouteText: Record<ActionRouteStatus, string> = {
  not_researched: 'text-ink-500',
  underway: 'text-ink-700',
  verified: 'text-forest-700',
  likely: 'text-amber-700',
  researched_none: 'text-ink-500',
};

const recordClassText: Record<RecordClass, string> = {
  confirmed_deal: 'text-forest-700',
  developing_signal: 'text-amber-700',
  context: 'text-ink-500',
};

// Plain-text kicker for record class.
export function RecordClassBadge({ recordClass }: { recordClass: RecordClass }) {
  return (
    <span className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${recordClassText[recordClass]}`}>
      {recordClassLabels[recordClass]}
    </span>
  );
}

// Muted tag runs — inline plain text, no chips.
export function RecordTypeBadge({ type }: { type: RecordType }) {
  return <span className="text-xs text-ink-500">{recordTypeLabels[type]}</span>;
}

export function StrategicTagBadge({ tag }: { tag: StrategicTag }) {
  return <span className="text-xs text-ink-500">{strategicTagLabels[tag]}</span>;
}

export function FormatBadge({ format }: { format: Format }) {
  return <span className="text-xs text-ink-500">{formatLabels[format]}</span>;
}

export function BuyerTypeBadge({ type }: { type: BuyerType }) {
  return <span className="text-xs text-ink-500">{buyerTypeLabels[type]}</span>;
}

export function EvidenceBadge({ tier }: { tier: EvidenceTier }) {
  return <span className="text-xs text-ink-500">{evidenceTierLabels[tier]}</span>;
}

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span className={`text-xs font-semibold ${confidenceText[confidence]}`}>
      {confidenceLabels[confidence]} confidence
    </span>
  );
}

// Outlined status label — used only on detail pages where the design calls for it.
export function ActionRouteBadge({ status }: { status: ActionRouteStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold border border-ink-300 ${actionRouteText[status]}`}>
      {actionRouteLabels[status]}
    </span>
  );
}

export {
  recordTypeLabels,
  recordClassLabels,
  strategicTagLabels,
  formatLabels,
  buyerTypeLabels,
  evidenceTierLabels,
  confidenceLabels,
  actionRouteLabels,
};
