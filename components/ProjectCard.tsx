import Link from "next/link";
import type { Project } from "@/lib/types";

const STATUS: Record<Project["status"], { label: string; cls: string }> = {
  questioning: { label: "Готовим вопросы", cls: "bg-amber-soft text-ink" },
  answering: { label: "Ответьте на вопросы", cls: "bg-amber-soft text-ink" },
  generating: { label: "Генерация…", cls: "bg-cobalt-soft text-cobalt-deep" },
  ready: { label: "Готов", cls: "bg-cobalt text-white" },
  failed: { label: "Ошибка — повторите", cls: "bg-danger text-white" },
};

export function ProjectCard({ p }: { p: Project }) {
  const href = p.status === "ready" ? `/project/${p.id}` : `/project/${p.id}/wizard`;
  const s = STATUS[p.status];
  return (
    <Link
      href={href}
      className="block rounded-xl border border-line bg-white p-5 shadow-card transition-colors hover:border-cobalt"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-semibold leading-snug">{p.title}</h3>
        <span className={`shrink-0 rounded px-2 py-1 text-[11px] font-semibold ${s.cls}`}>{s.label}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{p.idea}</p>
      <p className="mt-3 text-xs text-muted">
        {new Date(p.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
      </p>
    </Link>
  );
}
