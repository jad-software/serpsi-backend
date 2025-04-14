# Etapa 1 - Build
FROM node:22.14-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2 - Runtime
FROM node:22.14-slim

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./

CMD ["node", "dist/main.js"]
