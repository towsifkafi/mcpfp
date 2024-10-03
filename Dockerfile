# Use an official Node.js runtime as a parent image
FROM oven/bun:1 AS base

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
#COPY package*.json ./


# Copy the rest of the application code
COPY . .

# Install any needed dependencies
RUN cd web && bun install && bun run build 
RUN cd api && bun install


# Expose the port the app runs on (optional, adjust for your app)
EXPOSE 9002

# Start the app with Nodemon for auto-reloading
CMD ["bun", "run", "api/src/index.ts"]