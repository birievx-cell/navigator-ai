import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { complete, extractJson, MODEL } from "@/lib/claude";
import { QUESTIONS_SYSTEM, questionsUserPrompt } from "@/lib/prompts";
import type { WizardQuestion } from "@/lib/types";

const MONTHLY_LIMIT = 20; // генераций (questions + document) на пользователя в месяц

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Нужен вход в аккаунт" }, { status: 401 });

  const { idea } = await req.json().catch(() => ({}));
  if (!idea || typeof idea !== "string" || idea.trim().length < 10) {
    return NextResponse.json(
      { error: "Опишите идею хотя бы одним предложением (от 10 символов)" },
      { status: 400 }
    );
  }
  if (idea.length > 2000) {
    return NextResponse.json({ error: "Слишком длинное описание (макс. 2000 символов)" }, { status: 400 });
  }

  // лимит за календарный месяц
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("generations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", monthStart.toISOString());
  if ((count ?? 0) >= MONTHLY_LIMIT) {
    return NextResponse.json(
      { error: "Месячный лимит генераций исчерпан. Лимит обновится 1-го числа." },
      { status: 429 }
    );
  }

  // 1) создаём проект
  const { data: project, error: insErr } = await supabase
    .from("projects")
    .insert({ user_id: user.id, idea: idea.trim(), title: idea.trim().slice(0, 60) })
    .select()
    .single();
  if (insErr || !project) {
    return NextResponse.json({ error: "Не удалось создать проект" }, { status: 500 });
  }

  // 2) генерируем уточняющие вопросы
  try {
    const r = await complete({
      system: QUESTIONS_SYSTEM,
      user: questionsUserPrompt(idea.trim()),
      maxTokens: 1500,
    });
    const parsed = extractJson<{ questions?: WizardQuestion[]; refused?: boolean; reason?: string }>(r.text);

    await supabase.from("generations").insert({
      user_id: user.id,
      project_id: project.id,
      kind: "questions",
      model: MODEL,
      tokens_in: r.tokensIn,
      tokens_out: r.tokensOut,
      latency_ms: r.latencyMs,
      status: "success",
    });

    if (parsed.refused || !parsed.questions?.length) {
      await supabase.from("projects").update({ status: "failed" }).eq("id", project.id);
      return NextResponse.json(
        { error: parsed.reason || "Эта идея не подходит для анализа. Попробуйте сформулировать легальную бизнес-идею." },
        { status: 422 }
      );
    }

    await supabase
      .from("projects")
      .update({ questions: parsed.questions.slice(0, 5), status: "answering" })
      .eq("id", project.id);

    return NextResponse.json({ id: project.id });
  } catch (e) {
console.error("PROJECT ERROR:", e);
    await supabase.from("generations").insert({
      user_id: user.id,
      project_id: project.id,
      kind: "questions",
      model: MODEL,
      status: "error",
      error: String(e).slice(0, 500),
    });
    await supabase.from("projects").update({ status: "failed" }).eq("id", project.id);
    return NextResponse.json({ error: "AI временно недоступен. Попробуйте ещё раз." }, { status: 502 });
  }
}
