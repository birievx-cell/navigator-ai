"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui";

const PENDING_KEY = "navai_pending_idea";

export function IdeaForm({ loggedIn, autoSubmitPending = false }: { loggedIn: boolean; autoSubmitPending?: boolean }) {
  const [idea, setIdea] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function createProject(text: string) {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: text }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBusy(false);
      setError(data.error || "Что-то пошло не так. Попробуйте ещё раз.");
      return;
    }
    localStorage.removeItem(PENDING_KEY);
    router.push(`/project/${data.id}/wizard`);
  }

  // после логина: дашборд подхватывает идею, введённую на лендинге
  useEffect(() => {
    if (!autoSubmitPending || !loggedIn) return;
    const pending = localStorage.getItem(PENDING_KEY);
    if (pending && pending.trim().length >= 10) {
      setIdea(pending);
      void createProject(pending);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit() {
    const text = idea.trim();
    if (text.length < 10) {
      setError("Опишите идею хотя бы одним предложением.");
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
    <div className="w-full max-w-2xl">
      <label htmlFor="idea" className="tab-index">Ваша идея</label>
      <textarea
        id="idea"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        rows={4}
        maxLength={2000}
        placeholder="Например: доставка домашних обедов для офисов в Риге по подписке"
        className="mt-2 w-full resize-none rounded-xl border border-line bg-white p-4 text-base shadow-card outline-none focus:border-cobalt"
      />
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">AI задаст 5 вопросов, затем соберёт полный документ. ~10 минут.</p>
        <Button onClick={onSubmit} disabled={busy}>
          {busy ? "Создаём проект…" : "Разобрать идею →"}
        </Button>
      </div>
      {error && <p className="mt-3 rounded-lg bg-amber-soft px-4 py-3 text-sm text-ink">{error}</p>}
    </div>
  );
}
