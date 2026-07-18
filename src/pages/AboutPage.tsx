export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <header className="mb-10">
        <p className="kicker mb-2">About</p>
        <h1 className="text-3xl font-extrabold text-ink-900 font-display">About The Pickup</h1>
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
        <ul className="space-y-1 text-ink-600">
          <li className="flex items-start gap-2"><span className="shrink-0 mt-1.5 w-1.5 h-1.5 bg-ink-400"></span>Confirmed acquisitions, commissions, and partnerships</li>
          <li className="flex items-start gap-2"><span className="shrink-0 mt-1.5 w-1.5 h-1.5 bg-ink-400"></span>Developing signals — executive hires, casting activity, platform expansions</li>
          <li className="flex items-start gap-2"><span className="shrink-0 mt-1.5 w-1.5 h-1.5 bg-ink-400"></span>Legacy crossovers — traditional studios entering emerging formats</li>
          <li className="flex items-start gap-2"><span className="shrink-0 mt-1.5 w-1.5 h-1.5 bg-ink-400"></span>Buyer mandates — what each buyer appears to want, based on public evidence</li>
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

        <h2 className="text-lg font-bold text-ink-900 pt-4">How to read a record</h2>
        <div className="border-t border-b border-ink-900 divide-y divide-ink-100 text-xs">
          <p className="py-3"><span className="font-bold text-ink-900">Record class:</span> Confirmed Deal, Developing Signal, or Context.</p>
          <p className="py-3"><span className="font-bold text-ink-900">Strategic tags:</span> Legacy Crossover, Vertical, Creator-led, FAST, and Brand-funded. A record may carry several.</p>
          <p className="py-3"><span className="font-bold text-ink-900">Evidence tier:</span> the strength and type of support for the material claim.</p>
          <p className="py-3"><span className="font-bold text-ink-900">Mandate confidence:</span> High, Medium, or Low confidence in what the evidence says the buyer wants.</p>
          <p className="py-3"><span className="font-bold text-ink-900">Route state:</span> Not researched, Underway, Verified, Likely, or Researched — none identified.</p>
        </div>

        <h2 className="text-lg font-bold text-ink-900 pt-4">Who it's for</h2>
        <p>
          The Pickup is for working entertainment professionals — writers, producers, directors,
          agents, managers, financiers, and executives — who need to know where the money is moving
          and whether there's a legitimate professional action they can take.
        </p>

        <h2 className="text-lg font-bold text-ink-900 pt-4">Evidence quality</h2>
        <p>
          We record where a signal was discovered separately from the strength of the evidence supporting it. A job board, app catalog, or programming grid is a discovery lane, not an automatic evidence grade.
        </p>
        <div className="border-t border-b border-ink-900 divide-y divide-ink-100">
          <div className="py-3">
            <p className="font-bold text-ink-900 text-xs uppercase tracking-[0.14em] mb-1">Tier 1 — Primary public evidence</p>
            <p className="text-xs text-ink-600">Official announcements, filings, company pages, investor materials, and on-the-record statements.</p>
          </div>
          <div className="py-3">
            <p className="font-bold text-ink-900 text-xs uppercase tracking-[0.14em] mb-1">Tier 2 — Corroborated reporting</p>
            <p className="text-xs text-ink-600">Independent, established reporting with attributable sourcing.</p>
          </div>
          <div className="py-3">
            <p className="font-bold text-ink-900 text-xs uppercase tracking-[0.14em] mb-1">Tier 3 — Operational signal</p>
            <p className="text-xs text-ink-600">Job and casting activity, app or catalog changes, programming changes, and observable patterns that require interpretation.</p>
          </div>
          <div className="py-3">
            <p className="font-bold text-ink-900 text-xs uppercase tracking-[0.14em] mb-1">Tier 4 — Direct verification</p>
            <p className="text-xs text-ink-600">A material claim confirmed directly by a buyer or source. Identity remains confidential unless disclosure is authorized.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-ink-900 pt-6">
        <p className="text-xs font-bold text-ink-900 uppercase tracking-[0.14em] mb-3">Get the briefing</p>
        <p className="text-sm text-ink-700 mb-4">The Pickup is published on Substack. Read it there and subscribe for delivery.</p>
        <a
          href="https://thepickupco.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wide bg-ink-900 text-cream-50 hover:bg-inkred transition-colors"
        >
          Read on Substack
        </a>
      </section>
    </div>
  );
}
