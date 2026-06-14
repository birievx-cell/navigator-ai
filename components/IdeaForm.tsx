"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui";

const PENDING_KEY = "navai_pending_idea";

const EXAMPLES = [
  "Интернет-магазин детских подгузников",
  "Оптовая поставка нефтепродуктов",
  "Сервис доставки еды по подписке",
  "Маркетплейс строительных материалов",
];

export function IdeaForm({
  loggedIn,
  autoSubmitPending = false,
}: {
  loggedIn: boolean;
  autoSubmitPending?: boolean;
}) {
  const [idea, setIdea] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function createProject(text: string) {
    setBusy(true);
    setError(null);

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idea: text,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setBusy(false);
      setError(data.error || "Ошибка создания проекта");
      return;
    }

    localStorage.removeItem(PENDING_KEY);
    router.push(`/project/${data.id}/wizard`);
  }

  useEffect(() => {
    if (!autoSubmitPending || !loggedIn) return;

    const pending = localStorage.getItem(PENDING_KEY);

    if (pending && pending.trim().length >= 10) {
      setIdea(pending);
      void createProject(pending);
    }
  }, [autoSubmitPending, loggedIn]);

  function onSubmit() {
    const text = idea.trim();

    if (text.length < 10) {
      setError("Опишите идею подробнее");
      return;
    }

    if (!loggedIn) {
      localStorage.setItem(PENDING_KEY, text);
      router.push("/login");
      return;
    }

    void createProject(text);
  }

  return (
    <div className="w-full max-w-4xl">

      <label
        htmlFor="idea"
        className="mb-3 block text-sm font-bold uppercase tracking-wider text-cobalt"
      >
        Ваша идея
      </label>

      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl">

        <textarea
          id="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={6}
          maxLength={2000}
          placeholder="Например: запуск собственного бренда подгузников для детей старше 1 года через Wildberries и Ozon"
          className="w-full resize-none border-0 p-6 text-lg outline-none"
        />

        <div className="flex items-center justify-between border-t border-line bg-slate-50 px-6 py-4">

          <span className="text-sm text-muted">
            {idea.length} / 2000 символов
          </span>

          <Button
            onClick={onSubmit}
            disabled={busy}
          >
            {busy ? "Создаём проект..." : "🚀 Разобрать идею"}
          </Button>

        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-muted">
          Популярные идеи:
        </p>

        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setIdea(example)}
              className="rounded-full border border-line bg-white px-4 py-2 text-sm hover:border-cobalt hover:text-cobalt"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 text-sm text-muted">
        <span>✅ Анализ рынка</span>
        <span>✅ Финмодель</span>
        <span>✅ Риски</span>
        <span>✅ План запуска</span>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}