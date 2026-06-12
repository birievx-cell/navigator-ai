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
  const a = doc.analysis;
  return (
    <article className="mx-auto max-w-3xl">
      <header className="print-section mb-10">
        <p className="tab-index">Бизнес-документ · Навигатор AI</p>
        <h1 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-3xl">{doc.title}</h1>
        <div className="mt-4 inline-flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-2">
          <span className="text-sm text-muted">Оценка идеи</span>
          <span className="font-display text-xl font-bold text-cobalt">{a.verdict_score}/10</span>
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
