import type { SiteSettings } from "@/types/siteSettings";

export async function getSiteSettings(): Promise<SiteSettings> {
  return {
    booking_enabled: true
  };
}
