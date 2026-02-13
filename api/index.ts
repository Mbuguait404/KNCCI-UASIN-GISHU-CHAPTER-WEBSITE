// Vercel serverless function entry point
import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// --- Inlined storage (no external imports - avoids Vercel module resolution issues) ---
const registrations = new Map<string, any>();
const newsletterSubscriptions = new Map<string, any>();

const storage = {
  async createRegistration(data: any) {
    const id = randomUUID();
    const registration = {
      id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      organization: data.organization || "",
      ticketType: data.ticketType,
      registeredAt: new Date().toISOString(),
    };
    registrations.set(id, registration);
    return registration;
  },
  async getRegistrations() {
    return Array.from(registrations.values());
  },
  async subscribeNewsletter(data: any) {
    const existing = Array.from(newsletterSubscriptions.values()).find(
      (sub: any) => sub.email === data.email
    );
    if (existing) return existing;
    const id = randomUUID();
    const subscription = {
      id,
      email: data.email,
      subscribedAt: new Date().toISOString(),
    };
    newsletterSubscriptions.set(id, subscription);
    return subscription;
  },
  async getNewsletterSubscriptions() {
    return Array.from(newsletterSubscriptions.values());
  },
  getEvent() {
    return {
      id: "6982fa650137a4e5f55a0b86",
      name: "The Eldoret International Business Summit 2026",
      subtitle: "Eldoret City: Gateway to Africa's Trade and Economic Future",
      description: "Eldoret is a thriving business hub in the North Rift and a key gateway to East and Central Africa. Following the success of the previous summit (which attracted over 10,000 attendees and 200+ exhibitors), the 2026 edition aims to unite key stakeholders to explore innovative strategies for sustainable business growth. The Eldoret International Business Summit 2026 is the flagship event organized by the Kenya National Chamber of Commerce and Industry (KNCCI) Uasin Gishu Chapter. This three-day summit brings together the nation's brightest minds in business, government, and civil society to drive economic growth and foster international partnerships. Join us in Eldoret as we explore Africa's trade and economic future.",
      date: "2026-04-23",
      endDate: "2026-04-25",
      location: "Eldoret, Uasin Gishu County",
      venue: "RUPA Mall Grounds",
      highlights: [
        "Networking with 1000+ business leaders",
        "200+ industry speakers",
        "60+ sessions and workshops",
        "Exhibition and trade fair",
        "Policy discussions and roundtables",
      ],
      tagline: "Days of Excellence",
      stats: {
        visitors: "10,000+",
        exhibitors: "200+",
        delegates: "700+",
        participatingNations: "10+",
        speakers: "50+",
        sessions: "30+",
      },
    };
  },
  getSpeakers() {
    return [
      { id: "1", name: "Dr. Amina Wanjiku", title: "CEO & Founder", organization: "TechVentures Kenya", bio: "Dr. Amina Wanjiku is a pioneering entrepreneur and technology leader with over 20 years of experience in building successful ventures across East Africa.", imageUrl: "" },
      { id: "2", name: "James Omondi", title: "Managing Director", organization: "East Africa Bank", bio: "James Omondi brings three decades of experience in banking and financial services. Under his leadership, East Africa Bank has expanded to 5 countries.", imageUrl: "" },
      { id: "3", name: "Hon. Grace Muthoni", title: "Cabinet Secretary", organization: "Ministry of Trade", bio: "Hon. Grace Muthoni has been at the forefront of trade policy reform in Kenya, opening new markets for Kenyan products globally.", imageUrl: "" },
      { id: "4", name: "Prof. David Kamau", title: "Dean, Business School", organization: "University of Nairobi", bio: "Prof. David Kamau is an acclaimed economist whose research on African markets has influenced policy decisions across the continent.", imageUrl: "" },
      { id: "5", name: "Sarah Njeri", title: "Regional Director", organization: "Global Trade Partners", bio: "Sarah Njeri leads trade facilitation efforts across the African continent with expertise in international trade law and policy.", imageUrl: "" },
      { id: "6", name: "Michael Otieno", title: "President", organization: "KNCCI", bio: "Michael Otieno has dedicated his career to championing the interests of Kenyan businesses as President of KNCCI.", imageUrl: "" },
    ];
  },
  getSchedule() {
    return [
      { id: "1", day: 1, dayLabel: "Day 1 - April 23", time: "08:00 - 09:00", title: "Registration & Networking Breakfast", speaker: "", type: "networking" },
      { id: "2", day: 1, dayLabel: "Day 1 - April 23", time: "09:00 - 09:30", title: "Opening Ceremony & Welcome Address", speaker: "Michael Otieno", type: "keynote" },
      { id: "3", day: 1, dayLabel: "Day 1 - April 23", time: "09:30 - 10:30", title: "Keynote: The Future of African Trade", speaker: "Hon. Grace Muthoni", type: "keynote" },
      { id: "4", day: 1, dayLabel: "Day 1 - April 23", time: "10:30 - 11:00", title: "Coffee Break & Exhibition Tour", speaker: "", type: "break" },
      { id: "5", day: 1, dayLabel: "Day 1 - April 23", time: "11:00 - 12:30", title: "Panel: Digital Transformation in Business", speaker: "Dr. Amina Wanjiku, James Omondi", type: "panel" },
      { id: "6", day: 1, dayLabel: "Day 1 - April 23", time: "12:30 - 14:00", title: "Networking Lunch", speaker: "", type: "networking" },
      { id: "7", day: 1, dayLabel: "Day 1 - April 23", time: "14:00 - 15:30", title: "Workshop: Export Readiness", speaker: "Sarah Njeri", type: "workshop" },
      { id: "8", day: 1, dayLabel: "Day 1 - April 23", time: "15:30 - 17:00", title: "Panel: Access to Finance for SMEs", speaker: "James Omondi, Prof. David Kamau", type: "panel" },
      { id: "9", day: 2, dayLabel: "Day 2 - April 24", time: "08:30 - 09:00", title: "Morning Networking Coffee", speaker: "", type: "networking" },
      { id: "10", day: 2, dayLabel: "Day 2 - April 24", time: "09:00 - 10:00", title: "Keynote: Building Sustainable Enterprises", speaker: "Prof. David Kamau", type: "keynote" },
      { id: "11", day: 2, dayLabel: "Day 2 - April 24", time: "10:00 - 11:30", title: "Panel: Women in Business Leadership", speaker: "Dr. Amina Wanjiku, Sarah Njeri", type: "panel" },
      { id: "12", day: 2, dayLabel: "Day 2 - April 24", time: "11:30 - 12:00", title: "Coffee Break", speaker: "", type: "break" },
      { id: "13", day: 2, dayLabel: "Day 2 - April 24", time: "12:00 - 13:00", title: "Workshop: Investment Pitch Masterclass", speaker: "James Omondi", type: "workshop" },
      { id: "14", day: 2, dayLabel: "Day 2 - April 24", time: "13:00 - 14:30", title: "Networking Lunch & Exhibition", speaker: "", type: "networking" },
      { id: "15", day: 2, dayLabel: "Day 2 - April 24", time: "14:30 - 16:00", title: "Panel: Infrastructure Development", speaker: "Hon. Grace Muthoni, Michael Otieno", type: "panel" },
      { id: "16", day: 2, dayLabel: "Day 2 - April 24", time: "16:00 - 17:30", title: "Workshop: E-commerce Strategies", speaker: "Dr. Amina Wanjiku", type: "workshop" },
      { id: "17", day: 3, dayLabel: "Day 3 - April 25", time: "08:30 - 09:00", title: "Morning Coffee", speaker: "", type: "networking" },
      { id: "18", day: 3, dayLabel: "Day 3 - April 25", time: "09:00 - 10:00", title: "Keynote: Regional Trade Integration", speaker: "Sarah Njeri", type: "keynote" },
      { id: "19", day: 3, dayLabel: "Day 3 - April 25", time: "10:00 - 11:30", title: "Panel: Youth Entrepreneurship", speaker: "Dr. Amina Wanjiku, Prof. David Kamau", type: "panel" },
      { id: "20", day: 3, dayLabel: "Day 3 - April 25", time: "11:30 - 12:00", title: "Coffee Break", speaker: "", type: "break" },
      { id: "21", day: 3, dayLabel: "Day 3 - April 25", time: "12:00 - 13:30", title: "Workshop: Business Continuity Planning", speaker: "James Omondi", type: "workshop" },
      { id: "22", day: 3, dayLabel: "Day 3 - April 25", time: "13:30 - 15:00", title: "Closing Lunch & Awards Ceremony", speaker: "Michael Otieno", type: "keynote" },
    ];
  },
  getPartners() {
    return [
      { id: "1", name: "Safaricom", logoUrl: "", tier: "platinum" },
      { id: "2", name: "Kenya Airways", logoUrl: "", tier: "platinum" },
      { id: "3", name: "Equity Bank", logoUrl: "", tier: "gold" },
      { id: "4", name: "KCB Group", logoUrl: "", tier: "gold" },
      { id: "5", name: "Nation Media", logoUrl: "", tier: "gold" },
      { id: "6", name: "East African Breweries", logoUrl: "", tier: "silver" },
      { id: "7", name: "Kenya Power", logoUrl: "", tier: "silver" },
      { id: "8", name: "Bamburi Cement", logoUrl: "", tier: "silver" },
      { id: "9", name: "Twiga Foods", logoUrl: "", tier: "bronze" },
      { id: "10", name: "M-KOPA", logoUrl: "", tier: "bronze" },
      { id: "11", name: "Jumia Kenya", logoUrl: "", tier: "bronze" },
      { id: "12", name: "Sendy", logoUrl: "", tier: "bronze" },
    ];
  },
  getGalleryImages() {
    return [
      { id: "1", url: "", eventName: "Kenya Business Summit", year: "2024", alt: "Business leaders networking at the summit" },
      { id: "2", url: "", eventName: "Trade Expo Kenya", year: "2024", alt: "Exhibition hall with business booths" },
      { id: "3", url: "", eventName: "SME Conference", year: "2023", alt: "Panel discussion with industry experts" },
      { id: "4", url: "", eventName: "Kenya Business Summit", year: "2023", alt: "Keynote speaker addressing the audience" },
      { id: "5", url: "", eventName: "Trade Expo Kenya", year: "2023", alt: "Business professionals at networking event" },
      { id: "6", url: "", eventName: "Investment Forum", year: "2023", alt: "Workshop session in progress" },
      { id: "7", url: "", eventName: "Kenya Business Summit", year: "2022", alt: "Award ceremony at the gala dinner" },
      { id: "8", url: "", eventName: "Trade Expo Kenya", year: "2022", alt: "Product showcase at the exhibition" },
    ];
  },
  getTestimonials() {
    return [
      { id: "1", quote: "The Eldoret International Business Summit was transformative for our company. We secured three major partnerships and gained invaluable insights into market trends.", name: "Elizabeth Wangari", title: "Managing Director", organization: "TechStart Africa" },
      { id: "2", quote: "As a first-time attendee, I was impressed by the caliber of speakers and the quality of sessions. The practical workshops gave me tools I immediately applied.", name: "Joseph Mwangi", title: "Founder & CEO", organization: "Mwangi Enterprises" },
      { id: "3", quote: "KNCCI events consistently deliver value. The policy discussions helped us understand regulatory changes, and we connected with government stakeholders.", name: "Ruth Achieng", title: "Regional Director", organization: "East Africa Trade Council" },
      { id: "4", quote: "The summit exceeded expectations. From the venue to the speakers to the organization - everything was world-class.", name: "Samuel Kiprop", title: "Investment Manager", organization: "Nairobi Capital Partners" },
    ];
  },
  getVenue() {
    return {
      name: "RUPA Mall Grounds",
      address: "Malaba Road",
      city: "Eldoret",
      description: "Join us at RUPA Mall Grounds, a premier shopping and event destination. This modern mall facility offers excellent amenities, spacious event halls, and is perfectly located on Malaba Road in the heart of Eldoret, making it the ideal setting for this landmark international business summit.",
      mapUrl: "https://maps.google.com/?q=Rupa%27s+Mall+Eldoret",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5!2d35.2923!3d0.5134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMCDQsDMwJzQ4LjIiTiAzNcKwMTcnMzIuMyJF!5e0!3m2!1sen!2ske!4v1640000000000!5m2!1sen!2ske",
      imageUrl: "",
      accessibility: ["Wheelchair accessible entrances and lifts", "Accessible restroom facilities", "Sign language interpreters available on request", "Reserved seating for persons with disabilities"],
      parking: "Ample parking available at Rupa's Mall. Additional parking facilities nearby. Valet parking service available for VIP attendees.",
      nearbyHotels: ["Eka Hotel Eldoret", "Boma Inn Eldoret", "The Noble Hotel", "The Sirikwa Hotel"],
    };
  },
};

