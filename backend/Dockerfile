# Use Node.js 20 Alpine official lightweight base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package definition files first for optimal layer caching
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy backend source code
COPY . .

# Expose backend API port
EXPOSE 5000

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Container healthcheck for orchestrator monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start backend server using existing production script
CMD ["npm", "start"]
