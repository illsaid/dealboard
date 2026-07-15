import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { getBuyers } from '../data/service';
import { BuyerTypeBadge, ConfidenceBadge, FormatBadge } from '../components/Badges';
import { PrototypeNotice } from '../components/PrototypeNotice';
import type { BuyerType, Confidence } from '../data/types';

export function BuyersPage() {
  const allBuyers = getBuyers();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<BuyerType | ''>('');
  const [filterConfidence, setFilterConfidence] = useState<Confidence | ''>('');

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
      <PrototypeNotice />

      <header className="mt-6 mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Buyer Directory</h1>
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
            className="w-full pl-9 pr-3 py-2 text-sm border border-ink-200 rounded bg-white text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-burgundy-400 focus:ring-1 focus:ring-burgundy-200"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as BuyerType | '')}
            className="text-xs border border-ink-200 rounded px-2 py-2 bg-white text-ink-700 focus:outline-none"
            aria-label="Buyer type filter"
          >
            <option value="">All types</option>
            <option value="microdrama_platform">Microdrama Platform</option>
            <option value="creator_studio">Creator Studio</option>
            <option value="brand_funded">Brand-Funded</option>
            <option value="fast_channel">FAST Channel</option>
            <option value="digital_platform">Digital Platform</option>
            <option value="legacy_studio">Legacy Studio</option>
            <option value="financier">Financier</option>
          </select>
          <select
            value={filterConfidence}
            onChange={e => setFilterConfidence(e.target.value as Confidence | '')}
            className="text-xs border border-ink-200 rounded px-2 py-2 bg-white text-ink-700 focus:outline-none"
            aria-label="Confidence filter"
          >
            <option value="">All confidence</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-ink-500 mb-4">{filtered.length} buyers</p>

      {/* Buyer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(buyer => (
          <Link
            key={buyer.id}
            to={`/buyers/${buyer.id}`}
            className="border border-ink-100 rounded-lg p-4 bg-white hover:border-ink-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-ink-900 leading-snug">{buyer.name}</h3>
              <ConfidenceBadge confidence={buyer.mandateConfidence} />
            </div>
            <BuyerTypeBadge type={buyer.type} />
            <div className="flex flex-wrap gap-1 mt-2">
              {buyer.primaryFormats.slice(0, 3).map(f => (
                <FormatBadge key={f} format={f} />
              ))}
            </div>
            <p className="text-xs text-ink-600 mt-3 line-clamp-2">{buyer.currentMandate}</p>
            <div className="mt-3 pt-3 border-t border-ink-50 flex items-center justify-between">
              <span className="text-xs text-ink-500">Last verified: {buyer.lastVerified}</span>
              <span className="text-xs text-ink-400">{buyer.recordIds.length} records</span>
            </div>
            <p className="text-xs text-ink-500 mt-2">{buyer.recentActivity}</p>
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-burgundy-700">
              View profile <ArrowRight size={12} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
