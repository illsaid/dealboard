# The Pickup — Handoff

**Last updated:** July 16, 2026
**Status:** Public beta is live. Deal Board data is live; the first real weekly briefing has not yet published.

## Product decision

- Public brand: **The Pickup**.
- Public domain: [thepickup.co](https://thepickup.co/).
- Database feature: **Deal Board**.
- Positioning: entertainment buyer intelligence—who is commissioning, funding, acquiring, and expanding now.
- Working tagline: **The scoreboard for who's buying entertainment now.**
- The similarly named `thepickup.com` is a Tulsa local-news publication. The overlap was accepted for MVP testing; formal clearance should precede heavy brand investment.

## Source-of-truth order

1. **Airtable** — editorial source of truth for Intake, Sources, Records, Buyers, verification, and publication decisions.
2. **Supabase** — public serving database populated by a one-way protected Airtable sync.
3. **GitHub `main`** — canonical frontend source and Cloudflare production trigger.
4. **Cloudflare Pages** — production frontend host for `thepickup.co`.
5. **Bolt** — optional UI builder only. It is not the source of truth; use a feature branch and never edit the same branch concurrently elsewhere.

Never put Airtable tokens, Supabase service-role credentials, or the sync-secret value in GitHub, Cloudflare public variables, or this file.

## Production resources

- Public site: `https://thepickup.co/`
- GitHub: `https://github.com/illsaid/dealboard`
- Local project: `C:\Users\dicku\OneDrive\Documents\b2b-business-system-v1\projects\dealboard`
- Supabase organization: `Pickup`
- Supabase project name: `bolt-native-database-68917308`
- Supabase project ref: `aiyhaewirmzwfbemgmon`
- Edge Function: `sync-airtable-publication`
- Function URL: `https://aiyhaewirmzwfbemgmon.supabase.co/functions/v1/sync-airtable-publication`
- Bolt project: `https://bolt.new/~/sb1-t8k8ug3c`

Required Edge Function secret names:

- `AIRTABLE_PAT`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_RECORDS_TABLE_ID`
- `AIRTABLE_BUYERS_TABLE_ID`
- `SYNC_SECRET`

Required public Cloudflare build variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Confirmed production state

The July 16 production sync succeeded with 6 buyers and 4 records. Anonymous RLS reads and the production UI were verified afterward.

Published buyers:

- ReelShort
- Netflix
- Spotify
- HOLYWATER / My Drama
- FOX Entertainment
- Samsung TV Plus

Published records:

- ReelShort × WWE microdrama partnership
- Netflix × Spotify × Jay Shetty *On Purpose* distribution and advertising partnership
- Dhar Mann Studios × HOLYWATER/My Drama × FOX 40-title vertical partnership
- Samsung TV Plus × Dhar Mann Studios 13-episode scripted order / *Unlikely Romances*

Public record slugs include:

- `reelshort-wwe-live-action-microdrama-partnership`
- `netflix-spotify-jay-shetty-on-purpose-video-partnership`
- `dhar-mann-holywater-fox-40-title-vertical-partnership`
- `samsung-tv-plus-dhar-mann-13-original-scripted-episodes`

## Frontend state

- Production commit at launch correction: `060b8a8`.
- `/` renders the live Deal Board with 4 records.
- `/deals` remains a compatible Deal Board route.
- `/buyers` renders 6 public buyers.
- Header, footer, About, Subscribe, and browser title use **The Pickup**.
- `BriefingPage.tsx` and its fixture files are retained only as prototype references and are not publicly routed.
- The newsletter capture UI is still a prototype; do not represent it as a working subscription system until Substack or another real collection path is connected.

## Security state

- Anonymous users can read only buyers where `is_published = true`.
- Anonymous users can read only records where `is_published = true`, `access_level = 'free'`, and `locked = false`.
- Anonymous/authenticated browser roles have no write policies for Buyers or Records.
- The browser uses only the Supabase URL and anonymous key.
- The publication function requires `x-sync-secret` and uses server-side credentials.
- Do not weaken RLS merely because the frontend also filters published rows.

## Briefing launch decision

The Deal Board remains the homepage until a real issue clears the publication gate:

1. At least 3 current, verified stories from the issue window.
2. One defensible `The Signal This Week` synthesis.
3. Working source links for every factual claim.
4. Facts, interpretation, and professional action visibly separated.
5. No fabricated or quota-filling items.

When the gate clears:

1. Produce one signed issue package from Airtable Published records.
2. Send the free Monday edition through Substack.
3. Render the same signed package on the website homepage.
4. Restore **Latest Briefing** navigation; retain Deal Board at `/deals`.
5. Cut social copy only from the signed free edition.

Do not activate a paid Substack tier yet. Revisit paid access only after consistent weekly output, sufficient database depth, and evidence of repeat readership.

## Next actions

1. Configure The Pickup's Substack identity, About copy, welcome email, and reusable issue template.
2. Complete the first full Friday-to-Sunday editorial close.
3. Publish Issue #1 on a Monday only if it clears the briefing gate.
4. Replace the prototype subscription form with the real Substack signup path.
5. Add a database-backed briefing model or an approved publication artifact so the website and email cannot drift.
6. Add methodology, corrections, and privacy pages before active audience acquisition.
7. Add analytics only after the publication flow is stable.

## Validation completed

- `npm run typecheck`
- `npm run lint` — zero errors; existing Fast Refresh warnings only
- `npm run build`
- Live verification of `/`, `/deals`, `/buyers`, record links, Supabase counts, and the **The Pickup** public branding

## Editorial guardrail

The paid differentiation is not Tier-1 news aggregation. Feedly, Google News, press releases, and trades are discovery inputs. The product must earn its value through Tier-3 fragmented signals, Tier-4 direct verification, mandate interpretation, and professional actionability. Do not automate the harvester ahead of the payment test.
