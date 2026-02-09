# Event-Sphere Ticketing Flow Plan (Updated)
## Guest Mode Registration + Deferred Payments

### Overview
This updated plan focuses on **frictionless registration** where attendees can register for the Eldoret International Business Summit 2026 **without creating accounts**. Payments for the gala night are **deferred to a later phase** or handled through **manual/offline methods** initially.

---

## Key Changes from Previous Plan

### What's Changed:
1. ✅ **No user accounts required** - Email-only registration
2. ✅ **Guest mode is primary** - Zero barrier to entry
3. ✅ **Payments deferred** - Gala tickets tracked as "interest" or handled manually
4. ✅ **Simplified architecture** - No complex auth system needed initially
5. ✅ **Email-centric** - All tickets delivered and retrieved via email

### What Stays the Same:
- Organization setup in Ticketing API
- Event and ticket type creation
- QR code generation for tickets
- Check-in/validation system
- Integration with Lancola Tech Ticketing API

---

## Part 1: Revised Architecture

### 1.1 System Flow (Guest-First Approach)

```
USER VISITS WEBSITE
       │
       ▼
┌────────────────────────────────────────────────────────────┐
│              Event-Sphere Frontend                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Registration Modal                                 │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │  📧 Email: [user@example.com]               │   │  │
│  │  │  👤 Name: [John Doe]                        │   │  │
│  │  │  📱 Phone: [+254...] (optional)             │   │  │
│  │  │                                             │   │  │
│  │  │  [✓] General Admission (Free)              │   │  │
│  │  │  [ ] Interested in Gala Night (1,500 KSH)  │   │  │
│  │  │                                             │   │  │
│  │  │  [Complete Registration]                     │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│         Event-Sphere Backend (Express)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Guest Reg.   │  │ API Client   │  │ Email Service│      │
│  │ Service      │  │ (Org Token)  │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│      Lancola Tech Ticketing API                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Guest Users  │  │    Tickets   │  │  Purchases   │      │
│  │ (Temporary)  │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────────────────────────────────────────┘
```

### 1.2 Guest Mode Explained

**What is Guest Mode?**
- Users provide **minimal information** (email, name)
- **No password** required
- **No account** created in traditional sense
- System creates **temporary guest session** tied to email
- Tickets are **delivered via email** with unique codes
- Users can **retrieve tickets anytime** using email + ticket code

**Why Guest Mode?**
- Lower friction = higher registration rates
- People hesitate to create accounts for one-time events
- Faster registration process
- Still trackable and secure
- Can upgrade to full account later if desired

---

## Part 2: Data Model Changes

### 2.1 Guest Registration Schema

**What we collect from users:**
```typescript
interface GuestRegistration {
  // Required
  email: string;           // Unique identifier
  firstName: string;
  lastName: string;
  
  // Optional
  phone?: string;
  organization?: string;
  jobTitle?: string;
  
  // System generated
  guestId: string;         // Internal reference
  registeredAt: Date;
  ipAddress: string;       // For security
  userAgent: string;        // Analytics
}
```

**What we DON'T collect (initially):**
- Passwords
- Usernames
- Full addresses
- Payment info (deferred)

### 2.2 Ticket Ownership Model

**Option A: Email-Based (Recommended)**
```
Tickets are tied to email address
├── No user account in Ticketing API
├── Guest record in Event-Sphere DB
└── Ticket stored in Ticketing API with purchaserEmail
```

**Option B: Temporary Guest Users in Ticketing API**
```
POST /auth/guest  (if API supports it)
├── Creates temporary user session
├── Returns guest token
└── Tickets tied to guest user ID
```

**Recommendation: Option A** because:
- Simpler implementation
- No need for guest session management
- Email is the source of truth
- Easy to "upgrade" to full account later

### 2.3 Registration States

```
VISITOR
   │
   ▼ (enters email)
┌────────────────┐
│ EMAIL CAPTURED │
└───────┬────────┘
        │
   ┌────┴────┐
   │         │
   ▼         ▼
┌──────┐  ┌──────────┐
│ NEW  │  │ RETURNING│
│ USER │  │  USER    │
└──┬───┘  └────┬─────┘
   │           │
   │      (shows existing tickets)
   ▼           │
┌────────────────────┐
│ REGISTRATION FORM  │
│ (name, phone, etc) │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ COMPLETE REGISTRATION│
│ • Create guest record │
│ • Generate ticket(s)  │
│ • Send email         │
└────────┬────────────┘
         │
         ▼
┌────────────────────┐
│  SUCCESS PAGE      │
│  ┌──────────────┐  │
│  │ ✓ Registered│  │
│  │ 📧 Check email│ │
│  │ 📱 Save QR code │ │
│  └──────────────┘  │
└────────────────────┘
```

