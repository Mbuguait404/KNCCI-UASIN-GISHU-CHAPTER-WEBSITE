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

export const ticketing = {
    getEvents: async (): Promise<Event[]> => {
        // We fetch from our proxy
        const response = await fetch("/api/ticketing/events");
        if (!response.ok) {
            throw new Error("Failed to fetch events");
        }
        const json = await response.json();
        return json.data || [];
    },

    getTicketTypes: async (eventId: string): Promise<TicketType[]> => {
        const response = await fetch(`/api/ticketing/ticket-types?eventId=${eventId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch ticket types");
        }
        const json = await response.json();
        return json.data || [];
    }
};
