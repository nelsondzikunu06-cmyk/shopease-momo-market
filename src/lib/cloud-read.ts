import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Membership = Database["public"]["Tables"]["business_members"]["Row"];
export type Business = Database["public"]["Tables"]["businesses"]["Row"];

export function activeOwnMemberships(rows: Membership[], userId: string): Membership[] {
  return rows.filter(
    (row) =>
      row.user_id === userId && row.active && (row.role === "owner" || row.role === "attendant"),
  );
}

export function membershipRole(rows: Membership[], userId: string, businessId: string) {
  return (
    activeOwnMemberships(rows, userId).find((row) => row.business_id === businessId)?.role ?? null
  );
}

// Read-only scaffolding: callers must supply an Auth-server-verified user ID.
// These filters are defense in depth, not authorization; live RLS still applies.
// Nothing imports this module into the local store or invokes it on page load.
export async function readOwnBusinesses(client: SupabaseClient<Database>, verifiedUserId: string) {
  if (!verifiedUserId.trim()) throw new Error("A verified signed-in user is required");
  const members = await client
    .from("business_members")
    .select("*")
    .eq("user_id", verifiedUserId)
    .eq("active", true);
  if (members.error) throw members.error;
  const memberships = activeOwnMemberships(members.data ?? [], verifiedUserId);
  const ids = [...new Set(memberships.map((row) => row.business_id))];
  if (!ids.length) return { memberships, businesses: [] as Business[] };
  const result = await client.from("businesses").select("*").in("id", ids);
  if (result.error) throw result.error;
  return {
    memberships,
    businesses: (result.data ?? []).filter((business) => ids.includes(business.id)),
  };
}