---

## Part 3: Implementation Phases (Updated)

### Phase 1: Foundation & Guest Registration (Week 1-2)

#### Step 1.1: Organization Setup (Same as before)

**Create KNCCI Organization:**
```
POST /organizations
{
  "name": "Kenya National Chamber of Commerce and Industry - Uasin Gishu",
  "description": "Eldoret International Business Summit 2026",
  "email": "events@kncci-uasingishu.co.ke",
  "status": "active"
}
```

**Get Organization Credentials:**
- Organization ID: `org_kncci_2026`
- API Token: `{org_admin_token}`

#### Step 1.2: Create Event & Ticket Types

**A. Main Event:**
```
POST /events
{
  "title": "Eldoret International Business Summit 2026",
  "slug": "eldoret-summit-2026",
  "description": "3-day international business summit...",
  "organizationId": "org_kncci_2026",
  "status": "published",
  "startDateTime": "2026-07-15T08:00:00Z",
  "endDateTime": "2026-07-17T18:00:00Z",
  "locationName": "Eldoret Sports Club",
  "locationCity": "Eldoret",
  "isFree": false  // Has paid component (gala)
}
```

**Store:** `event_id: evt_summit_2026`

**B. General Admission Ticket (Free):**
```
POST /ticket-types
{
  "eventId": "evt_summit_2026",
  "name": "General Admission",
  "description": "Access to all summit sessions and exhibitions (July 15-17, 2026)",
  "price": 0,
  "quantity": 2000,
  "isActive": true,
  "saleEndDate": "2026-07-14T23:59:59Z",
  "benefits": [
    "All 3 days access",
    "Workshops and exhibitions",
    "Networking sessions"
  ]
}
```

**Store:** `ticket_type_general: tt_general_001`

**C. Gala Night Ticket (1,500 KSH - Deferred Payment):**
```
POST /ticket-types
{
  "eventId": "evt_summit_2026",
  "name": "Gala Night Access",
  "description": "Exclusive gala dinner (July 16, 6PM-11PM). Payment required.",
  "price": 1500,
  "quantity": 500,
  "isActive": true,
  "saleEndDate": "2026-07-15T23:59:59Z",
  "benefits": [
    "Gala dinner & awards",
    "VIP networking",
    "Entertainment"
  ],
  "metadata": {
    "paymentDeferred": true,
    "paymentInstructions": "Pay via M-Pesa: [Number] or at venue"
  }
}
```

**Store:** `ticket_type_gala: tt_gala_001`

#### Step 1.3: Database Schema (Simplified)

**New Tables:**

```sql
-- Guest Registrations (local cache)
guests:
  - id (UUID)
  - email (unique)
  - first_name
  - last_name
  - phone (optional)
  - organization (optional)
  - job_title (optional)
  - registered_at
  - ip_address
  - user_agent
  - is_active

-- Guest Tickets (local reference to API tickets)
guest_tickets:
  - id (UUID)
  - guest_id -> guests.id
  - ticket_api_id (reference to Ticketing API)
  - ticket_code
  - ticket_type_id
  - event_id
  - status (registered | payment_pending | confirmed | checked_in)
  - qr_code_url
  - created_at
  - updated_at

-- Gala Interest Tracking (for deferred payments)
gala_interest:
  - id (UUID)
  - guest_id -> guests.id
  - interested_at
  - contacted (boolean)  // Have we followed up?
  - payment_status (pending | paid | cancelled)
  - notes
```

**Why local tables?**
- Cache guest info for fast lookups
- Track registration status
- Handle deferred payments
- Analytics and reporting

#### Step 1.4: Guest Registration API

**New Endpoints in Event-Sphere:**

```
POST /api/guests/register
```

**Request:**
```json
{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254712345678",
  "organization": "ABC Company",
  "jobTitle": "Manager",
  "ticketSelection": {
    "generalAdmission": true,
    "galaNight": false  // or true for interest
  }
}
```

**Flow:**
1. Validate email format
2. Check if email already registered
3. Create guest record in local DB
4. Call Ticketing API to create tickets:
   ```
   POST /purchases
   {
     "eventId": "evt_summit_2026",
     "items": [
       {
         "ticketTypeId": "tt_general_001",
         "quantity": 1
       }
     ],
     "purchaserEmail": "john.doe@example.com",
     "guestRegistration": true
   }
   ```
