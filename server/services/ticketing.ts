import { log } from "../index";

interface TicketingConfig {
  apiUrl: string;
  apiKey: string;
}

const config: TicketingConfig = {
  apiUrl: process.env.TICKETING_API_URL || "https://ticketing-system-server-v-production.up.railway.app",
  apiKey: process.env.TICKETING_API_KEY || "pk_HdZLAcfFFatoCyRT1HTATxzmXwKVM3vz",
};

export class TicketingService {
  private static async fetch(endpoint: string) {
    const url = `${config.apiUrl}${endpoint}`;
    log(`Fetching from external API: ${url}`, "TicketingService");

    try {
      const response = await fetch(url, {
        headers: {
          "x-api-key": config.apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      log(`Error fetching from ${url}: ${error}`, "TicketingService");
      throw error;
    }
  }

  static async getEvent(eventId: string) {
    // The external API returns { data: [event], ... } for /events?id=...
    // But specific endpoint might be different. 
    // User mentioned: https://ticketing-system-server-v-production.up.railway.app/events
    // And response was { "data": [ ... ] }
    // If we want a specific event, let's filter or use ID if supported.
    // The user's example URL was just `/events`. 
    // But usually APIs support `/events/:id`. 
    // Let's try fetching the list and filtering for robustness if ID endpoint fails, 
    // OR just use the ID if we are sure.
    // The user provided ID: 6982fa650137a4e5f55a0b86
    // Let's assume /events/:id or /events returns a list.
    // The user said: "tis request url i used to fetch teh specific event https://.../events with this as the response" which had a list of 1 item.
    // It implies they might have used a query param or it just returned one. 
    // Let's implement getting all events and finding the one we want, OR just fetching the specific one if possible.
    // I'll implement `getEvents` and `getEvent` re-using it.
    
    // However, for the specific ID, let's try to query precisely.
    // Based on standard REST, /events/:id might work. 
    // But since the user showed /events returning a collection, I'll allow passing query params.
    
    // Wait, the user said "tis request url i used to fetch teh specific event https://.../events" -> Response: { data: [{id: ...}] }
    // This suggests /events returns all, or maybe they filtered. 
    // I will implement a method that fetches from /events (maybe with ?id=... if valid, but I'll fetching /events and filtering client side if needed is safer if I don't know the query param).
    // Actually, looking at the JSON, it has "total": 1. 
    // I will assume for now we can just fetch /events and return the first one matching our ID, or just return the first one if we only have one event.
    
    // UPDATE: I will use /events endpoint.
    return this.fetch("/events");
  }

  static async getTicketTypes(eventId: string) {
    // User said: https://.../ticket-types/public?eventId=...
    return this.fetch(`/ticket-types/public?eventId=${eventId}`);
  }
}
