import type { Risk } from "@/lib/types";

function level(r: Risk) {
  const score = r.probability * r.impact;
  if (score >= 15) return { label: "Критический", cls: "bg-danger text-white" };
  if (score >= 8) return { label: "Высокий", cls: "bg-amber text-white" };
  return { label: "Умеренный", cls: "bg-cobalt-soft text-cobalt-deep" };
}

export function RiskBoard({ risks }: { risks: Risk[] }) {
  const sorted = [...risks].sort((a, b) => b.probability * b.impact - a.probability * a.impact);
  return (
    <div className="grid gap-3">
      {sorted.map((r, i) => {
        const lv = level(r);
        return (
          <div key={i} className="print-section rounded-lg border border-line bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${lv.cls}`}>{lv.label}</span>
              <span className="text-[11px] uppercase tracking-wide text-muted">{r.category}</span>
              <span className="ml-auto text-[11px] text-muted">
                вероятность {r.probability}/5 · ущерб {r.impact}/5
              </span>
            </div>
            <p className="mt-2 font-semibold">{r.title}</p>
            <p className="mt-1 text-sm text-muted">
              <span className="font-semibold text-ink">Что делать: </span>
              {r.mitigation}
            </p>
          </div>
        );
      })}
    </div>
  );
}
