/* =========================================================
   Browser-side wrapper. Calls our own /api/extract route.
   No keys here — the real API key lives only on the server.
   See app/api/extract/route.ts to configure the AI provider.
   ========================================================= */

import { mockExtract } from "./mock";

export async function extractEssence(rawText: string): Promise<string[]> {
  try {
    const res = await fetch("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawText }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data.sentences)) return data.sentences;
    throw new Error("bad response shape");
  } catch (err) {
    console.warn("[ai] extractEssence client error, using local mock:", err);
    return mockExtract(rawText);
  }
}
