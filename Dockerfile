# Start with the official Node.js image.
FROM node:20-alpine AS deps
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set the working directory.
WORKDIR /app

# Copy package.json and pnpm-lock.yaml before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the Next.js app
FROM node:20-alpine AS builder
RUN corepack enable

ENV NODE_ENV production

WORKDIR /app

# Copy all files
COPY . .

# Copy the previously installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Build the Next.js app
RUN pnpm run build

# Only copy over the Next.js pieces we need
FROM node:20-alpine AS runner
RUN corepack enable

ENV NODE_ENV production

WORKDIR /app

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
CMD ["pnpm", "start"]