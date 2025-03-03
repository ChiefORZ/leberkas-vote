FROM node:23-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set the working directory.
WORKDIR /app

# Start with the official Node.js image.
FROM base AS deps

# Copy package.json and pnpm-lock.yaml before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the Next.js app
FROM base AS builder

# Copy all files
COPY . .

# Copy the previously installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Build the Next.js app
RUN pnpm turbo build

# Only copy over the Next.js pieces we need
FROM base AS runner

COPY --from=builder /app/.next/ ./.next/
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/prisma/ ./prisma/
COPY --from=builder /app/public/ ./public/
COPY --from=builder /app/package.json ./package.json

# Expose the listening port
EXPOSE 3000
ENV PORT 3000

# Run pnpm start to launch the app
CMD ["pnpm", "run", "start"]