// Hardcoded registration data - no backend fetching
// Two ticket types: Delegate Registration (free) and Gala Night (paid)

export const REGISTRATION_EVENT = {
  id: "6982fa650137a4e5f55a0b86",
  name: "Eldoret International Business Summit 2026",
} as const;

export interface HardcodedTicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

export const HARDCODED_TICKET_TYPES: HardcodedTicketType[] = [
  {
    id: "tt_general_free",
    name: "Delegate Registration",
    description: "Free entry to the summit",
    price: 0,
    currency: "KES",
  },
  {
    id: "tt_vip_premium",
    name: "Gala Night",
    description: "Gala dinner ticket – exclusive evening access",
    price: 1500,
    currency: "KES",
  },
];
