import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Lock } from 'lucide-react';
import { useBuyerById, useRecordsForBuyer } from '../data/useDataService';
import { pluralize } from '../data/service';
import { BuyerTypeBadge, ConfidenceBadge, FormatBadge, RecordClassBadge } from '../components/Badges';

export function BuyerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const buyer = useBuyerById(id || '');
  const records = useRecordsForBuyer(id || '');

  if (!buyer) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-ink-500">Buyer not found.</p>
        <Link to="/buyers" className="text-sm text-burgundy-700 hover:text-burgundy-900 mt-2 inline-block">Back to Buyers</Link>
      </div>
    );
  }

  const buyerRecords = records;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/buyers" className="inline-flex items-center gap-1 text-xs text-ink-500 hover:text-ink-700 mb-6">
        <ArrowLeft size={14} /> Back to Buyer Directory
      </Link>

      <header className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-ink-900">{buyer.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <BuyerTypeBadge type={buyer.type} />
              {buyer.primaryFormats.map(f => <FormatBadge key={f} format={f} />)}
            </div>
          </div>
          <ConfidenceBadge confidence={buyer.mandateConfidence} />
        </div>
        <p className="text-sm text-ink-700 mt-4 leading-relaxed">{buyer.description}</p>
        <p className="text-xs text-ink-500 mt-2 capitalize">Territory: {buyer.territory.replace('_', ' ')}</p>
      </header>

      {/* Current Mandate */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-ink-900 mb-3">Current Apparent Mandate</h2>
        <div className="border border-ink-100 rounded-lg p-4 bg-white">
          <p className="text-sm text-ink-700 leading-relaxed">{buyer.currentMandate}</p>
          <div className="mt-3 pt-3 border-t border-ink-50">
            <p className="text-xs font-semibold text-ink-700 mb-2">Supporting evidence:</p>
            <ul className="space-y-1.5">
              {buyer.mandateEvidence.map((ev, i) => (
                <li key={i} className="text-xs text-ink-600 flex items-start gap-2">
                  <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-ink-400"></span>
                  {ev}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-ink-400 mt-3 italic">Mandate inferred from public evidence. Not a confirmed commissioning brief.</p>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-ink-900 mb-3">Recent Activity</h2>
        <p className="text-sm text-ink-700 mb-4">{buyer.recentActivity}</p>
        <div className="border border-ink-100 rounded-lg bg-white overflow-hidden">
          <div className="divide-y divide-ink-50">
            {buyer.activityTimeline.map((item, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                <span className="text-xs text-ink-400 whitespace-nowrap shrink-0 pt-0.5">{item.date}</span>
                <span className="text-sm text-ink-700">{item.event}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Records */}
      {buyerRecords.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-ink-900 mb-3">
            Deal Board Records ({buyerRecords.length} {pluralize(buyerRecords.length, 'record')})
          </h2>
          <div className="space-y-2">
            {buyerRecords.map(r => (
              r.locked ? (
                <div key={r.id} className="border border-ink-100 rounded-lg p-3 bg-ink-50/50 flex items-center gap-2">
                  <Lock size={12} className="text-ink-300" />
                  <span className="text-xs text-ink-400">Subscriber-only record</span>
                </div>
              ) : (
                <Link key={r.id} to={`/deals/${r.id}`} className="block border border-ink-100 rounded-lg p-3 bg-white hover:border-ink-200 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <RecordClassBadge recordClass={r.recordClass} />
                    <span className="text-xs text-ink-500">{r.date}</span>
                  </div>
                  <p className="text-sm font-medium text-ink-800">{r.headline}</p>
                </Link>
              )
            ))}
          </div>
        </section>
      )}

      {/* Contact Route */}
      {buyer.contactRoute && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-ink-900 mb-3">Submission / Contact Route</h2>
          <div className="border border-forest-200 rounded-lg p-4 bg-forest-50">
            <p className="text-sm text-forest-800">{buyer.contactRoute}</p>
          </div>
        </section>
      )}

      {/* Open Questions */}
      {buyer.openQuestions.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={14} className="text-ink-500" />
            <h2 className="text-sm font-bold text-ink-900">Open Questions</h2>
          </div>
          <div className="border border-ink-100 rounded-lg p-4 bg-white">
            <ul className="space-y-2">
              {buyer.openQuestions.map((q, i) => (
                <li key={i} className="text-sm text-ink-600 flex items-start gap-2">
                  <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-ink-400"></span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="text-xs text-ink-400">Last verified: {buyer.lastVerified}</div>
    </div>
  );
}
