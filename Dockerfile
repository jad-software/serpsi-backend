FROM node:22.14-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci
COPY . .


RUN useradd -m appuser
RUN chown -R appuser:appuser /app
USER appuser

RUN npm run build

ENV TEST_INTEGRATION=false
EXPOSE 3000
CMD ["npm", "start"]
