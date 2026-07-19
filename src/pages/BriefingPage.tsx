import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmailCapture } from '../components/EmailCapture';
import { ConfidenceBadge } from '../components/Badges';
import { useData } from '../data/DataProvider';
import { getLatestIssue } from '../data/service';

export function BriefingPage() {
  const issue = getLatestIssue();
  const { records, buyers } = useData();

  const findRecordId = (match?: string) => {
    if (!match) return undefined;
    const needle = match.toLowerCase();
    return records.find((record) => record.headline.toLowerCase().includes(needle))?.id;
  };

  const buyerId = buyers.find((buyer) =>
    buyer.name.toLowerCase().includes(issue.buyerToWatch.buyerMatch.toLowerCase()),
  )?.id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <header className="border-b border-ink-200 pb-9">
        <p className="kicker mb-4">
          Current brief
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500 mb-4">
          <span className="font-semibold text-ink-700">{issue.issueLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{issue.coverageWindow}</span>
          <span aria-hidden="true">·</span>
          <span>{issue.readTime}</span>
        </div>
        <h1 className="max-w-3xl text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900 leading-[1.08]">
          {issue.headline}
        </h1>
        <p className="max-w-2xl text-base sm:text-lg text-ink-600 leading-relaxed mt-5">
          {issue.deck}
        </p>
        <div className="flex flex-wrap items-center gap-5 mt-6">
          <a
            href={issue.substackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-inkred hover:text-inkred-700"
          >
            Read on Substack <ArrowUpRight size={14} />
          </a>
          <Link
            to="/deals"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-ink-900"
          >
            Search the Deal Board <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <section className="py-9 border-b border-ink-200">
        <SectionTitle title="At a glance" />
        <ul className="mt-5 space-y-3">
          {issue.atAGlance.map((item) => (
            <li key={item} className="flex gap-3 text-sm sm:text-[15px] text-ink-700 leading-relaxed">
              <span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 bg-signal" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="py-9 border-b border-ink-200">
        <SectionTitle title="The Signal This Week" />
        <div className="mt-5 border-l-2 border-signal pl-5 space-y-4">
          {issue.signalThisWeek.map((paragraph) => (
            <p key={paragraph} className="text-sm sm:text-[15px] text-ink-700 leading-7">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="py-9 border-b border-ink-200">
        <SectionTitle title="Money Moves" eyebrow="Confirmed deals" />
        <div className="mt-2 divide-y divide-ink-200">
          {issue.moneyMoves.map((story) => {
            const recordId = findRecordId(story.recordMatch);
            return (
              <article key={story.headline} className="py-8 first:pt-5">
                <h3 className="text-lg sm:text-xl font-bold text-ink-900 leading-snug">
                  {story.headline}
                </h3>
                <LabeledParagraph label="The move" text={story.move} />
                <LabeledParagraph label="The read" text={story.read} />

                {story.action && (
                  <div className="mt-5 border-l-4 border-signal bg-[#FFF1ED] px-4 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-inkred-700">
                      {story.action.label}
                    </p>
                    <p className="text-sm text-ink-700 leading-relaxed mt-1.5">
                      {story.action.description}{' '}
                      <a
                        href={story.action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-inkred underline decoration-signal underline-offset-2"
                      >
                        View route
                      </a>
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
                  <p className="text-xs text-ink-500">
                    {story.sources.length > 1 ? 'Sources: ' : 'Source: '}
                    {story.sources.map((source, index) => (
                      <span key={source.url}>
                        {index > 0 && ' · '}
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-ink-300 underline-offset-2 hover:text-ink-800"
                        >
                          {source.name}
                        </a>
                      </span>
                    ))}
                  </p>
                  {recordId && (
                    <Link
                      to={`/deals/${recordId}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-inkred hover:text-inkred-700"
                    >
                      Full record <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="py-9 border-b border-ink-200">
        <SectionTitle title="Mandates Forming" eyebrow="Signals, not confirmed deals" />
        <div className="mt-5 space-y-7">
          {issue.mandatesForming.map((mandate) => (
            <article key={mandate.buyer}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-ink-900">{mandate.buyer}</h3>
                <ConfidenceBadge confidence={mandate.confidence} />
              </div>
              <LabeledParagraph label="Signal" text={mandate.signal} />
              <LabeledParagraph label="Why it matters" text={mandate.whyItMatters} />
              <p className="text-xs text-ink-500 mt-4">
                Evidence:{' '}
                {mandate.evidence.map((source, index) => (
                  <span key={source.url}>
                    {index > 0 && ' · '}
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-ink-300 underline-offset-2 hover:text-ink-800"
                    >
                      {source.name}
                    </a>
                  </span>
                ))}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-9 border-b border-ink-200">
        <SectionTitle title="Buyer to Watch" />
        <div className="mt-5 border border-ink-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-4">
            <h3 className="text-xl font-extrabold text-ink-900">{issue.buyerToWatch.name}</h3>
            {buyerId && (
              <Link
                to={`/buyers/${buyerId}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-inkred hover:text-inkred-700"
              >
                View buyer profile <ArrowRight size={12} />
              </Link>
            )}
          </div>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <BuyerFact label="Apparent mandate" value={issue.buyerToWatch.apparentMandate} />
            <BuyerFact label="Route" value={issue.buyerToWatch.route} />
            <BuyerFact label="Named executive" value={issue.buyerToWatch.namedExecutive} />
            <BuyerFact label="Still unknown" value={issue.buyerToWatch.unknown} />
          </dl>
        </div>
      </section>

      <section className="py-9">
        <SectionTitle title="Quick Cuts" />
        <div className="mt-3 divide-y divide-ink-200">
          {issue.quickCuts.map((item) => (
            <article key={item.headline} className="py-5">
              <h3 className="text-sm font-bold text-ink-900">{item.headline}</h3>
              <p className="text-sm text-ink-600 leading-relaxed mt-1.5">{item.summary}</p>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs text-ink-500 underline decoration-ink-300 underline-offset-2 hover:text-ink-800"
              >
                {item.sourceName} <ArrowUpRight size={11} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="pt-3">
        <div className="mb-6 text-center">
          <p className="kicker">Get the briefing</p>
          <h2 className="text-xl font-bold text-ink-900 mt-2">The next Pickup, delivered by email</h2>
        </div>
        <EmailCapture />
      </section>
    </div>
  );
}

function SectionTitle({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <h2 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink-900">{title}</h2>
      {eyebrow && <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">{eyebrow}</p>}
    </div>
  );
}

function LabeledParagraph({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-inkred">{label}</p>
      <p className="text-sm sm:text-[15px] text-ink-700 leading-7 mt-1.5">{text}</p>
    </div>
  );
}

function BuyerFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-inkred">{label}</dt>
      <dd className="text-sm text-ink-700 leading-relaxed mt-1">{value}</dd>
    </div>
  );
}
