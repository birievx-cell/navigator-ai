import { Header } from "@/components/Header";
import { IdeaForm } from "@/components/IdeaForm";
import { createClient } from "@/lib/supabase/server";

export default async function Landing() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Header />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />

        <section className="relative border-b border-line">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                🚀 AI для запуска бизнеса
              </div>

              <h1 className="text-6xl font-bold leading-tight tracking-tight">
                Из идеи — в готовый
                <br />
                бизнес-план за 10 минут
              </h1>

              <p className="mt-8 max-w-2xl text-xl text-gray-600">
                Навигатор AI анализирует идею, считает экономику,
                показывает риски, строит финансовую модель,
                создаёт план запуска и помогает найти точки роста.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <div className="rounded-2xl border bg-white px-6 py-5 shadow-sm">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-gray-500">
                    Разобранных идей
                  </div>
                </div>

                <div className="rounded-2xl border bg-white px-6 py-5 shadow-sm">
                  <div className="text-3xl font-bold">10 мин</div>
                  <div className="text-sm text-gray-500">
                    На создание документа
                  </div>
                </div>

                <div className="rounded-2xl border bg-white px-6 py-5 shadow-sm">
                  <div className="text-3xl font-bold">AI</div>
                  <div className="text-sm text-gray-500">
                    Финмодель и риски
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <IdeaForm loggedIn={!!user} />
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <div className="rounded-full border bg-white px-4 py-2">
                ✅ Анализ рынка
              </div>

              <div className="rounded-full border bg-white px-4 py-2">
                ✅ Финансовая модель
              </div>

              <div className="rounded-full border bg-white px-4 py-2">
                ✅ Карта рисков
              </div>

              <div className="rounded-full border bg-white px-4 py-2">
                ✅ План запуска
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="mb-12 text-center text-4xl font-bold">
            Что получает клиент
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <div className="mb-4 text-4xl">📊</div>

              <h3 className="text-xl font-bold">
                Финансовая модель
              </h3>

              <p className="mt-3 text-gray-600">
                Прогноз прибыли, выручки,
                окупаемости и денежных потоков
                на 12 месяцев.
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <div className="mb-4 text-4xl">⚠️</div>

              <h3 className="text-xl font-bold">
                Анализ рисков
              </h3>

              <p className="mt-3 text-gray-600">
                Показываем слабые места бизнеса,
                конкурентов и потенциальные угрозы.
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <div className="mb-4 text-4xl">🚀</div>

              <h3 className="text-xl font-bold">
                План запуска
              </h3>

              <p className="mt-3 text-gray-600">
                Пошаговый план действий
                на первые 90 дней.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}