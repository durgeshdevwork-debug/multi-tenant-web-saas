# Phase 1 PRD – Multi‑Tenant Website Content Management Portal

## 1. Overview

This document defines the Phase 1 Product Requirements for a multi‑tenant website content management portal that allows an admin to onboard client accounts, configure website templates and modules, and provide each client with a dedicated portal to manage their own site content (blogs, services, pages, etc.). The platform will expose read‑only APIs secured with per‑tenant API keys so separate Next.js website templates can render content for multiple clients from a shared backend. The implementation will use the MERN stack with TypeScript across frontend and backend, Tailwind CSS and shadcn/ui for styling, Mongoose as the ORM, React Query for client data fetching, AWS for image storage, and Brevo SMTP for transactional emails.

## 2. Goals and Non‑Goals (Phase 1)

### 2.1 Primary Goals

- Provide a working foundation of the portal with authentication(use better-auth authentication framework or package), role‑based access (Admin, User), and a basic dashboard for both roles.
- Enable the admin to create and manage client accounts, assign templates, and auto‑generate per‑tenant API keys.
- Enable each user (client) to log in and manage their own site data according to the selected template and modules.
- Expose secure, documented REST APIs to fetch website content by API key for consumption by separate Next.js website templates.
- Set up image handling with AWS (e.g., S3) for uploads from the portal and public delivery to website templates.
- Integrate Brevo SMTP for sending account creation and credential emails to users.

## 3. Personas and Roles

### 3.1 Admin (Platform Owner)

- Owns the platform and has full access to all tenants (client websites) and their data.
- Creates and manages templates
- Creates and manages client accounts (users) and associates them with templates.
- Generates and rotates API keys per client.
- Can impersonate or view a client’s site data for debugging/support.

### 3.2 User (Client)

- Receives credentials from the admin via email after account creation.
- Logs into the portal and sees only their own site data and configuration.
- Manages content for the pages , having category , subcategory , header configuration, footer configuration
- Can upload images for their content (stored on AWS).
- Cannot see or manage other clients’ data, templates, or platform‑level settings.

## 4. High‑Level Architecture (Phase 1)

### 4.1 Components

- **Backend API (Node.js/Express + TypeScript)**
  - REST API layer for admin and user operations.
  - Authentication(better-auth), authorization, and multi‑tenant data isolation.
  - Mongoose models for Users, Templates, pages, and Content entities.
  - Integration with AWS SDK for image upload.
  - Integration with Brevo SMTP for transactional emails.

- **Admin & User Portal (React + TypeScript)**
  - Single SPA with role‑based routing and UI.
  - React Query for data fetching and caching from the backend APIs.
  - Tailwind CSS + shadcn/ui for UI components and theming.

- **Website Templates (Next.js + TypeScript)**
  - Separate Next.js apps that render public‑facing websites.
  - Consume read‑only REST APIs using the tenant’s API key.
  - In Phase 1, at least one production‑ready template (e.g., a basic business site with page data.

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
3. Fills in required information: client name, primary domain, business details, contact email.
4. Selects a template (e.g., Business Basic) from available templates.
5. Submits the form.
6. Backend creates:
   - Tenant/Website record.
   - User record (role = User) linked to the tenant.
   - Generated secure API key for the tenant.
   - Default content documents for each enabled module using template schema defaults.
7. Backend sends an email via Brevo to the client with login URL, email, and temporary password (or magic‑link in later phases).
8. Admin can see the new client appear in the client list with status "Pending first login".

### 5.2 User – First Login and Content Management

1. User clicks the link in the email and opens the portal.
2. Logs in using the credentials provided.
3. On first login, user is forced to change the password (optinal).
4. User lands on a simple dashboard showing their site name, and pages.
5. User navigates to a specific pages (e.g., Services):
   - Sees a list/table of existing pages or a simple form , having each page have hero section and seo metadata feilds, then rich text editor for page design.
6. User edits pages (e.g., service title, description, price, images) and saves changes.
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
   - Regenerate API key (with confirmation and warning).
   - View a read‑only preview of the client’s content per module (Phase 1 may implement minimal read‑only view).

## 6. Functional Requirements (Phase 1)

### 6.1 Admin Features

#### 6.1.1 Admin Login & Dashboard

- Admin can log in via a same login with role‑based redirect.
- Admin dashboard shows key stats:
  - Number of clients.
  - Number of active/inactive sites.
  - Quick links to "Create Client", "Templates", and "Clients list".

#### 6.2.2 Client Management

- Admin can:
  - Create new client with required details and assign a template and pages.
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
  - Site name and pages lists.
  - Enabled modules as navigation items/cards.

### 6.3 API Key and Public Content APIs

#### 6.4.1 API Key Management

- Each tenant has a unique API key stored securely (hashed or at least partially masked in UI).
- Admin can view truncated key and regenerate with confirmation.
- Rotating the key invalidates previous key for future requests.

#### 6.3.2 Public Content APIs (Read‑Only)

Endpoints (base path example: `/api/public`):

- `GET /api/public/:apiKey/site` – returns high‑level site info and enabled modules.
- `GET /api/public/:apiKey/landing` – returns landing page content.
- `GET /api/public/:apiKey?pageSlug` – returns about page content.
- `GET /api/public/:apiKey?pageSlug` – returns list of services.
- `GET /api/public/:apiKey?pageSlug` – returns list of published blog posts.
- `GET /api/public/:apiKey?pageSlug` – returns one blog post by slug.
- `GET /api/public/:apiKey?pageSlug` – returns contact page data.

Behavior:

- API key is passed as a path param or header (for Phase 1, path param is acceptable; later can move to headers).
- All responses are scoped to the tenant associated with the API key.
- Rate limiting can be minimal to start and improved later.
