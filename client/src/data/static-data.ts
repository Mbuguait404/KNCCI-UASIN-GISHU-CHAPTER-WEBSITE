// Static data - defined directly for client-side use
// This eliminates the need for API calls for read-only data
import type { Event, Speaker, Session, Partner, GalleryImage, Testimonial, Venue } from "@shared/schema";

// Event data
export const staticEvent: Event = {
  id: "6982fa650137a4e5f55a0b86",
  name: "The Eldoret International Business Summit 2026",
  subtitle: "Eldoret City: Gateway to Africa's Trade, Innovation and Economic Future",
  description: "Eldoret is a thriving business hub in the North Rift and a key gateway to East and Central Africa. Following the success of the previous summit (which attracted over 10,000 attendees and 200+ exhibitors), the 2026 edition aims to unite key stakeholders to explore innovative strategies for sustainable business growth. The Eldoret International Business Summit 2026 is the flagship event organized by the Kenya National Chamber of Commerce and Industry (KNCCI) Uasin Gishu Chapter. This three-day summit brings together the nation's brightest minds in business, government, and civil society to drive economic growth and foster international partnerships. Join us in Eldoret as we explore Africa's trade and economic future.",
  date: "2026-04-23",
  endDate: "2026-04-25",
  location: "Eldoret City",
  venue: "Rupaz mall Grounds",
  highlights: [
    "Networking with 1000+ business leaders",
    "200+ industry speakers",
    "60+ sessions and workshops",
    "Business exhibitions and trade fairs",
    "Policy discussions and roundtables",
  ],
  tagline: "Days of Strategic Dialogue",
  stats: {
    visitors: "10,000+",
    exhibitors: "500",
    delegates: "1000+",
    participatingNations: "50",
    speakers: "50+",
    sessions: "10",
  },
};

