# Antigravity Workspace Guidelines

This file provides rules, architectural overview, and command references for Antigravity AI agents working in this repository.

## 1. Project Overview

**Bookamore** is a full-stack book marketplace. The repository is organized as a monorepo containing:
- **Frontend**: React 19 + TypeScript (Vite) located in the `frontend/` directory.
- **Backend**: Java 17 + Spring Boot located in the `backend/` directory.
- **Infrastructure**: Orchestrated via Docker Compose with PostgreSQL and Nginx.

---

## 2. Coding and Design Rules

### Frontend (`frontend/`)
- **Technology Stack**: React 19, TypeScript, Vite, MUI, TailwindCSS, Redux Toolkit, and React Router v7.
- **Styling**: Prioritize MUI and TailwindCSS. Do not use inline styles unless absolutely necessary.
- **State Management**: Redux Toolkit for global/shared state.
- **Path Aliases**: Use Vite path aliases defined in config:
  - `@/` -> `src/`
  - `@app/`, `@pages/`, `@modules/`, `@shared/`, `@types/`, `@store/`, `@api/`
- **Structure**:
  - `app/` -> Router, Redux store, global styles.
  - `entities/` -> Domain models (e.g., `book/`, `user/`).
  - `modules/` -> Feature modules (e.g., `auth/`).
  - `pages/` -> Route-level page components.
  - `shared/` -> Reusable components, UI primitives, hooks, helpers, constants.

### Backend (`backend/`)
- **Technology Stack**: Java 17, Spring Boot, Spring Security (JWT + OAuth2), MapStruct, Liquibase, and PostgreSQL.
- **Layered Architecture**:
  - `com.bookamore.backend.controller` -> REST endpoints.
  - `com.bookamore.backend.service` -> Business logic interfaces & implementations.
  - `com.bookamore.backend.repository` -> Spring Data JPA repositories.
  - `com.bookamore.backend.entity` -> JPA domain models (User, Book, Offer, Image, BookGenre, BookAuthor, etc.).
  - `com.bookamore.backend.dto` -> DTOs for serialization.
  - `com.bookamore.backend.mapper` -> MapStruct entity-DTO mappers.
  - `com.bookamore.backend.config` -> Configurations (Security, DB, Uploads).
  - `com.bookamore.backend.exception` / `handler` -> Global exception handling.
- **Database Migrations**: Managed via Liquibase. Changesets are in `backend/src/main/resources/db/changelog/`. The master file is `master.yaml`. Do not modify existing changesets; always add new ones.

---

## 3. Reference Development Commands

When suggesting or executing commands, use these references:

### Frontend
- Start Vite dev server: `npm run dev` (runs on port 3000)
- Compile & Build: `npm run build`
- Lint: `npm run lint`
- Format: `npm run format`

### Backend
- Run backend locally: `./mvnw spring-boot:run` (requires running DB)
- Run tests: `./mvnw test`
- Build package: `./mvnw -DskipTests clean package`

### Docker Orchestration
- Local Development environment:
  ```bash
  docker-compose -f docker-compose-local.yaml up --build
  ```
- Detached local environment:
  ```bash
  docker-compose -f docker-compose-local.yaml up --build -d
  ```
- Tear down local environment with volumes:
  ```bash
  docker-compose -f docker-compose-local.yaml down -v
  ```

---

## 4. Git & Workflow Conventions

Agents making git commits or creating branches must adhere strictly to these conventions:

- **Branch Naming**: Must match task ID prefixes:
  - Frontend task: `TFF-XXX`
  - Backend task: `TFB-XXX`
  - Example: `git checkout -b TFF-102`
- **Commit Messages**: Must follow the pattern: `[TASK_ID] - [DESCRIPTION]`
  - Example: `git commit -m "[TFF-102] - add search bar filters"`
- **Pull Requests (PR)**: PR title must match the exact commit message.
  - Review rules: Frontend PRs are reviewed only by the frontend team; backend PRs are reviewed only by the backend team.
