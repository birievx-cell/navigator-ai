"use client";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt";
  const styles = {
    primary: "bg-cobalt text-white hover:bg-cobalt-deep",
    ghost: "text-cobalt hover:bg-cobalt-soft",
    outline: "border border-line bg-white text-ink hover:border-cobalt hover:text-cobalt",
  }[variant];
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-line bg-white shadow-card ${className}`}>{children}</div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-3 text-muted">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-cobalt" aria-hidden />
      {label}
    </span>
  );
}

export function SectionTab({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-2">
      <span className="tab-index">{index}</span>
      <h2 className="font-display text-lg font-semibold">{title}</h2>
    </div>
  );
}
