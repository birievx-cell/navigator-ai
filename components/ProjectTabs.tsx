"use client";
import { useState } from "react";
import { DocumentView } from "./DocumentView";
import { FinTable } from "./FinTable";
import { SectionTab } from "./ui";
import type { BusinessDocument } from "@/lib/types";

type TabId = "document" | "finance" | "consultant";

const TABS: { id: TabId; label: string }[] = [
  { id: "document", label: "Документ" },
  { id: "finance", label: "Финансы" },
  { id: "consultant", label: "AI Консультант" },
];

export function ProjectTabs({
  doc,
  projectId,
  documentId,
  userId,
}: {
  doc: BusinessDocument;
  projectId: string;
  documentId: string;
  userId: string;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("document");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="no-print mb-6 flex gap-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "border-cobalt bg-cobalt text-white"
                : "border-line bg-white hover:border-cobalt"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "document" && (
        <DocumentView doc={doc} projectId={projectId} documentId={documentId} userId={userId} />
      )}

      {activeTab === "finance" && (
        <article>
          <section>
            <SectionTab index="03 · Финансы" title="Финансовая модель, 12 месяцев" />
            <FinTable a={doc.finance_assumptions} />
          </section>
        </article>
      )}

      {activeTab === "consultant" && (
        <article className="rounded-xl border border-line bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold">AI Консультант скоро будет доступен</p>
        </article>
      )}
    </div>
  );
}
