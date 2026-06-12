"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function RatingWidget({ documentId, userId }: { documentId: string; userId: string }) {
  const [rated, setRated] = useState<number | null>(null);

  async function rate(r: number) {
    setRated(r);
    await createClient().from("feedback").insert({ document_id: documentId, user_id: userId, rating: r });
  }

  if (rated) return <p className="text-sm text-muted">Спасибо за оценку — это улучшает генерации.</p>;
  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      Оцените документ:
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => rate(n)}
          aria-label={`Оценка ${n}`}
          className="h-9 w-9 rounded-lg border border-line hover:border-cobalt hover:text-cobalt"
        >
          {n}
        </button>
      ))}
    </div>
  );
}
