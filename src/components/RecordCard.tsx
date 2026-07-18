import { Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import type { DealRecord } from '../data/types';
import { RecordTypeBadge, RecordClassBadge, StrategicTagBadge, FormatBadge, ConfidenceBadge, ActionRouteBadge } from './Badges';

export function RecordCard({ record, compact = false }: { record: DealRecord; compact?: boolean }) {
  if (record.locked) {
    return (
      <div className="border border-ink-200 p-4 bg-cream-50 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-cream-100/80 backdrop-blur-[2px] z-10">
          <div className="flex items-center gap-2 text-ink-400">
            <Lock size={16} />
            <span className="text-sm font-medium">Subscriber-only record</span>
          </div>
        </div>
        <div className="opacity-30 select-none" aria-hidden="true">
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
            <RecordTypeBadge type={record.recordType} />
            <RecordClassBadge recordClass={record.recordClass} />
          </div>
          <h3 className="font-semibold text-sm text-ink-900 mb-1">{record.headline}</h3>
          <p className="text-xs text-ink-500">{record.date} &middot; {record.buyer}</p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <Link
        to={`/deals/${record.id}`}
        className="block border border-ink-200 p-4 bg-white hover:bg-cream-50 hover:border-ink-900 transition-colors group"
      >
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2 items-center">
          <RecordClassBadge recordClass={record.recordClass} />
          {(record.strategicTags ?? []).slice(0, 2).map(tag => <StrategicTagBadge key={tag} tag={tag} />)}
          <FormatBadge format={record.format} />
        </div>
        <h3 className="font-bold text-sm text-ink-900 mb-1 leading-snug group-hover:text-inkred transition-colors">{record.headline}</h3>
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <span>{record.buyer}</span>
          <span className="text-ink-300">|</span>
          <span>{record.date}</span>
        </div>
        <p className="mt-2 text-xs text-ink-600 line-clamp-2">{record.whyItMatters}</p>
        <div className="mt-2 flex items-center justify-between">
          {(record.action.status === 'verified' || record.action.status === 'likely') && (
            <ActionRouteBadge status={record.action.status} />
          )}
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-inkred ml-auto">
            View record <ArrowRight size={11} />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="border border-ink-200 p-5 bg-white">
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3 items-center">
        <RecordTypeBadge type={record.recordType} />
        <RecordClassBadge recordClass={record.recordClass} />
        {(record.strategicTags ?? []).map(tag => <StrategicTagBadge key={tag} tag={tag} />)}
        <FormatBadge format={record.format} />
        <ConfidenceBadge confidence={record.confidence} />
      </div>
      <h3 className="font-bold text-ink-900 mb-2 leading-snug">{record.headline}</h3>
      <div className="flex items-center gap-2 text-xs text-ink-500 mb-3">
        <span className="font-medium text-ink-700">{record.buyer}</span>
        <span className="text-ink-300">|</span>
        <span>{record.date}</span>
        <span className="text-ink-300">|</span>
        <span className="capitalize">{record.territory.replace('_', ' ')}</span>
      </div>
      <p className="text-sm text-ink-700 mb-3 leading-relaxed">{record.summary}</p>
      <div className="text-xs text-ink-600 mb-3">
        <span className="font-semibold text-ink-800">Why it matters:</span> {record.whyItMatters}
      </div>
      <div className="flex items-center gap-2 text-xs text-ink-600 mb-4">
        <ActionRouteBadge status={record.action.status} />
        <span>{record.action.label}</span>
      </div>
      <Link
        to={`/deals/${record.id}`}
        className="inline-flex items-center gap-1 text-xs font-semibold text-inkred hover:underline"
      >
        View full record <ArrowRight size={12} />
      </Link>
    </div>
  );
}
