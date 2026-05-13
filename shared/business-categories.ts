export const BUSINESS_CATEGORIES = [
  "Agriculture / Livestock",
  "Transport Industry",
  "Health / Medical",
  "Import / Export",
  "Retail / Wholesalers",
  "Professional Services / Consultancy",
  "Public Owned Utilities / Real Estate Dev",
  "Media / Advertisement / Entertainment",
  "Research & Development",
  "Information Technology",
  "Education",
  "Banking / Finance",
  "Hotels / Home Stay Accommodation",
  "Manufacturing / Packaging",
  "Equipment / Assorted",
  "Construction",
  "Tourism and Hospitality",
] as const;

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];

export const BUSINESS_PLANS = ["Bronze", "Silver", "Gold"] as const;

const LEGACY_CATEGORY_MAP: Record<string, BusinessCategory> = {
  Agriculture: "Agriculture / Livestock",
  Manufacturing: "Manufacturing / Packaging",
  Trade: "Retail / Wholesalers",
  Services: "Professional Services / Consultancy",
  Construction: "Construction",
  Technology: "Information Technology",
};

export function normalizeBusinessCategory(category?: string | null): string {
  if (!category) return "";
  return LEGACY_CATEGORY_MAP[category] ?? category;
}
