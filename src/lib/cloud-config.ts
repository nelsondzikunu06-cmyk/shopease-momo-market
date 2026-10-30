export interface BrowserCloudConfig {
  url: string;
  anonKey: string;
}

export function validateBrowserCloudConfig(
  url?: string,
  anonKey?: string,
): BrowserCloudConfig | null {
  if (!url || !anonKey || anonKey.startsWith("sb_secret_")) return null;
  try {
    if (new URL(url).protocol !== "https:") return null;
    if (!anonKey.startsWith("sb_publishable_")) {
      const payload = anonKey.split(".")[1];
      if (!payload) return null;
      const decoded: unknown = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
      if (
        typeof decoded !== "object" ||
        decoded === null ||
        !("role" in decoded) ||
        decoded.role !== "anon"
      )
        return null;
    }
    return { url, anonKey };
  } catch {
    return null;
  }
}

export function browserCloudConfig() {
  return validateBrowserCloudConfig(
    import.meta.env["VITE_SUPABASE_URL"],
    import.meta.env["VITE_SUPABASE_ANON_KEY"],
  );
}
