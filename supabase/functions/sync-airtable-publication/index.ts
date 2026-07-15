import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey, X-Sync-Secret",
};

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface ValidationError {
  airtableId: string;
  slug?: string;
  field: string;
  message: string;
}

// ─── Field mapping helpers ────────────────────────────────────────────────────

function mapEventClass(recordType: string | undefined, wedge: string | undefined): string {
  if (wedge === "Legacy Crossover") return "legacy_crossover";
  if (recordType === "Confirmed Deal") return "confirmed_deal";
  return "developing_signal";
}

function mapRecordType(eventClass: string | undefined): string {
  if (!eventClass) return "development";
  const map: Record<string, string> = {
    "Content Order": "commission",
    "Acquisition / Licensing": "acquisition",
    "Acquisition/Licensing": "acquisition",
    "Development Relationship": "development",
    "Brand-Funded Entertainment": "partnership",
    "Company Capital": "fund_launch",
    "Distribution Expansion": "license",
  };
  return map[eventClass] || "development";
}

function mapActionStatus(status: string | undefined): string {
  if (!status) return "none";
  const map: Record<string, string> = {
    "Verified route": "verified",
    "Likely route": "likely",
    "No confirmed route": "none",
  };
  return map[status] || "none";
}

function mapEvidenceTier(tier: string | undefined): string {
  if (!tier) return "tier_3";
  const map: Record<string, string> = {
    "Tier 1": "tier_1",
    "Tier 2": "tier_2",
    "Tier 3": "tier_3",
    "Tier 4": "tier_4",
  };
  return map[tier] || "tier_3";
}

function mapConfidence(conf: string | undefined): string {
  if (!conf) return "low";
  return conf.toLowerCase();
}

function mapTerritory(territory: string | undefined): string {
  if (!territory) return "global";
  const map: Record<string, string> = {
    Global: "global",
    "North America": "north_america",
    Europe: "europe",
    "Asia Pacific": "asia_pacific",
    "Latin America": "latin_america",
    "Middle East": "middle_east",
  };
  return map[territory] || "global";
}

function mapFormat(format: string | undefined): string {
  if (!format) return "series";
  const map: Record<string, string> = {
    Microdrama: "microdrama",
    "Short Form": "short_form",
    Feature: "feature",
    Series: "series",
    Unscripted: "unscripted",
    Branded: "branded",
    "FAST Channel": "fast_channel",
    Interactive: "interactive",
  };
  return map[format] || "series";
}

function mapBuyerType(type: string | undefined): string {
  if (!type) return "digital_platform";
  const map: Record<string, string> = {
    "Microdrama Platform": "microdrama_platform",
    "Creator Studio": "creator_studio",
    "Brand-Funded": "brand_funded",
    "FAST Channel": "fast_channel",
    "Digital Platform": "digital_platform",
    "Legacy Studio": "legacy_studio",
    Streamer: "streamer",
    Financier: "financier",
  };
  return map[type] || "digital_platform";
}

function asString(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
}

function asStringArray(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((v) => String(v));
  if (typeof val === "string") return val.split("\n").map((s) => s.trim()).filter(Boolean);
  return [];
}

// ─── Airtable pagination ──────────────────────────────────────────────────────

