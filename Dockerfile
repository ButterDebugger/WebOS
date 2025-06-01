# Use a base image with Bun installed
FROM oven/bun:1.2.13

# Set the working directory
WORKDIR /app

# Copy the project files into the working directory
COPY . .

# Install projects dependencies
RUN bun install

# Run the Bun app using the start task
CMD ["bun", "start"]