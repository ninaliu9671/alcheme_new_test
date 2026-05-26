/* =========================================================
   🔑 SERVER-SIDE AI CALL — KEY NEVER REACHES BROWSER
   This route runs on the Node.js server only.
   It reads env vars from .env.local (which is gitignored).
   The browser calls POST /api/extract — never sees AI_KEY.

   To enable real AI:
     1. Copy .env.local.example to .env.local
     2. Fill in AI_URL, AI_KEY, AI_MODEL
     3. Restart `npm run dev`
   With no env vars set, the route falls back to lib/mock.ts.

   Edit the prompt in lib/prompt.ts.
   ========================================================= */

import { NextResponse } from "next/server";
import { EXTRACT_PROMPT } from "@/lib/prompt";
import { mockExtract } from "@/lib/mock";

export const runtime = "nodejs"; // ensure server runtime (not edge)

export async function POST(req: Request) {
  const { rawText = "" } = await req.json().catch(() => ({}));

  const url = process.env.AI_URL;
  const key = process.env.AI_KEY;
  const model = process.env.AI_MODEL ?? "gpt-4o-mini";

  // No provider configured → fall back to mock.
  if (!url || !key) {
    const sentences = await mockExtract(rawText);
    return NextResponse.json({ sentences, source: "mock" });
  }

  const prompt = EXTRACT_PROMPT.replace("{{INPUT}}", rawText);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const text: string =
      data?.choices?.[0]?.message?.content ?? data?.content ?? "";

    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      const arr = JSON.parse(match[0]);
      if (Array.isArray(arr)) {
        const sentences = arr.filter((s): s is string => typeof s === "string");
        return NextResponse.json({ sentences, source: "ai" });
      }
    }
    // AI replied but parse failed → fall back to mock.
    const sentences = await mockExtract(rawText);
    return NextResponse.json({ sentences, source: "mock-fallback" });
  } catch (err) {
    console.warn("[/api/extract] AI call failed, falling back to mock:", err);
    const sentences = await mockExtract(rawText);
    return NextResponse.json({ sentences, source: "mock-error" });
  }
}
