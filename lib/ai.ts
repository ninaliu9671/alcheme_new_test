/* =========================================================
   🔑 REPLACE AI PROVIDER HERE
   1. Set AI_CONFIG.url   — your API endpoint
   2. Set AI_CONFIG.key   — your API key (use env in prod!)
   3. Set AI_CONFIG.model — model id
   Currently using mockExtract — see lib/mock.ts.
   Edit the prompt in lib/prompt.ts.
   ========================================================= */

import { EXTRACT_PROMPT } from "./prompt";
import { mockExtract } from "./mock";

export const AI_CONFIG = {
  url: "", // e.g. "https://api.openai.com/v1/chat/completions"
  key: "", // e.g. process.env.NEXT_PUBLIC_AI_KEY
  model: "", // e.g. "gpt-4o-mini"
};

export async function extractEssence(rawText: string): Promise<string[]> {
  // Fall back to local mock when no provider is configured.
  if (!AI_CONFIG.url) {
    return mockExtract(rawText);
  }

  const prompt = EXTRACT_PROMPT.replace("{{INPUT}}", rawText);

  try {
    const res = await fetch(AI_CONFIG.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_CONFIG.key}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const text: string =
      data?.choices?.[0]?.message?.content ??
      data?.content ??
      "";
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      const arr = JSON.parse(match[0]);
      if (Array.isArray(arr)) return arr.filter((s) => typeof s === "string");
    }
    return mockExtract(rawText);
  } catch (err) {
    console.warn("[ai] extractEssence failed, falling back to mock:", err);
    return mockExtract(rawText);
  }
}