async function fetchAllAirtableRecords(
  baseId: string,
  tableId: string,
  pat: string,
  filterFormula?: string
): Promise<AirtableRecord[]> {
  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams();
    if (filterFormula) params.set("filterByFormula", filterFormula);
    if (offset) params.set("offset", offset);

    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?${params.toString()}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${pat}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Airtable API error (${res.status}): ${text}`);
    }

    const data = await res.json();
    allRecords.push(...(data.records || []));
    offset = data.offset;
  } while (offset);

  return allRecords;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateBuyer(rec: AirtableRecord): ValidationError[] {
  const errors: ValidationError[] = [];
  const f = rec.fields;
  const slug = asString(f["Public Slug"]);

  const required = ["Buyer Name", "Public Slug", "Public Description", "Current Mandate", "Last Verified"];
  for (const field of required) {
    if (!f[field]) {
      errors.push({ airtableId: rec.id, slug, field, message: `Missing required field: ${field}` });
    }
  }
  return errors;
}

function validateRecord(rec: AirtableRecord): ValidationError[] {
  const errors: ValidationError[] = [];
  const f = rec.fields;
  const slug = asString(f["Public Slug"]);

  const required = [
    "Public Slug",
    "Record Name",
    "Official Announcement Date",
    "Public Summary",
    "Why It Matters",
    "Action Route Status",
    "Primary Source URL",
  ];
  for (const field of required) {
    if (!f[field]) {
      errors.push({ airtableId: rec.id, slug, field, message: `Missing required field: ${field}` });
    }
  }

  // Buyer link validation
  const buyerLinks = f["Buyer"] as string[] | undefined;
  if (!buyerLinks || buyerLinks.length === 0) {
    errors.push({ airtableId: rec.id, slug, field: "Buyer", message: "No linked buyer" });
  }

  return errors;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Auth check
    const syncSecret = Deno.env.get("SYNC_SECRET");
    const providedSecret = req.headers.get("x-sync-secret");
    if (!syncSecret || !providedSecret || providedSecret !== syncSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse params
    const url = new URL(req.url);
    const dryRun = url.searchParams.get("dry_run") === "true";
    const includeVerified = url.searchParams.get("include_verified") === "true";

    // include_verified only allowed in dry-run mode
    if (includeVerified && !dryRun) {
      return new Response(
        JSON.stringify({ error: "include_verified is only allowed in dry_run mode" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Environment
    const pat = Deno.env.get("AIRTABLE_PAT");
    const baseId = Deno.env.get("AIRTABLE_BASE_ID");
    const recordsTableId = Deno.env.get("AIRTABLE_RECORDS_TABLE_ID");
    const buyersTableId = Deno.env.get("AIRTABLE_BUYERS_TABLE_ID");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!pat || !baseId || !recordsTableId || !buyersTableId || !supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Missing environment configuration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const startedAt = new Date().toISOString();

    // ─── Fetch from Airtable ────────────────────────────────────────────────
    const recordsFilter = (includeVerified && dryRun)
      ? `OR({Website Ready}=1,{Status}="Verified")`
      : `{Website Ready}=1`;

    let airtableBuyers: AirtableRecord[] = [];
    let airtableRecords: AirtableRecord[] = [];
    const fetchErrors: string[] = [];

    try {
      airtableRecords = await fetchAllAirtableRecords(baseId, recordsTableId, pat, recordsFilter);
    } catch (e) {
      fetchErrors.push(`Records (${recordsTableId}): ${e instanceof Error ? e.message : String(e)}`);
    }

    if (includeVerified && dryRun) {
      // Preview mode: fetch ALL buyers linked from the fetched records, ignoring Publish on Site
      const linkedBuyerIds = new Set<string>();
      for (const r of airtableRecords) {
        const links = r.fields["Buyer"] as string[] | undefined;
        if (links) links.forEach(id => linkedBuyerIds.add(id));
      }
      if (linkedBuyerIds.size > 0) {
        // Fetch buyers by record ID using OR(RECORD_ID()=...) formula
        const idClauses = [...linkedBuyerIds].map(id => `RECORD_ID()="${id}"`);
        const buyerFormula = idClauses.length === 1 ? idClauses[0] : `OR(${idClauses.join(",")})`;
        try {
          airtableBuyers = await fetchAllAirtableRecords(baseId, buyersTableId, pat, buyerFormula);
        } catch (e) {
          fetchErrors.push(`Buyers (${buyersTableId}): ${e instanceof Error ? e.message : String(e)}`);
        }
      }
    } else {
      // Production mode: only buyers with Publish on Site checked
      try {
        airtableBuyers = await fetchAllAirtableRecords(baseId, buyersTableId, pat, `{Publish on Site}=1`);
      } catch (e) {
        fetchErrors.push(`Buyers (${buyersTableId}): ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    if (fetchErrors.length > 0 && airtableBuyers.length === 0 && airtableRecords.length === 0) {
      return new Response(
        JSON.stringify({ error: "Airtable fetch failed", details: fetchErrors }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─── Build buyer slug map ─────────────────────────────────────────────
    const buyerAirtableIdToSlug = new Map<string, string>();
    for (const b of airtableBuyers) {
      const slug = asString(b.fields["Public Slug"]);
      if (slug) buyerAirtableIdToSlug.set(b.id, slug);
    }

    // ─── Validate ────────────────────────────────────────────────────────────
    const recordValidationErrors: ValidationError[] = [];
    const buyerValidationErrors: ValidationError[] = [];

    for (const b of airtableBuyers) {
      buyerValidationErrors.push(...validateBuyer(b));
    }

    for (const r of airtableRecords) {
      recordValidationErrors.push(...validateRecord(r));
    }

    // Determine valid buyers (no validation errors)
    const invalidBuyerIds = new Set(buyerValidationErrors.map(e => e.airtableId));
    const validBuyerAirtableIds = new Set(
      airtableBuyers.filter(b => !invalidBuyerIds.has(b.id)).map(b => b.id)
    );

    // Determine valid records: own fields pass AND at least one linked valid buyer
    const invalidRecordIds = new Set(recordValidationErrors.map(e => e.airtableId));
    const validRecords = airtableRecords.filter(r => {
      if (invalidRecordIds.has(r.id)) return false;
      const buyerLinks = (r.fields["Buyer"] as string[] | undefined) || [];
      return buyerLinks.some(bid => validBuyerAirtableIds.has(bid));
    });
    const validBuyers = airtableBuyers.filter(b => !invalidBuyerIds.has(b.id));

    // Combined errors for logging
    const allValidationErrors = [...recordValidationErrors, ...buyerValidationErrors];

    // ─── Dry-run response ────────────────────────────────────────────────────
    if (dryRun) {
      // Log the dry run
      await supabase.from("sync_runs").insert({
        source: "airtable",
        dry_run: true,
        started_at: startedAt,
        completed_at: new Date().toISOString(),
        buyers_fetched: airtableBuyers.length,
        records_fetched: airtableRecords.length,
        buyers_upserted: 0,
        records_upserted: 0,
        buyers_unpublished: 0,
        records_unpublished: 0,
        validation_errors: allValidationErrors,
      });

      return new Response(
        JSON.stringify({
          dry_run: true,
          include_verified: includeVerified,
          buyers_fetched: airtableBuyers.length,
          buyers_ready: validBuyers.length,
          records_fetched: airtableRecords.length,
          records_ready: validRecords.length,
          record_validation_errors: recordValidationErrors,
          buyer_validation_errors: buyerValidationErrors,
          fetch_errors: fetchErrors.length > 0 ? fetchErrors : undefined,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─── Production write: fail if validation errors exist ───────────────────
    if (allValidationErrors.length > 0) {
      await supabase.from("sync_runs").insert({
        source: "airtable",
        dry_run: false,
        started_at: startedAt,
        completed_at: new Date().toISOString(),
        buyers_fetched: airtableBuyers.length,
        records_fetched: airtableRecords.length,
        buyers_upserted: 0,
        records_upserted: 0,
        buyers_unpublished: 0,
        records_unpublished: 0,
        validation_errors: allValidationErrors,
        error_message: "Validation failed; no records written.",
      });

      return new Response(
        JSON.stringify({
          error: "Validation failed",
          record_validation_errors: recordValidationErrors,
          buyer_validation_errors: buyerValidationErrors,
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─── Upsert buyers ────────────────────────────────────────────────────────
    let buyersUpserted = 0;
    for (const b of validBuyers) {
      const f = b.fields;
      const slug = asString(f["Public Slug"]);

      const buyerRow = {
        id: slug,
        airtable_record_id: b.id,
        name: asString(f["Buyer Name"]),
        type: mapBuyerType(asString(f["Buyer Type"])),
        description: asString(f["Public Description"]),
        primary_formats: asStringArray(f["Primary Formats"]).map(mapFormat),
        territory: mapTerritory(asString(f["HQ / Territory"])),
        current_mandate: asString(f["Current Mandate"]),
        mandate_confidence: mapConfidence(asString(f["Mandate Confidence"])),
        mandate_evidence: asStringArray(f["Mandate Evidence"]),
        contact_route: asString(f["Contact Route"]) || null,
        contact_route_url: asString(f["Contact Route URL"]) || null,
        open_questions: asStringArray(f["Open Questions"]),
        last_verified: asString(f["Last Verified"]) || new Date().toISOString().slice(0, 10),
        is_published: true,
        publish_on_site: true,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("buyers")
        .upsert(buyerRow, { onConflict: "id" });

      if (!error) buyersUpserted++;
    }

    // ─── Upsert records ───────────────────────────────────────────────────────
    let recordsUpserted = 0;
    const syncedRecordSlugs: string[] = [];

    for (const r of validRecords) {
      const f = r.fields;
      const slug = asString(f["Public Slug"]);
      syncedRecordSlugs.push(slug);

      const primarySourceUrl = asString(f["Primary Source URL"]);
      const secondarySourceUrl = asString(f["Secondary Source URL"]);
      const sources: { name: string; url: string; readTime: string }[] = [];
      if (primarySourceUrl) sources.push({ name: "Primary Source", url: primarySourceUrl, readTime: "" });
      if (secondarySourceUrl) sources.push({ name: "Secondary Source", url: secondarySourceUrl, readTime: "" });

      const actionEnabled = f["Professional Action Enabled"] as boolean | undefined;
      const action = {
        status: mapActionStatus(asString(f["Action Route Status"])),
        label: asString(f["Action Label"]) || "",
        description: "",
        url: actionEnabled ? asString(f["Action URL"]) || undefined : undefined,
        evidence: asString(f["Action Evidence"]) || undefined,
      };

      // Resolve buyer links
      const buyerLinks = (f["Buyer"] as string[]) || [];
      const primaryBuyerSlug = buyerLinks.length > 0 ? buyerAirtableIdToSlug.get(buyerLinks[0]) || "" : "";

      const recordRow = {
        id: slug,
        airtable_record_id: r.id,
        date: asString(f["Official Announcement Date"]),
        buyer: "", // will be set from buyer name lookup below
        buyer_id: primaryBuyerSlug,
        headline: asString(f["Record Name"]),
        record_type: mapRecordType(asString(f["Event Class"])),
        event_class: mapEventClass(asString(f["Record Type"]), asString(f["Wedge"])),
        format: mapFormat(asString(f["Format"])),
        territory: mapTerritory(asString(f["Territory"])),
        evidence_tier: mapEvidenceTier(asString(f["Highest Evidence Tier"])),
        confidence: mapConfidence(asString(f["Mandate Confidence"])),
        summary: asString(f["Public Summary"]),
        verified_facts: asStringArray(f["Verified Facts"]),
        interpretation: asString(f["Interpretation"]),
        why_it_matters: asString(f["Why It Matters"]),
        action,
        sources,
        first_captured: asString(f["First Captured"]) || new Date().toISOString().slice(0, 10),
        last_verified: asString(f["Verification Date"]) || new Date().toISOString().slice(0, 10),
        access_level: (asString(f["Access Level"]) || "free").toLowerCase() === "paid" ? "paid" : "free",
        published_at: asString(f["Published At"]) || new Date().toISOString(),
        wedge: asString(f["Wedge"]) || null,
        is_published: true,
        locked: false,
        updated_at: new Date().toISOString(),
      };

      // Resolve buyer name from already-upserted buyers
      const buyerForName = validBuyers.find(vb => asString(vb.fields["Public Slug"]) === primaryBuyerSlug);
      if (buyerForName) {
        recordRow.buyer = asString(buyerForName.fields["Buyer Name"]);
      }

      const { error } = await supabase
        .from("records")
        .upsert(recordRow, { onConflict: "id" });

      if (!error) recordsUpserted++;

      // ─── Rebuild record_buyers links ─────────────────────────────────────
      if (!error) {
        await supabase.from("record_buyers").delete().eq("record_id", slug);
        const links = buyerLinks
          .map((airtableId, idx) => ({
            record_id: slug,
            buyer_id: buyerAirtableIdToSlug.get(airtableId) || "",
            is_primary: idx === 0,
          }))
          .filter((l) => l.buyer_id);
        if (links.length > 0) {
          await supabase.from("record_buyers").insert(links);
        }
      }
    }

    // ─── Unpublish rows no longer passing the publication gate ───────────────
    const syncedBuyerSlugs = validBuyers.map(b => asString(b.fields["Public Slug"]));

    // Buyers: mark is_published=false for previously-synced buyers no longer in the batch
    const { data: existingPublishedBuyers } = await supabase
      .from("buyers")
      .select("id")
      .eq("is_published", true)
      .not("airtable_record_id", "is", null);

    let buyersUnpublished = 0;
    if (existingPublishedBuyers) {
      const toUnpublish = existingPublishedBuyers
        .filter((b: { id: string }) => !syncedBuyerSlugs.includes(b.id));
      if (toUnpublish.length > 0) {
        const { error } = await supabase
          .from("buyers")
          .update({ is_published: false, updated_at: new Date().toISOString() })
          .in("id", toUnpublish.map((b: { id: string }) => b.id));
        if (!error) buyersUnpublished = toUnpublish.length;
      }
    }

    // Records: mark is_published=false for previously-synced records no longer in the batch
    const { data: existingPublishedRecords } = await supabase
      .from("records")
      .select("id")
      .eq("is_published", true)
      .not("airtable_record_id", "is", null);

    let recordsUnpublished = 0;
    if (existingPublishedRecords) {
      const toUnpublish = existingPublishedRecords
        .filter((r: { id: string }) => !syncedRecordSlugs.includes(r.id));
      if (toUnpublish.length > 0) {
        const { error } = await supabase
          .from("records")
          .update({ is_published: false, updated_at: new Date().toISOString() })
          .in("id", toUnpublish.map((r: { id: string }) => r.id));
        if (!error) recordsUnpublished = toUnpublish.length;
      }
    }

    // ─── Log sync run ────────────────────────────────────────────────────────
    await supabase.from("sync_runs").insert({
      source: "airtable",
      dry_run: false,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      buyers_fetched: airtableBuyers.length,
      records_fetched: airtableRecords.length,
      buyers_upserted: buyersUpserted,
      records_upserted: recordsUpserted,
      buyers_unpublished: buyersUnpublished,
      records_unpublished: recordsUnpublished,
      validation_errors: [],
    });

    return new Response(
      JSON.stringify({
        success: true,
        buyers_fetched: airtableBuyers.length,
        records_fetched: airtableRecords.length,
        buyers_upserted: buyersUpserted,
        records_upserted: recordsUpserted,
        buyers_unpublished: buyersUnpublished,
        records_unpublished: recordsUnpublished,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
