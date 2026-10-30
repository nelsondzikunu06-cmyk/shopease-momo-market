import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Page, Card, Field, Btn, Empty, num } from "@/components/kit";
import { useStore, setState, uid } from "@/lib/store";
import { fmtGHS, type Product } from "@/lib/ledger";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "ShopEase — Accessories stock" },
      { name: "description", content: "Manage phone accessory stock, cost and selling prices." },
      { property: "og:title", content: "ShopEase — Accessories stock" },
      { property: "og:description", content: "Manage phone accessory stock, cost and selling prices." },
    ],
  }),
  component: Inventory,
});

const blank = { name: "", qty: "", cost: "", price: "", lowAt: "3" };

function Inventory() {
  const s = useStore();
  const owner = s.role === "owner";
  const [f, setF] = useState(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const set = (k: keyof typeof blank) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) { toast.error("Name required"); return; }
    const p: Omit<Product, "id"> = { name: f.name.trim(), qty: Math.floor(num(f.qty)), cost: num(f.cost), price: num(f.price), lowAt: Math.floor(num(f.lowAt)) };
    if (p.price < p.cost) toast.warning("Selling price is below cost");
    setState((st) => ({
      ...st,
      products: editing ? st.products.map((x) => (x.id === editing ? { ...x, ...p } : x)) : [...st.products, { id: uid(), ...p }],
    }));
    toast.success(editing ? "Product updated" : "Product added");
    setF(blank); setEditing(null);
  }
  const value = s.products.reduce((a, p) => a + p.qty * p.cost, 0);

  return (
    <Page title="Stock" subtitle={`${s.products.length} items · stock at cost ${fmtGHS(value)}`}>
      {owner ? (
        <Card>
          <form onSubmit={submit} className="space-y-3">
            <h2 className="font-semibold">{editing ? "Edit product" : "Add product"}</h2>
            <Field label="Product name" id="pname" value={f.name} onChange={set("name")} required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Quantity on hand" id="pqty" type="number" inputMode="numeric" min="0" value={f.qty} onChange={set("qty")} />
              <Field label="Low-stock alert at" id="plow" type="number" inputMode="numeric" min="0" value={f.lowAt} onChange={set("lowAt")} />
              <Field label="Cost price (GH₵)" id="pcost" type="number" step="0.01" inputMode="decimal" min="0" value={f.cost} onChange={set("cost")} />
              <Field label="Selling price (GH₵)" id="pprice" type="number" step="0.01" inputMode="decimal" min="0" value={f.price} onChange={set("price")} />
            </div>
            <div className="flex gap-2">
              <Btn type="submit" className="flex-1">{editing ? "Save changes" : "Add product"}</Btn>
              {editing && <Btn type="button" variant="ghost" onClick={() => { setEditing(null); setF(blank); }}>Cancel</Btn>}
            </div>
          </form>
        </Card>
      ) : <p className="text-sm text-muted-foreground">Attendant view: switch to Owner under More to edit prices and stock.</p>}
      <Card>
        {s.products.length ? (
          <ul className="divide-y divide-border">
            {s.products.map((p) => (
              <li key={p.id} className="py-3 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="font-medium">{p.name}{p.demo && <span className="ml-1 text-xs text-accent">demo</span>}</span>
                  <span className={p.qty <= p.lowAt ? "text-destructive" : ""}>{p.qty} pcs</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{owner ? `Cost ${fmtGHS(p.cost)} · ` : ""}Sell {fmtGHS(p.price)}{owner ? ` · margin ${fmtGHS(p.price - p.cost)}` : ""}</span>
                  {owner && (
                    <span className="flex gap-1">
                      <button className="min-h-11 px-2 text-primary" onClick={() => { setEditing(p.id); setF({ name: p.name, qty: String(p.qty), cost: String(p.cost), price: String(p.price), lowAt: String(p.lowAt) }); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
                      <button className="min-h-11 px-2 text-destructive" onClick={() => confirm(`Delete ${p.name}?`) && setState((st) => ({ ...st, products: st.products.filter((x) => x.id !== p.id) }))}>Delete</button>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : <Empty>No products yet.</Empty>}
      </Card>
    </Page>
  );
}
