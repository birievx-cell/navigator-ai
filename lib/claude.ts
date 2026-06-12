import Groq from "groq-sdk";

export const MODEL = "llama-3.3-70b-versatile";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export function extractJson<T>(raw: string): T {
  let s = raw.trim();

  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) s = fence[1].trim();

  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");

  if (start >= 0 && end > start) {
    s = s.slice(start, end + 1);
  }

  return JSON.parse(s) as T;
}

export async function complete(opts: {
  system: string;
  user: string;
  maxTokens: number;
}): Promise<{
  text: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
}> {
  const t0 = Date.now();

  const msg = await client.chat.completions.create({
    model: MODEL,
    max_tokens: opts.maxTokens,
    messages: [
      { role: "system", content: opts.system },
      { role: "user", content: opts.user }
    ]
  });

  const text = msg.choices?.[0]?.message?.content || "";

  return {
    text,
    tokensIn: msg.usage?.prompt_tokens || 0,
    tokensOut: msg.usage?.completion_tokens || 0,
    latencyMs: Date.now() - t0,
  };
}
