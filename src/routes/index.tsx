import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { Page, Card, Stat, Btn } from "@/components/kit";
import { useStore, today, seedDemo, hasDemo } from "@/lib/store";
import { daySummary, fmtGHS, fmtDay } from "@/lib/ledger";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShopEase — Today's dashboard" },
      { name: "description", content: "Today's MoMo, accessory sales, expenses and stock alerts at a glance." },
      { property: "og:title", content: "ShopEase — Today's dashboard" },
      { property: "og:description", content: "Today's MoMo, accessory sales, expenses and stock alerts at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const s = useStore();
  const d = daySummary(s, today());
  const low = s.products.filter((p) => p.qty <= p.lowAt);
  const empty = !s.momo.length && !s.products.length;
  return (
    <Page title="Today" subtitle={fmtDay(today())}>
      <div className="grid grid-cols-2 gap-3">
        <Link to="/momo"><Btn className="w-full">+ MoMo</Btn></Link>
        <Link to="/sales"><Btn variant="accent" className="w-full">+ Sale</Btn></Link>
      </div>
      {empty && (
        <Card>
          <p className="text-sm text-muted-foreground">No records yet. Set today's opening cash in Close, or load labelled demo data to explore.</p>
          <Btn variant="ghost" className="mt-3 w-full" onClick={seedDemo}>Load demo data</Btn>
        </Card>
      )}
      {hasDemo(s) && <p className="rounded-lg bg-accent/15 p-3 text-sm text-accent">Demo data is loaded. Remove it under More → Data.</p>}
      <Card>
        <h2 className="mb-3 font-semibold">Cash & float (expected)</h2>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Physical cash" value={fmtGHS(d.expectedCash)} />
          <Stat label="E-float" value={fmtGHS(d.expectedFloat)} tone="accent" />
        </div>
      </Card>
      <Card>
        <h2 className="mb-3 font-semibold">MoMo today · {d.momoCount}</h2>
        <div className="grid grid-cols-3 gap-2">
          <Stat label={`Deposits (${d.deposit.count})`} value={fmtGHS(d.deposit.value)} />
          <Stat label={`Withdrawals (${d.withdrawal.count})`} value={fmtGHS(d.withdrawal.value)} />
          <Stat label={`Other (${d.other.count})`} value={fmtGHS(d.other.value)} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Volume moved is not profit. Fees/commission earned: <b className="text-foreground">{fmtGHS(d.commission)}</b></p>
      </Card>
      <Card>
        <h2 className="mb-3 font-semibold">Shop</h2>
        <div className="grid grid-cols-2 gap-3">
          <Stat label={`Sales (${d.salesCount})`} value={fmtGHS(d.salesRevenue)} />
          <Stat label="Gross margin" value={fmtGHS(d.salesMargin)} tone="success" />
          <Stat label="Expenses" value={fmtGHS(d.expenseTotal)} tone="danger" />
          <Stat label="Est. profit today" value={fmtGHS(d.profit)} tone={d.profit >= 0 ? "success" : "danger"} />
        </div>
      </Card>
      <Card>
        <h2 className="mb-2 flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4 text-accent" aria-hidden /> Stock alerts</h2>
        {low.length ? (
          <ul className="divide-y divide-border">
            {low.map((p) => (
              <li key={p.id} className="flex justify-between py-2 text-sm"><span>{p.name}</span><span className="text-destructive">{p.qty} left</span></li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">All items above their low-stock level.</p>}
      </Card>
    </Page>
  );
}