5. Store ticket reference in local DB
6. Send email with ticket(s)
7. Return success response

**Response:**
```json
{
  "success": true,
  "message": "Registration successful!",
  "guestId": "guest_abc123",
  "tickets": [
    {
      "ticketId": "tick_001",
      "ticketCode": "EBS2026-GA-001234",
      "type": "General Admission",
      "qrCode": "https://api.example.com/qr/tick_001",
      "status": "confirmed"
    }
  ],
  "instructions": {
    "email": "Check your email for tickets",
    "download": "Save or screenshot your QR code",
    "retrieve": "Visit /tickets/retrieve if you lose your ticket"
  }
}
```

#### Step 1.5: Email Ticket Delivery

**Email Template Structure:**

```
Subject: Your Tickets - Eldoret International Business Summit 2026

Hi John,

Thank you for registering! Here are your ticket details:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎫 GENERAL ADMISSION (FREE)
Ticket Code: EBS2026-GA-001234
Date: July 15-17, 2026
Venue: Eldoret Sports Club

[QR CODE IMAGE]

Save this email or download your ticket: [Download PDF]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ IMPORTANT:
• Bring your QR code (printed or on phone)
• Arrive 30 minutes early for registration
• Present this at the entrance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 QUICK ACTIONS:
[View Tickets] [Add to Calendar] [Share]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions? Contact us at events@kncci-uasingishu.co.ke

See you at the summit!
KNCCI Uasin Gishu Team
```

**Technical Details:**
- Generate PDF ticket with QR code
- Inline QR code image (base64)
- Mobile-friendly design
- Direct links to ticket retrieval

---

### Phase 2: Ticket Management for Guests (Week 2-3)

#### Step 2.1: Ticket Retrieval System

**Problem:** Guests lose emails or delete them
**Solution:** Self-service ticket retrieval

**New Page: `/retrieve-tickets`**

**UI:**
```
┌─────────────────────────────────────┐
│     Retrieve Your Tickets         │
│                                     │
│  Enter your email address:         │
│  ┌──────────────────────────────┐  │
│  │ john.doe@example.com        │  │
│  └──────────────────────────────┘  │
│                                     │
│  [Find My Tickets]                 │
│                                     │
└─────────────────────────────────────┘
```

**API Endpoint:**
```
POST /api/guests/retrieve-tickets
```

**Request:**
```json
{
  "email": "john.doe@example.com"
}
```

**Flow:**
1. Lookup guest by email
2. Fetch all tickets from Ticketing API:
   ```
   GET /tickets?email=john.doe@example.com
   ```
3. Return ticket list

**Response:**
```json
{
  "success": true,
  "guest": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "tickets": [
    {
      "ticketCode": "EBS2026-GA-001234",
      "type": "General Admission",
      "status": "valid",
      "qrCode": "...",
      "downloadUrl": "..."
    }
  ]
}
```

**Email Alternative:**
- If tickets found, also send email with links
- "We sent your tickets to john.doe@example.com"
- Security: Only send to registered email

#### Step 2.2: "My Tickets" Page (No Login Required)

**How it works:**
- Page URL: `/my-tickets?email=john@example.com&token=abc123`
- Token is a short-lived signed JWT (expires in 7 days)
- Generated at registration time
- Stored in email as "View Tickets" link

**Security:**
- Token tied to specific email
- Token expires (configurable)
- Can be regenerated if lost
- No sensitive info without token

**Features on "My Tickets" Page:**
- View all tickets
- Download PDF versions
- Share ticket (generate shareable link)
- Transfer ticket to different email (optional)
- Check-in status

#### Step 2.3: Ticket Sharing

**Use Case:** User wants to send ticket to colleague

**Flow:**
1. User clicks "Share Ticket"
2. Enter recipient email
3. System sends ticket to new email
4. Original ticket marked as "transferred" OR
5. New ticket issued to recipient (configurable)

**API:**
```
POST /api/tickets/{ticketId}/share
{
  "recipientEmail": "colleague@example.com"
}
```

---

### Phase 3: Gala Night Interest (Week 3)

Since payments are deferred, handle gala interest differently.

#### Step 3.1: Interest Tracking Model

**Modified Registration Flow:**

