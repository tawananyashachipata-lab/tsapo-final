# Tsapo Platform

A full-stack parcel-delivery MVP built with React, Vite, Node.js, Express, Prisma and SQLite. It intentionally does not use Supabase.

## Requirements
- Node.js 20+
- npm

## Setup
1. Extract the ZIP and open the project folder in a terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment file:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env`. Set a unique `JWT_SECRET` of at least 32 characters and change `ADMIN_PASSWORD`. To enable the AI-powered Tsapo Assistant, add your OpenAI API key as `OPENAI_API_KEY`. Keep this key private and only in the server `.env` file (never in frontend code).
5. Create the SQLite database and Prisma client:
   ```bash
   npx prisma generate
   npm run db:push
   npm run db:seed
   ```
6. Start frontend and backend:
   ```bash
   npm run dev
   ```
7. Open http://localhost:5173. API health check: http://localhost:4000/api/health.

## Admin access
The seed script creates an admin using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`. Defaults are `admin@tsapo.local` and `ChangeMe123!`; change these before using the app. The app does not expose a public admin registration route.

## Included functionality
- Responsive marketing website and parcel tracking page
- Customer registration and login
- Authenticated parcel booking and customer parcel list
- Public tracking lookup by tracking number
- Admin overview and user listing endpoints
- Admin-created agent/business/customer accounts
- Agent/admin parcel status updates and admin parcel assignment endpoint
- Parcel event history
- Floating AI-powered Tsapo Assistant for customer questions (requires an OpenAI API key)
- SQLite persistence through Prisma

## Roles
Supported roles: `CUSTOMER`, `AGENT`, `BUSINESS`, `ADMIN`. New public registrations are customers. Admins can create additional role accounts using `POST /api/admin/users`.

## API quick reference
- `POST /api/assistant/chat` (AI customer support; requires `OPENAI_API_KEY`)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/parcels`
- `GET /api/parcels`
- `GET /api/parcels/track/:code`
- `PATCH /api/parcels/:id/status` (admin/assigned agent)
- `PATCH /api/parcels/:id/assign` (admin)
- `GET /api/admin/overview` (admin)
- `GET /api/admin/users` (admin)
- `POST /api/admin/users` (admin)

Authenticated endpoints require `Authorization: Bearer <token>`.

## Important production work
This is a runnable MVP foundation, not a production logistics system. Before live customer use, add email/phone verification, password reset, rate limiting, audit logging, secure cookie or refresh-token strategy, input validation, file/photo upload controls, payment integration, notifications, service-area/pricing rules, backup/monitoring, and deployment secrets. The current parcel tracking page deliberately exposes only delivery route, status and event history, not phone numbers.

## Tsapo Assistant setup
The chat widget appears on every page. It uses the OpenAI Responses API from the Node.js backend, so the API key is not exposed to website visitors. Add `OPENAI_API_KEY` to `.env` locally and to your hosting provider’s server environment variables after deployment. If the key is missing, the widget displays a setup/support message rather than pretending the AI is connected. The assistant does not have access to private parcel records and will direct customers to the tracking page for live updates.
