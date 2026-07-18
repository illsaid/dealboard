import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, LayoutGrid, List, X, Lock, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useRecords, useNewThisWeekCount, useUniqueBuyerNames } from '../data/useDataService';
import { useData } from '../data/DataProvider';
import { pluralize } from '../data/service';
import { RecordClassBadge, StrategicTagBadge, FormatBadge, EvidenceBadge, ConfidenceBadge, ActionRouteBadge } from '../components/Badges';
import { PrototypeNotice } from '../components/PrototypeNotice';
import type { RecordType, Format, EvidenceTier, Confidence, Territory, ActionRouteStatus, DealRecord } from '../data/types';

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

  const updatedDate = latestVerifiedDate
    ? new Date(latestVerifiedDate + 'T00:00:00')
    : new Date('2026-07-14T00:00:00');
  const updatedDay = updatedDate.getDate();
  const updatedMonthYear = updatedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {!isLive && <PrototypeNotice />}

      <header className="mt-6 mb-6">
        <p className="kicker mb-2">Scoreboard</p>
        <h1 className="text-5xl sm:text-6xl font-extrabold uppercase tracking-tight text-ink-900 font-display leading-none">Deal Board</h1>
        <p className="text-sm text-ink-600 mt-3">Searchable intelligence on who's buying entertainment and what they're acquiring.</p>
      </header>

      {/* Stat strip — three cells, 40px figures, vertical dividers */}
      <div className="grid grid-cols-3 border-t-2 border-b border-ink-900 mb-6">
        <div className="py-4 px-3 text-center border-r border-ink-200">
          <p className="text-[40px] font-extrabold text-signal font-display leading-none">{newThisWeek}</p>
          <p className="text-[11px] text-ink-500 mt-2 uppercase tracking-[0.1em]">New this week</p>
        </div>
        <div className="py-4 px-3 text-center border-r border-ink-200">
          <p className="text-[40px] font-extrabold text-ink-900 font-display leading-none">{allRecords.length}</p>
          <p className="text-[11px] text-ink-500 mt-2 uppercase tracking-[0.1em]">Published records</p>
        </div>
        <div className="py-4 px-3 text-center">
          <p className="text-[40px] font-extrabold text-ink-900 font-display leading-none">{updatedDay}</p>
          <p className="text-[11px] text-ink-500 mt-2 uppercase tracking-[0.1em]">{updatedMonthYear}</p>
        </div>
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
            className="w-full pl-9 pr-3 py-2 text-sm border border-ink-300 bg-white text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-inkred"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortMode)}
            className="text-xs border border-ink-300 px-2 py-2 bg-white text-ink-700 focus:outline-none focus:border-inkred"
          >
            <option value="newest">Newest</option>
            <option value="confidence">Confidence</option>
            <option value="buyer">Buyer</option>
          </select>
          <button
            onClick={() => setView('cards')}
            className={`hidden md:inline-flex p-2 border ${view === 'cards' ? 'bg-ink-900 text-cream-50 border-ink-900' : 'text-ink-500 hover:text-ink-900 border-ink-300'}`}
            aria-label="Ledger view"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setView('table')}
            className={`hidden md:inline-flex p-2 border ${view === 'table' ? 'bg-ink-900 text-cream-50 border-ink-900' : 'text-ink-500 hover:text-ink-900 border-ink-300'}`}
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
          <div className="inline-flex border border-ink-300 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setActiveBoardView('deals')}
              className={`px-2.5 py-1 text-xs font-semibold transition-colors ${activeBoardView === 'deals' ? 'bg-ink-900 text-cream-50' : 'text-ink-600 hover:text-ink-900'}`}
            >
              Confirmed deals
            </button>
            <button
              type="button"
              onClick={() => setActiveBoardView('signals')}
              className={`px-2.5 py-1 text-xs font-semibold transition-colors ${activeBoardView === 'signals' ? 'bg-ink-900 text-cream-50' : 'text-ink-600 hover:text-ink-900'}`}
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
          className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-xs font-semibold transition-colors ${showAdvancedFilters ? 'border-ink-900 bg-cream-50 text-ink-900' : 'border-ink-300 bg-white text-ink-700 hover:border-ink-900'}`}
        >
          <SlidersHorizontal size={13} />
          {showAdvancedFilters ? 'Hide advanced filters' : 'Advanced filters'}
        </button>
      </div>

      {showAdvancedFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4 border border-ink-200 bg-cream-50 p-3">
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
              className="text-xs border border-ink-300 px-2 py-1.5 bg-white text-ink-700 focus:outline-none focus:border-inkred"
              aria-label="Date from"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-ink-500">To</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={e => setFilterDateTo(e.target.value)}
              className="text-xs border border-ink-300 px-2 py-1.5 bg-white text-ink-700 focus:outline-none focus:border-inkred"
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
            className="flex items-center gap-1 text-xs text-inkred font-semibold hover:underline"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* Ledger view — single-column, lead record + rows.
          Mobile always shows ledger; desktop shows ledger unless table view is active. */}
      <div className={view === 'table' ? 'md:hidden' : ''}>
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink-500">No records match these filters.</p>
        ) : (
          <div className="border-t-2 border-ink-900">
            <LeadRow record={filtered[0]} />
            {filtered.slice(1).map((record, i) => (
              <LedgerRow key={record.id} record={record} index={i + 2} />
            ))}
          </div>
        )}
      </div>

      {/* Table view — desktop only, when table view is active */}
      {view === 'table' && (
        <div className="hidden md:block border-t-2 border-ink-900 overflow-hidden bg-white">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-ink-200 bg-cream-50">
                <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500">Date</th>
                <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500">Buyer</th>
                <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500">Headline</th>
                <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500">Class</th>
                <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500">Evidence</th>
                <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500">Confidence</th>
                <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500">Action</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
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
                      <Link to={`/deals/${record.id}`} className="text-xs font-semibold text-inkred hover:underline whitespace-nowrap">
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
  );
}

function LeadRow({ record }: { record: DealRecord }) {
  if (record.locked) {
    return (
      <div className="py-6 flex items-start gap-4 border-b border-ink-100">
        <span className="text-5xl font-extrabold text-signal font-display leading-none shrink-0">01</span>
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-2 text-ink-400">
            <Lock size={14} />
            <span className="text-sm">Subscriber-only record</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/deals/${record.id}`} className="block py-6 border-b border-ink-100 hover:bg-cream-50 transition-colors group">
      <div className="flex items-start gap-4 sm:gap-6">
        <span className="text-5xl sm:text-6xl font-extrabold text-signal font-display leading-none shrink-0">01</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2 items-center">
            <RecordClassBadge recordClass={record.recordClass} />
            {(record.strategicTags ?? []).map(tag => <StrategicTagBadge key={tag} tag={tag} />)}
            <FormatBadge format={record.format} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-ink-900 group-hover:text-inkred transition-colors leading-snug mb-1">{record.headline}</h2>
          <p className="text-sm text-ink-600 leading-relaxed mb-2 line-clamp-2">{record.summary}</p>
          <div className="flex items-center gap-3 text-xs text-ink-500">
            <span className="font-medium text-ink-700">{record.buyer}</span>
            <span className="text-ink-300">|</span>
            <span>{record.date}</span>
            <span className="text-ink-300">|</span>
            <span className="inline-flex items-center gap-0.5 text-inkred font-semibold">
              View record <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function LedgerRow({ record, index }: { record: DealRecord; index: number }) {
  const num = String(index).padStart(2, '0');

  if (record.locked) {
    return (
      <div className="py-4 flex items-start gap-3 sm:gap-4 border-b border-ink-100">
        <span className="text-sm font-bold text-ink-300 font-display shrink-0 w-6 sm:w-8 text-right">{num}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-ink-400">
            <Lock size={12} />
            <span className="text-xs">Subscriber-only record</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/deals/${record.id}`} className="block py-4 border-b border-ink-100 hover:bg-cream-50 transition-colors group">
      <div className="grid grid-cols-[1.5rem_1fr] sm:grid-cols-[2rem_1fr_auto] gap-3 sm:gap-4 items-start">
        <span className="text-sm font-bold text-ink-300 font-display shrink-0 text-right">{num}</span>
        <div className="min-w-0">
          <div className="flex flex-wrap gap-x-2 gap-y-1 mb-1 items-center">
            <RecordClassBadge recordClass={record.recordClass} />
            {(record.strategicTags ?? []).slice(0, 2).map(tag => <StrategicTagBadge key={tag} tag={tag} />)}
            <FormatBadge format={record.format} />
          </div>
          <h3 className="text-sm font-bold text-ink-900 group-hover:text-inkred transition-colors leading-snug">{record.headline}</h3>
          <p className="text-xs text-ink-500 line-clamp-1 mt-0.5 hidden sm:block">{record.summary}</p>
          <div className="sm:hidden mt-1 text-xs text-ink-500">
            <span className="font-medium text-ink-700">{record.buyer}</span>
            <span className="text-ink-300"> · </span>
            <span>{record.date}</span>
          </div>
        </div>
        <div className="hidden sm:block text-xs text-ink-500 text-right whitespace-nowrap shrink-0">
          <p className="font-medium text-ink-700">{record.buyer}</p>
          <p>{record.date}</p>
          <p className="text-inkred font-semibold mt-1 inline-flex items-center gap-0.5">
            Record <ArrowRight size={10} />
          </p>
        </div>
      </div>
    </Link>
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
      className="text-xs border border-ink-300 px-2 py-1.5 bg-white text-ink-700 focus:outline-none focus:border-inkred"
      aria-label={label}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
