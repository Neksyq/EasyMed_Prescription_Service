# Use Node.js LTS version
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose port
EXPOSE ${PRESCRIPTION_PORT}

# Start the application
CMD ["npm", "start"]