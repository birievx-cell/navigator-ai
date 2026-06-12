import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { WizardFlow } from "@/components/WizardFlow";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

export default async function WizardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single<Project>();

  if (!project) redirect("/dashboard");
  if (project.status === "ready") redirect(`/project/${id}`);
  if (!project.questions?.length) redirect("/dashboard");

  return (
    <>
      <Header />
      <main className="blueprint min-h-screen px-4 py-10">
        <WizardFlow
          projectId={project.id}
          idea={project.idea}
          questions={project.questions}
          savedAnswers={project.answers ?? {}}
        />
      </main>
    </>
  );
}
