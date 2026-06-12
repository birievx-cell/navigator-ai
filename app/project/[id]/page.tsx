import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { DocumentView } from "@/components/DocumentView";
import { createClient } from "@/lib/supabase/server";
import type { BusinessDocument, Project } from "@/lib/types";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single<Project>();
  if (!project || !user) redirect("/dashboard");
  if (project.status !== "ready") redirect(`/project/${id}/wizard`);

  const { data: docRow } = await supabase
    .from("documents")
    .select("id, content")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single<{ id: string; content: BusinessDocument }>();
  if (!docRow) redirect(`/project/${id}/wizard`);

  return (
    <>
      <Header />
      <main className="px-4 py-10">
        <DocumentView doc={docRow.content} projectId={id} documentId={docRow.id} userId={user.id} />
      </main>
    </>
  );
}
