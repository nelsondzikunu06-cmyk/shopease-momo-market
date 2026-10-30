import { useHydrated } from "@tanstack/react-router";
import { CloudOff } from "lucide-react";
import { Card } from "@/components/kit";
import { browserCloudConfig } from "@/lib/cloud-config";

export function CloudStatus() {
  const hydrated = useHydrated();
  const configured = hydrated && browserCloudConfig() !== null;
  return (
    <Card>
      <h2 className="flex items-center gap-2 font-semibold"><CloudOff className="h-4 w-4 text-accent" aria-hidden /> Cloud connection</h2>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <dt className="text-muted-foreground">Public configuration</dt>
        <dd>{!hydrated ? "Checking…" : configured ? "Configured" : "Unavailable or unsafe"}</dd>
        <dt className="text-muted-foreground">Records synced</dt><dd className="text-accent">No — local only</dd>
        <dt className="text-muted-foreground">Cloud account access</dt><dd>Not connected</dd>
        <dt className="text-muted-foreground">Cloud writes</dt><dd>Disabled in this app</dd>
      </dl>
      <p className="mt-3 text-sm text-muted-foreground">Your existing records and backups remain on this device. Nothing has been uploaded or merged.</p>
      <p className="mt-2 text-sm text-accent">Account access is pending profile requirements and sign-in settings verification. Owner setup and invitations are unavailable: existing rules allow self-provisioned owners and reactivation of inactive members.</p>
      <p className="mt-2 text-xs text-muted-foreground">Configuration is not a connection test. Financial screens remain local, without cloud audit history or offline sync; this is not production-ready cloud access.</p>
    </Card>
  );
}