# Step 1 — Build React app
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# Step 2 — Serve using Nginx
FROM nginx:latest
COPY --from=build /app/build /usr/share/nginx/html
