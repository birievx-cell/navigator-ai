import Link from "next/link";
import { redirect } from "next/navigation";
import { DocumentView } from "@/components/DocumentView";
import { PrintButton } from "@/components/PrintButton";
import { createClient } from "@/lib/supabase/server";
import type { BusinessDocument, Project } from "@/lib/types";

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single<Project>();
  if (!project || !user) redirect("/dashboard");

  const { data: docRow } = await supabase
    .from("documents")
    .select("id, content")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single<{ id: string; content: BusinessDocument }>();
  if (!docRow) redirect(`/project/${id}`);

  return (
    <main className="bg-white px-6 py-10">
      <div className="no-print mx-auto mb-8 flex max-w-3xl items-center justify-between rounded-xl border border-line bg-paper p-4">
        <p className="text-sm text-muted">
          В диалоге печати выберите «Сохранить как PDF».
        </p>
        <div className="flex gap-3">
          <Link href={`/project/${id}`} className="rounded-lg border border-line bg-white px-4 py-3 text-sm font-semibold">
            ← Назад
          </Link>
          <PrintButton />
        </div>
      </div>
      <DocumentView doc={docRow.content} projectId={id} documentId={docRow.id} userId={user.id} printMode />
    </main>
  );
}
