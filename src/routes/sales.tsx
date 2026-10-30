import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Page, Card, Btn, Empty } from "@/components/kit";
import { useStore, setState, uid, today } from "@/lib/store";
import { dayKey, fmtGHS, fmtTime, saleMargin, saleRevenue } from "@/lib/ledger";

export const Route = createFileRoute("/sales")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "ShopEase — Sell accessories" },
      {
        name: "description",
        content: "Record accessory sales in two taps; stock and margin update automatically.",
      },
      { property: "og:title", content: "ShopEase — Sell accessories" },
      {
        property: "og:description",
        content: "Record accessory sales in two taps; stock and margin update automatically.",
      },
    ],
  }),
  component: Sales,
});

function Sales() {
  const s = useStore();
  const [qty, setQty] = useState<Record<string, number>>({});
  const list = s.sales
    .filter((x) => dayKey(x.at) === today())
    .slice()
    .reverse();

  function sell(id: string) {
    const p = s.products.find((x) => x.id === id);
    const q = qty[id] ?? 1;
    if (!p) return;
    if (q > p.qty) {
      toast.error(`Only ${p.qty} in stock`);
      return;
    }
    setState((st) => ({
      ...st,
      products: st.products.map((x) => (x.id === id ? { ...x, qty: x.qty - q } : x)),
      sales: [
        ...st.sales,
        {
          id: uid(),
          at: new Date().toISOString(),
          productId: p.id,
          productName: p.name,
          qty: q,
          unitPrice: p.price,
          unitCost: p.cost,
        },
      ],
    }));
    setQty((m) => ({ ...m, [id]: 1 }));
    toast.success(`Sold ${q} × ${p.name} — ${fmtGHS(q * p.price)}`);
  }
  function undo(id: string) {
    const sale = s.sales.find((x) => x.id === id);
    if (!sale || !confirm("Undo this sale and return stock?")) return;
    setState((st) => ({
      ...st,
      sales: st.sales.filter((x) => x.id !== id),
      products: st.products.map((x) =>
        x.id === sale.productId ? { ...x, qty: x.qty + sale.qty } : x,
      ),
    }));
  }

  return (
    <Page title="Sell" subtitle="Tap Sell — cash received at selling price.">
      {!s.products.length && (
        <Card>
          <Empty>
            No products yet.{" "}
            <Link to="/inventory" className="text-primary underline">
              Add stock
            </Link>
          </Empty>
        </Card>
      )}
      <ul className="space-y-2">
        {s.products.map((p) => {
          const q = qty[p.id] ?? 1;
          return (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">
                  {fmtGHS(p.price)} · {p.qty} in stock
                </div>
              </div>
              <div className="flex items-center" role="group" aria-label={`Quantity for ${p.name}`}>
                <button
                  aria-label="Decrease"
                  className="h-11 w-10 rounded-l-lg bg-secondary"
                  onClick={() => setQty((m) => ({ ...m, [p.id]: Math.max(1, q - 1) }))}
                >
                  −
                </button>
                <span className="w-8 text-center tabular-nums" aria-live="polite">
                  {q}
                </span>
                <button
                  aria-label="Increase"
                  className="h-11 w-10 rounded-r-lg bg-secondary"
                  onClick={() => setQty((m) => ({ ...m, [p.id]: q + 1 }))}
                >
                  +
                </button>
              </div>
              <Btn
                variant="accent"
                disabled={p.qty < 1}
                onClick={() => sell(p.id)}
                aria-label={`Sell ${q} ${p.name}`}
              >
                Sell
              </Btn>
            </li>
          );
        })}
      </ul>
      <Card>
        <h2 className="mb-2 font-semibold">Today's sales</h2>
        {list.length ? (
          <ul className="divide-y divide-border">
            {list.map((x) => (
              <li key={x.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <div>
                    {x.qty} × {x.productName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {fmtTime(x.at)} · margin {fmtGHS(saleMargin(x))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tabular-nums">{fmtGHS(saleRevenue(x))}</span>
                  <button
                    className="min-h-11 px-2 text-xs text-muted-foreground underline"
                    onClick={() => undo(x.id)}
                  >
                    Undo
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>No sales yet today.</Empty>
        )}
      </Card>
    </Page>
  );
}
