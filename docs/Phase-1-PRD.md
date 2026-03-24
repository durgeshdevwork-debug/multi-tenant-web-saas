# Phase 1 PRD – Multi‑Tenant Website Content Management Portal

## 1. Overview

This document defines the Phase 1 Product Requirements for a multi‑tenant website content management portal that allows an admin to onboard client accounts, configure website templates and modules, and provide each client with a dedicated portal to manage their own site content (blogs, services, pages, etc.). The platform will expose read‑only APIs secured with per‑tenant API keys so separate Next.js website templates can render content for multiple clients from a shared backend. The implementation will use the MERN stack with TypeScript across frontend and backend, Tailwind CSS and shadcn/ui for styling, Mongoose as the ORM, React Query for client data fetching, AWS for image storage, and Brevo SMTP for transactional emails.

## 2. Goals and Non‑Goals (Phase 1)

### 2.1 Primary Goals

- Provide a working foundation of the portal with authentication(use better-auth authentication framework or package), role‑based access (Admin, User), and a basic dashboard for both roles.
- Enable the admin to create and manage client accounts, assign templates and modules, and auto‑generate per‑tenant API keys.
- Enable each user (client) to log in and manage their own site data according to the selected template and modules.
- Expose secure, documented REST APIs to fetch website content by API key for consumption by separate Next.js website templates.
- Set up image handling with AWS (e.g., S3) for uploads from the portal and public delivery to website templates.
- Integrate Brevo SMTP for sending account creation and credential emails to users.

### 2.2 Non‑Goals (Future Phases)

- Advanced CMS features such as content versioning, draft/publish workflows, and scheduled publishing.
- Multi‑language/i18n support for content.
- Payment/billing, subscription management, or self‑serve signup.
- Granular permissions within a tenant (e.g., multiple roles under one client).
- Visual page builders or drag‑and‑drop landing page editors.
- Analytics dashboards (traffic, SEO, performance) within the portal.

## 3. Personas and Roles

### 3.1 Admin (Platform Owner)

- Owns the platform and has full access to all tenants (client websites) and their data.
- Creates and manages templates (definition of which modules/pages a site has).
- Creates and manages client accounts (users) and associates them with templates and allowed modules.
- Generates and rotates API keys per client.
- Can impersonate or view a client’s site data for debugging/support.

### 3.2 User (Client)

- Receives credentials from the admin via email after account creation.
- Logs into the portal and sees only their own site data and configuration.
- Manages content for the modules enabled for their template (e.g., Landing, About, Services, Blog, Contact, etc.).
- Can upload images for their content (stored on AWS).
- Cannot see or manage other clients’ data, templates, or platform‑level settings.

Roles are mutually exclusive in Phase 1 and assigned at account creation time.

## 4. High‑Level Architecture (Phase 1)

### 4.1 Components

- **Backend API (Node.js/Express + TypeScript)**
  - REST API layer for admin and user operations.
  - Authentication(better-auth), authorization, and multi‑tenant data isolation.
  - Mongoose models for Users, Tenants/Websites, Templates, Modules, and Content entities.
  - Integration with AWS SDK for image upload.
  - Integration with Brevo SMTP for transactional emails.

- **Admin & User Portal (React + TypeScript)**
  - Single SPA (or two separate apps) with role‑based routing and UI.
  - React Query for data fetching and caching from the backend APIs.
  - Tailwind CSS + shadcn/ui for UI components and theming.

- **Website Templates (Next.js + TypeScript)**
  - Separate Next.js apps that render public‑facing websites.
  - Consume read‑only REST APIs using the tenant’s API key.
  - In Phase 1, at least one production‑ready template (e.g., a basic business site with Landing, About, Services, Blog, Contact).

- **Storage & Infrastructure**
  - MongoDB for all structured data using Mongoose.
  - AWS S3 (or similar) for image storage.
  - Environment config for Brevo SMTP, DB URI, JWT secrets, AWS credentials, etc.

### 4.2 Tenancy Model

- Single shared database with tenant scoping via a Website/Tenant identifier on content records.
- All user‑level operations are automatically filtered by the user’s tenant.
- Admin operations may access cross‑tenant data but always require admin role.

