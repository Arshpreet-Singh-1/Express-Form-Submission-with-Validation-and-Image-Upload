# Use the official Node.js image from the Docker Hub
FROM node

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json to the container at /app
# This helps in utilizing Docker's caching mechanism
COPY package.json /app

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the current directory contents into the container at /app
COPY . /app

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run server.js when the container launches
CMD ["node", "server.js"]
