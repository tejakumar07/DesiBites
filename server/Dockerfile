# ─────────────────────────────────────────────
# Stage 1: Builder — install deps & generate Prisma
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies needed for prisma)
RUN npm ci

# Copy Prisma schema and config, then generate the Prisma client
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate


# ─────────────────────────────────────────────
# Stage 2: Production runner
# ─────────────────────────────────────────────
FROM node:22-alpine AS runner

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install production dependencies + tsx for running TypeScript directly
RUN npm ci --omit=dev && npm install tsx

# Copy source code (no build step needed — tsx runs .ts directly)
COPY src ./src

# Copy the generated Prisma client from the builder stage
COPY --from=builder /app/generated ./generated

# Copy Prisma schema (needed at runtime)
COPY --from=builder /app/prisma ./prisma

# Switch to non-root user
USER appuser

# Cloud Run injects PORT; fall back to 8080 locally
ENV PORT=8080
EXPOSE 8080

# Health-check — Cloud Run uses HTTP health probes
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:${PORT}/health || exit 1

# Start the server using tsx (handles ESM + TypeScript natively)
CMD ["npx", "tsx", "src/index.ts"]