```
Registration Form:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ General Admission (Free) - SELECTED

[✓] I'm interested in Gala Night (1,500 KSH)
    
    You'll receive payment instructions via email.
    Early bird discount available!

[Complete Registration]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**What happens:**
1. Guest registers for free admission
2. System notes "galaInterest: true"
3. Gala ticket created with status: "payment_pending"
4. Email sent with BOTH tickets + payment instructions

**Email for Gala Interest:**
```
Subject: Complete Your Gala Night Registration

Hi John,

You're registered for the summit! 🎉

You also expressed interest in the Gala Night.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAYMENT OPTIONS (1,500 KSH):

Option 1: M-Pesa (Recommended)
• Paybill: XXXXXX
• Account: EBS2026-GA-001234
• Amount: 1,500 KSH
• Your Name: John Doe

Option 2: Pay at Venue
• Visit registration desk
• Pay cash/card: 1,500 KSH
• Reference: EBS2026-GA-001234

Option 3: Bank Transfer
• Account: KNCCI Uasin Gishu
• Bank: [Bank Details]
• Reference: EBS2026-GA-001234

[I've Paid - Confirm Payment]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Note: Gala ticket will be activated upon payment confirmation.
```

#### Step 3.2: Payment Confirmation Workflow

**Manual Confirmation (Phase 1):**
1. Organizer receives payment notification (SMS/Email)
2. Organizer logs into admin panel
3. Searches guest by email or ticket code
4. Clicks "Confirm Payment"
5. System updates ticket status to "confirmed"
6. Guest receives confirmation email

**Admin Interface:**
```
┌─────────────────────────────────────────┐
│  Payment Confirmation                 │
│                                         │
│  Search: [ticket code or email] 🔍     │
│                                         │
│  Guest: John Doe                        │
│  Ticket: EBS2026-GA-001234             │
│  Gala Status: Payment Pending           │
│                                         │
│  [Confirm Payment Received]            │
│  [Send Reminder]                       │
│  [Cancel Interest]                     │
│                                         │
└─────────────────────────────────────────┘
```

**Later (Phase 2):** Automate with M-Pesa callback

#### Step 3.3: Follow-up System

**Automated Reminders:**
- Day 1: Thank you email + gala payment info
- Day 3: Reminder: "Complete your gala registration"
- Day 7: "Early bird ends soon"
- Week 2: Final reminder

**API for reminders:**
```
POST /api/gala/send-reminder
{
  "guestId": "guest_abc123",
  "template": "payment_reminder"
}
```

---

### Phase 4: Check-In & Validation (Week 3-4)

#### Step 4.1: Check-In Interface

**Who checks in guests?**
- Event staff/volunteers (Agent role)
- Self-check-in kiosks (optional)

**Agent Check-In Flow:**

```
┌─────────────────────────────────────┐
│  Check-In Scanner                 │
│                                     │
│  [📷 Scan QR] or                   │
│                                     │
│  Enter Ticket Code:                │
│  ┌────────────────────────────┐    │
│  │ EBS2026-GA-001234         │    │
│  └────────────────────────────┘    │
│                                     │
│  [Search]                          │
│                                     │
└─────────────────────────────────────┘
```

**After Scan:**
```
┌─────────────────────────────────────┐
│  ✓ Ticket Valid                    │
│                                     │
│  John Doe                          │
│  General Admission                 │
│  Ticket: EBS2026-GA-001234         │
│  Status: Not Checked In            │
│                                     │
│  [✓ Confirm Check-In]              │
│                                     │
└─────────────────────────────────────┘
```

**API Call:**
```
POST /api/tickets/scan
Authorization: Bearer {AGENT_TOKEN}
{
  "ticketCode": "EBS2026-GA-001234",
  "checkInLocation": "Main Entrance",
  "checkedInBy": "agent_user_id"
}
```

#### Step 4.2: Handling Different Ticket States

**Possible States:**

1. **General Admission - Confirmed**
   - ✅ Allow entry
   - Mark as checked_in

2. **Gala - Payment Pending**
   - ⚠️ Show: "Payment Required"
   - Options: [Collect Payment] [Deny Entry] [Verify Payment]

3. **Gala - Confirmed**
   - ✅ Allow entry
   - Check if also GA or just Gala

4. **Already Checked In**
   - ⚠️ Show: "Already checked in at [time]"
   - [View History] [Allow Re-entry]

#### Step 4.3: Offline Mode (Optional but Recommended)

**Problem:** Internet might be spotty at venue
**Solution:** Offline-capable check-in

**How it works:**
1. Pre-download all valid tickets before event
2. Store in local cache (IndexedDB/PWA)
3. Scan and validate offline
4. Sync check-ins when connection restored

**Sync API:**
```
POST /api/checkin/sync
{
  "checkins": [
    {
      "ticketCode": "...",
      "checkedInAt": "2026-07-15T08:30:00Z",
      "location": "Main Entrance",
      "offline": true
    }
  ]
}
```

---

### Phase 5: Admin Dashboard (Week 4)

#### Step 5.1: Registration Analytics

**Dashboard Metrics:**
```
┌─────────────────────────────────────────────────────────┐
│  ELDORET SUMMIT 2026 - DASHBOARD                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Total Registrations        1,247                      │
│  ├─ General Admission       1,200 (Free)               │
│  └─ Gala Interest            400 (Pending Payment)     │
│                                                         │
│  Confirmed Gala Tickets      150 (Paid)                │
│  Check-ins (Today)           0                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Registration Trend (Last 7 Days)                     │
│  📈 ████████████████████████████████████              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Download Guest List] [Export to CSV] [Send Email]    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Data Sources:**
- Local DB for fast counts
- Ticketing API for verification
- Cached data updates every 5 minutes

