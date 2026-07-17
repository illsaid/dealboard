import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, LayoutGrid, List, Clock, X, Lock, SlidersHorizontal } from 'lucide-react';
import { useRecords, useNewThisWeekCount, useUniqueBuyerNames } from '../data/useDataService';
import { useData } from '../data/DataProvider';
import { pluralize } from '../data/service';
import { RecordCard } from '../components/RecordCard';
import { RecordClassBadge, EvidenceBadge, ConfidenceBadge, ActionRouteBadge } from '../components/Badges';
import { PrototypeNotice } from '../components/PrototypeNotice';
import type { RecordType, Format, EvidenceTier, Confidence, Territory, ActionRouteStatus } from '../data/types';

type ViewMode = 'cards' | 'table';
type SortMode = 'newest' | 'confidence' | 'buyer';
type BoardView = 'deals' | 'signals';

const confidenceOrder: Record<Confidence, number> = { high: 3, medium: 2, low: 1 };

export function DealBoardPage() {
  const { isLive, latestVerifiedDate } = useData();
  const allRecords = useRecords();
  const newThisWeek = useNewThisWeekCount();
  const buyerNames = useUniqueBuyerNames();

  const [search, setSearch] = useState('');
  const [view, setView] = useState<ViewMode>('cards');
  const [sort, setSort] = useState<SortMode>('newest');
  const [activeBoardView, setActiveBoardView] = useState<BoardView>('deals');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterBuyer, setFilterBuyer] = useState('');
  const [filterType, setFilterType] = useState<RecordType | ''>('');
  const [filterFormat, setFilterFormat] = useState<Format | ''>('');
  const [filterEvidence, setFilterEvidence] = useState<EvidenceTier | ''>('');
  const [filterConfidence, setFilterConfidence] = useState<Confidence | ''>('');
  const [filterTerritory, setFilterTerritory] = useState<Territory | ''>('');
  const [filterAction, setFilterAction] = useState<ActionRouteStatus | ''>('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const hasActiveFilters = activeBoardView !== 'deals' || search || filterBuyer || filterType || filterFormat || filterEvidence || filterConfidence || filterTerritory || filterAction || filterDateFrom || filterDateTo;

  const clearFilters = () => {
    setSearch('');
    setActiveBoardView('deals');
    setFilterBuyer('');
    setFilterType('');
    setFilterFormat('');
    setFilterEvidence('');
    setFilterConfidence('');
    setFilterTerritory('');
    setFilterAction('');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  const filtered = useMemo(() => {
    let results = allRecords.filter(record =>
      activeBoardView === 'signals'
        ? record.recordClass === 'developing_signal'
        : record.recordClass === 'confirmed_deal'
    );

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(r =>
        r.headline.toLowerCase().includes(q) ||
        r.buyer.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q)
      );
    }

    if (filterBuyer) results = results.filter(r => r.buyer === filterBuyer);
    if (filterType) results = results.filter(r => r.recordType === filterType);
    if (filterFormat) results = results.filter(r => r.format === filterFormat);
    if (filterEvidence) results = results.filter(r => r.evidenceTier === filterEvidence);
    if (filterConfidence) results = results.filter(r => r.confidence === filterConfidence);
    if (filterTerritory) results = results.filter(r => r.territory === filterTerritory);
    if (filterAction) results = results.filter(r => r.action.status === filterAction);
    if (filterDateFrom) results = results.filter(r => r.date >= filterDateFrom);
    if (filterDateTo) results = results.filter(r => r.date <= filterDateTo);

    if (sort === 'confidence') {
      results = [...results].sort((a, b) => confidenceOrder[b.confidence] - confidenceOrder[a.confidence]);
    } else if (sort === 'buyer') {
      results = [...results].sort((a, b) => a.buyer.localeCompare(b.buyer));
    }

    return results;
  }, [allRecords, activeBoardView, search, filterBuyer, filterType, filterFormat, filterEvidence, filterConfidence, filterTerritory, filterAction, filterDateFrom, filterDateTo, sort]);

  const updatedLabel = latestVerifiedDate
    ? `Updated ${new Date(latestVerifiedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
    : 'Updated July 14, 2026';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {!isLive && <PrototypeNotice />}

      <header className="mt-6 mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Deal Board</h1>
        <p className="text-sm text-ink-600 mt-1">Searchable intelligence on who's buying entertainment and what they're acquiring.</p>
      </header>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-ink-500">
        <span className="flex items-center gap-1">
          <span className="font-semibold text-burgundy-700">{newThisWeek}</span> new this week
        </span>
        <span>{allRecords.length} published {pluralize(allRecords.length, 'record')}</span>
        <span className="flex items-center gap-1">
          <Clock size={12} /> {updatedLabel}
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
          {/* View toggle hidden on mobile — cards are forced */}
          <button
            onClick={() => setView('cards')}
            className={`hidden md:inline-flex p-2 rounded ${view === 'cards' ? 'bg-ink-900 text-cream-50' : 'text-ink-500 hover:text-ink-900 border border-ink-200'}`}
            aria-label="Card view"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setView('table')}
            className={`hidden md:inline-flex p-2 rounded ${view === 'table' ? 'bg-ink-900 text-cream-50' : 'text-ink-500 hover:text-ink-900 border border-ink-200'}`}
            aria-label="Table view"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Primary filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2 mr-1">
          <span className="text-xs text-ink-500">Record class</span>
          <div className="inline-flex rounded border border-ink-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setActiveBoardView('deals')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${activeBoardView === 'deals' ? 'bg-ink-900 text-cream-50' : 'text-ink-600 hover:text-ink-900'}`}
            >
              Confirmed deals
            </button>
            <button
              type="button"
              onClick={() => setActiveBoardView('signals')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${activeBoardView === 'signals' ? 'bg-ink-900 text-cream-50' : 'text-ink-600 hover:text-ink-900'}`}
            >
              Signals
            </button>
          </div>
        </div>
        <FilterSelect label="Buyer" value={filterBuyer} onChange={setFilterBuyer} options={[
          { value: '', label: 'All buyers' },
          ...buyerNames.map(name => ({ value: name, label: name })),
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
        <button
          type="button"
          onClick={() => setShowAdvancedFilters(current => !current)}
          aria-expanded={showAdvancedFilters}
          className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs transition-colors ${showAdvancedFilters ? 'border-burgundy-300 bg-burgundy-50 text-burgundy-800' : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300'}`}
        >
          <SlidersHorizontal size={13} />
          {showAdvancedFilters ? 'Hide advanced filters' : 'Advanced filters'}
        </button>
      </div>

      {showAdvancedFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4 rounded-lg border border-ink-100 bg-cream-50 p-3">
          <FilterSelect label="Type" value={filterType} onChange={v => setFilterType(v as RecordType | '')} options={[
            { value: '', label: 'All types' },
            { value: 'acquisition', label: 'Acquisition' },
            { value: 'commission', label: 'Commission' },
            { value: 'fund_launch', label: 'Fund Launch' },
            { value: 'partnership', label: 'Partnership' },
            { value: 'license', label: 'License' },
            { value: 'development', label: 'Development' },
          ]} />
        <FilterSelect label="Evidence" value={filterEvidence} onChange={v => setFilterEvidence(v as EvidenceTier | '')} options={[
          { value: '', label: 'All tiers' },
          { value: 'tier_1', label: 'Tier 1' },
          { value: 'tier_2', label: 'Tier 2' },
          { value: 'tier_3', label: 'Tier 3' },
          { value: 'tier_4', label: 'Tier 4' },
        ]} />
        <FilterSelect label="Confidence" value={filterConfidence} onChange={v => setFilterConfidence(v as Confidence | '')} options={[
          { value: '', label: 'All levels' },
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' },
        ]} />
        <FilterSelect label="Territory" value={filterTerritory} onChange={v => setFilterTerritory(v as Territory | '')} options={[
          { value: '', label: 'All territories' },
          { value: 'global', label: 'Global' },
          { value: 'north_america', label: 'North America' },
          { value: 'europe', label: 'Europe' },
          { value: 'asia_pacific', label: 'Asia Pacific' },
          { value: 'latin_america', label: 'Latin America' },
        ]} />
        <FilterSelect label="Action route" value={filterAction} onChange={v => setFilterAction(v as ActionRouteStatus | '')} options={[
          { value: '', label: 'All routes' },
          { value: 'not_researched', label: 'Not researched' },
          { value: 'underway', label: 'Underway' },
          { value: 'verified', label: 'Verified route' },
          { value: 'likely', label: 'Likely route' },
          { value: 'researched_none', label: 'Researched — none identified' },
        ]} />
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-ink-500">From</label>
          <input
            type="date"
            value={filterDateFrom}
            onChange={e => setFilterDateFrom(e.target.value)}
            className="text-xs border border-ink-200 rounded px-2 py-1.5 bg-white text-ink-700 focus:outline-none focus:border-burgundy-400"
            aria-label="Date from"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-ink-500">To</label>
          <input
            type="date"
            value={filterDateTo}
            onChange={e => setFilterDateTo(e.target.value)}
            className="text-xs border border-ink-200 rounded px-2 py-1.5 bg-white text-ink-700 focus:outline-none focus:border-burgundy-400"
            aria-label="Date to"
          />
        </div>
        </div>
      )}

      {/* Active filter indicator + clear */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-ink-500">
          {filtered.length} {pluralize(filtered.length, 'record')}
          <span className="ml-1">in {activeBoardView === 'deals' ? 'confirmed deals' : 'signals'}</span>
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-burgundy-700 hover:text-burgundy-900 font-medium"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* Results — mobile always shows cards regardless of view toggle */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {filtered.map(record => (
          <RecordCard key={record.id} record={record} compact />
        ))}
      </div>

      <div className="hidden md:block">
        {view === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(record => (
              <RecordCard key={record.id} record={record} compact />
            ))}
          </div>
        ) : (
          <div className="border border-ink-100 rounded-lg overflow-hidden bg-white">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-ink-100 bg-cream-50">
                  <th className="text-left px-3 py-2 font-semibold text-ink-700">Date</th>
                  <th className="text-left px-3 py-2 font-semibold text-ink-700">Buyer</th>
                  <th className="text-left px-3 py-2 font-semibold text-ink-700">Headline</th>
                  <th className="text-left px-3 py-2 font-semibold text-ink-700">Class</th>
                  <th className="text-left px-3 py-2 font-semibold text-ink-700">Evidence</th>
                  <th className="text-left px-3 py-2 font-semibold text-ink-700">Confidence</th>
                  <th className="text-left px-3 py-2 font-semibold text-ink-700">Action</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {filtered.map(record => (
                  <tr key={record.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-3 py-2.5 text-ink-500 whitespace-nowrap">{record.date}</td>
                    <td className="px-3 py-2.5 font-medium text-ink-800 whitespace-nowrap">{record.buyer}</td>
                    <td className="px-3 py-2.5 text-ink-700 max-w-xs">
                      <span className="line-clamp-1">{record.headline}</span>
                    </td>
                    <td className="px-3 py-2.5"><RecordClassBadge recordClass={record.recordClass} /></td>
                    <td className="px-3 py-2.5"><EvidenceBadge tier={record.evidenceTier} /></td>
                    <td className="px-3 py-2.5"><ConfidenceBadge confidence={record.confidence} /></td>
                    <td className="px-3 py-2.5"><ActionRouteBadge status={record.action.status} /></td>
                    <td className="px-3 py-2.5">
                      {record.locked ? (
                        <Lock size={14} className="text-ink-300" />
                      ) : (
                        <Link to={`/deals/${record.id}`} className="text-xs font-medium text-burgundy-700 hover:text-burgundy-900 whitespace-nowrap">
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
