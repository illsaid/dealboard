import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, TrendingUp, AlertCircle, Eye } from 'lucide-react';
import { getLatestIssue, getRecordById, getBuyerById } from '../data/service';
import { RecordTypeBadge, EventClassBadge, FormatBadge, ConfidenceBadge } from '../components/Badges';
import { EmailCapture } from '../components/EmailCapture';
import { PrototypeNotice } from '../components/PrototypeNotice';
import type { Confidence } from '../data/types';

export function BriefingPage() {
  const issue = getLatestIssue();
  const moneyMoveRecords = issue.moneyMoves.map(id => getRecordById(id)).filter(Boolean);
  const legacyCrossoverRecords = issue.legacyCrossovers.map(id => getRecordById(id)).filter(Boolean);
  const buyerToWatch = getBuyerById(issue.buyerToWatch);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <PrototypeNotice />

      {/* Issue Header */}
      <header className="mt-8 mb-10">
        <div className="flex items-center gap-3 text-xs text-ink-500 mb-4">
          <span className="font-semibold text-ink-700">Issue #{issue.issueNumber}</span>
          <span className="text-ink-200">|</span>
          <span>{new Date(issue.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span className="text-ink-200">|</span>
          <span>5-minute briefing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 leading-tight mb-3">
          {issue.headline}
        </h1>
        <p className="text-base text-ink-600 leading-relaxed">
          {issue.deck}
        </p>
      </header>

      {/* The Signal This Week */}
      <section className="mb-10">
        <SectionHeader icon={<TrendingUp size={16} />} title="The Signal This Week" />
        <div className="border-l-2 border-burgundy-300 pl-4 mt-4">
          <p className="text-sm text-ink-700 leading-relaxed">
            {issue.signalThisWeek}
          </p>
        </div>
      </section>

      {/* Money Moves */}
      <section className="mb-10">
        <SectionHeader icon={<ArrowRight size={16} />} title="Money Moves" />
        <div className="mt-4 space-y-6">
          {moneyMoveRecords.map(record => record && (
            <MoneyMoveCard key={record.id} record={record} />
          ))}
        </div>
      </section>

      {/* Mandates Forming */}
      <section className="mb-10">
        <SectionHeader icon={<AlertCircle size={16} />} title="Mandates Forming" />
        <p className="text-xs text-ink-500 mt-1 mb-4">These are signals, not confirmed deals. Confidence levels reflect available evidence.</p>
        <div className="mt-3 space-y-3">
          {issue.mandatesForming.map((mandate, i) => (
            <MandateCard key={i} mandate={mandate} />
          ))}
        </div>
      </section>

      {/* Legacy Crossovers */}
      {legacyCrossoverRecords.length > 0 && (
        <section className="mb-10">
          <SectionHeader icon={<ArrowRight size={16} />} title="Legacy Crossovers" />
          <div className="mt-4 space-y-4">
            {legacyCrossoverRecords.map(record => record && (
              <div key={record.id} className="border border-ink-100 rounded-lg p-4 bg-white">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <EventClassBadge eventClass={record.eventClass} />
                  <FormatBadge format={record.format} />
                  <ConfidenceBadge confidence={record.confidence} />
                </div>
                <h3 className="font-semibold text-sm text-ink-900 mb-1">{record.headline}</h3>
                <p className="text-sm text-ink-600 leading-relaxed mb-2">{record.summary}</p>
                <p className="text-xs text-ink-600"><span className="font-semibold text-ink-800">Interpretation:</span> {record.interpretation}</p>
                <Link to={`/deals/${record.id}`} className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-burgundy-700 hover:text-burgundy-900">
                  View full record <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Buyer to Watch */}
      {buyerToWatch && (
        <section className="mb-10">
          <SectionHeader icon={<Eye size={16} />} title="Buyer to Watch" />
          <div className="mt-4 border border-ink-100 rounded-lg p-5 bg-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-ink-900">{buyerToWatch.name}</h3>
                <p className="text-xs text-ink-500 mt-0.5 capitalize">{buyerToWatch.type.replace(/_/g, ' ')}</p>
              </div>
              <ConfidenceBadge confidence={buyerToWatch.mandateConfidence} />
            </div>
            <p className="text-sm text-ink-700 mt-3 leading-relaxed">{buyerToWatch.currentMandate}</p>
            <p className="text-xs text-ink-600 mt-2"><span className="font-semibold">Recent:</span> {buyerToWatch.recentActivity}</p>
            <Link to={`/buyers/${buyerToWatch.id}`} className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-burgundy-700 hover:text-burgundy-900">
              View buyer profile <ArrowRight size={12} />
            </Link>
          </div>
        </section>
      )}

      {/* Quick Cuts */}
      <section className="mb-10">
        <SectionHeader icon={<ArrowRight size={16} />} title="Quick Cuts" />
        <div className="mt-4 divide-y divide-ink-100 border border-ink-100 rounded-lg bg-white overflow-hidden">
          {issue.quickCuts.map((item, i) => (
            <div key={i} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-ink-900">{item.headline}</h4>
                  <p className="text-xs text-ink-600 mt-0.5">{item.summary}</p>
                </div>
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-ink-400 hover:text-ink-600">
                  <ExternalLink size={14} />
                </a>
              </div>
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
    <div className="flex items-center gap-2 border-b border-ink-100 pb-2">
      <span className="text-burgundy-600">{icon}</span>
      <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wide">{title}</h2>
    </div>
  );
}

function MoneyMoveCard({ record }: { record: NonNullable<ReturnType<typeof getRecordById>> }) {
  return (
    <article className="border border-ink-100 rounded-lg p-5 bg-white">
      <div className="flex flex-wrap gap-1.5 mb-3">
        <RecordTypeBadge type={record.recordType} />
        <EventClassBadge eventClass={record.eventClass} />
        <FormatBadge format={record.format} />
      </div>
      <h3 className="font-bold text-ink-900 leading-snug mb-2">{record.headline}</h3>
      <p className="text-sm text-ink-700 leading-relaxed mb-3">{record.summary}</p>

      <div className="bg-cream-200 rounded p-3 mb-3">
        <p className="text-xs font-semibold text-ink-800 mb-1">Deal Board Take</p>
        <p className="text-xs text-ink-700 leading-relaxed">{record.interpretation}</p>
      </div>

      <div className="bg-forest-50 rounded p-3 mb-3">
        <p className="text-xs font-semibold text-forest-800 mb-1">Professional Opening</p>
        <p className="text-xs text-forest-700 leading-relaxed">{record.professionalAction}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {record.sources.map((source, i) => (
            <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-ink-500 hover:text-ink-700">
              <ExternalLink size={10} />
              {source.name} ({source.readTime})
            </a>
          ))}
        </div>
        <Link to={`/deals/${record.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-burgundy-700 hover:text-burgundy-900">
          Full record <ArrowRight size={12} />
        </Link>
      </div>
    </article>
  );
}

function MandateCard({ mandate }: { mandate: { signalType: string; confidence: Confidence; explanation: string; whyItMatters: string; evidenceUrl: string } }) {
  const confidenceColors: Record<Confidence, string> = {
    high: 'border-l-forest-500',
    medium: 'border-l-amber-500',
    low: 'border-l-ink-300',
  };

  return (
    <div className={`border border-ink-100 border-l-2 ${confidenceColors[mandate.confidence]} rounded-lg p-4 bg-white`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-ink-800 bg-ink-50 px-2 py-0.5 rounded">{mandate.signalType}</span>
        <ConfidenceBadge confidence={mandate.confidence} />
      </div>
      <p className="text-sm text-ink-700 leading-relaxed mb-2">{mandate.explanation}</p>
      <p className="text-xs text-ink-600"><span className="font-semibold text-ink-800">Why it may matter:</span> {mandate.whyItMatters}</p>
      <a href={mandate.evidenceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-ink-500 hover:text-ink-700">
        <ExternalLink size={10} /> Evidence source
      </a>
    </div>
  );
}
