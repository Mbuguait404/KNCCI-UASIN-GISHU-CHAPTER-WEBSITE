# Event-Sphere Ticketing API Implementation Plan

## Executive Summary

This plan outlines the integration of the Lancola Tech Ticketing API into the Event-Sphere application for the Eldoret International Business Summit 2026. The implementation will transition from static event data to a full-featured ticketing system with user authentication, ticket sales, M-Pesa payments, and check-in capabilities.

---

## Current State Analysis

### Existing Infrastructure
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Express.js + Drizzle ORM + PostgreSQL
- **Storage**: In-memory (MemStorage) - needs migration to persistent storage
- **Current Features**:
  - Event information display (static data)
  - Speaker profiles and schedule
  - Basic registration form
  - Newsletter subscriptions
  - Partnership/sponsorship requests

### Gaps to Address
- No user authentication system
- No ticket purchasing flow
- No payment processing (M-Pesa integration needed)
- No ticket management or validation
- Static event data instead of dynamic API-driven content
- No user accounts or profiles
- No cart/checkout system

---

## Implementation Phases

### Phase 1: Foundation & Authentication (Week 1-2)
**Priority: CRITICAL**

#### 1.1 Database Schema Updates
**File**: `shared/schema.ts`

Add new tables to support ticketing functionality:

```typescript
// Required new tables:
- users (enhance existing) - add email, firstName, lastName, roles, isActive
- organizations - event organizers
- events (migrate from interface to table)
- ticket_types - pricing tiers
- tickets - purchased tickets
- purchases - transaction records
- cart_items - shopping cart
- categories - event categorization
- password_resets - password reset tokens
- refresh_tokens - JWT refresh tokens
```

**Tasks**:
- [ ] Extend users table with ticketing API fields
- [ ] Create organizations table
- [ ] Create events table with geolocation support
- [ ] Create ticket_types table
- [ ] Create tickets table with status tracking
- [ ] Create purchases table with payment status
- [ ] Create cart_items table
- [ ] Create categories table
- [ ] Run database migrations

#### 1.2 Authentication System
**Files**: `server/routes.ts`, `server/auth.ts` (new)

Implement endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login with JWT
- `POST /api/auth/guest` - Guest session creation
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/change-password` - Password change
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

**Tasks**:
- [ ] Create JWT authentication middleware
- [ ] Implement password hashing (bcrypt)
- [ ] Create auth service layer
- [ ] Add role-based access control (RBAC)
- [ ] Create auth context for frontend

#### 1.3 Frontend Auth Components
**Files**: `client/src/components/auth/` (new folder)

Components needed:
- LoginForm.tsx
- RegisterForm.tsx
- ForgotPasswordForm.tsx
- ResetPasswordForm.tsx
- AuthProvider.tsx (context)
- ProtectedRoute.tsx
- useAuth.ts (hook)

**Tasks**:
- [ ] Create authentication forms with validation
- [ ] Implement auth context for state management
- [ ] Add protected route wrapper
- [ ] Create user profile page

---

### Phase 2: Event Management (Week 2-3)
**Priority: HIGH**

#### 2.1 Event API Integration
**Files**: `server/routes.ts`, `server/storage.ts`

Migrate from static data to API-driven events:

Endpoints to implement:
- `GET /api/events` - List events (with filtering)
- `GET /api/events/public` - Public event listing
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (Admin/Agent)
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Soft delete event
- `POST /api/events/:id/restore` - Restore event

**Filter Parameters**:
- title, category, location, date range
- near (geolocation search), radius
- status (draft, published, cancelled, completed)
- isFree, isFeatured

**Tasks**:
- [ ] Create event service layer
- [ ] Implement event CRUD operations
- [ ] Add geolocation search functionality
- [ ] Create event filtering utilities
- [ ] Migrate existing static event data to database

#### 2.2 Event Frontend Components
**Files**: `client/src/components/events/` (new folder)

Components:
- EventList.tsx (with filtering)
- EventCard.tsx
- EventDetail.tsx
- EventForm.tsx (Admin)
- EventMap.tsx (Leaflet integration)

**Tasks**:
- [ ] Create event listing page with filters
- [ ] Build event detail page with ticket purchase CTA
- [ ] Add event map showing location
- [ ] Create admin event management interface

#### 2.3 Categories
**Files**: `server/routes.ts`

Endpoints:
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (Admin)
- `PATCH /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

**Tasks**:
- [ ] Create categories table
- [ ] Seed initial categories
- [ ] Add category filtering to event list

---

