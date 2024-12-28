# Development Dockerfile
FROM node:18

WORKDIR /app

# Copy only package files to leverage Docker's cache
COPY package*.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force && npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Command to run the application in development mode
CMD ["npm", "run", "start:dev"]
