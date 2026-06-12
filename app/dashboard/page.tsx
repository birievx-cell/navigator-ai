import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { IdeaForm } from "@/components/IdeaForm";
import { ProjectCard } from "@/components/ProjectCard";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Project[]>();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="blueprint rounded-2xl border border-line p-6 sm:p-10">
          <p className="tab-index">Новый разбор</p>
          <h1 className="mt-2 font-display text-xl font-semibold sm:text-2xl">Какую идею проверим?</h1>
          <div className="mt-6">
            {/* autoSubmitPending: подхватывает идею, введённую на лендинге до входа */}
            <IdeaForm loggedIn autoSubmitPending />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="tab-index">Мои проекты</h2>
          {projects?.length ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <ProjectCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">
              Проектов пока нет. Опишите идею выше — через 10 минут получите готовый документ.
            </p>
          )}
        </section>
      </main>
    </>
  );
}
