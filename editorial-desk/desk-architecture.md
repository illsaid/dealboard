# The Deal Board — Editorial Desk Architecture

**Operating principle:** AI drafts; a human verifies and publishes. Airtable states coordinate the work. Roles do not pass untracked prose to one another: they read approved inputs and write defined outputs.

This file is the desk's Constitution. Role files cite these rules and may not weaken or reinterpret them.

## 1. Constitution

1. **Signals are not deals.** Only a record with `Record Type = Confirmed Deal` and `Status = Published` may be described or counted as a completed deal. Everything else keeps its signal or context label.
2. **Nothing publishes without human verification.** Candidate and Verified records are internal. Publication is a separate human decision.
3. **Mandate confidence cannot be silently upgraded.** Observed Pattern remains Observed Pattern until authorized evidence supports a stronger label.
4. **Evidence tier belongs to sources.** `Highest Evidence Tier` is calculated from linked Sources. No role may type or infer a higher tier directly on a record.
5. **Blank coverage fields mean unchecked.** “No broad trade coverage” may be claimed only when the coverage field explicitly says `Checked — no coverage` and the record is at least 60 days old.
6. **Temporal-advantage claims use live observations only.** Report the median, sample size, and measurement period. Never mix backfill with live capture and never substitute an average.
7. **Tier 4 sources remain confidential.** Do not identify a direct source in public output without explicit consent. Publish only the verified fact and an appropriately general source description.
8. **The weekly reproduction test is a product gate.** If fewer than roughly 40% of published records contain material Tier 3 or Tier 4 information missed by the adversarial LLM run, improve the source mix before doing growth work.
9. **Actionability must be evidenced.** A contact route or professional action is `Verified`, `Likely`, or `No confirmed route`. Copy must not turn a likely route into an open submission channel.
10. **Volume targets never override standards.** Thin weeks stay thin. Do not relabel signals, repeat records, or pad sections to reach a promised item count.
11. **Facts and interpretation remain separate.** Verified Facts state what the evidence supports. Interpretation and Why It Matters may explain implications but may not introduce new factual claims.
12. **Corrections are visible.** Material changes to published records appear in the next relevant issue and in the record history.

## 2. Assembly line

```text
INTAKE
Captured → Promoted / Rejected / Duplicate
              │
              ▼
RECORDS
Candidate → Enriched → Verified → Published
                         human       human
                          gate        gate
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
               Newsletter         Social cuts       Board views
                                  (free issue only)

POST-PUBLICATION COVERAGE
Not checked → Covered / Checked — no coverage
```

State meanings:

- **Candidate:** plausibly in scope; not yet trusted.
- **Enriched:** research fields drafted; entity resolution and verification may remain open.
- **Verified:** a human has checked the record, but it is not public.
- **Published:** a human has approved the exact public fields and the website gate passes.
- **Context-Only:** may support newsletter fluency but never enters deal counts or the paid Deal Board.

## 3. Roles

### Daily desk

| Role | Mode | Reads | Writes | Build trigger |
|---|---|---|---|---|
| Intake/Triage Editor | AI draft, human review | Raw Intake | Intake disposition; Candidate draft | Active now |
| Research Desk | AI draft | Candidate records and linked Sources | Enrichment drafts only | When candidates exceed about 10/day |
| Verification Editor | Human only | Enriched records and primary evidence | Final entity resolution, evidence labels, mandate confidence, Verified status | Founder role; permanent |
| Publisher | Human only | Verified records and website gate | Published status and public fields | Founder role; permanent |

### Weekly desk

| Role | Mode | Reads | Writes | Build trigger |
|---|---|---|---|---|
| Newsletter Editor | AI draft, human sign-off | Published records, Context-Only lane, buyer changes | Free and paid markdown drafts | Active now |
| Social Cutter | AI draft, light human review | Signed free edition only | X and LinkedIn copy | Active now |
| Librarian | AI-assisted checklist, human execution | Airtable audit views | Reproduction results, coverage status, dedupe and source-renewal audits | First Friday after publication |

### Later roles

| Role | Mode | Function | Build trigger |
|---|---|---|---|
| Buyer Relations | Human; AI may draft outreach | Profile verification and mandate interviews | First verification call |
| Growth Editor | AI draft, human send | Recommendation swaps, prospecting, founding-member outreach | Only after the payment gate passes |

## 4. Weekly operating rhythm

- **Daily, Monday–Friday (target: 45 minutes or less):** skim feeds, promote plausible items to Intake, run candidate triage, record rejections and duplicates, and make verification touches.
- **Monday:** app-catalog and FAST-grid sweeps.
- **Tuesday:** Newsletter Editor drafts; human completes the sign-off checklist and sends.
- **Wednesday:** Social Cutter works from the signed free edition; human reviews and schedules.
- **Thursday:** buyer-profile verification and direct-source outreach.
- **Friday:** Librarian runs the adversarial reproduction test, updates broad-trade coverage status, checks duplicates, and reviews funnel and source-renewal metrics.

The Friday coverage pass is mandatory. Without it, temporal and exclusivity claims decay silently.

## 5. Role-file contract

Every role file must define:

```text
Role and mode
Cadence
Reads: exact Airtable states or signed artifacts
Writes: exact fields or deliverables
Never: relevant Constitution refusals
Procedure
Output contract
Human gate
```

Role files reference the Constitution rather than maintaining their own competing standards.

## 6. Build order

1. Intake/Triage Editor
2. Newsletter Editor and Social Cutter
3. Librarian checklist after the first published week
4. Research Desk when enrichment, rather than capture, becomes the bottleneck
5. Buyer Relations at the first direct verification call
6. Growth Editor after demonstrated willingness to pay

## 7. Failure conditions

- **Gate bypass:** AI copy ships without a human checking its underlying record.
- **Count inflation:** signal language migrates into deal headlines or promotional copy.
- **Source drift:** RSS becomes the whole product instead of the commodity capture layer.
- **False exclusivity:** an unchecked coverage field becomes “the trades missed this.”
- **Mandate overclaim:** an observed pattern becomes a confirmed buying mandate in prose.
- **Quota padding:** a fixed section size pressures the desk to publish weak material.
- **Voice drift:** specificity gives way to hype, outrage, or generic creator-economy commentary.

The desk voice is dry, specific, and numbers-forward. The evidence supplies the drama.
