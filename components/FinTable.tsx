import { buildFinModel, fmtMoney } from "@/lib/fincalc";
import type { FinanceAssumptions } from "@/lib/types";

export function FinTable({ a }: { a: FinanceAssumptions }) {
  const fin = buildFinModel(a);
  const cur = a.currency || "EUR";
  const kpi = [
    { label: "Выручка, год 1", value: fmtMoney(fin.revenueYear, cur) },
    { label: "Чистая прибыль, год 1", value: fmtMoney(fin.netYear, cur) },
    { label: "Маржинальность", value: `${fin.marginPct}%` },
    {
      label: "Окупаемость вложений",
      value: fin.breakevenMonth ? `месяц ${fin.breakevenMonth}` : "за год не окупается",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpi.map((k) => (
          <div key={k.label} className="rounded-lg border border-line bg-white p-4">
            <p className="text-xs text-muted">{k.label}</p>
            <p className="mt-1 font-display text-sm font-semibold sm:text-base">{k.value}</p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-muted">
        Допущения AI: средний чек {fmtMoney(a.avg_check, cur)} · продажи {a.units_m1}→{a.units_m12} шт/мес ·
        прямые издержки {a.cogs_pct}% · постоянные расходы {fmtMoney(a.fixed_costs_month, cur)}/мес ·
        старт {fmtMoney(a.startup_costs, cur)} · налог {a.tax_pct}%. Таблица рассчитана детерминированно.
      </p>

      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] bg-white text-right text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-muted">
              <th className="sticky left-0 bg-paper p-3 text-left font-semibold">Месяц</th>
              <th className="p-3 font-semibold">Продажи</th>
              <th className="p-3 font-semibold">Выручка</th>
              <th className="p-3 font-semibold">Валовая</th>
              <th className="p-3 font-semibold">Постоянные</th>
              <th className="p-3 font-semibold">Чистая</th>
              <th className="p-3 font-semibold">Накопленный CF</th>
            </tr>
          </thead>
          <tbody>
            {fin.rows.map((r) => (
              <tr key={r.month} className="border-b border-line last:border-0">
                <td className="sticky left-0 bg-white p-3 text-left font-semibold">{r.month}</td>
                <td className="p-3">{r.units}</td>
                <td className="p-3">{fmtMoney(r.revenue, cur)}</td>
                <td className="p-3">{fmtMoney(r.gross, cur)}</td>
                <td className="p-3">{fmtMoney(r.fixed, cur)}</td>
                <td className={`p-3 ${r.net < 0 ? "text-danger" : "text-ok"}`}>{fmtMoney(r.net, cur)}</td>
                <td className={`p-3 font-semibold ${r.cumulative < 0 ? "text-danger" : "text-ok"}`}>
                  {fmtMoney(r.cumulative, cur)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {a.insights?.length > 0 && (
        <ul className="mt-5 space-y-2">
          {a.insights.map((t, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-cobalt">▸</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
