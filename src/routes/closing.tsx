import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Page, Card, Field, Btn, Stat, num } from "@/components/kit";
import { useStore, setState, today } from "@/lib/store";
import { daySummary, fmtGHS, fmtDay, round2 } from "@/lib/ledger";

export const Route = createFileRoute("/closing")({
  head: () => ({
    meta: [
      { title: "ShopEase — Daily closing" },
      { name: "description", content: "Compare expected cash and float against counted amounts." },
      { property: "og:title", content: "ShopEase — Daily closing" },
      { property: "og:description", content: "Compare expected cash and float against counted amounts." },
    ],
  }),
  component: Closing,
});

function Closing() {
  const s = useStore();
  const day = today();
  const d = daySummary(s, day);
  const [oc, setOc] = useState("");
  const [of, setOf] = useState("");
  const [cc, setCc] = useState("");
  const [cf, setCf] = useState("");
  const saved = s.closings[day];
  useEffect(() => {
    const o = s.openings[day];
    if (o) { setOc(String(o.cash)); setOf(String(o.float)); }
    if (saved) { setCc(String(saved.countedCash)); setCf(String(saved.countedFloat)); }
  }, [s.openings, saved, day]);

  const vc = round2(num(cc) - d.expectedCash);
  const vf = round2(num(cf) - d.expectedFloat);
  const tone = (v: number) => (v === 0 ? "success" : v < 0 ? "danger" : "accent") as const;
  const vs = (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "") + fmtGHS(Math.abs(v));

  return (
    <Page title="Daily closing" subtitle={fmtDay(day)}>
      <Card>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setState((st) => ({ ...st, openings: { ...st.openings, [day]: { cash: num(oc), float: num(of) } } })); toast.success("Opening balances saved"); }}>
          <h2 className="font-semibold">1. Opening balances</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Opening cash" id="oc" type="number" step="0.01" inputMode="decimal" min="0" value={oc} onChange={(e) => setOc(e.target.value)} />
            <Field label="Opening e-float" id="of" type="number" step="0.01" inputMode="decimal" min="0" value={of} onChange={(e) => setOf(e.target.value)} />
          </div>
          <Btn type="submit" variant="ghost" className="w-full">Save opening</Btn>
        </form>
      </Card>
      <Card>
        <h2 className="mb-3 font-semibold">2. Expected now</h2>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Expected cash" value={fmtGHS(d.expectedCash)} />
          <Stat label="Expected float" value={fmtGHS(d.expectedFloat)} tone="accent" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Cash = opening + deposits − withdrawals + cash fees + sales − expenses. Float moves the opposite way to cash for MoMo.</p>
      </Card>
      <Card>
        <form className="space-y-3" onSubmit={(e) => {
          e.preventDefault();
          setState((st) => ({ ...st, closings: { ...st.closings, [day]: { day, countedCash: num(cc), countedFloat: num(cf), expectedCash: d.expectedCash, expectedFloat: d.expectedFloat, at: new Date().toISOString() } } }));
          toast.success("Closing saved");
        }}>
          <h2 className="font-semibold">3. Count & compare</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Counted cash" id="cc" type="number" step="0.01" inputMode="decimal" min="0" value={cc} onChange={(e) => setCc(e.target.value)} required />
            <Field label="Float on phone" id="cf" type="number" step="0.01" inputMode="decimal" min="0" value={cf} onChange={(e) => setCf(e.target.value)} required hint="Read balance from your SIM — never enter your PIN here." />
          </div>
          {(cc !== "" || cf !== "") && (
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Cash variance" value={vs(vc)} tone={tone(vc)} />
              <Stat label="Float variance" value={vs(vf)} tone={tone(vf)} />
            </div>
          )}
          <Btn type="submit" className="w-full">{saved ? "Update closing" : "Save closing"}</Btn>
          {saved && <p className="text-center text-xs text-muted-foreground">Closing saved for today.</p>}
        </form>
      </Card>
    </Page>
  );
}
