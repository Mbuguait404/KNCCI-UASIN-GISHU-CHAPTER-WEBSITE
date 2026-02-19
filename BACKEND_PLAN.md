# Backend Implementation Plan: Modular NestJS Backend

## 1. Overview
This document outlines the requirements and implementation plan for the migration and expansion of the KNCCI Uasin Gishu Chapter backend to a modular **NestJS** architecture. The primary focus of the initial phase is the **Auth & Profile Management** system.

## 2. Core Technologies
- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens) & Passport.js
- **Validation**: Zod (consistent with current frontend/shared schemas)
- **Documentation**: Swagger (OpenAPI)

## 3. Modular Architecture
The backend will be structured into independent modules to ensure scalability and maintainability:

```text
src/
├── app.module.ts          # Main entry point, orchestrates module imports
├── main.ts               # Bootstrap logic
├── modules/
│   ├── auth/             # Login, Registration, JWT logic
│   ├── users/            # Personal profile management
│   ├── business/         # Business profile management
│   ├── events/           # Event management (Future)
│   ├── marketplace/      # Marketplace logic (Future)
│   └── common/           # Shared guards, decorators, and filters
└── database/
    ├── database.module.ts # Mongoose connection provider
    └── schemas/          # Mongoose schema definitions
```

---

## 4. Requirements: Auth & Profile Module

### 4.1 Functional Requirements
1.  **Authentication**:
    - Secure login for members.
    - Password hashing (Bcrypt).
    - JWT-based session management.
2.  **Profile Management**:
    - Members can view and update their personal details.
    - Members can manage their business profile details.
3.  **Role-Based Access Control (RBAC)**:
    - Basic Member vs Admin access.

### 4.2 Data Models (Collections)

#### **Users Collection (Personal Profile)**
| Field Name | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `email` | String | Unique, used for login |
| `password` | String | Hashed password |
| `name` | String | Full name |
| `phone` | String | Optional phone number |
| `reg_no` | String | Member Registration Number (Unique) |
| `role` | String | 'member' | 'admin' |
| `createdAt` | Date | Record creation timestamp |

#### **Business Profiles Collection**
| Field Name | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `userId` | ObjectId | Reference to Users Collection |
| `name` | String | Business Name |
| `category` | String | Industry category |
| `email` | String | Business contact email |
| `phone` | String | Business contact phone |
| `location` | String | Physical/Postal address |
| `plan` | String | Membership plan (e.g., Bronze, Silver, Gold) |
| `website` | String | Optional URL |
| `description`| String | About the business |
| `services` | [String] | List of services offered |
| `kra_pin` | String | Optional (Advanced) |
| `company_reg_no`| String| Optional (Advanced) |
| `business_permit`| String| Optional (Advanced) |

---

## 5. Implementation Roadmap

### Phase 1: Foundation
1.  **NestJS Setup**: Initialize the project structure using `@nestjs/cli`.
2.  **Database Integration**: Configure Mongoose module with MongoDB connection string.
3.  **App Modularization**: Create the `DatabaseModule` and shared schema decorators.

### Phase 2: Auth Module
1.  **Authentication Logic**: Implement `AuthService` and `AuthController`.
2.  **Passport Strategies**: Setup `LocalStrategy` (for login) and `JwtStrategy` (for protected routes).
3.  **DTOs & Validation**: Define Zod-based DTOs or Mongoose schemas for validation.

### Phase 3: Profile Module (Users & Business)
1.  **Personal Profile**: Endpoints for `GET /profile` and `PATCH /profile`.
2.  **Business Profile**: Endpoints for `GET /business` and `PUT /business`.
3.  **Ref Linking**: Ensure proper population of business documents linked to users.

### Phase 4: Polish & Docs
1.  **Swagger UI**: Auto-generate API documentation for frontend developers.
2.  **Error Handling**: Global exception filter for consistent API responses.

---

## 6. Next Steps
1.  Initialize NestJS project in a new `backend/` or `server-nestjs/` directory.
2.  Define Mongoose schemas based on the current requirements.
3.  Implement the Auth controller as the first modular feature.
