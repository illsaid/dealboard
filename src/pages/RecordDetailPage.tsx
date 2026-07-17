import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, CheckCircle, AlertTriangle, Lock } from 'lucide-react';
import { useAccessibleRecordById, useBuyerById, useBuyers } from '../data/useDataService';
import { useData } from '../data/DataProvider';
import { RecordTypeBadge, RecordClassBadge, StrategicTagBadge, FormatBadge, EvidenceBadge, ConfidenceBadge, ActionRouteBadge } from '../components/Badges';

export function RecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { records } = useData();
  const { record, isLocked } = useAccessibleRecordById(id || '');
  const primaryBuyer = useBuyerById(record?.buyerId || '');
  const allBuyers = useBuyers();
  const secondaryBuyers = (record?.secondaryBuyerIds ?? [])
    .map(bid => allBuyers.find(b => b.id === bid))
    .filter((b): b is NonNullable<typeof b> => b !== undefined);

  if (isLocked) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <Lock size={24} className="text-ink-300 mx-auto mb-3" />
        <h1 className="text-lg font-bold text-ink-900 mb-2">Subscriber-only record</h1>
        <p className="text-sm text-ink-600 mb-4">This record is available to subscribers. Full access will be available when the subscription tier launches.</p>
        <p className="text-xs text-ink-400 mb-4">Prototype — this feature demonstrates a future access control.</p>
        <Link to="/deals" className="text-sm text-burgundy-700 hover:text-burgundy-900">Back to Deal Board</Link>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-ink-500">Record not found.</p>
        <Link to="/deals" className="text-sm text-burgundy-700 hover:text-burgundy-900 mt-2 inline-block">Back to Deal Board</Link>
      </div>
    );
  }

  const relatedRecords = record.relatedRecordIds
    .map(rid => records.find(r => r.id === rid))
    .filter(r => r && !r.locked);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/deals" className="inline-flex items-center gap-1 text-xs text-ink-500 hover:text-ink-700 mb-6">
        <ArrowLeft size={14} /> Back to Deal Board
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap gap-1.5 mb-3">
          <RecordTypeBadge type={record.recordType} />
          <RecordClassBadge recordClass={record.recordClass} />
          {(record.strategicTags ?? []).map(tag => <StrategicTagBadge key={tag} tag={tag} />)}
          <FormatBadge format={record.format} />
          <EvidenceBadge tier={record.evidenceTier} />
          <ConfidenceBadge confidence={record.confidence} />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink-900 leading-tight mb-3">{record.headline}</h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500">
          <Link to={`/buyers/${record.buyerId}`} className="font-medium text-ink-800 hover:text-burgundy-700">{record.buyer}</Link>
          <span className="text-ink-200">|</span>
          <span>Announced: {record.date}</span>
          <span className="text-ink-200">|</span>
          <span>Captured: {record.firstCaptured}</span>
          <span className="text-ink-200">|</span>
          <span className="capitalize">{record.territory.replace('_', ' ')}</span>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-ink-900 mb-2">Event Summary</h2>
        <p className="text-sm text-ink-700 leading-relaxed">{record.summary}</p>
      </section>

      {/* Verified Facts */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle size={14} className="text-forest-600" />
          <h2 className="text-sm font-bold text-ink-900">Verified Facts</h2>
        </div>
        <div className="bg-forest-50 border border-forest-200 rounded-lg p-4">
          <ul className="space-y-2">
            {record.verifiedFacts.map((fact, i) => (
              <li key={i} className="text-sm text-forest-800 flex items-start gap-2">
                <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-forest-600"></span>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Interpretation */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={14} className="text-amber-600" />
          <h2 className="text-sm font-bold text-ink-900">Deal Board Interpretation</h2>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-900 leading-relaxed">{record.interpretation}</p>
          <p className="text-xs text-amber-700 mt-2 italic">This is analysis, not verified fact.</p>
        </div>
      </section>

      {/* Why it Matters */}
      <section className="mb-8">
        <div className="border border-ink-100 rounded-lg p-4 bg-white">
          <h2 className="text-xs font-bold text-ink-900 uppercase tracking-wide mb-2">Why It Matters</h2>
          <p className="text-sm text-ink-700 leading-relaxed">{record.whyItMatters}</p>
        </div>
      </section>

      {/* Professional Action Route */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-ink-900 mb-3">Professional Action</h2>
        <div className={`rounded-lg p-4 border ${
          record.action.status === 'verified' ? 'bg-forest-50 border-forest-200' :
          record.action.status === 'likely' ? 'bg-amber-50 border-amber-200' :
          'bg-ink-50 border-ink-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <ActionRouteBadge status={record.action.status} />
          </div>
          <p className={`text-sm font-medium mb-1 ${
            record.action.status === 'verified' ? 'text-forest-900' :
            record.action.status === 'likely' ? 'text-amber-900' :
            'text-ink-700'
          }`}>{record.action.label}</p>
          <p className={`text-sm leading-relaxed ${
            record.action.status === 'verified' ? 'text-forest-800' :
            record.action.status === 'likely' ? 'text-amber-800' :
            'text-ink-600'
          }`}>{record.action.description}</p>
          {record.action.evidence && (
            <p className="text-xs text-ink-500 mt-2 italic">Evidence: {record.action.evidence}</p>
          )}
          {record.action.url && (
            <a href={record.action.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-burgundy-700 hover:text-burgundy-900">
              <ExternalLink size={11} /> {record.action.url}
            </a>
          )}
        </div>
      </section>

      {/* Evidence Sources */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-ink-900 mb-3">Evidence Sources</h2>
        <div className="space-y-2">
          {record.sources.map((source, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-ink-700 hover:text-burgundy-700 underline">
                <ExternalLink size={12} />
                {source.name}
              </a>
              <span className="text-xs text-ink-400">{source.readTime} read</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-500">
          <span>Source tier: <EvidenceBadge tier={record.evidenceTier} /></span>
          <span>Last verified: {record.lastVerified}</span>
        </div>
      </section>

      {/* Related Buyers */}
      {(primaryBuyer || secondaryBuyers.length > 0) && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-ink-900 mb-3">
            {secondaryBuyers.length > 0 ? 'Related Buyers' : 'Related Buyer'}
          </h2>
          <div className="space-y-2">
            {primaryBuyer && (
              <Link to={`/buyers/${primaryBuyer.id}`} className="block border border-ink-100 rounded-lg p-4 bg-white hover:border-ink-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-ink-900">{primaryBuyer.name}</p>
                      <span className="text-xs text-ink-400 bg-ink-100 rounded px-1.5 py-0.5">Primary</span>
                    </div>
                    <p className="text-xs text-ink-500 capitalize mt-0.5">{primaryBuyer.type.replace(/_/g, ' ')}</p>
                  </div>
                  <ConfidenceBadge confidence={primaryBuyer.mandateConfidence} />
                </div>
                <p className="text-xs text-ink-600 mt-2 line-clamp-2">{primaryBuyer.currentMandate}</p>
              </Link>
            )}
            {secondaryBuyers.map(buyer => (
              <Link key={buyer.id} to={`/buyers/${buyer.id}`} className="block border border-ink-100 rounded-lg p-4 bg-white hover:border-ink-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-ink-900">{buyer.name}</p>
                      <span className="text-xs text-ink-400 bg-ink-50 border border-ink-200 rounded px-1.5 py-0.5">Secondary</span>
                    </div>
                    <p className="text-xs text-ink-500 capitalize mt-0.5">{buyer.type.replace(/_/g, ' ')}</p>
                  </div>
                  <ConfidenceBadge confidence={buyer.mandateConfidence} />
                </div>
                <p className="text-xs text-ink-600 mt-2 line-clamp-2">{buyer.currentMandate}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Records */}
      {relatedRecords.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-ink-900 mb-3">Related Records</h2>
          <div className="space-y-2">
            {relatedRecords.map(r => r && (
              <Link key={r.id} to={`/deals/${r.id}`} className="block border border-ink-100 rounded-lg p-3 bg-white hover:border-ink-200 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <RecordClassBadge recordClass={r.recordClass} />
                  <span className="text-xs text-ink-500">{r.date}</span>
                </div>
                <p className="text-sm font-medium text-ink-800">{r.headline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
