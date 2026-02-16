// Shared partnership package data - used on home page and partnership page

export type PartnershipPackage = {
  tier: string;
  value: string;
  presentation: string;
  exhibitionSpace: string;
  dinnerCards: string;
  branding: string;
  color: string;
  textColor: string;
  description: string;
};

export const partnershipPackages: PartnershipPackage[] = [
  {
    tier: "Platinum",
    value: "2,000,000",
    presentation: "45-Min",
    exhibitionSpace: "12×3",
    dinnerCards: "5 (Corp Table)",
    branding: "Unlimited",
    color: "from-slate-300 to-slate-100",
    textColor: "text-slate-700 dark:text-slate-800",
    description:
      "Our flagship partnership package offers maximum visibility and engagement. Enjoy a 45-minute presentation slot, the largest exhibition space (12×3m), a corporate dinner table for 10, and unlimited branding opportunities across the venue. Ideal for enterprises seeking premium positioning at the summit.",
  },
  {
    tier: "Gold",
    value: "1,000,000",
    presentation: "25-Min",
    exhibitionSpace: "9×3",
    dinnerCards: "3 (Corp Table)",
    branding: "Limited",
    color: "from-amber-300 to-amber-100",
    textColor: "text-amber-700 dark:text-amber-800",
    description:
      "A strong partnership tier with substantial benefits. Includes a 25-minute presentation, 9×3m exhibition space, corporate dinner table for 8, and limited branding. Perfect for established businesses looking to connect with key decision-makers.",
  },
  {
    tier: "Silver",
    value: "500,000",
    presentation: "10-Min",
    exhibitionSpace: "6×3",
    dinnerCards: "1 (Corp Table)",
    branding: "Limited",
    color: "from-gray-300 to-gray-100",
    textColor: "text-gray-700 dark:text-gray-800",
    description:
      "A balanced package for growing businesses. Features a 10-minute presentation, 6×3m exhibition booth, one corporate dinner seat, and limited branding. Includes KNCCI membership and access to high-level networking.",
  },
  {
    tier: "Bronze",
    value: "250,000",
    presentation: "5-Min",
    exhibitionSpace: "3×3",
    dinnerCards: "5 Cards",
    branding: "Minimum",
    color: "from-orange-300 to-orange-100",
    textColor: "text-orange-700 dark:text-orange-800",
    description:
      "An accessible entry point for SMEs. Includes a 5-minute presentation, 3×3m exhibition space, 5 dinner cards, and minimum branding. KNCCI membership and networking opportunities included.",
  },
  {
    tier: "Brass",
    value: "100,000",
    presentation: "N/A",
    exhibitionSpace: "3×3",
    dinnerCards: "3 Cards",
    branding: "Minimum",
    color: "from-yellow-300 to-yellow-100",
    textColor: "text-yellow-700 dark:text-yellow-800",
    description:
      "Our most affordable partnership option. Includes a 3×3m exhibition booth, 3 dinner cards, and minimum branding. Ideal for small businesses and startups looking to establish presence at the summit.",
  },
];
