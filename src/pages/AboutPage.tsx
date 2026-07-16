import { EmailCapture } from '../components/EmailCapture';

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-ink-900">About The Pickup</h1>
        <p className="text-sm text-ink-600 mt-2">The scoreboard for who's buying entertainment now.</p>
      </header>

      <section className="space-y-6 text-sm text-ink-700 leading-relaxed mb-10">
        <p>
          The Pickup tracks emerging buyers and new forms of entertainment financing. We focus on
          the companies and platforms that are actively writing checks — and what they are buying.
        </p>
        <p>
          Our coverage includes microdrama platforms, creator studios, brand-funded entertainment,
          FAST channels, digital platforms, new production and distribution models, and legacy studios
          entering these emerging areas.
        </p>

        <h2 className="text-lg font-bold text-ink-900 pt-4">What we track</h2>
        <ul className="list-disc list-inside space-y-1 text-ink-600">
          <li>Confirmed acquisitions, commissions, and partnerships</li>
          <li>Developing signals — executive hires, casting activity, platform expansions</li>
          <li>Legacy crossovers — traditional studios entering emerging formats</li>
          <li>Buyer mandates — what each buyer appears to want, based on public evidence</li>
        </ul>

        <h2 className="text-lg font-bold text-ink-900 pt-4">Our editorial standards</h2>
        <p>
          Every Deal Board record clearly separates verified facts from interpretation. We use an
          evidence-tier system and confidence ratings to signal how much certainty backs each claim.
        </p>
        <p>
          Inferred mandates are labeled as such. We never present speculation as confirmed reporting.
          When we don't know something, we say so.
        </p>

        <h2 className="text-lg font-bold text-ink-900 pt-4">Who it's for</h2>
        <p>
          The Pickup is for working entertainment professionals — writers, producers, directors,
          agents, managers, financiers, and executives — who need to know where the money is moving
          and whether there's a legitimate professional action they can take.
        </p>

        <h2 className="text-lg font-bold text-ink-900 pt-4">Evidence tiers</h2>
        <div className="space-y-3">
          <div className="border border-ink-100 rounded-lg p-3 bg-white">
            <p className="font-semibold text-ink-900 text-xs uppercase tracking-wide mb-1">Tier 1 — Primary source</p>
            <p className="text-xs text-ink-600">Official announcements, SEC filings, confirmed press releases, on-the-record interviews.</p>
          </div>
          <div className="border border-ink-100 rounded-lg p-3 bg-white">
            <p className="font-semibold text-ink-900 text-xs uppercase tracking-wide mb-1">Tier 2 — Trade reporting</p>
            <p className="text-xs text-ink-600">Established trade publication reporting, job postings, app store data, industry conference statements.</p>
          </div>
          <div className="border border-ink-100 rounded-lg p-3 bg-white">
            <p className="font-semibold text-ink-900 text-xs uppercase tracking-wide mb-1">Tier 3 — Inference</p>
            <p className="text-xs text-ink-600">Pattern recognition, social media signals, unconfirmed reports. Lowest certainty.</p>
          </div>
        </div>
      </section>

      <EmailCapture />
    </div>
  );
}
