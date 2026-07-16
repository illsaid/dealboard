# The Pickup

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-t8k8ug3c)

The Pickup is entertainment buyer intelligence: who is commissioning, funding, acquiring, and expanding now. **The Deal Board** remains the name of the searchable database inside the product.

The website reads its public Deal Board and Buyer Directory from Supabase. Airtable remains the editorial source of truth. A protected Supabase Edge Function performs the one-way publication sync.

See [HANDOFF.md](./HANDOFF.md) for the current production state, known deployment gap, and exact next actions.

## Editorial desk

- [Desk architecture and Constitution](./editorial-desk/desk-architecture.md)
- [Newsletter Editor role](./editorial-desk/role-newsletter-editor.md)
- [Social Cutter role](./editorial-desk/role-social-cutter.md)

## Publication flow

1. Research and verification happen in Airtable.
2. A Record is eligible only when `Status = Published` and the `Website Ready` formula is true.
3. A linked Buyer must have `Publish on Site` enabled and its required public fields completed.
4. The sync validates the full batch before writing anything.
5. Supabase Row Level Security exposes only free, published, unlocked records to the browser.
6. Until at least one complete public record and buyer exist, the frontend keeps the clearly labeled demonstration dataset.

## Current production state

As of July 16, 2026, the production sync contains 6 published buyers and 4 published records. The Supabase data is current, but the public Bolt deployment is stale and still renders the demonstration catalog. Do not rerun the publication sync to fix that frontend problem; publish a current frontend build instead.

The preferred public brand is **The Pickup**, with `thepickup.co` as the intended domain. The codebase has not yet received the full visual/copy rebrand.

## Supabase configuration

Add these Edge Function secrets in the Supabase dashboard; never put them in the repository or Vite environment:

```text
AIRTABLE_PAT
AIRTABLE_BASE_ID
AIRTABLE_RECORDS_TABLE_ID
AIRTABLE_BUYERS_TABLE_ID
SYNC_SECRET
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are supplied by Supabase at runtime.

The browser deployment needs only:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

## Safe first run

Deploy the migration and `sync-airtable-publication` function, then call the function with the `x-sync-secret` header:

```text
POST /functions/v1/sync-airtable-publication?dry_run=true&include_verified=true
```

The dry run reports missing publication fields without writing buyer or deal rows. The production call is the same endpoint without query parameters. It publishes only Airtable rows that pass `Website Ready` and unpublishes rows that no longer pass the gate.
