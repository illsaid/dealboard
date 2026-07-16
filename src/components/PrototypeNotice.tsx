import { getDataMode } from '../data/service';

export function PrototypeNotice({ always = false }: { always?: boolean }) {
  if (!always && getDataMode() === 'published') return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded px-3 py-2 text-xs text-amber-800 font-medium">
      Prototype — demonstration data. Records shown are fabricated examples for illustration only.
    </div>
  );
}
