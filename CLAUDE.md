# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bookamore is a full-stack book marketplace. The repo is a monorepo with a **React 19 + TypeScript** frontend (Vite) and a **Java 17 + Spring Boot** backend, orchestrated via Docker Compose with PostgreSQL and Nginx.

## Development Commands

### Frontend (`frontend/`)

```bash
npm run dev        # Start Vite dev server (port 3000)
npm run build      # TypeScript compile + Vite build
npm run lint       # ESLint check
npm run format     # Prettier format
```

### Backend (`backend/`)

```bash
./mvnw spring-boot:run            # Run locally (requires DB)
./mvnw test                       # Run unit tests
./mvnw -DskipTests clean package  # Build JAR, skip tests
```

### Docker (local development)

```bash
docker-compose -f docker-compose-local.yaml up --build   # Full stack local
docker-compose -f docker-compose.dev.yml up --build -d   # Dev env
docker-compose -f docker-compose.yaml --env-file .env up -d --build  # Prod
```

Local `.env` files must be created from `.env.example`. Backend also needs `backend/src/main/resources/.env`.

Liquibase migrations run automatically on Spring Boot startup.

## Architecture

### Backend — Layered Spring Boot

Package root: `com.bookamore.backend`

```
controller/   → REST endpoints (Auth, User, Book, Offer, Image)
service/      → Business logic (interfaces + impls)
repository/   → Spring Data JPA repositories
entity/       → JPA domain models (User, Book, Offer, Image, BookGenre, BookAuthor, …)
dto/          → API serialization objects
mapper/       → MapStruct entity↔DTO mappings
config/       → Spring Security (JWT + OAuth2), DB, file uploads
jwt/          → JWT utilities
exception/ + handler/ → Global error handling
```

Profiles: `local` (default local), `dev` (Docker dev), production uses env vars directly. Active profile is set via `SPRING_PROFILES_ACTIVE` env var.

### Frontend — Feature-Based React

Vite path aliases: `@` → `src/`, plus `@app`, `@pages`, `@modules`, `@shared`, `@types`, `@store`, `@api`.

```
app/       → Root setup: router, Redux store, global styles
entities/  → Domain models (book/, user/)
modules/   → Feature modules (auth/)
pages/     → 14 route-level page components
shared/    → Reusable components, UI primitives, hooks, helpers, constants
```

State: Redux Toolkit. Routing: React Router v7. UI: MUI + TailwindCSS + Emotion. i18n: i18next with `en` and `ua` locales in `public/locales/`.

### Nginx Routing (local/Docker)

All traffic enters through Nginx:
- `/api/v1/*` → backend:8080
- `/swagger-ui/*`, `/v3/api-docs` → backend:8080
- `/login/oauth2/*` → backend:8080 (OAuth2 callbacks)
- `/img/*` → uploads volume (1h cache)
- `/*` → frontend:3000 (SPA)

### Database & Migrations

PostgreSQL 16. Schema managed by Liquibase; changesets live in `backend/src/main/resources/db/changelog/`. The master file is `master.yaml`.

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) auto-deploys on push:
- `main` → production on **GCP e2-micro** (`www.bookamore.store`; the apex 301-redirects to
  it), via `docker-compose.gcp.yaml`.
  Images are built in CI and pushed to GHCR; the 1 GB VM only pulls them. Traffic enters
  through a Cloudflare Tunnel — no host ports are published. See `deploy/gcp/README.md`.
- `dev` → dev environment on the original VPS (`bookamore-dev.alt-web.biz.ua`), via
  `docker-compose.dev.yml`, still built on the server.

The `alt-web.biz.ua` zone stays with its old registrar and is not moved to Cloudflare — it
carries mail (MX/SPF/DKIM) and unrelated sites. `bookamore.alt-web.biz.ua` therefore still
points at the old VPS; only `bookamore.store` goes through the tunnel to GCP.

That old prod is deliberately left running as a standby, but **no job deploys it** — `main`
goes to GCP only, `dev` to `/home/deploy/www/dev`. It runs pre-migration code against its
own database, so treat it as a frozen copy, not a second live environment. See section 11
of `deploy/gcp/README.md` before touching it.

Each environment has its own `.env` file on its host.

## Git Conventions

Branch names must follow: `TFF-XXX` (frontend tasks) or `TFB-XXX` (backend tasks).

Commit format: `[TASK_ID] - [DESCRIPTION]` — e.g., `[TFB-42] - add offer pagination`.

PR title must match the squash commit message. Frontend PRs reviewed by frontend team, backend PRs by backend team.
