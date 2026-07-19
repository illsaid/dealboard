export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <header className="mb-10">
        <p className="kicker mb-2">About</p>
        <h1 className="text-3xl font-extrabold text-ink-900 font-display">About The Pickup</h1>
        <p className="text-sm text-ink-600 mt-2">The scoreboard for who's buying entertainment now.</p>
      </header>

      {/* What We Do — label-column section */}
      <section className="mb-10 grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-x-6 gap-y-4">
        <p className="text-[11px] font-bold text-ink-900 uppercase tracking-[0.14em] pt-0.5">What we do</p>
        <div className="text-sm text-ink-700 leading-relaxed space-y-3">
          <p>
            The Pickup tracks emerging buyers and new forms of entertainment financing. We focus on
            the companies and platforms that are actively writing checks — and what they are buying.
          </p>
          <p>
            Our coverage includes microdrama platforms, creator studios, brand-funded entertainment,
            FAST channels, digital platforms, new production and distribution models, and legacy studios
            entering these emerging areas.
          </p>
        </div>
      </section>

      {/* What We Track — label-column + numbered rows */}
      <section className="mb-10 grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-x-6 gap-y-4 border-t border-ink-200 pt-6">
        <p className="text-[11px] font-bold text-ink-900 uppercase tracking-[0.14em] pt-0.5">What we track</p>
        <div className="border-t-2 border-b border-ink-900 divide-y divide-ink-100">
          <div className="py-3 grid grid-cols-[2rem_1fr] gap-3">
            <span className="text-sm font-bold text-ink-300 font-display text-right">01</span>
            <span className="text-sm text-ink-700">Confirmed acquisitions, commissions, and partnerships</span>
          </div>
          <div className="py-3 grid grid-cols-[2rem_1fr] gap-3">
            <span className="text-sm font-bold text-ink-300 font-display text-right">02</span>
            <span className="text-sm text-ink-700">Developing signals — executive hires, casting activity, platform expansions</span>
          </div>
          <div className="py-3 grid grid-cols-[2rem_1fr] gap-3">
            <span className="text-sm font-bold text-ink-300 font-display text-right">03</span>
            <span className="text-sm text-ink-700">Legacy crossovers — traditional studios entering emerging formats</span>
          </div>
          <div className="py-3 grid grid-cols-[2rem_1fr] gap-3">
            <span className="text-sm font-bold text-ink-300 font-display text-right">04</span>
            <span className="text-sm text-ink-700">Buyer mandates — what each buyer appears to want, based on public evidence</span>
          </div>
        </div>
      </section>

      {/* Editorial Standards — label-column */}
      <section className="mb-10 grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-x-6 gap-y-4 border-t border-ink-200 pt-6">
        <p className="text-[11px] font-bold text-ink-900 uppercase tracking-[0.14em] pt-0.5">Standards</p>
        <div className="text-sm text-ink-700 leading-relaxed space-y-3">
          <p>
            Every Deal Board record clearly separates verified facts from interpretation. We use an
            evidence-tier system and confidence ratings to signal how much certainty backs each claim.
          </p>
          <p>
            Inferred mandates are labeled as such. We never present speculation as confirmed reporting.
            When we don't know something, we say so.
          </p>
        </div>
      </section>

      {/* How to Read a Record — label-column */}
      <section className="mb-10 grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-x-6 gap-y-4 border-t border-ink-200 pt-6">
        <p className="text-[11px] font-bold text-ink-900 uppercase tracking-[0.14em] pt-0.5">Reading a record</p>
        <div className="border-t-2 border-b border-ink-900 divide-y divide-ink-100 text-xs">
          <p className="py-3"><span className="font-bold text-ink-900">Record class:</span> Confirmed Deal, Developing Signal, or Context.</p>
          <p className="py-3"><span className="font-bold text-ink-900">Strategic tags:</span> Legacy Crossover, Vertical, Creator-led, FAST, and Brand-funded. A record may carry several.</p>
          <p className="py-3"><span className="font-bold text-ink-900">Evidence tier:</span> the strength and type of support for the material claim.</p>
          <p className="py-3"><span className="font-bold text-ink-900">Mandate confidence:</span> High, Medium, or Low confidence in what the evidence says the buyer wants.</p>
          <p className="py-3"><span className="font-bold text-ink-900">Route state:</span> Not researched, Underway, Verified, Likely, or Researched — none identified.</p>
        </div>
      </section>

      {/* Who It's For — label-column */}
      <section className="mb-10 grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-x-6 gap-y-4 border-t border-ink-200 pt-6">
        <p className="text-[11px] font-bold text-ink-900 uppercase tracking-[0.14em] pt-0.5">Who it's for</p>
        <p className="text-sm text-ink-700 leading-relaxed">
          The Pickup is for working entertainment professionals — writers, producers, directors,
          agents, managers, financiers, and executives — who need to know where the money is moving
          and whether there's a legitimate professional action they can take.
        </p>
      </section>

      {/* Evidence Classes — label-column + 2x2 grid */}
      <section className="mb-10 grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-x-6 gap-y-4 border-t border-ink-200 pt-6">
        <p className="text-[11px] font-bold text-ink-900 uppercase tracking-[0.14em] pt-0.5">Evidence classes</p>
        <div>
          <p className="text-sm text-ink-700 leading-relaxed mb-4">
            We record where a signal was discovered separately from the strength of the evidence supporting it. A job board, app catalog, or programming grid is a discovery lane, not an automatic evidence grade.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink-200 border border-ink-200">
            <div className="bg-white p-4">
              <p className="text-[11px] font-bold text-ink-900 uppercase tracking-[0.14em] mb-2">T1 — Primary public evidence</p>
              <p className="text-xs text-ink-600 leading-relaxed">Official announcements, filings, company pages, investor materials, and on-the-record statements.</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-[11px] font-bold text-ink-900 uppercase tracking-[0.14em] mb-2">T2 — Corroborated reporting</p>
              <p className="text-xs text-ink-600 leading-relaxed">Independent, established reporting with attributable sourcing.</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-[11px] font-bold text-ink-900 uppercase tracking-[0.14em] mb-2">T3 — Operational signal</p>
              <p className="text-xs text-ink-600 leading-relaxed">Job and casting activity, app or catalog changes, programming changes, and observable patterns that require interpretation.</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-[11px] font-bold text-ink-900 uppercase tracking-[0.14em] mb-2">T4 — Direct verification</p>
              <p className="text-xs text-ink-600 leading-relaxed">A material claim confirmed directly by a buyer or source. Identity remains confidential unless disclosure is authorized.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10 grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-x-6 gap-y-4 border-t border-ink-200 pt-6">
        <p className="text-[11px] font-bold text-ink-900 uppercase tracking-[0.14em] pt-0.5">Contact</p>
        <div className="text-sm text-ink-700 leading-relaxed">
          <p>
            Send deal tips, corrections, buyer intelligence, partnership inquiries, or questions to{' '}
            <a href="mailto:editor@thepickup.co" className="ledger-link font-semibold">
              editor@thepickup.co
            </a>
            .
          </p>
        </div>
      </section>

      {/* Red poster CTA block */}
      <section className="bg-signal px-6 py-10 sm:px-10 sm:py-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display uppercase tracking-tight leading-tight mb-3">
          Get the briefing
        </h2>
        <p className="text-sm text-white/80 mb-6 max-w-md mx-auto">
          The Pickup is published on Substack. Read it there and subscribe for delivery.
        </p>
        <a
          href="https://thepickupco.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide bg-white text-ink-900 hover:bg-cream-100 transition-colors"
        >
          Read on Substack
        </a>
      </section>
    </div>
  );
}
