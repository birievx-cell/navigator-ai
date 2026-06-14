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

          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">

          <h2 className="mb-12 text-center text-4xl font-bold">
            Что вы получите
          </h2>

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <div className="mb-4 text-4xl">📊</div>
              <h3 className="mb-3 text-xl font-bold">
                Финансовая модель
              </h3>
              <p className="text-gray-600">
                Прогноз выручки, прибыли,
                окупаемости и денежных потоков
                на 12 месяцев.
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <div className="mb-4 text-4xl">⚠️</div>
              <h3 className="mb-3 text-xl font-bold">
                Анализ рисков
              </h3>
              <p className="text-gray-600">
                Узкие места бизнеса,
                конкуренты и возможные
                проблемы ещё до запуска.
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <div className="mb-4 text-4xl">🚀</div>
              <h3 className="mb-3 text-xl font-bold">
                План запуска
              </h3>
              <p className="text-gray-600">
                Пошаговый план действий
                на первые 90 дней.
              </p>
            </div>

          </div>

        </section>

        <section className="bg-slate-900 py-24 text-white">

          <div className="mx-auto max-w-5xl px-6 text-center">

            <h2 className="text-5xl font-bold">
              Бизнес-консультант на базе AI
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-xl text-slate-300">
              Вместо недель исследований —
              готовый документ с цифрами,
              рисками и рекомендациями.
            </p>

            <div className="mt-12 flex justify-center">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <p className="text-lg">
                  «Стоит ли запускать бренд подгузников через Wildberries?»
                </p>

                <div className="mt-6 text-green-400">
                  ✔ Анализ рынка
                </div>

                <div className="mt-2 text-green-400">
                  ✔ Финансовая модель
                </div>

                <div className="mt-2 text-green-400">
                  ✔ Карта рисков
                </div>

                <div className="mt-2 text-green-400">
                  ✔ План запуска
                </div>
              </div>
            </div>

          </div>

        </section>

      </main>
    </>
  );
}