import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Event data types (in-memory, not database tables)
export interface Event {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  venue: string;
  highlights: string[];
  tagline: string;
  stats: {
    attendees?: string;
    speakers: string;
    sessions: string;
    visitors?: string;
    exhibitors?: string;
    delegates?: string;
    participatingNations?: string;
  };
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  organization: string;
  bio: string;
  imageUrl: string;
}

export interface Session {
  id: string;
  day: number;
  dayLabel: string;
  time: string;
  title: string;
  speaker: string;
  type: "keynote" | "panel" | "workshop" | "networking" | "break";
  description?: string;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
  website?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  eventName: string;
  year: string;
  alt: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  organization: string;
}

export interface Venue {
  name: string;
  address: string;
  city: string;
  description: string;
  mapUrl: string;
  mapEmbedUrl: string;
  imageUrl: string;
  accessibility: string[];
  parking: string;
  nearbyHotels: string[];
}

export interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  jobTitle: string;
  registeredAt: string;
}

export const insertRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  organization: z.string().min(1, "Organization is required"),
  jobTitle: z.string().min(1, "Job title is required"),
});

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;

export interface NewsletterSubscription {
  id: string;
  email: string;
  subscribedAt: string;
}

export const insertNewsletterSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