### Phase 3: Ticketing System (Week 3-4)
**Priority: CRITICAL**

#### 3.1 Ticket Types Management
**Files**: `server/routes.ts`

Endpoints:
- `GET /api/ticket-types` - List ticket types
- `GET /api/ticket-types/event/:eventId` - Get event ticket types
- `GET /api/ticket-types/event/:eventId/public` - Public ticket types
- `POST /api/ticket-types` - Create ticket type
- `PATCH /api/ticket-types/:id` - Update ticket type
- `DELETE /api/ticket-types/:id` - Delete ticket type
- `POST /api/ticket-types/:id/restore` - Restore ticket type

**Schema**:
```typescript
interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  remaining: number;
  saleStartDate: Date;
  saleEndDate: Date;
  isActive: boolean;
  benefits: string[];
}
```

**Tasks**:
- [ ] Create ticket_types table
- [ ] Implement ticket type CRUD
- [ ] Add inventory tracking
- [ ] Create ticket type selector component

#### 3.2 Cart System
**Files**: `server/routes.ts`, `client/src/components/cart/` (new)

Endpoints:
- `GET /api/cart` - Get current cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item
- `DELETE /api/cart` - Clear cart

**Schema**:
```typescript
interface CartItem {
  id: string;
  userId: string;
  ticketTypeId: string;
  eventId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
```

**Frontend Components**:
- CartContext.tsx
- CartSidebar.tsx
- CartItem.tsx
- AddToCartButton.tsx

**Tasks**:
- [ ] Create cart_items table
- [ ] Implement cart API endpoints
- [ ] Build cart UI components
- [ ] Add cart persistence (localStorage + database)
- [ ] Create "Add to Cart" flow on event pages

#### 3.3 Purchase & Checkout
**Files**: `server/routes.ts`, `client/src/components/checkout/` (new)

Endpoints:
- `POST /api/purchases` - Create purchase
- `GET /api/purchases` - List purchases (Admin)
- `GET /api/purchases/:id` - Get purchase details
- `GET /api/purchases/my-purchases` - User's purchases
- `POST /api/purchases/:id/resend-email` - Resend confirmation

**Schema**:
```typescript
interface Purchase {
  id: string;
  userId: string;
  items: PurchaseItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'mpesa' | 'card' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  completedAt?: Date;
}
```

**Frontend Components**:
- CheckoutPage.tsx
- PurchaseSummary.tsx
- OrderConfirmation.tsx
- MyTickets.tsx

**Tasks**:
- [ ] Create purchases and purchase_items tables
- [ ] Implement checkout flow
- [ ] Generate tickets upon successful purchase
- [ ] Send confirmation emails
- [ ] Create "My Tickets" page

---

### Phase 4: M-Pesa Payment Integration (Week 4-5)
**Priority: CRITICAL**

#### 4.1 Payment API Implementation
**Files**: `server/routes.ts`, `server/payments/` (new folder)

Endpoints:
- `POST /api/payments/mpesa/stk-push` - Initiate payment
- `POST /api/payments/mpesa/callback` - M-Pesa callback handler
- `GET /api/payments/mpesa/status/:checkoutRequestId` - Check status
- `POST /api/payments/mpesa/refund` - Process refund (Admin)

**M-Pesa Integration Requirements**:
- STK Push integration
- Callback URL configuration
- Transaction status polling
- Refund processing

**Tasks**:
- [ ] Set up M-Pesa Daraja API credentials
- [ ] Implement STK Push request
- [ ] Create callback handler endpoint
- [ ] Add transaction status tracking
- [ ] Implement refund functionality
- [ ] Add payment retry logic
- [ ] Create payment webhook handlers

#### 4.2 Payment UI Components
**Files**: `client/src/components/payments/` (new folder)

Components:
- MpesaPaymentForm.tsx
- PaymentStatus.tsx
- PaymentHistory.tsx

**Tasks**:
- [ ] Create M-Pesa payment form (phone number input)
- [ ] Build payment status tracking UI
- [ ] Add payment confirmation modal
- [ ] Implement payment retry interface

---

### Phase 5: Ticket Management & Validation (Week 5-6)
**Priority: HIGH**

#### 5.1 Ticket Management
**Files**: `server/routes.ts`

Endpoints:
- `GET /api/tickets` - List tickets (with filtering)
- `GET /api/tickets/:id` - Get ticket details
- `GET /api/tickets/code/:ticketCode` - Get by ticket code
- `PATCH /api/tickets/:id/status` - Update status (Admin)
- `POST /api/tickets/:id/transfer` - Transfer ticket
- `DELETE /api/tickets/:id/soft` - Soft delete (Admin)
- `DELETE /api/tickets/:id/hard` - Hard delete (Admin)

