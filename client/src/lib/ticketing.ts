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
        const requestId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        console.log(`[${requestId}] [CLIENT] getTicketTypes called`);
        console.log(`[${requestId}] [CLIENT] EventId:`, eventId);
        console.log(`[${requestId}] [CLIENT] EventId type:`, typeof eventId);
        console.log(`[${requestId}] [CLIENT] Full URL:`, `/api/ticketing/ticket-types?eventId=${eventId}`);
        
        try {
            console.log(`[${requestId}] [CLIENT] Making fetch request...`);
            const response = await fetch(`/api/ticketing/ticket-types?eventId=${eventId}`);
            console.log(`[${requestId}] [CLIENT] Response received`);
            console.log(`[${requestId}] [CLIENT] Response status:`, response.status);
            console.log(`[${requestId}] [CLIENT] Response statusText:`, response.statusText);
            console.log(`[${requestId}] [CLIENT] Response ok:`, response.ok);
            console.log(`[${requestId}] [CLIENT] Response headers:`, Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[${requestId}] [CLIENT] Response not OK. Error text:`, errorText);
                throw new Error(`Failed to fetch ticket types: ${response.status} ${response.statusText}`);
            }
            
            console.log(`[${requestId}] [CLIENT] Parsing JSON response...`);
            const json = await response.json();
            console.log(`[${requestId}] [CLIENT] JSON parsed successfully`);
            console.log(`[${requestId}] [CLIENT] Response keys:`, Object.keys(json || {}));
            console.log(`[${requestId}] [CLIENT] Response data:`, json.data);
            console.log(`[${requestId}] [CLIENT] Response data length:`, json.data?.length || 0);
            console.log(`[${requestId}] [CLIENT] Returning ticket types:`, json.data || []);
            return json.data || [];
        } catch (error) {
            console.error(`[${requestId}] [CLIENT] Error in getTicketTypes:`, error);
            console.error(`[${requestId}] [CLIENT] Error type:`, error instanceof Error ? error.constructor.name : typeof error);
            console.error(`[${requestId}] [CLIENT] Error message:`, error instanceof Error ? error.message : String(error));
            throw error;
        }
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
            const errorBody = await response.json().catch(() => ({ error: "Failed to create purchase" }));
            console.error("[ticketing.createPurchase] Error response body:", errorBody);
            throw new Error(errorBody.error || errorBody.message || "Failed to create purchase");
        }

        const json = await response.json();
        console.log("[ticketing.createPurchase] Success response keys:", Object.keys(json || {}));
        console.log("[ticketing.createPurchase] Note: External API key is set in server/services/ticketing.ts (x-api-key header).");
        return json.data || json;
    }
};
