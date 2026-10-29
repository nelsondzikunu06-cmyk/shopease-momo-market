import { describe, it, expect } from "vitest";
import { momoEffect, daySummary, emptyState, saleMargin } from "./ledger";

describe("ledger rules", () => {
  it("deposit adds cash and reduces float", () => {
    expect(momoEffect({ type: "deposit", amount: 100, fee: 0, feeInCash: false })).toEqual({ cash: 100, float: -100 });
  });
  it("withdrawal reduces cash and adds float", () => {
    expect(momoEffect({ type: "withdrawal", amount: 100, fee: 2, feeInCash: false })).toEqual({ cash: -100, float: 100 });
  });
  it("fee paid in cash adds to cash only", () => {
    expect(momoEffect({ type: "withdrawal", amount: 100, fee: 2, feeInCash: true })).toEqual({ cash: -98, float: 100 });
  });
  it("sale margin is revenue minus cost", () => {
    expect(saleMargin({ id: "", at: "", productId: "", productName: "", qty: 2, unitPrice: 15, unitCost: 5 })).toBe(20);
  });
  it("profit excludes momo volume", () => {
    const s = emptyState();
    const at = "2026-10-29T10:00:00Z";
    s.openings["2026-10-29"] = { cash: 1000, float: 2000 };
    s.momo.push({ id: "1", at, type: "deposit", amount: 500, fee: 3, feeInCash: false, network: "MTN" });
    s.expenses.push({ id: "2", at, category: "Food", amount: 10 });
    const d = daySummary(s, "2026-10-29");
    expect(d.expectedCash).toBe(1490);
    expect(d.expectedFloat).toBe(1500);
    expect(d.profit).toBe(-7);
  });
});
