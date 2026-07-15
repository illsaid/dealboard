import { useData } from '../data/DataProvider';

export function Footer() {
  const { isLive } = useData();

  return (
    <footer className="border-t border-ink-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-ink-900">THE DEAL BOARD</p>
            <p className="text-xs text-ink-500 mt-0.5">The scoreboard for who's buying entertainment now.</p>
          </div>
          <p className="text-xs text-ink-400">
            {isLive
              ? 'Live data from verified editorial sources.'
              : 'Prototype demonstration. Not real reporting.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
