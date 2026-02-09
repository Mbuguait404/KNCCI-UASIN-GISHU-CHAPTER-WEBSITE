# Event-Sphere Website Implementation Plan
## Website-Only Scope (No Admin Features)

---

## **SCOPE BOUNDARY - What's Included**

### ✅ **IN SCOPE (Website Only):**
1. Public website registration flow
2. Ticket generation via Ticketing API
3. Email ticket delivery to users
4. "My Tickets" page for users to view/download tickets
5. Ticket retrieval page (for lost emails)
6. Gala payment instructions page (user-facing)
7. Public event information display

### ❌ **OUT OF SCOPE (Handled Separately):**
1. Admin dashboard
2. Admin user management
3. Payment confirmation interface
4. Check-in/scanning system
5. Guest management tools
6. Analytics/reports for organizers
7. Export functionality
8. Admin authentication

---

## **Website Features to Build**

### **1. Event Information Display (Homepage Updates)**

**Changes to existing homepage:**
- Add "Register Now" CTA button
- Show ticket availability status
- Display registration count (optional)

**No changes to:**
- Existing schedule section
- Existing speaker section
- Existing partner section

---

### **2. Registration Modal**

**Location:** Opens from "Register Now" buttons on site

**Form Fields:**
- Email (required)
- First Name (required)
- Last Name (required)
- Phone (optional)

**Ticket Selection:**
- Checkbox: General Admission (FREE) - always selected
- Checkbox: Gala Night (1,500 KSH) - optional

**Behavior:**
- If gala selected, show "Payment instructions will be sent via email"
- Validate email not already registered
- Submit to backend API

---

### **3. Registration Success Page**

**Shows:**
- Confirmation message
- Ticket details with QR code
- Download ticket button
- "My Tickets" page link
- Add to calendar button
- Share event button

**Note:** Gala ticket shows "Payment Pending" status if selected

---

### **4. My Tickets Page**

**URL:** `/my-tickets`

**Features:**
- View all tickets for user's email
- Display QR codes
- Download PDF tickets
- Resend tickets to email
- View gala payment status
- Link to payment instructions (if gala selected)

**Access:** Via unique token in URL (from registration email) or email input

---

### **5. Ticket Retrieval Page**

**URL:** `/retrieve-tickets`

**Features:**
- Email input to find tickets
- Ticket code search (optional)
- Display found tickets
- Links to My Tickets page

**Purpose:** For users who lost their registration email

---

### **6. Gala Payment Instructions Page**

**URL:** `/gala-payment/:ticketCode`

**Shows:**
- Payment amount (1,500 KSH)
- M-Pesa paybill instructions
- Bank transfer details (if applicable)
- Pay at venue option
- Note: "Your ticket will be activated after payment is confirmed"

**Note:** This is INFORMATION ONLY. No payment processing on website.

---

## **Backend APIs (Website-Only)**

### **Public APIs (No Authentication Required)**

```
POST /api/register
  Body: {
    email,
    firstName,
    lastName,
    phone,
    includeGala: boolean
  }
  Response: {
    success,
    guestId,
    tickets: [
      {code, type, status, qrCode, pdfUrl}
    ],
    myTicketsUrl
  }
  
  Action: 
  - Validate input
  - Call Ticketing API to create tickets
  - Store guest info locally
  - Send email with tickets
  - Return ticket details

POST /api/retrieve-tickets
  Body: {email}
  Response: {
    success,
    guest: {name, email},
    tickets: [
      {code, type, status, qrCode, pdfUrl}
    ]
  }
  
  Action:
  - Lookup guest by email
  - Fetch tickets from local DB
  - Return ticket details

GET /api/tickets/:ticketCode
  Response: {
    ticketCode,
    guestName,
    type,
    status,
    eventInfo
  }
  
  Action:
  - Validate ticket exists
  - Return public ticket info (for verification)
```

---

## **Database Schema (Website-Only)**

### **Tables:**

```sql
-- Guest registrations
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  registered_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Tickets (local cache)
CREATE TABLE guest_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id),
  api_ticket_id VARCHAR(255), -- From Ticketing API
  ticket_code VARCHAR(50) UNIQUE NOT NULL,
  ticket_type VARCHAR(50) NOT NULL, -- 'general' or 'gala'
  status VARCHAR(50) DEFAULT 'confirmed', -- 'confirmed' or 'pending_payment'
  qr_code_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**No admin tables needed** (handled separately)

---

## **Email Templates (Website-Only)**

### **1. Registration Confirmation Email**
**Sent:** Immediately after registration

**Includes:**
- Welcome message
- Ticket QR codes
- Ticket codes
- Event details (dates, venue)
- Link to My Tickets page
- Add to calendar button

**Template:**
```
Subject: Your Tickets - Eldoret International Business Summit 2026

Hi {firstName},

Thank you for registering! Here are your tickets:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎫 GENERAL ADMISSION (FREE)
Ticket Code: {ticketCode}
Date: July 15-17, 2026

