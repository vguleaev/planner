<img src="frontend/public/app-logo.svg" alt="Logo" width="100" height="100">

# Planner

**Planner** - Plan your daily, weekly and monthly tasks with ease.

https://planner.vguleaev.dev/

## TechStack:

- React
- Vite
- shadcn
- Tailwind
- Typescript
- Hono
- Bun
- Drizzle
- Kinde auth
- Tanstack Router
- Tanstack Forms
- Tanstack Query
- Zustand
- lucide-icons

Self hosted on VM

Infrastructure done with Ansible

## Run

This repo contains both backend server and frontend. Locally for development you start them separably, when deployed on production in one docker container where server simply serves complied React application in one html file.

To install dependencies server:

```bash
bun install
```

To install dependencies frontend:

```bash
cd frontend && bun install
```

To start app you need to run both frontend and backend separately.

Run backend:
`bun run dev`

Run frontend:
`cd frontend && bun run dev`

Open http://localhost:5173/

## Build in Docker

Docker build:

```bash
docker build . -t planner-app
```

Docker run:

```bash
docker run --init -p 3000:3000 planner-app
```

_(--init is needed to handle Ctrl +C SIGINT signals properly)_

# Drizzle ORM

Migrations:

Whenever you apply changes to the schema you just rerun `drizzle-kit generate` and it will generate SQL migration for you completely automatically in most of the cases.

Run migration generation from schema:
`bunx drizzle-kit generate`

Run migrations:
`bunx drizzle-kit migrate`

Launch drizzle studio:
`bunx drizzle-kit studio`
