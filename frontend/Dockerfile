# Stage 1: Test & Prepare stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source files
COPY . .

# Run test suite during build stage to ensure quality
RUN npm test -- --passWithNoTests

# Stage 2: Production Nginx web server stage
FROM nginx:alpine

# Copy static web assets into Nginx web root directory
COPY --from=builder /app /usr/share/nginx/html

# Copy custom Nginx configuration with API proxy pass
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP web server port
EXPOSE 80

# Run Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
