FROM node:22.14-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci
COPY . .
RUN npm run build

RUN useradd -m appuser
USER appuser

ENV TEST_INTEGRATION=false
EXPOSE 3000
CMD ["npm", "start"]
