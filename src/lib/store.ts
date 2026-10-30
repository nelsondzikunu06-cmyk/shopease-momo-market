import { useSyncExternalStore } from "react";
import { emptyState, dayKey, type State } from "./ledger";

const KEY = "shopease:v1";
let state: State = emptyState();
let loaded = false;
const listeners = new Set<() => void>();
const SERVER = emptyState();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...emptyState(), ...JSON.parse(raw) };
  } catch {
    /* corrupted storage: start fresh */
  }
}
export function getState() {
  load();
  return state;
}
export function setState(fn: (s: State) => State) {
  load();
  state = fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    alert("Could not save — device storage may be full. Export a backup now.");
  }
  listeners.forEach((l) => l());
}
export function useStore() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getState,
    () => SERVER,
  );
}
export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
export const today = () => dayKey(new Date());

export function exportJSON() {
  const blob = new Blob([JSON.stringify({ app: "ShopEase", version: 1, exportedAt: new Date().toISOString(), data: getState() }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `shopease-backup-${today()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
export function importJSON(text: string) {
  const parsed = JSON.parse(text);
  const data = parsed?.data ?? parsed;
  if (!data || !Array.isArray(data.momo) || !Array.isArray(data.products)) throw new Error("Not a ShopEase backup file");
  setState(() => ({ ...emptyState(), ...data }));
}

export function seedDemo() {
  const now = Date.now();
  const at = (minsAgo: number) => new Date(now - minsAgo * 60000).toISOString();
  const p = [
    { id: uid(), name: "USB-C charger 20W", qty: 12, cost: 35, price: 60, lowAt: 3 },
    { id: uid(), name: "Earphones (wired)", qty: 2, cost: 15, price: 30, lowAt: 3 },
    { id: uid(), name: "Screen protector", qty: 25, cost: 5, price: 15, lowAt: 5 },
    { id: uid(), name: "Power bank 10000mAh", qty: 4, cost: 90, price: 150, lowAt: 2 },
  ].map((x) => ({ ...x, demo: true }));
  const demoProduct = p[2];
  if (!demoProduct) return;
  setState((s) => ({
    ...s,
    products: [...s.products, ...p],
    momo: [
      ...s.momo,
      { id: uid(), at: at(200), type: "deposit", amount: 300, fee: 0, feeInCash: false, network: "MTN", demo: true },
      { id: uid(), at: at(150), type: "withdrawal", amount: 500, fee: 5, feeInCash: false, network: "MTN", demo: true },
      { id: uid(), at: at(90), type: "deposit", amount: 120, fee: 0, feeInCash: false, network: "Telecel", demo: true },
      { id: uid(), at: at(30), type: "other", direction: "cash_in", amount: 20, fee: 0.5, feeInCash: true, network: "AT", note: "Airtime", demo: true },
    ],
    sales: [...s.sales, { id: uid(), at: at(60), productId: demoProduct.id, productName: demoProduct.name, qty: 2, unitPrice: 15, unitCost: 5, demo: true }],
    expenses: [...s.expenses, { id: uid(), at: at(100), category: "Transport", amount: 10, note: "Trotro to float agent", demo: true }],
    openings: { ...s.openings, [today()]: s.openings[today()] ?? { cash: 1000, float: 2000 } },
  }));
}
export function clearDemo() {
  setState((s) => ({
    ...s,
    products: s.products.filter((x) => !x.demo),
    momo: s.momo.filter((x) => !x.demo),
    sales: s.sales.filter((x) => !x.demo),
    expenses: s.expenses.filter((x) => !x.demo),
  }));
}
export const hasDemo = (s: State) => [s.products, s.momo, s.sales, s.expenses].some((l) => l.some((x) => x.demo));
