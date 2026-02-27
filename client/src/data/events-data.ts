import { staticEvent } from "./static-data";
import { ChamberEvent } from "@shared/schema";

export const upcomingEvents: ChamberEvent[] = [
    {
        id: staticEvent.id,
        title: staticEvent.name,
        date: "April 23-25, 2026",
        location: staticEvent.venue,
        image: "https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?auto=format&fit=crop&q=80&w=2070",
        category: "Summit",
        description: staticEvent.subtitle,
        featured: true,
        longDescription: "The 4th Edition of the Eldoret International Business Summit is the premier gathering for trade, innovation, and economic transformation in East Africa. Join 1000+ business leaders for a transformative three-day experience.",
        content: `
            <p>The Eldoret International Business Summit (EIBS) has established itself as the most significant business gathering in the North Rift region. The 2026 edition promises to be even more impactful, focusing on Eldoret City as a strategic gateway for regional trade.</p>
            <h3>What to Expect</h3>
            <p>Delegates will enjoy high-level plenary sessions, specialized break-out tracks, a large-scale exhibition, and unparalleled networking opportunities. The summit will cover sectors including Agribusiness, Manufacturing, Tech & Innovation, and Finance.</p>
            <h3>Target Audience</h3>
            <ul>
                <li>Business Owners and Entrepreneurs</li>
                <li>Government Officials and Policy Makers</li>
                <li>Investors looking for opportunities in North Rift</li>
                <li>International Trade Partners</li>
            </ul>
        `,
        agenda: [
            { time: "08:00 AM", activity: "Registration & Breakfast" },
            { time: "09:30 AM", activity: "Opening Ceremony" },
            { time: "11:00 AM", activity: "Keynote: Regional Trade Dynamics" },
            { time: "01:00 PM", activity: "Business Lunch & Networking" }
        ],
        registrationLink: "/exhibition-booking"
    },
    {
        id: "monthly-mixer-may",
        title: "May Business Networking Mixer",
        date: "May 15, 2026",
        location: "Boma Inn, Eldoret",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=2069",
        category: "Networking",
        description: "Our monthly gathering for business leaders to connect and share insights.",
        featured: false,
        longDescription: "Connect with fellow entrepreneurs and professionals in a relaxed atmosphere at our monthly networking mixer. This event is designed to foster relationships and spark new business opportunities within the Uasin Gishu business community.",
        content: `
            <p>The Monthly Business Mixer is KNCCI's signature networking event, bringing together members and non-members for an evening of connection and collaboration.</p>
            <p>Each month, we feature a 'Business Spotlight' where one member gets to present their services to the audience, followed by a Q&A session and open networking.</p>
        `,
        agenda: [
            { time: "05:30 PM", activity: "Arrival & Welcome Drinks" },
            { time: "06:15 PM", activity: "Business Spotlight Presentation" },
            { time: "07:00 PM", activity: "Open Networking & Refreshments" }
        ]
    },
    {
        id: "agribusiness-expo",
        title: "North Rift Agribusiness Expo",
        date: "June 10-12, 2026",
        location: "Eldoret Showground",
        image: "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=2072",
        category: "Exhibition",
        description: "Showcasing the latest in agricultural technology and value addition.",
        featured: false,
        longDescription: "The North Rift Agribusiness Expo is the leading agricultural trade fair in the region. It brings together farmers, equipment manufacturers, seed companies, and financial institutions to showcase the latest innovations in the sector.",
        content: `
            <p>Agricultural transformation is at the heart of Uasin Gishu's economy. This expo provides a platform for technology transfer and market linkage for all stakeholders in the value chain.</p>
            <p>Special focus this year will be on sustainable farming practices and digital tools for farm management.</p>
        `,
        agenda: [
            { time: "09:00 AM", activity: "Exhibition Gates Open" },
            { time: "10:30 AM", activity: "Live Machinery Demonstrations" },
            { time: "02:00 PM", activity: "Panel: Value Addition in Grains" }
        ]
    }
];

export const pastEvents = [
    {
        id: "awards-2025",
        title: "Chamber Business Awards 2025",
        date: "December 20, 2025",
        location: "Eka Hotel, Eldoret",
        category: "Awards"
    },
    {
        id: "sme-workshop",
        title: "SME Digital Transformation Workshop",
        date: "November 5, 2025",
        location: "KVDA Plaza",
        category: "Workshop"
    }
];