// Simple validation functions (inline to avoid external dependencies)
function validateRegistration(data: any): { success: boolean; error?: string; data?: any } {
  if (!data || typeof data !== 'object') {
    return { success: false, error: "Invalid registration data" };
  }
  if (!data.firstName || typeof data.firstName !== 'string' || data.firstName.length < 2) {
    return { success: false, error: "First name is required (minimum 2 characters)" };
  }
  if (!data.lastName || typeof data.lastName !== 'string' || data.lastName.length < 2) {
    return { success: false, error: "Last name is required (minimum 2 characters)" };
  }
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    return { success: false, error: "Valid email is required" };
  }
  if (!data.phone || typeof data.phone !== 'string' || data.phone.length < 5) {
    return { success: false, error: "Phone number is required" };
  }
  if (!data.ticketType || typeof data.ticketType !== 'string') {
    return { success: false, error: "Ticket type is required" };
  }
  return { success: true, data };
}

function validateNewsletter(data: any): { success: boolean; error?: string; data?: any } {
  if (!data || typeof data !== 'object') {
    return { success: false, error: "Invalid data" };
  }
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    return { success: false, error: "Valid email is required" };
  }
  return { success: true, data };
}

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
    const validation = validateRegistration(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }
    const registration = await storage.createRegistration(validation.data);
    res.status(201).json(registration);
  } catch (error) {
    console.error("Error in /api/registrations:", error);
    res.status(500).json({ error: "Failed to create registration" });
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
    const validation = validateNewsletter(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }
    const subscription = await storage.subscribeNewsletter(validation.data);
    res.status(201).json(subscription);
  } catch (error) {
    console.error("Error in /api/newsletter:", error);
    res.status(500).json({ error: "Failed to subscribe to newsletter" });
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
