import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Home, Smartphone, ShoppingBag, Package, Menu, HardDrive } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { useStore } from "@/lib/store";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/momo", label: "MoMo", icon: Smartphone },
  { to: "/sales", label: "Sell", icon: ShoppingBag },
  { to: "/inventory", label: "Stock", icon: Package },
  { to: "/more", label: "More", icon: Menu },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const s = useStore();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-sidebar/95 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-display text-lg font-bold">
            Shop<span className="text-primary">Ease</span>
          </Link>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-secondary px-2 py-1 capitalize text-muted-foreground">
              Demo: {s.role}
            </span>
            <Link
              to="/more"
              className="flex items-center gap-1 rounded-full border border-accent/50 px-2 py-1 text-accent"
              aria-label="Data stored on this device only, not synced. Tap for backup."
            >
              <HardDrive className="h-3.5 w-3.5" aria-hidden /> Local only
            </Link>
          </div>
        </div>
      </header>
      {children}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-sidebar"
      >
        <ul className="mx-auto grid max-w-xl grid-cols-5">
          {nav.map(({ to, label, icon: I }) => (
            <li key={to}>
              <Link
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs text-muted-foreground"
                activeProps={{ className: "text-primary" }}
              >
                <I className="h-5 w-5" aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Toaster position="top-center" />
    </div>
  );
}
