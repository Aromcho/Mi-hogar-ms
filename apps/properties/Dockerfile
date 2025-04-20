FROM node:18-alpine AS builder

# Paso 1 (instalar dependencias)
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
RUN npm install

# Paso 2 (copiar código fuente del monorepo)
COPY apps/properties apps/properties
COPY libs libs

# Paso 3 (compilar el proyecto)
RUN npm run build properties

# Paso final (imagen de producción)
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/properties ./dist

EXPOSE 3003
CMD ["node", "dist/main.js"]