## 5. User Flows (Phase 1)

### 5.1 Admin – Onboard New Client

1. Admin logs into the portal.
2. Navigates to "Clients" section and clicks "Create Client".
3. Fills in required information: client name, primary domain (optional for Phase 1 routing), business details, contact email.
4. Selects a template (e.g., Business Basic) from available templates.
5. Selects which modules are enabled for this client (e.g., Landing, About, Services, Blog, Contact).
6. Submits the form.
7. Backend creates:
   - Tenant/Website record.
   - User record (role = User) linked to the tenant.
   - Generated secure API key for the tenant.
   - Default content documents for each enabled module using template schema defaults.
8. Backend sends an email via Brevo to the client with login URL, email, and temporary password (or magic‑link in later phases).
9. Admin can see the new client appear in the client list with status "Pending first login".

### 5.2 User – First Login and Content Management

1. User clicks the link in the email and opens the portal.
2. Logs in using the credentials provided.
3. On first login, user is forced to change the password (optional for Phase 1; can be deferred if needed).
4. User lands on a simple dashboard showing their site name, template, and enabled modules.
5. User navigates to a specific module (e.g., Services):
   - Sees a list/table of existing items or a simple form for static sections (e.g., About).
6. User edits content (e.g., service title, description, price, images) and saves changes.
7. Portal calls the backend API, which validates data, stores it, and returns updated objects.
8. The Next.js template site consumes the updated data via API and shows new content.

### 5.3 Admin – View/Manage Existing Client

1. Admin logs in and opens the "Clients" list.
2. Selects a client to view details.
3. Admin can see:
   - Basic client info and status.
   - Assigned template and enabled modules.
   - API key (partially masked) with ability to regenerate.
4. Admin can:
   - Update client details (business info, status, domain).
   - Enable or disable modules (respecting schema constraints).
   - Regenerate API key (with confirmation and warning).
   - View a read‑only preview of the client’s content per module (Phase 1 may implement minimal read‑only view).

## 6. Functional Requirements (Phase 1)

### 6.1 Authentication & Authorization

- Email/password login for both Admin and User.
- JWT‑based auth (access token + refresh token) or standard stateless token strategy.
- Role stored on user record and enforced on every API route via middleware.
- Passwords hashed with a secure algorithm.
- Basic rate limiting for auth endpoints (optional but recommended).

### 6.2 Admin Features

#### 6.2.1 Admin Login & Dashboard

- Admin can log in via a same login with role‑based redirect.
- Admin dashboard shows key stats:
  - Number of clients.
  - Number of active/inactive sites.
  - Quick links to "Create Client", "Templates", and "Clients list".

#### 6.2.2 Template Management (Phase 1 Scope)

- Admin can define a minimal set of templates in the database:
  - Example: `business_basic`, `landing_only`.
- Each template defines:
  - Template name and identifier.
  - Modules (e.g., `landing`, `about`, `services`, `blog`, `contact`).
- For Phase 1, template management UI can be minimal or partially seed‑based:
  - Acceptable: Pre‑seed template records via script or admin UI for create/list only.

#### 6.2.3 Client Management

- Admin can:
  - Create new client with required details and assign a template and modules.
  - View list of all clients with filters (by status, template, created date).
  - View client detail page.
  - Edit client basic info.
  - Regenerate API key.
- Client creation triggers:
  - User record creation with role `user` and association to the new tenant.
  - API key generation and persistence.
  - Default content creation per enabled module.
  - Email sending using Brevo with credentials.

### 6.3 User Features

#### 6.3.1 User Login & Dashboard

- User logs in with email and password.
- Role‑based redirect to user dashboard.
- Dashboard contains:
  - Site name and template name.
  - Enabled modules as navigation items/cards.

#### 6.3.2 Module‑Based Content Management

Phase 1 modules and behavior:

- **Landing**
  - Content fields: hero title, hero subtitle, hero image, primary CTA text and URL, highlight sections (title + description).
  - Single document per tenant.

- **About**
  - Content fields: heading, rich text description (plain text or basic HTML/Markdown), team section toggle, team members (name, role, photo) – team members list can be optional in Phase 1.
  - Single document per tenant.

