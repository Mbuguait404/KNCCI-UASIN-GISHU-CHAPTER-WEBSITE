export interface Event {
    id: string;
    title: string;
    description: string;
    startDateTime: string;
    endDateTime: string;
    location: {
        name: string;
        address: string;
        city: string;
    };
    featuredImage: string;
    // Add other fields as needed
}

export interface TicketType {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    quantity: number;
    quantitySold: number;
    salesStartDate: string;
    salesEndDate: string;
    // Add other fields as needed
}

export interface TicketItem {
    ticketTypeId: string;
    quantity: number;
}

export interface ProductItem {
    productId: string;
    variationId?: string;
    quantity: number;
}

export interface CreatePurchaseRequest {
    eventId: string;
    ticketItems: TicketItem[];
    productItems?: ProductItem[];
    paymentMethod: string;
    discountCode?: string;
    notes?: string;
}

export interface Purchase {
    id: string;
    buyerId: string;
    eventId: string;
    organizationId: string;
    ticketItems: TicketItem[];
    productItems?: ProductItem[];
    totalAmount: number;
    appliedDiscountId?: string;
    discountAmountSaved?: number;
    currency: string;
    paymentStatus: string;
    paymentMethod: string;
    paymentDetails?: Record<string, any>;
    ticketsGenerated: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    updatedBy?: string;
}

export const ticketing = {
    getEvents: async (): Promise<Event[]> => {
        // We fetch from our proxy
        console.log("[ticketing.getEvents] Fetching events from /api/ticketing/events");
        const response = await fetch("/api/ticketing/events");
        if (!response.ok) {
            throw new Error("Failed to fetch events");
        }
        const json = await response.json();
        console.log("[ticketing.getEvents] Response status:", response.status, "Keys:", Object.keys(json || {}));
        return json.data || [];
    },

    getTicketTypes: async (eventId: string): Promise<TicketType[]> => {
        console.log("[ticketing.getTicketTypes] Fetching ticket types", { eventId, url: `/api/ticketing/ticket-types?eventId=${eventId}` });
        const response = await fetch(`/api/ticketing/ticket-types?eventId=${eventId}`);
        console.log("[ticketing.getTicketTypes] Response status:", response.status);
        if (!response.ok) {
            throw new Error("Failed to fetch ticket types");
        }
        const json = await response.json();
        console.log("[ticketing.getTicketTypes] Response keys:", Object.keys(json || {}));
        return json.data || [];
    },

    createPurchase: async (purchaseData: CreatePurchaseRequest): Promise<Purchase> => {
        console.log("[ticketing.createPurchase] Sending purchase request to /api/ticketing/purchases", {
            purchaseData,
            // Note: API key is added on the server in TicketingService via x-api-key header.
            info: "Browser cannot see the external API key; it is attached by the Node backend.",
        });
        const response = await fetch("/api/ticketing/purchases", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(purchaseData),
        });

        console.log("[ticketing.createPurchase] Response status:", response.status);

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            console.error("[ticketing.createPurchase] Error response body:", errorBody);
            const error = await response.json().catch(() => ({ error: "Failed to create purchase" }));
            throw new Error(error.error || error.message || "Failed to create purchase");
        }

        const json = await response.json();
        console.log("[ticketing.createPurchase] Success response keys:", Object.keys(json || {}));
        console.log("[ticketing.createPurchase] Note: External API key is set in server/services/ticketing.ts (x-api-key header).");
        return json.data || json;
    }
};