**Schema**:
```typescript
interface Ticket {
  id: string;
  ticketCode: string;
  purchaseId: string;
  ticketTypeId: string;
  eventId: string;
  userId: string;
  status: 'valid' | 'used' | 'cancelled' | 'refunded' | 'expired' | 'transferred';
  qrCode: string;
  checkedInAt?: Date;
  checkInLocation?: string;
  transferredTo?: string;
  createdAt: Date;
}
```

**Tasks**:
- [ ] Create tickets table with QR code generation
- [ ] Implement ticket filtering and search
- [ ] Add ticket status management
- [ ] Create ticket transfer functionality
- [ ] Generate PDF tickets with QR codes

#### 5.2 Ticket Validation (Scanning)
**Files**: `server/routes.ts`, `client/src/components/scan/` (new folder)

Endpoints:
- `POST /api/tickets/scan` - Validate and check-in ticket

**Ticket Scan Request**:
```json
{
  "ticketCode": "string",
  "checkInLocation": "string (optional)"
}
```

**Frontend Components**:
- TicketScanner.tsx (camera-based QR scanning)
- ScanResult.tsx
- CheckInDashboard.tsx

**Tasks**:
- [ ] Implement QR code scanning (using react-qr-reader)
- [ ] Create check-in validation logic
- [ ] Build scanner interface for agents
- [ ] Add check-in statistics dashboard
- [ ] Implement offline check-in capability

#### 5.3 User Ticket Interface
**Files**: `client/src/components/tickets/` (new folder)

Components:
- TicketCard.tsx
- TicketDetails.tsx
- TransferTicketModal.tsx
- DownloadTicketButton.tsx

**Tasks**:
- [ ] Create ticket display with QR code
- [ ] Add ticket download (PDF) functionality
- [ ] Build ticket transfer UI
- [ ] Implement ticket sharing (social/email)

---

### Phase 6: Organization Management (Week 6-7)
**Priority: MEDIUM**

#### 6.1 Organization System
**Files**: `server/routes.ts`

Endpoints:
- `GET /api/organizations/public` - Public org listing
- `GET /api/organizations/public/:id` - Public org details
- `GET /api/organizations` - List organizations
- `POST /api/organizations` - Create organization
- `PATCH /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id/soft` - Soft delete
- `DELETE /api/organizations/:id/hard` - Hard delete
- `POST /api/organizations/:id/restore` - Restore
- `PATCH /api/organizations/:id/status` - Update status
- `POST /api/organizations/:id/users` - Add user
- `DELETE /api/organizations/:id/users/:userId` - Remove user
- `POST /api/organizations/:id/logo` - Upload logo
- `DELETE /api/organizations/:id/logo` - Delete logo

**Schema**:
```typescript
interface Organization {
  id: string;
  name: string;
  description: string;
  website?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
  status: 'active' | 'inactive' | 'pending_approval' | 'suspended';
  createdAt: Date;
}
```

**Tasks**:
- [ ] Create organizations table
- [ ] Implement organization CRUD
- [ ] Add user-organization associations
- [ ] Create organization approval workflow
- [ ] Add logo upload functionality

#### 6.2 Admin Dashboard
**Files**: `client/src/pages/admin/` (new folder)

Pages:
- AdminDashboard.tsx
- OrganizationManagement.tsx
- UserManagement.tsx
- EventManagement.tsx
- TicketManagement.tsx
- Analytics.tsx

**Tasks**:
- [ ] Create admin dashboard layout
- [ ] Build organization management interface
- [ ] Add user management with role assignment
- [ ] Create analytics and reporting views
- [ ] Add system settings panel

---

### Phase 7: Email Notifications (Week 7)
**Priority: MEDIUM**

#### 7.1 Email System
**Files**: `server/routes.ts`, `server/emails/` (new folder)

Endpoints:
- `POST /api/emails/send` - Send email
- `POST /api/emails/welcome` - Send welcome email
- `POST /api/emails/send-invoice/:recipient` - Send invoice
- `POST /api/emails/reset-password` - Send password reset

**Email Templates**:
- Welcome email
- Ticket purchase confirmation
- Password reset
- Event reminders
- Ticket transfer notification

**Tasks**:
- [ ] Set up email service (SendGrid/AWS SES)
- [ ] Create email template system
- [ ] Implement welcome email on registration
- [ ] Add purchase confirmation emails with tickets
- [ ] Create password reset email flow
- [ ] Add event reminder emails

