import type { Advertisement } from "@/types/advertisement";

const WEBSITE_API_URL =
  import.meta.env.VITE_WEBSITE_API_URL ||
  (typeof window !== "undefined" ? `${window.location.origin}/api` : "/api");

async function fetchFromWebsite<T>(path: string): Promise<T> {
  const response = await fetch(`${WEBSITE_API_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  const json = await response.json();
  return json.data ?? json;
}

export const advertisementService = {
  async getActivePopup(): Promise<Advertisement | null> {
    return fetchFromWebsite<Advertisement | null>("/advertisements/active?placement=homepage");
  },
};
