# Project Overview

A full-stack political campaign web application built with Express + React. The app allows users to view campaign proposals, sign up as supporters, and manage content through an admin panel.

## Architecture

- **Frontend**: React 18 with TypeScript, Vite, TailwindCSS, shadcn/ui components
- **Backend**: Express 5 (Node.js), served on port 5000 (same server serves both API and frontend via Vite middleware in dev)
- **Database**: PostgreSQL via Neon (serverless), accessed with Drizzle ORM
- **Auth**: Passport.js with local strategy, express-session
- **Build**: Vite for frontend bundling, esbuild for server bundling

## Key Directories

- `client/` - React frontend source
  - `src/pages/` - Page components (Home, Admin, auth-page, not-found)
  - `src/components/` - Shared components (Navbar, ProposalCard, MultiStepModal, etc.)
  - `src/hooks/` - Custom React hooks (use-auth, use-campaign, use-content, use-toast)
  - `src/lib/` - Utilities and query client setup
- `server/` - Express backend source
  - `index.ts` - Entry point, server setup
  - `routes.ts` - API route definitions
  - `auth.ts` - Passport authentication setup
  - `db.ts` - Database connection and Drizzle setup
  - `storage.ts` - Data access layer
  - `vite.ts` - Vite dev middleware integration
- `shared/` - Shared types and schema
  - `schema.ts` - Drizzle schema definitions (users, proposals, supporters, home_content)
  - `routes.ts` - Shared route constants
- `vite.config.ts` - Vite configuration (aliases: @, @shared, @assets)

## Dev Setup

- `npm run dev` - Starts the dev server (Express + Vite middleware) on port 5000
- `npm run build` - Builds frontend to `dist/public/` and server to `dist/index.cjs`
- `npm start` - Runs production build
- `npm run db:push` - Push Drizzle schema to database

## Database

Uses Neon PostgreSQL. Connection string is in `server/db.ts` and `drizzle.config.ts`. The app falls back to the hardcoded connection string if `DATABASE_URL` env var is not set. Tables: `users`, `proposals`, `supporters`, `home_content`.

## Deployment

- Target: autoscale
- Build command: `npm run build`
- Run command: `node dist/index.cjs`
