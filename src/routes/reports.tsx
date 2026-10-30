import { createFileRoute } from "@tanstack/react-router";
import { Page, Card, Empty } from "@/components/kit";
import { useStore } from "@/lib/store";
import { daySummary, dayKey, fmtGHS, fmtDay } from "@/lib/ledger";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "ShopEase — Reports" },
      {
        name: "description",
        content: "Day-by-day MoMo volume, commission, sales margin, expenses and variances.",
      },
      { property: "og:title", content: "ShopEase — Reports" },
      {
        property: "og:description",
        content: "Day-by-day MoMo volume, commission, sales margin, expenses and variances.",
      },
    ],
  }),
  component: Reports,
});

function Reports() {
  const s = useStore();
  const days = Array.from(
    new Set(
      [...s.momo, ...s.sales, ...s.expenses]
        .map((x) => dayKey(x.at))
        .concat(Object.keys(s.openings)),
    ),
  )
    .sort()
    .reverse();
  const rows = days.map((d) => ({ d, ...daySummary(s, d), c: s.closings[d] }));
  const tot = rows.reduce(
    (a, r) => ({
      vol: a.vol + r.momoVolume,
      com: a.com + r.commission,
      mar: a.mar + r.salesMargin,
      exp: a.exp + r.expenseTotal,
    }),
    { vol: 0, com: 0, mar: 0, exp: 0 },
  );
  return (
    <Page
      title="Reports"
      subtitle="Volume is money moved; profit = commission + sales margin − expenses."
    >
      <Card>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">MoMo volume</span>
          <span className="text-right tabular-nums">{fmtGHS(tot.vol)}</span>
          <span className="text-muted-foreground">Commission</span>
          <span className="text-right tabular-nums">{fmtGHS(tot.com)}</span>
          <span className="text-muted-foreground">Sales margin</span>
          <span className="text-right tabular-nums">{fmtGHS(tot.mar)}</span>
          <span className="text-muted-foreground">Expenses</span>
          <span className="text-right tabular-nums">{fmtGHS(tot.exp)}</span>
          <span className="font-semibold">Est. profit</span>
          <span className="text-right font-semibold tabular-nums text-success">
            {fmtGHS(tot.com + tot.mar - tot.exp)}
          </span>
        </div>
      </Card>
      {rows.length ? (
        rows.map((r) => (
          <Card key={r.d}>
            <h2 className="mb-2 font-semibold">{fmtDay(r.d)}</h2>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-muted-foreground">MoMo ({r.momoCount})</span>
              <span className="text-right">{fmtGHS(r.momoVolume)}</span>
              <span className="text-muted-foreground">Commission</span>
              <span className="text-right">{fmtGHS(r.commission)}</span>
              <span className="text-muted-foreground">Sales / margin</span>
              <span className="text-right">
                {fmtGHS(r.salesRevenue)} / {fmtGHS(r.salesMargin)}
              </span>
              <span className="text-muted-foreground">Expenses</span>
              <span className="text-right">{fmtGHS(r.expenseTotal)}</span>
              <span className="text-muted-foreground">Profit</span>
              <span className="text-right font-medium">{fmtGHS(r.profit)}</span>
              {r.c ? (
                <>
                  <span className="text-muted-foreground">Cash variance</span>
                  <span className="text-right">{fmtGHS(r.c.countedCash - r.c.expectedCash)}</span>
                  <span className="text-muted-foreground">Float variance</span>
                  <span className="text-right">{fmtGHS(r.c.countedFloat - r.c.expectedFloat)}</span>
                </>
              ) : (
                <span className="col-span-2 text-xs text-accent">Not closed</span>
              )}
            </div>
          </Card>
        ))
      ) : (
        <Card>
          <Empty>No records yet.</Empty>
        </Card>
      )}
    </Page>
  );
}