#### Step 5.2: Guest Management

**Features:**
- Search guests by name, email, ticket code
- View/edit guest details
- See ticket status
- Manual check-in override
- Resend tickets
- Cancel registrations

**Bulk Actions:**
- Export guest list
- Email all guests
- Email gala interest group
- Mark multiple payments as received

#### Step 5.3: Gala Payment Tracking

**Gala Management View:**
```
┌─────────────────────────────────────────────────────┐
│  GALA NIGHT PAYMENTS                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Filter: [All] [Pending] [Confirmed] [Cancelled]   │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ ☐ John Doe                                    │ │
│  │    Ticket: EBS2026-GA-001234                  │ │
│  │    Status: Payment Pending                    │ │
│  │    [Confirm] [Reminder] [Cancel]              │ │
│  ├───────────────────────────────────────────────┤ │
│  │ ☐ Jane Smith                                  │ │
│  │    Ticket: EBS2026-GA-001235                  │ │
│  │    Status: Confirmed ✓                        │ │
│  │    Paid: 1,500 KSH on 2026-02-01             │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Bulk: [Confirm Selected] [Send Reminder]           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Part 4: User Experience Flow (Complete Journey)

### 4.1 First-Time Visitor Journey

**Step 1: Land on Homepage**
```
┌─────────────────────────────────────┐
│  ELDORET INTERNATIONAL             │
│  BUSINESS SUMMIT 2026              │
│                                     │
│  July 15-17, 2026                  │
│  Eldoret Sports Club               │
│                                     │
│  [REGISTER NOW - FREE]              │
│  ↓ 2,000+ people already registered│
└─────────────────────────────────────┘
```

**Step 2: Click Register**
- Modal opens (no page navigation)
- Shows registration form immediately

**Step 3: Complete Registration Form**
```
┌─────────────────────────────────────┐
│  Register for the Summit            │
│                                     │
│  📧 Email *                         │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                     │
│  👤 First Name *                   │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                     │
│  👤 Last Name *                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                     │
│  📱 Phone (optional)               │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ ✓ General Admission (FREE)   │  │
│  │   July 15-17, All sessions   │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ ☐ Gala Night (1,500 KSH)    │  │
│  │   July 16, Awards Dinner     │  │
│  │   Payment required           │  │
│  └──────────────────────────────┘  │
│                                     │
│  [COMPLETE REGISTRATION]           │
│                                     │
│  By registering, you agree...    │
└─────────────────────────────────────┘
```

**Step 4: Success State**
```
┌─────────────────────────────────────┐
│  🎉 Registration Complete!         │
│                                     │
│  Check your email for your ticket. │
│                                     │
│  📧 john.doe@example.com            │
│                                     │
│  [Download Ticket]                  │
│  [Add to Calendar]                  │
│  [Share with Friends]               │
│                                     │
│  Lost your ticket?                   │
│  [Retrieve Tickets]                 │
└─────────────────────────────────────┘
```

### 4.2 Gala Interest Journey

**If user selected Gala Interest:**

**Email received:**
```
Subject: Your Summit Registration + Gala Night Payment

Hi John,

Welcome to the Eldoret International Business Summit 2026!

🎫 YOUR FREE TICKET:
General Admission (July 15-17)
Code: EBS2026-GA-001234
[QR CODE]

