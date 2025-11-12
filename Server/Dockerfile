# # Node.js + Express (có bcrypt)
# FROM node:20-alpine

# # Toolchain để build native modules (bcrypt)
# RUN apk add --no-cache python3 make g++

# WORKDIR /app

# # Cài deps trước để tận dụng cache
# COPY package*.json ./
# RUN npm ci --legacy-peer-deps

# # Chép source
# COPY . .

# ENV NODE_ENV=development
# ENV PORT=4000

# EXPOSE 4000
# CMD ["npm", "start"]

# Node.js + Express (có bcrypt)
FROM node:20-alpine

# Toolchain để build native modules (bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Cài deps trước để tận dụng cache
COPY package*.json ./

# ⚠️ Đổi duy nhất: 'npm ci' -> 'npm install'
# Thêm các cờ để tránh audit/fund và nới peer deps cho chắc
RUN npm install --no-audit --no-fund --legacy-peer-deps

# Chép source
COPY . .

# (tuỳ nhu cầu) nếu chạy runtime, nên cân nhắc dùng NODE_ENV=production
ENV NODE_ENV=development
ENV PORT=4000

EXPOSE 4000
CMD ["npm", "start"]
