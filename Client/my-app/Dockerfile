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