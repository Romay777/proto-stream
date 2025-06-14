# Stage 1: Build Angular app
FROM node:20-alpine AS build

# Set working directory
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

# Install dependencies
# RUN #npm install ngx-cookie-service --save
RUN npm install

# Copy other files and folders to the working directory
COPY . .

# Build the Angular application in production mode
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Build argument for environment
ARG NGINX_CONF=nginx.conf

COPY ./ssl /etc/nginx/ssl/

# Copy the appropriate Nginx config file
COPY ${NGINX_CONF} /etc/nginx/conf.d/default.conf

# Copy the built Angular app files to the Nginx HTML folder
COPY --from=build /usr/src/app/dist/frontend/browser /usr/share/nginx/html
COPY --from=build /usr/src/app/девфлов.рф /etc/nginx/sites-available/девфлов.рф

# Expose port 80
EXPOSE 80 443

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
