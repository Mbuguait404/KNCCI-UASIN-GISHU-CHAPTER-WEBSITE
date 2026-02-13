// Vercel serverless function entry point
import express, { type Request, Response, NextFunction } from "express";
import { storage } from "../server/storage";
import {
  insertRegistrationSchema,
  insertNewsletterSchema,
} from "../shared/schema";
import path from "path";
import fs from "fs";

// Inline ticketing proxy config (avoids import issues on Vercel)
const TICKETING_API_URL =
  process.env.TICKETING_API_URL ||
  "https://ticketing-system-server-v-production.up.railway.app";
const TICKETING_API_KEY =
  process.env.TICKETING_API_KEY || "pk_HdZLAcfFFatoCyRT1HTATxzmXwKVM3vz";

async function ticketingFetch(endpoint: string, options?: RequestInit) {
  const url = `${TICKETING_API_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (TICKETING_API_KEY) {
    headers["x-api-key"] = TICKETING_API_KEY;
  }
  
  console.log(`[Ticketing] Request: ${options?.method || "GET"} ${url}`);
  console.log(`[Ticketing] Headers: x-api-key=${headers["x-api-key"] ? "PRESENT" : "MISSING"}, Content-Type=${headers["Content-Type"]}`);
  
  const { headers: _, ...restOptions } = options || {};
  
  try {
    const response = await fetch(url, { headers, ...restOptions });
    console.log(`[Ticketing] Response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Ticketing] Error response body: ${errorText.substring(0, 500)}`);
      
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      const contentType = response.headers.get("content-type") || "";
      
      if (contentType.includes("application/json")) {
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {}
      } else if (errorText) {
        errorMessage = `API returned ${contentType}. Status: ${response.status}. Body: ${errorText.substring(0, 200)}`;
      }
      
      throw new Error(errorMessage);
    }
    
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.warn(`[Ticketing] Warning: API returned non-JSON response (${contentType})`);
      console.warn(`[Ticketing] Response body (first 200 chars): ${text.substring(0, 200)}`);
      throw new Error(`API returned ${contentType} instead of JSON`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`[Ticketing] Fetch error:`, error);
    throw error;
  }
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes directly (synchronously) to avoid async initialization issues
app.get("/api/event", (req, res) => {
  try {
    const event = storage.getEvent();
    res.json(event);
  } catch (error) {
    console.error("Error in /api/event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/speakers", (req, res) => {
  try {
    const speakers = storage.getSpeakers();
    res.json(speakers);
  } catch (error) {
    console.error("Error in /api/speakers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/schedule", (req, res) => {
  try {
    const schedule = storage.getSchedule();
    res.json(schedule);
  } catch (error) {
    console.error("Error in /api/schedule:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/partners", (req, res) => {
  try {
    const partners = storage.getPartners();
    res.json(partners);
  } catch (error) {
    console.error("Error in /api/partners:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/gallery", (req, res) => {
  try {
    const gallery = storage.getGalleryImages();
    res.json(gallery);
  } catch (error) {
    console.error("Error in /api/gallery:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/testimonials", (req, res) => {
  try {
    const testimonials = storage.getTestimonials();
    res.json(testimonials);
  } catch (error) {
    console.error("Error in /api/testimonials:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/venue", (req, res) => {
  try {
    const venue = storage.getVenue();
    res.json(venue);
  } catch (error) {
    console.error("Error in /api/venue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
  try {
    const registrations = await storage.getRegistrations();
    res.json(registrations);
  } catch (error) {
    console.error("Error in /api/registrations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
  try {
    const subscriptions = await storage.getNewsletterSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    console.error("Error in /api/newsletter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Ticketing API Proxy Endpoints
app.get("/api/ticketing/events", async (req, res) => {
  try {
    // Build query string if id parameter is provided
    const eventId = req.query.id as string;
    let endpoint = "/events";
    if (eventId) {
      endpoint = `/events?id=${encodeURIComponent(eventId)}`;
    }
    console.log(`[Ticketing] Fetching events from: ${TICKETING_API_URL}${endpoint}`);
    console.log(`[Ticketing] API Key configured: ${TICKETING_API_KEY ? `${TICKETING_API_KEY.substring(0, 15)}...` : "MISSING"}`);
    
    const data = await ticketingFetch(endpoint);
    res.json(data);
  } catch (error) {
    console.error("[Ticketing] Error fetching events:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch event data";
    res.status(500).json({ error: errorMessage });
  }
});

app.get("/api/ticketing/ticket-types", async (req, res) => {
  try {
    const eventId = req.query.eventId as string;
    if (!eventId) {
      console.error("[Ticketing] Error: eventId is required");
      return res.status(400).json({ error: "eventId is required" });
    }
    console.log(`[Ticketing] Fetching ticket types for event: ${eventId}`);
    console.log(`[Ticketing] API Key configured: ${TICKETING_API_KEY ? `${TICKETING_API_KEY.substring(0, 15)}...` : "MISSING"}`);
    
    const data = await ticketingFetch(
      `/ticket-types/public?eventId=${encodeURIComponent(eventId)}`,
    );
    res.json(data);
  } catch (error) {
    console.error("[Ticketing] Error fetching ticket types:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch ticket types";
    res.status(500).json({ error: errorMessage });
  }
});

app.post("/api/ticketing/purchases", async (req, res) => {
  try {
    const purchaseData = req.body;
    console.log(`[Ticketing] Creating purchase for event: ${purchaseData.eventId}`);
    
    if (!purchaseData.eventId) {
      console.error("[Ticketing] Error: eventId is required");
      return res.status(400).json({ error: "eventId is required" });
    }
    if (
      !purchaseData.ticketItems ||
      !Array.isArray(purchaseData.ticketItems) ||
      purchaseData.ticketItems.length === 0
    ) {
      console.error("[Ticketing] Error: ticketItems array is required");
      return res
        .status(400)
        .json({ error: "ticketItems array is required and must not be empty" });
    }
    if (!purchaseData.paymentMethod) {
      console.error("[Ticketing] Error: paymentMethod is required");
      return res.status(400).json({ error: "paymentMethod is required" });
    }
    
    const data = await ticketingFetch("/purchases", {
      method: "POST",
      body: JSON.stringify(purchaseData),
    });
    console.log(`[Ticketing] Purchase created successfully`);
    res.json(data);
  } catch (error) {
    console.error("[Ticketing] Error creating purchase:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create purchase";
    res.status(500).json({ error: errorMessage });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

// Serve static files from dist/public (only for non-API routes)
const distPath = path.resolve(process.cwd(), "dist", "public");
if (fs.existsSync(distPath)) {
  // Serve static files, but skip API routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    express.static(distPath)(req, res, next);
  });

  // Fallback to index.html for client-side routing (SPA) - only for non-API routes
  app.get("*", (req: Request, res: Response) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
} else {
  // If dist/public doesn't exist, handle non-API routes
  app.get("*", (req: Request, res: Response) => {
    if (!req.path.startsWith("/api")) {
      res.status(500).json({
        error: "Build files not found. Please run 'npm run build' first.",
      });
    }
  });
}

// Export the Express app as a Vercel serverless function
export default app;