✨ GALA NIGHT - ACTION REQUIRED:
You expressed interest in the Gala Night (1,500 KSH).

To complete your gala registration:

[Pay Now - M-Pesa]  ← Button (if available)

OR

Pay manually:
• M-Pesa Paybill: XXXXXX
• Account: EBS2026-GA-001234  
• Amount: 1,500 KSH

After paying, click here to confirm:
[I've Completed Payment]

Questions? Reply to this email.

KNCCI Uasin Gishu Team
```

**Payment Confirmation Page:**
```
┌─────────────────────────────────────┐
│  Confirm Your Gala Payment          │
│                                     │
│  Ticket: EBS2026-GA-001234         │
│  Guest: John Doe                    │
│                                     │
│  How did you pay?                   │
│  ○ M-Pesa                          │
│  ○ Bank Transfer                   │
│  ○ Cash at Office                  │
│                                     │
│  Transaction Details:              │
│  ┌──────────────────────────────┐  │
│  │ M-Pesa Code: QWE123         │  │
│  │ Date: 2026-02-01            │  │
│  └──────────────────────────────┘  │
│                                     │
│  [Submit for Verification]         │
│                                     │
│  Note: We'll verify and activate   │
│  your ticket within 24 hours.      │
└─────────────────────────────────────┘
```

### 4.3 Returning Visitor Journey

**Scenario: Lost ticket, visiting retrieve page**

```
┌─────────────────────────────────────┐
│  Retrieve Your Tickets              │
│                                     │
│  Enter the email you used to        │
│  register:                          │
│                                     │
│  📧 john.doe@example.com           │
│                                     │
│  [Find My Tickets]                  │
│                                     │
│  ─── or ───                         │
│                                     │
│  Enter ticket code:                 │
│  ┌──────────────────────────────┐  │
│  │ EBS2026-GA-001234          │  │
│  └──────────────────────────────┘  │
│                                     │
│  [Search]                           │
└─────────────────────────────────────┘
```

**After search:**
```
┌─────────────────────────────────────┐
│  John Doe's Tickets                 │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ 🎫 General Admission          │  │
│  │    Code: EBS2026-GA-001234   │  │
│  │    Status: ✓ Valid           │  │
│  │                             │  │
│  │    [View QR Code]           │  │
│  │    [Download PDF]           │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ ✨ Gala Night               │  │
│  │    Code: EBS2026-GL-001234   │  │
│  │    Status: ⏳ Pending Payment│  │
│  │                             │  │
│  │    [Complete Payment]        │  │
│  └──────────────────────────────┘  │
│                                     │
│  [Resend All to Email]              │
└─────────────────────────────────────┘
```

---

## Part 5: Technical Implementation Details

### 5.1 Backend Services Architecture

```
Event-Sphere Backend
├── GuestService
│   ├── registerGuest(data)
│   ├── retrieveTickets(email)
│   ├── updateGuest(id, data)
│   └── findGuestByEmail(email)
│
├── TicketService
│   ├── createTicket(guestId, ticketTypeId)
│   ├── validateTicket(ticketCode)
│   ├── checkInTicket(ticketCode, agentId)
│   └── transferTicket(ticketId, newEmail)
│
├── EmailService
│   ├── sendTicketConfirmation(guest, tickets)
│   ├── sendGalaReminder(guest)
│   ├── resendTickets(email)
│   └── sendPaymentInstructions(guest)
│
├── TicketingApiClient
│   ├── createPurchase(data)
│   ├── getTickets(filters)
│   ├── scanTicket(code)
│   └── syncData()
│
└── AdminService
    ├── getRegistrationStats()
    ├── confirmGalaPayment(ticketId)
    ├── bulkEmailGuests(filters)
    └── exportGuestList()
```

### 5.2 API Endpoints (Event-Sphere Backend)

**Guest Registration:**
```
POST /api/guests/register
  Body: {email, firstName, lastName, phone, ticketSelection}
  Response: {guestId, tickets, message}

POST /api/guests/retrieve-tickets
  Body: {email}
  Response: {guest, tickets[]}

GET /api/guests/:id/tickets
  Response: {tickets[]}

PUT /api/guests/:id
  Body: {updates}
  Response: {updatedGuest}
```

**Ticket Management:**
```
POST /api/tickets/validate
  Body: {ticketCode}
  Response: {valid: true, ticketDetails}

POST /api/tickets/:id/checkin
  Auth: Agent Token
  Body: {location, timestamp}
  Response: {success, checkedInTicket}

POST /api/tickets/:id/share
  Body: {recipientEmail}
  Response: {success, newTicket}

POST /api/tickets/:id/resend
  Response: {success, message}
```

**Admin Operations:**
```
GET /api/admin/stats
  Auth: Admin Token
  Response: {registrations, ticketsByType, checkIns}

GET /api/admin/guests
  Query: {search, ticketType, status, page, limit}
  Response: {guests[], total, page}

POST /api/admin/gala/confirm-payment
  Auth: Admin Token
  Body: {ticketId, paymentMethod, notes}
  Response: {success, updatedTicket}

POST /api/admin/bulk/email
  Auth: Admin Token
  Body: {filters, template, subject}
  Response: {sent, failed}
```

### 5.3 Frontend Components

**Registration Flow:**
```
components/registration/
├── RegistrationModal.tsx        # Main modal container
├── GuestRegistrationForm.tsx  # Form with validation
├── TicketSelector.tsx           # GA + Gala checkboxes
├── RegistrationSuccess.tsx     # Success state with actions
└── useRegistration.ts          # Hook for registration logic

components/tickets/
├── RetrieveTicketsPage.tsx    # /retrieve-tickets route
├── MyTicketsPage.tsx           # /my-tickets route
├── TicketCard.tsx              # Individual ticket display
├── QRCodeDisplay.tsx           # QR code viewer
├── ShareTicketModal.tsx        # Share functionality
└── useTickets.ts              # Hook for ticket management

components/checkin/
├── CheckInScanner.tsx          # QR scanner interface
├── TicketValidation.tsx        # Validation result display
├── CheckInDashboard.tsx        # Real-time stats
└── useCheckIn.ts              # Hook for check-in logic

components/admin/
├── AdminDashboard.tsx          # Main dashboard
├── GuestManagement.tsx         # Guest list and actions
├── GalaPaymentTracking.tsx     # Gala-specific view
├── RegistrationAnalytics.tsx   # Charts and stats
└── CheckInMonitor.tsx         # Live check-in feed
```

### 5.4 Email Service Integration

**Provider Options:**
- SendGrid (recommended)
- AWS SES
- Mailgun
- Resend (modern, good for transactional)

**Email Templates:**
```
templates/emails/
├── welcome-registration.hbs     # Main welcome + tickets
├── gala-payment-instructions.hbs # Payment details
├── gala-payment-reminder.hbs    # Follow-up
├── ticket-retrieval.hbs         # When retrieving lost tickets
├── checkin-confirmation.hbs     # After check-in (optional)
└── event-reminder.hbs           # 24h before event
```

**Template Engine:**
- Handlebars (hbs) for HTML emails
- Plain text versions for each
- Inline CSS (for email client compatibility)

---

## Part 6: Deferred Features (Phase 2)

### 6.1 When Payments Come Back

**Integration Points:**
1. M-Pesa STK Push API
2. Payment callback handlers
3. Automatic ticket activation
4. Payment confirmation emails

**Changes needed:**
- Update `POST /api/guests/register` to handle immediate payment
- Add payment status polling
- Real-time payment callbacks
- Refund handling

### 6.2 Account Upgrade Path

**For guests who want accounts:**
```
[Guest] → [Upgrade to Account] → [Full User]
```

**Benefits of upgrading:**
- Password login (faster ticket retrieval)
- Edit profile anytime
- View history across events
- Save preferences

**Implementation:**
```
POST /api/guests/:id/upgrade
Body: {password}
Response: {userAccount, message: "Account created!"}
```

### 6.3 Advanced Features

**Waiting List:**
- When GA or Gala sells out
- Capture emails for overflow
- Notify when spots open

**Group Registration:**
- Register multiple people at once
- One person pays for group
- Individual tickets sent to each email

**Social Sharing Incentives:**
- "Share with 3 friends, get gala discount"
- Referral tracking
- Automatic discount codes

---

## Part 7: Questions & Decisions

### 7.1 Critical Questions

**Q1: Should gala tickets require general admission?**
- Option A: Yes, enforce it (recommended)
- Option B: No, allow standalone gala tickets
- **Decision needed**: Can someone attend ONLY gala without summit?

**Q2: How long to keep guest data?**
- Option A: Delete after event + 30 days (privacy)
- Option B: Keep for future events (marketing)
- **Decision needed**: Data retention policy

**Q3: Transfer policy for tickets?**
- Option A: Allow unlimited transfers
- Option B: No transfers (security)
- Option C: One transfer allowed
- **Decision needed**: What's the policy?

**Q4: Check-in device strategy?**
- Option A: Staff phones with web app
- Option B: Dedicated tablets/kiosks
- Option C: Self check-in stations
- **Decision needed**: Hardware plan

### 7.2 Recommended Decisions

Based on typical event patterns:

1. **Gala Policy**: Require general admission first (summit attendees only)
2. **Data Retention**: Keep for 1 year, then anonymize
3. **Transfers**: Allow with email verification (one-time)
4. **Check-in**: Staff phones with offline-capable PWA
5. **Gala Payment**: Manual confirmation for Phase 1, automate in Phase 2

---

## Part 8: Implementation Checklist

### Pre-Launch (Critical)
- [ ] Organization created in Ticketing API
- [ ] Event created with correct dates
- [ ] General Admission ticket type (Free)
- [ ] Gala Night ticket type (1,500 KSH)
- [ ] Email service configured (SendGrid/AWS SES)
- [ ] Guest registration endpoint working
- [ ] Ticket retrieval system working
- [ ] Basic admin dashboard functional
- [ ] Email templates created and tested
- [ ] Test registration flow end-to-end

### Soft Launch (Internal Testing)
- [ ] Staff testing with 10+ test registrations
- [ ] Email deliverability tested (not spam)
- [ ] Ticket QR codes scannable
- [ ] Check-in interface tested
- [ ] Mobile responsiveness verified
- [ ] Load testing (simulate 100 concurrent registrations)

### Public Launch
- [ ] Website updated with registration CTAs
- [ ] Social media announcement
- [ ] Staff trained on check-in process
- [ ] Backup plan for internet outages
- [ ] Support email monitored
- [ ] Analytics dashboard live

### Post-Launch (Ongoing)
- [ ] Daily registration monitoring
- [ ] Gala payment follow-ups (every 3 days)
- [ ] Guest questions/support
- [ ] Weekly registration reports to KNCCI
- [ ] Waitlist management (if applicable)

---

## Part 9: Risk Mitigation

### Potential Issues & Solutions

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Email goes to spam** | High | High | Use SPF/DKIM, transactional email service, clear subject lines |
| **Guests lose tickets** | High | Medium | Easy retrieval system, resend capability, multiple reminders |
| **Internet down at venue** | Medium | High | Offline check-in mode, pre-download tickets, paper backup |
| **Over-registration** | Low | High | Set hard caps, waitlist system, real-time availability |
| **Gala payment confusion** | Medium | Medium | Clear instructions, multiple payment options, follow-up emails |
| **Duplicate registrations** | Medium | Low | Email-based deduplication, merge capability |
| **API downtime** | Low | High | Local caching, graceful degradation, retry logic |

### Backup Plans

**If Ticketing API unavailable:**
1. Use local cache for check-in (last known valid tickets)
2. Manual guest list lookup
3. Paper backup printed daily
4. Form for manual check-in (reconcile later)

**If email service fails:**
1. Show ticket immediately on screen after registration
2. SMS fallback (if phone provided)
3. Manual email resend queue

---

## Summary

### What's Changed (Key Points)

1. **No User Accounts**: Email-only registration, no passwords
2. **Guest-First Design**: Zero friction, maximum conversion
3. **Payments Deferred**: Gala interest tracked, payments handled manually in Phase 1
4. **Email-Centric**: All tickets delivered via email, retrieval via email
5. **Simplified Architecture**: No complex auth, easier to implement

### Timeline (Revised)

- **Week 1**: Organization setup, event/ticket types, backend API
- **Week 2**: Registration flow, email system, ticket retrieval
- **Week 3**: Admin dashboard, check-in interface, testing
- **Week 4**: Soft launch, staff training, public launch
- **Total**: 4 weeks to launch

### Success Metrics

- Registration conversion rate (target: >60% of visitors)
- Email delivery rate (target: >95%)
- Ticket retrieval usage (target: <10% of guests)
- Check-in speed (target: <5 seconds per person)
- Gala payment completion rate (target: >40% of interested)

---

**Next Steps:**
1. Confirm the 4 key decisions in Section 7.1
2. Verify Ticketing API supports email-based purchases
3. Set up email service (SendGrid recommended)
4. Begin Phase 1 implementation

**Questions for you:**
1. Should gala tickets require general admission registration first?
2. How do you want to handle data retention after the event?
3. Do you want to allow ticket transfers between people?
4. What devices will staff use for check-in?
