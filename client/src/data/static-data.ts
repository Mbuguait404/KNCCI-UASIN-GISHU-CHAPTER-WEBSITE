// Static data - defined directly for client-side use
// This eliminates the need for API calls for read-only data
import type { Event, Speaker, Session, Partner, GalleryImage, Testimonial, Venue } from "@shared/schema";

// Event data
export const staticEvent: Event = {
  id: "eldoret-international-business-summit-2026",
  name: "The Eldoret International Business Summit 2026",
  subtitle: "Eldoret City: Gateway to Africa's Trade and Economic Future",
  description: "Eldoret is a thriving business hub in the North Rift and a key gateway to East and Central Africa. Following the success of the previous summit (which attracted over 10,000 attendees and 200+ exhibitors), the 2026 edition aims to unite key stakeholders to explore innovative strategies for sustainable business growth. The Eldoret International Business Summit 2026 is the flagship event organized by the Kenya National Chamber of Commerce and Industry (KNCCI) Uasin Gishu Chapter. This three-day summit brings together the nation's brightest minds in business, government, and civil society to drive economic growth and foster international partnerships. Join us in Eldoret, The City of Champions, as we explore Africa's trade and economic future.",
  date: "2026-04-23",
  endDate: "2026-04-25",
  location: "Eldoret, Uasin Gishu County (The City of Champions)",
  venue: "Rupaz center",
  highlights: [
    "Networking with 500+ business leaders",
    "50+ industry speakers",
    "30+ sessions and workshops",
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

// Gallery data
export const staticGallery: GalleryImage[] = [
  { id: "1", url: "https://solby.sfo3.digitaloceanspaces.com/1769497085012-WhatsApp%20Image%202026-01-27%20at%2009.11.08.jpeg", eventName: "Kenya Business Summit", year: "2024", alt: "Business leaders networking at the summit" },
  { id: "2", url: "https://solby.sfo3.digitaloceanspaces.com/1769497085040-WhatsApp%20Image%202026-01-27%20at%2009.10.56.jpeg", eventName: "Trade Expo Kenya", year: "2024", alt: "Exhibition hall with business booths" },
  { id: "3", url: "https://solby.sfo3.digitaloceanspaces.com/1769497085219-WhatsApp%20Image%202026-01-27%20at%2009.11.03.jpeg", eventName: "SME Conference", year: "2023", alt: "Panel discussion with industry experts" },
  { id: "4", url: "https://solby.sfo3.digitaloceanspaces.com/1769497085012-WhatsApp%20Image%202026-01-27%20at%2009.11.08.jpeg", eventName: "Kenya Business Summit", year: "2023", alt: "Keynote speaker addressing the audience" },
  { id: "5", url: "https://solby.sfo3.digitaloceanspaces.com/1769497085040-WhatsApp%20Image%202026-01-27%20at%2009.10.56.jpeg", eventName: "Trade Expo Kenya", year: "2023", alt: "Business professionals at networking event" },
  { id: "6", url: "https://solby.sfo3.digitaloceanspaces.com/1769497085219-WhatsApp%20Image%202026-01-27%20at%2009.11.03.jpeg", eventName: "Investment Forum", year: "2023", alt: "Workshop session in progress" },
  { id: "7", url: "https://solby.sfo3.digitaloceanspaces.com/1769497085012-WhatsApp%20Image%202026-01-27%20at%2009.11.08.jpeg", eventName: "Kenya Business Summit", year: "2022", alt: "Award ceremony at the gala dinner" },
  { id: "8", url: "https://solby.sfo3.digitaloceanspaces.com/1769497085040-WhatsApp%20Image%202026-01-27%20at%2009.10.56.jpeg", eventName: "Trade Expo Kenya", year: "2022", alt: "Product showcase at the exhibition" },
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

// Venue data
export const staticVenue: Venue = {
  name: "Rupa's Mall Eldoret",
  address: "Malaba Road",
  city: "Eldoret",
  description: "Join us at Rupa's Mall Eldoret, a premier shopping and event destination in The City of Champions. This modern mall facility offers excellent amenities, spacious event halls, and is perfectly located on Malaba Road in the heart of Eldoret, making it the ideal setting for this landmark international business summit.",
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
    "Eka Hotel Eldoret",
    "Boma Inn Eldoret",
    "The Noble Hotel",
    "The Sirikwa Hotel",
  ],
};
