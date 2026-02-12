/**
 * Mock data for ticketing API endpoints
 * Used for demonstration purposes until the actual API is wired up
 */

export const mockEvent = {
  id: "6982fa650137a4e5f55a0b86",
  title: "The Eldoret International Business Summit 2026",
  description: "Eldoret is a thriving business hub in the North Rift and a key gateway to East and Central Africa. Following the success of the previous summit (which attracted over 10,000 attendees and 200+ exhibitors), the 2026 edition aims to unite key stakeholders to explore innovative strategies for sustainable business growth.",
  startDateTime: "2026-04-23T08:00:00Z",
  endDateTime: "2026-04-25T18:00:00Z",
  location: {
    name: "RUPA Mall Grounds",
    address: "Malaba Road",
    city: "Eldoret",
  },
  featuredImage: "https://solby.sfo3.digitaloceanspaces.com/1770897937932-WhatsApp%20Image%202026-02-12%20at%2015.03.53.jpeg",
};

export const mockTicketTypes = [
  {
    id: "tt_general_admission_001",
    name: "General Admission",
    description: "Access to all summit sessions, workshops, and exhibitions (April 23-25, 2026). Free registration for all attendees.",
    price: 0,
    currency: "KES",
    quantity: 2000,
    quantitySold: 0,
    salesStartDate: "2026-02-01T00:00:00Z",
    salesEndDate: "2026-04-22T23:59:59Z",
    isActive: true,
  },
  {
    id: "tt_gala_night_001",
    name: "Gala Night Access",
    description: "Exclusive gala dinner and awards ceremony (April 24, 7:00 PM - 11:00 PM). Includes three-course dinner, awards ceremony, live entertainment, and premium networking opportunities.",
    price: 1500,
    currency: "KES",
    quantity: 500,
    quantitySold: 0,
    salesStartDate: "2026-02-01T00:00:00Z",
    salesEndDate: "2026-04-23T23:59:59Z",
    isActive: true,
  },
];

/**
 * Get mock events response (matching API format)
 */
export function getMockEventsResponse() {
  return {
    data: [mockEvent],
    total: 1,
    page: 1,
    limit: 10,
  };
}

/**
 * Get mock ticket types response (matching API format)
 */
export function getMockTicketTypesResponse(eventId: string) {
  // Only return ticket types if eventId matches
  if (eventId === mockEvent.id || eventId === "6982fa650137a4e5f55a0b86") {
    return {
      data: mockTicketTypes,
      total: mockTicketTypes.length,
    };
  }
  
  // Return empty array for other event IDs
  return {
    data: [],
    total: 0,
  };
}

/**
 * Create mock purchase response
 */
export function createMockPurchase(purchaseData: {
  eventId: string;
  ticketItems: Array<{ ticketTypeId: string; quantity: number }>;
  paymentMethod: string;
  notes?: string;
}) {
  const purchaseId = `purchase_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date().toISOString();
  
  // Calculate total amount
  const totalAmount = purchaseData.ticketItems.reduce((sum, item) => {
    const ticketType = mockTicketTypes.find(tt => tt.id === item.ticketTypeId);
    return sum + (ticketType ? ticketType.price * item.quantity : 0);
  }, 0);
  
  return {
    id: purchaseId,
    buyerId: "guest_user",
    eventId: purchaseData.eventId,
    organizationId: "org_kncci_uasin_gishu",
    ticketItems: purchaseData.ticketItems,
    productItems: [],
    totalAmount,
    currency: "KES",
    paymentStatus: totalAmount === 0 ? "completed" : "pending_payment",
    paymentMethod: purchaseData.paymentMethod,
    ticketsGenerated: totalAmount === 0,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
    notes: purchaseData.notes,
  };
}

