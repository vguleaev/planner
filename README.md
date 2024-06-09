# Planner

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Build in Docker

Docker build:

`docker build . -t planner-app`

Docker run:

`docker run --init -p 3000:3000 planner-app`

_(--init is needed to handle Ctrl +C SIGINT signals properly)_