[QR CODE IMAGE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{if galaSelected}
✨ GALA NIGHT - PAYMENT PENDING
Ticket Code: {galaTicketCode}
Amount Due: 1,500 KSH
Date: July 16, 2026 (6PM-11PM)

Complete payment: {paymentUrl}
Payment instructions have been included below.
{endif}

📅 Add to Calendar: {calendarLink}
📱 View Your Tickets: {myTicketsUrl}

See you at the summit!
KNCCI Uasin Gishu Team
```

### **2. Gala Payment Instructions Email**
**Sent:** If user selected gala interest

**Includes:**
- M-Pesa paybill details
- Account number (ticket code)
- Amount (1,500 KSH)
- Alternative payment methods
- Link to payment instructions page

**Template:**
```
Subject: Complete Your Gala Night Payment - 1,500 KSH

Hi {firstName},

You've selected the Gala Night option. To complete your registration:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 PAYMENT OPTIONS

Option 1: M-Pesa
• Paybill Number: {paybillNumber}
• Account Number: {ticketCode}
• Amount: 1,500 KSH

Option 2: Pay at Venue
• Visit the registration desk during the summit
• Pay cash or card: 1,500 KSH

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Complete details: {paymentUrl}

Your ticket will be activated once payment is confirmed.

Questions? Contact us at events@kncci-uasingishu.co.ke
```

### **3. Ticket Retrieval Email**
**Sent:** When user requests ticket resend

**Includes:**
- All tickets for the email
- My Tickets page link
- Contact support info

---

## **3-Week Implementation Timeline**

### **Week 1: Backend Setup**

**Day 1-2:**
- [ ] Get Ticketing API credentials
- [ ] Create organization in Ticketing API
- [ ] Create event with 2 ticket types (GA free, Gala 1,500)
- [ ] Set up database schema (guests, guest_tickets)

**Day 3-4:**
- [ ] Build `/api/register` endpoint
- [ ] Integrate with Ticketing API
- [ ] Test ticket creation

**Day 5:**
- [ ] Set up email service
- [ ] Create email templates
- [ ] Test email delivery

### **Week 2: Frontend Implementation**

**Day 6-7:**
- [ ] Build registration modal component
- [ ] Add to homepage CTA buttons
- [ ] Form validation

**Day 8-9:**
- [ ] Build registration success page
- [ ] Ticket display with QR codes
- [ ] Download ticket functionality

**Day 10:**
- [ ] Build My Tickets page (`/my-tickets`)
- [ ] Token-based access system
- [ ] Resend tickets feature

### **Week 3: Completion & Testing**

**Day 11-12:**
- [ ] Build Ticket Retrieval page (`/retrieve-tickets`)
- [ ] Email-based ticket lookup
- [ ] Build Gala Payment Instructions page

**Day 13-14:**
- [ ] End-to-end testing
- [ ] Mobile responsiveness check
- [ ] Email deliverability testing

**Day 15:**
- [ ] Bug fixes
- [ ] Soft launch with test users
- [ ] Public launch

---

## **Technical Requirements**

### **Dependencies:**
1. **Ticketing API Access**
   - Organization credentials
   - API endpoint: `https://ticketing.lancolatech.co.ke/api`
   - Endpoints needed:
     - `POST /purchases` - Create tickets
     - `GET /ticket-types/event/{eventId}/public` - Get ticket types

2. **Email Service**
   - Provider: SendGrid or AWS SES
   - Domain: Need sending domain setup
   - SPF/DKIM records configured

3. **File Storage (Optional)**
   - For storing PDF tickets
   - Or use Ticketing API to generate on-demand

### **Environment Variables:**
```
TICKETING_API_URL=https://ticketing.lancolatech.co.ke/api
TICKETING_API_TOKEN={organization_token}
TICKETING_ORGANIZATION_ID={org_id}
TICKETING_EVENT_ID={event_id}

EMAIL_SERVICE_API_KEY={sendgrid_or_ses_key}
EMAIL_FROM=events@kncci-uasingishu.co.ke

DATABASE_URL={postgres_connection_string}
```

---

## **Flow Summary**

### **User Journey (Complete):**

1. **Visitor arrives at website**
   → Sees event info + "Register Now" button

2. **Clicks Register**
   → Modal opens with form

3. **Fills form + submits**
   → API creates guest + tickets in Ticketing API
   → Email sent with tickets
   → Success page shown

4. **Receives email**
   → Has QR codes + ticket codes
   → Can click to "My Tickets" page

5. **If gala selected:**
   → Email includes payment instructions
   → User can visit payment instructions page
   → User pays via M-Pesa/bank/cash (offline)
   → Admin confirms payment (separate admin system)
   → User's ticket activated ( reflected on My Tickets page via API)

6. **Loses email?**
   → Visits `/retrieve-tickets`
   → Enters email
   → Gets tickets resent

7. **At event:**
   → Shows QR code from email or My Tickets page
   → Staff scans with mobile app (separate system)

---

## **What We Need to Start**

### **From You:**

1. **Ticketing API Credentials**
   - When can we get organization token?
   - Who provides this? (Lancola Tech?)

2. **Event Details**
   - Confirm dates: July 15-17, 2026?
   - Gala date/time: July 16, 6PM-11PM?
   - Capacity limits: GA 2,000, Gala 500?

3. **Payment Details (for instructions)**
   - M-Pesa Paybill number to show users
   - Bank account details (if applicable)

4. **Email Setup**
   - Email service provider preference
   - Sending domain (events@kncci-uasingishu.co.ke?)
   - SPF/DKIM setup needed?

5. **Integration**
   - Where to place "Register Now" buttons on current site?
   - Header? Hero section? Multiple locations?

### **From Lancola Tech (Ticketing API):**

1. Organization credentials
2. API documentation confirmation
3. Sandbox environment for testing

---

## **Next Steps**

**To begin implementation:**

1. **Get Ticketing API credentials** - Priority #1
2. **Set up email service** - Can be done in parallel
3. **Confirm event details** - Dates, capacity, pricing
4. **Get M-Pesa paybill number** - For payment instructions

**Once we have credentials:**
- Day 1: Set up organization and event
- Day 2: Build registration API
- Day 3: Build frontend modal
- Continue with timeline above

---

## **Questions**

1. **When can we get the Ticketing API credentials?** (This is the blocker)
2. **Email service preference:** SendGrid, AWS SES, or other?
3. **M-Pesa paybill number** to show in payment instructions?
4. **Placement of "Register Now" button** on current homepage?

**Ready to start once we have API access.**
