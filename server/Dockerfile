# ─────────────────────────────────────────────
# Stage 1: Builder
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies needed for tsc & prisma)
RUN npm ci

# Copy Prisma schema and generate the Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the source code
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript → JavaScript (output to /app/dist)
RUN npm run build


# ─────────────────────────────────────────────
# Stage 2: Production runner
# ─────────────────────────────────────────────
FROM node:22-alpine AS runner

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only production dependency manifests
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy compiled JS from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the generated Prisma client from the builder stage
COPY --from=builder /app/generated ./generated

# Copy Prisma schema (needed at runtime for migrations if any)
COPY --from=builder /app/prisma ./prisma

# Switch to non-root user
USER appuser

# Cloud Run injects PORT; fall back to 8080 locally
ENV PORT=8080
EXPOSE 8080

# Health-check — Cloud Run uses HTTP health probes
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:${PORT}/health || exit 1

# Start the compiled server
CMD ["node", "dist/index.js"]
