# The Pickup — Editorial Desk Architecture

**Operating principle:** AI handles high-recall collection and drafting; a human verifies and publishes. Airtable states coordinate the work. The signed issue package is the single source for Substack, the website briefing, and social cuts.

This file is the desk's Constitution. Role files may add procedure but may not weaken these rules.

## 1. Constitution

1. **Signals are not deals.** Only `Record Type = Confirmed Deal` and `Status = Published` may be described or counted as a completed deal.
2. **Nothing publishes without human verification.** Candidate and Verified records are internal. Published is a separate human decision.
3. **Mandate confidence cannot be silently upgraded.** Observed Pattern remains Observed Pattern until authorized evidence supports more.
4. **Evidence tier belongs to Sources.** `Highest Evidence Tier` is calculated from linked Sources; no role types a preferred tier onto a Record.
5. **Blank coverage fields mean unchecked.** “No broad trade coverage” requires `Checked — no coverage` and a record at least 60 days old.
6. **Temporal-advantage claims use Live capture only.** Report median, sample size, and period; never mix backfill into the calculation.
7. **Tier 4 sources remain confidential.** Publish the verified fact and a general source description unless the source explicitly consents to identification.
8. **The reproduction test is a product gate.** If fewer than roughly 40% of published records contain material Tier 3 or Tier 4 information missed by the adversarial LLM run, improve sourcing before growth work.
9. **Actionability must be evidenced.** A route is `Verified`, `Likely`, or `No confirmed route`; copy may not upgrade it.
10. **Volume targets never override standards.** Thin weeks stay thin. Do not relabel, repeat, or pad.
11. **Facts and interpretation remain separate.** Interpretation may explain verified evidence but may not introduce new factual claims.
12. **Corrections are visible.** Material changes appear in the next relevant issue and record history.

## 2. Assembly line

```text
RAW CAPTURE
    ↓
INTAKE: Captured → Promoted / Rejected / Duplicate
    ↓
RECORDS: Candidate → Enriched → Verified → Published
                                  human      human
                                   gate       gate
                                               ↓
                         SIGNED WEEKLY ISSUE PACKAGE
                         ├── Substack email
                         ├── Website briefing
                         └── Social cuts

PUBLISHED RECORDS ───────────────────────────→ Deal Board
PUBLISHED BUYERS ────────────────────────────→ Buyer Directory
```

State meanings:

- **Candidate:** plausibly in scope; not trusted.
- **Enriched:** research fields drafted; verification may remain open.
- **Verified:** checked by a human but not public.
- **Published:** exact public fields approved and the website gate passes.
- **Context-Only:** newsletter fluency only; never enters the Deal Board or deal counts.

## 3. Roles

### Daily desk

| Role | Mode | Reads | Writes |
|---|---|---|---|
| Intake/Triage Editor | AI draft, human review | Raw Intake | Disposition and Candidate drafts |
| Research Desk | AI draft | Candidate Records and Sources | Enrichment drafts only |
| Verification Editor | Human | Enriched Records and primary evidence | Final evidence labels, confidence, entity resolution, Verified status |
| Publisher | Human | Verified Records and publication gate | Public fields and Published status |

### Weekly desk

| Role | Mode | Reads | Writes |
|---|---|---|---|
| Newsletter Editor | AI draft, human sign-off | Published Records, Context-Only lane, buyer changes, corrections | One signed free issue package |
| Social Cutter | AI draft, light human review | Signed free issue only | X and LinkedIn copy |
| Librarian | AI-assisted checklist, human execution | Airtable audit views | Reproduction results, trade-coverage status, dedupe and source-renewal audit |

### Later roles

| Role | Function | Build trigger |
|---|---|---|
| Buyer Relations | Profile verification and direct mandate interviews | First verification call |
| Growth Editor | Recommendation swaps, partnerships, founding-member outreach | After willingness-to-pay evidence |

## 4. Weekly operating rhythm

- **Daily, Monday–Friday; target under 45 minutes:** skim discovery sources, promote plausible items, run candidate triage, record rejections and duplicates, and make verification touches.
- **Monday:** publish the signed free issue to Substack and the website; verify links and Deal Board counts.
- **Tuesday:** Social Cutter works only from the signed issue; human reviews and schedules.
- **Wednesday:** app-catalog, casting-board, FAST-grid, and other Tier 3 sweeps.
- **Thursday:** buyer-profile verification and direct-source outreach.
- **Friday:** adversarial reproduction test, broad-trade coverage updates, dedupe review, source-renewal audit, and preliminary issue shortlist.
- **Weekend:** Newsletter Editor drafts; human resolves checks and signs by Sunday evening.

The Friday coverage pass is mandatory. Without it, temporal and exclusivity claims decay silently.

## 5. Briefing publication gate

The Deal Board remains the website homepage until a real issue has:

1. at least 3 current, verified stories from the issue window;
2. one defensible `The Signal This Week` synthesis;
3. working source links for every factual claim;
4. visible separation between fact, interpretation, and professional action; and
5. no fabricated or quota-filling material.

If the gate fails, keep the Deal Board homepage and skip or reduce the issue. Do not manufacture a “weekly” package.

## 6. Channel contract

- **Airtable:** editorial facts and publication states.
- **Signed issue package:** canonical weekly prose.
- **Substack:** email distribution and audience relationship.
- **Website homepage:** web rendering of the same signed issue, never an independently rewritten version.
- **Deal Board:** structured Published records and Buyers; it is not a transcript of the newsletter.
- **Social:** cuts from the signed free issue only.

Launch free. Paid Substack access remains disabled until the desk demonstrates consistent output, useful database depth, and repeat readership.

## 7. Failure conditions

- AI copy ships without human verification.
- Signals migrate into deal language or counts.
- RSS becomes the product instead of the commodity capture layer.
- Unchecked coverage becomes an exclusivity claim.
- An observed pattern becomes a confirmed mandate.
- A section quota pressures the desk to publish weak material.
- Substack and the website contain different factual versions of the same issue.
- Specificity gives way to hype, outrage, or generic creator-economy commentary.

The voice is dry, specific, lightly sharp, and numbers-forward. The evidence supplies the drama.
