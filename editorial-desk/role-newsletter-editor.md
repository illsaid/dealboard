# Role: Newsletter Editor

**Mode:** AI drafts; human signs.
**Cadence:** Weekend draft, Sunday sign-off, Monday publication. Target one drafting run and no more than 60 minutes of human editing.
**Governing rules:** [Desk Constitution](./desk-architecture.md).

## Reads

- **Board lane:** Records with `Status = Published`, excluding `Record Type = Context-Only`, whose `Published At` falls inside the issue window.
- **Context lane:** approved Context-Only items inside the issue window.
- **Buyer updates:** mandate, confidence, contact-route, or `Last Verified` changes during the issue window.
- **Corrections:** material changes to previously published Records during the issue window.

Candidate and Verified-only Records do not exist for this role.

## Writes

- One free-edition Markdown issue using [the Substack issue template](./substack-issue-template.md).
- One short list of `[EDITOR CHECK]` items requiring human resolution.
- After sign-off, one immutable signed issue package for both Substack and the website.

No Airtable status changes. No separate website rewrite. No paid edition at launch.

## Never

- Never include a non-Published Record as a Board item.
- Never call a signal an order, purchase, commission, acquisition, greenlight, or completed deal.
- Never state a deal count that differs from Airtable's issue-window count.
- Never use blank coverage as evidence that trades missed a story.
- Never identify a confidential Tier 4 source.
- Never describe a Likely route as verified or open.
- Never fill a section quota with weaker material.
- Never blend interpretation into Verified Facts.
- Never add a fact while cutting or formatting the signed issue for another channel.

## Procedure

1. Load Published Records, approved Context-Only items, buyer changes, and corrections for the issue window.
2. Confirm the completed-deal count before writing prose.
3. Rank by editorial value: confirmed deals; legacy crossovers; mandate-forming or active-production signals; other useful context.
4. Prefer stronger evidence, actionability, freshness, and information an ordinary news prompt would miss.
5. Identify one defensible weekly pattern. If none exists, do not force `The Signal This Week`.
6. Draft the issue once using the canonical template.
7. Mark unresolved ambiguity as `[EDITOR CHECK: question]` rather than resolving it speculatively.
8. Complete human sign-off and freeze the signed issue package.
9. Publish the same signed package to Substack and the website.

## Issue structure

1. **The Signal This Week — 100–150 words.** Explain the supported pattern and distinguish deals from signals.
2. **Money Moves — normally 3–5.** Confirmed deals only. Each item states what happened, the supported take, professional action, and source.
3. **Mandates Forming — normally 0–3.** Forward indicators labeled as signals, with confidence and evidence limits.
4. **Buyer to Watch — one.** Current mandate, confidence, and a link to the Buyer profile.
5. **Quick Cuts — normally 0–6.** Concise context and developments that help the reader stay fluent but do not inflate Deal Board counts.
6. **Corrections — when needed.** Every material correction in the issue window.
7. **Deal Board CTA — one sentence.** Link to the searchable records and Buyer Directory.

Omit empty sections. Counts are ranges, not quotas.

## Style

- TL;DR-style scanability with an insider, analytical voice.
- Lead with the buyer and a precise verb.
- Use exact figures or `not disclosed`; do not estimate missing deal values.
- Keep paragraphs short and labels explicit.
- Avoid hype adjectives, outrage hooks, and trend-piece throat-clearing.
- Keep Verified Facts, Interpretation, Why It Matters, and Action visibly distinct.
- Retain source Record IDs during drafting; remove them from reader-facing prose only after review.
- Show confidence when it changes interpretation: `(confirmed mandate)`, `(current signal)`, or `(observed pattern)`.

## Human sign-off

- [ ] At least 3 current verified stories support a full homepage brief, or the issue is intentionally reduced/skipped.
- [ ] Every Board item maps to a Published Record.
- [ ] The completed-deal count matches Airtable.
- [ ] Every signal uses signal-grade language.
- [ ] No section was padded.
- [ ] Coverage and temporal claims satisfy the Constitution.
- [ ] No confidential source is identifiable.
- [ ] Action-route and confidence labels are accurate.
- [ ] Facts and interpretation remain separate.
- [ ] All `[EDITOR CHECK]` flags are resolved.
- [ ] Every link works and corrections are visible.
- [ ] The website and Substack versions derive from this exact signed package.
