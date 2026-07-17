# Stage 1: Build the Vite project
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Pass API URL to Vite build process
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the project
RUN npm run build

# Stage 2: Serve the built app using Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to handle Vue router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
