// Fireflies GraphQL client — fetch the latest daily stand-up (summary + action items)
// for the automated ingestion (the scheduled cron + POST /api/ingest).
//
// Server-side only, needs FIREFLIES_API_KEY. The MANUAL ingestion path does NOT use
// this — it runs in Keitha's Cowork via the Fireflies MCP (see INGESTION.md), so the
// Worker key is only required for the hands-off cron.

const FIREFLIES_URL = "https://api.fireflies.ai/graphql";

const RECENT_QUERY = `query Recent($limit: Int!) {
  transcripts(limit: $limit) {
    id
    title
    date
    dateString
    organizer_email
    summary { short_summary overview keywords action_items }
  }
}`;

// Fetch recent transcripts (newest first). `fetchImpl` is injectable for tests.
export async function fetchRecentTranscripts(env, limit = 10, fetchImpl = fetch) {
  if (!env.FIREFLIES_API_KEY) throw new Error("FIREFLIES_API_KEY not set");
  const res = await fetchImpl(FIREFLIES_URL, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${env.FIREFLIES_API_KEY}` },
    body: JSON.stringify({ query: RECENT_QUERY, variables: { limit } }),
  });
  if (!res.ok) throw new Error(`Fireflies ${res.status}: ${await res.text()}`);
  const j = await res.json();
  if (j.errors) throw new Error(`Fireflies GraphQL: ${JSON.stringify(j.errors)}`);
  return (j.data && j.data.transcripts) || [];
}

// Pick the most recent transcript whose title looks like a daily stand-up. Pure/testable.
// Sorts by the numeric `date` (epoch ms) descending rather than trusting the API's
// result order, so we always pick the genuinely newest stand-up.
export function pickLatestStandup(transcripts) {
  const standups = (transcripts || [])
    .filter((t) => /stand.?up/i.test((t && t.title) || ""))
    .sort((a, b) => ((b && b.date) || 0) - ((a && a.date) || 0));
  return standups[0] || null;
}

// Fetch a wide-ish window (the query isn't title-filtered server-side, so a busy day
// of other meetings could otherwise push the stand-up out of a small window).
export async function getLatestStandup(env, fetchImpl = fetch) {
  return pickLatestStandup(await fetchRecentTranscripts(env, 50, fetchImpl));
}