---

### Phase 8: Tours & Advanced Features (Week 8)
**Priority: LOW**

#### 8.1 Tours (Multi-Event Packages)
**Files**: `server/routes.ts`

Endpoints:
- `GET /api/tours` - List tours
- `POST /api/tours` - Create tour
- `GET /api/tours/:id` - Get tour details
- `GET /api/tours/:id/events` - Get tour events
- `PATCH /api/tours/:id` - Update tour
- `DELETE /api/tours/:id` - Delete tour
- `POST /api/tours/:id/events` - Add events to tour
- `DELETE /api/tours/:id/events` - Remove events from tour

**Tasks**:
- [ ] Create tours table
- [ ] Implement tour CRUD operations
- [ ] Add tour-event associations
- [ ] Create tour ticket packages

#### 8.2 Additional Features
- [ ] Event reviews and ratings
- [ ] Social sharing integration
- [ ] Analytics dashboard enhancements
- [ ] Bulk ticket operations
- [ ] Waitlist functionality

---

## Technical Implementation Details

### API Client Setup
**File**: `client/src/lib/api.ts` (new)

Create centralized API client with:
- Axios instance with base URL configuration
- Request/response interceptors for auth tokens
- Error handling and retry logic
- Type-safe API methods

### State Management
**Files**: `client/src/hooks/`

Custom hooks needed:
- `useAuth.ts` - Authentication state
- `useEvents.ts` - Event data fetching
- `useTickets.ts` - Ticket management
- `useCart.ts` - Shopping cart
- `usePurchases.ts` - Purchase history

### Security Considerations
- JWT token storage (httpOnly cookies preferred)
- CSRF protection
- Rate limiting on auth endpoints
- Input validation with Zod
- SQL injection prevention (Drizzle ORM handles this)
- XSS protection in React components

### Performance Optimizations
- TanStack Query for data caching
- Lazy loading for event images
- Pagination for large datasets
- Debounced search inputs
- Optimistic UI updates

---

## Testing Strategy

### Unit Tests
- API service layer tests
- Component rendering tests
- Utility function tests

### Integration Tests
- Authentication flow tests
- Purchase/checkout flow tests
- Payment processing tests
- Ticket validation tests

### E2E Tests
- Complete user journey tests
- Admin workflow tests
- Mobile responsiveness tests

---

## Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] M-Pesa credentials set up
- [ ] Email service configured
- [ ] SSL certificates in place
- [ ] API rate limiting enabled
- [ ] Error monitoring (Sentry) configured

### Production Deployment
- [ ] Deploy to Vercel
- [ ] Configure production database
- [ ] Set up monitoring and logging
- [ ] Configure CDN for static assets
- [ ] Test payment flows in sandbox
- [ ] Verify email delivery

---

## Success Metrics

- User registration conversion rate
- Ticket purchase completion rate
- Payment success rate
- Average cart value
- Check-in speed and accuracy
- System uptime and performance

---

## Risk Mitigation

| Risk | Mitigation Strategy |
|------|-------------------|
| M-Pesa API downtime | Implement retry logic and fallback payment methods |
| High traffic during peak sales | Use CDN, caching, and scalable infrastructure |
| Data loss | Regular backups and transaction logging |
| Security breaches | JWT tokens, HTTPS, input validation, rate limiting |
| User confusion | Comprehensive documentation and support chat |

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|-----------------|
| Phase 1 | Weeks 1-2 | Authentication, User management |
| Phase 2 | Weeks 2-3 | Event management, Categories |
| Phase 3 | Weeks 3-4 | Ticketing system, Cart, Checkout |
| Phase 4 | Weeks 4-5 | M-Pesa integration |
| Phase 5 | Weeks 5-6 | Ticket validation, QR scanning |
| Phase 6 | Weeks 6-7 | Organization management |
| Phase 7 | Week 7 | Email notifications |
| Phase 8 | Week 8 | Tours, Advanced features |

**Total Duration**: 8 weeks

---

## Next Steps

1. **Immediate (This Week)**:
   - Set up development environment
   - Create database migrations for Phase 1
   - Implement authentication system

2. **Short-term (Next 2 Weeks)**:
   - Complete user authentication
   - Migrate events to database
   - Create basic ticket types

3. **Ongoing**:
   - Daily standups and progress tracking
   - Weekly code reviews
   - Continuous testing and QA

---

*Plan created: February 3, 2026*
*Target completion: April 2026*
