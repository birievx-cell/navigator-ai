import { Header } from "@/components/Header";
import { IdeaForm } from "@/components/IdeaForm";
import { createClient } from "@/lib/supabase/server";

const STEPS = [
  { k: "01", t: "Идея", d: "Опишите бизнес-идею одним абзацем — как рассказали бы другу." },
  { k: "02", t: "Вопросы", d: "AI задаст 5 уточняющих вопросов: бюджет, формат, аудитория, опыт." },
  { k: "03", t: "Документ", d: "Анализ, риски, финмодель на 12 месяцев, план запуска на 90 дней, рекомендации." },
];

export default async function Landing() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Header />
      <main>
        <section className="blueprint border-b border-line">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
            <p className="tab-index">Бизнес Навигатор · MVP</p>
            <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight sm:text-5xl">
              Из идеи — в рабочий бизнес-план за один вечер
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Без бизнес-образования и консультантов. AI разберёт вашу идею честно:
              где деньги, где риски и что делать в первые 90 дней.
            </p>
            <div className="mt-10">
              <IdeaForm loggedIn={!!user} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14">
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.k} className="rounded-xl border border-line bg-white p-6 shadow-card">
                <span className="tab-index">{s.k}</span>
                <h3 className="mt-2 font-display text-base font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-line py-8 text-center text-xs text-muted">
          Навигатор AI · Документы создаются AI и не являются финансовой или юридической консультацией
        </footer>
      </main>
    </>
  );
}
