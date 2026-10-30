import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Page, Card, Field, Select, Btn, Empty, num } from "@/components/kit";
import { useStore, setState, uid, today } from "@/lib/store";
import { dayKey, fmtGHS, fmtTime } from "@/lib/ledger";

export const Route = createFileRoute("/expenses")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "ShopEase — Expenses" },
      { name: "description", content: "Record shop expenses paid from the cash drawer." },
      { property: "og:title", content: "ShopEase — Expenses" },
      { property: "og:description", content: "Record shop expenses paid from the cash drawer." },
    ],
  }),
  component: Expenses,
});
const CATS = [
  "Transport",
  "Food",
  "Rent",
  "Electricity",
  "Airtime/Data",
  "Stock purchase",
  "Other",
];

function Expenses() {
  const s = useStore();
  const [cat, setCat] = useState("Transport");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const list = s.expenses
    .filter((x) => dayKey(x.at) === today())
    .slice()
    .reverse();
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const a = num(amount);
    if (a <= 0) {
      toast.error("Enter an amount above 0");
      return;
    }
    setState((st) => ({
      ...st,
      expenses: [
        ...st.expenses,
        {
          id: uid(),
          at: new Date().toISOString(),
          category: cat,
          amount: a,
          ...(note.trim() ? { note: note.trim() } : {}),
        },
      ],
    }));
    toast.success("Expense saved");
    setAmount("");
    setNote("");
  }
  return (
    <Page title="Expenses" subtitle="Paid from physical cash.">
      <Card>
        <form onSubmit={submit} className="space-y-3">
          <Select label="Category" id="cat" value={cat} onChange={(e) => setCat(e.target.value)}>
            {CATS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
          <Field
            label="Amount (GH₵)"
            id="eamt"
            type="number"
            step="0.01"
            inputMode="decimal"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Field label="Note" id="enote" value={note} onChange={(e) => setNote(e.target.value)} />
          <Btn type="submit" className="w-full">
            Save expense
          </Btn>
        </form>
      </Card>
      <Card>
        <h2 className="mb-2 font-semibold">Today</h2>
        {list.length ? (
          <ul className="divide-y divide-border">
            {list.map((x) => (
              <li key={x.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <div>{x.category}</div>
                  <div className="text-xs text-muted-foreground">
                    {fmtTime(x.at)}
                    {x.note ? ` · ${x.note}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tabular-nums">{fmtGHS(x.amount)}</span>
                  {s.role === "owner" && (
                    <button
                      aria-label="Delete expense"
                      className="min-h-11 px-2 text-destructive"
                      onClick={() =>
                        confirm("Delete expense?") &&
                        setState((st) => ({
                          ...st,
                          expenses: st.expenses.filter((y) => y.id !== x.id),
                        }))
                      }
                    >
                      ✕
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>No expenses today.</Empty>
        )}
      </Card>
    </Page>
  );
}
