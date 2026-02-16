
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema, insertNewsletterSchema, insertSponsorRequestSchema } from "@shared/schema";
import { TicketingService } from "./services/ticketing";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Event data endpoints
  app.get("/api/event", (req, res) => {
    const event = storage.getEvent();
    res.json(event);
  });

  // Ticketing API Proxy Endpoints - proxy to external ticketing API
  app.get("/api/ticketing/events", async (req, res) => {
    try {
      const data = await TicketingService.getEvent(req.query.id as string);
      res.json(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch event data";
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get("/api/ticketing/ticket-types", async (req, res) => {
    try {
      const eventId = req.query.eventId as string;
      if (!eventId) {
        return res.status(400).json({ error: "eventId is required" });
      }
      const data = await TicketingService.getTicketTypes(eventId);
      res.json(data);
    } catch (error) {
      console.error("Error fetching ticket types:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch ticket types";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Purchase endpoint - proxies to external ticketing API
  app.post("/api/ticketing/purchases", async (req, res) => {
    try {
      const purchaseData = req.body;

      // Validate required fields
      if (!purchaseData.eventId) {
        return res.status(400).json({ error: "eventId is required" });
      }
      if (!purchaseData.ticketItems || !Array.isArray(purchaseData.ticketItems) || purchaseData.ticketItems.length === 0) {
        return res.status(400).json({ error: "ticketItems array is required and must not be empty" });
      }
      if (!purchaseData.paymentMethod) {
        return res.status(400).json({ error: "paymentMethod is required" });
      }

      const data = await TicketingService.createPurchase(purchaseData);
      res.json(data);
    } catch (error) {
      console.error("Error creating purchase:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create purchase";
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get("/api/speakers", (req, res) => {
    const speakers = storage.getSpeakers();
    res.json(speakers);
  });

  app.get("/api/schedule", (req, res) => {
    const schedule = storage.getSchedule();
    res.json(schedule);
  });

  app.get("/api/partners", (req, res) => {
    const partners = storage.getPartners();
    res.json(partners);
  });

  app.get("/api/gallery", (req, res) => {
    const gallery = storage.getGalleryImages();
    res.json(gallery);
  });

  app.get("/api/testimonials", (req, res) => {
    const testimonials = storage.getTestimonials();
    res.json(testimonials);
  });

  app.get("/api/venue", (req, res) => {
    const venue = storage.getVenue();
    res.json(venue);
  });

  // Registration endpoint - proxies to KNCCI messaging (same as api/index.ts for Vercel)
  const KNCCI_MESSAGING_URL =
    process.env.KNCCI_MESSAGING_URL ||
    "https://kncci-messaging.onrender.com/notifications/event-registration/sendgrid";

  app.post("/api/registration", async (req, res) => {
    try {
      const payload = req.body;
      if (!payload?.event?.id || !payload?.attendee?.email || !Array.isArray(payload?.tickets) || payload.tickets.length === 0) {
        return res.status(400).json({ error: "Invalid registration payload: event, attendee, and tickets required" });
      }

      const kncciResponse = await fetch(KNCCI_MESSAGING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseText = await kncciResponse.text();
      let responseData: unknown;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch {
        responseData = { message: responseText };
      }

      if (!kncciResponse.ok) {
        console.error("[Registration] KNCCI proxy error:", kncciResponse.status, responseData);
        return res.status(kncciResponse.status).json(
          typeof responseData === "object" && responseData !== null && "error" in (responseData as object)
            ? responseData
            : { error: "Registration service error", details: responseData }
        );
      }

      res.status(kncciResponse.status).json(
        typeof responseData === "object" && responseData !== null ? responseData : { success: true }
      );
    } catch (error) {
      console.error("Error in /api/registration:", error);
      res.status(500).json({ error: "Failed to create registration" });
    }
  });

  // Legacy registration endpoint (plural)
  app.post("/api/registrations", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.createRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid registration data" });
      }
    }
  });

  app.get("/api/registrations", async (req, res) => {
    const registrations = await storage.getRegistrations();
    res.json(registrations);
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeNewsletter(validatedData);
      res.status(201).json(subscription);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid email" });
      }
    }
  });

  app.get("/api/newsletter", async (req, res) => {
    const subscriptions = await storage.getNewsletterSubscriptions();
    res.json(subscriptions);
  });

  // Sponsor / partnership interest endpoint
  app.post("/api/sponsor-requests", async (req, res) => {
    try {
      const validatedData = insertSponsorRequestSchema.parse(req.body);
      const request = await storage.createSponsorRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid sponsor request data" });
      }
    }
  });

  app.get("/api/sponsor-requests", async (req, res) => {
    const requests = await storage.getSponsorRequests();
    res.json(requests);
  });

  return httpServer;
}
