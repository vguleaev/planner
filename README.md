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
