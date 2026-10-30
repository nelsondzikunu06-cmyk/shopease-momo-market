import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { validateBrowserCloudConfig } from "./cloud-config";
import {
  activeOwnMemberships,
  membershipRole,
  readOwnBusinesses,
  type Membership,
} from "./cloud-read";

const member = (overrides: Partial<Membership> = {}): Membership => ({
  id: "membership",
  user_id: "alice",
  business_id: "shop-a",
  role: "attendant",
  active: true,
  created_at: "2026-10-30T00:00:00Z",
  ...overrides,
});

describe("safe cloud configuration", () => {
  it("rejects a service-role credential", () => {
    const jwt = `header.${btoa(JSON.stringify({ role: "service_role" }))}.signature`;
    expect(validateBrowserCloudConfig("https://example.test", jwt)).toBeNull();
    expect(validateBrowserCloudConfig("https://example.test", "sb_secret_test")).toBeNull();
  });
  it("requires HTTPS and a public credential", () => {
    expect(validateBrowserCloudConfig("http://example.test", "sb_publishable_test")).toBeNull();
    expect(validateBrowserCloudConfig("https://example.test", "sb_publishable_test")?.url).toBe(
      "https://example.test",
    );
    expect(validateBrowserCloudConfig(undefined, undefined)).toBeNull();
  });
});

describe("read-only membership boundary", () => {
  it("never grants owner from a demo role or an unrelated user's membership", () => {
    expect(
      membershipRole([member(), member({ user_id: "bob", role: "owner" })], "alice", "shop-a"),
    ).toBe("attendant");
    expect(membershipRole([], "alice", "shop-a")).toBeNull();
  });
  it("never treats inactive membership as active", () => {
    const rows = [member({ active: false, role: "owner" })];
    expect(activeOwnMemberships(rows, "alice")).toEqual([]);
    expect(membershipRole(rows, "alice", "shop-a")).toBeNull();
  });
  it("requires an explicit verified user before reading", async () => {
    const from = vi.fn();
    const client = { from } as unknown as SupabaseClient<Database>;
    await expect(readOwnBusinesses(client, "")).rejects.toThrow("verified signed-in user");
    expect(from).not.toHaveBeenCalled();
  });
  it("scopes membership and business reads and rejects sibling tenant rows", async () => {
    const filters: [string, unknown][] = [];
    const memberQuery = {
      select: () => memberQuery,
      eq: (column: string, value: unknown) => {
        filters.push([column, value]);
        return column === "active"
          ? Promise.resolve({
              data: [member(), member({ user_id: "bob", business_id: "shop-b" })],
              error: null,
            })
          : memberQuery;
      },
    };
    const inFilter = vi.fn().mockResolvedValue({
      data: [
        { id: "shop-a", name: "A" },
        { id: "shop-b", name: "B" },
      ],
      error: null,
    });
    const from = vi.fn((table: string) =>
      table === "business_members" ? memberQuery : { select: () => ({ in: inFilter }) },
    );
    const result = await readOwnBusinesses(
      { from } as unknown as SupabaseClient<Database>,
      "alice",
    );
    expect(filters).toEqual([
      ["user_id", "alice"],
      ["active", true],
    ]);
    expect(inFilter).toHaveBeenCalledWith("id", ["shop-a"]);
    expect(result.businesses.map((business) => business.id)).toEqual(["shop-a"]);
  });
  it("does not query businesses for an account without active membership", async () => {
    const query = {
      select: () => query,
      eq: (column: string) =>
        column === "active" ? Promise.resolve({ data: [], error: null }) : query,
    };
    const from = vi.fn(() => query);
    const result = await readOwnBusinesses(
      { from } as unknown as SupabaseClient<Database>,
      "alice",
    );
    expect(result).toEqual({ memberships: [], businesses: [] });
    expect(from).toHaveBeenCalledTimes(1);
  });
});
