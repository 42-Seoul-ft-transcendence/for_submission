FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src
COPY entrypoint.sh ./entrypoint.sh

RUN npx prisma generate
RUN npm run build          

RUN chmod +x ./entrypoint.sh

EXPOSE 8083

ENTRYPOINT ["./entrypoint.sh"]
