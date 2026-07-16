import { createClient } from "npm:@supabase/supabase-js@2";

type AirtableRecord = {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
};

type ValidationError = {
  airtableId: string;
  slug: string;
  field: string;
  message: string;
};

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type, x-sync-secret",
  "access-control-allow-methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}

function requiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required secret: ${name}`);
  return value;
}

function selectName(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "name" in value) {
    return String((value as { name: unknown }).name ?? "");
  }
  return "";
}

function textValue(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (Array.isArray(value) && value.length > 0) return textValue(value[0]);
  return "";
}

function numberValue(value: unknown): number {
  if (typeof value === "number") return value;
  const parsed = Number(textValue(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

function splitLines(value: unknown): string[] {
  return textValue(value)
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function linkedIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === "string") return [item];
    if (item && typeof item === "object" && "id" in item) {
      return [String((item as { id: unknown }).id)];
    }
    return [];
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function normalizeTerritory(value: unknown) {
  const territory = textValue(value).toLowerCase();
  if (/latin|mexico|south america/.test(territory)) return "latin_america";
  if (/europe|uk|united kingdom|france|germany|spain|italy/.test(territory)) return "europe";
  if (/asia|china|japan|korea|india|australia|pacific/.test(territory)) return "asia_pacific";
  if (/middle east|mena|uae|saudi/.test(territory)) return "middle_east";
  if (/north america|united states|usa|canada|los angeles|new york/.test(territory)) return "north_america";
  return "global";
}

const recordTypeMap: Record<string, string> = {
  "Content Order": "commission",
  "Acquisition / Licensing": "acquisition",
  "Acquisition/Licensing": "acquisition",
  "Development Relationship": "development",
  "Brand-Funded Entertainment": "partnership",
  "Company Capital": "fund_launch",
  "Distribution Expansion": "license",
};

const formatMap: Record<string, string> = {
  "Microdrama / Vertical Fiction": "microdrama",
  "Creator-Led Episodic": "series",
  "Creator-led Episodic": "series",
  "Brand-Funded Series": "branded",
  "Branded Entertainment": "branded",
  "FAST / AVOD Original": "fast_channel",
  "Digital Studio / Fund Slate": "series",
  "Video Podcast": "unscripted",
  "Other": "series",
};

const buyerTypeMap: Record<string, string> = {
  "Microdrama / Vertical Platform": "microdrama_platform",
  "Creator Studio": "creator_studio",
  "Brand / Agency": "brand_funded",
  "FAST / AVOD Channel": "fast_channel",
  "Digital Studio / Content Fund": "digital_platform",
  "Legacy Crossover": "legacy_studio",
  "Other": "digital_platform",
};

function normalizeConfidence(value: unknown) {
  const confidence = selectName(value);
  if (confidence === "Confirmed Mandate") return "high";
  if (confidence === "Current Signal") return "medium";
  return "low";
}

function normalizeEventClass(fields: Record<string, unknown>) {
  if (selectName(fields.Wedge) === "Legacy Crossover") return "legacy_crossover";
  if (selectName(fields["Record Type"]) === "Confirmed Deal") return "confirmed_deal";
  return "developing_signal";
}

function normalizeActionStatus(value: unknown) {
  const status = selectName(value);
  if (status === "Verified route") return "verified";
  if (status === "Likely route") return "likely";
  return "none";
}

function sourceFromUrl(value: unknown) {
  const url = textValue(value);
  if (!url) return null;
  let name = "Source";
  try {
    name = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    // Airtable already validates URL fields; retain a neutral label if needed.
  }
  return { name, url, readTime: "" };
}

async function fetchAirtableTable(
  baseId: string,
  tableId: string,
  token: string,
  filterByFormula?: string,
) {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);
    url.searchParams.set("pageSize", "100");
    if (filterByFormula) url.searchParams.set("filterByFormula", filterByFormula);
    if (offset) url.searchParams.set("offset", offset);

    const response = await fetch(url, {
      headers: { authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`Airtable ${tableId} request failed (${response.status})`);
    }

    const payload = await response.json() as {
      records?: AirtableRecord[];
      offset?: string;
    };
    records.push(...(payload.records ?? []));
    offset = payload.offset;
  } while (offset);

  return records;
}

function mapBuyer(record: AirtableRecord, errors: ValidationError[]) {
  const fields = record.fields;
  const name = textValue(fields["Buyer Name"]);
  const slug = textValue(fields["Public Slug"]);
  const description = textValue(fields["Public Description"]);
  const mandate = textValue(fields["Current Mandate"]);
  const lastVerified = textValue(fields["Last Verified"]);

  const missing = [
    ["Buyer Name", name],
    ["Public Slug", slug],
    ["Public Description", description],
    ["Current Mandate", mandate],
    ["Last Verified", lastVerified],
  ].filter(([, value]) => !value).map(([field]) => field);

  if (missing.length > 0) {
    errors.push(...missing.map((field) => ({
      airtableId: record.id,
      slug,
      field,
      message: `Missing required field: ${field}`,
    })));
    return null;
  }

  return {
    id: slugify(slug),
    airtable_record_id: record.id,
    name,
    type: buyerTypeMap[selectName(fields["Buyer Type"])] ?? "digital_platform",
    description,
    primary_formats: [] as string[],
    territory: normalizeTerritory(fields["HQ / Territory"]),
    current_mandate: mandate,
    mandate_confidence: normalizeConfidence(fields["Mandate Confidence"]),
    mandate_evidence: splitLines(fields["Mandate Evidence"]),
    recent_activity: "",
    activity_timeline: [] as Array<{ date: string; event: string }>,
    contact_route: textValue(fields["Contact Route"]) || null,
    contact_route_url: textValue(fields["Contact Route URL"]) || null,
    open_questions: splitLines(fields["Open Questions"]),
    last_verified: lastVerified,
    publish_on_site: true,
    is_published: true,
    updated_at: new Date().toISOString(),
  };
}

function mapDealRecord(
  record: AirtableRecord,
  buyersByAirtableId: Map<string, ReturnType<typeof mapBuyer>>,
  errors: ValidationError[],
) {
  const fields = record.fields;
  const recordKind = selectName(fields["Record Type"]);
  if (recordKind === "Context-Only") {
    errors.push({
      airtableId: record.id,
      slug: textValue(fields["Public Slug"]),
      field: "Record Type",
      message: "Context-Only records belong in briefing context, not the Deal Board table.",
    });
    return null;
  }

  const slug = textValue(fields["Public Slug"]);
  const headline = textValue(fields["Record Name"]);
  const date = textValue(fields["Official Announcement Date"]);
  const summary = textValue(fields["Public Summary"]);
  const whyItMatters = textValue(fields["Why It Matters"]);
  const actionStatus = selectName(fields["Action Route Status"]);
  const buyerIds = linkedIds(fields.Buyer);
  const availableBuyers = buyerIds
    .map((id) => buyersByAirtableId.get(id))
    .filter((buyer): buyer is NonNullable<typeof buyer> => Boolean(buyer));
  const primaryBuyer = availableBuyers[0];

  const missing = [
    ["Public Slug", slug],
    ["Record Name", headline],
    ["Official Announcement Date", date],
    ["Public Summary", summary],
    ["Why It Matters", whyItMatters],
    ["Action Route Status", actionStatus],
    ["Published buyer profile", primaryBuyer?.id ?? ""],
  ].filter(([, value]) => !value).map(([field]) => field);

  if (missing.length > 0) {
    errors.push(...missing.map((field) => ({
      airtableId: record.id,
      slug,
      field,
      message: `Missing required field: ${field}`,
    })));
    return null;
  }

  const eventClassName = selectName(fields["Event Class"]);
  const formatName = selectName(fields.Format);
  const accessLevel = selectName(fields["Access Level"]).toLowerCase() === "paid"
    ? "paid"
    : "free";
  const tier = Math.min(4, Math.max(1, numberValue(fields["Highest Evidence Tier"]) || 1));
  const sources = [
    sourceFromUrl(fields["Primary Source URL"]),
    sourceFromUrl(fields["Secondary Source URL"]),
  ].filter(Boolean);

  return {
    row: {
      id: slugify(slug),
      airtable_record_id: record.id,
      date,
      buyer: primaryBuyer!.name,
      buyer_id: primaryBuyer!.id,
      headline,
      record_type: recordTypeMap[eventClassName] ?? "development",
      event_class: normalizeEventClass(fields),
      format: formatMap[formatName] ?? "series",
      territory: normalizeTerritory(fields.Territory),
      evidence_tier: `tier_${tier}`,
      confidence: normalizeConfidence(fields["Mandate Confidence"]),
      summary,
      verified_facts: splitLines(fields["Verified Facts"]),
      interpretation: textValue(fields.Interpretation),
      why_it_matters: whyItMatters,
      action: {
        status: normalizeActionStatus(fields["Action Route Status"]),
        label: textValue(fields["Action Label"]) || actionStatus,
        description: textValue(fields["Professional Action Enabled"]),
        url: textValue(fields["Action URL"]) || undefined,
        evidence: textValue(fields["Action Evidence"]) || undefined,
      },
      sources,
      related_record_ids: [] as string[],
      first_captured: textValue(fields["First Captured"]) || date,
      last_verified: textValue(fields["Verification Date"]) || date,
      locked: accessLevel === "paid",
      access_level: accessLevel,
      is_published: true,
      published_at: textValue(fields["Published At"]) || new Date().toISOString(),
      wedge: selectName(fields.Wedge) || null,
      updated_at: new Date().toISOString(),
    },
    buyerIds: availableBuyers.map((buyer) => buyer!.id),
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const startedAt = new Date().toISOString();
  let syncRunId: string | undefined;

  try {
    const syncSecret = requiredEnv("SYNC_SECRET");
    if (request.headers.get("x-sync-secret") !== syncSecret) {
      return json({ error: "Unauthorized" }, 401);
    }

    const airtableToken = requiredEnv("AIRTABLE_PAT");
    const baseId = requiredEnv("AIRTABLE_BASE_ID");
    const recordsTableId = requiredEnv("AIRTABLE_RECORDS_TABLE_ID");
    const buyersTableId = requiredEnv("AIRTABLE_BUYERS_TABLE_ID");
    const supabaseUrl = requiredEnv("SUPABASE_URL");
    const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const requestUrl = new URL(request.url);
    const dryRun = requestUrl.searchParams.get("dry_run") === "true";
    const includeVerified = dryRun
      && requestUrl.searchParams.get("include_verified") === "true";

    const { data: run, error: runError } = await supabase
      .from("sync_runs")
      .insert({ source: "airtable", dry_run: dryRun, started_at: startedAt })
      .select("id")
      .single();
    if (runError) throw runError;
    syncRunId = run.id;

    const recordFormula = includeVerified
      ? 'OR({Website Ready}=1,{Status}="Verified")'
      : "{Website Ready}=1";
    const buyerFormula = includeVerified ? undefined : "{Publish on Site}=1";

    const [airtableBuyers, airtableRecords] = await Promise.all([
      fetchAirtableTable(baseId, buyersTableId, airtableToken, buyerFormula),
      fetchAirtableTable(baseId, recordsTableId, airtableToken, recordFormula),
    ]);

    const buyerValidationErrors: ValidationError[] = [];
    const recordValidationErrors: ValidationError[] = [];
    const mappedBuyers = airtableBuyers
      .map((record) => mapBuyer(record, buyerValidationErrors))
      .filter((buyer): buyer is NonNullable<typeof buyer> => Boolean(buyer));
    const buyersByAirtableId = new Map(
      mappedBuyers.map((buyer) => [buyer.airtable_record_id, buyer]),
    );

    const mappedRecords = airtableRecords
      .map((record) => mapDealRecord(record, buyersByAirtableId, recordValidationErrors))
      .filter((record): record is NonNullable<typeof record> => Boolean(record));

    for (const record of mappedRecords) {
      for (const buyerId of record.buyerIds) {
        const buyer = mappedBuyers.find((candidate) => candidate.id === buyerId);
        if (!buyer) continue;
        if (!buyer.primary_formats.includes(record.row.format)) {
          buyer.primary_formats.push(record.row.format);
        }
        buyer.activity_timeline.push({ date: record.row.date, event: record.row.headline });
      }
    }
    for (const buyer of mappedBuyers) {
      buyer.activity_timeline.sort((a, b) => b.date.localeCompare(a.date));
      buyer.recent_activity = buyer.activity_timeline[0]?.event ?? "";
    }

    if (dryRun) {
      await supabase.from("sync_runs").update({
        completed_at: new Date().toISOString(),
        buyers_fetched: airtableBuyers.length,
        records_fetched: airtableRecords.length,
        validation_errors: [...recordValidationErrors, ...buyerValidationErrors],
      }).eq("id", syncRunId);

      return json({
        dry_run: true,
        include_verified: includeVerified,
        buyers_fetched: airtableBuyers.length,
        buyers_ready: mappedBuyers.length,
        records_fetched: airtableRecords.length,
        records_ready: mappedRecords.length,
        record_validation_errors: recordValidationErrors,
        buyer_validation_errors: buyerValidationErrors,
      });
    }

    if (recordValidationErrors.length > 0 || buyerValidationErrors.length > 0) {
      await supabase.from("sync_runs").update({
        completed_at: new Date().toISOString(),
        buyers_fetched: airtableBuyers.length,
        records_fetched: airtableRecords.length,
        validation_errors: [...recordValidationErrors, ...buyerValidationErrors],
        error_message: "Publication validation failed; no records were written.",
      }).eq("id", syncRunId);
      return json({
        error: "Publication validation failed",
        record_validation_errors: recordValidationErrors,
        buyer_validation_errors: buyerValidationErrors,
      }, 422);
    }

    if (mappedBuyers.length > 0) {
      const { error } = await supabase.from("buyers").upsert(mappedBuyers, { onConflict: "id" });
      if (error) throw error;
    }
    if (mappedRecords.length > 0) {
      const { error } = await supabase.from("records").upsert(
        mappedRecords.map((record) => record.row),
        { onConflict: "id" },
      );
      if (error) throw error;

      const recordIds = mappedRecords.map((record) => record.row.id);
      const { error: deleteLinksError } = await supabase
        .from("record_buyers")
        .delete()
        .in("record_id", recordIds);
      if (deleteLinksError) throw deleteLinksError;

      const links = mappedRecords.flatMap((record) =>
        record.buyerIds.map((buyerId, index) => ({
          record_id: record.row.id,
          buyer_id: buyerId,
          is_primary: index === 0,
        }))
      );
      if (links.length > 0) {
        const { error: linksError } = await supabase.from("record_buyers").insert(links);
        if (linksError) throw linksError;
      }
    }

    const { data: existingRecords, error: existingRecordsError } = await supabase
      .from("records")
      .select("airtable_record_id")
      .not("airtable_record_id", "is", null);
    if (existingRecordsError) throw existingRecordsError;
    const activeRecordIds = new Set(mappedRecords.map((record) => record.row.airtable_record_id));
    const staleRecordIds = (existingRecords ?? [])
      .map((record) => record.airtable_record_id as string)
      .filter((id) => !activeRecordIds.has(id));
    if (staleRecordIds.length > 0) {
      const { error } = await supabase.from("records")
        .update({ is_published: false, updated_at: new Date().toISOString() })
        .in("airtable_record_id", staleRecordIds);
      if (error) throw error;
    }

    const { data: existingBuyers, error: existingBuyersError } = await supabase
      .from("buyers")
      .select("airtable_record_id")
      .not("airtable_record_id", "is", null);
    if (existingBuyersError) throw existingBuyersError;
    const activeBuyerIds = new Set(mappedBuyers.map((buyer) => buyer.airtable_record_id));
    const staleBuyerIds = (existingBuyers ?? [])
      .map((buyer) => buyer.airtable_record_id as string)
      .filter((id) => !activeBuyerIds.has(id));
    if (staleBuyerIds.length > 0) {
      const { error } = await supabase.from("buyers")
        .update({ is_published: false, updated_at: new Date().toISOString() })
        .in("airtable_record_id", staleBuyerIds);
      if (error) throw error;
    }

    await supabase.from("sync_runs").update({
      completed_at: new Date().toISOString(),
      buyers_fetched: airtableBuyers.length,
      records_fetched: airtableRecords.length,
      buyers_upserted: mappedBuyers.length,
      records_upserted: mappedRecords.length,
      buyers_unpublished: staleBuyerIds.length,
      records_unpublished: staleRecordIds.length,
      validation_errors: [],
    }).eq("id", syncRunId);

    return json({
      success: true,
      buyers_fetched: airtableBuyers.length,
      records_fetched: airtableRecords.length,
      buyers_upserted: mappedBuyers.length,
      records_upserted: mappedRecords.length,
      buyers_unpublished: staleBuyerIds.length,
      records_unpublished: staleRecordIds.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (syncRunId) {
      try {
        const supabaseUrl = requiredEnv("SUPABASE_URL");
        const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
        const supabase = createClient(supabaseUrl, serviceRoleKey);
        await supabase.from("sync_runs").update({
          completed_at: new Date().toISOString(),
          error_message: message,
        }).eq("id", syncRunId);
      } catch {
        // Preserve the original failure response if run logging also fails.
      }
    }
    return json({ error: message }, 500);
  }
});
