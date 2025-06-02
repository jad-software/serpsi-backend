FROM node:22.16-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci
COPY . .

RUN npm run build

EXPOSE 3000
CMD ["node", "--max-old-space-size=1024", "dist/main.js"]










