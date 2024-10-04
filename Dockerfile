# Use an official Node.js runtime as a parent image
FROM oven/bun:alpine AS base

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the rest of the application code
COPY . .

# Install any needed dependencies
RUN cd web && bun install && bun run build 
RUN cd api && bun install


# Expose the port the app runs on (optional, adjust for your app)
EXPOSE 9002

# Start the app with Nodemon for auto-reloading
CMD ["bun", "run", "api/src/index.ts"]