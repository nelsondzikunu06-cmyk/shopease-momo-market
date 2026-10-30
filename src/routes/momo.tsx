import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Page, Card, Field, Select, Btn, Segmented, Empty, num } from "@/components/kit";
import { useStore, setState, uid, today } from "@/lib/store";
import {
  dayKey,
  fmtGHS,
  fmtTime,
  momoEffect,
  type MomoType,
  type OtherDirection,
} from "@/lib/ledger";

export const Route = createFileRoute("/momo")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "ShopEase — MoMo transactions" },
      {
        name: "description",
        content: "Record mobile money deposits, withdrawals and other transactions.",
      },
      { property: "og:title", content: "ShopEase — MoMo transactions" },
      {
        property: "og:description",
        content: "Record mobile money deposits, withdrawals and other transactions.",
      },
    ],
  }),
  component: Momo,
});

function Momo() {
  const s = useStore();
  const [type, setType] = useState<MomoType>("deposit");
  const [dir, setDir] = useState<OtherDirection>("cash_in");
  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState("");
  const [feeInCash, setFeeInCash] = useState(false);
  const [network, setNetwork] = useState("MTN");
  const [note, setNote] = useState("");
  const list = s.momo
    .filter((t) => dayKey(t.at) === today())
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
      momo: [
        ...st.momo,
        {
          id: uid(),
          at: new Date().toISOString(),
          type,
          amount: a,
          fee: num(fee),
          feeInCash,
          network,
          ...(note.trim() ? { note: note.trim() } : {}),
          ...(type === "other" ? { direction: dir } : {}),
        },
      ],
    }));
    toast.success(`${type} of ${fmtGHS(a)} saved`);
    setAmount("");
    setFee("");
    setNote("");
  }

  const preview = momoEffect({
    type,
    amount: num(amount),
    fee: num(fee),
    feeInCash,
    direction: dir,
  });
  return (
    <Page title="MoMo" subtitle="Never enter customer PINs, OTPs or wallet passwords here.">
      <Card>
        <form onSubmit={submit} className="space-y-3">
          <Segmented
            label="Transaction type"
            value={type}
            onChange={setType}
            options={[
              { value: "deposit", label: "Deposit" },
              { value: "withdrawal", label: "Withdraw" },
              { value: "other", label: "Other" },
            ]}
          />
          {type === "other" && (
            <Segmented
              label="Cash direction"
              value={dir}
              onChange={setDir}
              options={[
                { value: "cash_in", label: "Customer pays cash" },
                { value: "cash_out", label: "Customer gets cash" },
              ]}
            />
          )}
          <Field
            label="Amount (GH₵)"
            id="amt"
            inputMode="decimal"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Fee / commission"
              id="fee"
              inputMode="decimal"
              type="number"
              step="0.01"
              min="0"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
            />
            <Select
              label="Network"
              id="net"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
            >
              <option>MTN</option>
              <option>Telecel</option>
              <option>AT</option>
            </Select>
          </div>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[var(--primary)]"
              checked={feeInCash}
              onChange={(e) => setFeeInCash(e.target.checked)}
            />
            Fee was paid to me in cash
          </label>
          <Field
            label="Note (optional)"
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Airtime, bill pay"
            hint="Avoid customer names or phone numbers."
          />
          <p className="text-xs text-muted-foreground">
            Effect: cash {sign(preview.cash)} · float {sign(preview.float)}
          </p>
          <Btn type="submit" className="w-full">
            Save transaction
          </Btn>
        </form>
      </Card>
      <Card>
        <h2 className="mb-2 font-semibold">Today ({list.length})</h2>
        {list.length ? (
          <ul className="divide-y divide-border">
            {list.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                <div>
                  <div className="font-medium capitalize">
                    {t.type} · {t.network}
                    {t.demo && <span className="ml-1 text-xs text-accent">demo</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {fmtTime(t.at)}
                    {t.fee ? ` · fee ${fmtGHS(t.fee)}` : ""}
                    {t.note ? ` · ${t.note}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tabular-nums">{fmtGHS(t.amount)}</span>
                  {s.role === "owner" && (
                    <button
                      aria-label="Delete transaction"
                      className="min-h-11 px-2 text-destructive"
                      onClick={() =>
                        confirm("Delete this transaction?") &&
                        setState((st) => ({ ...st, momo: st.momo.filter((x) => x.id !== t.id) }))
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
          <Empty>No MoMo transactions yet today.</Empty>
        )}
      </Card>
    </Page>
  );
}
const sign = (n: number) => (n >= 0 ? "+" : "−") + fmtGHS(Math.abs(n));
