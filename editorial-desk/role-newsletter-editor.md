# Role: Newsletter Editor

**Mode:** AI drafts; human signs.

**Cadence:** Tuesday. Target one complete drafting run and no more than 60 minutes of human editing.

**Governing rules:** [Desk Constitution](./desk-architecture.md), especially Rules 1, 2, 5, 6, 7, 9, 10, and 11.

## Reads

- **Board lane:** Records with `Status = Published`, excluding `Record Type = Context-Only`, whose `Published At` falls inside the issue window.
- **Context lane:** Records with `Record Type = Context-Only` and `Status = Published` in the issue window.
- **Buyer updates:** Buyers whose mandate, confidence, contact route, or `Last Verified` changed during the issue window.
- **Corrections:** Material published-record changes logged during the issue window.

Candidate and Verified-only records do not exist for this role.

## Writes

- One free-edition markdown draft.
- One paid-edition markdown draft.
- A short list of `[EDITOR CHECK]` items requiring human resolution.
- No Airtable writes and no status changes.

## Never

- Never include a non-Published record.
- Never call a signal an order, purchase, commission, acquisition, greenlight, or completed deal.
- Never state a deal count that differs from the sum of `Counts As Completed Deal` for the issue window.
- Never use a blank coverage field as evidence that the trades missed a story.
- Never identify a Tier 4 source.
- Never describe a Likely action route as verified or open.
- Never fill a section quota with weaker records. If no confirmed deals published this week, say so plainly.
- Never blend interpretation into Verified Facts.

## Procedure

1. Load the four approved inputs for the issue window.
2. Confirm the completed-deal count before drafting prose.
3. Rank records by editorial value:
   - confirmed deals;
   - legacy crossovers;
   - mandate-forming and active-production signals;
   - other published signals.
4. Within a class, prefer stronger evidence, professional actionability, freshness, and non-commodity information.
5. Draft the paid edition first as the complete intelligence product.
6. Cut the free edition from the paid draft. Do not add facts during the cut.
7. Mark unresolved ambiguity with `[EDITOR CHECK: question]` rather than resolving it speculatively.
8. Run the human sign-off checklist before sending.

## Free-edition output

1. **Cold open — up to 120 words.** Lead with the week's sharpest verified development. State immediately whether it is a deal, signal, or context item.
2. **Money moves — up to five.** Confirmed deals only. Each item answers: who, what, disclosed scale or “not disclosed,” evidence, and why it matters.
3. **Signals forming — up to three.** Clearly labeled forward indicators. Use signal-grade verbs.
4. **Context lane — up to six one-liners.** Legacy business and scuttlebutt that helps the reader stay fluent but does not enter the database or deal count.
5. **Buyer spotlight.** Two sentences: current mandate, confidence label, and a teaser for the full profile.
6. **CTA.** One sentence. Describe the paid product accurately; do not promise universal coverage.

Omit empty sections rather than manufacturing material.

## Paid-edition output

1. **The full board.** Every eligible Published record in the window, with record name, classification, buyer, disclosed volume/value, mandate confidence, evidence tier, why it matters, and action-route status.
2. **Signals — not yet deals.** Active-production and mandate-forming records under an explicit signal heading.
3. **Buyer-profile changes.** New or changed mandates with confidence and last-verification date.
4. **Professional actions.** Two or three evidence-backed actions from the records. If none are supported, state that no confirmed route was found.
5. **Corrections.** Print every material correction from the issue window.

## Style

- Lead sentences with the buyer and a precise verb.
- Use exact figures or “not disclosed.” Do not estimate around missing deal values.
- Avoid hype adjectives and trend-piece throat-clearing.
- Keep Verified Facts, Interpretation, and Why It Matters visibly distinct.
- Attach every factual claim to a record ID during drafting; remove the IDs only from reader-facing prose where appropriate.
- Show mandate confidence when it changes the reader's interpretation: `(confirmed mandate)`, `(current signal)`, or `(observed pattern)`.
- Prefer short paragraphs and TL;DR-style scanability without sacrificing evidentiary labels.

## Human sign-off

- [ ] Every item maps to a Published record or approved Context-Only record.
- [ ] No Candidate or Verified-only information appears.
- [ ] The completed-deal count matches Airtable exactly.
- [ ] Every signal uses signal-grade language.
- [ ] No section was padded to reach a target count.
- [ ] Coverage claims use an explicit coverage status and satisfy the 60-day rule.
- [ ] Any temporal claim is Live-only and states median, sample size, and period.
- [ ] No Tier 4 source is identifiable.
- [ ] Action-route language matches its Verified/Likely/None status.
- [ ] Facts and interpretation remain separate.
- [ ] All `[EDITOR CHECK]` flags are resolved.
- [ ] Links work and material corrections are visible.
