import Link from "next/link";
import { SectionTab } from "./ui";
import { FinTable } from "./FinTable";
import { RiskBoard } from "./RiskBoard";
import { RatingWidget } from "./RatingWidget";
import { DISCLAIMER } from "@/lib/prompts";
import type { BusinessDocument } from "@/lib/types";

function List({ items, marker = "▸" }: { items: string[]; marker?: string }) {
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed">
          <span className="text-cobalt">{marker}</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function DocumentView({
  doc,
  projectId,
  documentId,
  userId,
  printMode = false,
}: {
  doc: BusinessDocument;
  projectId: string;
  documentId: string;
  userId: string;
  printMode?: boolean;
}) {
  console.log("DOC =", doc);
console.log("ANALYSIS =", doc?.analysis);

const a = doc.analysis;
  return (
    <article className="mx-auto max-w-3xl">
  <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
  <div className="mb-3 inline-flex rounded-full bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wider">
    AI Бизнес-анализ
  </div>

  <h1 className="text-4xl font-bold leading-tight">
    {doc.title}
  </h1>

  <p className="mt-4 max-w-2xl text-blue-100">
    {a.summary}
  </p>

  <div className="mt-6 flex flex-wrap gap-3">
    <div className="rounded-xl bg-white/10 px-4 py-3">
      <div className="text-xs text-blue-200">Оценка</div>
      <div className="text-2xl font-bold">
        {a.verdict_score}/10
      </div>
    </div>

    <div className="rounded-xl bg-white/10 px-4 py-3">
      <div className="text-xs text-blue-200">Инвестиции</div>
      <div className="text-2xl font-bold">
        ₽ {doc.finance_assumptions?.startup_costs ?? 0}
      </div>
    </div>

    <div className="rounded-xl bg-white/10 px-4 py-3">
      <div className="text-xs text-blue-200">Средний чек</div>
      <div className="text-2xl font-bold">
        ₽ {doc.finance_assumptions?.avg_check ?? 0}
      </div>
    </div>
  </div>
</div>
<header className="print-section mb-10">
return (
  <article className="mx-auto max-w-3xl">

    <header className="print-section mb-10">

      <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
        ...
      </div>

      {!printMode && (

  <div className="rounded-xl border border-line bg-white p-4">
    <div className="text-xs uppercase text-muted">
      Оценка идеи
    </div>
    <div className="mt-2 text-3xl font-bold text-cobalt">
      {a.verdict_score}/10
    </div>
  </div>

  <div className="rounded-xl border border-line bg-white p-4">
    <div className="text-xs uppercase text-muted">
      Риск
    </div>
    <div className="mt-2 text-2xl font-bold">
      Средний
    </div>
  </div>

  <div className="rounded-xl border border-line bg-white p-4">
    <div className="text-xs uppercase text-muted">
      Инвестиции
    </div>
    <div className="mt-2 text-2xl font-bold">
      ₽ {doc.finance_assumptions?.startup_costs ?? 0}
    </div>
  </div>

  <div className="rounded-xl border border-line bg-white p-4">
    <div className="text-xs uppercase text-muted">
      Средний чек
    </div>
    <div className="mt-2 text-2xl font-bold">
      ₽ {doc.finance_assumptions?.avg_check ?? 0}
    </div>
  </div>

</div>
        {!printMode && (
          <div className="no-print mt-5 flex flex-wrap gap-3">
            <Link
              href={`/project/${projectId}/print`}
              className="rounded-lg bg-cobalt px-5 py-3 text-sm font-semibold text-white hover:bg-cobalt-deep"
            >
              Экспорт в PDF
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold hover:border-cobalt"
            >
              ← К проектам
            </Link>
          </div>
        )}
      </header>

      <section className="print-section mb-10">
        <SectionTab index="01 · Анализ" title="Анализ идеи" />
        <p className="text-sm leading-relaxed">{a.summary}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Целевая аудитория</p>
            <p className="mt-2 text-sm">{a.target_audience}</p>
          </div>
          <div className="rounded-lg border border-line bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Рынок</p>
            <p className="mt-2 text-sm">{a.market}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ok">Сильные стороны</p>
            <List items={a.strengths} marker="+" />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-danger">Слабые места</p>
            <List items={a.weaknesses} marker="–" />
          </div>
        </div>
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Конкуренты и заменители</p>
          <List items={a.competitors} />
        </div>
        <p className="mt-5 rounded-lg bg-cobalt-soft p-4 text-sm font-medium">{a.verdict}</p>
      </section>

      <section className="print-section mb-10">
        <SectionTab index="02 · Риски" title="Карта рисков" />
        <RiskBoard risks={doc.risks} />
      </section>

      <section className="mb-10">
        <SectionTab index="03 · Финансы" title="Финансовая модель, 12 месяцев" />
        <FinTable a={doc.finance_assumptions} />
      </section>

      <section className="print-section mb-10">
        <SectionTab index="04 · Запуск" title="План запуска: первые 90 дней" />
        <ol className="space-y-3">
          {doc.launch_plan.map((s) => (
            <li key={s.step} className="flex gap-4 rounded-lg border border-line bg-white p-4">
              <span className="font-display text-sm font-bold text-cobalt">{String(s.step).padStart(2, "0")}</span>
              <div>
                <p className="text-sm font-semibold">
                  {s.title} <span className="ml-2 font-normal text-muted">{s.timeframe}</span>
                </p>
                <p className="mt-1 text-sm text-muted">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="print-section mb-10">
        <SectionTab index="05 · Рекомендации" title="Рекомендации" />
        <List items={doc.recommendations} />
      </section>

      {!printMode && (
        <div className="no-print mb-8">
          <RatingWidget documentId={documentId} userId={userId} />
        </div>
      )}

      <footer className="border-t border-line pt-4 text-xs text-muted">{DISCLAIMER}</footer>
    </article>
  );
}
