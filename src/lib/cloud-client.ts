import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { browserCloudConfig } from "./cloud-config";

let client: SupabaseClient<Database> | undefined;

// Lazy, browser-only and separate from local record storage. No writes or auth UI
// call this scaffolding until the auth and provisioning milestone is verified.
export function getBrowserCloudClient(): SupabaseClient<Database> {
  if (typeof window === "undefined") throw new Error("Cloud access requires the browser");
  const config = browserCloudConfig();
  if (!config) throw new Error("Safe public cloud configuration is unavailable");
  client ??= createClient<Database>(config.url, config.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(input instanceof Request ? input.headers : undefined);
        new Headers(init?.headers).forEach((value, key) => headers.set(key, value));
        if (
          headers.get("Authorization") === `Bearer ${config.anonKey}` &&
          config.anonKey.startsWith("sb_publishable_")
        )
          headers.delete("Authorization");
        headers.set("apikey", config.anonKey);
        return fetch(input, { ...init, headers });
      },
    },
  });
  return client;
}
