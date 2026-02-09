# Ticketing API Documentation

**Base URL:** `https://ticketing.lancolatech.co.ke/api`

**OpenAPI Version:** 3.0.0

## Overview

This is a comprehensive Event Ticketing and Management API that provides functionality for:
- User authentication and management
- Event creation and management
- Ticket sales and validation
- Organization management
- Email notifications
- Payment processing

## Authentication

The API uses **Bearer Token Authentication** (JWT). Most endpoints require authentication via the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

- **admin** - Full system access
- **agent** - Organization-level access for event management
- **customer** - Standard user access for purchasing tickets

## API Endpoints by Category

### 1. Authentication

Base path: `/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Log in a user | No |
| POST | `/auth/guest` | Create a temporary guest session | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Log out the current user | Yes |
| GET | `/auth/profile` | Get current user profile | Yes |
| PUT | `/auth/change-password` | Change current user password | Yes |
| POST | `/auth/forgot-password` | Initiate forgot password process | No |
| POST | `/auth/reset-password` | Reset password using a token | No |
| POST | `/auth/register-admin` | Register a new admin user | Yes (Admin) |

### 2. Users

Base path: `/users`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users with pagination and filtering | Yes (Admin) |
| POST | `/users` | Create a new user | Yes (Admin) |
| GET | `/users/me` | Get the current authenticated user's profile | Yes |
| GET | `/users/{id}` | Get a single user by ID | Yes (Admin) |
| PATCH | `/users/{id}` | Update a user's profile | Yes |
| DELETE | `/users/{id}/soft` | Soft delete a user | Yes (Admin) |
| DELETE | `/users/{id}/hard` | Permanently delete a user | Yes (Admin) |
| POST | `/users/{id}/restore` | Restore a soft-deleted user | Yes (Admin) |
| PATCH | `/users/{id}/roles` | Assign roles to a user | Yes (Admin) |

**Filter Parameters for GET /users:**
- `firstName` - Filter by first name (partial match)
- `lastName` - Filter by last name (partial match)
- `email` - Filter by email (partial match)
- `roles` - Filter by roles (admin, agent, customer)
- `organizationId` - Filter by organization ID
- `isActive` - Filter by active status
- `isVerified` - Filter by verified status
- `includeDeleted` - Include soft-deleted users
- `page`, `limit` - Pagination
- `sortBy`, `sortDirection` - Sorting
- `createdAtGte`, `createdAtLte` - Date range filtering

### 3. Events

Base path: `/events`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/events` | Create a new event | Yes |
| GET | `/events` | Get all events for organization | Yes |
| GET | `/events/public` | Get all public events | Yes (Optional) |
| GET | `/events/public/{id}` | Get a single public event by ID | Yes (Optional) |
| GET | `/events/admin/all` | Get all events across all organizations | Yes (Admin) |
| GET | `/events/{id}` | Get an event by ID | Yes |
| PATCH | `/events/{id}` | Update an event | Yes |
| DELETE | `/events/{id}` | Soft delete an event | Yes |
| DELETE | `/events/{id}/hard` | Permanently delete an event | Yes (Admin) |
| POST | `/events/{id}/restore` | Restore a soft-deleted event | Yes |

**Event Filter Parameters:**
- `title` - Filter by event title (case-insensitive)
- `slug` - Filter by event slug
- `category` - Filter by category
- `locationName` - Filter by venue name
- `locationCity` - Filter by city
- `organizationId` - Filter by organization
- `tourId` - Filter by tour ID
- `near` - Find events near a location (e.g., "Nairobi")
- `radius` - Search radius in km (default: 10km)
- `status` - Filter by status (draft, published, cancelled, completed)
- `isFree` - Filter free events
- `isFeatured` - Filter featured events
- `ageRestriction` - Filter by age restriction (GA, 18+, 23+, 25+)
- `startDateTimeGte/Lte` - Date range filters
- `page`, `limit` - Pagination
- `sortBy`, `sortDirection` - Sorting

### 4. Tickets

Base path: `/tickets`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tickets` | Get all tickets with pagination and filtering | Yes |
| GET | `/tickets/{id}` | Get a ticket by ID | Yes |
| GET | `/tickets/code/{ticketCode}` | Get a ticket by its unique code | Yes |
| PATCH | `/tickets/{id}/status` | Update ticket status | Yes (Admin) |
| POST | `/tickets/scan` | Record a ticket scan (check-in) | Yes |
| POST | `/tickets/{id}/transfer` | Transfer ownership of a ticket | Yes |
| DELETE | `/tickets/{id}/soft` | Soft delete a ticket | Yes (Admin) |
| DELETE | `/tickets/{id}/hard` | Permanently delete a ticket | Yes (Admin) |

**Ticket Status Values:**
- `valid` - Ticket is valid for entry
- `used` - Ticket has been scanned/used
- `cancelled` - Ticket was cancelled
- `refunded` - Ticket was refunded
- `expired` - Ticket has expired
- `transferred` - Ticket ownership was transferred

**Ticket Scan Request Body:**
```json
{
  "ticketCode": "string",
  "checkInLocation": "string (optional)"
}
```

### 5. Organizations

Base path: `/organizations`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/organizations/public` | Get all organizations (public) | Optional |
| GET | `/organizations/public/{id}` | Get organization by ID (public) | Optional |
| POST | `/organizations` | Create a new organization | Yes |
| GET | `/organizations` | Get all organizations | Yes |
| GET | `/organizations/{id}` | Get organization by ID | Yes |
| PATCH | `/organizations/{id}` | Update organization | Yes |
| DELETE | `/organizations/{id}/soft` | Soft delete organization | Yes |
| DELETE | `/organizations/{id}/hard` | Permanently delete organization | Yes |
| POST | `/organizations/{id}/restore` | Restore organization | Yes |
| PATCH | `/organizations/{id}/status` | Update organization status | Yes (Admin) |
| POST | `/organizations/{id}/users` | Add user to organization | Yes |
| DELETE | `/organizations/{id}/users/{userId}` | Remove user from organization | Yes |
| POST | `/organizations/{id}/logo` | Upload organization logo | Yes |
| DELETE | `/organizations/{id}/logo` | Delete organization logo | Yes |

