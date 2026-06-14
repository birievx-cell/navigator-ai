import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { complete, extractJson, MODEL } from "@/lib/claude";
import { DOCUMENT_SYSTEM, documentUserPrompt } from "@/lib/prompts";
import type { BusinessDocument, Project } from "@/lib/types";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Нужен вход в аккаунт" }, { status: 401 });

  const { projectId, answers } = await req.json().catch(() => ({}));
  if (!projectId) return NextResponse.json({ error: "projectId обязателен" }, { status: 400 });

  // RLS гарантирует, что чужой проект не прочитается
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single<Project>();
  if (!project) return NextResponse.json({ error: "Проект не найден" }, { status: 404 });

  const finalAnswers: Record<string, string> =
    answers && typeof answers === "object" ? answers : project.answers ?? {};

  await supabase
    .from("projects")
    .update({ answers: finalAnswers, status: "generating" })
    .eq("id", projectId);

  const attempt = async () =>
    complete({
      system: DOCUMENT_SYSTEM,
      user: documentUserPrompt({ ...project, answers: finalAnswers }),
      maxTokens: 6000,
    });

  try {
    let r = await attempt();
    let doc: BusinessDocument & { refused?: boolean; reason?: string };
    
    try {
      doc = extractJson(r.text);
      if (
        !doc ||
        !doc.analysis ||
        typeof doc.analysis.verdict_score !== "number" ||
        !Array.isArray(doc.risks) ||
        !doc.finance_assumptions ||
        !Array.isArray(doc.launch_plan)
      ) {
        throw new Error("INVALID_DOCUMENT_STRUCTURE");
      }
    
      console.log("========== DOC_DEBUG ==========");
      console.log(JSON.stringify(doc, null, 2));
      console.log("========== END_DOC_DEBUG ==========");
    
    } catch {
      r = await attempt();
      doc = extractJson(r.text);
    
      console.log("========== DOC_DEBUG ==========");
      console.log(JSON.stringify(doc, null, 2));
      console.log("========== END_DOC_DEBUG ==========");
    }

    await supabase.from("generations").insert({
      user_id: user.id,
      project_id: projectId,
      kind: "document",
      model: MODEL,
      tokens_in: r.tokensIn,
      tokens_out: r.tokensOut,
      latency_ms: r.latencyMs,
      status: "success",
    });

    if (doc.refused) {
      await supabase.from("projects").update({ status: "failed" }).eq("id", projectId);
      return NextResponse.json({ error: doc.reason || "Идея отклонена." }, { status: 422 });
    }

    const { data: saved, error: docErr } = await supabase
      .from("documents")
      .insert({ project_id: projectId, user_id: user.id, content: doc, model: MODEL })
      .select("id")
      .single();
    if (docErr || !saved) throw new Error("db_save_failed");

    await supabase
      .from("projects")
      .update({ status: "ready", title: doc.title?.slice(0, 80) || project.title })
      .eq("id", projectId);

    return NextResponse.json({ documentId: saved.id });
  } catch (e) {
    await supabase.from("generations").insert({
      user_id: user.id,
      project_id: projectId,
      kind: "document",
      model: MODEL,
      status: "error",
      error: String(e).slice(0, 500),
    });
    await supabase.from("projects").update({ status: "answering" }).eq("id", projectId);
    return NextResponse.json(
      { error: "Генерация не удалась. Ответы сохранены — нажмите «Сгенерировать» ещё раз." },
      { status: 502 }
    );
  }
}
