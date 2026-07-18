import { useData } from '../data/DataProvider';

export function Footer() {
  const { isLive } = useData();

  return (
    <footer className="border-t border-ink-900 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-base font-extrabold tracking-tight text-ink-900 font-display">THE PICKUP</p>
            <p className="text-xs text-ink-500 mt-1">The scoreboard for who's buying entertainment now.</p>
          </div>
          <p className="text-xs text-inkred font-medium uppercase tracking-wide">
            {isLive
              ? 'Live data from verified editorial sources.'
              : 'Prototype demonstration. Not real reporting.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