- **Services**
  - Repeating collection of services.
  - Fields: title, short description, icon or image, price or label, isActive flag.

- **Blog** (optional but recommended in Phase 1)
  - Collection of posts.
  - Fields: title, slug, excerpt, body (text/HTML), cover image URL, publishedAt, isPublished.
  - Basic CRUD for posts.

- **Contact**
  - Content fields for static contact page: address, phone, email, contact form intro text.
  - API endpoint for public contact form submission can be deferred or implemented minimally.

For each enabled module, the user can:

- View a list (for collections) or a form (for singletons).
- Create, read, update, and soft delete items where applicable.
- Upload images (hero image, service image, blog cover) using AWS integration.

### 6.4 API Key and Public Content APIs

#### 6.4.1 API Key Management

- Each tenant has a unique API key stored securely (hashed or at least partially masked in UI).
- Admin can view truncated key and regenerate with confirmation.
- Rotating the key invalidates previous key for future requests.

#### 6.4.2 Public Content APIs (Read‑Only)

Endpoints (base path example: `/api/public`):

- `GET /api/public/:apiKey/site` – returns high‑level site info and enabled modules.
- `GET /api/public/:apiKey/landing` – returns landing page content.
- `GET /api/public/:apiKey/about` – returns about page content.
- `GET /api/public/:apiKey/services` – returns list of services.
- `GET /api/public/:apiKey/blog` – returns list of published blog posts.
- `GET /api/public/:apiKey/blog/:slug` – returns one blog post by slug.
- `GET /api/public/:apiKey/contact` – returns contact page data.

Behavior:

- API key is passed as a path param or header (for Phase 1, path param is acceptable; later can move to headers).
- All responses are scoped to the tenant associated with the API key.
- Rate limiting can be minimal to start and improved later.

## 7. Data Model (Initial Draft)

### 7.1 Core Entities (Mongoose Models)

- **User**
  - `_id`
  - `email`
  - `passwordHash`
  - `role` (`admin` | `user`)
  - `tenantId` (nullable for admin)
  - `isActive`
  - `createdAt`, `updatedAt`

- **Tenant / Website**
  - `_id`
  - `name`
  - `slug` or unique identifier
  - `primaryDomain` (optional in Phase 1)
  - `templateId`
  - `apiKey` (or `apiKeyHash`)
  - `status` (`active`, `inactive`, `pending`)
  - `businessDetails` (object with name, address, etc.)
  - `createdAt`, `updatedAt`

- **Template**
  - `_id`
  - `name`
  - `identifier` (e.g., `business_basic`)
  - `modules` (array of module identifiers)
  - `createdAt`, `updatedAt`

- **Module Config** (optional for Phase 1, can be hard‑coded in code)
  - For dynamic schema generation per template, module configs may be defined in code instead of a collection to simplify Phase 1.

- **Content Schemas Per Module**
  - `LandingContent`
    - `tenantId`
    - `heroTitle`
    - `heroSubtitle`
    - `heroImageUrl`
    - `primaryCtaText`
    - `primaryCtaUrl`
    - `highlights` (array of `{ title, description }`)

  - `AboutContent`
    - `tenantId`
    - `heading`
    - `description`
    - `showTeam`
    - `teamMembers` (array of `{ name, role, imageUrl }`)

  - `Service`
    - `tenantId`
    - `title`
    - `description`
    - `imageUrl`
    - `priceLabel`
    - `isActive`

  - `BlogPost`
    - `tenantId`
    - `title`
    - `slug`
    - `excerpt`
    - `body`
    - `coverImageUrl`
    - `publishedAt`
    - `isPublished`

  - `ContactContent`
    - `tenantId`
    - `address`
    - `phone`
    - `email`
    - `introText`

## 8. Frontend Behavior & UX (Phase 1)

### 8.1 Admin Portal

- Implement as a React + TypeScript SPA using Tailwind CSS and shadcn/ui.
- Use React Router for routing.
- React Query for data fetching, caching, and optimistic updates where applicable.
- Core screens:
  - Login page.
  - Dashboard (basic stats, shortcuts).
  - Clients list and detail.
  - Create/Edit client form.
  - (Optional Phase 1) Template list for reference.

