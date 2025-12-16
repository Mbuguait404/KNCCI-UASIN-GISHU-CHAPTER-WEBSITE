# KNCCI Event Website Design Guidelines

## Design Approach
**Reference-Based Approach**: Closely mirror the structure and UX of https://softwaresummit.go.ke/ while adapting for KNCCI's broader institutional identity.

## Color System
- **#88807e**: Neutral gray for backgrounds and secondary text
- **#ec252c**: Primary accent for CTAs, highlights, and key actions
- **#0e783d**: Secondary accent for success states and emphasis
- **#000000**: Primary text and strong contrasts

Apply these colors consistently across buttons, headings, dividers, icons, and visual highlights.

## Typography & Spacing
- Clean, professional typography with strong hierarchy
- Generous white space throughout
- Consistent vertical rhythm using Tailwind units: **p-4, p-8, p-12, p-16, p-20** for sections
- Component spacing: **gap-4, gap-6, gap-8** for grids and flexbox layouts

## Core Components

### Navigation
- Sticky navbar with **distorted glass effect** (Cult UI glassmorphism)
- Links: Home, About KNCCI, Events, Speakers, Program, Venue, Gallery, Partners, Contact
- "Register Now" button styled with #ec252c
- Reduces height and increases blur on scroll

### Hero Section
- Full-width with background image/animated gradient
- Event name as main headline
- Event date, location, and descriptive subtitle
- **Countdown timer** (days, hours, minutes, seconds) with live updates
- Dual CTAs: "Register for Event" (primary) and "View Program" (secondary)
- Animated entrance on page load

### About Event
- Section title with overview copy
- Bullet highlights (networking, keynotes, exhibitions, policy discussions)
- Embedded video or curated image collage

### Key Speakers
- Grid layout with speaker cards
- Photos, names, titles, organizations
- Hover effects revealing bios
- Modal/drawer for full profiles

### Event Program
- Tabbed or accordion schedule (shadcn/ui)
- Sessions grouped by day
- Time, topic, speaker, session type with icons
- Clean, scannable layout

### Venue
- Two-column responsive layout
- Venue name, address, embedded map
- Venue images, accessibility info, nearby hotels
- Scroll animations

### Registration
- Distinct section with soft background contrast
- Persuasive copy with value highlights
- Prominent "Register Now" CTA
- Trust indicators (partner logos, attendance stats)

### Partners/Sponsors
- Grid or carousel layout
- Categorized by tier
- Grayscale logos transitioning to color on hover

### Gallery
- Masonry or responsive grid
- Previous event images
- Hover overlay with event name/year
- Lightbox with smooth transitions

### Testimonials
- Quote cards from past attendees
- Name, title, organization
- Subtle elevation and motion

### Footer
- KNCCI logo and mission statement
- Quick links, contact info, social icons
- Newsletter subscription UI
- Copyright notice

## Interactions & Animations
- Smooth scrolling throughout
- Button hover/press states
- Fade-in, slide-up, scale animations on scroll
- Live countdown timer updates
- Refined motion, not flashy

## Images
**Hero Image**: Full-width background featuring Kenyan business/trade environment with Black professionals
**Speaker Images**: Professional headshots of Black speakers
**Venue Images**: Real-world Kenyan locations
**Gallery Images**: Previous KNCCI events featuring Black attendees and speakers
**About Section**: Collage of Kenyan/African business environments

## Component Libraries
- **shadcn/ui**: Tabs, accordions, modals, cards
- **Cult UI**: Glassmorphism navigation, enhanced visual effects

## Responsive Design
Mobile-first approach with breakpoints optimized for desktop, tablet, and mobile viewports.