**Organization Status Values:**
- `active`
- `inactive`
- `pending_approval`
- `suspended`

### 6. Ticket Types

Base path: `/ticket-types`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/ticket-types` | Create ticket type for event | Yes |
| GET | `/ticket-types` | Get all ticket types | Yes |
| GET | `/ticket-types/{id}` | Get ticket type by ID | Yes |
| PATCH | `/ticket-types/{id}` | Update ticket type | Yes |
| DELETE | `/ticket-types/{id}` | Delete ticket type | Yes |
| POST | `/ticket-types/{id}/restore` | Restore ticket type | Yes |
| GET | `/ticket-types/event/{eventId}` | Get ticket types for event | Yes |
| GET | `/ticket-types/event/{eventId}/public` | Get public ticket types for event | Optional |

### 7. Tours

Base path: `/tours`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/tours` | Create a new tour | Yes |
| GET | `/tours` | Get all tours | Yes |
| GET | `/tours/{id}` | Get tour by ID | Yes |
| GET | `/tours/{id}/events` | Get events for a tour | Yes |
| PATCH | `/tours/{id}` | Update a tour | Yes |
| DELETE | `/tours/{id}` | Delete a tour | Yes |
| DELETE | `/tours/{id}/hard` | Permanently delete tour | Yes (Admin) |
| POST | `/tours/{id}/restore` | Restore a tour | Yes |
| POST | `/tours/{id}/events` | Add events to tour | Yes |
| DELETE | `/tours/{id}/events` | Remove events from tour | Yes |

### 8. Categories

Base path: `/categories`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/categories` | Create category | Yes |
| GET | `/categories` | Get all categories | Optional |
| GET | `/categories/{id}` | Get category by ID | Optional |
| PATCH | `/categories/{id}` | Update category | Yes |
| DELETE | `/categories/{id}` | Delete category | Yes |
| DELETE | `/categories/{id}/hard` | Permanently delete category | Yes (Admin) |
| POST | `/categories/{id}/restore` | Restore category | Yes |

### 9. Purchases & Cart

Base paths: `/purchases`, `/cart`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/purchases` | Create a new purchase | Yes |
| GET | `/purchases` | Get all purchases | Yes |
| GET | `/purchases/{id}` | Get purchase by ID | Yes |
| GET | `/purchases/my-purchases` | Get my purchases | Yes |
| POST | `/purchases/{id}/resend-email` | Resend purchase email | Yes |
| GET | `/cart` | Get current user's cart | Yes |
| POST | `/cart` | Add item to cart | Yes |
| PUT | `/cart/{itemId}` | Update cart item | Yes |
| DELETE | `/cart/{itemId}` | Remove item from cart | Yes |
| DELETE | `/cart` | Clear cart | Yes |
| POST | `/cart/checkout` | Checkout cart | Yes |

### 10. Payments (M-Pesa)

Base path: `/payments/mpesa`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/payments/mpesa/stk-push` | Initiate M-Pesa STK Push | Yes |
| POST | `/payments/mpesa/callback` | M-Pesa Callback URL | No |
| GET | `/payments/mpesa/status/{checkoutRequestId}` | Query payment status | Yes |
| POST | `/payments/mpesa/refund` | Refund M-Pesa payment | Yes (Admin) |

### 11. Emails

Base path: `/emails`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/emails/send` | Send email | Yes |
| POST | `/emails/welcome` | Send welcome email | Yes |
| POST | `/emails/send-invoice/{recipient}` | Send invoice email | Yes |
| POST | `/emails/reset-password` | Send password reset email | Yes |

### 12. Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check endpoint | No |

## Common Response Schemas

### PaginatedResponseDto

Most list endpoints return paginated responses:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### AuthResponseDto

Authentication responses include:

```json
{
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "roles": ["customer"],
    "isActive": true
  },
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

## HTTP Status Codes

- **200** - Success
- **201** - Created
- **204** - No Content (successful deletion)
- **400** - Bad Request (invalid input)
- **401** - Unauthorized (authentication required)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **409** - Conflict (duplicate data)

## Rate Limiting

API requests may be rate-limited. Check response headers for rate limit information:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Notes

1. All date/time fields use ISO 8601 format (e.g., `2023-12-31T23:59:59Z`)
2. Soft-deleted records can be restored using the appropriate restore endpoints
3. Hard-deleted records are permanently removed and cannot be recovered
4. File uploads (like logos) typically use multipart/form-data content type
5. The API supports CORS for cross-origin requests

---

*Documentation generated from Swagger/OpenAPI specification*
*Date: February 2, 2026*
