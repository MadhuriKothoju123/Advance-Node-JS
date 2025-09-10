# Use official Node.js LTS image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app source code
COPY . .

# Build TypeScript (optional if you precompile)
RUN npm run build

# Expose the service port
# EXPOSE 5002
# Start the application
# CMD ["npm", "run", "start"]

CMD ["node", "dist/index.js"]

