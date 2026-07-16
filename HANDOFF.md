# The Pickup — Handoff

**Last updated:** July 16, 2026
**Status:** Backend publication is live; public frontend deployment is stale.

## Product decision

- Public brand: **The Pickup**.
- Intended domain: `thepickup.co` (confirm purchase and DNS before assuming it is connected).
- Database/product feature: **The Deal Board**.
- Positioning: entertainment buyer intelligence — who is commissioning, funding, acquiring, and expanding now.
- Working tagline: **Who's buying entertainment now—and what they want next.**
- The similarly named `thepickup.com` is a Tulsa local-news publication. The overlap was judged acceptable for an MVP because the audience and subject matter differ, but formal trademark clearance should precede heavy brand investment.

## Architecture and source-of-truth order

1. **Airtable** is the editorial source of truth: research, verification, publication fields, Buyers, Sources, Intake, and Records.
2. **Supabase** is the public serving database. It receives a one-way publication sync from Airtable.
3. **The frontend** is a Vite/React static application using the Supabase anonymous key. RLS is the security boundary.
4. **GitHub** should become the canonical deploy source. Bolt has been the builder and is not intended to remain the permanent host.

Never put Airtable tokens, Supabase service-role credentials, or the sync-secret value in GitHub or this file.

## Production resources

- GitHub: `https://github.com/illsaid/dealboard`
- Current public host: `https://the-deal-board-enter-dt7i.bolt.host`
- Supabase organization: `Pickup`
- Supabase project name: `bolt-native-database-68917308`
- Supabase project ref: `aiyhaewirmzwfbemgmon`
- Edge Function: `sync-airtable-publication`
- Function URL: `https://aiyhaewirmzwfbemgmon.supabase.co/functions/v1/sync-airtable-publication`
- Bolt project: `https://bolt.new/~/sb1-t8k8ug3c`

Required Edge Function secret **names**:

- `AIRTABLE_PAT`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_RECORDS_TABLE_ID`
- `AIRTABLE_BUYERS_TABLE_ID`
- `SYNC_SECRET`

Required public build variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Confirmed production state

The July 16 production run succeeded:

```json
{
  "success": true,
  "buyers_fetched": 6,
  "records_fetched": 4,
  "buyers_upserted": 6,
  "records_upserted": 4,
  "buyers_unpublished": 0,
  "records_unpublished": 0
}
```

Published buyers:

- ReelShort
- Netflix
- Spotify
- HOLYWATER / My Drama
- FOX Entertainment
- Samsung TV Plus

The four public records include:

- ReelShort × WWE microdrama partnership
- Netflix's *On Purpose* record, with Spotify linked as a secondary buyer
- Dhar Mann Studios × HOLYWATER/My Drama × FOX 40-title vertical partnership
- Samsung TV Plus × Dhar Mann Studios 13-episode scripted order / *Unlikely Romances*

New Airtable references from the last publication pass:

- HOLYWATER source: `recbiya5qMdePst96`
- Samsung source: `recSRbidCzQuqbYyy`
- HOLYWATER / My Drama buyer: `recKn9SQSoPtfW1Fm`
- FOX Entertainment buyer: `recy3WxacLkT9kZ46`
- Samsung TV Plus buyer: `rec1NckxqpZkyEacw`
- Dhar/HOLYWATER/FOX record: `recM31qdvn8JgsQ9q`
- Samsung/Dhar record: `rec5fIc52Nv098EOQ`
- Linked Intake row: `reckVGokZfjrRYrMg`

New public slugs:

- `dhar-mann-holywater-fox-40-title-vertical-partnership`
- `samsung-tv-plus-dhar-mann-13-original-scripted-episodes`

## Security state

- Anonymous users can read only buyers where `is_published = true`.
- Anonymous users can read only records where `is_published = true`, `access_level = 'free'`, and `locked = false`.
- Anonymous/authenticated browser roles have no write policies for Buyers or Records.
- The browser uses only the Supabase URL and anonymous key.
- The publication function requires `x-sync-secret` and uses server-side credentials.
- Do not weaken RLS merely because the frontend also filters published rows.

## Current blocker

Supabase contains the correct live rows, but the public Bolt host still shows 12 fabricated records and an `Updated July 14, 2026` timestamp. This is a stale frontend deployment, not a database or sync failure. Bolt was reporting platform issues when publication was attempted.

**Do not rerun the Airtable sync.** Publish a current frontend build after Bolt recovers, or deploy the GitHub project through Vercel/Cloudflare Pages.

## Repository state and reconciliation warning

- Local branch at handoff preparation: `agent/airtable-supabase-sync`.
- Remote `main` was still at commit `61f6dd1` before this handoff work.
- The integration files began as uncommitted local changes.
- The known Bolt changes have been reconstructed locally: published-only reads, `record_buyers` joins, secondary-buyer profile discovery, and multi-buyer display on record pages.
- The local Edge Function response contract was reconciled to the observed production responses, but its source has not been downloaded byte-for-byte from the deployed Supabase function. Compare the deployed function before any future redeploy.

## Next actions, in order

1. Restore GitHub authentication and publish the current branch as a draft PR.
2. Compare/export the current Bolt workspace and deployed Supabase function against this branch; preserve any newer changes.
3. Run `npm run typecheck`, `npm run lint`, and `npm run build`.
4. Deploy the static frontend from GitHub with the two public Supabase environment variables.
5. Verify `/deals` shows exactly 4 live records and no demonstration records.
6. Replace the prototype homepage briefing and subscription form with truthful live/beta content.
7. Apply the full **The Pickup** visual and copy rebrand.
8. Connect `thepickup.co`, add analytics and legal/methodology pages, then launch as a free beta.

## Editorial guardrail

The paid differentiation is not Tier-1 news aggregation. Feedly, Google News, press releases, and trades are discovery inputs. The product must continue to earn its value through Tier-3 fragmented signals, Tier-4 direct verification, mandate interpretation, and professional actionability. Do not automate the harvester ahead of the payment test.
