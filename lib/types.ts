export type WizardQuestion = {
  id: string;
  text: string;
  hint: string;
  type: "text" | "choice";
  options?: string[];
};

export type Risk = {
  title: string;
  category: string;
  probability: number; // 1..5
  impact: number;      // 1..5
  mitigation: string;
};

export type FinanceAssumptions = {
  currency: string;
  avg_check: number;
  units_m1: number;
  units_m12: number;
  cogs_pct: number;          // 0..100, прямые издержки как % от чека
  fixed_costs_month: number;
  startup_costs: number;
  tax_pct: number;           // 0..100, налог с прибыли (упрощённо)
  insights: string[];
};

export type LaunchStep = {
  step: number;
  title: string;
  description: string;
  timeframe: string;
};

export type Analysis = {
  summary: string;
  target_audience: string;
  market: string;
  competitors: string[];
  strengths: string[];
  weaknesses: string[];
  verdict_score: number; // 1..10
  verdict: string;
};

export type BusinessDocument = {
  title: string;
  analysis: Analysis;
  risks: Risk[];
  finance_assumptions: FinanceAssumptions;
  launch_plan: LaunchStep[];
  recommendations: string[];
};

export type Project = {
  id: string;
  user_id: string;
  title: string;
  idea: string;
  status: "questioning" | "answering" | "generating" | "ready" | "failed";
  questions: WizardQuestion[] | null;
  answers: Record<string, string> | null;
  created_at: string;
};

export type MonthRow = {
  month: number;
  units: number;
  revenue: number;
  cogs: number;
  gross: number;
  fixed: number;
  ebitda: number;
  tax: number;
  net: number;
  cumulative: number;
};

export type FinModel = {
  rows: MonthRow[];
  breakevenMonth: number | null;
  revenueYear: number;
  netYear: number;
  marginPct: number;
};
