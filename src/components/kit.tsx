import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Page({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </main>
  );
}
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-xl border border-border bg-card p-4", className)}>{children}</section>;
}
export function Stat({ label, value, tone }: { label: string; value: string; tone?: "primary" | "accent" | "danger" | "success" }) {
  const c = { primary: "text-primary", accent: "text-accent", danger: "text-destructive", success: "text-success" }[tone ?? "primary"];
  return (
    <div className="rounded-lg bg-secondary p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("mt-1 font-display text-lg font-semibold tabular-nums", tone && c)}>{value}</div>
    </div>
  );
}
export function Field({ label, id, hint, ...p }: { label: string; id: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input id={id} {...p} className="h-12 w-full rounded-lg border border-input bg-background px-3 text-foreground outline-none focus:ring-2 focus:ring-ring" />
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
export function Select({ label, id, children, ...p }: { label: string; id: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <select id={id} {...p} className="h-12 w-full rounded-lg border border-input bg-background px-3 text-foreground outline-none focus:ring-2 focus:ring-ring">
        {children}
      </select>
    </label>
  );
}
export function Btn({ variant = "primary", className, ...p }: { variant?: "primary" | "ghost" | "danger" | "accent" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    accent: "bg-accent text-accent-foreground hover:opacity-90",
    ghost: "border border-border bg-transparent text-foreground hover:bg-secondary",
    danger: "border border-destructive bg-transparent text-destructive hover:bg-destructive/10",
  }[variant];
  return <button {...p} className={cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 font-medium transition disabled:opacity-50", v, className)} />;
}
export function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-1 rounded-lg bg-secondary p-1" style={{ gridTemplateColumns: `repeat(${options.length},1fr)` }}>
      {options.map((o) => (
        <button type="button" role="radio" aria-checked={value === o.value} key={o.value} onClick={() => onChange(o.value)}
          className={cn("min-h-11 rounded-md text-sm font-medium", value === o.value ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>;
}
export const num = (v: string) => (v === "" ? 0 : Math.max(0, Number(v) || 0));
