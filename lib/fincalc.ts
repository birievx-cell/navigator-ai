// Детерминированный финансовый калькулятор.
// Принцип продукта: ЦИФРЫ СЧИТАЕТ КОД, AI даёт только допущения и выводы.
import type { FinanceAssumptions, FinModel, MonthRow } from "./types";

export function buildFinModel(a: FinanceAssumptions): FinModel {
  const rows: MonthRow[] = [];
  let cumulative = -Math.max(0, a.startup_costs);
  let breakevenMonth: number | null = null;

  for (let m = 1; m <= 12; m++) {
    // линейная интерполяция объёма продаж между месяцем 1 и месяцем 12
    const units = Math.round(a.units_m1 + ((a.units_m12 - a.units_m1) * (m - 1)) / 11);
    const revenue = units * a.avg_check;
    const cogs = (revenue * clampPct(a.cogs_pct)) / 100;
    const gross = revenue - cogs;
    const fixed = a.fixed_costs_month;
    const ebitda = gross - fixed;
    const tax = ebitda > 0 ? (ebitda * clampPct(a.tax_pct)) / 100 : 0;
    const net = ebitda - tax;
    cumulative += net;
    if (breakevenMonth === null && cumulative >= 0) breakevenMonth = m;
    rows.push({ month: m, units, revenue, cogs, gross, fixed, ebitda, tax, net, cumulative });
  }

  const revenueYear = rows.reduce((s, r) => s + r.revenue, 0);
  const netYear = rows.reduce((s, r) => s + r.net, 0);
  const marginPct = revenueYear > 0 ? Math.round((netYear / revenueYear) * 100) : 0;
  return { rows, breakevenMonth, revenueYear, netYear, marginPct };
}

function clampPct(v: number) {
  return Math.min(100, Math.max(0, Number(v) || 0));
}

export function fmtMoney(n: number, currency = "EUR") {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: currency || "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}
