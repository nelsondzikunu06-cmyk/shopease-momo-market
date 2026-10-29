import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { toast } from "sonner";
import { Receipt, ClipboardCheck, BarChart3, ChevronRight, ShieldAlert } from "lucide-react";
import { Page, Card, Btn, Segmented } from "@/components/kit";
import { useStore, setState, exportJSON, importJSON, seedDemo, clearDemo, hasDemo } from "@/lib/store";
import { emptyState } from "@/lib/ledger";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "ShopEase — More, backup & settings" },
      { name: "description", content: "Expenses, daily closing, reports, backup and restore." },
      { property: "og:title", content: "ShopEase — More, backup & settings" },
      { property: "og:description", content: "Expenses, daily closing, reports, backup and restore." },
    ],
  }),
  component: More,
});

const links = [
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/closing", label: "Daily closing", icon: ClipboardCheck },
  { to: "/reports", label: "Reports", icon: BarChart3 },
] as const;

function More() {
  const s = useStore();
  const file = useRef<HTMLInputElement>(null);
  const owner = s.role === "owner";
  return (
    <Page title="More">
      <ul className="overflow-hidden rounded-xl border border-border bg-card">
        {links.map(({ to, label, icon: I }) => (
          <li key={to} className="border-b border-border last:border-0">
            <Link to={to} className="flex min-h-14 items-center gap-3 px-4"><I className="h-5 w-5 text-primary" aria-hidden /><span className="flex-1">{label}</span><ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden /></Link>
          </li>
        ))}
      </ul>
      <Card className="border-accent/50">
        <h2 className="flex items-center gap-2 font-semibold"><ShieldAlert className="h-4 w-4 text-accent" aria-hidden /> Data is on this device only</h2>
        <p className="mt-2 text-sm text-muted-foreground">Records are saved in this browser and are <b className="text-foreground">not synced</b> to any cloud. Clearing browser data or losing the phone loses them. Export a backup daily and keep it somewhere safe (e.g. send to yourself). This is a demo MVP, not certified finance software.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Btn onClick={exportJSON}>Export backup</Btn>
          <Btn variant="ghost" disabled={!owner} onClick={() => file.current?.click()}>Restore</Btn>
        </div>
        <input ref={file} type="file" accept="application/json,.json" className="hidden" aria-label="Choose backup file"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f || !confirm("Replace all current data with this backup?")) return;
            try { importJSON(await f.text()); toast.success("Backup restored"); } catch (err) { toast.error((err as Error).message); }
          }} />
      </Card>
      <Card>
        <h2 className="mb-2 font-semibold">Role on this device</h2>
        <Segmented label="Role" value={s.role} onChange={(role) => setState((st) => ({ ...st, role }))} options={[{ value: "owner", label: "Owner" }, { value: "attendant", label: "Attendant" }]} />
        <p className="mt-2 text-xs text-muted-foreground">Attendant hides cost prices, deleting and restore. This is a convenience switch only — <b>not secure</b> — anyone with the phone can change it. Real access control needs sign-in and a backend.</p>
      </Card>
      <Card>
        <h2 className="mb-2 font-semibold">Demo data</h2>
        <div className="grid grid-cols-2 gap-2">
          <Btn variant="ghost" onClick={seedDemo}>Load demo</Btn>
          <Btn variant="ghost" disabled={!hasDemo(s)} onClick={() => { clearDemo(); toast.success("Demo data removed"); }}>Remove demo</Btn>
        </div>
        {owner && <Btn variant="danger" className="mt-3 w-full" onClick={() => confirm("Erase ALL records on this device? Export a backup first.") && setState(() => emptyState())}>Erase all data</Btn>}
      </Card>
    </Page>
  );
}
