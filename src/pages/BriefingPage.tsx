import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, AlertCircle, Eye } from 'lucide-react';
import { getLatestIssue } from '../data/service';
import { RecordClassBadge, ConfidenceBadge, FormatBadge, ActionRouteBadge } from '../components/Badges';
import { EmailCapture } from '../components/EmailCapture';
import { PrototypeNotice } from '../components/PrototypeNotice';
import type { Confidence, DealRecord } from '../data/types';
import { records as demoRecords } from '../data/records';
import { buyers as demoBuyers } from '../data/buyers';

export function BriefingPage() {
  const issue = getLatestIssue();

  const moneyMoveRecords = issue.moneyMoves
    .map(id => demoRecords.find(r => r.id === id))
    .filter((r): r is DealRecord => !!r && r.recordClass === 'confirmed_deal')
    .slice(0, 3);

  const legacyCrossoverRecords = issue.legacyCrossovers
    .map(id => demoRecords.find(r => r.id === id))
    .filter((r): r is DealRecord => !!r && !!r.strategicTags?.includes('legacy_crossover'))
    .slice(0, 1);

  const buyerToWatch = demoBuyers.find(b => b.id === issue.buyerToWatch);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <PrototypeNotice always />

      <header className="mt-6 mb-8 border-b border-ink-900 pb-4">
        <p className="kicker mb-2">The Brief</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 font-display leading-tight mb-2">
          {issue.headline}
        </h1>
        <p className="text-sm text-ink-600 leading-relaxed">{issue.deck}</p>
      </header>

      <section className="mb-8">
        <SectionHeader icon={<TrendingUp size={14} />} title="The Signal This Week" />
        <p className="text-sm text-ink-700 leading-relaxed mt-3 border-l-2 border-signal pl-3">
          {issue.signalThisWeek}
        </p>
      </section>

      <section className="mb-8">
        <SectionHeader icon={<ArrowRight size={14} />} title="Money Moves" />
        <div className="mt-3 divide-y divide-ink-100 border-t border-b border-ink-200">
          {moneyMoveRecords.map(record => (
            <MoneyMoveBlock key={record.id} record={record} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionHeader icon={<AlertCircle size={14} />} title="Mandates Forming" />
        <p className="text-xs text-ink-400 mt-1 mb-3">Signals, not confirmed deals.</p>
        <div className="space-y-2">
          {issue.mandatesForming.slice(0, 3).map((mandate, i) => (
            <MandateBlock key={i} mandate={mandate} />
          ))}
        </div>
      </section>

      {legacyCrossoverRecords.length > 0 && (
        <section className="mb-8">
          <SectionHeader icon={<ArrowRight size={14} />} title="Legacy Crossovers" />
          <div className="mt-3 border-t border-b border-ink-200 divide-y divide-ink-100">
            {legacyCrossoverRecords.map(record => (
              <div key={record.id} className="py-3">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <RecordClassBadge recordClass={record.recordClass} />
                  <ConfidenceBadge confidence={record.confidence} />
                </div>
                <h3 className="font-semibold text-sm text-ink-900 leading-snug">{record.headline}</h3>
                <p className="text-sm text-ink-600 leading-relaxed mt-1">{record.summary}</p>
                <Link to={`/deals/${record.id}`} className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-inkred hover:underline">
                  View record <ArrowRight size={11} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {buyerToWatch && (
        <section className="mb-8">
          <SectionHeader icon={<Eye size={14} />} title="Buyer to Watch" />
          <div className="mt-3 py-3 border-t border-ink-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-ink-900">{buyerToWatch.name}</h3>
                <p className="text-xs text-ink-500 capitalize">{buyerToWatch.type.replace(/_/g, ' ')}</p>
              </div>
              <ConfidenceBadge confidence={buyerToWatch.mandateConfidence} />
            </div>
            <p className="text-sm text-ink-600 mt-2 leading-relaxed">{buyerToWatch.currentMandate}</p>
            <Link to={`/buyers/${buyerToWatch.id}`} className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-inkred hover:underline">
              View buyer profile <ArrowRight size={11} />
            </Link>
          </div>
        </section>
      )}

      <section className="mb-8">
        <SectionHeader icon={<ArrowRight size={14} />} title="Quick Cuts" />
        <div className="mt-3 divide-y divide-ink-100 border-t border-b border-ink-200">
          {issue.quickCuts.slice(0, 5).map((item, i) => (
            <div key={i} className="py-2.5 flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-ink-900">{item.headline}</h4>
                <p className="text-xs text-ink-600 mt-0.5">{item.summary}</p>
              </div>
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs text-ink-400 hover:text-inkred underline">
                Source
              </a>
            </div>
          ))}
        </div>
      </section>

      <EmailCapture />
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-1.5 border-b border-ink-900">
      <span className="text-inkred">{icon}</span>
      <h2 className="text-xs font-bold text-ink-900 uppercase tracking-[0.14em]">{title}</h2>
    </div>
  );
}

function MoneyMoveBlock({ record }: { record: DealRecord }) {
  return (
    <article className="py-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
        <FormatBadge format={record.format} />
        <ActionRouteBadge status={record.action.status} />
      </div>
      <h3 className="font-bold text-sm text-ink-900 leading-snug mb-1.5">{record.headline}</h3>
      <p className="text-sm text-ink-700 leading-relaxed mb-2">{record.summary}</p>
      <p className="text-xs text-ink-600 mb-1.5">
        <span className="font-semibold text-ink-800">Take:</span> {record.interpretation}
      </p>
      <p className="text-xs text-ink-600 mb-2">
        <span className="font-semibold text-ink-800">Action:</span> {record.action.label}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {record.sources.map((source, i) => (
            <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-ink-500 hover:text-inkred underline">
              {source.name} ({source.readTime})
            </a>
          ))}
        </div>
        <Link to={`/deals/${record.id}`} className="text-xs font-semibold text-inkred hover:underline">
          Full record
        </Link>
      </div>
    </article>
  );
}

function MandateBlock({ mandate }: { mandate: { signalType: string; confidence: Confidence; explanation: string; whyItMatters: string; evidenceUrl: string } }) {
  const borderColor: Record<Confidence, string> = {
    high: 'border-l-forest-600',
    medium: 'border-l-amber-600',
    low: 'border-l-ink-300',
  };

  return (
    <div className={`border-l-2 ${borderColor[mandate.confidence]} pl-3 py-2`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-ink-700">{mandate.signalType}</span>
        <ConfidenceBadge confidence={mandate.confidence} />
      </div>
      <p className="text-sm text-ink-700 leading-relaxed">{mandate.explanation}</p>
      <p className="text-xs text-ink-500 mt-1">{mandate.whyItMatters}</p>
      <a href={mandate.evidenceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-ink-400 hover:text-inkred underline mt-0.5 inline-block">
        Evidence
      </a>
    </div>
  );
}
