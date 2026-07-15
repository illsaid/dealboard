import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, LayoutGrid, List, ArrowRight, Clock } from 'lucide-react';
import { getPublishedRecords, getNewThisWeekCount } from '../data/service';
import { RecordCard } from '../components/RecordCard';
import { RecordTypeBadge, FormatBadge, ConfidenceBadge } from '../components/Badges';
import { PrototypeNotice } from '../components/PrototypeNotice';
import type { RecordType, EventClass, Format, EvidenceTier, Confidence } from '../data/types';

type ViewMode = 'cards' | 'table';
type SortMode = 'newest' | 'confidence' | 'buyer';

export function DealBoardPage() {
  const allRecords = getPublishedRecords();
  const newThisWeek = getNewThisWeekCount();

  const [search, setSearch] = useState('');
  const [view, setView] = useState<ViewMode>('cards');
  const [sort, setSort] = useState<SortMode>('newest');
  const [filterType, setFilterType] = useState<RecordType | ''>('');
  const [filterEventClass, setFilterEventClass] = useState<EventClass | ''>('');
  const [filterFormat, setFilterFormat] = useState<Format | ''>('');
  const [filterEvidence, setFilterEvidence] = useState<EvidenceTier | ''>('');
  const [filterConfidence, setFilterConfidence] = useState<Confidence | ''>('');

  const confidenceOrder: Record<Confidence, number> = { high: 3, medium: 2, low: 1 };

  const filtered = useMemo(() => {
    let results = allRecords;

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(r =>
        r.headline.toLowerCase().includes(q) ||
        r.buyer.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q)
      );
    }

    if (filterType) results = results.filter(r => r.recordType === filterType);
    if (filterEventClass) results = results.filter(r => r.eventClass === filterEventClass);
    if (filterFormat) results = results.filter(r => r.format === filterFormat);
    if (filterEvidence) results = results.filter(r => r.evidenceTier === filterEvidence);
    if (filterConfidence) results = results.filter(r => r.confidence === filterConfidence);

    if (sort === 'confidence') {
      results = [...results].sort((a, b) => confidenceOrder[b.confidence] - confidenceOrder[a.confidence]);
    } else if (sort === 'buyer') {
      results = [...results].sort((a, b) => a.buyer.localeCompare(b.buyer));
    }

    return results;
  }, [allRecords, search, filterType, filterEventClass, filterFormat, filterEvidence, filterConfidence, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <PrototypeNotice />

      <header className="mt-6 mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Deal Board</h1>
        <p className="text-sm text-ink-600 mt-1">Searchable intelligence on who's buying entertainment and what they're acquiring.</p>
      </header>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-ink-500">
        <span className="flex items-center gap-1">
          <span className="font-semibold text-burgundy-700">{newThisWeek}</span> new this week
        </span>
        <span>{allRecords.length} published records</span>
        <span className="flex items-center gap-1">
          <Clock size={12} /> Updated July 14, 2026
        </span>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search records, buyers, keywords..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-ink-200 rounded bg-white text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-burgundy-400 focus:ring-1 focus:ring-burgundy-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortMode)}
            className="text-xs border border-ink-200 rounded px-2 py-2 bg-white text-ink-700 focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="confidence">Confidence</option>
            <option value="buyer">Buyer</option>
          </select>
          <button
            onClick={() => setView('cards')}
            className={`p-2 rounded ${view === 'cards' ? 'bg-ink-900 text-cream-50' : 'text-ink-500 hover:text-ink-900 border border-ink-200'}`}
            aria-label="Card view"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setView('table')}
            className={`p-2 rounded ${view === 'table' ? 'bg-ink-900 text-cream-50' : 'text-ink-500 hover:text-ink-900 border border-ink-200'}`}
            aria-label="Table view"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterSelect label="Type" value={filterType} onChange={v => setFilterType(v as RecordType | '')} options={[
          { value: '', label: 'All types' },
          { value: 'acquisition', label: 'Acquisition' },
          { value: 'commission', label: 'Commission' },
          { value: 'fund_launch', label: 'Fund Launch' },
          { value: 'partnership', label: 'Partnership' },
          { value: 'license', label: 'License' },
          { value: 'development', label: 'Development' },
        ]} />
        <FilterSelect label="Event" value={filterEventClass} onChange={v => setFilterEventClass(v as EventClass | '')} options={[
          { value: '', label: 'All events' },
          { value: 'confirmed_deal', label: 'Confirmed Deal' },
          { value: 'developing_signal', label: 'Developing Signal' },
          { value: 'legacy_crossover', label: 'Legacy Crossover' },
        ]} />
        <FilterSelect label="Format" value={filterFormat} onChange={v => setFilterFormat(v as Format | '')} options={[
          { value: '', label: 'All formats' },
          { value: 'microdrama', label: 'Microdrama' },
          { value: 'short_form', label: 'Short Form' },
          { value: 'series', label: 'Series' },
          { value: 'interactive', label: 'Interactive' },
          { value: 'branded', label: 'Branded' },
          { value: 'fast_channel', label: 'FAST Channel' },
          { value: 'unscripted', label: 'Unscripted' },
        ]} />
        <FilterSelect label="Evidence" value={filterEvidence} onChange={v => setFilterEvidence(v as EvidenceTier | '')} options={[
          { value: '', label: 'All tiers' },
          { value: 'tier_1', label: 'Tier 1' },
          { value: 'tier_2', label: 'Tier 2' },
          { value: 'tier_3', label: 'Tier 3' },
        ]} />
        <FilterSelect label="Confidence" value={filterConfidence} onChange={v => setFilterConfidence(v as Confidence | '')} options={[
          { value: '', label: 'All levels' },
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' },
        ]} />
      </div>

      {/* Results */}
      <p className="text-xs text-ink-500 mb-4">{filtered.length} records</p>

      {view === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(record => (
            <RecordCard key={record.id} record={record} compact />
          ))}
        </div>
      ) : (
        <div className="border border-ink-100 rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-ink-100 bg-cream-50">
                  <th className="text-left px-3 py-2 font-semibold text-ink-700">Date</th>
                  <th className="text-left px-3 py-2 font-semibold text-ink-700">Buyer</th>
                  <th className="text-left px-3 py-2 font-semibold text-ink-700">Headline</th>
                  <th className="text-left px-3 py-2 font-semibold text-ink-700">Type</th>
                  <th className="text-left px-3 py-2 font-semibold text-ink-700">Format</th>
                  <th className="text-left px-3 py-2 font-semibold text-ink-700">Confidence</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {filtered.map(record => (
                  <tr key={record.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-3 py-2.5 text-ink-500 whitespace-nowrap">{record.date}</td>
                    <td className="px-3 py-2.5 font-medium text-ink-800 whitespace-nowrap">{record.buyer}</td>
                    <td className="px-3 py-2.5 text-ink-700 max-w-xs truncate">{record.headline}</td>
                    <td className="px-3 py-2.5"><RecordTypeBadge type={record.recordType} /></td>
                    <td className="px-3 py-2.5"><FormatBadge format={record.format} /></td>
                    <td className="px-3 py-2.5"><ConfidenceBadge confidence={record.confidence} /></td>
                    <td className="px-3 py-2.5">
                      <Link to={`/deals/${record.id}`} className="text-burgundy-700 hover:text-burgundy-900">
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="text-xs border border-ink-200 rounded px-2 py-1.5 bg-white text-ink-700 focus:outline-none focus:border-burgundy-400"
      aria-label={label}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
