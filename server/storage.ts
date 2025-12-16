import { type User, type InsertUser, type Registration, type InsertRegistration, type NewsletterSubscription, type InsertNewsletter, type Event, type Speaker, type Session, type Partner, type GalleryImage, type Testimonial, type Venue } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createRegistration(data: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
  
  subscribeNewsletter(data: InsertNewsletter): Promise<NewsletterSubscription>;
  getNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
  
  getEvent(): Event;
  getSpeakers(): Speaker[];
  getSchedule(): Session[];
  getPartners(): Partner[];
  getGalleryImages(): GalleryImage[];
  getTestimonials(): Testimonial[];
  getVenue(): Venue;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private registrations: Map<string, Registration>;
  private newsletterSubscriptions: Map<string, NewsletterSubscription>;

  constructor() {
    this.users = new Map();
    this.registrations = new Map();
    this.newsletterSubscriptions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createRegistration(data: InsertRegistration): Promise<Registration> {
    const id = randomUUID();
    const registration: Registration = {
      ...data,
      id,
      registeredAt: new Date().toISOString(),
    };
    this.registrations.set(id, registration);
    return registration;
  }

  async getRegistrations(): Promise<Registration[]> {
    return Array.from(this.registrations.values());
  }

  async subscribeNewsletter(data: InsertNewsletter): Promise<NewsletterSubscription> {
    const existing = Array.from(this.newsletterSubscriptions.values()).find(
      (sub) => sub.email === data.email
    );
    if (existing) {
      return existing;
    }
    
    const id = randomUUID();
    const subscription: NewsletterSubscription = {
      id,
      email: data.email,
      subscribedAt: new Date().toISOString(),
    };
    this.newsletterSubscriptions.set(id, subscription);
    return subscription;
  }

  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return Array.from(this.newsletterSubscriptions.values());
  }

  getEvent(): Event {
    return {
      id: "kenya-business-summit-2025",
      name: "Kenya Business Summit 2025",
      subtitle: "Shaping the Future of Trade and Commerce",
      description: "The Kenya Business Summit 2025 is the flagship event organized by the Kenya National Chamber of Commerce and Industry (KNCCI). This three-day summit brings together the nation's brightest minds in business, government, and civil society to drive economic growth and foster international partnerships.",
      date: "2025-03-15",
      endDate: "2025-03-17",
      location: "Nairobi, Kenya",
      venue: "Kenyatta International Convention Centre",
      highlights: [
        "Networking with 500+ business leaders",
        "50+ industry speakers",
        "30+ sessions and workshops",
        "Exhibition and trade fair",
        "Policy discussions and roundtables",
      ],
      stats: {
        attendees: "500+",
        speakers: "50+",
        sessions: "30+",
      },
    };
  }

  getSpeakers(): Speaker[] {
    return [
      {
        id: "1",
        name: "Dr. Amina Wanjiku",
        title: "CEO & Founder",
        organization: "TechVentures Kenya",
        bio: "Dr. Amina Wanjiku is a pioneering entrepreneur and technology leader with over 20 years of experience in building successful ventures across East Africa.",
        imageUrl: "",
      },
      {
        id: "2",
        name: "James Omondi",
        title: "Managing Director",
        organization: "East Africa Bank",
        bio: "James Omondi brings three decades of experience in banking and financial services. Under his leadership, East Africa Bank has expanded to 5 countries.",
        imageUrl: "",
      },
      {
        id: "3",
        name: "Hon. Grace Muthoni",
        title: "Cabinet Secretary",
        organization: "Ministry of Trade",
        bio: "Hon. Grace Muthoni has been at the forefront of trade policy reform in Kenya, opening new markets for Kenyan products globally.",
        imageUrl: "",
      },
      {
        id: "4",
        name: "Prof. David Kamau",
        title: "Dean, Business School",
        organization: "University of Nairobi",
        bio: "Prof. David Kamau is an acclaimed economist whose research on African markets has influenced policy decisions across the continent.",
        imageUrl: "",
      },
      {
        id: "5",
        name: "Sarah Njeri",
        title: "Regional Director",
        organization: "Global Trade Partners",
        bio: "Sarah Njeri leads trade facilitation efforts across the African continent with expertise in international trade law and policy.",
        imageUrl: "",
      },
      {
        id: "6",
        name: "Michael Otieno",
        title: "President",
        organization: "KNCCI",
        bio: "Michael Otieno has dedicated his career to championing the interests of Kenyan businesses as President of KNCCI.",
        imageUrl: "",
      },
    ];
  }

  getSchedule(): Session[] {
    return [
      { id: "1", day: 1, dayLabel: "Day 1 - March 15", time: "08:00 - 09:00", title: "Registration & Networking Breakfast", speaker: "", type: "networking" },
      { id: "2", day: 1, dayLabel: "Day 1 - March 15", time: "09:00 - 09:30", title: "Opening Ceremony & Welcome Address", speaker: "Michael Otieno", type: "keynote" },
      { id: "3", day: 1, dayLabel: "Day 1 - March 15", time: "09:30 - 10:30", title: "Keynote: The Future of African Trade", speaker: "Hon. Grace Muthoni", type: "keynote" },
      { id: "4", day: 1, dayLabel: "Day 1 - March 15", time: "10:30 - 11:00", title: "Coffee Break & Exhibition Tour", speaker: "", type: "break" },
      { id: "5", day: 1, dayLabel: "Day 1 - March 15", time: "11:00 - 12:30", title: "Panel: Digital Transformation in Business", speaker: "Dr. Amina Wanjiku, James Omondi", type: "panel" },
      { id: "6", day: 1, dayLabel: "Day 1 - March 15", time: "12:30 - 14:00", title: "Networking Lunch", speaker: "", type: "networking" },
      { id: "7", day: 1, dayLabel: "Day 1 - March 15", time: "14:00 - 15:30", title: "Workshop: Export Readiness", speaker: "Sarah Njeri", type: "workshop" },
      { id: "8", day: 1, dayLabel: "Day 1 - March 15", time: "15:30 - 17:00", title: "Panel: Access to Finance for SMEs", speaker: "James Omondi, Prof. David Kamau", type: "panel" },
      { id: "9", day: 2, dayLabel: "Day 2 - March 16", time: "08:30 - 09:00", title: "Morning Networking Coffee", speaker: "", type: "networking" },
      { id: "10", day: 2, dayLabel: "Day 2 - March 16", time: "09:00 - 10:00", title: "Keynote: Building Sustainable Enterprises", speaker: "Prof. David Kamau", type: "keynote" },
      { id: "11", day: 2, dayLabel: "Day 2 - March 16", time: "10:00 - 11:30", title: "Panel: Women in Business Leadership", speaker: "Dr. Amina Wanjiku, Sarah Njeri", type: "panel" },
      { id: "12", day: 2, dayLabel: "Day 2 - March 16", time: "11:30 - 12:00", title: "Coffee Break", speaker: "", type: "break" },
      { id: "13", day: 2, dayLabel: "Day 2 - March 16", time: "12:00 - 13:00", title: "Workshop: Investment Pitch Masterclass", speaker: "James Omondi", type: "workshop" },
      { id: "14", day: 2, dayLabel: "Day 2 - March 16", time: "13:00 - 14:30", title: "Networking Lunch & Exhibition", speaker: "", type: "networking" },
      { id: "15", day: 2, dayLabel: "Day 2 - March 16", time: "14:30 - 16:00", title: "Panel: Infrastructure Development", speaker: "Hon. Grace Muthoni, Michael Otieno", type: "panel" },
      { id: "16", day: 2, dayLabel: "Day 2 - March 16", time: "16:00 - 17:30", title: "Workshop: E-commerce Strategies", speaker: "Dr. Amina Wanjiku", type: "workshop" },
      { id: "17", day: 3, dayLabel: "Day 3 - March 17", time: "08:30 - 09:00", title: "Morning Coffee", speaker: "", type: "networking" },
      { id: "18", day: 3, dayLabel: "Day 3 - March 17", time: "09:00 - 10:00", title: "Keynote: Regional Trade Integration", speaker: "Sarah Njeri", type: "keynote" },
      { id: "19", day: 3, dayLabel: "Day 3 - March 17", time: "10:00 - 11:30", title: "Panel: Youth Entrepreneurship", speaker: "Dr. Amina Wanjiku, Prof. David Kamau", type: "panel" },
      { id: "20", day: 3, dayLabel: "Day 3 - March 17", time: "11:30 - 12:00", title: "Coffee Break", speaker: "", type: "break" },
      { id: "21", day: 3, dayLabel: "Day 3 - March 17", time: "12:00 - 13:30", title: "Workshop: Business Continuity Planning", speaker: "James Omondi", type: "workshop" },
      { id: "22", day: 3, dayLabel: "Day 3 - March 17", time: "13:30 - 15:00", title: "Closing Lunch & Awards Ceremony", speaker: "Michael Otieno", type: "keynote" },
    ];
  }

  getPartners(): Partner[] {
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
  }

  getGalleryImages(): GalleryImage[] {
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
  }

  getTestimonials(): Testimonial[] {
    return [
      {
        id: "1",
        quote: "The Kenya Business Summit was transformative for our company. We secured three major partnerships and gained invaluable insights into market trends.",
        name: "Elizabeth Wangari",
        title: "Managing Director",
        organization: "TechStart Africa",
      },
      {
        id: "2",
        quote: "As a first-time attendee, I was impressed by the caliber of speakers and the quality of sessions. The practical workshops gave me tools I immediately applied.",
        name: "Joseph Mwangi",
        title: "Founder & CEO",
        organization: "Mwangi Enterprises",
      },
      {
        id: "3",
        quote: "KNCCI events consistently deliver value. The policy discussions helped us understand regulatory changes, and we connected with government stakeholders.",
        name: "Ruth Achieng",
        title: "Regional Director",
        organization: "East Africa Trade Council",
      },
      {
        id: "4",
        quote: "The summit exceeded expectations. From the venue to the speakers to the organization - everything was world-class.",
        name: "Samuel Kiprop",
        title: "Investment Manager",
        organization: "Nairobi Capital Partners",
      },
    ];
  }

  getVenue(): Venue {
    return {
      name: "Kenyatta International Convention Centre",
      address: "Harambee Avenue",
      city: "Nairobi",
      description: "Join us at Kenya's iconic Kenyatta International Convention Centre, a symbol of national progress and the perfect venue for this landmark event. The KICC offers world-class facilities and is located in the heart of Nairobi's Central Business District.",
      mapUrl: "https://maps.google.com/?q=KICC+Nairobi",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8191048431687!2d36.81859231475393!3d-1.2863899990667556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d22f42bf35%3A0x8c9e7d9d9a4a7d48!2sKenyatta%20International%20Convention%20Centre!5e0!3m2!1sen!2ske!4v1640000000000!5m2!1sen!2ske",
      imageUrl: "",
      accessibility: [
        "Wheelchair accessible entrances and lifts",
        "Accessible restroom facilities",
        "Sign language interpreters available on request",
        "Reserved seating for persons with disabilities",
      ],
      parking: "Ample parking available at KICC underground parking facility. Additional parking at nearby City Hall Annex and KPLC. Valet parking service available for VIP attendees.",
      nearbyHotels: [
        "Intercontinental Hotel Nairobi",
        "Sarova Stanley Hotel",
        "The Nairobi Serena Hotel",
        "Hilton Nairobi",
      ],
    };
  }
}

export const storage = new MemStorage();
