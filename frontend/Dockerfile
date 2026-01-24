# ---------------------------------------------------
# Stage 1: Build the React App
# ---------------------------------------------------
FROM node:20-alpine as build

WORKDIR /app

# Install dependencies first (for caching)
COPY package*.json ./
RUN npm install

# Copy source code and .env file
# Note: Vite needs the .env file AT BUILD TIME to bake in the API URL
COPY . .

# Build the app (creates /app/dist)
RUN npm run build

# ---------------------------------------------------
# Stage 2: Serve with Nginx
# ---------------------------------------------------
FROM nginx:alpine

# Copy the custom Nginx config we created
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React files from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Open port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]