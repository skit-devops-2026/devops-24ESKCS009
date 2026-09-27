# Use Node.js 20 Alpine official lightweight base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package definition files first for optimal layer caching
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy backend source code
COPY . .

# Expose backend API port
EXPOSE 5000

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start backend server using existing production script
CMD ["npm", "start"]
