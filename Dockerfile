# ------------------------
# Stage 1: Builder
# ------------------------
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --frozen-lockfile

# Copy project files
COPY . .

# Build TypeScript
RUN npm run build


# ------------------------
# Stage 2: Production
# ------------------------
FROM node:22-alpine AS production

WORKDIR /app

# Copy only package.json and lock file
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev --ignore-scripts

# Copy build output & required files
COPY --from=builder /app/dist ./dist

# Expose app port (adjust if needed, default Express is 3000)
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start application
CMD ["node", "dist/server.js"]
