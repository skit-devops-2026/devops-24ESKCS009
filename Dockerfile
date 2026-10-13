# Use official Node.js 20 Alpine lightweight base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy root and backend package definition files for optimized layer caching
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies for backend and root
RUN cd backend && npm install --only=production
RUN npm install --only=production --ignore-scripts

# Copy complete project files (backend logic and frontend web assets)
COPY . .

# Expose backend service and web application port
EXPOSE 5000

# Set default production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Health check to ensure container availability
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the application using the project's actual start command defined in package.json
CMD ["npm", "start"]
