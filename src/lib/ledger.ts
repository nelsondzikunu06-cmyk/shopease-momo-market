// Pure business rules for ShopEase. No browser APIs here.
export type MomoType = "deposit" | "withdrawal" | "other";
export type OtherDirection = "cash_in" | "cash_out"; // cash_in behaves like deposit (customer pays cash, we send e-value)

export interface MomoTx {
  id: string;
  at: string; // ISO
  type: MomoType;
  amount: number;
  fee: number; // commission/fee earned — tracked separately
  feeInCash: boolean; // true if customer paid the fee in cash at the counter
  direction?: OtherDirection;
  network: string;
  note?: string;
  demo?: boolean;
}
export interface Product {
  id: string;
  name: string;
  qty: number;
  cost: number;
  price: number;
  lowAt: number;
  demo?: boolean;
}
export interface Sale {
  id: string;
  at: string;
  productId: string;
  productName: string;
  qty: number;
  unitPrice: number;
  unitCost: number;
  demo?: boolean;
}
export interface Expense {
  id: string;
  at: string;
  category: string;
  amount: number;
  note?: string;
  demo?: boolean;
}
export interface DayOpening {
  cash: number;
  float: number;
}
export interface Closing {
  day: string;
  countedCash: number;
  countedFloat: number;
  expectedCash: number;
  expectedFloat: number;
  at: string;
  note?: string;
}
export interface State {
  momo: MomoTx[];
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  openings: Record<string, DayOpening>;
  closings: Record<string, Closing>;
  role: "owner" | "attendant";
}

export const emptyState = (): State => ({
  momo: [],
  products: [],
  sales: [],
  expenses: [],
  openings: {},
  closings: {},
  role: "owner",
});

/** Effect of a MoMo transaction on physical cash and e-float. */
export function momoEffect(t: Pick<MomoTx, "type" | "amount" | "fee" | "feeInCash" | "direction">) {
  const cashIn = t.type === "deposit" || (t.type === "other" && t.direction !== "cash_out");
  const cash = (cashIn ? t.amount : -t.amount) + (t.feeInCash ? t.fee : 0);
  const float = cashIn ? -t.amount : t.amount;
  return { cash, float };
}

export const saleRevenue = (s: Sale) => s.qty * s.unitPrice;
export const saleMargin = (s: Sale) => s.qty * (s.unitPrice - s.unitCost);

const TZ = "Africa/Accra";
export function dayKey(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}
export const fmtGHS = (n: number) =>
  "GH₵ " + n.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GH", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
export const fmtDay = (key: string) =>
  new Intl.DateTimeFormat("en-GH", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date(key + "T00:00:00Z"));

export function daySummary(s: State, day: string) {
  const momo = s.momo.filter((t) => dayKey(t.at) === day);
  const sales = s.sales.filter((t) => dayKey(t.at) === day);
  const expenses = s.expenses.filter((t) => dayKey(t.at) === day);
  const opening = s.openings[day] ?? { cash: 0, float: 0 };
  const byType = (ty: MomoType) => {
    const l = momo.filter((t) => t.type === ty);
    return { count: l.length, value: l.reduce((a, t) => a + t.amount, 0) };
  };
  let cash = opening.cash;
  let float = opening.float;
  for (const t of momo) {
    const e = momoEffect(t);
    cash += e.cash;
    float += e.float;
  }
  const salesRevenue = sales.reduce((a, x) => a + saleRevenue(x), 0);
  const salesMargin = sales.reduce((a, x) => a + saleMargin(x), 0);
  const expenseTotal = expenses.reduce((a, x) => a + x.amount, 0);
  cash += salesRevenue - expenseTotal;
  const commission = momo.reduce((a, t) => a + t.fee, 0);
  return {
    opening,
    deposit: byType("deposit"),
    withdrawal: byType("withdrawal"),
    other: byType("other"),
    momoCount: momo.length,
    momoVolume: momo.reduce((a, t) => a + t.amount, 0),
    commission,
    salesRevenue,
    salesMargin,
    salesCount: sales.length,
    expenseTotal,
    expectedCash: round2(cash),
    expectedFloat: round2(float),
    profit: round2(commission + salesMargin - expenseTotal),
  };
}
export const round2 = (n: number) => Math.round(n * 100) / 100;
