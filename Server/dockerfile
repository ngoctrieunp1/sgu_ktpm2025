# Node.js + Express (có bcrypt)
FROM node:20-alpine

# Toolchain để build native modules (bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Cài deps trước để tận dụng cache
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Chép source
COPY . .

ENV NODE_ENV=development
ENV PORT=4000

EXPOSE 4000
CMD ["npm", "start"]
