import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useBuyers, useRecords } from '../data/useDataService';
import { useData } from '../data/DataProvider';
import { pluralize } from '../data/service';
import { BuyerTypeBadge, FormatBadge, buyerTypeLabels } from '../components/Badges';
import { PrototypeNotice } from '../components/PrototypeNotice';
import type { BuyerType, Confidence, Buyer } from '../data/types';

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

export function BuyersPage() {
  const { isLive } = useData();
  const allBuyers = useBuyers();
  const allRecords = useRecords();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<BuyerType | ''>('');
  const [filterConfidence, setFilterConfidence] = useState<Confidence | ''>('');

  const hasActiveFilters = search || filterType || filterConfidence;

  const clearFilters = () => {
    setSearch('');
    setFilterType('');
    setFilterConfidence('');
  };

  const recordCountByBuyer = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of allRecords) {
      if (r.buyerId) {
        counts[r.buyerId] = (counts[r.buyerId] || 0) + 1;
      }
      if (r.secondaryBuyerIds) {
        for (const sid of r.secondaryBuyerIds) {
          counts[sid] = (counts[sid] || 0) + 1;
        }
      }
    }
    return counts;
  }, [allRecords]);

  function getRecordCount(buyer: Buyer): number {
    const computed = recordCountByBuyer[buyer.id] || 0;
    if (computed > 0) return computed;
    return buyer.recordIds?.length || 0;
  }

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

  const highConfCount = allBuyers.filter(b => b.mandateConfidence === 'high').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {!isLive && <PrototypeNotice />}

      <header className="mt-6 mb-6">
        <p className="kicker mb-2">Directory</p>
        <h1 className="text-3xl font-extrabold text-ink-900 font-display">Buyer Directory</h1>
        <p className="text-sm text-ink-600 mt-1">Who is actively writing checks for entertainment content.</p>
      </header>

      {/* Stat strip — three cells */}
      <div className="grid grid-cols-3 border-t-2 border-b border-ink-900 mb-6">
        <div className="py-4 px-3 text-center border-r border-ink-200">
          <p className="text-[40px] font-extrabold text-ink-900 font-display leading-none">{allBuyers.length}</p>
          <p className="text-[11px] text-ink-500 mt-2 uppercase tracking-[0.1em]">Active buyers</p>
        </div>
        <div className="py-4 px-3 text-center border-r border-ink-200">
          <p className="text-[40px] font-extrabold text-signal font-display leading-none">{highConfCount}</p>
          <p className="text-[11px] text-ink-500 mt-2 uppercase tracking-[0.1em]">High confidence</p>
        </div>
        <div className="py-4 px-3 text-center">
          <p className="text-[40px] font-extrabold text-ink-900 font-display leading-none">{allRecords.length}</p>
          <p className="text-[11px] text-ink-500 mt-2 uppercase tracking-[0.1em]">Linked records</p>
        </div>
      </div>

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

      {/* Desktop ledger table */}
      <div className="hidden md:block border-t-2 border-b border-ink-900">
        <div className="grid grid-cols-[2fr_1.6fr_0.8fr_1.2fr_0.7fr_0.5fr_0.6fr] gap-4 py-2 border-b border-ink-200 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500">
          <div>Buyer</div>
          <div>Mandate</div>
          <div>Confidence</div>
          <div>Formats</div>
          <div>Verified</div>
          <div className="text-right">Records</div>
          <div></div>
        </div>
        {filtered.map(buyer => (
          <BuyerDesktopRow key={buyer.id} buyer={buyer} recordCount={getRecordCount(buyer)} />
        ))}
      </div>

      {/* Mobile ledger */}
      <div className="md:hidden border-t-2 border-b border-ink-900 divide-y divide-ink-100">
        {filtered.map(buyer => (
          <BuyerMobileRow key={buyer.id} buyer={buyer} recordCount={getRecordCount(buyer)} />
        ))}
      </div>
    </div>
  );
}

function BuyerDesktopRow({ buyer, recordCount }: { buyer: Buyer; recordCount: number }) {
  return (
    <Link
      to={`/buyers/${buyer.id}`}
      className="grid grid-cols-[2fr_1.6fr_0.8fr_1.2fr_0.7fr_0.5fr_0.6fr] gap-4 py-3 border-b border-ink-100 hover:bg-cream-50 transition-colors items-start group"
    >
      <div>
        <p className="font-bold text-ink-900 group-hover:text-inkred transition-colors">{buyer.name}</p>
        <BuyerTypeBadge type={buyer.type} />
      </div>
      <p className="text-sm text-ink-700">{buyer.currentMandate}</p>
      <div><ConfidenceMark confidence={buyer.mandateConfidence} /></div>
      <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-ink-500">
        {buyer.primaryFormats.length > 0
          ? buyer.primaryFormats.map(f => <FormatBadge key={f} format={f} />)
          : <span className="text-ink-300">&mdash;</span>
        }
      </div>
      <span className="text-xs text-ink-500 uppercase">{formatVerifiedDate(buyer.lastVerified)}</span>
      <span className="text-xs text-ink-700 text-right font-semibold">{recordCount}</span>
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-inkred">
        Profile <ArrowRight size={11} />
      </span>
    </Link>
  );
}

function BuyerMobileRow({ buyer, recordCount }: { buyer: Buyer; recordCount: number }) {
  return (
    <Link
      to={`/buyers/${buyer.id}`}
      className="block py-4 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-ink-900 group-hover:text-inkred transition-colors">{buyer.name}</p>
          <BuyerTypeBadge type={buyer.type} />
        </div>
        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-inkred shrink-0 mt-1">
          Profile <ArrowRight size={11} />
        </span>
      </div>
      <div className="mt-2 text-xs text-ink-600 space-y-1">
        <p><span className="text-ink-400">Mandate:</span> {buyer.currentMandate}</p>
        <p className="flex items-center gap-1"><span className="text-ink-400">Confidence:</span> <ConfidenceMark confidence={buyer.mandateConfidence} /></p>
        <p><span className="text-ink-400">Formats:</span>{' '}
          {buyer.primaryFormats.length > 0
            ? buyer.primaryFormats.map((f, i) => <span key={f}>{i > 0 && ', '}<FormatBadge format={f} /></span>)
            : <span className="text-ink-300">&mdash;</span>
          }
        </p>
        <p><span className="text-ink-400">Verified:</span> {formatVerifiedDate(buyer.lastVerified)}</p>
        <p><span className="text-ink-400">Records:</span> {recordCount}</p>
      </div>
    </Link>
  );
}
