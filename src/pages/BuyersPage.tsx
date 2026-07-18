import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useBuyers } from '../data/useDataService';
import { useData } from '../data/DataProvider';
import { pluralize } from '../data/service';
import { BuyerTypeBadge, ConfidenceBadge, FormatBadge, buyerTypeLabels } from '../components/Badges';
import { PrototypeNotice } from '../components/PrototypeNotice';
import type { BuyerType, Confidence } from '../data/types';

export function BuyersPage() {
  const { isLive } = useData();
  const allBuyers = useBuyers();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<BuyerType | ''>('');
  const [filterConfidence, setFilterConfidence] = useState<Confidence | ''>('');

  const hasActiveFilters = search || filterType || filterConfidence;

  const clearFilters = () => {
    setSearch('');
    setFilterType('');
    setFilterConfidence('');
  };

  const filtered = useMemo(() => {
    let results = allBuyers;

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.currentMandate.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }

    if (filterType) results = results.filter(b => b.type === filterType);
    if (filterConfidence) results = results.filter(b => b.mandateConfidence === filterConfidence);

    return results;
  }, [allBuyers, search, filterType, filterConfidence]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {!isLive && <PrototypeNotice />}

      <header className="mt-6 mb-6">
        <p className="kicker mb-2">Directory</p>
        <h1 className="text-3xl font-extrabold text-ink-900 font-display">Buyer Directory</h1>
        <p className="text-sm text-ink-600 mt-1">Who is actively writing checks for entertainment content.</p>
      </header>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search buyers, mandates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-ink-300 bg-white text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-inkred"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as BuyerType | '')}
            className="text-xs border border-ink-300 px-2 py-2 bg-white text-ink-700 focus:outline-none focus:border-inkred"
            aria-label="Buyer type filter"
          >
            <option value="">All types</option>
            {(Object.keys(buyerTypeLabels) as BuyerType[]).map(t => (
              <option key={t} value={t}>{buyerTypeLabels[t]}</option>
            ))}
          </select>
          <select
            value={filterConfidence}
            onChange={e => setFilterConfidence(e.target.value as Confidence | '')}
            className="text-xs border border-ink-300 px-2 py-2 bg-white text-ink-700 focus:outline-none focus:border-inkred"
            aria-label="Confidence filter"
          >
            <option value="">All confidence</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-ink-500">{filtered.length} {pluralize(filtered.length, 'buyer')}</p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-inkred font-semibold hover:underline"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* Desktop ledger table — column headers visible */}
      <div className="hidden md:block border-t border-b border-ink-900">
        <div className="grid grid-cols-[2fr_1.2fr_1fr_1.4fr_0.8fr_0.6fr] gap-4 py-2 border-b border-ink-200 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500">
          <div>Buyer</div>
          <div>Mandate</div>
          <div>Confidence</div>
          <div>Formats</div>
          <div>Verified</div>
          <div className="text-right">Records</div>
        </div>
        {filtered.map(buyer => (
          <Link
            key={buyer.id}
            to={`/buyers/${buyer.id}`}
            className="grid grid-cols-[2fr_1.2fr_1fr_1.4fr_0.8fr_0.6fr] gap-4 py-3 border-b border-ink-100 hover:bg-cream-50 transition-colors items-center group"
          >
            <div>
              <p className="font-bold text-ink-900 group-hover:text-inkred transition-colors">{buyer.name}</p>
              <BuyerTypeBadge type={buyer.type} />
            </div>
            <p className="text-sm text-ink-700 line-clamp-2">{buyer.currentMandate}</p>
            <div><ConfidenceBadge confidence={buyer.mandateConfidence} /></div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-ink-500">
              {buyer.primaryFormats.slice(0, 3).map(f => (
                <FormatBadge key={f} format={f} />
              ))}
            </div>
            <span className="text-xs text-ink-500">{buyer.lastVerified}</span>
            <span className="text-xs text-ink-500 text-right">{buyer.recordIds.length}</span>
          </Link>
        ))}
      </div>

      {/* Mobile ledger — inline labels, no column headers */}
      <div className="md:hidden border-t border-b border-ink-900 divide-y divide-ink-100">
        {filtered.map(buyer => (
          <Link
            key={buyer.id}
            to={`/buyers/${buyer.id}`}
            className="block py-4 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-ink-900 group-hover:text-inkred transition-colors">{buyer.name}</p>
                <BuyerTypeBadge type={buyer.type} />
              </div>
              <ArrowRight size={16} className="text-ink-300 mt-1" />
            </div>
            <div className="mt-2 text-xs text-ink-600 space-y-1">
              <p><span className="text-ink-400">Mandate:</span> {buyer.currentMandate}</p>
              <p><span className="text-ink-400">Confidence:</span> <ConfidenceBadge confidence={buyer.mandateConfidence} /></p>
              <p><span className="text-ink-400">Verified:</span> {buyer.lastVerified}</p>
              <p><span className="text-ink-400">Records:</span> {buyer.recordIds.length}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
