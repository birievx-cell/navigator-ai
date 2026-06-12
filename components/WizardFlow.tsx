"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Card, Spinner } from "./ui";
import type { WizardQuestion } from "@/lib/types";

const GEN_PHASES = [
  "Анализируем идею и рынок…",
  "Собираем карту рисков…",
  "Подбираем финансовые допущения…",
  "Составляем план запуска на 90 дней…",
  "Финализируем рекомендации…",
];

export function WizardFlow({
  projectId,
  idea,
  questions,
  savedAnswers,
}: {
  projectId: string;
  idea: string;
  questions: WizardQuestion[];
  savedAnswers: Record<string, string>;
}) {
  const firstUnanswered = useMemo(() => {
    const i = questions.findIndex((q) => !savedAnswers[q.id]);
    return i === -1 ? 0 : i;
  }, [questions, savedAnswers]);

  const [step, setStep] = useState(firstUnanswered);
  const [answers, setAnswers] = useState<Record<string, string>>(savedAnswers);
  const [generating, setGenerating] = useState(false);
  const [phase, setPhase] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const q = questions[step];
  const value = answers[q.id] ?? "";
  const isLast = step === questions.length - 1;

  async function persist(next: Record<string, string>) {
    // автосохранение: вкладку можно закрыть на любом шаге
    await createClient().from("projects").update({ answers: next }).eq("id", projectId);
  }

  function setAnswer(v: string) {
    const next = { ...answers, [q.id]: v };
    setAnswers(next);
  }

  async function goNext() {
    if (!value.trim()) {
      setError("Ответьте на вопрос или напишите «не знаю» — AI учтёт это.");
      return;
    }
    setError(null);
    await persist(answers);
    if (!isLast) setStep(step + 1);
    else await generate();
  }

  async function generate() {
    setGenerating(true);
    const timer = setInterval(() => setPhase((p) => Math.min(p + 1, GEN_PHASES.length - 1)), 9000);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, answers }),
      });
      const data = await res.json().catch(() => ({}));
      clearInterval(timer);
      if (!res.ok) {
        setGenerating(false);
        setError(data.error || "Генерация не удалась. Попробуйте ещё раз.");
        return;
      }
      router.push(`/project/${projectId}`);
      router.refresh();
    } catch {
      clearInterval(timer);
      setGenerating(false);
      setError("Сетевая ошибка. Ответы сохранены — нажмите «Сгенерировать» ещё раз.");
    }
  }

  if (generating) {
    return (
      <Card className="mx-auto max-w-xl p-10 text-center">
        <p className="tab-index">Генерация документа</p>
        <div className="mt-6 flex justify-center">
          <Spinner />
        </div>
        <p className="mt-5 font-display text-base font-semibold">{GEN_PHASES[phase]}</p>
        <p className="mt-2 text-sm text-muted">Обычно 40–90 секунд. Не закрывайте страницу.</p>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* прогресс */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="tab-index">Вопрос {step + 1} из {questions.length}</span>
          <span className="max-w-[60%] truncate">{idea}</span>
        </div>
        <div className="mt-2 h-1 w-full rounded bg-line">
          <div
            className="h-1 rounded bg-cobalt transition-all"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold leading-snug">{q.text}</h2>
        <p className="mt-2 text-sm text-muted">{q.hint}</p>

        {q.type === "choice" && q.options?.length ? (
          <div className="mt-5 grid gap-3">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswer(opt)}
                className={`min-h-[44px] rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  value === opt
                    ? "border-cobalt bg-cobalt-soft font-semibold"
                    : "border-line bg-white hover:border-cobalt"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
            placeholder="Ваш ответ… (можно коротко)"
            className="mt-5 w-full resize-none rounded-lg border border-line p-4 text-base outline-none focus:border-cobalt"
            autoFocus
          />
        )}

        {error && <p className="mt-4 rounded-lg bg-amber-soft px-4 py-3 text-sm">{error}</p>}

        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            ← Назад
          </Button>
          <Button onClick={goNext}>{isLast ? "Сгенерировать документ" : "Далее →"}</Button>
        </div>
      </Card>

      <p className="mt-4 text-center text-xs text-muted">
        Ответы сохраняются автоматически — можно вернуться позже.
      </p>
    </div>
  );
}
