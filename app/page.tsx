import { Header } from "@/components/Header";
import { IdeaForm } from "@/components/IdeaForm";
import { createClient } from "@/lib/supabase/server";

const STEPS = [
  {
    k: "01",
    t: "Опишите идею",
    d: "Коротко расскажите о бизнесе, который хотите запустить.",
  },
  {
    k: "02",
    t: "Ответьте на вопросы",
    d: "AI уточнит бюджет, аудиторию, формат работы и цели.",
  },
  {
    k: "03",
    t: "Получите документ",
    d: "Финансы, риски, план запуска и рекомендации.",
  },
];

const EXAMPLES = [
  "Магазин подгузников на Wildberries",
  "Логистическая компания",
  "AI агентство",
  "Кофейня в центре города",
  "Производство бытовой химии",
  "Онлайн-школа",
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
          <div className="mx-auto max-w-6xl px-4 py-20">

            <p className="tab-index">
              Бизнес Навигатор · AI
            </p>

            <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight sm:text-6xl">
              Из идеи — в рабочий
              <br />
              бизнес-план за один вечер
            </h1>

            <p className="mt-6 max-w-2xl text-xl text-muted">
              AI проанализирует идею, рассчитает экономику,
              покажет риски и подготовит план запуска.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <div className="rounded-2xl border border-line bg-white px-5 py-4 shadow-card">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted">
                  Разобранных идей
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white px-5 py-4 shadow-card">
                <div className="text-2xl font-bold">10 мин</div>
                <div className="text-sm text-muted">
                  На создание документа
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white px-5 py-4 shadow-card">
                <div className="text-2xl font-bold">AI</div>
                <div className="text-sm text-muted">
                  Финансовая модель и риски
                </div>
              </div>

            </div>

            <div className="mt-12">
              <IdeaForm loggedIn={!!user} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">

              {EXAMPLES.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm text-muted"
                >
                  {item}
                </span>
              ))}

            </div>

          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">

          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold">
              Как это работает
            </h2>

            <p className="mt-3 text-muted">
              От идеи до готового документа за несколько минут
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {STEPS.map((s) => (
              <div
                key={s.k}
                className="rounded-2xl border border-line bg-white p-8 shadow-card"
              >
                <div className="tab-index">
                  {s.k}
                </div>

                <h3 className="mt-3 text-xl font-bold">
                  {s.t}
                </h3>

                <p className="mt-3 text-muted">
                  {s.d}
                </p>
              </div>
            ))}

          </div>

        </section>

        <section className="bg-white border-y border-line">
          <div className="mx-auto max-w-6xl px-4 py-16">

            <div className="grid gap-8 md:grid-cols-3">

              <div>
                <div className="text-4xl font-bold text-cobalt">
                  6/10
                </div>

                <div className="mt-2 text-muted">
                  Средняя оценка новых идей
                </div>
              </div>

              <div>
                <div className="text-4xl font-bold text-cobalt">
                  90 дней
                </div>

                <div className="mt-2 text-muted">
                  План запуска бизнеса
                </div>
              </div>

              <div>
                <div className="text-4xl font-bold text-cobalt">
                  12 мес.
                </div>

                <div className="mt-2 text-muted">
                  Финансовый прогноз
                </div>
              </div>

            </div>

          </div>
        </section>

        <footer className="border-t border-line py-10 text-center text-xs text-muted">
          Навигатор AI · Аналитика создаётся искусственным интеллектом и не является инвестиционной рекомендацией.
        </footer>
      </main>
    </>
  );
}