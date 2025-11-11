# Create React App (react-scripts)
FROM node:20-alpine

WORKDIR /app

# Cài deps trước để tận dụng cache
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Chép source
COPY . .

ENV NODE_ENV=development
# Port mặc định của CRA là 3000; HOST đã đặt trong docker-compose.yml
EXPOSE 3000

CMD ["npm", "start"]



# # ---- build ----
# FROM node:20-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build

# # ---- runtime ----
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