### 8.2 User Portal

- Same SPA with role‑aware routes or a separate SPA, depending on project structure.
- Core screens:
  - Login page (shared).
  - Dashboard with enabled modules.
  - Per‑module management screens (Landing, About, Services, Blog, Contact).
  - Simple forms and tables using shadcn/ui components.
  - Image upload components that integrate with AWS upload endpoints.

### 8.3 Next.js Template Site (Public)

- Separate Next.js + TypeScript app.
- Fetch data from public APIs using the tenant’s API key (stored in env or configuration at deploy time).
- Implement minimal pages matching enabled modules:
  - `/` – Landing (pull from landing content endpoint).
  - `/about` – About page.
  - `/services` – Services page.
  - `/blog` and `/blog/[slug]` – Blog listing and details.
  - `/contact` – Contact page.
- Basic SEO meta tags and Open Graph can be added but are not mandatory for Phase 1.

## 9. Non‑Functional Requirements

- **Performance**: Typical admin/user operations should respond within 300–800 ms under normal load.
- **Security**:
  - Use HTTPS in deployment.
  - Never log plain passwords or full API keys.
  - Protect admin routes with strict role checks.
  - Sanitize and validate input at API layer.
- **Scalability**: Designed as stateless backend so it can scale horizontally later; single instance is acceptable for Phase 1.
- **Reliability**: All critical operations (user creation, email sending, content updates) must return clear success or error responses.
- **Logging & Monitoring**: Basic request logging and error logging (e.g., to console or simple log collector) for debugging.

## 10. Tech Stack & Integrations

- **Frontend (Admin/User Portal)**:
  - React + TypeScript.
  - React Query (TanStack Query) for data fetching.
  - Tailwind CSS for styling.
  - shadcn/ui for component library.

- **Backend**:
  - Node.js + Express + TypeScript.
  - Mongoose for MongoDB ORM.
  - JWT for authentication.

- **Public Websites**:
  - Next.js + TypeScript.
  - Tailwind CSS + shadcn/ui (optional) for styling.

- **Infrastructure & Services**:
  - MongoDB (Atlas or self‑hosted).
  - AWS S3 (or compatible) for image storage.
  - Brevo SMTP for email.
  - Environment‑based configuration for secrets.

## 11. Phase 1 Deliverables

- Running backend API with:
  - Auth (admin/user), role‑based middleware.
  - CRUD for clients and module content.
  - Public read‑only content APIs keyed by API key.
- Running admin/user portal with:
  - Login and role‑based dashboards.
  - Client management for admin.
  - Content management for enabled modules for users.
- At least one fully functional Next.js website template consuming content via public APIs.
- Image upload to AWS integrated in relevant forms.
- Email sending via Brevo for new user onboarding.

## 12. Implementation Plan & Milestones (High Level)

1. **Project Setup**
   - Initialize backend (Node/Express/TypeScript, Mongoose, auth boilerplate).
   - Initialize frontend portal (React/TS, Tailwind, shadcn, React Query setup).
   - Initialize Next.js template app.

2. **Auth & Roles**
   - Implement User model, auth endpoints, JWT, and role middleware.
   - Implement login flows on frontend and basic dashboards.

3. **Core Data Models & Admin Flows**
   - Implement Template, Tenant, and basic content models.
   - Implement admin APIs for templates (seeded) and clients.
   - Build admin UI for client listing and creation.

4. **User Content Management**
   - Implement module content models and CRUD APIs.
   - Build user UI for managing Landing, About, Services, Blog, and Contact.

5. **Public APIs & Next.js Integration**
   - Implement public read‑only APIs using API keys.
   - Connect Next.js template pages to these APIs and render content.

6. **Integrations & Polish**
   - Integrate AWS S3 for image uploads.
   - Integrate Brevo SMTP for account emails.
   - Basic error handling, loading states, and minimal UI polish.

This Phase 1 PRD focuses on establishing a solid multi‑tenant content foundation, clear role separation, and a production‑ready reference flow from admin onboarding to public site rendering, while leaving advanced CMS, billing, and analytics for later phases.
