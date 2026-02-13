# Use official Node.js LTS image
FROM node:24-alpine3.22

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (including dev for building)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies after build
#RUN npm prune --omit=dev

# Expose port
EXPOSE 4000

# Set environment to production
ENV NODE_ENV=production

# Start the app
CMD ["node", "dist/index.js"]