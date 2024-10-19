# Use bun image
FROM oven/bun:1.1.12-slim

# Set working directory in the container
WORKDIR /app

# Install server dependencies
COPY bun.lockb package.json ./

RUN bun install --production

# Install frontend dependencies
COPY frontend/bun.lockb frontend/package.json ./frontend/

RUN cd frontend && bun install

# Copy the rest of the files
COPY . .

# Build the frontend
WORKDIR /app/frontend

RUN bun run build

# Remove all files in frontend except for the dist folder
RUN find . -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete

# Change working directory back to the root
WORKDIR /app

# Expose port 3000
EXPOSE 3000

# Run bun server
CMD [ "bun", "run", "start" ]
