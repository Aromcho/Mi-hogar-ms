FROM node:18-alpine AS builder

# Paso 1 (instalar dependencias)
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
RUN npm install

# Paso 2 (copiar código fuente del monorepo)
COPY apps/users apps/users
COPY libs libs

# Paso 3 (compilar el proyecto)
RUN npm run build users

# Paso final (imagen de producción)
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/users ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]