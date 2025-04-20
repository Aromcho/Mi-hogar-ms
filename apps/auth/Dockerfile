FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
RUN npm install

COPY apps/auth apps/auth
COPY libs libs

RUN npm run build auth

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/auth ./dist

EXPOSE 3002
CMD ["node", "dist/main.js"]
