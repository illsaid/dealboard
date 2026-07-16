# The Pickup

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-t8k8ug3c)

The Pickup is entertainment buyer intelligence: who is commissioning, funding, acquiring, and expanding now. **Deal Board** is the searchable database inside the publication.

- Live site: [thepickup.co](https://thepickup.co/)
- GitHub: [illsaid/dealboard](https://github.com/illsaid/dealboard)
- Editorial source of truth: Airtable
- Public serving database: Supabase
- Production host: Cloudflare Pages, deployed automatically from GitHub `main`

See [HANDOFF.md](./HANDOFF.md) for the current production state and next actions.

## Current production state

As of July 16, 2026:

- The public site is live at `thepickup.co`.
- The homepage temporarily renders the live Deal Board rather than the fabricated prototype briefing.
- Supabase serves 6 published buyers and 4 published records.
- Airtable publication sync, Supabase RLS, direct record routes, and buyer routes are working.
- The public brand is **The Pickup**. **Deal Board** remains the database-section name.
- Bolt is optional for visual work. GitHub is canonical; do not edit the same branch concurrently in Bolt and another tool.

The old `BriefingPage` and fixture data remain in the codebase as a prototype reference but are not routed publicly. Do not restore them to `/` without replacing every fabricated item with a signed real issue.

## Editorial desk

- [Desk architecture and Constitution](./editorial-desk/desk-architecture.md)
- [Newsletter Editor role](./editorial-desk/role-newsletter-editor.md)
- [Substack issue template](./editorial-desk/substack-issue-template.md)
- [Social Cutter role](./editorial-desk/role-social-cutter.md)

## Publication flow

1. Research and verification happen in Airtable.
2. A Record is eligible only when `Status = Published` and the `Website Ready` formula is true.
3. A linked Buyer must have `Publish on Site` enabled and its required public fields completed.
4. The protected Supabase Edge Function validates the full batch before writing anything.
5. Supabase Row Level Security exposes only free, published, unlocked records to the browser.
6. The Vite frontend reads published records and buyers with the Supabase anonymous key.
7. A merge or fast-forward to GitHub `main` triggers the Cloudflare production deployment.

## Briefing and Substack plan

The first real briefing should publish after one complete editorial cycle, not merely because the site is live. Target Monday publication when the issue has:

- at least 3 genuinely current, verified stories;
- one defensible weekly signal connecting them;
- working source links for every factual claim;
- visible separation between fact, interpretation, and professional action; and
- no fabricated filler.

Launch with one free Monday edition. Do not activate paid Substack subscriptions until the desk has consistent output, meaningful database depth, and evidence that readers return. The signed Substack issue and website homepage brief must be two renderings of the same approved editorial package.

## Supabase configuration

Edge Function secrets; never place these in GitHub, Bolt, or Vite environment variables:

```text
AIRTABLE_PAT
AIRTABLE_BASE_ID
AIRTABLE_RECORDS_TABLE_ID
AIRTABLE_BUYERS_TABLE_ID
SYNC_SECRET
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are supplied by Supabase at runtime.

Public Cloudflare build variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

## Safe publication sync

Call the protected function with the `x-sync-secret` header. Test first:

```text
POST /functions/v1/sync-airtable-publication?dry_run=true&include_verified=true
```

The production call uses the same endpoint without query parameters. It publishes only Airtable rows that pass `Website Ready` and unpublishes rows that no longer pass the gate.