// Speakers data
export const staticSpeakers: Speaker[] = [
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

// Schedule data
export const staticSchedule: Session[] = [
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

// Partners data
export const staticPartners: Partner[] = [
  { id: "1", name: "AAR Healthcare", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764688722-aar.jpg", tier: "platinum" },
  { id: "2", name: "Co-operative Bank", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764594984-co-operative-bank-of-kenya-logo-png_seeklogo-172668.png", tier: "gold" },
  { id: "3", name: "Reale", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764495131-reale.jpg", tier: "gold" },
  { id: "4", name: "EPZA", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764495368-epza.jpg", tier: "gold" },
  { id: "5", name: "Grand Empire Hotel", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764768112-grandEmpire.jpg", tier: "silver" },
  { id: "6", name: "Grappa", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764768095-grappa.jpg", tier: "silver" },
  { id: "7", name: "KenTrade", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764767882-kenTrade.jpg", tier: "silver" },
  { id: "8", name: "BHIC", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764768163-bhic.jpg", tier: "silver" },
  { id: "9", name: "Eldobase", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764768433-eldobase.jpg", tier: "silver" },
  { id: "10", name: "County Government", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764768362-county.jpg", tier: "silver" },
  { id: "11", name: "Eldowas", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764768116-eldowas.jpg", tier: "silver" },
  { id: "12", name: "Epique", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764768128-epique.jpg", tier: "silver" },
  { id: "13", name: "Madison", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764981584-madison.jpg", tier: "bronze" },
  { id: "14", name: "Mashambani", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764981917-mashambani.jpg", tier: "bronze" },
  { id: "15", name: "Moi University", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764982022-moi.jpg", tier: "bronze" },
  { id: "16", name: "Municipal", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764982235-municipal.jpg", tier: "bronze" },
  { id: "17", name: "NOREB", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764982241-noreb.jpg", tier: "bronze" },
  { id: "18", name: "Palm", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764982036-palm.jpg", tier: "bronze" },
  { id: "19", name: "KIDC", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764981847-kidc.jpg", tier: "bronze" },
  { id: "20", name: "KNCCI National", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764982162-kncci.jpg", tier: "bronze" },
  { id: "21", name: "KRA", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764982184-kra.jpg", tier: "bronze" },
  { id: "22", name: "Logistics", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769764982192-logistics.jpg", tier: "bronze" },
  { id: "23", name: "Shiv", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769765156305-shiv.jpg", tier: "bronze" },
  { id: "24", name: "The Cube", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769765156409-theCube.jpg", tier: "bronze" },
  { id: "25", name: "Tophil", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769765156187-tophil.jpg", tier: "bronze" },
  { id: "26", name: "Transnep", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769765156286-transnep.jpg", tier: "bronze" },
  { id: "27", name: "Tsavo", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769765155973-tsavo.jpg", tier: "bronze" },
  { id: "28", name: "Zoho", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769765156199-zoho.jpg", tier: "bronze" },
  { id: "29", name: "Poly", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769765156271-poly.jpg", tier: "bronze" },
  { id: "30", name: "Rupa's Mall", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769765156174-rupas.jpg", tier: "bronze" },
  { id: "31", name: "RVTTI", logoUrl: "https://solby.sfo3.digitaloceanspaces.com/1769765157012-rvtti.jpg", tier: "bronze" },
];

// Gallery data
export const staticGallery: GalleryImage[] = [
  {
    id: "1",
    url: "https://solby.sfo3.digitaloceanspaces.com/1769497085012-WhatsApp%20Image%202026-01-27%20at%2009.11.08.jpeg",
    eventName: "Kenya Business Summit",
    year: "2024",
    alt: "Business leaders networking at the summit"
  },
  {
    id: "2",
    url: "https://solby.sfo3.digitaloceanspaces.com/1769497085040-WhatsApp%20Image%202026-01-27%20at%2009.10.56.jpeg",
    eventName: "Trade Expo Kenya",
    year: "2024",
    alt: "Exhibition hall with business booths"
  },
  {
    id: "3",
    url: "https://solby.sfo3.digitaloceanspaces.com/1769497085219-WhatsApp%20Image%202026-01-27%20at%2009.11.03.jpeg",
    eventName: "SME Conference",
    year: "2023",
    alt: "Panel discussion with industry experts"
  },
  {
    id: "4",
    url: "https://solby.sfo3.digitaloceanspaces.com/1769687104798-WhatsApp%20Image%202026-01-27%20at%2009.11.09%20(2).jpeg",
    eventName: "Nairobi Tech Week",
    year: "2025",
    alt: "Innovators showcasing digital solutions"
  },
  {
    id: "5",
    url: "https://solby.sfo3.digitaloceanspaces.com/1769687104848-WhatsApp%20Image%202026-01-27%20at%2009.11.09%20(4).jpeg",
    eventName: "East Africa Manufacturing Gala",
    year: "2023",
    alt: "Keynote speech on industrial growth"
  },
  {
    id: "6",
    url: "https://solby.sfo3.digitaloceanspaces.com/1769687104735-WhatsApp%20Image%202026-01-27%20at%2009.10.55%20(1).jpeg",
    eventName: "Future of Finance Forum",
    year: "2024",
    alt: "Corporate professionals in a workshop"
  },
  {
    id: "7",
    url: "https://solby.sfo3.digitaloceanspaces.com/1769687104740-WhatsApp%20Image%202026-01-27%20at%2009.10.56%20(1).jpeg",
    eventName: "Global Leadership Retreat",
    year: "2022",
    alt: "Team building session outdoors"
  },
  {
    id: "8",
    url: "https://solby.sfo3.digitaloceanspaces.com/1769687104724-WhatsApp%20Image%202026-01-27%20at%2009.11.02%20(1).jpeg",
    eventName: "Women in Business Awards",
    year: "2023",
    alt: "Attendees mingling at the reception"
  },
];

// Testimonials data
export const staticTestimonials: Testimonial[] = [
  {
    id: "1",
    quote: "The Eldoret International Business Summit was transformative for our company. We secured three major partnerships and gained invaluable insights into market trends.",
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

// Gala Dinner data
export interface GalaDinnerPricingTier {
  label: string;
  price: number;
}

export interface GalaDinner {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  dressCode: string;
  priceNonMember: number;
  priceMember: number;
  pricingTiers: GalaDinnerPricingTier[];
  currency: string;
  highlights: string[];
  included: string[];
}

export const staticGalaDinner: GalaDinner = {
  title: "Gala Networking Dinner",
  subtitle: "An exclusive evening to celebrate and connect",
  description: "Join fellow delegates, speakers, and partners for an elegant gala dinner that caps off the summit experience. The Gala Networking Dinner is a high-level occasion for stakeholders to forge lasting connections, celebrate achievements, and enjoy world-class hospitality.",
  date: "Friday, April 24, 2026",
  time: "19:00 – 23:00 (7:00 PM – 11:00 PM)",
  venue: "RUPA Mall Grounds",
  venueAddress: "Eldoret, Uasin Gishu County",
  dressCode: "Black tie / Business formal",
  priceNonMember: 1500,
  priceMember: 1500,
  pricingTiers: [
    { label: "Early Bird", price: 1500 },
    { label: "Standard", price: 3000 },
  ],
  currency: "KES",
  highlights: [
    "Three-course dinner with premium catering",
    "Awards ceremony recognizing outstanding businesses and partners",
    "Live entertainment and cultural performances",
    "Networking with 1000+ business leaders and dignitaries",
    "Corporate table options for sponsors (Platinum, Gold, Silver)",
  ],
  included: [
    "Welcome cocktail reception",
    "Seated dinner with selected menu",
    "Awards and recognition segment",
    "Entertainment and music",
    "Complimentary parking",
  ],
};

// Venue data
export const staticVenue: Venue = {
  name: "RUPA Mall Grounds",
  address: "Malaba Road",
  city: "Eldoret",
  description: "Join us at RUPA Mall Grounds, a premier shopping and event destination. This modern mall facility offers excellent amenities, spacious event halls, and is perfectly located on Malaba Road in the heart of Eldoret, making it the ideal setting for this landmark international business summit.",
  mapUrl: "https://maps.google.com/?q=Rupa%27s+Mall+Eldoret",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5!2d35.2923!3d0.5134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMCDQsDMwJzQ4LjIiTiAzNcKwMTcnMzIuMyJF!5e0!3m2!1sen!2ske!4v1640000000000!5m2!1sen!2ske",
  imageUrl: "",
  accessibility: [
    "Wheelchair accessible entrances and lifts",
    "Accessible restroom facilities",
    "Sign language interpreters available on request",
    "Reserved seating for persons with disabilities",
  ],
  parking: "Ample parking available at Rupa's Mall. Additional parking facilities nearby. Valet parking service available for VIP attendees.",
  nearbyHotels: [
    "EKA Hotel Eldoret",
    "Grand Empire Hotel Eldoret",
  ],
};
