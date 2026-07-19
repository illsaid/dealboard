import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Lock } from 'lucide-react';
import { useBuyerById, useRecordsForBuyer } from '../data/useDataService';
import { pluralize } from '../data/service';
import { BuyerTypeBadge, FormatBadge, RecordClassBadge } from '../components/Badges';
import type { Confidence } from '../data/types';

function formatVerifiedDate(dateStr: string): string {
  if (!dateStr) return '\u2014';
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = String(d.getFullYear()).slice(2);
  return `${day} ${month} ${year}`;
}

function ConfidenceMark({ confidence }: { confidence: Confidence }) {
  if (confidence === 'high') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 bg-signal"></span>
        <span className="text-xs font-semibold text-inkred">High</span>
      </span>
    );
  }
  if (confidence === 'medium') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 border border-ink-400"></span>
        <span className="text-xs font-semibold text-ink-500">Medium</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 border border-ink-300"></span>
      <span className="text-xs text-ink-400">Low</span>
    </span>
  );
}

export function BuyerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const buyer = useBuyerById(id || '');
  const records = useRecordsForBuyer(id || '');

  if (!buyer) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-ink-500">Buyer not found.</p>
        <Link to="/buyers" className="ledger-link text-sm mt-2 inline-block">Back to Buyers</Link>
      </div>
    );
  }

  const buyerRecords = records;
  const hasActivity = buyer.recentActivity || buyer.activityTimeline.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/buyers" className="inline-flex items-center gap-1 text-xs text-ink-500 hover:text-inkred mb-6">
        <ArrowLeft size={14} /> Back to Buyer Directory
      </Link>

      <header className="mb-8">
        <p className="kicker mb-2">Buyer Profile</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-ink-900 font-display leading-tight">{buyer.name}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-ink-500">
              <BuyerTypeBadge type={buyer.type} />
              <span className="text-ink-300">|</span>
              <span className="capitalize">{buyer.territory.replace('_', ' ')}</span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-ink-500">
              {buyer.primaryFormats.map(f => <FormatBadge key={f} format={f} />)}
            </div>
          </div>
        </div>
        {/* Confidence + facts strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 py-3 border-t border-b border-ink-200 text-xs text-ink-500">
          <ConfidenceMark confidence={buyer.mandateConfidence} />
          <span className="text-ink-300">|</span>
          <span><span className="font-semibold text-ink-700">{buyerRecords.length}</span> {pluralize(buyerRecords.length, 'record')}</span>
          <span className="text-ink-300">|</span>
          <span>Verified {formatVerifiedDate(buyer.lastVerified)}</span>
        </div>
        <p className="text-sm text-ink-700 mt-4 leading-relaxed">{buyer.description}</p>
      </header>

      {/* Route Dossier — honest Option A language */}
      <section className="mb-8 border-t border-ink-900 pt-4">
        <h2 className="text-xs font-bold text-ink-900 uppercase tracking-[0.14em] mb-3">Route Dossier</h2>
        <div className="border border-ink-200 p-4 bg-cream-50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500 mb-1">
                {buyer.contactRoute ? 'Route on file' : 'Route research not yet recorded'}
              </p>
              {buyer.contactRoute ? (
                <p className="text-sm text-ink-800 leading-relaxed">{buyer.contactRoute}</p>
              ) : (
                <p className="text-sm text-ink-500 italic leading-relaxed">
                  Route research not yet recorded for this buyer.
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-ink-400 mt-3 pt-3 border-t border-ink-200">
            Last buyer verification: {formatVerifiedDate(buyer.lastVerified)}
          </p>
          <p className="text-xs text-ink-500 mt-2">
            Have current route information?{' '}
            <a
              href={`mailto:editor@thepickup.co?subject=${encodeURIComponent(`Route update: ${buyer.name}`)}`}
              className="ledger-link"
            >
              Contact the editor
            </a>
            .
          </p>
        </div>
      </section>

      {/* Current Mandate */}
      <section className="mb-8 border-t border-ink-200 pt-4">
        <h2 className="text-xs font-bold text-ink-900 uppercase tracking-[0.14em] mb-3">Current Apparent Mandate</h2>
        <p className="text-sm text-ink-700 leading-relaxed">{buyer.currentMandate}</p>
        {buyer.mandateEvidence.length > 0 && (
          <div className="mt-3 pt-3 border-t border-ink-100">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500 mb-2">Supporting evidence:</p>
            <ul className="space-y-1.5">
              {buyer.mandateEvidence.map((ev, i) => (
                <li key={i} className="text-xs text-ink-600 flex items-start gap-2">
                  <span className="shrink-0 mt-1.5 w-1 h-1 bg-ink-400"></span>
                  {ev}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-xs text-ink-400 mt-3 italic">Mandate inferred from public evidence. Not a confirmed commissioning brief.</p>
      </section>

      {/* Recent Activity — hidden when no content */}
      {hasActivity && (
        <section className="mb-8 border-t border-ink-200 pt-4">
          <h2 className="text-xs font-bold text-ink-900 uppercase tracking-[0.14em] mb-3">Recent Activity</h2>
          {buyer.recentActivity && <p className="text-sm text-ink-700 mb-4">{buyer.recentActivity}</p>}
          {buyer.activityTimeline.length > 0 && (
            <div className="border-t border-b border-ink-200 divide-y divide-ink-100">
              {buyer.activityTimeline.map((item, i) => (
                <div key={i} className="py-3 flex items-start gap-3">
                  <span className="text-xs text-ink-400 whitespace-nowrap shrink-0 pt-0.5 font-semibold uppercase">{formatVerifiedDate(item.date)}</span>
                  <span className="text-sm text-ink-700">{item.event}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Related Records */}
      {buyerRecords.length > 0 && (
        <section className="mb-8 border-t border-ink-200 pt-4">
          <h2 className="text-xs font-bold text-ink-900 uppercase tracking-[0.14em] mb-3">
            Deal Board Records ({buyerRecords.length} {pluralize(buyerRecords.length, 'record')})
          </h2>
          <div className="border-t border-b border-ink-200 divide-y divide-ink-100">
            {buyerRecords.map(r => (
              r.locked ? (
                <div key={r.id} className="py-3 flex items-center gap-2 text-ink-400">
                  <Lock size={12} />
                  <span className="text-xs">Subscriber-only record</span>
                </div>
              ) : (
                <Link key={r.id} to={`/deals/${r.id}`} className="block py-3 hover:bg-cream-50 transition-colors -mx-2 px-2 group">
                  <div className="flex items-center gap-2 mb-1">
                    <RecordClassBadge recordClass={r.recordClass} />
                    <span className="text-xs text-ink-400 uppercase">{formatVerifiedDate(r.date)}</span>
                  </div>
                  <p className="text-sm font-medium text-ink-800 group-hover:text-inkred transition-colors">{r.headline}</p>
                </Link>
              )
            ))}
          </div>
        </section>
      )}

      {/* Open Questions */}
      {buyer.openQuestions.length > 0 && (
        <section className="mb-8 border-t border-ink-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={14} className="text-ink-500" />
            <h2 className="text-xs font-bold text-ink-900 uppercase tracking-[0.14em]">Open Questions</h2>
          </div>
          <ul className="space-y-2">
            {buyer.openQuestions.map((q, i) => (
              <li key={i} className="text-sm text-ink-600 flex items-start gap-2">
                <span className="shrink-0 mt-1.5 w-1 h-1 bg-ink-400"></span>
                {q}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="border-t border-ink-900 pt-4 text-xs text-ink-400">Last verified: {formatVerifiedDate(buyer.lastVerified)}</div>
    </div>
  );
}
