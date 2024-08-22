# Planner

To install dependencies server:

```bash
bun install
```

To install dependencies frontend:

```bash
cd frontend && bun install
```

This project was created using `bun init` in bun v1.1.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Run locally

You need to run both frontend and backend separately.

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
